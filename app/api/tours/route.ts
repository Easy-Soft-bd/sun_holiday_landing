import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Tour from '@/src/models/Tour';
import { revalidateTag } from 'next/cache';
import { getCachedTours } from '@/src/lib/data/tours';
import { TAG_TOURS_LIST } from '@/src/lib/revalidate-tags';

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

    const body = await request.json();
    
    // Basic validation could go here, but Sequelize handles model validation
    
    await sequelize.authenticate();
    
    const tour = await Tour.create(body);
    revalidateTag(TAG_TOURS_LIST, 'max');

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}
