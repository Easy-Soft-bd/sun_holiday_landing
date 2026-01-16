import DirectorCard from "./components/DirectorCard";
import TeamList from "./components/TeamList";

const directors = [
    {
        name: "Md. Ferdous",
        title: "Chairman",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop", // Placeholder
        message: `I hope this message finds you in good health and high spirits. As the Director of Sun Holidays Ltd, I want to express my sincere appreciation for your trust and loyalty as one of our valued travelers. Your continued support means a great deal to us. In the ever-changing landscape of the travel industry, we understand the importance of ensuring your safety, comfort, and satisfaction throughout your journey. Rest assured that our team is working tirelessly to meet these expectations and provide you with the best possible experience. 
        
        We recognize that traveling in today's world requires extra caution and adaptability. That's why we have implemented robust health and safety measures to prioritize your well-being. Our staff is trained to adhere to these protocols diligently, ensuring a secure environment for all travelers. If you have any questions, concerns, or special requests, our dedicated customer service team is available around the clock to assist you. Please don't hesitate to reach out to them, as they are here to address any queries you may have and provide the necessary support. Once again, thank you for choosing Sun Holidays Ltd as your travel partner. We eagerly look forward to welcoming you on board and providing you with an exceptional travel experience that will create cherished memories for a lifetime.`
    },
    {
        name: "Sayed Zillur Rahman",
        title: "Vice Chairman",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop", // Placeholder
        message: `As the Vice Chairman of Sun Holidays Ltd, I take great pride in extending a warm welcome to you. We understand that travel is not just about reaching a destination; it's about embarking on a journey that leaves an indelible mark on your soul.
        
        Our dedicated team is committed to crafting extraordinary experiences that cater to your every desire and ensure your travel dreams come to life. At Sun Holidays, we believe that travel should be a seamless and enriching experience. From the moment you embark on your journey until your return, our team works tirelessly to provide impeccable service, exceptional accommodations, and immersive activities that showcase the beauty and culture of each destination.`
    },
    {
        name: "Md. Asaduzzaman",
        title: "Managing Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop", // Placeholder
        message: `I hope this message finds you in good health and high spirits. As the Managing Director of our Sun Holidays Ltd, I wanted to take a moment to reach out and express my gratitude for your trust and loyalty as one of our valued travelers.
        
        In light of recent developments and changes in the travel industry, I wanted to assure you that our team is working tirelessly to ensure your safety, comfort, and satisfaction throughout your journey with us. We understand that traveling in today's world requires extra caution and adaptability, and we are committed to providing you with the best possible experience while prioritizing your well-being. Should you have any questions, concerns, or special requests, please do not hesitate to reach out to our dedicated customer service team. They are available around the clock to assist you and address any queries you may have. Once again, thank you for choosing us as your travel partner. We look forward to welcoming you on board and providing you with an exceptional travel experience that will leave you with cherished memories for a lifetime.`
    }
];

export default function TeamsView() {
    return (
        <main className="min-h-screen bg-base-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-base-100 border-b border-base-200 overflow-hidden">
                {/* Background Pattern/Image */}
                <div className="absolute inset-0 bg-primary/5">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50" />
                </div>

                <div className="container mx-auto px-4 pt-32 pb-20 lg:pt-40 lg:pb-28 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 backdrop-blur-sm border border-base-200 text-primary text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Excellence in Leadership
                        </div>
                        
                        <h1 className="font-magmawave text-5xl md:text-7xl  mb-6 tracking-tighter leading-tight">
                            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Visionaries</span> <br />
                            <span className="font-gilliequest text-4xl md:text-6xl text-base-content/80 italic uppercase">Behind Your Journey</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto font-light leading-relaxed">
                            The dedicated professionals working tirelessly to craft unforgettable travel experiences just for you.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Board of Directors */}
                <section className="space-y-8">
                    {directors.map((director, index) => (
                        <DirectorCard 
                            key={index}
                            {...director}
                            reverse={index % 2 !== 0}
                        />
                    ))}
                </section>

                {/* Team Departments */}
                <section className="pt-12">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Valuable Team</h2>
                        <p className="text-base-content/70 max-w-2xl mx-auto">
                            Professionals in various designations, each playing a crucial role in ensuring exceptional service.
                        </p>
                    </div>
                    <TeamList />
                </section>
            </div>
        </main>
    );
}
