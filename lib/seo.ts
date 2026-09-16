import type { Metadata } from "next";
import { getSite, getSiteUrl } from "@/lib/cms/store";

type SeoArgs = {
  title: string;
  description: string;
  pathname?: string;
  canonicalQuery?: string;
  openGraphImageUrl?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export function getSiteUrlSync() {
  return getSiteUrl();
}

export async function buildMetadata(args: SeoArgs): Promise<Metadata> {
  const site = await getSite().catch(() => null);
  const siteUrl = getSiteUrl();
  const base = new URL(siteUrl);
  const canonical = args.pathname
    ? new URL(args.pathname + (args.canonicalQuery ?? ""), base)
    : base;

  const ogImage =
    args.openGraphImageUrl ||
    (site?.seo.ogImagePath ? new URL(site.seo.ogImagePath, base).toString() : undefined);

  const metadata: Metadata = {
    title: args.title,
    description: args.description,
    alternates: {
      canonical: canonical.toString()
    },
    openGraph: {
      title: args.title,
      description: args.description,
      url: canonical.toString(),
      siteName: site?.brandName ?? "Ultimate Cineverse",
      type: args.type ?? "website",
      locale: "en_US",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: args.title }] : undefined,
      ...(args.type === "article"
        ? {
            publishedTime: args.publishedTime,
            modifiedTime: args.modifiedTime
          }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: ogImage ? [ogImage] : undefined
    },
    robots: args.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true }
  };

  return metadata;
}
