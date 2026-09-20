import { BlogIndex } from "@/components/blog/BlogIndex";
import { buildMetadata } from "@/lib/seo";
import { getPostsNewestFirst } from "@/lib/blog-data";

export async function generateMetadata() {
  return buildMetadata({
    title: "Entertainment News & Blogs",
    description:
      "Latest entertainment news, trending culture stories, and deep reads across film, TV, music, and digital media.",
    pathname: "/blog"
  });
}

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BlogIndexPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const posts = await getPostsNewestFirst();
  return <BlogIndex posts={posts} initialQuery={q?.trim() ?? ""} />;
}
