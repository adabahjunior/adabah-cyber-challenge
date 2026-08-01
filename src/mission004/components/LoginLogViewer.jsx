const LOGS = [
  { time: "09:10", user: "Michael", result: "Login Successful", tone: "ok" },
  { time: "09:11", user: "Michael", result: "Failed Password", tone: "fail" },
  { time: "09:12", user: "Admin", result: "Failed Password", tone: "fail" },
  {
    time: "09:13",
    user: "Admin",
    result: "Successful Login",
    tone: "warn",
    note: "Privilege escalation after failed attempts — review urgently.",
  },
  { time: "09:14", user: "Unknown User", result: "Login Failed", tone: "fail" },
  { time: "09:16", user: "sara.owusu", result: "Login Successful", tone: "ok" },
  { time: "09:18", user: "lab-service", result: "Failed Password", tone: "fail" },
  {
    time: "09:19",
    user: "lab-service",
    result: "Failed Password · residual token ACC{login_detective}",
    tone: "flag",
  },
  { time: "09:21", user: "Admin", result: "Session Token Issued", tone: "warn" },
  { time: "09:24", user: "guest-kiosk", result: "Login Failed", tone: "fail" },
];

export default function LoginLogViewer() {
  return (
    <div className="auth-logs">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Authentication gateway · UMaT-AUTH-01 · recovered crash dump
      </p>
      <div className="log-table">
        <div className="log-head mono">
          <span>Time</span>
          <span>Account</span>
          <span>Result</span>
        </div>
        {LOGS.map((row) => (
          <div key={`${row.time}-${row.user}-${row.result}`} className={`log-row ${row.tone}`}>
            <span className="mono">{row.time}</span>
            <span className="mono">{row.user}</span>
            <span>
              <span className="result">{row.result}</span>
              {row.note ? <span className="note">{row.note}</span> : null}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        .auth-logs .log-table { display:grid; gap:.35rem; }
        .auth-logs .log-head, .auth-logs .log-row {
          display:grid; grid-template-columns:4.5rem 8.5rem 1fr; gap:.75rem;
          padding:.65rem .75rem; border-radius:8px; align-items:start;
        }
        .auth-logs .log-head {
          border:1px solid var(--border); color:var(--dim); font-size:.68rem;
          letter-spacing:.08em; text-transform:uppercase;
        }
        .auth-logs .log-row {
          border:1px solid rgba(255,255,255,.06); background:rgba(255,255,255,.02);
          font-size:.9rem;
        }
        .auth-logs .log-row.ok { border-color:rgba(34,197,94,.25); }
        .auth-logs .log-row.fail { border-color:rgba(176,0,32,.35); }
        .auth-logs .log-row.warn { border-color:rgba(234,179,8,.35); background:rgba(234,179,8,.06); }
        .auth-logs .log-row.flag {
          border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.12);
          box-shadow:0 0 18px rgba(176,0,32,.18);
        }
        .auth-logs .result { display:block; font-family:var(--font-mono); font-size:.86rem; }
        .auth-logs .note { display:block; margin-top:.25rem; color:var(--muted); font-size:.82rem; }
        @media (max-width:640px) {
          .auth-logs .log-head, .auth-logs .log-row { grid-template-columns:1fr; gap:.2rem; }
        }
      `}</style>
    </div>
  );
}
