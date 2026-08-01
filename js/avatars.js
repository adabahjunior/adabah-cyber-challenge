/**
 * Animated display avatars for ACC.
 */
(() => {
  const AVATARS = [
    { id: "pulse", name: "Pulse", html: `<span class="anim-avatar pulse"><span class="ring"></span><span class="core"></span></span>` },
    { id: "orbit", name: "Orbit", html: `<span class="anim-avatar orbit"><span class="core"></span><span class="sat"></span></span>` },
    { id: "scan", name: "Scan", html: `<span class="anim-avatar scan"><span class="face"></span><span class="beam"></span></span>` },
    { id: "shield", name: "Shield", html: `<span class="anim-avatar shield"><span class="plate"></span><span class="glow"></span></span>` },
    { id: "spark", name: "Spark", html: `<span class="anim-avatar spark"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span><span class="core"></span></span>` },
    { id: "wave", name: "Wave", html: `<span class="anim-avatar wave"><span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span><span class="bar b4"></span></span>` },
    { id: "hex", name: "Hex", html: `<span class="anim-avatar hex"><span class="shape"></span></span>` },
    { id: "blink", name: "Blink", html: `<span class="anim-avatar blink"><span class="eye"></span></span>` },
  ];

  function renderPicker(container, selectedId, onSelect) {
    container.innerHTML = "";
    AVATARS.forEach((a) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "avatar-option anim-option" + (a.id === selectedId ? " active" : "");
      btn.dataset.id = a.id;
      btn.innerHTML = `${a.html}<span class="anim-label">${a.name}</span>`;
      btn.addEventListener("click", () => {
        container.querySelectorAll(".avatar-option").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        onSelect?.(a.id);
      });
      container.appendChild(btn);
    });
  }

  function getHtml(id) {
    return AVATARS.find((a) => a.id === id)?.html || AVATARS[0].html;
  }

  function mount(el, id, sizeClass = "") {
    if (!el) return;
    el.innerHTML = `<span class="anim-mount ${sizeClass}">${getHtml(id || "pulse")}</span>`;
  }

  window.ACCAvatars = { AVATARS, renderPicker, getHtml, mount };
})();
