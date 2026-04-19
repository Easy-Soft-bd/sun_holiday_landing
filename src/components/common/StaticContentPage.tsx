import Link from 'next/link';

type Section = {
  title: string;
  body: string;
};

interface StaticContentPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function StaticContentPage({
  eyebrow,
  title,
  intro,
  sections,
  ctaLabel,
  ctaHref,
}: StaticContentPageProps) {
  return (
    <main className="min-h-screen bg-base-50">
      <section className="border-b border-base-200 bg-base-100">
        <div className="container mx-auto px-4 pb-12 pt-32 text-center lg:pb-16 lg:pt-36">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
          <h1 className="font-magmawave text-4xl tracking-tighter md:text-5xl lg:text-6xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-base-content/70">{intro}</p>
          {ctaLabel && ctaHref ? (
            <Link href={ctaHref} className="btn btn-primary mt-8 rounded-full px-8 text-white">
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mx-auto grid max-w-5xl gap-6">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-base-200 bg-base-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-base-content">{section.title}</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-base-content/70">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
