/* Local Gig Aggregator v0.14 — Phase B: shared feed.json + optional mailto/Telegram submit + Pages host.
   Phase A: clearer cards, 4-step post wizard, safe contact links.
   Pack 14: path reliability (post/browse/contact).
   Pack 13: modal fix, safe storage, reserved slots, content guard, terms gate.
   Seeded JSON + localStorage + optional shared Sheet. No escrow / dispatch / wallets. No ad / billing SDKs.
*/
const APP_VERSION = "v0.14";
/** Bump when terms.html changes materially — users re-accept on next open. */
const TERMS_VERSION = "2026-10-05";

/** Safe localStorage — some WebViews / private modes throw on access or when quota is full. */
class SafeStorage {
  static get(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }
  static set(key, val) {
    try { window.localStorage.setItem(key, val); return true; } catch (_) { return false; }
  }
  static getJSON(key, fallback) {
    try {
      const raw = SafeStorage.get(key);
      if (raw == null || raw === "") return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }
  static setJSON(key, val) {
    try { return SafeStorage.set(key, JSON.stringify(val)); } catch (_) { return false; }
  }
}
function lsGet(key) { return SafeStorage.get(key); }
function lsSet(key, val) { return SafeStorage.set(key, val); }


const CATEGORIES = [
  { id: "tutoring", en: "Tutoring", km: "បង្រៀន", icon: "📚" },
  { id: "cleaning", en: "Cleaning", km: "សម្អាត", icon: "🧹" },
  { id: "moto_help", en: "Moto help", km: "ជួយម៉ូតូ", icon: "🛵" },
  { id: "day_labor", en: "Day labor", km: "ការងារថ្ងៃ", icon: "📦" },
  { id: "errands", en: "Errands", km: "រត់ការងារ", icon: "🏃" },
  { id: "events", en: "Events / F&B", km: "ព្រឹត្តិការណ៍", icon: "🎉" },
];

const KHANS = [
  "BKK1", "Toul Tom Poung", "Tuol Kork", "Mean Chey",
  "Chamkar Mon", "Chroy Changvar", "Other",
];

const I18N = {
  en: {
    appTitle: "Local Gigs PP",
    appSub: "Phnom Penh short gigs · off-app chat",
    tabBrowse: "Browse",
    tabPost: "Post",
    tabMine: "My posts",
    tabSafety: "Safety",
    tabNeed: "Gigs needed",
    tabOfferFeed: "People offering",
    filterCat: "Category",
    filterKhan: "Khan / area",
    filterLang: "Language",
    all: "All",
    langBoth: "Both KH+EN",
    langEn: "English",
    langKm: "Khmer",
    back: "← Back",
    rate: "Rate",
    when: "When",
    area: "Area",
    category: "Category",
    contact: "Contact off-app",
    openTg: "Open Telegram",
    openWa: "WhatsApp",
    call: "Call",
    showKhqr: "KHQR / pay note",
    safetyBlurb: "Meet in a public place first. No deposits through this app. We never hold money or run escrow. Pay after work via cash or KHQR outside the app.",
    safetyAge: "18+ only. Do not post or accept gigs involving minors. This is an adult short-gig board.",
    safetyTip1: "Share exact address only after you trust the chat.",
    safetyTip2: "Never send holding fees or “key money” to strangers.",
    safetyTip3: "If a SAMPLE chip is showing, do not message that handle expecting a real person.",
    fieldKhan: "Khan / area",
    submitPost: "Post it",
    mineTitle: "My posts",
    mineHint: "Owned by a device id saved in this browser. Clearing site data removes them.",
    mineEmpty: "No posts from this device yet. Post a gig or offer skills first.",
    markFilled: "Mark filled",
    delete: "Delete",
    restore: "Restore live",
    filled: "Filled",
    confirmDelete: "Delete this post permanently from this phone?",
    safetyTitle: "Safety & how it works",
    emptyFeed: "No listings in this feed right now.",
    emptyFeedHint: "Try the other tab, post a gig, or Show SAMPLE for demo data.",
    clearFilters: "Clear filters",
    requiredTitle: "Title is required",
    requiredCat: "Pick at least one category",
    postedOk: "Published on this phone — find it under Browse. Not sent to a server.",
    postedOkShared: "Saved on this phone. Open your mail or Telegram to finish sending to the shared board.",
    sendToSharedBoard: "Send to the shared board",
    sendToSharedBoardSkip: "Keep on this phone only",
    sendToSharedBoardHint: "A moderator checks it first. It usually appears within ~15 minutes.",
    sendToSharedBoardEmail: "Send by email",
    sendToSharedBoardTelegram: "Send via Telegram",
    copyLgppBody: "Copy post text",
    copyLgppBodyOk: "Post text copied — paste into the email or Telegram chat.",
    copyLgppBodyFail: "Couldn’t copy. Long-press to select the text.",
    sharedBoardMailApp: "your email app",
    sharedBoardTelegramApp: "Telegram",
    sharedFeedLine: "Shared board · updated {when}",
    sharedFeedOffline: "Offline — showing last shared board from {when}",
    sharedFeedLoading: "Loading shared board…",
    sharedFeedEmpty: "No shared gigs yet. Be the first to post.",
    sharedFeedEmptyAction: "Post the first gig",
    sharedFeedError: "Couldn’t load the shared board. Showing local + SAMPLE if available.",
    sharedFeedRetry: "Retry",
    sharedChip: "Shared",
    reportPost: "Report",
    reportCopied: "Post id copied. Opening report link…",
    reportConfirmTitle: "Leave to report this post?",
    reportConfirmBody: "You’ll open the report page outside Local Gigs PP. Post id is on your clipboard. Continue?",
    sampleChip: "SAMPLE",
    needChip: "NEED",
    offerChip: "OFFER",
    tgBadge: "Telegram",
    howTitle1: "How it works",
    how1: "Browse gigs needed or people offering. Filter by category, khan, language. Tap a card → confirm → contact on Telegram/WhatsApp/Call. Chat and pay outside the app.",
    howTitle2: "Payments",
    how2: "No wallet here. Agree a rate, then settle with cash or KHQR after the work. Optional KHQR link is just a display URL.",
    howTitle3: "Safety",
    how3: "18+ only — no gigs involving minors. Public meet first. Don’t send deposits to strangers. Exact address only after you trust the chat. Remove your own posts in My Posts.",
    howTitle4: "Moderation",
    how4: "SAMPLE seed is demo-only. Your posts save on this phone. Shared listings (when any) come from the public board file. Off-app chats are outside our control.",
    privacyLink: "Privacy policy",
    loading: "Loading gigs…",
    loadError: "Couldn’t refresh seed data. Showing cache / local posts if available.",
    offlineBanner: "Offline or refresh failed — showing cached seed + your local posts.",
    onlineBanner: "Back online",
    resultsCount: "{n} listings",
    timeJustNow: "just now",
    timeMins: "{n}m ago",
    timeHours: "{n}h ago",
    timeDays: "{n}d ago",
    contactConfirmTitle: "Leave the app to contact?",
    contactConfirmBody: "You’ll open {app} outside Local Gigs PP. Meet in public. Never send deposits through chat. Continue?",
    confirmContinue: "Continue",
    confirmCancel: "Cancel",
    sampleWarn: "⚠ SAMPLE DATA — do not message these handles expecting a real person.",
    noContact: "No contact on this listing.",
    hideDemo: "Hide SAMPLE",
    showDemo: "Show SAMPLE",
    mineEmptyHint: "Your posts stay on this phone.",
    exportPosts: "Export my posts",
    exportOk: "Downloaded your posts (JSON)",
    exportEmpty: "Nothing to export — post a gig first.",
    deleteConfirmTitle: "Delete this post?",
    deleteConfirmBody: "This removes the post from this phone only. It cannot be undone.",
    deleteConfirmAction: "Yes, delete",
    skipToContent: "Skip to content",
    deletedOk: "Post deleted",
    ariaDeletePost: "Delete post",
    ariaMarkFilled: "Mark filled or restore",
    copyDetails: "Copy details",
    copyDetailsOk: "Gig summary copied",
    copyDetailsFail: "Couldn’t copy — select text manually",
    emptyFilter: "No gigs match these filters.",
    emptyFilterHint: "Clear category, khan, or language — or post a gig yourself.",
    safetyTip4: "Suspect a scam? Leave the chat, block the sender, and don’t send money. Report via Telegram/WhatsApp tools — this app has no in-app messaging.",
    safetyUgc: "User posts and SAMPLE seed can appear here. Messaging happens off-app (Telegram / WhatsApp / phone). We don’t moderate live chats.",
    safetyNoEscrow: "No escrow, wallets, deposits, or in-app payments — ever.",
    offlineDismiss: "Dismiss",
    offlineFetchFail: "Couldn’t refresh gigs — showing cache / local posts.",
    offlineRetry: "Retry",
    abuseContact: "Report abuse or policy questions: grangerover@gmail.com",
    ariaCopyDetails: "Copy gig details as text",
    ariaOfflineDismiss: "Dismiss offline banner",
    tabSaved: "Saved",
    starSave: "Save",
    starUnsave: "Saved ★",
    ariaStar: "Save this gig",
    ariaUnstar: "Remove from saved",
    emptySaved: "No saved gigs yet.",
    emptySavedHint: "Tap ★ on a card or detail to keep it on this phone.",
    requiredKhan: "Please pick a khan / area",
    submitting: "Publishing…",
    savedToast: "Saved on this phone",
    unsavedToast: "Removed from saved",
    hideGig: "Not interested · Hide on this device",
    hideGigToast: "Hidden on this device",
    hideGigHint: "Won’t show again on this phone. Distinct from ★ Save. Clear site data to reset.",
    ariaHideGig: "Hide this gig on this device",
    detailNotFound: "Listing not found.",
    hiddenMgmtTitle: "Hidden on this device",
    hiddenMgmtCount: "{n} hidden",
    clearHidden: "Clear hidden",
    clearHiddenToast: "Hidden list cleared",
    clearHiddenNone: "Nothing hidden on this device",
    ariaClearHidden: "Clear all hidden gigs on this device",
    copyMyPost: "Copy my post",
    ariaCopyMyPost: "Copy this post as text",
    versionStamp: "Local Gigs PP {v} · .//Talentless/x/Hack",
    both: "Both",
    saveFailed: "Couldn’t save on this phone (storage full or blocked). Nothing was published.",
    contactUrlBlocked: "That contact link looks unsafe — not opening it.",
    slotLabel: "Sponsored · reserved space",
    slotBody: "No ads in this build. Held for a future local sponsor — always labeled, never covers listings.",
    slotAria: "Reserved sponsor space (empty)",
    guardTitle: "Post blocked",
    guardBody: "This looks like sex work / sexual services, something involving minors, or something illegal. That isn’t allowed here, and nothing was saved. Edit your text and try again.",
    guardNote: "This check runs only on this phone. It can’t see chats, other phones, or posts shared elsewhere.",
    guardEdit: "Edit my post",
    safetyProhibited: "Prohibited: sex work or sexual services, anything involving minors, and illegal goods or services. Posts with these terms are blocked on this phone.",
    termsLink: "Terms & disclaimer",
    termsGateTitle: "Before you use Local Gigs PP",
    termsGatePt1: "This is a listing board only. We are not an employer, agency, or party to any gig.",
    termsGatePt2: "We do not vet, verify, or background-check anyone. SAMPLE listings are fake demo data.",
    termsGatePt3: "Messaging and payment happen off-app (Telegram / WhatsApp / phone) at your own risk.",
    termsGatePt4: "Prohibited: sex work or sexual services, anything involving minors, illegal goods or services.",
    termsGatePt5: "18+ only. Meet in public first. Never send deposits.",
    termsGateNotLegal: "Plain-language summary — not legal advice.",
    termsGateRead: "Read full Terms & Disclaimer",
    termsGateCheck: "I am 18+ and I accept the Terms & Disclaimer",
    termsGateAccept: "Accept & continue",
    // Phase A (v0.13)
    firstOpenBody: "Short gigs near you in Phnom Penh. Tap a card, confirm once, then chat on Telegram.",
    firstOpenInstall: "Tip: add it to your Home Screen.",
    firstOpenDismiss: "Got it",
    ariaFirstOpenDismiss: "Dismiss welcome note",
    demoRowShown: "Showing SAMPLE demo cards — not real people.",
    demoRowHidden: "SAMPLE demo cards are hidden.",
    emptyFirstNeed: "No gigs posted on this phone yet.",
    emptyFirstOffer: "No offers posted on this phone yet.",
    postFirstGig: "Post the first gig",
    postFirstOffer: "Post the first offer",
    progressNone: "None of your posts are on this phone yet.",
    progressOne: "1 of your posts is on this phone.",
    progressMany: "{n} of your posts are on this phone.",
    wizTitle: "Post",
    wizStepOf: "Step {n} of 4",
    wizStep1: "Do you need help, or offer help?",
    wizNeedTitle: "I need help",
    wizNeedSub: "Post a short gig",
    wizOfferTitle: "I offer help",
    wizOfferSub: "Show what you can do",
    wizStep2: "What and where?",
    fieldWhat: "What (one short line)",
    phWhatNeed: "e.g. English tutor Sat morning",
    phWhatOffer: "e.g. Math tutor, evenings",
    fieldPay: "Pay",
    phPay: "$8/session · ៛20,000",
    fieldWhenOpt: "When (optional)",
    phWhenShort: "Sat 9–12 / flexible",
    fieldDetailsOpt: "Details (optional)",
    phDetails: "Public meet first · no minors…",
    pickKhan: "Pick a khan…",
    khanRemembered: "Same khan as your last post.",
    requiredWhat: "Write what you need or offer, in one short line.",
    requiredType: "Pick “I need help” or “I offer help”.",
    wizStep3: "How should people reach you?",
    fieldContact: "Telegram, WhatsApp, or phone",
    fieldContactHint: "Type @name, t.me/name, wa.me/855…, 012 345 678 or +855…",
    contactWillOpen: "Contact button will open: {url}",
    contactRequired: "Add one way for people to reach you.",
    contactInvalid: "That isn’t a Telegram name, WhatsApp link, or phone number we can open safely. Try @name, t.me/name, wa.me/855… or 012 345 678.",
    wizStep4: "Check, then post",
    wizReviewNote: "Saved on this phone only. Your words stay exactly as you typed them — no translation.",
    wizBack: "Back",
    wizNext: "Next",
    justPosted: "Just posted",
    payAsk: "Ask about pay",
    pay: "Pay",
    khan: "Khan",
    contactBar: "Contact (opens outside the app after you confirm)",
    copyHeadNeed: "Short gig in Phnom Penh",
    copyHeadOffer: "Offering help in Phnom Penh",
    copySampleNote: "(SAMPLE demo listing — not a real person)",
    copyFooter: "Seen on Local Gigs PP — open the app to contact.",
    labelSep: ": ",
  },
  km: {
    appTitle: "ការងារខ្លី ភ្នំពេញ",
    appSub: "ការងារខ្លីនៅភ្នំពេញ · ជជែកក្រៅកម្មវិធី",
    tabBrowse: "រកមើល",
    tabPost: "ផ្សាយ",
    tabMine: "របស់ខ្ញុំ",
    tabSafety: "សុវត្ថិភាព",
    tabNeed: "ការងារត្រូវការ",
    tabOfferFeed: "អ្នកផ្តល់ជំនាញ",
    filterCat: "ប្រភេទ",
    filterKhan: "ខណ្ឌ",
    filterLang: "ភាសា",
    all: "ទាំងអស់",
    langBoth: "ខ្មែរ+អង់គ្លេស",
    langEn: "អង់គ្លេស",
    langKm: "ខ្មែរ",
    back: "← ត្រឡប់",
    rate: "ថ្លៃ",
    when: "ពេល",
    area: "តំបន់",
    category: "ប្រភេទ",
    contact: "ទាក់ទងក្រៅកម្មវិធី",
    openTg: "បើក Telegram",
    openWa: "WhatsApp",
    call: "ហៅទូរស័ព្ទ",
    showKhqr: "KHQR / ចំណាំបង់ប្រាក់",
    safetyBlurb: "ជួបកន្លែងសាធារណៈមុន។ កុំដាក់កក់តាមកម្មវិធីនេះ។ យើងមិនរក្សាលុយ/escrow។ បង់បន្ទាប់ពីធ្វើការ ដោយសាច់ប្រាក់ ឬ KHQR។",
    safetyAge: "សម្រាប់អាយុ ១៨ឆ្នាំឡើង។ កុំផ្សាយ/ទទួលការងារដែលពាក់ព័ន្ធកុមារ។",
    safetyTip1: "ផ្តល់អាសយដ្ឋានពិតប្រាកដបន្ទាប់ពីទុកចិត្តការជជែក។",
    safetyTip2: "កុំផ្ញើកក់ ឬថ្លៃរក្សាទុកឱ្យមនុស្សចម្លែក។",
    safetyTip3: "បើឃើញស្លាក SAMPLE កុំទាក់ទង — មិនមែនមនុស្សពិត។",
    fieldKhan: "ខណ្ឌ / តំបន់",
    submitPost: "ផ្សាយឥឡូវ",
    mineTitle: "ការផ្សាយរបស់ខ្ញុំ",
    mineHint: "ភ្ជាប់នឹងលេខសម្គាល់ឧបករណ៍លើកម្មវិធីរុករកនេះ។ បើលុបទិន្នន័យគេហទំព័រ ការផ្សាយនឹងបាត់។",
    mineEmpty: "មិនទាន់មានការផ្សាយពីឧបករណ៍នេះ។ សូមផ្សាយការងារ ឬជំនាញសិន។",
    markFilled: "សម្គាល់ថារួច",
    delete: "លុប",
    restore: "ដាក់ផ្សាយវិញ",
    filled: "រួចហើយ",
    confirmDelete: "លុបការផ្សាយនេះចេញពីទូរស័ព្ទជាអចិន្ត្រៃយ៍?",
    safetyTitle: "សុវត្ថិភាព និងរបៀបប្រើ",
    emptyFeed: "មិនទាន់មានការផ្សាយក្នុង feed នេះ។",
    emptyFeedHint: "សាក tab ផ្សេង ផ្សាយការងារ ឬបង្ហាញ SAMPLE សម្រាប់ទិន្នន័យសាកល្បង។",
    clearFilters: "សម្អាតតម្រង",
    requiredTitle: "សូមបញ្ចូលចំណងជើង",
    requiredCat: "ជ្រើសប្រភេទយ៉ាងហោច១",
    postedOk: "បានផ្សាយលើទូរស័ព្ទនេះ — មើលក្នុងទំព័ររកមើល។ មិនបានផ្ញើទៅម៉ាស៊ីនមេទេ។",
    postedOkShared: "បានរក្សាទុកលើទូរស័ព្ទ។ បើកសំបុត្រ ឬ Telegram ដើម្បីបញ្ចប់ការផ្ញើទៅក្តាររួម។",
    sendToSharedBoard: "ផ្ញើទៅក្តាររួម",
    sendToSharedBoardSkip: "រក្សាទុកលើទូរស័ព្ទតែប៉ុណ្ណោះ",
    sendToSharedBoardHint: "អ្នកសម្របសម្រួលពិនិត្យមុន។ ជាធម្មតាបង្ហាញក្នុង ~១៥នាទី។",
    sendToSharedBoardEmail: "ផ្ញើតាមអ៊ីមែល",
    sendToSharedBoardTelegram: "ផ្ញើតាម Telegram",
    copyLgppBody: "ចម្លងអត្ថបទ",
    copyLgppBodyOk: "បានចម្លង — បិទភ្ជាប់ក្នុងសំបុត្រ ឬ Telegram។",
    copyLgppBodyFail: "មិនអាចចម្លង។ សង្កត់យូរដើម្បីជ្រើសអត្ថបទ។",
    sharedBoardMailApp: "កម្មវិធីអ៊ីមែល",
    sharedBoardTelegramApp: "Telegram",
    sharedFeedLine: "ក្តាររួម · ធ្វើបច្ចុប្បន្នភាព {when}",
    sharedFeedOffline: "គ្មានអ៊ីនធឺណិត — បង្ហាញក្តាររួមចុងក្រោយពី {when}",
    sharedFeedLoading: "កំពុងផ្ទុកក្តាររួម…",
    sharedFeedEmpty: "មិនទាន់មានការងាររួម។ សូមផ្សាយដំបូង។",
    sharedFeedEmptyAction: "ផ្សាយការងារដំបូង",
    sharedFeedError: "មិនអាចផ្ទុកក្តាររួម។ បង្ហាញការផ្សាយលើទូរស័ព្ទ + SAMPLE បើមាន។",
    sharedFeedRetry: "ព្យាយាមម្តងទៀត",
    sharedChip: "រួម",
    reportPost: "រាយការណ៍",
    reportCopied: "បានចម្លងលេខសម្គាល់។ កំពុងបើកតំណរាយការណ៍…",
    reportConfirmTitle: "ចាកចេញដើម្បីរាយការណ៍?",
    reportConfirmBody: "អ្នកនឹងបើកទំព័ររាយការណ៍ក្រៅ Local Gigs PP។ លេខសម្គាល់នៅលើ clipboard។ បន្តទេ?",
    sampleChip: "SAMPLE",
    needChip: "ត្រូវការ",
    offerChip: "ផ្តល់",
    tgBadge: "Telegram",
    howTitle1: "របៀបដំណើរការ",
    how1: "រកមើលការងារត្រូវការ ឬអ្នកផ្តល់ជំនាញ។ ត្រងតាមប្រភេទ ខណ្ឌ និងភាសា។ ចុចកាត → បញ្ជាក់ → ទាក់ទងតាម Telegram/WhatsApp។ ជជែក និងបង់ប្រាក់ក្រៅកម្មវិធី។",
    howTitle2: "ការបង់ប្រាក់",
    how2: "គ្មានកាបូបលុយក្នុងកម្មវិធី។ យល់ព្រមថ្លៃ រួចបង់សាច់ប្រាក់ ឬ KHQR បន្ទាប់ពីធ្វើការ។",
    howTitle3: "សុវត្ថិភាព",
    how3: "១៨ឆ្នាំឡើង — គ្មានការងារពាក់ព័ន្ធកុមារ។ ជួបកន្លែងសាធារណៈមុន។ កុំផ្ញើកក់ឱ្យមនុស្សចម្លែក។ អាសយដ្ឋានពិតប្រាកដបន្ទាប់ពីទុកចិត្ត។",
    howTitle4: "ការត្រួតពិនិត្យ",
    how4: "SAMPLE សម្រាប់សាកល្បង។ ការផ្សាយរក្សាទុកលើទូរស័ព្ទ។ ការផ្សាយរួម (បើមាន) មកពីឯកសារក្តារសាធារណៈ។ ការជជែកក្រៅកម្មវិធីនៅក្រៅការគ្រប់គ្រង។",
    privacyLink: "គោលការណ៍ភាពឯកជន",
    loading: "កំពុងផ្ទុក…",
    loadError: "មិនអាចផ្ទុកទិន្នន័យថ្មី។ បង្ហាញទិន្នន័យរក្សាទុក និងការផ្សាយលើទូរស័ព្ទ។",
    offlineBanner: "គ្មានអ៊ីនធឺណិត ឬផ្ទុកបរាជ័យ — បង្ហាញទិន្នន័យរក្សាទុក និងការផ្សាយលើទូរស័ព្ទ។",
    onlineBanner: "មានអ៊ីនធឺណិតវិញ",
    resultsCount: "មាន {n} ការផ្សាយ",
    timeJustNow: "អម្បាញ់មិញ",
    timeMins: "{n} នាទីមុន",
    timeHours: "{n} ម៉ោងមុន",
    timeDays: "{n} ថ្ងៃមុន",
    contactConfirmTitle: "បើកកម្មវិធីផ្សេងដើម្បីទាក់ទង?",
    contactConfirmBody: "អ្នកនឹងបើក {app} ក្រៅពី Local Gigs PP។ សូមជួបកន្លែងសាធារណៈ។ កុំផ្ញើប្រាក់កក់។ បន្តទេ?",
    confirmContinue: "បន្ត",
    confirmCancel: "បោះបង់",
    sampleWarn: "⚠ SAMPLE — លេខ Telegram នេះមិនមែនមនុស្សពិតទេ។",
    noContact: "គ្មានទំនាក់ទំនងលើការផ្សាយនេះ។",
    hideDemo: "លាក់ SAMPLE",
    showDemo: "បង្ហាញ SAMPLE",
    mineEmptyHint: "ការផ្សាយរបស់អ្នកនៅលើទូរស័ព្ទ។",
    exportPosts: "នាំចេញការផ្សាយរបស់ខ្ញុំ",
    exportOk: "បានទាញយកការផ្សាយ (JSON)",
    exportEmpty: "គ្មានអ្វីនាំចេញ — សូមផ្សាយការងារសិន។",
    deleteConfirmTitle: "លុបការផ្សាយនេះ?",
    deleteConfirmBody: "នឹងលុបចេញពីទូរស័ព្ទនេះតែប៉ុណ្ណោះ។ មិនអាចត្រឡប់វិញបានទេ។",
    deleteConfirmAction: "បាទ/ចាស លុប",
    skipToContent: "រំលងទៅមាតិកា",
    deletedOk: "បានលុបការផ្សាយ",
    ariaDeletePost: "លុបការផ្សាយ",
    ariaMarkFilled: "សម្គាល់រួច ឬដាក់ផ្សាយវិញ",
    copyDetails: "ចម្លងព័ត៌មាន",
    copyDetailsOk: "បានចម្លងសេចក្តីសង្ខេប",
    copyDetailsFail: "មិនអាចចម្លងបាន — សូមជ្រើស និងចម្លងអត្ថបទដោយដៃ",
    emptyFilter: "គ្មានការងារតាមតម្រងនេះ។",
    emptyFilterHint: "សូមសម្អាតតម្រង (ប្រភេទ / ខណ្ឌ / ភាសា) ឬផ្សាយការងារថ្មី។",
    safetyTip4: "សង្ស័យក្លែងបន្លំ? ចាកចេញពីការជជែក ទប់ស្កាត់អ្នកផ្ញើ កុំផ្ញើប្រាក់។ រាយការណ៍តាម Telegram/WhatsApp — កម្មវិធីនេះគ្មានជជែកក្នុងកម្មវិធី។",
    safetyUgc: "ការផ្សាយរបស់អ្នកប្រើ និង SAMPLE អាចបង្ហាញ។ ការជជែកនៅក្រៅកម្មវិធី (Telegram / WhatsApp / ទូរស័ព្ទ)។ យើងមិនត្រួតពិនិត្យការជជែកផ្ទាល់ទេ។",
    safetyNoEscrow: "គ្មាន escrow / កាបូបលុយ / កក់ / បង់ប្រាក់ក្នុងកម្មវិធី — មិនដែលមាន។",
    offlineDismiss: "បិទ",
    offlineFetchFail: "មិនអាចផ្ទុកការងារថ្មី — បង្ហាញ cache / ការផ្សាយលើទូរស័ព្ទ។ តភ្ជាប់អ៊ីនធឺណិតដើម្បីព្យាយាមម្តងទៀត។",
    offlineRetry: "ព្យាយាមម្តងទៀត",
    abuseContact: "រាយការណ៍ការបំពាន ឬសំណួរគោលការណ៍៖ grangerover@gmail.com",
    ariaCopyDetails: "ចម្លងព័ត៌មានការងារជាអត្ថបទ",
    ariaOfflineDismiss: "បិទបដាគ្មានអ៊ីនធឺណិត",
    tabSaved: "បានរក្សាទុក",
    starSave: "រក្សាទុក",
    starUnsave: "បានរក្សាទុក ★",
    ariaStar: "រក្សាទុកការងារនេះ",
    ariaUnstar: "ដកចេញពីបញ្ជីរក្សាទុក",
    emptySaved: "មិនទាន់មានការងាររក្សាទុក។",
    emptySavedHint: "ចុច ★ លើកាត ឬទំព័រលម្អិត ដើម្បីរក្សាទុកលើទូរស័ព្ទនេះ។",
    requiredKhan: "សូមជ្រើសខណ្ឌ / តំបន់",
    submitting: "កំពុងផ្សាយ…",
    savedToast: "បានរក្សាទុកលើទូរស័ព្ទនេះ",
    unsavedToast: "បានដកចេញពីបញ្ជីរក្សាទុក",
    hideGig: "មិនចាប់អារម្មណ៍ · លាក់លើទូរស័ព្ទនេះ",
    hideGigToast: "បានលាក់លើទូរស័ព្ទនេះ",
    hideGigHint: "នឹងមិនបង្ហាញម្តងទៀតលើទូរស័ព្ទនេះ។ ខុសពី ★ រក្សាទុក។ សម្អាតទិន្នន័យគេហទំព័រដើម្បីកំណត់ឡើងវិញ។",
        ariaHideGig: "លាក់ការងារនេះលើទូរស័ព្ទនេះ",
    detailNotFound: "រកមិនឃើញការផ្សាយ។",
    hiddenMgmtTitle: "បានលាក់លើទូរស័ព្ទនេះ",
    hiddenMgmtCount: "បានលាក់ {n}",
    clearHidden: "សម្អាតបញ្ជីលាក់",
    clearHiddenToast: "បានសម្អាតបញ្ជីលាក់",
    clearHiddenNone: "មិនមានអ្វីលាក់លើទូរស័ព្ទនេះ",
    ariaClearHidden: "សម្អាតការងារដែលលាក់ទាំងអស់លើទូរស័ព្ទនេះ",
    copyMyPost: "ចម្លងការផ្សាយរបស់ខ្ញុំ",
    ariaCopyMyPost: "ចម្លងការផ្សាយនេះជាអត្ថបទ",
    versionStamp: "Local Gigs PP {v} · .//Talentless/x/Hack",
    both: "ទាំងពីរ",
    saveFailed: "មិនអាចរក្សាទុកលើទូរស័ព្ទនេះបានទេ (ទំហំពេញ ឬត្រូវបានបិទ)។ គ្មានអ្វីត្រូវបានផ្សាយទេ។",
    contactUrlBlocked: "តំណភ្ជាប់ទំនាក់ទំនងនេះមិនសុវត្ថិភាព — មិនបើកទេ។",
    slotLabel: "ឧបត្ថម្ភ · កន្លែងបម្រុងទុក",
    slotBody: "គ្មានការផ្សាយពាណិជ្ជកម្មក្នុងកំណែនេះទេ។ បម្រុងទុកសម្រាប់អ្នកឧបត្ថម្ភក្នុងស្រុកនាពេលក្រោយ — មានស្លាកជានិច្ច មិនបិទបាំងការផ្សាយការងារ។",
    slotAria: "កន្លែងឧបត្ថម្ភបម្រុងទុក (ទទេ)",
    guardTitle: "ការផ្សាយត្រូវបានបដិសេធ",
    guardBody: "ការផ្សាយនេះហាក់ដូចជាពាក់ព័ន្ធសេវាផ្លូវភេទ កុមារ ឬអ្វីដែលខុសច្បាប់។ មិនអនុញ្ញាតនៅទីនេះទេ ហើយគ្មានអ្វីត្រូវបានរក្សាទុកឡើយ។ សូមកែអត្ថបទ ហើយព្យាយាមម្តងទៀត។",
    guardNote: "ការត្រួតពិនិត្យនេះដំណើរការតែលើទូរស័ព្ទនេះប៉ុណ្ណោះ។ វាមិនអាចមើលការជជែក ទូរស័ព្ទផ្សេង ឬការផ្សាយនៅកន្លែងផ្សេងបានទេ។",
    guardEdit: "កែការផ្សាយរបស់ខ្ញុំ",
    safetyProhibited: "ហាមឃាត់៖ សេវាផ្លូវភេទ អ្វីៗដែលពាក់ព័ន្ធកុមារ និងទំនិញ ឬសេវាខុសច្បាប់។ ការផ្សាយដែលមានពាក្យទាំងនេះត្រូវបានបដិសេធលើទូរស័ព្ទនេះ។",
    termsLink: "លក្ខខណ្ឌ និងការបដិសេធទំនួលខុសត្រូវ",
    termsGateTitle: "មុនពេលប្រើ Local Gigs PP",
    termsGatePt1: "នេះគ្រាន់តែជាក្តារផ្សាយប៉ុណ្ណោះ។ យើងមិនមែនជានិយោជក ភ្នាក់ងារ ឬភាគីនៃការងារណាមួយទេ។",
    termsGatePt2: "យើងមិនពិនិត្យ ផ្ទៀងផ្ទាត់ ឬស៊ើបប្រវត្តិអ្នកណាម្នាក់ទេ។ ការផ្សាយ SAMPLE ជាទិន្នន័យសាកល្បងក្លែងក្លាយ។",
    termsGatePt3: "ការជជែក និងការបង់ប្រាក់កើតឡើងក្រៅកម្មវិធី (Telegram / WhatsApp / ទូរស័ព្ទ) ដោយហានិភ័យផ្ទាល់ខ្លួនរបស់អ្នក។",
    termsGatePt4: "ហាមឃាត់៖ សេវាផ្លូវភេទ អ្វីៗដែលពាក់ព័ន្ធកុមារ ទំនិញ ឬសេវាខុសច្បាប់។",
    termsGatePt5: "សម្រាប់អាយុ ១៨ឆ្នាំឡើង។ ជួបកន្លែងសាធារណៈមុន។ កុំផ្ញើប្រាក់កក់។",
    termsGateNotLegal: "សេចក្តីសង្ខេបភាសាសាមញ្ញ — មិនមែនជាដំបូន្មានផ្លូវច្បាប់ទេ។",
    termsGateRead: "អានលក្ខខណ្ឌ និងការបដិសេធពេញលេញ",
    termsGateCheck: "ខ្ញុំមានអាយុ ១៨ឆ្នាំឡើង ហើយយល់ព្រមតាមលក្ខខណ្ឌ",
    termsGateAccept: "យល់ព្រម និងបន្ត",
    // Phase A (v0.13) — KM strings below need native-speaker review (store/LOCALIZATION_NOTES.md)
    firstOpenBody: "ការងារខ្លីនៅជិតអ្នកក្នុងភ្នំពេញ។ ចុចកាត បញ្ជាក់ម្តង រួចជជែកតាម Telegram។",
    firstOpenInstall: "គន្លឹះ៖ បន្ថែមវាទៅអេក្រង់ដើម។",
    firstOpenDismiss: "យល់ហើយ",
    ariaFirstOpenDismiss: "បិទសារស្វាគមន៍",
    demoRowShown: "កំពុងបង្ហាញកាត SAMPLE សាកល្បង — មិនមែនមនុស្សពិតទេ។",
    demoRowHidden: "កាត SAMPLE សាកល្បងត្រូវបានលាក់។",
    emptyFirstNeed: "មិនទាន់មានការងារផ្សាយលើទូរស័ព្ទនេះទេ។",
    emptyFirstOffer: "មិនទាន់មានការផ្តល់ជំនាញផ្សាយលើទូរស័ព្ទនេះទេ។",
    postFirstGig: "ផ្សាយការងារដំបូង",
    postFirstOffer: "ផ្សាយជំនាញដំបូង",
    progressNone: "មិនទាន់មានការផ្សាយរបស់អ្នកនៅលើទូរស័ព្ទនេះទេ។",
    progressOne: "ការផ្សាយរបស់អ្នក ១ នៅលើទូរស័ព្ទនេះ។",
    progressMany: "ការផ្សាយរបស់អ្នក {n} នៅលើទូរស័ព្ទនេះ។",
    wizTitle: "ផ្សាយ",
    wizStepOf: "ជំហាន {n} នៃ ៤",
    wizStep1: "អ្នកត្រូវការជំនួយ ឬផ្តល់ជំនួយ?",
    wizNeedTitle: "ខ្ញុំត្រូវការជំនួយ",
    wizNeedSub: "ផ្សាយការងារខ្លី",
    wizOfferTitle: "ខ្ញុំផ្តល់ជំនួយ",
    wizOfferSub: "បង្ហាញអ្វីដែលអ្នកអាចធ្វើបាន",
    wizStep2: "អ្វី និងនៅឯណា?",
    fieldWhat: "អ្វី (មួយបន្ទាត់ខ្លី)",
    phWhatNeed: "ឧ. គ្រូអង់គ្លេស ព្រឹកថ្ងៃសៅរ៍",
    phWhatOffer: "ឧ. គ្រូគណិត ពេលល្ងាច",
    fieldPay: "ថ្លៃឈ្នួល",
    phPay: "$8/session · ៛20,000",
    fieldWhenOpt: "ពេលណា (ជម្រើស)",
    phWhenShort: "សៅរ៍ ៩–១២ / បត់បែន",
    fieldDetailsOpt: "ព័ត៌មានលម្អិត (ជម្រើស)",
    phDetails: "ជួបកន្លែងសាធារណៈមុន · គ្មានកុមារ…",
    pickKhan: "ជ្រើសខណ្ឌ…",
    khanRemembered: "ខណ្ឌដូចការផ្សាយមុនរបស់អ្នក។",
    requiredWhat: "សូមសរសេរអ្វីដែលអ្នកត្រូវការ ឬផ្តល់ ជាមួយបន្ទាត់ខ្លី។",
    requiredType: "សូមជ្រើស «ខ្ញុំត្រូវការជំនួយ» ឬ «ខ្ញុំផ្តល់ជំនួយ»។",
    wizStep3: "តើអ្នកដទៃទាក់ទងអ្នកតាមរបៀបណា?",
    fieldContact: "Telegram, WhatsApp ឬលេខទូរស័ព្ទ",
    fieldContactHint: "វាយ @name, t.me/name, wa.me/855…, 012 345 678 ឬ +855…",
    contactWillOpen: "ប៊ូតុងទាក់ទងនឹងបើក៖ {url}",
    contactRequired: "សូមបញ្ចូលវិធីមួយដើម្បីឱ្យគេទាក់ទងអ្នក។",
    contactInvalid: "នេះមិនមែនជាឈ្មោះ Telegram តំណ WhatsApp ឬលេខទូរស័ព្ទដែលយើងអាចបើកដោយសុវត្ថិភាពទេ។ សាក @name, t.me/name, wa.me/855… ឬ 012 345 678។",
    wizStep4: "ពិនិត្យ រួចផ្សាយ",
    wizReviewNote: "រក្សាទុកលើទូរស័ព្ទនេះតែប៉ុណ្ណោះ។ ពាក្យរបស់អ្នកនៅដដែលដូចអ្នកវាយ — គ្មានការបកប្រែទេ។",
    wizBack: "ថយក្រោយ",
    wizNext: "បន្ទាប់",
    justPosted: "ទើបផ្សាយ",
    payAsk: "សួរពីថ្លៃ",
    pay: "ថ្លៃឈ្នួល",
    khan: "ខណ្ឌ",
    contactBar: "ទាក់ទង (បើកក្រៅកម្មវិធី បន្ទាប់ពីអ្នកបញ្ជាក់)",
    copyHeadNeed: "ការងារខ្លីនៅភ្នំពេញ",
    copyHeadOffer: "ផ្តល់ជំនួយនៅភ្នំពេញ",
    copySampleNote: "(ការផ្សាយ SAMPLE សាកល្បង — មិនមែនមនុស្សពិតទេ)",
    copyFooter: "ឃើញនៅ Local Gigs PP — បើកកម្មវិធីដើម្បីទាក់ទង។",
    labelSep: "៖ ",
  },
};

const LS_POSTS = "gigAgg.localPosts";
const LS_DEVICE = "gigAgg.deviceId";
const LS_LANG = "gigAgg.lang";
const LS_HIDE_DEMO = "gigAgg.hideDemo";
const LS_REVIEW_MODE = "gigAgg.reviewMode";
const LS_FIRST_OPEN = "gigAgg.firstOpenDismissed"; // Phase A: one first-open banner (replaces install tip)
const LS_LAST_KHAN = "gigAgg.lastKhan"; // Phase A: wizard remembers last khan
const LS_SAVED = "gigAgg.savedStars";
const LS_HIDDEN = "gigAgg.hiddenGigs";
const LS_TERMS = "gigAgg.termsAccepted";
const LS_SHARED_FEED = "gigAgg.sharedFeedCache";
const LS_FEED_CONFIG = "gigAgg.feedConfigCache";

/* CONTENT_GUARD_START — prohibited-content deny-list (client-side, THIS DEVICE ONLY).
   Honest limit: a local-only PWA cannot moderate off-device (chats, other phones, edited
   localStorage). This blocks obvious terms at post time; it is not moderation.
   Keep this block self-contained: scripts/smoke.mjs evals it in Node for regression tests. */
const ContentGuard = (() => {
  const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;
  const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };
  // EN: regex sources, matched with word boundaries on a normalized copy
  // (lowercase, leet → letters, punctuation → space, "s e x" → "sex").
  const EN = [
    // sex work / sexual services
    "sex ?work(?:er|ers|ing)?", "sex(?:ual)? services?", "paid sex", "sex for (?:money|cash|pay)",
    "sex (?:chat|video|cam|tape)s?", "have sex", "prostitut\\w*", "hookers?", "call ?girls?",
    "escort (?:service|girl|agency|agencies)s?", "incall", "outcall",
    "happy ending", "body ?to ?body", "b2b massage", "nuru",
    "(?:erotic|sensual|sexy|tantric|nude) massages?", "massage with extras?",
    "gfe", "sugar (?:daddy|daddies|baby|babies|mommy)", "taxi ?girls?", "one night stand", "hookups?",
    "nudes?", "naked", "porn\\w*", "only ?fans", "cam ?girls?", "webcam models?",
    "strip ?tease", "strip clubs?", "lap ?dances?", "sexy (?:girl|girls|lady|ladies)",
    // minors / exploitation
    "underage\\w*", "under ?aged? (?:girl|girls|boy|boys|sex)", "virginity", "virgin (?:girl|girls|for sale)",
    "child porn\\w*", "loli(?:con)?", "young (?:girl|girls|boy|boys) (?:for|massage|company)",
    // illegal goods / services
    "meth", "crystal meth", "methamphetamine", "yaba", "cocaine", "heroin", "ketamine",
    "(?:sell|selling|deliver|delivering) drugs", "drug (?:delivery|runner|courier)s?",
    "fake (?:passport|passports|id|ids|visa|visas|documents?)", "money mules?", "scam compound",
    "pig butcher\\w*", "(?:sell|selling|buy|buying) (?:a |my )?kidneys?", "kidney for sale",
    "(?:gun|guns|firearm|firearms) for sale",
  ];
  // KM: substrings, matched after removing all whitespace / zero-width marks
  // (Khmer is written without word spaces; evaders insert spaces or ZWSP).
  // Needs native-speaker review — see store/CONTENT_SAFETY.md.
  const KM = [
    "ពេស្យា",            // prostitute / prostitution
    "រកស៊ីផ្លូវភេទ",       // sex trade
    "សេវាផ្លូវភេទ",        // sexual services
    "លក់ផ្លូវភេទ",         // selling sex
    "លក់ខ្លួន",           // selling oneself
    "រួមភេទ",            // intercourse
    "ស្រីខូច",            // slang: prostitute
    "ស្រីកំដរ",           // companion / escort girl euphemism
    "សិចស៊ី",            // "sexy"
    "រឿងសិច", "វីដេអូសិច", "រូបសិច", // porn
    "រូបអាក្រាត", "អាក្រាតកាយ",    // nude
    "ព្រហ្មចារី", "លក់ក្រមុំ",       // virginity selling
    "លក់គ្រឿងញៀន", "ដឹកគ្រឿងញៀន", "យ៉ាម៉ា", // drugs
    "ឆ្លងដែនក្លែង",          // fake passport
    "លក់តម្រងនោម",         // selling a kidney
  ];
  const EN_RE = new RegExp("\\b(?:" + EN.join("|") + ")\\b", "i");

  function normalizeLatin(text) {
    let s = String(text || "").normalize("NFKC").replace(ZERO_WIDTH, "").toLowerCase();
    s = s.replace(/[013457@$]/g, (c) => LEET[c] || c);
    s = s.replace(/[^a-z\u1780-\u17ff]+/g, " ");
    // "s e x w o r k" → "sexwork" (runs of 3+ single letters)
    s = s.replace(/\b(?:[a-z] ){2,}[a-z]\b/g, (m) => m.replace(/ /g, ""));
    return ` ${s.replace(/\s+/g, " ").trim()} `;
  }
  function normalizeKhmer(text) {
    return String(text || "").normalize("NFC").replace(ZERO_WIDTH, "").replace(/\s+/g, "");
  }
  /** @returns {{ ok: boolean, hits: string[] }} */
  function check(...fields) {
    const raw = fields.filter(Boolean).join(" \n ");
    const hits = [];
    const latin = normalizeLatin(raw);
    const m = latin.match(EN_RE);
    if (m) hits.push(m[0].trim());
    const km = normalizeKhmer(raw);
    KM.forEach((term) => { if (km.includes(term)) hits.push(term); });
    return { ok: hits.length === 0, hits };
  }
  return Object.freeze({ check, EN, KM });
})();
/* CONTENT_GUARD_END */


