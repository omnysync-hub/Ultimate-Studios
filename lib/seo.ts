import type { Metadata, ResolvingMetadata } from "next";

type SeoArgs = {
  title: string;
  description: string;
  pathname?: string;
  canonicalQuery?: string;
  openGraphImageUrl?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function buildMetadata(args: SeoArgs, parent?: ResolvingMetadata): Metadata {
  const base = new URL(siteUrl);
  const canonical = args.pathname ? new URL(args.pathname + (args.canonicalQuery ?? ""), base) : base;

  return {
    title: args.title,
    description: args.description,
    alternates: {
      canonical: canonical.toString()
    },
    openGraph: {
      title: args.title,
      description: args.description,
      url: canonical.toString(),
      type: "website",
      images: args.openGraphImageUrl
        ? [
            {
              url: args.openGraphImageUrl
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description
    }
  };
}

