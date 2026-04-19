import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import Tour, { TourCategory, TourItineraryDay } from '@/src/models/Tour';
import sequelize from '@/src/lib/db';
import { TAG_TOURS_LIST, tourDetailTag } from '@/src/lib/revalidate-tags';

export type TourRecord = {
  id: number;
  title: string;
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
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

async function ensureToursTable() {
  await sequelize.authenticate();
  // Kept for compatibility with the existing prototype workflow where the table
  // may not be present yet on a fresh environment.
  await Tour.sync();
}

const getToursFromDb = unstable_cache(
  async () => {
    await ensureToursTable();

    const tours = await Tour.findAll({
      order: [['createdAt', 'DESC']],
    });

    return tours.map((tour) => tour.get({ plain: true }) as TourRecord);
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

export const getCachedTourById = cache(async (id: string) => {
  const getTourFromDb = unstable_cache(
    async () => {
      await sequelize.authenticate();
      const tour = await Tour.findByPk(id);
      return tour ? (tour.get({ plain: true }) as TourRecord) : null;
    },
    ['tour', id],
    {
      tags: [tourDetailTag(id)],
    }
  );

  return getTourFromDb();
});
