import type { TeamItem } from "../teams-page-data";

export default function TeamList({ teams }: { teams: TeamItem[] }) {
    if (!teams || teams.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {teams.map((team, index) => {
                const name = (team.name || "Team Member").trim();
                const position = (team.position || "Team").trim();
                const image =
                    (team.image || "").trim() ||
                    "https://placehold.co/800x1000?text=Team+Member";
                const description = (team.description || "").trim();

                return (
                    <article
                        key={`${name}-${index}`}
                        className="group relative overflow-hidden rounded-xl bg-base-200 shadow-sm ring-1 ring-base-200/70 transition-all duration-500 sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:shadow-xl sm:hover:ring-primary/25"
                    >
                        <div className="relative aspect-3/4 w-full overflow-hidden">
                            <img
                                src={image}
                                alt={name}
                                loading="lazy"
                                className="h-full w-full object-cover object-top transition-transform duration-900 ease-out group-hover:scale-[1.06]"
                            />

                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute left-2 top-2 max-w-[calc(100%-1rem)] sm:left-3 sm:top-3">
                                <span className="inline-block truncate rounded-full border border-white/30 bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px]">
                                    {position}
                                </span>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                                <h3 className="text-sm font-bold leading-tight text-white drop-shadow sm:text-lg">
                                    {name}
                                </h3>
                                {description ? (
                                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/75 sm:text-sm">
                                        {description}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
