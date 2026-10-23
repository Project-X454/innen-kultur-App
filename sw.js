// Offline-Betrieb: App-Dateien werden auf dem Gerät zwischengespeichert.
// Nutzerdaten liegen im Browser-Speicher (localStorage) und werden nie an den Server geschickt.
const VERSION = "loop-v5";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/logo_l.png", "icons/logo_d.png",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Seite selbst: erst Netz (für Updates), sonst Cache (offline)
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Alles andere (Logos, Schriften, QR-Bibliothek): Cache zuerst, dann Netz
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r && (r.ok || r.type === "opaque")) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
