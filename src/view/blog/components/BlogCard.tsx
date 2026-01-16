
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "../data/blogData";

export default function BlogCard({ post }: { post: BlogPost }) {
    return (
        <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-base-200 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full bg-gradient-to-b from-white to-base-50/50">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-base-content/40 mb-4 font-bold uppercase tracking-widest">
                    <Calendar size={14} className="text-primary" />
                    {post.date}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                </h3>
                
                <p className="text-base-content/60 text-sm leading-relaxed mb-8 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-base-100">
                    <Link 
                        href={`/blog/${post.id}`} 
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors group/btn"
                    >
                        Read Full Story
                        <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
