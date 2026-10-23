import { NextResponse } from 'next/server';
import User from '@/src/models/User';
import { requireSuperAdmin } from '@/src/lib/auth';
import { duplicateEmail, isEmail, serializeAdminUser } from '@/src/lib/admin-users';
import { normalizePermissions } from '@/src/lib/permissions';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

async function loadUser(id: string) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;
  return User.findByPk(numericId);
}

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const row = await loadUser(id);
    if (!row) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const isSuper = String(row.role) === 'ADMIN';

    if (typeof body.name === 'string') {
      const name = body.name.trim();
      if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      row.name = name;
    }

    if (typeof body.email === 'string') {
      const email = body.email.trim().toLowerCase();
      if (!isEmail(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
      row.email = email;
    }

    if (typeof body.password === 'string' && body.password.length > 0) {
      if (body.password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      row.password = body.password;
    }

    if (isSuper) {
      if (body.isActive === false) {
        return NextResponse.json({ error: 'The Super Admin account cannot be deactivated' }, { status: 400 });
      }
      if (body.permissions !== undefined || body.role !== undefined) {
        return NextResponse.json({ error: 'The Super Admin account cannot be demoted' }, { status: 400 });
      }
    } else {
      if (typeof body.isActive === 'boolean') row.isActive = body.isActive;
      if (body.permissions !== undefined) row.permissions = normalizePermissions(body.permissions);
    }

    await row.save();
    return NextResponse.json({ data: serializeAdminUser(row) });
  } catch (error) {
    if (duplicateEmail(error)) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Failed to update admin user' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const row = await loadUser(id);
    if (!row) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    if (String(row.role) === 'ADMIN') {
      return NextResponse.json({ error: 'The Super Admin account cannot be deleted' }, { status: 400 });
    }
    await row.destroy();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
  }
}
