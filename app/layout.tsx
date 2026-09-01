import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import "./globals.css";
import { Anton, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SiteNav } from "@/components/nav/SiteNav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

/* Anton = ultra-condensed display (matches inspiration letterforms).
   Barlow Condensed = nav / UI. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
  variable: "--font-display"
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-ui"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ultimate Studios",
    template: "%s | Ultimate Studios"
  },
  description:
    "Ultimate Studios — films, worlds, and audiences. Creative production from concept to cut."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlowCondensed.variable}`}>
      <body className={barlowCondensed.className}>
        <SiteNav />
        {children}
        <GoogleAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
