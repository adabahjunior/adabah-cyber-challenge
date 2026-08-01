import { useState } from "react";

export default function IncidentReport({ config, locked, solved, onSolved }) {
  const [systems, setSystems] = useState("");
  const [first, setFirst] = useState("");
  const [evidence, setEvidence] = useState("");
  const [action, setAction] = useState("");
  const [feedback, setFeedback] = useState("");

  function countKeywords(text, list) {
    const lower = String(text || "").toLowerCase();
    return list.filter((k) => lower.includes(k)).length;
  }

  function submit(e) {
    e.preventDefault();
    if (locked || solved) return;
    const systemsOk = systems.trim().length >= 20 && countKeywords(systems, config.systemsKeywords) >= 2;
    const firstOk = first.trim().length >= 12 && countKeywords(first, config.firstKeywords) >= 1;
    const evidenceOk = evidence.trim().length >= 15 && countKeywords(evidence, config.evidenceKeywords) >= 1;
    const actionOk = action.trim().length >= 25 && countKeywords(action, config.actionKeywords) >= 2;
    if (systemsOk && firstOk && evidenceOk && actionOk) {
      setFeedback("Incident report accepted. Confirmation flag unlocked.");
      onSolved?.();
    } else {
      setFeedback("Report incomplete. Re-check affected systems, first event, priority evidence, and immediate actions.");
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Incident report</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Confirm the breach</h3>
      {locked && !solved ? (
        <p className="muted">Recover all five evidence flags to unlock the incident report.</p>
      ) : (
        <>
          <div className="field">
            <label>1. Which systems were affected?</label>
            <textarea
              value={systems}
              onChange={(e) => setSystems(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="List offline / degraded services from the status board…"
              required
            />
          </div>
          <div className="field">
            <label>2. What happened first?</label>
            <textarea
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              disabled={solved}
              rows={2}
              placeholder="Use the earliest timeline / log event…"
              required
            />
          </div>
          <div className="field">
            <label>3. Which evidence is most important?</label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              disabled={solved}
              rows={2}
              placeholder="Justify with dashboard, logs, email, or timeline…"
              required
            />
          </div>
          <div className="field">
            <label>4. What should the response team do immediately?</label>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Containment, evidence preservation, escalation…"
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit incident report
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
              Completion flag: ACC{"{"}incident_confirmed{"}"}
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
        .final-box textarea {
          width:100%; background:#070707; color:var(--text); border:1px solid var(--border);
          border-radius:10px; padding:.7rem .8rem; font-family:var(--font-body); font-size:.95rem;
        }
      `}</style>
    </form>
  );
}
