insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M05',
  'The Hidden Website',
  'Web Security & Client-Side Investigation',
  'Intermediate',
  100,
  3,
  false,
  'mission-005/index.html',
  5
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
