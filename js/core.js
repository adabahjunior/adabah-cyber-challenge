(() => {
  const STORAGE_KEY = "acc_participant_v1";

  const defaultUser = () => ({
    fullName: "",
    email: "",
    department: "",
    level: "Beginner",
    username: "",
    hackerName: "",
    avatar: "pulse",
    avatarStyle: "pulse",
    portraitUrl: "",
    onboarded: false,
    score: 0,
    rank: null,
    progress: 0,
    completed: [],
    warnings: 0,
  });

  function loadUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaultUser(), ...JSON.parse(raw) } : defaultUser();
    } catch {
      return defaultUser();
    }
  }

  function saveUser(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function initials(name) {
    return (name || "ACC")
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function requireAuth() {
    const user = loadUser();
    if (!user.onboarded) {
      location.href = "login.html";
      return null;
    }
    return user;
  }

  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const links = document.querySelector("[data-nav-links]");
    toggle?.addEventListener("click", () => links?.classList.toggle("open"));

    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav-links] a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path) a.classList.add("active");
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  function startCountdown(root, endDate) {
    if (!root) return;
    const cells = {
      days: root.querySelector("[data-days]"),
      hours: root.querySelector("[data-hours]"),
      mins: root.querySelector("[data-mins]"),
      secs: root.querySelector("[data-secs]"),
    };

    const tick = () => {
      const diff = Math.max(0, endDate - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (cells.days) cells.days.textContent = String(d).padStart(2, "0");
      if (cells.hours) cells.hours.textContent = String(h).padStart(2, "0");
      if (cells.mins) cells.mins.textContent = String(m).padStart(2, "0");
      if (cells.secs) cells.secs.textContent = String(s).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
  }

  function typeTerminal(el, lines, speed = 18) {
    if (!el || !lines?.length) return;
    let i = 0;
    let line = 0;
    el.textContent = "";
    const run = () => {
      if (line >= lines.length) return;
      const current = lines[line];
      if (i <= current.length) {
        el.innerHTML =
          lines
            .slice(0, line)
            .map((l) => escapeLine(l))
            .join("<br>") +
          (line ? "<br>" : "") +
          escapeLine(current.slice(0, i)) +
          '<span class="cursor-blink"></span>';
        i += 1;
        setTimeout(run, speed);
      } else {
        line += 1;
        i = 0;
        setTimeout(run, 280);
      }
    };
    run();
  }

  function escapeLine(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^\$ (.*)$/, '<span class="prompt">$</span> $1')
      .replace(/^OK (.*)$/, '<span class="ok">OK</span> $1');
  }

  const LEADERBOARD = [
    { rank: 1, user: "shadowroot", score: 4820, missions: 10, badge: "Elite" },
    { rank: 2, user: "packetwitch", score: 4510, missions: 9, badge: "Elite" },
    { rank: 3, user: "nullsector", score: 4200, missions: 9, badge: "Pro" },
    { rank: 4, user: "cipherkid", score: 3890, missions: 8, badge: "Pro" },
    { rank: 5, user: "redops_gh", score: 3605, missions: 8, badge: "Pro" },
    { rank: 6, user: "vaultbreaker", score: 3340, missions: 7, badge: "Rising" },
    { rank: 7, user: "hexwalker", score: 3120, missions: 7, badge: "Rising" },
    { rank: 8, user: "tracezero", score: 2980, missions: 6, badge: "Rising" },
    { rank: 9, user: "bitstorm", score: 2755, missions: 6, badge: "Operative" },
    { rank: 10, user: "ghostline", score: 2510, missions: 5, badge: "Operative" },
    { rank: 11, user: "netphantom", score: 2340, missions: 5, badge: "Operative" },
    { rank: 12, user: "payloadx", score: 2100, missions: 4, badge: "Operative" },
    { rank: 13, user: "fwbypass", score: 1880, missions: 4, badge: "Recruit" },
    { rank: 14, user: "you", score: 1250, missions: 3, badge: "Recruit", self: true },
    { rank: 15, user: "scanbot", score: 980, missions: 2, badge: "Recruit" },
  ];

  const MISSIONS = {
    1: [
      { id: "M01", title: "Recon Protocol", diff: "Easy", pts: 100, status: "completed" },
      { id: "M02", title: "Footprint Analysis", diff: "Easy", pts: 150, status: "available" },
      { id: "M03", title: "Phishing Lab", diff: "Medium", pts: 200, status: "available" },
      { id: "M04", title: "Password Fortress", diff: "Medium", pts: 250, status: "locked" },
    ],
    2: [
      { id: "M05", title: "Web Intrusion", diff: "Medium", pts: 300, status: "locked" },
      { id: "M06", title: "SQL Shadow", diff: "Hard", pts: 400, status: "locked" },
      { id: "M07", title: "Privilege Escalation", diff: "Hard", pts: 450, status: "locked" },
    ],
    3: [
      { id: "M08", title: "Network Breach", diff: "Hard", pts: 500, status: "locked" },
      { id: "M09", title: "Blue Team Defense", diff: "Insane", pts: 600, status: "locked" },
      { id: "M10", title: "Final Operation", diff: "Insane", pts: 800, status: "locked" },
    ],
  };

  window.ACC = {
    loadUser,
    saveUser,
    defaultUser,
    initials,
    requireAuth,
    initNav,
    initReveal,
    startCountdown,
    typeTerminal,
    LEADERBOARD,
    MISSIONS,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
  });
})();
