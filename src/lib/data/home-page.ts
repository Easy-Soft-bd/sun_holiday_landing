import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import HomePage from '@/src/models/HomePage';
import GeneralSettings from '@/src/models/GeneralSettings';
import { TAG_GENERAL_SETTINGS, TAG_HOME_PAGE } from '@/src/lib/revalidate-tags';

const getHomePageDataFromDb = unstable_cache(
  async () => {
    const pageDataRaw = await HomePage.findOne();
    return pageDataRaw ? pageDataRaw.get({ plain: true }) : null;
  },
  ['home-page'],
  {
    tags: [TAG_HOME_PAGE],
  }
);

const getSettingsFromDb = unstable_cache(
  async () => {
    const settingsRaw = await GeneralSettings.findOne();
    return settingsRaw ? settingsRaw.get({ plain: true }) : null;
  },
  ['general-settings'],
  {
    tags: [TAG_GENERAL_SETTINGS],
  }
);

export const getCachedHomePageData = cache(async () => getHomePageDataFromDb());
export const getCachedSettings = cache(async () => getSettingsFromDb());
