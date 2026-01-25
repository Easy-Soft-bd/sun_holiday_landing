import { NextResponse } from 'next/server';
import GeneralSettings from '@/src/models/GeneralSettings';
import { isAdmin } from '@/src/lib/auth';

export async function GET() {
  try {
    let settings = await GeneralSettings.findOne();
    if (!settings) {
      settings = await GeneralSettings.create({
        siteName: 'Sun Holidays',
        contactEmail: 'info@sunholidaysltd.com',
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let settings = await GeneralSettings.findOne();

    if (!settings) {
      settings = await GeneralSettings.create(body);
    } else {
      await settings.update(body);
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
