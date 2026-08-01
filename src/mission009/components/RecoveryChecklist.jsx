import { useMemo, useState } from "react";

const STEPS = [
  { id: "s1", label: "Infected hosts isolated from production VLANs" },
  { id: "s2", label: "Compromised credentials reset + sessions revoked" },
  { id: "s3", label: "Malware artefacts quarantined / systems reimaged" },
  { id: "s4", label: "C2 destination blocked at the edge firewall" },
  { id: "s5", label: "Clean backups restored and verified" },
  {
    id: "s6",
    label: "Final ACRT sign-off logged · BLACKOUT{operation_complete}",
    flagged: true,
  },
];

export default function RecoveryChecklist() {
  const [checked, setChecked] = useState({});
  const allDone = useMemo(() => STEPS.every((s) => checked[s.id]), [checked]);

  return (
    <div className="chk">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Confirm every recovery step. The final sign-off line carries the operation token.
      </p>
      <ul>
        {STEPS.map((s, i) => (
          <li key={s.id} className={s.flagged ? "flag" : ""}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(checked[s.id])}
                onChange={() => setChecked((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
              />
              <span className="mono num">{String(i + 1).padStart(2, "0")}</span>
              <span className={`text ${checked[s.id] ? "done" : ""}`}>{s.label}</span>
            </label>
          </li>
        ))}
      </ul>
      {allDone ? (
        <p className="mono ok">All recovery steps verified. Submit the recovery flag.</p>
      ) : null}
      <style>{`
        .chk ul { list-style:none; margin:0; padding:0; display:grid; gap:.5rem; }
        .chk li { border:1px solid var(--border); border-radius:12px; background:rgba(255,255,255,.02); }
        .chk li.flag { border-color:rgba(224,17,54,.55); background:rgba(176,0,32,.1); }
        .chk label { display:flex; gap:.65rem; align-items:flex-start; padding:.8rem .9rem; cursor:pointer; }
        .chk input { margin-top:.2rem; accent-color:#e01136; }
        .chk .num { color:var(--dim); font-size:.72rem; }
        .chk .text { color:var(--muted); font-size:.9rem; line-height:1.45; }
        .chk .text.done { color:#86efac; text-decoration:line-through; }
        .chk li.flag .text { color:#fecaca; font-family:var(--font-mono); font-size:.84rem; }
        .chk .ok { margin-top:.85rem; color:#86efac; }
      `}</style>
    </div>
  );
}
