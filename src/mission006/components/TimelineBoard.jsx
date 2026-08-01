import { useState } from "react";

const EVENTS = [
  {
    id: "t1",
    time: "07:39",
    title: "Initial login observed",
    summary: "Registry clerk session opens from campus subnet. Marker: ACC{timeline_started}",
    flagged: true,
  },
  {
    id: "t2",
    time: "07:40",
    title: "Failed service authentication",
    summary: "svc-backup rejects credentials three times in under a minute.",
  },
  {
    id: "t3",
    time: "07:41",
    title: "Unknown process",
    summary: "ntk-helper.exe appears on an auth tier host with no change ticket.",
  },
  {
    id: "t4",
    time: "07:42",
    title: "Database disconnect",
    summary: "UTC-DB-01 drops client connections; student records go dark.",
  },
  {
    id: "t5",
    time: "07:43",
    title: "SOC alert fired",
    summary: "IR-BLACKOUT-1 opens. ACRT deployed to Incident Response Room.",
  },
];

export default function TimelineBoard() {
  const [open, setOpen] = useState("t1");

  return (
    <div className="tl-board">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Inspect every event card to reconstruct the first minutes of Operation Blackout.
      </p>
      <div className="tl-rail">
        {EVENTS.map((ev, idx) => (
          <button
            key={ev.id}
            type="button"
            className={`card ${open === ev.id ? "on" : ""} ${ev.flagged ? "flag" : ""}`}
            onClick={() => setOpen(ev.id)}
          >
            <span className="mono time">{ev.time}</span>
            <span className="title">{ev.title}</span>
            <span className="mono dim step">E{idx + 1}</span>
          </button>
        ))}
      </div>
      {EVENTS.filter((e) => e.id === open).map((ev) => (
        <div key={ev.id} className={`tl-detail ${ev.flagged ? "flag" : ""}`}>
          <p className="eyebrow">{ev.time} GMT</p>
          <h4 style={{ fontSize: "1rem", margin: "0.25rem 0 0.5rem" }}>{ev.title}</h4>
          <p className="mono" style={{ color: ev.flagged ? "#fecaca" : "var(--muted)", fontSize: "0.9rem" }}>
            {ev.summary}
          </p>
        </div>
      ))}
      <style>{`
        .tl-rail { display:grid; gap:.55rem; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); }
        .tl-board .card {
          text-align:left; border:1px solid var(--border); border-radius:12px; padding:.75rem;
          background:rgba(255,255,255,.02); cursor:pointer; color:var(--text); display:grid; gap:.35rem;
        }
        .tl-board .card.on { border-color:rgba(224,17,54,.55); }
        .tl-board .card.flag { background:rgba(176,0,32,.1); }
        .tl-board .time { color:var(--red-bright); font-size:.85rem; }
        .tl-board .title { font-size:.86rem; font-weight:600; }
        .tl-board .step { font-size:.68rem; }
        .tl-detail {
          margin-top:1rem; padding:1rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .tl-detail.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
      `}</style>
    </div>
  );
}
