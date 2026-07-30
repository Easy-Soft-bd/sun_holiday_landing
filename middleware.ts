import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPortalPath = pathname.startsWith('/portal/admin');
  const isLoginPath = pathname === '/portal/admin/login';

  const token = request.cookies.get('admin_token')?.value;

  if (isPortalPath && !isLoginPath) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/portal/admin/login';
      const response = NextResponse.redirect(url);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  if (isLoginPath && token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      const url = request.nextUrl.clone();
      url.pathname = '/portal/admin/dashboard';
      return NextResponse.redirect(url);
    } catch {
      const response = NextResponse.next();
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run auth middleware on the admin portal — keeps public pages out of the matcher.
  matcher: ['/portal/admin/:path*'],
};
