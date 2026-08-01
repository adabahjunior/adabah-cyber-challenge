(() => {
  (async () => {
    const session = await ACCAuth.getSession().catch(() => null);
    const me = session?.user?.email || ACC.loadUser().email || "";
    const myHandle = (ACC.loadUser().hackerName || ACC.loadUser().username || "").toLowerCase();

    const ranked = await ACCAuth.listLeaderboard();
    const rows = ranked.map((r) => ({
      rank: r.computed_rank,
      user: r.handle,
      score: r.score || 0,
      missions: r.missions || 0,
      badge: r.badge,
      portrait: r.portrait_url || "",
      self: Boolean(
        (r.email && me && r.email.toLowerCase() === me.toLowerCase()) ||
          (myHandle && r.handle.toLowerCase() === myHandle)
      ),
    }));

    const self = rows.find((r) => r.self);
    document.getElementById("youRank").textContent = self ? `#${self.rank}` : rows.length ? "—" : "#—";

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
          <div class="muted">${row.score.toLocaleString()} pts · ${row.missions} challenges</div>
          <span class="badge badge-red" style="margin-top:.4rem">${row.badge}</span>
        </div>
      </div>`;
    }

    podiumCard(document.getElementById("podium1"), rows[0], "Rank #01");
    podiumCard(document.getElementById("podium2"), rows[1], "Rank #02");
    podiumCard(document.getElementById("podium3"), rows[2], "Rank #03");

    const tbody = document.querySelector("#fullBoard tbody");
    tbody.innerHTML = "";
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="muted">No registered participants on the board yet.</td></tr>`;
      return;
    }
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      if (row.rank <= 3) tr.classList.add("top");
      if (row.self) tr.style.background = "rgba(176,0,32,0.12)";
      const avatar = row.portrait
        ? `<span class="avatar has-photo"><img src="${row.portrait}" alt=""></span>`
        : `<span class="avatar">${ACC.initials(row.user)}</span>`;
      tr.innerHTML = `
      <td class="rank">#${String(row.rank).padStart(2, "0")}</td>
      <td><span class="user-chip">${avatar}<span class="mono">${row.user}${row.self ? " (you)" : ""}</span></span></td>
      <td class="mono">${row.score.toLocaleString()}</td>
      <td class="mono">${row.missions}/10</td>
      <td><span class="badge badge-red">${row.badge}</span></td>`;
      tbody.appendChild(tr);
    });
  })().catch((err) => {
    console.error(err);
    const tbody = document.querySelector("#fullBoard tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" class="muted">Could not load the leaderboard.</td></tr>`;
    }
  });
})();
