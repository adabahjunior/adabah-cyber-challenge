(() => {
  const user = ACC.loadUser();
  const handle = user.hackerName || user.username;
  const rows = ACC.LEADERBOARD.map((r) => {
    if (r.self && handle) {
      return { ...r, user: handle, score: user.score || r.score, missions: user.completed?.length || r.missions };
    }
    return r;
  });

  const self = rows.find((r) => r.self);
  document.getElementById("youRank").textContent = self ? `#${self.rank}` : "#—";

  function podiumCard(el, row, label) {
    if (!row) return;
    el.innerHTML = `
      <p class="eyebrow">${label}</p>
      <div class="profile-hero" style="margin-top:.75rem">
        <div class="avatar lg">${ACC.initials(row.user)}</div>
        <div>
          <div class="mono" style="font-size:1.05rem">${row.user}</div>
          <div class="muted">${row.score.toLocaleString()} pts · ${row.missions} missions</div>
          <span class="badge badge-red" style="margin-top:.4rem">${row.badge}</span>
        </div>
      </div>`;
  }

  podiumCard(document.getElementById("podium1"), rows[0], "Rank #01");
  podiumCard(document.getElementById("podium2"), rows[1], "Rank #02");
  podiumCard(document.getElementById("podium3"), rows[2], "Rank #03");

  const tbody = document.querySelector("#fullBoard tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    if (row.rank <= 3) tr.classList.add("top");
    if (row.self) tr.style.background = "rgba(176,0,32,0.12)";
    tr.innerHTML = `
      <td class="rank">#${String(row.rank).padStart(2, "0")}</td>
      <td><span class="user-chip"><span class="avatar">${ACC.initials(row.user)}</span><span class="mono">${row.user}${row.self ? " (you)" : ""}</span></span></td>
      <td class="mono">${row.score.toLocaleString()}</td>
      <td class="mono">${row.missions}/10</td>
      <td><span class="badge badge-red">${row.badge}</span></td>`;
    tbody.appendChild(tr);
  });
})();
