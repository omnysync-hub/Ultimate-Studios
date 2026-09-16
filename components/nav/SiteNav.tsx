"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
] as const;

export function SiteNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <header className={styles.topNav}>
      <Link className={styles.brand} href="/" aria-label="Ultimate Cineverse Home">
        <Image
          src="/logo.png"
          alt="Ultimate Cineverse"
          width={40}
          height={40}
          className={styles.brandLogo}
          priority
        />
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
        <ThemeToggle />
      </nav>
    </header>
  );
}
