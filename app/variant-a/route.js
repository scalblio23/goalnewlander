import { renderLandingPage } from '../_lib/landing-page';

// Never cache — the variant served here is only correct for visitors
// middleware has already assigned to "a".
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(renderLandingPage('a'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  });
}
