import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../data/blogData";

export default function BlogCard({ post }: { post: BlogPost }) {
    const href = `/blog/${post.slug || post.id}`;

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-base-200 bg-gradient-to-b from-white to-base-50/50 bg-white transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                <div className="absolute top-4 left-4">
                    <span className="rounded-full border border-white/20 bg-white/20 px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md">
                        {post.category}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-8">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-base-content/40 uppercase">
                    <Calendar size={14} className="text-primary" />
                    {post.date}
                </div>

                <h3 className="mb-4 text-2xl leading-tight font-bold transition-colors group-hover:text-primary">
                    {post.title}
                </h3>

                <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-base-content/60">
                    {post.excerpt}
                </p>

                <div className="mt-auto border-t border-base-100 pt-6">
                    <Link
                        href={href}
                        className="group/btn inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors hover:text-primary"
                    >
                        Read Full Story
                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover/btn:translate-x-1"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
