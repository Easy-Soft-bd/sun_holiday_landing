import Link from "next/link";
import type { VisaCountryCard } from "@/src/lib/data/visa";
import VisaFlag from "@/src/view/visa/components/VisaFlag";

type VisaCountriesProps = {
  countries: VisaCountryCard[];
};

export default function VisaCountries({ countries }: VisaCountriesProps) {
  if (countries.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10" aria-labelledby="home-visa-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="home-visa-heading" className="font-magmawave text-3xl tracking-tight text-base-content md:text-4xl">
          Visa services
        </h2>
        <Link href="/visa" className="shrink-0 text-sm font-semibold text-primary hover:underline">
          All countries
        </Link>
      </div>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
        {countries.map((country) => (
          <li key={country.id} className="min-w-0">
            <Link
              href={`/visa/${country.slug}`}
              className="flex h-full min-w-0 items-center gap-2 rounded-xl border border-base-200 bg-base-100 px-3 py-3 text-sm font-semibold text-base-content transition-colors hover:border-primary/40 hover:text-primary"
            >
              <VisaFlag flagImage={country.flagImage} flagEmoji={country.flagEmoji} className="h-5 w-7 shrink-0 rounded-sm object-cover text-xl leading-none" />
              <span className="min-w-0 leading-snug break-words">{country.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
