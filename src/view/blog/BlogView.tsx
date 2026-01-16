
"use client";

import { useState } from "react";
import BlogHero from "./components/BlogHero";
import BlogCard from "./components/BlogCard";
import { blogPosts } from "./data/blogData";
import { Mail, Send } from "lucide-react";

export default function BlogView() {
    const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts = activeCategory === "All" 
        ? blogPosts 
        : blogPosts.filter(p => p.category === activeCategory);

    return (
        <main className="bg-base-100 min-h-screen pb-24">
            <BlogHero />

            <div className="container mx-auto px-4">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all border-2 ${
                                activeCategory === cat 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                : "bg-white border-base-200 text-base-content/60 hover:border-primary/30 hover:text-primary"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {filteredPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Blog Newsletter Section */}
                <section className="relative rounded-[3rem] overflow-hidden bg-slate-900 px-6 py-20 text-center shadow-2xl">
                    <div className="absolute inset-0 -z-10 opacity-20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[100px]" />
                    </div>
                    
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-primary backdrop-blur-md">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-magmawave text-white">Subscribe to Our <span className="text-secondary">Newsletter</span></h2>
                        <p className="text-white/60 text-lg">Join 10,000+ travel enthusiasts. Get the latest stories and exclusive offers delivered straight to your inbox.</p>
                        
                        <div className="max-w-md mx-auto relative group pt-4">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-[calc(1rem+8px)] bg-primary text-white p-3.5 rounded-full hover:bg-secondary transition-all active:scale-95 shadow-lg shadow-primary/30">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
