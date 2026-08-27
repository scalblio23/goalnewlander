import { renderLandingPage } from '../_lib/landing-page';

// Content is fixed (no cookies, no request-dependent logic), but Vercel's
// build output doesn't correctly publish a fully static custom Route
// Handler in this setup — it 404s platform-side despite building and
// serving fine locally. force-dynamic sidesteps that: same content,
// computed per request instead of pre-rendered.
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(renderLandingPage('a'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
