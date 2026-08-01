import { useState } from "react";

export default function FinalInvestigation({ config, locked, solved, onSolved }) {
  const [device, setDevice] = useState("");
  const [why, setWhy] = useState("");
  const [action, setAction] = useState("");
  const [feedback, setFeedback] = useState("");

  function hasKeywords(text, list) {
    const lower = String(text || "").toLowerCase();
    return list.filter((k) => lower.includes(k)).length >= 1;
  }

  function submit(e) {
    e.preventDefault();
    if (locked || solved) return;
    const deviceOk = device === config.correctDevice;
    const whyOk = why.trim().length >= 20 && hasKeywords(why, config.whyKeywords);
    const actionOk = action.trim().length >= 15 && hasKeywords(action, config.actionKeywords);
    if (deviceOk && whyOk && actionOk) {
      setFeedback("Investigation accepted. Completion flag unlocked.");
      onSolved?.();
    } else {
      setFeedback("Report incomplete or incorrect. Re-check the device, evidence, and containment steps.");
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Final investigation</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Contain the intruder</h3>
      {locked && !solved ? (
        <p className="muted">Recover all four evidence flags to unlock this report.</p>
      ) : (
        <>
          <div className="field">
            <label>Which device most likely performed the attack?</label>
            <select value={device} onChange={(e) => setDevice(e.target.value)} disabled={solved} required>
              <option value="">Select device</option>
              {config.deviceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Why was it suspicious?</label>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Use evidence from the map, logs, and asset list…"
              required
            />
          </div>
          <div className="field">
            <label>What should the network administrator do immediately?</label>
            <textarea
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Describe containment steps…"
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit investigation
            </button>
          )}
          {feedback ? (
            <p className="mono" style={{ marginTop: "0.75rem", color: solved || feedback.includes("accepted") ? "#22c55e" : "var(--red-bright)" }}>
              {feedback}
            </p>
          ) : null}
          {solved ? (
            <p className="mono" style={{ marginTop: "0.75rem", color: "var(--red-bright)" }}>
              Completion flag: ACC{"{"}intruder_stopped{"}"}
            </p>
          ) : null}
        </>
      )}
      <style>{`
        .final-box { padding:1.15rem 1.2rem; display:grid; gap:.85rem; }
        .final-box .field { display:grid; gap:.35rem; }
        .final-box label { font-family:var(--font-mono); font-size:.75rem; color:var(--dim); text-transform:uppercase; letter-spacing:.06em; }
        .final-box select, .final-box textarea {
          width:100%; background:#070707; color:var(--text); border:1px solid var(--border); border-radius:10px;
          padding:.7rem .8rem; font-family:var(--font-body); font-size:.95rem;
        }
      `}</style>
    </form>
  );
}
