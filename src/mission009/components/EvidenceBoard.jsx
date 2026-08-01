import { useMemo, useState } from "react";

const CLUES = [
  { id: "c1", label: "Phishing lure (M01)", pair: "p1" },
  { id: "c2", label: "Weak vault password (M04)", pair: "p2" },
  { id: "c3", label: "Hidden /backup page (M05)", pair: "p3" },
  { id: "c4", label: "07:39 login start (M06)", pair: "p4" },
  { id: "c5", label: "LAB-PC-05 + C2 (M07)", pair: "p5" },
  { id: "c6", label: "update.exe payload (M08)", pair: "p6" },
];

const LINKS = [
  { id: "p1", label: "Social engineering entry" },
  { id: "p2", label: "Credential weakness" },
  { id: "p3", label: "Client-side exposure" },
  { id: "p4", label: "Incident hour zero" },
  { id: "p5", label: "Compromised endpoint" },
  { id: "p6", label: "Malware stage" },
];

const ANSWERS = {
  c1: "p1",
  c2: "p2",
  c3: "p3",
  c4: "p4",
  c5: "p5",
  c6: "p6",
};

export default function EvidenceBoard() {
  const [picks, setPicks] = useState({});

  const done = useMemo(
    () => Object.keys(ANSWERS).every((k) => picks[k] === ANSWERS[k]),
    [picks]
  );

  return (
    <div className="board">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Connect each prior-mission clue to its correct category. Completing the board reveals the master token.
      </p>
      <div className="rows">
        {CLUES.map((c) => (
          <div key={c.id} className="row">
            <span className="mono clue">{c.label}</span>
            <select
              value={picks[c.id] || ""}
              onChange={(e) => setPicks((prev) => ({ ...prev, [c.id]: e.target.value }))}
            >
              <option value="">Link category…</option>
              {LINKS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            {picks[c.id] ? (
              <span className={`mono mark ${picks[c.id] === ANSWERS[c.id] ? "ok" : "bad"}`}>
                {picks[c.id] === ANSWERS[c.id] ? "✔" : "✖"}
              </span>
            ) : (
              <span className="mono mark">·</span>
            )}
          </div>
        ))}
      </div>
      {done ? (
        <p className="mono flag-line">Evidence chain complete · BLACKOUT{"{"}master_investigator{"}"}</p>
      ) : null}
      <style>{`
        .board .rows { display:grid; gap:.55rem; }
        .board .row { display:grid; grid-template-columns:1.2fr 1fr auto; gap:.55rem; align-items:center; }
        .board .clue { font-size:.82rem; color:var(--muted); }
        .board select {
          background:#070707; color:var(--text); border:1px solid var(--border); border-radius:8px;
          padding:.5rem .6rem; font-size:.84rem;
        }
        .board .mark { width:1.2rem; text-align:center; }
        .board .mark.ok { color:#86efac; }
        .board .mark.bad { color:var(--red-bright); }
        .board .flag-line {
          margin-top:1rem; padding:.75rem .85rem; border-radius:10px;
          border:1px solid rgba(34,197,94,.4); background:rgba(34,197,94,.08); color:#86efac;
        }
        @media (max-width:700px) {
          .board .row { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}
