import { NextResponse } from 'next/server';
import { getAdminSession, staffCookieShouldClear } from '@/src/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  const response = NextResponse.json(session);
  if (!session.authenticated && (await staffCookieShouldClear())) {
    response.cookies.delete('admin_token');
  }
  return response;
}
