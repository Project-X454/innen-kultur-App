/* Erzeugt die Download-PDFs (Ordner pdf/) direkt aus den Druckvorlagen der App.
   Ausführen im Projektordner:  node tools/pdf-export.js
   Braucht Playwright mit Chromium. Persönliche Angaben bleiben leer (Linien zum Ausfüllen). */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const FILES = {  // Vorlage → Dateiname
  handout1: "innen-kultur-handout-woche-1.pdf",
  pflanzen: "innen-kultur-pflanzen-teller.pdf",
  morgen:   "innen-kultur-morgen-karte.pdf",
  abend:    "innen-kultur-abend-karte.pdf",
  aktiv:    "innen-kultur-aktivitaets-karte.pdf",
  ferment:  "innen-kultur-fermentiert-karte.pdf"
};
const TYPES = {".js":"text/javascript", ".html":"text/html", ".css":"text/css", ".woff":"font/woff", ".png":"image/png", ".svg":"image/svg+xml", ".json":"application/json"};
const srv = http.createServer((q, r) => {
  let p = path.join(root, decodeURIComponent(q.url.split("?")[0])); if (p.endsWith("/")) p += "index.html";
  fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, {"Content-Type": TYPES[path.extname(p)] || "application/octet-stream"}); r.end(d); });
}).listen(0, async () => {
  const port = srv.address().port, b = await chromium.launch();
  const ctx = await b.newContext({ serviceWorkers: "block" }), pg = await ctx.newPage();
  await pg.addInitScript(() => { const t = new Date().toISOString();
    localStorage.setItem("ik-app-v2", JSON.stringify({ v:2, code:"PDF", product:"basis", onboardingCompletedAt:t, consentHealthDataAt:t, tourDoneAt:t, dailyCheckDay:"9999-12-31",
      baselines:[{createdAt:t}], goals:[], reminderTime:null, bedTime:null })); });
  await pg.goto(`http://localhost:${port}/`); await pg.waitForFunction(() => window.ikPrintHTML);
  await pg.emulateMedia({ media: "print" });
  fs.mkdirSync(path.join(root, "pdf"), { recursive: true });
  for (const [k, file] of Object.entries(FILES)) {
    await pg.evaluate(k => { const el = document.getElementById("print"); el.innerHTML = window.ikPrintHTML(k); el.className = k === "handout1" ? "a4" : ""; }, k);
    await pg.evaluate(() => document.fonts.ready);
    await pg.pdf({ path: path.join(root, "pdf", file), printBackground: true, preferCSSPageSize: true });
    console.log("pdf/" + file);
  }
  await b.close(); srv.close();
});
