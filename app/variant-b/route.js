import { renderLandingPage } from '../_lib/landing-page';

// Never cache — the variant served here is only correct for visitors
// middleware has already assigned to "b".
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(renderLandingPage('b'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  });
}
