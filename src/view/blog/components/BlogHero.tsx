type BlogHeroProps = {
  eyebrow?: string;
  heading?: string;
  headingHighlight?: string;
  intro?: string;
};

export default function BlogHero({
  eyebrow = "Media",
  heading = "Travel",
  headingHighlight = "Stories",
  intro = "Stories, destination guides, and practical notes for your next journey.",
}: BlogHeroProps) {
  return (
    <div className="border-b border-base-200 bg-base-100">
      <div className="container mx-auto px-4 pt-24 pb-8 text-center sm:pt-28 md:pt-32 md:pb-10 lg:pt-36 lg:pb-12">
        <p className="mb-3 inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[0.18em] text-primary uppercase sm:text-sm">
          <span className="h-0.5 w-8 bg-primary" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="font-magmawave text-3xl leading-tight tracking-tighter sm:text-4xl md:text-5xl">
          {heading}{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {headingHighlight}
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base font-light text-base-content/70 sm:text-lg">
          {intro}
        </p>
      </div>
    </div>
  );
}
