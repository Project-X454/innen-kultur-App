// Tests für das Rechenmodul. Ausführen im Projektordner mit: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const IK = require("../logic.js");

test("Loop-Score: Beispiel aus SPEC §5.7 (Woche 3)", () => {
  const r = IK.loopScoreFromParts({erholt:3.8, energie:3.4, bauch:3.7, stress:3.0, basisPct:68, bausteinePct:75, days:6});
  assert.equal(r.befinden, 62);
  assert.equal(r.umsetzung, 71);
  assert.equal(r.dranbleiben, 86);
  assert.equal(r.score, 69);
});

test("Loop-Score: ohne Bausteine zählt nur der Basis-Score als Umsetzung", () => {
  const r = IK.loopScoreFromParts({erholt:3, energie:3, bauch:3, stress:3, basis:2, days:7});
  assert.equal(r.umsetzung, 50);
  assert.equal(r.befinden, 50);
  assert.equal(r.score, Math.round(0.5*50 + 0.35*50 + 0.15*100));
});

test("Loop-Score aus Check-ins mit daily- und weeklyCount-Bausteinen", () => {
  const b = IK.BAUSTEINE.filter(x => x.id === "ballaststoff" || x.id === "kraft");
  const days = [
    {basis:{bunt:true, morgenlicht:true, bewegt30:true}, bausteine:{ballaststoff:true, kraft:true}, erholt:4, energie:4, bauch:4, stress:2},
    {basis:{bunt:true}, bausteine:{ballaststoff:false}, erholt:3, energie:3, bauch:3, stress:3}
  ];
  const st = IK.weekStats(days, b);
  assert.equal(st.avg.basis, 2);
  assert.deepEqual(st.bausteine.map(x => x.rate), [0.5, 0.5]);
  const r = IK.loopScore(days, b);
  // Umsetzung = 0,6 × 50 (2 von 4 Basis-Routinen) + 0,4 × 50 = 50
  assert.equal(r.umsetzung, 50);
  assert.equal(r.dranbleiben, 29);
});

test("Größter Hebel: niedrigster Wert, bei Gleichstand Darm vor Schlaf vor Bewegung", () => {
  assert.equal(IK.biggestLever({bauch:3, schlaf:2, bewegung:4}), "schlaf");
  assert.equal(IK.biggestLever({bauch:2, schlaf:2, bewegung:2}), "darm");
  assert.equal(IK.biggestLever({bauch:4, schlaf:3, bewegung:1}), "beweg");
});

test("Startpunkt → jetzt: Stress wird zu Entspannt umgerechnet", () => {
  const rows = IK.compareToStart({schlaf:2, energie:3, bauch:3, entspannt:2, bewegung:2},
    {erholt:3.8, energie:3.4, bauch:3.7, stress:3, bewegungMin:24.4});
  const by = Object.fromEntries(rows.map(r => [r.key, r]));
  assert.equal(by.schlaf.diff, 1.8);
  assert.equal(by.entspannt.now, 3);
  assert.equal(by.entspannt.diff, 1);
  assert.equal(by.bewegung.text, "Ø 24 Min. pro Tag");
});

test("Tracker-Woche: 7 Check-ins → awaitingCheck, nächster Check-in startet Woche 2", () => {
  const s = {weeks:[], checkins:[], videoProgress:START()};
  let day = "2026-10-01";
  for (let i = 0; i < 7; i++) { IK.saveCheckIn(s, {basis:{bunt:true}}, day); day = IK.addDays(day, 1); }
  assert.equal(s.weeks.length, 1);
  assert.equal(s.weeks[0].status, "awaitingCheck");
  assert.equal(s.checkins[6].dayIndex, 7);
  IK.saveCheckIn(s, {}, day);
  assert.equal(s.weeks[0].status, "completed");
  assert.equal(s.weeks[1].index, 2);
  assert.equal(s.checkins[7].dayIndex, 1);
});

