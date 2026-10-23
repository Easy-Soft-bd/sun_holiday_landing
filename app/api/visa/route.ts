import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import VisaCountry from '@/src/models/VisaCountry';
import { ensureVisaCountriesReady, getCachedVisaCountries, mapVisaRow } from '@/src/lib/data/visa';
import { allocateUniqueVisaSlug, isVisaSlugTaken } from '@/src/lib/visa/slug';
import { slugifyText } from '@/src/lib/tours/slugify-text';
import { readNullableText, readSortOrder, readStatus, readTrimmed } from '@/src/lib/visa/input';
import { revalidateVisaCaches } from '@/src/lib/visa/revalidate';

export async function GET() {
  try {
    const countries = await getCachedVisaCountries();
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching visa countries:', error);
    return NextResponse.json({ error: 'Failed to fetch visa countries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requirePermission('visa');
    if (denied) return denied;

    const body = (await request.json()) as Record<string, unknown>;
    const name = readTrimmed(body.name);
    const excerpt = readTrimmed(body.excerpt);
    const coverImage = readTrimmed(body.coverImage);
    const content = typeof body.content === 'string' ? body.content : '';
    const flagImage = readNullableText(body.flagImage) ?? null;
    const flagEmoji = readNullableText(body.flagEmoji) ?? null;
    const status = readStatus(body.status, 'Draft');
    const sortOrder = readSortOrder(body.sortOrder, 0);

    if (!name || !excerpt || !coverImage || !content.trim()) {
      return NextResponse.json(
        { error: 'Country name, summary, cover image, and visa content are required.' },
        { status: 400 }
      );
    }

    if (!flagImage && !flagEmoji) {
      return NextResponse.json(
        { error: 'Upload a flag image or enter a flag emoji.' },
        { status: 400 }
      );
    }

    await ensureVisaCountriesReady();

    const requestedSlug = readTrimmed(body.slug);
    let slug: string;
    if (requestedSlug) {
      const normalized = slugifyText(requestedSlug);
      if (await isVisaSlugTaken(normalized)) {
        return NextResponse.json({ error: 'That URL slug is already in use.' }, { status: 409 });
      }
      slug = normalized;
    } else {
      slug = await allocateUniqueVisaSlug(name, null);
    }

    const country = await VisaCountry.create({
      name,
      slug,
      flagImage,
      flagEmoji,
      coverImage,
      excerpt,
      content,
      status,
      sortOrder,
      metaTitle: readNullableText(body.metaTitle) ?? null,
      metaDescription: readNullableText(body.metaDescription) ?? null,
    });

    const record = mapVisaRow(country);
    revalidateVisaCaches(null, record);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating visa country:', error);
    return NextResponse.json({ error: 'Failed to create visa country' }, { status: 500 });
  }
}
