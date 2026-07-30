import { NextRequest, NextResponse } from 'next/server';
import Tour from '@/src/models/Tour';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCachedTourById } from '@/src/lib/data/tours';
import { TAG_TOURS_LIST, tourDetailTag, tourRouteTag } from '@/src/lib/revalidate-tags';
import type { TourRecord } from '@/src/lib/data/tours';
import { allocateUniqueTourSlug } from '@/src/lib/tours/slug';
import { resolveTourLocationFields } from '@/src/lib/locations/resolve-tour-location';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const tour = await getCachedTourById(id);

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;
    await sequelize.authenticate();

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    const prev = tour.get({ plain: true }) as TourRecord;
    const { slug: slugFromBody, locationId: locIdRaw, location: locationField, ...rest } = body;

    const fromBody =
      locIdRaw !== undefined && locIdRaw !== null && locIdRaw !== ''
        ? Number(locIdRaw)
        : NaN;
    const fromPrev = prev.locationId != null ? Number(prev.locationId) : NaN;
    const parsedId = Number.isFinite(fromBody) && fromBody > 0 ? fromBody : fromPrev;
    const hasId = Number.isFinite(parsedId) && parsedId > 0;

    let resolvedLoc: { locationId: number; location: string };
    try {
      resolvedLoc = await resolveTourLocationFields({
        locationId: hasId ? parsedId : undefined,
        location: !hasId
          ? (typeof locationField === 'string' ? locationField : prev.location)
          : undefined,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid location';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    let nextSlug: string;
    if (slugFromBody !== undefined && String(slugFromBody).trim() !== '') {
      nextSlug = await allocateUniqueTourSlug(
        typeof rest.title === 'string' ? rest.title : prev.title,
        String(slugFromBody),
        tour.id
      );
    } else if (prev.slug?.trim()) {
      nextSlug = prev.slug.trim();
    } else {
      nextSlug = await allocateUniqueTourSlug(prev.title, null, tour.id);
    }

    await tour.update({ ...rest, ...resolvedLoc, slug: nextSlug } as never);
    await tour.reload();
    const next = tour.get({ plain: true }) as TourRecord;

    revalidateTag(TAG_TOURS_LIST, 'max');
    revalidateTag(tourDetailTag(id), 'max');

    const segments = new Set<string>();
    segments.add(String(prev.id));
    segments.add(String(next.id));
    if (prev.slug?.trim()) segments.add(prev.slug.trim());
    if (next.slug?.trim()) segments.add(next.slug.trim());
    for (const s of segments) {
      revalidateTag(tourRouteTag(s), 'max');
    }
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check authentication
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await sequelize.authenticate();

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    const prev = tour.get({ plain: true }) as TourRecord;
    await tour.destroy();
    revalidateTag(TAG_TOURS_LIST, 'max');
    revalidateTag(tourDetailTag(id), 'max');
    revalidateTag(tourRouteTag(String(id)), 'max');
    if (prev.slug?.trim()) {
      revalidateTag(tourRouteTag(prev.slug.trim()), 'max');
    }
    revalidatePath('/');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour' },
      { status: 500 }
    );
  }
}
