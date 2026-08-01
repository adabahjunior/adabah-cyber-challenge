import { useEffect, useMemo, useState } from "react";
import MissionHeader from "../mission/components/MissionHeader";
import { TypewriterCase } from "../mission/components/EvidenceCard";
import ScoreDisplay from "../mission/components/ScoreDisplay";
import DebriefCard from "../mission/components/DebriefCard";
import InvestigationToolkit from "../mission002/components/InvestigationToolkit";
import FlagSubmit from "../mission002/components/FlagSubmit";
import { MISSION_003 } from "../mission/missions/mission003";
import NetworkMapViewer from "./components/NetworkMapViewer";
import NetworkLogViewer from "./components/NetworkLogViewer";
import DeviceInspector from "./components/DeviceInspector";
import SocChatViewer from "./components/SocChatViewer";
import FinalInvestigation from "./components/FinalInvestigation";
import { syncMissionCompletion } from "../mission/lib/syncCompletion";
import "../mission/styles/mission.css";
import "../mission002/styles.css";
import "./styles.css";

const STORAGE_KEY = "acc_mission_003_v1";

function normalizeFlag(input) {
  return String(input || "").trim();
}

export default function App() {
  const mission = { ...MISSION_003, startLabel: "Begin Investigation" };
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(mission.timeLimitSec);
  const [elapsed, setElapsed] = useState(0);
  const [openedEvidence, setOpenedEvidence] = useState({});
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [verified, setVerified] = useState({});
  const [reportSolved, setReportSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintIds, setHintIds] = useState([]);
  const [activeHint, setActiveHint] = useState("");
  const [notebook, setNotebook] = useState("");
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [completionMeta, setCompletionMeta] = useState(null);
  const [showCompleteAnim, setShowCompleteAnim] = useState(false);
  const [missionStatus, setMissionStatus] = useState("STANDBY");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      setStarted(Boolean(saved.started));
      setRemaining(saved.remaining ?? mission.timeLimitSec);
      setElapsed(saved.elapsed || 0);
      setOpenedEvidence(saved.openedEvidence || {});
      setVerified(saved.verified || {});
      setReportSolved(Boolean(saved.reportSolved));
      setHintsUsed(saved.hintsUsed || 0);
      setHintIds(saved.hintIds || []);
      setNotebook(saved.notebook || "");
      setCompleted(Boolean(saved.completed));
      setFinalScore(saved.finalScore || 0);
      setCompletionMeta(saved.completionMeta || null);
      setMissionStatus(saved.missionStatus || (saved.completed ? "THREAT CONTAINED" : saved.started ? "INVESTIGATING" : "STANDBY"));
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!started || completed) return;
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [started, completed]);

  const verifiedCount = useMemo(
    () => mission.flags.filter((f) => verified[f.id]).length,
    [mission.flags, verified]
  );

  const fourFlagsDone = ["F1", "F2", "F3", "F4"].every((id) => verified[id]);

  const progress = useMemo(() => {
    if (completed) return 100;
    let p = started ? 8 : 0;
    p += Object.keys(openedEvidence).length * 8;
    p += verifiedCount * 14;
    if (reportSolved) p += 8;
    return Math.min(96, Math.round(p));
  }, [started, completed, openedEvidence, verifiedCount, reportSolved]);

  useEffect(() => {
    if (!started) return;
    const payload = {
      started,
      remaining,
      elapsed,
      openedEvidence,
      verified,
      reportSolved,
      hintsUsed,
      hintIds,
      notebook,
      completed,
      finalScore,
      completionMeta,
      missionStatus,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    started,
    remaining,
    elapsed,
    openedEvidence,
    verified,
    reportSolved,
    hintsUsed,
    hintIds,
    notebook,
    completed,
    finalScore,
    completionMeta,
    missionStatus,
  ]);

  function openEvidence(id) {
    setActiveEvidence(id);
    setOpenedEvidence((prev) => ({ ...prev, [id]: true }));
  }

  function verifyFlag(flagId, input) {
    const def = mission.flags.find((f) => f.id === flagId);
    if (!def || verified[flagId]) return false;
    if (def.requires && !def.requires.every((id) => verified[id])) return false;
    const ok = normalizeFlag(input) === def.correct;
    if (!ok) return false;
    setVerified((prev) => {
      const next = { ...prev, [flagId]: true };
      const allDone = mission.flags.every((f) => next[f.id]);
      if (allDone) setTimeout(() => completeMission(next), 250);
      return next;
    });
    return true;
  }

  function useHint() {
    if (!started || completed) return;
    if (hintsUsed >= mission.maxHints) {
      setActiveHint("No hints remaining.");
      return;
    }
    const next = mission.flags.find((f) => !verified[f.id] && !hintIds.includes(f.id));
    if (!next) {
      setActiveHint("All available hints already used.");
      return;
    }
    setHintIds((ids) => [...ids, next.id]);
    setHintsUsed((n) => n + 1);
    setActiveHint(`Task ${next.task}: ${next.hint}`);
  }

  function completeMission(verifiedMap = verified) {
    if (completed) return;
    const base = mission.flags.reduce((sum, f) => sum + (verifiedMap[f.id] ? f.points : 0), 0);
    const hintPenalty = hintsUsed * mission.hintPenalty;
    let bonus = 0;
    if (hintsUsed === 0) bonus += mission.bonusNoHints;
    if (elapsed > 0 && elapsed <= mission.bonusFastMinutes * 60) bonus += mission.bonusFastPoints;
    const score = Math.max(0, base - hintPenalty + bonus);
    const meta = {
      base,
      bonus,
      hintPenalty,
      elapsed,
      hintsUsed,
      flagsRecovered: mission.flags.filter((f) => verifiedMap[f.id]).length,
      accuracy: Math.round((mission.flags.filter((f) => verifiedMap[f.id]).length / mission.flags.length) * 100),
    };
    setFinalScore(score);
    setCompletionMeta(meta);
    setCompleted(true);
    setMissionStatus("THREAT CONTAINED");
    setShowCompleteAnim(true);
    setTimeout(() => setShowCompleteAnim(false), 4200);

    void syncMissionCompletion({
      missionId: "M03",
      score,
      elapsed,
      hintsUsed,
    });
  }

  const activeEv = mission.evidence.find((e) => e.id === activeEvidence);

  return (
    <>
      <div className="cyber-grid" aria-hidden="true" />
      {showCompleteAnim ? (
        <div className="complete-overlay">
          <div className="complete-burst">
            <p className="eyebrow">Mission complete</p>
            <h2>CASE STATUS · THREAT CONTAINED</h2>
            <p className="mono">THE NETWORK INTRUDER</p>
          </div>
        </div>
      ) : null}

      <div className="mission-app mission-002 mission-003">
        <div className="top-nav">
          <a className="brand" href="/">
            ADABAH <span>Cyber Challenge</span>
          </a>
          <a className="back-link" href="/challenges.html">
            ← Challenges
          </a>
        </div>

        <MissionHeader
          mission={mission}
          started={started}
          remaining={remaining}
          progress={progress}
          onStart={() => {
            setStarted(true);
            setRemaining(mission.timeLimitSec);
            setElapsed(0);
            setMissionStatus("INVESTIGATING");
          }}
        />

        <section className="glass section" style={{ padding: "1.25rem 1.3rem", marginTop: "1rem" }}>
          <p className="eyebrow">Case file</p>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>{mission.caseFile.heading}</h2>
          <TypewriterCase text={mission.caseFile.intro} active={started && !completed} />
          {!started ? (
            <p className="mono dim" style={{ marginTop: "0.75rem", fontSize: "0.82rem" }}>
              Click Begin Investigation to enter the Network Operations Center.
            </p>
          ) : (
            <ul className="obj-list">
              {mission.objectives.map((o) => (
                <li key={o}>✓ {o}</li>
              ))}
            </ul>
          )}
        </section>

        <div className="m2-layout">
          <div className="m2-main stack">
            <section className="section">
              <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.85rem" }}>
                <div>
                  <p className="eyebrow">Network Operations Center</p>
                  <h2 style={{ fontSize: "1.15rem" }}>SOC evidence board</h2>
                </div>
                <span className={`badge ${completed ? "badge-green" : "badge-red"}`}>{missionStatus}</span>
              </div>
              <div className="evidence-grid">
                {mission.evidence.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className={`glass evidence-tile ${activeEvidence === ev.id ? "active" : ""}`}
                    disabled={!started}
                    onClick={() => openEvidence(ev.id)}
                  >
                    <p className="eyebrow">Evidence {ev.id}</p>
                    <div className="mono" style={{ fontSize: "0.95rem" }}>{ev.title}</div>
                    <p className="muted" style={{ marginTop: "0.45rem", fontSize: "0.86rem" }}>{ev.description}</p>
                    <span className="badge badge-red" style={{ marginTop: "0.7rem" }}>
                      {openedEvidence[ev.id] ? "Opened" : "Open evidence"}
                    </span>
                  </button>
                ))}
              </div>

              {started && activeEv ? (
                <div className="glass evidence-stage" style={{ marginTop: "1rem", padding: "1.1rem" }}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.85rem" }}>
                    <div>
                      <p className="eyebrow">Viewer</p>
                      <h3 style={{ fontSize: "1rem" }}>{activeEv.title}</h3>
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setActiveEvidence(null)}>
                      Close viewer
                    </button>
                  </div>
                  {activeEv.type === "map" && <NetworkMapViewer />}
                  {activeEv.type === "logs" && <NetworkLogViewer />}
                  {activeEv.type === "devices" && <DeviceInspector />}
                  {activeEv.type === "chat" && <SocChatViewer />}
                </div>
              ) : null}
            </section>

            <section className="section stack">
              <p className="eyebrow">Flag submissions</p>
              <h2 style={{ fontSize: "1.15rem" }}>Recover and verify</h2>
              {mission.flags
                .filter((f) => f.id !== "F5")
                .map((f) => (
                  <FlagSubmit
                    key={f.id}
                    flagDef={f}
                    verified={Boolean(verified[f.id])}
                    disabled={!started || completed}
                    onVerify={(val) => verifyFlag(f.id, val)}
                  />
                ))}
            </section>

            <section className="section">
              <FinalInvestigation
                config={mission.finalReport}
                locked={!fourFlagsDone}
                solved={reportSolved || Boolean(verified.F5)}
                onSolved={() => setReportSolved(true)}
              />
              {(reportSolved || fourFlagsDone) && (
                <div style={{ marginTop: "0.85rem" }}>
                  <FlagSubmit
                    flagDef={mission.flags.find((f) => f.id === "F5")}
                    verified={Boolean(verified.F5)}
                    disabled={!started || completed || !reportSolved}
                    onVerify={(val) => verifyFlag("F5", val)}
                  />
                </div>
              )}
            </section>

            {completed && completionMeta ? (
              <section className="glass" style={{ padding: "1.25rem 1.3rem" }}>
                <p className="eyebrow">Case summary</p>
                <h2 style={{ fontSize: "1.2rem" }}>MISSION COMPLETE</h2>
                <p className="mono" style={{ color: "var(--red-bright)", marginTop: "0.35rem" }}>
                  CASE STATUS · Threat Contained
                </p>
                <div className="summary-grid">
                  <div><span>Final score</span><strong>{finalScore}</strong></div>
                  <div><span>Time taken</span><strong>{Math.floor(completionMeta.elapsed / 60)}m {completionMeta.elapsed % 60}s</strong></div>
                  <div><span>Flags recovered</span><strong>{completionMeta.flagsRecovered}/5</strong></div>
                  <div><span>Hints used</span><strong>{completionMeta.hintsUsed}</strong></div>
                  <div><span>Rank points earned</span><strong>{finalScore}</strong></div>
                  <div><span>Accuracy</span><strong>{completionMeta.accuracy}%</strong></div>
                </div>
              </section>
            ) : null}

            <ScoreDisplay score={finalScore} max={120} visible={completed} />
            <DebriefCard
              visible={completed}
              title="MISSION DEBRIEF"
              badge={mission.badge}
              skills={mission.skills}
            />
          </div>

          <div className="toolkit-wrap">
            <div className="glass panel status-chip">
              <div className="mono dim" style={{ fontSize: "0.68rem" }}>MISSION STATUS</div>
              <div className="mono" style={{ color: "var(--red-bright)", marginTop: "0.25rem" }}>{missionStatus}</div>
            </div>
            <InvestigationToolkit
              remaining={remaining}
              progress={progress}
              evidence={mission.evidence}
              openedEvidence={openedEvidence}
              verifiedFlags={verifiedCount}
              notebook={notebook}
              onNotebook={setNotebook}
              hintsUsed={hintsUsed}
              maxHints={mission.maxHints}
              onHint={useHint}
              activeHint={activeHint}
            />
          </div>
        </div>
      </div>
    </>
  );
}
