import { Eye, Heart, Users, MapPin, Calendar } from "lucide-react";

export default function AboutView() {
    return (
        <main className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-primary/5">
                <div className="absolute inset-0 z-0">
                    <div 
                        className="w-full h-full bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-100" />
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter font-magmawave">
                        About <span className="text-primary ">Sun Holidays</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-base-content/70 max-w-2xl mx-auto font-medium">
                        Crafting unforgettable journeys since 2021.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 relative">
                        <div className="absolute -inset-4 bg-secondary/10 rounded-3xl -z-10 rotate-3" />
                         <img 
                            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop" 
                            alt="Group of friends traveling" 
                            className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
                        />
                         <div className="absolute -bottom-6 -right-6 bg-base-100 p-4 rounded-xl shadow-lg border border-base-200">
                             <div className="flex items-center gap-2 text-primary font-bold">
                                 <Calendar size={20} />
                                 <span>Est. Nov 8, 2021</span>
                             </div>
                         </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                            <Users size={16} />
                            Our Origin
                        </div>
                        <h2 className="text-4xl font-bold">Born from Passion</h2>
                        <div className="space-y-4 text-lg text-base-content/80 leading-relaxed">
                            <p>
                                Sun Holidays Ltd. started when a group of friends decided to make something out of their common passion for travel. 
                            </p>
                            <p>
                                Armed with a wide array of experience brought by their many travels within Bangladesh and abroad, these friends bonded together to form Sun Holidays Ltd.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Grid */}
            <section className="py-20 bg-base-200/50">
                <div className="container mx-auto px-4">
                   <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                       {/* Vision Card */}
                       <div className="bg-base-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow border border-base-200 group">
                           <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                               <Eye size={32} />
                           </div>
                           <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                           <p className="text-base-content/70 leading-relaxed mb-6">
                               To be the First Choice for Clients and Companies. Our personnel are dedicated to learning as much about a destination as possible.
                           </p>
                           <p className="text-base-content/70 leading-relaxed">
                               We are the type of travelers that come back from a city with an abundance of suggestions. We can recommend beaches, hidden oases, restaurants, and shopping to curiosity.
                           </p>
                       </div>

                       {/* Mission Card */}
                       <div className="bg-base-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow border border-base-200 group">
                           <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                               <Heart size={32} />
                           </div>
                           <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                           <p className="text-base-content/70 leading-relaxed mb-6">
                               Customer Service with Care, Empathy & Love. To create and provide a total Travel Management Package in terms of providing comprehensive and professionally effective service at minimum cost to the customer.
                           </p>
                           <p className="text-base-content/70 leading-relaxed">
                               We utilize an environment that promotes total commitment and growth, aiming to become the largest and most reliable Travel Organization in the region.
                           </p>
                       </div>
                   </div>
                </div>
            </section>

             {/* Location Section */}
             <section className="py-20 container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto bg-primary/5 p-12 rounded-[2rem] border border-primary/10">
                    <MapPin className="mx-auto size-12 text-primary mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
                    <p className="text-xl text-base-content/70 mb-8">
                        362/1, Holding 13/1 (2nd Floor), Old-27 New-16<br/>
                        Dhanmondi, Dhaka-1209, Bangladesh.
                    </p>
                     <div className="flex flex-wrap justify-center gap-4">
                        <a href="mailto:info@sunholidaysltd.com" className="btn btn-primary rounded-full px-8 text-white">Contact Us</a>
                        <a href="tel:+8801873838301" className="btn btn-ghost hover:bg-base-100 border border-base-300 rounded-full px-8">Call Support</a>
                    </div>
                </div>
             </section>
        </main>
    );
}
