import LeadersRow from "./components/LeadersRow";
import TeamList from "./components/TeamList";
import ClientOnly from "@/src/components/common/ClientOnly";
import type { TeamsPageData } from "./teams-page-data";
import { defaultTeamsPageData } from "./teams-page-data";
import { Users2, Sparkles, Crown } from "lucide-react";

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
        <main className="group/about-teams min-h-screen bg-gradient-to-b from-base-50 via-base-100 to-base-50 pb-16 sm:pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-base-200/80 bg-base-100">
                {admin ? <TeamsAdminSlot data={teamsData} /> : null}

                {/* Decorative background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/8%),transparent_60%)]" />
                    <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-60 sm:h-96 sm:w-96" />
                    <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl opacity-50 sm:h-80 sm:w-80" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-200 bg-base-100/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur-sm sm:mb-7 sm:px-4 sm:py-2 sm:text-sm">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary sm:h-2 sm:w-2" />
                            {teamsData.heroBadgeText}
                        </div>

                        <h1 className="font-magmawave mb-4 text-4xl leading-[1.05] tracking-tighter sm:mb-5 sm:text-5xl md:text-6xl lg:text-7xl">
                            {teamsData.heroTitleMain}{" "}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {teamsData.heroTitleAccent}
                            </span>
                            <br />
                            <span className="font-gilliequest text-2xl italic uppercase text-base-content/80 sm:text-3xl md:text-5xl lg:text-6xl">
                                {teamsData.heroTitleSub}
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-base-content/65 sm:text-lg md:text-xl">
                            {teamsData.heroDescription}
                        </p>

                        {/* Stats / quick indicator */}
                        <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
                            <div className="flex items-center gap-2 rounded-full border border-base-200 bg-base-100/80 px-4 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm sm:text-sm">
                                <Crown className="h-4 w-4 text-primary" />
                                <span>{directorCount} Leaders</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-base-200 bg-base-100/80 px-4 py-2 text-xs font-semibold shadow-sm backdrop-blur-sm sm:text-sm">
                                <Users2 className="h-4 w-4 text-secondary" />
                                <span>{teamCount}+ Team Members</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section
                id="leadership"
                className="relative border-b border-base-200/60"
            >
                <div className="container mx-auto px-3 py-10 sm:px-4 sm:py-16 lg:py-20">
                    <LeadersRow
                        directors={teamsData.directors}
                        eyebrow="Leadership"
                        title="Our Top Leaders"
                        description="Meet the visionaries steering Sun Tourism Ltd. — hover any portrait to read their message."
                    />
                </div>
            </section>

            {/* Our Team Section */}
            <section id="team" className="relative">
                {/* subtle background accent */}
                <div className="pointer-events-none absolute inset-0 -z-0">
                    <div className="absolute left-1/2 top-0 h-64 w-[90%] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl opacity-40" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <SectionHeader
                        eyebrow="Our Team"
                        title={teamsData.teamSectionTitle}
                        description={teamsData.teamSectionDescription}
                        icon={<Users2 className="h-4 w-4" />}
                        accent="secondary"
                    />

                    <div className="mt-8 sm:mt-12">
                        <TeamList teams={teamsData.teams} />
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
    accent = "primary",
}: {
    eyebrow: string;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    accent?: "primary" | "secondary";
}) {
    const accentClasses =
        accent === "primary"
            ? "text-primary border-primary/20 bg-primary/5"
            : "text-secondary border-secondary/20 bg-secondary/5";
    const lineClasses =
        accent === "primary" ? "bg-primary/30" : "bg-secondary/30";

    return (
        <div className="mx-auto max-w-3xl text-center">
            <div
                className={`mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm sm:text-xs ${accentClasses}`}
            >
                {icon ?? <Sparkles className="h-3.5 w-3.5" />}
                {eyebrow}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl md:text-4xl">
                {title}
            </h2>
            <div className="mx-auto mt-3 flex items-center justify-center gap-2 sm:mt-4">
                <span className={`h-px w-8 ${lineClasses}`} />
                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        accent === "primary" ? "bg-primary" : "bg-secondary"
                    }`}
                />
                <span className={`h-px w-8 ${lineClasses}`} />
            </div>
            {description ? (
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-base-content/65 sm:mt-5 sm:text-base">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
