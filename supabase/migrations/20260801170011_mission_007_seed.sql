insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M07',
  'Operation Blackout – Part II: The Hunt',
  'Threat Hunting & Log Analysis',
  'Advanced',
  100,
  4,
  false,
  'mission-007/index.html',
  7
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
