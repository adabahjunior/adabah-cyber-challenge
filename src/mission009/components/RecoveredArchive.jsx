import { useState } from "react";

const DOCS = [
  {
    id: "d1",
    name: "README.txt",
    body: "Staging dump for Operation Blackout. Destroy after exfil.",
  },
  {
    id: "d2",
    name: "targets_umat.json",
    body: '{ "priority": ["UTC-DB-01", "UTC-AUTH-02", "LAB-PC-05"] }',
  },
  {
    id: "d3",
    name: "final_note.md",
    body: "If you are reading this, ACRT closed the loop. Token: BLACKOUT{archive_opened}",
    flagged: true,
  },
  {
    id: "d4",
    name: "noise.log",
    body: "junk · junk · decoy strings · do not trust filenames alone",
  },
];

export default function RecoveredArchive() {
  const [open, setOpen] = useState("d3");
  const doc = DOCS.find((d) => d.id === open);

  return (
    <div className="arch">
      <p className="muted" style={{ marginBottom: "0.75rem" }}>
        Archive <span className="mono">blackout_final.zip</span> decrypted offline. Inspect each document.
      </p>
      <div className="layout">
        <div className="files">
          {DOCS.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`${open === d.id ? "on" : ""} ${d.flagged ? "flag" : ""}`}
              onClick={() => setOpen(d.id)}
            >
              {d.name}
            </button>
          ))}
        </div>
        <pre className={`body mono ${doc?.flagged ? "flag" : ""}`}>{doc?.body}</pre>
      </div>
      <style>{`
        .arch .layout { display:grid; grid-template-columns:180px 1fr; gap:.75rem; }
        .arch .files { display:grid; gap:.35rem; align-content:start; }
        .arch .files button {
          text-align:left; background:#070707; border:1px solid var(--border); border-radius:8px;
          color:var(--muted); padding:.55rem .65rem; cursor:pointer; font-family:var(--font-mono); font-size:.78rem;
        }
        .arch .files button.on { border-color:rgba(224,17,54,.5); color:#fff; }
        .arch .files button.flag { box-shadow:0 0 12px rgba(176,0,32,.2); }
        .arch .body {
          margin:0; padding:1rem; border-radius:12px; border:1px solid var(--border);
          background:#050505; color:var(--muted); white-space:pre-wrap; min-height:160px; font-size:.86rem;
        }
        .arch .body.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); color:#fecaca; }
        @media (max-width:700px){ .arch .layout { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
