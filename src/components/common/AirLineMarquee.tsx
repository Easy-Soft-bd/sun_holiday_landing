




import Image from "next/image";
import { Marquee } from "../ui/marquee";

const airlines = [
    { id: 1, url: "/logo/airline/airlinelogo1.png", name: "Emirates" },
    { id: 2, url: "/logo/airline/airlinelogo2.png", name: "Qatar Airways" },
    { id: 3, url: "/logo/airline/airlinelogo3.png", name: "Turkish Airlines" },
    { id: 4, url: "/logo/airline/airlinelogo4.png", name: "Singapore Airlines" },
    { id: 5, url: "/logo/airline/airlinelogo5.png", name: "Etihad" },
    { id: 6, url: "/logo/airline/airlinelogo6.png", name: "Cathay Pacific" },
    { id: 7, url: "/logo/airline/airlinelogo7.png", name: "Biman Bangladesh" },
    { id: 8, url: "/logo/airline/airlinelogo8.png", name: "US-Bangla" },
    { id: 9, url: "/logo/airline/airlinelogo9.png", name: "Air India" },
    { id: 10, url: "/logo/airline/airlinelogo10.png", name: "Indigo" },
    { id: 11, url: "/logo/airline/airlinelogo11.png", name: "Fly Dubai" },
    { id: 12, url: "/logo/airline/airlinelogo12.png", name: "Saudi Arabian" },
];

const LogoCard = ({ url, name }: { url: string; name: string }) => {
    return (
        /* 
           Using px-[5px] on both sides of the card creates 
           exactly a 10px gap between two adjacent logos.
        */
        <div className="relative group flex items-center justify-center px-[5px] ml-10">
            <div className="w-[150px]">
                <Image
                    src={url}
                    alt={`${name} Partner Logo`}
                    width={150}
                    height={100} // Placeholder, h-auto will override
                    priority={false}
                    className="w-[150px] h-auto object-contain grayscale opacity-40 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
            </div>
        </div>
    );
};

export function AirLineMarquee() {
    return (
        <section className="bg-base-100 py-7 lg:py-16 overflow-hidden">
            {/* Premium Title Section */}
            <div className="flex flex-col items-center text-center space-y-4">

                {/* 1. Subtle Animated Subtitle */}
                <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-primary/40 hidden sm:block" />
                    <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] animate-pulse">
                        Global Strategic Alliances
                    </span>
                    <div className="h-px w-8 bg-primary/40 hidden sm:block" />
                </div>

                {/* 2. Main Premium Title */}
                <div className="relative">
                    <h2 className="font-gilliequest text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter text-base-content leading-none">
                        ACCESS <span className="text-primary italic">PARTNER</span> OF
                    </h2>
                    {/* Decorative background number or text for depth */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-7xl md:text-9xl font-black text-base-content/[0.03] select-none -z-10 tracking-widest">
                        GLOBAL
                    </span>
                </div>

                {/* 3. Descriptive Sub-Headline (SEO Rich) */}
                <p className="max-w-xl mx-auto text-sm md:text-base text-base-content/60 font-medium leading-relaxed pt-2">
                    Connecting you to over <span className="text-base-content font-bold italic">500+ destinations</span> through our
                    network of world-class airline partners and industry leaders.
                </p>
            </div>

            {/* Single Marquee Line */}
            <div className="relative flex w-full items-center justify-center">
                <Marquee
                    pauseOnHover
                    className="flex items-center [--gap:10px]" // Syncing the internal marquee gap variable
                >
                    {airlines.map((logo) => (
                        <LogoCard key={logo.id} {...logo} />
                    ))}
                    {/* Map again for a seamless loop if your library doesn't auto-clone */}
                    {airlines.map((logo) => (
                        <LogoCard key={`dup-${logo.id}`} {...logo} />
                    ))}
                </Marquee>

                {/* Subtle Gradient Fades on edges for better UI */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base-100 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base-100 to-transparent z-10" />
            </div>


        </section>
    );
}