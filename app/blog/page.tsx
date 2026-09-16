import { BlogIndex } from "@/components/blog/BlogIndex";
import { buildMetadata } from "@/lib/seo";
import { getPostsNewestFirst } from "@/lib/blog-data";

export async function generateMetadata() {
  return buildMetadata({
    title: "Blogs — Ultimate Cineverse",
    description:
      "Production blogs from Ultimate Cineverse — workflows, stage craft, and gear guidance for crews who ship on schedule.",
    pathname: "/blog"
  });
}

export default async function BlogIndexPage() {
  const posts = await getPostsNewestFirst();
  return <BlogIndex posts={posts} />;
}
