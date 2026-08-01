(() => {
  (async () => {
    const session = await ACCAuth.getSession().catch(() => null);
    const me = session?.user?.email || ACC.loadUser().email || "";
    const myHandle = (ACC.loadUser().hackerName || ACC.loadUser().username || "").toLowerCase();

    const ranked = await ACCAuth.listLeaderboard();
    const rows = ranked.map((r) => ({
      rank: r.computed_rank,
      user: r.handle,
      fullName: r.full_name || "—",
      department: r.department || "—",
      score: r.score || 0,
      missions: r.missions || 0,
      time: ACC.formatDuration?.(r.total_time_sec || 0) || `${r.total_time_sec || 0}s`,
      badge: r.badge,
      portrait: r.portrait_url || "",
      email: r.email || "",
      self: Boolean(
        (r.email && me && r.email.toLowerCase() === me.toLowerCase()) ||
          (myHandle && r.handle.toLowerCase() === myHandle)
      ),
    }));

    const self = rows.find((r) => r.self);
    document.getElementById("youRank").textContent = self ? `#${self.rank}` : rows.length ? "—" : "#—";
    document.getElementById("youMeta").textContent = self
      ? `${self.score.toLocaleString()} XP · ${self.missions}/9 missions`
      : me
        ? "Complete onboarded missions to appear"
        : "Sign in to track your rank";

    if (self && self.rank > 10) {
      const card = document.getElementById("selfCard");
      card.hidden = false;
      document.getElementById("selfStanding").textContent =
        `#${self.rank} · @${self.user} · ${self.score.toLocaleString()} Cyber XP · ${self.missions}/9 · ${self.time}`;
    }

    document.getElementById("award1").textContent = rows[0] ? `@${rows[0].user}` : "Awaiting champion";
    document.getElementById("award2").textContent = rows
      .slice(1, 5)
      .map((r) => `@${r.user}`)
      .join(", ") || "—";
    document.getElementById("award3").textContent = rows
      .slice(5, 10)
      .map((r) => `@${r.user}`)
      .join(", ") || "—";

    function podiumCard(el, row, label) {
      if (!el) return;
      if (!row) {
        el.innerHTML = `<p class="eyebrow">${label}</p><p class="muted" style="margin-top:.75rem">Waiting for the first finishers.</p>`;
        return;
      }
      const avatar = row.portrait
        ? `<div class="avatar lg has-photo"><img src="${row.portrait}" alt=""></div>`
        : `<div class="avatar lg">${ACC.initials(row.user)}</div>`;
      el.innerHTML = `
      <p class="eyebrow">${label}</p>
      <div class="profile-hero" style="margin-top:.75rem">
        ${avatar}
        <div>
          <div class="mono" style="font-size:1.05rem">${row.user}</div>
          <div class="muted">${row.score.toLocaleString()} XP · ${row.missions}/9</div>
          <span class="badge badge-red" style="margin-top:.4rem">${row.badge}</span>
        </div>
      </div>`;
    }

    podiumCard(document.getElementById("podium1"), rows[0], "🥇 Rank 1");
    podiumCard(document.getElementById("podium2"), rows[1], "🥈 Rank 2");
    podiumCard(document.getElementById("podium3"), rows[2], "🥉 Rank 3");

    const tbody = document.querySelector("#fullBoard tbody");
    tbody.innerHTML = "";
    const publicRows = rows.slice(0, 10);
    if (!publicRows.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="muted">No registered participants on the board yet.</td></tr>`;
      return;
    }
    publicRows.forEach((row) => {
      const tr = document.createElement("tr");
      if (row.rank <= 3) tr.classList.add("top");
      if (row.self) tr.style.background = "rgba(176,0,32,0.12)";
      const avatar = row.portrait
        ? `<span class="avatar has-photo"><img src="${row.portrait}" alt=""></span>`
        : `<span class="avatar">${ACC.initials(row.user)}</span>`;
      tr.innerHTML = `
      <td class="rank">#${String(row.rank).padStart(2, "0")}</td>
      <td><span class="user-chip">${avatar}<span class="mono">${row.user}${row.self ? " (you)" : ""}</span></span></td>
      <td>${row.fullName}</td>
      <td>${row.department}</td>
      <td class="mono">${row.score.toLocaleString()}</td>
      <td class="mono">${row.missions}/9</td>
      <td class="mono">${row.time}</td>
      <td><span class="badge badge-red">${row.badge}</span></td>`;
      tbody.appendChild(tr);
    });
  })().catch((err) => {
    console.error(err);
    const tbody = document.querySelector("#fullBoard tbody");
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" class="muted">Could not load the leaderboard.</td></tr>`;
  });
})();
