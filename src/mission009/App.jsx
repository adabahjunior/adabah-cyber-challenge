import { useEffect, useMemo, useState } from "react";
import MissionHeader from "../mission/components/MissionHeader";
import { TypewriterCase } from "../mission/components/EvidenceCard";
import ScoreDisplay from "../mission/components/ScoreDisplay";
import DebriefCard from "../mission/components/DebriefCard";
import InvestigationToolkit from "../mission002/components/InvestigationToolkit";
import FlagSubmit from "../mission002/components/FlagSubmit";
import ThreatLevelIndicator from "../mission007/components/ThreatLevelIndicator";
import { MISSION_009 } from "../mission/missions/mission009";
import RecoveredArchive from "./components/RecoveredArchive";
import CommunicationLog from "./components/CommunicationLog";
import NetworkEvidence from "./components/NetworkEvidence";
import RecoveredCredentials from "./components/RecoveredCredentials";
import EvidenceBoard from "./components/EvidenceBoard";
import RecoveryChecklist from "./components/RecoveryChecklist";
import FinalIncidentReport from "./components/FinalIncidentReport";
import ChampionFinale from "./components/ChampionFinale";
import "../mission/styles/mission.css";
import "../mission002/styles.css";
import "./styles.css";

const STORAGE_KEY = "acc_mission_009_v1";

function normalizeFlag(input) {
  return String(input || "").trim();
}

