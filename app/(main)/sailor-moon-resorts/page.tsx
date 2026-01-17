import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
    MapPin,
    Utensils,
    PartyPopper,
    Armchair,
    Waves,
    Star,
    Clock,
    Phone,
    Mail,
    ChevronRight,
    Calendar
} from "lucide-react";

// Metadata for SEO
export const metadata: Metadata = {
    title: "Sailor Moon Resorts, Saint Martin | Premium Beach Resort - Sun Holidays Ltd",
    description: "Experience paradise at Sailor Moon Resorts, Saint Martin. Premium 3-star beach resort offering dining, BBQ, beach activities, and stunning ocean views. Book your stay at Cox's Bazar's finest resort.",
    keywords: ["Sailor Moon Resort", "Saint Martin Resort", "Cox's Bazar Beach Resort", "Bangladesh Beach Hotel", "Sun Holidays Resort", "Saint Martin Island Accommodation"],
    openGraph: {
        title: "Sailor Moon Resorts, Saint Martin | Premium Beach Resort",
        description: "Experience paradise at Sailor Moon Resorts - Premium 3-star resort in Saint Martin offering world-class amenities and breathtaking beach views.",
        images: ["/sailor/SHA_6244 copy.jpg"],
        type: "website",
    },
};

// Resort data structure based on the old website
interface ResortData {
    name: string;
    location: string;
    description: string;
    tagline: string;
    features: {
        title: string;
        description: string;
        icon: string;
    }[];
    images: string[];
    checkIn: string;
    checkOut: string;
    contact: {
        phone: string[];
        email: string[];
    };
}

// Server-side data fetching function
async function getResortData(): Promise<ResortData> {
    // In a real scenario, you might fetch this from an API or database
    // For now, we'll use the data from the old website
    return {
        name: "Sailor Moon Resorts, Saint Martin",
        location: "West Sea-Beach Konarpara, Saint Martin, Cox's Bazar, Bangladesh",
        description: "Sailor Moon Resorts, Saint Martin is situated at West Sea-Beach Konarpara, Saint Martin, Cox's Bazar, Bangladesh. We own this resort since 2022. Sailor Moon Resorts one of the finest resort in Saint Martin. With the variety of services Sailor Moon Resort try to provide the best value for money service to their customer. 100% Customer Satisfactory obtaining is our main goal.",
        tagline: "Premium 3 star Resorts experience",
        features: [
            {
                title: "Dining",
                description: "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers a diverse and tantalizing dining experience, featuring an array of delectable cuisines picturesque dining settings overlooking the stunning beach.",
                icon: "dining"
            },
            {
                title: "BBQ & Party",
                description: "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers an enticing BBQ and party experience, providing guests with delectable grilled delights and a vibrant atmosphere, creating memorable moments for gatherings and celebrations.",
                icon: "bbq"
            },
            {
                title: "Resting Area",
                description: "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers a calm and pleasant resting space where visitors may unwind and relax while taking in the spectacular views of the coastline.",
                icon: "rest"
            },
            {
                title: "Beach Activities",
                description: "The Sailor Moon Resort, Saint Martin in Cox's Bazar offers a plethora of beach activities, including sunbathing, swimming, beach volleyball ensuring a fun-filled and rejuvenating experience for all guests.",
                icon: "beach"
            }
        ],
        images: [
            "/sailor/SHA_6244 copy.jpg",
            "/sailor/SHA_6251.JPG",
            "/sailor/Sailor_Room_1.jpg",
            "/sailor/sailor_ (16).jpg",
            "/sailor/sailor_ (17).jpg",
            "/sailor/sailor_ (2).jpg",
            "/sailor/sailor_ (21).jpg",
            "/sailor/sailor_ (26).jpg",
            "/sailor/sailor_ (28).jpg",
            "/sailor/sailor_ (31).jpg",
            "/sailor/sailor_ (5).jpg",
            "/sailor/sailor_-(11).jpg",
            "/sailor/sailor_-(30).jpg",
            "/sailor/sailor_-(8).jpg"
        ],
        checkIn: "12:00 PM",
        checkOut: "11:00 AM",
        contact: {
            phone: ["+88 02 2222 43452", "+88 018 73 83 83 01", "+88 018 73 83 83 02"],
            email: ["info@sunholidaysltd.com", "sunholidays07@gmail.com"]
        }
    };
}

// Icon mapping component
const FeatureIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
        case "dining":
            return <Utensils className="size-8 text-primary" />;
        case "bbq":
            return <PartyPopper className="size-8 text-primary" />;
        case "rest":
            return <Armchair className="size-8 text-primary" />;
        case "beach":
            return <Waves className="size-8 text-primary" />;
        default:
            return <Star className="size-8 text-primary" />;
    }
};

