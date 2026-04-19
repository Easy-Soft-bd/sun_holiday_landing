import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export type AdminSession = {
  authenticated: boolean;
  user: {
    email: string;
    role: string;
  } | null;
};

async function readAdminSession(): Promise<AdminSession> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return { authenticated: false, user: null };
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      authenticated: true,
      user: {
        email: payload.email as string,
        role: payload.role as string,
      },
    };
  } catch {
    return { authenticated: false, user: null };
  }
}

export async function verifyAuth() {
  return readAdminSession();
}

export async function getAdminSession(): Promise<AdminSession> {
  return readAdminSession();
}

export async function isAdmin(): Promise<boolean> {
  const session = await readAdminSession();
  return session.user?.role === 'ADMIN';
}
