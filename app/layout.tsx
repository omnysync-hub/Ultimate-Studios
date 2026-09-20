import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Anton, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ConsentDefaults } from "@/components/consent/ConsentDefaults";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { SiteLegalFooter } from "@/components/legal/SiteLegalFooter";
import { SiteNav } from "@/components/nav/SiteNav";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { getSite, getSiteUrl } from "@/lib/cms/store";

const siteUrl = getSiteUrl();

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e10600" },
    { media: "(prefers-color-scheme: dark)", color: "#e10600" }
  ],
  colorScheme: "dark light"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ultimate Cineverse",
    template: "%s | Ultimate Cineverse"
  },
  description:
    "Ultimate Cineverse — films, worlds, and audiences. Creative production from concept to cut.",
  applicationName: "Ultimate Cineverse",
  appleWebApp: {
    capable: true,
    title: "Ultimate Cineverse",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#e10600",
    "msapplication-TileImage": "/android-chrome-192x192.png"
  },
  openGraph: {
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Ultimate Cineverse" }]
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();

  return (
    <html lang="en" className={`${anton.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <ConsentDefaults />
      </head>
      <body className={barlowCondensed.className}>
        <SiteNav />
        {children}
        <SiteLegalFooter email={site.contact.email} />
        <CookieConsent />
        <GoogleAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
