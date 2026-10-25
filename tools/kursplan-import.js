#!/usr/bin/env node
/* innen kultur · Kursplan-Import
   Liest den CSV-Export des Kursplan-Boards und schreibt daraus videos.js neu.

   Ablauf:
   1. Im Kursplan-Board auf „Als CSV exportieren“ klicken.
   2. Die Datei als data/kursplan.csv in dieses Repository legen (alte Datei ersetzen).
   3. Im Repository-Ordner ausführen:  node tools/kursplan-import.js
   4. Danach:  node --test   (prüft u. a., ob alle Bausteine ihr Video finden)

   Die Nummer (Spalte „Nr“, z. B. 2.1) wird zur Video-ID. Bausteine in logic.js hängen an diesen IDs.
   Verschiebt man im Board ein Video, das einen Baustein freischaltet, warnt das Skript. */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, process.argv[2] || "data/kursplan.csv");
const OUT = path.join(ROOT, "videos.js");

// 30-Sekunden-Aufgaben am Videoende (SPEC §4 machJetzt). Schlüssel = Videotitel aus dem Board.
const MACH_JETZT = {
  "Die Abendroutine Schritt für Schritt": "Stell dir eine Erinnerung 30 Minuten vor deiner Schlafenszeit. Ab dann bleibt das Handy weg.",
  "Fermentiertes & Probiotika: die Studienlage": "Schau in deinen Kühlschrank: Was davon ist fermentiert? Schreib dir eine Sache auf die Einkaufsliste."
};

const PILLAR = {"Intro & Rahmen":"intro", "Ernährung & Darm":"darm", "Schlaf":"schlaf", "Bewegung":"beweg", "Recap · Healthspan":"recap"};
const TYPES = ["Intro","Kern","Praxis","Mitmach","Vertiefung","Pflicht"];

function parseCsv(text){
  text = text.replace(/^﻿/, "");
  const rows = []; let row = [], cur = "", q = false;
  for(let i = 0; i < text.length; i++){
    const c = text[i];
    if(q){
      if(c === '"'){ if(text[i+1] === '"'){ cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if(c === '"') q = true;
    else if(c === ";"){ row.push(cur); cur = ""; }
    else if(c === "\n"){ row.push(cur.replace(/\r$/, "")); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if(cur !== "" || row.length){ row.push(cur.replace(/\r$/, "")); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ""));
}

function fail(msg){ console.error("Fehler: " + msg); process.exit(1); }

if(!fs.existsSync(SRC)) fail(`Datei nicht gefunden: ${path.relative(ROOT, SRC)}`);
const [head, ...lines] = parseCsv(fs.readFileSync(SRC, "utf8"));
const col = name => { const i = head.indexOf(name); if(i < 0) fail(`Spalte „${name}“ fehlt in der CSV`); return i; };
const C = {woche:col("Woche"), wname:col("Wochenname"), nr:col("Nr"), saeule:col("Säule"), typ:col("Typ"), titel:col("Titel"),
  dauer:col("Dauer (Min)"), quelle:col("Quelle"), tracker:col("Tracker-Freischaltung"), notiz:col("Notiz")};

const weeks = {}, videos = [], ids = new Set(), warn = [];
lines.forEach((r, n) => {
  const w = r[C.woche].trim(), line = n + 2;
  let week;
  if(/^Woche \d+$/.test(w)) week = Number(w.slice(6));
  else if(w === "Club") week = "club";
  else return; // Ideen-Pool kommt nicht in die App
  const id = r[C.nr].trim(), pillar = PILLAR[r[C.saeule].trim()], type = r[C.typ].trim();
  if(!id) fail(`Zeile ${line}: Nummer fehlt`);
  if(ids.has(id)) fail(`Zeile ${line}: Nummer ${id} doppelt`);
  if(!pillar) fail(`Zeile ${line}: unbekannte Säule „${r[C.saeule]}“`);
  if(!TYPES.includes(type)) fail(`Zeile ${line}: unbekannter Typ „${type}“`);
  ids.add(id);
  if(typeof week === "number" && !weeks[week]) weeks[week] = {title: r[C.wname].trim()};
  const title = r[C.titel].trim();
  videos.push({id, week, pillar, type, title, durationMin: Number(r[C.dauer]) || 0,
    machJetzt: MACH_JETZT[title] || null, tracker: r[C.tracker].trim() || null,
    source: r[C.quelle].trim() || null, note: r[C.notiz].trim() || null});
});

// Bausteine prüfen: Jedes freischaltende Video muss existieren und im Board einen Tracker-Eintrag haben.
const {BAUSTEINE} = require(path.join(ROOT, "logic.js"));
BAUSTEINE.forEach(b => {
  const v = videos.find(x => x.id === b.videoId);
  if(!v) warn.push(`Baustein „${b.label}“: Video ${b.videoId} gibt es nicht mehr. videoId in logic.js anpassen.`);
  else if(!v.tracker) warn.push(`Baustein „${b.label}“: Video ${b.videoId} („${v.title}“) hat im Board keinen Tracker-Eintrag. Wurde verschoben?`);
});
Object.keys(MACH_JETZT).forEach(t => { if(!videos.find(v => v.title === t)) warn.push(`Mach-jetzt-Text für „${t}“ findet kein Video (Titel geändert?).`); });

const js = (v) => JSON.stringify(v);
const body = `/* innen kultur · Videoliste
   AUTOMATISCH ERZEUGT aus ${path.relative(ROOT, SRC)} mit: node tools/kursplan-import.js
   Nicht von Hand bearbeiten: Änderungen im Kursplan-Board machen, als CSV exportieren, Import erneut ausführen.
   Felder wie SPEC §4 „Video“, dazu tracker (Hinweis aus dem Board), source (ClickUp-Nr. oder „neu“) und note.
   url bleibt leer, bis Kurs-Plattform und Player feststehen (SPEC §10). */
(function(root){
"use strict";
const WEEKS = {
${Object.keys(weeks).sort((a,b)=>a-b).map(k=>`  ${k}:{title:${js(weeks[k].title)}}`).join(",\n")}
};
// [id, Woche, Säule, Typ, Titel, Minuten, machJetzt, tracker, source, note]
const ROWS = [
${videos.map(v=>"  "+js([v.id,v.week,v.pillar,v.type,v.title,v.durationMin,v.machJetzt,v.tracker,v.source,v.note])).join(",\n")}
];
const VIDEOS = ROWS.map(([id,week,pillar,type,title,durationMin,machJetzt,tracker,source,note],i)=>({id,week,pillar,type,title,durationMin,order:i,machJetzt:machJetzt||null,tracker:tracker||null,source:source||null,note:note||null,url:null}));
const api = {WEEKS, VIDEOS};
if(typeof module!=="undefined" && module.exports) module.exports = api; else root.IK_VIDEOS = api;
})(typeof globalThis!=="undefined" ? globalThis : this);
`;
fs.writeFileSync(OUT, body);
const perWeek = Object.keys(weeks).map(k => `W${k}: ${videos.filter(v=>v.week===Number(k)).length}`).join(" · ");
console.log(`videos.js geschrieben: ${videos.length} Videos (${perWeek}${videos.some(v=>v.week==="club")?" · Club: "+videos.filter(v=>v.week==="club").length:""})`);
if(warn.length){ console.warn("\nBitte prüfen:\n- " + warn.join("\n- ")); process.exitCode = 2; }
