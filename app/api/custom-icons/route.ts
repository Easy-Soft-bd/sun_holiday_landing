import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { UniqueConstraintError } from 'sequelize';
import CustomIcon from '@/src/models/CustomIcon';
import { isAdmin } from '@/src/lib/auth';
import { TAG_CUSTOM_ICONS } from '@/src/lib/revalidate-tags';
import { parseJsonBody } from '@/src/lib/api-request';
import { buildCustomIconPayload, serializeCustomIcon } from '@/src/lib/icons/custom-icon-payload';

/**
 * Public: the icon library is needed by every editor that offers an icon picker,
 * and the markup is already visible on public pages.
 */
export async function GET() {
  try {
    const rows = await CustomIcon.findAll({ order: [['label', 'ASC']] });

    return NextResponse.json({
      success: true,
      data: rows.map((row) => serializeCustomIcon(row.get({ plain: true }))),
    });
  } catch (error) {
    console.error('Error fetching custom icons:', error);
    return NextResponse.json({ error: 'Failed to fetch custom icons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: body, error } = await parseJsonBody(request);

    if (!body) {
      return NextResponse.json({ error: error ?? 'Invalid request' }, { status: 400 });
    }

    const built = buildCustomIconPayload(body);

    if ('error' in built) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }

    const created = await CustomIcon.create(built.payload);

    revalidateTag(TAG_CUSTOM_ICONS, 'max');
    revalidatePath('/', 'layout');

    return NextResponse.json(
      { success: true, data: serializeCustomIcon(created.get({ plain: true })) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return NextResponse.json(
        { error: 'An icon with that reference name already exists.' },
        { status: 409 },
      );
    }

    console.error('Error creating custom icon:', error);
    return NextResponse.json({ error: 'Failed to create custom icon' }, { status: 500 });
  }
}
