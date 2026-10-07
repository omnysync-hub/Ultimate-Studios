import { getPostsNewestFirst } from "@/lib/blog-data";
import { getSite, getSiteUrl } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const site = await getSite();
  const siteUrl = getSiteUrl();
  const posts = await getPostsNewestFirst();

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.datePublished).toUTCString();
      const description = escapeXml(post.description || post.title);
      const title = escapeXml(post.title);
      const author = escapeXml(post.author || site.brandName || "Ultimate Cineverse Team");

      return `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <author>${author}</author>
      ${post.ogImage ? `<enclosure url="${escapeXml(post.ogImage)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.brandName || "Ultimate Cineverse")}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(site.seo.defaultDescription || site.tagline)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate"
    }
  });
}
