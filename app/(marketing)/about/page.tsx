import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "About Ultimate Studio",
    description:
      "Learn about Ultimate Studio—our spaces, process, and commitment to high-quality production from stages to final delivery.",
    pathname: "/about"
  });
}

export default function AboutPage() {
  const breadcrumb = [
    { "@type": "ListItem", position: 1, name: "Home", item: "/" },
    { "@type": "ListItem", position: 2, name: "About", item: "/about" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">About Ultimate Studio</h1>
        <p className="mt-4 text-slate-200 leading-relaxed">
          Ultimate Studio is built for creators who want a smooth, professional production
          experience. From dedicated stages and flexible setups to reliable production
          support, we help teams focus on great work.
        </p>
        <p className="mt-4 text-slate-200 leading-relaxed">
          We keep it simple: clean spaces, thoughtful equipment choices, and a production-ready
          flow that scales from small projects to larger shoots.
        </p>
      </main>
    </>
  );
}

