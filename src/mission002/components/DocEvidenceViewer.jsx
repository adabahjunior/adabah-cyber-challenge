import { useState } from "react";

export default function DocEvidenceViewer() {
  const [showProps, setShowProps] = useState(false);

  return (
    <div className="ev-viewer">
      <div className="doc-chrome">
        <div className="doc-menubar">
          <button type="button" className="doc-link" onClick={() => setShowProps(true)}>
            File
          </button>
          <span>Home</span>
          <span>Insert</span>
          <span>Review</span>
          <button type="button" className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setShowProps((v) => !v)}>
            {showProps ? "Close properties" : "Inspect properties"}
          </button>
        </div>
        <div className="doc-title">student_notes.docx — Recovered</div>
      </div>

      <div className="doc-body">
        <h4>Field notes — March</h4>
        <p>Someone keeps asking about the photo near the old path.</p>
        <p>Do not reply from the main account. Use the draft profile only if needed.</p>
        <ul>
          <li>Backup letter to Downloads</li>
          <li>Wipe gallery after sunset</li>
          <li>Leave campus quietly</li>
        </ul>
        <p className="mono dim" style={{ fontSize: "0.75rem" }}>— end of recovered fragment —</p>
      </div>

      {showProps && (
        <div className="meta-panel glass">
          <p className="eyebrow">Document properties</p>
          <div className="meta-grid">
            <div><span>Author</span><code>kwame.m</code></div>
            <div><span>Company</span><code>UMaT Student Union</code></div>
            <div><span>Revision Number</span><code>7</code></div>
            <div><span>Last Modified</span><code>2026-03-15 21:08</code></div>
            <div><span>Keywords</span><code className="flag-glow">ACC{"{"}forensic_eye{"}"}</code></div>
            <div><span>Content Status</span><code>Final draft</code></div>
          </div>
        </div>
      )}

      <style>{`
        .doc-chrome { border:1px solid var(--border); border-radius:12px 12px 0 0; overflow:hidden; background:#111; }
        .doc-menubar {
          display:flex; flex-wrap:wrap; gap:.75rem; align-items:center; padding:.55rem .75rem;
          border-bottom:1px solid var(--border); font-family:var(--font-mono); font-size:.75rem; color:var(--muted);
        }
        .doc-link { background:none; border:0; color:var(--red-bright); font:inherit; cursor:pointer; padding:0; }
        .doc-title { padding:.45rem .75rem; font-family:var(--font-mono); font-size:.78rem; color:var(--dim); }
        .doc-body {
          padding:1.2rem 1.25rem; background:#f8f8f8; color:#111; border:1px solid var(--border);
          border-top:0; border-radius:0 0 12px 12px; min-height:220px;
        }
        .doc-body h4 { margin:0 0 .75rem; }
        .doc-body p, .doc-body li { line-height:1.55; }
        .meta-panel { padding:1rem; margin-top:.85rem; }
        .meta-grid { display:grid; gap:.45rem; margin-top:.65rem; }
        .meta-grid > div {
          display:grid; grid-template-columns:150px 1fr; gap:.6rem; padding:.55rem .65rem;
          border:1px solid var(--border); border-radius:8px; background:rgba(255,255,255,.02);
        }
        .meta-grid span { font-family:var(--font-mono); font-size:.7rem; color:var(--dim); text-transform:uppercase; }
        .meta-grid code { font-family:var(--font-code); font-size:.86rem; word-break:break-all; }
        .flag-glow { color: var(--red-bright) !important; }
        @media (max-width:560px){ .meta-grid > div { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
