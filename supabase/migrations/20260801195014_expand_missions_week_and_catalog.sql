-- Allow final-week missions (Operation Blackout) and future weeks
alter table public.acc_missions
  drop constraint if exists acc_missions_week_check;

alter table public.acc_missions
  add constraint acc_missions_week_check check (week between 1 and 8);

-- Ensure full mission catalog is present (inactive until admin activates)
insert into public.acc_missions (
  id, title, category, difficulty, points, week, active, href, sort_order
) values
  ('M02', 'The Hidden Trail', 'Digital Forensics & OSINT', 'Beginner → Intermediate', 100, 1, false, 'mission-002/index.html', 2),
  ('M03', 'The Network Intruder', 'Networking & Network Investigation', 'Intermediate', 100, 2, false, 'mission-003/index.html', 3),
  ('M04', 'The Breached Vault', 'Authentication & Password Security', 'Intermediate', 100, 2, false, 'mission-004/index.html', 4),
  ('M05', 'The Hidden Website', 'Web Security & Client-Side Investigation', 'Intermediate', 100, 3, false, 'mission-005/index.html', 5),
  ('M06', 'Operation Blackout – Part I: The Breach', 'Incident Response & Digital Investigation', 'Advanced', 100, 4, false, 'mission-006/index.html', 6),
  ('M07', 'Operation Blackout – Part II: The Hunt', 'Threat Hunting & Log Analysis', 'Advanced', 100, 4, false, 'mission-007/index.html', 7),
  ('M08', 'Operation Blackout – Part III: The Payload', 'Malware Analysis & Incident Containment', 'Advanced', 100, 4, false, 'mission-008/index.html', 8),
  ('M09', 'Operation Blackout – Final: Cyber Champion', 'Capstone Challenge', 'Expert', 150, 4, false, 'mission-009/index.html', 9)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  difficulty = excluded.difficulty,
  points = excluded.points,
  href = excluded.href,
  sort_order = excluded.sort_order,
  week = excluded.week,
  updated_at = now();
