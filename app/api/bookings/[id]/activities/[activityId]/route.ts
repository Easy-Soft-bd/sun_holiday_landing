import { NextRequest, NextResponse } from 'next/server';
import sequelize from '@/src/lib/db';
import { verifyAuth } from '@/src/lib/auth';
import BookingActivity from '@/src/models/BookingActivity';

export const dynamic = 'force-dynamic';

interface Params {
  params: Promise<{ id: string; activityId: string }>;
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const auth = await verifyAuth();
    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, activityId } = await params;
    await sequelize.authenticate();
    const row = await BookingActivity.findOne({
      where: { id: activityId, bookingId: id },
    });
    if (!row) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    // Auto-generated audit entries cannot be removed by admins.
    if (row.type === 'status_change' || row.type === 'system') {
      return NextResponse.json(
        { error: 'System-generated entries cannot be deleted' },
        { status: 400 }
      );
    }
    await row.destroy();
    return NextResponse.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
