import { cache } from 'react';
import { isAdmin } from './auth';
import HomePage from '../models/HomePage';

export const getCachedAdminStatus = cache(async () => {
  return await isAdmin();
});

export const getCachedHomePageData = cache(async () => {
  const pageDataRaw = await HomePage.findOne();
  return pageDataRaw ? pageDataRaw.get({ plain: true }) : null;
});