test("Tracker-Woche: ausgelassene Tage zählen nicht, dayIndex folgt den Einträgen", () => {
  const s = {weeks:[], checkins:[], videoProgress:START()};
  IK.saveCheckIn(s, {}, "2026-10-01");
  IK.saveCheckIn(s, {}, "2026-10-04");
  assert.equal(s.checkins[1].dayIndex, 2);
});

test("Check-in: gleicher Tag wird aktualisiert, bearbeitbar bis Ende des Folgetags", () => {
  const s = {weeks:[], checkins:[], videoProgress:START()};
  IK.saveCheckIn(s, {erholt:2}, "2026-10-01");
  IK.saveCheckIn(s, {forDate:"2026-10-01", erholt:4}, "2026-10-02");
  assert.equal(s.checkins.length, 1);
  assert.equal(s.checkins[0].erholt, 4);
  assert.throws(() => IK.saveCheckIn(s, {forDate:"2026-10-01", erholt:5}, "2026-10-03"));
});

test("Kalendertage über Monatsgrenzen", () => {
  assert.equal(IK.addDays("2026-10-31", 1), "2026-11-01");
  assert.equal(IK.daysBetween("2026-10-30", "2026-11-02"), 3);
});

const {VIDEOS} = require("../videos.js");
const START = () => ({"1.1":{percent:100,watchedAt:"2026-01-01T00:00:00.000Z"},"1.2":{percent:100,watchedAt:"2026-01-01T00:00:00.000Z"},"1.3":{percent:100,watchedAt:"2026-01-01T00:00:00.000Z"}});
const fresh = () => ({weeks:[], checkins:[], videoProgress:START(), pausedBausteinIds:[], queuedBausteinIds:[]});
const empty = () => ({weeks:[], checkins:[], videoProgress:{}, pausedBausteinIds:[], queuedBausteinIds:[]});
const at = (day, h = 21) => `${day}T${String(h).padStart(2, "0")}:00:00.000Z`;

test("Videoliste: jeder Baustein hat ein Video", () => {
  IK.BAUSTEINE.forEach(b => assert.ok(VIDEOS.find(v => v.id === b.videoId), b.videoId));
});

test("Baustein: erst aktiv, wenn nach dem Video eine neue Tracker-Woche beginnt", () => {
  const s = fresh();
  IK.saveCheckIn(s, {}, "2026-10-01", at("2026-10-01"));
  IK.markSeen(s, "2.1", at("2026-10-02", 10));
  assert.deepEqual(IK.currentWeek(s).activeBausteinIds, []);
  let d = "2026-10-02";
  for (let i = 0; i < 6; i++) { IK.saveCheckIn(s, {}, d, at(d)); d = IK.addDays(d, 1); }
  IK.saveCheckIn(s, {}, d, at(d));
  assert.equal(IK.currentWeek(s).index, 2);
  assert.deepEqual(IK.currentWeek(s).activeBausteinIds, ["ballaststoff"]);
});

test("Baustein: höchstens 3 neue pro Woche, Auswahl beim Wochenstart, behaltene bleiben", () => {
  const s = fresh();
  ["2.1", "2.2", "2.3", "3.1"].forEach(id => IK.markSeen(s, id, at("2026-09-30")));
  IK.saveCheckIn(s, {}, "2026-10-01", at("2026-10-01"));
  assert.deepEqual(IK.currentWeek(s).activeBausteinIds, ["ballaststoff", "bildschirm", "kraft"]);
  IK.completeWeek(s, at("2026-10-08"));
  IK.saveCheckIn(s, {}, "2026-10-09", at("2026-10-09"));
  assert.deepEqual(IK.currentWeek(s).activeBausteinIds, ["ballaststoff", "bildschirm", "kraft", "fermentiert"]);

  const t = fresh();
  ["2.1", "2.2", "2.3", "3.1"].forEach(id => IK.markSeen(t, id, at("2026-09-30")));
  IK.saveCheckIn(t, {newBausteinIds:["fermentiert", "kraft"]}, "2026-10-01", at("2026-10-01"));
  assert.deepEqual(IK.currentWeek(t).activeBausteinIds, ["fermentiert", "kraft"]);
});

