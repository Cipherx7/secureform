import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_NAME } from '../lib/auth-constants';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Define routes
  const isAdminDashboard = pathname.startsWith('/hot_admin/dashboard') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin/dashboard');

  const isLoginPage = pathname === '/hot_admin' ||
    pathname === '/admin' ||
    pathname === '/admin/login';

  // 2. Allow public assets
  if (pathname.startsWith('/_next') ||
    pathname.includes('_rsc') ||
    pathname.startsWith('/static') ||
    pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // 3. Get Token
  const token = req.cookies.get(COOKIE_NAME)?.value;
  let isValid = false;

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      isValid = true;
    } catch (error) {
      // Token invalid/expired
      isValid = false;
    }
  }

  // 4. Protection Logic

  // Case A: User is on a protected route (Dashboard)
  if (isAdminDashboard) {
    if (!isValid) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/hot_admin', req.url);
      return NextResponse.redirect(loginUrl);
    }
    // Allow access if authenticated
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // Case B: User is on the Login page
  if (isLoginPage) {
    if (isValid) {
      // Redirect to dashboard if already authenticated
      const dashboardUrl = new URL('/hot_admin/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // Allow access to login page if not authenticated
    return NextResponse.next();
  }

  // Default: Allow other routes (e.g. public site)
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
