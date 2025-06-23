import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/checkout',
  '/orders',
  '/account',
  '/account/settings',
  '/dashboard',
  '/delivery-addresses'
];

const adminRoutes = ['/dashboard'];
const publicAuthRoutes = ['/auth'];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = publicAuthRoutes.includes(pathname);

  const token =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value;

  const userToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET_KEY });
  const userRole = userToken?.role;

  // Block authenticated users from visiting login/signup page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Block unauthenticated users from protected routes
  if (isProtected && !token) {
    const signInUrl = new URL('/auth', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home if not admin
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/auth',
    '/cart',
    '/checkout',
    '/orders',
    '/account',
    '/admin/:path*',
    '/dashboard/:path*',
    '/delivery-addresses'
  ]
};
