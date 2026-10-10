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
          Connect with the Ultimate Cineverse newsroom and creative studio. Whether you have an editorial lead, a screening invitation, or a production inquiry, our team is ready to collaborate.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-uc-border bg-uc-glass p-5">
            <h2 className="text-base font-semibold text-uc-fg">Editorial &amp; Press</h2>
            <p className="mt-2 text-sm text-uc-muted leading-relaxed">
              For review screeners, press releases, festival coverage, and film interview requests, email our writing desk at{" "}
              <a className="uc-link" href={`mailto:${email}`}>
                {email}
              </a>.
            </p>
          </div>
          <div className="rounded-lg border border-uc-border bg-uc-glass p-5">
            <h2 className="text-base font-semibold text-uc-fg">Studio &amp; Production</h2>
            <p className="mt-2 text-sm text-uc-muted leading-relaxed">
              Inquire about studio production, commercial creative direction, video editing, and motion design projects.
            </p>
          </div>
        </div>

        {addressLines.length > 0 ? (
          <p className="mt-4 text-uc-faint text-sm leading-relaxed">{addressLines.join(" · ")}</p>
        ) : null}

        <div className="mt-8">
          <ContactForm email={email} />
        </div>
      </main>
    </>
  );
}
