
export default function ContactHero() {
    return (
        <section className="relative bg-base-100 border-b border-base-200 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div 
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-100" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto px-4 pt-32 pb-20 lg:pt-40 lg:pb-28 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 backdrop-blur-sm border border-base-200 text-primary text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    24/7 Support Available
                </div>

                <h1 className="font-magmawave text-5xl md:text-7xl mb-6 tracking-tighter leading-tight">
                    Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span> <br />
                    <span className="font-gilliequest text-4xl md:text-6xl text-base-content/80 italic uppercase">We're Here to Help</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto font-light leading-relaxed">
                    Whether you need travel advice, booking assistance, or just want to say hello, our team is ready to assist you.
                </p>
            </div>
        </section>
    );
}
