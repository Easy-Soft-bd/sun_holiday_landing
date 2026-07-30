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

    const body = (await request.json()) as Record<string, unknown>;
    const payload: Record<string, unknown> = { ...body };

    // Only touch contact fields when the client actually sent them (supports partial updates).
    if ('contactEmails' in body || 'contactEmail' in body) {
      const contactEmails = Array.isArray(body.contactEmails)
        ? body.contactEmails.map((v) => String(v).trim()).filter(Boolean)
        : parseMultiValue(body.contactEmail);
      payload.contactEmail = contactEmails.join('\n');
      delete payload.contactEmails;
    }

    if ('contactPhones' in body || 'contactPhone' in body) {
      const contactPhones = Array.isArray(body.contactPhones)
        ? body.contactPhones.map((v) => String(v).trim()).filter(Boolean)
        : parseMultiValue(body.contactPhone);
      payload.contactPhone = contactPhones.join('\n');
      delete payload.contactPhones;
    }

    if ('googleMapsUrl' in body) {
      payload.googleMapsUrl = String(body.googleMapsUrl ?? '').trim();
    }
    if ('address' in body) {
      payload.address = String(body.address ?? '').trim();
    }
    if ('socialLinks' in body) {
      payload.socialLinks = normalizeSocialLinks(body.socialLinks);
    }

    for (const key of Object.keys(payload)) {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    }

    let settings = await GeneralSettings.findOne();

    if (!settings) {
      settings = await GeneralSettings.create(payload);
    } else {
      await settings.update(payload);
    }

    revalidateTag(TAG_GENERAL_SETTINGS, 'max');
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');

    const plain = settings.get({ plain: true }) as Record<string, unknown>;
    return NextResponse.json({ success: true, data: normalizeSettingsPlain(plain) });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