/* PATH_HELPERS_START — post / browse / contact reliability (static helpers; smoke evals in Node). */
class FormValidators {
  /** Telegram @username: letters/numbers/underscore (loose client hint). */
  static telegram(raw) {
    const h = String(raw || "").trim().replace(/^@/, "");
    if (!h) return { ok: false, reason: "required" };
    if (!/^[A-Za-z0-9_]{4,32}$/.test(h)) return { ok: false, reason: "format" };
    return { ok: true, value: h };
  }
  /** WhatsApp / phone: digits, optional leading +, length 8–15. Empty OK when optional. */
  static phoneish(raw, required) {
    const s = String(raw || "").trim();
    if (!s) return required ? { ok: false, reason: "required" } : { ok: true, value: "" };
    const compact = s.replace(/[\s()-]/g, "");
    if (!/^\+?[0-9]{8,15}$/.test(compact)) return { ok: false, reason: "format" };
    return { ok: true, value: s };
  }
}

class ContactLinks {
  static telegram(handle) {
    const h = String(handle || "").trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{4,32}$/.test(h)) return null;
    return "https://t.me/" + encodeURIComponent(h);
  }
  static whatsapp(raw) {
    const digits = String(raw || "").replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return null;
    return "https://wa.me/" + digits;
  }
  static tel(raw) {
    const digits = String(raw || "").replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return null;
    return "tel:+" + digits;
  }
  /** Only allowlist the three URL shapes contact buttons may open — blocks javascript:/data:/http:,
      other hosts, paths, queries, invites. Exact shapes: https://t.me/<user>, https://wa.me/<digits>,
      tel:+<digits>. Case-sensitive scheme/host on purpose (we only ever build lowercase). */
  static isAllowed(url) {
    if (typeof url !== "string") return false;
    if (/^https:\/\/t\.me\/[A-Za-z0-9_]{4,32}$/.test(url)) return true;
    if (/^https:\/\/wa\.me\/[0-9]{8,15}$/.test(url)) return true;
    if (/^tel:\+[0-9]{8,15}$/.test(url)) return true;
    return false;
  }
  /** "tg" | "wa" | "tel" | null for an allowlisted URL. */
  static kindOf(url) {
    if (!ContactLinks.isAllowed(url)) return null;
    if (url.startsWith("https://t.me/")) return "tg";
    if (url.startsWith("https://wa.me/")) return "wa";
    return "tel";
  }
  /** Phase A contact box. Accepts 012…, +855…, 855…, @name, name, t.me/…, wa.me/… (with or without
      http(s)://) and returns ONLY an allowlisted URL. Anything else → { ok:false, reason }.
      Cambodian local numbers (leading 0) become +855. */
  static normalize(raw) {
    let s = String(raw == null ? "" : raw).normalize("NFKC").replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, "").trim();
    if (!s) return { ok: false, reason: "required" };
    if (s.length > 80) return { ok: false, reason: "format" };
    const done = (url) => (ContactLinks.isAllowed(url)
      ? { ok: true, url, kind: ContactLinks.kindOf(url) }
      : { ok: false, reason: "format" });
    const intl = (digits) => {
      if (/^0[1-9][0-9]{7,8}$/.test(digits)) return "855" + digits.slice(1); // KH local 0xx…
      if (/^855[1-9][0-9]{7,8}$/.test(digits)) return digits;
      return null;
    };
    // t.me / telegram.me links — username only (no invites, joinchat, paths or queries)
    let m = s.match(/^(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([A-Za-z0-9_]+)\/?$/i);
    if (m) return /^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(m[1]) ? done("https://t.me/" + m[1]) : { ok: false, reason: "format" };
    // wa.me links — digits only (local 0… converted to 855…)
    m = s.match(/^(?:https?:\/\/)?(?:www\.)?wa\.me\/\+?([0-9]+)\/?$/i);
    if (m) {
      const d = intl(m[1]) || (/^[1-9][0-9]{7,14}$/.test(m[1]) ? m[1] : null);
      return d ? done("https://wa.me/" + d) : { ok: false, reason: "format" };
    }
    // @name or bare Telegram username (must start with a letter)
    m = s.match(/^@?([A-Za-z][A-Za-z0-9_]{3,31})$/);
    if (m) return done("https://t.me/" + m[1]);
    // phone: digits with spaces / dashes / dots / parentheses, optional leading +
    if (/^\+?[0-9\s().-]{8,24}$/.test(s)) {
      const plus = s.startsWith("+");
      const digits = s.replace(/\D/g, "");
      if (plus) return /^[1-9][0-9]{7,14}$/.test(digits) ? done("tel:+" + digits) : { ok: false, reason: "format" };
      const d = intl(digits);
      return d ? done("tel:+" + d) : { ok: false, reason: "format" };
    }
    return { ok: false, reason: "format" };
  }
}

