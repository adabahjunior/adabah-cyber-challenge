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
    const mistakesOk = mistakes.trim().length >= 40 && countKeywords(mistakes, config.mistakesKeywords) >= 3;
    const improveOk =
      improvements.trim().length >= 40 && countKeywords(improvements, config.improveKeywords) >= 2;
    if (mistakesOk && improveOk) {
      setFeedback("Assessment accepted. Final flag unlocked.");
      onSolved?.();
    } else {
      setFeedback(
        "Assessment incomplete. Identify at least three security mistakes and recommend practical improvements."
      );
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Website security review</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Secure the public site</h3>
      {locked && !solved ? (
        <p className="muted">Recover all four evidence flags to unlock this assessment.</p>
      ) : (
        <>
          <div className="field">
            <label>Identify at least three security mistakes found on the website</label>
            <textarea
              value={mistakes}
              onChange={(e) => setMistakes(e.target.value)}
              disabled={solved}
              rows={4}
              placeholder="e.g. secrets in HTML comments, tokens in JavaScript, unlinked /backup, sensitive alt text…"
              required
            />
          </div>
          <div className="field">
            <label>Recommend practical improvements</label>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              disabled={solved}
              rows={4}
              placeholder="e.g. strip comments from production, keep secrets server-side, restrict backup paths…"
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit review
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
              Completion flag: ACC{"{"}website_secured{"}"}
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
