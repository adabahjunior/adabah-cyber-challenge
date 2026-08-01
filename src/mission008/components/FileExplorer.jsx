import { useState } from "react";

const FILES = [
  {
    id: "f1",
    name: "assignment.docx",
    size: "248 KB",
    type: "Document",
    detail: "Student coursework. Macro-free. SHA matches known good.",
  },
  {
    id: "f2",
    name: "budget.xlsx",
    size: "91 KB",
    type: "Spreadsheet",
    detail: "Department budget template. No active content.",
  },
  {
    id: "f3",
    name: "update.exe",
    size: "1.4 MB",
    type: "Executable · SUSPICIOUS",
    detail:
      "Masquerades as a software updater. Not signed by University IT. Sandbox tag: BLACKOUT{payload_found}",
    flagged: true,
  },
  {
    id: "f4",
    name: "holiday.jpg",
    size: "2.1 MB",
    type: "Image",
    detail: "JPEG photograph. EXIF clean. No appended payload in this simulation.",
  },
];

export default function FileExplorer() {
  const [selected, setSelected] = useState(null);
  const active = FILES.find((f) => f.id === selected);

  return (
    <div className="file-x">
      <p className="muted" style={{ marginBottom: "0.75rem" }}>
        Safe simulation — artefacts are metadata only. No real executables are present or downloadable.
      </p>
      <div className="explorer">
        <div className="sidebar mono dim">
          <div>This PC</div>
          <div className="on">Downloads\Recovered</div>
          <div>Desktop</div>
        </div>
        <div className="list">
          <div className="head mono">
            <span>Name</span>
            <span>Type</span>
            <span>Size</span>
          </div>
          {FILES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`row ${selected === f.id ? "on" : ""} ${f.flagged ? "flag" : ""}`}
              onClick={() => setSelected(f.id)}
            >
              <span className="name">{f.name}</span>
              <span className="mono dim">{f.type}</span>
              <span className="mono dim">{f.size}</span>
            </button>
          ))}
        </div>
      </div>
      {active ? (
        <div className={`props ${active.flagged ? "flag" : ""}`}>
          <p className="eyebrow">Properties · {active.name}</p>
          <p className="mono detail">{active.detail}</p>
        </div>
      ) : (
        <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
          Select a file to inspect properties.
        </p>
      )}
      <style>{`
        .file-x .explorer {
          display:grid; grid-template-columns:140px 1fr; border:1px solid var(--border);
          border-radius:12px; overflow:hidden; min-height:220px;
        }
        .file-x .sidebar {
          background:#0a0a0a; border-right:1px solid var(--border); padding:.75rem; font-size:.75rem;
          display:grid; gap:.45rem; align-content:start;
        }
        .file-x .sidebar .on { color:var(--red-bright); }
        .file-x .list { background:#050505; }
        .file-x .head, .file-x .row {
          display:grid; grid-template-columns:1.2fr 1fr .6fr; gap:.5rem; padding:.55rem .7rem; width:100%;
          text-align:left;
        }
        .file-x .head {
          font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; color:var(--dim);
          border-bottom:1px solid var(--border);
        }
        .file-x .row {
          background:transparent; border:0; border-bottom:1px solid rgba(255,255,255,.05);
          color:var(--muted); cursor:pointer; font-size:.86rem;
        }
        .file-x .row:hover, .file-x .row.on { background:rgba(176,0,32,.1); color:#fff; }
        .file-x .row.flag { box-shadow:inset 3px 0 0 var(--red-bright); }
        .file-x .name { font-family:var(--font-mono); color:inherit; }
        .file-x .props {
          margin-top:.85rem; padding:.9rem; border-radius:12px; border:1px solid var(--border); background:#050505;
        }
        .file-x .props.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .file-x .detail { margin-top:.4rem; color:var(--muted); font-size:.88rem; line-height:1.5; }
        .file-x .props.flag .detail { color:#fecaca; }
        @media (max-width:700px) {
          .file-x .explorer { grid-template-columns:1fr; }
          .file-x .sidebar { border-right:0; border-bottom:1px solid var(--border); grid-auto-flow:column; }
        }
      `}</style>
    </div>
  );
}
