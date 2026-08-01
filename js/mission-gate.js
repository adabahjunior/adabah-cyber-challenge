// Redirect non-admin students to pending.html when access hold is active
(async () => {
  try {
    if (!window.ACCAuth) return;
    const session = await ACCAuth.getSession();
    if (!session) {
      location.href = "/login.html";
      return;
    }
    const synced = await ACCAuth.syncLocalFromCloud();
    if (!synced?.local?.onboarded) {
      location.href = "/onboarding.html";
      return;
    }
    if (synced.local?.isAdmin || ACCAuth.isAdminEmail(session.user?.email)) return;
    const hold = await ACCAuth.isAccessHoldActive();
    if (hold) location.href = "/pending.html";
  } catch (_) {
    location.href = "/login.html";
  }
})();
