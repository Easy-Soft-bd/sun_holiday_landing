import { Calendar, ArrowRight, MapPin } from "lucide-react";
import AppImage from "@/src/components/common/AppImage";
import Link from "next/link";
import type { BlogPost } from "../data/blogData";

function formatEventDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const href = `/blog/${post.slug || post.id}`;
  const when = post.eventDate ? formatEventDate(post.eventDate) : post.date;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <Link href={href} className={`flex h-full min-w-0 flex-1 flex-col ${featured ? "md:flex-row" : ""}`}>
        <div className={`relative overflow-hidden ${featured ? "aspect-[16/10] md:aspect-auto md:w-1/2 md:min-h-[20rem]" : "aspect-[4/3]"}`}>
          <AppImage
            src={post.image}
            alt={post.title}
            fill
            loading={featured ? "eager" : "lazy"}
            quality={featured ? 65 : 55}
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 rounded-full bg-base-100/90 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase shadow-sm backdrop-blur-md">
            {post.category}
          </span>
        </div>

        <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "md:justify-center md:p-8 lg:p-10" : ""}`}>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-base-content/60">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" aria-hidden />
              {when}
            </span>
            {post.eventLocation ? (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin size={14} className="shrink-0 text-primary" aria-hidden />
                <span className="truncate">{post.eventLocation}</span>
              </span>
            ) : null}
          </div>

          <h2 className={`font-bold leading-tight text-base-content transition-colors group-hover:text-primary ${featured ? "text-2xl sm:text-3xl" : "line-clamp-2 text-xl"}`}>
            {post.title}
          </h2>

          <p className={`mt-3 text-sm leading-relaxed text-base-content/70 ${featured ? "line-clamp-4 sm:text-base" : "line-clamp-3"}`}>
            {post.excerpt}
          </p>

          <span className="btn btn-primary btn-sm mt-5 w-fit rounded-full px-4 text-primary-content">
            Read <ArrowRight size={16} aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
