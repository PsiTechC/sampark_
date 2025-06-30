import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/home', '/register'];

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Always allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    // https://convis.ai
    return NextResponse.redirect(new URL('https://convis.ai', req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return NextResponse.redirect(new URL('https://convis.ai', req.url));
  }
}

export const config = {
  matcher: [
    // Apply to everything except:
    // '/', '/register', static files, Next internals
    '/((?!_next/static|_next/image|favicon.ico|register|$).*)',
  ],
};
