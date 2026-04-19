
import { Metadata } from "next";
import BlogView from "@/src/view/blog/BlogView";
import { buildPageMetadata } from "@/src/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "News & Travel Blog | Sun Holidays Ltd",
  description: "Explore the latest travel stories, destination guides, and visa tips from Sun Holidays Ltd. Your gateway to world-class travel experiences.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogView />;
}
