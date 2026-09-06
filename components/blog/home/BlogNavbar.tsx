"use client";

import { useState } from "react";
import Link from "next/link";
import { PrimaryButton } from "@/components/blog/shared/PrimaryButton";

const NAV_LINKS = [
  { label: "NEW BLOGS", href: "/blog#trending" },
  { label: "UPCOMING BLOGS", href: "/blog#trending" },
  { label: "POPULAR BLOGS", href: "/blog#trending" },
  { label: "CATEGORIES", href: "/blog#categories" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" }
];

export function BlogNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[80px] w-full border-b border-border-subtle bg-surface px-5 sm:px-10 lg:px-16">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
        {/* Left: Brand Logo & Wordmark */}
        <Link href="/blog" className="flex items-center gap-3 group">
          {/* Logo Mark: "UC" with brand red split-diagonal */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-surface-2 border border-brand-red shadow-[0_0_12px_rgba(214,48,63,0.4)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/40 via-transparent to-brand-red/20 pointer-events-none" />
            <span className="font-display text-lg font-black tracking-tighter text-text-primary">
              <span className="text-brand-red">U</span>C
            </span>
          </div>
          <span className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-text-primary group-hover:text-brand-red transition-colors">
            ULTIMATE CINEVERSE
          </span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wider text-text-primary hover:text-brand-red transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Subscribe Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <PrimaryButton
            variant="global"
            className="!px-7 !py-3 !text-sm !font-bold uppercase shadow-brand-red"
            onClick={() => alert("Thank you for subscribing to Ultimate Cineverse!")}
          >
            SUBSCRIBE
          </PrimaryButton>

          {/* Mobile Hamburger Toggle (< 640px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden flex-col items-center justify-center gap-1.5 p-2 text-text-primary hover:text-brand-red"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`h-0.5 w-6 bg-current transition-transform duration-200 ${
                mobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-current transition-opacity duration-200 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-current transition-transform duration-200 ${
                mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (< 640px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-0 top-[80px] w-full border-b border-border-subtle bg-surface-2 p-6 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold uppercase tracking-wider text-text-primary hover:text-brand-red transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