class LocalPosts {
  static isValid(g) {
    if (!g || typeof g !== "object") return false;
    if (!g.id || typeof g.id !== "string") return false;
    if (g.type !== "need" && g.type !== "offer") return false;
    if (!g.category || typeof g.category !== "string") return false;
    const title = g.title_en || g.title_km;
    if (!title || typeof title !== "string") return false;
    return true;
  }
  static load() {
    const raw = SafeStorage.getJSON(LS_POSTS, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter(LocalPosts.isValid);
  }
  static save(list) {
    const clean = (Array.isArray(list) ? list : []).filter(LocalPosts.isValid);
    return SafeStorage.setJSON(LS_POSTS, clean);
  }
}
/* PATH_HELPERS_END */

/* PHASE_A_START — pure helpers (no DOM); scripts/phase_a_check.mjs evals this block in Node. */
const PhaseA = Object.freeze({
  JUST_POSTED_MS: 8000,
  hasKhmer(text) { return /[\u1780-\u17FF]/.test(String(text || "")); },
  /** Which empty state to show for a feed tab. "postFirst" = SAMPLE hidden + nothing local on this tab:
      a single action (post the first gig/offer). */
  emptyKind({ feedType, hideDemo, filtersActive, unfilteredCount }) {
    if (feedType === "saved") return !filtersActive && unfilteredCount === 0 ? "saved" : "filter";
    if (hideDemo && unfilteredCount === 0) return "postFirst";
    if (filtersActive) return "filter";
    return "generic";
  },
  /** Plain-text progress line key — a count, never points / streaks / badges. */
  progressKey(n) { return n <= 0 ? "progressNone" : n === 1 ? "progressOne" : "progressMany"; },
  /** Wizard step checks. d = { type, category, title, khan, contact }. Returns { ok, err } (err = I18N key). */
  checkStep(step, d, normalize) {
    if (step === 1) return d.type === "need" || d.type === "offer" ? { ok: true } : { ok: false, err: "requiredType" };
    if (step === 2) {
      if (!d.category) return { ok: false, err: "requiredCat" };
      if (!String(d.title || "").trim()) return { ok: false, err: "requiredWhat" };
      if (!d.khan) return { ok: false, err: "requiredKhan" };
      return { ok: true };
    }
    if (step === 3) {
      const c = normalize(d.contact);
      if (c.ok) return { ok: true, url: c.url, kind: c.kind };
      return { ok: false, err: c.reason === "required" ? "contactRequired" : "contactInvalid" };
    }
    return { ok: true };
  },
  /** Store the user's title exactly as typed: Khmer script → title_km, otherwise title_en. */
  titleFields(title) {
    const v = String(title || "").trim();
    return PhaseA.hasKhmer(v) ? { title_en: "", title_km: v } : { title_en: v, title_km: "" };
  },
});
/* PHASE_A_END */

/* SHARED_SHEET_FEED_START — Phase B shared feed: static feed.json + optional mailto/Telegram submit (OFF by default).
   FEED_JSON_URL set → read shared board (network-first). SUBMIT_EMAIL / SUBMIT_TELEGRAM_BOT empty → on-phone post only (no shared-board posting UI).
   Every feed row re-validated: contact allowlist, ContentGuard, length caps. Text escaped at render. */
const SharedSheetFeed = (() => {
  const FIELD_ORDER = ["kind", "title", "details", "khan", "pay", "category", "contact", "lang", "post_id"];
  const MAX_ROWS = 400;
  const MAX_CHARS = 800000;
  const CAPS = { title: 120, details: 1200, khan: 40, pay: 40, category: 40, contact: 80, lang: 8, post_id: 80, status: 20, note: 200 };

  function emptyConfig() {
    return {
      SUBMIT_EMAIL: "",
      SUBMIT_TELEGRAM_BOT: "",
      FEED_JSON_URL: "data/feed.json",
      REPORT_URL: "",
      FEED_MODE: "postmod",
    };
  }

  function normalizeConfig(raw) {
    const base = emptyConfig();
    if (!raw || typeof raw !== "object") return base;
    base.SUBMIT_EMAIL = String(raw.SUBMIT_EMAIL || "").trim();
    base.SUBMIT_TELEGRAM_BOT = String(raw.SUBMIT_TELEGRAM_BOT || "").trim().replace(/^@/, "");
    base.FEED_JSON_URL = String(raw.FEED_JSON_URL || "").trim() || "data/feed.json";
    base.REPORT_URL = String(raw.REPORT_URL || "").trim();
    const mode = String(raw.FEED_MODE || "postmod").trim().toLowerCase();
    base.FEED_MODE = mode === "premod" ? "premod" : "postmod";
    return base;
  }

  /** Reading the shared board (feed.json). */
  function isConfigured(cfg) {
    return !!(cfg && String(cfg.FEED_JSON_URL || "").trim());
  }

  function submitEmail(cfg) {
    const e = cfg && String(cfg.SUBMIT_EMAIL || "").trim();
    if (!e || !/^[^s@]+@[^s@]+\.[^s@]+$/.test(e)) return "";
    return e;
  }

  function submitTelegramBot(cfg) {
    const u = cfg && String(cfg.SUBMIT_TELEGRAM_BOT || "").trim().replace(/^@/, "");
    if (!u || !/^[A-Za-z0-9_]{5,32}$/.test(u)) return "";
    return u;
  }

  /** Posting to the shared board (email and/or Telegram bot). Both empty = on-phone only. */
  function canPost(cfg) {
    return !!(submitEmail(cfg) || submitTelegramBot(cfg));
  }

  function clean(v, max) {
    return String(v == null ? "" : v)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim()
      .slice(0, max);
  }

  function escapeField(v) {
    return String(v == null ? "" : v).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n");
  }

  function unescapeField(v) {
    return String(v == null ? "" : v).replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
  }

  function statusVisible(status, mode) {
    const s = clean(status, CAPS.status).toLowerCase();
    if (!s) return mode !== "premod";
    if (mode === "premod") return s === "live";
    return s !== "hidden" && s !== "removed" && s !== "blocked";
  }

  function normalizeRow(raw, opts) {
    const o = opts || {};
    const mode = o.feedMode === "premod" ? "premod" : "postmod";
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    if (raw.status != null && raw.status !== "" && !statusVisible(raw.status, mode)) return null;
    const kind = clean(raw.kind || raw.type, 10).toLowerCase();
    if (kind !== "need" && kind !== "offer") return null;
    const category = clean(raw.category, CAPS.category).toLowerCase();
    if (!CATEGORIES.some((c) => c.id === category)) return null;
    const title = clean(raw.title, CAPS.title);
    if (!title) return null;
    const details = clean(raw.details, CAPS.details);
    const pay = clean(raw.pay, CAPS.pay);
    const khanRaw = clean(raw.khan, CAPS.khan);
    const khan = KHANS.includes(khanRaw) ? khanRaw : (khanRaw || "Other");
    const langRaw = clean(raw.lang, CAPS.lang).toLowerCase();
    const language = langRaw === "km" ? "km" : "en";
    let contact = clean(raw.contact, CAPS.contact);
    if (!ContactLinks.isAllowed(contact)) {
      const n = ContactLinks.normalize(contact);
      if (!n.ok || !ContactLinks.isAllowed(n.url)) return null;
      contact = n.url;
    }
    if (o.blocklist && o.blocklist.has(contact.toLowerCase())) return null;
    const guard = ContentGuard.check(title, details, pay, khan, contact);
    if (!guard.ok) return null;
    const titles = PhaseA.titleFields(title);
    const postId = clean(raw.post_id || raw.id, CAPS.post_id).replace(/[^A-Za-z0-9_-]/g, "");
    if (!postId) return null;
    const t0 = Date.parse(clean(raw.received_at || raw.created_at || raw.timestamp, 40));
    const created_at = Number.isNaN(t0) ? (o.fallbackDate || new Date().toISOString()) : new Date(t0).toISOString();
    const g = {
      id: postId,
      type: kind,
      category,
      title_en: titles.title_en,
      title_km: titles.title_km,
      description: details,
      khan,
      when_text: "",
      rate_text: pay,
      contact_url: contact,
      telegram: "",
      whatsapp: "",
      phone: "",
      khqr_image_url: "",
      language,
      status: "live",
      created_at,
      created_by: "shared",
      source: "shared",
      sample: false,
      shared: true,
    };
    return LocalPosts.isValid(g) ? g : null;
  }

  function normalizeRows(objects, opts) {
    const o = opts || {};
    const rows = (Array.isArray(objects) ? objects : []).slice(0, MAX_ROWS);
    const seen = new Set();
    const gigs = [];
    let dropped = 0;
    for (const r of rows) {
      const g = normalizeRow(r, o);
      if (!g || seen.has(g.id)) { dropped += 1; continue; }
      seen.add(g.id);
      gigs.push(g);
    }
    return { gigs, dropped };
  }

  function normalizeFeedDocument(doc, opts) {
    if (!doc || typeof doc !== "object") return { gigs: [], dropped: 0, updated_at: null };
    const updated_at = clean(doc.updated_at, 40) || null;
    const posts = Array.isArray(doc.posts) ? doc.posts : [];
    const out = normalizeRows(posts, opts);
    return { gigs: out.gigs, dropped: out.dropped, updated_at };
  }

  function gigFieldMap(gig) {
    return {
      kind: gig.type,
      title: (gig.title_en || gig.title_km || "").slice(0, CAPS.title),
      details: String(gig.description || "").slice(0, CAPS.details),
      khan: String(gig.khan || "").slice(0, CAPS.khan),
      pay: String(gig.rate_text || "").slice(0, CAPS.pay),
      category: String(gig.category || "").slice(0, CAPS.category),
      contact: String(gig.contact_url || "").slice(0, CAPS.contact),
      lang: PhaseA.hasKhmer(gig.title_km || gig.title_en) ? "km" : (gig.language === "km" ? "km" : "en"),
      post_id: String(gig.id || "").slice(0, CAPS.post_id),
    };
  }

  function buildLgppPostBody(gig, humanLine) {
    const map = gigFieldMap(gig);
    const human = humanLine || "This post will appear on the shared board after a moderator check (usually within ~15 minutes).";
    const lines = [human, ""];
    FIELD_ORDER.forEach((k) => lines.push(k + ": " + escapeField(map[k])));
    return lines.join("\n");
  }

  function parseLgppPostBody(text) {
    const raw = String(text || "").replace(/^\uFEFF/, "");
    if (!raw.trim()) return { ok: false, reason: "empty" };
    const fields = {};
    raw.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([a-z_]+):\s*(.*)$/i);
      if (!m) return;
      const key = m[1].toLowerCase();
      if (!FIELD_ORDER.includes(key)) return;
      if (!(key in fields)) fields[key] = unescapeField(m[2]);
    });
    for (const k of FIELD_ORDER) {
      if (!(k in fields) || String(fields[k]).trim() === "") return { ok: false, reason: "missing:" + k };
    }
    const g = normalizeRow(fields, { feedMode: "postmod" });
    if (!g) return { ok: false, reason: "invalid" };
    return {
      ok: true,
      post: {
        post_id: g.id, kind: g.type, title: g.title_en || g.title_km, details: g.description,
        khan: g.khan, pay: g.rate_text, category: g.category, contact: g.contact_url,
        lang: g.language, received_at: g.created_at,
      },
    };
  }

  function buildMailto(cfg, gig) {
    const email = submitEmail(cfg);
    if (!email) return null;
    const subject = "LGPP-POST " + String(gig.id || "");
    const body = buildLgppPostBody(gig);
    return {
      subject,
      body,
      mailto: "mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body),
    };
  }

  function buildTelegramSubmit(cfg, gig) {
    const bot = submitTelegramBot(cfg);
    if (!bot) return null;
    return { bot, url: "https://t.me/" + bot, body: buildLgppPostBody(gig) };
  }

  function cacheBust(url) {
    const u = String(url || "");
    if (!u) return u;
    const sep = u.includes("?") ? "&" : "?";
    return u + sep + "_ts=" + Date.now();
  }

  return Object.freeze({
    FIELD_ORDER, ENTRY_ORDER: FIELD_ORDER, MAX_ROWS, MAX_CHARS, CAPS,
    emptyConfig, normalizeConfig, isConfigured, canPost, submitEmail, submitTelegramBot,
    clean, escapeField, unescapeField, statusVisible,
    normalizeRow, normalizeRows, normalizeFeedDocument,
    buildLgppPostBody, parseLgppPostBody, buildMailto, buildTelegramSubmit, cacheBust,
  });
})();
/* SHARED_SHEET_FEED_END */


