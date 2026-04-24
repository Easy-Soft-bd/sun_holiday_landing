import { MapPin, Clock, Tag, Banknote, Star, Phone } from "lucide-react";
import type { TourPackage } from "@/src/view/tours/data/mockTours";

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function TourQuickFacts({ tour }: { tour: TourPackage }) {
  return (
    <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-lg shadow-base-content/5 md:p-8">
      <h2 className="sr-only">Tour details</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex gap-3 rounded-2xl bg-base-200/40 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Banknote size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">From</p>
            <p className="text-lg font-bold text-primary">{currencyFormatter.format(tour.price)}</p>
            <p className="text-xs text-base-content/50">per person</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl bg-base-200/40 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Duration</p>
            <p className="font-semibold text-base-content">{tour.duration}</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl bg-base-200/40 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Tag size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Category</p>
            <p className="font-semibold text-base-content">{tour.category}</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl bg-base-200/40 p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Location</p>
            <p className="font-semibold text-base-content">{tour.location}</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl bg-base-200/40 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Star size={22} strokeWidth={2} className="fill-orange-400 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Rating</p>
            <p className="font-semibold text-base-content">
              {tour.rating}
              <span className="ml-1 text-sm font-normal text-base-content/60">({tour.reviews} reviews)</span>
            </p>
          </div>
        </div>

        {tour.inquiryPhone ? (
          <div className="flex gap-3 rounded-2xl bg-base-200/40 p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone size={22} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Tour inquiry</p>
              <a href={`tel:${tour.inquiryPhone}`} className="font-semibold text-primary hover:underline">
                {tour.inquiryPhone}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
