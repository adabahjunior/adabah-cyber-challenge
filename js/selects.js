(() => {
  const CHEVRON = `<svg class="acc-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

  function enhanceSelect(select) {
    if (!select || select.dataset.accSelect === "1") return;
    select.dataset.accSelect = "1";
    select.classList.add("acc-select-native");
    select.style.position = "absolute";
    select.style.opacity = "0";
    select.style.pointerEvents = "none";
    select.style.width = "1px";
    select.style.height = "1px";
    select.tabIndex = -1;

    const wrap = document.createElement("div");
    wrap.className = "acc-select";
    wrap.dataset.name = select.name || select.id || "";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "acc-select-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    const valueEl = document.createElement("span");
    valueEl.className = "value";
    trigger.appendChild(valueEl);
    trigger.insertAdjacentHTML("beforeend", CHEVRON);

    const menu = document.createElement("div");
    menu.className = "acc-select-menu";
    menu.hidden = true;
    menu.setAttribute("role", "listbox");

    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);

    function syncLabel() {
      const opt = select.options[select.selectedIndex];
      const text = opt?.textContent?.trim() || "";
      const isPlaceholder = !select.value;
      valueEl.textContent = text || "Select";
      valueEl.classList.toggle("placeholder", isPlaceholder);
      menu.querySelectorAll(".acc-select-option").forEach((btn) => {
        btn.setAttribute(
          "aria-selected",
          btn.dataset.value === select.value ? "true" : "false"
        );
      });
    }

    function buildOptions() {
      menu.innerHTML = "";
      [...select.options].forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "acc-select-option";
        btn.setAttribute("role", "option");
        btn.dataset.value = opt.value;
        btn.textContent = opt.textContent;
        if (opt.disabled) btn.disabled = true;
        btn.addEventListener("click", () => {
          select.value = opt.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          syncLabel();
          close();
        });
        menu.appendChild(btn);
      });
      syncLabel();
    }

    function open() {
      document.querySelectorAll(".acc-select.open").forEach((el) => {
        if (el !== wrap) el.classList.remove("open");
        el.querySelector(".acc-select-menu")?.setAttribute("hidden", "");
        el.querySelector(".acc-select-trigger")?.setAttribute("aria-expanded", "false");
      });
      wrap.classList.add("open");
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    function close() {
      wrap.classList.remove("open");
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (wrap.classList.contains("open")) close();
      else open();
    });

    select.addEventListener("change", syncLabel);

    const mo = new MutationObserver(buildOptions);
    mo.observe(select, { childList: true, subtree: true, characterData: true });

    buildOptions();
  }

  function initAccSelects(root = document) {
    root.querySelectorAll("select").forEach(enhanceSelect);
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".acc-select")) return;
    document.querySelectorAll(".acc-select.open").forEach((el) => {
      el.classList.remove("open");
      el.querySelector(".acc-select-menu")?.setAttribute("hidden", "");
      el.querySelector(".acc-select-trigger")?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("DOMContentLoaded", () => initAccSelects());

  window.ACCSelect = { init: initAccSelects, enhance: enhanceSelect };
})();
