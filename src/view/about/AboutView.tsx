import { Heart, Users, MapPin, Calendar, Route, Share2 } from "lucide-react";
import AppImage from "@/src/components/common/AppImage";
import ClientOnly from "@/src/components/common/ClientOnly";
import PublicIconRenderer from "@/src/components/common/PublicIconRenderer";
import type { AboutPageData } from "./about-page-data";
import { mergeAboutPageData } from "./about-page-data";
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
    const aboutData = mergeAboutPageData(data);
    const valueItems = aboutData.values;
    const strategyItems = aboutData.strategy;
    const socialLinks = aboutData.socialLinks.filter((link) => link.url);
    return (
        <main className="group/about min-h-screen bg-base-100">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-base-100">
                {admin ? <AboutAdminSlot data={aboutData} /> : null}
                <div className="absolute inset-0 z-0">
                    <AppImage
                        src={aboutData.heroBackgroundImage}
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        quality={60}
                        className="object-cover object-center"
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
                        {aboutData.heroTitleLead ? <>{aboutData.heroTitleLead}{" "}</> : null}
                        {aboutData.heroTitleAccent ? (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {aboutData.heroTitleAccent}
                            </span>
                        ) : null}{" "}
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
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
                            <AppImage
                                src={aboutData.storyImage}
                                alt={aboutData.storyImageAlt}
                                fill
                                loading="lazy"
                                quality={55}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                         <div className="absolute -bottom-6 right-4 md:-right-6 bg-base-100 p-4 rounded-xl shadow-lg border border-base-200">
                             <div className="flex items-center gap-2 text-primary font-bold">
                                 <Calendar size={20} />
                                 <span>{aboutData.storyCaption}</span>
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
                               <PublicIconRenderer iconName={aboutData.visionIcon} size={32} className="text-current" />
                           </div>
                           <h3 className="text-3xl font-bold mb-4">{aboutData.visionTitle}</h3>
                           <RichTextHtml html={aboutData.visionParagraph1} className="mb-6 leading-relaxed text-base-content/70" />
                           <RichTextHtml html={aboutData.visionParagraph2} className="leading-relaxed text-base-content/70" />
                       </div>

                       {/* Mission Card */}
                       <div className="bg-base-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow border border-base-200 group">
                           <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                               <PublicIconRenderer iconName={aboutData.missionIcon} size={32} className="text-current" />
                           </div>
                           <h3 className="text-3xl font-bold mb-4">{aboutData.missionTitle}</h3>
                           <RichTextHtml html={aboutData.missionParagraph1} className="mb-6 leading-relaxed text-base-content/70" />
                           <RichTextHtml html={aboutData.missionParagraph2} className="leading-relaxed text-base-content/70" />
                       </div>
                   </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-wider text-primary">
                        <Heart size={16} aria-hidden />
                        {aboutData.valuesBadgeText}
                    </div>
                    <h2 className="mt-4 text-3xl font-bold md:text-4xl">{aboutData.valuesTitle}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-base-content/70">{aboutData.valuesIntro}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {valueItems.map((item, index) => {
                        return (
                            <article key={`${item.title}-${index}`} className="rounded-3xl border border-base-200 bg-base-100 p-8 shadow-xl">
                                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <PublicIconRenderer iconName={item.icon} size={28} className="text-current" />
                                </div>
                                <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                                <p className="leading-relaxed text-base-content/70">{item.description}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="bg-base-200/50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold uppercase tracking-wider text-secondary">
                            <Route size={16} aria-hidden />
                            {aboutData.strategyBadgeText}
                        </div>
                        <h2 className="mt-4 text-3xl font-bold md:text-4xl">{aboutData.strategyTitle}</h2>
                        <p className="mt-4 text-lg leading-relaxed text-base-content/70">{aboutData.strategyIntro}</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {strategyItems.map((item, index) => {
                            return (
                                <article key={`${item.title}-${index}`} className="rounded-3xl border border-base-200 bg-base-100 p-8 shadow-xl">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                                            <PublicIconRenderer iconName={item.icon} size={28} className="text-current" />
                                        </div>
                                        <span className="font-gilliequest text-4xl italic text-secondary/40">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                                    <p className="leading-relaxed text-base-content/70">{item.description}</p>
                                </article>
                            );
                        })}
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

            <section className="bg-base-200/50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="mx-auto max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-wider text-primary">
                            <Share2 size={16} aria-hidden />
                            {aboutData.socialBadgeText}
                        </div>
                        <h2 className="mt-4 text-3xl font-bold md:text-4xl">{aboutData.socialTitle}</h2>
                        <p className="mt-4 text-lg leading-relaxed text-base-content/70">{aboutData.socialIntro}</p>
                    </div>
                    {socialLinks.length > 0 ? (
                        <ul className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            {socialLinks.map((link) => (
                                <li key={`${link.icon}-${link.url}`}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label ? `${link.label} (opens in a new tab)` : "Social profile (opens in a new tab)"}
                                        title={link.label || undefined}
                                        className="group/social grid size-14 place-items-center rounded-full border border-base-300 bg-base-100 text-base-content/70 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                                    >
                                        <PublicIconRenderer iconName={link.icon} size={22} className="text-current" />
                                        <span className="sr-only">{link.label || "Social profile"}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </section>
        </main>
    );
}
