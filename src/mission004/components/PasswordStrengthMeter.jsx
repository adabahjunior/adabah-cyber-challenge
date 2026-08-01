import { useMemo, useState } from "react";

function scorePassword(pwd) {
  const p = String(pwd || "");
  if (!p) return { score: 0, label: "Empty", color: "var(--dim)" };
  let score = 0;
  if (p.length >= 8) score += 1;
  if (p.length >= 12) score += 1;
  if (p.length >= 16) score += 1;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score += 1;
  if (/\d/.test(p)) score += 1;
  if (/[^A-Za-z0-9]/.test(p)) score += 1;
  if (/(password|qwerty|admin|welcome|1234|2026)/i.test(p)) score = Math.max(0, score - 2);

  if (score <= 1) return { score, label: "Very weak", color: "var(--red-bright)", pct: 18 };
  if (score === 2) return { score, label: "Weak", color: "#f97316", pct: 35 };
  if (score === 3) return { score, label: "Fair", color: "#eab308", pct: 55 };
  if (score === 4) return { score, label: "Good", color: "#84cc16", pct: 75 };
  return { score, label: "Strong", color: "#22c55e", pct: 100 };
}

export default function PasswordStrengthMeter() {
  const [value, setValue] = useState("");
  const result = useMemo(() => scorePassword(value), [value]);

  return (
    <div className="strength-meter">
      <div className="mono dim label">Password strength meter</div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Test a password…"
        autoComplete="off"
        spellCheck={false}
      />
      <div className="bar">
        <span style={{ width: `${result.pct}%`, background: result.color }} />
      </div>
      <div className="mono" style={{ fontSize: "0.78rem", color: result.color, marginTop: "0.35rem" }}>
        {result.label}
      </div>
      <style>{`
        .strength-meter .label {
          font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; margin-bottom:.35rem;
        }
        .strength-meter input {
          width:100%; background:#070707; color:var(--text); border:1px solid var(--border);
          border-radius:8px; padding:.55rem .65rem; font-family:var(--font-mono); font-size:.82rem;
        }
        .strength-meter .bar {
          margin-top:.5rem; height:6px; border-radius:999px; background:rgba(255,255,255,.08); overflow:hidden;
        }
        .strength-meter .bar span {
          display:block; height:100%; border-radius:999px; transition:width .25s ease, background .25s ease;
        }
      `}</style>
    </div>
  );
}
