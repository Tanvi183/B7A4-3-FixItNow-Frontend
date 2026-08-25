import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper to decode JWT payload without external libraries in Edge runtime
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect specific routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isCheckoutRoute = pathname.startsWith('/checkout');
  const isPaymentRoute = pathname.startsWith('/payment');

  if (!isDashboardRoute && !isCheckoutRoute && !isPaymentRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = decodeJWT(token);

  if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  const role = decoded.role?.toUpperCase();

  // Route protection by role
  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard/technician') && role !== 'TECHNICIAN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard/customer') && role !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*', '/payment/:path*'],
};