test("Ab heute mittracken: sofort in der laufenden Woche, sonst zuerst in der nächsten", () => {
  const s = fresh();
  IK.saveCheckIn(s, {}, "2026-10-01", at("2026-10-01"));
  IK.markSeen(s, "2.2", at("2026-10-01", 22));
  assert.equal(IK.activationState(s, "bildschirm"), "ok");
  assert.equal(IK.activateNow(s, "bildschirm"), "active");
  assert.equal(IK.activationState(s, "bildschirm"), "active");
  ["2.1", "2.3", "3.1"].forEach(id => IK.markSeen(s, id, at("2026-10-01", 22)));
  IK.activateNow(s, "ballaststoff"); IK.activateNow(s, "kraft");
  assert.equal(IK.activationState(s, "fermentiert"), "full");

  const q = fresh();
  ["2.1", "2.2", "2.3", "3.1"].forEach(id => IK.markSeen(q, id, at("2026-09-30")));
  assert.equal(IK.activateNow(q, "fermentiert"), "queued");
  IK.saveCheckIn(q, {}, "2026-10-01", at("2026-10-01"));
  assert.deepEqual(IK.currentWeek(q).activeBausteinIds, ["fermentiert", "ballaststoff", "bildschirm"]);
});

test("Kurs: Handout nach allen Kernvideos, nächstes Video und aktuelle Kurswoche", () => {
  const s = fresh();
  VIDEOS.filter(v => v.week === 1).forEach(v => IK.markSeen(s, v.id));
  ["2.1", "2.3"].forEach(id => IK.markSeen(s, id));
  const p = IK.weekVideoProgress(VIDEOS, s, 2);
  assert.equal(p.kernTotal, 6);
  assert.equal(p.kernSeen, 2);
  assert.equal(p.handoutFree, false);
  assert.equal(IK.weekVideoProgress(VIDEOS, s, 1).handoutFree, true);
  assert.equal(IK.nextVideo(VIDEOS, s, 4).id, "2.0");
  assert.equal(IK.currentCourseWeek(VIDEOS, s, 4), 2);
  s.videoProgress["2.0"] = {percent:80};
  assert.equal(IK.isSeen(s, "2.0"), false);
});

/* ---------- Woche 1: Basis-Freischaltung, Starter-Liste, Materialien, Hinweise ---------- */
const IN = require("../inhalte.js");
const ctx = s => ({videos:VIDEOS, materials:IN.MATERIALS, today:"2026-10-10"});

test("Inhalte: jedes Video, auf das ein To-do, eine Routine oder ein Material zeigt, gibt es", () => {
  const ids = new Set(VIDEOS.map(v => v.id));
  IK.BASIS.forEach(b => assert.ok(ids.has(b.videoId), b.videoId));
  IN.TODOS.forEach(t => assert.ok(ids.has(t.after), t.id + " " + t.after));
  IN.MATERIALS.forEach(m => { if(m.unlock.video) assert.ok(ids.has(m.unlock.video), m.id); });
  assert.equal(IN.TODOS.length, 7);
  assert.equal(new Set(IN.TODOS.map(t => t.id)).size, 7);
  Object.keys(IN.BASIS_NOTICE).forEach(k => assert.ok(IK.BASIS.find(b => b.key === k), k));
});

test("Basis-Routine: erst nach ihrem Video im Check-in, ältere Haken bleiben", () => {
  const s = empty();
  assert.equal(IK.basisUnlocked(s, "bunt"), false);
  IK.markSeen(s, "1.1");
  assert.equal(IK.basisUnlocked(s, "bunt"), true);
  assert.equal(IK.basisUnlocked(s, "morgenlicht"), false);
  IK.saveCheckIn(s, {basis:{morgenlicht:true}}, "2026-10-01", at("2026-10-01"));
  assert.equal(IK.basisUnlocked(s, "morgenlicht"), true);
});

