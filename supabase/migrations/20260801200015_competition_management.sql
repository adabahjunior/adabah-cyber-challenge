-- Competition management: mission runs, activity, competition status, ranking helpers

alter table public.acc_profiles
  add column if not exists total_time_sec integer not null default 0,
  add column if not exists hints_used integer not null default 0,
  add column if not exists final_mission_score integer not null default 0,
  add column if not exists competition_completed_at timestamptz,
  add column if not exists certificate_id text,
  add column if not exists awards text[] not null default '{}';

create table if not exists public.acc_mission_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.acc_profiles(id) on delete cascade,
  mission_id text not null references public.acc_missions(id) on delete cascade,
  score integer not null default 0,
  elapsed_sec integer not null default 0,
  hints_used integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id)
);

create index if not exists acc_mission_runs_user_idx on public.acc_mission_runs (user_id);
create index if not exists acc_mission_runs_mission_idx on public.acc_mission_runs (mission_id, score desc);
create index if not exists acc_mission_runs_completed_idx on public.acc_mission_runs (completed_at desc nulls last);

create table if not exists public.acc_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.acc_profiles(id) on delete set null,
  event_type text not null,
  message text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists acc_activity_created_idx on public.acc_activity (created_at desc);

create table if not exists public.acc_competition (
  id text primary key default 'season1',
  title text not null default 'ADABAH Cyber Challenge · Season 1',
  status text not null default 'active' check (status in ('upcoming', 'active', 'completed')),
  started_at timestamptz,
  ended_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.acc_competition (id, title, status, started_at)
values ('season1', 'ADABAH Cyber Challenge · Season 1', 'active', now())
on conflict (id) do nothing;

alter table public.acc_mission_runs enable row level security;
alter table public.acc_activity enable row level security;
alter table public.acc_competition enable row level security;

drop policy if exists "acc_mission_runs_select" on public.acc_mission_runs;
create policy "acc_mission_runs_select"
  on public.acc_mission_runs for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com'
  );

drop policy if exists "acc_mission_runs_upsert_own" on public.acc_mission_runs;
create policy "acc_mission_runs_insert_own"
  on public.acc_mission_runs for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "acc_mission_runs_update_own" on public.acc_mission_runs;
create policy "acc_mission_runs_update_own"
  on public.acc_mission_runs for update
  to authenticated
  using (
    user_id = auth.uid()
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com'
  )
  with check (
    user_id = auth.uid()
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com'
  );

drop policy if exists "acc_activity_select" on public.acc_activity;
create policy "acc_activity_select"
  on public.acc_activity for select
  to authenticated
  using (true);

drop policy if exists "acc_activity_admin_all" on public.acc_activity;
create policy "acc_activity_admin_all"
  on public.acc_activity for all
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

drop policy if exists "acc_competition_select" on public.acc_competition;
create policy "acc_competition_select"
  on public.acc_competition for select
  to anon, authenticated
  using (true);

drop policy if exists "acc_competition_admin" on public.acc_competition;
create policy "acc_competition_admin"
  on public.acc_competition for all
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

grant select, insert, update on public.acc_mission_runs to authenticated;
grant select on public.acc_activity to authenticated;
grant insert, update, delete on public.acc_activity to authenticated;
grant select on public.acc_competition to anon, authenticated;
grant insert, update, delete on public.acc_competition to authenticated;

