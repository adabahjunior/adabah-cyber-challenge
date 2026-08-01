import { useEffect, useState } from "react";

function formatTime(sec) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function MissionHeader({
  mission,
  started,
  remaining,
  onStart,
  progress,
}) {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="glass glass-red reveal" style={{ padding: "1.35rem 1.4rem" }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <p className="eyebrow">{mission.shortTitle}</p>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}>{mission.title}</h1>
          <div className="row" style={{ marginTop: "0.65rem" }}>
            <span className="badge badge-red">{mission.category}</span>
            <span className="badge">{mission.difficulty}</span>
            <span className="badge">{mission.points} PTS</span>
          </div>
        </div>
        {!started ? (
          <button className="btn btn-primary" type="button" onClick={onStart}>
            {mission.startLabel || "Start Investigation"}
          </button>
        ) : (
          <span className={`badge ${remaining < 300 ? "badge-red" : "badge-green"}`}>
            LIVE
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "0.75rem",
        }}
        className="header-meta"
      >
        <Meta label="Mission Status" value={started ? "ACTIVE" : "STANDBY"} accent={started && pulse} />
        <Meta label="Case Number" value={mission.caseNumber} />
        <Meta label="Category" value={String(mission.category || "").toUpperCase()} />
        <Meta label="Points" value={String(mission.points)} />
        <Meta label="Time Remaining" value={formatTime(remaining)} accent={started} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <span className="mono" style={{ fontSize: "0.72rem", color: "var(--dim)" }}>
            INVESTIGATION PROGRESS
          </span>
          <span className="mono" style={{ fontSize: "0.72rem" }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .header-meta { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </header>
  );
}

function Meta({ label, value, accent }) {
  return (
    <div
      className="glass"
      style={{
        padding: "0.75rem 0.85rem",
        borderColor: accent ? "var(--border-red)" : undefined,
        boxShadow: accent ? "0 0 16px rgba(176,0,32,0.25)" : undefined,
      }}
    >
      <div className="mono" style={{ fontSize: "0.65rem", color: "var(--dim)", letterSpacing: "0.1em" }}>
        {label.toUpperCase()}
      </div>
      <div
        className="mono"
        style={{
          marginTop: "0.3rem",
          fontSize: "0.95rem",
          color: accent ? "var(--red-bright)" : "var(--white)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
