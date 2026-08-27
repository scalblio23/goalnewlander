import { NextResponse } from 'next/server';

const COOKIE_NAME = 'ab_variant';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, so returning visitors keep their variant

export function middleware(request) {
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  const variant = existing === 'a' || existing === 'b'
    ? existing
    : (Math.random() < 0.5 ? 'a' : 'b');

  // Rewrite (not redirect) so the visitor's URL bar always stays on "/" —
  // only the internally-served content differs per variant.
  const url = request.nextUrl.clone();
  url.pathname = variant === 'a' ? '/variant-a' : '/variant-b';

  const response = NextResponse.rewrite(url);

  // Only (re)set the cookie when it wasn't already there, so repeat
  // visitors keep seeing whichever variant they were first assigned.
  if (existing !== variant) {
    response.cookies.set(COOKIE_NAME, variant, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }

  // The response body depends on a per-visitor cookie — never let a CDN or
  // browser cache one variant and serve it to a visitor assigned the other.
  response.headers.set('Cache-Control', 'private, no-store');

  return response;
}

export const config = {
  matcher: '/',
};
