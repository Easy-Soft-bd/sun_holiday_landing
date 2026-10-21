import Link from "next/link";
import AppImage from "@/src/components/common/AppImage";
import RichTextHtml from "@/src/components/common/RichTextHtml";
import type { VisaCountryRecord } from "@/src/lib/data/visa";
import VisaApplyPanel from "./components/VisaApplyPanel";
import VisaFlag from "./components/VisaFlag";

export default function VisaDetailView({ country }: { country: VisaCountryRecord }) {
  return (
    <main className="bg-base-100">
      <div className="container mx-auto px-4 pt-24 pb-12 sm:pt-28 lg:pt-32 lg:pb-14">
        <nav aria-label="Breadcrumb" className="text-sm text-base-content/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/visa" className="hover:text-primary">
                Visa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-base-content">{country.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
          <article className="order-2 min-w-0 lg:order-1">
            <header className="flex items-start gap-3">
              <VisaFlag
                flagImage={country.flagImage}
                flagEmoji={country.flagEmoji}
                className="mt-1 h-7 w-10 shrink-0 rounded-sm object-cover text-2xl leading-none sm:h-8 sm:w-12 sm:text-3xl"
              />
              <div className="min-w-0">
                <h1 className="font-magmawave text-3xl tracking-tight text-balance text-base-content sm:text-4xl md:text-5xl">
                  {country.name} Visa
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-base-content/70">{country.excerpt}</p>
              </div>
            </header>

            <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-base-200">
              <AppImage
                src={country.coverImage}
                alt={`${country.name} visa`}
                fill
                priority
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </figure>

            <div className="mt-8">
              <RichTextHtml html={country.content} />
            </div>
          </article>

          <VisaApplyPanel
            className="order-1 lg:order-2"
            name={country.name}
            slug={country.slug}
            flagEmoji={country.flagEmoji}
          />
        </div>
      </div>
    </main>
  );
}
