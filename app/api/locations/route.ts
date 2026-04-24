import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import Location from '@/src/models/Location';

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    await sequelize.authenticate();
    const rows = await Location.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
    });

    return NextResponse.json(rows.map((r) => r.get({ plain: true })));
  } catch (error) {
    console.error('GET /api/locations:', error);
    return NextResponse.json({ error: 'Failed to load locations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await request.json() as { name?: string };
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await sequelize.authenticate();
    const existing = await Location.findOne({ where: { name } });
    if (existing) {
      return NextResponse.json(existing.get({ plain: true }), { status: 200 });
    }

    const row = await Location.create({ name });
    return NextResponse.json(row.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('POST /api/locations:', error);
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
  }
}
