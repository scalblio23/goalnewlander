import { NextResponse } from 'next/server';

const COOKIE_NAME = 'ab_variant';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, so returning visitors keep their variant

function pickVariant(request) {
  const { nextUrl } = request;

  // Manual override for QA/testing: ?variant=a or ?variant=b forces that
  // variant for this request only. It never reads or writes the cookie, so
  // it can't skew the real 50/50 split or clobber a visitor's real
  // assignment — it's purely a preview.
  const requestedOverride = nextUrl.searchParams.get('variant')?.toLowerCase();
  const forced = requestedOverride === 'a' || requestedOverride === 'b' ? requestedOverride : null;

  const existing = request.cookies.get(COOKIE_NAME)?.value;
  const variant = forced
    ?? (existing === 'a' || existing === 'b' ? existing : (Math.random() < 0.5 ? 'a' : 'b'));

  return { variant, forced, existing };
}

function buildResponse(request, variant, forced, existing) {
  // Rewrite (not redirect) so the visitor's URL bar always stays on "/" —
  // only the internally-served content differs per variant.
  const url = request.nextUrl.clone();
  url.pathname = variant === 'a' ? '/variant-a' : '/variant-b';

  const response = NextResponse.rewrite(url);

  // Only (re)set the cookie for organic assignment when it wasn't already
  // there, so repeat visitors keep seeing whichever variant they were first
  // assigned — and a manual override never touches it.
  if (!forced && existing !== variant) {
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

export function middleware(request) {
  // Everything below — variant assignment AND building the rewrite/cookie/
  // header response — is wrapped so nothing here can ever surface as a
  // 500 to a visitor. Falls back to a bare variant-A rewrite, and if even
  // that throws, lets the request through unmodified as an absolute floor.
  try {
    const { variant, forced, existing } = pickVariant(request);
    return buildResponse(request, variant, forced, existing);
  } catch (err) {
    console.error('ab-test middleware crashed, falling back to variant a', err);
    try {
      return buildResponse(request, 'a', null, undefined);
    } catch (err2) {
      console.error('ab-test middleware fallback also crashed, passing request through', err2);
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: '/',
};
