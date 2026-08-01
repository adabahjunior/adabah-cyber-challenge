-- Portrait + display avatar fields
alter table public.acc_profiles
  add column if not exists portrait_url text,
  add column if not exists avatar_style text default 'pulse';

-- Storage bucket for student portraits
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'acc-portraits',
  'acc-portraits',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "acc_portraits_public_read" on storage.objects;
create policy "acc_portraits_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'acc-portraits');

drop policy if exists "acc_portraits_owner_upload" on storage.objects;
create policy "acc_portraits_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'acc-portraits'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "acc_portraits_owner_update" on storage.objects;
create policy "acc_portraits_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'acc-portraits'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "acc_portraits_owner_delete" on storage.objects;
create policy "acc_portraits_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'acc-portraits'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create or replace function public.acc_complete_onboarding(
  p_full_name text,
  p_department text,
  p_level text,
  p_username text,
  p_hacker_name text,
  p_avatar text,
  p_portrait_url text default null,
  p_avatar_style text default 'pulse'
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

  if p_portrait_url is null or length(trim(p_portrait_url)) = 0 then
    raise exception 'A clear portrait photo is required';
  end if;

  update public.acc_profiles
  set
    full_name = p_full_name,
    department = p_department,
    level = coalesce(nullif(p_level, ''), 'Beginner'),
    username = lower(p_username),
    hacker_name = p_hacker_name,
    avatar = coalesce(nullif(p_avatar, ''), 'NX'),
    portrait_url = p_portrait_url,
    avatar_style = coalesce(nullif(p_avatar_style, ''), 'pulse'),
    onboarded_at = coalesce(onboarded_at, now()),
    updated_at = now()
  where id = uid
  returning * into row;

  if row.id is null then
    insert into public.acc_profiles (
      id, email, full_name, department, level, username, hacker_name, avatar,
      portrait_url, avatar_style, onboarded_at
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
      p_portrait_url,
      coalesce(nullif(p_avatar_style, ''), 'pulse'),
      now()
    )
    returning * into row;
  end if;

  return row;
end;
$$;

grant execute on function public.acc_complete_onboarding(text, text, text, text, text, text, text, text) to authenticated;
