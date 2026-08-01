(() => {
  (async () => {
    const cloud = await ACCAuth.requireCloudAuth();
    if (!cloud) return;
    const user = cloud.local;

    document.querySelectorAll("[data-admin-only]").forEach((el) => {
      el.hidden = !user.isAdmin;
    });

    const handle = user.hackerName || user.username || "student";
    const dashAvatar = document.getElementById("dashAvatar");
    if (user.portraitUrl) {
      dashAvatar.classList.add("has-photo");
      dashAvatar.innerHTML = `<img src="${user.portraitUrl}" alt="">`;
    } else {
      dashAvatar.textContent = user.avatar || ACC.initials(handle);
    }
    ACCAvatars.mount(document.getElementById("dashAnim"), user.avatarStyle || "pulse", "lg");
    document.getElementById("dashName").textContent = `@${handle}`;
    document.getElementById("dashMeta").textContent = `${user.level || "Beginner"} · ${user.department || "Student"}`;
    document.getElementById("dashRank").textContent = user.rank ? `#${user.rank}` : "—";
    document.getElementById("dashScore").textContent = (user.score || 0).toLocaleString();

    const activeMissions = await ACCAuth.listActiveMissions().catch(() => []);
    const totalLive = activeMissions.length;
    const clearedLive = activeMissions.filter((m) => (user.completed || []).includes(m.id)).length;
    document.getElementById("dashCleared").textContent = `${clearedLive}/${totalLive || 0}`;
    const progress = totalLive ? Math.round((clearedLive / totalLive) * 100) : 0;
    document.getElementById("dashProgress").style.width = `${progress}%`;
    document.getElementById("dashProgressLabel").textContent = `${progress}%`;

    const continueBtn = document.getElementById("continueChallenge");
    if (continueBtn) {
      const next = activeMissions.find((m) => !(user.completed || []).includes(m.id)) || activeMissions[0];
      continueBtn.href = next?.href || "challenges.html";
      continueBtn.textContent = next ? (clearedLive ? "Continue challenge" : "Start challenge") : "View challenges";
    }

    ACC.typeTerminal(document.getElementById("dashTerm"), [
      `$ hello ${handle}`,
      `OK welcome back`,
      `$ live missions`,
      `OK ${totalLive} active this season`,
      `$ fair play warnings`,
      `OK ${user.warnings || 0} of 3_`,
    ], 12);

    const weekTabs = document.getElementById("weekTabs");
    const grid = document.getElementById("missionGrid");
    const weeks = [...new Set(activeMissions.map((m) => Number(m.week) || 1))].sort((a, b) => a - b);
    let week = weeks[0] || 1;

    function statusBadge(status) {
      if (status === "completed") return '<span class="badge badge-green">Completed</span>';
      return '<span class="badge badge-red">Available</span>';
    }

    function renderWeekTabs() {
      if (!weeks.length) {
        weekTabs.innerHTML = "";
        return;
      }
      weekTabs.innerHTML = weeks
        .map(
          (w) =>
            `<button class="week-tab ${w === week ? "active" : ""}" type="button" data-week="${w}">Week ${w}</button>`
        )
        .join("");
    }

    function renderMissions() {
      const list = activeMissions.filter((m) => Number(m.week) === week);
      if (!activeMissions.length) {
        grid.innerHTML = `<div class="glass panel"><p class="muted">No missions are active yet. Your admin will open challenges by week.</p></div>`;
        return;
      }
      if (!list.length) {
        grid.innerHTML = `<div class="glass panel"><p class="muted">No active missions for week ${week}.</p></div>`;
        return;
      }
      grid.innerHTML = list
        .map((m) => {
          const done = (user.completed || []).includes(m.id);
          const status = done ? "completed" : "available";
          return `
        <a class="glass mission-card" href="${m.href}">
          <div class="meta">${statusBadge(status)}<span class="badge">${m.difficulty}</span></div>
          <div class="title">${m.id} · ${m.title}</div>
          <p class="muted" style="font-size:.9rem">${m.category} · Week ${m.week}</p>
          <div class="footer">
            <span class="pts">${m.points} PTS</span>
            <span class="mono dim" style="font-size:.75rem">${done ? "REVIEW →" : "OPEN →"}</span>
          </div>
        </a>`;
        })
        .join("");
    }

    weekTabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-week]");
      if (!btn) return;
      week = Number(btn.dataset.week);
      renderWeekTabs();
      renderMissions();
    });

    renderWeekTabs();
    renderMissions();

    const tbody = document.querySelector("#lbPreview tbody");
    tbody.innerHTML = "";
    try {
      const board = await ACCAuth.listLeaderboard();
      const top = board.slice(0, 5);
      if (!top.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="muted">No scores yet — be the first on the board.</td></tr>`;
      } else {
        top.forEach((row) => {
          const tr = document.createElement("tr");
          if (row.computed_rank <= 3) tr.classList.add("top");
          const isSelf = row.email && user.email && row.email.toLowerCase() === user.email.toLowerCase();
          if (isSelf) tr.style.background = "rgba(176,0,32,0.12)";
          const avatar = row.portrait_url
            ? `<span class="avatar has-photo"><img src="${row.portrait_url}" alt=""></span>`
            : `<span class="avatar">${ACC.initials(row.handle)}</span>`;
          tr.innerHTML = `
          <td class="rank">#${row.computed_rank}</td>
          <td><span class="user-chip">${avatar}<span class="mono">${row.handle}${isSelf ? " (you)" : ""}</span></span></td>
          <td class="mono">${Number(row.score || 0).toLocaleString()}</td>
          <td><span class="badge badge-red">${row.badge}</span></td>`;
          tbody.appendChild(tr);
        });

        const me = board.find((r) => r.email && user.email && r.email.toLowerCase() === user.email.toLowerCase());
        if (me) {
          document.getElementById("dashRank").textContent = `#${me.computed_rank}`;
        }
      }
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="4" class="muted">Leaderboard unavailable.</td></tr>`;
    }
  })().catch((err) => {
    console.error(err);
    location.href = "login.html";
  });
})();
