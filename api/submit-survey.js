// Vercel serverless function: writes completed survey answers straight into
// a Supabase Postgres table via its REST (PostgREST) API. No webhook/Apps
// Script involved — this runs server-side on Vercel and talks directly to
// the database using a service-role key kept in env vars.
//
// Required env vars (set in Vercel project settings):
//   SUPABASE_URL              e.g. https://xxxxxxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY the service_role key from Supabase API settings
//
// Table schema (run once in the Supabase SQL editor):
//   see supabase/schema.sql in this repo

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const row = {
    name: typeof body.name === 'string' ? body.name.slice(0, 200) : null,
    debts: typeof body.debts === 'string' ? body.debts.slice(0, 500) : null,
    employment: typeof body.employment === 'string' ? body.employment.slice(0, 200) : null,
    income: typeof body.income === 'string' ? body.income.slice(0, 200) : null,
    mortgage: typeof body.mortgage === 'string' ? body.mortgage.slice(0, 200) : null,
    mortgage_size: typeof body.mortgageSize === 'string' ? body.mortgageSize.slice(0, 200) : null,
    status: body.status === 'disqualified' ? 'disqualified' : 'qualified',
  };

  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/survey_entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Supabase insert failed:', resp.status, text);
      res.status(502).json({ error: 'Failed to store entry' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error contacting Supabase:', err);
    res.status(500).json({ error: 'Failed to store entry' });
  }
};
