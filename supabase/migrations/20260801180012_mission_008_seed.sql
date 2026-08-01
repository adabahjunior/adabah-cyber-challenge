insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values (
  'M08',
  'Operation Blackout – Part III: The Payload',
  'Malware Analysis & Incident Containment',
  'Advanced',
  100,
  4,
  false,
  'mission-008/index.html',
  8
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
