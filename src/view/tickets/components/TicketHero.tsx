
import { Search, Calendar, Users, MapPin } from "lucide-react";

export default function TicketHero() {
    return (
        <section className="relative bg-base-100 border-b border-base-200 lg:min-h-[600px] flex flex-col justify-end pb-20 pt-40 overflow-visible">
            <div className="absolute inset-0 z-0">
                <div 
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-[#001030]/60 backdrop-blur-[2px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center text-white mb-12">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold uppercase tracking-wider mb-6">
                        <PlaneMarker />
                        Fly Anywhere
                    </div>
                    <h1 className="font-magmawave text-5xl md:text-7xl mb-4 tracking-tighter leading-tight text-white drop-shadow-sm">
                        Find Best <span className="text-primary">Flight Deals</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
                        Search and book flights to your favorite destinations with exclusive offers.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-base-100 p-6 rounded-[2rem] shadow-2xl border border-base-200 max-w-4xl mx-auto -mb-32 relative">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <MapPin size={12} /> From
                                </span>
                            </label>
                            <input type="text" placeholder="Dhaka (DAC)" className="input input-bordered rounded-xl font-bold focus:input-primary" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <MapPin size={12} /> To
                                </span>
                            </label>
                            <input type="text" placeholder="Destination" className="input input-bordered rounded-xl font-bold focus:input-primary" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Calendar size={12} /> Date
                                </span>
                            </label>
                            <input type="date" className="input input-bordered rounded-xl font-bold focus:input-primary text-base-content/70" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-base-content/60 uppercase text-xs tracking-wider flex items-center gap-2">
                                    <Users size={12} /> Travelers
                                </span>
                            </label>
                            <select className="select select-bordered rounded-xl font-bold focus:select-primary">
                                <option>1 Passenger</option>
                                <option>2 Passengers</option>
                                <option>3+ Passengers</option>
                            </select>
                        </div>
                    </div>
                    
                    <button className="btn btn-primary w-full mt-6 rounded-xl text-lg gap-2 shadow-lg shadow-primary/30">
                        <Search size={20} />
                        Search Flights
                    </button>
                </div>
            </div>
        </section>
    );
}

function PlaneMarker() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
  )
}
