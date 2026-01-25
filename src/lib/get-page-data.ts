import { cache } from 'react';
import { isAdmin } from './auth';
import HomePage from '../models/HomePage';
import GeneralSettings from '../models/GeneralSettings';

export const getCachedAdminStatus = cache(async () => {
  return await isAdmin();
});

export const getCachedHomePageData = cache(async () => {
  const pageDataRaw = await HomePage.findOne();
  return pageDataRaw ? pageDataRaw.get({ plain: true }) : null;
});

export const getCachedSettings = cache(async () => {
  const settingsRaw = await GeneralSettings.findOne();
  return settingsRaw ? settingsRaw.get({ plain: true }) : null;
});
