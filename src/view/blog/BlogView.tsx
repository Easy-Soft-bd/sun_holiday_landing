"use client";

import { useState } from "react";
import BlogHero from "./components/BlogHero";
import BlogCard from "./components/BlogCard";
import type { BlogPostView } from "@/src/lib/data/blog";
import { Mail, Send } from "lucide-react";

type BlogViewProps = {
  posts: BlogPostView[];
};

export default function BlogView({ posts }: BlogViewProps) {
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-base-100 min-h-screen pb-24">
      <BlogHero />

      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border-2 px-8 py-3 text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "scale-105 border-primary bg-primary text-white shadow-lg shadow-primary/20"
                  : "border-base-200 bg-white text-base-content/60 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="mb-24 rounded-[2rem] border border-dashed border-base-300 bg-base-50 px-8 py-20 text-center">
            <p className="text-lg font-medium text-base-content/60">
              No stories published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="mb-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug || post.id} post={post} />
            ))}
          </div>
        )}

        <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-6 py-20 text-center shadow-2xl">
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary blur-[100px]" />
          </div>

          <div className="mx-auto max-w-3xl space-y-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-md">
              <Mail size={32} />
            </div>
            <h2 className="font-magmawave text-4xl text-white md:text-5xl">
              Subscribe to Our <span className="text-secondary">Newsletter</span>
            </h2>
            <p className="text-lg text-white/60">
              Join 10,000+ travel enthusiasts. Get the latest stories and exclusive offers delivered
              straight to your inbox.
            </p>

            <div className="group relative mx-auto max-w-md pt-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-full border border-white/10 bg-white/5 px-8 py-5 font-medium text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
              />
              <button
                type="button"
                className="absolute top-[calc(1rem+8px)] right-2 rounded-full bg-primary p-3.5 text-white shadow-lg shadow-primary/30 transition-all hover:bg-secondary active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
