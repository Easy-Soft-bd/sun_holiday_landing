import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import AccommodationSection from "./components/AccommodationSection";
import DiningSection from "./components/DiningSection";
import ActivitiesSection from "./components/ActivitiesSection";
import EcoSection from "./components/EcoSection";
import EventsSection from "./components/EventsSection";
import GallerySection from "./components/GallerySection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";

/* ─────────────────────────────────────────────
 *  RESORT CONFIGURATION — Single source of truth
 * ───────────────────────────────────────────── */

export const resortConfig = {
    /* ── General ──────────────────────────────── */
    name: "Sunvia Eco Resort",
    tagline: "Where Nature Meets Luxury",
    subTagline: "Sustainable Luxury Experience",
    established: 2029,
    area: "12 Acres",
    totalUnits: 100,
    guestCapacity: "200–250",
    starRating: "5-Star Eco-Luxury",

    /* ── Location ─────────────────────────────── */
    location: {
        full: "Bhum Dokshin, Singrai, Manikganj, Bangladesh",
        short: "Manikganj, 1 Hour from Dhaka",
        mapEmbedUrl: "",
    },

    /* ── Hero ──────────────────────────────────── */
    hero: {
        backgroundImage:
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop",
        ctaPrimary: { text: "Plan Your Escape", href: "#contact" },
        ctaSecondary: { text: "Explore Gallery", href: "#gallery" },
    },

    /* ── About ─────────────────────────────────── */
    about: {
        heading: "A Nature-Focused Destination",
        description:
            "Spanning 12 lush acres in Manikganj, Sunvia Eco Resort is a premier 5-star destination combining sustainability with modern sophistication. Surrounded by forests, lakes and hills, the resort offers an immersive escape into nature without compromising on luxury. Planned for establishment in 2029, it sets a new benchmark for eco-tourism in Bangladesh.",
        image:
            "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=2074&auto=format&fit=crop",
        highlights: [
            { label: "Area", value: "12 Acres" },
            { label: "Established", value: "2029" },
            { label: "Capacity", value: "200–250 Guests" },
        ],
    },

    /* ── Accommodation ─────────────────────────── */
    accommodations: [
        {
            type: "Deluxe Room",
            description:
                "Spacious rooms featuring modern interiors with calming earth tones, a private balcony overlooking the lake, and all essential amenities for a restful stay.",
            image:
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
            amenities: ["Air Conditioning", "Smart TV", "Minibar", "Lake View", "Wi-Fi", "Balcony"],
        },
        {
            type: "Executive Suite",
            description:
                "Elegant suites with a separate living area, premium furnishings, panoramic views, and an upgraded minibar with local organic refreshments.",
            image:
                "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
            amenities: ["Air Conditioning", "Smart TV", "Minibar", "Lake View", "Wi-Fi", "Balcony"],
        },
        {
            type: "Family Cottage",
            description:
                "Charming standalone cottages surrounded by greenery, perfect for families. Includes multiple bedrooms, a cozy porch, and kid-friendly arrangements.",
            image:
                "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop",
            amenities: ["Air Conditioning", "Smart TV", "Minibar", "Garden View", "Wi-Fi", "Porch"],
        },
        {
            type: "VIP Villa",
            description:
                "Ultra-luxurious private villas with a personal butler, infinity pool access, designer interiors, and an exclusive garden terrace with breathtaking views.",
            image:
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
            amenities: ["Air Conditioning", "Smart TV", "Minibar", "Panoramic View", "Wi-Fi", "Private Pool"],
        },
    ],

    /* ── Dining ────────────────────────────────── */
    dining: {
        heading: "A Culinary Journey",
        description:
            "Savour a world of flavours with our diverse dining options. From traditional Bangla cuisine to international delicacies, every meal is a celebration prepared with the freshest local and organic ingredients.",
        cuisines: [
            "Bangla",
            "Chinese",
            "Indian",
            "Continental",
            "Thai",
            "Bar-B-Q",
            "Organic / Hill Food",
        ],
        experiences: [
            {
                name: "Halal Fine Dining",
                description: "Premium halal cuisine served in an elegant atmosphere.",
                image:
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
            },
            {
                name: "Garden Dining",
                description: "Al-fresco meals surrounded by lush tropical gardens.",
                image:
                    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
            },
            {
                name: "Lakeside Café",
                description: "Casual bites and artisan coffee with serene lake views.",
                image:
                    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
            },
            {
                name: "VIP Private Dining",
                description: "Exclusive dining with a personal chef and curated menu.",
                image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
            },
        ],
    },

    /* ── Activities & Entertainment ────────────── */
    activities: [
        { name: "Swimming Pool", icon: "pool" },
        { name: "Kids Zone", icon: "kids" },
        { name: "Boat Rides", icon: "boat" },
        { name: "Kayak Rides", icon: "kayak" },
        { name: "Cycling", icon: "cycling" },
        { name: "Zip Line", icon: "zipline" },
        { name: "Fishing Zone", icon: "fishing" },
        { name: "Conference Hall", icon: "conference" },
        { name: "Gym & Fitness", icon: "gym" },
        { name: "Spa & Wellness", icon: "spa" },
        { name: "Nature Tours", icon: "nature" },
        { name: "Open Playgrounds", icon: "playground" },
    ],

    /* ── Eco Features ──────────────────────────── */
    ecoFeatures: {
        heading: "Living in Harmony with Nature",
        description:
            "Sunvia Eco Resort is committed to sustainable tourism. Every aspect of our resort is designed to minimise environmental impact while maximising comfort and natural beauty.",
        image:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop",
        features: [
            {
                title: "Solar Power System",
                description: "100% renewable energy powering the entire resort through advanced solar panels.",
            },
            {
                title: "Rainwater Harvesting",
                description: "Sophisticated systems collect and purify rainwater for resort use.",
            },
            {
                title: "Plastic-Free Initiative",
                description: "Complete elimination of single-use plastics across all operations.",
            },
            {
                title: "Forest Surroundings",
                description: "Preserved natural forest canopy covering 40% of the resort grounds.",
            },
            {
                title: "Lake Ecosystem",
                description: "A natural lake supporting local biodiversity and providing scenic beauty.",
            },
            {
                title: "Guided Nature Tours",
                description: "Expert-led eco tours educating guests about local flora and fauna.",
            },
        ],
    },

    /* ── Events & Corporate ────────────────────── */
    events: {
        heading: "Events & Celebrations",
        description:
            "From intimate gatherings to grand celebrations, our versatile event spaces are equipped with world-class facilities to make your occasion truly memorable.",
        maxCapacity: 600,
        services: [
            "Weddings & Receptions",
            "Corporate Conferences",
            "Team Building Retreats",
            "Picnics & Day Events",
            "Sound & Lighting Setup",
            "Decoration & Catering",
        ],
        image:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
    },

    /* ── Additional Services ───────────────────── */
    services: [
        { name: "24/7 Security & CCTV", icon: "security" },
        { name: "Medical Support (50 Guests)", icon: "medical" },
        { name: "Laundry Service", icon: "laundry" },
        { name: "Car Rental", icon: "car" },
        { name: "Tour Guide Assistance", icon: "guide" },
        { name: "Helipad Access", icon: "helipad" },
    ],

    /* ── Gallery ───────────────────────────────── */
    gallery: [
        {
            src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop",
            alt: "Resort Aerial View",
        },
        {
            src: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=2074&auto=format&fit=crop",
            alt: "Luxury Pool Area",
        },
        {
            src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
            alt: "Deluxe Room Interior",
        },
        {
            src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
            alt: "VIP Villa",
        },
        {
            src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
            alt: "Fine Dining",
        },
        {
            src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop",
            alt: "Natural Landscape",
        },
        {
            src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
            alt: "Garden Dining",
        },
        {
            src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
            alt: "Event Space",
        },
        {
            src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
            alt: "Executive Suite",
        },
    ],

    /* ── Target Audience ───────────────────────── */
    targetAudience: ["Families", "Honeymoon Couples", "Corporate Clients"],

    /* ── Special Features ──────────────────────── */
    specialFeatures: ["Helipad", "Two Open Playground Areas"],

    /* ── Contact ───────────────────────────────── */
    contact: {
        phone: ["+88 018 73 83 83 01", "+88 018 73 83 83 02"],
        email: ["info@sunholidaysltd.com", "sunholidays07@gmail.com"],
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
    },
} as const;

/* ─────────────────────────────────────────────
 *  TYPE EXPORT
 * ───────────────────────────────────────────── */
export type ResortConfig = typeof resortConfig;

/* ─────────────────────────────────────────────
 *  VIEW COMPONENT
 * ───────────────────────────────────────────── */
export default function SunviaEcoResortView() {
    return (
        <main className="min-h-screen bg-base-100">
            <HeroSection config={resortConfig} />
            <AboutSection config={resortConfig} />
            <AccommodationSection accommodations={resortConfig.accommodations} />
            <DiningSection dining={resortConfig.dining} />
            <ActivitiesSection activities={resortConfig.activities} />
            <EcoSection eco={resortConfig.ecoFeatures} />
            <EventsSection events={resortConfig.events} />
            <GallerySection gallery={resortConfig.gallery} />
            <ServicesSection services={resortConfig.services} />
            <ContactSection config={resortConfig} />
        </main>
    );
}
