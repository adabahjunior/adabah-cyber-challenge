export default function ScoreDisplay({ score, max = 100, visible }) {
  if (!visible) return null;
  return (
    <section className="glass glass-red reveal score-display">
      <p className="eyebrow">Mission completed</p>
      <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>MISSION COMPLETED</h2>
      <p className="muted" style={{ marginTop: "0.5rem" }}>
        Score earned
      </p>
      <div
        className="mono"
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: "var(--red-bright)",
          textShadow: "0 0 24px var(--red-glow)",
          marginTop: "0.25rem",
        }}
      >
        {score}/{max}
      </div>
      <style>{`
        .score-display { padding: 1.4rem 1.4rem; text-align: center; margin-top: 1.25rem; }
      `}</style>
    </section>
  );
}
