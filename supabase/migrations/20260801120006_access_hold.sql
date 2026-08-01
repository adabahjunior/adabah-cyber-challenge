-- Global platform settings (access hold gate for non-admin students)
create table if not exists public.acc_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.acc_settings enable row level security;

drop policy if exists "acc_settings_select" on public.acc_settings;
create policy "acc_settings_select"
  on public.acc_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "acc_settings_admin_upsert" on public.acc_settings;
create policy "acc_settings_admin_insert"
  on public.acc_settings for insert
  to authenticated
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

drop policy if exists "acc_settings_admin_update" on public.acc_settings;
create policy "acc_settings_admin_update"
  on public.acc_settings for update
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'adabahjunior@gmail.com');

grant select on public.acc_settings to anon, authenticated;
grant insert, update on public.acc_settings to authenticated;

insert into public.acc_settings (key, value)
values ('access_hold', '{"active": true}'::jsonb)
on conflict (key) do nothing;