test("To-dos: eins pro Tracker-Tag, frei mit Tag und Video, Profilfelder haken ab", () => {
  const s = empty(), st = id => IK.todoStatus(s, IN.TODOS, "2026-10-01").find(t => t.id === id);
  assert.equal(IN.TODOS.length, 7);
  assert.deepEqual(IN.TODOS.map(t => t.day), [1, 2, 3, 4, 5, 6, 7]);
  IN.TODOS.forEach(t => { assert.ok(["darm", "schlaf", "beweg", "recap"].includes(t.pillar), t.id); assert.ok(VIDEOS.find(v => v.id === t.after), t.id + " braucht ein Video"); });
  assert.equal(st("d1").status, "locked"); assert.equal(st("d1").dayOk, true); assert.equal(st("d1").videoOk, false);
  IK.markSeen(s, "1.2"); assert.equal(st("d1").status, "today");
  assert.equal(st("d4").dayOk, false); assert.equal(st("d4").status, "locked");
  s.wakeTime = "06:45"; assert.equal(st("d1").status, "done");
  IK.markSeen(s, "1.1"); IK.markSeen(s, "1.3");
  IK.saveCheckIn(s, {}, "2026-10-01", at("2026-10-01"));
  assert.equal(IK.trackerDay(s, "2026-10-01").day, 1);
  assert.equal(IK.trackerDay(s, "2026-10-02").day, 2);
  const s2 = id => IK.todoStatus(s, IN.TODOS, "2026-10-02").find(t => t.id === id);
  assert.equal(s2("d2").status, "today");
  s.todosDone = {d2: "x"}; assert.equal(s2("d2").status, "done");
  for(let d = 2; d <= 5; d++) IK.saveCheckIn(s, {}, `2026-10-0${d}`, at(`2026-10-0${d}`));
  assert.equal(IK.todoStatus(s, IN.TODOS, "2026-10-06").find(t => t.id === "d3").status, "open"); // 1.3 gesehen, Tag vorbei
  assert.equal(IK.todoStatus(s, IN.TODOS, "2026-10-06").find(t => t.id === "d6").status, "today");
});

test("Wochen-Check: offen nach 7 Tagen oder ab 5 Tagen nach 9 Kalendertagen", () => {
  const s = fresh();
  ["01", "02", "04", "06", "07"].forEach(d => IK.saveCheckIn(s, {}, `2026-10-${d}`, at(`2026-10-${d}`)));
  assert.equal(IK.weekCheckOpen(s, "2026-10-07"), false);
  assert.equal(IK.weekCheckOpen(s, "2026-10-09"), true);
  const t = fresh();
  ["01", "02", "03", "04"].forEach(d => IK.saveCheckIn(t, {}, `2026-10-${d}`, at(`2026-10-${d}`)));
  assert.equal(IK.weekCheckOpen(t, "2026-10-20"), false);
  ["05", "06", "07"].forEach(d => IK.saveCheckIn(t, {}, `2026-10-${d}`, at(`2026-10-${d}`)));
  assert.equal(IK.weekCheckOpen(t, "2026-10-07"), true);
  IK.completeWeek(t); assert.equal(IK.weekCheckOpen(t, "2026-10-07"), false);
});

test("Materialien: Mini-Karte nach Video, Handout nach allen Kernvideos, Goodie nach Wochen-Check 1", () => {
  const s = fresh(), m = id => IN.MATERIALS.find(x => x.id === id), free = id => IK.materialUnlocked(s, m(id), VIDEOS);
  assert.equal(free("teller"), false); IK.markSeen(s, "1.6"); assert.equal(free("teller"), true);
  const kern = VIDEOS.filter(v => v.week === 1 && v.type === "Kern").map(v => v.id);
  assert.deepEqual(kern, ["1.1", "1.2", "1.3", "1.4", "1.11"]);
  kern.slice(0, 4).forEach(id => IK.markSeen(s, id)); assert.equal(free("handout1"), false);
  IK.markSeen(s, "1.11"); assert.equal(free("handout1"), true);
  assert.equal(free("goodie1"), false);
  for(let d = 1; d <= 7; d++) IK.saveCheckIn(s, {}, `2026-10-0${d}`, at(`2026-10-0${d}`));
  IK.completeWeek(s); assert.equal(free("goodie1"), true);
});

