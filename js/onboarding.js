(() => {
  let step = 1;
  const total = 5;
  const draft = ACC.loadUser();
  let avatarStyle = draft.avatarStyle || "pulse";
  let accountPassword = "";
  let portraitFile = null;
  let portraitPreviewUrl = draft.portraitUrl || "";

  const panes = [...document.querySelectorAll(".onboard-pane")];
  const stepsEl = document.getElementById("steps");
  const picker = document.getElementById("avatarPicker");
  const portraitInput = document.getElementById("portraitInput");
  const portraitPreview = document.getElementById("portraitPreview");

  ACCAvatars.renderPicker(picker, avatarStyle, (id) => {
    avatarStyle = id;
  });

  function showPortraitPreview(url) {
    if (!url) {
      portraitPreview.textContent = "No photo yet";
      portraitPreview.classList.remove("has-img");
      return;
    }
    portraitPreview.innerHTML = `<img src="${url}" alt="Your portrait">`;
  }

  if (portraitPreviewUrl) showPortraitPreview(portraitPreviewUrl);

  document.getElementById("portraitBtn").addEventListener("click", () => portraitInput.click());
  portraitInput.addEventListener("change", () => {
    const file = portraitInput.files?.[0];
    const err = document.getElementById("identityError");
    err.textContent = "";
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      err.textContent = "Please upload a JPG, PNG, or WebP photo.";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      err.textContent = "Please keep your photo under 5 MB.";
      return;
    }
    portraitFile = file;
    if (portraitPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(portraitPreviewUrl);
    portraitPreviewUrl = URL.createObjectURL(file);
    showPortraitPreview(portraitPreviewUrl);
  });

  function renderSteps() {
    stepsEl.innerHTML = "";
    for (let i = 1; i <= total; i++) {
      const s = document.createElement("span");
      s.className = "step-pill" + (i === step ? " active" : i < step ? " done" : "");
      s.textContent = `${i}`;
      stepsEl.appendChild(s);
    }
  }

  function show(n) {
    step = n;
    panes.forEach((p) => {
      p.hidden = Number(p.dataset.step) !== step;
    });
    renderSteps();
    if (step === 5) {
      const finalPortrait = document.getElementById("finalPortrait");
      if (draft.portraitUrl) {
        finalPortrait.innerHTML = `<img src="${draft.portraitUrl}" alt="">`;
        finalPortrait.classList.add("has-photo");
      }
      ACCAvatars.mount(document.getElementById("finalAnim"), draft.avatarStyle || avatarStyle, "lg");
      document.getElementById("finalHandle").textContent = `@${draft.hackerName || draft.username}`;
      document.getElementById("finalMeta").textContent = `${draft.level} · ${draft.department || "Student"}`;
    }
  }

  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.id === "identityNext" || step === 3) {
        const err = document.getElementById("identityError");
        err.textContent = "";
        const name = document.getElementById("hackerName").value.trim();
        if (!portraitFile && !draft.portraitUrl) {
          err.textContent = "Please upload a clear portrait photo of yourself.";
          return;
        }
        if (!document.getElementById("portraitConfirm").checked) {
          err.textContent = "Please confirm your photo is a clear portrait on a plain background.";
          return;
        }
        if (!name) {
          document.getElementById("hackerName").focus();
          err.textContent = "Please choose a display name.";
          return;
        }
        draft.hackerName = name;
        draft.avatarStyle = avatarStyle;
        draft.avatar = avatarStyle;
        ACC.saveUser(draft);
      }
      show(Math.min(total, step + 1));
    });
  });

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => show(Math.max(1, step - 1)));
  });

  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = document.getElementById("profileError");
    const btn = document.getElementById("profileContinue");
    err.textContent = "";

    draft.fullName = document.getElementById("fullName").value.trim();
    draft.email = document.getElementById("email").value.trim();
    draft.department = document.getElementById("department").value;
    draft.level = document.getElementById("level").value;
    draft.username = document.getElementById("username").value.trim();
    accountPassword = document.getElementById("password").value;
    ACC.saveUser(draft);

    btn.disabled = true;
    btn.textContent = "Creating account…";
    try {
      const session = await ACCAuth.getSession();
      if (!session) {
        const result = await ACCAuth.signUp({
          email: draft.email,
          password: accountPassword,
          fullName: draft.fullName,
          username: draft.username,
        });
        if (!result.session) {
          try {
            await ACCAuth.signIn({ email: draft.email, password: accountPassword });
          } catch (_) {
            err.textContent =
              "Account created. If email confirmation is on, check your inbox, then sign in.";
            btn.disabled = false;
            btn.textContent = "Continue";
            return;
          }
        }
      }
      document.getElementById("hackerName").value = draft.hackerName || draft.username;
      show(3);
    } catch (ex) {
      err.textContent = ex.message || "Could not create account";
    } finally {
      btn.disabled = false;
      btn.textContent = "Continue";
    }
  });

  const agree = document.getElementById("agree");
  const agreeBtn = document.getElementById("agreeBtn");
  agree.addEventListener("change", () => {
    agreeBtn.disabled = !agree.checked;
  });
  agreeBtn.addEventListener("click", async () => {
    const err = document.getElementById("agreeError");
    err.textContent = "";
    agreeBtn.disabled = true;
    agreeBtn.textContent = "Saving…";
    try {
      let portraitUrl = draft.portraitUrl || "";
      if (portraitFile) {
        portraitUrl = await ACCAuth.uploadPortrait(portraitFile);
      }
      if (!portraitUrl) throw new Error("A portrait photo is required.");

      await ACCAuth.completeOnboarding({
        fullName: draft.fullName,
        department: draft.department,
        level: draft.level,
        username: draft.username,
        hackerName: draft.hackerName || draft.username,
        avatar: avatarStyle,
        avatarStyle,
        portraitUrl,
      });
      draft.portraitUrl = portraitUrl;
      draft.avatarStyle = avatarStyle;
      draft.onboarded = true;
      ACC.saveUser(draft);
      show(5);
    } catch (ex) {
      err.textContent = ex.message || "Could not finish setup";
      agreeBtn.disabled = false;
      agreeBtn.textContent = "Finish setup";
    }
  });

  if (draft.fullName) document.getElementById("fullName").value = draft.fullName;
  if (draft.email) document.getElementById("email").value = draft.email;
  if (draft.username) document.getElementById("username").value = draft.username;

  (async () => {
    try {
      const synced = await ACCAuth.syncLocalFromCloud();
      if (synced?.local?.onboarded) {
        location.replace("dashboard.html");
        return;
      }
      if (synced?.session) {
        Object.assign(draft, synced.local);
        if (draft.fullName) document.getElementById("fullName").value = draft.fullName;
        if (draft.email) document.getElementById("email").value = draft.email;
        if (draft.username) document.getElementById("username").value = draft.username;
        if (draft.portraitUrl) {
          portraitPreviewUrl = draft.portraitUrl;
          showPortraitPreview(portraitPreviewUrl);
        }
        if (draft.avatarStyle) {
          avatarStyle = draft.avatarStyle;
          ACCAvatars.renderPicker(picker, avatarStyle, (id) => {
            avatarStyle = id;
          });
        }
      }
    } catch (_) {}
  })();

  show(1);
})();
