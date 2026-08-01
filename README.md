# ADABAH Cyber Challenge (ACC)

Premium cybersecurity competition frontend for **cybercc.adabah.com**.

## Pages

| Page | File |
|------|------|
| Landing | `index.html` |
| Onboarding | `onboarding.html` |
| Login | `login.html` |
| Dashboard | `dashboard.html` |
| Mission 001 — The Phishing Trap | `mission-001/index.html` |
| Leaderboard | `leaderboard.html` |
| Profile | `profile.html` |
| Admin | `admin.html` |

## Run locally

```bash
python -m http.server 5500
```

Open http://127.0.0.1:5500/

Mission 001: http://127.0.0.1:5500/mission-001/

## Deploy to Vercel

This repo is a **static site** (not Next.js / Vite at the root). `vercel.json` sets Framework Preset to **Other**.

1. Import the GitHub repo in Vercel
2. Leave settings as detected from `vercel.json` (do not pick Vite or Next.js)
3. Deploy

Build installs `mission-room` deps and outputs Mission 001 into `mission-001/`. The rest of the site is served from the repo root.

```bash
npx vercel          # preview
npx vercel --prod   # production
```

## Mission room (React)

Source lives in `mission-room/` (Vite + React). Reusable components:

- `MissionHeader`
- `EvidenceCard`
- `TaskCard`
- `SubmissionPanel`
- `ScoreDisplay`
- `DebriefCard`

```bash
npm run mission:dev     # develop on :5173
npm run mission:build   # rebuild static files into mission-001/
```

## Notes

- Auth uses Supabase (`acc_profiles`, portrait upload, WhatsApp).
- Completing Mission 001 stores progress in the browser and updates local student score.
