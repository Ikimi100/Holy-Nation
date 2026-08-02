-- ============================================
-- HOLY NATION GLOBAL — Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Security model: the browser never talks to these tables directly — the
-- Next.js /api/submit route does. Policies still allow INSERT only, so even
-- if the anon key leaks, nobody can read, change, or delete submissions.
-- Reading is done by you, in the Supabase dashboard (Table Editor).
-- ============================================

-- 1. Every ministry/enquiry/prayer/application form on the site.
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  page        text not null default '',          -- e.g. /global-college
  form_name   text not null default '',          -- e.g. "Application Form"
  name        text not null default '',
  email       text not null default '',
  payload     jsonb not null default '{}'::jsonb -- every field, keyed by its label
);

-- 2. Newsletter signups (deduped by email).
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  page        text not null default ''
);

-- 3. Giving intents from the Give page basket (records interest — actual
--    payment happens via bank transfer / future gateway).
create table if not exists public.giving_intents (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  page        text not null default '/give',
  currency    text not null default '',
  frequency   text not null default '',
  total_usd   numeric not null default 0,
  items       jsonb not null default '[]'::jsonb -- [{fund, usd}]
);

-- Row-level security: INSERT-only for the anon/authenticated roles.
alter table public.submissions            enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.giving_intents         enable row level security;

drop policy if exists "insert only" on public.submissions;
create policy "insert only" on public.submissions
  for insert to anon, authenticated with check (true);

drop policy if exists "insert only" on public.newsletter_subscribers;
create policy "insert only" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

drop policy if exists "insert only" on public.giving_intents;
create policy "insert only" on public.giving_intents
  for insert to anon, authenticated with check (true);

-- Helpful dashboard ordering.
create index if not exists submissions_created_idx on public.submissions (created_at desc);
create index if not exists giving_intents_created_idx on public.giving_intents (created_at desc);
