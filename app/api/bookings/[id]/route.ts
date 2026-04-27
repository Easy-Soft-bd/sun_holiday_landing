import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Booking, { BookingServiceType, BookingStatus } from '@/src/models/Booking';
import BookingActivity from '@/src/models/BookingActivity';
import Tour from '@/src/models/Tour';

const tourInclude = {
  model: Tour,
  as: 'Tour' as const,
  attributes: ['id', 'title', 'slug'],
  required: false,
};

interface Params {
  params: Promise<{ id: string }>;
}

const ALLOWED_STATUSES: BookingStatus[] = ['New', 'Contacted', 'Confirmed', 'Cancelled'];
const ALLOWED_SERVICE_TYPES: BookingServiceType[] = [
  'tour',
  'ticket',
  'visa',
  'resort',
  'general',
];

function sanitizeDetails(value: unknown): Record<string, unknown> | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object' || Array.isArray(value)) return null;
  try {
    const json = JSON.stringify(value);
    if (json.length > 8000) return JSON.parse(json.slice(0, 8000));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

function parseDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== 'string') return undefined;
  const d = new Date(value.trim());
  return Number.isNaN(d.getTime()) ? null : d;
}

function sanitizeString(value: unknown, max = 500): string {
  return String(value ?? '').trim().slice(0, max);
}

async function requireAuth() {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const unauthorized = await requireAuth();
    if (unauthorized) return unauthorized;
    const { id } = await params;
    await sequelize.authenticate();
    const row = await Booking.findByPk(id, { include: [tourInclude] });
    if (!row) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(row.get({ plain: true }));
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const unauthorized = await requireAuth();
    if (unauthorized) return unauthorized;
    const auth = await verifyAuth();
    const { id } = await params;
    await sequelize.authenticate();

    const row = await Booking.findByPk(id);
    if (!row) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const update: Record<string, unknown> = {};
    const previousStatus = row.status;
    const previousTourId = row.tourId;
    const previousTourTitle = row.tourTitle;

    if (body.name !== undefined) {
      const v = sanitizeString(body.name, 160);
      if (!v) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      update.name = v;
    }
    if (body.phone !== undefined) {
      const v = sanitizeString(body.phone, 40);
      if (!isPhone(v)) return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
      update.phone = v;
    }
    if (body.email !== undefined) {
      const raw = sanitizeString(body.email, 200).toLowerCase();
      if (raw && !isEmail(raw))
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
      update.email = raw || null;
    }
    if (body.message !== undefined) update.message = sanitizeString(body.message, 4000);
    if (body.source !== undefined) update.source = sanitizeString(body.source, 255);
    if (body.notes !== undefined) update.notes = sanitizeString(body.notes, 4000);
    if (body.serviceType !== undefined) {
      const v = sanitizeString(body.serviceType, 32).toLowerCase() as BookingServiceType;
      if (!ALLOWED_SERVICE_TYPES.includes(v)) {
        return NextResponse.json({ error: 'Invalid service type' }, { status: 400 });
      }
      update.serviceType = v;
    }
    if (body.serviceTitle !== undefined) {
      update.serviceTitle = sanitizeString(body.serviceTitle, 255) || null;
    }
    if (body.details !== undefined) {
      update.details = sanitizeDetails(body.details);
    }
    if (body.status !== undefined) {
      const v = sanitizeString(body.status, 32) as BookingStatus;
      if (!ALLOWED_STATUSES.includes(v)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      update.status = v;
    }
    const parsed = parseDate(body.bookingDate ?? body.date);
    if (parsed !== undefined) update.bookingDate = parsed;

    if (body.tourId !== undefined) {
      const raw = body.tourId;
      if (raw === null || raw === '') {
        update.tourId = null;
        if (body.tourTitle === undefined) update.tourTitle = null;
        if (body.tourSlug === undefined) update.tourSlug = null;
      } else {
        const idNum = Number(raw);
        if (!Number.isFinite(idNum) || idNum <= 0) {
          return NextResponse.json({ error: 'Invalid tour' }, { status: 400 });
        }
        const tour = await Tour.findByPk(idNum);
        if (!tour) {
          return NextResponse.json({ error: 'Tour not found' }, { status: 400 });
        }
        update.tourId = tour.id;
        update.tourTitle = tour.title;
        update.tourSlug = tour.slug ?? null;
      }
    }
    if (body.tourTitle !== undefined && update.tourTitle === undefined) {
      update.tourTitle = sanitizeString(body.tourTitle, 255) || null;
    }
    if (body.tourSlug !== undefined && update.tourSlug === undefined) {
      update.tourSlug = sanitizeString(body.tourSlug, 255) || null;
    }

    await row.update(update);

    // Audit log: every meaningful change shows up in the CRM timeline.
    const actor = auth.user?.email ?? 'system';
    const actorLabel = auth.user?.email ? auth.user.email.split('@')[0] : 'System';
    const auditEntries: Array<{
      type: 'status_change' | 'system';
      body: string;
      meta: Record<string, unknown>;
    }> = [];
    if (
      typeof update.status === 'string' &&
      update.status !== previousStatus
    ) {
      auditEntries.push({
        type: 'status_change',
        body: `Status changed from ${previousStatus} → ${update.status}`,
        meta: { from: previousStatus, to: update.status },
      });
    }
    if (
      Object.prototype.hasOwnProperty.call(update, 'tourId') &&
      (update.tourId ?? null) !== (previousTourId ?? null)
    ) {
      const newTitle = (update.tourTitle as string | null | undefined) ?? row.tourTitle ?? null;
      auditEntries.push({
        type: 'system',
        body: previousTourId
          ? newTitle
            ? `Tour package changed from "${previousTourTitle ?? '—'}" to "${newTitle}"`
            : `Tour package "${previousTourTitle ?? '—'}" was removed`
          : `Linked tour package: "${newTitle ?? 'Unknown'}"`,
        meta: {
          fromId: previousTourId,
          fromTitle: previousTourTitle,
          toId: update.tourId ?? null,
          toTitle: newTitle,
        },
      });
    }
    if (auditEntries.length) {
      await BookingActivity.bulkCreate(
        auditEntries.map((entry) => ({
          bookingId: row.id,
          type: entry.type,
          body: entry.body,
          meta: entry.meta,
          authorEmail: actor,
          authorLabel: actorLabel,
        }))
      );
    }

    await row.reload({ include: [tourInclude] });
    return NextResponse.json(row.get({ plain: true }));
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const unauthorized = await requireAuth();
    if (unauthorized) return unauthorized;
    const { id } = await params;
    await sequelize.authenticate();
    const row = await Booking.findByPk(id);
    if (!row) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    await row.destroy();
    return NextResponse.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
