import { Calendar, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "../../data/blogData";
import { listingForCategory } from "@/src/lib/blog/categories";

function formatEventDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogDetailHero({ post }: { post: BlogPost }) {
  const listing = listingForCategory(post.category);
  const when = post.eventDate ? formatEventDate(post.eventDate) : post.date;

  return (
    <section className="border-b border-base-200 bg-base-100">
      <div className="container mx-auto px-4 pt-24 pb-8 sm:pt-28 md:pt-32 md:pb-10">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-base-content/70">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-base-content/30">
              /
            </li>
            <li>
              <Link href={listing.path} className="transition-colors hover:text-primary">
                {listing.label}
              </Link>
            </li>
            <li aria-hidden className="text-base-content/30">
              /
            </li>
            <li aria-current="page" className="max-w-[16rem] truncate text-base-content sm:max-w-md">
              {post.title}
            </li>
          </ol>
        </nav>

        <Link
          href={listing.path}
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-base-content/70 transition-colors hover:text-primary"
        >
          <ChevronLeft size={16} aria-hidden />
          Back to {listing.label}
        </Link>

        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-base-content/70">
              <Calendar size={14} className="text-primary" aria-hidden />
              {when}
            </span>
            {post.eventLocation ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-base-content/70">
                <MapPin size={14} className="text-primary" aria-hidden />
                {post.eventLocation}
              </span>
            ) : null}
          </div>

          <h1 className="font-magmawave text-3xl leading-tight tracking-tighter text-base-content sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/70 sm:text-lg">
            {post.excerpt}
          </p>
        </div>
      </div>
    </section>
  );
}
