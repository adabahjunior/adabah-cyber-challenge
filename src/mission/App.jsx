import { useEffect, useMemo, useState } from "react";
import MissionHeader from "./components/MissionHeader";
import EvidenceCard, { TypewriterCase } from "./components/EvidenceCard";
import TaskCard, { wordCount } from "./components/TaskCard";
import SubmissionPanel from "./components/SubmissionPanel";
import ScoreDisplay from "./components/ScoreDisplay";
import DebriefCard from "./components/DebriefCard";
import { MISSION_001 } from "./missions/mission001";

const STORAGE_KEY = "acc_mission_001_v1";

function scoreTask(task, value) {
  if (task.kind === "single") {
    const ok = value === task.correct;
    return { ok, points: ok ? task.points : 0 };
  }
  if (task.kind === "multi") {
    const selected = Array.isArray(value) ? [...value].sort() : [];
    const correct = [...task.correct].sort();
    const ok =
      selected.length === correct.length &&
      selected.every((v, i) => v === correct[i]);
    // Partial credit if mostly correct
    const hits = selected.filter((v) => correct.includes(v)).length;
    const extras = selected.filter((v) => !correct.includes(v)).length;
    const ratio = Math.max(0, hits - extras) / correct.length;
    const points = ok ? task.points : Math.round(task.points * ratio * 0.6);
    return { ok, points };
  }
  if (task.kind === "text") {
    const lines = String(value || "")
      .split(/\n|•|-|\d+\./)
      .map((l) => l.trim())
      .filter((l) => l.length > 8);
    const keywords = [
      "domain",
      "urgent",
      "password",
      "http",
      "secure",
      "reply",
      "gmail",
      "umat",
      "verify",
      "fake",
      "suspicious",
      "trust",
    ];
    const lower = String(value || "").toLowerCase();
    const keywordHits = keywords.filter((k) => lower.includes(k)).length;
    const ok = lines.length >= task.minReasons || (wordCount(value) >= 25 && keywordHits >= 2);
    const points = ok ? task.points : keywordHits >= 1 && wordCount(value) >= 15 ? Math.round(task.points * 0.4) : 0;
    return { ok, points };
  }
  if (task.kind === "essay") {
    const words = wordCount(value);
    if (words > task.maxWords) return { ok: false, points: 0 };
    const lower = String(value || "").toLowerCase();
    const good = ["report", "it", "delete", "ignore", "not click", "don't click", "do not click", "forward", "verify", "official", "phone", "tell"];
    const hits = good.filter((g) => lower.includes(g)).length;
    const ok = words >= task.minWords && hits >= 1;
    const points = ok ? task.points : words >= 12 ? Math.round(task.points * 0.35) : 0;
    return { ok, points };
  }
  return { ok: false, points: 0 };
}