export default function App() {
  const mission = MISSION_009;
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
  const [showFinale, setShowFinale] = useState(false);
  const [muted, setMuted] = useState(false);
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
      setMuted(Boolean(saved.muted));
      setMissionStatus(
        saved.missionStatus ||
          (saved.completed ? "OPERATION COMPLETE" : saved.started ? "FINAL OPS" : "STANDBY")
      );
      if (saved.completed) setShowFinale(true);
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

  const sixFlagsDone = ["F1", "F2", "F3", "F4", "F5", "F6"].every((id) => verified[id]);

  const threatLevel = useMemo(() => {
    if (completed) return "SECURE";
    if (verifiedCount >= 5) return "HIGH";
    if (started) return "CRITICAL";
    return "ELEVATED";
  }, [completed, verifiedCount, started]);

  const progress = useMemo(() => {
    if (completed) return 100;
    let p = started ? 5 : 0;
    p += Object.keys(openedEvidence).length * 5;
    p += verifiedCount * 10;
    if (reportSolved) p += 8;
    return Math.min(96, Math.round(p));
  }, [started, completed, openedEvidence, verifiedCount, reportSolved]);

  useEffect(() => {
    if (!started) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
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
        muted,
      })
    );
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
    muted,
  ]);

  function openEvidence(id) {
    if (completed) return;
    setActiveEvidence(id);
    setOpenedEvidence((prev) => ({ ...prev, [id]: true }));
  }

  function verifyFlag(flagId, input) {
    if (completed) return false;
    const def = mission.flags.find((f) => f.id === flagId);
    if (!def || verified[flagId]) return false;
    if (def.requires && !def.requires.every((id) => verified[id])) return false;
    const ok = normalizeFlag(input) === def.correct;
    if (!ok) return false;
    setVerified((prev) => {
      const next = { ...prev, [flagId]: true };
      const allDone = mission.flags.every((f) => next[f.id]);
      if (allDone) setTimeout(() => completeMission(next), 300);
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
    };
    setFinalScore(score);
    setCompletionMeta(meta);
    setCompleted(true);
    setMissionStatus("OPERATION COMPLETE");
    setActiveEvidence(null);
    setShowFinale(true);

    try {
      const raw = localStorage.getItem("acc_participant_v1");
      if (raw) {
        const user = JSON.parse(raw);
        if (!user.completed?.includes("M09")) {
          user.completed = [...(user.completed || []), "M09"];
          user.score = (user.score || 0) + score;
          user.progress = 100;
          user.badge = "ADABAH Cyber Champion";
          localStorage.setItem("acc_participant_v1", JSON.stringify(user));
        }
      }
    } catch (_) {}
  }

  const activeEv = mission.evidence.find((e) => e.id === activeEvidence);
  const flagProps = {
    okLabel: "✔ Flag Verified",
    buttonLabel: "Verify",
    placeholder: "BLACKOUT{...}",
  };

  return (
    <>
      <div className="cyber-grid" aria-hidden="true" />
      <ChampionFinale
        visible={showFinale}
        score={finalScore}
        elapsed={completionMeta?.elapsed || elapsed}
        flagsRecovered={completionMeta?.flagsRecovered || verifiedCount}
        totalFlags={mission.flags.length}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onClose={() => setShowFinale(false)}
      />

      <div className={`mission-app mission-002 mission-009 ${completed ? "locked" : ""}`}>
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
            if (completed) return;
            setStarted(true);
            setRemaining(mission.timeLimitSec);
            setElapsed(0);
            setMissionStatus("FINAL OPS");
          }}
        />

        <section className="glass section priority-alert" style={{ padding: "1.25rem 1.3rem", marginTop: "1rem" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.65rem" }}>
            <p className="eyebrow">ACRT · Capstone</p>
            <span className="badge badge-red">
              {mission.series.name} · FINAL
            </span>
          </div>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.35rem" }}>🚨 {mission.caseFile.heading}</h2>
          <p className="mono dim" style={{ marginBottom: "0.75rem", fontSize: "0.82rem" }}>
            {mission.subtitle} · Classification MISSION CRITICAL
          </p>
          <TypewriterCase text={mission.caseFile.intro} active={started && !completed} />
          {!started ? (
            <p className="mono dim" style={{ marginTop: "0.75rem", fontSize: "0.82rem" }}>
              Click BEGIN FINAL OPERATION to enter the Final Command Center.
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
                  <p className="eyebrow">Final Command Center</p>
                  <h2 style={{ fontSize: "1.15rem" }}>Capstone evidence suite</h2>
                </div>
                <span className={`badge ${completed ? "badge-green" : "badge-red"}`}>{missionStatus}</span>
              </div>
              <div className="evidence-grid six">
                {mission.evidence.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className={`glass evidence-tile ${activeEvidence === ev.id ? "active" : ""}`}
                    disabled={!started || completed}
                    onClick={() => openEvidence(ev.id)}
                  >
                    <p className="eyebrow">Evidence {ev.id}</p>
                    <div className="mono" style={{ fontSize: "0.92rem" }}>
                      {ev.title}
                    </div>
                    <p className="muted" style={{ marginTop: "0.45rem", fontSize: "0.84rem" }}>
                      {ev.description}
                    </p>
                    <span className="badge badge-red" style={{ marginTop: "0.7rem" }}>
                      {openedEvidence[ev.id] ? "Opened" : "Open module"}
                    </span>
                  </button>
                ))}
              </div>

              {started && activeEv && !completed ? (
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
                  {activeEv.type === "archive" && <RecoveredArchive />}
                  {activeEv.type === "comms" && <CommunicationLog />}
                  {activeEv.type === "network" && <NetworkEvidence />}
                  {activeEv.type === "identity" && <RecoveredCredentials />}
                  {activeEv.type === "board" && <EvidenceBoard />}
                  {activeEv.type === "checklist" && <RecoveryChecklist />}
                </div>
              ) : null}
            </section>

            <section className="section stack">
              <p className="eyebrow">Flag submissions</p>
              <h2 style={{ fontSize: "1.15rem" }}>Recover every piece of evidence</h2>
              {mission.flags
                .filter((f) => f.id !== "F7")
                .map((f) => (
                  <FlagSubmit
                    key={f.id}
                    flagDef={f}
                    verified={Boolean(verified[f.id])}
                    disabled={!started || completed}
                    onVerify={(val) => verifyFlag(f.id, val)}
                    {...flagProps}
                  />
                ))}
            </section>

            <section className="section">
              <FinalIncidentReport
                config={mission.finalReport}
                locked={!sixFlagsDone}
                solved={reportSolved || Boolean(verified.F7)}
                onSolved={() => setReportSolved(true)}
              />
              {(reportSolved || sixFlagsDone) && (
                <div style={{ marginTop: "0.85rem" }}>
                  <FlagSubmit
                    flagDef={mission.flags.find((f) => f.id === "F7")}
                    verified={Boolean(verified.F7)}
                    disabled={!started || completed || !reportSolved}
                    onVerify={(val) => verifyFlag("F7", val)}
                    {...flagProps}
                  />
                </div>
              )}
            </section>

            {completed && completionMeta ? (
              <section className="glass" style={{ padding: "1.25rem 1.3rem" }}>
                <p className="eyebrow">Competition complete</p>
                <h2 style={{ fontSize: "1.2rem" }}>MISSION COMPLETE</h2>
                <p className="mono" style={{ color: "var(--red-bright)", marginTop: "0.35rem" }}>
                  You have completed every mission in the ADABAH Cyber Challenge.
                </p>
                <div className="summary-grid">
                  <div>
                    <span>Final score</span>
                    <strong>{finalScore}</strong>
                  </div>
                  <div>
                    <span>Completion time</span>
                    <strong>
                      {Math.floor(completionMeta.elapsed / 60)}m {completionMeta.elapsed % 60}s
                    </strong>
                  </div>
                  <div>
                    <span>Flags recovered</span>
                    <strong>
                      {completionMeta.flagsRecovered}/{mission.flags.length}
                    </strong>
                  </div>
                  <div>
                    <span>Hints used</span>
                    <strong>{completionMeta.hintsUsed}</strong>
                  </div>
                  <div>
                    <span>Threat status</span>
                    <strong>SECURE</strong>
                  </div>
                  <div>
                    <span>Badge</span>
                    <strong>Champion</strong>
                  </div>
                </div>
                <div className="continued-card">
                  <p className="eyebrow">Keep going</p>
                  <h3>Keep learning. Keep building. Stay curious.</h3>
                  <p className="muted">The best defenders never stop improving.</p>
                  <button type="button" className="btn btn-primary" style={{ marginTop: "0.85rem" }} onClick={() => setShowFinale(true)}>
                    Replay congratulations
                  </button>
                </div>
              </section>
            ) : null}

            <ScoreDisplay score={finalScore} max={180} visible={completed} />
            <DebriefCard
              visible={completed}
              title="MISSION COMPLETE"
              badge={`🏆 ${mission.badge}`}
              skills={mission.skills}
            />
          </div>

          <div className="toolkit-wrap">
            <div className="glass panel status-chip">
              <div className="mono dim" style={{ fontSize: "0.68rem" }}>
                THREAT STATUS
              </div>
              <div style={{ marginTop: "0.45rem" }}>
                <ThreatLevelIndicator level={threatLevel === "SECURE" ? "LOW" : threatLevel} />
              </div>
              <div className="mono dim" style={{ fontSize: "0.68rem", marginTop: "0.75rem" }}>
                MISSION STATUS
              </div>
              <div className="mono" style={{ color: "var(--red-bright)", marginTop: "0.2rem" }}>
                {missionStatus}
              </div>
            </div>
            <InvestigationToolkit
              remaining={remaining}
              progress={progress}
              evidence={mission.evidence}
              openedEvidence={openedEvidence}
              verifiedFlags={verifiedCount}
              totalFlags={mission.flags.length}
              notebook={notebook}
              onNotebook={(v) => {
                if (!completed) setNotebook(v);
              }}
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
