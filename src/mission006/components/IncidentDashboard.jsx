import { useState } from "react";

const ALERTS = [
  {
    id: "a1",
    severity: "CRITICAL",
    title: "Multiple core services unreachable",
    body: "Health checks failing for Database and Authentication tiers.",
    time: "07:42",
  },
  {
    id: "a2",
    severity: "HIGH",
    title: "Student records API timeout",
    body: "Registrar portals returning 503 across Faculty of Engineering.",
    time: "07:42",
  },
  {
    id: "a3",
    severity: "CRITICAL",
    title: "Security notification · case open",
    body: "ACRT ticket IR-2026-0842 raised. Reference ACC{incident_detected} — retain with first-hour packet.",
    time: "07:43",
    flagged: true,
  },
  {
    id: "a4",
    severity: "MEDIUM",
    title: "Department WAN degradation",
    body: "Library and Admin blocks reporting intermittent DNS resolution.",
    time: "07:41",
  },
];

const OFFLINE = [
  { name: "UTC-DB-01", role: "Student records" },
  { name: "UTC-AUTH-02", role: "Campus SSO" },
  { name: "EDGE-DNS-A", role: "Department resolver" },
];

export default function IncidentDashboard() {
  const [open, setOpen] = useState("a3");

  return (
    <div className="ir-dash">
      <div className="dash-top">
        <div>
          <p className="eyebrow">Live operations</p>
          <h3 style={{ fontSize: "1.05rem" }}>University Technology Centre · Incident Dashboard</h3>
        </div>
        <span className="badge badge-red">07:42 GMT · ACTIVE</span>
      </div>

      <div className="dash-grid">
        <section className="panel">
          <p className="mono dim label">Critical alerts</p>
          <ul className="alert-list">
            {ALERTS.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={`${open === a.id ? "on" : ""} ${a.flagged ? "flag" : ""}`}
                  onClick={() => setOpen(a.id)}
                >
                  <span className={`sev ${a.severity.toLowerCase()}`}>{a.severity}</span>
                  <span className="mono time">{a.time}</span>
                  <span className="title">{a.title}</span>
                </button>
              </li>
            ))}
          </ul>
          {ALERTS.filter((a) => a.id === open).map((a) => (
            <div key={a.id} className={`detail ${a.flagged ? "flag" : ""}`}>
              <p className="mono dim">Notification detail</p>
              <p>{a.body}</p>
            </div>
          ))}
        </section>

        <section className="panel">
          <p className="mono dim label">Offline servers</p>
          <ul className="offline">
            {OFFLINE.map((s) => (
              <li key={s.name}>
                <span className="dot" />
                <div>
                  <div className="mono">{s.name}</div>
                  <div className="muted">{s.role}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mono dim label" style={{ marginTop: "1rem" }}>
            Timeline pulse
          </p>
          <div className="pulse mono">
            07:39 login → 07:40 auth fail → 07:41 unknown process → 07:42 DB drop
          </div>
        </section>
      </div>

      <style>{`
        .ir-dash .dash-top { display:flex; justify-content:space-between; gap:.75rem; flex-wrap:wrap; margin-bottom:1rem; }
        .dash-grid { display:grid; gap:1rem; grid-template-columns:1.4fr 1fr; }
        @media (max-width:800px){ .dash-grid { grid-template-columns:1fr; } }
        .ir-dash .panel {
          border:1px solid var(--border); border-radius:12px; padding:.9rem;
          background:rgba(255,255,255,.02);
        }
        .ir-dash .label { font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:.5rem; }
        .alert-list { list-style:none; margin:0; padding:0; display:grid; gap:.4rem; }
        .alert-list button {
          width:100%; text-align:left; display:grid; grid-template-columns:auto auto 1fr; gap:.45rem; align-items:center;
          background:#070707; border:1px solid var(--border); border-radius:10px; padding:.55rem .65rem; cursor:pointer; color:var(--muted);
        }
        .alert-list button.on { border-color:rgba(224,17,54,.5); color:#fff; }
        .alert-list button.flag { box-shadow:0 0 16px rgba(176,0,32,.2); }
        .sev { font-family:var(--font-mono); font-size:.65rem; padding:.15rem .4rem; border-radius:4px; }
        .sev.critical { background:rgba(176,0,32,.25); color:#fecaca; }
        .sev.high { background:rgba(249,115,22,.2); color:#fdba74; }
        .sev.medium { background:rgba(234,179,8,.15); color:#fde68a; }
        .alert-list .time { font-size:.72rem; color:var(--dim); }
        .alert-list .title { font-size:.82rem; }
        .detail { margin-top:.75rem; padding:.75rem; border-radius:10px; border:1px solid var(--border); background:#050505; }
        .detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .detail p { margin:.35rem 0 0; font-size:.9rem; color:var(--muted); }
        .offline { list-style:none; margin:0; padding:0; display:grid; gap:.55rem; }
        .offline li { display:flex; gap:.55rem; align-items:center; }
        .offline .dot { width:8px; height:8px; border-radius:50%; background:var(--red-bright); box-shadow:0 0 8px rgba(224,17,54,.6); }
        .pulse { font-size:.75rem; color:var(--muted); line-height:1.45; padding:.55rem; border:1px dashed rgba(176,0,32,.35); border-radius:8px; }
      `}</style>
    </div>
  );
}
