import { Quote, Sparkles } from "lucide-react";

type Props = {
    name: string;
    title: string;
    message: string;
    image: string;
    reverse?: boolean;
};

export default function DirectorCard({
    name,
    title,
    message,
    image,
    reverse = false,
}: Props) {
    const safeName = (name || "").trim() || "Team Member";
    const safeTitle = (title || "").trim() || "Director";
    const safeMessage =
        (message || "").trim() ||
        "Thank you for trusting Sun Holidays Ltd.";
    const safeImage =
        (image || "").trim() ||
        "https://placehold.co/900x1200?text=Leadership";
    const initial = safeName.charAt(0).toUpperCase();

    return (
        <article
            className={`group relative overflow-hidden rounded-3xl border border-base-200/80 bg-base-100 shadow-sm transition-all duration-500 hover:border-primary/30 hover:shadow-2xl`}
        >
            {/* Top accent bar */}
            <span
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                    reverse
                        ? "from-secondary via-primary to-secondary"
                        : "from-primary via-secondary to-primary"
                }`}
            />

            {/* subtle background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <div
                className={`relative z-10 grid grid-cols-1 gap-0 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] ${
                    reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
            >
                {/* Portrait Panel */}
                <div className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 p-5 sm:p-6 md:p-6 lg:p-8">
                    <div className="relative mx-auto w-full max-w-[260px] md:max-w-none">
                        {/* Decorative frame */}
                        <div
                            className={`absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100 ${
                                reverse
                                    ? "from-secondary/25 to-primary/25"
                                    : "from-primary/25 to-secondary/25"
                            }`}
                        />

                        {/* Image */}
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-base-200 shadow-xl ring-1 ring-base-200/60">
                            <img
                                src={safeImage}
                                alt={safeName}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-900/60 via-transparent to-transparent" />

                            {/* Floating role pill */}
                            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-base-100/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur-md sm:text-[11px]">
                                <Sparkles className="h-3 w-3" />
                                {safeTitle}
                            </div>

                            {/* Name on image */}
                            <div className="absolute inset-x-3 bottom-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                                    Leadership
                                </p>
                                <h3 className="mt-0.5 text-lg font-bold leading-tight text-white drop-shadow sm:text-xl lg:text-2xl">
                                    {safeName}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Panel */}
                <div className="relative flex flex-col justify-between border-t border-base-200/70 p-5 sm:p-6 md:border-l md:border-t-0 md:p-7 lg:p-10">
                    {/* Decorative quote */}
                    <Quote
                        className="pointer-events-none absolute right-4 top-4 h-16 w-16 rotate-180 text-primary/10 sm:right-6 sm:top-6 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                        strokeWidth={1.25}
                    />

                    <div className="relative z-10">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-2">
                            <span
                                className={`h-px w-10 sm:w-14 ${
                                    reverse ? "bg-secondary/40" : "bg-primary/40"
                                }`}
                            />
                            <span
                                className={`text-[10px] font-bold uppercase tracking-[0.22em] sm:text-xs ${
                                    reverse ? "text-secondary" : "text-primary"
                                }`}
                            >
                                Message from the {safeTitle}
                            </span>
                        </div>

                        {/* Heading */}
                        <h4 className="mt-3 text-xl font-bold leading-snug tracking-tight text-base-content sm:mt-4 sm:text-2xl lg:text-3xl">
                            {safeName}
                            <span className="ml-2 text-base-content/40 font-light">
                                / {safeTitle}
                            </span>
                        </h4>

                        {/* Message */}
                        <div className="mt-4 max-h-[300px] overflow-y-auto pr-1 sm:mt-5 sm:max-h-[360px]">
                            <p className="whitespace-pre-line text-sm leading-relaxed text-base-content/70 sm:text-[15px] lg:text-base">
                                {safeMessage}
                            </p>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="relative z-10 mt-6 flex items-center justify-between gap-4 border-t border-dashed border-base-200 pt-5 sm:mt-8 sm:pt-6">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold shadow-sm transition-colors sm:h-12 sm:w-12 ${
                                    reverse
                                        ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                                }`}
                            >
                                {initial}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-base-content sm:text-base">
                                    {safeName}
                                </p>
                                <p className="truncate text-xs text-base-content/55 sm:text-sm">
                                    {safeTitle} — Sun Holidays Ltd.
                                </p>
                            </div>
                        </div>

                        <p className="font-handwriting hidden text-2xl text-primary sm:block sm:text-3xl">
                            {safeName.split(" ")[0]}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
