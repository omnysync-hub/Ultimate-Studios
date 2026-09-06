import { BlogNavbar } from "@/components/blog/home/BlogNavbar";
import { BlogHero } from "@/components/blog/home/BlogHero";
import { BlogCategories } from "@/components/blog/home/BlogCategories";
import { BlogTrending } from "@/components/blog/home/BlogTrending";
import { AdUnit } from "@/components/ads/AdUnit";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

export async function generateMetadata() {
  return buildMetadata({
    title: "Blog — Ultimate Cineverse",
    description:
      "Explore deep dives into cinematography, cyberpunk aesthetics, worldbuilding scale, and anamorphic optics.",
    pathname: "/blog"
  });
}

export default function BlogHomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Ultimate Cineverse Blog",
      description:
        "Cinematography analyses, lighting breakdowns, sakuga anime aesthetics, and worldbuilding.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/blog`
    }
  ];

  return (
    <div className="min-h-screen bg-base text-text-primary selection:bg-brand-red selection:text-white pb-20">
      <JsonLd data={jsonLd} />

      {/* §4.1 Navbar */}
      <BlogNavbar />

      {/* Main Container: 64px desktop margin, 20px mobile margin (§2.4) */}
      <main className="mx-auto w-full max-w-[1440px] px-5 sm:px-10 lg:px-16">
        {/* §4.2 Hero Section */}
        <BlogHero />

        {/* §4.3 Categories Section */}
        <BlogCategories />

        {/* §4.4 Trending Blogs Section */}
        <BlogTrending posts={blogPosts} />

        {/* AdSense Unit (Scoped inside blog per .cursorrules & design.md) */}
        <div className="mt-16 w-full flex justify-center">
          <div className="w-full max-w-4xl rounded-card border border-border-subtle bg-surface p-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Advertisement
            </span>
            <div className="mt-2 flex justify-center">
              <AdUnit slot="1234567890" minHeight={120} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
