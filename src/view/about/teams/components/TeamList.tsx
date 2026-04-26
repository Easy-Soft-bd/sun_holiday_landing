import type { TeamItem } from "../teams-page-data";

export default function TeamList({ teams }: { teams: TeamItem[] }) {
    if (!teams || teams.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
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
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-200/80 bg-base-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl"
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-base-200">
                            <img
                                src={image}
                                alt={name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                            />

                            {/* Gradient overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-900/70 via-base-900/20 to-transparent opacity-95" />

                            {/* Position badge */}
                            <div className="absolute left-2 top-2 inline-flex items-center rounded-full border border-white/30 bg-base-100/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary backdrop-blur-md shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
                                {position}
                            </div>

                            {/* Name over image */}
                            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4">
                                <h3 className="text-sm font-bold leading-tight text-white drop-shadow-sm sm:text-lg">
                                    {name}
                                </h3>
                            </div>
                        </div>

                        {/* Content */}
                        {description ? (
                            <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-5">
                                <p className="line-clamp-3 text-xs leading-relaxed text-base-content/70 sm:text-[15px]">
                                    {description}
                                </p>
                                <div className="mt-auto hidden items-center gap-2 border-t border-base-200/70 pt-2 text-[11px] text-base-content/55 sm:flex sm:pt-3 sm:text-xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span className="font-semibold uppercase tracking-wider">
                                        Sun Tourism Team
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 sm:p-5">
                                <div className="flex items-center gap-2 text-[11px] text-base-content/55 sm:text-xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span className="font-semibold uppercase tracking-wider">
                                        Sun Tourism Team
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Accent border on hover */}
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] scale-x-0 bg-gradient-to-r from-primary via-primary/70 to-secondary transition-transform duration-500 group-hover:scale-x-100" />
                    </article>
                );
            })}
        </div>
    );
}
