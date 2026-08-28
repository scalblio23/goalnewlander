-- Run once against your Vercel Postgres database (Vercel dashboard >
-- Storage > your database > Query, or `psql "$POSTGRES_URL" -f db/schema.sql`
-- after `vercel env pull`) to create the table /api/submit-survey.js writes into.

create table if not exists survey_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  debts text,
  employment text,
  income text,
  mortgage text,
  mortgage_size text,
  status text not null default 'qualified'
);
