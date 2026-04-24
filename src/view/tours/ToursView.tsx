"use client";

import { useState, useMemo } from "react";
import TourCard from "./components/TourCard";
import TourFilter from "./components/TourFilter";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import type { TourRecord } from "@/src/lib/data/tours";

interface ToursViewProps {
    initialTours?: TourRecord[];
}

export default function ToursView({ initialTours = [] }: ToursViewProps) {
    const [tours] = useState<TourRecord[]>(initialTours);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const locationOptions = useMemo(() => {
        const unique = new Set(
            tours
                .map((tour) => String(tour.location || "").trim())
                .filter(Boolean)
        );
        return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
    }, [tours]);

    const filteredTours = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return tours.filter(tour => {
            const matchesSearch =
                !query ||
                tour.title.toLowerCase().includes(query) ||
                tour.location.toLowerCase().includes(query) ||
                String(tour.duration || "").toLowerCase().includes(query);
            
            const matchesCategory = selectedCategory === "All" || tour.category === selectedCategory;
            const matchesLocation = selectedLocation === "All" || tour.location === selectedLocation;

            return matchesSearch && matchesCategory && matchesLocation;
        });
    }, [tours, searchQuery, selectedCategory, selectedLocation]);

    if (!initialTours.length) {
         return (
            <main className="min-h-screen bg-base-50 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="text-primary" size={48} />
                    <p className="text-base-content/60 font-medium">No tour packages are available right now.</p>
                </div>
            </main>
         );
    }

    return (
        <main className="min-h-screen bg-base-50 pb-14 md:pb-20">
            {/* Header */}
            <div className="bg-base-100 border-b border-base-200">
                <div className="container mx-auto px-4 pt-24 pb-8 text-center sm:pt-28 md:pt-32 md:pb-10 lg:pt-36 lg:pb-12">
                    <h1 className="mb-3 font-magmawave text-3xl leading-tight tracking-tighter sm:text-4xl md:text-5xl">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Packages</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-base font-light text-base-content/70 sm:text-lg">
                        Curated experiences for every type of traveler. Find your next adventure below.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                    {/* Mobile Filter Toggle */}
                    <button 
                        className="lg:hidden btn btn-primary w-full gap-2 rounded-xl"
                        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    >
                        <SlidersHorizontal size={18} />
                        {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
                    </button>

                    {/* Filter Sidebar */}
                    <div className={`lg:w-80 shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <TourFilter 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            locationOptions={locationOptions}
                        />
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-5 flex items-center justify-between md:mb-6">
                            <p className="text-sm font-bold text-base-content/70 sm:text-base">
                                Showing {filteredTours.length} packages
                            </p>
                        </div>

                        {filteredTours.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                                {filteredTours.map(tour => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 py-14 text-center md:py-20">
                                <p className="px-4 text-lg font-bold text-base-content/50 md:text-xl">No packages found matching your criteria.</p>
                                <button 
                                    className="btn btn-link text-primary mt-2"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                        setSelectedLocation("All");
                                    }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
