import { useState } from "react";

const DETS = [
  {
    id: "d1",
    threat: "PUA.Generic.Updater",
    risk: "Medium",
    status: "Quarantined",
    time: "08:41:02",
    note: "Low-confidence heuristic on signed utility — false positive under review.",
  },
  {
    id: "d2",
    threat: "Trojan.NTKHelper.A",
    risk: "Critical",
    status: "Detected",
    time: "08:42:18",
    note: "Matches update.exe dropper. Case token: BLACKOUT{scan_complete}",
    flagged: true,
  },
  {
    id: "d3",
    threat: "RiskWare.RemoteAdmin",
    risk: "Low",
    status: "Allowed",
    time: "08:40:55",
    note: "Approved ICT remote support tool.",
  },
];

export default function AntivirusReport() {
  const [open, setOpen] = useState("d2");

  return (
    <div className="av">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Enterprise AV console snapshot · UTC-EDR-01 (simulated detections).
      </p>
      <div className="table">
        <div className="head mono">
          <span>Threat</span>
          <span>Risk</span>
          <span>Status</span>
          <span>Time</span>
        </div>
        {DETS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`row ${open === d.id ? "on" : ""} ${d.flagged ? "flag" : ""}`}
            onClick={() => setOpen(d.id)}
          >
            <span className="mono">{d.threat}</span>
            <span className={`risk ${d.risk.toLowerCase()}`}>{d.risk}</span>
            <span className="mono dim">{d.status}</span>
            <span className="mono dim">{d.time}</span>
          </button>
        ))}
      </div>
      {DETS.filter((d) => d.id === open).map((d) => (
        <div key={d.id} className={`detail ${d.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{d.threat}</p>
          <p className="mono note">{d.note}</p>
        </div>
      ))}
      <style>{`
        .av .table { border:1px solid var(--border); border-radius:12px; overflow:hidden; }
        .av .head, .av .row {
          display:grid; grid-template-columns:1.4fr .7fr .9fr .8fr; gap:.45rem;
          padding:.55rem .7rem; width:100%; text-align:left;
        }
        .av .head {
          background:#0c0c0c; color:var(--dim); font-size:.65rem; letter-spacing:.08em; text-transform:uppercase;
          border-bottom:1px solid var(--border);
        }
        .av .row {
          background:transparent; border:0; border-bottom:1px solid rgba(255,255,255,.05);
          color:var(--muted); cursor:pointer; font-size:.82rem;
        }
        .av .row.on, .av .row:hover { background:rgba(176,0,32,.1); color:#fff; }
        .av .row.flag { box-shadow:inset 3px 0 0 var(--red-bright); }
        .av .risk.critical { color:var(--red-bright); font-family:var(--font-mono); font-size:.75rem; }
        .av .risk.medium { color:#fbbf24; font-family:var(--font-mono); font-size:.75rem; }
        .av .risk.low { color:#86efac; font-family:var(--font-mono); font-size:.75rem; }
        .av .detail {
          margin-top:.85rem; padding:.9rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .av .detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .av .note { margin-top:.4rem; color:var(--muted); font-size:.86rem; }
        .av .detail.flag .note { color:#fecaca; }
        @media (max-width:700px) {
          .av .head, .av .row { grid-template-columns:1fr 1fr; }
          .av .head span:nth-child(n+3), .av .row span:nth-child(n+3) { display:none; }
        }
      `}</style>
    </div>
  );
}
