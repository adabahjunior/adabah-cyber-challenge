# ADABAH Cyber Challenge — Supabase Auth client

const SUPABASE_URL = "https://zxxhkhnqcilqktmyblhf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eGhraG5xY2lscWt0bXlibGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODMyNjIsImV4cCI6MjA5MDM1OTI2Mn0.7MBCRen-QVFJlKi-4AL33UO6OPBwz58h72fjAwh1UnI";

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

window.ACCAuth = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
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
  profileToLocal,
};
