import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
    Hotel,
    Waves,
    Dumbbell,
    Utensils,
    Users,
    Coffee,
    ChevronRight,
    MapPin
} from "lucide-react";
import ResortCtaEditButton from "./ResortCtaEditButton";

interface RoomDetail {
    label: string;
    count: number;
    size: string;
}

interface Amenity {
    icon: string;
    label: string;
}

interface ResortCtaData {
    imageUrl?: string;
    locationText?: string;
    trustCardTitle?: string;
    trustCardSubtitle?: string;
    subHeadline?: string;
    titlePart1?: string;
    titlePart2?: string;
    description?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
    roomDetails?: RoomDetail[];
    amenities?: Amenity[];
}

const defaultData = {
    imageUrl: "/Sun-Holidays-Leaflet-Editable.jpg",
    locationText: "Inani Beach, Marine Drive Road",
    trustCardTitle: "5-STAR",
    trustCardSubtitle: "Standard Resort",
    subHeadline: "Take Experience To Our 5 Star Hotel",
    titlePart1: "GRANDEUR",
    titlePart2: "BLISS",
    description: "A state-of-the-art luxury escape by Sun Holidays Ltd. Nestled adjacent to the serene Inani Beach, we offer a world of sophistication and coastal tranquility.",
    ctaButtonText: "Details & Booking",
    ctaButtonLink: "/hotel/grandeur-bliss",
    roomDetails: [
        { label: "Deluxe Rooms", count: 200, size: "425 sq. ft." },
        { label: "Suite Rooms", count: 30, size: "550 sq. ft." },
        { label: "Family Suites", count: 15, size: "675 sq. ft." },
        { label: "Presidential", count: 5, size: "1500 sq. ft." },
    ],
    amenities: [
        { icon: "Waves", label: "Huge Pool" },
        { icon: "Dumbbell", label: "Gym & Spa" },
        { icon: "Utensils", label: "Buffet & BBQ" },
        { icon: "Users", label: "Conf. Room" },
        { icon: "Coffee", label: "Coffee Shop" },
    ],
};

// Helper to get Lucide icon from string name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore
    const IconComponent = LucideIcons[name] || Hotel;
    return <IconComponent className={className} />;
};

interface ResortCtaProps {
    data?: ResortCtaData;
    admin?: boolean;
}

const ResortCta = ({ data, admin = false }: ResortCtaProps) => {
    const resortData = { ...defaultData, ...data };

    return (
        <section className="relative bg-base-200 py-20 lg:py-28 overflow-hidden group/resort">
            
            {/* Admin Edit Controls */}
            {admin && (
                <div className="absolute bottom-4 left-4 z-50">
                    <ResortCtaEditButton data={resortData} />
                </div>
            )}

            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* 1. Image Section with "Floating Card" effect */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="relative h-[400px] md:h-[600px] w-full rounded-4xl overflow-hidden shadow-2xl">
                            <Image
                                src={resortData.imageUrl}
                                alt="Grandeur Bliss Luxury Hotel Cox's Bazar"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                            {/* Location Badge */}
                            <div className="absolute bottom-8 left-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white">
                                <MapPin className="size-4 text-primary" />
                                <span className="text-sm font-bold tracking-wide">{resortData.locationText}</span>
                            </div>
                        </div>

                        {/* Floating Trust Card */}
                        <div className="absolute -bottom-6 -right-6 hidden md:block bg-base-100 p-6 rounded-2xl shadow-xl border border-base-300 animate-float">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Hotel className="size-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-base-content">{resortData.trustCardTitle}</p>
                                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">{resortData.trustCardSubtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Content Section */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm">
                                {resortData.subHeadline}
                            </p>
                            <h2 className="font-gilliequest text-5xl md:text-6xl leading-none tracking-tighter">
                                {resortData.titlePart1} <span className="text-primary italic">{resortData.titlePart2}</span>
                            </h2>
                            <p className="text-base-content/70 text-lg leading-relaxed">
                                {resortData.description}
                            </p>
                        </div>

                        {/* Room Specs Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {resortData.roomDetails.map((room, i) => (
                                <div key={i} className="bg-base-100 p-4 rounded-xl border border-base-300 hover:border-primary/30 transition-colors group">
                                    <p className="text-xs font-black text-primary uppercase tracking-tighter mb-1">{room.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold">{room.count}</span>
                                        <span className="text-[10px] font-medium text-base-content/50">Rooms • {room.size}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Amenities Section */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-base-content/40">Premium Facilities</h3>
                            <div className="flex flex-wrap gap-3">
                                {resortData.amenities.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-base-300/50 px-4 py-2 rounded-lg group hover:bg-primary hover:text-white transition-all duration-300">
                                        <DynamicIcon name={item.icon} className="size-4 text-primary group-hover:text-white transition-colors" />
                                        <span className="text-xs font-bold">{item.label}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 bg-base-300/50 px-4 py-2 rounded-lg">
                                    <span className="text-xs font-bold text-base-content/40 italic">+ much more</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-6">
                            <Link href={resortData.ctaButtonLink} className="btn btn-primary btn-lg rounded-full px-10 text-white shadow-xl shadow-primary/20 group">
                                {resortData.ctaButtonText}
                                <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResortCta;