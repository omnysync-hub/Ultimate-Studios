import { HomeExperience } from "@/components/home/HomeExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostsNewestFirst } from "@/lib/blog-data";
import { getSite, getSiteUrl } from "@/lib/cms/store";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: `${site.brandName} — Entertainment News`,
    description: site.seo.defaultDescription,
    pathname: "/"
  });
}

export default async function HomePage() {
  const site = await getSite();
  const siteUrl = getSiteUrl();
  const posts = (await getPostsNewestFirst()).slice(0, 12);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.brandName,
      url: siteUrl,
      email: site.contact.email,
      telephone: site.contact.phone,
      logo: `${siteUrl}/logo.png`
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.brandName,
      url: siteUrl,
      description: site.seo.defaultDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeExperience
        posts={posts}
        contact={site.contact}
        socials={site.socials}
        footerReelSrc={site.footerReelSrc}
      />
    </>
  );
}
