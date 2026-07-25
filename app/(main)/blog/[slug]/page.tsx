import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogDetailView from "@/src/view/blog/BlogDetailView";
import BlogJsonLd from "@/src/view/blog/components/BlogJsonLd";
import {
  generateStaticParamsForActiveBlogPosts,
  getCachedBlogForPublicPage,
  toBlogPostView,
} from "@/src/lib/data/blog";
import { buildBlogPostMetadata } from "@/src/lib/site";
import { getBlogCanonicalSegment, getBlogPublicPath } from "@/src/lib/blog/public-path";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Pre-render active posts; new slugs still work via `dynamicParams`. */
export const dynamicParams = true;

export async function generateStaticParams() {
  return generateStaticParamsForActiveBlogPosts();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const segment = decodeURIComponent(raw);
  const post = await getCachedBlogForPublicPage(segment);

  if (!post || post.status !== "Active") {
    return {
      title: "Blog post not found | Sun Tourism Ltd",
      description: "This article is unavailable or no longer published.",
      robots: { index: false, follow: false },
    };
  }

  return buildBlogPostMetadata(post, getBlogPublicPath(post));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug: raw } = await params;
  const segment = decodeURIComponent(raw);
  const post = await getCachedBlogForPublicPage(segment);

  if (!post || post.status !== "Active") {
    notFound();
  }

  const canonical = getBlogCanonicalSegment(post);
  if (segment !== canonical) {
    permanentRedirect(`/blog/${encodeURIComponent(canonical)}`);
  }

  return (
    <>
      <BlogJsonLd post={post} />
      <BlogDetailView post={toBlogPostView(post)} />
    </>
  );
}
