import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Protect /dashboard and its sub-routes
  if (pathname.startsWith('/dashboard')) {
    // 1. If not logged in, redirect to login
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 2. Decode the JWT payload to check the role
      // JWT format: header.payload.signature
      const payloadBase64 = accessToken.split('.')[1];
      // base64url decode
      // Replace '-' with '+' and '_' with '/' for standard base64 decoding
      const standardizedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedJson = atob(standardizedBase64);
      const payload = JSON.parse(decodedJson);
      const userRole = payload.role;

      // 3. Enforce Role-Based Routing
      if (pathname.startsWith('/dashboard/admin')) {
        if (userRole !== 'ADMIN') {
          // If a non-admin tries to access admin dashboard, redirect to their respective dashboard
          return redirectToRoleDashboard(userRole, request.url);
        }
      } else if (pathname.startsWith('/dashboard/provider') || pathname.startsWith('/dashboard/technician')) {
        if (userRole !== 'TECHNICIAN') {
          return redirectToRoleDashboard(userRole, request.url);
        }
      } else if (pathname.startsWith('/dashboard/user') || pathname.startsWith('/dashboard/customer')) {
        if (userRole !== 'CUSTOMER') {
          return redirectToRoleDashboard(userRole, request.url);
        }
      }

    } catch (error) {
      // If the token is invalid or parsing fails, clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  // Prevent logged-in users from accessing login/register pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (accessToken) {
      try {
        const payloadBase64 = accessToken.split('.')[1];
        const standardizedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const decodedJson = atob(standardizedBase64);
        const payload = JSON.parse(decodedJson);
        return redirectToRoleDashboard(payload.role, request.url);
      } catch (e) {
        // Ignored
      }
    }
  }

  return NextResponse.next();
}

function redirectToRoleDashboard(role: string, baseUrl: string) {
  if (role === 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard/admin', baseUrl));
  } else if (role === 'TECHNICIAN') {
    return NextResponse.redirect(new URL('/dashboard/technician', baseUrl));
  } else {
    // Default to CUSTOMER
    return NextResponse.redirect(new URL('/dashboard/customer', baseUrl));
  }
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
