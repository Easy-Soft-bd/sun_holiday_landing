
"use client";

import { visaServices } from "./data/visaData";
import VisaHero from "./components/VisaHero";
import VisaCard from "./components/VisaCard";
import VisaProcess from "./components/VisaProcess";
import { Search, Filter, ShieldCheck, Wallet, Bell } from "lucide-react";

export default function VisaView() {
    return (
        <main className="min-h-screen bg-base-50">
            <VisaHero />
            
            <div className="container mx-auto px-4 -mt-12 relative z-30 pb-32">
                {/* Search & Filter Bar */}
                <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-2xl border border-white flex flex-col md:flex-row gap-4 items-center mb-16">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/30" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by country (e.g. Dubai, UK...)"
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-base-100/50 border-none focus:ring-2 focus:ring-primary/20 transition-all text-base-content"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-6 py-4 bg-base-100/50 rounded-2xl border border-base-200 text-sm font-bold text-base-content/60 hover:bg-white transition-all flex-1 md:flex-none">
                            <Filter size={18} />
                            All Types
                        </button>
                        <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex-1 md:flex-none">
                            Find Visa
                        </button>
                    </div>
                </div>

                {/* Country Grid */}
                <div className="space-y-12">
                    <div className="flex items-end justify-between px-2">
                        <div>
                            <h2 className="text-4xl font-magmawave text-base-content">Popular <span className="text-primary italic">Destinations</span></h2>
                            <p className="text-base-content/50 mt-1">Explore top visa services requested by our clients.</p>
                        </div>
                        <button className="text-primary font-bold text-sm hover:underline underline-offset-4">View All Countries</button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visaServices.map((visa) => (
                            <VisaCard key={visa.id} visa={visa} />
                        ))}
                    </div>
                </div>

                {/* Process Section */}
                <VisaProcess />

                {/* Trust Section/Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="p-8 bg-white rounded-[2rem] border border-base-200 space-y-4">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <Wallet size={28} />
                        </div>
                        <h3 className="text-xl font-bold">Transparent Pricing</h3>
                        <p className="text-base-content/60 text-sm">No hidden charges. Detailed breakdown of all embassy fees and service charges.</p>
                    </div>
                    <div className="p-8 bg-white rounded-[2rem] border border-base-200 space-y-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold">Documentation Support</h3>
                        <p className="text-base-content/60 text-sm">Our experts assist you with perfecting every document requirement.</p>
                    </div>
                    <div className="p-8 bg-white rounded-[2rem] border border-base-200 space-y-4">
                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                            <Bell size={28} />
                        </div>
                        <h3 className="text-xl font-bold">Update Notifications</h3>
                        <p className="text-base-content/60 text-sm">Real-time SMS and email updates on your application status.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
