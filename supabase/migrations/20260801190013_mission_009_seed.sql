insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M09',
  'Operation Blackout – Final: Cyber Champion',
  'Capstone Challenge',
  'Expert',
  150,
  4,
  false,
  'mission-009/index.html',
  9
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