test("Hinweise: jede Freischaltung einmal, gesehene verschwinden", () => {
  const s = empty();
  assert.deepEqual(IK.newUnlocks(s, ctx(s)), []);
  IK.markSeen(s, "1.1"); IK.markSeen(s, "1.6");
  assert.deepEqual(IK.newUnlocks(s, ctx(s)).map(e => e.id), ["basis-bunt", "mat-teller"]);
  s.noticesSeen = {"basis-bunt": "x"};
  assert.deepEqual(IK.newUnlocks(s, ctx(s)).map(e => e.id), ["mat-teller"]);
  IK.markSeen(s, "2.1");
  assert.ok(IK.newUnlocks(s, ctx(s)).some(e => e.id === "bst-ballaststoff"));
});

test("To-dos: nach 7 Tagen ist alles frei, nach Woche 1 beginnt Woche 2 bei Tag 1", () => {
  const s = fresh(); VIDEOS.filter(v => v.week === 1).forEach(v => IK.markSeen(s, v.id));
  for(let d = 1; d <= 7; d++) IK.saveCheckIn(s, {}, `2026-10-0${d}`, at(`2026-10-0${d}`));
  assert.ok(IK.todoStatus(s, IN.TODOS, "2026-10-08").every(t => t.unlocked));
  assert.equal(IK.trackerDay(s, "2026-10-08").day, 7);
  IK.completeWeek(s); assert.deepEqual(IK.trackerDay(s, "2026-10-08"), {week: 2, day: 1});
});

test("Loop-Score-Beispiel in Tour und Fortschritt rechnet mit der echten Formel", () => {
  const r = IK.loopScoreFromParts(IN.LOOP_EXAMPLE.values);
  assert.deepEqual([r.score, r.befinden, r.umsetzung, r.dranbleiben], [69, 62, 71, 86]);
  assert.equal(IN.LOOP_EXAMPLE.values.days, 6); // Text: „im Beispiel an 6“
});

test("Abendroutine: Grundpfeiler je 25 %, Extras zusammen 25 % ab 2", () => {
  assert.equal(IK.abendValue(null), 0);
  assert.equal(IK.abendValue({hard:{einleiten:true,bett:true}, extras:["wasser","lesen"]}), 0.75);
  assert.equal(IK.abendValue({hard:{einleiten:true,bildschirm:true,bett:true}, extras:["wasser"]}), 0.88);
  assert.equal(IK.abendValue({hard:{einleiten:true,bildschirm:true,bett:true}, extras:["wasser","tee","lesen","x"]}), 1);
  assert.deepEqual(IK.cleanAbend({hard:{einleiten:1}, extras:["tee","tee","unbekannt"]}).extras, ["tee"]);
});

test("Abendroutine zählt anteilig in die Basis und als erledigt ab 75 %", () => {
  const ci={basis:{bunt:true,morgenlicht:false,bewegt30:true,abend:0.5}};
  assert.equal(IK.basisScore(ci), 2.5);
  assert.equal(IK.routineDone(ci,"abend"), false);
  assert.equal(IK.routineDone({basis:{abend:0.75}},"abend"), true);
  assert.equal(IK.routineDone({basis:{abend:true}},"abend"), true); // ältere Einträge
});

test("Lücke: ab 3 endgültig verpassten Tagen im 7-Tage-Fenster pausieren die Videos der nächsten Woche", () => {
  const s = fresh();
  ["01", "02"].forEach(d => IK.saveCheckIn(s, {}, `2026-10-${d}`, at(`2026-10-${d}`)));
  // 03, 04 verpasst, 05 = gestern noch nachtragbar → noch keine Lücke
  assert.equal(IK.checkGap(s, "2026-10-06"), false);
  assert.equal(IK.weekWindow(s, "2026-10-06").possible, 5);
  // am 07. ist auch der 05. endgültig verpasst
  assert.equal(IK.checkGap(s, "2026-10-07"), true);
  assert.equal(s.pause.week, 1);
  assert.equal(IK.currentWeek(s).status, "missed");
  assert.equal(IK.videoPaused(s, {id:"2.1", week:2}), true);
  assert.equal(IK.videoPaused(s, {id:"1.5", week:1}), false);
  assert.equal(IK.checkGap(s, "2026-10-08"), false); // nur einmal
});

