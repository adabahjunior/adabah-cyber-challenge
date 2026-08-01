import { useState } from "react";

const SERVERS = [
  { id: "auth", name: "Authentication Server", host: "UTC-AUTH-02", status: "offline", detail: "SSO realm unreachable. Last heartbeat 07:41:58." },
  { id: "db", name: "Database Server", host: "UTC-DB-01", status: "offline", detail: "Primary student-records cluster disconnected. Residual note: ACC{server_down}", flagged: true },
  { id: "web", name: "Web Server", host: "UTC-WEB-03", status: "degraded", detail: "Public site up; registrar apps failing dependency checks." },
  { id: "mail", name: "Mail Server", host: "UTC-MAIL-01", status: "healthy", detail: "Exchange relay nominal. Queue delay +2m." },
  { id: "dns", name: "DNS Server", host: "EDGE-DNS-A", status: "offline", detail: "Recursive resolver not answering for admin.umat.local zones." },
];

export default function ServerStatusBoard() {
  const [selected, setSelected] = useState("db");
  const active = SERVERS.find((s) => s.id === selected);

  return (
    <div className="srv-board">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Click each node to inspect health. Offline systems require immediate triage.
      </p>
      <div className="srv-grid">
        {SERVERS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`srv ${s.status} ${selected === s.id ? "on" : ""} ${s.flagged ? "flag" : ""}`}
            onClick={() => setSelected(s.id)}
          >
            <span className="mono dim host">{s.host}</span>
            <span className="name">{s.name}</span>
            <span className={`st mono`}>{s.status.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {active ? (
        <div className={`srv-detail ${active.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{active.host}</p>
          <h4 style={{ fontSize: "1rem", margin: "0.25rem 0 0.5rem" }}>{active.name}</h4>
          <p className="mono" style={{ color: active.flagged ? "#fecaca" : "var(--muted)", fontSize: "0.9rem" }}>
            {active.detail}
          </p>
        </div>
      ) : null}
      <style>{`
        .srv-grid { display:grid; gap:.65rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
        .srv {
          text-align:left; border-radius:12px; padding:.85rem; cursor:pointer;
          border:1px solid var(--border); background:rgba(255,255,255,.02); color:var(--text);
          display:grid; gap:.35rem;
        }
        .srv.on { outline:1px solid rgba(224,17,54,.55); }
        .srv.flag { box-shadow:0 0 18px rgba(176,0,32,.2); }
        .srv.healthy { border-color:rgba(34,197,94,.35); }
        .srv.degraded { border-color:rgba(234,179,8,.4); }
        .srv.offline { border-color:rgba(224,17,54,.45); background:rgba(176,0,32,.08); }
        .srv .host { font-size:.68rem; }
        .srv .name { font-size:.88rem; font-weight:600; }
        .srv .st { font-size:.72rem; color:var(--dim); }
        .srv.offline .st { color:var(--red-bright); }
        .srv.healthy .st { color:#86efac; }
        .srv.degraded .st { color:#fde68a; }
        .srv-detail {
          margin-top:1rem; padding:1rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .srv-detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
      `}</style>
    </div>
  );
}
