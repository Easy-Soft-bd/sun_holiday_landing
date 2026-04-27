import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Booking from '@/src/models/Booking';
import BookingActivity from '@/src/models/BookingActivity';
import Tour from '@/src/models/Tour';
import { getRequestContext } from '@/src/lib/request-meta';
import { isDuplicateBooking, isRateLimited, looksLikeSpam } from '@/src/lib/spam-guard';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES = ['New', 'Contacted', 'Confirmed', 'Cancelled'] as const;
type BookingStatus = (typeof ALLOWED_STATUSES)[number];

const ALLOWED_SERVICE_TYPES = ['tour', 'ticket', 'visa', 'resort', 'general'] as const;
type BookingServiceType = (typeof ALLOWED_SERVICE_TYPES)[number];

function normalizeServiceType(value: unknown): BookingServiceType | null {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  return ALLOWED_SERVICE_TYPES.includes(v as BookingServiceType)
    ? (v as BookingServiceType)
    : null;
}

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

function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status: 400 });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function sanitizeString(value: unknown, max = 500): string {
  return String(value ?? '').trim().slice(0, max);
}

async function ensureTable() {
  await sequelize.authenticate();
  await Tour.sync();
  await Booking.sync();
  await BookingActivity.sync();
}

/**
 * Resolve the tour reference for a booking submission. Accepts a numeric `tourId`
 * or a string `tourSlug` (used by the public modal). Returns a snapshot so the
 * row keeps its tour info even after the source tour is later edited or removed.
 */
