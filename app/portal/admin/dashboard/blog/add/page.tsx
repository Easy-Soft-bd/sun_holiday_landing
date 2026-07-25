"use client";

import BlogPostForm from "../components/BlogPostForm";
import BlogFormPageShell from "../components/BlogFormPageShell";

export default function AddBlogPostPage() {
  return (
    <BlogFormPageShell
      title="Create blog post"
      subtitle="Write a travel story with a cover image, rich text, and SEO fields. Only Active posts appear on the public site."
    >
      <BlogPostForm />
    </BlogFormPageShell>
  );
}
