import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    title: "Page Not Found",
    description: "The page you’re looking for doesn’t exist. Go back to the homepage.",
    pathname: "/404"
  });
}

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="mt-4 text-slate-200 leading-relaxed">
        The requested page wasn’t found.
      </p>
      <a className="mt-6 inline-block rounded bg-amber-400 px-4 py-2 text-black font-semibold" href="/">
        Back to home
      </a>
    </main>
  );
}

