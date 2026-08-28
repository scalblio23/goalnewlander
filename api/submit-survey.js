// Vercel serverless function: writes completed survey answers into Vercel's
// own Postgres database (Storage tab in the Vercel dashboard). Once that
// database is created and connected to this project, Vercel automatically
// injects the POSTGRES_URL env var that @vercel/postgres reads — no extra
// config needed here.
//
// Table schema (run once): see db/schema.sql in this repo.

const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = typeof body.name === 'string' ? body.name.slice(0, 200) : null;
  const debts = typeof body.debts === 'string' ? body.debts.slice(0, 500) : null;
  const employment = typeof body.employment === 'string' ? body.employment.slice(0, 200) : null;
  const income = typeof body.income === 'string' ? body.income.slice(0, 200) : null;
  const mortgage = typeof body.mortgage === 'string' ? body.mortgage.slice(0, 200) : null;
  const mortgageSize = typeof body.mortgageSize === 'string' ? body.mortgageSize.slice(0, 200) : null;
  const status = body.status === 'disqualified' ? 'disqualified' : 'qualified';

  try {
    await sql`
      insert into survey_entries (name, debts, employment, income, mortgage, mortgage_size, status)
      values (${name}, ${debts}, ${employment}, ${income}, ${mortgage}, ${mortgageSize}, ${status})
    `;
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to store survey entry:', err);
    res.status(500).json({ error: 'Failed to store entry' });
  }
};