/* Reserved sponsor slots — inert, labeled placeholders. No ad network, no external script,
   no tracking, no click handler. Never sticky, never overlays content. See store/NO_ADS_BILLING.md. */
const ReservedSlots = Object.freeze({
  enabled: true,
  listAfter: 4, // after the 4th card (or at the end of shorter lists)
  html(placement) {
    if (!this.enabled) return "";
    return `<div class="reserved-slot" data-reserved-slot="${placement}" role="note" aria-label="${escapeHtml(t("slotAria"))}">
      <span class="reserved-slot-label">${t("slotLabel")}</span>
      <span class="reserved-slot-body">${t("slotBody")}</span>
    </div>`;
  },
  /** Insert one slot into an array of card HTML strings. */
  intoList(cards) {
    if (!this.enabled || !cards.length) return cards.join("");
    const at = Math.min(this.listAfter, cards.length);
    return [...cards.slice(0, at), this.html("list"), ...cards.slice(at)].join("");
  },
});

/** Review-friendly: first visit defaults SAMPLE hidden (Show SAMPLE still available). */
function initHideDemo() {
  const raw = lsGet(LS_HIDE_DEMO);
  if (raw === null) {
    lsSet(LS_HIDE_DEMO, "1");
    lsSet(LS_REVIEW_MODE, "1");
    return true;
  }
  return raw === "1";
}

