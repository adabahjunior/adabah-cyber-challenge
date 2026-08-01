insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M06',
  'Operation Blackout – Part I: The Breach',
  'Incident Response & Digital Investigation',
  'Advanced',
  100,
  4,
  false,
  'mission-006/index.html',
  6
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
