export const PERMISSIONS = [
  "leads",
  "tours",
  "visa",
  "tickets",
  "blog",
  "pages",
  "settings",
  "icons",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  leads: "Leads",
  tours: "Tours",
  visa: "Visa",
  tickets: "Tickets",
  blog: "Blog",
  pages: "Pages",
  settings: "Settings",
  icons: "Icons",
};

/** Permissions that upload images while saving content. */
export const UPLOAD_PERMISSIONS: Permission[] = [
  "pages",
  "tours",
  "visa",
  "tickets",
  "blog",
  "settings",
  "icons",
];

export function normalizePermissions(value: unknown): Permission[] {
  const list = Array.isArray(value) ? value : [];
  const allowed = new Set<string>(PERMISSIONS);
  const next: Permission[] = [];
  for (const item of list) {
    if (typeof item !== "string" || !allowed.has(item)) continue;
    const permission = item as Permission;
    if (!next.includes(permission)) next.push(permission);
  }
  return next;
}

export function canAccess(
  input: { isSuperAdmin?: boolean; permissions?: readonly string[] | null },
  permission: Permission,
): boolean {
  if (input.isSuperAdmin) return true;
  return (input.permissions ?? []).includes(permission);
}
