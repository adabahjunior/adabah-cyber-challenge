import { useState } from "react";

const IOCS = [
  {
    id: "ip",
    type: "Malicious IP",
    value: "185.243.112.44",
    note: "Observed as HTTPS beacon destination from LAB-PC-05.",
  },
  {
    id: "dom",
    type: "Suspicious domain",
    value: "update-cdn.novatech-secure.net",
    note: "Typosquat CDN used in loader callbacks.",
  },
  {
    id: "hash",
    type: "File hash (SHA-256)",
    value: "a3f1c9e28b4d…7e91",
    note: "Matches packed dropper on disk. IOC packet tag: BLACKOUT{ioc_found}",
    flagged: true,
  },
  {
    id: "ua",
    type: "User-Agent",
    value: "NTK-Helper/1.0",
    note: "Matches unknown process name from Part I logs.",
  },
];

export default function ThreatIntelViewer() {
  const [open, setOpen] = useState("hash");

  return (
    <div className="ti-view">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        ACRT Threat Intel Desk · correlate these IOCs with traffic, firewall, and endpoint findings.
      </p>
      <div className="list">
        {IOCS.map((ioc) => (
          <button
            key={ioc.id}
            type="button"
            className={`${open === ioc.id ? "on" : ""} ${ioc.flagged ? "flag" : ""}`}
            onClick={() => setOpen(ioc.id)}
          >
            <span className="mono dim">{ioc.type}</span>
            <span className="val mono">{ioc.value}</span>
          </button>
        ))}
      </div>
      {IOCS.filter((i) => i.id === open).map((ioc) => (
        <div key={ioc.id} className={`panel ${ioc.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{ioc.type}</p>
          <p className="mono val">{ioc.value}</p>
          <p className="note">{ioc.note}</p>
        </div>
      ))}
      <style>{`
        .ti-view .list { display:grid; gap:.45rem; margin-bottom:.85rem; }
        .ti-view .list button {
          text-align:left; display:grid; gap:.2rem; width:100%; cursor:pointer;
          background:#070707; border:1px solid var(--border); border-radius:10px; padding:.7rem .8rem; color:var(--muted);
        }
        .ti-view .list button.on { border-color:rgba(224,17,54,.5); color:#fff; }
        .ti-view .list button.flag { box-shadow:0 0 14px rgba(176,0,32,.2); }
        .ti-view .val { font-size:.9rem; color:var(--red-bright); word-break:break-all; }
        .ti-view .panel {
          padding:1rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .ti-view .panel.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .ti-view .note { margin-top:.55rem; color:var(--muted); font-size:.9rem; }
        .ti-view .panel.flag .note { color:#fecaca; font-family:var(--font-mono); font-size:.85rem; }
      `}</style>
    </div>
  );
}
