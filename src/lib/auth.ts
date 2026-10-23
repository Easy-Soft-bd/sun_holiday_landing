import { cache } from 'react';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import User from '@/src/models/User';
import {
  canAccess,
  normalizePermissions,
  UPLOAD_PERMISSIONS,
  type Permission,
} from '@/src/lib/permissions';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export type StaffAccount = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  permissions: Permission[];
};

export type AdminSession = {
  authenticated: boolean;
  user: StaffAccount | null;
};

type LoadResult =
  | { status: 'anonymous' }
  | { status: 'invalid' }
  | { status: 'error' }
  | { status: 'ok'; user: StaffAccount };

function isActiveValue(value: unknown): boolean {
  return value !== false && value !== 0 && value !== '0';
}

function toStaff(row: User): StaffAccount {
  const role = String(row.role);
  const isSuperAdmin = role === 'ADMIN';
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    role,
    isActive: isActiveValue(row.isActive),
    isSuperAdmin,
    permissions: isSuperAdmin ? [] : normalizePermissions(row.permissions),
  };
}

async function readTokenPayload(): Promise<{ status: 'anonymous' } | { status: 'invalid' } | { status: 'payload'; id?: number; email?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return { status: 'anonymous' };
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const id = Number(payload.id);
    return {
      status: 'payload',
      id: Number.isInteger(id) && id > 0 ? id : undefined,
      email: typeof payload.email === 'string' ? payload.email : undefined,
    };
  } catch {
    return { status: 'invalid' };
  }
}

const loadStaff = cache(async (): Promise<LoadResult> => {
  const token = await readTokenPayload();
  if (token.status !== 'payload') return token;
  try {
    let row: User | null = null;
    if (token.id) row = await User.findByPk(token.id);
    if (!row && token.email) row = await User.findOne({ where: { email: token.email } });
    if (!row) return { status: 'invalid' };
    const user = toStaff(row);
    if (!user.isActive) return { status: 'invalid' };
    if (user.role === 'USER') return { status: 'invalid' };
    return { status: 'ok', user };
  } catch (error) {
    console.error('Failed to load staff account:', error);
    return { status: 'error' };
  }
});

export async function getStaffUser(): Promise<StaffAccount | null> {
  const result = await loadStaff();
  return result.status === 'ok' ? result.user : null;
}

export async function getAdminSession(): Promise<AdminSession> {
  const result = await loadStaff();
  if (result.status !== 'ok') return { authenticated: false, user: null };
  return { authenticated: true, user: result.user };
}

export async function verifyAuth() {
  return getAdminSession();
}

export async function hasPermission(permission: Permission): Promise<boolean> {
  const user = await getStaffUser();
  if (!user) return false;
  return canAccess(user, permission);
}

/** True when the account may edit public pages. Super Admin is included. */
export async function isAdmin(): Promise<boolean> {
  return hasPermission('pages');
}

export async function isSuperAdmin(): Promise<boolean> {
  const user = await getStaffUser();
  return Boolean(user?.isSuperAdmin);
}

function denied(status: 401 | 403, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function requirePermission(permission: Permission | Permission[]): Promise<NextResponse | null> {
  const result = await loadStaff();
  if (result.status !== 'ok') {
    return denied(401, 'Unauthorized');
  }
  const keys = Array.isArray(permission) ? permission : [permission];
  const allowed = result.user.isSuperAdmin || keys.some((key) => result.user.permissions.includes(key));
  if (!allowed) return denied(403, 'Forbidden');
  return null;
}

export async function requireSuperAdmin(): Promise<NextResponse | null> {
  const result = await loadStaff();
  if (result.status !== 'ok') return denied(401, 'Unauthorized');
  if (!result.user.isSuperAdmin) return denied(403, 'Forbidden');
  return null;
}

export async function requireUploadPermission(): Promise<NextResponse | null> {
  return requirePermission(UPLOAD_PERMISSIONS);
}

export async function staffCookieShouldClear(): Promise<boolean> {
  const result = await loadStaff();
  return result.status === 'invalid';
}
