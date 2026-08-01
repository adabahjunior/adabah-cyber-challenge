const BEHAVIOURS = [
  { id: "b1", title: "Creates unknown files", detail: "Drops %TEMP%\\ntk_cache.tmp and a hidden .dat sidecar." },
  { id: "b2", title: "Modifies startup entries", detail: "Adds Run key pointing at the masquerading updater path." },
  {
    id: "b3",
    title: "Attempts repeated network connections",
    detail: "Beacons to 185.243.112.44 every ~90s. Observation ID: BLACKOUT{behavior_analysis}",
    flagged: true,
  },
  { id: "b4", title: "Renames documents", detail: "Appends .locked to Office files in user Documents." },
  { id: "b5", title: "Creates scheduled task", detail: "Registers NTK-HelperRefresh to re-run after reboot." },
];

export default function BehaviourReport() {
  return (
    <div className="beh">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Detonation lab output (text simulation only). No binaries were executed on participant devices.
      </p>
      <div className="grid">
        {BEHAVIOURS.map((b) => (
          <article key={b.id} className={`card ${b.flagged ? "flag" : ""}`}>
            <p className="eyebrow">{b.id.toUpperCase()}</p>
            <h4>{b.title}</h4>
            <p className="mono detail">{b.detail}</p>
          </article>
        ))}
      </div>
      <style>{`
        .beh .grid { display:grid; gap:.65rem; }
        .beh .card {
          border:1px solid var(--border); border-radius:12px; padding:.85rem .95rem;
          background:rgba(255,255,255,.02);
        }
        .beh .card.flag {
          border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.12);
          box-shadow:0 0 18px rgba(176,0,32,.15);
        }
        .beh h4 { margin:.25rem 0 .45rem; font-size:.98rem; }
        .beh .detail { color:var(--muted); font-size:.84rem; line-height:1.5; }
        .beh .card.flag .detail { color:#fecaca; }
      `}</style>
    </div>
  );
}
