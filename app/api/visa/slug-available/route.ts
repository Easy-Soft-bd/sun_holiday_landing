import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { requirePermission } from '@/src/lib/auth';
import VisaCountry from '@/src/models/VisaCountry';
import { allocateUniqueVisaSlug } from '@/src/lib/visa/slug';
import { slugifyText } from '@/src/lib/tours/slugify-text';

/**
 * GET ?slug=...&excludeId=...&name=...
 * Admin-only. Normalizes slug and reports availability; suggests the next free slug if taken.
 */
export async function GET(request: NextRequest) {
  const denied = await requirePermission('visa');
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('slug') ?? '';
  const excludeRaw = searchParams.get('excludeId');
  const nameRaw = searchParams.get('name') ?? '';

  if (!raw.trim()) {
    return NextResponse.json({
      available: true,
      normalized: '',
      suggestion: null,
    });
  }

  const normalized = slugifyText(raw);
  const excludeId =
    excludeRaw && /^\d+$/.test(excludeRaw.trim())
      ? Number.parseInt(excludeRaw.trim(), 10)
      : undefined;

  try {
    await sequelize.authenticate();
    await VisaCountry.sync();
    const existing = await VisaCountry.findOne({ where: { slug: normalized } });
    const takenByOther = existing != null && (excludeId == null || existing.id !== excludeId);

    if (!takenByOther) {
      return NextResponse.json({
        available: true,
        normalized,
        suggestion: null,
      });
    }

    const name = nameRaw.trim() || normalized;
    const suggestion = await allocateUniqueVisaSlug(name, normalized, excludeId);

    return NextResponse.json({
      available: false,
      normalized,
      suggestion: suggestion !== normalized ? suggestion : null,
    });
  } catch (error) {
    console.error('visa slug-available:', error);
    return NextResponse.json({ error: 'Failed to check slug' }, { status: 500 });
  }
}
