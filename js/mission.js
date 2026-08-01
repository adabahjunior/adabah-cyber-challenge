(() => {
  const user = ACC.loadUser();
  document.getElementById("warnCount").textContent = `${user.warnings || 0} / 3`;

  ACC.typeTerminal(document.getElementById("missionTerm"), [
    "$ opening challenge M02",
    "OK practice space ready",
    "$ fair play check",
    "OK looking good_",
  ], 14);

  // 45 minute mission timer
  let remaining = 45 * 60;
  const total = remaining;
  const timerEl = document.getElementById("missionTimer");
  const bar = document.getElementById("timerBar");

  const tick = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    bar.style.width = `${(remaining / total) * 100}%`;
    if (remaining > 0) remaining -= 1;
  };
  tick();
  setInterval(tick, 1000);

  document.getElementById("flagForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const flag = document.getElementById("flag").value.trim();
    const msg = document.getElementById("flagMsg");
    if (flag === "ACC{footprint_mapped}") {
      msg.style.color = "var(--success)";
      msg.textContent = "Correct! +150 points added.";
      const u = ACC.loadUser();
      if (!u.completed.includes("M02")) {
        u.completed.push("M02");
        u.score += 150;
        u.progress = Math.min(100, u.progress + 10);
        ACC.saveUser(u);
      }
    } else {
      msg.style.color = "var(--red-bright)";
      msg.textContent = "Not quite. Try again — this attempt was logged for fair play.";
    }
  });
})();
