import { useState } from "react";

const DEVICES = [
  {
    id: "d1",
    name: "UMaT-Core-Router",
    ip: "192.168.1.1",
    mac: "00:1A:2B:3C:4D:01",
    os: "RouterOS 7.x",
    status: "Trusted",
  },
  {
    id: "d2",
    name: "LAB-SWITCH-01",
    ip: "192.168.1.2",
    mac: "00:1A:2B:3C:4D:02",
    os: "Switch firmware",
    status: "Trusted",
  },
  {
    id: "d3",
    name: "FILE-SERVER-A",
    ip: "192.168.1.10",
    mac: "00:1A:2B:3C:4D:10",
    os: "Ubuntu Server 22.04",
    status: "Trusted",
  },
  {
    id: "d4",
    name: "STAFF-PC-14",
    ip: "192.168.1.20",
    mac: "A4:C3:F0:11:22:33",
    os: "Windows 11",
    status: "Trusted",
  },
  {
    id: "d5",
    name: "Student-PC-07",
    ip: "192.168.1.32",
    mac: "B8:27:EB:44:55:66",
    os: "Windows 10",
    status: "Trusted",
  },
  {
    id: "d6",
    name: "Unknown Device",
    ip: "192.168.1.88",
    mac: "DE:AD:BE:EF:02:14",
    os: "Unrecognized",
    status: "Suspicious",
    flag: "ACC{device_found}",
  },
];

export default function DeviceInspector() {
  const [selected, setSelected] = useState(null);
  const device = DEVICES.find((d) => d.id === selected);

  return (
    <div className="device-inspector">
      <div className="device-list">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`device-row ${selected === d.id ? "active" : ""} ${d.flag ? "suspect" : ""}`}
            onClick={() => setSelected(d.id)}
          >
            <span className="mono">{d.name}</span>
            <span className={`badge ${d.status === "Suspicious" ? "badge-red" : "badge-green"}`}>{d.status}</span>
          </button>
        ))}
      </div>
      <div className="device-detail glass">
        <p className="eyebrow">Selected asset</p>
        {device ? (
          <div className="meta-grid">
            <div><span>Device Name</span><code>{device.name}</code></div>
            <div><span>IP Address</span><code>{device.ip}</code></div>
            <div><span>MAC Address</span><code>{device.mac}</code></div>
            <div><span>Operating System</span><code>{device.os}</code></div>
            <div><span>Status</span><code>{device.status}</code></div>
            {device.flag ? (
              <div><span>Forensic note</span><code className="flag-glow">{device.flag}</code></div>
            ) : (
              <div><span>Forensic note</span><code>No anomaly recorded</code></div>
            )}
          </div>
        ) : (
          <p className="muted">Select a device to inspect identity fields.</p>
        )}
      </div>
      <style>{`
        .device-inspector { display:grid; gap:.85rem; }
        .device-list { display:grid; gap:.45rem; }
        .device-row {
          display:flex; justify-content:space-between; align-items:center; gap:.75rem;
          padding:.7rem .8rem; border-radius:10px; border:1px solid var(--border);
          background:rgba(255,255,255,.02); color:inherit; cursor:pointer; text-align:left;
        }
        .device-row.active, .device-row.suspect.active { border-color:var(--border-red); }
        .device-row.suspect { border-color: rgba(176,0,32,.35); }
        .device-detail { padding:1rem; }
        .meta-grid { display:grid; gap:.45rem; margin-top:.55rem; }
        .meta-grid > div {
          display:grid; grid-template-columns:140px 1fr; gap:.6rem; padding:.55rem .65rem;
          border:1px solid var(--border); border-radius:8px; background:rgba(255,255,255,.02);
        }
        .meta-grid span { font-family:var(--font-mono); font-size:.7rem; color:var(--dim); text-transform:uppercase; }
        .meta-grid code { font-family:var(--font-code); font-size:.86rem; word-break:break-all; }
        .flag-glow { color: var(--red-bright) !important; }
        @media (max-width:560px){ .meta-grid > div { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