let lang = lsGet(LS_LANG) || "en";
let seedGigs = [];
let sharedGigs = [];
let feedConfig = SharedSheetFeed.emptyConfig();
let feedType = "need";
let filters = { category: "", khan: "", language: "" };
let offlineDismissed = false;
let selectedId = null;
let seedLoadState = "loading"; // loading | ok | error
let sharedFeedState = "idle";
let sharedFeedFetchedAt = null;
let hideDemo = initHideDemo();
let justPostedId = null;
let justPostedAt = 0;
const wizard = { step: 1 };

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
const tf = (k, vars) => {
  let s = t(k);
  Object.entries(vars || {}).forEach(([key, val]) => {
    s = s.replace(`{${key}}`, String(val));
  });
  return s;
};

function deviceId() {
  let id = lsGet(LS_DEVICE);
  if (!id) {
    id = "dev_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    lsSet(LS_DEVICE, id);
  }
  return id;
}

function getLocalPosts() {
  return LocalPosts.load();
}
/** @returns {boolean} false when storage is full / blocked. */
function saveLocalPosts(list) {
  return LocalPosts.save(list);
}

function getSavedIds() {
  try {
    const raw = JSON.parse(lsGet(LS_SAVED) || "[]");
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}
function setSavedIds(ids) {
  const uniq = [...new Set(ids.map(String))];
  lsSet(LS_SAVED, JSON.stringify(uniq));
}
function isSaved(id) {
  return getSavedIds().includes(String(id));
}
function toggleStar(id, opts = {}) {
  const sid = String(id);
  let ids = getSavedIds();
  const on = ids.includes(sid);
  if (on) ids = ids.filter((x) => x !== sid);
  else ids.push(sid);
  setSavedIds(ids);
  if (!opts.silent) toast(on ? t("unsavedToast") : t("savedToast"));
  return !on;
}

function getHiddenIds() {
  try {
    const raw = JSON.parse(lsGet(LS_HIDDEN) || "[]");
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}
function setHiddenIds(ids) {
  const uniq = [...new Set(ids.map(String))];
  lsSet(LS_HIDDEN, JSON.stringify(uniq));
}
function isHidden(id) {
  return getHiddenIds().includes(String(id));
}
/** Hide gig on this device only — distinct from ★ savedStars. */
function hideGigOnDevice(id) {
  const sid = String(id);
  const ids = getHiddenIds();
  if (!ids.includes(sid)) {
    ids.push(sid);
    setHiddenIds(ids);
  }
  toast(t("hideGigToast"));
  renderHiddenMgmt();
}

/** Clear all device-hidden gigs (Safety management). */
function clearHiddenGigs() {
  const n = getHiddenIds().length;
  if (!n) {
    toast(t("clearHiddenNone"));
    renderHiddenMgmt();
    return;
  }
  setHiddenIds([]);
  toast(t("clearHiddenToast"));
  renderHiddenMgmt();
  renderFeed();
  if (selectedId) renderDetail(selectedId);
}

/** Compact Safety row: hidden count + Clear hidden (EN+KM via i18n). */
function renderHiddenMgmt() {
  const countEl = $("#hidden-count");
  const btn = $("#btn-clear-hidden");
  if (!countEl) return;
  const n = getHiddenIds().length;
  countEl.textContent = tf("hiddenMgmtCount", { n });
  if (btn) {
    btn.disabled = n === 0;
    btn.setAttribute("aria-label", t("ariaClearHidden"));
  }
}

let formBusy = false;
let langApplyToken = 0;
let modalEscHandler = null;

/** Clear modal UI + Escape listener (safe for lang switch mid-dialog). */
/** Modal root helper — clear FIRST, then insert (pack 13 regression fix). */
class Modal {
  static dismiss() {
    const root = $("#modal-root");
    if (root) root.innerHTML = "";
    if (modalEscHandler) {
      document.removeEventListener("keydown", modalEscHandler);
      modalEscHandler = null;
    }
  }
  /** Open one dialog in #modal-root: clear the previous one FIRST, then insert, wire Escape +
      backdrop close, and focus. (Pre-pack-13 callers cleared AFTER inserting, which wiped the new
      dialog and threw on .focus() — contact confirm + delete confirm never appeared.) */
  static open(html, focusSel = "#modal-cancel") {
    Modal.dismiss();
    const root = $("#modal-root");
    if (!root) return null;
    root.innerHTML = html;
    modalEscHandler = (e) => { if (e.key === "Escape") Modal.dismiss(); };
    document.addEventListener("keydown", modalEscHandler);
    const backdrop = root.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", (e) => { if (e.target === backdrop) Modal.dismiss(); });
    }
    const focusEl = root.querySelector(focusSel);
    if (focusEl) focusEl.focus();
    return root;
  }
}
function dismissModal() { return Modal.dismiss(); }
function openModal(html, focusSel = "#modal-cancel") { return Modal.open(html, focusSel); }

/** Hard reject for prohibited content — bilingual (EN + KM shown together). */
function showGuardBlock() {
  const both = (k) => `<p lang="en">${I18N.en[k]}</p><p lang="km">${I18N.km[k]}</p>`;
  const root = openModal(`<div class="modal-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="guard-title">
    <div class="modal modal-danger guard-modal">
      <h3 id="guard-title">${I18N.en.guardTitle} · <span lang="km">${I18N.km.guardTitle}</span></h3>
      ${both("guardBody")}
      <div class="guard-note small">${both("guardNote")}</div>
      <button type="button" class="btn btn-secondary" id="modal-cancel">${t("guardEdit")}</button>
    </div>
  </div>`);
  if (root) $("#modal-cancel").addEventListener("click", dismissModal);
  const live = $("#a11y-status");
  if (live) live.textContent = `${I18N.en.guardTitle}. ${I18N.km.guardTitle}`;
}

/* Terms / disclaimer first-open gate. Blocks the app until accepted once per TERMS_VERSION.
   If storage is blocked, acceptance holds for this session so the app is never bricked. */
const TermsGate = {
  sessionAccepted: false,
  isAccepted() {
    if (this.sessionAccepted) return true;
    try {
      const rec = JSON.parse(lsGet(LS_TERMS) || "null");
      return !!(rec && rec.v === TERMS_VERSION);
    } catch (_) {
      return false;
    }
  },
  setBackgroundInert(on) {
    ["header.app-header", "#main-content", "nav.tab-bar"].forEach((sel) => {
      const el = $(sel);
      if (!el) return;
      if (on) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
      else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
    });
    document.body.classList.toggle("gate-open", on);
  },
  render() {
    const el = $("#terms-gate");
    if (!el) return;
    if (this.isAccepted()) {
      el.classList.add("hidden");
      el.innerHTML = "";
      this.setBackgroundInert(false);
      return;
    }
    const wasChecked = !!(el.querySelector("#terms-check") || {}).checked;
    const pts = [1, 2, 3, 4, 5].map((n) => `<li>${t("termsGatePt" + n)}</li>`).join("");
    el.innerHTML = `<div class="terms-gate-card">
      <div class="lang-toggle terms-gate-lang" role="group" aria-label="Language">
        <button type="button" data-gate-lang="en" class="${lang === "en" ? "active" : ""}" aria-pressed="${lang === "en"}">EN</button>
        <button type="button" data-gate-lang="km" class="${lang === "km" ? "active" : ""}" aria-pressed="${lang === "km"}">ខ្មែរ</button>
      </div>
      <h2 id="terms-gate-title">${t("termsGateTitle")}</h2>
      <ul class="terms-gate-list">${pts}</ul>
      <p class="muted small">${t("termsGateNotLegal")} <a href="terms.html">${t("termsGateRead")}</a></p>
      <label class="terms-gate-check"><input type="checkbox" id="terms-check" ${wasChecked ? "checked" : ""}/> <span>${t("termsGateCheck")}</span></label>
      <button type="button" class="btn btn-primary" id="btn-terms-accept" ${wasChecked ? "" : "disabled"}>${t("termsGateAccept")}</button>
    </div>`;
    el.classList.remove("hidden");
    this.setBackgroundInert(true);
    const check = $("#terms-check");
    const accept = $("#btn-terms-accept");
    check.addEventListener("change", () => { accept.disabled = !check.checked; });
    accept.addEventListener("click", () => this.accept());
    el.querySelectorAll("[data-gate-lang]").forEach((b) =>
      b.addEventListener("click", () => setLang(b.dataset.gateLang))
    );
  },
  accept() {
    const ok = lsSet(LS_TERMS, JSON.stringify({ v: TERMS_VERSION, at: new Date().toISOString() }));
    if (!ok) this.sessionAccepted = true;
    this.render();
    const main = $("#main-content");
    if (main) main.focus();
  },
};


function allGigs() {
  const map = new Map();
  sharedGigs.forEach((g) => { if (g && g.id) map.set(String(g.id), g); });
  seedGigs.forEach((g) => { if (g && g.id && !map.has(String(g.id))) map.set(String(g.id), g); });
  getLocalPosts().forEach((g) => { if (g && g.id) map.set(String(g.id), g); });
  return [...map.values()];
}
function sharedFeedEnabled() {
  return SharedSheetFeed.isConfigured(feedConfig);
}

function catMeta(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, en: id, km: id, icon: "•" };
}
function catLabel(id) {
  const c = catMeta(id);
  return `${c.icon} ${lang === "km" ? c.km : c.en}`;
}
function titleOf(g) {
  if (lang === "km" && g.title_km) return g.title_km;
  return g.title_en || g.title_km || "(untitled)";
}
/** Second-language title — only when the listing itself carries BOTH (seed rows). Never machine-translated;
    a user's own single-field post has no alt title and shows exactly as typed. */
function altTitleOf(g) {
  if (!g.title_en || !g.title_km) return null;
  return lang === "km"
    ? { text: g.title_en, lang: "en" }
    : { text: g.title_km, lang: "km" };
}
function titleLangOf(g) {
  const v = titleOf(g);
  return PhaseA.hasKhmer(v) ? "km" : "en";
}
function hasTelegram(g) {
  return !!(g.telegram || ContactLinks.kindOf(g.contact_url) === "tg");
}
function myPostCount() {
  return getLocalPosts().filter((g) => g.created_by === deviceId() && !g.sample).length;
}
function renderProgress() {
  const n = myPostCount();
  const text = tf(PhaseA.progressKey(n), { n });
  const browse = $("#progress-line");
  if (browse) {
    browse.textContent = n > 0 ? text : "";
    browse.classList.toggle("hidden", n === 0);
  }
  const mine = $("#mine-progress");
  if (mine) mine.textContent = text;
}
function normalizeTg(handle) {
  return String(handle || "").trim().replace(/^@/, "");
}

/** Relative time — always via I18N (KM when lang=km; never hard-coded English). */
function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return t("timeJustNow");
  if (mins < 60) return tf("timeMins", { n: mins });
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return tf("timeHours", { n: hrs });
  return tf("timeDays", { n: Math.round(hrs / 24) });
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  const live = $("#a11y-status");
  if (live) live.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.classList.remove("show");
    if (live) live.textContent = "";
  }, 2400);
}

function isStandaloneDisplay() {
  try {
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
    if (window.matchMedia && window.matchMedia("(display-mode: fullscreen)").matches) return true;
    if (typeof navigator.standalone === "boolean" && navigator.standalone) return true;
  } catch (_) {}
  return false;
}

/** Phase A: ONE first-open banner (replaces the old install tip + demo lecture). Dismissed once,
    remembered in localStorage. The install hint is one short clause, hidden when already installed. */
function renderFirstOpen() {
  const el = $("#first-open-banner");
  if (!el) return;
  const dismissed = lsGet(LS_FIRST_OPEN) === "1" || !!renderFirstOpen.sessionDismissed;
  el.classList.toggle("hidden", dismissed);
  const install = $("#first-open-install");
  if (install) install.classList.toggle("hidden", isStandaloneDisplay());
  const dismiss = $("#btn-first-open-dismiss");
  if (dismiss) dismiss.setAttribute("aria-label", t("ariaFirstOpenDismiss"));
  const exportBtn = $("#btn-export-posts");
  if (exportBtn) exportBtn.setAttribute("aria-label", t("exportPosts"));
}

function dismissFirstOpen() {
  if (!lsSet(LS_FIRST_OPEN, "1")) renderFirstOpen.sessionDismissed = true;
  const el = $("#first-open-banner");
  if (el) el.classList.add("hidden");
}

