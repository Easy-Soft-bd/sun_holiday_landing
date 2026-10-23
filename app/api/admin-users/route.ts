import { NextResponse } from 'next/server';
import User, { UserRole } from '@/src/models/User';
import { requireSuperAdmin } from '@/src/lib/auth';
import { duplicateEmail, isEmail, listAdminUsers, serializeAdminUser } from '@/src/lib/admin-users';
import { normalizePermissions } from '@/src/lib/permissions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  try {
    const data = await listAdminUsers();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error listing admin users:', error);
    return NextResponse.json({ error: 'Failed to list admin users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const permissions = normalizePermissions(body.permissions);

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const row = await User.create({
      name,
      email,
      password,
      role: UserRole.EDITOR,
      permissions,
      isActive: true,
    });
    return NextResponse.json({ data: serializeAdminUser(row) }, { status: 201 });
  } catch (error) {
    if (duplicateEmail(error)) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}
