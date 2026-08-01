import { useState } from "react";

const HOSTS = [
  {
    id: "lab01",
    name: "LAB-PC-01",
    user: "s.owusu",
    status: "nominal",
    detail: "Browser + IDE activity. No unusual outbound connections.",
  },
  {
    id: "lab05",
    name: "LAB-PC-05",
    user: "j.mensah",
    status: "suspicious",
    detail:
      "Unknown scheduled task + persistent HTTPS to 185.243.112.44. Infection marker: BLACKOUT{infected_host}",
    flagged: true,
  },
  {
    id: "srv02",
    name: "SERVER-02",
    user: "SYSTEM",
    status: "elevated",
    detail: "Backup job delayed. CPU spike correlated with DB disconnect earlier.",
  },
  {
    id: "admin",
    name: "ADMIN-PC",
    user: "ict.director",
    status: "nominal",
    detail: "Email and ticket console only. MFA sessions intact.",
  },
];

export default function EndpointDashboard() {
  const [selected, setSelected] = useState("lab05");
  const active = HOSTS.find((h) => h.id === selected);

  return (
    <div className="ep-dash">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Inspect each endpoint. Unusual process trees and C2 beacons mark the compromised host.
      </p>
      <div className="grid">
        {HOSTS.map((h) => (
          <button
            key={h.id}
            type="button"
            className={`card ${h.status} ${selected === h.id ? "on" : ""} ${h.flagged ? "flag" : ""}`}
            onClick={() => setSelected(h.id)}
          >
            <span className="mono dim">{h.user}</span>
            <span className="name">{h.name}</span>
            <span className="mono st">{h.status.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {active ? (
        <div className={`detail ${active.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{active.name}</p>
          <p className="mono" style={{ color: active.flagged ? "#fecaca" : "var(--muted)", marginTop: "0.45rem" }}>
            {active.detail}
          </p>
        </div>
      ) : null}
      <style>{`
        .ep-dash .grid { display:grid; gap:.65rem; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); }
        .ep-dash .card {
          text-align:left; border:1px solid var(--border); border-radius:12px; padding:.85rem;
          background:rgba(255,255,255,.02); color:var(--text); cursor:pointer; display:grid; gap:.3rem;
        }
        .ep-dash .card.on { border-color:rgba(224,17,54,.55); }
        .ep-dash .card.flag { box-shadow:0 0 18px rgba(176,0,32,.2); }
        .ep-dash .card.suspicious { border-color:rgba(224,17,54,.4); background:rgba(176,0,32,.1); }
        .ep-dash .name { font-weight:600; font-size:.92rem; }
        .ep-dash .st { font-size:.68rem; color:var(--dim); }
        .ep-dash .card.suspicious .st { color:var(--red-bright); }
        .ep-dash .detail {
          margin-top:1rem; padding:1rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .ep-dash .detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
      `}</style>
    </div>
  );
}
