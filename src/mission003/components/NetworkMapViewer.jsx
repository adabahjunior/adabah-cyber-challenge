import { useState } from "react";

const NODES = [
  { id: "router", label: "Router", x: 50, y: 12, detail: "UMaT-Core-Router · Gateway to campus WAN" },
  { id: "switch", label: "Switch", x: 50, y: 38, detail: "LAB-SWITCH-01 · Aggregates dorm & lab traffic" },
  { id: "server", label: "Server", x: 22, y: 62, detail: "FILE-SERVER-A · Student file shares" },
  { id: "staff", label: "Staff PC", x: 50, y: 68, detail: "STAFF-PC-14 · Admin office endpoint" },
  { id: "stu1", label: "Student PC", x: 78, y: 58, detail: "Student-PC-03 · Dorm wing A" },
  { id: "stu2", label: "Student PC", x: 78, y: 78, detail: "Student-PC-07 · Lab bay 2" },
  { id: "unknown", label: "Unknown Device", x: 22, y: 82, detail: "Unrecognized endpoint · ACC{network_mapper}", flag: true },
];

export default function NetworkMapViewer() {
  const [selected, setSelected] = useState(null);
  const active = NODES.find((n) => n.id === selected);

  return (
    <div className="soc-map">
      <div className="map-canvas">
        <svg viewBox="0 0 100 100" className="map-links" aria-hidden="true">
          <line x1="50" y1="18" x2="50" y2="32" />
          <line x1="50" y1="44" x2="22" y2="58" />
          <line x1="50" y1="44" x2="50" y2="62" />
          <line x1="50" y1="44" x2="78" y2="58" />
          <line x1="50" y1="44" x2="22" y2="78" />
          <line x1="50" y1="44" x2="78" y2="74" />
        </svg>
        {NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`map-node ${n.flag ? "rogue" : ""} ${selected === n.id ? "active" : ""}`}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onClick={() => setSelected(n.id)}
          >
            <span className="dot" />
            <span className="lbl">{n.label}</span>
          </button>
        ))}
      </div>
      <div className="map-detail glass">
        <p className="eyebrow">Device inspector</p>
        {active ? (
          <>
            <h4 style={{ margin: "0.35rem 0 0.45rem" }}>{active.label}</h4>
            <p className="mono" style={{ fontSize: "0.9rem", color: active.flag ? "var(--red-bright)" : "var(--muted)" }}>
              {active.detail}
            </p>
          </>
        ) : (
          <p className="muted">Click a node on the campus map to inspect it.</p>
        )}
      </div>
      <style>{`
        .soc-map { display:grid; gap:.85rem; }
        .map-canvas {
          position:relative; min-height:340px; border-radius:14px; border:1px solid var(--border-red);
          background:
            radial-gradient(circle at 50% 20%, rgba(176,0,32,.18), transparent 45%),
            linear-gradient(180deg, #0a0a0a, #050505);
          overflow:hidden;
        }
        .map-links { position:absolute; inset:0; width:100%; height:100%; }
        .map-links line { stroke: rgba(176,0,32,.45); stroke-width:0.4; }
        .map-node {
          position:absolute; transform:translate(-50%,-50%); background:transparent; border:0; cursor:pointer;
          display:grid; justify-items:center; gap:.25rem; color:var(--text); padding:0;
        }
        .map-node .dot {
          width:18px; height:18px; border-radius:50%; background:#1a1a1a; border:2px solid var(--red-bright);
          box-shadow:0 0 12px rgba(176,0,32,.45);
        }
        .map-node.rogue .dot { background:var(--red); animation: pulseDot 1.4s ease-in-out infinite; }
        .map-node.active .dot { box-shadow:0 0 18px rgba(224,17,54,.8); }
        .map-node .lbl { font-family:var(--font-mono); font-size:.68rem; letter-spacing:.04em; white-space:nowrap; }
        .map-detail { padding:.9rem 1rem; }
        @keyframes pulseDot { 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.15);} }
      `}</style>
    </div>
  );
}
