import { useState } from "react";

export default function FlagSubmit({
  flagDef,
  verified,
  disabled,
  onVerify,
  okLabel = "✔ Flag Accepted",
  badLabel = "✖ Invalid Flag",
  buttonLabel = "Verify Flag",
  placeholder = "ACC{...}",
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(verified ? "ok" : "");

  function submit(e) {
    e.preventDefault();
    if (disabled || verified) return;
    const ok = onVerify(value.trim());
    setStatus(ok ? "ok" : "bad");
    if (ok) setValue(flagDef.correct);
  }

  return (
    <form className="flag-box glass" onSubmit={submit}>
      <div className="row" style={{ justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <p className="eyebrow">Task {flagDef.task}</p>
          <h3 style={{ fontSize: "1rem" }}>{flagDef.label}</h3>
          <p className="muted" style={{ marginTop: "0.35rem", fontSize: "0.9rem" }}>
            Enter Flag · {flagDef.points} pts
          </p>
        </div>
        {verified ? <span className="badge badge-green">Completed</span> : null}
      </div>
      <div className="flag-row">
        <input
          className="code"
          value={verified ? flagDef.correct : value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus("");
          }}
          placeholder={placeholder}
          disabled={disabled || verified}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn btn-primary" type="submit" disabled={disabled || verified}>
          {buttonLabel}
        </button>
      </div>
      {status === "ok" ? <p className="ok-msg">{okLabel}</p> : null}
      {status === "bad" ? <p className="bad-msg">{badLabel}</p> : null}
      <style>{`
        .flag-box { padding:1.05rem 1.1rem; }
        .flag-row { display:flex; flex-wrap:wrap; gap:.55rem; margin-top:.85rem; }
        .flag-row input {
          flex:1; min-width:220px; background:#070707; border:1px solid var(--border); border-radius:10px;
          color:var(--text); padding:.7rem .8rem; font-family:var(--font-code); font-size:.92rem;
        }
        .ok-msg { color:#22c55e; font-family:var(--font-mono); margin-top:.65rem; }
        .bad-msg { color:var(--red-bright); font-family:var(--font-mono); margin-top:.65rem; }
      `}</style>
    </form>
  );
}
