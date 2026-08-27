import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Terms of Service",
    description:
      "Terms of Service for Ultimate Studio. Placeholder legal text—replace with your real ToS and policies.",
    pathname: "/terms"
  });
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-slate-200 leading-relaxed">
        Placeholder legal text. Replace with your real Terms of Service for bookings,
        usage, and other site policies.
      </p>
    </main>
  );
}

