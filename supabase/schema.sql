-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- to create the table that /api/submit-survey.js writes into.

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

-- Row Level Security: keep the table locked down. All writes go through the
-- serverless function using the service_role key, which bypasses RLS, so no
-- public policies are needed.
alter table survey_entries enable row level security;
