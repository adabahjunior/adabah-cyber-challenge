-- Seed Mission 002 into catalog (inactive until admin activates)
insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M02',
  'The Hidden Trail',
  'Digital Forensics & OSINT',
  'Beginner → Intermediate',
  100,
  1,
  false,
  'mission-002/index.html',
  2
)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  difficulty = excluded.difficulty,
  points = excluded.points,
  href = excluded.href,
  sort_order = excluded.sort_order,
  updated_at = now();
