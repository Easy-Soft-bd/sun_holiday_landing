import Link from "next/link";
import LeadersRow from "./components/LeadersRow";
import TeamList from "./components/TeamList";
import ClientOnly from "@/src/components/common/ClientOnly";
import type { TeamsPageData } from "./teams-page-data";
import { defaultTeamsPageData } from "./teams-page-data";
import { Users2, Sparkles, Crown, ArrowRight } from "lucide-react";

type Props = {
    data?: Partial<TeamsPageData>;
    admin?: boolean;
};

async function TeamsAdminSlot({ data }: { data: TeamsPageData }) {
    const TeamsAdminControl = (await import("./TeamsAdminControl")).default;
    return (
        <ClientOnly>
            <div className="absolute right-3 top-3 z-50 sm:right-4 sm:top-4">
                <TeamsAdminControl data={data} />
            </div>
        </ClientOnly>
    );
}

export default async function TeamsView({ data, admin = false }: Props) {
    const teamsData = { ...defaultTeamsPageData, ...data };
    const directorCount = teamsData.directors.length;
    const teamCount = teamsData.teams.length;

    return (
        <main className="group/about-teams min-h-screen bg-base-100">
            {/* Hero — compact on phone */}
            <section className="relative overflow-hidden bg-base-100">
                {admin ? <TeamsAdminSlot data={teamsData} /> : null}

                <div className="absolute inset-0 z-0">
                    <div
                        className="h-full w-full bg-cover bg-center opacity-30 sm:opacity-40"
                        style={{
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop)",
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-base-100/80 via-base-100/90 to-base-100" />
                    <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 opacity-50 blur-3xl sm:-top-24 sm:-right-24 sm:size-96" />
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-24 pb-10 text-center sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
                    <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-base-200 bg-base-100/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur-sm sm:mb-7 sm:px-4 sm:py-2 sm:text-sm sm:tracking-widest">
                        <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary sm:size-2" />
                        <span className="truncate">{teamsData.heroBadgeText}</span>
                    </div>

                    <h1 className="font-magmawave mb-3 text-[1.85rem] leading-[1.1] tracking-tighter sm:mb-5 sm:text-5xl md:text-7xl">
                        {teamsData.heroTitleMain}{" "}
                        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {teamsData.heroTitleAccent}
                        </span>
                        <br />
                        <span className="font-gilliequest text-[1.35rem] italic uppercase text-base-content/80 sm:text-4xl md:text-6xl">
                            {teamsData.heroTitleSub}
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-base-content/60 sm:text-lg md:text-xl">
                        {teamsData.heroDescription}
                    </p>

                    <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
                        <div className="flex items-center gap-1.5 rounded-full border border-base-200 bg-base-100/80 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                            <Crown className="size-3.5 text-primary sm:size-4" />
                            <span>{directorCount} Leaders</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full border border-base-200 bg-base-100/80 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                            <Users2 className="size-3.5 text-secondary sm:size-4" />
                            <span>{teamCount}+ Members</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section id="leadership" className="relative border-t border-base-200/60">
                <div className="container mx-auto px-3 py-10 sm:px-4 sm:py-16 lg:py-20">
                    <LeadersRow
                        directors={teamsData.directors}
                        eyebrow="Leadership"
                        title="Our Top Leaders"
                        description="Meet the visionaries steering Sun Tourism Ltd."
                    />
                </div>
            </section>

            {/* Team */}
            <section id="team" className="relative bg-base-200/40">
                <div className="relative z-10 container mx-auto px-3 py-10 sm:px-4 sm:py-16 lg:py-20">
                    <SectionHeader
                        eyebrow="Our Team"
                        title={teamsData.teamSectionTitle}
                        description={teamsData.teamSectionDescription}
                        icon={<Users2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    />

                    <div className="mt-7 sm:mt-12">
                        <TeamList teams={teamsData.teams} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-3 py-10 sm:px-4 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-2xl rounded-3xl border border-primary/10 bg-primary/5 px-5 py-8 text-center sm:rounded-4xl sm:p-12">
                    <Sparkles className="mx-auto mb-4 size-8 text-primary sm:mb-6 sm:size-12" />
                    <h2 className="font-gilliequest mb-2 text-2xl uppercase tracking-tighter sm:mb-4 sm:text-4xl">
                        Ready to{" "}
                        <span className="italic text-primary">Travel</span> With Us?
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed text-base-content/65 sm:mb-8 sm:text-lg">
                        Our team is here to plan your next journey — from first enquiry to a
                        seamless return home.
                    </p>
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                        <Link
                            href="/contact"
                            className="btn btn-primary w-full rounded-full px-8 text-white shadow-lg shadow-primary/20 sm:w-auto"
                        >
                            Contact Us
                            <ArrowRight className="ml-1 size-4" />
                        </Link>
                        <Link
                            href="/tours"
                            className="btn btn-ghost w-full rounded-full border border-base-300 px-8 hover:bg-base-100 sm:w-auto"
                        >
                            Explore Tours
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function SectionHeader({
    eyebrow,
    title,
    description,
    icon,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
}) {
    const words = title.trim().split(/\s+/);
    const accent = words.length > 1 ? words.at(-1) : "";
    const main = words.length > 1 ? words.slice(0, -1).join(" ") : title;

    return (
        <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:mb-4 sm:text-xs">
                {icon ?? <Sparkles className="h-3.5 w-3.5" />}
                {eyebrow}
            </div>
            <h2 className="font-gilliequest text-2xl uppercase tracking-tighter text-base-content sm:text-4xl md:text-5xl">
                {main}{" "}
                {accent ? <span className="italic text-primary">{accent}</span> : null}
            </h2>
            <div className="mx-auto mt-3 flex items-center justify-center gap-2 sm:mt-4">
                <span className="h-px w-6 bg-primary/30 sm:w-8" />
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="h-px w-6 bg-primary/30 sm:w-8" />
            </div>
            {description ? (
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-base-content/65 sm:mt-5 sm:text-base">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
