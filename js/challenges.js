(() => {
  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  function statusFor(mission, completed) {
    if ((completed || []).includes(mission.id)) return "completed";
    return "available";
  }

  function badge(status) {
    if (status === "completed") return '<span class="badge badge-green">Completed</span>';
    return '<span class="badge badge-red">Available</span>';
  }

  function renderMissionCard(mission, completed) {
    const status = statusFor(mission, completed);
    const href = mission.href || "#";
    return `
      <a class="glass mission-card" href="${escapeHtml(href)}">
        <div class="meta">${badge(status)}<span class="badge">${escapeHtml(mission.difficulty)}</span></div>
        <div class="title">${escapeHtml(mission.id)} · ${escapeHtml(mission.title)}</div>
        <p class="muted" style="font-size:.9rem">${escapeHtml(mission.category || "Challenge")} · Week ${mission.week}</p>
        <div class="footer">
          <span class="pts">${Number(mission.points || 0)} PTS</span>
          <span class="mono dim" style="font-size:.75rem">${status === "completed" ? "REVIEW →" : "OPEN →"}</span>
        </div>
      </a>`;
  }

  (async () => {
    const cloud = await ACCAuth.requireCloudAuth();
    if (!cloud) return;
    const completed = cloud.local.completed || [];
    const root = document.getElementById("challengeWeeks");

    let missions = [];
    try {
      missions = await ACCAuth.listActiveMissions();
    } catch (err) {
      console.error(err);
      root.innerHTML = `<div class="glass panel"><p class="muted">Could not load challenges. Refresh and try again.</p></div>`;
      return;
    }

    if (!missions.length) {
      root.innerHTML = `<div class="glass panel-lg"><p class="eyebrow">No live missions</p><p class="muted" style="margin-top:.6rem">No challenges are active yet. Check back after your admin opens a mission.</p></div>`;
      return;
    }

    const weeks = [...new Set(missions.map((m) => Number(m.week) || 1))].sort((a, b) => a - b);
    root.innerHTML = weeks
      .map((week) => {
        const list = missions.filter((m) => Number(m.week) === week);
        return `
          <section>
            <div class="section-head" style="margin-bottom:.85rem">
              <div>
                <p class="eyebrow">Assigned week</p>
                <h2 style="font-size:1.2rem">Week ${week}</h2>
              </div>
              <span class="badge">${list.length} mission${list.length === 1 ? "" : "s"}</span>
            </div>
            <div class="mission-grid">
              ${list.map((m) => renderMissionCard(m, completed)).join("")}
            </div>
          </section>`;
      })
      .join("");
  })().catch((err) => {
    console.error(err);
    location.href = "login.html";
  });
})();
