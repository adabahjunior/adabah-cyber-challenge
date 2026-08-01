import { useState } from "react";

export default function ContainmentReport({ config, locked, solved, onSolved }) {
  const [file, setFile] = useState("");
  const [systems, setSystems] = useState("");
  const [actions, setActions] = useState("");
  const [recover, setRecover] = useState("");
  const [feedback, setFeedback] = useState("");

  function countKeywords(text, list) {
    const lower = String(text || "").toLowerCase();
    return list.filter((k) => lower.includes(k)).length;
  }

  function submit(e) {
    e.preventDefault();
    if (locked || solved) return;
    const fileOk = file.trim().length >= 6 && countKeywords(file, config.fileKeywords) >= 1;
    const systemsOk = systems.trim().length >= 20 && countKeywords(systems, config.isolateKeywords) >= 2;
    const actionsOk = actions.trim().length >= 25 && countKeywords(actions, config.actionKeywords) >= 2;
    const recoverOk = recover.trim().length >= 20 && countKeywords(recover, config.recoverKeywords) >= 2;
    if (fileOk && systemsOk && actionsOk && recoverOk) {
      setFeedback("Containment report accepted. Final flag unlocked.");
      onSolved?.();
    } else {
      setFeedback("Report incomplete. Re-check the payload file, isolation targets, actions, and recovery path.");
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Containment report</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Stop the payload</h3>
      {locked && !solved ? (
        <p className="muted">Recover all five evidence flags to unlock this report.</p>
      ) : (
        <>
          <div className="field">
            <label>1. Which file introduced the malware?</label>
            <textarea
              value={file}
              onChange={(e) => setFile(e.target.value)}
              disabled={solved}
              rows={2}
              placeholder="Name the suspicious artefact…"
              required
            />
          </div>
          <div className="field">
            <label>2. Which systems should be isolated first?</label>
            <textarea
              value={systems}
              onChange={(e) => setSystems(e.target.value)}
              disabled={solved}
              rows={2}
              placeholder="List infected hosts to quarantine…"
              required
            />
          </div>
          <div className="field">
            <label>3. What actions should the response team take immediately?</label>
            <textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Containment, evidence, credentials…"
              required
            />
          </div>
          <div className="field">
            <label>4. How can the university recover safely?</label>
            <textarea
              value={recover}
              onChange={(e) => setRecover(e.target.value)}
              disabled={solved}
              rows={3}
              placeholder="Backups, reimage, verification, monitoring…"
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit containment report
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
              Completion flag: BLACKOUT{"{"}payload_contained{"}"}
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
