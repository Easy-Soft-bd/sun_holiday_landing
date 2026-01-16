
import { User, Briefcase, Map, Headset, Settings, Megaphone, Calculator } from "lucide-react";

const icons: Record<string, any> = {
    "Head Of Marketing": User,
    "Travel Consultants": Briefcase,
    "Tour Coordinators": Map,
    "Destination Experts": Map,
    "Customer Service Representatives": Headset,
    "Operations Team": Settings,
    "Marketing and Communication Specialists": Megaphone,
    "Finance and Administration": Calculator
};

export default function TeamList() {
    const teams = [
        {
            role: "Head Of Marketing",
            name: "Md. Shariful Hira",
            description: "Leading our marketing initiatives and brand strategy."
        },
        {
            role: "Travel Consultants",
            description: "Our knowledgeable travel consultants are experts in creating personalized itineraries, understanding client preferences, and providing valuable recommendations. They guide you through the planning process and assist in making informed decisions for your travel arrangements."
        },
        {
            role: "Tour Coordinators",
            description: "The tour coordinators are responsible for managing and organizing the logistics of your trip. From coordinating transportation and accommodations to arranging activities and excursions, they ensure a seamless and hassle-free travel experience."
        },
        {
            role: "Destination Experts",
            description: "Our destination experts have an in-depth understanding of specific locations and can provide valuable insights, recommendations, and local expertise. They help curate unique experiences and ensure that you make the most of your time in each destination."
        },
        {
            role: "Customer Service Representatives",
            description: "Our dedicated customer service representatives are here to assist you throughout your journey. They provide support, answer your queries, and address any concerns you may have before, during, and after your trip, ensuring your utmost satisfaction."
        },
        {
            role: "Operations Team",
            description: "The operations team works behind the scenes to ensure smooth coordination and execution of travel arrangements. They liaise with local partners, manage bookings, and oversee the overall logistics to ensure a seamless travel experience."
        },
        {
            role: "Marketing and Communication Specialists",
            description: "Our marketing and communication specialists are responsible for promoting our services, managing our online presence, and keeping our clients informed about the latest offers and updates. They ensure effective communication and engagement with our audience."
        },
        {
            role: "Finance and Administration",
            description: "The finance and administration team handles financial transactions, accounting, and administrative tasks to ensure the smooth functioning of the company operations."
        }
    ];

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {teams.map((team, index) => {
                const Icon = icons[team.role] || User;
                return (
                    <div key={index} className="group relative bg-base-100 p-8 rounded-2xl shadow-sm border border-base-200 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 ease-out" />
                        
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:text-white group-hover:bg-primary transition-all duration-300 shadow-sm group-hover:shadow-primary/30">
                                <Icon size={26} />
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{team.role}</h3>
                            
                            {team.name && (
                                <div className="inline-block border border-primary/20 bg-primary/5 px-3 py-1 rounded-full text-xs font-bold text-primary mb-4 tracking-wide">
                                    {team.name}
                                </div>
                            )}
                            
                            <p className="text-base-content/70 leading-relaxed text-sm">
                                {team.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
