
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/src/view/blog/data/blogData";
import BlogDetailView from "@/src/view/blog/BlogDetailView";

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
    return {
      title: "Blog Post Not Found | Sun Holidays Ltd",
    };
  }

  return {
    title: `${post.title} | Sun Holidays Ltd`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return <BlogDetailView post={post} />;
}
