
import { Filter, Search } from "lucide-react";

interface FilterProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    selectedLocation: string;
    setSelectedLocation: (val: string) => void;
    locationOptions: string[];
}

export default function TourFilter({ 
    searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory,
    selectedLocation, setSelectedLocation,
    locationOptions
}: FilterProps) {
    const categories = ["All", "International", "Domestic", "Hajj & Umrah"];

    return (
        <aside className="h-fit space-y-6 rounded-[2rem] border border-base-200 bg-base-100 p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:space-y-8">
            <div className="mb-5 flex items-center gap-2 text-lg font-bold sm:mb-6 sm:text-xl">
                <Filter size={20} className="text-primary" />
                Filters
            </div>

            {/* Search */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Search</label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="Title, location, duration..." 
                        className="input input-bordered w-full rounded-xl pl-10 focus:input-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Location</label>
                <select
                    className="select select-bordered w-full rounded-xl focus:select-primary"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    {locationOptions.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Category</label>
                <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="radio" 
                                name="category" 
                                className="radio radio-primary radio-sm"
                                checked={selectedCategory === cat}
                                onChange={() => setSelectedCategory(cat)}
                            />
                            <span className={`text-base-content/80 group-hover:text-primary transition-colors ${selectedCategory === cat ? 'font-bold text-primary' : ''}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </aside>
    );
}
