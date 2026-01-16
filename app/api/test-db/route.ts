import { NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed');

    await sequelize.authenticate();
    
    let message = 'Connection has been established successfully.';
    
    if (seed === 'true') {
      const { seedAdmin } = await import('@/src/lib/seed');
      const seedResult = await seedAdmin();
      message += ` Seeding result: ${seedResult.message}`;
    }

    return NextResponse.json({ 
      status: 'success', 
      message 
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Unable to connect to the database.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
