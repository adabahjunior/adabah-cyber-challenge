const MSGS = [
  { t: "02:11", who: "ghost", text: "DB is dark. Move to next campus zone." },
  { t: "02:14", who: "relay", text: "LAB-PC-05 still beaconing. Keep NTK-Helper quiet." },
  { t: "02:18", who: "ghost", text: "ACRT woke up. Wipe staging if they hit auth." },
  {
    t: "02:21",
    who: "relay",
    text: "Leaving the encrypted drop. If they open it: BLACKOUT{final_trace}",
    flagged: true,
  },
  { t: "02:22", who: "ghost", text: "Going dark. No more chatter." },
];

export default function CommunicationLog() {
  return (
    <div className="comms">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Intercepted C2 chat channel · reconstructed from memory dumps (simulation).
      </p>
      <div className="thread">
        {MSGS.map((m, i) => (
          <div key={`${m.t}-${i}`} className={`bubble ${m.who} ${m.flagged ? "flag" : ""}`}>
            <div className="meta mono">
              <span>{m.who}</span>
              <span>{m.t}</span>
            </div>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <style>{`
        .comms .thread { display:grid; gap:.65rem; }
        .comms .bubble {
          max-width:92%; padding:.75rem .85rem; border-radius:12px; border:1px solid var(--border);
          background:rgba(255,255,255,.03);
        }
        .comms .bubble.relay { margin-left:auto; background:rgba(176,0,32,.08); }
        .comms .bubble.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.14); }
        .comms .meta { display:flex; justify-content:space-between; gap:.75rem; color:var(--dim); font-size:.72rem; margin-bottom:.35rem; }
        .comms p { margin:0; color:var(--muted); font-size:.9rem; line-height:1.45; }
        .comms .flag p { color:#fecaca; font-family:var(--font-mono); font-size:.84rem; }
      `}</style>
    </div>
  );
}
