create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'User',
  language text not null default 'English',
  photo text not null default '',
  style text not null default 'Balanced',
  favourite_activities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  cover text not null default '',
  start_date date,
  end_date date,
  status text not null default 'upcoming',
  travelers integer not null default 1 check (travelers > 0),
  budget numeric not null default 0 check (budget >= 0),
  currency text not null default 'INR',
  estimated_cost numeric not null default 0 check (estimated_cost >= 0),
  interests jsonb not null default '[]'::jsonb,
  style text not null default 'Balanced',
  transport text not null default 'Mixed',
  stops jsonb not null default '[]'::jsonb,
  breakdown jsonb not null default '{}'::jsonb,
  days jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_destinations (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.saved_destinations enable row level security;

create policy "Users manage their own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage their own trips" on public.trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own saved destinations" on public.saved_destinations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, photo)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'User'), coalesce(new.raw_user_meta_data->>'avatar_url', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();