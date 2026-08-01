(() => {
  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  let allParticipants = [];
  let allRuns = [];
  let selectedCertId = null;

  const tabs = document.getElementById("adminTabs");
  const panels = [...document.querySelectorAll(".admin-panel")];

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-panel]");
    if (!btn) return;
    tabs.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    panels.forEach((p) => {
      p.hidden = p.dataset.panel !== btn.dataset.panel;
    });
  });

  const drop = document.getElementById("dropzone");
  const input = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  drop?.addEventListener("click", () => input.click());
  drop?.addEventListener("dragover", (e) => e.preventDefault());
  drop?.addEventListener("drop", (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  });
  input?.addEventListener("change", () => addFiles(input.files));
  function addFiles(files) {
    [...files].forEach((f) => {
      const li = document.createElement("li");
      li.textContent = `${f.name} · ${(f.size / 1024).toFixed(1)} KB (local only — not uploaded yet)`;
      fileList.appendChild(li);
    });
  }

  function portraitCell(row) {
    if (row.portrait_url) {
      return `<img class="admin-portrait" src="${escapeHtml(row.portrait_url)}" alt="${escapeHtml(row.full_name || row.handle)}">`;
    }
    return `<span class="avatar">${escapeHtml(ACC.initials(row.full_name || row.handle))}</span>`;
  }

  function filteredParticipants() {
    const q = (document.getElementById("participantSearch")?.value || "").toLowerCase().trim();
    const dept = document.getElementById("participantDeptFilter")?.value || "";
    const status = document.getElementById("participantStatusFilter")?.value || "";
    return allParticipants.filter((row) => {
      const missions = row.missions || 0;
      const eligible = row.leaderboard_eligible !== false;
      if (dept && row.department !== dept) return false;
      if (status === "completed" && missions < 9) return false;
      if (status === "active" && (missions < 1 || missions >= 9)) return false;
      if (status === "new" && missions > 0) return false;
      if (status === "excluded" && eligible) return false;
      if (status === "eligible" && !eligible) return false;
      if (!q) return true;
      const hay = `${row.full_name || ""} ${row.handle || ""} ${row.email || ""} ${row.username || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderParticipants() {
    const rows = filteredParticipants();
    const pt = document.querySelector("#participantTable tbody");
    pt.innerHTML = "";
    if (!rows.length) {
      pt.innerHTML = `<tr><td colspan="11" class="muted">No matching participants.</td></tr>`;
      return;
    }
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      const canDownload = Boolean(row.portrait_url);
      const eligible = row.leaderboard_eligible !== false;
      if (!eligible) tr.style.opacity = "0.72";
      tr.innerHTML = `
        <td>${portraitCell(row)}</td>
        <td>
          <div>${escapeHtml(row.full_name || "—")}</div>
          <div class="mono dim" style="font-size:.75rem">${escapeHtml(row.email || "")}</div>
        </td>
        <td class="mono">${escapeHtml(row.handle)}</td>
        <td>${escapeHtml(row.department || "—")}</td>
        <td class="mono">${eligible && row.computed_rank ? `#${row.computed_rank}` : "—"}</td>
        <td class="mono">${Number(row.score || 0).toLocaleString()}</td>
        <td class="mono">${row.missions || 0}/9</td>
        <td>
          <button class="btn btn-sm ${eligible ? "btn-ghost" : "btn-primary"}" type="button"
            data-toggle-leaderboard="${escapeHtml(row.id)}"
            data-eligible="${eligible ? "1" : "0"}"
            title="${eligible ? "Exclude test account from leaderboard" : "Restore to leaderboard"}">
            ${eligible ? "On board" : "Excluded"}
          </button>
        </td>
        <td class="mono dim">${row.certificate_id ? "Issued" : "—"}</td>
        <td>
          <button class="btn btn-ghost btn-sm" type="button" data-download-portrait ${canDownload ? "" : "disabled"}
            data-url="${escapeHtml(row.portrait_url || "")}"
            data-name="${escapeHtml((row.handle || row.username || row.id || "participant") + "-portrait")}">
            ${canDownload ? "JPG" : "No photo"}
          </button>
        </td>
        <td><button class="btn btn-ghost btn-sm" type="button" data-open-dossier="${escapeHtml(row.id)}">Open</button></td>`;
      pt.appendChild(tr);
    });
  }

  function renderLeaderboard(rows) {
    const adminLb = document.getElementById("adminLb");
    adminLb.innerHTML = "";
    rows
      .filter((row) => row.leaderboard_eligible !== false)
      .slice(0, 25)
      .forEach((row) => {
      const tr = document.createElement("tr");
      if (row.computed_rank <= 3) tr.classList.add("top");
      tr.innerHTML = `
        <td class="rank">#${row.computed_rank}</td>
        <td>
          <span class="user-chip">
            ${row.portrait_url ? `<img class="avatar has-photo" src="${escapeHtml(row.portrait_url)}" alt="">` : `<span class="avatar">${escapeHtml(ACC.initials(row.handle))}</span>`}
            <span class="mono">${escapeHtml(row.handle)}</span>
          </span>
        </td>
        <td class="mono">${Number(row.score || 0).toLocaleString()}</td>
        <td class="mono">${row.missions || 0}/9</td>
        <td><span class="badge badge-red">${escapeHtml(row.badge)}</span></td>`;
      adminLb.appendChild(tr);
    });
  }

  function renderMissions(missions) {
    const body = document.querySelector("#missionTable tbody");
    if (!body) return;
    body.innerHTML = "";
    if (!missions.length) {
      body.innerHTML = `<tr><td colspan="7" class="muted">No missions in catalog.</td></tr>`;
      return;
    }
    missions.forEach((m) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="mono">${escapeHtml(m.id)}</td>
        <td>
          <div>${escapeHtml(m.title)}</div>
          <div class="mono dim" style="font-size:.75rem">${escapeHtml(m.category)}</div>
        </td>
        <td>${escapeHtml(m.difficulty)}</td>
        <td class="mono">${Number(m.points || 0)}</td>
        <td>
          <select class="acc-native-select" data-mission-week="${escapeHtml(m.id)}" aria-label="Week for ${escapeHtml(m.id)}">
            <option value="1" ${Number(m.week) === 1 ? "selected" : ""}>Week 1</option>
            <option value="2" ${Number(m.week) === 2 ? "selected" : ""}>Week 2</option>
            <option value="3" ${Number(m.week) === 3 ? "selected" : ""}>Week 3</option>
            <option value="4" ${Number(m.week) === 4 ? "selected" : ""}>Week 4</option>
          </select>
        </td>
        <td>
          <span class="badge ${m.active ? "badge-green" : "badge-locked"}">${m.active ? "Active" : "Inactive"}</span>
        </td>
        <td>
          <button class="btn ${m.active ? "btn-ghost" : "btn-primary"} btn-sm" type="button" data-mission-toggle="${escapeHtml(m.id)}" data-active="${m.active ? "1" : "0"}">
            ${m.active ? "Deactivate" : "Activate"}
          </button>
        </td>`;
      body.appendChild(tr);
    });
  }

  async function refreshMissions() {
    const msg = document.getElementById("missionMsg");
    await ACCAuth.ensureDefaultMissions().catch((err) => {
      if (msg) msg.textContent = err.message || "Could not sync mission catalog.";
    });
    const missions = await ACCAuth.listMissions({ includeInactive: true });
    renderMissions(missions);
    const live = missions.filter((m) => m.active).length;
    document.getElementById("statLiveMissions").textContent = String(live);
    if (msg) msg.textContent = `Mission catalog synced · ${missions.length} missions.`;
    return missions;
  }

  function renderOverview(stats) {
    const feed = document.getElementById("activityFeed");
    if (!stats.activity?.length) {
      feed.textContent = "No live activity yet.";
    } else {
      feed.innerHTML = stats.activity
        .map((a) => {
          const t = new Date(a.created_at).toLocaleTimeString();
          return `<div><span class="dim">${t}</span> · ${escapeHtml(a.message)}</div>`;
        })
        .join("");
    }

    const byMission = {};
    (stats.missions || []).forEach((m) => {
      byMission[m.id] = { title: m.title, started: 0, done: 0, scoreSum: 0, timeSum: 0 };
    });
    (stats.runs || []).forEach((r) => {
      if (!byMission[r.mission_id]) byMission[r.mission_id] = { title: r.mission_id, started: 0, done: 0, scoreSum: 0, timeSum: 0 };
      byMission[r.mission_id].started += 1;
      if (r.completed_at) {
        byMission[r.mission_id].done += 1;
        byMission[r.mission_id].scoreSum += Number(r.score || 0);
        byMission[r.mission_id].timeSum += Number(r.elapsed_sec || 0);
      }
    });
    const body = document.querySelector("#missionHealthTable tbody");
    body.innerHTML = Object.entries(byMission)
      .map(([id, m]) => {
        const avgScore = m.done ? Math.round(m.scoreSum / m.done) : 0;
        const avgTime = m.done ? ACC.formatDuration(Math.round(m.timeSum / m.done)) : "—";
        return `<tr>
          <td class="mono">${escapeHtml(id)}</td>
          <td class="mono">${m.started}</td>
          <td class="mono">${m.done}</td>
          <td class="mono">${avgScore}</td>
          <td class="mono">${avgTime}</td>
        </tr>`;
      })
      .join("") || `<tr><td colspan="5" class="muted">No mission runs yet.</td></tr>`;

    if (stats.competition?.status) {
      document.getElementById("compStatusSelect").value = stats.competition.status;
    }
  }

  function fillCertSelect(rows) {
    const sel = document.getElementById("certParticipant");
    if (!sel) return;
    const eligible = rows.filter((r) => r.leaderboard_eligible !== false);
    sel.innerHTML = eligible
      .map((r) => `<option value="${escapeHtml(r.id)}">#${r.computed_rank} · @${escapeHtml(r.handle)} · ${escapeHtml(r.full_name || "")}</option>`)
      .join("");
    selectedCertId = eligible[0]?.id || null;
  }

  function currentCertParticipant() {
    const id = document.getElementById("certParticipant")?.value || selectedCertId;
    return allParticipants.find((p) => p.id === id);
  }

  function previewSelectedCert() {
    const p = currentCertParticipant();
    if (!p || !window.ACCComp) return;
    ACCComp.previewCertificate(document.getElementById("certCanvas"), p, p.computed_rank);
  }

  document.getElementById("certPreviewBtn")?.addEventListener("click", previewSelectedCert);
  document.getElementById("certJpgBtn")?.addEventListener("click", () => {
    const p = currentCertParticipant();
    if (!p) return;
    ACCComp.downloadCertificateJpg({
      fullName: p.full_name || p.handle,
      username: p.handle,
      achievement: ACCComp.awardTitleForRank(p.computed_rank, p.missions || 0),
      rank: `#${p.computed_rank}`,
      score: p.score || 0,
      certId: p.certificate_id || `ACC-CERT-${p.handle}`.toUpperCase(),
      template: ACCComp.certificateTemplate(p.computed_rank, p.missions || 0),
      dateStr: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    });
  });
  document.getElementById("certPdfBtn")?.addEventListener("click", () => {
    const p = currentCertParticipant();
    if (!p) return;
    ACCComp.downloadCertificatePdf({
      fullName: p.full_name || p.handle,
      username: p.handle,
      achievement: ACCComp.awardTitleForRank(p.computed_rank, p.missions || 0),
      rank: `#${p.computed_rank}`,
      score: p.score || 0,
      certId: p.certificate_id || `ACC-CERT-${p.handle}`.toUpperCase(),
      template: ACCComp.certificateTemplate(p.computed_rank, p.missions || 0),
      dateStr: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    });
  });

  document.getElementById("recalcBtn")?.addEventListener("click", async () => {
    const msg = document.getElementById("lbAdminMsg");
    try {
      await ACCAuth.refreshAwards().catch(() => null);
      allParticipants = await ACCAuth.listAdminParticipants();
      renderLeaderboard(allParticipants);
      renderParticipants();
      fillCertSelect(allParticipants);
      const live = allParticipants.filter((p) => p.leaderboard_eligible !== false).length;
      msg.textContent = `Ranks refreshed · ${live} on leaderboard · ${allParticipants.length - live} excluded.`;
    } catch (err) {
      msg.textContent = err.message || "Could not refresh ranks.";
    }
  });

  document.getElementById("exportResultsBtn")?.addEventListener("click", () => {
    const header = "rank,username,full_name,department,score,missions,time_sec,certificate_id\n";
    const lines = allParticipants
      .filter((r) => r.leaderboard_eligible !== false)
      .map(
        (r) =>
          `${r.computed_rank},${r.handle},"${(r.full_name || "").replace(/"/g, '""')}",${r.department || ""},${r.score || 0},${r.missions || 0},${r.total_time_sec || 0},${r.certificate_id || ""}`
      )
      .join("\n");
    const blob = new Blob([header + lines], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "acc-final-results.csv";
    a.click();
  });

  document.getElementById("compStatusSave")?.addEventListener("click", async () => {
    const status = document.getElementById("compStatusSelect").value;
    const msg = document.getElementById("overviewMsg");
    try {
      await ACCAuth.setCompetitionStatus(status);
      msg.textContent = `Competition status set to ${status}.`;
    } catch (err) {
      msg.textContent = err.message || "Could not update status.";
    }
  });

  document.getElementById("refreshAwardsBtn")?.addEventListener("click", async () => {
    const msg = document.getElementById("overviewMsg");
    try {
      await ACCAuth.refreshAwards();
      allParticipants = await ACCAuth.listAdminParticipants();
      renderParticipants();
      renderLeaderboard(allParticipants);
      fillCertSelect(allParticipants);
      msg.textContent = "Awards recalculated from current standings (test accounts excluded).";
    } catch (err) {
      msg.textContent = err.message || "Could not refresh awards.";
    }
  });

  ["participantSearch", "participantDeptFilter", "participantStatusFilter"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", renderParticipants);
    document.getElementById(id)?.addEventListener("change", renderParticipants);
  });

  document.getElementById("missionTable")?.addEventListener("change", async (e) => {
    const select = e.target.closest("[data-mission-week]");
    if (!select) return;
    const id = select.dataset.missionWeek;
    const week = Number(select.value);
    const msg = document.getElementById("missionMsg");
    try {
      await ACCAuth.updateMission(id, { week });
      msg.textContent = `${id} moved to Week ${week}.`;
      await refreshMissions();
    } catch (err) {
      msg.textContent = err.message || "Could not update week.";
      await refreshMissions();
    }
  });

  document.getElementById("missionTable")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-mission-toggle]");
    if (!btn) return;
    const id = btn.dataset.missionToggle;
    const currentlyActive = btn.dataset.active === "1";
    const msg = document.getElementById("missionMsg");
    btn.disabled = true;
    try {
      await ACCAuth.updateMission(id, { active: !currentlyActive });
      msg.textContent = `${id} is now ${currentlyActive ? "inactive" : "active"} for students.`;
      await refreshMissions();
    } catch (err) {
      msg.textContent = err.message || "Could not update mission status.";
      btn.disabled = false;
    }
  });

  document.getElementById("participantTable")?.addEventListener("click", async (e) => {
    const toggleLb = e.target.closest("[data-toggle-leaderboard]");
    if (toggleLb) {
      const id = toggleLb.dataset.toggleLeaderboard;
      const currentlyEligible = toggleLb.dataset.eligible === "1";
      const nextEligible = !currentlyEligible;
      const label = currentlyEligible
        ? "Exclude this account from the public leaderboard? Use this for test accounts."
        : "Restore this account to the public leaderboard?";
      if (!confirm(label)) return;
      toggleLb.disabled = true;
      try {
        await ACCAuth.setLeaderboardEligible(id, nextEligible);
        allParticipants = await ACCAuth.listAdminParticipants();
        renderParticipants();
        renderLeaderboard(allParticipants);
        fillCertSelect(allParticipants);
        const stats = await ACCAuth.getCompetitionStats();
        document.getElementById("statLeader").textContent = stats.totals.leader
          ? `@${stats.totals.leader.handle}`
          : "—";
        document.getElementById("statParticipants").textContent = String(
          allParticipants.filter((p) => p.leaderboard_eligible !== false).length
        );
      } catch (err) {
        alert(err.message || "Could not update leaderboard eligibility.");
        toggleLb.disabled = false;
      }
      return;
    }

    const dossier = e.target.closest("[data-open-dossier]");
    if (dossier) {
      const row = allParticipants.find((p) => p.id === dossier.dataset.openDossier);
      const box = document.getElementById("participantDetail");
      const body = document.getElementById("participantDetailBody");
      if (!row) return;
      box.hidden = false;
      const runs = allRuns.filter((r) => r.user_id === row.id);
      const eligible = row.leaderboard_eligible !== false;
      body.innerHTML = `
        <div class="mono" style="margin-top:.5rem">${escapeHtml(row.full_name || "—")} · @${escapeHtml(row.handle)}</div>
        <div class="muted">${escapeHtml(row.department || "—")} · Rank ${eligible && row.computed_rank ? `#${row.computed_rank}` : "—"} · ${Number(row.score || 0).toLocaleString()} XP</div>
        <div class="muted" style="margin-top:.35rem">Hints: ${row.hints_used || 0} · Time: ${ACC.formatDuration(row.total_time_sec || 0)} · Cert: ${escapeHtml(row.certificate_id || "not issued")}</div>
        <div class="muted" style="margin-top:.35rem">Awards: ${(row.awards || []).join(", ") || "none"}</div>
        <div class="row" style="margin-top:.75rem;gap:.5rem;flex-wrap:wrap;align-items:center">
          <span class="badge ${eligible ? "badge-green" : "badge-locked"}">${eligible ? "On leaderboard" : "Excluded (test)"}</span>
          <button class="btn btn-sm ${eligible ? "btn-ghost" : "btn-primary"}" type="button"
            data-toggle-leaderboard="${escapeHtml(row.id)}"
            data-eligible="${eligible ? "1" : "0"}">
            ${eligible ? "Exclude from leaderboard" : "Restore to leaderboard"}
          </button>
        </div>
        <div class="admin-table-wrap" style="margin-top:.75rem">
          <table class="rank-table">
            <thead><tr><th>Mission</th><th>Score</th><th>Time</th><th>Hints</th><th>Completed</th></tr></thead>
            <tbody>
              ${
                runs
                  .map(
                    (r) => `<tr>
                  <td class="mono">${escapeHtml(r.mission_id)}</td>
                  <td class="mono">${r.score}</td>
                  <td class="mono">${ACC.formatDuration(r.elapsed_sec || 0)}</td>
                  <td class="mono">${r.hints_used || 0}</td>
                  <td class="mono">${r.completed_at ? new Date(r.completed_at).toLocaleString() : "—"}</td>
                </tr>`
                  )
                  .join("") || `<tr><td colspan="5" class="muted">No mission runs.</td></tr>`
              }
            </tbody>
          </table>
        </div>`;
      return;
    }

    const btn = e.target.closest("[data-download-portrait]");
    if (!btn || btn.disabled) return;
    const url = btn.dataset.url;
    const name = btn.dataset.name || "portrait";
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "…";
    try {
      await ACCAuth.downloadPortraitAsJpg(url, `${name}.jpg`);
      btn.textContent = "OK";
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1000);
    } catch (err) {
      alert(err.message || "Could not download portrait as JPG.");
      btn.textContent = original;
      btn.disabled = false;
    }
  });

  async function refreshAccessHold() {
    const status = document.getElementById("accessHoldStatus");
    const btn = document.getElementById("accessHoldToggle");
    const msg = document.getElementById("accessHoldMsg");
    if (!status || !btn) return;
    try {
      const active = await ACCAuth.isAccessHoldActive();
      status.textContent = active ? "ACTIVE — students held on waiting page" : "INACTIVE — students can enter";
      status.style.color = active ? "var(--red-bright)" : "#86efac";
      btn.textContent = active ? "Deactivate gate" : "Activate gate";
      btn.dataset.active = active ? "1" : "0";
      btn.className = active ? "btn btn-ghost" : "btn btn-primary";
    } catch (err) {
      status.textContent = "Could not load gate status";
      if (msg) msg.textContent = err.message || "Error";
    }
  }

  document.getElementById("accessHoldToggle")?.addEventListener("click", async () => {
    const btn = document.getElementById("accessHoldToggle");
    const msg = document.getElementById("accessHoldMsg");
    const currentlyActive = btn.dataset.active === "1";
    btn.disabled = true;
    try {
      await ACCAuth.setAccessHoldActive(!currentlyActive);
      if (msg) {
        msg.textContent = !currentlyActive
          ? "Gate activated. Students will see the waiting page."
          : "Gate deactivated. Students can enter again.";
      }
      await refreshAccessHold();
    } catch (err) {
      if (msg) msg.textContent = err.message || "Could not update gate.";
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("participantDetail")?.addEventListener("click", async (e) => {
    const toggleLb = e.target.closest("[data-toggle-leaderboard]");
    if (!toggleLb) return;
    const id = toggleLb.dataset.toggleLeaderboard;
    const currentlyEligible = toggleLb.dataset.eligible === "1";
    const nextEligible = !currentlyEligible;
    const label = currentlyEligible
      ? "Exclude this account from the public leaderboard? Use this for test accounts."
      : "Restore this account to the public leaderboard?";
    if (!confirm(label)) return;
    toggleLb.disabled = true;
    try {
      await ACCAuth.setLeaderboardEligible(id, nextEligible);
      allParticipants = await ACCAuth.listAdminParticipants();
      renderParticipants();
      renderLeaderboard(allParticipants);
      fillCertSelect(allParticipants);
      const openBtn = document.querySelector(`[data-open-dossier="${id}"]`);
      openBtn?.click();
      const stats = await ACCAuth.getCompetitionStats();
      document.getElementById("statLeader").textContent = stats.totals.leader
        ? `@${stats.totals.leader.handle}`
        : "—";
      document.getElementById("statParticipants").textContent = String(
        allParticipants.filter((p) => p.leaderboard_eligible !== false).length
      );
    } catch (err) {
      alert(err.message || "Could not update leaderboard eligibility.");
      toggleLb.disabled = false;
    }
  });

  (async () => {
    const gate = await ACCAuth.requireAdmin();
    if (!gate) return;

    const [stats, adminRows] = await Promise.all([
      ACCAuth.getCompetitionStats(),
      ACCAuth.listAdminParticipants(),
    ]);
    allParticipants = adminRows;
    allRuns = stats.runs || [];
    const liveCount = allParticipants.filter((p) => p.leaderboard_eligible !== false).length;

    document.getElementById("statParticipants").textContent = String(liveCount);
    document.getElementById("statActiveDone").textContent = `${stats.totals.active} / ${stats.totals.completed}`;
    document.getElementById("statAvgScore").textContent = String(stats.totals.avgScore);
    document.getElementById("statCleared").textContent = String(stats.totals.totalMissionCompletions);
    document.getElementById("statLeader").textContent = stats.totals.leader
      ? `@${stats.totals.leader.handle}`
      : "—";

    const deptSel = document.getElementById("participantDeptFilter");
    const depts = [...new Set(allParticipants.map((p) => p.department).filter(Boolean))].sort();
    depts.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      deptSel.appendChild(opt);
    });

    renderParticipants();
    renderLeaderboard(allParticipants);
    renderOverview(stats);
    fillCertSelect(allParticipants);
    previewSelectedCert();
    await refreshMissions();
    await refreshAccessHold();
  })().catch((err) => {
    console.error(err);
    location.href = "dashboard.html";
  });
})();
