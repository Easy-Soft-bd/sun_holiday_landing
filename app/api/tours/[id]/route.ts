import { NextRequest, NextResponse } from 'next/server';
import Tour from '@/src/models/Tour';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await sequelize.authenticate();

    const tour = await Tour.findByPk(id);

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
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    await sequelize.authenticate();

    const tour = await Tour.findByPk(id);

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    await tour.update(body);

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
    const auth = await verifyAuth(request);
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

    await tour.destroy();

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour' },
      { status: 500 }
    );
  }
}
