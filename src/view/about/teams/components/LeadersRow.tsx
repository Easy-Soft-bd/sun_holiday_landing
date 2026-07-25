import { Quote, Sparkles } from "lucide-react";
import type { DirectorItem } from "../teams-page-data";

type Props = {
    directors: DirectorItem[];
    eyebrow?: string;
    title?: string;
    description?: string;
};

export default function LeadersRow({
    directors,
    eyebrow = "Leadership",
    title = "Our Top Leaders",
    description = "Meet the visionaries steering Sun Tourism Ltd.",
}: Props) {
    const safeDirectors = (directors || []).filter(Boolean);
    if (safeDirectors.length === 0) return null;

    const titleWords = title.trim().split(/\s+/);
    const titleAccent = titleWords.length > 1 ? titleWords.at(-1) : "";
    const titleMain =
        titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : title;

    return (
        <div className="space-y-7 sm:space-y-10">
            <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:mb-4 sm:text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    {eyebrow}
                </div>
                <h2 className="font-gilliequest text-2xl uppercase tracking-tighter text-base-content sm:text-4xl md:text-5xl">
                    {titleMain}{" "}
                    {titleAccent ? (
                        <span className="italic text-primary">{titleAccent}</span>
                    ) : null}
                </h2>
                {description ? (
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-base-content/65 sm:mt-4 sm:text-base">
                        {description}
                    </p>
                ) : null}
            </div>

            {/* Same photo-first grid on every screen */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {safeDirectors.map((director, index) => (
                    <LeaderPhotoCard
                        key={`${director.name}-${index}`}
                        director={director}
                    />
                ))}
            </div>
        </div>
    );
}

function LeaderPhotoCard({ director }: { director: DirectorItem }) {
    const name = (director.name || "").trim() || "Team Member";
    const title = (director.title || "").trim() || "Director";
    const message =
        (director.message || "").trim() ||
        "Thank you for trusting Sun Tourism Ltd.";
    const image =
        (director.image || "").trim() ||
        "https://placehold.co/800x1100?text=Leader";

    return (
        <article className="group overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition-all duration-500 sm:hover:-translate-y-1 sm:hover:shadow-xl">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-base-200">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-900 ease-out group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur-md sm:text-[11px]">
                        <Sparkles className="size-3" />
                        {title}
                    </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                        Leadership
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold leading-tight text-white drop-shadow sm:text-2xl">
                        {name}
                    </h3>
                </div>
            </div>

            <div className="px-3.5 py-3.5 sm:px-5 sm:py-4">
                <div className="mb-1.5 flex items-center gap-1.5">
                    <Quote className="size-3.5 text-primary/50" strokeWidth={2} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/45">
                        Message
                    </span>
                </div>
                <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-base-content/70 sm:line-clamp-5">
                    {message}
                </p>
            </div>
        </article>
    );
}
