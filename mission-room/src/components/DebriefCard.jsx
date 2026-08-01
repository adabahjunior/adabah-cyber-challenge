export default function DebriefCard({ skills, visible }) {
  if (!visible) return null;
  return (
    <section className="glass reveal" style={{ padding: "1.35rem 1.4rem", marginTop: "1rem" }}>
      <p className="eyebrow">Learning debrief</p>
      <h2 style={{ fontSize: "1.2rem" }}>YOU HAVE COMPLETED MISSION 001</h2>
      <p className="muted" style={{ margin: "0.55rem 0 1rem" }}>
        Skills unlocked:
      </p>
      <ul className="skills">
        {skills.map((s) => (
          <li key={s}>
            <span>✓</span> {s}
          </li>
        ))}
      </ul>
      <div className="row" style={{ marginTop: "1.15rem" }}>
        <a className="btn btn-primary" href="../dashboard.html">
          Back to dashboard
        </a>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Review case file
        </button>
      </div>
      <style>{`
        .skills { list-style:none; margin:0; padding:0; display:grid; gap:.45rem; }
        .skills li { font-family:var(--font-mono); padding:.65rem .8rem; border:1px solid var(--border); border-radius:10px; background:rgba(255,255,255,.02); }
        .skills span { color: #22c55e; margin-right:.4rem; }
      `}</style>
    </section>
  );
}
