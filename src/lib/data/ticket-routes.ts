import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import TicketRoute, { TicketRouteStatus } from '@/src/models/TicketRoute';
import sequelize from '@/src/lib/db';
import { TAG_TICKET_ROUTES } from '@/src/lib/revalidate-tags';

export type TicketRouteRecord = {
  id: number;
  from: string;
  to: string;
  airline: string | null;
  priceFrom: number | null;
  image: string | null;
  note: string | null;
  status: TicketRouteStatus;
  sortOrder: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const SEED_ROUTES: Array<Omit<TicketRouteRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { status: TicketRouteStatus }> = [
  {
    from: 'Dhaka',
    to: 'Dubai',
    airline: 'Emirates',
    priceFrom: 45000,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=640&auto=format&fit=crop',
    note: null,
    status: 'Active',
    sortOrder: 1,
  },
  {
    from: 'Dhaka',
    to: 'Bangkok',
    airline: 'US-Bangla Airlines',
    priceFrom: 32000,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=640&auto=format&fit=crop',
    note: null,
    status: 'Active',
    sortOrder: 2,
  },
  {
    from: "Dhaka",
    to: "Cox's Bazar",
    airline: 'Biman Bangladesh',
    priceFrom: 4500,
    image: 'https://images.unsplash.com/photo-1658139657766-3ba1adc5a010?q=80&w=640&auto=format&fit=crop',
    note: null,
    status: 'Active',
    sortOrder: 3,
  },
  {
    from: 'Dhaka',
    to: 'Singapore',
    airline: 'Singapore Airlines',
    priceFrom: 55000,
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=640&auto=format&fit=crop',
    note: null,
    status: 'Active',
    sortOrder: 4,
  },
];

export function mapTicketRouteRow(row: TicketRoute): TicketRouteRecord {
  const plain = row.get({ plain: true }) as TicketRouteRecord;
  return {
    ...plain,
    id: Number(plain.id),
    from: plain.from?.trim() ?? '',
    to: plain.to?.trim() ?? '',
    airline: plain.airline?.trim() ? plain.airline.trim() : null,
    priceFrom: plain.priceFrom == null ? null : Number(plain.priceFrom),
    image: plain.image?.trim() ? plain.image.trim() : null,
    note: plain.note?.trim() ? plain.note.trim() : null,
    sortOrder: Number(plain.sortOrder ?? 0),
  };
}

async function seedTicketRoutesIfEmpty() {
  await sequelize.query("SELECT GET_LOCK('ticket_routes_seed', 10)");
  try {
    const count = await TicketRoute.count();
    if (count > 0) return;

    for (const route of SEED_ROUTES) {
      await TicketRoute.create(route);
    }
  } finally {
    await sequelize.query("SELECT RELEASE_LOCK('ticket_routes_seed')");
  }
}

export async function ensureTicketRoutesReady() {
  await sequelize.authenticate();
  await TicketRoute.sync();
  await seedTicketRoutesIfEmpty();
}

const getTicketRoutesFromDb = unstable_cache(
  async () => {
    await ensureTicketRoutesReady();
    const rows = await TicketRoute.findAll({
      order: [
        ['sortOrder', 'ASC'],
        ['from', 'ASC'],
        ['to', 'ASC'],
      ],
    });
    return rows.map((row) => mapTicketRouteRow(row));
  },
  ['ticket-routes'],
  { tags: [TAG_TICKET_ROUTES] }
);

export const getCachedTicketRoutes = cache(async () => getTicketRoutesFromDb());

export const getCachedActiveTicketRoutes = cache(async () => {
  const routes = await getTicketRoutesFromDb();
  return routes.filter((route) => route.status === 'Active');
});

export const getCachedTicketRouteById = cache(async (id: string) => {
  const getRouteFromDb = unstable_cache(
    async () => {
      await ensureTicketRoutesReady();
      const row = await TicketRoute.findByPk(id);
      if (!row) return null;
      return mapTicketRouteRow(row);
    },
    ['ticket-route-id', id],
    { tags: [TAG_TICKET_ROUTES] }
  );

  return getRouteFromDb();
});
