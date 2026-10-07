/* Local Gigs PP — shell cache v0.14.2 — cyan polish wave */
const CACHE = "gig-agg-v0.14.2-cyan-p";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data/gigs.json",
  "./data/feed-config.json",
  "./data/feed.json",
  "./manifest.webmanifest",
  "./privacy.html",
  "./terms.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("SW skip asset", url, err);
          })
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isFeedOrConfig(url) {
  const p = url.pathname;
  return (
    p.endsWith("/feed-config.json") ||
    p.endsWith("feed-config.json") ||
    p.endsWith("/feed.json") ||
    p.endsWith("feed.json")
  );
}

function isShellPath(url) {
  const p = url.pathname;
  // Do NOT treat ASSETS "./" as matching every path (String.endsWith("") is always true).
  const shellEnds = [
    "/",
    "/index.html",
    "/styles.css",
    "/app.js",
    "/gigs.json",
    "/manifest.webmanifest",
    "/privacy.html",
    "/terms.html",
  ];
  if (shellEnds.some((e) => p.endsWith(e))) return true;
  if (p.includes("/icons/")) return true;
  return false;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Shared feed + config: NETWORK-FIRST always (never stale cache-first).
  if (isFeedOrConfig(url)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (isShellPath(url)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Other same-origin GETs: network-first (do not cache-first unknown paths).
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
