-- Allow admins to exclude test accounts from the public leaderboard

alter table public.acc_profiles
  add column if not exists leaderboard_eligible boolean not null default true;

create index if not exists acc_profiles_leaderboard_eligible_idx
  on public.acc_profiles (leaderboard_eligible)
  where onboarded_at is not null;

drop function if exists public.acc_ranked_participants();
drop function if exists public.acc_admin_list_participants();
drop function if exists public.acc_set_leaderboard_eligible(uuid, boolean);

-- Public / competition rankings: eligible onboarded participants only
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
  leaderboard_eligible boolean,
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
    p.leaderboard_eligible,
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
  where p.onboarded_at is not null
    and coalesce(p.leaderboard_eligible, true) = true;
$$;

grant execute on function public.acc_ranked_participants() to authenticated, anon;

-- Admin roster: everyone (including test accounts), with rank only when eligible
create or replace function public.acc_admin_list_participants()
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
  leaderboard_eligible boolean,
  onboarded_at timestamptz,
  created_at timestamptz,
  computed_rank bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) <> 'adabahjunior@gmail.com' then
    raise exception 'Admin access required';
  end if;

  return query
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
    coalesce(p.leaderboard_eligible, true) as leaderboard_eligible,
    p.onboarded_at,
    p.created_at,
    ranked.computed_rank
  from public.acc_profiles p
  left join public.acc_ranked_participants() ranked on ranked.id = p.id
  where p.onboarded_at is not null
  order by
    coalesce(p.leaderboard_eligible, true) desc,
    ranked.computed_rank asc nulls last,
    p.score desc,
    p.created_at asc;
end;
$$;

grant execute on function public.acc_admin_list_participants() to authenticated;

-- Admin toggle: exclude / reinstate on leaderboard
create or replace function public.acc_set_leaderboard_eligible(
  p_user_id uuid,
  p_eligible boolean
)
returns public.acc_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  profile public.acc_profiles;
  handle text;
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) <> 'adabahjunior@gmail.com' then
    raise exception 'Admin access required';
  end if;

  update public.acc_profiles
  set
    leaderboard_eligible = coalesce(p_eligible, true),
    updated_at = now()
  where id = p_user_id
  returning * into profile;

  if not found then
    raise exception 'Profile not found';
  end if;

  handle := coalesce(nullif(profile.hacker_name, ''), nullif(profile.username, ''), 'operative');

  insert into public.acc_activity (user_id, event_type, message, meta)
  values (
    profile.id,
    case when profile.leaderboard_eligible then 'leaderboard_included' else 'leaderboard_excluded' end,
    case
      when profile.leaderboard_eligible then format('%s restored to the leaderboard', handle)
      else format('%s removed from the leaderboard (test account)', handle)
    end,
    jsonb_build_object('leaderboard_eligible', profile.leaderboard_eligible)
  );

  perform public.acc_refresh_awards();

  return profile;
end;
$$;

grant execute on function public.acc_set_leaderboard_eligible(uuid, boolean) to authenticated;

-- Rebuild awards using eligible ranks only; skip test accounts for mission master
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

  -- Clear stored rank for excluded / test accounts
  update public.acc_profiles
  set rank = null, updated_at = now()
  where onboarded_at is not null
    and coalesce(leaderboard_eligible, true) = false;

  select array_agg(distinct user_id::text) into mission_masters
  from (
    select distinct on (mr.mission_id) mr.user_id
    from public.acc_mission_runs mr
    join public.acc_profiles p on p.id = mr.user_id
    where mr.completed_at is not null
      and coalesce(p.leaderboard_eligible, true) = true
    order by mr.mission_id, mr.score desc, mr.elapsed_sec asc, mr.completed_at asc
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
