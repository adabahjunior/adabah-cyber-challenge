import { useState } from "react";

const STEPS = [
  { id: "s1", label: "Disconnect infected devices from the live network" },
  { id: "s2", label: "Preserve volatile evidence and disk images before wiping" },
  { id: "s3", label: "Reset compromised credentials and revoke active sessions" },
  {
    id: "s4",
    label: "Restore clean systems from verified backup · BLACKOUT{incident_control}",
    flagged: true,
  },
  { id: "s5", label: "Monitor network for residual C2 beacons and renamed files" },
];

export default function RecoveryPlan() {
  const [checked, setChecked] = useState({});

  function toggle(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="rec">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Work the ACRT recovery checklist. Mark each step as you review it — look closely at the wording.
      </p>
      <ul>
        {STEPS.map((s, i) => (
          <li key={s.id} className={s.flagged ? "flag" : ""}>
            <label>
              <input type="checkbox" checked={Boolean(checked[s.id])} onChange={() => toggle(s.id)} />
              <span className="mono num">{String(i + 1).padStart(2, "0")}</span>
              <span className={`text ${checked[s.id] ? "done" : ""}`}>{s.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <style>{`
        .rec ul { list-style:none; margin:0; padding:0; display:grid; gap:.55rem; }
        .rec li {
          border:1px solid var(--border); border-radius:12px; background:rgba(255,255,255,.02);
        }
        .rec li.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .rec label {
          display:flex; align-items:flex-start; gap:.65rem; padding:.85rem .9rem; cursor:pointer;
        }
        .rec input { margin-top:.2rem; accent-color:#e01136; }
        .rec .num { color:var(--dim); font-size:.75rem; }
        .rec .text { color:var(--muted); font-size:.92rem; line-height:1.45; }
        .rec .text.done { color:#86efac; text-decoration:line-through; }
        .rec li.flag .text { color:#fecaca; font-family:var(--font-mono); font-size:.86rem; }
      `}</style>
    </div>
  );
}
