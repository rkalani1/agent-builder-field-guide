(() => {
  const setupPortal = () => {
    const tabs = Array.from(document.querySelectorAll("[data-portal-tab]"));

    const closeTab = (tab, restoreFocus = false) => {
      const toggle = tab.querySelector(".portal-tabs__toggle");
      if (!toggle) return;
      tab.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", toggle.getAttribute("aria-label").replace(/^Close /, "Open "));
      if (restoreFocus) toggle.focus();
    };

    const closeAll = (except) => {
      tabs.forEach((tab) => {
        if (tab !== except) closeTab(tab);
      });
    };

    tabs.forEach((tab) => {
      const toggle = tab.querySelector(".portal-tabs__toggle");
      const menu = tab.querySelector(".portal-tabs__menu");
      if (!toggle || !menu || toggle.dataset.portalReady === "true") return;
      toggle.dataset.portalReady = "true";
      tab.dataset.open = "false";

      const openTab = (focusFirst = false) => {
        closeAll(tab);
        tab.dataset.open = "true";
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", toggle.getAttribute("aria-label").replace(/^Open /, "Close "));
        if (focusFirst) menu.querySelector("a")?.focus();
      };

      toggle.addEventListener("click", () => {
        if (toggle.getAttribute("aria-expanded") === "true") closeTab(tab);
        else openTab();
      });
      toggle.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown") return;
        event.preventDefault();
        openTab(true);
      });
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        closeTab(tab, true);
      });
      tab.addEventListener("focusout", (event) => {
        if (!tab.contains(event.relatedTarget)) closeTab(tab);
      });
    });

    if (document.documentElement.dataset.portalOutsideClick !== "true") {
      document.documentElement.dataset.portalOutsideClick = "true";
      document.addEventListener("click", (event) => {
        if (!event.target.closest("[data-portal-tab]")) {
          document.querySelectorAll("[data-portal-tab]").forEach((tab) => closeTab(tab));
        }
      });
    }

    const query = document.querySelector('[data-md-component="search-query"]');
    const result = document.querySelector('[data-md-component="search-result"]');
    const meta = result?.querySelector(".md-search-result__meta");
    if (meta) {
      meta.setAttribute("role", "status");
      meta.setAttribute("aria-live", "polite");
      meta.setAttribute("aria-atomic", "true");
    }
    if (query && result && query.dataset.searchReadiness !== "true") {
      query.dataset.searchReadiness = "true";

      // Root cause recorded 2026-07-25: Material loads its search subscriber
      // asynchronously. Text entered or pasted before that mount remains in the
      // field while no query event is replayed after initialization. Re-emit
      // the key event Material consumes for paste, autofill, and early input.
      const replayStrandedQuery = (expectedValue) => {
        if (query.value !== expectedValue) return;
        query.dispatchEvent(new KeyboardEvent("keyup", {
          bubbles: true,
          key: query.value.slice(-1) || "Unidentified",
        }));
      };
      const scheduleReplay = () => {
        const expectedValue = query.value;
        [0, 350, 1000].forEach((delay) => {
          window.setTimeout(() => replayStrandedQuery(expectedValue), delay);
        });
      };
      query.addEventListener("input", scheduleReplay);
      scheduleReplay();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPortal, { once: true });
  } else {
    setupPortal();
  }
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setupPortal);
  }
})();
