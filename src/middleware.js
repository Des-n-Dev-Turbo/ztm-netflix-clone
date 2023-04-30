import { NextResponse } from 'next/server';

import verifyToken from '../lib/utils';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const userId = verifyToken(token);

  const { pathname } = request.nextUrl;

  if (pathname.includes('/api/login') || userId || pathname.includes('/static')) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
