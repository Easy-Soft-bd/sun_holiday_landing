import { UniqueConstraintError } from 'sequelize';
import User, { UserRole } from '@/src/models/User';
import { normalizePermissions, type Permission } from '@/src/lib/permissions';

const STAFF_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.EDITOR];

export type AdminUserRecord = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  permissions: Permission[];
  createdAt: string;
};

function isActiveValue(value: unknown): boolean {
  return value !== false && value !== 0 && value !== '0';
}

export function serializeAdminUser(row: User): AdminUserRecord {
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
    createdAt: row.createdAt?.toISOString?.() ?? String(row.createdAt),
  };
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const rows = await User.findAll({
    where: { role: STAFF_ROLES },
    order: [['id', 'ASC']],
  });
  return rows.map(serializeAdminUser);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function duplicateEmail(error: unknown): boolean {
  return error instanceof UniqueConstraintError;
}
