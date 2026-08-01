import { useState } from "react";

export default function FinalIncidentReport({ config, locked, solved, onSolved }) {
  const [begin, setBegin] = useState("");
  const [first, setFirst] = useState("");
  const [evidence, setEvidence] = useState("");
  const [stop, setStop] = useState("");
  const [lessons, setLessons] = useState("");
  const [feedback, setFeedback] = useState("");

  function countKeywords(text, list) {
    const lower = String(text || "").toLowerCase();
    return list.filter((k) => lower.includes(k)).length;
  }

  function submit(e) {
    e.preventDefault();
    if (locked || solved) return;
    const ok =
      begin.trim().length >= 20 &&
      countKeywords(begin, config.beginKeywords) >= 1 &&
      first.trim().length >= 10 &&
      countKeywords(first, config.firstSystemKeywords) >= 1 &&
      evidence.trim().length >= 15 &&
      countKeywords(evidence, config.evidenceKeywords) >= 1 &&
      stop.trim().length >= 20 &&
      countKeywords(stop, config.stopKeywords) >= 2 &&
      lessons.trim().length >= 25 &&
      countKeywords(lessons, config.lessonKeywords) >= 2;
    if (ok) {
      setFeedback("Final incident report accepted. Champion flag unlocked.");
      onSolved?.();
    } else {
      setFeedback("Report incomplete. Draw on Missions 001–008 — be specific.");
    }
  }

  return (
    <form className="final-box glass" onSubmit={submit}>
      <p className="eyebrow">Final incident report</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>Close Operation Blackout</h3>
      {locked && !solved ? (
        <p className="muted">Recover all six evidence flags to unlock the champion report.</p>
      ) : (
        <>
          <div className="field">
            <label>1. How did the attack begin?</label>
            <textarea value={begin} onChange={(e) => setBegin(e.target.value)} disabled={solved} rows={3} required />
          </div>
          <div className="field">
            <label>2. Which system was compromised first?</label>
            <textarea value={first} onChange={(e) => setFirst(e.target.value)} disabled={solved} rows={2} required />
          </div>
          <div className="field">
            <label>3. What evidence confirmed the attacker?</label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              disabled={solved}
              rows={2}
              required
            />
          </div>
          <div className="field">
            <label>4. Which actions stopped the attack?</label>
            <textarea value={stop} onChange={(e) => setStop(e.target.value)} disabled={solved} rows={3} required />
          </div>
          <div className="field">
            <label>5. What lessons should the university learn?</label>
            <textarea
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              disabled={solved}
              rows={3}
              required
            />
          </div>
          {!solved && (
            <button className="btn btn-primary" type="submit">
              Submit final report
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
              Champion flag: BLACKOUT{"{"}cyber_champion{"}"}
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
