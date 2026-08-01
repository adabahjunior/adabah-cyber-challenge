import { useEffect, useMemo, useRef, useState } from "react";

function playSuccessTone() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.02 + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + i * 0.12);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + i * 0.12);
      o.stop(now + 0.4 + i * 0.12);
    });
  } catch (_) {}
}

function makeCertId(seed) {
  const base = String(seed || "ACC").replace(/\W/g, "").toUpperCase().slice(0, 6) || "ACC";
  const n = Date.now().toString(36).toUpperCase();
  return `ACC-CERT-${base}-${n}`;
}

function downloadCertificate({ name, username, score, rank, dateStr, certId }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 990;
  const ctx = canvas.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, 1400, 990);
  g.addColorStop(0, "#0a0a0a");
  g.addColorStop(0.5, "#14060a");
  g.addColorStop(1, "#000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1400, 990);

  ctx.strokeStyle = "rgba(224,17,54,0.75)";
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1320, 910);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 1280, 870);

  ctx.fillStyle = "#e01136";
  ctx.font = "600 28px Orbitron, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ADABAH CYBER CHALLENGE", 700, 140);

  ctx.fillStyle = "#f4f4f5";
  ctx.font = "700 54px Orbitron, sans-serif";
  ctx.fillText("CERTIFICATE OF COMPLETION", 700, 220);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 24px IBM Plex Sans, sans-serif";
  ctx.fillText("This certifies that", 700, 300);

  ctx.fillStyle = "#fff";
  ctx.font = "700 48px Orbitron, sans-serif";
  ctx.fillText(name || "Participant", 700, 370);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 22px IBM Plex Sans, sans-serif";
  ctx.fillText(`@${username || "analyst"}`, 700, 415);

  ctx.fillStyle = "#d4d4d8";
  ctx.font = "400 24px IBM Plex Sans, sans-serif";
  ctx.fillText("has successfully completed Operation Blackout", 700, 480);
  ctx.fillText("and is hereby recognized as an", 700, 520);

  ctx.fillStyle = "#e01136";
  ctx.font = "700 40px Orbitron, sans-serif";
  ctx.fillText("ADABAH CYBER CHAMPION", 700, 585);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 20px JetBrains Mono, monospace";
  ctx.fillText(`Final Score: ${score}   ·   Rank: ${rank}   ·   Date: ${dateStr}`, 700, 660);
  ctx.fillText(`Certificate ID: ${certId}`, 700, 700);

  ctx.fillStyle = "#71717a";
  ctx.font = "400 18px IBM Plex Sans, sans-serif";
  ctx.fillText("Digitally signed by ADABAH Cyber Challenge", 700, 800);
  ctx.fillText("cybercc.adabah.com", 700, 835);

  const link = document.createElement("a");
  link.download = `${certId}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function ChampionFinale({
  visible,
  score,
  elapsed,
  flagsRecovered,
  totalFlags,
  muted,
  onToggleMute,
  onClose,
}) {
  const [phase, setPhase] = useState("black");
  const [typed, setTyped] = useState("");
  const confetti = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: `${(i % 12) * 0.12}s`,
        dur: `${2.4 + (i % 5) * 0.35}s`,
        color: ["#e01136", "#fecaca", "#fbbf24", "#fff", "#86efac"][i % 5],
      })),
    []
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("acc_participant_v1") || "{}");
    } catch (_) {
      return {};
    }
  }, [visible]);

  const name = user.fullName || user.hackerName || user.username || "Champion";
  const username = user.hackerName || user.username || "analyst";
  const rank = user.rank || "—";
  const certId = useRef(makeCertId(username)).current;
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const congrats =
    "You have successfully completed ADABAH CYBER CHALLENGE. Operation Blackout has officially ended.";

  useEffect(() => {
    if (!visible) return;
    setPhase("black");
    setTyped("");
    const t1 = setTimeout(() => setPhase("flash"), 400);
    const t2 = setTimeout(() => {
      setPhase("celebrate");
      if (!muted) playSuccessTone();
    }, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, muted]);

  useEffect(() => {
    if (phase !== "celebrate") return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(congrats.slice(0, i));
      if (i >= congrats.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [phase]);

  if (!visible) return null;

  return (
    <div className={`finale ${phase}`}>
      {phase === "celebrate" ? (
        <>
          <div className="confetti" aria-hidden="true">
            {confetti.map((c) => (
              <span
                key={c.id}
                style={{
                  left: c.left,
                  animationDelay: c.delay,
                  animationDuration: c.dur,
                  background: c.color,
                }}
              />
            ))}
          </div>
          <div className="particles" aria-hidden="true" />
          <div className="modal glass">
            <p className="eyebrow">Mission status · SUCCESS</p>
            <h2>🎉 CONGRATULATIONS! 🎉</h2>
            <p className="mono typed">{typed}</p>
            <div className="trophy">🏆</div>
            <p className="title-line">ADABAH CYBER CHAMPION</p>
            <ul className="skills-mini">
              {[
                "Phishing Detection",
                "Digital Forensics",
                "Network Investigation",
                "Password Security",
                "Web Security",
                "Incident Response",
                "Threat Hunting",
                "Malware Containment",
              ].map((s) => (
                <li key={s}>✅ {s}</li>
              ))}
            </ul>
            <div className="stats">
              <div>
                <span>Final score</span>
                <strong>{score}</strong>
              </div>
              <div>
                <span>Mission time</span>
                <strong>
                  {Math.floor(elapsed / 60)}m {elapsed % 60}s
                </strong>
              </div>
              <div>
                <span>Overall rank</span>
                <strong>{rank === "—" ? "Pending" : `#${rank}`}</strong>
              </div>
              <div>
                <span>Flags captured</span>
                <strong>
                  {flagsRecovered}/{totalFlags}
                </strong>
              </div>
            </div>
            <div className="actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  downloadCertificate({
                    name,
                    username,
                    score,
                    rank: rank === "—" ? "TBD" : `#${rank}`,
                    dateStr,
                    certId,
                  })
                }
              >
                🏅 View Certificate
              </button>
              <a className="btn btn-ghost" href="/profile.html">
                📊 View Final Results
              </a>
              <a className="btn btn-ghost" href="/leaderboard.html">
                🏆 Leaderboard
              </a>
              <a className="btn btn-ghost" href="/challenges.html">
                🔄 Review Missions
              </a>
              <a className="btn btn-ghost" href="/dashboard.html">
                🏠 Return to Dashboard
              </a>
            </div>
            <div className="foot">
              <button type="button" className="btn btn-ghost btn-sm" onClick={onToggleMute}>
                {muted ? "Unmute sound" : "Mute sound"}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                Close overlay
              </button>
            </div>
          </div>
        </>
      ) : null}
      <style>{`
        .finale {
          position:fixed; inset:0; z-index:1000; display:grid; place-items:center;
          background:#000; transition:background .4s ease;
        }
        .finale.flash { background:#3b0a12; }
        .finale.celebrate {
          background:radial-gradient(ellipse at center, rgba(176,0,32,.35), #000 60%);
          overflow:auto; padding:1.5rem;
        }
        .confetti span {
          position:fixed; top:-12px; width:8px; height:14px; border-radius:2px;
          animation-name:fall; animation-timing-function:linear; animation-iteration-count:infinite;
          opacity:.9;
        }
        @keyframes fall {
          0% { transform:translateY(0) rotate(0deg); }
          100% { transform:translateY(110vh) rotate(520deg); }
        }
        .particles {
          position:fixed; inset:0; pointer-events:none;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(224,17,54,.35), transparent 18%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,.12), transparent 16%),
            radial-gradient(circle at 60% 70%, rgba(224,17,54,.25), transparent 22%);
          animation:glowPulse 3s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%,100% { opacity:.7; }
          50% { opacity:1; }
        }
        .finale .modal {
          position:relative; z-index:2; width:min(720px,100%);
          padding:1.5rem 1.4rem 1.2rem; border-radius:18px;
          border:1px solid rgba(224,17,54,.45);
          background:rgba(10,10,10,.82); backdrop-filter:blur(16px);
          box-shadow:0 0 60px rgba(176,0,32,.35);
          text-align:center;
        }
        .finale h2 {
          font-family:var(--font-display); font-size:clamp(1.4rem,4vw,2rem);
          margin:.35rem 0 .75rem; color:#fff;
        }
        .finale .typed { min-height:3.2em; color:var(--muted); margin-bottom:.75rem; }
        .trophy {
          font-size:3rem; animation:trophyPop 1.2s ease-in-out infinite;
          filter:drop-shadow(0 0 18px rgba(224,17,54,.65));
        }
        @keyframes trophyPop {
          0%,100% { transform:scale(1) rotate(-4deg); }
          50% { transform:scale(1.08) rotate(4deg); }
        }
        .title-line {
          font-family:var(--font-display); color:var(--red-bright);
          letter-spacing:.08em; margin:.5rem 0 1rem; font-size:1.1rem;
        }
        .skills-mini {
          list-style:none; margin:0 0 1rem; padding:0;
          display:grid; grid-template-columns:1fr 1fr; gap:.35rem; text-align:left;
          font-family:var(--font-mono); font-size:.78rem; color:var(--muted);
        }
        .stats {
          display:grid; grid-template-columns:repeat(2,1fr); gap:.55rem; margin-bottom:1rem;
        }
        .stats div {
          border:1px solid var(--border); border-radius:10px; padding:.65rem;
          background:rgba(255,255,255,.03);
        }
        .stats span { display:block; font-size:.68rem; color:var(--dim); text-transform:uppercase; letter-spacing:.06em; }
        .stats strong { font-family:var(--font-mono); color:#fff; font-size:1.05rem; }
        .actions { display:grid; gap:.45rem; }
        .finale .foot {
          display:flex; justify-content:center; gap:.5rem; flex-wrap:wrap; margin-top:.85rem;
        }
        @media (max-width:560px) {
          .skills-mini { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}
