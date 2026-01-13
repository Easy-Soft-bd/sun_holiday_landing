import Image from "next/image";
import Link from "next/link";
import {
    Calendar,
    Plane,
    Map,
    Hotel,
    UserCheck,
    ShieldCheck,
    ArrowRight
} from "lucide-react";

const inclusions = [
    { icon: Plane, text: "Air Ticket" },
    { icon: ShieldCheck, text: "Visa Processing" },
    { icon: Map, text: "Transport & Ziyarah" },
    { icon: Hotel, text: "Premium Accommodation" },
];

const HajjCta = () => {
    return (
        <section className="relative bg-base-100 py-20 lg:py-32 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">

                    {/* 1. Visual Section */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="https://images.unsplash.com/photo-1605553378313-22d0dc541393?q=80&w=1200" // High-quality Makkah/Madinah image
                                alt="Umrah Hajj Package Bangladesh - Sun Holidays Ltd"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Soft Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                            {/* Floating Badge: Duration */}
                            <div className="absolute top-6 right-6 bg-white shadow-xl rounded-2xl p-4 flex flex-col items-center min-w-[100px] animate-float">
                                <Calendar className="size-6 text-primary mb-1" />
                                <span className="text-2xl font-black text-base-content">14</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">Days Trip</span>
                            </div>
                        </div>

                        {/* Mu'allim Trust Card */}
                        <div className="absolute -bottom-8 lg:-left-8 bg-base-100 p-6 rounded-2xl shadow-xl border border-base-200 max-w-xs hidden md:block">
                            <div className="flex items-start gap-4">
                                <div className="bg-success/10 p-3 rounded-full">
                                    <UserCheck className="size-6 text-success" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base-content">Expert Mu'allim</h4>
                                    <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                                        Most skilled and experienced Mu'allim will accompany your entire journey.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Content Section */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                Take a Look at Special Offers
                            </div>
                            <h2 className="font-gilliequest text-5xl md:text-7xl leading-none tracking-tighter">
                                UMRAH <span className="text-primary italic">HAJJ</span> <br />
                                PACKAGE
                            </h2>
                            <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
                                <span className="font-bold text-base-content underline decoration-primary/30">Sun Holidays Ltd.</span> ensures that you complete your long-awaited travel to the two holy cities of Makkah and Madinah with ease and spiritual focus.
                            </p>
                        </div>

                        {/* Inclusions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {inclusions.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-base-200 bg-base-200/30 hover:bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                                >
                                    <div className="bg-base-100 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                        <item.icon className="size-5" />
                                    </div>
                                    <span className="text-sm font-bold text-base-content/80 group-hover:text-base-content transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Accommodation Details */}
                        <div className="p-6 rounded-2xl bg-base-200 border-l-4 border-primary space-y-2">
                            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Hotel className="size-4 text-primary" />
                                Accommodation Included
                            </h4>
                            <p className="text-sm text-base-content/60">
                                Verified quality hotels in both <span className="font-bold">Makkah</span> and <span className="font-bold">Madinah</span>, located within walking distance to the Haram.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Link
                                href="/packages/umrah"
                                className="btn btn-primary btn-lg rounded-full px-10 text-white shadow-xl shadow-primary/20 group"
                            >
                                View Details
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="btn btn-ghost btn-lg rounded-full px-8 hover:bg-base-200"
                            >
                                Contact Agent
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HajjCta;