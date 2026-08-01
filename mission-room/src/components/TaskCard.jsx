export default function TaskCard({
  task,
  index,
  locked,
  value,
  onChange,
  checked,
  result,
}) {
  const disabled = locked;

  return (
    <section
      className={`glass task-card ${checked ? (result?.ok ? "ok" : "bad") : ""}`}
      style={{ opacity: locked ? 0.55 : 1, pointerEvents: locked ? "none" : "auto" }}
    >
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <p className="eyebrow">Task {index}</p>
          <h3 style={{ fontSize: "1.05rem" }}>{task.title}</h3>
        </div>
        <span className="badge badge-red">{task.points} pts</span>
      </div>
      <p className="muted" style={{ margin: "0.65rem 0 0.9rem" }}>
        {task.prompt}
      </p>

      {task.kind === "single" && (
        <div className="option-list">
          {task.options.map((opt) => (
            <label key={opt} className={`option ${value === opt ? "active" : ""}`}>
              <input
                type="radio"
                name={task.id}
                value={opt}
                checked={value === opt}
                disabled={disabled || checked}
                onChange={() => onChange(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {task.kind === "multi" && (
        <div className="option-list">
          {task.options.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt);
            return (
              <label key={opt} className={`option ${selected ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={!!selected}
                  disabled={disabled || checked}
                  onChange={() => {
                    const cur = Array.isArray(value) ? value : [];
                    onChange(
                      selected ? cur.filter((x) => x !== opt) : [...cur, opt]
                    );
                  }}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {task.kind === "text" && (
        <div className="field" style={{ marginBottom: 0 }}>
          <textarea
            value={value || ""}
            disabled={disabled || checked}
            onChange={(e) => onChange(e.target.value)}
            placeholder={"1. First reason\n2. Second reason\n3. Third reason"}
          />
        </div>
      )}

      {task.kind === "essay" && (
        <div className="field" style={{ marginBottom: 0 }}>
          <textarea
            value={value || ""}
            disabled={disabled || checked}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Advise your friend in clear everyday language…"
          />
          <span className="mono" style={{ fontSize: "0.72rem", color: "var(--dim)" }}>
            {wordCount(value)} / {task.maxWords} words
          </span>
        </div>
      )}

      {checked && result && (
        <p
          className="mono"
          style={{
            marginTop: "0.85rem",
            color: result.ok ? "#22c55e" : "var(--red-bright)",
            fontSize: "0.82rem",
          }}
        >
          {result.ok
            ? `Correct · +${result.points} points`
            : `Review again · +${result.points} points awarded`}
        </p>
      )}

      <style>{`
        .task-card { padding: 1.15rem 1.2rem; }
        .task-card.ok { border-color: rgba(34,197,94,.4); }
        .task-card.bad { border-color: var(--border-red); }
        .option-list { display:grid; gap:.45rem; }
        .option { display:flex; gap:.65rem; align-items:flex-start; padding:.7rem .8rem; border:1px solid var(--border); border-radius:10px; cursor:pointer; background:rgba(255,255,255,.02); }
        .option.active { border-color: var(--border-red); background: var(--red-dim); }
        .option input { margin-top:.2rem; accent-color: var(--red); }
      `}</style>
    </section>
  );
}

export function wordCount(text) {
  return (String(text || "").trim().match(/\b\w+\b/g) || []).length;
}
