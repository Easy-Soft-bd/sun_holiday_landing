import Link from "next/link";
import BlogHero from "./components/BlogHero";
import BlogCard from "./components/BlogCard";
import type { BlogPostView } from "@/src/lib/data/blog";
import { MEDIA_LISTINGS, type MediaListingKey } from "@/src/lib/blog/categories";

type BlogViewProps = {
  posts: BlogPostView[];
  listingKey: MediaListingKey;
};

export default function BlogView({ posts, listingKey }: BlogViewProps) {
  const listing = MEDIA_LISTINGS.find((item) => item.key === listingKey) ?? MEDIA_LISTINGS[2];
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-base-200/40 pb-16 md:pb-20">
      <BlogHero
        eyebrow={listing.eyebrow}
        heading={listing.heading}
        headingHighlight={listing.headingHighlight}
        intro={listing.intro}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <nav aria-label="Media categories" className="-mx-4 mb-8 overflow-x-auto px-4 md:mx-0 md:mb-10 md:overflow-visible md:px-0">
          <div className="flex w-max gap-2 md:w-auto md:flex-wrap">
            {MEDIA_LISTINGS.map((item) => {
              const current = item.key === listing.key;
              return (
                <Link
                  key={item.key}
                  href={item.path}
                  aria-current={current ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                    current
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center sm:px-8">
            <p className="text-base font-medium text-base-content/60 sm:text-lg">
              No stories published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {featured ? <BlogCard post={featured} featured /> : null}
            {rest.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.slug || post.id} post={post} />
                ))}
              </div>
            ) : null}
          </div>
        )}

        <section className="mt-12 rounded-3xl border border-base-200 bg-base-100 px-5 py-8 sm:px-8 sm:py-10 md:mt-16 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary uppercase">Sun Tourism Ltd</p>
            <h2 className="font-magmawave text-2xl tracking-tight sm:text-3xl">
              Plan the trip behind the story
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70 sm:text-base">
              Ask about tours, tickets, and visas with the same team that publishes these stories.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0 md:shrink-0">
            <Link href="/contact" className="btn btn-primary min-h-11 rounded-full px-6">
              Contact
            </Link>
            <Link href="/tours" className="btn btn-outline min-h-11 rounded-full px-6">
              View tours
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
