"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import AppImage from "@/src/components/common/AppImage";
import type { VisaCountryCard } from "@/src/lib/data/visa";
import VisaFlag from "./components/VisaFlag";

type VisaDirectoryProps = {
  countries: VisaCountryCard[];
};

export default function VisaDirectory({ countries }: VisaDirectoryProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!normalized) return countries;
    return countries.filter((country) => country.name.toLowerCase().includes(normalized));
  }, [countries, normalized]);

  return (
    <div className="mt-8">
      <label htmlFor="visa-country-search" className="sr-only">
        Search countries
      </label>
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base-content/40" size={18} aria-hidden />
        <input
          id="visa-country-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by country name"
          className="w-full rounded-xl border border-base-300 bg-base-100 py-3 pr-4 pl-11 text-base text-base-content outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <p className="mt-4 text-sm text-base-content/60" aria-live="polite">
        {visible.length === 1 ? "1 country" : `${visible.length} countries`}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-base-300 px-6 py-12 text-center text-base-content/70">
          {countries.length === 0
            ? "Visa countries will appear here once they are published."
            : `No countries match “${query.trim()}”.`}
        </p>
      ) : (
        <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((country) => (
            <li key={country.id}>
              <Link
                href={`/visa/${country.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 transition-colors hover:border-primary/40"
              >
                <div className="relative aspect-[16/10] bg-base-200">
                  <AppImage
                    src={country.coverImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <VisaFlag flagImage={country.flagImage} flagEmoji={country.flagEmoji} />
                    <h2 className="min-w-0 text-lg font-semibold break-words text-base-content group-hover:text-primary">
                      {country.name}
                    </h2>
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-base-content/70">{country.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
