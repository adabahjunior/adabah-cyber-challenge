# ADABAH Cyber Challenge (ACC)

Premium cybersecurity competition frontend for **cybercc.adabah.com**.

## Pages

| Page | File |
|------|------|
| Landing | `index.html` |
| Onboarding | `onboarding.html` |
| Login | `login.html` |
| Dashboard | `dashboard.html` |
| Mission room | `mission.html` |
| Leaderboard | `leaderboard.html` |
| Profile | `profile.html` |
| Admin | `admin.html` |

## Run locally

```bash
python -m http.server 5500
```

Open http://127.0.0.1:5500/

## Notes

- UI-only frontend with `localStorage` participant state (no backend yet).
- Demo flag on mission page: any value containing `ACC{` is accepted; exact demo flag `ACC{footprint_mapped}`.
