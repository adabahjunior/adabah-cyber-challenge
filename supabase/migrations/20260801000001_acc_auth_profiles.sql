-- ACC participant profiles linked to Supabase Auth
create extension if not exists "pgcrypto";

create table if not exists public.acc_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  department text,
  level text default 'Beginner',
  username text unique,
  hacker_name text,
  avatar text default 'NX',
  score integer not null default 0,
  rank integer,
  progress integer not null default 0,
  warnings integer not null default 0,
  completed_missions text[] not null default '{}',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists acc_profiles_score_idx on public.acc_profiles (score desc);
create index if not exists acc_profiles_username_idx on public.acc_profiles (username);

alter table public.acc_profiles enable row level security;

create policy "acc_profiles_select_authenticated"
  on public.acc_profiles for select
  to authenticated
  using (true);

create policy "acc_profiles_select_anon_leaderboard"
  on public.acc_profiles for select
  to anon
  using (onboarded_at is not null);

create policy "acc_profiles_update_own"
  on public.acc_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "acc_profiles_insert_own"
  on public.acc_profiles for insert
  to authenticated
  with check (auth.uid() = id);

create or replace function public.acc_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.acc_profiles (id, email, full_name, username, avatar)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'username', ''),
    coalesce(nullif(new.raw_user_meta_data->>'avatar', ''), 'NX')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_acc on auth.users;
create trigger on_auth_user_created_acc
  after insert on auth.users
  for each row execute function public.acc_handle_new_user();

create or replace function public.acc_complete_onboarding(
  p_full_name text,
  p_department text,
  p_level text,
  p_username text,
  p_hacker_name text,
  p_avatar text
)
returns public.acc_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  row public.acc_profiles;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  update public.acc_profiles
  set
    full_name = p_full_name,
    department = p_department,
    level = coalesce(nullif(p_level, ''), 'Beginner'),
    username = lower(p_username),
    hacker_name = p_hacker_name,
    avatar = coalesce(nullif(p_avatar, ''), 'NX'),
    onboarded_at = coalesce(onboarded_at, now()),
    updated_at = now()
  where id = uid
  returning * into row;

  if row.id is null then
    insert into public.acc_profiles (
      id, email, full_name, department, level, username, hacker_name, avatar, onboarded_at
    )
    values (
      uid,
      (select email from auth.users where id = uid),
      p_full_name,
      p_department,
      coalesce(nullif(p_level, ''), 'Beginner'),
      lower(p_username),
      p_hacker_name,
      coalesce(nullif(p_avatar, ''), 'NX'),
      now()
    )
    returning * into row;
  end if;

  return row;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.acc_profiles to anon, authenticated;
grant update, insert on public.acc_profiles to authenticated;
grant execute on function public.acc_complete_onboarding to authenticated;
