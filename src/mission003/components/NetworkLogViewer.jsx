const LOGS = [
  { t: "02:11", line: "192.168.1.20 connected to LAB-SWITCH-01" },
  { t: "02:12", line: "192.168.1.32 requested login on FILE-SERVER-A" },
  { t: "02:13", line: "STAFF-PC-14 heartbeat OK" },
  { t: "02:14", line: "Unknown device detected · source 192.168.1.88" },
  { t: "02:15", line: "Connection established 192.168.1.88 → 192.168.1.32" },
  { t: "02:16", line: "Data transfer completed (2.4 MB) · ACC{log_hunter}" },
  { t: "02:17", line: "Unknown device disconnected" },
  { t: "02:18", line: "Monitoring alert escalated to SOC channel #night-watch" },
];

export default function NetworkLogViewer() {
  return (
    <div className="log-viewer">
      <div className="log-bar">
        <span className="mono">netmon / recovered_session_0214.log</span>
        <span className="badge badge-red">ALERT WINDOW</span>
      </div>
      <div className="log-body">
        {LOGS.map((row) => (
          <div key={row.t + row.line} className="log-row">
            <span className="ts">{row.t}</span>
            <code>{row.line}</code>
          </div>
        ))}
      </div>
      <p className="mono dim" style={{ fontSize: "0.75rem", marginTop: "0.65rem" }}>
        Tip: attackers leave traces in transfer summaries.
      </p>
      <style>{`
        .log-viewer { border:1px solid var(--border-red); border-radius:12px; overflow:hidden; background:#060606; }
        .log-bar {
          display:flex; justify-content:space-between; gap:.75rem; align-items:center; flex-wrap:wrap;
          padding:.55rem .8rem; border-bottom:1px solid var(--border); background:rgba(176,0,32,.12);
          font-size:.78rem; color:var(--muted);
        }
        .log-body { max-height:320px; overflow:auto; padding:.55rem .35rem; }
        .log-row {
          display:grid; grid-template-columns:64px 1fr; gap:.65rem; padding:.45rem .55rem;
          border-bottom:1px solid rgba(255,255,255,.04); font-family:var(--font-code); font-size:.84rem;
        }
        .log-row .ts { color:var(--red-bright); }
        .log-row code { color:var(--muted); white-space:pre-wrap; word-break:break-word; }
      `}</style>
    </div>
  );
}
