import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Tour from '@/src/models/Tour';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCachedTours } from '@/src/lib/data/tours';
import { TAG_TOURS_LIST } from '@/src/lib/revalidate-tags';
import { allocateUniqueTourSlug } from '@/src/lib/tours/slug';
import { resolveTourLocationFields } from '@/src/lib/locations/resolve-tour-location';

export async function GET() {
  try {
    const tours = await getCachedTours();

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json() as Record<string, unknown>;
    const { slug: slugFromBody, locationId, location: locationField, ...rest } = body;
    const title = typeof rest.title === 'string' ? rest.title : '';

    await sequelize.authenticate();

    let resolvedLoc: { locationId: number; location: string };
    try {
      resolvedLoc = await resolveTourLocationFields({ locationId, location: locationField });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid location';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const slug = await allocateUniqueTourSlug(
      title,
      typeof slugFromBody === 'string' ? slugFromBody : null
    );

    // Sequelize JSON fields + dynamic admin payload; validated at runtime
    const tour = await Tour.create({ ...rest, ...resolvedLoc, slug } as never);
    revalidateTag(TAG_TOURS_LIST, 'max');
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}
