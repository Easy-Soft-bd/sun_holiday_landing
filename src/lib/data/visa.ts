import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import VisaCountry, { VisaCountryStatus } from '@/src/models/VisaCountry';
import sequelize from '@/src/lib/db';
import { TAG_VISA_LIST, visaDetailTag, visaRouteTag } from '@/src/lib/revalidate-tags';
import { allocateUniqueVisaSlug } from '@/src/lib/visa/slug';
import { visaServices, type VisaService } from '@/src/view/visa/data/visaData';

export type VisaCountryRecord = {
  id: number;
  name: string;
  slug: string;
  flagImage: string | null;
  flagEmoji: string | null;
  coverImage: string;
  excerpt: string;
  content: string;
  status: VisaCountryStatus;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

/** Listing card. Omits the long HTML body. */
export type VisaCountryCard = {
  id: number;
  name: string;
  slug: string;
  flagImage: string | null;
  flagEmoji: string | null;
  coverImage: string;
  excerpt: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function seedContent(visa: VisaService) {
  const sections = visa.requirements.map((group) => {
    const items = group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    return `<h2>${escapeHtml(group.title)}</h2><ul>${items}</ul>`;
  });
  return sections.join('');
}

export function mapVisaRow(row: VisaCountry): VisaCountryRecord {
  const plain = row.get({ plain: true }) as VisaCountryRecord;
  return {
    ...plain,
    id: Number(plain.id),
    slug: typeof plain.slug === 'string' ? plain.slug : '',
    flagImage: plain.flagImage?.trim() ? plain.flagImage : null,
    flagEmoji: plain.flagEmoji?.trim() ? plain.flagEmoji : null,
    metaTitle: plain.metaTitle ?? null,
    metaDescription: plain.metaDescription ?? null,
    sortOrder: Number(plain.sortOrder ?? 0),
  };
}

export function toVisaCountryCard(country: VisaCountryRecord): VisaCountryCard {
  return {
    id: country.id,
    name: country.name,
    slug: country.slug,
    flagImage: country.flagImage,
    flagEmoji: country.flagEmoji,
    coverImage: country.coverImage,
    excerpt: country.excerpt,
  };
}

async function seedVisaCountriesIfEmpty() {
  const count = await VisaCountry.count();
  if (count > 0) return;

  for (const [index, visa] of visaServices.entries()) {
    const slug = await allocateUniqueVisaSlug(visa.country, null);
    const description = visa.description.trim();
    await VisaCountry.create({
      name: visa.country,
      slug,
      flagImage: null,
      flagEmoji: visa.flag,
      coverImage: visa.image,
      excerpt: description,
      content: seedContent(visa),
      status: 'Active',
      sortOrder: index + 1,
      metaTitle: `${visa.country} Visa Assistance`,
      metaDescription: description.length > 160 ? `${description.slice(0, 157).trim()}…` : description,
    });
  }
}

export async function ensureVisaCountriesReady() {
  await sequelize.authenticate();
  await VisaCountry.sync();
  await seedVisaCountriesIfEmpty();
}

const getVisaCountriesFromDb = unstable_cache(
  async () => {
    await ensureVisaCountriesReady();
    const rows = await VisaCountry.findAll({
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });
    return rows.map((row) => mapVisaRow(row));
  },
  ['visa-countries'],
  { tags: [TAG_VISA_LIST] }
);

export const getCachedVisaCountries = cache(async () => getVisaCountriesFromDb());

export const getCachedActiveVisaCountries = cache(async () => {
  const countries = await getVisaCountriesFromDb();
  return countries.filter((country) => country.status === 'Active');
});

export const getCachedVisaCountryById = cache(async (id: string) => {
  const getCountryFromDb = unstable_cache(
    async () => {
      await ensureVisaCountriesReady();
      const row = await VisaCountry.findByPk(id);
      if (!row) return null;
      return mapVisaRow(row);
    },
    ['visa-id', id],
    { tags: [visaDetailTag(id)] }
  );

  return getCountryFromDb();
});

async function loadVisaByPublicParam(param: string): Promise<VisaCountryRecord | null> {
  await ensureVisaCountriesReady();
  const key = decodeURIComponent(param).trim();
  if (!key) return null;

  const row = /^\d+$/.test(key)
    ? await VisaCountry.findByPk(key)
    : await VisaCountry.findOne({ where: { slug: key } });

  if (!row) return null;
  return mapVisaRow(row);
}

/** Visa detail for `/visa/[slug]` (slug or legacy numeric id). */
export const getCachedVisaForPublicPage = cache(async (param: string) => {
  const run = unstable_cache(
    async () => loadVisaByPublicParam(param),
    ['visa-detail', param],
    { tags: [TAG_VISA_LIST, visaRouteTag(param)] }
  );
  return run();
});

export async function generateStaticParamsForActiveVisaCountries() {
  const countries = await getCachedActiveVisaCountries();
  return countries
    .map((country) => (typeof country.slug === 'string' ? country.slug.trim() : ''))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}
