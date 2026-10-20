import AppImage from "@/src/components/common/AppImage";
import Link from "next/link";
import { BlogPost } from "../../data/blogData";
import { listingForCategory } from "@/src/lib/blog/categories";

export default function BlogContent({ post }: { post: BlogPost }) {
  const listing = listingForCategory(post.category);

  return (
    <section className="bg-base-200/40 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative -mt-2 mb-8 aspect-[16/10] overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm sm:mb-12 sm:aspect-[2/1]">
            <AppImage
              src={post.image}
              alt={post.title}
              fill
              priority
              quality={60}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <article
            className="prose prose-base max-w-none sm:prose-lg prose-headings:font-magmawave prose-headings:tracking-tight prose-headings:text-base-content prose-p:text-base-content/75 prose-p:leading-relaxed prose-strong:text-base-content prose-img:rounded-2xl prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-secondary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 flex flex-col gap-4 border-t border-base-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                ST
              </div>
              <div>
                <p className="font-bold text-base-content">Sun Tourism Ltd</p>
                <p className="text-xs font-semibold tracking-wider text-base-content/50 uppercase">Editorial</p>
              </div>
            </div>
            <Link href={listing.path} className="btn btn-outline min-h-11 w-full rounded-full sm:w-auto">
              More in {listing.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
