
export type TourCategory = 'International' | 'Domestic' | 'Hajj & Umrah';

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
        startDate: "2024-02-10"
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
        startDate: "2024-02-15"
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
        startDate: "2024-02-20"
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
        startDate: "2024-03-01"
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
        startDate: "2024-03-05"
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
        startDate: "2024-02-25"
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
        startDate: "2024-03-10"
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
        startDate: "2024-06-15"
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
        startDate: "2024-02-28"
    }
];
