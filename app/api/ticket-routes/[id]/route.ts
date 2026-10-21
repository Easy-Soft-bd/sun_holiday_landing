import { NextRequest, NextResponse } from 'next/server';
import TicketRoute from '@/src/models/TicketRoute';
import { verifyAuth } from '@/src/lib/auth';
import { ensureTicketRoutesReady, getCachedTicketRouteById, mapTicketRouteRow } from '@/src/lib/data/ticket-routes';
import { readNullableText, readPrice, readSortOrder, readTicketStatus, readTrimmed } from '@/src/lib/ticket/input';
import { revalidateTicketRouteCaches } from '@/src/lib/ticket/revalidate';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const route = await getCachedTicketRouteById(id);
    if (!route) {
      return NextResponse.json({ error: 'Ticket route not found' }, { status: 404 });
    }
    return NextResponse.json(route);
  } catch (error) {
    console.error('Error fetching ticket route:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket route' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    await ensureTicketRoutesReady();

    const route = await TicketRoute.findByPk(id);
    if (!route) {
      return NextResponse.json({ error: 'Ticket route not found' }, { status: 404 });
    }

    const prev = mapTicketRouteRow(route);
    const from = readTrimmed(body.from) || prev.from;
    const to = readTrimmed(body.to) || prev.to;
    const priceFrom = body.priceFrom === undefined ? prev.priceFrom : readPrice(body.priceFrom);

    if (body.priceFrom !== undefined && body.priceFrom !== null && body.priceFrom !== '' && priceFrom === undefined) {
      return NextResponse.json({ error: 'Starting price must be a positive amount.' }, { status: 400 });
    }

    await route.update({
      from,
      to,
      airline: body.airline === undefined ? prev.airline : readNullableText(body.airline) ?? null,
      priceFrom: priceFrom ?? null,
      image: body.image === undefined ? prev.image : readNullableText(body.image) ?? null,
      note: body.note === undefined ? prev.note : readNullableText(body.note) ?? null,
      status: body.status === undefined ? prev.status : readTicketStatus(body.status, prev.status),
      sortOrder: body.sortOrder === undefined ? prev.sortOrder : readSortOrder(body.sortOrder, prev.sortOrder),
    });
    await route.reload();
    revalidateTicketRouteCaches();

    return NextResponse.json(mapTicketRouteRow(route));
  } catch (error) {
    console.error('Error updating ticket route:', error);
    return NextResponse.json({ error: 'Failed to update ticket route' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id } = await params;
    await ensureTicketRoutesReady();

    const route = await TicketRoute.findByPk(id);
    if (!route) {
      return NextResponse.json({ error: 'Ticket route not found' }, { status: 404 });
    }

    await route.destroy();
    revalidateTicketRouteCaches();

    return NextResponse.json({ message: 'Ticket route deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket route:', error);
    return NextResponse.json({ error: 'Failed to delete ticket route' }, { status: 500 });
  }
}
