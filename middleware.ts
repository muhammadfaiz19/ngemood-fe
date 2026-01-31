import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/dashboard', '/face-checkin', '/journal', '/history'];
  const authPaths = ['/login', '/register'];

  // 1. Jika user mau masuk area rahasia tanpa token -> Tendang ke Login
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika user sudah login tapi mau buka page login/register -> Lempar ke Dashboard
  if (authPaths.includes(request.nextUrl.pathname) && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };