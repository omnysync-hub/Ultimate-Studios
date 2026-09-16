import { HomeExperience } from "@/components/home/HomeExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getSite, getSiteUrl } from "@/lib/cms/store";
import { getChannelVideos } from "@/lib/youtube";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: `${site.brandName} — Stages, Facilities & Equipment`,
    description: site.seo.defaultDescription,
    pathname: "/"
  });
}

export default async function HomePage() {
  const site = await getSite();
  const siteUrl = getSiteUrl();
  const videos = await getChannelVideos(12, site.youtubeChannelId).catch(() => []);

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
      description: site.seo.defaultDescription
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeExperience
        videos={videos}
        contact={site.contact}
        socials={site.socials}
        footerReelSrc={site.footerReelSrc}
      />
    </>
  );
}
