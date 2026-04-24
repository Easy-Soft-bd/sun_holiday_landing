import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Tour from '@/src/models/Tour';
import { allocateUniqueTourSlug } from '@/src/lib/tours/slug';
import { slugifyText } from '@/src/lib/tours/slugify-text';

/**
 * GET ?slug=...&excludeId=...&title=...
 * Admin-only. Normalizes slug and reports availability; suggests next free slug if taken.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('slug') ?? '';
  const excludeRaw = searchParams.get('excludeId');
  const titleRaw = searchParams.get('title') ?? '';

  if (!raw.trim()) {
    return NextResponse.json({
      available: true,
      normalized: '',
      suggestion: null,
    });
  }

  const normalized = slugifyText(raw);

  const excludeId =
    excludeRaw && /^\d+$/.test(excludeRaw.trim()) ? Number.parseInt(excludeRaw.trim(), 10) : undefined;

  try {
    await sequelize.authenticate();
    const existing = await Tour.findOne({ where: { slug: normalized } });
    const takenByOther =
      existing != null && (excludeId == null || existing.id !== excludeId);

    if (!takenByOther) {
      return NextResponse.json({
        available: true,
        normalized,
        suggestion: null,
      });
    }

    const title = typeof titleRaw === 'string' && titleRaw.trim() ? titleRaw : normalized;
    const suggestion = await allocateUniqueTourSlug(title, normalized, excludeId);

    return NextResponse.json({
      available: false,
      normalized,
      suggestion: suggestion !== normalized ? suggestion : null,
    });
  } catch (error) {
    console.error('slug-available:', error);
    return NextResponse.json({ error: 'Failed to check slug' }, { status: 500 });
  }
}
