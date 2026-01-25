import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
    Calendar,
    Plane,
    Map,
    Hotel,
    UserCheck,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import HajjCtaEditButton from "./HajjCtaEditButton";

interface Inclusion {
    icon: string;
    text: string;
}

interface HajjCtaData {
    imageUrl?: string;
    duration?: string;
    durationLabel?: string;
    mualimTitle?: string;
    mualimDescription?: string;
    offerBadge?: string;
    titlePart1?: string;
    titlePart2?: string;
    description?: string;
    accommodationTitle?: string;
    accommodationDescription?: string;
    viewDetailsLink?: string;
    contactAgentLink?: string;
    inclusions?: Inclusion[];
}

const defaultData = {
    imageUrl: "https://images.unsplash.com/photo-1605553378313-22d0dc541393?q=80&w=1200",
    duration: "14",
    durationLabel: "Days Trip",
    mualimTitle: "Expert Mu'allim",
    mualimDescription: "Most skilled and experienced Mu'allim will accompany your entire journey.",
    offerBadge: "Take a Look at Special Offers",
    titlePart1: "UMRAH",
    titlePart2: "HAJJ PACKAGE",
    description: "Sun Holidays Ltd. ensures that you complete your long-awaited travel to the two holy cities of Makkah and Madinah with ease and spiritual focus.",
    accommodationTitle: "Accommodation Included",
    accommodationDescription: "Verified quality hotels in both Makkah and Madinah, located within walking distance to the Haram.",
    viewDetailsLink: "/packages/umrah",
    contactAgentLink: "/contact",
    inclusions: [
        { icon: "Plane", text: "Air Ticket" },
        { icon: "ShieldCheck", text: "Visa Processing" },
        { icon: "Map", text: "Transport & Ziyarah" },
        { icon: "Hotel", text: "Premium Accommodation" },
    ],
};

// Helper to get Lucide icon from string name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[name] || Map;
    return <IconComponent className={className} />;
};

interface HajjCtaProps {
    data?: HajjCtaData;
    admin?: boolean;
}

const HajjCta = ({ data, admin = false }: HajjCtaProps) => {
    const hajjData = { ...defaultData, ...data };

    return (
        <section className="relative bg-base-100 py-20 lg:py-32 overflow-hidden group/hajj">
            
            {/* Admin Edit Controls */}
            {admin && (
                <div className="absolute bottom-4 left-4 z-50">
                    <HajjCtaEditButton data={hajjData} />
                </div>
            )}

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">

                    {/* 1. Visual Section */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative h-[450px] md:h-[550px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src={hajjData.imageUrl}
                                alt="Umrah Hajj Package Bangladesh - Sun Holidays Ltd"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Soft Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                            {/* Floating Badge: Duration */}
                            <div className="absolute top-6 right-6 bg-white shadow-xl rounded-2xl p-4 flex flex-col items-center min-w-[100px] animate-float">
                                <Calendar className="size-6 text-primary mb-1" />
                                <span className="text-2xl font-black text-base-content">{hajjData.duration}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">{hajjData.durationLabel}</span>
                            </div>
                        </div>

                        {/* Mu'allim Trust Card */}
                        <div className="absolute -bottom-8 lg:-left-8 bg-base-100 p-6 rounded-2xl shadow-xl border border-base-200 max-w-xs hidden md:block">
                            <div className="flex items-start gap-4">
                                <div className="bg-success/10 p-3 rounded-full">
                                    <UserCheck className="size-6 text-success" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base-content">{hajjData.mualimTitle}</h4>
                                    <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                                        {hajjData.mualimDescription}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Content Section */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                {hajjData.offerBadge}
                            </div>
                            <h2 className="font-gilliequest text-5xl md:text-7xl leading-none tracking-tighter">
                                {hajjData.titlePart1} <span className="text-primary italic">{hajjData.titlePart2}</span>
                            </h2>
                            <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
                                {hajjData.description}
                            </p>
                        </div>

                        {/* Inclusions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {hajjData.inclusions?.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-base-200 bg-base-200/30 hover:bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                                >
                                    <div className="bg-base-100 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                        <DynamicIcon name={item.icon} className="size-5" />
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
                                {hajjData.accommodationTitle}
                            </h4>
                            <p className="text-sm text-base-content/60">
                                {hajjData.accommodationDescription}
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <Link
                                href={hajjData.viewDetailsLink}
                                className="btn btn-primary btn-lg rounded-full px-10 text-white shadow-xl shadow-primary/20 group"
                            >
                                View Details
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href={hajjData.contactAgentLink}
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