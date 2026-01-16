
import { Metadata } from "next";
import BlogView from "@/src/view/blog/BlogView";

export const metadata: Metadata = {
  title: "News & Travel Blog | Sun Holidays Ltd",
  description: "Explore the latest travel stories, destination guides, and visa tips from Sun Holidays Ltd. Your gateway to world-class travel experiences.",
};

export default function BlogPage() {
  return <BlogView />;
}
