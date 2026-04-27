import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Lead, { LeadStatus } from '@/src/models/Lead';

interface Params {
  params: Promise<{ id: string }>;
}

const ALLOWED_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted', 'Spam', 'Closed'];

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
    const row = await Lead.findByPk(id);
    if (!row) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    return NextResponse.json(row.get({ plain: true }));
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const unauthorized = await requireAuth();
    if (unauthorized) return unauthorized;
    const { id } = await params;
    await sequelize.authenticate();
    const row = await Lead.findByPk(id);
    if (!row) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const update: Record<string, unknown> = {};

    if (body.status !== undefined) {
      const v = sanitizeString(body.status, 32) as LeadStatus;
      if (!ALLOWED_STATUSES.includes(v)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      update.status = v;
    }
    if (body.notes !== undefined) update.notes = sanitizeString(body.notes, 4000);

    await row.update(update);
    await row.reload();
    return NextResponse.json(row.get({ plain: true }));
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const unauthorized = await requireAuth();
    if (unauthorized) return unauthorized;
    const { id } = await params;
    await sequelize.authenticate();
    const row = await Lead.findByPk(id);
    if (!row) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    await row.destroy();
    return NextResponse.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
