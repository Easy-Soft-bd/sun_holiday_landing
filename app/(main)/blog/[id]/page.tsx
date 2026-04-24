
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/src/view/blog/data/blogData";
import BlogDetailView from "@/src/view/blog/BlogDetailView";
import { buildPageMetadata } from "@/src/lib/site";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return buildPageMetadata({
      title: "Blog Post Not Found | Sun Tourism Ltd",
      description: "The requested blog post could not be found.",
      path: `/blog/${id}`,
    });
  }

  return buildPageMetadata({
    title: `${post.title} | Sun Tourism Ltd`,
    description: post.excerpt,
    path: `/blog/${id}`,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return <BlogDetailView post={post} />;
}
