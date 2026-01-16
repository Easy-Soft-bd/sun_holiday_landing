"use client";

import { useState, useMemo } from "react";
import TourCard from "./components/TourCard";
import TourFilter from "./components/TourFilter";
import { mockTours } from "./data/mockTours";
import { SlidersHorizontal } from "lucide-react";

export default function ToursView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState(500000);
    const [minPrice, setMinPrice] = useState(0);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const filteredTours = useMemo(() => {
        return mockTours.filter(tour => {
            const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  tour.location.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === "All" || tour.category === selectedCategory;
            
            const matchesPrice = tour.price <= maxPrice && tour.price >= minPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [searchQuery, selectedCategory, maxPrice, minPrice]);

    return (
        <main className="min-h-screen bg-base-50 pb-20">
            {/* Header */}
            <div className="bg-base-100 border-b border-base-200">
                <div className="container mx-auto px-4 pt-32 pb-10 lg:pt-36 lg:pb-12 text-center">
                    <h1 className="font-magmawave text-4xl md:text-5xl mb-3 tracking-tighter leading-tight">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Packages</span>
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto font-light">
                        Curated experiences for every type of traveler. Find your next adventure below.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
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
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                        />
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="font-bold text-base-content/70">
                                Showing {filteredTours.length} packages
                            </p>
                        </div>

                        {filteredTours.length > 0 ? (
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTours.map(tour => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-base-100 rounded-3xl border border-dashed border-base-300">
                                <p className="text-xl font-bold text-base-content/50">No packages found matching your criteria.</p>
                                <button 
                                    className="btn btn-link text-primary mt-2"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                        setMaxPrice(500000);
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
