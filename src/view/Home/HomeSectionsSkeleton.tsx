/**
 * Lightweight placeholders for below-fold home sections.
 * CSS-only (no images) so they do not compete with hero LCP.
 */
export default function HomeSectionsSkeleton() {
  return (
    <div
      className="w-full space-y-6 bg-base-100 py-4"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading page sections…</span>

      {/* Airline partners */}
      <section className="container mx-auto space-y-6 px-4 py-8">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
          <div className="skeleton h-3 w-40" />
          <div className="skeleton h-10 w-72 max-w-full" />
          <div className="skeleton h-4 w-full max-w-md" />
        </div>
        <div className="flex gap-4 overflow-hidden py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-28 shrink-0 rounded-xl" />
          ))}
        </div>
      </section>

      {/* Resort / promo CTAs */}
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="container mx-auto px-4 py-4">
          <div className="skeleton min-h-[280px] w-full rounded-3xl md:min-h-[360px]" />
        </section>
      ))}

      {/* Featured tours */}
      <section className="container mx-auto space-y-8 px-4 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl space-y-3">
            <div className="skeleton h-3 w-36" />
            <div className="skeleton h-12 w-80 max-w-full" />
            <div className="skeleton h-4 w-full max-w-md" />
          </div>
          <div className="skeleton h-11 w-40 rounded-full" />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-[450px] min-w-[85vw] shrink-0 rounded-3xl sm:min-w-[60vw] lg:min-w-[32%]"
            />
          ))}
        </div>
      </section>

      {/* Booking process */}
      <section className="bg-base-200/50 py-16">
        <div className="container mx-auto space-y-10 px-4">
          <div className="max-w-xl space-y-3">
            <div className="skeleton h-12 w-72 max-w-full" />
            <div className="skeleton h-4 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="skeleton size-16 rounded-2xl" />
                <div className="skeleton h-3 w-16" />
                <div className="skeleton h-6 w-40" />
                <div className="skeleton h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us + categories */}
      <section className="container mx-auto space-y-8 px-4 py-12">
        <div className="mx-auto max-w-lg space-y-3 text-center">
          <div className="skeleton mx-auto h-10 w-64 max-w-full" />
          <div className="skeleton mx-auto h-4 w-full max-w-sm" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-base-200 p-6">
              <div className="skeleton size-12 rounded-xl" />
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-12 w-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-8 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-40 w-full rounded-2xl md:h-52" />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Compact skeleton for the featured tours strip while the API loads. */
export function FeatureTourSkeleton() {
  return (
    <section
      className="overflow-hidden bg-base-100 py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading featured tours…</span>
      <div className="container mx-auto space-y-8 px-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl space-y-3">
            <div className="skeleton h-3 w-36" />
            <div className="skeleton h-12 w-80 max-w-full" />
            <div className="skeleton h-4 w-full max-w-md" />
          </div>
          <div className="skeleton h-11 w-40 rounded-full" />
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-[450px] min-w-[85vw] shrink-0 rounded-3xl sm:min-w-[60vw] lg:min-w-[32%]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
