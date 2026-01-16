
import { Plane, ArrowRight } from "lucide-react";

export default function PopularRoutes() {
    const routes = [
        {
            from: "Dhaka",
            to: "Dubai",
            price: 45000,
            airline: "Emirates",
            image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000&auto=format&fit=crop"
        },
        {
            from: "Dhaka",
            to: "Bangkok",
            price: 32000,
            airline: "US-Bangla Airlines",
            image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2000&auto=format&fit=crop"
        },
        {
            from: "Dhaka",
            to: "Cox's Bazar",
            price: 4500,
            airline: "Biman Bangladesh",
            image: "https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=2000&auto=format&fit=crop"
        },
        {
            from: "Dhaka",
            to: "Singapore",
            price: 55000,
            airline: "Singapore Airlines",
            image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=2000&auto=format&fit=crop"
        }
    ];

    const currencyFormatter = new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return (
        <section className="py-20 bg-base-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-magmawave text-4xl mb-4">Popular <span className="text-primary">Routes</span></h2>
                    <p className="text-base-content/70">Frequently booked destinations by our travelers.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {routes.map((route, index) => (
                        <div key={index} className="group bg-base-100 rounded-3xl overflow-hidden shadow-sm border border-base-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="h-40 overflow-hidden relative">
                                <img 
                                    src={route.image} 
                                    alt={`${route.from} to ${route.to}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white font-bold flex items-center gap-2">
                                    {route.from} <ArrowRight size={16} /> {route.to}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase tracking-wider mb-2">
                                    <Plane size={14} />
                                    {route.airline}
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-base-content/60 mb-1">Starts from</p>
                                        <p className="text-xl font-black text-primary">{currencyFormatter.format(route.price)}</p>
                                    </div>
                                    <button className="btn btn-sm btn-ghost text-primary hover:bg-primary/10 rounded-full">Book Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
