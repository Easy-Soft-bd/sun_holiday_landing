import { NextRequest, NextResponse } from 'next/server';
import Tour from '@/src/models/Tour';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';

export async function GET(request: Request) {
  try {
    await sequelize.authenticate();
    await Tour.sync(); // Ensure table exists - acceptable for prototype/dev

    const tours = await Tour.findAll({
      order: [['createdAt', 'DESC']],
    });

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
    const auth = await verifyAuth(request);
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

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}