-- Record mission completion and refresh profile aggregates
create or replace function public.acc_record_mission_complete(
  p_mission_id text,
  p_score integer,
  p_elapsed_sec integer,
  p_hints_used integer default 0
)
returns public.acc_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  profile public.acc_profiles;
  run public.acc_mission_runs;
  already boolean := false;
  mission_title text;
  handle text;
  completed_count integer;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into profile from public.acc_profiles where id = uid;
  if not found then
    raise exception 'Profile not found';
  end if;

  select title into mission_title from public.acc_missions where id = p_mission_id;
  if mission_title is null then
    mission_title := p_mission_id;
  end if;

  select exists(
    select 1 from public.acc_mission_runs
    where user_id = uid and mission_id = p_mission_id and completed_at is not null
  ) into already;

  insert into public.acc_mission_runs as r (
    user_id, mission_id, score, elapsed_sec, hints_used, started_at, completed_at, updated_at
  ) values (
    uid,
    p_mission_id,
    greatest(coalesce(p_score, 0), 0),
    greatest(coalesce(p_elapsed_sec, 0), 0),
    greatest(coalesce(p_hints_used, 0), 0),
    now() - make_interval(secs => greatest(coalesce(p_elapsed_sec, 0), 0)),
    now(),
    now()
  )
  on conflict (user_id, mission_id) do update set
    score = greatest(r.score, excluded.score),
    elapsed_sec = case
      when r.completed_at is null then excluded.elapsed_sec
      when excluded.score > r.score then excluded.elapsed_sec
      else r.elapsed_sec
    end,
    hints_used = least(r.hints_used + excluded.hints_used, 999),
    completed_at = coalesce(r.completed_at, excluded.completed_at),
    updated_at = now()
  returning * into run;

  update public.acc_profiles p set
    completed_missions = (
      select array_agg(distinct x order by x)
      from unnest(coalesce(p.completed_missions, '{}') || array[p_mission_id]) as x
    ),
    score = (
      select coalesce(sum(mr.score), 0)
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    ),
    total_time_sec = (
      select coalesce(sum(mr.elapsed_sec), 0)
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    ),
    hints_used = (
      select coalesce(sum(mr.hints_used), 0)
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    ),
    final_mission_score = case
      when p_mission_id = 'M09' then greatest(coalesce(p.final_mission_score, 0), coalesce(p_score, 0))
      else coalesce(p.final_mission_score, 0)
    end,
    competition_completed_at = case
      when p_mission_id = 'M09' then coalesce(p.competition_completed_at, now())
      else p.competition_completed_at
    end,
    certificate_id = case
      when p_mission_id = 'M09' and p.certificate_id is null
        then 'ACC-CERT-' || upper(substr(replace(coalesce(p.username, 'USER'), '-', ''), 1, 6)) || '-' || upper(substr(md5(uid::text || now()::text), 1, 8))
      else p.certificate_id
    end,
    progress = least(100, (
      select (count(*) * 100 / 9)::integer
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    )),
    updated_at = now()
  where id = uid
  returning * into profile;

  select cardinality(profile.completed_missions) into completed_count;
  handle := coalesce(nullif(profile.hacker_name, ''), nullif(profile.username, ''), 'operative');

  if not already then
    insert into public.acc_activity (user_id, event_type, message, meta)
    values (
      uid,
      'mission_complete',
      handle || ' completed ' || mission_title,
      jsonb_build_object('mission_id', p_mission_id, 'score', p_score, 'handle', handle)
    );
  end if;

  if p_mission_id = 'M09' and profile.competition_completed_at is not null then
    insert into public.acc_activity (user_id, event_type, message, meta)
    values (
      uid,
      'competition_complete',
      handle || ' finished Operation Blackout and earned Cyber Champion eligibility',
      jsonb_build_object('handle', handle, 'score', profile.score)
    )
    on conflict do nothing;
  end if;

  return profile;
end;
$$;

grant execute on function public.acc_record_mission_complete(text, integer, integer, integer) to authenticated;

