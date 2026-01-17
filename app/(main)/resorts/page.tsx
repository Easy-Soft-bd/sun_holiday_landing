import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
    MapPin,
    Star,
    Waves,
    Building2,
    ChevronRight,
    Hotel,
    Sparkles,
    Calendar,
    Users
} from "lucide-react";

// Metadata for SEO
export const metadata: Metadata = {
    title: "Our Resorts & Hotels | Premium Accommodations - Sun Holidays Ltd",
    description: "Discover our collection of premium resorts and hotels across Bangladesh. From beachfront paradises to luxury city hotels, find your perfect stay with Sun Holidays Ltd.",
    keywords: ["Sun Holidays Resorts", "Bangladesh Hotels", "Beach Resorts", "City Hotels", "Luxury Accommodation", "Cox's Bazar Hotels", "Saint Martin Resort"],
    openGraph: {
        title: "Our Resorts & Hotels | Sun Holidays Ltd",
        description: "Explore our premium collection of resorts and hotels. Experience luxury, comfort, and exceptional service.",
        images: ["/sailor/SHA_6244 copy.jpg"],
        type: "website",
    },
};

// Resort data structure
interface Resort {
    id: string;
    name: string;
    tagline: string;
    location: string;
    category: "beach" | "city";
    rating: number;
    image: string;
    description: string;
    features: string[];
    established?: string;
    href: string;
    status: "available" | "coming-soon";
}

// Server-side data fetching
async function getResorts(): Promise<Resort[]> {
    return [
        {
            id: "sailor-moon",
            name: "Sailor Moon Resorts",
            tagline: "Premium 3-Star Beach Resort",
            location: "Saint Martin Island, Cox's Bazar",
            category: "beach",
            rating: 5,
            image: "/sailor/SHA_6244 copy.jpg",
            description: "Experience paradise at our finest resort in Saint Martin. Offering world-class amenities, stunning ocean views, and unforgettable beach experiences.",
            features: ["Beachfront Access", "Premium Dining", "BBQ & Party", "Beach Activities"],
            established: "2022",
            href: "/sailor-moon-resorts",
            status: "available"
        },
        {
            id: "grandeur-bliss",
            name: "Grandeur Bliss",
            tagline: "5-Star Luxury Resort",
            location: "Inani Beach, Cox's Bazar",
            category: "beach",
            rating: 5,
            image: "/Sun-Holidays-Leaflet-Editable.jpg",
            description: "A state-of-the-art luxury escape nestled adjacent to the serene Inani Beach. Experience sophistication and coastal tranquility.",
            features: ["250 Luxury Rooms", "Spa & Gym", "Conference Facilities", "Multiple Restaurants"],
            established: "Coming Soon",
            href: "/resort/grandeur-bliss",
            status: "coming-soon"
        },
        {
            id: "city-hotel-dhaka",
            name: "Sun Holidays City Hotel",
            tagline: "Premium Business Hotel",
            location: "Dhanmondi, Dhaka",
            category: "city",
            rating: 4,
            image: "/placeholder-city-hotel.jpg",
            description: "Modern business hotel in the heart of Dhaka. Perfect for business travelers and city explorers seeking comfort and convenience.",
            features: ["Business Center", "Meeting Rooms", "Restaurant", "Free WiFi"],
            established: "Coming Soon",
            href: "/resort/city-dhaka",
            status: "coming-soon"
        }
    ];
}

// Feature badge component
const FeatureBadge = ({ feature }: { feature: string }) => (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
        <Sparkles className="size-3" />
        {feature}
    </span>
);

