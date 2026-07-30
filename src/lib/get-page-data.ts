import { cache } from 'react';
import { getAdminSession, isAdmin } from './auth';
export { getCachedHomePageData, getCachedSettings } from '@/src/lib/data/home-page';
export { getCachedSunviaEcoResortPageData } from '@/src/lib/data/sunvia-eco-resort-page';
export { getCachedHomeFeaturedTours } from '@/src/lib/data/tours';

export const getCachedAdminStatus = cache(async () => {
  // This stays request-scoped because admin state depends on cookies().
  return await isAdmin();
});

export const getCachedAdminSession = cache(async () => {
  return getAdminSession();
});
