import { useState } from "react";

export default function ImageEvidenceViewer({ src = "/mission-002/campus_photo.png" }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showMeta, setShowMeta] = useState(false);

  return (
    <div className="ev-viewer">
      <div className="ev-toolbar">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}>
          Zoom +
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
          Zoom −
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRotation((r) => (r + 90) % 360)}>
          Rotate
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowMeta((v) => !v)}>
          {showMeta ? "Hide metadata" : "Inspect metadata"}
        </button>
      </div>

      <div className="img-stage">
        <img
          src={src}
          alt="Recovered campus photo"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        />
      </div>

      {showMeta && (
        <div className="meta-panel glass">
          <p className="eyebrow">EXIF / File metadata</p>
          <div className="meta-grid">
            <div><span>File Name</span><code>campus_photo.jpg</code></div>
            <div><span>Camera Model</span><code>Samsung Galaxy A54</code></div>
            <div><span>Photographer</span><code>K. Mensah</code></div>
            <div><span>Date Taken</span><code>2026-03-14 18:42:11</code></div>
            <div><span>GPS</span><code>Tarkwa, GH (approx)</code></div>
            <div><span>UserComment</span><code className="flag-glow">ACC{"{"}metadata_master{"}"}</code></div>
            <div><span>Software</span><code>Phone Gallery 14.2</code></div>
            <div><span>Dimensions</span><code>4032 × 2268</code></div>
          </div>
          <p className="mono dim" style={{ marginTop: "0.75rem", fontSize: "0.75rem" }}>
            Tip: metadata fields often hold investigator gold.
          </p>
        </div>
      )}

      <style>{`
        .ev-viewer { display:grid; gap:.85rem; }
        .ev-toolbar { display:flex; flex-wrap:wrap; gap:.45rem; }
        .img-stage {
          overflow:auto; max-height:420px; border:1px solid var(--border-red);
          border-radius:12px; background:#050505; display:flex; align-items:center; justify-content:center;
          min-height:240px;
        }
        .img-stage img {
          max-width:100%; transition: transform .25s var(--ease); transform-origin:center center;
        }
        .meta-panel { padding:1rem; }
        .meta-grid { display:grid; gap:.45rem; margin-top:.65rem; }
        .meta-grid > div {
          display:grid; grid-template-columns:140px 1fr; gap:.6rem; padding:.55rem .65rem;
          border:1px solid var(--border); border-radius:8px; background:rgba(255,255,255,.02);
        }
        .meta-grid span { font-family:var(--font-mono); font-size:.7rem; color:var(--dim); text-transform:uppercase; letter-spacing:.06em; }
        .meta-grid code { font-family:var(--font-code); font-size:.86rem; color:var(--text); word-break:break-all; }
        .flag-glow { color: var(--red-bright) !important; }
        @media (max-width:560px){ .meta-grid > div { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
