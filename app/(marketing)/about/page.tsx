import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getSite, getSiteUrl } from "@/lib/cms/store";

export async function generateMetadata() {
  const site = await getSite();
  const rawDesc = site.about.paragraphs[0] ?? site.seo.defaultDescription;
  const description =
    rawDesc.length > 155 ? `${rawDesc.slice(0, 152).trim()}...` : rawDesc;

  return buildMetadata({
    title: site.about.title,
    description,
    pathname: "/about"
  });
}

export default async function AboutPage() {
  const site = await getSite();
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="uc-page mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-uc-fg">{site.about.title}</h1>
        {site.about.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="mt-4 text-uc-muted leading-relaxed">
            {p}
          </p>
        ))}
      </main>
    </>
  );
}
