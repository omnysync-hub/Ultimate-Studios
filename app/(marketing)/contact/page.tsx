import { JsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { getSite, getSiteUrl } from "@/lib/cms/store";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata({
    title: `Contact ${site.brandName}`,
    description: `Get in touch with ${site.brandName}. Ask about stages, facilities, equipment, availability, and bookings.`,
    pathname: "/contact"
  });
}

export default async function ContactPage() {
  const site = await getSite();
  const siteUrl = getSiteUrl();
  const { phone, email, addressLines } = site.contact;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="uc-page mx-auto w-full max-w-3xl px-4 py-12 pb-24">
        <h1 className="text-3xl font-bold text-uc-fg">Contact {site.brandName}</h1>
        <p className="mt-4 text-uc-muted leading-relaxed">
          Tell us about your project. Prefer email?{" "}
          <a className="uc-link" href={`mailto:${email}`}>
            {email}
          </a>
          {phone ? (
            <>
              {" "}
              or call{" "}
              <a className="uc-link" href={`tel:${phone.replace(/\s/g, "")}`}>
                {phone}
              </a>
            </>
          ) : null}
          .
        </p>

        {addressLines.length > 0 ? (
          <p className="mt-3 text-uc-faint text-sm leading-relaxed">{addressLines.join(" · ")}</p>
        ) : null}

        <ContactForm email={email} />
      </main>
    </>
  );
}
