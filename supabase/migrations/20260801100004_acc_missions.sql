-- Mission catalog controlled by ACC admin
create table if not exists public.acc_missions (
  id text primary key,
  title text not null,
  category text not null default 'General',
  difficulty text not null default 'Beginner',
  points integer not null default 100,
  week integer not null default 1 check (week between 1 and 3),
  active boolean not null default false,
  href text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists acc_missions_week_idx on public.acc_missions (week, sort_order);
create index if not exists acc_missions_active_idx on public.acc_missions (active);

alter table public.acc_missions enable row level security;

drop policy if exists "acc_missions_select" on public.acc_missions;
create policy "acc_missions_select"
  on public.acc_missions for select
  to anon, authenticated
  using (
    active = true
    or lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com'
  );

drop policy if exists "acc_missions_admin_insert" on public.acc_missions;
create policy "acc_missions_admin_insert"
  on public.acc_missions for insert
  to authenticated
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

drop policy if exists "acc_missions_admin_update" on public.acc_missions;
create policy "acc_missions_admin_update"
  on public.acc_missions for update
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

drop policy if exists "acc_missions_admin_delete" on public.acc_missions;
create policy "acc_missions_admin_delete"
  on public.acc_missions for delete
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

grant select on public.acc_missions to anon, authenticated;
grant insert, update, delete on public.acc_missions to authenticated;

insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M01',
  'The Phishing Trap',
  'Social Engineering',
  'Beginner',
  100,
  1,
  true,
  'mission-001/index.html',
  1
)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  difficulty = excluded.difficulty,
  points = excluded.points,
  href = excluded.href,
  sort_order = excluded.sort_order,
  updated_at = now();
