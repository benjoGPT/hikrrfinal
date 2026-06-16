-- ================================================================
-- Benjo Hike Tracker — Supabase schema
-- Run this in your Supabase project's SQL editor
-- ================================================================

create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique,
  full_name   text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz default now()
);

create table public.hikes (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users on delete cascade not null,
  title             text not null,
  description       text,
  distance_km       numeric(6,2) default 0,
  elevation_gain_m  numeric(6,1) default 0,
  elevation_max_m   numeric(6,1) default 0,
  duration_min      integer default 0,
  date              date not null default current_date,
  location          text,
  cover_image_url   text,
  route_data        jsonb,
  created_at        timestamptz default now()
);

create table public.photos (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  hike_id     uuid references public.hikes on delete set null,
  url         text not null,
  caption     text,
  taken_at    timestamptz,
  created_at  timestamptz default now()
);

create table public.journal_entries (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  hike_id     uuid references public.hikes on delete set null,
  title       text not null,
  content     text not null default '',
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table public.plans (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  title        text not null,
  description  text,
  target_date  date,
  difficulty   text check (difficulty in ('easy','moderate','hard','extreme')),
  status       text default 'wishlist' check (status in ('wishlist','planned','completed')),
  created_at   timestamptz default now()
);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles        enable row level security;
alter table public.hikes           enable row level security;
alter table public.photos          enable row level security;
alter table public.journal_entries enable row level security;
alter table public.plans           enable row level security;

create policy "Profiles viewable by everyone"    on public.profiles for select using (true);
create policy "Users update own profile"         on public.profiles for update using (auth.uid() = id);

create policy "Users select own hikes"           on public.hikes for select  using (auth.uid() = user_id);
create policy "Users insert own hikes"           on public.hikes for insert  with check (auth.uid() = user_id);
create policy "Users update own hikes"           on public.hikes for update  using (auth.uid() = user_id);
create policy "Users delete own hikes"           on public.hikes for delete  using (auth.uid() = user_id);

create policy "Users select own photos"          on public.photos for select  using (auth.uid() = user_id);
create policy "Users insert own photos"          on public.photos for insert  with check (auth.uid() = user_id);
create policy "Users delete own photos"          on public.photos for delete  using (auth.uid() = user_id);

create policy "Users select own journal"         on public.journal_entries for select  using (auth.uid() = user_id);
create policy "Users insert own journal"         on public.journal_entries for insert  with check (auth.uid() = user_id);
create policy "Users update own journal"         on public.journal_entries for update  using (auth.uid() = user_id);
create policy "Users delete own journal"         on public.journal_entries for delete  using (auth.uid() = user_id);

create policy "Users select own plans"           on public.plans for select  using (auth.uid() = user_id);
create policy "Users insert own plans"           on public.plans for insert  with check (auth.uid() = user_id);
create policy "Users update own plans"           on public.plans for update  using (auth.uid() = user_id);
create policy "Users delete own plans"           on public.plans for delete  using (auth.uid() = user_id);
