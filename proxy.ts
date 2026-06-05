import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/session';

export async function proxy(request: NextRequest) {
  // Kunin ang VIP Pass (session cookie) ng user
  const sessionCookie = request.cookies.get('session')?.value;

  // Kung sinusubukan niyang pumasok sa dashboard...
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // 1. Kung WALA siyang pass, sipain pabalik sa login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Kung MAY pass siya, i-check kung peke o expired
    try {
      await decrypt(sessionCookie);
    } catch (error) {
      // Kapag error (peke/expired ang pass), sipain sa login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Kung okay lahat, papasukin siya nang tuloy-tuloy
  return NextResponse.next();
}

// Dito natin sinasabi kung aling page lang babantayan ng Bouncer
export const config = {
  matcher: ['/dashboard/:path*'],
};