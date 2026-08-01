import { useState } from "react";

const ACCOUNTS = [
  {
    id: "a1",
    user: "s.owusu",
    history: "Normal campus logins · MFA OK",
    verdict: "Clean",
  },
  {
    id: "a2",
    user: "j.mensah",
    history: "Impossible travel (Lagos 03:14 → Tarkwa 07:58) · LAB-PC-05",
    verdict: "Compromised",
    detail: "Primary takeover account confirmed. Identity token: BLACKOUT{identity_recovered}",
    flagged: true,
  },
  {
    id: "a3",
    user: "ict.director",
    history: "IR coordination only · MFA challenges passed",
    verdict: "Clean",
  },
  {
    id: "a4",
    user: "svc-backup",
    history: "Failed sprays during Part I · locked out",
    verdict: "Targeted (not owned)",
  },
];

export default function RecoveredCredentials() {
  const [open, setOpen] = useState("a2");
  const active = ACCOUNTS.find((a) => a.id === open);

  return (
    <div className="cred">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Simulated credential review — identify the compromised identity from prior hunts.
      </p>
      <div className="grid">
        {ACCOUNTS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`card ${open === a.id ? "on" : ""} ${a.flagged ? "flag" : ""}`}
            onClick={() => setOpen(a.id)}
          >
            <span className="mono user">{a.user}</span>
            <span className="verdict">{a.verdict}</span>
          </button>
        ))}
      </div>
      {active ? (
        <div className={`detail ${active.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{active.user}</p>
          <p className="hist">{active.history}</p>
          {active.detail ? <p className="mono tok">{active.detail}</p> : null}
        </div>
      ) : null}
      <style>{`
        .cred .grid { display:grid; gap:.55rem; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); }
        .cred .card {
          text-align:left; border:1px solid var(--border); border-radius:12px; padding:.8rem;
          background:rgba(255,255,255,.02); color:var(--text); cursor:pointer; display:grid; gap:.35rem;
        }
        .cred .card.on { border-color:rgba(224,17,54,.5); }
        .cred .card.flag { background:rgba(176,0,32,.1); }
        .cred .user { color:var(--red-bright); }
        .cred .verdict { font-size:.8rem; color:var(--muted); }
        .cred .detail {
          margin-top:1rem; padding:1rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .cred .detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .cred .hist { color:var(--muted); margin:.35rem 0; }
        .cred .tok { color:#fecaca; font-size:.86rem; }
      `}</style>
    </div>
  );
}
