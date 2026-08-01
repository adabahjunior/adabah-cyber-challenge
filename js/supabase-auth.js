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

async function listParticipants() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("acc_profiles")
    .select(
      "id, email, full_name, department, level, username, hacker_name, avatar, avatar_style, portrait_url, whatsapp, score, rank, progress, warnings, completed_missions, onboarded_at, created_at"
    )
    .not("onboarded_at", "is", null)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

function rankParticipants(rows) {
  return (rows || []).map((row, index) => ({
    ...row,
    computed_rank: index + 1,
    handle: row.hacker_name || row.username || "student",
    missions: Array.isArray(row.completed_missions) ? row.completed_missions.length : 0,
    badge: ACC.badgeFor?.(row.score || 0, Array.isArray(row.completed_missions) ? row.completed_missions.length : 0) || "Recruit",
  }));
}

async function listLeaderboard() {
  const rows = await listParticipants();
  return rankParticipants(rows);
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
  if (error) throw error;
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
  const { error } = await supabase.from("acc_missions").upsert(
    missing.map((m) => ({
      ...m,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "id" }
  );
  if (error) console.warn("Could not seed default missions", error.message);
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

async function requireCloudAuth() {
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
  listParticipants,
  listLeaderboard,
  listMissions,
  listActiveMissions,
  updateMission,
  ensureDefaultMissions,
  downloadPortraitAsJpg,
  profileToLocal,
  DEFAULT_MISSIONS,
};
