import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      authenticated: true,
      user: {
        email: payload.email,
        role: payload.role,
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