async function resolveTourSnapshot(input: {
  tourId?: unknown;
  tourSlug?: unknown;
  tourTitle?: unknown;
}): Promise<{ tourId: number | null; tourTitle: string | null; tourSlug: string | null }> {
  const idNum = Number(input.tourId);
  if (Number.isFinite(idNum) && idNum > 0) {
    const tour = await Tour.findByPk(idNum);
    if (tour) {
      return {
        tourId: tour.id,
        tourTitle: tour.title,
        tourSlug: tour.slug ?? null,
      };
    }
  }
  if (typeof input.tourSlug === 'string' && input.tourSlug.trim()) {
    const slug = input.tourSlug.trim();
    const tour = await Tour.findOne({ where: { slug } });
    if (tour) {
      return {
        tourId: tour.id,
        tourTitle: tour.title,
        tourSlug: tour.slug ?? slug,
      };
    }
    // Tour not found by slug — keep the slug + provided title for context.
    return {
      tourId: null,
      tourTitle:
        typeof input.tourTitle === 'string' && input.tourTitle.trim()
          ? input.tourTitle.trim().slice(0, 255)
          : null,
      tourSlug: slug.slice(0, 255),
    };
  }
  if (typeof input.tourTitle === 'string' && input.tourTitle.trim()) {
    return {
      tourId: null,
      tourTitle: input.tourTitle.trim().slice(0, 255),
      tourSlug: null,
    };
  }
  return { tourId: null, tourTitle: null, tourSlug: null };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTable();

    const { searchParams } = new URL(request.url);
    const search = sanitizeString(searchParams.get('q'), 120);
    const status = sanitizeString(searchParams.get('status'), 32);
    const serviceType = normalizeServiceType(searchParams.get('serviceType'));
    const limit = Math.min(Number(searchParams.get('limit')) || 200, 500);

    const where: Record<string, unknown> = {};
    if (status && ALLOWED_STATUSES.includes(status as BookingStatus)) {
      where.status = status;
    }
    if (serviceType) {
      where.serviceType = serviceType;
    }
    if (search) {
      const like = `%${search}%`;
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: like } },
        { email: { [Op.like]: like } },
        { phone: { [Op.like]: like } },
        { message: { [Op.like]: like } },
        { ipAddress: { [Op.like]: like } },
        { serviceTitle: { [Op.like]: like } },
      ];
    }

    const rows = await Booking.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: Tour,
          as: 'Tour',
          attributes: ['id', 'title', 'slug'],
          required: false,
        },
      ],
    });
    return NextResponse.json({ data: rows.map((r) => r.get({ plain: true })) });
  } catch (error) {
    console.error('Error listing bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const auth = await verifyAuth();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const name = sanitizeString(body.name, 160);
    const phone = sanitizeString(body.phone, 40);
    const rawEmail = sanitizeString(body.email, 200).toLowerCase();
    const email = rawEmail || null;
    const message = sanitizeString(body.message, 4000);
    const source = sanitizeString(body.source, 255) || 'admin';
    const bookingDate = parseDate(body.bookingDate ?? body.date);
    const serviceTitle = sanitizeString(body.serviceTitle, 255) || null;
    const details = sanitizeDetails(body.details);

    if (!name) return badRequest('Name is required');
    if (!phone || !isPhone(phone)) return badRequest('A valid phone number is required');
    if (email && !isEmail(email)) return badRequest('Email is invalid');

    // Honeypot field – if a bot fills the hidden "website" input, drop the request.
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const ctx = getRequestContext(request);

    // Public submissions are rate limited & spam-checked; admin posts skip these checks.
    if (!auth.authenticated) {
      const rateKey = ctx.ipAddress || (email ? `email:${email}` : `phone:${phone}`);
      const limit = isRateLimited(rateKey);
      if (limit.limited) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429 }
        );
      }
      if (looksLikeSpam(message) || looksLikeSpam(name)) {
        return NextResponse.json(
          { error: 'Submission blocked by spam filter.' },
          { status: 422 }
        );
      }
      if (
        await isDuplicateBooking({
          ipAddress: ctx.ipAddress,
          email: email ?? '',
          phone,
          message,
        })
      ) {
        return NextResponse.json(
          { error: 'A similar booking was just submitted. Please wait a moment.' },
          { status: 409 }
        );
      }
    }

    const tourSnap = await resolveTourSnapshot({
      tourId: body.tourId,
      tourSlug: body.tourSlug,
      tourTitle: body.tourTitle,
    });

    // Infer service type: explicit > tour link > "general" fallback.
    const explicitService = normalizeServiceType(body.serviceType);
    const serviceType: BookingServiceType =
      explicitService ?? (tourSnap.tourId || tourSnap.tourTitle ? 'tour' : 'general');

    const resolvedServiceTitle =
      serviceTitle ||
      (serviceType === 'tour' ? tourSnap.tourTitle : null) ||
      null;

    const created = await Booking.create({
      name,
      phone,
      email,
      message,
      bookingDate,
      source,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      status: 'New',
      serviceType,
      serviceTitle: resolvedServiceTitle,
      details,
      tourId: tourSnap.tourId,
      tourTitle: tourSnap.tourTitle,
      tourSlug: tourSnap.tourSlug,
    });

    // Seed the CRM timeline with the initial submission entry.
    const actorLabel = auth.user?.email ? auth.user.email.split('@')[0] : 'Website';
    const serviceSummary = resolvedServiceTitle ? ` · ${resolvedServiceTitle}` : '';
    await BookingActivity.create({
      bookingId: created.id,
      type: 'system',
      body: auth.user?.email
        ? `Booking created from admin (${source})${serviceSummary}.`
        : `Booking submitted via ${source} [${serviceType}]${serviceSummary} (${ctx.ipAddress ?? 'unknown IP'}).`,
      meta: {
        source,
        serviceType,
        serviceTitle: resolvedServiceTitle,
        details,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
        tourId: tourSnap.tourId,
        tourTitle: tourSnap.tourTitle,
      },
      authorEmail: auth.user?.email ?? null,
      authorLabel: actorLabel,
    });

    await created.reload({
      include: [
        { model: Tour, as: 'Tour', attributes: ['id', 'title', 'slug'], required: false },
      ],
    });

    return NextResponse.json(created.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
