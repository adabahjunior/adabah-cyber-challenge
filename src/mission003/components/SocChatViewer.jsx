const MESSAGES = [
  { user: "Ama · Tier1", time: "02:15", text: "Netmon just lit up. Unknown host talking to student endpoints." },
  { user: "Kojo · Tier2", time: "02:16", text: "Confirming 192.168.1.88 is not in DHCP reservations." },
  { user: "Efua · IR", time: "02:17", text: "Do not reboot switches yet. Preserve the session table." },
  { user: "Ama · Tier1", time: "02:18", text: "Chat note for handoff — ACC{soc_detective} — keep this quiet until we isolate." },
  { user: "Kojo · Tier2", time: "02:19", text: "Unknown device dropped. We still have the transfer log." },
  { user: "Efua · IR", time: "02:20", text: "Draft the report. Identify the device and recommend containment." },
];

export default function SocChatViewer() {
  return (
    <div className="chat-viewer">
      <div className="chat-bar">
        <span className="mono">#night-watch · SOC internal</span>
        <span className="badge badge-red">RECOVERED</span>
      </div>
      <div className="chat-body">
        {MESSAGES.map((m, i) => (
          <div key={i} className="chat-msg">
            <div className="chat-meta">
              <strong>{m.user}</strong>
              <span className="mono dim">{m.time}</span>
            </div>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <style>{`
        .chat-viewer { border:1px solid var(--border-red); border-radius:12px; overflow:hidden; background:#070707; }
        .chat-bar {
          display:flex; justify-content:space-between; gap:.75rem; align-items:center; flex-wrap:wrap;
          padding:.55rem .8rem; border-bottom:1px solid var(--border); background:rgba(176,0,32,.1);
          font-size:.78rem; color:var(--muted);
        }
        .chat-body { display:grid; gap:.65rem; padding:.85rem; max-height:340px; overflow:auto; }
        .chat-msg { padding:.7rem .8rem; border:1px solid var(--border); border-radius:10px; background:rgba(255,255,255,.02); }
        .chat-meta { display:flex; justify-content:space-between; gap:.75rem; margin-bottom:.35rem; font-size:.82rem; }
        .chat-msg p { margin:0; color:var(--muted); line-height:1.5; }
      `}</style>
    </div>
  );
}
