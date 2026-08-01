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
    if (missions >= 9) return "Cyber Champion";
    if (score >= 4000 || missions >= 8) return "Elite";
    if (score >= 3000 || missions >= 7) return "Pro";
    if (score >= 2000 || missions >= 5) return "Rising";
    if (score >= 500 || missions >= 2) return "Operative";
    return "Recruit";
  }

  function formatDuration(sec) {
    const s = Math.max(0, Number(sec) || 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    if (h) return `${h}h ${m}m`;
    return `${m}m ${String(r).padStart(2, "0")}s`;
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
    {
      id: "M04",
      title: "The Breached Vault",
      category: "Authentication & Password Security",
      difficulty: "Intermediate",
      points: 100,
      week: 2,
      active: false,
      href: "mission-004/index.html",
      sort_order: 4,
    },
    {
      id: "M05",
      title: "The Hidden Website",
      category: "Web Security & Client-Side Investigation",
      difficulty: "Intermediate",
      points: 100,
      week: 3,
      active: false,
      href: "mission-005/index.html",
      sort_order: 5,
    },
    {
      id: "M06",
      title: "Operation Blackout – Part I: The Breach",
      category: "Incident Response & Digital Investigation",
      difficulty: "Advanced",
      points: 100,
      week: 4,
      active: false,
      href: "mission-006/index.html",
      sort_order: 6,
    },
    {
      id: "M07",
      title: "Operation Blackout – Part II: The Hunt",
      category: "Threat Hunting & Log Analysis",
      difficulty: "Advanced",
      points: 100,
      week: 4,
      active: false,
      href: "mission-007/index.html",
      sort_order: 7,
    },
    {
      id: "M08",
      title: "Operation Blackout – Part III: The Payload",
      category: "Malware Analysis & Incident Containment",
      difficulty: "Advanced",
      points: 100,
      week: 4,
      active: false,
      href: "mission-008/index.html",
      sort_order: 8,
    },
    {
      id: "M09",
      title: "Operation Blackout – Final: Cyber Champion",
      category: "Capstone Challenge",
      difficulty: "Expert",
      points: 150,
      week: 4,
      active: false,
      href: "mission-009/index.html",
      sort_order: 9,
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
    formatDuration,
    MISSION_CATALOG,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
  });
})();
