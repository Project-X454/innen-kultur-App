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
  const r = IK.loopScoreFromParts({erholt:3, energie:3, bauch:3, stress:3, basis:1.5, days:7});
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
  // Umsetzung = 0,6 × 66,7 + 0,4 × 50 = 60
  assert.equal(r.umsetzung, 60);
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
  const s = {weeks:[], checkins:[]};
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
  const s = {weeks:[], checkins:[]};
  IK.saveCheckIn(s, {}, "2026-10-01");
  IK.saveCheckIn(s, {}, "2026-10-04");
  assert.equal(s.checkins[1].dayIndex, 2);
});

test("Check-in: gleicher Tag wird aktualisiert, bearbeitbar bis Ende des Folgetags", () => {
  const s = {weeks:[], checkins:[]};
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
