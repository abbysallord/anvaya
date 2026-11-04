import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';

  if (host.startsWith('shenoy.')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('ngrok-skip-browser-warning', 'true');
    requestHeaders.set('x-forwarded-host', host);

    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;
    const targetUrl = new URL(`${pathname}${search}`, 'https://misaccused-walker-invigoratively.ngrok-free.dev');

    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
