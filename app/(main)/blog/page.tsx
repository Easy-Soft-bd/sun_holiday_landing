import { Metadata } from "next";
import BlogView from "@/src/view/blog/BlogView";
import { buildPageMetadata } from "@/src/lib/site";
import { getCachedActiveBlogPosts, toBlogPostView } from "@/src/lib/data/blog";
import { absoluteUrl } from "@/src/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "News & Travel Blog | Sun Tourism Ltd",
  description:
    "Explore the latest travel stories, destination guides, and visa tips from Sun Tourism Ltd. Your gateway to world-class travel experiences.",
  path: "/blog",
  keywords: [
    "travel blog",
    "Bangladesh travel tips",
    "visa guide",
    "Hajj Umrah tips",
    "Sun Tourism Ltd",
  ],
});

export default async function BlogPage() {
  const posts = await getCachedActiveBlogPosts();
  const views = posts.map(toBlogPostView);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sun Tourism Ltd Travel Blog",
    description:
      "Travel stories, destination guides, and visa tips from Sun Tourism Ltd.",
    url: absoluteUrl("/blog"),
    blogPost: views.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt,
      image: absoluteUrl(post.image),
      description: post.excerpt,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <BlogView posts={views} />
    </>
  );
}
