import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Palmtree, Mountain, Building2, Umbrella } from "lucide-react";

const categories = [
    {
        title: "Beach Escape",
        description: "Turquoise waters & white sands.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
        className: "md:col-span-2 md:row-span-2", // Large featured item
        icon: Umbrella,
        count: "120+ Locations",
    },
    {
        title: "Mountain Trek",
        description: "Reach new heights.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
        className: "md:col-span-2 md:row-span-1",
        icon: Mountain,
        count: "85 Locations",
    },
    {
        title: "City Lights",
        description: "Metropolitan wonders.",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800",
        className: "md:col-span-1 md:row-span-1",
        icon: Building2,
        count: "40+ Cities",
    },
    {
        title: "Exotic Jungles",
        description: "Nature's hidden gems.",
        image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=800",
        className: "md:col-span-1 md:row-span-1",
        icon: Palmtree,
        count: "25+ Resorts",
    },
];

export default function HolidayCategories() {
    return (
        <section className="bg-base-100 py-20 lg:py-32">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 hidden">
                    <div className="max-w-xl">
                        <h2 className="font-gilliequest text-5xl md:text-7xl uppercase tracking-tighter leading-none">
                            Pick Your <span className="text-primary italic">Paradise</span>
                        </h2>
                        <p className="mt-4 text-base-content/60 font-medium max-w-sm">
                            Tailored holiday experiences designed for the modern traveler. Where do you want to go next?
                        </p>
                    </div>
                    <Link href="/destinations" className="btn btn-primary rounded-full px-8 text-white">
                        View All Destinations
                    </Link>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1000px] md:h-[600px]">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={`/category/${cat.title.toLowerCase()}`}
                            className={`group relative overflow-hidden rounded-3xl bg-base-300 ${cat.className}`}
                        >
                            {/* Image with subtle zoom on hover */}
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Modern Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                            {/* Top Badge */}
                            <div className="absolute top-4 left-4">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
                                    <cat.icon className="size-4 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                                        {cat.count}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white flex justify-between items-end">
                                <div className="space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{cat.title}</h3>
                                    <p className="text-sm text-white/70 font-medium">{cat.description}</p>
                                </div>

                                {/* Modern CTA Button inside card */}
                                <div className="size-12 rounded-full bg-primary flex items-center justify-center -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowUpRight className="text-white" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}