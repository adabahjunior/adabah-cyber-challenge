(() => {
  (async () => {
    const synced = await ACCAuth.requireCloudAuth({ allowHoldPage: true });
    if (!synced) return;

    const hold = await ACCAuth.isAccessHoldActive();
    if (!hold || synced.local.isAdmin) {
      location.replace("dashboard.html");
      return;
    }

    const user = synced.local;
    const handle = user.hackerName || user.username || "student";
    document.getElementById("pendingHandle").textContent = `@${handle}`;
    document.getElementById("pendingMeta").textContent = [
      user.fullName || "Student",
      user.department || null,
      user.level || null,
    ]
      .filter(Boolean)
      .join(" · ");
    document.getElementById("pendingWhatsapp").textContent = user.whatsapp
      ? `WhatsApp on file: ${user.whatsapp}`
      : "WhatsApp number saved during registration";

    ACC.typeTerminal(
      document.getElementById("pendingTerm"),
      [
        "$ registration received",
        "OK profile locked for review",
        "$ notify admin",
        "OK WhatsApp outreach queued",
        "$ waiting for clearance_",
      ],
      14
    );

    document.getElementById("signOutBtn")?.addEventListener("click", async () => {
      await ACCAuth.signOut();
      location.href = "login.html";
    });
  })().catch((err) => {
    console.error(err);
    location.href = "login.html";
  });
})();
