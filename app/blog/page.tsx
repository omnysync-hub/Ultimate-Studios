import { BlogIndex } from "@/components/blog/BlogIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { BLOG_FAQS } from "@/lib/blog-faqs";
import { getPostsNewestFirst } from "@/lib/blog-data";
import { getSite, getSiteUrl } from "@/lib/cms/store";

/**
 * Seasonal (Thanksgiving) + evergreen targeting: the title leads with the
 * November search surge — Thanksgiving movies / family films / what to
 * watch — while the description and schema keep the page's year-round
 * entertainment-blog identity so rankings survive the season change.
 */
const BLOG_TITLE = "Thanksgiving Movies, Family Films & What to Watch — Blog";
const BLOG_DESCRIPTION =
  "Best Thanksgiving movies, family film guides & what to watch this Thanksgiving weekend. Reviews, streaming picks & stories to gather around — Ultimate Cineverse.";
const BLOG_KEYWORDS = [
  "Thanksgiving movies",
  "best Thanksgiving movies",
  "family movies for Thanksgiving",
  "what to watch on Thanksgiving",
  "Thanksgiving weekend movies",
  "movies set on Thanksgiving",
  "Thanksgiving streaming guide",
  "family film guides",
  "movie reviews",
  "what to watch this weekend",
  "Ultimate Cineverse blog"
];

export async function generateMetadata() {
  // OG/Twitter image is rendered dynamically by app/blog/opengraph-image.tsx
  // (theme-matched, 1200x630 PNG) — no binary asset to keep in sync.
  return buildMetadata({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    pathname: "/blog",
    openGraphImageUrl: `${getSiteUrl()}/blog/opengraph-image`,
    keywords: BLOG_KEYWORDS
  });
}

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BlogIndexPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const [posts, site] = await Promise.all([getPostsNewestFirst(), getSite()]);
  const siteUrl = getSiteUrl();
  const blogUrl = `${siteUrl}/blog`;

  const graphLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        name: `${site.brandName} Blog — Thanksgiving Movies, Family Films & Entertainment Guides`,
        description: BLOG_DESCRIPTION,
        url: blogUrl,
        inLanguage: "en-US",
        publisher: {
          "@type": "Organization",
          name: site.brandName,
          url: siteUrl,
          logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png`, width: 512, height: 512 }
        },
        blogPost: posts.slice(0, 20).map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${siteUrl}/blog/${post.slug}`,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          author: { "@type": "Person", name: post.author }
        }))
      },
      {
        "@type": "CollectionPage",
        "@id": `${blogUrl}#collection`,
        name: BLOG_TITLE,
        description: BLOG_DESCRIPTION,
        url: blogUrl,
        isPartOf: { "@type": "WebSite", name: site.brandName, url: siteUrl },
        about: ["Thanksgiving", "Family films", "Entertainment", "Streaming guides", "Movie reviews"],
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.slice(0, 20).map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/blog/${post.slug}`,
            name: post.title
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: blogUrl }
        ]
      },
      {
        // Mirrors the visible FAQ section in BlogIndex 1:1 (same source array).
        "@type": "FAQPage",
        "@id": `${blogUrl}#faq`,
        mainEntity: BLOG_FAQS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer }
        }))
      },
      {
        "@type": "Event",
        name: "Thanksgiving Day 2026",
        startDate: "2026-11-26",
        endDate: "2026-11-26",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Country", name: "United States" },
        description:
          "Thanksgiving Day in the United States — Thursday, November 26, 2026. The Ultimate Cineverse blog's Thanksgiving movie guides and family watchlists are curated for this holiday weekend."
      }
    ]
  };

  return (
    <>
      <JsonLd data={graphLd} />
      <BlogIndex posts={posts} initialQuery={q?.trim() ?? ""} />
    </>
  );
}
