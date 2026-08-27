import Link from "next/link";
import styles from "./SiteNav.module.css";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
] as const;

export function SiteNav() {
  return (
    <header className={styles.topNav}>
      <Link className={styles.brand} href="/" aria-label="Ultimate Studios Home">
        <span className={styles.brandMark} aria-hidden="true">
          U
        </span>
      </Link>
      <nav aria-label="Main navigation">
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
      </nav>
    </header>
  );
}
