import { HomeExperience } from "@/components/home/HomeExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getChannelVideos } from "@/lib/youtube";

export async function generateMetadata() {
  return buildMetadata({
    title: "Ultimate Studio — Stages, Facilities & Equipment",
    description:
      "Explore Ultimate Studio: stages, facilities, and equipment for production. Fast setup, professional space, and a seamless studio experience.",
    pathname: "/"
  });
}

export default async function HomePage() {
  const videos = await getChannelVideos(12).catch(() => []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Ultimate Studio",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
      logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/logo.png`
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Ultimate Studio",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
      potentialAction: {
        "@type": "SearchAction",
        target: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/blog?query={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeExperience videos={videos} />
    </>
  );
}
