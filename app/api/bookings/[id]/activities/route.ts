import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Booking from '@/src/models/Booking';
import BookingActivity, { BookingActivityType } from '@/src/models/BookingActivity';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string }>;
}

const ALLOWED_TYPES: BookingActivityType[] = [
  'note',
  'call',
  'email',
  'sms',
  'whatsapp',
  'meeting',
];

function sanitizeString(value: unknown, max = 4000): string {
  return String(value ?? '').trim().slice(0, max);
}

async function requireAuth() {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    return { auth, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { auth, response: null };
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { auth, response } = await requireAuth();
    if (response) return response;
    void auth;
    const { id } = await params;
    await sequelize.authenticate();

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    const rows = await BookingActivity.findAll({
      where: { bookingId: booking.id },
      order: [['createdAt', 'DESC']],
      limit: 200,
    });
    return NextResponse.json({ data: rows.map((r) => r.get({ plain: true })) });
  } catch (error) {
    console.error('Error listing activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { auth, response } = await requireAuth();
    if (response) return response;
    const { id } = await params;
    await sequelize.authenticate();

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const rawType = sanitizeString(body.type, 32) as BookingActivityType;
    const type = ALLOWED_TYPES.includes(rawType) ? rawType : 'note';
    const text = sanitizeString(body.body, 4000);
    if (!text) {
      return NextResponse.json({ error: 'Activity body is required' }, { status: 400 });
    }

    const actor = auth.user?.email ?? 'admin';
    const actorLabel = auth.user?.email ? auth.user.email.split('@')[0] : 'Admin';

    const created = await BookingActivity.create({
      bookingId: booking.id,
      type,
      body: text,
      meta: null,
      authorEmail: actor,
      authorLabel: actorLabel,
    });

    return NextResponse.json(created.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
