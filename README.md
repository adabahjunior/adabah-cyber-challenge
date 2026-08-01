# ADABAH Cyber Challenge (ACC)

Premium cybersecurity competition frontend for **cybercc.adabah.com**.

## Stack

- **Vite** multi-page app (static HTML pages + React Mission 001)
- Supabase Auth

## Pages

| Page | Route |
|------|-------|
| Landing | `/` |
| Onboarding | `/onboarding.html` |
| Login | `/login.html` |
| Dashboard | `/dashboard.html` |
| Challenges | `/challenges.html` |
| Mission 001 | `/mission-001/` |
| Mission 002 | `/mission-002/` |
| Mission 003 | `/mission-003/` |
| Leaderboard | `/leaderboard.html` |
| Profile | `/profile.html` |
| Admin | `/admin.html` |

## Local development

```bash
npm install
npm run dev
# or: npm start
```

Open http://127.0.0.1:5500/ and Mission 001 at http://127.0.0.1:5500/mission-001/

Do **not** use `python -m http.server` for this project — Mission 001 is a React page and needs Vite.

```bash
npm run build    # output → dist/
npm run preview  # preview production build
```

## Deploy to Vercel

Framework Preset: **Vite** (set in `vercel.json`)

1. Import the GitHub repo
2. Confirm Framework = Vite, Output = `dist`, Build = `npm run build`
3. Deploy

```bash
npx vercel --prod
```

## Mission room

React source: `src/mission/`

Reusable components: `MissionHeader`, `EvidenceCard`, `TaskCard`, `SubmissionPanel`, `ScoreDisplay`, `DebriefCard`

## Notes

- Auth uses Supabase (`acc_profiles`, portrait upload, WhatsApp).
- Completing Mission 001 stores progress in the browser and updates local student score.
