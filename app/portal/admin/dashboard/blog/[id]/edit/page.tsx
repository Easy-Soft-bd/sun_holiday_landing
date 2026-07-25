"use client";

import { useParams } from "next/navigation";
import BlogPostForm from "../../components/BlogPostForm";
import BlogFormPageShell from "../../components/BlogFormPageShell";

export default function EditBlogPostPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <BlogFormPageShell
      title="Edit blog post"
      subtitle="Update content anytime. Draft and Inactive posts stay off the public site and sitemap."
    >
      <BlogPostForm postId={id} />
    </BlogFormPageShell>
  );
}
