import { promises as fs } from "fs";
import path from "path";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type SiteContent = {
  brandName: string;
  tagline: string;
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImagePath: string;
  };
  contact: {
    phone: string;
    email: string;
    addressLines: string[];
  };
  socials: SocialLink[];
  footerReelSrc: string;
  about: {
    title: string;
    paragraphs: string[];
  };
  youtubeChannelId: string;
};

const sitePath = path.join(process.cwd(), "content", "site.json");

export async function getSite(): Promise<SiteContent> {
  const raw = await fs.readFile(sitePath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

/** Canonical origin. Empty env vars must not reach `new URL("")` (Vercel often sets blank). */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }

  return "https://example.com";
}
