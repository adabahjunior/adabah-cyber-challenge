(() => {
  const STORAGE_KEY = "acc_participant_v1";

  const defaultUser = () => ({
    fullName: "",
    email: "",
    department: "",
    level: "Beginner",
    whatsapp: "",
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
    isAdmin: false,
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

  function badgeFor(score, missions) {
    if (score >= 4000 || missions >= 9) return "Elite";
    if (score >= 3000 || missions >= 7) return "Pro";
    if (score >= 2000 || missions >= 5) return "Rising";
    if (score >= 500 || missions >= 2) return "Operative";
    return "Recruit";
  }

  const MISSION_CATALOG = [
    {
      id: "M01",
      title: "The Phishing Trap",
      category: "Social Engineering",
      difficulty: "Beginner",
      points: 100,
      week: 1,
      active: true,
      href: "mission-001/index.html",
      sort_order: 1,
    },
    {
      id: "M02",
      title: "The Hidden Trail",
      category: "Digital Forensics & OSINT",
      difficulty: "Beginner → Intermediate",
      points: 100,
      week: 1,
      active: false,
      href: "mission-002/index.html",
      sort_order: 2,
    },
    {
      id: "M03",
      title: "The Network Intruder",
      category: "Networking & Network Investigation",
      difficulty: "Intermediate",
      points: 100,
      week: 2,
      active: false,
      href: "mission-003/index.html",
      sort_order: 3,
    },
  ];

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
    badgeFor,
    MISSION_CATALOG,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
  });
})();
