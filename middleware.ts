import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
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
      // Clear invalid cookie
      const response = NextResponse.redirect(url);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Redirect authenticated users away from login page
  if (isLoginPath && token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      const url = request.nextUrl.clone();
      url.pathname = '/portal/admin/dashboard';
      return NextResponse.redirect(url);
    } catch (error) {
      // Invalid token, allow login page but clear cookie
      const response = NextResponse.next();
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo|uploads).*)',
  ],
};
