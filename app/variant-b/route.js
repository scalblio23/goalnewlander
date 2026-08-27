import { renderLandingPage } from '../_lib/landing-page';

// No cookies, no request-dependent logic — this is pure static content,
// so Next.js pre-renders it at build time like any other static page.
export async function GET() {
  return new Response(renderLandingPage('b'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
