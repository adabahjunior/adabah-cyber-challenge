import { useMemo, useState } from "react";

export default function TimelinePuzzle({ events, correctOrder, locked, solved, onSolved }) {
  const [order, setOrder] = useState(() => [...events].sort(() => Math.random() - 0.5).map((e) => e.id));
  const [feedback, setFeedback] = useState("");

  const labelMap = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, e.label])),
    [events]
  );

  function move(id, dir) {
    if (locked || solved) return;
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
    setFeedback("");
  }

  function check() {
    if (locked || solved) return;
    const ok = order.length === correctOrder.length && order.every((id, i) => id === correctOrder[i]);
    if (ok) {
      setFeedback("Timeline reconstructed. Final flag unlocked.");
      onSolved?.();
    } else {
      setFeedback("Sequence incorrect. Re-order the events and try again.");
    }
  }

  return (
    <div className="timeline-box glass">
      <p className="eyebrow">Timeline reconstruction</p>
      <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem" }}>Arrange what happened</h3>
      {locked && !solved ? (
        <p className="muted">Recover all four evidence flags to unlock the timeline.</p>
      ) : (
        <>
          <ol className="timeline-list">
            {order.map((id, index) => (
              <li key={id} className="timeline-item">
                <span className="mono dim">{index + 1}</span>
                <span className="timeline-label">{labelMap[id]}</span>
                <div className="row">
                  <button type="button" className="btn btn-ghost btn-sm" disabled={solved} onClick={() => move(id, -1)}>
                    ↑
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={solved} onClick={() => move(id, 1)}>
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ol>
          {!solved && (
            <button type="button" className="btn btn-primary" style={{ marginTop: "0.85rem" }} onClick={check}>
              Verify timeline
            </button>
          )}
          {feedback ? (
            <p className="mono" style={{ marginTop: "0.75rem", color: solved || feedback.includes("reconstructed") ? "#22c55e" : "var(--red-bright)" }}>
              {feedback}
            </p>
          ) : null}
          {solved ? (
            <p className="mono" style={{ marginTop: "0.75rem", color: "var(--red-bright)" }}>
              Completion flag: ACC{"{"}case_closed{"}"}
            </p>
          ) : null}
        </>
      )}
      <style>{`
        .timeline-box { padding:1.15rem 1.2rem; }
        .timeline-list { list-style:none; margin:0; padding:0; display:grid; gap:.55rem; }
        .timeline-item {
          display:grid; grid-template-columns:2rem 1fr auto; gap:.75rem; align-items:center;
          padding:.7rem .8rem; border:1px solid var(--border); border-radius:10px; background:rgba(255,255,255,.02);
        }
        .timeline-label { font-family:var(--font-mono); font-size:.92rem; }
      `}</style>
    </div>
  );
}