test("Pause: wieder frei nach 3 Check-ins in Folge, gestern nachtragen zählt mit, Woche startet neu", () => {
  const s = fresh();
  ["01", "02"].forEach(d => IK.saveCheckIn(s, {}, `2026-10-${d}`, at(`2026-10-${d}`)));
  IK.checkGap(s, "2026-10-07");
  IK.saveCheckIn(s, {forDate:"2026-10-06"}, "2026-10-07", at("2026-10-07")); // gestern nachgetragen
  const w = IK.currentWeek(s);
  assert.equal(w.status, "running"); assert.equal(w.index, 1); assert.equal(w.restarts, 1);
  assert.equal(IK.checkinsOf(s, w.id).length, 1); // alte Einträge archiviert
  assert.equal(s.checkins.length, 3);
  assert.equal(IK.pauseStreak(s, "2026-10-07"), 1);
  IK.saveCheckIn(s, {}, "2026-10-07", at("2026-10-07"));
  assert.equal(IK.resolvePause(s, "2026-10-07"), false);
  IK.saveCheckIn(s, {}, "2026-10-08", at("2026-10-08"));
  assert.equal(IK.resolvePause(s, "2026-10-08"), true);
  assert.equal(s.pause, null);
});

test("Joker: 2 Stück heben die Pause auf, danach nur schauen mit Zustimmung", () => {
  const s = fresh();
  ["01", "02"].forEach(d => IK.saveCheckIn(s, {}, `2026-10-${d}`, at(`2026-10-${d}`)));
  IK.checkGap(s, "2026-10-07");
  assert.equal(IK.jokersLeft(s), 2);
  assert.equal(IK.useJoker(s), true); assert.equal(s.pause, null); assert.equal(IK.jokersLeft(s), 1);
  s.jokersUsed = 2; s.pause = {since:"2026-10-20", week:1};
  assert.equal(IK.useJoker(s), false);
  IK.allowWatchOnly(s);
  assert.equal(IK.videoPaused(s, {id:"3.1", week:3}), false);
  assert.equal(IK.checkGap(s, "2026-12-01"), false);
});

test("Wertungsstart: vor den Videos 1.1–1.3 zählen Check-ins zu keiner Woche", () => {
  const s = empty();
  IK.markSeen(s, "1.1");
  const c = IK.saveCheckIn(s, {basis:{bunt:true}}, "2026-10-01", at("2026-10-01"));
  assert.equal(c.pre, true); assert.equal(s.weeks.length, 0);
  assert.equal(IK.startProgress(s), 1); assert.equal(IK.scoringStarted(s), false);
  assert.equal(IK.checkGap(s, "2026-10-09"), false);
  IK.markSeen(s, "1.2"); IK.markSeen(s, "1.3");
  const d = IK.saveCheckIn(s, {}, "2026-10-02", at("2026-10-02"));
  assert.equal(d.dayIndex, 1); assert.equal(s.weeks[0].index, 1);
  assert.equal(IK.checkinsOf(s, s.weeks[0].id).length, 1);
});

test("Umsetzung zählt nur freigeschaltete Routinen", () => {
  const c = [{basis:{bunt:true, morgenlicht:true}, erholt:3, energie:3, bauch:3, stress:3}];
  assert.equal(IK.loopScore(c, [], 4).umsetzung, 50);
  assert.equal(IK.loopScore(c, [], 2).umsetzung, 100);
});

test("Tagesgrenze 4 Uhr: um 0:30 ist noch der Vortag", () => {
  const real = Date.now;
  Date.now = () => new Date(2026, 10, 12, 0, 30).getTime();
  try { assert.equal(IK.localDay(), "2026-11-11"); } finally { Date.now = real; }
  Date.now = () => new Date(2026, 10, 12, 4, 5).getTime();
  try { assert.equal(IK.localDay(), "2026-11-12"); } finally { Date.now = real; }
});
