import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Privacy Policy",
    description:
      "Privacy Policy for Ultimate Studio. Learn how we collect, use, and protect information, including cookies and advertising.",
    pathname: "/privacy"
  });
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-slate-200 leading-relaxed">
        Placeholder legal text. Replace with your real Privacy Policy (GDPR/CCPA),
        including cookie/ad disclosures and CMP details.
      </p>
    </main>
  );
}

