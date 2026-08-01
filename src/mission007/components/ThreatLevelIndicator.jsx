export default function ThreatLevelIndicator({ level = "ELEVATED" }) {
  const tones = {
    LOW: "#86efac",
    ELEVATED: "#fbbf24",
    HIGH: "#fb923c",
    CRITICAL: "var(--red-bright)",
  };
  const color = tones[level] || tones.ELEVATED;

  return (
    <div className="threat-lvl">
      <div className="mono dim label">Threat level</div>
      <div className="meter">
        <span className="pulse" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
        <strong className="mono" style={{ color }}>
          {level}
        </strong>
      </div>
      <style>{`
        .threat-lvl .label {
          font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:.35rem;
        }
        .threat-lvl .meter { display:flex; align-items:center; gap:.55rem; }
        .threat-lvl .pulse {
          width:10px; height:10px; border-radius:50%;
          animation:threatPulse 1.4s ease-in-out infinite;
        }
        @keyframes threatPulse {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.35); opacity:.55; }
        }
      `}</style>
    </div>
  );
}
