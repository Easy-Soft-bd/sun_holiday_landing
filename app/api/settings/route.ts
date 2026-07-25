import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import GeneralSettings from '@/src/models/GeneralSettings';
import { isAdmin } from '@/src/lib/auth';
import { TAG_GENERAL_SETTINGS } from '@/src/lib/revalidate-tags';
import { normalizeSocialLinks } from '@/src/lib/social-links';
import { normalizeSettingsPlain, parseMultiValue } from '@/src/lib/settings-normalize';

export async function GET() {
  try {
    let settings = await GeneralSettings.findOne();
    if (!settings) {
      settings = await GeneralSettings.create({
        siteName: 'Sun Tourism',
        contactEmail: 'info@sunholidaysltd.com',
      });
    }
    const plain = settings.get({ plain: true }) as Record<string, unknown>;
    return NextResponse.json({ success: true, data: normalizeSettingsPlain(plain) });
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
    const contactEmails = Array.isArray(body.contactEmails)
      ? body.contactEmails.map((v: unknown) => String(v).trim()).filter(Boolean)
      : parseMultiValue(body.contactEmail);
    const contactPhones = Array.isArray(body.contactPhones)
      ? body.contactPhones.map((v: unknown) => String(v).trim()).filter(Boolean)
      : parseMultiValue(body.contactPhone);

    const payload = {
      ...body,
      contactEmails,
      contactPhones,
      googleMapsUrl: String(body.googleMapsUrl ?? '').trim(),
      address: String(body.address ?? '').trim(),
      // Persist compatibility in existing string columns (no array columns required)
      contactEmail: contactEmails.join('\n'),
      contactPhone: contactPhones.join('\n'),
    };

    delete (payload as Record<string, unknown>).contactEmails;
    delete (payload as Record<string, unknown>).contactPhones;

    if ('socialLinks' in body) {
      payload.socialLinks = normalizeSocialLinks(body.socialLinks);
    }

    let settings = await GeneralSettings.findOne();

    if (!settings) {
      settings = await GeneralSettings.create(payload);
    } else {
      await settings.update(payload);
    }

    revalidateTag(TAG_GENERAL_SETTINGS, 'max');
    revalidatePath('/', 'layout');

    const plain = settings.get({ plain: true }) as Record<string, unknown>;
    return NextResponse.json({ success: true, data: normalizeSettingsPlain(plain) });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
