-- ResumeIQ optional Supabase schema. Run in Supabase SQL Editor after creating a project.
-- Resume files are not uploaded to Storage by the default API. Extracted text is optional;
-- keep it NULL unless the user explicitly opts in to storage.
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  filename text not null,
  extracted_text text, -- optional and sensitive; keep NULL by default
  uploaded_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  job_title text,
  company_name text,
  resume_score integer check (resume_score between 0 and 100),
  job_match_score integer check (job_match_score between 0 and 100),
  ats_score integer check (ats_score between 0 and 100),
  analysis_results jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.improved_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete cascade,
  original_content text not null,
  improved_content text not null,
  created_at timestamptz not null default now()
);

create index if not exists resumes_user_uploaded_idx on public.resumes(user_id, uploaded_at desc);
create index if not exists analyses_user_created_idx on public.analyses(user_id, created_at desc);
create index if not exists improved_resumes_user_created_idx on public.improved_resumes(user_id, created_at desc);

alter table public.users enable row level security;
alter table public.resumes enable row level security;
alter table public.analyses enable row level security;
alter table public.improved_resumes enable row level security;

create policy "users read own profile" on public.users for select using (auth.uid() = id);
create policy "users update own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users create own profile" on public.users for insert with check (auth.uid() = id);
create policy "resumes own rows" on public.resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analyses own rows" on public.analyses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "improved resumes own rows" on public.improved_resumes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Note: frontend anon keys are public by design; enforce RLS. Never use service-role key in browser code.
