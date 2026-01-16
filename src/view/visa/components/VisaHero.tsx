import { Globe2, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function VisaHero() {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
                <div className="absolute top-10 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                            <ShieldCheck size={16} />
                            Trusted Visa Consultants
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-magmawave leading-tight text-base-content">
                            Your Global <span className="text-primary italic">Gateway</span> Begins Here
                        </h1>
                        
                        <p className="text-xl text-base-content/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Expert visa processing services for over 50+ countries. We handle the complexity so you can focus on your journey.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                Apply Now
                            </button>
                            <button className="px-8 py-4 bg-white text-base-content rounded-2xl font-bold border border-base-200 hover:bg-base-50 transition-all">
                                Check Eligibility
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-base-100 rounded-xl shadow-sm border border-base-200">
                                    <Globe2 className="text-primary" size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-lg">50+</h4>
                                    <p className="text-xs text-base-content/40">Countries Served</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-base-100 rounded-xl shadow-sm border border-base-200">
                                    <Clock className="text-primary" size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-lg">3-5 Days</h4>
                                    <p className="text-xs text-base-content/40">Avg. Processing</p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                                <div className="p-3 bg-base-100 rounded-xl shadow-sm border border-base-200">
                                    <CheckCircle2 className="text-primary" size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-lg">99%</h4>
                                    <p className="text-xs text-base-content/40">Success Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex justify-center">
                        <div className="relative z-10 w-full max-w-[600px] aspect-square min-h-[400px] lg:min-h-[500px] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white">
                            <Image 
                                src="https://images.unsplash.com/photo-1619467416348-6a782839e95f?q=80&w=2070&auto=format&fit=crop" 
                                alt="Visa Services" 
                                fill
                                priority
                                className="object-cover hover:scale-110 transition-transform duration-1000"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            />
                        </div>
                        {/* Floating Element */}
                        <div className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-base-200 hidden sm:block animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    { [1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-content overflow-hidden relative">
                                            <Image 
                                                src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                                                alt="User Avatar" 
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">10k+ Applications</p>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-3 h-3 bg-accent rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
