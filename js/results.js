(() => {
  (async () => {
    const [board, competition] = await Promise.all([
      ACCAuth.listLeaderboard(),
      ACCAuth.getCompetition().catch(() => null),
    ]);

    document.getElementById("compStatus").textContent = (competition?.status || "active").toUpperCase();
    document.getElementById("statTotal").textContent = String(board.length);
    document.getElementById("statAvg").textContent = board.length
      ? Math.round(board.reduce((s, b) => s + Number(b.score || 0), 0) / board.length).toLocaleString()
      : "0";
    document.getElementById("statDone").textContent = String(board.filter((b) => (b.missions || 0) >= 9).length);

    const winner = board[0];
    const canvas = document.getElementById("winnerPreview");
    if (winner) {
      document.getElementById("winnerName").textContent =
        `${winner.full_name || winner.handle} · @${winner.handle}`;
      document.getElementById("winnerXp").textContent = Number(winner.score || 0).toLocaleString();
      document.getElementById("winnerRank").textContent = `#${winner.computed_rank}`;
      document.getElementById("winnerMissions").textContent = `${winner.missions || 0}/9`;
      ACCComp.previewCertificate(canvas, winner, winner.computed_rank);
      const opts = () => ({
        fullName: winner.full_name || winner.handle,
        username: winner.handle,
        achievement: ACCComp.awardTitleForRank(winner.computed_rank, winner.missions || 0),
        rank: `#${winner.computed_rank}`,
        score: winner.score || 0,
        certId: winner.certificate_id || `ACC-CERT-${winner.handle}`.toUpperCase(),
        template: ACCComp.certificateTemplate(winner.computed_rank, winner.missions || 0),
        dateStr: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
      });
      const jpg = document.getElementById("winnerCertJpg");
      const pdf = document.getElementById("winnerCertPdf");
      jpg.disabled = false;
      pdf.disabled = false;
      jpg.onclick = () => ACCComp.downloadCertificateJpg(opts());
      pdf.onclick = () => ACCComp.downloadCertificatePdf(opts());
    }

    const awardGrid = document.getElementById("awardGrid");
    const buckets = [
      { key: "cyber_champion", rows: board.filter((b) => b.computed_rank === 1) },
      { key: "elite_defender", rows: board.filter((b) => b.computed_rank >= 2 && b.computed_rank <= 5) },
      { key: "rising_analyst", rows: board.filter((b) => b.computed_rank >= 6 && b.computed_rank <= 10) },
      { key: "certified_explorer", rows: board.filter((b) => (b.missions || 0) >= 9) },
    ];
    awardGrid.innerHTML = buckets
      .map((b) => {
        const def = ACCComp.AWARDS[b.key];
        return `<div class="glass panel">
          <p class="eyebrow">${def.icon} ${def.title}</p>
          <p class="muted" style="margin:.35rem 0 .65rem">${def.blurb}</p>
          <div class="mono">${b.rows.map((r) => `@${r.handle}`).join(", ") || "—"}</div>
        </div>`;
      })
      .join("");

    const tbody = document.querySelector("#finalBoard tbody");
    tbody.innerHTML = "";
    board.slice(0, 10).forEach((row) => {
      const tr = document.createElement("tr");
      if (row.computed_rank <= 3) tr.classList.add("top");
      tr.innerHTML = `
        <td class="rank">#${row.computed_rank}</td>
        <td class="mono">@${row.handle}</td>
        <td class="mono">${Number(row.score || 0).toLocaleString()}</td>
        <td class="mono">${row.missions || 0}/9</td>
        <td><span class="badge badge-red">${row.badge}</span></td>`;
      tbody.appendChild(tr);
    });
    if (!board.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="muted">No results yet.</td></tr>`;
    }
  })().catch((err) => {
    console.error(err);
  });
})();
