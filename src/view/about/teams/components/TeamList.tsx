import AppImage from "@/src/components/common/AppImage";
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

                return (
                    <article
                        key={`${name}-${index}`}
                        className="group overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition-all duration-500 sm:hover:-translate-y-1 sm:hover:shadow-xl"
                    >
                        <div className="relative aspect-3/4 w-full overflow-hidden bg-base-200">
                            <AppImage
                                src={image}
                                alt={name}
                                fill
                                loading="lazy"
                                quality={55}
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover object-top transition-transform duration-900 ease-out group-hover:scale-[1.05]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-xs sm:tracking-[0.2em]">
                                    {position}
                                </p>
                                <h3 className="mt-0.5 text-sm font-bold leading-tight text-white drop-shadow sm:text-lg">
                                    {name}
                                </h3>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
