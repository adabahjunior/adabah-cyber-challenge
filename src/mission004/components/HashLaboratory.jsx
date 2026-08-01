import { useMemo, useState } from "react";

const PAIRS = [
  { id: "h1", password: "password", hash: "5e884898da280471…" },
  { id: "h2", password: "Cyber2026", hash: "8a5a317fb3ceef3c…" },
  { id: "h3", password: "Admin@123", hash: "e86f78a8a3caf0b6…" },
  { id: "h4", password: "Welcome1", hash: "7e19e31ae82d7490…" },
];

const HASH_OPTIONS = PAIRS.map((p) => p.hash);

export default function HashLaboratory() {
  const [picks, setPicks] = useState({});

  const allCorrect = useMemo(
    () => PAIRS.every((p) => picks[p.id] === p.hash),
    [picks]
  );

  return (
    <div className="hash-lab">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Hash Laboratory · SHA-256 fragments recovered from the vault. Match each plaintext password to its
        hash. No advanced crypto required — compare carefully.
      </p>
      <div className="hash-grid">
        {PAIRS.map((pair) => (
          <div key={pair.id} className="hash-card">
            <div className="mono pwd">{pair.password}</div>
            <div className="arrow" aria-hidden="true">
              ↓
            </div>
            <select
              value={picks[pair.id] || ""}
              onChange={(e) => setPicks((prev) => ({ ...prev, [pair.id]: e.target.value }))}
            >
              <option value="">Select matching hash…</option>
              {HASH_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            {picks[pair.id] ? (
              <p className={`mono status ${picks[pair.id] === pair.hash ? "ok" : "bad"}`}>
                {picks[pair.id] === pair.hash ? "✔ Match confirmed" : "✖ Incorrect pair"}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      {allCorrect ? (
        <p className="mono flag-line">All hashes verified · ACC{"{"}hash_master{"}"}</p>
      ) : (
        <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
          Complete every correct match to recover the laboratory flag.
        </p>
      )}
      <style>{`
        .hash-grid { display:grid; gap:.75rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
        .hash-card {
          border:1px solid var(--border); border-radius:10px; padding:.9rem;
          background:linear-gradient(160deg, rgba(176,0,32,.08), rgba(0,0,0,.35));
        }
        .hash-lab .pwd { color:var(--red-bright); font-size:1rem; }
        .hash-lab .arrow { color:var(--dim); margin:.35rem 0; font-size:1.1rem; }
        .hash-lab select {
          width:100%; background:#070707; color:var(--text); border:1px solid var(--border);
          border-radius:8px; padding:.55rem .65rem; font-family:var(--font-mono); font-size:.82rem;
        }
        .hash-lab .status { margin-top:.5rem; font-size:.8rem; }
        .hash-lab .status.ok { color:#86efac; }
        .hash-lab .status.bad { color:var(--red-bright); }
        .hash-lab .flag-line {
          margin-top:1rem; padding:.75rem .85rem; border:1px solid rgba(34,197,94,.4);
          border-radius:10px; color:#86efac; background:rgba(34,197,94,.08);
        }
      `}</style>
    </div>
  );
}
