// Offline-Betrieb: App-Dateien werden auf dem Gerät zwischengespeichert.
// Nutzerdaten liegen im Browser-Speicher (localStorage) und werden nie an den Server geschickt.
const VERSION = "ik-v32";
const CORE = ["./", "index.html", "app.js", "logic.js", "videos.js", "inhalte.js", "manifest.webmanifest", "fonts/inter.woff", "fonts/instrument-serif-italic.woff", "fonts/geist-mono.woff",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon.png",
  "reminders/abend-20.ics", "reminders/abend-21.ics", "reminders/abend-22.ics"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== "ik-meta").map(k => caches.delete(k))))
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

// Erinnerung an den Check-in. Der Service Worker kennt nur Uhrzeit und letzten Check-in-Tag (ik-meta), keine Gesundheitsdaten.
const day = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
async function remind(){
  const c = await caches.open("ik-meta"), r = await c.match("meta"); if (!r) return;
  const m = await r.json(), now = new Date(), today = day(now);
  if (!m.on || !m.time || m.last === today || m.shown === today) return;
  const [h, mi] = m.time.split(":").map(Number); if (now.getHours()*60+now.getMinutes() < h*60+mi) return;
  await self.registration.showNotification("innen kultur", {body:"Zeit für deinen Abend-Check-in. Dauert 1 Minute.", tag:"checkin", icon:"icons/icon-192.png", badge:"icons/favicon.png", data:{url:"./#checkin"}});
  m.shown = today; await c.put("meta", new Response(JSON.stringify(m)));
}
self.addEventListener("periodicsync", e => { if (e.tag === "ik-reminder") e.waitUntil(remind()); });
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window", includeUncontrolled:true}).then(list => {
    for (const w of list) { if ("focus" in w) { w.navigate && w.navigate("./#checkin"); return w.focus(); } }
    return self.clients.openWindow("./#checkin");
  }));
});
