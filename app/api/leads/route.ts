import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Lead, { LeadStatus } from '@/src/models/Lead';
import { getRequestContext } from '@/src/lib/request-meta';
import { isDuplicateLead, isRateLimited, looksLikeSpam } from '@/src/lib/spam-guard';

export const dynamic = 'force-dynamic';

const ALLOWED_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted', 'Spam', 'Closed'];

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

function sanitizeString(value: unknown, max = 500): string {
  return String(value ?? '').trim().slice(0, max);
}

async function ensureTable() {
  await sequelize.authenticate();
  await Lead.sync();
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
    const source = sanitizeString(searchParams.get('source'), 160);
    const limit = Math.min(Number(searchParams.get('limit')) || 200, 500);

    const where: Record<string, unknown> = {};
    if (status && ALLOWED_STATUSES.includes(status as LeadStatus)) where.status = status;
    if (source) where.source = source;
    if (search) {
      const like = `%${search}%`;
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: like } },
        { email: { [Op.like]: like } },
        { phone: { [Op.like]: like } },
        { message: { [Op.like]: like } },
        { source: { [Op.like]: like } },
        { pageUrl: { [Op.like]: like } },
        { ipAddress: { [Op.like]: like } },
      ];
    }

    const rows = await Lead.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
    });
    return NextResponse.json({ data: rows.map((r) => r.get({ plain: true })) });
  } catch (error) {
    console.error('Error listing leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const auth = await verifyAuth();

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const name = sanitizeString(body.name, 160);
    const email = sanitizeString(body.email, 200).toLowerCase();
    const phone = sanitizeString(body.phone, 40);
    const message = sanitizeString(body.message, 4000);
    const source = sanitizeString(body.source, 160) || 'website';
    const pageUrl = sanitizeString(body.pageUrl, 512) || null;

    if (!name) return badRequest('Name is required');
    if (!email || !isEmail(email)) return badRequest('A valid email is required');
    if (!phone || !isPhone(phone)) return badRequest('A valid phone number is required');

    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const ctx = getRequestContext(request);

    if (!auth.authenticated) {
      const rateKey = ctx.ipAddress || `email:${email}`;
      const limit = isRateLimited(rateKey);
      if (limit.limited) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429 }
        );
      }
      if (looksLikeSpam(message) || looksLikeSpam(name)) {
        return NextResponse.json({ error: 'Submission blocked by spam filter.' }, { status: 422 });
      }
      if (
        await isDuplicateLead({
          ipAddress: ctx.ipAddress,
          email,
          phone,
          message,
        })
      ) {
        return NextResponse.json(
          { error: 'A similar lead was just submitted. Please wait a moment.' },
          { status: 409 }
        );
      }
    }

    const created = await Lead.create({
      name,
      email,
      phone,
      message,
      source,
      pageUrl,
      ipAddress: ctx.ipAddress,
      userAgent: ctx.userAgent,
      referrer: ctx.referrer,
      status: 'New',
    });

    return NextResponse.json(created.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