function exportMyPosts() {
  const mine = getLocalPosts().filter((g) => g.created_by === deviceId() && !g.sample);
  if (!mine.length) {
    toast(t("exportEmpty"));
    return;
  }
  const payload = {
    exported_at: new Date().toISOString(),
    app: "Local Gigs PP",
    note: "Local device posts only — SAMPLE seed not included.",
    device_id: deviceId(),
    posts: mine,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `local-gigs-pp-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  toast(t("exportOk"));
}

function confirmDeletePost(id) {
  const root = openModal(`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-title">
    <div class="modal modal-danger">
      <h3 id="delete-title">${t("deleteConfirmTitle")}</h3>
      <p>${t("deleteConfirmBody")}</p>
      <div class="btn-row">
        <button type="button" class="btn btn-secondary" id="modal-cancel" style="margin:0" aria-label="${t("confirmCancel")}">${t("confirmCancel")}</button>
        <button type="button" class="btn btn-danger-solid" id="modal-ok" style="margin:0" aria-label="${t("deleteConfirmAction")}">${t("deleteConfirmAction")}</button>
      </div>
    </div>
  </div>`);
  if (!root) return;
  $("#modal-cancel").addEventListener("click", dismissModal);
  $("#modal-ok").addEventListener("click", () => {
    dismissModal();
    saveLocalPosts(getLocalPosts().filter((x) => x.id !== id));
    renderMine();
    renderFeed();
    toast(t("deletedOk"));
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function applyI18n() {
  const token = ++langApplyToken;
  // Close open modals — their copy is baked at open time (avoids stale EN/KM).
  dismissModal();

  $$("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  $$("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  $$(".lang-toggle button").forEach((b) => {
    const on = b.dataset.lang === lang;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  document.documentElement.lang = lang === "km" ? "km" : "en";
  const stamp = $("#app-version-stamp");
  if (stamp) stamp.textContent = tf("versionStamp", { v: APP_VERSION });
  renderFirstOpen();
  // If a form submit is in-flight, refresh busy label in current lang
  if (formBusy) {
    $$('button[type="submit"]').forEach((btn) => {
      if (btn.disabled) btn.textContent = t("submitting");
    });
  }
  fillSelects();
  if (token !== langApplyToken) return; // superseded by a faster toggle
  renderDemoBar();
  renderFeed();
  renderSharedFeedStatus();
  renderMine();
  renderHiddenMgmt();
  renderProgress();
  wizardRender();
  if (selectedId) renderDetail(selectedId);
  updateOfflineBanner();
  TermsGate.render();
}

function setLang(next) {
  if (next !== "en" && next !== "km") return;
  if (next === lang) return; // no-op — avoids redundant re-render races
  lang = next;
  lsSet(LS_LANG, lang);
  applyI18n();
}

function fillSelects() {
  const catOpts = [`<option value="">${t("all")}</option>`]
    .concat(CATEGORIES.map((c) => `<option value="${c.id}">${c.icon} ${lang === "km" ? c.km : c.en}</option>`))
    .join("");
  const khanOpts = [`<option value="">${t("all")}</option>`]
    .concat(KHANS.map((k) => `<option value="${k}">${k}</option>`))
    .join("");
  const langOpts = [
    `<option value="">${t("all")}</option>`,
    `<option value="en">${t("langEn")}</option>`,
    `<option value="km">${t("langKm")}</option>`,
    `<option value="both">${t("langBoth")}</option>`,
  ].join("");

  const fc = $("#filter-cat");
  if (fc) {
    const prev = fc.value;
    fc.innerHTML = catOpts;
    if ([...fc.options].some((o) => o.value === prev)) fc.value = prev;
  }
  const pc = $("#post-cat");
  if (pc) {
    const prevInput = pc.querySelector("input:checked");
    const prev = prevInput ? prevInput.value : "";
    pc.innerHTML = CATEGORIES.map((c) => `<label class="cat-option"><input type="radio" name="post-cat" value="${c.id}" ${prev === c.id ? "checked" : ""}/> <span>${c.icon} ${lang === "km" ? c.km : c.en}</span></label>`).join("");
  }
  const fk = $("#filter-khan");
  if (fk) {
    const prev = fk.value;
    fk.innerHTML = khanOpts;
    if ([...fk.options].some((o) => o.value === prev)) fk.value = prev;
  }
  const fl = $("#filter-lang");
  if (fl) {
    const prev = fl.value;
    fl.innerHTML = langOpts;
    if ([...fl.options].some((o) => o.value === prev)) fl.value = prev;
  }
  const pk = $("#post-khan");
  if (pk) {
    const prev = pk.value;
    const last = lastKhan();
    pk.innerHTML = [`<option value="">${t("pickKhan")}</option>`]
      .concat(KHANS.map((k) => `<option value="${k}">${k}</option>`)).join("");
    const want = prev || last;
    if ([...pk.options].some((o) => o.value === want)) pk.value = want;
  }
}

function lastKhan() {
  const k = lsGet(LS_LAST_KHAN);
  return KHANS.includes(k) ? k : "";
}

function filteredGigs() {
  const savedSet = new Set(getSavedIds());
  const hiddenSet = new Set(getHiddenIds());
  return allGigs()
    .filter((g) => g.status === "live")
    .filter((g) => !hiddenSet.has(String(g.id)))
    .filter((g) => !hideDemo || !g.sample)
    .filter((g) => {
      if (feedType === "saved") return savedSet.has(String(g.id));
      return g.type === feedType;
    })
    .filter((g) => !filters.category || g.category === filters.category)
    .filter((g) => !filters.khan || g.khan === filters.khan)
    .filter((g) => {
      if (!filters.language) return true;
      if (filters.language === "both") return true;
      return g.language === filters.language || g.language === "both";
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function isJustPosted(g) {
  return g.id === justPostedId && Date.now() - justPostedAt < PhaseA.JUST_POSTED_MS;
}

/** Card: pay + khan are the loudest text; category is a chip (no label); seed rows with EN+KM show both
    titles; own posts show exactly as typed. opts.preview → static (wizard review). */
function cardHtml(g, opts = {}) {
  const preview = !!opts.preview;
  const starred = !preview && isSaved(g.id);
  const fresh = !preview && isJustPosted(g);
  const chips = [
    `<span class="chip ${g.type}">${g.type === "need" ? t("needChip") : t("offerChip")}</span>`,
    `<span class="chip cat">${catLabel(g.category)}</span>`,
    g.sample ? `<span class="chip sample">${t("sampleChip")}</span>` : "",
    g.shared && !g.sample ? `<span class="chip shared">${t("sharedChip")}</span>` : "",
    hasTelegram(g) ? `<span class="chip tg">${t("tgBadge")}</span>` : "",
    fresh ? `<span class="chip just">${t("justPosted")}</span>` : "",
  ].join("");
  const alt = altTitleOf(g);
  const pay = g.rate_text
    ? `<span class="pay">${escapeHtml(g.rate_text)}</span>`
    : `<span class="pay pay-ask">${t("payAsk")}</span>`;
  const star = preview ? "" : `<button type="button" class="star-btn${starred ? " on" : ""}" data-star="${g.id}" aria-pressed="${starred ? "true" : "false"}" aria-label="${starred ? t("ariaUnstar") : t("ariaStar")}" title="${starred ? t("starUnsave") : t("starSave")}">${starred ? "★" : "☆"}</button>`;
  const attrs = preview
    ? `class="gig-card type-${g.type} is-preview"`
    : `class="gig-card type-${g.type}${fresh ? " just-posted" : ""}" data-id="${escapeHtml(g.id)}" role="button" tabindex="0"`;
  return `<article ${attrs}>
        ${star}
        <div class="top">${chips}</div>
        <div class="headline">${pay}<span class="khan">📍 ${escapeHtml(g.khan || "—")}</span></div>
        <h3 lang="${titleLangOf(g)}">${escapeHtml(titleOf(g))}</h3>
        ${alt ? `<p class="alt-title" lang="${alt.lang}">${escapeHtml(alt.text)}</p>` : ""}
        <div class="meta">
          ${g.when_text ? `<span>🕒 ${escapeHtml(g.when_text)}</span>` : ""}
          ${preview ? "" : `<span class="rel-time" data-created="${escapeHtml(g.created_at)}">${timeAgo(g.created_at)}</span>`}
        </div>
      </article>`;
}

function renderFeed() {
  const list = $("#feed-list");
  const loading = $("#feed-loading");
  const countEl = $("#feed-count");
  if (!list) return;

  if ((seedLoadState === "loading" && !seedGigs.length && !getLocalPosts().length && !sharedGigs.length)
      || (sharedFeedEnabled() && sharedFeedState === "loading" && !sharedGigs.length && !getLocalPosts().length && !seedGigs.length)) {
    loading.classList.remove("hidden");
    list.innerHTML = "";
    countEl.textContent = "";
    renderSharedFeedStatus();
    return;
  }
  loading.classList.add("hidden");

  const items = filteredGigs();
  countEl.textContent = tf("resultsCount", { n: items.length });
  renderProgress();

  if (!items.length) {
    const filtersActive = !!(filters.category || filters.khan || filters.language);
    const savedSet = new Set(getSavedIds());
    const hiddenSet = new Set(getHiddenIds());
    const unfiltered = allGigs()
      .filter((g) => g.status === "live")
      .filter((g) => !hiddenSet.has(String(g.id)))
      .filter((g) => !hideDemo || !g.sample)
      .filter((g) => (feedType === "saved" ? savedSet.has(String(g.id)) : g.type === feedType));
    const kind = PhaseA.emptyKind({ feedType, hideDemo, filtersActive, unfilteredCount: unfiltered.length });
    let title, hint, action, ico;
    if (kind === "saved") {
      title = t("emptySaved");
      hint = t("emptySavedHint");
      ico = "★";
      action = `<button type="button" class="btn btn-secondary" id="btn-goto-need" style="max-width:260px;margin:12px auto 0">${t("tabNeed")}</button>`;
    } else if (kind === "postFirst") {
      // Phase A: SAMPLE hidden + nothing local → ONE action only.
      // Phase B: shared board on → shared-feed-empty copy (still a single CTA button).
      // Shared-board *posting* empty copy only when a submit channel is on; reading feed.json still works separately.
      const sharedPosting = SharedSheetFeed.canPost(feedConfig);
      title = sharedPosting ? t("sharedFeedEmpty") : (feedType === "offer" ? t("emptyFirstOffer") : t("emptyFirstNeed"));
      hint = "";
      ico = "📍";
      const cta = sharedPosting ? t("sharedFeedEmptyAction") : (feedType === "offer" ? t("postFirstOffer") : t("postFirstGig"));
      action = `<button type="button" class="btn btn-primary" id="btn-post-first" data-post-type="${feedType === "offer" ? "offer" : "need"}" style="max-width:280px;margin:14px auto 0">${cta}</button>`;
    } else if (kind === "filter") {
      title = t("emptyFilter");
      hint = t("emptyFilterHint");
      ico = "🔎";
      action = `<button type="button" class="btn btn-secondary" id="btn-clear-filters" style="max-width:240px;margin:12px auto 0">${t("clearFilters")}</button>`;
    } else {
      title = t("emptyFeed");
      hint = t("emptyFeedHint");
      ico = "📭";
      action = `<button type="button" class="btn btn-primary" id="btn-post-first" data-post-type="${feedType === "offer" ? "offer" : "need"}" style="max-width:280px;margin:14px auto 0">${feedType === "offer" ? t("postFirstOffer") : t("postFirstGig")}</button>`;
    }
    list.innerHTML = `<div class="state-box" data-empty-kind="${kind}">
      <div class="ico" aria-hidden="true">${ico}</div>
      <div class="title">${title}</div>
      ${hint ? `<p>${hint}</p>` : ""}
      ${action}
    </div>`;
    const postFirst = $("#btn-post-first");
    if (postFirst) postFirst.addEventListener("click", () => openWizard(postFirst.dataset.postType));
    const btn = $("#btn-clear-filters");
    if (btn) btn.addEventListener("click", clearFilters);
    const gotoNeed = $("#btn-goto-need");
    if (gotoNeed) gotoNeed.addEventListener("click", () => setFeedType("need"));
    return;
  }

  const cards = items.map((g) => cardHtml(g));
  list.innerHTML = ReservedSlots.intoList(cards);

  list.querySelectorAll(".gig-card").forEach((card) => {
    const open = () => openDetail(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
  list.querySelectorAll("[data-star]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleStar(btn.dataset.star);
      renderFeed();
      if (selectedId) renderDetail(selectedId);
    });
  });
}


function setHideDemo(next) {
  hideDemo = !!next;
  lsSet(LS_HIDE_DEMO, hideDemo ? "1" : "0");
  renderDemoBar();
  renderFeed();
  if (selectedId) {
    const g = allGigs().find((x) => x.id === selectedId);
    if (!g || (hideDemo && g.sample)) closeDetail();
    else renderDetail(selectedId);
  }
}

function renderDemoBar() {
  const bar = $("#demo-bar");
  const btn = $("#btn-toggle-demo");
  const copy = $("#demo-banner-copy");
  if (!bar || !btn) return;
  // Phase A: one quiet line + text button — never louder than a gig card.
  bar.classList.toggle("demo-hidden-state", hideDemo);
  btn.textContent = hideDemo ? t("showDemo") : t("hideDemo");
  btn.setAttribute("aria-pressed", hideDemo ? "false" : "true");
  if (copy) copy.textContent = hideDemo ? t("demoRowHidden") : t("demoRowShown");
}

function clearFilters() {
  filters = { category: "", khan: "", language: "" };
  $("#filter-cat").value = "";
  $("#filter-khan").value = "";
  $("#filter-lang").value = "";
  renderFeed();
  toast(t("clearFilters"));
}

function openDetail(id) {
  selectedId = id;
  $("#browse-list-view").classList.add("hidden");
  $("#browse-detail-view").classList.remove("hidden");
  renderDetail(id);
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  const back = $("#btn-back-detail");
  if (back) back.focus();
}

function closeDetail() {
  selectedId = null;
  $("#browse-detail-view").classList.add("hidden");
  $("#browse-list-view").classList.remove("hidden");
}

function isLeaveUrlAllowed(url, opts) {
  if (ContactLinks.isAllowed(url)) return true;
  const o = opts || {};
  if (o.allowMailto && typeof url === "string" && /^mailto:[^\s]+$/i.test(url)) return true;
  if (o.allowTelegramBot && typeof url === "string" && /^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}$/.test(url)) return true;
  return false;
}

function confirmExternal(appName, url, opts) {
  const o = opts || {};
  if (!ContactLinks.isAllowed(url) && !isLeaveUrlAllowed(url, o)) {
    toast(t("contactUrlBlocked"));
    return;
  }
  const root = openModal(`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div class="modal"><h3 id="confirm-title">${t("contactConfirmTitle")}</h3><p>${tf("contactConfirmBody", { app: appName })}</p><div class="btn-row"><button type="button" class="btn btn-secondary" id="modal-cancel" style="margin:0">${t("confirmCancel")}</button><button type="button" class="btn btn-primary" id="modal-ok" style="margin:0">${t("confirmContinue")}</button></div></div></div>`);
  if (!root) return;
  $("#modal-cancel").addEventListener("click", dismissModal);
  $("#modal-ok").addEventListener("click", () => {
    dismissModal();
    if (!ContactLinks.isAllowed(url) && !isLeaveUrlAllowed(url, o)) {
      toast(t("contactUrlBlocked"));
      return;
    }
    window.open(url, "_blank", "noopener");
  });
}


function copyTextFallback(text, okKey, failKey) {
  const done = () => toast(t(okKey || "copyLgppBodyOk"));
  const fail = () => toast(t(failKey || "copyLgppBodyFail"));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fail);
  } else {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy") ? done() : fail();
      document.body.removeChild(ta);
    } catch (_) { fail(); }
  }
}

/** After local save: optional shared-board send (email and/or Telegram bot). Hidden when both configs empty. */
function offerSendToSharedBoard(gig) {
  if (!SharedSheetFeed.canPost(feedConfig) || !gig) return;
  const mail = SharedSheetFeed.buildMailto(feedConfig, gig);
  const tg = SharedSheetFeed.buildTelegramSubmit(feedConfig, gig);
  const body = (mail && mail.body) || (tg && tg.body) || SharedSheetFeed.buildLgppPostBody(gig);
  const actions = [];
  if (mail) actions.push(`<button type="button" class="btn btn-primary" id="btn-shared-email" style="margin:0">${escapeHtml(t("sendToSharedBoardEmail"))}</button>`);
  if (tg) actions.push(`<button type="button" class="btn btn-primary" id="btn-shared-tg" style="margin:0">${escapeHtml(t("sendToSharedBoardTelegram"))}</button>`);
  actions.push(`<button type="button" class="btn btn-secondary" id="btn-shared-copy" style="margin:0">${escapeHtml(t("copyLgppBody"))}</button>`);
  actions.push(`<button type="button" class="btn btn-ghost" id="btn-shared-skip" style="margin:0">${escapeHtml(t("sendToSharedBoardSkip"))}</button>`);
  const root = openModal(`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="shared-send-title">
    <div class="modal">
      <h3 id="shared-send-title">${escapeHtml(t("sendToSharedBoard"))}</h3>
      <p class="muted small">${escapeHtml(t("sendToSharedBoardHint"))}</p>
      <div class="btn-row" style="flex-wrap:wrap">${actions.join("")}</div>
    </div>
  </div>`);
  if (!root) return;
  const skip = $("#btn-shared-skip");
  if (skip) skip.addEventListener("click", dismissModal);
  const copyBtn = $("#btn-shared-copy");
  if (copyBtn) copyBtn.addEventListener("click", () => copyTextFallback(body));
  const emailBtn = $("#btn-shared-email");
  if (emailBtn && mail) {
    emailBtn.addEventListener("click", () => {
      dismissModal();
      copyTextFallback(body); // plain-text fallback if mailto fails to open
      confirmExternal(t("sharedBoardMailApp"), mail.mailto, { allowMailto: true });
    });
  }
  const tgBtn = $("#btn-shared-tg");
  if (tgBtn && tg) {
    tgBtn.addEventListener("click", () => {
      dismissModal();
      copyTextFallback(body);
      confirmExternal(t("sharedBoardTelegramApp"), tg.url, { allowTelegramBot: true });
    });
  }
}


function copyGigSummary(g) {
  // Phase A: ready-to-paste message in the CURRENT UI language. Labels come from I18N; the listing's own
  // words are copied exactly as written (no machine translation). Reach-out details stay in the app.
  const c = catMeta(g.category);
  const lines = [
    g.type === "need" ? t("copyHeadNeed") : t("copyHeadOffer"),
    "",
    titleOf(g),
    `💵 ${t("pay")}${t("labelSep")}${g.rate_text || t("payAsk")}`,
    `📍 ${t("khan")}${t("labelSep")}${g.khan || "—"}`,
    g.when_text ? `🕒 ${t("when")}${t("labelSep")}${g.when_text}` : null,
    `${c.icon} ${lang === "km" ? c.km : c.en}`,
    g.sample ? t("copySampleNote") : null,
    "",
    t("copyFooter"),
  ].filter((x) => x !== null);
  const summary = lines.join("\n");
  const done = () => toast(t("copyDetailsOk"));
  const fail = () => toast(t("copyDetailsFail"));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(summary).then(done).catch(fail);
  } else {
    try {
      const ta = document.createElement("textarea");
      ta.value = summary;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) done();
      else fail();
    } catch (_) {
      fail();
    }
  }
}

function renderDetail(id) {
  const g = allGigs().find((x) => x.id === id);
  const root = $("#detail-root");
  if (!root) return;
  if (!g) {
    root.innerHTML = `<p class="muted">${t("detailNotFound")}</p>`;
    return;
  }
  // Phase A posts store ONE allowlisted contact_url; legacy / seed rows store handle fields.
  const own = ContactLinks.isAllowed(g.contact_url) ? g.contact_url : null;
  const ownKind = own ? ContactLinks.kindOf(own) : null;
  const tgUrl = ownKind === "tg" ? own : ContactLinks.telegram(g.telegram);
  const waUrl = ownKind === "wa" ? own : ContactLinks.whatsapp(g.whatsapp);
  const telUrl = ownKind === "tel" ? own : ContactLinks.tel(g.phone);

  const chips = [
    `<span class="chip ${g.type}">${g.type === "need" ? t("needChip") : t("offerChip")}</span>`,
    `<span class="chip cat">${catLabel(g.category)}</span>`,
    g.sample ? `<span class="chip sample">${t("sampleChip")}</span>` : "",
  ].join(" ");

  const contactBtns = [];
  if (tgUrl) contactBtns.push(`<button type="button" class="btn btn-tg" data-ext="Telegram" data-url="${escapeHtml(tgUrl)}">${t("openTg")}</button>`);
  if (waUrl) contactBtns.push(`<button type="button" class="btn btn-wa" data-ext="WhatsApp" data-url="${escapeHtml(waUrl)}">${t("openWa")}</button>`);
  if (telUrl) contactBtns.push(`<button type="button" class="btn btn-call" data-ext="Phone" data-url="${escapeHtml(telUrl)}">${t("call")}</button>`);
  const alt = altTitleOf(g);

  let khqr = "";
  // Only render http(s) URLs — never javascript:/data: from user-entered fields.
  if (g.khqr_image_url && /^https?:\/\//i.test(String(g.khqr_image_url).trim())) {
    const url = escapeHtml(g.khqr_image_url);
    khqr = `<div class="khqr-box">
      <div class="small muted">${t("showKhqr")}</div>
      <img src="${url}" alt="KHQR" loading="lazy" onerror="this.style.display='none'" />
      <div style="margin-top:8px"><a href="${url}" target="_blank" rel="noopener">${url}</a></div>
    </div>`;
  }

  const starred = isSaved(g.id);
  root.innerHTML = `
    <button type="button" class="back-link" id="btn-back-detail">${t("back")}</button>
    <div class="card">
      <div class="detail-top-row">
        <div>${chips}</div>
        <button type="button" class="star-btn detail-star${starred ? " on" : ""}" id="btn-star-detail" aria-pressed="${starred ? "true" : "false"}" aria-label="${starred ? t("ariaUnstar") : t("ariaStar")}">${starred ? "★" : "☆"} <span class="star-label">${starred ? t("starUnsave") : t("starSave")}</span></button>
      </div>
      <div class="headline detail-headline">${g.rate_text ? `<span class="pay">${escapeHtml(g.rate_text)}</span>` : `<span class="pay pay-ask">${t("payAsk")}</span>`}<span class="khan">📍 ${escapeHtml(g.khan || "—")}</span></div>
      <h2 class="detail-title" lang="${titleLangOf(g)}">${escapeHtml(titleOf(g))}</h2>
      ${alt ? `<p class="alt-title" lang="${alt.lang}">${escapeHtml(alt.text)}</p>` : ""}
      ${g.when_text ? `<p class="detail-when">🕒 ${escapeHtml(g.when_text)}</p>` : ""}
      <p class="detail-desc">${escapeHtml(g.description || "")}</p>
      <div class="safety">${t("safetyBlurb")}</div>
      <div class="safety ok">${t("safetyAge")}</div>
      <div class="detail-actions">
        <button type="button" class="btn btn-secondary" id="btn-copy-details" aria-label="${t("ariaCopyDetails")}">${t("copyDetails")}</button>
        <button type="button" class="btn btn-ghost hide-gig-btn" id="btn-hide-gig" aria-label="${t("ariaHideGig")}">${t("hideGig")}</button>
        ${g.shared && feedConfig.REPORT_URL ? `<button type="button" class="btn btn-ghost" id="btn-report-shared">${t("reportPost")}</button>` : ""}
      </div>
      <p class="muted small hide-gig-hint">${t("hideGigHint")}</p>
      <h3 class="contact-head">${t("contact")}</h3>
      <div class="btn-row">${contactBtns.length ? contactBtns.join("") : `<p class="muted small">${t("noContact")}</p>`}</div>
      ${khqr}
      ${g.sample ? `<p class="muted small" style="margin-top:12px">${t("sampleWarn")}</p>` : ""}
    </div>
    ${ReservedSlots.html("detail")}
    ${contactBtns.length ? `<div class="contact-bar" id="contact-bar" role="group" aria-label="${escapeHtml(t("contactBar"))}">${contactBtns.join("")}</div>` : ""}
  `;
  $("#btn-back-detail").addEventListener("click", closeDetail);
  const starBtn = $("#btn-star-detail");
  if (starBtn) {
    starBtn.addEventListener("click", () => {
      toggleStar(g.id);
      renderDetail(g.id);
      renderFeed();
    });
  }
  const copyBtn = $("#btn-copy-details");
  if (copyBtn) copyBtn.addEventListener("click", () => copyGigSummary(g));
  const reportBtn = $("#btn-report-shared");
  if (reportBtn) reportBtn.addEventListener("click", () => reportSharedPost(g));
  const hideBtn = $("#btn-hide-gig");
  if (hideBtn) {
    hideBtn.addEventListener("click", () => {
      hideGigOnDevice(g.id);
      closeDetail();
      renderFeed();
    });
  }
  root.querySelectorAll("[data-ext]").forEach((btn) => {
    btn.addEventListener("click", () => confirmExternal(btn.dataset.ext, btn.dataset.url));
  });
}

function switchMainTab(name) {
  $$(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${name}`));
  $$(".tab-bar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  if (name === "browse") {
    closeDetail();
    renderFeed();
  }
  if (name === "mine") renderMine();
  if (name === "safety") renderHiddenMgmt();
  if (name === "post") wizardRender();
  // New panel starts at the top (otherwise the sticky header can cover the first field).
  try { window.scrollTo({ top: 0 }); } catch (_) {}
}

