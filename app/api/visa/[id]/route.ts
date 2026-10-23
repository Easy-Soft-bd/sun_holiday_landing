import { NextRequest, NextResponse } from 'next/server';
import VisaCountry from '@/src/models/VisaCountry';
import sequelize from '@/src/lib/db';
import { requirePermission } from '@/src/lib/auth';
import { ensureVisaCountriesReady, getCachedVisaCountryById, mapVisaRow } from '@/src/lib/data/visa';
import { isVisaSlugTaken } from '@/src/lib/visa/slug';
import { slugifyText } from '@/src/lib/tours/slugify-text';
import { readNullableText, readSortOrder, readStatus, readTrimmed } from '@/src/lib/visa/input';
import { revalidateVisaCaches } from '@/src/lib/visa/revalidate';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const country = await getCachedVisaCountryById(id);

    if (!country) {
      return NextResponse.json({ error: 'Visa country not found' }, { status: 404 });
    }

    return NextResponse.json(country);
  } catch (error) {
    console.error('Error fetching visa country:', error);
    return NextResponse.json({ error: 'Failed to fetch visa country' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const denied = await requirePermission('visa');
    if (denied) return denied;

    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    await ensureVisaCountriesReady();

    const country = await VisaCountry.findByPk(id);
    if (!country) {
      return NextResponse.json({ error: 'Visa country not found' }, { status: 404 });
    }

    const prev = mapVisaRow(country);
    const name = readTrimmed(body.name) || prev.name;
    const excerpt = readTrimmed(body.excerpt) || prev.excerpt;
    const coverImage = readTrimmed(body.coverImage) || prev.coverImage;
    const content = typeof body.content === 'string' ? body.content : prev.content;
    const flagImage =
      body.flagImage === undefined ? prev.flagImage : readNullableText(body.flagImage) ?? null;
    const flagEmoji =
      body.flagEmoji === undefined ? prev.flagEmoji : readNullableText(body.flagEmoji) ?? null;
    const status = body.status === undefined ? prev.status : readStatus(body.status, prev.status);
    const sortOrder = body.sortOrder === undefined ? prev.sortOrder : readSortOrder(body.sortOrder, prev.sortOrder);

    if (!content.trim()) {
      return NextResponse.json({ error: 'Visa content is required.' }, { status: 400 });
    }

    if (!flagImage && !flagEmoji) {
      return NextResponse.json(
        { error: 'Upload a flag image or enter a flag emoji.' },
        { status: 400 }
      );
    }

    const requestedSlug = body.slug === undefined ? prev.slug : readTrimmed(body.slug);
    const normalized = slugifyText(requestedSlug || name);
    if (await isVisaSlugTaken(normalized, country.id)) {
      return NextResponse.json({ error: 'That URL slug is already in use.' }, { status: 409 });
    }

    const metaTitle =
      body.metaTitle === undefined ? prev.metaTitle : readNullableText(body.metaTitle) ?? null;
    const metaDescription =
      body.metaDescription === undefined
        ? prev.metaDescription
        : readNullableText(body.metaDescription) ?? null;

    await country.update({
      name,
      slug: normalized,
      flagImage,
      flagEmoji,
      coverImage,
      excerpt,
      content,
      status,
      sortOrder,
      metaTitle,
      metaDescription,
    });
    await country.reload();
    const next = mapVisaRow(country);
    revalidateVisaCaches(prev, next);

    return NextResponse.json(next);
  } catch (error) {
    console.error('Error updating visa country:', error);
    return NextResponse.json({ error: 'Failed to update visa country' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const denied = await requirePermission('visa');
    if (denied) return denied;

    const { id } = await params;
    await sequelize.authenticate();

    const country = await VisaCountry.findByPk(id);
    if (!country) {
      return NextResponse.json({ error: 'Visa country not found' }, { status: 404 });
    }

    const prev = mapVisaRow(country);
    await country.destroy();
    revalidateVisaCaches(prev);

    return NextResponse.json({ message: 'Visa country deleted successfully' });
  } catch (error) {
    console.error('Error deleting visa country:', error);
    return NextResponse.json({ error: 'Failed to delete visa country' }, { status: 500 });
  }
}
