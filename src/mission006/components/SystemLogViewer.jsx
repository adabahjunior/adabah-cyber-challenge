const LOGS = [
  { time: "07:39", level: "INFO", msg: "User login · account=registry.clerk · src=10.12.4.18" },
  { time: "07:40", level: "WARN", msg: "Failed authentication · account=svc-backup · attempts=3" },
  { time: "07:41", level: "ALERT", msg: "Unknown process started · name=ntk-helper.exe · parent=services" },
  { time: "07:42", level: "CRIT", msg: "Database disconnected · cluster=UTC-DB-01 · clients dropped" },
  { time: "07:43", level: "ALERT", msg: "Alert generated · SOC rule IR-BLACKOUT-1 · token ACC{log_recovered}" },
  { time: "07:43", level: "INFO", msg: "ACRT channel opened · room=#incident-blackout" },
];

export default function SystemLogViewer() {
  return (
    <div className="sys-logs">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Host + auth events recovered from UTC-LOG-COLLECTOR before the primary buffer rotated.
      </p>
      <div className="log-wrap">
        {LOGS.map((row, i) => (
          <div key={`${row.time}-${i}`} className={`line ${row.level.toLowerCase()} ${row.msg.includes("ACC{") ? "flag" : ""}`}>
            <span className="mono time">{row.time}</span>
            <span className={`mono lvl`}>{row.level}</span>
            <span className="msg">{row.msg}</span>
          </div>
        ))}
      </div>
      <style>{`
        .log-wrap {
          border:1px solid var(--border); border-radius:12px; overflow:hidden; background:#040404;
          font-family:var(--font-mono); font-size:.8rem;
        }
        .sys-logs .line {
          display:grid; grid-template-columns:3.4rem 3.6rem 1fr; gap:.65rem;
          padding:.55rem .75rem; border-bottom:1px solid rgba(255,255,255,.05); color:var(--muted);
        }
        .sys-logs .line:last-child { border-bottom:0; }
        .sys-logs .line.flag { background:rgba(176,0,32,.14); color:#fecaca; }
        .sys-logs .lvl { color:var(--dim); }
        .sys-logs .line.crit .lvl, .sys-logs .line.alert .lvl { color:var(--red-bright); }
        .sys-logs .line.warn .lvl { color:#fbbf24; }
        @media (max-width:640px) {
          .sys-logs .line { grid-template-columns:1fr; gap:.15rem; }
        }
      `}</style>
    </div>
  );
}
