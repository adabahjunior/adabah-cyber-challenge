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
      const list = (ACC.MISSIONS[week] || []).map((m) => {
        if (m.id === "M01" && (user.completed || []).includes("M01")) {
          return { ...m, status: "completed" };
        }
        return m;
      });
      grid.innerHTML = list
        .map((m) => {
          const locked = m.status === "locked";
          const href = locked ? "#" : m.href || `mission.html?id=${m.id}`;
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

    renderMissions();
  })().catch((err) => {
    console.error(err);
    location.href = "login.html";
  });
})();
