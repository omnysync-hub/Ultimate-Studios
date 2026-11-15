import type { Metadata } from "next";
import { getSite, getSiteUrl } from "@/lib/cms/store";

type SeoArgs = {
  title: string;
  description: string;
  pathname?: string;
  canonicalQuery?: string;
  openGraphImageUrl?: string;
  /** Pixel size of the OG image when it is not the standard 1200×630. */
  openGraphImageSize?: { width: number; height: number };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Article author display name (articles only). */
  authorName?: string;
  /** Article section / primary tag (articles only). */
  section?: string;
  /** Keywords / article tags. Emitted as meta keywords + article tags. */
  keywords?: string[];
  noIndex?: boolean;
};

export function getSiteUrlSync() {
  return getSiteUrl();
}

/**
 * Shared metadata builder for every route.
 *
 * Emits: canonical, full Open Graph (incl. article times/authors/tags),
 * Twitter large card, keyword meta, and rich-crawl robots directives
 * (max-image-preview:large + unlimited snippet) so Google Discover and
 * AI search surfaces can use full previews of our pages.
 */
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
  const ogSize = args.openGraphImageSize ?? { width: 1200, height: 630 };
  const brand = site?.brandName ?? "Ultimate Cineverse";

  const metadata: Metadata = {
    title: args.title,
    description: args.description,
    ...(args.keywords?.length ? { keywords: args.keywords } : {}),
    ...(args.authorName ? { authors: [{ name: args.authorName }] } : {}),
    creator: brand,
    publisher: brand,
    category: args.type === "article" ? "Entertainment" : undefined,
    alternates: {
      canonical: canonical.toString(),
      types: { "application/rss+xml": `${siteUrl}/feed.xml` }
    },
    openGraph: {
      title: args.title,
      description: args.description,
      url: canonical.toString(),
      siteName: brand,
      type: args.type ?? "website",
      locale: "en_US",
      images: ogImage
        ? [{ url: ogImage, width: ogSize.width, height: ogSize.height, alt: args.title, type: ogImage.endsWith(".webp") ? "image/webp" : ogImage.endsWith(".png") || ogImage.endsWith("/opengraph-image") ? "image/png" : "image/jpeg" }]
        : undefined,
      ...(args.type === "article"
        ? {
            publishedTime: args.publishedTime,
            modifiedTime: args.modifiedTime,
            ...(args.authorName ? { authors: [args.authorName] } : {}),
            ...(args.section ? { section: args.section } : {}),
            ...(args.keywords?.length ? { tags: args.keywords } : {})
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
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        }
  };

  return metadata;
}