// Resort card component
const ResortCard = ({ resort }: { resort: Resort }) => {
    const CategoryIcon = resort.category === "beach" ? Waves : Building2;
    const isComingSoon = resort.status === "coming-soon";

    return (
        <div className="group bg-base-100 rounded-3xl overflow-hidden border border-base-300 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl">
            {/* Image Section */}
            <div className="relative h-[300px] overflow-hidden">
                <Image
                    src={resort.image}
                    alt={resort.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Status Badge */}
                {isComingSoon && (
                    <div className="absolute top-4 right-4 bg-warning text-warning-content px-4 py-2 rounded-full text-xs uppercase tracking-wider shadow-lg">
                        Coming Soon
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full text-white">
                    <CategoryIcon className="size-4" />
                    <span className="text-xs capitalize">{resort.category} Resort</span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                    {Array.from({ length: resort.rating }).map((_, i) => (
                        <Star key={i} className="size-5 fill-primary text-primary" />
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
                {/* Title & Location */}
                <div>
                    <h3 className="font-gilliequest text-3xl leading-tight tracking-tighter mb-2 group-hover:text-primary transition-colors">
                        {resort.name}
                    </h3>
                    <p className="text-primary text-sm uppercase tracking-wider mb-2">
                        {resort.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-base-content/60 text-sm">
                        <MapPin className="size-4 text-primary" />
                        <span>{resort.location}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-base-content/70 leading-relaxed text-sm">
                    {resort.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                    {resort.features.slice(0, 3).map((feature, index) => (
                        <FeatureBadge key={index} feature={feature} />
                    ))}
                    {resort.features.length > 3 && (
                        <span className="text-xs text-base-content/40 self-center">
                            +{resort.features.length - 3} more
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-base-300">
                    {resort.established && (
                        <div className="flex items-center gap-2 text-base-content/60 text-xs">
                            <Calendar className="size-4 text-primary" />
                            <span>Est. {resort.established}</span>
                        </div>
                    )}
                    
                    <Link 
                        href={resort.href}
                        className={`btn ${isComingSoon ? 'btn-outline' : 'btn-primary'} btn-sm rounded-full px-6 group/btn`}
                    >
                        {isComingSoon ? 'Learn More' : 'View Details'}
                        <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default async function ResortsPage() {
    const resorts = await getResorts();
    const beachResorts = resorts.filter(r => r.category === "beach");
    const cityHotels = resorts.filter(r => r.category === "city");

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/sailor/SHA_6251.JPG"
                        alt="Sun Holidays Resorts"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                </div>

                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
                    <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                        <Hotel className="size-4 text-primary" />
                        <span className="text-sm tracking-wide">Premium Accommodations</span>
                    </div>
                    
                    <h1 className="font-magmawave text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter mb-4">
                        Our <span className="text-primary italic">Resorts</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl tracking-[0.2em] uppercase mb-6 text-primary">
                        Experience Luxury & Comfort
                    </p>
                    
                    <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-white/90">
                        Discover our collection of premium resorts and hotels across Bangladesh. From pristine beaches to vibrant cities, we offer exceptional stays.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-base-200 border-y border-base-300">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-3">
                                <Hotel className="size-8 text-primary" />
                            </div>
                            <div className="text-3xl md:text-4xl font-black text-primary mb-1">{resorts.length}</div>
                            <div className="text-xs md:text-sm text-base-content/60 uppercase tracking-wider">Properties</div>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-3">
                                <Waves className="size-8 text-primary" />
                            </div>
                            <div className="text-3xl md:text-4xl font-black text-primary mb-1">{beachResorts.length}</div>
                            <div className="text-xs md:text-sm text-base-content/60 uppercase tracking-wider">Beach Resorts</div>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-3">
                                <Building2 className="size-8 text-primary" />
                            </div>
                            <div className="text-3xl md:text-4xl font-black text-primary mb-1">{cityHotels.length}</div>
                            <div className="text-xs md:text-sm text-base-content/60 uppercase tracking-wider">City Hotels</div>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-3">
                                <Users className="size-8 text-primary" />
                            </div>
                            <div className="text-3xl md:text-4xl font-black text-primary mb-1">10K+</div>
                            <div className="text-xs md:text-sm text-base-content/60 uppercase tracking-wider">Happy Guests</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beach Resorts Section */}
            <section className="py-20 lg:py-28 bg-base-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Waves className="size-6 text-primary" />
                            <p className="text-primary tracking-[0.3em] uppercase text-sm">
                                Coastal Paradise
                            </p>
                        </div>
                        <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter mb-4">
                            Beach <span className="text-primary italic">Resorts</span>
                        </h2>
                        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
                            Escape to our stunning beachfront properties where luxury meets the ocean
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {beachResorts.map((resort) => (
                            <ResortCard key={resort.id} resort={resort} />
                        ))}
                    </div>
                </div>
            </section>

            {/* City Hotels Section */}
            <section className="py-20 lg:py-28 bg-base-200">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Building2 className="size-6 text-primary" />
                            <p className="text-primary tracking-[0.3em] uppercase text-sm">
                                Urban Comfort
                            </p>
                        </div>
                        <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter mb-4">
                            City <span className="text-primary italic">Hotels</span>
                        </h2>
                        <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
                            Modern accommodations in the heart of Bangladesh's vibrant cities
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cityHotels.map((resort) => (
                            <ResortCard key={resort.id} resort={resort} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-28 bg-base-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-12 border border-primary/20">
                            <h2 className="font-gilliequest text-4xl md:text-5xl leading-tight tracking-tighter mb-6">
                                Ready to <span className="text-primary italic">Book</span> Your Stay?
                            </h2>
                            <p className="text-base-content/70 text-lg mb-8 max-w-2xl mx-auto">
                                Contact us today to reserve your perfect accommodation. Our team is ready to help you plan an unforgettable experience.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link 
                                    href="/contact" 
                                    className="btn btn-primary btn-lg rounded-full px-12 text-white shadow-xl shadow-primary/20 group"
                                >
                                    Contact Us
                                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href="/tours" 
                                    className="btn btn-outline btn-lg rounded-full px-12"
                                >
                                    Explore Tour Packages
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
