import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Contact Ultimate Studio",
    description: "Get in touch with Ultimate Studio. Ask about stages, facilities, equipment, availability, and bookings.",
    pathname: "/contact"
  });
}

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "/contact" }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Contact Ultimate Studio</h1>
        <p className="mt-4 text-slate-200 leading-relaxed">
          This is a placeholder contact form. Replace it with your real booking and
          inquiry flow.
        </p>

        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300">Name</span>
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              name="name"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              name="email"
              autoComplete="email"
              inputMode="email"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Message</span>
            <textarea
              className="mt-1 min-h-[140px] w-full resize-y rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
              name="message"
            />
          </label>
          <button
            type="button"
            className="rounded bg-amber-400 px-4 py-2 font-semibold text-black"
          >
            Send (placeholder)
          </button>
        </form>
      </main>
    </>
  );
}

