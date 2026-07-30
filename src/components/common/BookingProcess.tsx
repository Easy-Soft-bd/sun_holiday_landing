import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PublicIconRenderer from "./PublicIconRenderer";

const steps = [
    {
        id: "01",
        title: "Step 1",
        subtitle: "Find Your Package",
        description: "Find out your best tour Package. Use Search or click here to find the best tour Package for you.",
        icon: "LuSearch",
        link: "/destinations",
        linkText: "Find Package",
    },
    {
        id: "02",
        title: "Step 2",
        subtitle: "Review Details",
        description: "Click details to get information about the tour Package and read the full details about the tour.",
        icon: "LuFileText",
    },
    {
        id: "03",
        title: "Step 3",
        subtitle: "Secure Booking",
        description: "Click on Book Now and fill the form with your correct information to start the process.",
        icon: "LuPointer",
    },
];

const BookingProcess = () => {
    return (
        <section className="bg-base-200/50 py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">

                {/* Header */}
                <div className="max-w-3xl mb-16 lg:mb-24">
                    <h2 className="font-gilliequest text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-6">
                        HOW TO <span className="text-primary italic">BOOK</span> A TRIP
                    </h2>
                    <p className="text-lg text-base-content/60 font-medium border-l-4 border-primary pl-6">
                        Ready for your next adventure? To book a trip, follow the simple instructions below and get started today.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="relative">

                    {/* Desktop Connecting Line (Hidden on Mobile) */}
                    <div className="absolute top-24 left-0 w-full h-px border-t-2 border-dashed border-primary/20 hidden lg:block -z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">

                        {/* Steps 1-3 */}
                        {steps.map((step, i) => (
                            <div key={i} className="group flex flex-col items-start">
                                {/* Step Number & Icon */}
                                <div className="relative mb-8">
                                    <div className="size-16 rounded-2xl bg-base-100 shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <PublicIconRenderer iconName={step.icon} size={28} />
                                    </div>
                                    <span className="absolute -top-4 -right-4 text-4xl font-black text-base-content/5 group-hover:text-primary/10 transition-colors">
                                        {step.id}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-base-content">
                                    {step.title}
                                </h3>
                                    <h4 className="text-xl font-bold text-base-content tracking-tight">
                                        {step.subtitle}
                                    </h4>
                                    <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                                        {step.description}
                                    </p>

                                    {step.link && (
                                        <Link href={step.link} prefetch={false} className="inline-flex items-center gap-2 min-h-11 py-2.5 text-xs font-bold text-base-content hover:text-primary hover:underline underline-offset-4 mt-2">
                                            {step.linkText} <ArrowRight size={14} aria-hidden />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Success Card */}
                        <div className="lg:translate-y-[-10px]">
                            <div className="bg-primary rounded-3xl p-8 text-primary-content shadow-2xl shadow-primary/30 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
                                {/* Decorative background circle */}
                                <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                                <div className="relative z-10 space-y-4">
                                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <PublicIconRenderer iconName="LuCheckCircle" size={24} />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-content">
                                        Success
                                    </h3>
                                    <h4 className="text-xl font-bold tracking-tight">
                                        Ready to Fly!
                                    </h4>
                                    <p className="text-sm text-primary-content leading-relaxed font-medium">
                                        That&apos;s it! Now we will contact you shortly and provide booking confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default BookingProcess;
