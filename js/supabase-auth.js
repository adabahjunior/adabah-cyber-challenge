// ADABAH Cyber Challenge — Supabase Auth client

const SUPABASE_URL = "https://zxxhkhnqcilqktmyblhf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eGhraG5xY2lscWt0bXlibGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODMyNjIsImV4cCI6MjA5MDM1OTI2Mn0.7MBCRen-QVFJlKi-4AL33UO6OPBwz58h72fjAwh1UnI";

const ADMIN_EMAIL = "adabahjunior@gmail.com";

const DEFAULT_MISSIONS = [
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

let _client = null;

async function loadSdk() {
  if (window.supabase?.createClient) return window.supabase;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/dist/umd/supabase.min.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load Supabase SDK"));
    document.head.appendChild(s);
  });
  return window.supabase;
}

async function getClient() {
  if (_client) return _client;
  const sb = await loadSdk();
  _client = sb.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
  return _client;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isAdminEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

async function getSession() {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

async function getProfile() {
  const supabase = await getClient();
  const session = await getSession();
  if (!session?.user) return null;
  const { data, error } = await supabase
    .from("acc_profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function profileToLocal(profile, session) {
  if (!profile && !session) return ACC.defaultUser();
  return {
    ...ACC.defaultUser(),
    fullName: profile?.full_name || "",
    email: profile?.email || session?.user?.email || "",
    department: profile?.department || "",
    whatsapp: profile?.whatsapp || "",
    level: profile?.level || "Beginner",
    username: profile?.username || "",
    hackerName: profile?.hacker_name || profile?.username || "",
    avatar: profile?.avatar_style || profile?.avatar || "pulse",
    avatarStyle: profile?.avatar_style || profile?.avatar || "pulse",
    portraitUrl: profile?.portrait_url || "",
    score: profile?.score ?? 0,
    rank: profile?.rank ?? null,
    progress: profile?.progress ?? 0,
    warnings: profile?.warnings ?? 0,
    completed: profile?.completed_missions || [],
    totalTimeSec: profile?.total_time_sec ?? 0,
    hintsUsed: profile?.hints_used ?? 0,
    finalMissionScore: profile?.final_mission_score ?? 0,
    competitionCompletedAt: profile?.competition_completed_at || null,
    certificateId: profile?.certificate_id || null,
    awards: profile?.awards || [],
    leaderboardEligible: profile?.leaderboard_eligible !== false,
    onboarded: Boolean(profile?.onboarded_at),
    isAdmin: isAdminEmail(profile?.email || session?.user?.email),
  };
}

async function syncLocalFromCloud() {
  const session = await getSession();
  if (!session) return null;
  const profile = await getProfile();
  const local = profileToLocal(profile, session);
  ACC.saveUser(local);
  return { session, profile, local };
}

async function isAdmin() {
  const session = await getSession();
  return isAdminEmail(session?.user?.email);
}

async function requireAdmin() {
  const synced = await requireCloudAuth();
  if (!synced) return null;
  if (!isAdminEmail(synced.session?.user?.email || synced.local?.email)) {
    location.href = "dashboard.html";
    return null;
  }
  return synced;
}

async function listParticipants({ includeExcluded = false } = {}) {
  const supabase = await getClient();

  if (includeExcluded) {
    const adminList = await supabase.rpc("acc_admin_list_participants");
    if (!adminList.error && adminList.data) return adminList.data;
  }

  const ranked = await supabase.rpc("acc_ranked_participants");
  if (!ranked.error && ranked.data) {
    return ranked.data;
  }

  let query = supabase
    .from("acc_profiles")
    .select(
      "id, email, full_name, department, level, username, hacker_name, avatar, avatar_style, portrait_url, whatsapp, score, rank, progress, warnings, completed_missions, total_time_sec, hints_used, final_mission_score, competition_completed_at, certificate_id, awards, leaderboard_eligible, onboarded_at, created_at"
    )
    .not("onboarded_at", "is", null)
    .order("score", { ascending: false })
    .order("final_mission_score", { ascending: false })
    .order("total_time_sec", { ascending: true })
    .order("hints_used", { ascending: true })
    .order("created_at", { ascending: true });

  if (!includeExcluded) {
    query = query.eq("leaderboard_eligible", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

function rankParticipants(rows) {
  return (rows || []).map((row, index) => {
    const eligible = row.leaderboard_eligible !== false;
    const missions = Array.isArray(row.completed_missions) ? row.completed_missions.length : 0;
    return {
      ...row,
      leaderboard_eligible: eligible,
      computed_rank: eligible
        ? Number(row.computed_rank || row.rank || index + 1)
        : null,
      handle: row.hacker_name || row.username || "student",
      missions,
      badge: ACC.badgeFor?.(row.score || 0, missions) || "Recruit",
      awardLabels: (row.awards || []).map((a) => (window.ACCComp?.AWARDS?.[a]?.title) || a),
    };
  });
}

async function listLeaderboard() {
  const rows = await listParticipants({ includeExcluded: false });
  return rankParticipants(rows);
}

async function listAdminParticipants() {
  const rows = await listParticipants({ includeExcluded: true });
  return rankParticipants(rows);
}

async function setLeaderboardEligible(userId, eligible) {
  if (!(await isAdmin())) throw new Error("Admin access required");
  const supabase = await getClient();
  const { data, error } = await supabase.rpc("acc_set_leaderboard_eligible", {
    p_user_id: userId,
    p_eligible: Boolean(eligible),
  });
  if (error) throw error;
  return data;
}

async function recordMissionComplete({ missionId, score = 0, elapsedSec = 0, hintsUsed = 0 }) {
  const supabase = await getClient();
  const { data, error } = await supabase.rpc("acc_record_mission_complete", {
    p_mission_id: missionId,
    p_score: Number(score) || 0,
    p_elapsed_sec: Number(elapsedSec) || 0,
    p_hints_used: Number(hintsUsed) || 0,
  });
  if (error) throw error;
  await syncLocalFromCloud().catch(() => null);
  return data;
}

async function listActivity(limit = 40) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("acc_activity")
    .select("id, user_id, event_type, message, meta, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

async function listMissionRuns() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("acc_mission_runs")
    .select("id, user_id, mission_id, score, elapsed_sec, hints_used, started_at, completed_at")
    .order("completed_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function getCompetition() {
  const supabase = await getClient();
  const { data, error } = await supabase.from("acc_competition").select("*").eq("id", "season1").maybeSingle();
  if (error) throw error;
  return data;
}

async function setCompetitionStatus(status) {
  if (!(await isAdmin())) throw new Error("Admin access required");
  const supabase = await getClient();
  const patch = { status, updated_at: new Date().toISOString() };
  if (status === "active") patch.started_at = new Date().toISOString();
  if (status === "completed") patch.ended_at = new Date().toISOString();
  const { data, error } = await supabase
    .from("acc_competition")
    .upsert({ id: "season1", title: "ADABAH Cyber Challenge · Season 1", ...patch }, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function refreshAwards() {
  if (!(await isAdmin())) throw new Error("Admin access required");
  const supabase = await getClient();
  const { error } = await supabase.rpc("acc_refresh_awards");
  if (error) throw error;
  return true;
}

async function getCompetitionStats() {
  const [board, runs, activity, missions, competition] = await Promise.all([
    listLeaderboard(),
    listMissionRuns().catch(() => []),
    listActivity(30).catch(() => []),
    listMissions({ includeInactive: true }).catch(() => []),
    getCompetition().catch(() => null),
  ]);
  const completedParticipants = board.filter((b) => (b.missions || 0) >= 9).length;
  const activeParticipants = board.filter((b) => (b.missions || 0) > 0 && (b.missions || 0) < 9).length;
  const avgScore = board.length
    ? Math.round(board.reduce((s, b) => s + Number(b.score || 0), 0) / board.length)
    : 0;
  const totalMissionCompletions = board.reduce((s, b) => s + Number(b.missions || 0), 0);
  const avgCompletionRate = board.length ? Math.round((totalMissionCompletions / (board.length * 9)) * 100) : 0;
  return {
    board,
    runs,
    activity,
    missions,
    competition,
    totals: {
      registered: board.length,
      active: activeParticipants,
      completed: completedParticipants,
      avgScore,
      avgCompletionRate,
      totalMissionCompletions,
      leader: board[0] || null,
    },
  };
}

function normalizeMission(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category || "General",
    difficulty: row.difficulty || "Beginner",
    points: Number(row.points || 0),
    week: Number(row.week || 1),
    active: Boolean(row.active),
    href: row.href || "mission-001/index.html",
    sort_order: Number(row.sort_order || 100),
  };
}

async function listMissions({ includeInactive = false } = {}) {
  const supabase = await getClient();
  let query = supabase
    .from("acc_missions")
    .select("id, title, category, difficulty, points, week, active, href, sort_order")
    .order("week", { ascending: true })
    .order("sort_order", { ascending: true });
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) {
    // Table may not exist yet — fall back to Mission 001 only
    console.warn("acc_missions unavailable, using default catalog", error.message);
    const rows = DEFAULT_MISSIONS.map(normalizeMission);
    return includeInactive ? rows : rows.filter((m) => m.active);
  }
  if (!data?.length && includeInactive) {
    // Seed default row for admin if empty
    return DEFAULT_MISSIONS.map(normalizeMission);
  }
  return (data || []).map(normalizeMission);
}

async function listActiveMissions() {
  return listMissions({ includeInactive: false });
}

async function updateMission(id, patch) {
  if (!(await isAdmin())) throw new Error("Admin access required");
  const supabase = await getClient();
  const payload = {
    ...patch,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("acc_missions")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    if (payload.week != null && /week|check/i.test(error.message || "")) {
      throw new Error(
        "This database still limits missions to Weeks 1–3. Run the latest acc_missions week migration in Supabase, then retry."
      );
    }
    throw error;
  }
  if (!data) {
    // Insert if missing (first-time seed)
    const base = DEFAULT_MISSIONS.find((m) => m.id === id) || {
      id,
      title: id,
      category: "General",
      difficulty: "Beginner",
      points: 100,
      week: 1,
      active: false,
      href: "mission-001/index.html",
      sort_order: 100,
    };
    const { data: inserted, error: insertErr } = await supabase
      .from("acc_missions")
      .upsert({ ...base, ...payload }, { onConflict: "id" })
      .select("*")
      .single();
    if (insertErr) throw insertErr;
    return normalizeMission(inserted);
  }
  return normalizeMission(data);
}

async function ensureDefaultMissions() {
  if (!(await isAdmin())) return;
  const supabase = await getClient();
  const existing = await listMissions({ includeInactive: true }).catch(() => []);
  const have = new Set((existing || []).map((m) => m.id));
  const missing = DEFAULT_MISSIONS.filter((m) => !have.has(m.id));
  if (!missing.length) return;

  // Insert one-by-one so a single constraint failure cannot block the rest
  for (const m of missing) {
    const row = { ...m, updated_at: new Date().toISOString() };
    let { error } = await supabase.from("acc_missions").upsert(row, { onConflict: "id" });
    if (error && /week|check/i.test(error.message || "") && Number(m.week) > 3) {
      // Older DBs only allow weeks 1–3 until migration runs
      ({ error } = await supabase
        .from("acc_missions")
        .upsert({ ...row, week: 3 }, { onConflict: "id" }));
    }
    if (error) console.warn(`Could not seed mission ${m.id}`, error.message);
  }
}

async function downloadPortraitAsJpg(url, filename = "portrait.jpg") {
  if (!url) throw new Error("No portrait uploaded");
  const cleanUrl = String(url).split("?")[0];
  const res = await fetch(cleanUrl, { mode: "cors", cache: "no-store" });
  if (!res.ok) throw new Error("Could not download portrait");
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  const jpgBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("JPG encode failed"))), "image/jpeg", 0.92);
  });

  const safeName = String(filename || "portrait").replace(/[^\w.-]+/g, "_");
  const finalName = safeName.toLowerCase().endsWith(".jpg") ? safeName : `${safeName}.jpg`;
  const href = URL.createObjectURL(jpgBlob);
  const a = document.createElement("a");
  a.href = href;
  a.download = finalName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

async function signUp({ email, password, fullName, username }) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/login.html`,
      data: {
        full_name: fullName || "",
        username: username || "",
      },
    },
  });
  if (error) throw error;
  return data;
}

async function signIn({ email, password }) {
  const supabase = await getClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await syncLocalFromCloud();
  return data;
}

async function signOut() {
  const supabase = await getClient();
  await supabase.auth.signOut();
  localStorage.removeItem("acc_participant_v1");
}

async function uploadPortrait(file) {
  const supabase = await getClient();
  const session = await getSession();
  if (!session?.user) throw new Error("Please sign in first.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${session.user.id}/portrait.${ext === "jpeg" ? "jpg" : ext}`;
  const { error: upErr } = await supabase.storage.from("acc-portraits").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from("acc-portraits").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

async function completeOnboarding(payload) {
  const supabase = await getClient();
  const { data, error } = await supabase.rpc("acc_complete_onboarding", {
    p_full_name: payload.fullName,
    p_department: payload.department,
    p_level: payload.level,
    p_username: payload.username,
    p_hacker_name: payload.hackerName,
    p_avatar: payload.avatar || payload.avatarStyle || "pulse",
    p_portrait_url: payload.portraitUrl,
    p_avatar_style: payload.avatarStyle || payload.avatar || "pulse",
    p_whatsapp: payload.whatsapp,
  });
  if (error) throw error;
  await syncLocalFromCloud();
  return data;
}

async function isAccessHoldActive() {
  try {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("acc_settings")
      .select("value")
      .eq("key", "access_hold")
      .maybeSingle();
    if (error) {
      console.warn("access_hold setting unavailable", error.message);
      return true;
    }
    if (!data) return true;
    return Boolean(data.value?.active);
  } catch (err) {
    console.warn(err);
    return true;
  }
}

async function setAccessHoldActive(active) {
  if (!(await isAdmin())) throw new Error("Admin access required");
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("acc_settings")
    .upsert(
      {
        key: "access_hold",
        value: { active: Boolean(active) },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )
    .select("value")
    .single();
  if (error) throw error;
  return Boolean(data.value?.active);
}

async function resolvePostAuthPath(synced) {
  if (!synced?.session) return "login.html";
  if (!synced.local?.onboarded) return "onboarding.html";
  if (synced.local?.isAdmin || isAdminEmail(synced.session?.user?.email)) return "dashboard.html";
  const hold = await isAccessHoldActive();
  return hold ? "pending.html" : "dashboard.html";
}

async function requireCloudAuth(options = {}) {
  const { allowHoldPage = false } = options;
  const session = await getSession();
  if (!session) {
    location.href = "login.html";
    return null;
  }
  const synced = await syncLocalFromCloud();
  if (!synced?.local?.onboarded) {
    location.href = "onboarding.html";
    return null;
  }

  const admin = synced.local?.isAdmin || isAdminEmail(synced.session?.user?.email);
  if (!admin) {
    const hold = await isAccessHoldActive();
    if (hold && !allowHoldPage) {
      location.href = "pending.html";
      return null;
    }
  }

  return synced;
}

if (typeof window.ACC === "undefined") {
  console.warn("ACC core missing — load js/core.js before js/supabase-auth.js");
}

window.ACCAuth = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  ADMIN_EMAIL,
  getClient,
  getSession,
  getProfile,
  syncLocalFromCloud,
  signUp,
  signIn,
  signOut,
  uploadPortrait,
  completeOnboarding,
  requireCloudAuth,
  requireAdmin,
  isAdmin,
  isAdminEmail,
  isAccessHoldActive,
  setAccessHoldActive,
  resolvePostAuthPath,
  listParticipants,
  listLeaderboard,
  listAdminParticipants,
  setLeaderboardEligible,
  listMissions,
  listActiveMissions,
  updateMission,
  ensureDefaultMissions,
  downloadPortraitAsJpg,
  profileToLocal,
  recordMissionComplete,
  listActivity,
  listMissionRuns,
  getCompetition,
  setCompetitionStatus,
  refreshAwards,
  getCompetitionStats,
  DEFAULT_MISSIONS,
};
