
import { Sparkles, Newspaper, Search } from "lucide-react";
import Image from "next/image";

export default function BlogHero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                        <Sparkles size={14} className="animate-spin-slow" />
                        Explore Our Stories
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-magmawave leading-tight text-base-content">
                        News & <span className="text-primary italic">Travel</span> Insights
                    </h1>
                    
                    <p className="text-xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
                        Stay updated with the latest travel trends, visa guides, and inspiring destination stories from across the globe.
                    </p>

                    {/* Search / Filter Bar */}
                    <div className="max-w-2xl mx-auto pt-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl group-hover:bg-primary/10 transition-all" />
                            <div className="relative bg-white border border-base-200 rounded-[2rem] p-2 flex items-center shadow-2xl shadow-primary/5">
                                <div className="pl-6 text-base-content/30">
                                    <Search size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search stories, destinations, tips..." 
                                    className="w-full bg-transparent px-4 py-2 focus:outline-none text-base-content font-medium"
                                />
                                <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-primary transition-all active:scale-95 text-sm">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
