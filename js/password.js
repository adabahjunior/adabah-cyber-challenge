(() => {
  function enhancePasswordField(input) {
    if (!input || input.dataset.showPass === "1") return;
    input.dataset.showPass = "1";

    const wrap = document.createElement("div");
    wrap.className = "password-field";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "password-toggle";
    btn.setAttribute("aria-label", "Show password");
    btn.textContent = "Show";
    wrap.appendChild(btn);

    btn.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  }

  function initPasswordToggles(root = document) {
    root.querySelectorAll('input[type="password"]').forEach(enhancePasswordField);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initPasswordToggles());
  } else {
    initPasswordToggles();
  }

  window.ACCPassword = { init: initPasswordToggles, enhance: enhancePasswordField };
})();
