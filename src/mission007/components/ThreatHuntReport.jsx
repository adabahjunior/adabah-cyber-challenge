import { useState } from "react";

export default function ThreatHuntReport({ config, locked, solved, onSolved }) {
  const [host, setHost] = useState("");
  const [user, setUser] = useState("");
  const [ioc, setIoc] = useState("");
  const [isolate, setIsolate] = useState("");
  const [feedback, setFeedback] = useState("");

  function countKeywords(text, list) {
    const lower = String(text || "").toLowerCase();
    return list.filter((k) => lower.includes(k)).length;
  }

  function submit(e) {
    e.preventDefault();
    if (locked || solved) return;
    const hostOk = host === config.correctHost;
    const userOk = user.trim().length >= 8 && countKeywords(user, config.userKeywords) >= 1;
    const iocOk = ioc.trim().length >= 8 && countKeywords(ioc, config.iocKeywords) >= 1;
    const isolateOk = isolate.trim().length >= 15 && countKeywords(isolate, config.isolateKeywords) >= 2;
    if (hostOk && userOk && iocOk && isolateOk) {
      setFeedback("Threat hunt report accepted. Containment flag unlocked.");
      onSolved?.();
    } else {
      setFeedback("Report incomplete. Re-check host, user, IOC, and isolation priority.");
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Threat hunt report</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Contain the actor</h3>
      {locked && !solved ? (
        <p className="muted">Recover all five evidence flags to unlock this report.</p>
      ) : (
        <>
          <div className="field">
            <label>1. Which computer was compromised?</label>
            <select value={host} onChange={(e) => setHost(e.target.value)} disabled={solved} required>
              <option value="">Select host</option>
              {config.hostOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>2. Which user account appears suspicious?</label>
            <textarea
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={solved}
              rows={2}
              placeholder="Name the account and why (travel / timing)…"
              required
            />
          </div>
          <div className="field">
            <label>3. Which indicator best identifies the attacker?</label>
            <textarea
              value={ioc}
              onChange={(e) => setIoc(e.target.value)}
              disabled={solved}
              rows={2}
              placeholder="IP, domain, hash, or other IOC…"
              required
            />
          </div>
          <div className="field">
            <label>4. What should be isolated immediately?</label>
            <textarea
              value={isolate}
              onChange={(e) => setIsolate(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Host, segment, or C2 destination to quarantine…"
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit hunt report
            </button>
          )}
          {feedback ? (
            <p
              className="mono"
              style={{
                marginTop: "0.75rem",
                color: solved || feedback.includes("accepted") ? "#22c55e" : "var(--red-bright)",
              }}
            >
              {feedback}
            </p>
          ) : null}
          {solved ? (
            <p className="mono" style={{ marginTop: "0.75rem", color: "var(--red-bright)" }}>
              Completion flag: BLACKOUT{"{"}threat_contained{"}"}
            </p>
          ) : null}
        </>
      )}
      <style>{`
        .final-box { padding:1.15rem 1.2rem; display:grid; gap:.85rem; }
        .final-box .field { display:grid; gap:.35rem; }
        .final-box label {
          font-family:var(--font-mono); font-size:.75rem; color:var(--dim);
          text-transform:uppercase; letter-spacing:.06em;
        }
        .final-box select, .final-box textarea {
          width:100%; background:#070707; color:var(--text); border:1px solid var(--border);
          border-radius:10px; padding:.7rem .8rem; font-family:var(--font-body); font-size:.95rem;
        }
      `}</style>
    </form>
  );
}
