const LOGS = [
  { time: "08:01:12", action: "ALLOW", rule: "LAN-OUT-WEB", detail: "10.12.2.7 → 8.8.8.8:53 DNS" },
  { time: "08:02:40", action: "DENY", rule: "BLOCK-RDP-EXT", detail: "185.99.10.2 → 10.12.3.22:3389" },
  { time: "08:03:05", action: "ALLOW", rule: "LAN-OUT-WEB", detail: "10.12.8.55 → 185.243.112.44:443 · note BLACKOUT{firewall_watch}" },
  { time: "08:03:48", action: "DENY", rule: "GEO-BLOCK", detail: "Unknown ASN → UTC-AUTH-02:443" },
  { time: "08:04:22", action: "ALLOW", rule: "MAIL-RELAY", detail: "UTC-MAIL-01 → mx.partner.edu:25" },
  { time: "08:05:10", action: "DENY", rule: "BLOCK-SMB-WAN", detail: "External → 10.12.1.40:445" },
];

export default function FirewallLogViewer() {
  return (
    <div className="fw-logs">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Edge firewall · UTC-FW-01. Correlate ALLOW lines to beacon destinations from network traffic.
      </p>
      <div className="wrap">
        {LOGS.map((l, i) => (
          <div key={`${l.time}-${i}`} className={`line ${l.action.toLowerCase()} ${l.detail.includes("BLACKOUT{") ? "flag" : ""}`}>
            <span className="mono time">{l.time}</span>
            <span className={`mono act`}>{l.action}</span>
            <span className="mono rule">{l.rule}</span>
            <span className="detail">{l.detail}</span>
          </div>
        ))}
      </div>
      <style>{`
        .fw-logs .wrap { border:1px solid var(--border); border-radius:12px; overflow:hidden; background:#040404; }
        .fw-logs .line {
          display:grid; grid-template-columns:5rem 4rem 8rem 1fr; gap:.55rem; padding:.55rem .75rem;
          border-bottom:1px solid rgba(255,255,255,.05); font-size:.8rem; color:var(--muted);
        }
        .fw-logs .line:last-child { border-bottom:0; }
        .fw-logs .line.flag { background:rgba(176,0,32,.14); color:#fecaca; }
        .fw-logs .act { font-weight:600; }
        .fw-logs .line.allow .act { color:#86efac; }
        .fw-logs .line.deny .act { color:var(--red-bright); }
        .fw-logs .rule { color:var(--dim); }
        @media (max-width:700px) {
          .fw-logs .line { grid-template-columns:1fr; gap:.2rem; }
        }
      `}</style>
    </div>
  );
}
