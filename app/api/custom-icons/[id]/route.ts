import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { UniqueConstraintError } from 'sequelize';
import CustomIcon from '@/src/models/CustomIcon';
import { isAdmin } from '@/src/lib/auth';
import { TAG_CUSTOM_ICONS } from '@/src/lib/revalidate-tags';
import { parseJsonBody } from '@/src/lib/api-request';
import { buildCustomIconPayload, serializeCustomIcon } from '@/src/lib/icons/custom-icon-payload';

type Params = { params: Promise<{ id: string }> };

function invalidate() {
  revalidateTag(TAG_CUSTOM_ICONS, 'max');
  revalidatePath('/', 'layout');
}

export async function PUT(request: Request, { params }: Params) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const icon = await CustomIcon.findByPk(id);

    if (!icon) {
      return NextResponse.json({ error: 'Icon not found' }, { status: 404 });
    }

    const { data: body, error } = await parseJsonBody(request);

    if (!body) {
      return NextResponse.json({ error: error ?? 'Invalid request' }, { status: 400 });
    }

    const built = buildCustomIconPayload(body);

    if ('error' in built) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }

    await icon.update(built.payload);
    invalidate();

    return NextResponse.json({
      success: true,
      data: serializeCustomIcon(icon.get({ plain: true })),
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return NextResponse.json(
        { error: 'An icon with that reference name already exists.' },
        { status: 409 },
      );
    }

    console.error('Error updating custom icon:', error);
    return NextResponse.json({ error: 'Failed to update custom icon' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const icon = await CustomIcon.findByPk(id);

    if (!icon) {
      return NextResponse.json({ error: 'Icon not found' }, { status: 404 });
    }

    await icon.destroy();
    invalidate();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custom icon:', error);
    return NextResponse.json({ error: 'Failed to delete custom icon' }, { status: 500 });
  }
}
