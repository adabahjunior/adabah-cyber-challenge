(() => {
  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

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

  document.getElementById("missionCreate")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    document.getElementById("missionMsg").textContent =
      `Draft saved locally for ${fd.get("id")} “${fd.get("title")}”. Publishing to the live mission list is not enabled yet.`;
    e.target.reset();
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

  document.getElementById("recalcBtn")?.addEventListener("click", async () => {
    const msg = document.getElementById("lbAdminMsg");
    try {
      const rows = await ACCAuth.listLeaderboard();
      renderLeaderboard(rows);
      msg.textContent = `Ranks refreshed from ${rows.length} registered participant${rows.length === 1 ? "" : "s"}.`;
    } catch (err) {
      msg.textContent = err.message || "Could not refresh ranks.";
    }
  });

  document.getElementById("freezeBtn")?.addEventListener("click", () => {
    document.getElementById("lbAdminMsg").textContent =
      "Board freeze is not connected yet. Ranks currently always follow live scores.";
  });

  function portraitCell(row) {
    if (row.portrait_url) {
      return `<img class="admin-portrait" src="${escapeHtml(row.portrait_url)}" alt="${escapeHtml(row.full_name || row.handle)}">`;
    }
    return `<span class="avatar">${escapeHtml(ACC.initials(row.full_name || row.handle))}</span>`;
  }

  function renderParticipants(rows) {
    const pt = document.querySelector("#participantTable tbody");
    pt.innerHTML = "";
    if (!rows.length) {
      pt.innerHTML = `<tr><td colspan="8" class="muted">No registered participants yet.</td></tr>`;
      return;
    }
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      const joined = row.onboarded_at
        ? new Date(row.onboarded_at).toLocaleDateString()
        : "—";
      const canDownload = Boolean(row.portrait_url);
      tr.innerHTML = `
        <td>${portraitCell(row)}</td>
        <td>
          <div>${escapeHtml(row.full_name || "—")}</div>
          <div class="mono dim" style="font-size:.75rem">${escapeHtml(row.email || "")}</div>
        </td>
        <td class="mono">${escapeHtml(row.handle)}</td>
        <td>${escapeHtml(row.department || "—")}</td>
        <td>${escapeHtml(row.level || "—")}</td>
        <td class="mono">${escapeHtml(row.whatsapp || "—")}</td>
        <td class="mono">${Number(row.score || 0).toLocaleString()}</td>
        <td>
          <button class="btn btn-ghost btn-sm" type="button" data-download-portrait ${canDownload ? "" : "disabled"}
            data-url="${escapeHtml(row.portrait_url || "")}"
            data-name="${escapeHtml((row.handle || row.username || row.id || "participant") + "-portrait")}">
            ${canDownload ? "Download JPG" : "No photo"}
          </button>
        </td>
        <td class="mono dim">${joined}</td>`;
      pt.appendChild(tr);
    });
  }

  function renderLeaderboard(rows) {
    const adminLb = document.getElementById("adminLb");
    adminLb.innerHTML = "";
    if (!rows.length) {
      adminLb.innerHTML = `<tr><td colspan="4" class="muted">No scores yet.</td></tr>`;
      return;
    }
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="rank">#${row.computed_rank}</td>
        <td>
          <span class="user-chip">
            ${row.portrait_url ? `<img class="avatar has-photo" src="${escapeHtml(row.portrait_url)}" alt="">` : `<span class="avatar">${escapeHtml(ACC.initials(row.handle))}</span>`}
            <span class="mono">${escapeHtml(row.handle)}</span>
          </span>
        </td>
        <td class="mono">${Number(row.score || 0).toLocaleString()}</td>
        <td><span class="badge badge-red">${escapeHtml(row.badge)}</span></td>`;
      adminLb.appendChild(tr);
    });
  }

  function renderSubmissionsEmpty() {
    const st = document.querySelector("#subTable tbody");
    if (st) {
      st.innerHTML = `<tr><td colspan="6" class="muted">No flag submissions stored yet.</td></tr>`;
    }
  }

  document.getElementById("participantTable")?.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-download-portrait]");
    if (!btn || btn.disabled) return;
    const url = btn.dataset.url;
    const name = btn.dataset.name || "portrait";
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Preparing…";
    try {
      await ACCAuth.downloadPortraitAsJpg(url, `${name}.jpg`);
      btn.textContent = "Downloaded";
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    } catch (err) {
      btn.textContent = "Failed";
      alert(err.message || "Could not download portrait as JPG.");
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    }
  });

  (async () => {
    const gate = await ACCAuth.requireAdmin();
    if (!gate) return;

    const rows = await ACCAuth.listLeaderboard();
    const cleared = rows.reduce((sum, r) => sum + (r.missions || 0), 0);
    const withPhotos = rows.filter((r) => r.portrait_url).length;

    document.getElementById("statParticipants").textContent = rows.length.toLocaleString();
    document.getElementById("statPhotos").textContent = withPhotos.toLocaleString();
    document.getElementById("statCleared").textContent = cleared.toLocaleString();
    document.getElementById("statLiveMissions").textContent = "1";

    renderParticipants(rows);
    renderLeaderboard(rows);
    renderSubmissionsEmpty();
  })().catch((err) => {
    console.error(err);
    location.href = "dashboard.html";
  });
})();
