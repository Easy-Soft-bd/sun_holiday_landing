
import Image from "next/image";
import { BlogPost } from "../../data/blogData";

export default function BlogContent({ post }: { post: BlogPost }) {
    return (
        <section className="pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Featured Image */}
                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl mb-16 border-4 border-white">
                        <Image 
                            src={post.image} 
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Article Content */}
                    <article 
                        className="prose prose-lg max-w-none prose-headings:font-magmawave prose-headings:text-base-content prose-p:text-base-content/70 prose-p:leading-relaxed prose-strong:text-base-content prose-img:rounded-[2rem] prose-a:text-primary hover:prose-a:text-secondary transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    {/* Author / Info Footer */}
                    <div className="mt-20 pt-10 border-t border-base-200 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="font-bold">SH</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-base-content">Sun Holidays Editorial</h4>
                                <p className="text-xs text-base-content/40 tracking-widest uppercase font-bold">Official Travel Guides</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            {["Adventure", "Travel", "Guide"].map(tag => (
                                <span key={tag} className="px-4 py-1.5 rounded-lg bg-base-100 border border-base-200 text-xs font-bold text-base-content/50 uppercase tracking-wider">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
