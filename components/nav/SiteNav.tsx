"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  THEME_CHANGED_EVENT,
  getActiveTheme,
  type Theme
} from "@/lib/theme";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/#work", label: "Latest" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const menuId = useId();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const menuSearchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sync = () => setTheme(getActiveTheme());
    sync();
    window.addEventListener(THEME_CHANGED_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (formRef.current && target && !formRef.current.contains(target)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("touchstart", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("touchstart", onPointer);
    };
  }, [searchOpen]);

  if (pathname?.startsWith("/studio")) return null;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!searchOpen && !menuOpen && window.matchMedia("(max-width: 900px)").matches) {
      setSearchOpen(true);
      return;
    }
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(q ? `/blog?q=${encodeURIComponent(q)}` : "/blog");
  };

  const logoSrc = theme === "light" ? "/logo-light.png" : "/logo.png";

  const menu =
    mounted &&
    createPortal(
      <div
        id={menuId}
        className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Site menu"
      >
        <div className={styles.menuCurtain} aria-hidden="true">
          <span className={styles.menuPanel} />
          <span className={styles.menuPanel} />
          <span className={styles.menuPanel} />
        </div>

        <div className={styles.menuInner}>
          <p className={styles.menuEyebrow}>
            <span className={styles.menuEyebrowDot} />
            Menu
          </p>

          <ul className={styles.menuList}>
            {links.map((link, i) => (
              <li
                key={link.href}
                className={styles.menuItem}
                style={{ ["--i" as string]: i }}
              >
                <Link
                  href={link.href}
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className={styles.menuIndex}>0{i + 1}</span>
                  <span className={styles.menuLabelWrap}>
                    <span className={styles.menuLabel}>{link.label}</span>
                  </span>
                  <span className={styles.menuArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <form className={styles.menuSearch} role="search" onSubmit={onSearch}>
            <input
              ref={menuSearchRef}
              className={styles.menuSearchInput}
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news…"
              autoComplete="off"
              tabIndex={menuOpen ? 0 : -1}
            />
            <button
              type="submit"
              className={styles.menuSearchBtn}
              tabIndex={menuOpen ? 0 : -1}
            >
              Search
            </button>
          </form>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <header className={`${styles.topNav} ${menuOpen ? styles.topNavMenuOpen : ""}`}>
        <Link className={styles.brand} href="/" aria-label="Ultimate Cineverse Home">
          <Image
            src={logoSrc}
            alt=""
            width={40}
            height={40}
            className={styles.brandLogo}
            priority
          />
          <span className={styles.brandName}>Ultimate Cineverse</span>
        </Link>

        <nav className={styles.navWrap} aria-label="Main navigation">
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  <span className={styles.navLabel}>{link.label}</span>
                  <span className={styles.navLine} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <form
            ref={formRef}
            className={`${styles.searchForm} ${searchOpen ? styles.searchFormOpen : ""}`}
            role="search"
            onSubmit={onSearch}
          >
            <label className={styles.srOnly} htmlFor="site-nav-search">
              Search entertainment news
            </label>
            <input
              ref={inputRef}
              id="site-nav-search"
              className={styles.searchInput}
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news…"
              autoComplete="off"
            />
            <button type="submit" className={styles.searchSubmit} aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M16.5 16.5 L21 21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
          <ThemeToggle />

          <button
            type="button"
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.burgerLines} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </nav>
      </header>
      {menu}
    </>
  );
}
