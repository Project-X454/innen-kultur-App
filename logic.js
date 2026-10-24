/* innen kultur · Rechenmodul
   Reine Funktionen ohne Oberfläche und ohne Speicher, damit sie im Browser und in Node (Tests) laufen.
   Regeln und Formeln: SPEC.md §5. Gewichte als Konstanten, damit sie sich später anpassen lassen. */
(function(root){
"use strict";

const WEIGHTS = {befinden:0.5, umsetzung:0.35, dranbleiben:0.15};
const UMSETZUNG = {basis:0.6, bausteine:0.4};
const DAYS_PER_WEEK = 7;
const EDIT_DAYS = 1;          // Check-in bearbeitbar bis Ende des Folgetags (§5.3)

const PILLARS = {
  darm:   {label:"Ernährung & Darm"},
  schlaf: {label:"Schlaf"},
  beweg:  {label:"Bewegung"},
  recap:  {label:"Recap · Healthspan"}
};
const BASIS = [
  {key:"bunt",        pillar:"darm",   label:"Bunt gegessen"},
  {key:"morgenlicht", pillar:"schlaf", label:"Morgenlicht"},
  {key:"bewegt30",    pillar:"beweg",  label:"30 Min bewegt"}
];
const SCALES = [
  {key:"erholt",  label:"Erholt"},
  {key:"bauch",   label:"Bauchgefühl"},
  {key:"energie", label:"Energie"},
  {key:"stress",  label:"Stress", inverse:true}
];
const GOALS = [
  {id:"energie",       label:"Mehr Energie im Alltag"},
  {id:"bauch",         label:"Ruhigerer Bauch"},
  {id:"schlaf",        label:"Besser schlafen"},
  {id:"fitter",        label:"Fitter und kräftiger werden"},
  {id:"gesund_aelter", label:"Gesund älter werden"}
];
const BASELINE = [
  {key:"energie",   label:"Energie",        short:"Energie",  pillar:"recap"},
  {key:"bauch",     label:"Bauchgefühl",    short:"Bauch",    pillar:"darm"},
  {key:"schlaf",    label:"Schlafqualität", short:"Schlaf",   pillar:"schlaf"},
  {key:"bewegung",  label:"Bewegung",       short:"Bewegung", pillar:"beweg"},
  {key:"entspannt", label:"Entspannt sein", short:"Ruhe",     pillar:null}
];
// Bausteine im Basiskurs (§5.2). Sie schalten sich über das Video mit der passenden videoId frei.
const BAUSTEINE = [
  {id:"ballaststoff", pillar:"darm",   label:"Ballaststoff-Booster",  courseWeek:2, videoId:"2.1",  kind:"daily"},
  {id:"bildschirm",   pillar:"schlaf", label:"Bildschirm-Stopp",      courseWeek:2, videoId:"2.2",  kind:"daily"},
  {id:"kraft",        pillar:"beweg",  label:"Krafteinheit",          courseWeek:2, videoId:"2.3",  kind:"weeklyCount", weeklyTarget:2},
  {id:"fermentiert",  pillar:"darm",   label:"Fermentiertes",         courseWeek:3, videoId:"3.1",  kind:"daily"},
  {id:"letzte_mz",    pillar:"schlaf", label:"Letzte Mahlzeit 3 Std. vor dem Schlafen", courseWeek:3, videoId:"3.2", kind:"daily"},
  {id:"zone2",        pillar:"beweg",  label:"Zone-2-Minuten",        courseWeek:3, videoId:"3.3",  kind:"daily"},
  {id:"in_ruhe",      pillar:"darm",   label:"In Ruhe gegessen",      courseWeek:4, videoId:"4.1",  kind:"daily"},
  {id:"koffein",      pillar:"schlaf", label:"Kein Koffein nach dem Mittag", courseWeek:4, videoId:"4.2b", kind:"daily"},
  {id:"runterfahren", pillar:"beweg",  label:"Runterfahr-Routine",    courseWeek:4, videoId:"4.3",  kind:"daily"}
];

const isNum = v => typeof v === "number" && !isNaN(v);
const mean = a => { const n=a.filter(isNum); return n.length ? n.reduce((p,c)=>p+c,0)/n.length : null; };
const norm = x => (x-1)/4*100;

/* ---------- Kalendertage (immer lokaler Tag der Person, §8) ---------- */
function localDay(d){ d = d || new Date(); const p=n=>String(n).padStart(2,"0");
  return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate()); }
function parseDay(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function addDays(s,n){ const d=parseDay(s); d.setDate(d.getDate()+n); return localDay(d); }
function daysBetween(a,b){ return Math.round((parseDay(b)-parseDay(a))/864e5); }
function canEdit(forDate,today){ const d=daysBetween(forDate,today); return d>=0 && d<=EDIT_DAYS; }

/* ---------- Tageswerte ---------- */
function basisScore(ci){ return BASIS.reduce((n,b)=>n+(ci.basis&&ci.basis[b.key]?1:0),0); }

/* ---------- Woche: Durchschnitte und Loop-Score (§5.6, §5.7) ---------- */
function weekStats(checkins, activeBausteine){
  const days = checkins.length;
  const avg = {};
  SCALES.forEach(s=>{ avg[s.key]=mean(checkins.map(c=>c[s.key])); });
  avg.basis = days ? mean(checkins.map(basisScore)) : null;
  avg.bewegungMin = mean(checkins.map(c=>c.bewegungMin));
  avg.bewegt30 = days ? checkins.filter(c=>c.basis&&c.basis.bewegt30).length/days : null;
  const bausteine = (activeBausteine||[]).map(b=>{
    const vals = checkins.map(c=>c.bausteine ? c.bausteine[b.id] : undefined);
    let rate = null;
    if(b.kind==="weeklyCount"){ const n=vals.filter(v=>v===true||(isNum(v)&&v>0)).length; rate=Math.min(1,n/(b.weeklyTarget||1)); }
    else if(days){ rate = vals.filter(v=>v===true).length/days; }
    return {id:b.id, rate};
  });
  return {days, avg, bausteine};
}

function befindenOf(avg){
  const parts=[avg.erholt, avg.energie, avg.bauch].map(v=>isNum(v)?norm(v):null);
  parts.push(isNum(avg.stress)?norm(6-avg.stress):null);
  return mean(parts);
}

// Teilwerte in Prozent (0–100), ungerundet. bausteinePct = null bedeutet: keine aktiven Bausteine.
function loopScoreFromParts(p){
  const befinden = befindenOf(p);
  const basisPct = isNum(p.basis) ? p.basis/3*100 : (isNum(p.basisPct)?p.basisPct:null);
  let umsetzung = null;
  if(basisPct!==null) umsetzung = isNum(p.bausteinePct) ? UMSETZUNG.basis*basisPct + UMSETZUNG.bausteine*p.bausteinePct : basisPct;
  const dranbleiben = Math.min(1,(p.days||0)/DAYS_PER_WEEK)*100;
  const score = befinden===null||umsetzung===null ? null
    : Math.round(WEIGHTS.befinden*befinden + WEIGHTS.umsetzung*umsetzung + WEIGHTS.dranbleiben*dranbleiben);
  const r = v => v===null ? null : Math.round(v);
  return {score, befinden:r(befinden), umsetzung:r(umsetzung), dranbleiben:r(dranbleiben)};
}

function loopScore(checkins, activeBausteine){
  const st = weekStats(checkins, activeBausteine);
  const rates = st.bausteine.map(b=>b.rate).filter(isNum);
  return loopScoreFromParts(Object.assign({}, st.avg, {
    bausteinePct: rates.length ? mean(rates)*100 : null,
    days: st.days
  }));
}

/* ---------- Startpunkt (§5.8) und größter Hebel (Screen 03) ---------- */
function compareToStart(baseline, avg){
  if(!baseline||!avg) return [];
  const row=(key,label,start,now)=>({key,label,start,now:isNum(now)?Math.round(now*10)/10:null,
    diff:isNum(start)&&isNum(now)?Math.round((now-start)*10)/10:null});
  return [
    row("schlaf","Schlafqualität",baseline.schlaf,avg.erholt),
    row("energie","Energie",baseline.energie,avg.energie),
    row("bauch","Bauchgefühl",baseline.bauch,avg.bauch),
    row("entspannt","Entspannt sein",baseline.entspannt,isNum(avg.stress)?6-avg.stress:null),
    {key:"bewegung",label:"Bewegung",start:baseline.bewegung,now:null,diff:null,
      text:isNum(avg.bewegungMin)?"Ø "+Math.round(avg.bewegungMin)+" Min. pro Tag":null}
  ];
}

// Säule mit dem niedrigsten Ausgangswert. Bei Gleichstand gilt die Reihenfolge Darm, Schlaf, Bewegung.
function biggestLever(b){
  if(!b) return null;
  const c=[["darm",b.bauch],["schlaf",b.schlaf],["beweg",b.bewegung]].filter(x=>isNum(x[1]));
  if(!c.length) return null;
  return c.reduce((lo,x)=>x[1]<lo[1]?x:lo)[0];
}

/* ---------- Tracker-Wochen (§2, §5.3) ---------- */
function currentWeek(state){ const w=state.weeks; return w.length ? w[w.length-1] : null; }
function checkinsOf(state, weekId){ return state.checkins.filter(c=>c.trackerWeekId===weekId).sort((a,b)=>a.dayIndex-b.dayIndex); }
function checkinFor(state, day){ return state.checkins.find(c=>c.forDate===day) || null; }

function completeWeek(state, now){
  const w=currentWeek(state); if(!w||w.status==="completed") return state;
  w.status="completed"; w.weekCheckAt=now||new Date().toISOString(); return state;
}

// Speichert den Check-in für einen Kalendertag. Neuer Tag = nächster dayIndex. Eine Woche ohne Wochen-Check
// wird mit dem ersten neuen Check-in abgeschlossen, damit niemand festhängt.
function saveCheckIn(state, data, today, now){
  now = now || new Date().toISOString();
  const day = data.forDate || today;
  const existing = checkinFor(state, day);
  if(existing){
    if(!canEdit(day, today)) throw new Error("Dieser Tag kann nicht mehr bearbeitet werden.");
    Object.assign(existing, pickEntry(data), {updatedAt:now});
    return existing;
  }
  let w = currentWeek(state);
  if(w && w.status==="awaitingCheck") completeWeek(state, now);
  if(!w || w.status==="completed") w = startWeek(state, now, data.newBausteinIds);
  const ci = Object.assign({id:"c"+day, trackerWeekId:w.id, dayIndex:checkinsOf(state,w.id).length+1,
    forDate:day, createdAt:now, isBackfill:day!==today, isQuick:false}, pickEntry(data));
  state.checkins.push(ci);
  if(ci.dayIndex>=DAYS_PER_WEEK) w.status="awaitingCheck";
  return ci;
}

/* ---------- Videos und Bausteine (§5.2, §5.9, §5.10) ---------- */
const MAX_NEW_PER_WEEK = 3;
const SEEN_PERCENT = 90;
const progressOf = (state,id) => (state.videoProgress||{})[id] || null;
function isSeen(state,id){ const p=progressOf(state,id); return !!p && p.percent>=SEEN_PERCENT; }
function markSeen(state,id,now){
  state.videoProgress = state.videoProgress||{};
  state.videoProgress[id] = {percent:100, watchedAt:now||new Date().toISOString()};
}
function markUnseen(state,id){ if(state.videoProgress) delete state.videoProgress[id]; }
const bausteinById = id => BAUSTEINE.find(b=>b.id===id) || null;
const bausteinForVideo = videoId => BAUSTEINE.find(b=>b.videoId===videoId) || null;

// Freigeschaltet = Video gesehen. Aktiv wird ein Baustein erst mit einer neuen Tracker-Woche (oder per „Ab heute mittracken“).
function unlockedBausteine(state){ return BAUSTEINE.filter(b=>isSeen(state,b.videoId)); }
function newWeekCandidates(state, now){
  const prev=currentWeek(state), active=prev ? prev.activeBausteinIds : [];
  const paused=state.pausedBausteinIds||[], queued=state.queuedBausteinIds||[];
  const cands=unlockedBausteine(state).filter(b=>!active.includes(b.id) && !paused.includes(b.id)
    && (!now || progressOf(state,b.videoId).watchedAt < now));
  return cands.sort((a,b)=>(queued.includes(b.id)-queued.includes(a.id)) || (a.courseWeek-b.courseWeek) || (BAUSTEINE.indexOf(a)-BAUSTEINE.indexOf(b))).map(b=>b.id);
}
function startWeek(state, now, chosenNew){
  const prev=currentWeek(state), paused=state.pausedBausteinIds||[];
  const kept=prev ? prev.activeBausteinIds.filter(id=>!paused.includes(id)) : [];
  const cands=newWeekCandidates(state, now);
  const picked=(Array.isArray(chosenNew) ? chosenNew.filter(id=>cands.includes(id)) : cands).slice(0,MAX_NEW_PER_WEEK);
  const w={id:"w"+(state.weeks.length+1), index:state.weeks.length+1, startedAt:now,
    activeBausteinIds:kept.concat(picked), newBausteinIds:picked, status:"running"};
  state.weeks.push(w); state.queuedBausteinIds=[];
  return w;
}
// Status für „Ab heute mittracken“ auf dem Video-Screen.
function activationState(state,id){
  const w=currentWeek(state);
  if(w && w.status==="running"){
    if(w.activeBausteinIds.includes(id)) return "active";
    return (w.newBausteinIds||[]).length>=MAX_NEW_PER_WEEK ? "full" : "ok";
  }
  return (state.queuedBausteinIds||[]).includes(id) ? "queued" : "ok";
}
// Läuft eine Woche, ist der Baustein ab dem nächsten Check-in dabei. Sonst kommt er mit der nächsten Woche zuerst dran.
function activateNow(state,id){
  const s=activationState(state,id); if(s!=="ok") return s;
  const w=currentWeek(state);
  if(w && w.status==="running"){ w.activeBausteinIds.push(id); w.newBausteinIds=(w.newBausteinIds||[]).concat(id); return "active"; }
  state.queuedBausteinIds=(state.queuedBausteinIds||[]).concat(id); return "queued";
}
// Pausiert = ausgeblendet, jederzeit reaktivierbar (§5.2).
function pauseBaustein(state,id){
  state.pausedBausteinIds=(state.pausedBausteinIds||[]).filter(x=>x!==id).concat(id);
  const w=currentWeek(state); if(w&&w.status==="running") w.activeBausteinIds=w.activeBausteinIds.filter(x=>x!==id);
}
function resumeBaustein(state,id){
  state.pausedBausteinIds=(state.pausedBausteinIds||[]).filter(x=>x!==id);
  return activateNow(state,id);
}
function activeBausteine(week){ return week ? week.activeBausteinIds.map(bausteinById).filter(Boolean) : []; }

function weekVideoProgress(videos, state, week){
  const v=videos.filter(x=>x.week===week), k=v.filter(x=>x.type==="Kern");
  const seen=v.filter(x=>isSeen(state,x.id)).length, kernSeen=k.filter(x=>isSeen(state,x.id)).length;
  return {total:v.length, seen, kernTotal:k.length, kernSeen, handoutFree:k.length>0 && kernSeen===k.length};
}
const courseVideos = (videos,maxWeek) => videos.filter(v=>typeof v.week==="number" && v.week<=maxWeek).sort((a,b)=>a.week-b.week||a.order-b.order);
function nextVideo(videos, state, maxWeek){ return courseVideos(videos,maxWeek).find(v=>!isSeen(state,v.id)) || null; }
// Aktuelle Kurswoche = erste Woche mit noch nicht gesehenen Videos, sonst die letzte.
function currentCourseWeek(videos, state, maxWeek){
  const n=nextVideo(videos,state,maxWeek); if(n) return n.week;
  const all=courseVideos(videos,maxWeek); return all.length ? all[all.length-1].week : 1;
}

function pickEntry(d){
  const o={basis:Object.assign({bunt:false,morgenlicht:false,bewegt30:false}, d.basis||{}), bausteine:Object.assign({}, d.bausteine||{})};
  ["erholt","bauch","energie","stress","tagGesamt","schlafStunden","pflanzen","bewegungMin"].forEach(k=>{ o[k]=isNum(d[k])?d[k]:undefined; });
  return o;
}

const api = {WEIGHTS, UMSETZUNG, DAYS_PER_WEEK, PILLARS, BASIS, SCALES, GOALS, BASELINE, BAUSTEINE,
  isNum, mean, norm, localDay, addDays, daysBetween, canEdit, basisScore, weekStats, befindenOf,
  loopScoreFromParts, loopScore, compareToStart, biggestLever, currentWeek, checkinsOf, checkinFor,
  completeWeek, saveCheckIn, MAX_NEW_PER_WEEK, SEEN_PERCENT, isSeen, markSeen, markUnseen, bausteinById, bausteinForVideo,
  unlockedBausteine, newWeekCandidates, startWeek, activationState, activateNow, pauseBaustein, resumeBaustein, activeBausteine,
  weekVideoProgress, nextVideo, currentCourseWeek};
if(typeof module!=="undefined" && module.exports) module.exports = api; else root.IK = api;
})(typeof globalThis!=="undefined" ? globalThis : this);
