(() => {
  (async () => {
    const cloud = await ACCAuth.requireCloudAuth();
    if (!cloud) return;
    const user = cloud.local;

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
    document.getElementById("dashCleared").textContent = `${user.completed?.length || 0}/10`;
    document.getElementById("dashProgress").style.width = `${user.progress || 0}%`;
    document.getElementById("dashProgressLabel").textContent = `${user.progress || 0}%`;

    ACC.typeTerminal(document.getElementById("dashTerm"), [
      `$ hello ${handle}`,
      `OK welcome back`,
      `$ week 1 status`,
      `OK challenges are open`,
      `$ fair play warnings`,
      `OK ${user.warnings || 0} of 3_`,
    ], 12);

    let week = 1;
    const grid = document.getElementById("missionGrid");

    function statusBadge(status) {
      if (status === "completed") return '<span class="badge badge-green">Completed</span>';
      if (status === "available") return '<span class="badge badge-red">Available</span>';
      return '<span class="badge badge-locked">Locked</span>';
    }

    function renderMissions() {
      const list = ACC.MISSIONS[week] || [];
      grid.innerHTML = list
        .map((m) => {
          const locked = m.status === "locked";
          const href = locked ? "#" : `mission.html?id=${m.id}`;
          return `
        <a class="glass mission-card ${locked ? "locked" : ""}" href="${href}">
          <div class="meta">${statusBadge(m.status)}<span class="badge">${m.diff}</span></div>
          <div class="title">${m.id} · ${m.title}</div>
          <p class="muted" style="font-size:.9rem">Week ${week} challenge</p>
          <div class="footer">
            <span class="pts">${m.pts} PTS</span>
            <span class="mono dim" style="font-size:.75rem">${locked ? "LOCKED" : "OPEN →"}</span>
          </div>
        </a>`;
        })
        .join("");
    }

    document.getElementById("weekTabs").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-week]");
      if (!btn) return;
      week = Number(btn.dataset.week);
      document.querySelectorAll(".week-tab").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      renderMissions();
    });

    const tbody = document.querySelector("#lbPreview tbody");
    ACC.LEADERBOARD.slice(0, 5).forEach((row) => {
      const tr = document.createElement("tr");
      if (row.rank <= 3) tr.classList.add("top");
      const copy = { ...row };
      if (copy.self) {
        copy.user = handle;
        copy.score = user.score || 0;
      }
      tr.innerHTML = `
      <td class="rank">#${copy.rank}</td>
      <td><span class="user-chip"><span class="avatar">${ACC.initials(copy.user)}</span><span class="mono">${copy.user}</span></span></td>
      <td class="mono">${copy.score.toLocaleString()}</td>
      <td><span class="badge badge-red">${copy.badge}</span></td>`;
      tbody.appendChild(tr);
    });

    renderMissions();
  })().catch((err) => {
    console.error(err);
    location.href = "login.html";
  });
})();
