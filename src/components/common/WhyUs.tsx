import { Award, Star, BadgePercent } from "lucide-react";

const features = [
    {
        icon: Award,
        title: "Experienced",
        desc: "15+ years of travel excellence.",
    },
    {
        icon: Star,
        title: "World Class Service",
        desc: "VIP treatment for every traveler.",
    },
    {
        icon: BadgePercent,
        title: "Best Price Guarantee",
        desc: "No hidden fees, only best rates.",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="bg-base-100 py-10 border-y border-base-200">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                    {/* Section Heading - Compact Side version */}
                    <div className="shrink-0 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-base-300 pb-6 lg:pb-0 lg:pr-12">
                        <h2 className="font-gilliequest text-3xl md:text-4xl uppercase tracking-tighter leading-none">
                            Why Choose <br />
                            <span className="text-primary italic">Sun Holidays</span>
                        </h2>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
                        {features.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-base-200/50 hover:bg-base-100 hover:shadow-xl hover:shadow-primary/5 transition-all group border border-transparent hover:border-primary/20"
                            >
                                {/* Icon Circle */}
                                <div className="shrink-0 size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <item.icon size={24} strokeWidth={2.5} />
                                </div>

                                {/* Text Content */}
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-base text-base-content leading-none">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-base-content/50 font-medium italic leading-tight">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;