import { useState } from "react";

const EVENTS = [
  { id: "n1", time: "07:39", title: "Initial login anomaly", note: "Registry clerk session — Part I timeline start." },
  { id: "n2", time: "08:03", title: "C2 beacon established", note: "LAB-PC-05 → 185.243.112.44 (Part II)." },
  { id: "n3", time: "08:42", title: "Payload detected", note: "update.exe quarantined across infected hosts (Part III)." },
  {
    id: "n4",
    time: "09:15",
    title: "Network segment secured",
    note: "Edge rules + host isolation confirmed. Token: BLACKOUT{network_secured}",
    flagged: true,
  },
  { id: "n5", time: "09:40", title: "Residual monitoring", note: "No new beacons in the last 25 minutes." },
];

export default function NetworkEvidence() {
  const [open, setOpen] = useState("n4");

  return (
    <div className="net-ev">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Final network timeline spanning Operation Blackout Parts I–III.
      </p>
      <div className="rail">
        {EVENTS.map((e) => (
          <button
            key={e.id}
            type="button"
            className={`card ${open === e.id ? "on" : ""} ${e.flagged ? "flag" : ""}`}
            onClick={() => setOpen(e.id)}
          >
            <span className="mono time">{e.time}</span>
            <span className="title">{e.title}</span>
          </button>
        ))}
      </div>
      {EVENTS.filter((e) => e.id === open).map((e) => (
        <div key={e.id} className={`detail ${e.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{e.time} GMT</p>
          <h4>{e.title}</h4>
          <p className="mono note">{e.note}</p>
        </div>
      ))}
      <style>{`
        .net-ev .rail { display:grid; gap:.5rem; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); }
        .net-ev .card {
          text-align:left; border:1px solid var(--border); border-radius:12px; padding:.7rem;
          background:rgba(255,255,255,.02); color:var(--text); cursor:pointer; display:grid; gap:.3rem;
        }
        .net-ev .card.on { border-color:rgba(224,17,54,.5); }
        .net-ev .card.flag { background:rgba(176,0,32,.1); }
        .net-ev .time { color:var(--red-bright); font-size:.82rem; }
        .net-ev .title { font-size:.84rem; font-weight:600; }
        .net-ev .detail {
          margin-top:1rem; padding:1rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .net-ev .detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .net-ev h4 { margin:.25rem 0 .45rem; font-size:1rem; }
        .net-ev .note { color:var(--muted); font-size:.86rem; }
        .net-ev .detail.flag .note { color:#fecaca; }
      `}</style>
    </div>
  );
}
