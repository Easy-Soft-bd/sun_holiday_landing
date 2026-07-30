import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import Tour, { TourCategory, TourItineraryDay } from '@/src/models/Tour';
import Location from '@/src/models/Location';
import sequelize from '@/src/lib/db';
import { TAG_TOURS_LIST, tourDetailTag, tourRouteTag } from '@/src/lib/revalidate-tags';
import { normalizeTourPlain } from '@/src/lib/tours/normalize-tour';

const tourIncludeLocation = {
  model: Location,
  as: 'Location' as const,
  attributes: ['id', 'name'],
  required: false,
};

function mapTourRow(tour: Tour) {
  const plain = tour.get({ plain: true }) as unknown as Record<string, unknown> & {
    Location?: { id: number; name: string } | null;
  };
  const loc = plain.Location;
  const nameFromJoin =
    loc && typeof loc === 'object' && typeof loc.name === 'string' ? loc.name : '';
  const { Location: _drop, ...rest } = plain;
  const location =
    nameFromJoin ||
    (typeof rest.location === 'string' ? rest.location : '') ||
    '';
  const rawLid = rest.locationId;
  const lid =
    rawLid != null && rawLid !== '' && Number.isFinite(Number(rawLid)) ? Number(rawLid) : null;

  return normalizeTourPlain({
    ...rest,
    location,
    locationId: lid,
  } as TourRecord & Record<string, unknown>);
}

export type TourRecord = {
  id: number;
  title: string;
  slug?: string | null;
  locationId?: number | null;
  location: string;
  price: number;
  duration: string;
  category: TourCategory;
  status: 'Draft' | 'Active' | 'Inactive';
  image: string;
  inquiryPhone?: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  itinerary: TourItineraryDay[];
  includes: string[];
  excludes: string[];
  gallery: string[];
  videoUrl?: string;
  showOnHome?: boolean;
  homeSortOrder?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

async function ensureToursTable() {
  await sequelize.authenticate();
  // Kept for compatibility with the existing prototype workflow where the table
  // may not be present yet on a fresh environment.
  await Location.sync();
  await Tour.sync();
}

const getToursFromDb = unstable_cache(
  async () => {
    await ensureToursTable();

    const tours = await Tour.findAll({
      order: [['createdAt', 'DESC']],
      include: [tourIncludeLocation],
    });

    return tours.map((tour) => mapTourRow(tour));
  },
  ['tours', 'all'],
  {
    tags: [TAG_TOURS_LIST],
  }
);

export const getCachedTours = cache(async () => getToursFromDb());

export const getCachedActiveTours = cache(async () => {
  const tours = await getToursFromDb();
  return tours.filter((tour) => tour.status === 'Active');
});

/** Active tours marked for the home "Popular Tour Packages" slider, ordered by `homeSortOrder`. */
export const getCachedHomeFeaturedTours = cache(async () => {
  const tours = await getToursFromDb();
  const { getTourPublicPath } = await import("@/src/lib/tours/public-path");
  return tours
    .filter(
      (tour) =>
        tour.status === "Active" &&
        Boolean(tour.showOnHome) &&
        Boolean(getTourPublicPath(tour))
    )
    .sort((a, b) => {
      const orderA = Number(a.homeSortOrder ?? 0);
      const orderB = Number(b.homeSortOrder ?? 0);
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 8);
});

export const getCachedTourById = cache(async (id: string) => {
  const getTourFromDb = unstable_cache(
    async () => {
      await sequelize.authenticate();
      const tour = await Tour.findByPk(id, { include: [tourIncludeLocation] });
      if (!tour) {
        return null;
      }
      return mapTourRow(tour);
    },
    ['tour', id],
    {
      tags: [tourDetailTag(id)],
    }
  );

  return getTourFromDb();
});

async function loadTourByPublicParam(param: string): Promise<TourRecord | null> {
  await ensureToursTable();
  const key = decodeURIComponent(param).trim();
  if (!key) {
    return null;
  }

  const isNumeric = /^\d+$/.test(key);
  const row = isNumeric
    ? await Tour.findByPk(key, { include: [tourIncludeLocation] })
    : await Tour.findOne({ where: { slug: key }, include: [tourIncludeLocation] });

  if (!row) {
    return null;
  }

  return mapTourRow(row);
}

/**
 * Tour detail for public `/tours/[slug]` (slug or legacy numeric id).
 * Cache is keyed by URL segment; invalidate with `tourRouteTag(segment)` on writes.
 */
export const getCachedTourForPublicPage = cache(async (param: string) => {
  const run = unstable_cache(
    async () => loadTourByPublicParam(param),
    ['tour-public', param],
    { tags: [TAG_TOURS_LIST, tourRouteTag(param)] }
  );
  return run();
});

/** Prebuild only slug URLs; legacy `/tours/{id}` still works when `dynamicParams` is true. */
export async function generateStaticParamsForActiveTours() {
  const tours = await getCachedActiveTours();
  return tours
    .map((t) => (typeof t.slug === "string" ? t.slug.trim() : ""))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}
