(() => {
  (async () => {
    const cloud = await ACCAuth.requireCloudAuth();
    if (!cloud) return;
    const user = cloud.local;

    document.querySelectorAll("[data-admin-only]").forEach((el) => {
      el.hidden = !user.isAdmin;
    });

    let meRank = user.rank || null;
    try {
      const board = await ACCAuth.listLeaderboard();
      const me = board.find((r) => r.email && user.email && r.email.toLowerCase() === user.email.toLowerCase());
      if (me) meRank = me.computed_rank;
    } catch (_) {}

    const handle = user.hackerName || user.username || "student";
    const completed = user.completed || [];
    const cleared = completed.length;
    const remaining = Math.max(0, 9 - cleared);
    const pct = Math.min(100, Math.round((cleared / 9) * 100));

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
    document.getElementById("dashRank").textContent = meRank ? `#${meRank}` : "—";
    document.getElementById("dashScore").textContent = (user.score || 0).toLocaleString();
    document.getElementById("dashCleared").textContent = `${cleared}/9`;
    document.getElementById("dashRemaining").textContent = String(remaining);
    document.getElementById("dashPct").textContent = `${pct}%`;
    document.getElementById("dashTime").textContent = ACC.formatDuration?.(user.totalTimeSec || 0) || `${user.totalTimeSec || 0}s`;
    document.getElementById("dashHints").textContent = String(user.hintsUsed || 0);
    document.getElementById("dashProgress").style.width = `${pct}%`;
    document.getElementById("dashProgressLabel").textContent = `${pct}%`;
    document.getElementById("progressTitle").textContent = `${cleared}/9 Missions Completed`;

    const awardsEl = document.getElementById("dashAwards");
    const awards = user.awards || [];
    if (awards.length && window.ACCComp) {
      awardsEl.innerHTML = awards
        .map((a) => {
          const def = ACCComp.AWARDS[a];
          return `<span class="badge badge-red">${def ? `${def.icon} ${def.title}` : a}</span>`;
        })
        .join("");
    } else {
      awardsEl.innerHTML = `<span class="badge">${ACC.badgeFor(user.score || 0, cleared)}</span>`;
    }

    const activeMissions = await ACCAuth.listActiveMissions().catch(() => []);
    const continueBtn = document.getElementById("continueChallenge");
    if (continueBtn) {
      const next = activeMissions.find((m) => !completed.includes(m.id)) || activeMissions[0];
      continueBtn.href = next?.href || "challenges.html";
      continueBtn.textContent = next ? (cleared ? "Continue mission" : "Start mission") : "View missions";
    }

    ACC.typeTerminal(document.getElementById("dashTerm"), [
      `$ hello ${handle}`,
      `OK command center online`,
      `$ status`,
      `OK ${cleared}/9 missions · ${remaining} remaining`,
      `$ cyber_xp`,
      `OK ${(user.score || 0).toLocaleString()} XP_`,
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
        .map((w) => `<button class="week-tab ${w === week ? "active" : ""}" type="button" data-week="${w}">Week ${w}</button>`)
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
          const done = completed.includes(m.id);
          return `
        <a class="glass mission-card" href="${m.href}">
          <div class="meta">${statusBadge(done ? "completed" : "available")}<span class="badge">${m.difficulty}</span></div>
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
