import { Eye, Heart, Users, MapPin, Calendar } from "lucide-react";
import ClientOnly from "@/src/components/common/ClientOnly";
import type { AboutPageData } from "./about-page-data";
import { defaultAboutPageData } from "./about-page-data";
import RichTextHtml from "@/src/components/common/RichTextHtml";

type Props = {
    data?: Partial<AboutPageData>;
    admin?: boolean;
};

async function AboutAdminSlot({ data }: { data: AboutPageData }) {
    const AboutAdminControl = (await import("./AboutAdminControl")).default;
    return (
        <ClientOnly>
            <div className="absolute right-4 top-4 z-50">
                <AboutAdminControl data={data} />
            </div>
        </ClientOnly>
    );
}

export default async function AboutView({ data, admin = false }: Props) {
    const aboutData = { ...defaultAboutPageData, ...data };
    return (
        <main className="group/about min-h-screen bg-base-100">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-base-100">
                {admin ? <AboutAdminSlot data={aboutData} /> : null}
                <div className="absolute inset-0 z-0">
                    <div 
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${aboutData.heroBackgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-100" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
                    {/* <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50" /> */}
                </div>

                <div className="container mx-auto px-4 pt-32 pb-20 lg:pt-40 lg:pb-28 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 backdrop-blur-sm border border-base-200 text-primary text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {aboutData.heroBadgeText}
                    </div>

                    <h1 className="font-magmawave text-5xl md:text-7xl mb-6 tracking-tighter leading-tight">
                        {aboutData.heroTitleMain.split(" ").slice(0, -2).join(" ")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {aboutData.heroTitleMain.split(" ").slice(-2).join(" ")}
                        </span>{" "}
                        <br />
                        <span className="font-gilliequest text-4xl md:text-6xl text-base-content/80 italic uppercase">
                            {aboutData.heroTitleSub}
                        </span>
                    </h1>
                    <RichTextHtml
                        html={aboutData.heroDescription}
                        className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-base-content/60 md:text-2xl"
                    />
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-12 md:py-20 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 relative w-full max-w-lg md:max-w-none">
                        <div className="absolute inset-0 md:-inset-4 bg-secondary/10 rounded-3xl -z-10 rotate-1 md:rotate-3" />
                         <img 
                            src={aboutData.storyImage} 
                            alt="Group of friends traveling" 
                            className="rounded-2xl shadow-2xl w-full object-cover aspect-video"
                        />
                         <div className="absolute -bottom-6 right-4 md:-right-6 bg-base-100 p-4 rounded-xl shadow-lg border border-base-200">
                             <div className="flex items-center gap-2 text-primary font-bold">
                                 <Calendar size={20} />
                                 <span>{aboutData.heroBadgeText}</span>
                             </div>
                         </div>
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                            <Users size={16} />
                            {aboutData.storyBadgeText}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">{aboutData.storyTitle}</h2>
                        <div className="space-y-4 text-lg text-base-content/80 leading-relaxed">
                            <RichTextHtml html={aboutData.storyParagraph1} className="text-lg text-base-content/80" />
                            <RichTextHtml html={aboutData.storyParagraph2} className="text-lg text-base-content/80" />
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
                           <h3 className="text-3xl font-bold mb-4">{aboutData.visionTitle}</h3>
                           <RichTextHtml html={aboutData.visionParagraph1} className="mb-6 leading-relaxed text-base-content/70" />
                           <RichTextHtml html={aboutData.visionParagraph2} className="leading-relaxed text-base-content/70" />
                       </div>

                       {/* Mission Card */}
                       <div className="bg-base-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow border border-base-200 group">
                           <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                               <Heart size={32} />
                           </div>
                           <h3 className="text-3xl font-bold mb-4">{aboutData.missionTitle}</h3>
                           <RichTextHtml html={aboutData.missionParagraph1} className="mb-6 leading-relaxed text-base-content/70" />
                           <RichTextHtml html={aboutData.missionParagraph2} className="leading-relaxed text-base-content/70" />
                       </div>
                   </div>
                </div>
            </section>

             {/* Location Section */}
             <section className="py-20 container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto bg-primary/5 p-12 rounded-[2rem] border border-primary/10">
                    <MapPin className="mx-auto size-12 text-primary mb-6" />
                    <h2 className="text-3xl font-bold mb-4">{aboutData.officeTitle}</h2>
                    <RichTextHtml html={aboutData.officeAddressHtml} className="mb-8 text-xl text-base-content/70" />
                     <div className="flex flex-wrap justify-center gap-4">
                        <a href={aboutData.contactButtonLink} className="btn btn-primary rounded-full px-8 text-white">{aboutData.contactButtonText}</a>
                        <a href={aboutData.callButtonLink} className="btn btn-ghost hover:bg-base-100 border border-base-300 rounded-full px-8">{aboutData.callButtonText}</a>
                    </div>
                </div>
             </section>
        </main>
    );
}
