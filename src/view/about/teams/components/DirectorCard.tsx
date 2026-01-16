import { Quote } from "lucide-react";

export default function DirectorCard({ name, title, message, image, reverse = false }: { name: string, title: string, message: string, image: string, reverse?: boolean }) {
    return (
        <div className={`relative flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center lg:items-stretch gap-8 lg:gap-16`}>
            {/* Image Column */}
            <div className="w-full lg:w-[400px] shrink-0 relative group">
                <div className="absolute inset-0 bg-primary/20 translate-x-3 translate-y-3 rounded-[2rem] -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4 duration-500" />
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-base-200 shadow-2xl">
                    <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-[0.9] group-hover:saturate-100"
                    />
                </div>
                
                {/* Name Card overlay on Image */}
                <div className="absolute bottom-6 left-6 right-6 bg-base-100/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg text-center lg:text-left transition-all duration-500 group-hover:bottom-8">
                    <h3 className="text-xl font-bold text-base-content font-serif leading-tight">{name}</h3>
                    <p className="text-primary text-sm font-bold tracking-widest uppercase mt-1">{title}</p>
                </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 relative py-8">
               {/* Decorative Quote Mark */}
               <Quote className="absolute -top-4 -left-4 text-primary/10 w-32 h-32 rotate-180" />
               
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                         <div className="h-px bg-primary/30 w-16" />
                         <span className="text-primary font-bold tracking-wider text-sm uppercase">Message from {title}</span>
                    </div>

                    <div className="prose prose-lg text-base-content/70 leading-relaxed whitespace-pre-line font-light">
                        {message}
                    </div>

                    <div className="pt-8">
                        <p className="font-handwriting text-3xl text-primary">Warmest regards,</p>
                        <div className="mt-4 flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="font-bold text-lg">{name.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="font-bold text-base-content">{name}</p>
                                <p className="text-sm text-base-content/50">{title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