-- Ranked leaderboard view helper
create or replace function public.acc_ranked_participants()
returns table (
  id uuid,
  email text,
  full_name text,
  department text,
  username text,
  hacker_name text,
  portrait_url text,
  score integer,
  progress integer,
  completed_missions text[],
  total_time_sec integer,
  hints_used integer,
  final_mission_score integer,
  competition_completed_at timestamptz,
  certificate_id text,
  awards text[],
  computed_rank bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.email,
    p.full_name,
    p.department,
    p.username,
    p.hacker_name,
    p.portrait_url,
    p.score,
    p.progress,
    p.completed_missions,
    p.total_time_sec,
    p.hints_used,
    p.final_mission_score,
    p.competition_completed_at,
    p.certificate_id,
    p.awards,
    rank() over (
      order by
        p.score desc,
        p.final_mission_score desc,
        p.total_time_sec asc nulls last,
        p.hints_used asc,
        p.competition_completed_at asc nulls last,
        p.created_at asc
    ) as computed_rank
  from public.acc_profiles p
  where p.onboarded_at is not null;
$$;

grant execute on function public.acc_ranked_participants() to authenticated, anon;

-- Refresh awards based on current standings
create or replace function public.acc_refresh_awards()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  mission_masters text[];
begin
  -- Clear auto awards except keep custom ones manually if needed — rebuild from rules
  update public.acc_profiles set awards = '{}', updated_at = now();

  for r in select * from public.acc_ranked_participants() loop
    update public.acc_profiles p set
      awards = (
        select array_remove(array[
          case when r.computed_rank = 1 then 'cyber_champion' end,
          case when r.computed_rank between 2 and 5 then 'elite_defender' end,
          case when r.computed_rank between 6 and 10 then 'rising_analyst' end,
          case when cardinality(coalesce(r.completed_missions, '{}')) >= 9 then 'certified_explorer' end
        ], null)
      ),
      rank = r.computed_rank::integer,
      updated_at = now()
    where p.id = r.id;
  end loop;

  -- Mission Master: highest score on any mission
  select array_agg(distinct user_id::text) into mission_masters
  from (
    select distinct on (mission_id) user_id
    from public.acc_mission_runs
    where completed_at is not null
    order by mission_id, score desc, elapsed_sec asc, completed_at asc
  ) t;

  if mission_masters is not null then
    update public.acc_profiles p
    set awards = (
      select array_agg(distinct a)
      from unnest(coalesce(p.awards, '{}') || array['mission_master']) a
    ),
    updated_at = now()
    where p.id::text = any (mission_masters);
  end if;
end;
$$;

grant execute on function public.acc_refresh_awards() to authenticated;

-- Allow authenticated users to insert their own activity via RPC only (mission complete)
-- Fix competition_complete insert that used invalid ON CONFLICT
create or replace function public.acc_record_mission_complete(
  p_mission_id text,
  p_score integer,
  p_elapsed_sec integer,
  p_hints_used integer default 0
)
returns public.acc_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  profile public.acc_profiles;
  already boolean := false;
  mission_title text;
  handle text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into profile from public.acc_profiles where id = uid;
  if not found then
    raise exception 'Profile not found';
  end if;

  select title into mission_title from public.acc_missions where id = p_mission_id;
  if mission_title is null then
    mission_title := p_mission_id;
  end if;

  select exists(
    select 1 from public.acc_mission_runs
    where user_id = uid and mission_id = p_mission_id and completed_at is not null
  ) into already;

  insert into public.acc_mission_runs as r (
    user_id, mission_id, score, elapsed_sec, hints_used, started_at, completed_at, updated_at
  ) values (
    uid,
    p_mission_id,
    greatest(coalesce(p_score, 0), 0),
    greatest(coalesce(p_elapsed_sec, 0), 0),
    greatest(coalesce(p_hints_used, 0), 0),
    now() - make_interval(secs => greatest(coalesce(p_elapsed_sec, 0), 0)),
    now(),
    now()
  )
  on conflict (user_id, mission_id) do update set
    score = greatest(r.score, excluded.score),
    elapsed_sec = case
      when r.completed_at is null then excluded.elapsed_sec
      when excluded.score > r.score then excluded.elapsed_sec
      else r.elapsed_sec
    end,
    hints_used = case when r.completed_at is null then excluded.hints_used else r.hints_used end,
    completed_at = coalesce(r.completed_at, excluded.completed_at),
    updated_at = now();

  update public.acc_profiles p set
    completed_missions = (
      select array_agg(distinct x order by x)
      from unnest(coalesce(p.completed_missions, '{}') || array[p_mission_id]) as x
    ),
    score = (
      select coalesce(sum(mr.score), 0)
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    ),
    total_time_sec = (
      select coalesce(sum(mr.elapsed_sec), 0)
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    ),
    hints_used = (
      select coalesce(sum(mr.hints_used), 0)
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    ),
    final_mission_score = case
      when p_mission_id = 'M09' then greatest(coalesce(p.final_mission_score, 0), coalesce(p_score, 0))
      else coalesce(p.final_mission_score, 0)
    end,
    competition_completed_at = case
      when p_mission_id = 'M09' then coalesce(p.competition_completed_at, now())
      else p.competition_completed_at
    end,
    certificate_id = case
      when p_mission_id = 'M09' and p.certificate_id is null
        then 'ACC-CERT-' || upper(substr(replace(coalesce(p.username, 'USER'), '-', ''), 1, 6)) || '-' || upper(substr(md5(uid::text || clock_timestamp()::text), 1, 8))
      else p.certificate_id
    end,
    progress = least(100, (
      select (count(*) * 100 / 9)::integer
      from public.acc_mission_runs mr
      where mr.user_id = uid and mr.completed_at is not null
    )),
    updated_at = now()
  where id = uid
  returning * into profile;

  handle := coalesce(nullif(profile.hacker_name, ''), nullif(profile.username, ''), 'operative');

  if not already then
    insert into public.acc_activity (user_id, event_type, message, meta)
    values (
      uid,
      'mission_complete',
      handle || ' completed ' || mission_title,
      jsonb_build_object('mission_id', p_mission_id, 'score', p_score, 'handle', handle)
    );
  end if;

  if p_mission_id = 'M09' and not already then
    insert into public.acc_activity (user_id, event_type, message, meta)
    values (
      uid,
      'competition_complete',
      handle || ' finished Operation Blackout',
      jsonb_build_object('handle', handle, 'score', profile.score)
    );
  end if;

  perform public.acc_refresh_awards();

  select * into profile from public.acc_profiles where id = uid;
  return profile;
end;
$$;
