-- Drop existing tables so we can recreate them with the new relationships
drop table if exists public.tasks;
drop table if exists public.streaks;
drop table if exists public.settings;
drop table if exists public.subjects;
drop table if exists public.custom_users;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 0. Custom Users Table
-- ==========================================
create table public.custom_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.custom_users enable row level security;

-- Allow anyone (anon role) to SELECT, INSERT on custom_users
create policy "Allow public read" on public.custom_users for select using (true);
create policy "Allow public insert" on public.custom_users for insert with check (true);

-- ==========================================
-- 1. Subjects Table
-- ==========================================
create table public.subjects (
  id text primary key,
  user_id uuid references public.custom_users(id) on delete cascade not null,
  name text not null,
  difficulty text not null,
  exam_date text not null,
  total_topics integer not null default 0,
  completed_topics integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subjects enable row level security;
create policy "Allow all on subjects" on public.subjects for all using (true) with check (true);

-- ==========================================
-- 2. Tasks Table
-- ==========================================
create table public.tasks (
  id text primary key,
  user_id uuid references public.custom_users(id) on delete cascade not null,
  subject_id text references public.subjects(id) on delete cascade not null,
  topic_number integer not null,
  scheduled_date text not null,
  completed boolean default false not null,
  estimated_minutes integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;
create policy "Allow all on tasks" on public.tasks for all using (true) with check (true);

-- ==========================================
-- 3. Settings Table
-- ==========================================
create table public.settings (
  user_id uuid primary key references public.custom_users(id) on delete cascade,
  hours_available_per_day numeric not null,
  preferred_study_days_per_week integer not null,
  start_date text not null,
  custom_holidays integer[] default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.settings enable row level security;
create policy "Allow all on settings" on public.settings for all using (true) with check (true);

-- ==========================================
-- 4. Streaks Table
-- ==========================================
create table public.streaks (
  user_id uuid primary key references public.custom_users(id) on delete cascade,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  last_study_date text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.streaks enable row level security;
create policy "Allow all on streaks" on public.streaks for all using (true) with check (true);

-- Force the API schema cache to reload
NOTIFY pgrst, 'reload schema';
