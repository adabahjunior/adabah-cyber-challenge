import { useMemo, useState } from "react";

const HOSTS = [
  { id: "h1", name: "LAB-PC-01", truth: "healthy" },
  { id: "h2", name: "LAB-PC-04", truth: "infected" },
  { id: "h3", name: "ADMIN-PC", truth: "healthy" },
  { id: "h4", name: "SERVER-03", truth: "infected" },
  { id: "h5", name: "LIBRARY-PC", truth: "infected" },
];

export default function AffectedSystems() {
  const [marks, setMarks] = useState({});

  const complete = useMemo(
    () => HOSTS.every((h) => marks[h.id] === h.truth),
    [marks]
  );

  function mark(id, value) {
    setMarks((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="aff">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Classify each host as healthy or infected using endpoint signals from Part II (LAB-PC-05 lineage).
      </p>
      <div className="grid">
        {HOSTS.map((h) => (
          <div key={h.id} className={`card ${marks[h.id] || ""}`}>
            <div className="mono name">{h.name}</div>
            <div className="actions">
              <button
                type="button"
                className={`btn btn-sm ${marks[h.id] === "healthy" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => mark(h.id, "healthy")}
              >
                Healthy
              </button>
              <button
                type="button"
                className={`btn btn-sm ${marks[h.id] === "infected" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => mark(h.id, "infected")}
              >
                Infected
              </button>
            </div>
            {marks[h.id] && marks[h.id] !== h.truth ? (
              <p className="mono bad">Re-check telemetry for this host.</p>
            ) : null}
            {marks[h.id] === h.truth ? (
              <p className="mono ok">Classification confirmed.</p>
            ) : null}
          </div>
        ))}
      </div>
      {complete ? (
        <p className="mono flag-line">Infected set identified · BLACKOUT{"{"}containment_ready{"}"}</p>
      ) : (
        <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.88rem" }}>
          Hint in UI: three hosts show payload artefacts; two remain clean.
        </p>
      )}
      <style>{`
        .aff .grid { display:grid; gap:.65rem; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
        .aff .card {
          border:1px solid var(--border); border-radius:12px; padding:.85rem;
          background:rgba(255,255,255,.02);
        }
        .aff .card.infected { border-color:rgba(224,17,54,.45); }
        .aff .card.healthy { border-color:rgba(34,197,94,.35); }
        .aff .name { color:var(--red-bright); margin-bottom:.55rem; }
        .aff .actions { display:flex; flex-wrap:wrap; gap:.4rem; }
        .aff .ok { color:#86efac; font-size:.75rem; margin-top:.5rem; }
        .aff .bad { color:var(--red-bright); font-size:.75rem; margin-top:.5rem; }
        .aff .flag-line {
          margin-top:1rem; padding:.75rem .85rem; border-radius:10px;
          border:1px solid rgba(34,197,94,.4); background:rgba(34,197,94,.08); color:#86efac;
        }
      `}</style>
    </div>
  );
}
