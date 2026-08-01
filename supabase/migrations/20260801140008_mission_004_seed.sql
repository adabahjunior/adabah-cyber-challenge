insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M04',
  'The Breached Vault',
  'Authentication & Password Security',
  'Intermediate',
  100,
  2,
  false,
  'mission-004/index.html',
  4
)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  difficulty = excluded.difficulty,
  points = excluded.points,
  href = excluded.href,
  sort_order = excluded.sort_order,
  week = excluded.week,
  updated_at = now();
