"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { openCookiePreferences } from "@/lib/consent";
import { THEME_CHANGED_EVENT, getActiveTheme, type Theme } from "@/lib/theme";
import styles from "./SiteLegalFooter.module.css";

type Props = {
  email: string;
};

export function SiteLegalFooter({ email }: Props) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => setTheme(getActiveTheme());
    sync();
    window.addEventListener(THEME_CHANGED_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGED_EVENT, sync);
  }, []);

  // Homepage already ends with StudioFooter legal links — avoid a second crowded strip.
  if (pathname?.startsWith("/studio") || pathname === "/") return null;

  const logoSrc = theme === "light" ? "/logo-light.png" : "/logo.png";

  return (
    <div className={styles.bar} role="contentinfo" aria-label="Legal links">
      <div className={styles.inner}>
        <Link href="/" className={styles.brandLink} aria-label="Ultimate Cineverse Home">
          <Image
            src={logoSrc}
            alt=""
            width={28}
            height={28}
            className={styles.brandLogo}
          />
          <span className={styles.brand}>Ultimate Cineverse</span>
        </Link>
        <nav className={styles.nav} aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terms">Terms</Link>
          <button type="button" className={styles.button} onClick={() => openCookiePreferences()}>
            Manage cookies
          </button>
          <Link href="/contact">Contact</Link>
          <a href={`mailto:${email}`}>{email}</a>
        </nav>
      </div>
    </div>
  );
}
