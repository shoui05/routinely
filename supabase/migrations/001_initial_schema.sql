-- ============================================================
-- Routinely — Initial Schema
-- Run this ONCE in Supabase SQL Editor → New Query → Run
-- ============================================================

-- GOALS
create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  occupation  text not null,
  goal_text   text not null default '',
  goal_tags   text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- ROUTINES
create table if not exists public.routines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  goal_id     uuid references public.goals(id) on delete set null,
  title       text not null,
  description text not null default '',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- SCHEDULE_BLOCKS
create table if not exists public.schedule_blocks (
  id          uuid primary key default gen_random_uuid(),
  routine_id  uuid references public.routines(id) on delete cascade not null,
  title       text not null,
  description text not null default '',
  start_time  text not null,
  end_time    text not null,
  sort_order  integer not null default 0,
  category    text not null default 'general'
                check (category in ('focus','health','break','learning','personal','general')),
  created_at  timestamptz not null default now()
);

-- INDEXES
create index if not exists idx_routines_user_id  on public.routines(user_id);
create index if not exists idx_goals_user_id     on public.goals(user_id);
create index if not exists idx_blocks_routine_id on public.schedule_blocks(routine_id);
create index if not exists idx_blocks_sort_order on public.schedule_blocks(sort_order);

-- AUTO-UPDATE updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_routine_updated
  before update on public.routines
  for each row execute procedure public.handle_updated_at();

-- ROW LEVEL SECURITY
alter table public.goals           enable row level security;
alter table public.routines        enable row level security;
alter table public.schedule_blocks enable row level security;

create policy "goals: owner access" on public.goals
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "routines: owner access" on public.routines
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "blocks: owner via routine" on public.schedule_blocks
  for all using (
    routine_id in (select id from public.routines where user_id = auth.uid())
  )
  with check (
    routine_id in (select id from public.routines where user_id = auth.uid())
  );
