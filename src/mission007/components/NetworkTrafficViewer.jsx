import { useMemo, useState } from "react";

const ROWS = [
  { time: "08:02:11", src: "10.12.4.18", dst: "10.12.1.10", proto: "HTTPS", status: "OK" },
  { time: "08:02:44", src: "10.12.8.55", dst: "10.12.1.40", proto: "SMB", status: "OK" },
  {
    time: "08:03:09",
    src: "10.12.8.55",
    dst: "185.243.112.44",
    proto: "HTTPS",
    status: "BEACON",
    note: "Suspected C2 · residual BLACKOUT{network_trail}",
    flagged: true,
  },
  { time: "08:03:31", src: "10.12.2.7", dst: "10.12.1.5", proto: "DNS", status: "OK" },
  { time: "08:04:02", src: "10.12.8.55", dst: "185.243.112.44", proto: "HTTPS", status: "BEACON" },
  { time: "08:04:18", src: "10.12.3.22", dst: "10.12.9.2", proto: "RDP", status: "DENIED" },
  { time: "08:05:01", src: "10.12.1.40", dst: "10.12.8.55", proto: "WinRM", status: "OK" },
];

export default function NetworkTrafficViewer() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    if (filter === "ALL") return ROWS;
    return ROWS.filter((r) => r.status === filter);
  }, [filter]);

  return (
    <div className="nt-view">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.65rem" }}>
        <p className="muted" style={{ margin: 0 }}>
          Campus SPAN feed · filter by status to isolate anomalies.
        </p>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="OK">OK</option>
          <option value="BEACON">BEACON</option>
          <option value="DENIED">DENIED</option>
        </select>
      </div>
      <div className="table">
        <div className="head mono">
          <span>Time</span>
          <span>Source</span>
          <span>Destination</span>
          <span>Proto</span>
          <span>Status</span>
        </div>
        {rows.map((r, i) => (
          <button
            key={`${r.time}-${i}`}
            type="button"
            className={`rowline ${r.flagged ? "flag" : ""} ${selected === i ? "on" : ""}`}
            onClick={() => setSelected(i)}
          >
            <span className="mono">{r.time}</span>
            <span className="mono">{r.src}</span>
            <span className="mono">{r.dst}</span>
            <span className="mono">{r.proto}</span>
            <span className={`st ${r.status.toLowerCase()}`}>{r.status}</span>
          </button>
        ))}
      </div>
      {selected !== null && rows[selected]?.note ? (
        <p className="mono detail flag">{rows[selected].note}</p>
      ) : (
        <p className="muted tip">Select a row to expand session notes.</p>
      )}
      <style>{`
        .nt-view select {
          background:#070707; color:var(--text); border:1px solid var(--border); border-radius:8px;
          padding:.4rem .55rem; font-family:var(--font-mono); font-size:.78rem;
        }
        .nt-view .table { border:1px solid var(--border); border-radius:12px; overflow:hidden; }
        .nt-view .head, .nt-view .rowline {
          display:grid; grid-template-columns:5.5rem 1fr 1fr 4rem 4.5rem; gap:.5rem;
          padding:.55rem .7rem; text-align:left; width:100%;
        }
        .nt-view .head {
          background:#0c0c0c; color:var(--dim); font-size:.65rem; letter-spacing:.08em; text-transform:uppercase;
          border-bottom:1px solid var(--border);
        }
        .nt-view .rowline {
          background:transparent; border:0; border-bottom:1px solid rgba(255,255,255,.05);
          color:var(--muted); cursor:pointer; font-size:.82rem;
        }
        .nt-view .rowline:last-child { border-bottom:0; }
        .nt-view .rowline.on, .nt-view .rowline:hover { background:rgba(176,0,32,.1); color:#fff; }
        .nt-view .rowline.flag { box-shadow:inset 3px 0 0 var(--red-bright); }
        .nt-view .st.beacon { color:var(--red-bright); font-family:var(--font-mono); font-size:.72rem; }
        .nt-view .st.denied { color:#fbbf24; font-family:var(--font-mono); font-size:.72rem; }
        .nt-view .st.ok { color:#86efac; font-family:var(--font-mono); font-size:.72rem; }
        .nt-view .detail {
          margin-top:.75rem; padding:.75rem; border-radius:10px; border:1px solid rgba(224,17,54,.45);
          background:rgba(176,0,32,.12); color:#fecaca; font-size:.85rem;
        }
        .nt-view .tip { margin-top:.65rem; font-size:.85rem; }
        @media (max-width:720px) {
          .nt-view .head, .nt-view .rowline { grid-template-columns:1fr 1fr; }
          .nt-view .head span:nth-child(n+3), .nt-view .rowline span:nth-child(n+3) { display:none; }
        }
      `}</style>
    </div>
  );
}
