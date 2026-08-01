export default function InvestigationToolkit({
  remaining,
  progress,
  evidence,
  openedEvidence,
  verifiedFlags,
  totalFlags = 5,
  notebook,
  onNotebook,
  hintsUsed,
  maxHints,
  onHint,
  activeHint,
  extra,
}) {
  function formatTime(sec) {
    const s = Math.max(0, sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }

  return (
    <aside className="toolkit glass glass-red">
      <p className="eyebrow">Investigation toolkit</p>
      <div className="tool-block">
        <div className="mono dim label">Mission timer</div>
        <div className="mono timer">{formatTime(remaining)}</div>
      </div>

      <div className="tool-block">
        <div className="mono dim label">Progress</div>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="mono" style={{ fontSize: "0.75rem", marginTop: "0.35rem" }}>{progress}%</div>
      </div>

      <div className="tool-block">
        <div className="mono dim label">Evidence checklist</div>
        <ul className="check-list">
          {evidence.map((ev) => (
            <li key={ev.id} className={openedEvidence[ev.id] ? "done" : ""}>
              <span>{openedEvidence[ev.id] ? "✓" : "○"}</span> {ev.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="tool-block">
        <div className="mono dim label">Flags recovered</div>
        <div className="mono">{verifiedFlags}/{totalFlags}</div>
      </div>

      <div className="tool-block">
        <div className="mono dim label">Hints</div>
        <div className="mono" style={{ fontSize: "0.85rem" }}>
          Used {hintsUsed} · Remaining {Math.max(0, maxHints - hintsUsed)}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: "0.55rem" }} onClick={onHint}>
          Use hint (−5 pts)
        </button>
        {activeHint ? <p className="hint-box">{activeHint}</p> : null}
      </div>

      {extra ? <div className="tool-block">{extra}</div> : null}

      <div className="tool-block">
        <div className="mono dim label">Notebook</div>
        <textarea
          value={notebook}
          onChange={(e) => onNotebook(e.target.value)}
          placeholder="Log theories, timestamps, and suspicious details…"
          rows={6}
        />
      </div>

      <style>{`
        .toolkit { padding:1.1rem 1.15rem; position:sticky; top:1rem; }
        .tool-block { margin-top:1rem; }
        .tool-block .label { font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:.35rem; }
        .timer { font-size:1.45rem; color:var(--red-bright); }
        .check-list { list-style:none; margin:0; padding:0; display:grid; gap:.35rem; }
        .check-list li { font-family:var(--font-mono); font-size:.8rem; color:var(--muted); display:flex; gap:.4rem; }
        .check-list li.done { color:#86efac; }
        .hint-box {
          margin-top:.55rem; padding:.65rem .7rem; border:1px solid var(--border-red); border-radius:8px;
          font-size:.85rem; color:var(--muted); background:rgba(176,0,32,.08);
        }
        .toolkit textarea {
          width:100%; resize:vertical; min-height:120px; background:#070707; color:var(--text);
          border:1px solid var(--border); border-radius:10px; padding:.65rem .7rem; font-family:var(--font-mono); font-size:.82rem;
        }
      `}</style>
    </aside>
  );
}
