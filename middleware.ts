import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const isSignInPage = req.nextUrl.pathname === '/admin';

  if (!token || !isAuthorizedUser(token)) {
    if (!isSignInPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

function isAuthorizedUser(token: { username: string }) {
  return token && token.username === 'llccxmiller';
}

export const config = {
  matcher: ['/admin/:path*'],
};
