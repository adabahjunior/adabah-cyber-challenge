import { useState } from "react";

const USERS = [
  {
    id: "u1",
    account: "s.owusu",
    events: [
      { time: "07:55", place: "Tarkwa campus", note: "Interactive login · LAB-PC-01" },
      { time: "08:10", place: "Tarkwa campus", note: "VPN idle" },
    ],
  },
  {
    id: "u2",
    account: "j.mensah",
    events: [
      { time: "03:14", place: "Lagos (NG)", note: "Remote OWA login — no travel ticket on file" },
      { time: "07:58", place: "Tarkwa campus", note: "Interactive login · LAB-PC-05" },
      {
        time: "08:03",
        place: "Tarkwa campus",
        note: "Impossible travel pattern flagged · BLACKOUT{user_trace}",
        flagged: true,
      },
    ],
    suspicious: true,
  },
  {
    id: "u3",
    account: "ict.director",
    events: [
      { time: "07:44", place: "Tarkwa campus", note: "Sent priority IR email" },
      { time: "08:01", place: "Tarkwa campus", note: "MFA challenge passed" },
    ],
  },
];

export default function UserTimelineViewer() {
  const [open, setOpen] = useState("u2");
  const active = USERS.find((u) => u.id === open);

  return (
    <div className="user-tl">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Compare login geography and timing. Impossible travel often marks account takeover.
      </p>
      <div className="accounts">
        {USERS.map((u) => (
          <button
            key={u.id}
            type="button"
            className={`${open === u.id ? "on" : ""} ${u.suspicious ? "sus" : ""}`}
            onClick={() => setOpen(u.id)}
          >
            <span className="mono">{u.account}</span>
            {u.suspicious ? <span className="badge badge-red">ANOMALY</span> : null}
          </button>
        ))}
      </div>
      {active ? (
        <div className="events">
          {active.events.map((ev, i) => (
            <div key={`${ev.time}-${i}`} className={`ev ${ev.flagged ? "flag" : ""}`}>
              <span className="mono time">{ev.time}</span>
              <div>
                <div className="place">{ev.place}</div>
                <div className="note mono">{ev.note}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <style>{`
        .user-tl .accounts { display:flex; flex-wrap:wrap; gap:.45rem; margin-bottom:.85rem; }
        .user-tl .accounts button {
          display:flex; align-items:center; gap:.45rem; background:#070707; border:1px solid var(--border);
          border-radius:999px; padding:.4rem .75rem; color:var(--muted); cursor:pointer;
        }
        .user-tl .accounts button.on { border-color:rgba(224,17,54,.55); color:#fff; }
        .user-tl .accounts button.sus { border-color:rgba(224,17,54,.35); }
        .user-tl .events { display:grid; gap:.55rem; }
        .user-tl .ev {
          display:grid; grid-template-columns:3.5rem 1fr; gap:.75rem; padding:.75rem;
          border:1px solid var(--border); border-radius:10px; background:rgba(255,255,255,.02);
        }
        .user-tl .ev.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.12); }
        .user-tl .time { color:var(--red-bright); }
        .user-tl .place { font-weight:600; margin-bottom:.25rem; }
        .user-tl .note { font-size:.82rem; color:var(--muted); }
        .user-tl .ev.flag .note { color:#fecaca; }
      `}</style>
    </div>
  );
}