function setFeedType(type) {
  feedType = type;
  $$("[data-feed]").forEach((b) => {
    const ft = b.dataset.feed;
    b.classList.toggle("active-need", ft === "need" && type === "need");
    b.classList.toggle("active-offer", ft === "offer" && type === "offer");
    b.classList.toggle("active-saved", ft === "saved" && type === "saved");
    b.setAttribute("aria-pressed", ft === type ? "true" : "false");
  });
  renderFeed();
}

function uid() {
  return "local_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

function validateTelegram(raw) { return FormValidators.telegram(raw); }
function validatePhoneish(raw, required) { return FormValidators.phoneish(raw, required); }

function setSubmitBusy(form, busy) {
  formBusy = busy;
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  btn.disabled = !!busy;
  if (busy) {
    btn.dataset.label = btn.textContent;
    btn.textContent = t("submitting");
  } else if (btn.dataset.label) {
    btn.textContent = btn.dataset.label;
    delete btn.dataset.label;
  }
}

/* ---- Phase A: 4-step post wizard (need/offer → what+where → contact → check & post) ---- */
function wizardCollect() {
  const typeEl = document.querySelector('input[name="post-type"]:checked');
  const catEl = document.querySelector('input[name="post-cat"]:checked');
  const val = (sel) => { const el = $(sel); return el ? el.value : ""; };
  return {
    type: typeEl ? typeEl.value : "",
    category: catEl ? catEl.value : "",
    title: val("#post-title").trim(),
    rate: val("#post-rate").trim(),
    when: val("#post-when").trim(),
    desc: val("#post-desc").trim(),
    khan: val("#post-khan"),
    contact: val("#post-contact"),
  };
}

const WIZ_ERR_FIELD = {
  requiredType: 'input[name="post-type"]', requiredCat: 'input[name="post-cat"]', requiredWhat: "#post-title",
  requiredKhan: "#post-khan", contactRequired: "#post-contact", contactInvalid: "#post-contact",
};
function wizardError(key) {
  const el = $("#wiz-error");
  if (el) el.textContent = key ? t(key) : "";
  if (!key) return;
  // Inline error (role=alert) is announced; no duplicate toast. Contact preview stays neutral.
  if (key.startsWith("contact")) renderContactPreview();
  const field = WIZ_ERR_FIELD[key] && document.querySelector(WIZ_ERR_FIELD[key]);
  if (field) {
    field.focus({ preventScroll: true });
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try { field.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); } catch (_) {}
  }
}

function wizardRender() {
  const form = $("#form-post");
  if (!form) return;
  const step = wizard.step;
  form.querySelectorAll(".wiz-step").forEach((fs) => {
    fs.classList.toggle("hidden", Number(fs.dataset.step) !== step);
  });
  const prog = $("#wiz-progress");
  if (prog) prog.textContent = tf("wizStepOf", { n: step });
  form.querySelectorAll(".wiz-dot").forEach((d) => {
    const n = Number(d.dataset.dot);
    d.classList.toggle("on", n <= step);
    d.classList.toggle("current", n === step);
  });
  const back = $("#wiz-back");
  if (back) back.classList.toggle("invisible", step === 1);
  const next = $("#wiz-next");
  const submit = $("#wiz-submit");
  if (next) next.classList.toggle("hidden", step === 4);
  if (submit) submit.classList.toggle("hidden", step !== 4);
  const d = wizardCollect();
  const title = $("#post-title");
  if (title) title.placeholder = t(d.type === "offer" ? "phWhatOffer" : "phWhatNeed");
  const remembered = $("#khan-remembered");
  if (remembered) remembered.classList.toggle("hidden", !(lastKhan() && d.khan === lastKhan()));
  renderContactPreview();
  if (step === 4) renderReview();
}

function renderContactPreview() {
  const out = $("#contact-preview");
  const input = $("#post-contact");
  if (!out || !input) return;
  if (!input.value.trim()) {
    out.textContent = "";
    out.className = "contact-preview";
    return;
  }
  // Live preview only confirms a good link; the clear rejection message shows on Next (#wiz-error).
  const c = ContactLinks.normalize(input.value);
  out.className = "contact-preview" + (c.ok ? " ok" : "");
  out.textContent = c.ok ? tf("contactWillOpen", { url: c.url }) : "";
}

/** Build the gig object from the wizard (contact_url is ALWAYS an allowlisted URL or we don't build). */
function wizardGig() {
  const d = wizardCollect();
  const c = ContactLinks.normalize(d.contact);
  if (!c.ok || !ContactLinks.isAllowed(c.url)) return null;
  const titles = PhaseA.titleFields(d.title);
  const typed = [d.title, d.desc, d.when, d.rate].join(" ");
  return {
    type: d.type === "offer" ? "offer" : "need",
    category: d.category,
    ...titles,
    description: d.desc,
    khan: d.khan,
    when_text: d.when,
    rate_text: d.rate,
    contact_url: c.url,
    telegram: "",
    whatsapp: "",
    phone: "",
    khqr_image_url: "",
    language: PhaseA.hasKhmer(typed) ? (/[A-Za-z]{3,}/.test(typed) ? "both" : "km") : "en",
    status: "live",
    sample: false,
  };
}

function renderReview() {
  const root = $("#wiz-review");
  if (!root) return;
  const g = wizardGig();
  if (!g) { root.innerHTML = ""; return; }
  const kindLabel = { tg: "Telegram", wa: "WhatsApp", tel: t("call") }[ContactLinks.kindOf(g.contact_url)] || "";
  root.innerHTML = `${cardHtml({ ...g, id: "preview", created_at: new Date().toISOString() }, { preview: true })}
    <p class="review-contact"><strong>${escapeHtml(kindLabel)}</strong> · <span class="mono">${escapeHtml(g.contact_url)}</span></p>
    ${g.description ? `<p class="review-desc">${escapeHtml(g.description)}</p>` : ""}`;
}

