/* Local Gigs PP — website foundation
   Same data contract as the PWA: data/feed.json (shared board) + data/gigs.json (SAMPLE).
   Board submit stays OFF. Soft-launch honesty. No ads / billing. */
(function () {
  "use strict";

  const LOCALES = ["en", "km", "zh", "ru", "ja", "ko"];
  const CATEGORIES = [
    { id: "tutoring", en: "Tutoring", km: "បង្រៀន" },
    { id: "cleaning", en: "Cleaning", km: "សម្អាត" },
    { id: "moto_help", en: "Moto help", km: "ជួយម៉ូតូ" },
    { id: "day_labor", en: "Day labor", km: "ការងារថ្ងៃ" },
    { id: "errands", en: "Errands", km: "រត់ការងារ" },
    { id: "events", en: "Events / F&B", km: "ព្រឹត្តិការណ៍" },
  ];
  const KHANS = [
    "BKK1", "Toul Tom Poung", "Tuol Kork", "Mean Chey",
    "Chamkar Mon", "Chroy Changvar", "Other",
  ];

  /** Depth: home=1 (site/), gigs=2 (site/gigs/) */
  const DEPTH = Number(document.documentElement.getAttribute("data-site-depth") || "1");
  const ROOT = DEPTH === 2 ? "../" : "./";
  const DATA = DEPTH === 2 ? "../../data/" : "../data/";
  const FEED_URL = DATA + "feed.json";
  const SAMPLE_URL = DATA + "gigs.json";
  const LS_LANG = "gigAgg.lang";
  const LS_SAMPLE = "lgpp.site.showSample";

  const I18N = {
    en: {
      brandSub: "Phnom Penh short gigs · off-app chat",
      navBrowse: "Browse",
      navHow: "How it works",
      navApp: "Open app",
      navPrivacy: "Privacy",
      navTerms: "Terms",
      navHome: "Home",
      honesty: "Soft launch — shared board may be empty · SAMPLE is fake demo · chat happens off-app (not a live city marketplace).",
      heroKicker: "Phnom Penh · soft launch",
      heroTitle: "Phnom Penh short gigs",
      heroLede: "Browse local needs and offers. Confirm once, then chat on Telegram or WhatsApp.",
      heroOne: "Soft launch: shared board may be empty. SAMPLE cards are fake. Not a live moderated marketplace.",
      ctaBrowse: "Browse gigs",
      ctaHow: "How it works",
      howTitle: "How it works",
      how1t: "Browse",
      how1: "Need or Offer. Filter by khan and category. Tap a card.",
      how2t: "Confirm",
      how2: "Contact leaves this site — confirm once, then Telegram / WhatsApp / Call.",
      how3t: "Chat off-app",
      how3: "No in-app chat, escrow, or wallets. Meet in public first.",
      how4t: "Soft launch",
      how4: "Shared board may be empty. SAMPLE is demo. Posts on your phone stay on your phone until board submit is on.",
      browseTitle: "Gigs",
      tabNeed: "Gigs needed",
      tabOffer: "People offering",
      filterCat: "Category",
      filterKhan: "Khan / area",
      filterAll: "All",
      showSample: "Show SAMPLE",
      hideSample: "Hide SAMPLE",
      sampleHidden: "SAMPLE demo cards hidden.",
      sampleShown: "SAMPLE demo on — fake handles, not real people.",
      loading: "Loading shared board…",
      feedEmptyLine: "Shared board · no published posts yet (soft launch — not live city-wide)",
      feedLine: "Shared board · updated {when}",
      offline: "You’re offline — showing cached SAMPLE if enabled. Reconnect to refresh the board.",
      feedError: "Couldn’t load the shared board. Retry when you’re online.",
      retry: "Retry",
      emptyTitle: "Shared board is empty",
      emptyBody: "Soft launch — not a live city-wide board. Show SAMPLE for demo cards, or open the phone app to post on this device.",
      emptyFilterTitle: "No gigs match",
      emptyFilterBody: "Clear category or khan, or Show SAMPLE.",
      clearFilters: "Clear filters",
      openApp: "Open phone app",
      backBrowse: "All gigs",
      sampleWarn: "⚠ SAMPLE — fake demo listing. Do not message this handle expecting a real person.",
      contactConfirmTitle: "Leave Local Gigs PP?",
      contactConfirmBody: "You’ll open chat outside this site. Continue?",
      continue: "Continue",
      cancel: "Cancel",
      slotLabel: "Sponsored · reserved space",
      slotBody: "No ads in this build. Held for a future local sponsor — always labeled, never covers listings.",
      footPub: "Publisher: .//Talentless/x/Hack",
      footNote: "Website spike · same feed as the app · board submit OFF · Play parked",
      i18nStubNote: "ZH / RU / JA / KO chrome falls back to English until a native pass (no machine-fill).",
      notFound: "Gig not found",
      notFoundBody: "This listing isn’t in the shared board or SAMPLE seed. It may have been removed, or the link is wrong.",
      whenUnknown: "—",
      typeNeed: "Need",
      typeOffer: "Offer",
    },
    km: {
      brandSub: "ភ្នំពេញ · ការងារខ្លី · ជជែកក្រៅកម្មវិធី",
      navBrowse: "រកមើល",
      navHow: "របៀបប្រើ",
      navApp: "បើកកម្មវិធី",
      navPrivacy: "ឯកជនភាព",
      navTerms: "លក្ខខណ្ឌ",
      navHome: "ទំព័រដើម",
      honesty: "ដំណាក់កាលសាក — ក្តាររួមអាចទទេ · SAMPLE ក្លែងក្លាយ · ជជែកនៅក្រៅគេហទំព័រ (មិនមែនទីផ្សារផ្ទាល់ទេ)។",
      heroKicker: "ភ្នំពេញ · ដំណាក់កាលសាក",
      heroTitle: "ការងារខ្លីនៅភ្នំពេញ",
      heroLede: "រកមើលតម្រូវការ និងការផ្តល់ជូន។ បញ្ជាក់ម្តង រួចជជែកតាម Telegram ឬ WhatsApp។",
      heroOne: "ដំណាក់កាលសាក៖ ក្តាររួមអាចទទេ។ SAMPLE ក្លែងក្លាយ។ មិនមែនទីផ្សារដែលត្រួតពិនិត្យផ្ទាល់ទេ។",
      ctaBrowse: "រកមើលការងារ",
      ctaHow: "របៀបប្រើ",
      howTitle: "របៀបប្រើ",
      how1t: "រកមើល",
      how1: "ត្រូវការ ឬ ផ្តល់ជូន។ ច្រោះតាមខណ្ឌ និងប្រភេទ។ ចុចកាត។",
      how2t: "បញ្ជាក់",
      how2: "ទំនាក់ទំនងចេញពីគេហទំព័រ — បញ្ជាក់ម្តង រួច Telegram / WhatsApp / ហៅ។",
      how3t: "ជជែកក្រៅ",
      how3: "គ្មានជជែកក្នុងកម្មវិធី គ្មាន escrow។ ជួបកន្លែងសាធារណៈសិន។",
      how4t: "ដំណាក់កាលសាក",
      how4: "ក្តាររួមអាចទទេ។ SAMPLE សម្រាប់សាក។ ការផ្សាយលើទូរស័ព្ទនៅលើទូរស័ព្ទ។",
      browseTitle: "ការងារ",
      tabNeed: "ត្រូវការជំនួយ",
      tabOffer: "អ្នកផ្តល់ជូន",
      filterCat: "ប្រភេទ",
      filterKhan: "ខណ្ឌ / តំបន់",
      filterAll: "ទាំងអស់",
      showSample: "បង្ហាញ SAMPLE",
      hideSample: "លាក់ SAMPLE",
      sampleHidden: "កាត SAMPLE លាក់។",
      sampleShown: "SAMPLE បើក — ឈ្មោះក្លែងក្លាយ មិនមែនមនុស្សពិត។",
      loading: "កំពុងផ្ទុកក្តាររួម…",
      feedEmptyLine: "ក្តាររួម · មិនទាន់មានការផ្សាយ (ដំណាក់កាលសាក — មិនមែនទូទាំងទីក្រុង)",
      feedLine: "ក្តាររួម · ធ្វើបច្ចុប្បន្នភាព {when}",
      offline: "គ្មានអ៊ីនធឺណិត — បង្ហាញ SAMPLE បើបើក។ ភ្ជាប់ម្តងទៀតដើម្បីផ្ទុកឡើងវិញ។",
      feedError: "មិនអាចផ្ទុកក្តាររួម។ ព្យាយាមម្តងទៀតពេលមានអ៊ីនធឺណិត។",
      retry: "ព្យាយាមម្តងទៀត",
      emptyTitle: "ក្តាររួមទទេ",
      emptyBody: "ដំណាក់កាលសាក — មិនមែនក្តារទូទាំងទីក្រុង។ បង្ហាញ SAMPLE ឬបើកកម្មវិធីលើទូរស័ព្ទដើម្បីផ្សាយ។",
      emptyFilterTitle: "គ្មានការងារត្រូវគ្នា",
      emptyFilterBody: "សម្អាតប្រភេទ ឬខណ្ឌ ឬបង្ហាញ SAMPLE។",
      clearFilters: "សម្អាតតម្រង",
      openApp: "បើកកម្មវិធី",
      backBrowse: "ការងារទាំងអស់",
      sampleWarn: "⚠ SAMPLE — ការផ្សាយសាកល្បងក្លែងក្លាយ។ កុំទាក់ទងដោយរំពឹងមនុស្សពិត។",
      contactConfirmTitle: "ចាកចេញពី Local Gigs PP?",
      contactConfirmBody: "អ្នកនឹងបើកការជជែកក្រៅគេហទំព័រ។ បន្តទេ?",
      continue: "បន្ត",
      cancel: "បោះបង់",
      slotLabel: "Sponsored · កន្លែងរក្សា",
      slotBody: "គ្មានពាណិជ្ជកម្មក្នុងកំណែនេះ។ សម្រាប់អ្នកឧបត្ថម្ភមូលដ្ឋាននាពេលអនាគត។",
      footPub: "អ្នកបោះពុម្ព: .//Talentless/x/Hack",
      footNote: "គេហទំព័រ spike · feed ដូចកម្មវិធី · board submit OFF · Play parked",
      i18nStubNote: "ZH / RU / JA / KO ត្រឡប់ទៅអង់គ្លេស រហូតមាន native pass (គ្មាន machine-fill)។",
      notFound: "រកមិនឃើញការងារ",
      notFoundBody: "ការផ្សាយនេះមិនមាននៅក្តាររួម ឬ SAMPLE។ ប្រហែលត្រូវបានលុប ឬតំណភ្ជាប់ខុស។",
      whenUnknown: "—",
      typeNeed: "ត្រូវការ",
      typeOffer: "ផ្តល់ជូន",
    },
  };

  let lang = "en";
  let showSample = false;
  let feedPosts = [];
  let sampleGigs = [];
  let feedUpdatedAt = null;
  let feedStatus = "idle"; // idle | loading | ok | empty | offline | error
  let feedType = "need";
  let filterCat = "";
  let filterKhan = "";
  let pendingContactUrl = "";

  function t(key) {
    const pack = I18N[lang] || I18N.en;
    return pack[key] || I18N.en[key] || key;
  }
  function tf(key, vars) {
    let s = t(key);
    Object.keys(vars || {}).forEach((k) => {
      s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
    });
    return s;
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function catLabel(id) {
    const c = CATEGORIES.find((x) => x.id === id);
    if (!c) return id;
    return lang === "km" ? c.km : c.en;
  }
  function titleOf(g) {
    if (lang === "km" && g.title_km) return g.title_km;
    return g.title_en || g.title_km || g.title || "";
  }
  function relativeWhen(iso) {
    if (!iso) return t("whenUnknown");
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return t("whenUnknown");
    try {
      return new Date(ms).toLocaleString(lang === "km" ? "km-KH" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (_) {
      return iso.slice(0, 16);
    }
  }

  /** Shared-board row → site gig shape (same fields the app normalizes). */
  function fromFeedRow(raw) {
    if (!raw || typeof raw !== "object") return null;
    const kind = String(raw.kind || raw.type || "").toLowerCase();
    if (kind !== "need" && kind !== "offer") return null;
    const title = String(raw.title || "").trim().slice(0, 120);
    if (!title) return null;
    const id = String(raw.post_id || raw.id || "").replace(/[^A-Za-z0-9_-]/g, "");
    if (!id) return null;
    const status = String(raw.status || "").toLowerCase();
    if (status === "hidden" || status === "removed" || status === "blocked") return null;
    const category = String(raw.category || "").toLowerCase();
    const langRaw = String(raw.lang || "en").toLowerCase();
    const postLang = /^(en|km|zh|ru|ja|ko)$/.test(langRaw) ? langRaw : "en";
    return {
      id,
      type: kind,
      category,
      title_en: title,
      title_km: title,
      description: String(raw.details || "").slice(0, 1200),
      khan: String(raw.khan || "Other").slice(0, 40),
      rate_text: String(raw.pay || "").slice(0, 40),
      contact_url: String(raw.contact || "").trim(),
      telegram: "",
      whatsapp: "",
      phone: "",
      language: postLang === "km" ? "km" : "en",
      lang: postLang,
      sample: false,
      created_at: raw.received_at || raw.created_at || null,
      source: "feed",
    };
  }

  function fromSampleRow(raw) {
    if (!raw || typeof raw !== "object") return null;
    const id = String(raw.id || "").replace(/[^A-Za-z0-9_-]/g, "");
    if (!id) return null;
    let contact = String(raw.contact_url || "").trim();
    if (!contact && raw.telegram) contact = "https://t.me/" + String(raw.telegram).replace(/^@/, "");
    if (!contact && raw.whatsapp) {
      const d = String(raw.whatsapp).replace(/\D/g, "");
      if (d) contact = "https://wa.me/" + d;
    }
    if (!contact && raw.phone) {
      const d = String(raw.phone).replace(/\D/g, "");
      if (d) contact = "tel:+" + d;
    }
    return {
      id,
      type: raw.type === "offer" ? "offer" : "need",
      category: String(raw.category || ""),
      title_en: String(raw.title_en || ""),
      title_km: String(raw.title_km || ""),
      description: String(raw.description || ""),
      khan: String(raw.khan || "Other"),
      rate_text: String(raw.rate_text || ""),
      when_text: String(raw.when_text || ""),
      contact_url: contact,
      telegram: String(raw.telegram || ""),
      language: raw.language || "en",
      lang: raw.lang || (raw.language === "km" ? "km" : "en"),
      sample: true,
      created_at: raw.created_at || null,
      source: "sample",
    };
  }

  function allGigs() {
    const map = new Map();
    feedPosts.forEach((g) => map.set(g.id, g));
    if (showSample) {
      sampleGigs.forEach((g) => {
        if (!map.has(g.id)) map.set(g.id, g);
      });
    }
    return Array.from(map.values());
  }

  function filteredGigs() {
    return allGigs().filter((g) => {
      if (g.type !== feedType) return false;
      if (filterCat && g.category !== filterCat) return false;
      if (filterKhan && g.khan !== filterKhan) return false;
      return true;
    });
  }

  function detailHref(id) {
    // Shareable path shape: /site/gigs/{id}.html (Pages-static)
    if (DEPTH === 2) return "./" + encodeURIComponent(id) + ".html";
    return "./gigs/" + encodeURIComponent(id) + ".html";
  }
  function browseHref() {
    return DEPTH === 2 ? "./" : "./gigs/";
  }
  function homeHref() {
    return DEPTH === 2 ? "../" : "./";
  }
  function appHref() {
    return DEPTH === 2 ? "../../" : "../";
  }

  function applyChrome() {
    document.documentElement.lang = lang === "km" ? "km" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (k) el.textContent = t(k);
    });
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      const L = btn.getAttribute("data-lang");
      const on = L === lang;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    const stub = document.getElementById("lang-stub-note");
    if (stub) {
      const isStub = ["zh", "ru", "ja", "ko"].includes(lang);
      stub.classList.toggle("hidden", !isStub);
      stub.textContent = t("i18nStubNote");
    }
    const honesty = document.getElementById("honesty-strip");
    if (honesty) honesty.innerHTML = "<strong>Local Gigs PP</strong> — " + escapeHtml(t("honesty"));
  }

  function setStatus(kind, msg, withRetry) {
    const el = document.getElementById("status-banner");
    if (!el) return;
    if (!kind || kind === "ok" || kind === "idle") {
      el.className = "status-banner hidden";
      el.innerHTML = "";
      return;
    }
    el.className = "status-banner is-" + kind;
    let html = "<span>" + escapeHtml(msg) + "</span>";
    if (withRetry) {
      html += '<button type="button" class="link-btn" id="btn-retry">' + escapeHtml(t("retry")) + "</button>";
    }
    el.innerHTML = html;
    const r = document.getElementById("btn-retry");
    if (r) r.addEventListener("click", () => loadFeed({ quiet: false }));
  }

  function cardHtml(g) {
    const typeChip = g.type === "offer"
      ? '<span class="chip chip-offer">' + escapeHtml(t("typeOffer")) + "</span>"
      : '<span class="chip chip-need">' + escapeHtml(t("typeNeed")) + "</span>";
    const sample = g.sample
      ? '<span class="chip chip-sample">SAMPLE</span>'
      : "";
    const pay = g.rate_text || "—";
    const typeClass = g.type === "offer" ? "is-offer" : "is-need";
    return (
      '<a class="gig-card ' + typeClass + '" href="' + detailHref(g.id) + '">' +
        '<div class="pay">' + escapeHtml(pay) + "</div>" +
        '<div class="khan">' + escapeHtml(g.khan) + "</div>" +
        '<div class="title">' + escapeHtml(titleOf(g)) + "</div>" +
        '<div class="meta">' + typeChip +
          '<span class="chip">' + escapeHtml(catLabel(g.category)) + "</span>" +
          '<span class="chip">' + escapeHtml((g.lang || "en").toUpperCase()) + "</span>" +
          sample +
        "</div>" +
      "</a>"
    );
  }

  function renderBrowse() {
    const grid = document.getElementById("gig-grid");
    const empty = document.getElementById("empty-page");
    const filters = document.getElementById("filters");
    const meta = document.getElementById("feed-meta");
    if (!grid) return;

    const list = filteredGigs();
    const hasAnySource = feedPosts.length > 0 || (showSample && sampleGigs.length > 0);
    const softEmpty = feedPosts.length === 0 && !showSample;

    if (filters) filters.classList.toggle("is-collapsed", softEmpty);

    if (meta) {
      const demoBtn = showSample ? t("hideSample") : t("showSample");
      const demoCopy = showSample ? t("sampleShown") : t("sampleHidden");
      let line = softEmpty ? t("feedEmptyLine") : tf("feedLine", { when: relativeWhen(feedUpdatedAt) });
      if (feedStatus === "loading") line = t("loading");
      meta.innerHTML =
        "<span>" + escapeHtml(line) + "</span>" +
        '<span class="demo-row"><span>' + escapeHtml(demoCopy) + '</span> ' +
        '<button type="button" class="link-btn" id="btn-toggle-sample">' + escapeHtml(demoBtn) + "</button></span>";
      const tb = document.getElementById("btn-toggle-sample");
      if (tb) {
        tb.addEventListener("click", () => {
          showSample = !showSample;
          try { localStorage.setItem(LS_SAMPLE, showSample ? "1" : "0"); } catch (_) {}
          renderBrowse();
        });
      }
    }

    if (softEmpty && feedStatus !== "loading") {
      grid.innerHTML = "";
      if (empty) {
        empty.classList.remove("hidden");
        empty.innerHTML =
          '<div class="empty-art" aria-hidden="true">' +
            '<svg viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<rect x="8" y="18" width="72" height="52" rx="8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.55"/>' +
              '<rect x="28" y="10" width="72" height="52" rx="8" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>' +
              '<rect x="40" y="28" width="36" height="6" rx="2" fill="currentColor" opacity="0.35"/>' +
              '<rect x="40" y="40" width="48" height="4" rx="2" fill="currentColor" opacity="0.22"/>' +
              '<rect x="40" y="50" width="28" height="4" rx="2" fill="currentColor" opacity="0.18"/>' +
              '<circle cx="98" cy="70" r="14" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>' +
              '<path d="M98 64v8M94 70h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>' +
            '</svg></div>' +
          "<h2>" + escapeHtml(t("emptyTitle")) + "</h2>" +
          "<p>" + escapeHtml(t("emptyBody")) + "</p>" +
          '<div class="actions">' +
            '<button type="button" class="btn btn-primary" id="btn-empty-sample">' + escapeHtml(t("showSample")) + "</button>" +
            '<a class="btn btn-ghost" href="' + appHref() + '">' + escapeHtml(t("openApp")) + "</a>" +
          "</div>";
        const b = document.getElementById("btn-empty-sample");
        if (b) {
          b.addEventListener("click", () => {
            showSample = true;
            try { localStorage.setItem(LS_SAMPLE, "1"); } catch (_) {}
            renderBrowse();
          });
        }
      }
      return;
    }

    if (empty) empty.classList.add("hidden");

    if (!list.length && hasAnySource) {
      grid.innerHTML = "";
      if (empty) {
        empty.classList.remove("hidden");
        empty.innerHTML =
          "<h2>" + escapeHtml(t("emptyFilterTitle")) + "</h2>" +
          "<p>" + escapeHtml(t("emptyFilterBody")) + "</p>" +
          '<div class="actions">' +
            '<button type="button" class="btn btn-primary" id="btn-clear-filters">' + escapeHtml(t("clearFilters")) + "</button>" +
          "</div>";
        const c = document.getElementById("btn-clear-filters");
        if (c) {
          c.addEventListener("click", () => {
            filterCat = "";
            filterKhan = "";
            const selC = document.getElementById("filter-cat");
            const selK = document.getElementById("filter-khan");
            if (selC) selC.value = "";
            if (selK) selK.value = "";
            renderBrowse();
          });
        }
      }
      return;
    }

    grid.innerHTML = list.map(cardHtml).join("");
  }

  function fillFilters() {
    const selC = document.getElementById("filter-cat");
    const selK = document.getElementById("filter-khan");
    if (selC && !selC.options.length) {
      selC.innerHTML = '<option value="">' + escapeHtml(t("filterAll")) + "</option>" +
        CATEGORIES.map((c) => '<option value="' + c.id + '">' + escapeHtml(lang === "km" ? c.km : c.en) + "</option>").join("");
    } else if (selC) {
      const v = selC.value;
      selC.innerHTML = '<option value="">' + escapeHtml(t("filterAll")) + "</option>" +
        CATEGORIES.map((c) => '<option value="' + c.id + '">' + escapeHtml(lang === "km" ? c.km : c.en) + "</option>").join("");
      selC.value = v;
    }
    if (selK && !selK.options.length) {
      selK.innerHTML = '<option value="">' + escapeHtml(t("filterAll")) + "</option>" +
        KHANS.map((k) => '<option value="' + k + '">' + escapeHtml(k) + "</option>").join("");
    }
  }

  function resolveDetailId() {
    if (window.__GIG_ID__) return String(window.__GIG_ID__);
    const q = new URLSearchParams(location.search).get("id");
    if (q) return q;
    const m = location.pathname.match(/\/gigs\/([^/]+?)(?:\.html)?\/?$/);
    if (m && m[1] && m[1] !== "index" && m[1] !== "detail") return decodeURIComponent(m[1]);
    return "";
  }

  function findGig(id) {
    return allGigs().find((g) => g.id === id) ||
      sampleGigs.find((g) => g.id === id) ||
      feedPosts.find((g) => g.id === id) ||
      null;
  }

  function openContactConfirm(url) {
    pendingContactUrl = url;
    const modal = document.getElementById("contact-modal");
    if (!modal) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    modal.classList.remove("hidden");
    const title = modal.querySelector("[data-i18n='contactConfirmTitle']");
    const body = modal.querySelector("[data-i18n='contactConfirmBody']");
    if (title) title.textContent = t("contactConfirmTitle");
    if (body) body.textContent = t("contactConfirmBody");
  }


  function setMeta(property, content, isName) {
    if (!content) return;
    const attr = isName ? "name" : "property";
    let el = document.head.querySelector("meta[" + attr + '="' + property + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function applyDetailShareMeta(g) {
    const title = titleOf(g) + " · Local Gigs PP";
    const desc = (g.sample ? "SAMPLE demo · " : "") +
      (g.rate_text || "—") + " · " + (g.khan || "") +
      " · Soft launch, not a live marketplace.";
    document.title = title;
    setMeta("description", desc, true);
    setMeta("og:title", title, false);
    setMeta("og:description", desc, false);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", desc, true);
  }

  function renderDetail() {
    const root = document.getElementById("detail-root");
    if (!root) return;
    const id = resolveDetailId();
    // Prefer sample lookup even if SAMPLE toggle is off (direct shareable URL)
    let g = feedPosts.find((x) => x.id === id) || sampleGigs.find((x) => x.id === id);
    if (!g) {
      root.innerHTML =
        '<a class="detail-back" href="' + browseHref() + '">← ' + escapeHtml(t("backBrowse")) + "</a>" +
        "<h1>" + escapeHtml(t("notFound")) + "</h1>" +
        "<p class=\"detail-body\">" + escapeHtml(t("notFoundBody")) + "</p>";
      return;
    }
    const sampleBlock = g.sample
      ? '<div class="sample-warn" role="status">' + escapeHtml(t("sampleWarn")) + "</div>"
      : "";
    const typeChip = g.type === "offer"
      ? '<span class="chip chip-offer">' + escapeHtml(t("typeOffer")) + "</span>"
      : '<span class="chip chip-need">' + escapeHtml(t("typeNeed")) + "</span>";
    const contact = g.contact_url
      ? '<div class="contact-bar"><button type="button" class="btn btn-primary" id="btn-contact">' +
          escapeHtml(g.sample ? "SAMPLE contact" : "Contact") +
        "</button></div>"
      : "";
    root.innerHTML =
      '<a class="detail-back" href="' + browseHref() + '">← ' + escapeHtml(t("backBrowse")) + "</a>" +
      sampleBlock +
      '<div class="detail-pay">' + escapeHtml(g.rate_text || "—") + "</div>" +
      '<div class="detail-khan">' + escapeHtml(g.khan) + "</div>" +
      '<h1 class="detail-title">' + escapeHtml(titleOf(g)) + "</h1>" +
      '<div class="detail-meta">' + typeChip +
        '<span class="chip">' + escapeHtml(catLabel(g.category)) + "</span>" +
        '<span class="chip">' + escapeHtml((g.lang || "en").toUpperCase()) + "</span>" +
        (g.sample ? '<span class="chip chip-sample">SAMPLE</span>' : "") +
      "</div>" +
      (g.when_text ? '<p class="detail-body">' + escapeHtml(g.when_text) + "</p>" : "") +
      '<div class="detail-body">' + escapeHtml(g.description || "") + "</div>" +
      contact +
      '<div class="reserved-slot" role="note" aria-label="' + escapeHtml(t("slotLabel")) + '">' +
        '<span class="reserved-slot-label">' + escapeHtml(t("slotLabel")) + "</span>" +
        '<span class="reserved-slot-body">' + escapeHtml(t("slotBody")) + "</span>" +
      "</div>";

    const btn = document.getElementById("btn-contact");
    if (btn && g.contact_url) {
      btn.addEventListener("click", () => openContactConfirm(g.contact_url));
    }
    applyDetailShareMeta(g);
  }

  async function loadSample() {
    try {
      const res = await fetch(SAMPLE_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("sample " + res.status);
      const doc = await res.json();
      sampleGigs = (doc.gigs || []).map(fromSampleRow).filter(Boolean);
    } catch (_) {
      sampleGigs = [];
    }
  }

  async function loadFeed(opts) {
    const quiet = !!(opts && opts.quiet);
    if (!quiet) {
      feedStatus = "loading";
      setStatus("loading", t("loading"), false);
    }
    try {
      const res = await fetch(FEED_URL + (FEED_URL.includes("?") ? "&" : "?") + "_ts=" + Date.now(), {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("feed " + res.status);
      const doc = await res.json();
      feedUpdatedAt = doc.updated_at || null;
      feedPosts = (Array.isArray(doc.posts) ? doc.posts : []).map(fromFeedRow).filter(Boolean);
      feedStatus = feedPosts.length ? "ok" : "empty";
      setStatus(null);
      if (!navigator.onLine) {
        feedStatus = "offline";
        setStatus("offline", t("offline"), true);
      }
    } catch (_) {
      feedStatus = navigator.onLine ? "error" : "offline";
      setStatus(feedStatus, feedStatus === "offline" ? t("offline") : t("feedError"), true);
    }
    const page = document.body.getAttribute("data-page");
    if (page === "browse") renderBrowse();
    if (page === "detail") renderDetail();
  }

  function bindBrowseChrome() {
    document.querySelectorAll(".type-tabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        feedType = btn.getAttribute("data-feed") || "need";
        document.querySelectorAll(".type-tabs button").forEach((b) => {
          b.classList.remove("active-need", "active-offer");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add(feedType === "offer" ? "active-offer" : "active-need");
        btn.setAttribute("aria-pressed", "true");
        renderBrowse();
      });
    });
    const selC = document.getElementById("filter-cat");
    const selK = document.getElementById("filter-khan");
    if (selC) selC.addEventListener("change", () => { filterCat = selC.value; renderBrowse(); });
    if (selK) selK.addEventListener("change", () => { filterKhan = selK.value; renderBrowse(); });
  }

  function bindLang() {
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const L = btn.getAttribute("data-lang");
        if (!LOCALES.includes(L)) return;
        lang = L;
        try { localStorage.setItem(LS_LANG, lang); } catch (_) {}
        applyChrome();
        fillFilters();
        const page = document.body.getAttribute("data-page");
        if (page === "browse") renderBrowse();
        if (page === "detail") renderDetail();
        if (feedStatus === "offline") setStatus("offline", t("offline"), true);
        if (feedStatus === "error") setStatus("error", t("feedError"), true);
        if (feedStatus === "loading") setStatus("loading", t("loading"), false);
      });
    });
  }

  function bindModal() {
    const modal = document.getElementById("contact-modal");
    if (!modal) return;
    const cancel = document.getElementById("modal-cancel");
    const ok = document.getElementById("modal-continue");
    if (cancel) cancel.addEventListener("click", () => { modal.classList.add("hidden"); pendingContactUrl = ""; });
    if (ok) {
      ok.addEventListener("click", () => {
        const u = pendingContactUrl;
        modal.classList.add("hidden");
        pendingContactUrl = "";
        if (u) window.open(u, "_blank", "noopener,noreferrer");
      });
    }
  }

  function initLang() {
    try {
      const saved = localStorage.getItem(LS_LANG);
      if (saved && LOCALES.includes(saved)) lang = saved;
    } catch (_) {}
    try {
      showSample = localStorage.getItem(LS_SAMPLE) === "1";
    } catch (_) {}
  }

  async function boot() {
    initLang();
    applyChrome();
    fillFilters();
    bindLang();
    bindModal();
    const page = document.body.getAttribute("data-page");
    if (page === "browse") bindBrowseChrome();
    await loadSample();
    await loadFeed({ quiet: false });
    window.addEventListener("online", () => loadFeed({ quiet: true }));
    window.addEventListener("offline", () => {
      feedStatus = "offline";
      setStatus("offline", t("offline"), true);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
