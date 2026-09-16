import { buildMetadata } from "@/lib/seo";
import "./tailwind.css";

export async function generateMetadata() {
  return buildMetadata({
    title: "Page Not Found",
    description: "The page you’re looking for doesn’t exist. Go back to the homepage.",
    pathname: "/404"
  });
}

export default function NotFound() {
  return (
    <main className="uc-page mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-uc-fg">Page Not Found</h1>
      <p className="mt-4 text-uc-muted leading-relaxed">The requested page wasn’t found.</p>
      <a className="uc-btn mt-6 inline-block" href="/">
        Back to home
      </a>
    </main>
  );
}
