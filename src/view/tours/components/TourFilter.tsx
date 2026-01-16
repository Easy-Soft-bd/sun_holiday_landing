
import { Calendar, Filter, Search } from "lucide-react";

interface FilterProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    minPrice: number;
    setMinPrice: (val: number) => void;
    maxPrice: number;
    setMaxPrice: (val: number) => void;
}

export default function TourFilter({ 
    searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice 
}: FilterProps) {
    const categories = ["All", "International", "Domestic", "Hajj & Umrah"];

    return (
        <aside className="space-y-8 p-6 bg-base-100 rounded-[2rem] border border-base-200 shadow-sm h-fit sticky top-24">
            <div className="flex items-center gap-2 font-bold text-xl mb-6">
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
                        placeholder="Destination..." 
                        className="input input-bordered w-full rounded-xl pl-10 focus:input-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
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

            {/* Price Range */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Price Range</label>
                <div className="space-y-4">
                     <input 
                        type="range" 
                        min="0" 
                        max="500000" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="range range-xs range-primary" 
                    />
                    <div className="flex items-center justify-between text-sm font-bold text-base-content/70">
                         <span>BDT 0</span>
                         <span className="text-primary">BDT {maxPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

             {/* Date Filter (Native for simplicity) */}
             <div className="space-y-3">
                <label className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Travel Date</label>
                <div className="relative">
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                     <input 
                        type="date" 
                        className="input input-bordered w-full rounded-xl pl-10 focus:input-primary text-base-content/70"
                    />
                </div>
            </div>
        </aside>
    );
}
