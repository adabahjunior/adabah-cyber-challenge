import { useEffect, useState } from "react";

export default function EvidenceCard({ evidence, notes, onNotesChange }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  return (
    <article className={`glass evidence-card ${open ? "open" : ""}`}>
      <div className="evidence-head">
        <div>
          <p className="eyebrow">Evidence {evidence.id}</p>
          <h3 className="mono" style={{ fontSize: "1rem" }}>
            {evidence.title}
          </h3>
        </div>
        <div className="row">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOpen((v) => !v)}>
            {open ? "Close evidence" : "Open evidence"}
          </button>
          {open && (
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => setZoomed((z) => !z)}>
              {zoomed ? "Reset zoom" : "Zoom"}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className={`evidence-body ${zoomed ? "zoomed" : ""}`}>
          {evidence.type === "email" && <FakeEmail />}
          {evidence.type === "website" && <FakeWebsite />}
          {evidence.type === "headers" && <FakeHeaders />}

          <div className="field" style={{ marginTop: "1rem", marginBottom: 0 }}>
            <label>Investigation notes</label>
            <textarea
              value={notes || ""}
              onChange={(e) => onNotesChange?.(e.target.value)}
              placeholder="Write what looks wrong here…"
            />
          </div>
        </div>
      )}

      <style>{`
        .evidence-card { padding: 1.1rem 1.15rem; transition: border-color .25s var(--ease), transform .25s var(--ease); }
        .evidence-card.open { border-color: var(--border-red); box-shadow: 0 0 28px rgba(176,0,32,.2); }
        .evidence-head { display:flex; flex-wrap:wrap; justify-content:space-between; gap:.75rem; align-items:center; }
        .evidence-body { margin-top: 1rem; transform-origin: top center; transition: transform .25s var(--ease); }
        .evidence-body.zoomed { transform: scale(1.04); }
      `}</style>
    </article>
  );
}

function FakeEmail() {
  return (
    <div className="fake-ui email-ui">
      <div className="email-bar">INBOX · suspicious message</div>
      <div className="email-meta">
        <div><span>From:</span> UMaT IT Support &lt;support@umat-security-help.com&gt;</div>
        <div><span>Subject:</span> URGENT: Verify Your Student Account</div>
      </div>
      <div className="email-body">
        <p>Dear Student,</p>
        <p>Your student portal will be suspended within 24 hours.</p>
        <p>Click below to verify your account:</p>
        <p className="phish-link">www.umat-student-verification.com</p>
        <p>Failure to verify will result in account restriction.</p>
        <p>IT Department</p>
      </div>
      <style>{`
        .fake-ui { border:1px solid var(--border-red); border-radius:12px; overflow:hidden; background:#070707; }
        .email-bar { padding:.55rem .85rem; font-family:var(--font-mono); font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; background:rgba(176,0,32,.15); color:var(--red-bright); border-bottom:1px solid var(--border-red); }
        .email-meta { padding:.85rem; border-bottom:1px solid var(--border); font-family:var(--font-mono); font-size:.86rem; display:grid; gap:.35rem; }
        .email-meta span { color:var(--dim); }
        .email-body { padding:1rem .85rem 1.1rem; color:var(--muted); }
        .phish-link { color:var(--red-bright); text-decoration:underline; font-family:var(--font-code); }
      `}</style>
    </div>
  );
}

function FakeWebsite() {
  return (
    <div className="fake-ui web-ui">
      <div className="web-chrome">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="url">http://www.umat-student-verification.com/login</span>
      </div>
      <div className="web-body">
        <div className="warn-strip">⚠ Connection is not secure · domain does not match umat.edu.gh</div>
        <h4>University of Mines and Technology</h4>
        <p className="mono" style={{ color: "var(--dim)", fontSize: "0.8rem" }}>Student Login</p>
        <div className="fake-form">
          <label>Username</label>
          <div className="fake-input" />
          <label>Password</label>
          <div className="fake-input" />
          <button type="button" className="fake-submit">Verify Account</button>
        </div>
        <p className="mono" style={{ fontSize: "0.72rem", color: "var(--red-bright)", marginTop: "0.85rem" }}>
          Look closely: urgent verify button, odd domain, asks for password.
        </p>
      </div>
      <style>{`
        .web-chrome { display:flex; align-items:center; gap:.4rem; padding:.55rem .75rem; border-bottom:1px solid var(--border); background:#0b0b0b; }
        .web-chrome .dot { width:8px; height:8px; border-radius:50%; background:#3f3f46; }
        .web-chrome .dot:first-child { background:var(--red-bright); }
        .web-chrome .url { margin-left:.5rem; font-family:var(--font-code); font-size:.72rem; color:#fca5a5; background:rgba(176,0,32,.12); padding:.25rem .55rem; border-radius:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%; }
        .web-body { padding:1.1rem; }
        .web-body h4 { font-family:var(--font-display); font-size:1rem; margin-bottom:.35rem; }
        .warn-strip { margin-bottom:.9rem; padding:.45rem .65rem; border:1px solid rgba(234,179,8,.35); background:rgba(234,179,8,.08); color:#fde047; font-family:var(--font-mono); font-size:.72rem; border-radius:8px; }
        .fake-form { margin-top:.85rem; display:grid; gap:.35rem; max-width:320px; }
        .fake-form label { font-family:var(--font-mono); font-size:.72rem; color:var(--dim); }
        .fake-input { height:40px; border:1px solid rgba(255,255,255,.14); border-radius:8px; background:#101010; }
        .fake-submit { margin-top:.45rem; height:42px; border:0; border-radius:8px; background:var(--red); color:#fff; font-family:var(--font-display); font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; }
      `}</style>
    </div>
  );
}

function FakeHeaders() {
  const rows = [
    ["From", "support@umat-security-help.com"],
    ["Reply-To", "recover.account@gmail.com"],
    ["Authentication", "Failed"],
    ["Server", "Unknown external server"],
  ];
  return (
    <div className="fake-ui headers-ui">
      <div className="email-bar">RAW HEADER INSPECTOR</div>
      <div className="headers-grid">
        {rows.map(([k, v]) => (
          <div key={k} className="header-row">
            <span>{k}</span>
            <code>{v}</code>
          </div>
        ))}
      </div>
      <style>{`
        .headers-grid { padding:.85rem; display:grid; gap:.55rem; }
        .header-row { display:grid; grid-template-columns:140px 1fr; gap:.75rem; padding:.65rem .7rem; border:1px solid var(--border); border-radius:8px; background:rgba(255,255,255,.02); }
        .header-row span { font-family:var(--font-mono); font-size:.72rem; color:var(--dim); text-transform:uppercase; letter-spacing:.06em; }
        .header-row code { font-family:var(--font-code); font-size:.86rem; color:var(--red-bright); word-break:break-all; }
        @media (max-width:560px){ .header-row { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}

export function TypewriterCase({ text, active }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    let i = 0;
    setOut("");
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text, active]);

  return (
    <p className="muted" style={{ minHeight: "6.5em" }}>
      {out}
      {active && out.length < text.length ? <span className="cursor-blink" /> : null}
    </p>
  );
}
