
import { Calendar, ChevronLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "../../data/blogData";

export default function BlogDetailHero({ post }: { post: BlogPost }) {
    return (
        <section className="relative pt-32 pb-16 overflow-hidden">
            <div className="container mx-auto px-4">
                <Link 
                    href="/blog" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-base-content/50 hover:text-primary transition-colors mb-8 group"
                >
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to all stories
                </Link>

                <div className="max-w-4xl space-y-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-base-content/40 font-bold uppercase tracking-widest">
                            <Calendar size={14} className="text-primary" />
                            {post.date}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-magmawave leading-tight text-base-content">
                        {post.title}
                    </h1>

                    <p className="text-xl text-base-content/60 leading-relaxed max-w-3xl">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button className="btn btn-ghost btn-sm btn-circle hover:bg-primary/10 hover:text-primary">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
