import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Anton, Barlow_Condensed } from "next/font/google";
import { ConsentDefaults } from "@/components/consent/ConsentDefaults";
import { SiteChrome } from "@/components/shell/SiteChrome";
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
    default: "Ultimate Cineverse — Entertainment News, Film Reviews & Streaming Guides",
    template: "%s | Ultimate Cineverse"
  },
  description:
    "Ultimate Cineverse — entertainment news, film reviews, streaming guides and the stories shaping film, TV and digital media. Creative production from concept to cut.",
  keywords: [
    "entertainment news",
    "film reviews",
    "streaming guides",
    "what to watch",
    "movie guides",
    "Ultimate Cineverse"
  ],
  authors: [{ name: "Ultimate Cineverse", url: siteUrl }],
  creator: "Ultimate Cineverse",
  publisher: "Ultimate Cineverse",
  category: "Entertainment",
  // Search-engine verification — set the env vars in production (see .env.example).
  // Values are never hardcoded; unset vars simply omit the tag.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {})
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`
    }
  },
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
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ultimate Cineverse",
    title: "Ultimate Cineverse — Entertainment News, Film Reviews & Streaming Guides",
    description:
      "Entertainment news, film reviews, streaming guides and the stories shaping film, TV and digital media.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Ultimate Cineverse" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Cineverse — Entertainment News, Film Reviews & Streaming Guides",
    description:
      "Entertainment news, film reviews, streaming guides and the stories shaping film, TV and digital media.",
    images: ["/logo.png"]
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
        <SiteChrome
          email={site.contact.email}
          speedInsights={process.env.VERCEL ? <SpeedInsights /> : null}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