export default function App() {
  const mission = MISSION_001;
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(mission.timeLimitSec);
  const [notes, setNotes] = useState({});
  const [answers, setAnswers] = useState({});
  const [taskResults, setTaskResults] = useState({});
  const [checkedTasks, setCheckedTasks] = useState({});
  const [submission, setSubmission] = useState({
    attackType: "",
    evidenceFound: "",
    actions: "",
  });
  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.completed) {
        setCompleted(true);
        setFinalScore(saved.finalScore || 0);
        setStarted(true);
        setAnswers(saved.answers || {});
        setTaskResults(saved.taskResults || {});
        setCheckedTasks(saved.checkedTasks || {});
        setSubmission(saved.submission || submission);
        setNotes(saved.notes || {});
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started || completed) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, completed]);

  useEffect(() => {
    if (started && remaining === 0 && !completed) {
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, started, completed]);

  const progress = useMemo(() => {
    if (completed) return 100;
    let p = started ? 10 : 0;
    const noteCount = Object.values(notes).filter((n) => String(n || "").trim().length > 10).length;
    p += Math.min(20, noteCount * 7);
    const answered = mission.tasks.filter((t) => {
      const v = answers[t.id];
      if (t.kind === "multi") return Array.isArray(v) && v.length > 0;
      return String(v || "").trim().length > 0;
    }).length;
    p += (answered / mission.tasks.length) * 50;
    if (submission.attackType) p += 5;
    if (String(submission.evidenceFound || "").trim().length > 20) p += 8;
    if (String(submission.actions || "").trim().length > 20) p += 7;
    return Math.min(95, Math.round(p));
  }, [started, completed, notes, answers, submission, mission.tasks]);

  function checkTask(taskId) {
    const task = mission.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const result = scoreTask(task, answers[taskId]);
    setTaskResults((prev) => ({ ...prev, [taskId]: result }));
    setCheckedTasks((prev) => ({ ...prev, [taskId]: true }));
  }

  function handleSubmit(auto = false) {
    if (completed) return;
    // Auto-check any unchecked tasks
    const results = { ...taskResults };
    mission.tasks.forEach((task) => {
      if (!results[task.id]) results[task.id] = scoreTask(task, answers[task.id]);
    });
    setTaskResults(results);
    setCheckedTasks(
      Object.fromEntries(mission.tasks.map((t) => [t.id, true]))
    );

    let score = mission.tasks.reduce((sum, t) => sum + (results[t.id]?.points || 0), 0);

    // Submission panel bonus / validation (up to remaining to cap 100)
    let submitBonus = 0;
    if (submission.attackType === "Phishing Attack") submitBonus += 10;
    else if (submission.attackType) submitBonus += 2;
    if (String(submission.evidenceFound || "").trim().length >= 40) submitBonus += 8;
    if (String(submission.actions || "").trim().length >= 30) submitBonus += 7;
    // Cap total at 100 — tasks already sum to 100, so treat submission as quality multiplier overlay:
    // Recalibrate: tasks are primary; submission quality can recover up to 15 if tasks missed
    const taskScore = score;
    const recovered = Math.min(15, submitBonus);
    score = Math.min(100, taskScore + (taskScore < 85 ? recovered : Math.min(5, submitBonus)));

    if (!auto && !submission.attackType) {
      alert("Choose an attack type before submitting your investigation.");
      return;
    }

    setFinalScore(score);
    setCompleted(true);
    const payload = {
      completed: true,
      finalScore: score,
      answers,
      taskResults: results,
      checkedTasks: Object.fromEntries(mission.tasks.map((t) => [t.id, true])),
      submission,
      notes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Mirror into ACC local profile if present
    try {
      const raw = localStorage.getItem("acc_participant_v1");
      if (raw) {
        const user = JSON.parse(raw);
        if (!user.completed?.includes("M01")) {
          user.completed = [...(user.completed || []), "M01"];
          user.score = (user.score || 0) + score;
          user.progress = Math.min(100, (user.progress || 0) + 10);
          localStorage.setItem("acc_participant_v1", JSON.stringify(user));
        }
      }
    } catch (_) {}
  }

  return (
    <>
      <div className="cyber-grid" aria-hidden="true" />
      <div className="mission-app">
        <div className="top-nav">
          <a className="brand" href="/">
            ADABAH <span>Cyber Challenge</span>
          </a>
          <a className="back-link" href="/dashboard.html">
            ← Dashboard
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
          }}
        />

        <section className="glass section reveal" style={{ padding: "1.25rem 1.3rem" }}>
          <p className="eyebrow">Case file</p>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>
            {mission.caseFile.heading}
          </h2>
          <TypewriterCase text={mission.caseFile.intro} active={started && !completed} />
          {!started && !completed && (
            <p className="mono" style={{ color: "var(--dim)", fontSize: "0.82rem", marginTop: "0.75rem" }}>
              Press Start Investigation to begin the timer and unlock tasks.
            </p>
          )}
        </section>

        <section className="section">
          <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div>
              <p className="eyebrow">Evidence room</p>
              <h2 style={{ fontSize: "1.15rem" }}>Inspect the clues</h2>
            </div>
          </div>
          <div className="stack">
            {mission.evidence.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                notes={notes[ev.id]}
                onNotesChange={(val) => setNotes((n) => ({ ...n, [ev.id]: val }))}
              />
            ))}
          </div>
        </section>

        <section className="section">
          <p className="eyebrow">Investigation tasks</p>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.85rem" }}>Answer as you investigate</h2>
          <div className="stack">
            {mission.tasks.map((task, i) => (
              <div key={task.id} className="stack" style={{ gap: "0.55rem" }}>
                <TaskCard
                  task={task}
                  index={i + 1}
                  locked={!started && !completed}
                  value={
                    answers[task.id] ?? (task.kind === "multi" ? [] : "")
                  }
                  onChange={(val) => setAnswers((a) => ({ ...a, [task.id]: val }))}
                  checked={!!checkedTasks[task.id]}
                  result={taskResults[task.id]}
                />
                {started && !completed && !checkedTasks[task.id] && (
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => checkTask(task.id)}
                  >
                    Check answer
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <SubmissionPanel
            attackType={submission.attackType}
            evidenceFound={submission.evidenceFound}
            actions={submission.actions}
            options={mission.tasks[0].options}
            disabled={!started || completed}
            onChange={(patch) => setSubmission((s) => ({ ...s, ...patch }))}
            onSubmit={() => handleSubmit(false)}
          />
        </section>

        <ScoreDisplay score={finalScore} visible={completed} />
        <DebriefCard skills={mission.skills} visible={completed} />
      </div>
    </>
  );
}
