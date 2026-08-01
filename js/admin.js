(() => {
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

  document.getElementById("missionCreate").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    document.getElementById("missionMsg").textContent =
      `Mission ${fd.get("id")} “${fd.get("title")}” queued for Week ${fd.get("week")} (UI demo — not persisted to server).`;
    e.target.reset();
  });

  const drop = document.getElementById("dropzone");
  const input = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  drop.addEventListener("click", () => input.click());
  drop.addEventListener("dragover", (e) => e.preventDefault());
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  });
  input.addEventListener("change", () => addFiles(input.files));
  function addFiles(files) {
    [...files].forEach((f) => {
      const li = document.createElement("li");
      li.textContent = `${f.name} · ${(f.size / 1024).toFixed(1)} KB`;
      fileList.appendChild(li);
    });
  }

  const participants = [
    { name: "Ama Mensah", handle: "shadowroot", dept: "Cybersecurity", level: "Advanced", score: 4820 },
    { name: "Kojo Asante", handle: "packetwitch", dept: "Computer Science", level: "Advanced", score: 4510 },
    { name: "Efua Boateng", handle: "nullsector", dept: "IT", level: "Intermediate", score: 4200 },
    { name: "Yaw Owusu", handle: "cipherkid", dept: "Computer Engineering", level: "Intermediate", score: 3890 },
    { name: "Demo User", handle: ACC.loadUser().hackerName || "operative", dept: ACC.loadUser().department || "ACC", level: ACC.loadUser().level || "Beginner", score: ACC.loadUser().score || 1250 },
  ];
  const pt = document.querySelector("#participantTable tbody");
  participants.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${p.name}</td><td class="mono">${p.handle}</td><td>${p.dept}</td><td>${p.level}</td><td class="mono">${p.score.toLocaleString()}</td>`;
    pt.appendChild(tr);
  });

  const adminLb = document.getElementById("adminLb");
  ACC.LEADERBOARD.slice(0, 8).forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="rank">#${r.rank}</td><td class="mono">${r.user}</td><td class="mono">${r.score}</td><td><button class="btn btn-ghost btn-sm" type="button">Adjust</button></td>`;
    adminLb.appendChild(tr);
  });

  document.getElementById("recalcBtn").addEventListener("click", () => {
    document.getElementById("lbAdminMsg").textContent = "Ranks recalculated from submission ledger (demo).";
  });
  document.getElementById("freezeBtn").addEventListener("click", () => {
    document.getElementById("lbAdminMsg").textContent = "Leaderboard frozen. Score writes paused (demo).";
  });

  const subs = [
    { t: "02:14:08", u: "shadowroot", m: "M03", f: "ACC{phish_net}", s: "Accepted" },
    { t: "02:11:44", u: "packetwitch", m: "M02", f: "ACC{bad}", s: "Rejected" },
    { t: "02:09:12", u: "nullsector", m: "M01", f: "ACC{recon_ok}", s: "Accepted" },
    { t: "02:03:55", u: "cipherkid", m: "M02", f: "ACC{footprint_mapped}", s: "Pending" },
  ];
  const st = document.querySelector("#subTable tbody");
  subs.forEach((s) => {
    const tr = document.createElement("tr");
    const badge =
      s.s === "Accepted"
        ? "badge-green"
        : s.s === "Rejected"
          ? "badge-red"
          : "badge-yellow";
    tr.innerHTML = `
      <td class="mono">${s.t}</td>
      <td class="mono">${s.u}</td>
      <td class="mono">${s.m}</td>
      <td class="code">${s.f}</td>
      <td><span class="badge ${badge}">${s.s}</span></td>
      <td><button class="btn btn-ghost btn-sm" type="button">Review</button></td>`;
    st.appendChild(tr);
  });
})();
