import { useMemo, useState } from "react";

const PASSWORDS = [
  { id: "p1", value: "password123", strength: "weak", reason: "Common dictionary word + sequential digits." },
  { id: "p2", value: "Cyber2026", strength: "weak", reason: "Predictable year + short campus theme." },
  { id: "p3", value: "Welcome1", strength: "weak", reason: "Default-style greeting with a single digit." },
  { id: "p4", value: "Admin@123", strength: "weak", reason: "Role name + keyboard pattern; widely sprayed." },
  { id: "p5", value: "Qwerty12", strength: "weak", reason: "Keyboard walk with trivial numbers." },
  {
    id: "p6",
    value: "CorrectHorseBatteryStaple",
    strength: "strong",
    reason: "Long unique passphrase — hard to brute-force or guess.",
    flag: "ACC{strong_password}",
  },
];

export default function PasswordVault() {
  const [marks, setMarks] = useState({});

  const correct = useMemo(() => {
    return PASSWORDS.every((p) => marks[p.id] === p.strength);
  }, [marks]);

  const strongRevealed = correct && marks.p6 === "strong";

  function mark(id, strength) {
    setMarks((prev) => ({ ...prev, [id]: strength }));
  }

  return (
    <div className="vault">
      <p className="muted" style={{ marginBottom: "0.85rem" }}>
        Classify each recovered credential as <strong>weak</strong> or <strong>strong</strong>. Correctly
        classifying all entries reveals the vault flag.
      </p>
      <div className="vault-list">
        {PASSWORDS.map((p) => (
          <div key={p.id} className={`vault-item ${marks[p.id] || ""}`}>
            <div className="mono pwd">{p.value}</div>
            <div className="actions">
              <button
                type="button"
                className={`btn btn-sm ${marks[p.id] === "weak" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => mark(p.id, "weak")}
              >
                Weak
              </button>
              <button
                type="button"
                className={`btn btn-sm ${marks[p.id] === "strong" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => mark(p.id, "strong")}
              >
                Strong
              </button>
            </div>
            {marks[p.id] === p.strength ? (
              <p className="reason ok">{p.reason}</p>
            ) : marks[p.id] ? (
              <p className="reason bad">Re-check this rating against length, uniqueness, and predictability.</p>
            ) : null}
          </div>
        ))}
      </div>
      {strongRevealed ? (
        <p className="mono flag-line">Strong credential confirmed · ACC{"{"}strong_password{"}"}</p>
      ) : (
        <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
          Marked {Object.keys(marks).length}/{PASSWORDS.length} · classify every password to unlock the flag.
        </p>
      )}
      <style>{`
        .vault-list { display:grid; gap:.65rem; }
        .vault-item {
          border:1px solid var(--border); border-radius:10px; padding:.85rem .9rem;
          background:rgba(255,255,255,.02);
        }
        .vault-item.weak { border-color:rgba(176,0,32,.4); }
        .vault-item.strong { border-color:rgba(34,197,94,.4); }
        .vault .pwd { font-size:1rem; color:var(--red-bright); word-break:break-all; }
        .vault .actions { display:flex; gap:.45rem; margin-top:.65rem; flex-wrap:wrap; }
        .vault .reason { margin-top:.55rem; font-size:.86rem; }
        .vault .reason.ok { color:#86efac; }
        .vault .reason.bad { color:var(--red-bright); }
        .vault .flag-line {
          margin-top:1rem; padding:.75rem .85rem; border:1px solid rgba(34,197,94,.4);
          border-radius:10px; color:#86efac; background:rgba(34,197,94,.08);
        }
      `}</style>
    </div>
  );
}
