/** Sync mission completion to localStorage + Supabase. */
export async function syncMissionCompletion({
  missionId,
  score = 0,
  elapsed = 0,
  hintsUsed = 0,
}) {
  try {
    const raw = localStorage.getItem("acc_participant_v1");
    if (raw) {
      const user = JSON.parse(raw);
      if (!user.completed?.includes(missionId)) {
        user.completed = [...(user.completed || []), missionId];
        user.score = (user.score || 0) + score;
        user.progress = Math.min(100, Math.round(((user.completed.length || 0) / 9) * 100));
        user.hintsUsed = (user.hintsUsed || 0) + hintsUsed;
        user.totalTimeSec = (user.totalTimeSec || 0) + elapsed;
        if (missionId === "M09") {
          user.finalMissionScore = score;
          user.competitionCompletedAt = new Date().toISOString();
          user.badge = "ADABAH Cyber Champion";
        }
        localStorage.setItem("acc_participant_v1", JSON.stringify(user));
      }
    }
  } catch (_) {}

  try {
    if (window.ACCAuth?.recordMissionComplete) {
      await window.ACCAuth.recordMissionComplete({
        missionId,
        score,
        elapsedSec: elapsed,
        hintsUsed,
      });
    }
  } catch (err) {
    console.warn("Cloud mission sync failed", err?.message || err);
  }
}
