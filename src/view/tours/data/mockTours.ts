
export type TourCategory = 'International' | 'Domestic' | 'Hajj & Umrah';

export interface TourItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface TourPackage {
    id: string;
    title: string;
    location: string;
    price: number;
    duration: string;
    category: TourCategory;
    image: string;
    startDate?: string;
    rating: number;
    reviews: number;
    description: string;
    highlights: string[];
    itinerary: TourItineraryDay[];
    includes: string[];
    excludes: string[];
    gallery: string[];
    videoUrl?: string;
}

export const mockTours: TourPackage[] = [
    {
        id: '1',
        title: "Cox's Bazar Beach Paradise",
        location: "Cox's Bazar, Bangladesh",
        price: 5500,
        duration: "3 Days / 2 Nights",
        category: "Domestic",
        image: "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
        rating: 4.8,
        reviews: 124,
        startDate: "2024-02-10",
        description: "Experience the world's longest natural sea beach in Cox's Bazar. Relax on the sandy shores, witness breathtaking sunsets, and enjoy fresh seafood. This package offers a perfect blend of relaxation and adventure.",
        highlights: [
            "Sunset viewing at Laboni Point",
            "Drive along the Marine Drive",
            "Visit to Himchari National Park",
            "Traditional seafood dinner"
        ],
        itinerary: [
            { day: 1, title: "Arrival & Beach Leisure", description: "Arrive at Cox's Bazar in the morning. Check-in to your hotel. Spend the afternoon relaxing at the beach and enjoying the sunset." },
            { day: 2, title: "Marine Drive & Himchari", description: "Morning drive along the scenic Marine Drive road. Visit Inani Beach and Himchari National Park. Evening free for shopping at the Burmese Market." },
            { day: 3, title: "Departure", description: "Morning free for leisure. Check-out and transfer to bus station/airport for departure." }
        ],
        includes: ["AC Bus tickets (Dhaka-Cox's Bazar-Dhaka)", "2 Nights accommodation (Twin share)", "Breakfast at hotel", "Sightseeing transport"],
        excludes: ["Lunch and Dinner", "Personal expenses", "Entry fees to parks"],
        gallery: [
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2070&auto=format&fit=crop",

        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '2',
        title: "Magical Saint Martin's Island",
        location: "Saint Martin, Bangladesh",
        price: 8500,
        duration: "3 Days / 2 Nights",
        category: "Domestic",
        image: "https://images.unsplash.com/photo-1684689799775-e77a87667188?q=80&w=2070&auto=format&fit=crop",
        rating: 4.9,
        reviews: 85,
        startDate: "2024-02-15",
        description: "Escape to Bangladesh's only coral island, Saint Martin's. Crystal clear blue waters, coconut groves, and fresh coral reefs await you. A true tropical paradise experience.",
        highlights: [
            "Cruise journey from Teknaf",
            "Snorkeling in blue water",
            "Visit to Chera Dwip",
            "Beachside BBQ dinner"
        ],
        itinerary: [
            { day: 1, title: "Journey to the Island", description: "Bus journey to Teknaf, then ship cruise to St. Martin. Check-in and enjoy the sunset on the West Beach." },
            { day: 2, title: "Chera Dwip Adventure", description: "Boat trip to Chera Dwip. Explore the corals and aquatic life. Afternoon leisure/snorkeling. BBQ dinner at night." },
            { day: 3, title: "Return Journey", description: "Morning free time. Board the ship at 3:00 PM for Teknaf, then bus back to Dhaka." }
        ],
        includes: ["Bus & Ship tickets", "2 Nights resort accommodation", "All meals on the island", "Chera Dwip boat trip"],
        excludes: ["Snorkeling gear rental", "Personal expenses"],
        gallery: [
            "https://images.unsplash.com/photo-1684689799775-e77a87667188?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1684689799775-e77a87667188?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1684689799775-e77a87667188?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1684689799775-e77a87667188?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1684689799775-e77a87667188?q=80&w=2070&auto=format&fit=crop",
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '3',
        title: "Sajek Valley Clouds",
        location: "Rangamati, Bangladesh",
        price: 6500,
        duration: "2 Days / 3 Nights",
        category: "Domestic",
        image: "https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        reviews: 92,
        startDate: "2024-02-20",
        description: "Touch the clouds at Sajek Valley, the 'Queen of Hills'. Famous for its morning cloud sea and serene green hills, Sajek offers a peaceful retreat amidst nature.",
        highlights: ["Sunrise over the clouds", "Konglak Para trek", "Alutila Cave expidition", "Hanging Bridge in Rangamati"],
        itinerary: [
             { day: 1, title: "Journey to Hills", description: "Overnight journey to Khagrachari. Jeep ride (Chander Gari) to Sajek. Check-in and sunset view." },
             { day: 2, title: "Exploring Sajek", description: "Early morning cloud view. Treasury trek to Konglak Para. Evening BBQ and campfire." },
             { day: 3, title: "Khagrachari Tour & Return", description: "Drive back to Khagrachari. Visit Alutila Cave and Tareng. Night bus to Dhaka." }
        ],
        includes: ["Dhaka-Khagrachari bus", "Jeep Safari", "Resort stay", "All meals"],
        excludes: ["Personal medications", "Entry tickets"],
        gallery: [
            "https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?q=80&w=2070&auto=format&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '4',
        title: "Discover Dubai",
        location: "Dubai, UAE",
        price: 45000,
        duration: "5 Days / 4 Nights",
        category: "International",
        image: "https://images.unsplash.com/photo-1643904736472-8b77e93ca3d7?q=80&w=2070&auto=format&fit=crop",
        rating: 4.9,
        reviews: 210,
        startDate: "2024-03-01",
        description: "Experience the glitz and glamour of Dubai. From the world's tallest building to desert safaris and luxury shopping, Dubai has it all.",
        highlights: ["Burj Khalifa Observation Deck", "Desert Safari with BBQ Dinner", "Dhow Cruise Marina", "Dubai Mall Aquarium"],
        itinerary: [
             { day: 1, title: "Arrival & Dhow Cruise", description: "Arrival at DXB. Transfer to hotel. Evening Marina Dhow Cruise with dinner." },
             { day: 2, title: "City Tour & Burj Khalifa", description: "Half-day Dubai city tour. Evening visit to Burj Khalifa 124th floor." },
             { day: 3, title: "Desert Safari", description: "Morning free. Afternoon pick-up for Desert Safari (Dune bashing, Camel ride, BBQ)." },
             { day: 4, title: "Free Day", description: "Day free for shopping or Miracle Garden visit (optional)." },
             { day: 5, title: "Departure", description: "Check-out and airport transfer." }
        ],
        includes: ["4 Nights 3* Hotel", "Daily Breakfast", "Airport Transfers", "Visa processing", "Tours mentioned"],
        excludes: ["Airfare", "Tourism Dirham Fee", "Lunch & Dinner"],
        gallery: [
            "https://images.unsplash.com/photo-1643904736472-8b77e93ca3d7?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1643904736472-8b77e93ca3d7?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1643904736472-8b77e93ca3d7?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1643904736472-8b77e93ca3d7?q=80&w=2070&auto=format&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '5',
        title: "Bangkok & Pattaya Escape",
        location: "Thailand",
        price: 32000,
        duration: "5 Days / 4 Nights",
        category: "International",
        image: "https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop",
        rating: 4.6,
        reviews: 156,
        startDate: "2024-03-05",
        description: "The perfect mix of city life and beach relaxation. Explore the vibrant streets of Bangkok and the coral islands of Pattaya.",
        highlights: ["Coral Island Tour (Pattaya)", "Bangkok City Temple Tour", "Alcazar Show", "Shopping at MBK/Pratunam"],
        itinerary: [
            { day: 1, title: "Arrival", description: "Arrival at BKK. Transfer to Pattaya. Check-in." },
            { day: 2, title: "Coral Island", description: "Speedboat to Coral Island with lunch. Evening free." },
            { day: 3, title: "Bangkok Transfer", description: "Transfer to Bangkok. En route city temple tour." },
            { day: 4, title: "Free Day", description: "Full day free for shopping or optional Safari World tour." },
            { day: 5, title: "Departure", description: "Airport transfer." }
        ],
        includes: ["Hotel Accommodation", "Breakfast", "All Transfers", "Sightseeing"],
        excludes: ["Airfare", "Visa Fee", "Personal Expenses"],
        gallery: [
            "https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1626018517488-5b64242cfa75?q=80&w=2070&auto=format&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '6',
        title: "Premium Umrah Package",
        location: "Mecca & Medina, Saudi Arabia",
        price: 150000,
        duration: "14 Days",
        category: "Hajj & Umrah",
        image: "https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop",
        rating: 5.0,
        reviews: 340,
        startDate: "2024-02-25",
        description: "Perform your Umrah with peace of mind. Our premium package ensures 5-star accommodation near the Haram, transport, and complete guide support.",
        highlights: ["5-Star Hotels near Haram", "Private Transport", "Ziyarah in Makkah & Madinah", "Visa Processing"],
        itinerary: [
             { day: 1, title: "Departure", description: "Flight to Jeddah. Transfer to Makkah. Perform Umrah." },
             { day: 2, title: "Makkah Stay", description: "Ibadah in Makkah." },
             { day: 3, title: "Ziyarah Makkah", description: "Visit historical sites (Jabal Noor, Arafat, Mina)." },
             { day: 8, title: "Transfer to Madinah", description: "Luxury bus/train to Madinah." },
             { day: 9, title: "Ziyarah Madinah", description: "Visit Masjid Quba, Uhud, Qiblatun." },
             { day: 14, title: "Return", description: "Transfer to Madinah/Jeddah airport." }
        ],
         includes: ["Visa", "Airfare", "Hotel Stay", "Transport", "Guide"],
         excludes: ["Food (optional add-on)", "Personal Shopping"],
         gallery: [
             "https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1720549973451-018d3623b55a?q=80&w=2070&auto=format&fit=crop"
         ],
         videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '7',
        title: "Istanbul Cultural Tour",
        location: "Istanbul, Turkey",
        price: 65000,
        duration: "6 Days / 5 Nights",
        category: "International",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop",
        rating: 4.8,
        reviews: 98,
        startDate: "2024-03-10",
        description: "Where East meets West. Discover the rich history of the Ottoman Empire, cruise the Bosphorus, and shop at the Grand Bazaar.",
        highlights: ["Hagia Sophia & Blue Mosque", "Bosphorus Cruise", "Topkapi Palace", "Grand Bazaar"],
        itinerary: [
            { day: 1, title: "Arrival", description: "Arrival in Istanbul. Transfer to Hotel." },
            { day: 2, title: "Old City Tour", description: "Visit Sultanahmet square, Blue Mosque, Hagia Sophia." },
            { day: 3, title: "Bosphorus Cruise", description: "Half day cruise. Spice Bazaar visit." },
            { day: 4, title: "Princess Island", description: "Ferry trip to Princess Island (Buyukada)." },
            { day: 5, title: "Shopping", description: "Free day for Grand Bazaar/Taksim Square." },
            { day: 6, title: "Departure", description: "Transfer to airport." }
        ],
        includes: ["Hotel", "Breakfast", "Tours", "Transfers"],
        excludes: ["Airfare", "Visa", "Lunch/Dinner"],
        gallery: [
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2070&auto=format&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '8',
        title: "Standard Hajj Package",
        location: "Mecca, Saudi Arabia",
        price: 450000,
        duration: "21 Days",
        category: "Hajj & Umrah",
        image: "https://images.unsplash.com/photo-1704104501136-8f35402af395?q=80&w=2000&auto=format&fit=crop",
        rating: 4.9,
        reviews: 112,
        startDate: "2024-06-15",
        description: "Fulfill your obligation of Hajj with our reliable standard package. We take care of logistics so you can focus on your prayers.",
        highlights: ["Shifting/Non-shifting options", "Moallim Service", "Mina & Arafat tents", "Full board meals"],
        itinerary: [
            { day: 1, title: "Arrival", description: "Arrival and Ihram." },
            { day: 2, title: "Aziziyah/Hotel", description: "Stay and prep for Hajj days." },
            { day: 8, title: "Mina", description: "Move to Mina tents." },
            { day: 9, title: "Arafat", description: "The day of Hajj." },
            { day: 10, title: "Muzdalifah & Jamaraat", description: "Collect pebbles, stoning, Tawaf Al-Ifadah." }
        ],
        includes: ["Visa", "Ticket", "Accommodation", "Food", "Hajj Draft"],
        excludes: ["Qurbani", "Personal expenses"],
        gallery: [
            "https://images.unsplash.com/photo-1704104501136-8f35402af395?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1704104501136-8f35402af395?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1704104501136-8f35402af395?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1704104501136-8f35402af395?q=80&w=2000&auto=format&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    },
    {
        id: '9',
        title: "Sundarbans Adventure",
        location: "Khulna, Bangladesh",
        price: 12500,
        duration: "3 Days / 2 Nights",
        category: "Domestic",
        image: "https://images.unsplash.com/photo-1706459671567-43529d418cd1?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        reviews: 67,
        startDate: "2024-02-28",
        description: "Explore the world's largest mangrove forest. Spot the Royal Bengal Tiger (if lucky!), deer, and crocodiles while cruising on a luxury vessel.",
        highlights: ["Kotka Beach", "Harbaria Eco Park", "Silent Boat Trip", "Jamtola Watch Tower"],
        itinerary: [
            { day: 1, title: "Boarding", description: "Board ship at Khulna/Mongla. Cruise towards forest. Stop at Harbaria." },
            { day: 2, title: "Kotka & Jamtola", description: "Early morning boat ride. Jungle trek to Jamtola beach. BBQ night." },
            { day: 3, title: "Karamjal & Return", description: "Visit Karamjal crocodile breeding center. Return to Khulna." }
        ],
        includes: ["Ship Cruise", "All Meals", "Forest Permission", "Guide", "Armed Guard"],
        excludes: ["Bus to Khulna", "Personal tips"],
        gallery: [
            "https://images.unsplash.com/photo-1706459671567-43529d418cd1?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1706459671567-43529d418cd1?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1706459671567-43529d418cd1?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1706459671567-43529d418cd1?q=80&w=2070&auto=format&fit=crop"
        ],
        videoUrl: "https://www.youtube.com/watch?v=-758gHCMn0M"
    }
];
