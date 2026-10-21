import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/src/lib/auth';
import TicketRoute from '@/src/models/TicketRoute';
import { ensureTicketRoutesReady, getCachedTicketRoutes, mapTicketRouteRow } from '@/src/lib/data/ticket-routes';
import { readNullableText, readPrice, readSortOrder, readTicketStatus, readTrimmed } from '@/src/lib/ticket/input';
import { revalidateTicketRouteCaches } from '@/src/lib/ticket/revalidate';

export async function GET() {
  try {
    const routes = await getCachedTicketRoutes();
    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error fetching ticket routes:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket routes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const from = readTrimmed(body.from);
    const to = readTrimmed(body.to);
    const priceFrom = readPrice(body.priceFrom);

    if (!from || !to) {
      return NextResponse.json({ error: 'Departure and destination are required.' }, { status: 400 });
    }
    if (body.priceFrom !== undefined && body.priceFrom !== null && body.priceFrom !== '' && priceFrom === undefined) {
      return NextResponse.json({ error: 'Starting price must be a positive amount.' }, { status: 400 });
    }

    await ensureTicketRoutesReady();

    const route = await TicketRoute.create({
      from,
      to,
      airline: readNullableText(body.airline) ?? null,
      priceFrom: priceFrom ?? null,
      image: readNullableText(body.image) ?? null,
      note: readNullableText(body.note) ?? null,
      status: readTicketStatus(body.status, 'Active'),
      sortOrder: readSortOrder(body.sortOrder, 0),
    });

    revalidateTicketRouteCaches();
    return NextResponse.json(mapTicketRouteRow(route), { status: 201 });
  } catch (error) {
    console.error('Error creating ticket route:', error);
    return NextResponse.json({ error: 'Failed to create ticket route' }, { status: 500 });
  }
}