function wizardGo(step) {
  wizard.step = Math.min(4, Math.max(1, step));
  wizardError("");
  wizardRender();
  const fs = document.querySelector(`.wiz-step[data-step="${wizard.step}"]`);
  const focusEl = fs && fs.querySelector("input:not([type=hidden]), select, textarea, button");
  if (focusEl && wizard.step !== 4) focusEl.focus({ preventScroll: true });
  else if (wizard.step === 4) { const sub = $("#wiz-submit"); if (sub) sub.focus({ preventScroll: true }); }
}

function wizardNext() {
  const d = wizardCollect();
  const chk = PhaseA.checkStep(wizard.step, d, ContactLinks.normalize);
  if (!chk.ok) return wizardError(chk.err);
  if (wizard.step === 3) {
    // Check prohibited content before showing the review (and again on submit).
    const guard = ContentGuard.check(d.title, d.desc, d.when, d.rate, d.contact);
    if (!guard.ok) return showGuardBlock();
  }
  wizardGo(wizard.step + 1);
}

function openWizard(type) {
  const radio = document.querySelector(`input[name="post-type"][value="${type === "offer" ? "offer" : "need"}"]`);
  if (radio) radio.checked = true;
  wizard.step = 1;
  switchMainTab("post");
  wizardGo(type ? 2 : 1);
}

function resetWizard() {
  const form = $("#form-post");
  if (form) form.reset();
  fillSelects();
  wizard.step = 1;
  wizardRender();
}

async function handlePostGig(e) {
  if (e) e.preventDefault();
  if (formBusy) return;
  // Enter key on steps 1–3 = Next, never a premature post.
  if (wizard.step < 4) return wizardNext();
  const form = $("#form-post");
  const d = wizardCollect();
  for (const step of [1, 2, 3]) {
    const chk = PhaseA.checkStep(step, d, ContactLinks.normalize);
    if (!chk.ok) { wizardGo(step); return wizardError(chk.err); }
  }
  const contact = ContactLinks.normalize(d.contact);
  if (!contact.ok || !ContactLinks.isAllowed(contact.url)) { wizardGo(3); return wizardError("contactInvalid"); }
  const guard = ContentGuard.check(d.title, d.desc, d.when, d.rate, d.contact);
  if (!guard.ok) return showGuardBlock();

  setSubmitBusy(form, true);
  try {
    const gig = { ...wizardGig(), id: uid(), created_at: new Date().toISOString(), created_by: deviceId() };
    const list = getLocalPosts();
    list.unshift(gig);
    if (!saveLocalPosts(list)) return toast(t("saveFailed"));
    lsSet(LS_LAST_KHAN, gig.khan);
    justPostedId = gig.id;
    justPostedAt = Date.now();
    setTimeout(() => {
      if (justPostedId !== gig.id) return;
      justPostedId = null;
      $(".gig-card.just-posted").forEach((el) => {
        el.classList.remove("just-posted");
        const chip = el.querySelector(".chip.just");
        if (chip) chip.remove();
      });
    }, PhaseA.JUST_POSTED_MS);
    setSubmitBusy(form, false);
    resetWizard();
    toast(t("postedOk"));
    selectedId = null;
    feedType = gig.type;
    filters = { category: "", khan: "", language: "" };
    ["#filter-cat", "#filter-khan", "#filter-lang"].forEach((sel) => { const el = $(sel); if (el) el.value = ""; });
    switchMainTab("browse");
    setFeedType(gig.type);
    window.scrollTo({ top: 0 });
    // Shared-board submit is opt-in and OFF unless SUBMIT_EMAIL or SUBMIT_TELEGRAM_BOT is set.
    if (SharedSheetFeed.canPost(feedConfig)) offerSendToSharedBoard(gig);
  } finally {
    if (formBusy) setSubmitBusy(form, false);
  }
}

function bindWizard() {
  const form = $("#form-post");
  if (!form) return;
  form.addEventListener("submit", handlePostGig);
  const next = $("#wiz-next");
  if (next) next.addEventListener("click", wizardNext);
  const back = $("#wiz-back");
  if (back) back.addEventListener("click", () => wizardGo(wizard.step - 1));
  form.querySelectorAll('input[name="post-type"]').forEach((r) =>
    r.addEventListener("change", () => { wizardRender(); })
  );
  const contact = $("#post-contact");
  if (contact) contact.addEventListener("input", renderContactPreview);
  const khan = $("#post-khan");
  if (khan) khan.addEventListener("change", wizardRender);
}


function renderMine() {
  const root = $("#mine-list");
  if (!root) return;
  const mine = getLocalPosts().filter((g) => g.created_by === deviceId());
  if (!mine.length) {
    root.innerHTML = `<div class="state-box">
      <div class="ico" aria-hidden="true">📋</div>
      <div class="title">${t("mineEmpty")}</div>
      <p class="mine-empty-hint">${t("mineEmptyHint")}</p>
      <button type="button" class="btn btn-primary" id="mine-cta" style="max-width:240px;margin:12px auto 0">${t("postFirstGig")}</button>
    </div>`;
    const cta = $("#mine-cta");
    if (cta) cta.addEventListener("click", () => openWizard("need"));
    renderProgress();
    return;
  }
  root.innerHTML = mine
    .map((g) => {
      const statusChip = g.status === "filled"
        ? `<span class="chip sample">${t("filled")}</span>`
        : `<span class="chip ${g.type}">${g.type === "need" ? t("needChip") : t("offerChip")}</span>`;
      const toggleLabel = g.status === "filled" ? t("restore") : t("markFilled");
      return `<div class="card my-item">
        <div class="left">
          <div>${statusChip} <span class="chip">${catLabel(g.category)}</span></div>
          <h3 style="font-size:0.95rem;margin:6px 0">${escapeHtml(titleOf(g))}</h3>
          <div class="muted small">${escapeHtml(g.khan)} · ${escapeHtml(g.rate_text || "")} · ${timeAgo(g.created_at)}</div>
        </div>
        <div class="my-actions">
          <button type="button" class="btn btn-secondary" style="margin:0;padding:10px 12px;font-size:0.78rem;width:auto;min-height:40px" data-copy-mine="${g.id}" aria-label="${t("ariaCopyMyPost")}: ${escapeHtml(titleOf(g))}">${t("copyMyPost")}</button>
          <button type="button" class="btn btn-secondary" style="margin:0;padding:10px 12px;font-size:0.78rem;width:auto;min-height:40px" data-toggle="${g.id}" aria-label="${t("ariaMarkFilled")}: ${escapeHtml(titleOf(g))}">${toggleLabel}</button>
          <button type="button" class="btn-danger" data-del="${g.id}" aria-label="${t("ariaDeletePost")}: ${escapeHtml(titleOf(g))}">${t("delete")}</button>
        </div>
      </div>`;
    })
    .join("");

  root.querySelectorAll("[data-copy-mine]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = getLocalPosts().find((x) => x.id === btn.dataset.copyMine);
      if (g) copyGigSummary(g);
    });
  });
  root.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = getLocalPosts();
      const g = list.find((x) => x.id === btn.dataset.toggle);
      if (!g) return;
      g.status = g.status === "filled" ? "live" : "filled";
      saveLocalPosts(list);
      renderMine();
      renderFeed();
    });
  });
  renderProgress();
  root.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => confirmDeletePost(btn.dataset.del));
  });
}

function updateOfflineBanner() {
  const banner = $("#offline-banner");
  if (!banner) return;
  const netOffline = !navigator.onLine;
  const fetchFail = seedLoadState === "error";
  const offline = netOffline || fetchFail;
  if (!offline) offlineDismissed = false;
  const show = offline && !offlineDismissed;
  banner.classList.toggle("show", show);
  const msg = netOffline ? t("offlineBanner") : t("offlineFetchFail");
  const retryBtn = (!netOffline && fetchFail)
    ? `<button type="button" class="offline-dismiss" id="btn-offline-retry">${t("offlineRetry")}</button>`
    : "";
  banner.innerHTML = `<span class="offline-banner-text">${msg}</span>
    ${retryBtn}
    <button type="button" class="offline-dismiss" id="btn-offline-dismiss" aria-label="${t("ariaOfflineDismiss")}">${t("offlineDismiss")}</button>`;
  const btn = $("#btn-offline-dismiss");
  if (btn) {
    btn.addEventListener("click", () => {
      offlineDismissed = true;
      banner.classList.remove("show");
    });
  }
  const retry = $("#btn-offline-retry");
  if (retry) retry.addEventListener("click", () => { offlineDismissed = false; loadSeed(); });
}

async function loadSeed() {
  seedLoadState = "loading";
  renderFeed();
  try {
    const res = await fetch("data/gigs.json", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    seedGigs = (data.gigs || []).map((g) => ({ ...g, sample: g.sample !== false }));
    seedLoadState = "ok";
  } catch (err) {
    console.warn("Seed load failed", err);
    seedLoadState = "error";
    // try cache via SW will still populate if available on next SW match —
    // keep whatever seedGigs we have
    toast(t("loadError"));
  }
  updateOfflineBanner();
  renderFeed();
}

function bind() {
  $$(".lang-toggle button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );
  $$(".tab-bar button").forEach((b) =>
    b.addEventListener("click", () => switchMainTab(b.dataset.tab))
  );
  $$("[data-feed]").forEach((b) =>
    b.addEventListener("click", () => setFeedType(b.dataset.feed))
  );
  $("#filter-cat").addEventListener("change", (e) => {
    filters.category = e.target.value;
    renderFeed();
  });
  $("#filter-khan").addEventListener("change", (e) => {
    filters.khan = e.target.value;
    renderFeed();
  });
  $("#filter-lang").addEventListener("change", (e) => {
    filters.language = e.target.value;
    renderFeed();
  });
  const demoBtn = $("#btn-toggle-demo");
  if (demoBtn) demoBtn.addEventListener("click", () => setHideDemo(!hideDemo));
  const exportBtn = $("#btn-export-posts");
  if (exportBtn) exportBtn.addEventListener("click", exportMyPosts);
  const clearHiddenBtn = $("#btn-clear-hidden");
  if (clearHiddenBtn) clearHiddenBtn.addEventListener("click", clearHiddenGigs);
  const dismissFirst = $("#btn-first-open-dismiss");
  if (dismissFirst) dismissFirst.addEventListener("click", dismissFirstOpen);
  bindWizard();

  window.addEventListener("online", () => {
    offlineDismissed = false;
    updateOfflineBanner();
    toast(t("onlineBanner"));
    loadSeed();
    loadSharedFeed({ quiet: true });
  });
  window.addEventListener("offline", () => {
    offlineDismissed = false;
    updateOfflineBanner();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("#modal-root") && $("#modal-root").innerHTML.trim()) return;
    if (!TermsGate.isAccepted()) return;
    if (selectedId) closeDetail();
  });
}

/* PHASE_B_RUNTIME_START */
function renderSharedFeedStatus() {
  const el = $("#shared-feed-status");
  if (!el) return;
  if (!sharedFeedEnabled()) {
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }
  el.classList.remove("hidden");
  if (sharedFeedState === "loading") {
    el.textContent = t("sharedFeedLoading");
    return;
  }
  if (sharedFeedState === "error") {
    el.innerHTML = `${escapeHtml(t("sharedFeedError"))} <button type="button" class="link-btn" id="btn-shared-retry">${escapeHtml(t("sharedFeedRetry"))}</button>`;
    const r = $("#btn-shared-retry");
    if (r) r.addEventListener("click", () => loadSharedFeed({ quiet: false }));
    return;
  }
  const when = sharedFeedFetchedAt ? timeAgo(sharedFeedFetchedAt) : "—";
  if (sharedFeedState === "offline") {
    el.textContent = tf("sharedFeedOffline", { when });
    return;
  }
  el.textContent = tf("sharedFeedLine", { when });
}

async function loadFeedConfig() {
  try {
    const res = await fetch("data/feed-config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("config fetch failed");
    const raw = await res.json();
    feedConfig = SharedSheetFeed.normalizeConfig(raw);
    SafeStorage.setJSON(LS_FEED_CONFIG, feedConfig);
  } catch (err) {
    console.warn("feed-config load failed", err);
    const cached = SafeStorage.getJSON(LS_FEED_CONFIG, null);
    feedConfig = SharedSheetFeed.normalizeConfig(cached || SharedSheetFeed.emptyConfig());
  }
}

async function loadSharedFeed(opts = {}) {
  const quiet = !!opts.quiet;
  if (!sharedFeedEnabled()) {
    sharedGigs = [];
    sharedFeedState = "empty-config";
    renderSharedFeedStatus();
    renderFeed();
    return;
  }
  sharedFeedState = "loading";
  renderSharedFeedStatus();
  if (!quiet) renderFeed();
  try {
    const res = await fetch(SharedSheetFeed.cacheBust(feedConfig.FEED_JSON_URL), { cache: "no-store" });
    if (!res.ok) throw new Error("feed.json fetch failed");
    const text = await res.text();
    if (text.length > SharedSheetFeed.MAX_CHARS) throw new Error("feed too large");
    const doc = JSON.parse(text);
    const out = SharedSheetFeed.normalizeFeedDocument(doc, { feedMode: feedConfig.FEED_MODE });
    sharedGigs = out.gigs;
    sharedFeedFetchedAt = out.updated_at || new Date().toISOString();
    sharedFeedState = "ok";
    SafeStorage.setJSON(LS_SHARED_FEED, {
      fetched_at: sharedFeedFetchedAt,
      updated_at: out.updated_at,
      gigs: sharedGigs,
      mode: feedConfig.FEED_MODE,
    });
  } catch (err) {
    console.warn("shared feed load failed", err);
    const cache = SafeStorage.getJSON(LS_SHARED_FEED, null);
    if (cache && Array.isArray(cache.gigs) && cache.gigs.length) {
      sharedGigs = cache.gigs;
      sharedFeedFetchedAt = cache.updated_at || cache.fetched_at || null;
      sharedFeedState = navigator.onLine ? "error" : "offline";
    } else {
      sharedGigs = [];
      sharedFeedState = "error";
      if (!quiet) toast(t("sharedFeedError"));
    }
  }
  renderSharedFeedStatus();
  renderFeed();
}

function reportSharedPost(g) {
  const url = String(feedConfig.REPORT_URL || "").trim();
  if (!url || !g) return;
  const id = String(g.id || "");
  const done = () => {
    toast(t("reportCopied"));
    const root = openModal(`<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div class="modal">
        <h3 id="report-title">${t("reportConfirmTitle")}</h3>
        <p>${t("reportConfirmBody")}</p>
        <div class="btn-row">
          <button type="button" class="btn btn-secondary" id="modal-cancel" style="margin:0">${t("confirmCancel")}</button>
          <button type="button" class="btn btn-primary" id="modal-ok" style="margin:0">${t("confirmContinue")}</button>
        </div>
      </div>
    </div>`);
    if (!root) return;
    $("#modal-cancel").addEventListener("click", dismissModal);
    $("#modal-ok").addEventListener("click", () => {
      dismissModal();
      window.open(url, "_blank", "noopener");
    });
  };
  const payload = "Local Gigs PP report post_id=" + id;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(payload).then(done).catch(done);
  } else done();
}
/* PHASE_B_RUNTIME_END */

async function init() {
  deviceId();
  bind();
  applyI18n();
  renderFirstOpen();
  setFeedType("need");
  switchMainTab("browse");
  await loadFeedConfig();
  await loadSeed();
  await loadSharedFeed({ quiet: true });
}

init();
