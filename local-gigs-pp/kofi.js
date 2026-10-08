/* Local Gigs PP — Ko-fi support link (WEB ONLY; never shown in the Play/TWA app or an installed PWA).
   Used by every /site/ page only. Kept OFF the root PWA index.html on purpose (Karen 2026-10-08:
   that page is the Android TWA start URL; Play Payments policy bars in-app links to outside payments). Markup: any element with class
   "kofi-slot" starts with the `hidden` attribute; links inside carry `data-kofi`.
   How the app-shell hide works (two layers):
     1. JS: the slot stays hidden if the page was opened by the Android TWA (document.referrer
        starts with "android-app://" or window.getDigitalGoodsService exists (Chrome's TWA-only
        signal), remembered in sessionStorage for later pages in the same
        tab) or runs in display-mode standalone / fullscreen / minimal-ui, or iOS navigator.standalone.
     2. CSS (styles.css + site/site.css): @media (display-mode: standalone|fullscreen|minimal-ui)
        forces .kofi-slot { display: none } even if this script never runs.
   No tracking, no storage beyond the one sessionStorage flag "lgpp.twa". */
(function () {
  "use strict";

  /* ONE place to swap in the real Ko-fi URL once Karen sends it. */
  var KOFI_URL = "https://ko-fi.com/talentlesshackdev";

  var TWA_FLAG = "lgpp.twa";
  var CUP =
    '<svg class="kofi-cup" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/>' +
    '<path d="M8 3.5c0 1 .8 1.3.8 2.3M11.5 3.5c0 1 .8 1.3.8 2.3"/></svg>';

  function inAppShell() {
    if ("getDigitalGoodsService" in window) {
      try { sessionStorage.setItem(TWA_FLAG, "1"); } catch (e) {}
      return true;
    }
    try {
      if (String(document.referrer).indexOf("android-app://") === 0) sessionStorage.setItem(TWA_FLAG, "1");
      if (sessionStorage.getItem(TWA_FLAG) === "1") return true;
    } catch (e) { /* storage blocked: fall through to display-mode checks */ }
    var mm = window.matchMedia;
    if (mm && (mm("(display-mode: standalone)").matches || mm("(display-mode: fullscreen)").matches || mm("(display-mode: minimal-ui)").matches)) return true;
    if (navigator.standalone === true) return true;
    return false;
  }

  function wire() {
    if (inAppShell()) {
      document.documentElement.classList.add("kofi-off");
      return; /* slots keep their `hidden` attribute */
    }
    document.querySelectorAll("a[data-kofi]").forEach(function (a) {
      a.href = KOFI_URL;
      a.target = "_blank";
      a.rel = "noopener";
      if (!a.querySelector(".kofi-cup")) a.insertAdjacentHTML("afterbegin", CUP);
    });
    document.querySelectorAll(".kofi-slot").forEach(function (el) { el.hidden = false; });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
