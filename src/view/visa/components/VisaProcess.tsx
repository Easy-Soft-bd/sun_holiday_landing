
import { ClipboardList, FileCheck, CreditCard, TicketCheck } from "lucide-react";

const steps = [
    {
        title: "Submit Documents",
        description: "Upload or send your passport and supporting documents to our team.",
        icon: ClipboardList,
        color: "bg-blue-500"
    },
    {
        title: "Expert Review",
        description: "Our visa specialists review your documents to ensure 100% compliance.",
        icon: FileCheck,
        color: "bg-purple-500"
    },
    {
        title: "Application & Payment",
        description: "We process your application with the respective embassy/consulate.",
        icon: CreditCard,
        color: "bg-orange-500"
    },
    {
        title: "Visa Approval",
        description: "Receive your visa and get ready for your dream destination.",
        icon: TicketCheck,
        color: "bg-green-500"
    }
];

export default function VisaProcess() {
    return (
        <section className="py-24 bg-slate-900 text-white rounded-[4rem] my-20 overflow-hidden relative">
            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-magmawave">How It <span className="text-primary italic">Works</span></h2>
                    <p className="text-white/50">Our streamlined 4-step process ensures a stress-free visa application experience.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`w-24 h-24 ${step.color} rounded-3xl flex items-center justify-center p-6 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                    <step.icon size={40} className="text-white" />
                                </div>
                                
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                                </div>

                                <div className="absolute top-0 right-0 text-6xl font-black text-white/10 select-none -z-10 group-hover:text-primary/20 transition-colors">
                                    {idx + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <p className="text-white/60 mb-8 max-w-lg mx-auto">Ready to start? Speak with our visa consultant today for a free consultation.</p>
                    <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary hover:text-white transition-all shadow-2xl">
                        Schedule a Consultation
                    </button>
                </div>
            </div>
        </section>
    );
}
