import { renderLandingPage } from './_lib/landing-page';

// Runs on the standard Node.js serverless runtime (the default for Route
// Handlers) — not the Edge Runtime. No rewrite, no separate routing layer:
// this handler *is* "/", so the URL never changes by construction.
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'ab_variant';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, so returning visitors keep their variant

function parseCookie(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}

function pickVariant(request) {
  const url = new URL(request.url);

  // Manual override for QA/testing: ?variant=a or ?variant=b forces that
  // variant for this request only. It never reads or writes the cookie, so
  // it can't skew the real 50/50 split or clobber a visitor's real
  // assignment — it's purely a preview.
  const requestedOverride = url.searchParams.get('variant')?.toLowerCase();
  const forced = requestedOverride === 'a' || requestedOverride === 'b' ? requestedOverride : null;

  const existing = parseCookie(request.headers.get('cookie'), COOKIE_NAME);
  const variant = forced
    ?? (existing === 'a' || existing === 'b' ? existing : (Math.random() < 0.5 ? 'a' : 'b'));

  return { variant, forced, existing };
}

function buildResponse(variant, forced, existing) {
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    // The response body depends on a per-visitor cookie — never let a CDN
    // or browser cache one variant and serve it to a visitor assigned the
    // other.
    'Cache-Control': 'private, no-store',
  });

  // Only (re)set the cookie for organic assignment when it wasn't already
  // there, so repeat visitors keep seeing whichever variant they were first
  // assigned — and a manual override never touches it.
  if (!forced && existing !== variant) {
    headers.append(
      'Set-Cookie',
      `${COOKIE_NAME}=${variant}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
    );
  }

  return new Response(renderLandingPage(variant), { headers });
}

export async function GET(request) {
  // Wrapped so nothing here can ever surface as a 500 to a visitor. Falls
  // back to a bare variant-A response, and if even that throws, serves
  // variant A with no cookie handling at all as an absolute floor.
  try {
    const { variant, forced, existing } = pickVariant(request);
    return buildResponse(variant, forced, existing);
  } catch (err) {
    console.error('ab-test route: assignment failed, falling back to variant a', err);
    try {
      return buildResponse('a', null, undefined);
    } catch (err2) {
      console.error('ab-test route: fallback also failed, serving variant a directly', err2);
      return new Response(renderLandingPage('a'), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
  }
}
