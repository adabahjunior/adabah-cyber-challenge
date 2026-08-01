import { useState } from "react";

export default function FinalAssessment({ config, locked, solved, onSolved }) {
  const [mistakes, setMistakes] = useState("");
  const [improvements, setImprovements] = useState("");
  const [feedback, setFeedback] = useState("");

  function countKeywords(text, list) {
    const lower = String(text || "").toLowerCase();
    return list.filter((k) => lower.includes(k)).length;
  }

  function submit(e) {
    e.preventDefault();
    if (locked || solved) return;
    const mistakesOk = mistakes.trim().length >= 40 && countKeywords(mistakes, config.mistakesKeywords) >= 2;
    const improveOk =
      improvements.trim().length >= 50 && countKeywords(improvements, config.improveKeywords) >= 3;
    if (mistakesOk && improveOk) {
      setFeedback("Assessment accepted. Final flag unlocked.");
      onSolved?.();
    } else {
      setFeedback(
        "Assessment incomplete. Describe the mistakes clearly and recommend at least three concrete improvements."
      );
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Security assessment</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Secure the vault</h3>
      {locked && !solved ? (
        <p className="muted">Recover all four evidence flags to unlock the final assessment.</p>
      ) : (
        <>
          <div className="field">
            <label>What mistakes allowed this breach?</label>
            <textarea
              value={mistakes}
              onChange={(e) => setMistakes(e.target.value)}
              disabled={solved}
              rows={4}
              placeholder="Reference weak passwords, failed logins, policy gaps, missing MFA…"
              required
            />
          </div>
          <div className="field">
            <label>Recommend at least three improvements</label>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              disabled={solved}
              rows={4}
              placeholder="e.g. enforce MFA, longer passphrases, lockouts, better hashing, user education…"
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit assessment
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
              Completion flag: ACC{"{"}vault_secured{"}"}
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
