import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(session);
}