export default async function SailorMoonResortsPage() {
    // Fetch resort data server-side
    const resortData = await getResortData();

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={resortData.images[0]}
                        alt={resortData.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>

                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
                    <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                        <MapPin className="size-4 text-primary" />
                        <span className="text-sm font-bold tracking-wide">Saint Martin Island</span>
                    </div>
                    
                    <h1 className="font-gilliequest text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter mb-4">
                        Sailor Moon <span className="text-primary italic">Resorts</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase mb-6 text-primary">
                        {resortData.tagline}
                    </p>
                    
                    <p className="max-w-2xl text-lg md:text-xl leading-relaxed mb-8 text-white/90">
                        Welcome to Sailor Moon Resort, Saint Martin where enchantment meets relaxation!
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link 
                            href="#booking" 
                            className="btn btn-primary btn-lg rounded-full px-10 text-white shadow-xl shadow-primary/20 group"
                        >
                            Book Now
                            <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            href="#gallery" 
                            className="btn btn-outline btn-lg rounded-full px-10 text-white border-white hover:bg-white hover:text-base-content"
                        >
                            View Gallery
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 lg:py-28 bg-base-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4">
                            About Our Resort
                        </p>
                        <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter mb-6">
                            Experience Paradise on <span className="text-primary italic">Saint Martin</span>
                        </h2>
                        <p className="text-base-content/70 text-lg leading-relaxed mb-8">
                            {resortData.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                                    <Star className="size-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">Premium 3-Star</h3>
                                <p className="text-base-content/60 text-sm">Finest resort experience in Saint Martin</p>
                            </div>
                            
                            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                                    <Calendar className="size-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">Since 2022</h3>
                                <p className="text-base-content/60 text-sm">Serving guests with excellence</p>
                            </div>
                            
                            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                                    <MapPin className="size-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-2">Prime Location</h3>
                                <p className="text-base-content/60 text-sm">West Sea-Beach Konarpara</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-28 bg-base-200">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4">
                            Our Facilities
                        </p>
                        <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
                            Premium <span className="text-primary italic">Amenities</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {resortData.features.map((feature, index) => (
                            <div 
                                key={index}
                                className="bg-base-100 p-8 rounded-3xl border border-base-300 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group"
                            >
                                <div className="bg-primary/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                                    <FeatureIcon icon={feature.icon} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-base-content/70 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-20 lg:py-28 bg-base-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4">
                            Explore Our Resort
                        </p>
                        <h2 className="font-gilliequest text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter">
                            Photo <span className="text-primary italic">Gallery</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resortData.images.slice(0, 12).map((image, index) => (
                            <div 
                                key={index}
                                className="relative h-[300px] rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={image}
                                    alt={`Sailor Moon Resort - Image ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Information Section */}
            <section id="booking" className="py-20 lg:py-28 bg-base-200">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-base-100 rounded-3xl p-8 md:p-12 border border-base-300 shadow-xl">
                            <div className="text-center mb-12">
                                <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4">
                                    Plan Your Stay
                                </p>
                                <h2 className="font-gilliequest text-4xl md:text-5xl leading-tight tracking-tighter mb-4">
                                    Booking <span className="text-primary italic">Information</span>
                                </h2>
                                <p className="text-base-content/70 text-lg">
                                    We provide the best price in Saint Martin
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Clock className="size-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Check-in</h3>
                                            <p className="text-base-content/60">{resortData.checkIn}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Clock className="size-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Check-out</h3>
                                            <p className="text-base-content/60">{resortData.checkOut}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Phone className="size-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Contact Numbers</h3>
                                            <div className="space-y-1">
                                                {resortData.contact.phone.map((phone, index) => (
                                                    <a 
                                                        key={index}
                                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                                        className="block text-base-content/70 hover:text-primary transition-colors"
                                                    >
                                                        {phone}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <Mail className="size-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Email Addresses</h3>
                                            <div className="space-y-1">
                                                {resortData.contact.email.map((email, index) => (
                                                    <a 
                                                        key={index}
                                                        href={`mailto:${email}`}
                                                        className="block text-base-content/70 hover:text-primary transition-colors"
                                                    >
                                                        {email}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link 
                                    href="/contact" 
                                    className="btn btn-primary btn-lg rounded-full px-12 text-white shadow-xl shadow-primary/20 group"
                                >
                                    Book Your Stay Now
                                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-xs text-base-content/50 mt-4">*Conditions apply</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-20 lg:py-28 bg-base-100">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4">
                            Find Us
                        </p>
                        <h2 className="font-gilliequest text-4xl md:text-5xl leading-tight tracking-tighter mb-6">
                            Our <span className="text-primary italic">Location</span>
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-base-content/70 text-lg">
                            <MapPin className="size-5 text-primary" />
                            <p>{resortData.location}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
