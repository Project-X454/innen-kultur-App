/* innen kultur · App-Oberfläche
   Alle Einträge bleiben im Browser des Geräts (localStorage). Kein Server, keine Datenbank.
   Screens und Abläufe: SPEC.md §3. Rechnung: logic.js. */
(function(){
"use strict";
const IK = window.IK, VID = window.IK_VIDEOS;
const KEY = "ik-app-v2", OLD_KEY = "ik-loop-v1";
const CHECK = "✓";
const PC = {darm:"var(--darm)", schlaf:"var(--schlaf)", beweg:"var(--beweg)", recap:"var(--recap)"};
const PS = {darm:"var(--darm-soft)", schlaf:"var(--schlaf-soft)", beweg:"var(--beweg-soft)", recap:"var(--recap-soft)"};
const PT = {darm:"var(--darm-text)", schlaf:"var(--schlaf-text)", beweg:"var(--beweg-text)", recap:"var(--recap-text)"};
const ICON = {
  heute:'<svg viewBox="0 0 24 24"><path d="M3 11 12 4l9 7v9H3Z"/><path d="M9 20v-6h6v6"/></svg>',
  kurs:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5 15 12l-5 2.5Z"/></svg>',
  checkin:'<svg viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7"/></svg>',
  fortschritt:'<svg viewBox="0 0 24 24"><path d="M4 19h16M6 16l4-5 3 3 5-7"/></svg>',
  bibliothek:'<svg viewBox="0 0 24 24"><path d="M5 4h4v16H5zM10 4h4v16h-4zM15.5 5l3.5-.8 2.5 15.6-3.5.8z"/></svg>',
  profil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
  darm:'<svg viewBox="0 0 24 24"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/></svg>',
  schlaf:'<svg viewBox="0 0 24 24"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z"/></svg>',
  beweg:'<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v4M11 15l1-6 4 3h3M12 9l-4 1-2 3"/></svg>',
  recap:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg>',
  sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>',
  doc:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'
};
const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt1 = v => v==null ? "–" : (Math.round(v*10)/10).toFixed(1).replace(".",",");
const fmtSigned = v => v==null ? "–" : (v>0?"+":v<0?"−":"±")+fmt1(Math.abs(v));
function logo(){ return mark(34); }

// Logo „Innere Schleife“ mit Farben aus den Variablen, damit es hell und im Abendmodus stimmt.
// Form 1:1 aus dem App-Icon nachgezeichnet. Schleife und Punkt sind ausgestanzt, der Hintergrund scheint durch.
const BLOBPATH="M48.8 0.0C47.3 0.2 43.7 0.7 41.1 1.3C38.6 1.9 36.0 2.6 33.4 3.7C30.9 4.7 28.3 6.0 25.7 7.7C23.2 9.4 20.4 11.4 18.1 13.7C15.8 16.0 13.6 18.8 11.9 21.3C10.1 23.9 8.7 26.5 7.5 29.0C6.3 31.6 5.2 34.2 4.5 36.7C3.7 39.3 3.3 41.8 3.0 44.4C2.7 47.0 2.5 49.5 2.5 52.1C2.4 54.7 2.5 57.2 2.9 59.8C3.2 62.4 3.7 64.9 4.5 67.5C5.3 70.1 6.3 72.6 7.7 75.2C9.1 77.8 10.7 80.5 12.8 82.9C14.9 85.3 17.7 87.9 20.2 89.8C22.7 91.7 25.3 93.2 27.9 94.5C30.4 95.8 33.0 96.8 35.6 97.5C38.1 98.3 40.7 98.9 43.3 99.3C45.8 99.6 48.4 100.0 51.0 99.9C53.5 99.9 56.1 99.4 58.7 98.8C61.2 98.3 63.8 97.6 66.3 96.6C68.9 95.6 71.5 94.3 74.0 92.6C76.6 91.0 79.4 88.8 81.7 86.5C84.0 84.3 86.0 81.6 87.7 79.1C89.5 76.6 91.0 74.0 92.2 71.4C93.4 68.8 94.2 66.3 94.9 63.7C95.6 61.1 96.0 58.6 96.5 56.0C96.9 53.4 97.4 50.9 97.5 48.3C97.6 45.7 97.3 43.2 97.0 40.6C96.7 38.0 96.2 35.5 95.5 32.9C94.8 30.3 93.9 27.8 92.6 25.2C91.4 22.6 89.9 20.0 88.0 17.5C86.1 15.0 83.5 12.3 81.1 10.3C78.6 8.3 75.9 6.6 73.4 5.3C70.8 4.0 68.2 3.1 65.7 2.3C63.1 1.6 60.5 1.1 58.0 0.7C55.4 0.4 51.8 0.1 50.3 0.0C48.8 -0.1 50.4 -0.2 48.8 0.0Z";
const INNERPATH="M39.1 25.6C38.7 25.7 37.8 25.9 37.2 26.3C36.6 26.7 35.7 27.5 35.3 28.1C34.9 28.7 34.8 29.3 34.7 30.0C34.6 30.6 34.6 31.2 34.7 31.9C34.9 32.5 35.1 33.2 35.5 33.8C35.9 34.3 36.7 34.9 37.3 35.1C38.0 35.4 38.6 35.5 39.2 35.6C39.9 35.6 40.5 35.5 41.1 35.2C41.8 34.9 42.5 34.5 42.9 33.9C43.4 33.4 43.6 32.7 43.8 32.0C44.0 31.4 44.1 30.7 44.0 30.1C43.9 29.5 43.8 28.8 43.4 28.2C43.0 27.6 42.2 26.9 41.6 26.4C41.0 26.0 40.1 25.8 39.7 25.7C39.3 25.5 39.5 25.5 39.1 25.6Z M50.2 25.1C49.5 25.4 47.3 26.0 46.7 26.8C46.2 27.7 46.2 29.5 46.7 30.4C47.3 31.2 49.0 31.7 50.2 31.9C51.4 32.2 52.6 32.0 53.7 32.1C54.9 32.2 56.1 32.3 57.3 32.7C58.5 33.1 59.7 33.7 60.8 34.5C62.0 35.3 63.4 36.4 64.3 37.5C65.2 38.6 65.8 39.9 66.3 41.1C66.8 42.3 67.2 43.4 67.4 44.6C67.7 45.8 67.8 47.0 67.8 48.2C67.9 49.3 67.7 50.5 67.6 51.7C67.4 52.9 67.2 54.1 66.8 55.2C66.5 56.4 66.1 57.6 65.4 58.8C64.7 60.0 63.8 61.2 62.8 62.3C61.8 63.4 60.4 64.5 59.3 65.3C58.1 66.1 56.9 66.6 55.7 67.1C54.5 67.6 53.4 67.9 52.2 68.1C51.0 68.3 49.8 68.2 48.6 68.1C47.5 68.0 46.3 67.9 45.1 67.6C43.9 67.3 42.7 66.8 41.6 66.2C40.4 65.6 39.1 64.8 38.0 63.8C36.9 62.8 35.8 61.4 35.1 60.2C34.3 59.0 34.0 57.9 33.6 56.7C33.2 55.5 32.8 54.3 32.7 53.1C32.5 52.0 32.6 50.8 32.7 49.6C32.8 48.4 33.3 47.2 33.3 46.0C33.3 44.9 33.4 43.2 32.8 42.5C32.1 41.8 30.2 41.2 29.2 41.6C28.3 42.0 27.5 43.8 27.0 44.9C26.6 46.0 26.5 47.3 26.4 48.4C26.3 49.6 26.3 50.8 26.4 52.0C26.4 53.2 26.5 54.3 26.7 55.5C26.9 56.7 27.1 57.9 27.5 59.1C27.8 60.2 28.3 61.4 29.0 62.6C29.6 63.8 30.3 65.0 31.3 66.1C32.2 67.3 33.4 68.5 34.5 69.5C35.7 70.4 36.9 71.3 38.1 71.9C39.3 72.6 40.4 73.1 41.6 73.6C42.8 74.0 44.0 74.2 45.2 74.5C46.3 74.7 47.5 74.8 48.7 74.9C49.9 74.9 51.1 74.9 52.2 74.8C53.4 74.6 54.6 74.3 55.8 74.0C57.0 73.6 58.2 73.2 59.3 72.7C60.5 72.2 61.7 71.6 62.9 70.8C64.1 70.1 65.3 69.0 66.4 68.0C67.5 66.9 68.5 65.7 69.3 64.5C70.2 63.3 70.9 62.1 71.5 61.0C72.1 59.8 72.5 58.6 72.9 57.4C73.3 56.2 73.8 55.1 74.0 53.9C74.2 52.7 74.1 51.5 74.1 50.3C74.1 49.2 74.1 48.0 74.1 46.8C74.1 45.6 74.1 44.4 73.9 43.3C73.7 42.1 73.1 40.9 72.7 39.7C72.2 38.5 71.9 37.4 71.2 36.2C70.5 35.0 69.7 33.8 68.7 32.6C67.7 31.5 66.4 30.3 65.2 29.4C64.0 28.5 62.8 27.9 61.6 27.3C60.5 26.7 59.3 26.2 58.1 25.9C56.9 25.5 55.7 25.4 54.6 25.3C53.4 25.1 51.7 25.1 51.0 25.1C50.3 25.0 50.9 24.8 50.2 25.1Z";
// Zwei getrennte Flächen statt Ausstanzung: Safari auf dem iPhone zeigte die Ausstanzung im Knopf nicht.
const logoSVG = (sz,cls) => `<svg${cls?` class="${cls}"`:""} width="${sz}" height="${sz}" viewBox="0 0 100 100" aria-hidden="true"><path d="${BLOBPATH}" fill="#E9765B"/><path d="${INNERPATH}" fill="#FFFFFF"/></svg>`;
function mark(sz){ return logoSVG(sz); }
// Kopfzeile der Hauptscreens: Logo und Wortmarke links, Aktionen rechts.
const brandBar = extra => `<div class="brandbar"><span class="bmark">${mark(30)}<b>innen kultur</b></span><span class="hd-actions">${extra||""}<button class="iconbtn" data-a="go" data-v="profil" aria-label="Profil und Daten">${ICON.profil}</button></span></div>`;

/* ---------- Speicher (nur auf diesem Gerät) ---------- */
function blank(){ return {v:2, code:"", product:null, demo:false, goals:[], reminderTime:"21:00",
  onboardingCompletedAt:null, consentHealthDataAt:null, baselines:[], weeks:[], checkins:[], videoProgress:{},
  pausedBausteinIds:[], queuedBausteinIds:[], lastBackup:null,
  wakeTime:null, lightSpot:null, why:null, standTest:null, standTestAt:null, todosDone:{}, noticesSeen:{},
  dayTicks:{}, focusSnooze:{}, eveningMode:"auto", haptics:true}; }
function load(){
  try{ const r=localStorage.getItem(KEY); if(r){ const o=JSON.parse(r); if(!("noticesSeen" in o)) migrateNotices=true; return Object.assign(blank(), o); } }catch(e){}
  // Aus der alten Tracker-Version wird nur die Freischaltung übernommen. Die alten Einträge bleiben unter dem alten Schlüssel liegen.
  const s=blank();
  try{ const o=JSON.parse(localStorage.getItem(OLD_KEY)||"null"); if(o&&o.plan&&!o.demo){ s.code=o.code||""; s.product=o.plan===8?"komplett":"basis"; } }catch(e){}
  return s;
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
let migrateNotices=false;
let S = load();
const latestBaseline = () => S.baselines.length ? S.baselines[S.baselines.length-1] : null;
const weeksTotal = () => S.product==="komplett" ? 8 : 4;

/* ---------- Zustand der Oberfläche ---------- */
let view="heute", videoId=null, kursWeek=null, kursFilter="alle", ob="welcome", obD=null, draft=null, flash="", libTab="wissen", wissen=null, confirmWipe=false, transfer=null, rebase=false, pending=null, lastView=null, mat=null, focusTodo=null, freshIds=[], freshTodos=[];
/* Verlauf: Wer weitergeleitet wird, kommt mit „Zurück“ dorthin, wo er herkam. Die Tab-Leiste beginnt neu. */
let navStack=[];
const snap=()=>({view,videoId,mat,wissen,libTab,kursWeek,kursFilter,y:window.scrollY||0});
function pushNav(){ const c=snap(), t=navStack[navStack.length-1];
  if(t&&t.view===c.view&&t.videoId===c.videoId&&t.mat===c.mat&&t.wissen===c.wissen) return;
  navStack.push(c); if(navStack.length>30) navStack.shift();
  try{ history.pushState({ikNav:navStack.length},""); }catch(e){} }
function restoreNav(fallback){
  const s=navStack.pop(); if(!s) return go(fallback||"heute");
  if(s.view==="checkin") return go("checkin");
  view=s.view; videoId=s.videoId; mat=s.mat; wissen=s.wissen; libTab=s.libTab; kursWeek=s.kursWeek; kursFilter=s.kursFilter;
  flash=""; confirmWipe=false; transfer=null; rebase=false; focusTodo=null; freshIds=[]; freshTodos=[]; sheetOpen=false; lockFor=null;
  render(); window.scrollTo(0,s.y); }
function back(fallback){
  if(navStack.length && history.state && history.state.ikNav) return history.back(); // löst popstate aus
  restoreNav(fallback); }
window.addEventListener("popstate", ()=>{ if(navStack.length) restoreNav(); });
function go(v){ if(v==="kurs"&&view!=="video") kursWeek=null; view=v; flash=v==="heute"?flash:""; confirmWipe=false; transfer=null; wissen=null; rebase=false; mat=null; focusTodo=null; freshIds=[]; freshTodos=[];
  sheetOpen=false; lockFor=null; if(v==="checkin"){ draft=null; ciStep=1; ciMore=false; } render(); window.scrollTo(0,0); }

function render(){
  const app=document.getElementById("app");
  let body, full=false, tabs=true;
  if(!S.onboardingCompletedAt){ body=vOnboarding(); full=true; tabs=false; }
  else if(rebase){ body=vBaseline(true); full=true; tabs=false; }
  else if(view==="checkin"){ body=vCheckin(); full=true; tabs=false; }
  else if(view==="geschafft"){ body=vGeschafft(); full=true; tabs=false; }
  else if(view==='video'){ body=vVideo(); tabs=false; }
  else body={heute:vHeute, kurs:vKurs, fortschritt:vFortschritt, bibliothek:vBibliothek, profil:vProfil, starter:vStarter, wochencheck:vWochencheck}[view]();
  const key=(S.onboardingCompletedAt?view:"ob-"+ob)+(rebase?"-rb":"");
  const side=tabs||view==="video"&&!!S.onboardingCompletedAt&&!rebase; // Video: am Desktop mit Seitenleiste
  app.className=(side?"nav ":"")+"v-"+(S.onboardingCompletedAt?(rebase?"rebase":view):"ob-"+ob);
  applyTheme();
  const sheet = !S.onboardingCompletedAt ? "" : sheetOpen ? sheetHTML() : lockFor ? lockHTML() : "";
  document.body.classList.toggle("sheet-open", !!sheet);
  app.innerHTML=`${side?sideBar():""}<main class="${full?"full ":""}${key!==lastView?"enter":""}">${body}</main>${tabs?tabBar():""}${sheet}`;
  lastView=key;
}
/* Ab 960 px Breite: Seitenleiste statt Tab-Leiste, Inhalte in zwei Spalten (CSS .lay). Mobil gilt die Reihenfolge a, dann b. */
const lay=(a,b,cls)=>`<div class="lay${cls?" "+cls:""}"><div class="col">${a}</div><div class="col">${b}</div></div>`;
function sideBar(){
  const t=[["heute","Heute"],["kurs","Kurs"],["fortschritt","Fortschritt"],["bibliothek","Bibliothek"]];
  const cur=view==="video"?"kurs":view==="starter"||view==="wochencheck"||view==="geschafft"?"heute":view;
  const item=([k,l])=>`<button data-a="go" data-v="${k}" data-root="1" ${cur===k?'aria-current="page"':""}>${ICON[k]}<span>${l}</span></button>`;
  return `<aside class="side" aria-label="App-Navigation"><div class="brand">${logo("#FFFFFF")}innen kultur</div>
  <button class="btn" data-a="go" data-v="checkin">${ICON.checkin}Abend-Check-in</button>
  <nav>${t.map(item).join("")}</nav>
  <div class="side-ft">${item(["profil","Profil und Daten"])}<p class="note">Deine Daten bleiben auf diesem Gerät.</p></div></aside>`;
}
function tabBar(){
  const t=[["heute","Heute"],["kurs","Kurs"],["checkin","Check-in"],["fortschritt","Fortschritt"],["bibliothek","Bibliothek"]];
  return `<nav class="tabs" aria-label="App-Navigation"><div class="tabs-in">${t.map(([k,l])=>k==="checkin"
    ? `<button class="ci" data-a="go" data-v="checkin" aria-label="Abend-Check-in"><span>${logoSVG(50,"b")}</span></button>`
    : `<button data-a="go" data-v="${k}" data-root="1" ${(view==="starter"||view==="wochencheck"?"heute":view)===k?'aria-current="page"':""}>${ICON[k]}${l}</button>`).join("")}</div></nav>`;
}
function scale(name,label,val,dot,caps){
  let h=`<div class="scale"><span>${dot?`<span class="dot" style="--c:${dot}"></span>`:""}${label}</span><div class="seg" role="group" aria-label="${esc(label)}">`;
  for(let i=1;i<=5;i++) h+=`<button type="button" data-a="set" data-k="${name}" data-v="${i}" aria-pressed="${val===i}">${i}</button>`;
  h+="</div>"; if(caps) h+=`<div class="seg-cap"><span>${caps[0]}</span><span>${caps[1]}</span></div>`;
  return h+"</div>";
}

/* ---------- Onboarding (Screens 01–03, nur einmal) ---------- */
function vOnboarding(){
  if(ob==="code") return vCode();
  if(ob==="restore") return vRestore();
  if(ob==="goals") return vGoals();
  if(ob==="consent") return vConsent();
  if(ob==="baseline") return vBaseline(false);
  const pill = S.product==="komplett" ? "Komplettkurs · 8 Wochen" : S.product==="basis" ? "Basiskurs · 4 Wochen" : "Online-Kurs · 4 oder 8 Wochen";
  const P=[["darm","Ernährung & Darm","Was du isst, prägt deinen Bauch"],["schlaf","Schlaf","Wo dein Körper sich erholt"],["beweg","Bewegung","Der Antrieb für alles andere"],["recap","Recap · Healthspan","Was das für die nächsten Jahre heißt"]];
  return lay(`<div class="brand">${logo("#F5F7FA")}innen kultur</div>
  <span class="pill">${pill}</span>
  <h1 style="font-size:40px">Gesundheit beginnt <em>innen.</em></h1>
  <p class="lead">Jede Woche ein kleiner Loop: verstehen, ausprobieren, sehen, was es mit dir macht.</p>`,
  `${P.map(([k,t,s])=>`<div class="pillar" style="--s:${PS[k]};--c:${PC[k]}"><span class="ic">${ICON[k]}</span><span><b>${t}</b><span>${s}</span></span></div>`).join("")}
  <button class="btn" data-a="ob" data-v="${S.product?"goals":"code"}" style="margin-top:12px">Los geht's</button>
  <button class="btn link" data-a="ob" data-v="restore">Ich habe schon ein Konto</button>`,"hero");
}
function obHead(back,step,of){
  return `<div class="ob-top"><button class="iconbtn" data-a="ob" data-v="${back}" aria-label="Zurück">${ICON.back}</button>
  ${step?`<div class="steps" aria-label="Schritt ${step} von ${of}">${Array.from({length:of},(_,i)=>`<i class="${i<step?"on":""}"></i>`).join("")}</div>`:""}</div>`;
}
function vCode(){
  return `${obHead("welcome")}
  <h1>Dein Freischaltcode</h1><p class="lead">Er steht in deiner Kaufbestätigung. Deine Einträge bleiben auf diesem Gerät, wir speichern nichts.</p>
  <form class="card" data-form="code"><label for="code" class="note" style="font-weight:600">Freischaltcode</label>
  <input id="code" type="text" autocomplete="off" autocapitalize="characters" placeholder="z. B. BASIS-1234">
  ${flash?`<p class="err">${flash}</p>`:""}
  <button class="btn" type="submit">Freischalten</button></form>
  <div class="card soft"><h2>Erst mal ausprobieren?</h2><p class="note">Die Demo füllt die App mit Beispieldaten aus drei Wochen.</p>
  <div class="btns"><button class="btn ghost small" data-a="demo">Demo mit Beispieldaten</button></div></div>`;
}
function vRestore(){
  return `${obHead("welcome")}
  <h1>Schon dabei?</h1><p class="lead">Hol deinen Stand zurück: mit deiner Sicherungsdatei oder dem Übertragungscode von deinem anderen Gerät.</p>
  ${flash?`<div class="card soft"><p class="err">${flash}</p></div>`:""}
  ${restoreCards()}`;
}
function restoreCards(){
  return `<div class="card"><h2>Sicherung laden</h2><p class="note">Die Datei heißt z. B. „innen-kultur-sicherung-2026-10-24.json“.</p>
  <label class="btn ghost" for="imp">Datei auswählen</label><input id="imp" type="file" accept=".json,application/json" hidden></div>
  <div class="card"><h2>Übertragungscode einfügen</h2><textarea id="tin" rows="3" placeholder="Code vom anderen Gerät"></textarea>
  <button class="btn ghost" data-a="receive">Übernehmen</button></div>`;
}
function vGoals(){
  const d=obD; const n=d.goals.length;
  return `${obHead(S.code||S.demo?"welcome":"code",1,3)}
  <h1>Was willst du verändern?</h1><p class="lead">Wähle bis zu drei. Wir heben passende Inhalte für dich hervor.</p>
  <div style="display:flex;flex-direction:column;gap:8px">${IK.GOALS.map(g=>{const on=d.goals.includes(g.id);
    return `<button type="button" class="choice" data-a="goal" data-v="${g.id}" aria-pressed="${on}" ${!on&&n>=3?"disabled":""}><span class="box">${on?CHECK:""}</span><b>${g.label}</b></button>`;}).join("")}</div>
  <div class="card"><b>Wann willst du an den Check-in denken?</b>
  <div class="times" role="group" aria-label="Uhrzeit für die Erinnerung">${["20:00","21:00","22:00",null].map(t=>`<button type="button" data-a="time" data-v="${t||""}" aria-pressed="${d.reminderTime===t}">${t||"Aus"}</button>`).join("")}</div>
  <p class="note">Heute erinnert dich zu dieser Uhrzeit an deinen Check-in. Push-Nachrichten kommen in einem späteren Update.</p></div>
  <button class="btn" data-a="ob" data-v="consent">Weiter</button>`;
}
function vConsent(){
  const on=!!obD.consent;
  return `${obHead("goals",2,3)}
  <h1>Deine Daten bleiben bei dir</h1>
  <p class="lead">Im Check-in trägst du ein, wie erholt du bist, wie sich dein Bauch anfühlt und wie gestresst du warst. Das sind Gesundheitsdaten.</p>
  <div class="card"><div class="kv"><span>Wo werden sie gespeichert?</span><b>Nur auf diesem Gerät</b></div>
  <div class="kv"><span>Sieht innen kultur sie?</span><b>Nein</b></div>
  <div class="kv"><span>Kannst du sie löschen?</span><b>Jederzeit, unter Profil</b></div>
  <p class="note">Die App ist ein Begleiter für deinen Alltag und ersetzt keine ärztliche Beratung. Bei Beschwerden hol dir bitte ärztlichen Rat.</p></div>
  <button type="button" class="choice" data-a="consent" aria-pressed="${on}"><span class="box">${on?CHECK:""}</span><b>Ich willige ein, dass die App meine Angaben zu Befinden, Schlaf, Ernährung und Bewegung auf diesem Gerät speichert und auswertet. Ich kann die Einwilligung jederzeit widerrufen.</b></button>
  <button class="btn" data-a="ob" data-v="baseline" ${on?"":"disabled"}>Weiter</button>`;
}
function vBaseline(isRebase){
  const d=obD, b=d.baseline, all=IK.BASELINE.every(x=>b[x.key]);
  const lever=IK.biggestLever(b), lb={darm:["Ernährung & Darm","Bunt gegessen"],schlaf:["Schlaf","Morgenlicht und feste Aufstehzeit"],beweg:["Bewegung","30 Min bewegt"]}[lever];
  return `${isRebase?`<div class="ob-top"><button class="iconbtn" data-a="rebase-cancel" aria-label="Abbrechen">${ICON.back}</button></div>`:obHead("consent",3,3)}
  <h1>Wo stehst du gerade?</h1><p class="lead">Ganz spontan, 1 = schlecht, 5 = sehr gut. ${S.product==="komplett"?"Später":"In Woche 4"} vergleichen wir.</p>
  ${isRebase?`<div class="card soft"><p class="note" style="color:var(--ink)">Wenn du deinen Startpunkt neu erfasst, beginnt der Vergleich „Startpunkt → jetzt“ ab heute neu.</p></div>`:""}
  <div class="card">${IK.BASELINE.map(x=>scale("bl."+x.key,x.label,b[x.key],x.pillar?PC[x.pillar]:"var(--navy)")).join("")}</div>
  <div class="card soft"><b>Dein Startpunkt</b>
  <div class="cols" role="img" aria-label="${IK.BASELINE.map(x=>x.label+" "+(b[x.key]||"offen")).join(", ")}">${IK.BASELINE.map(x=>`<div><i style="--c:${x.pillar?PC[x.pillar]:"var(--navy)"};height:${(b[x.key]||0)*16}px"></i><span>${x.short}</span></div>`).join("")}</div>
  ${lever?`<span><b>Dein größter Hebel: ${lb[0]}.</b> Achte in Woche 1 besonders auf „${lb[1]}“.</span>`:`<span class="note">Tipp die fünf Werte an, dann siehst du deinen größten Hebel.</span>`}</div>
  <button class="btn" data-a="${isRebase?"rebase-save":"finish"}" ${all?"":"disabled"}>${isRebase?"Startpunkt speichern":"Woche 1 starten"}</button>`;
}
function startOnboarding(step){ obD=obD||{goals:S.goals.slice(), reminderTime:S.reminderTime, consent:!!S.consentHealthDataAt, baseline:{}}; ob=step; flash=""; render(); window.scrollTo(0,0); }
function unlock(code){
  const c=(code||"").trim().toUpperCase();
  const p=/^KOMPLETT-[A-Z0-9]{4,}$/.test(c)?"komplett":/^BASIS-[A-Z0-9]{4,}$/.test(c)?"basis":null;
  if(!p){ flash="Diesen Code kennen wir nicht. Er beginnt mit BASIS- oder KOMPLETT-."; render(); return; }
  S.code=c; S.product=p; save(); startOnboarding("goals");
}
function finishOnboarding(){
  const now=new Date().toISOString();
  S.goals=obD.goals; S.reminderTime=obD.reminderTime; S.consentHealthDataAt=S.consentHealthDataAt||now;
  S.baselines.push(Object.assign({createdAt:now}, obD.baseline)); S.onboardingCompletedAt=now;
  obD=null; save(); view="heute"; render(); window.scrollTo(0,0);
  if(!S.tourDoneAt) startTour();
}

/* ---------- Heute (Screen 04) ---------- */
function weekInfo(){
  const w=IK.currentWeek(S), today=IK.localDay();
  const todayCi=IK.checkinFor(S,today);
  if(!w) return {w:null, days:0, todayCi, label:"Woche 1 · Start"};
  const cis=IK.checkinsOf(S,w.id);
  return {w, cis, days:cis.length, todayCi, label:`Woche ${w.index} · ${cis.length?`Tag ${cis.length} von 7`:"noch kein Eintrag"}`};
}
// Hinweise auf Heute: höchstens zwei auf einmal, der Wochen-Check hat seine eigene Karte.
/* ---------- Haptik: kurz und eindeutig (Apple HIG). Abschaltbar unter Profil. ---------- */
const HAPTIC = {tap:[10], success:[12,60,18], unlock:[8,40,8], strong:[22,70,32]};
let hapEl=null;
function haptic(kind){
  if(S.haptics===false) return;
  try{ if(navigator.vibrate && navigator.vibrate(HAPTIC[kind]||10)) return; }catch(e){}
  // iPhone: Safari kennt keine Vibrations-Schnittstelle. Ein unsichtbares Switch-Feld löst beim Umschalten das System-Tippen aus.
  // Das ist ein Umweg und kann mit einem iOS-Update wegfallen; ohne ihn funktioniert alles wie gewohnt.
  try{
    if(!hapEl){ hapEl=document.createElement("label"); hapEl.setAttribute("aria-hidden","true");
      hapEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
      hapEl.innerHTML='<input type="checkbox" switch tabindex="-1">'; document.body.appendChild(hapEl); }
    const n = kind==="success"||kind==="strong" ? 2 : 1;
    for(let i=0;i<n;i++) setTimeout(()=>hapEl.click(), i*90);
  }catch(e){}
}

/* ---------- Abendmodus: ab 18 Uhr (bis 4 Uhr) dunkel, unter Profil abschaltbar ---------- */
const isEvening = () => { if(S.eveningMode==="off") return false; const h=new Date().getHours(); return h>=18||h<4; };
function applyTheme(){
  const ev=isEvening(); document.body.classList.toggle("evening",ev); document.documentElement.classList.toggle("evening",ev);
  const m=document.querySelector('meta[name="theme-color"]'); if(m) m.content=ev?"#0F1B28":"#F4F6F9";
}
setInterval(()=>{ if(isEvening()!==document.body.classList.contains("evening")) render(); }, 60000);

function greet(){ const h=new Date().getHours(); return h<11?"Guten Morgen":h<18?"Hallo":"Guten Abend"; }
/* ---------- Heute (Screen 04): ein Fokus, Routinen tagsüber, Glocke ---------- */
const BICON = {bunt:"darm", morgenlicht:"sun", bewegt30:"beweg"};
const RULE = {bunt:"Halber Teller Pflanzen", morgenlicht:"10 Min. draußen, feste Zeit", bewegt30:"Aufgeteilt zählt auch"};
const pvars = p => `--c:${PC[p]};--s:${PS[p]};--t:${PT[p]}`;
const ticksToday = () => ((S.dayTicks||{})[IK.localDay()]) || {};
// Tagsüber abgehakt: vor dem Check-in als Vormerkung, danach direkt im Eintrag des Tages.
function basisState(key){ const ci=IK.checkinFor(S,IK.localDay()); return ci ? !!(ci.basis&&ci.basis[key]) : !!ticksToday()[key]; }
function toggleTick(key){
  const today=IK.localDay(), ci=IK.checkinFor(S,today), on=!basisState(key);
  if(ci) IK.saveCheckIn(S, Object.assign({}, ci, {basis:Object.assign({}, ci.basis, {[key]:on})}), today);
  else S.dayTicks={[today]:Object.assign({}, ticksToday(), {[key]:on})}; // nur der heutige Tag wird gemerkt
  save(); return on;
}
function addMinutes(t,m){ const [h,mi]=t.split(":").map(Number), d=h*60+mi+m; return String(Math.floor(d/60)%24).padStart(2,"0")+":"+String(d%60).padStart(2,"0"); }
// Priorität: Wochen-Check, Abend-Check-in, Morgenlicht, nächstes Video, Check-in für später, erledigt.
function focusOf(i,nx){
  const h=new Date().getHours(), today=IK.localDay(), done=!!i.todayCi, sn=((S.focusSnooze||{})[today])||[], w=i.w;
  if(IK.weekCheckOpen(S)) return {id:"wc", eb:"Dein Wochen-Check", t:`Woche ${w.index} ist komplett`,
    p:`${i.days} Tage eingetragen. Schau dir deine Woche an${w.index===1?" und schalte dein Goodie frei":""}.`, btn:`data-a="go" data-v="wochencheck"`, label:"Wochen-Check öffnen"};
  if(!done && (h>=18||h<4)) return {id:"ci", eb:"Dein Abend-Check-in", t:"Wie war dein Tag?", checks:true, btn:`data-a="go" data-v="checkin"`, label:`Check-in starten <span style="font-weight:500;opacity:.65;font-size:14px">· 1 Min.</span>`};
  if(!done && h<11 && IK.basisUnlocked(S,"morgenlicht") && !basisState("morgenlicht") && !sn.includes("licht"))
    return {id:"licht", eb:"Dein Fokus heute", t:"Raus ins Morgenlicht",
      p:`10 Minuten bei Tageslicht${S.wakeTime?`, am besten bis ${addMinutes(S.wakeTime,60)} Uhr`:", in der ersten Stunde nach dem Aufstehen"}.${S.lightSpot?` Dein Ort: ${esc(S.lightSpot)}.`:""}`,
      btn:`data-a="focus-done" data-v="morgenlicht"`, label:`${ICON.checkin}Erledigt`, later:"licht"};
  if(nx && !sn.includes("video")){ const b=IK.bausteinForVideo(nx.id)||IK.BASIS.find(x=>x.videoId===nx.id);
    return {id:"video", eb:"Heute lernen", t:esc(nx.title), p:`Video ${nx.id} · ${nx.durationMin} Min.${b?` · schaltet „${esc(b.label)}“ frei`:""}`,
      btn:`data-a="video" data-v="${nx.id}"`, label:"Ansehen", later:"video"}; }
  if(!done) return {id:"ci-later", eb:"Heute Abend", t:"Dein Check-in", p:"Dauert eine Minute. Was du tagsüber abhakst, ist dann schon ausgewählt.", btn:`data-a="go" data-v="checkin"`, label:"Jetzt eintragen"};
  return {id:"done", eb:"Heute erledigt", t:"Schön, dass du dranbleibst", p:`Tag ${i.todayCi.dayIndex} von 7 ist eingetragen.${nx?` Als Nächstes wartet Video ${nx.id}.`:""}`, btn:`data-a="go" data-v="checkin"`, label:"Check-in ansehen"};
}
function focusCard(f){
  const checks = f.checks ? `<div class="checks">${IK.BASIS.filter(b=>IK.basisUnlocked(S,b.key)).map(b=>{ const on=basisState(b.key);
      return on ? `<span><i style="--c:${PC[b.pillar]}">${CHECK}</i>${b.label}, schon abgehakt</span>` : `<span class="off-t"><i class="off"></i>${b.label}, noch offen</span>`; }).join("")}</div>` : "";
  return `<section class="focus" aria-label="${esc(f.eb)}"><svg class="blob" viewBox="0 0 100 100" aria-hidden="true"><path d="${BLOBPATH}" fill="#E9765B"/></svg>
    <span class="eb">${f.eb}</span><h2 class="ft">${f.t}</h2>${f.p?`<p>${f.p}</p>`:""}${checks}
    <div class="acts"><button class="btn white" ${f.btn}>${f.label}</button>${f.later?`<button class="btn later" data-a="focus-later" data-v="${f.later}">Später</button>`:""}</div></section>`;
}
function routinesCard(){
  const un=IK.BASIS.filter(b=>IK.basisUnlocked(S,b.key)), n=un.filter(b=>basisState(b.key)).length;
  return `<section aria-label="Deine Routinen heute" style="display:flex;flex-direction:column;gap:10px"><div class="rt-hd"><b>Deine Routinen heute</b><span class="note">${un.length?`${n} von ${un.length}`:"ab Video 1.1"}</span></div>
  <div class="rts">${IK.BASIS.map(b=>{
    if(!IK.basisUnlocked(S,b.key)) return `<button class="rt locked" data-a="video" data-v="${b.videoId}" style="${pvars(b.pillar)}"><span class="ic">${ICON[BICON[b.key]]}</span><span><b>${b.label}</b><br><small>nach Video ${b.videoId}</small></span></button>`;
    const on=basisState(b.key);
    return `<button class="rt" data-a="tick" data-v="${b.key}" aria-pressed="${on}" style="${pvars(b.pillar)}"><span class="ic">${on?ICON.checkin:ICON[BICON[b.key]]}</span><b>${b.label}</b></button>`; }).join("")}</div></section>`;
}
function learnCard(nx){
  const p=pillarOf(nx), b=IK.bausteinForVideo(nx.id)||IK.BASIS.find(x=>x.videoId===nx.id);
  return `<button class="learn" data-a="video" data-v="${nx.id}" style="${pvars(p)}"><span class="thumb"><span class="nr">${nx.id}</span><span class="pl"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 20 12 7 20Z"/></svg></span></span>
    <span class="tx"><span class="eyebrow" style="color:${PT[p]}">Weiterlernen · ${pillarLabel(nx)}</span><b>${esc(nx.title)}</b><span class="note">${nx.durationMin} Min.${b?` · schaltet „${esc(b.label)}“ frei`:""}</span></span></button>`;
}
function starterRow(){
  if(!starterActive()) return "";
  const st=IK.todoStatus(S,IN.TODOS), d=st.filter(t=>t.done).length, nxt=st.find(t=>!t.done&&t.unlocked)||st.find(t=>!t.done), C=2*Math.PI*16;
  return `<button class="srow starter-card" data-a="go" data-v="starter"><svg class="mring" width="40" height="40" viewBox="0 0 40 40" role="img" aria-label="${d} von ${st.length} erledigt"><circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" stroke-width="5"/><circle cx="20" cy="20" r="16" fill="none" stroke="var(--recap)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C*d/st.length} ${C}" transform="rotate(-90 20 20)"/></svg>
    <span><b>Starter-Liste · ${d} von ${st.length}</b><span class="note">${nxt?`Als Nächstes: ${esc(nxt.title)}${nxt.unlocked?"":` (nach Video ${nxt.after})`}`:"Alles erledigt"}</span></span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>`;
}
function weekCard(i,cw,vp){
  const w=i.w, cis=i.cis||[], act=IK.activeBausteine(w);
  const upcoming=IK.BAUSTEINE.filter(b=>b.courseWeek<=cw&&!act.includes(b)&&!(S.pausedBausteinIds||[]).includes(b.id));
  const marks=on=>`<span class="marks" aria-label="${cis.filter(on).length} von ${cis.length} Tagen">${Array.from({length:7},(_,d)=>`<i class="${cis[d]&&on(cis[d])?"on":""}"></i>`).join("")}</span>`;
  const bRow=b=>`<span><span class="dot" style="--c:${PC[b.pillar]}"></span>${esc(b.label)}</span>`+(b.kind==="weeklyCount"
    ? `<b class="num" style="font-size:13px">${weeklyCountOf(cis,b.id)} von ${b.weeklyTarget}</b>` : `<span style="--c:${PC[b.pillar]}">${marks(c=>c.bausteine&&c.bausteine[b.id]===true)}</span>`);
  const upRow=b=>`<span><span class="dot" style="--c:${PC[b.pillar]}"></span>${esc(b.label)}</span><span class="note" style="font-size:12px">${IK.isSeen(S,b.videoId)?"ab nächster Woche":"nach Video "+b.videoId}</span>`;
  const big=(l,a,b,c)=>`<div style="display:flex;flex-direction:column;gap:6px"><span class="note">${l}</span><b class="num" style="font-family:var(--f-head);font-size:22px;font-weight:800">${a} <small style="font-family:var(--f-body);font-size:13px;font-weight:500;color:var(--muted)">von ${b}</small></b><div class="bar" style="--c:${c}"><i style="width:${b?Math.round(a/b*100):0}%"></i></div></div>`;
  return `<div class="card"><b style="font-size:17px">Diese Woche${w?` · Woche ${w.index}`:""}</b><div class="g2">${big(`Wissen · Kurswoche ${cw}`,vp.seen,vp.total,"var(--blue)")}${big("Umsetzung · Tage",i.days,7,"var(--darm)")}</div>
    ${act.length||upcoming.length?`<div class="exp">${act.map(bRow).join("")}${upcoming.map(upRow).join("")}</div>`:`<p class="note">Ab Kurswoche 2 kommen Bausteine dazu, jeweils nach dem Video, das sie erklärt.</p>`}</div>`;
}
function vHeute(){
  const i=weekInfo(), t=weeksTotal(), cw=IK.currentCourseWeek(VID.VIDEOS,S,t), vp=IK.weekVideoProgress(VID.VIDEOS,S,cw), nx=IK.nextVideo(VID.VIDEOS,S,t);
  const f=focusOf(i,nx), n=openNotices().length, day=new Date().toLocaleDateString("de-DE",{weekday:"long"});
  return `${brandBar(`<button class="iconbtn bell" data-a="sheet" aria-label="${n?`${n} neue Freischaltungen`:"Neu für dich"}">${ICON.bell}${n?`<span class="badge">${n}</span>`:""}</button>`)}
  <div class="top"><div class="t"><small>${day} · ${esc(i.label)}</small><b>${greet()}</b></div></div>
  ${flash?`<div class="card soft"><p class="okmsg">${flash}</p></div>`:""}
  ${lay(`${focusCard(f)}${routinesCard()}${f.id!=="video"&&nx?learnCard(nx):""}${starterRow()}`, weekCard(i,cw,vp))}
  <p class="note" style="text-align:center">${S.product==="komplett"?"Komplett":"Basis"} · ${t} Wochen${S.demo?" · Demo":""}</p>`;
}

/* ---------- Neu für dich: Freischaltungen als Blatt von unten ---------- */
let sheetOpen=false, sheetItem=null;
function noticeIcon(e,n){
  if(e.type==="basis") return ICON[BICON[e.ref]];
  if(e.type==="baustein") return ICON[IK.bausteinById(e.ref).pillar];
  if(e.type==="weekcheck") return ICON.checkin;
  return ICON.doc;
}
function sheetHTML(){
  const list=openNotices(); if(sheetItem===null && list[0]) sheetItem=list[0].id;
  const item=e=>{ const n=noticeOf(e); if(!n) return ""; const open=sheetItem===e.id;
    return `<div class="ni${open?" open":""}" style="${pvars(n.pillar)}"><button data-a="sheet-item" data-v="${e.id}" aria-expanded="${open}"><span class="nic">${noticeIcon(e,n)}</span><span class="ntx"><small>${esc(n.kicker)}</small><b>${esc(n.title)}</b></span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;fill:none;stroke:var(--muted);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transform:rotate(${open?90:0}deg)"><path d="m9 6 6 6-6 6"/></svg></button>
      ${open?`<div class="nbody"><dl class="www"><div><dt>Wieso</dt><dd>${esc(n.why)}</dd></div><div><dt>Wann</dt><dd>${esc(n.when)}</dd></div><div><dt>Wo</dt><dd>${esc(n.where)}</dd></div></dl>
        <div class="btns">${n.go?`<button class="btn small" ${gAttr(n.go)} data-n="${e.id}">${esc(n.go.label||"Hin")}</button>`:""}<button class="btn ghost small" data-a="notice-ok" data-v="${e.id}">Verstanden</button></div></div>`:""}</div>`; };
  return `<div class="sheet-bg" data-a="sheet-close"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t" data-a="noop"><span class="grab" aria-hidden="true"></span>
    <div class="sh"><h2 id="sh-t">Neu für dich</h2><button class="iconbtn" data-a="sheet-close" aria-label="Schließen" style="background:var(--chip);box-shadow:none">${ICON.close}</button></div>
    ${list.length ? `<div>${list.map(item).join("")}</div><button class="btn ghost" data-a="notice-all">Alle als gelesen markieren</button>`
      : `<div style="display:flex;justify-content:center;padding:8px 0">${mark(56,"var(--card)")}</div><p class="note" style="font-size:15px;line-height:1.5;text-align:center">Alles gesehen. Neues erscheint hier, sobald du etwas freischaltest, zum Beispiel mit deinem nächsten Video.</p>`}</section></div>`;
}
const pillarOf = v => v.pillar==="intro" ? "recap" : v.pillar;
const pillarLabel = v => v.pillar==="intro" ? "Intro" : IK.PILLARS[v.pillar].label;
function weeklyCountOf(cis,id,skipId){ return cis.filter(c=>c.id!==skipId&&c.bausteine&&(c.bausteine[id]===true||(typeof c.bausteine[id]==="number"&&c.bausteine[id]>0))).length; }

/* ---------- Abend-Check-in (Screen 07) ---------- */
// Für einen neuen Tag ohne laufende Woche beginnt mit dem Speichern eine neue Tracker-Woche. Dann gelten die Kandidaten aus §5.2.
function checkinTarget(){
  const today=IK.localDay(), ex=IK.checkinFor(S,today);
  if(ex){ const w=S.weeks.find(x=>x.id===ex.trackerWeekId); return {ex, wk:w, week:w.index, day:ex.dayIndex, ids:w.activeBausteinIds, isNew:w.newBausteinIds||[]}; }
  const w=IK.currentWeek(S);
  if(w && w.status==="running") return {ex:null, wk:w, week:w.index, day:IK.checkinsOf(S,w.id).length+1, ids:w.activeBausteinIds, isNew:w.newBausteinIds||[]};
  const paused=S.pausedBausteinIds||[], kept=w?w.activeBausteinIds.filter(id=>!paused.includes(id)):[];
  const cands=IK.newWeekCandidates(S, new Date().toISOString());
  return {ex:null, wk:null, week:(w?w.index+1:1), day:1, kept, cands, choose:cands.length>IK.MAX_NEW_PER_WEEK};
}
let ciStep=1, ciMore=false, lastSaved=null;
function vCheckin(){
  const t=checkinTarget();
  if(!draft){ draft = t.ex ? JSON.parse(JSON.stringify(t.ex)) : {basis:Object.assign({bunt:false,morgenlicht:false,bewegt30:false}, ticksToday()), bausteine:{}};
    if(t.cands) draft.newBausteinIds=t.cands.slice(0,IK.MAX_NEW_PER_WEEK);
    ciMore = !!(t.ex && (t.ex.schlafStunden!=null||t.ex.pflanzen!=null||t.ex.bewegungMin!=null)); }
  const ids = t.cands ? t.kept.concat(draft.newBausteinIds) : t.ids;
  const isNew = t.cands ? draft.newBausteinIds : t.isNew;
  const cis = t.wk ? IK.checkinsOf(S,t.wk.id) : [];
  const prog=`<div class="cprog" role="img" aria-label="Schritt ${ciStep} von 3">${[1,2,3].map(k=>`<i class="${k<=ciStep?"on":""}"></i>`).join("")}</div>`;
  const head=`<div class="top"><div class="t"><small>Woche ${t.week} · Tag ${t.day} von 7</small>${prog}</div>${ciStep===1
    ? `<button class="iconbtn" data-a="back" data-v="heute" aria-label="Schließen">${ICON.close}</button>` : `<button class="iconbtn" data-a="ci-back" aria-label="Zurück">${ICON.back}</button>`}</div>`;
  if(ciStep===1){
    const tk=t.ex?{}:ticksToday(), un=IK.BASIS.filter(b=>IK.basisUnlocked(S,b.key)), n=un.filter(b=>draft.basis[b.key]).length;
    const basisTile=b=>{ if(!IK.basisUnlocked(S,b.key)) return `<button class="ctile locked" data-a="video" data-v="${b.videoId}" style="${pvars(b.pillar)}"><span class="ic">${ICON[BICON[b.key]]}</span><span class="tx"><b>${b.label}</b><small>Frei nach Video ${b.videoId}</small></span></button>`;
      const on=!!draft.basis[b.key];
      return `<button class="ctile" data-a="basis" data-v="${b.key}" aria-pressed="${on}" style="${pvars(b.pillar)}"><span class="ic">${ICON[BICON[b.key]]}</span><span class="tx"><b>${b.label}</b><small>${RULE[b.key]}${on&&tk[b.key]?" · tagsüber abgehakt":""}</small></span><span class="mk" aria-hidden="true">${on?CHECK:""}</span></button>`; };
    const bstTile=id=>{ const b=IK.bausteinById(id), on=draft.bausteine[id]===true;
      const sub = b.kind==="weeklyCount" ? `${weeklyCountOf(cis,id,t.ex&&t.ex.id)+(on?1:0)} von ${b.weeklyTarget} diese Woche` : isNew.includes(id) ? "neu diese Woche" : "Baustein";
      return `<button class="ctile" data-a="bst" data-v="${id}" aria-pressed="${on}" style="${pvars(b.pillar)}"><span class="ic">${ICON[b.pillar]}</span><span class="tx"><b>${esc(b.label)}${b.kind==="weeklyCount"?" heute":""}</b><small>${sub}</small></span><span class="mk" aria-hidden="true">${on?CHECK:""}</span></button>`; };
    const chooser = t.choose ? `<div class="card soft"><b>Neue Woche: Wähle bis zu ${IK.MAX_NEW_PER_WEEK} neue Bausteine</b>
      <p class="note">Du hast mehr freigeschaltet, als in eine Woche passen. Die übrigen kommen in einer der nächsten Wochen dran.</p>
      ${t.cands.map(id=>{const b=IK.bausteinById(id), on=draft.newBausteinIds.includes(id); return `<button type="button" class="choice" data-a="pick-new" data-v="${id}" aria-pressed="${on}" ${!on&&draft.newBausteinIds.length>=IK.MAX_NEW_PER_WEEK?"disabled":""}><span class="box">${on?CHECK:""}</span><span class="dot" style="--c:${PC[b.pillar]}"></span><b>${esc(b.label)}</b></button>`;}).join("")}</div>` : "";
    return `${head}<h1 class="ci-h">Was hat heute geklappt?</h1>
    <div class="ctiles">${IK.BASIS.map(basisTile).join("")}</div>
    ${chooser}
    ${ids.length?`<div class="ctiles">${ids.map(bstTile).join("")}</div>`:t.choose?"":`<p class="cnote">Ab Woche 2 kommen hier deine Bausteine dazu, immer nach dem Video, das sie erklärt.</p>`}
    <div class="cfoot"><button class="btn" data-a="ci-next">Weiter${un.length?` <span>· ${n} von ${un.length}</span>`:""}</button></div>`;
  }
  const caps={erholt:["kaum","sehr"],bauch:["unruhig","sehr gut"],energie:["müde","voller Energie"],stress:["entspannt","sehr gestresst"]};
  const num=(k,label,mode,ph)=>`<label for="n-${k}">${label}<input id="n-${k}" data-num="${k}" inputmode="${mode}" placeholder="${ph}" value="${draft[k]!=null?String(draft[k]).replace(".",","):""}"></label>`;
  const sc=s=>`<div class="cscale"><b>${s.label}</b><div class="seg" role="group" aria-label="${esc(s.label)}">${[1,2,3,4,5].map(i=>`<button type="button" data-a="set" data-k="ci.${s.key}" data-v="${i}" aria-pressed="${draft[s.key]===i}">${i}</button>`).join("")}</div><div class="seg-cap"><span>${caps[s.key][0]}</span><span>${caps[s.key][1]}</span></div></div>`;
  return `${head}<h1 class="ci-h">Wie war dein Tag?</h1>
  ${IK.SCALES.map(sc).join("")}
  <button class="more" data-a="ci-more" aria-expanded="${ciMore}">Mehr eintragen (optional)<span aria-hidden="true">${ciMore?"−":"+"}</span></button>
  <div class="nums" ${ciMore?"":"hidden"}>${num("schlafStunden","Schlaf (Std.)","decimal","7,0")}${num("pflanzen","Pflanzen heute","numeric","0")}${num("bewegungMin","Bewegung (Min.)","numeric","0")}</div>
  <div class="cfoot"><button class="btn" data-a="save-ci">Tag ${t.day} ${t.ex?"aktualisieren":"speichern"}</button></div>`;
}
function saveCheckin(){
  readNums();
  const t=checkinTarget();
  const data=Object.assign({}, draft, {forDate:IK.localDay()});
  if(!t.choose) delete data.newBausteinIds;
  let ci;
  try{ ci=IK.saveCheckIn(S, data, IK.localDay()); }catch(e){ flash=e.message; go("heute"); return; }
  S.dayTicks={}; save(); draft=null; ciStep=1;
  const w=IK.currentWeek(S);
  lastSaved={day:ci.dayIndex, updated:!!t.ex, basisN:IK.basisScore(ci), weekDone:w.status==="awaitingCheck"};
  haptic(lastSaved.weekDone?"strong":"success");
  view="geschafft"; render(); window.scrollTo(0,0);
}
function vGeschafft(){
  const L=lastSaved; if(!L){ view="heute"; return vHeute(); }
  const w=IK.currentWeek(S), cis=w?IK.checkinsOf(S,w.id):[], ls=w?IK.loopScore(cis,IK.activeBausteine(w)):{score:null};
  const un=IK.BASIS.filter(b=>IK.basisUnlocked(S,b.key)).length, n=L.basisN, days=cis.length, C=2*Math.PI*58, wc=IK.weekCheckOpen(S);
  const msg = L.updated ? "Deine Änderungen sind gespeichert."
    : !un ? "Eingetragen. Mit den ersten Videos kommen deine Routinen dazu."
    : n>=un ? "Alle Routinen geschafft. Stark."
    : n ? `${n} von ${un} Routinen. Gut gemacht, der Rest kommt mit der Zeit.` : "Eingetragen ist eingetragen. Morgen ist ein neuer Tag.";
  const nx=IK.nextVideo(VID.VIDEOS,S,weeksTotal());
  const rows=[];
  if(ls.score!=null) rows.push([`Loop-Score${w&&w.status==="running"?", Zwischenstand":""}`,`<b style="font-family:var(--f-head);font-size:22px;font-weight:800">${ls.score}</b>`]);
  if(wc) rows.push(["Wochen-Check","<b>jetzt offen</b>"]);
  if(IK.basisUnlocked(S,"morgenlicht")) rows.push(["Morgen früh",`<b>Morgenlicht${S.wakeTime?" · "+esc(S.wakeTime):""}</b>`]);
  if(nx) rows.push(["Nächstes Video",`<b>${nx.id} ${esc(nx.title.split(":")[0])}</b>`]);
  return `<div class="done"><svg class="big" viewBox="0 0 132 132" role="img" aria-label="Tag ${L.day} gespeichert"><circle cx="66" cy="66" r="58" fill="none" stroke="var(--line)" stroke-width="8"/>
    <circle class="arc" cx="66" cy="66" r="58" fill="none" stroke="var(--coral)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C*days/7} ${C}" style="--len:${C*days/7}" transform="rotate(-90 66 66)"/>
    <g class="mk"><path d="${BLOBPATH}" transform="translate(23 23) scale(.86)" style="fill:var(--coral)"/><path d="M50 67 62 78 84 55" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
    <h1>Tag ${L.day} ${L.updated?"aktualisiert":"geschafft"}</h1><p class="lead">${msg}</p>
    <div class="wk7" role="img" aria-label="${days} von 7 Tagen eingetragen">${Array.from({length:7},(_,k)=>`<i class="${k<days?"on":""}"></i>`).join("")}</div>
    ${rows.length?`<div class="list">${rows.map(([a,b])=>`<div><span>${a}</span>${b}</div>`).join("")}</div>`:""}
    <button class="btn" data-a="${wc?"go":"back"}" data-v="${wc?"wochencheck":"heute"}" style="min-height:58px;border-radius:18px;font-size:17px">${wc?"Zum Wochen-Check":"Fertig"}</button></div>`;
}

function readNums(){
  document.querySelectorAll("[data-num]").forEach(el=>{
    const k=el.dataset.num, v=parseFloat(el.value.replace(",","."));
    if(isNaN(v)){ draft[k]=undefined; return; }
    draft[k] = k==="schlafStunden" ? Math.min(14,Math.max(0,Math.round(v*2)/2)) : Math.min(k==="pflanzen"?60:600,Math.max(0,Math.round(v)));
  });
}

/* ---------- Fortschritt (Screen 10, erster Stand) ---------- */
function loopRing(score){ const C=2*Math.PI*46;
  return `<svg viewBox="0 0 110 110" role="img" aria-label="Loop-Score ${score} von 100"><circle cx="55" cy="55" r="46" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="55" cy="55" r="46" fill="none" stroke="var(--coral)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C*score/100} ${C}" transform="rotate(-90 55 55)"/><text x="55" y="63" text-anchor="middle" font-family="Epilogue,sans-serif" font-weight="800" font-size="30" fill="var(--ink)">${score}</text></svg>`; }
const loopPart=(l,v,c)=>`<div><div class="row"><span>${l}</span><b class="num">${v}</b></div><div class="bar" style="--c:${c}"><i style="width:${v}%"></i></div></div>`;
// Beispiel mit Erklärung der drei Teile. withStart = zusätzlich Startpunkt → jetzt.
function loopExample(withStart){
  const E=IN.LOOP_EXAMPLE, r=IK.loopScoreFromParts(E.values), W=IK.WEIGHTS, pc=x=>Math.round(x*100)+" %";
  return `<div class="loopex"><div class="ring">${loopRing(r.score)}<div class="parts">${loopPart("Befinden",r.befinden,"var(--schlaf)")}${loopPart("Umsetzung",r.umsetzung,"var(--darm)")}${loopPart("Dranbleiben",r.dranbleiben,"var(--recap)")}</div></div>
    <ul class="loopex-l"><li><b>Befinden · zählt ${pc(W.befinden)}</b><span>Wie erholt, energiegeladen und entspannt du warst und wie sich dein Bauch angefühlt hat.</span></li>
      <li><b>Umsetzung · zählt ${pc(W.umsetzung)}</b><span>Wie viele Basis-Routinen und Bausteine du geschafft hast.</span></li>
      <li><b>Dranbleiben · zählt ${pc(W.dranbleiben)}</b><span>An wie vielen der 7 Tage du eingecheckt hast, im Beispiel an 6.</span></li></ul>
    ${withStart?`<b>Startpunkt → jetzt</b><table><tbody>${E.start.map(([l,a,b])=>`<tr><td>${l}</td><td>${a} → ${fmt1(b)}</td><td style="font-weight:700;width:56px">${fmtSigned(Math.round((b-a)*10)/10)}</td></tr>`).join("")}</tbody></table>
    <p class="note">Werte von 1 bis 5: dein Startpunkt aus dem Onboarding gegen den Durchschnitt deiner letzten Woche.</p>`:""}</div>`;
}
const scoreWord = s => s>=75 ? "Läuft sehr rund" : s>=60 ? "Läuft rund" : s>=45 ? "Kommt in Schwung" : "Am Anfang";
function vFortschritt(){
  const weeks=S.weeks.map(w=>{ const c=IK.checkinsOf(S,w.id), act=IK.activeBausteine(w); return {w, c, ls:IK.loopScore(c,act), st:IK.weekStats(c,act)}; });
  const cur=weeks[weeks.length-1];
  const why=S.why?`<div class="card soft why-card"><span class="eyebrow" style="color:var(--recap-text)">Dein Warum</span><b>${esc(S.why)}</b></div>`:"";
  const head=`${brandBar()}<div class="top"><div class="t"><small>Wie rund dein Loop läuft</small><b>Fortschritt</b></div></div>`;
  if(!cur||cur.ls.score==null) return head+why+lay(`<div class="card"><h2>Noch kein Loop-Score</h2><p class="note">Er erscheint nach deinem ersten Check-in mit den vier Skalen und wird mit jedem Tag genauer. So sieht er nach einer Woche aus:</p><button class="btn small" data-a="go" data-v="checkin">Zum Check-in</button></div>`,
    `<div class="card example"><span class="eyebrow" style="color:var(--recap-text)">Beispiel nach einer Woche</span>${loopExample(true)}</div>`);
  const s=cur.ls, running=cur.w.status==="running", prev=weeks.length>1?weeks[weeks.length-2].ls.score:null, trend=prev!=null?s.score-prev:null, C=2*Math.PI*56;
  const ring=`<svg viewBox="0 0 132 132" role="img" aria-label="Loop-Score ${s.score} von 100"><circle cx="66" cy="66" r="56" fill="none" stroke="var(--line)" stroke-width="14"/><circle cx="66" cy="66" r="56" fill="none" stroke="var(--coral)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${C*s.score/100} ${C}" transform="rotate(-90 66 66)"/>
    <text x="66" y="72" text-anchor="middle" font-family="Epilogue,sans-serif" font-weight="800" font-size="40" fill="var(--ink)">${s.score}</text><text x="66" y="92" text-anchor="middle" font-family="Inter,sans-serif" font-weight="600" font-size="11" fill="var(--muted)">von 100</text></svg>`;
  const p3=(l,v,c)=>`<div><span>${l}</span><b>${v}</b><div class="bar" style="--c:${c}"><i style="width:${v}%"></i></div></div>`;
  const done=weeks.filter(x=>x.w.status!=="running"), last=done[done.length-1], cmp=last?IK.compareToStart(latestBaseline(), last.st.avg):[];
  const bars=weeks.slice(-6).map((x,k,arr)=>{ const v=x.ls.score, isCur=k===arr.length-1;
    return `<div><b>${v==null?"–":v}</b><i class="${isCur?"cur":""}" style="height:${Math.max(6,Math.round((v||0)*0.8))}px"></i><span>W${x.w.index}${x.w.status==="running"?" · läuft":""}</span></div>`; }).join("");
  return head+why+lay(`<section class="lhero" aria-label="Loop-Score"><div class="top2">${ring}<div style="display:flex;flex-direction:column;gap:4px"><span class="eyebrow" style="color:var(--muted)">Loop-Score · Woche ${cur.w.index}${running?" · Zwischenstand":""}</span><b class="word">${scoreWord(s.score)}</b>
      ${trend!=null?`<span class="trend" style="${trend<0?"color:var(--muted)":""}">${trend>0?"+":trend<0?"−":"±"}${Math.abs(trend)} zur Vorwoche</span>`:`<span class="note">Dein erster Wert</span>`}</div></div>
    <div class="parts3">${p3("Befinden",s.befinden,"var(--schlaf)")}${p3("Umsetzung",s.umsetzung,"var(--darm)")}${p3("Dranbleiben",s.dranbleiben,"var(--recap)")}</div></section>
    <div class="card"><b style="font-size:15px">Dein Verlauf</b><div class="wbars" role="img" aria-label="Loop-Score je Woche: ${weeks.map(x=>`Woche ${x.w.index} ${x.ls.score==null?"offen":x.ls.score}`).join(", ")}">${bars}</div></div>`,
  `<div class="card"><b style="font-size:15px">Startpunkt → jetzt</b>
  ${last?`<p class="note">Vergleich mit Woche ${last.w.index}, deiner letzten abgeschlossenen Woche.</p>
    <table><tbody>${cmp.map(r=>`<tr><td>${r.label}</td><td>${r.text?esc(r.text):r.start+" → "+fmt1(r.now)}</td><td style="font-weight:700;width:56px;color:${r.diff>0?"var(--darm-text)":"inherit"}">${r.text?"":fmtSigned(r.diff)}</td></tr>`).join("")}</tbody></table>
    <p class="note">Startwerte 1 bis 5 aus deinem Onboarding. „Entspannt sein“ ist 6 minus dein Ø Stress.</p>`
    :`<p class="note">Erscheint, sobald deine erste Tracker-Woche abgeschlossen ist.</p>`}</div>`);
}

/* ---------- Kurs (Screen 05) und Video (Screen 06) ---------- */
const LOCK='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
function vKurs(){
  const maxW=weeksTotal(), weeks=Object.keys(VID.WEEKS).map(Number).filter(n=>n<=maxW);
  if(kursWeek==null||!weeks.includes(kursWeek)) kursWeek=IK.currentCourseWeek(VID.VIDEOS,S,maxW);
  const p=IK.weekVideoProgress(VID.VIDEOS,S,kursWeek), nx=IK.nextVideo(VID.VIDEOS,S,maxW);
  const vids=VID.VIDEOS.filter(v=>v.week===kursWeek).sort((a,b)=>a.order-b.order);
  const part=kursWeek<=4?"basis":"komplett", partWeeks=Object.keys(VID.WEEKS).map(Number).filter(n=>part==="basis"?n<=4:n>4), kOpen=maxW>4, C=2*Math.PI*12;
  const kseg=`<div class="kseg" role="group" aria-label="Kursteil"><button data-a="kurspart" data-v="basis" aria-pressed="${part==="basis"}">Basis</button>${kOpen
    ? `<button data-a="kurspart" data-v="komplett" aria-pressed="${part==="komplett"}">Komplett</button>` : `<button data-a="go" data-v="profil" aria-pressed="false" aria-label="Komplett freischalten">${LOCK}Komplett</button>`}</div>`;
  const chip=n=>{ const q=IK.weekVideoProgress(VID.VIDEOS,S,n), on=kursWeek===n, f=q.total?q.seen/q.total:0;
    return `<button class="wchip" data-a="kursweek" data-v="${n}" aria-pressed="${on}" aria-label="Woche ${n}, ${q.seen} von ${q.total} gesehen"><svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="12" fill="none" stroke="${on?"currentColor":"var(--line)"}" stroke-opacity="${on?0.25:1}" stroke-width="3.5"/><circle cx="15" cy="15" r="12" fill="none" stroke="${on?"currentColor":"var(--blue)"}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${C*f} ${C}" transform="rotate(-90 15 15)"/></svg><span>Woche ${n}</span></button>`; };
  // Themenfilter: „Alle“ zeigt die empfohlene Reihenfolge neutral, ein Thema färbt die Liste in seiner Farbe.
  const PL={darm:"Darm",schlaf:"Schlaf",beweg:"Bewegung",recap:"Recap"};
  const present=Object.keys(PL).filter(p=>vids.some(v=>v.pillar===p));
  if(kursFilter!=="alle"&&!present.includes(kursFilter)) kursFilter="alle";
  const shown=kursFilter==="alle"?vids:vids.filter(v=>v.pillar===kursFilter);
  const vfil=present.length>1?`<label class="vsel${kursFilter!=="alle"?" on":""}" style="${kursFilter!=="alle"?pvars(kursFilter):""}"><i aria-hidden="true"></i><select data-kf aria-label="Nach Thema filtern"><option value="alle"${kursFilter==="alle"?" selected":""}>Alle Themen</option>${present.map(p=>`<option value="${p}"${kursFilter===p?" selected":""}>${PL[p]}</option>`).join("")}</select><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></label>`:"";
  const row=v=>{ const seen=IK.isSeen(S,v.id), isNext=nx&&nx.id===v.id, b=IK.bausteinForVideo(v.id)||IK.BASIS.find(x=>x.videoId===v.id);
    const vars = kursFilter!=="alle"&&PL[v.pillar] ? pvars(v.pillar) : "--s:var(--chip);--t:var(--muted)";
    const topic = kursFilter==="alle"&&PL[v.pillar] ? PL[v.pillar]+" · " : "";
    return `<button class="vrow" data-a="video" data-v="${v.id}" style="${vars}"><span class="vn">${v.id}</span><span class="tx"><b>${esc(v.title)}</b><span class="note">${topic}${v.type} · ${v.durationMin} Min.${b?" · "+esc(b.label):""}</span></span>
      <span class="st${seen?" on":""}${isNext?" nx":""}" aria-hidden="true">${seen?CHECK:isNext?"▶":""}</span><span class="sr">${seen?"gesehen":isNext?"als Nächstes":"offen"}</span></button>`; };
  const ho=hoOf(kursWeek), hoFree=p.handoutFree&&ho;
  const kern=VID.VIDEOS.filter(v=>v.week===kursWeek&&v.type==="Kern").map(v=>v.id);
  const hAttr = hoFree ? `data-a="mat" data-v="${ho.id}" data-go-lib="1"` : p.handoutFree ? `data-a="noop"` : `data-a="lock" data-v="ho:${kursWeek}"`;
  const hcard=`<button class="hcard kurs-extra" ${hAttr}><span class="hic">${ICON.doc}</span><span><span class="row"><b style="font-size:14px">Handout Woche ${kursWeek}</b><span class="note">${p.handoutFree?(ho?"frei · öffnen":"frei, folgt als Datei"):`${p.kernSeen} von ${p.kernTotal} Kernvideos`}</span></span>
    <span class="bar" style="--c:var(--recap)"><i style="width:${p.kernTotal?Math.round(p.kernSeen/p.kernTotal*100):0}%"></i></span><span class="note">Goodie · mit dem Wochen-Check</span></span></button>`;
  return `${brandBar()}<div class="top"><div class="t"><small>Wissen · alle Videos frei</small><b>Kurs</b></div>${kseg}</div>
  <div class="wchips" role="group" aria-label="Kurswochen">${partWeeks.map(chip).join("")}</div>
  <div style="display:flex;flex-direction:column;gap:2px;padding:0 4px"><b style="font-family:var(--f-head);font-size:22px;font-weight:800;letter-spacing:-.02em">${esc(VID.WEEKS[kursWeek].title)}</b><span class="note">Woche ${kursWeek} · ${p.seen} von ${p.total} Videos · alles frei, in deinem Tempo</span></div>
  ${hcard}
  ${vfil}<div class="vlist${kursFilter!=="alle"?" vlist-f":""}">${shown.map(row).join("")}</div>`;
}

const hoOf = w => IN.MATERIALS.find(m=>m.kind==="Handout"&&m.week===w) || null;
function vVideo(){
  const v=VID.VIDEOS.find(x=>x.id===videoId); if(!v){ view="kurs"; return vKurs(); }
  const seen=IK.isSeen(S,v.id), b=IK.bausteinForVideo(v.id), list=VID.VIDEOS.filter(x=>x.week<=weeksTotal()).sort((a,c)=>a.week-c.week||a.order-c.order);
  const after=list.slice(list.indexOf(v)+1), next=after.find(x=>!IK.isSeen(S,x.id))||after[0]||null;
  let bCard="";
  if(b&&seen){ const st=IK.activationState(S,b.id), paused=(S.pausedBausteinIds||[]).includes(b.id);
    const txt = paused ? "Du hast ihn pausiert. Unter Profil kannst du ihn wieder aufnehmen."
      : st==="active" ? "Er ist in deinem Check-in dabei. Du kannst ihn jederzeit pausieren."
      : st==="queued" ? "Er ist ab deiner nächsten Tracker-Woche im Check-in."
      : st==="full" ? `Diese Woche sind schon ${IK.MAX_NEW_PER_WEEK} neue Bausteine dabei. Er kommt mit deiner nächsten Tracker-Woche dazu.`
      : "Er kommt mit deiner nächsten Tracker-Woche in den Check-in. Oder du startest gleich:";
    bCard=tcard(b.pillar,`<span class="k">Neuer Baustein</span><b class="tt">${esc(b.label)}</b><p>${txt}</p>
      ${st==="ok"&&!paused?`<div class="btns"><button class="btn small" data-a="activate" data-v="${b.id}">Ab heute mittracken</button></div>`:""}`); }
  return lay(`<div class="player"><button class="iconbtn" data-a="back" data-v="kurs" aria-label="Zurück">${ICON.back}</button>
    <span class="ph">Der Video-Player kommt, sobald die Kurs-Plattform feststeht.</span>
    <div class="bar" style="--c:#fff;background:rgba(255,255,255,.25)"><i style="width:${seen?100:0}%"></i></div>
    <div class="row note" style="color:#C9D6E6"><span>${v.durationMin} Min.</span><span>${seen?"gesehen":"noch nicht gesehen"}</span></div></div>
  <div style="display:flex;flex-direction:column;gap:4px;padding:0 4px"><span class="eyebrow" style="color:${PT[pillarOf(v)]}">Woche ${v.week} · ${pillarLabel(v)} · ${v.type}</span><h1 style="font-size:26px">${esc(v.title)}</h1></div>
  ${flash?`<div class="card soft"><p class="okmsg">${flash}</p></div>`:""}`,
  `${seen?"":`<div class="card"><button class="btn" data-a="seen" data-v="${v.id}">Als gesehen markieren</button><p class="note">Mit dem Player zählt ein Video später automatisch ab 90 Prozent als gesehen.</p></div>`}
  ${seen&&v.machJetzt?tcard(pillarOf(v),`<span class="k">Mach jetzt · 30 Sekunden</span><b class="tt">${esc(v.machJetzt)}</b>${IN.MACH_JETZT_GO[v.id]?`<div class="btns"><button class="btn small" ${gAttr(IN.MACH_JETZT_GO[v.id])}>${esc(IN.MACH_JETZT_GO[v.id].label)}</button></div>`:""}`):""}
  ${freshIds.length?openNotices(e=>freshIds.includes(e.id)).map(noticeCard).join(""):""}
  ${freshTodos.length?tcard("recap",`<span class="k">Neu in deiner Starter-Liste</span>
    ${freshTodos.map(todoById).map(t=>`<div class="trow"><span><b>${esc(t.title)}</b><small>${esc(t.when)}</small></span><button class="btn small" ${gAttr({kind:"todo", id:t.id})}>${t.input?"Eintragen":"Ansehen"}</button></div>`).join("")}`):""}
  ${bCard}
  ${next?`<button class="btn ghost" data-a="video" data-v="${next.id}" style="justify-content:space-between"><span>Nächstes: ${esc(next.title)}</span><span aria-hidden="true">›</span></button>`:""}
  ${seen?`<button class="btn link small" data-a="unseen" data-v="${v.id}" style="align-self:center">Doch nicht gesehen</button>`:""}`,"side-r");
}

/* ---------- Freischaltungen: Hinweis mit was, wann, wo, wieso und Knopf dorthin ---------- */
const IN = window.IK_INHALT;
const uctx = () => ({videos:VID.VIDEOS, materials:IN.MATERIALS, today:IK.localDay()});
const matById = id => IN.MATERIALS.find(m=>m.id===id) || null;
const todoById = id => IN.TODOS.find(t=>t.id===id) || null;
const gAttr = g => `data-a="goto" data-g="${esc(JSON.stringify(g))}"`;
function markNotice(id){ S.noticesSeen=S.noticesSeen||{}; if(!S.noticesSeen[id]){ S.noticesSeen[id]=new Date().toISOString(); save(); } }
function noticeOf(e){
  if(e.type==="basis"){ const n=IN.BASIS_NOTICE[e.ref], b=IK.BASIS.find(x=>x.key===e.ref);
    return {pillar:b.pillar, kicker:"Neu im Check-in", title:n.title, why:n.why, when:n.when, where:n.where, go:n.go}; }
  if(e.type==="material"){ const m=matById(e.ref);
    return {pillar:"recap", kicker:"Neu freigeschaltet · "+m.kind, title:m.title, why:m.why, when:m.when,
      where:"Bibliothek · "+(m.tab==="rezepte"?"Rezepte":"Handouts"), go:{kind:"material", id:m.id, label:m.kind+" öffnen"}}; }
  if(e.type==="baustein"){ const b=IK.bausteinById(e.ref), st=IK.activationState(S,b.id);
    const when = st==="active" ? "Ab deinem nächsten Check-in dabei." : st==="queued" ? "Kommt mit deiner nächsten Tracker-Woche in den Check-in."
      : st==="full" ? `Diese Woche sind schon ${IK.MAX_NEW_PER_WEEK} neue Bausteine dabei. Er kommt mit der nächsten Tracker-Woche.` : "Mit deiner nächsten Tracker-Woche, oder ab heute, wenn du willst.";
    return {pillar:b.pillar, kicker:"Neuer Baustein", title:b.label, why:`Du hast Video ${b.videoId} gesehen, das ihn erklärt.`, when, where:"Abend-Check-in · Bausteine",
      go: st==="ok" ? {kind:"activate", id:b.id, label:"Ab heute mittracken"} : {kind:"checkin", label:"Zum Check-in"}}; }
  if(e.type==="weekcheck"){ const w=IK.currentWeek(S), n=w?IK.checkinsOf(S,w.id).length:0;
    return {pillar:"recap", kicker:"Wochen-Check", title:`Woche ${w.index} ist bereit für deinen Wochen-Check`, why:`Du hast ${n} Tage eingetragen.`+(w.index===1?" Mit dem Check schaltest du dein Goodie frei.":""),
      when:"Jetzt, er dauert 1 Minute.", where:"Heute · Wochen-Check", go:{kind:"weekcheck", label:"Wochen-Check öffnen"}}; }
  return null;
}
function noticeCard(e){
  const n=noticeOf(e); if(!n) return "";
  return tcard(n.pillar,`<span class="k">${esc(n.kicker)}</span><b class="tt">${esc(n.title)}</b>
    <dl class="www"><div><dt>Wieso</dt><dd>${esc(n.why)}</dd></div><div><dt>Wann</dt><dd>${esc(n.when)}</dd></div><div><dt>Wo</dt><dd>${esc(n.where)}</dd></div></dl>
    <div class="btns">${n.go?`<button class="btn small" ${gAttr(n.go)} data-n="${e.id}">${esc(n.go.label||"Hin")}</button>`:""}<button class="btn small soft" data-a="notice-ok" data-v="${e.id}">Verstanden</button></div>`,"notice");
}
// Neueste Freischaltung zuerst: Zeitpunkt = wann das auslösende Video gesehen bzw. die Woche abgeschlossen wurde.
function unlockTime(e){
  const vt=id=>((S.videoProgress||{})[id]||{}).watchedAt||"";
  if(e.type==="basis") return vt(IK.BASIS.find(b=>b.key===e.ref).videoId);
  if(e.type==="baustein") return vt(IK.bausteinById(e.ref).videoId);
  if(e.type==="weekcheck") return "9999";
  const m=matById(e.ref), u=m.unlock;
  if(u.video) return vt(u.video);
  if(u.kernOfWeek) return VID.VIDEOS.filter(v=>v.week===u.kernOfWeek&&v.type==="Kern").map(v=>vt(v.id)).sort().pop()||"";
  if(u.weekCompleted){ const w=S.weeks.find(x=>x.index===u.weekCompleted); return (w&&w.weekCheckAt)||""; }
  return "";
}
const openNotices = (filter) => IK.newUnlocks(S, uctx()).filter(e=>!filter||filter(e)).sort((a,b)=>unlockTime(b).localeCompare(unlockTime(a)));

// Führt zur passenden Stelle: Video, Check-in, Wissenskarte, To-do, Material, Wochen-Check, Profil.
function goTo(g){
  if(!g) return;
  if(g.kind!=="activate") pushNav();
  if(g.kind==="video"){ const ids=g.ids||[g.id]; const open=ids.find(id=>!IK.isSeen(S,id));
    if(!open && g.then==="checkin") return go("checkin");
    videoId=open||ids[0]; view="video"; flash=""; render(); return window.scrollTo(0,0); }
  if(g.kind==="checkin") return go("checkin");
  if(g.kind==="profil") return go("profil");
  if(g.kind==="weekcheck"){ view="wochencheck"; render(); return window.scrollTo(0,0); }
  if(g.kind==="wissen"){ view="bibliothek"; libTab="wissen"; wissen=g.id; mat=null; render(); return window.scrollTo(0,0); }
  if(g.kind==="material"){ const m=matById(g.id); view="bibliothek"; libTab=m?m.tab:"handouts"; mat=g.id; wissen=null; render(); return window.scrollTo(0,0); }
  if(g.kind==="todo"){ view="starter"; focusTodo=g.id; render();
    const el=document.getElementById("todo-"+g.id); if(el){ el.scrollIntoView({block:"center"}); const i=el.querySelector("input"); if(i) i.focus({preventScroll:true}); }
    return; }
  if(g.kind==="activate"){ const r=IK.activateNow(S,g.id); save(); flash=r==="active"?"Ab deinem nächsten Check-in dabei.":r==="queued"?"Kommt mit deiner nächsten Tracker-Woche zuerst dran.":""; return render(); }
}

/* ---------- Gesperrt: warum, was fehlt, was jetzt geht ---------- */
let lockFor=null; // "mat:<id>" oder "ho:<woche>"
function lockItem(key){
  const [t,id]=String(key).split(":");
  if(t==="mat") return matById(id);
  const w=+id; return hoOf(w) || {title:`Handout Woche ${w}`, kind:"Handout", week:w, unlock:{kernOfWeek:w}};
}
function lockInfo(it){
  const u=it.unlock||{}, steps=[]; let why="", now=null, doneMsg="";
  const todayDone=!!IK.checkinFor(S,IK.localDay()), hour=new Date().getHours();
  if(u.video){ const v=VID.VIDEOS.find(x=>x.id===u.video);
    why=`Das gehört zu Video ${u.video} und wird frei, sobald du es gesehen hast.`;
    steps.push({t:`Video ${u.video} ansehen`, sub:v?`${v.title} · ${v.durationMin} Min.`:"", done:IK.isSeen(S,u.video)});
    now={q:`Das kannst du direkt erledigen. Willst du Video ${u.video} jetzt ansehen?`, label:`Video ${u.video} ansehen`, g:{kind:"video", id:u.video}}; }
  else if(u.kernOfWeek){ const W=u.kernOfWeek, ks=VID.VIDEOS.filter(v=>v.week===W&&v.type==="Kern").sort((a,b)=>a.order-b.order);
    why=`Das Handout fasst die Kernvideos von Woche ${W} zusammen. Es wird frei, sobald du alle ${ks.length} gesehen hast.`;
    ks.forEach(v=>steps.push({t:`Video ${v.id} ansehen`, sub:`${v.title} · ${v.durationMin} Min.`, done:IK.isSeen(S,v.id)}));
    const nx=ks.find(v=>!IK.isSeen(S,v.id)), left=ks.filter(v=>!IK.isSeen(S,v.id)).length;
    if(nx) now={q:`${left===1?"Es fehlt nur noch ein Video.":`Es fehlen noch ${left} Videos.`} Willst du mit Video ${nx.id} jetzt weitermachen?`, label:`Video ${nx.id} ansehen`, g:{kind:"video", id:nx.id}}; }
  else if(u.weekCompleted){ const N=u.weekCompleted, cw=IK.currentWeek(S), ci=cw?cw.index:0, n=cw?IK.checkinsOf(S,cw.id).length:0, wcOpen=IK.weekCheckOpen(S);
    const inN = cw && ci===N && cw.status!=="completed";
    why=`Goodies sind die Belohnung für eine abgeschlossene Tracker-Woche. Dieses wird mit dem Wochen-Check von Woche ${N} frei.`;
    if(cw && ci<N && cw.status!=="completed") steps.push({t:`Woche ${ci} abschließen`, sub:`${n} von 7 Tagen eingetragen, danach ihr Wochen-Check`, done:false});
    steps.push({t:`7 Tage Check-in in Woche ${N}`, sub: inN ? (wcOpen?"Genug Tage für den Wochen-Check":`${n} von 7 Tagen eingetragen`) : (cw&&ci<N&&cw.status!=="completed" ? `Startet nach Woche ${ci}` : "Startet mit deinem nächsten Check-in"), done: inN && (n>=7||wcOpen)});
    steps.push({t:`Wochen-Check Woche ${N} abschließen`, sub:"Dauert 1 Minute und öffnet nach dem 7. Tag", done:false});
    if(wcOpen) now={q:`Dein Wochen-Check für Woche ${ci} ist offen. Willst du ihn jetzt machen?`, label:"Wochen-Check öffnen", g:{kind:"weekcheck"}};
    else if(!todayDone) now={q:`Heute fehlt noch dein Check-in. Jeder eingetragene Tag bringt dich näher. Willst du ihn jetzt machen?`, hint:hour<18?"Am besten abends, wenn du den Tag überblickst. Du kannst aber auch jetzt eintragen.":"", label:"Check-in jetzt machen", g:{kind:"checkin"}};
    else doneMsg=`Für heute ist alles erledigt. Trag morgen wieder deinen Check-in ein${inN?`, dann hast du ${n+1} von 7 Tagen`:""}.`; }
  return {why, steps, now, doneMsg};
}
function lockHTML(){
  const it=lockItem(lockFor); if(!it){ lockFor=null; return ""; }
  const L=lockInfo(it), p=it.pillar||"recap", openN=L.steps.filter(x=>!x.done).length;
  const li=(x,i)=>`<li class="${x.done?"on":""}"><span class="n" aria-hidden="true">${x.done?CHECK:i+1}</span><span><b>${esc(x.t)}</b>${x.sub?`<small>${esc(x.sub)}</small>`:""}</span><span class="sr">${x.done?"erledigt":"offen"}</span></li>`;
  return `<div class="sheet-bg" data-a="lock-close"><section class="sheet lock" role="dialog" aria-modal="true" aria-labelledby="lk-t" data-a="noop" style="${pvars(p)}"><span class="grab" aria-hidden="true"></span>
    <div class="sh"><span class="lk-ic">${LOCK}</span><button class="iconbtn" data-a="lock-close" aria-label="Schließen" style="background:var(--chip);box-shadow:none">${ICON.close}</button></div>
    <div><span class="eyebrow" style="color:var(--t)">Noch gesperrt · ${esc(it.kind)} · Woche ${it.week}</span><h2 id="lk-t">${esc(it.short?it.title.replace(/^[^:]+: /,""):it.title)}</h2></div>
    <p class="lwhy">${esc(L.why)}</p>
    <div><b class="lhd">${L.steps.length>1?`So schaltest du es frei · ${openN} von ${L.steps.length} offen`:"So schaltest du es frei"}</b><ol class="lsteps">${L.steps.map(li).join("")}</ol></div>
    ${L.now ? `<div class="lnow"><p>${esc(L.now.q)}</p>${L.now.hint?`<p class="note">${esc(L.now.hint)}</p>`:""}<div class="btns"><button class="btn" ${gAttr(L.now.g)}>${esc(L.now.label)}</button><button class="btn ghost" data-a="lock-close">Später</button></div></div>`
      : `<div class="ldone">${mark(40)}<p>${esc(L.doneMsg)}</p></div><button class="btn ghost" data-a="lock-close">Verstanden</button>`}</section></div>`;
}

/* ---------- Starter-Liste Woche 1 ---------- */
const starterActive = () => !IK.weekCompleted(S,1);
function todoGoBtn(t, onList){
  if(t.done) return "";
  if(!t.go) return onList ? "" : `<button class="btn small ghost" ${gAttr({kind:"todo", id:t.id})}>${t.input?"Eintragen":"Ansehen"}</button>`;
  const g=t.go, label=g.label || (g.kind==="video" ? (()=>{ const ids=g.ids, open=ids.find(id=>!IK.isSeen(S,id)); return open?`Video ${open} öffnen`:g.then==="checkin"?"Zum Check-in":`Video ${ids[0]} öffnen`; })()
    : g.kind==="weekcheck" ? (IK.weekCheckOpen(S)?"Wochen-Check öffnen":"") : "Hin");
  return label?`<button class="btn small ghost" ${gAttr(g)}>${esc(label)}</button>`:"";
}
function starterCard(){
  if(!starterActive()) return "";
  const st=IK.todoStatus(S,IN.TODOS), done=st.filter(t=>t.done).length, open=st.filter(t=>!t.done&&t.unlocked).concat(st.filter(t=>!t.done&&!t.unlocked)).slice(0,2);
  return `<div class="card starter-card"><div class="row"><b>Deine Starter-Liste</b><b class="num" style="font-size:14px">${done} von ${st.length}</b></div>
    <div class="bar" style="--c:var(--recap)"><i style="width:${Math.round(done/st.length*100)}%"></i></div>
    ${open.map(t=>`<div class="todo-mini${t.unlocked?"":" locked"}"><span><b>${esc(t.title)}</b><span class="note">${t.unlocked?esc(t.when):`frei mit Video ${t.after}`}</span></span>${t.unlocked?todoGoBtn(t):`<button class="btn small ghost" data-a="video" data-v="${t.after}">Video ${t.after}</button>`}</div>`).join("")}
    <button class="btn link small" data-a="go" data-v="starter" style="align-self:flex-start;min-height:0;padding:0">Alle To-dos ansehen</button></div>`;
}
function fieldInput(inp){
  const v=S[inp.field]; const val=v==null?"":String(v);
  return `<div class="fin"><label for="f-${inp.field}" class="note" style="font-weight:600">${esc(inp.label)}</label>
    <div class="fin-row"><input id="f-${inp.field}" type="${inp.type==="number"?"text":inp.type}" ${inp.type==="number"?'inputmode="numeric"':""} value="${esc(val)}" placeholder="${esc(inp.placeholder||"")}" maxlength="140">
    <button class="btn small" data-a="field" data-v="${inp.field}">Speichern</button></div></div>`;
}
function vStarter(){
  const st=IK.todoStatus(S,IN.TODOS), done=st.filter(t=>t.done).length;
  const item=t=>{ const manual=!t.auto;
    if(!t.unlocked) return `<div class="card todo locked" id="todo-${t.id}"><div class="todo-hd"><span class="tick lock" aria-hidden="true"></span><span><b>${esc(t.title)}</b><span class="note">Wird frei mit Video ${t.after} · ${esc(t.when)}</span></span></div>
      <div class="btns"><button class="btn small ghost" data-a="video" data-v="${t.after}">Video ${t.after} öffnen</button></div></div>`;
    const mark = manual ? `<button class="tick" data-a="todo-tick" data-v="${t.id}" aria-pressed="${t.done}" aria-label="${esc(t.title)} ${t.done?"erledigt":"abhaken"}">${t.done?CHECK:""}</button>`
      : `<span class="tick auto${t.done?" on":""}" aria-hidden="true">${t.done?CHECK:""}</span>`;
    return `<div class="card todo${t.done?" done":""}${focusTodo===t.id?" focus":""}" id="todo-${t.id}">
      <div class="todo-hd">${mark}<span><b>${esc(t.title)}</b><span class="note">${esc(t.when)}${t.min?" · "+esc(t.min):""}${manual?" · selbst abhaken":t.done?" · erledigt":" · hakt sich selbst ab"}</span></span></div>
      ${t.done?"":`<p class="note why"><b>Wieso:</b> ${esc(t.why)}</p>${t.how?`<p class="note why">${esc(t.how)}</p>`:""}`}
      ${t.inputOpen&&(!t.done||t.input.field!=="why")?fieldInput(t.input):t.input&&!t.inputOpen&&!t.done?`<p class="note">Das Eingabefeld erscheint nach Video ${t.afterInput}.</p>`:""}
      ${t.done?"":`<div class="btns">${todoGoBtn(t,true)}</div>`}</div>`; };
  return `<div class="top"><div class="t"><small>Woche 1 · ${done} von ${st.length} erledigt</small><b>Deine Starter-Liste</b></div><button class="iconbtn" data-a="back" data-v="heute" aria-label="Schließen">${ICON.close}</button></div>
  <p class="note" style="padding:0 4px">Einmalige Aufgaben für deinen Start. Gesperrte To-dos werden mit ihrem Video frei. „Tag“ meint deinen Tracker-Tag. Die Liste verschwindet nach deinem ersten Wochen-Check.</p>
  <div class="masonry">${st.map(item).join("")}</div>`;
}

/* ---------- Wochen-Check (schlanke Fassung bis Screen 09) ---------- */
function weekCheckCard(){
  if(!IK.weekCheckOpen(S)) return "";
  const w=IK.currentWeek(S), n=IK.checkinsOf(S,w.id).length;
  return `<div class="card" style="background:var(--recap-soft)"><b>Woche ${w.index}: Zeit für deinen Wochen-Check</b>
    <p class="note" style="color:var(--recap-text)">${n} Tage eingetragen. Schau dir deine Woche an und schließ sie ab${w.index===1?". Dabei schaltest du dein Goodie frei":""}.</p>
    <button class="btn small" data-a="go" data-v="wochencheck" style="background:var(--recap)">Wochen-Check öffnen</button></div>`;
}
function vWochencheck(){
  const w=IK.currentWeek(S);
  if(!w||!IK.weekCheckOpen(S)){ view="heute"; return vHeute(); }
  const c=IK.checkinsOf(S,w.id), act=IK.activeBausteine(w), ls=IK.loopScore(c,act), stats=IK.weekStats(c,act);
  const prev=S.weeks.filter(x=>x.index<w.index).slice(-1)[0], pls=prev?IK.loopScore(IK.checkinsOf(S,prev.id),IK.activeBausteine(prev)):null;
  const cands=IK.newWeekCandidates(S).slice(0,IK.MAX_NEW_PER_WEEK).map(IK.bausteinById);
  const row=(l,on,col)=>`<div class="kv"><span><span class="dot" style="--c:${col}"></span>${esc(l)}</span><b class="num">${on} von ${c.length} Tagen</b></div>`;
  return `<div class="top"><div class="t"><small>Woche ${w.index} · ${c.length} Tage eingetragen</small><b>Wochen-Check</b></div><button class="iconbtn" data-a="back" data-v="heute" aria-label="Schließen">${ICON.close}</button></div>
  ${lay(`<div class="card"><b>Deine Basis</b>${IK.BASIS.map(b=>row(b.label,c.filter(x=>x.basis&&x.basis[b.key]).length,PC[b.pillar])).join("")}
    ${act.map(b=>{ const r=stats.bausteine.find(x=>x.id===b.id); return `<div class="kv"><span><span class="dot" style="--c:${PC[b.pillar]}"></span>${esc(b.label)}</span><b class="num">${r&&r.rate!=null?Math.round(r.rate*100)+" %":"–"}</b></div>`; }).join("")}</div>
  <div class="card"><div class="row"><b>Loop-Score</b><b class="num" style="font-size:22px">${ls.score==null?"–":ls.score}</b></div>
    <p class="note">${pls&&pls.score!=null&&ls.score!=null?`Woche ${prev.index}: ${pls.score}. ${ls.score>pls.score?"Dein Loop läuft runder.":ls.score<pls.score?"Etwas weniger als letzte Woche. Das ist normal, wichtig ist das Dranbleiben.":"Genau wie letzte Woche."}`:"Dein erster Wert. Ab nächster Woche siehst du den Vergleich."}</p></div>`,
  `<div class="card soft"><b>Als Nächstes</b>
    <p class="note" style="color:var(--ink)">${cands.length?`Mit deiner nächsten Woche kommen ins Check-in: ${cands.map(b=>esc(b.label)).join(", ")}.`:`Neue Bausteine schaltest du mit den Kernvideos der nächsten Kurswoche frei.`}</p>
    ${w.index===1?`<p class="note" style="color:var(--ink)">Mit dem Abschluss wird dein Goodie frei: „Bunte Teller in 15 Minuten“.</p>`:""}</div>
  <button class="btn" data-a="weekcheck-done">Woche ${w.index} abschließen</button>
  <p class="note" style="text-align:center">Die ausführliche Auswertung mit Zusammenhängen kommt mit einem späteren Update.</p>`,"side-r")}`;
}

/* ---------- Materialien in der Bibliothek ---------- */
const BLOB=`<path d="${BLOBPATH}" style="fill:var(--c)"/>`;
// Getönte Karte wie die Wissens-Kacheln der Bibliothek: Themenfarbe hell, Logo-Form in der Ecke.
const tcard=(p,inner,cls)=>`<div class="tcard${cls?" "+cls:""}" style="${pvars(p)}"><svg class="bl" viewBox="0 0 100 100" aria-hidden="true">${BLOB}</svg>${inner}</div>`;
const WISSEN_COVER = {pflanzen:"Pflanzen-Teller", ferment:"Fermentiertes", licht:"Morgenlicht", aktiv:"30 Minuten"};
const cover=(attrs,k,s,title,how,p,locked)=>`<button class="cover${locked?" locked":""}" ${attrs} style="${pvars(p)}"><span class="cv"><svg class="bl" viewBox="0 0 100 100" aria-hidden="true">${BLOB}</svg><span class="k">${esc(k)}</span><b class="s">${esc(s)}</b>${locked?`<span class="lk" aria-hidden="true">${LOCK}</span>`:""}</span><span><b>${esc(title)}</b><small>${esc(how)}${locked?" · gesperrt":""}</small></span></button>`;
function materialList(tab){
  const list=IN.MATERIALS.filter(m=>m.tab===tab && m.week<=weeksTotal());
  if(!list.length) return "";
  return `<div class="covers">${list.map(m=>{ const free=IK.materialUnlocked(S,m,VID.VIDEOS);
    const how = free ? (m.card?"Frei · zum Ausdrucken":"Frei · öffnen") : m.unlock.video ? `Frei nach Video ${m.unlock.video}` : m.unlock.kernOfWeek ? (()=>{ const p=IK.weekVideoProgress(VID.VIDEOS,S,m.unlock.kernOfWeek); return `Frei nach allen Kernvideos · ${p.kernSeen} von ${p.kernTotal}`; })()
      : m.unlock.weekCompleted ? `Frei mit dem Wochen-Check ${m.unlock.weekCompleted}` : "";
    return cover(free?`data-a="mat" data-v="${m.id}"`:`data-a="lock" data-v="mat:${m.id}"`, `${m.kind} · Woche ${m.week}`, m.short||m.title, m.sub||m.title, how, m.pillar||"recap", !free); }).join("")}</div>`;
}
function vMaterial(){
  const m=matById(mat); if(!m||!IK.materialUnlocked(S,m,VID.VIDEOS)){ mat=null; return vBibliothek(); }
  markNotice("mat-"+m.id);
  const body = m.card ? `<div class="card soft"><b>${m.kind==="Handout"?"Zwei Seiten A4":"Karte A6"}</b><p class="note" style="color:var(--ink)">Zum Ausdrucken, oder im Druck-Dialog „Als PDF sichern“ wählen.${m.card==="handout1"||m.card==="morgen"?" Deine Angaben aus der Starter-Liste stehen schon drin.":""}</p>
      <button class="btn small" data-a="print" data-v="${m.card}">${m.kind} als PDF speichern</button></div>`
    : m.recipes&&m.recipes.length ? m.recipes.map(r=>`<div class="card"><b>${esc(r.title)}</b><span class="note">${r.minutes} Min. · ${r.plants} Pflanzen</span><p class="note" style="color:var(--ink)">${(r.ingredients||[]).map(esc).join(" · ")}</p><ol>${(r.steps||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>`).join("")
    : `<div class="card soft"><b>Freigeschaltet</b><p class="note" style="color:var(--ink)">Die Rezepte kommen mit dem nächsten Update der App automatisch hier rein.</p></div>`;
  return `<button class="back" data-a="mat-close">${ICON.back.replace("<svg",'<svg width="20" height="20"')}Zurück</button>
  <span class="eyebrow" style="color:var(--recap-text)">${esc(m.kind)} · Woche ${m.week}</span><h1>${esc(m.title.replace(/^[^:]+: /,""))}</h1>
  ${lay(`<div class="card"><p style="margin:0">${esc(m.why)}</p><p class="note"><b>Wann:</b> ${esc(m.when)}</p></div>`, body, "side-r")}`;
}

/* ---------- Profilfelder aus der Starter-Liste ---------- */
const FIELDS = {
  wakeTime:{label:"Meine Aufstehzeit", type:"time", check:v=>/^([01]\d|2[0-3]):[0-5]\d$/.test(v)?v:null, err:"Bitte eine Uhrzeit wie 06:45 eingeben."},
  lightSpot:{label:"Mein Morgenlicht-Ort", type:"text", check:v=>v.trim().slice(0,140)||null, err:"Bitte einen Ort eingeben."},
  why:{label:"Mein Warum", type:"text", check:v=>v.trim().slice(0,140)||null, err:"Bitte einen Satz eingeben."},
  standTest:{label:"Aufsteh-Test (Wiederholungen in 30 Sek.)", type:"number", check:v=>{ const n=parseInt(v,10); return n>=0&&n<=60?n:null; }, err:"Bitte eine Zahl zwischen 0 und 60 eingeben."}
};
function saveField(k){
  const el=document.getElementById("f-"+k), f=FIELDS[k]; if(!el||!f) return;
  const v=f.check(el.value);
  if(v==null){ flash=f.err; return render(); }
  S[k]=v; if(k==="standTest") S.standTestAt=new Date().toISOString(); save();
  flash=`${f.label} gespeichert.`; render();
}
function basisFieldsCard(){
  const st=IK.todoStatus(S,IN.TODOS), byField=k=>st.find(t=>t.input&&t.input.field===k);
  return `<div class="card"><h2>Deine Basis</h2><p class="note">Aus deiner Starter-Liste. Sie stehen auch auf deinem Handout und deiner Morgen-Karte.</p>
    ${Object.keys(FIELDS).map(k=>{ const t=byField(k), open=!t||t.inputOpen, vid=t&&(t.unlocked?t.afterInput:t.after);
      return open||filledField(k) ? fieldInput({field:k, type:FIELDS[k].type, label:FIELDS[k].label})
        : `<div class="kv" style="align-items:center"><span class="note" style="font-weight:600">${esc(FIELDS[k].label)}</span><button class="btn link small" data-a="video" data-v="${vid}" style="min-height:0;padding:0">frei mit Video ${vid}</button></div>`; }).join("")}</div>`;
}
const filledField = k => S[k]!=null && String(S[k]).trim()!=="";

/* ---------- Druckvorlagen: Morgen-Karte (A6) und Handout Woche 1 (A4, 2 Seiten) ---------- */
function morgenCard(){
  const days=["Mo","Di","Mi","Do","Fr","Sa","So"];
  return `<div class="fc" style="--c:var(--schlaf)"><div class="hd"><span style="display:flex;align-items:center;gap:2mm;font-family:var(--f-head);font-size:11pt;letter-spacing:0;text-transform:none;color:var(--ink)">${logo("#FFFFFF").replace('width="34" height="34"','width="18" height="18"')}innen kultur</span><span>Mini-Karte</span></div>
    <div><h1>Mein <em>Morgen</em></h1><p class="sub">Aufstehen zur festen Zeit, 10 Minuten raus ins Tageslicht, wer mag: 10 Minuten Mobility.</p></div>
    <div class="tip"><span><b>Aufstehzeit:</b> ${S.wakeTime?esc(S.wakeTime)+" Uhr":"______"} &nbsp;·&nbsp; <b>Mein Ort:</b> ${S.lightSpot?esc(S.lightSpot):"________________"}</span></div>
    <table class="wp"><thead><tr><th></th><th>Aufgestanden</th><th>Licht</th><th>Mobility</th></tr></thead><tbody>${days.map(d=>`<tr><td><b>${d}</b></td><td><i></i></td><td><i></i></td><td><i></i></td></tr>`).join("")}</tbody></table>
    <span class="ft">innen-kultur.de · Schlaf · Video 1.2, 1.7 und 1.9</span></div>`;
}
function handout1(){
  const hd=`<div class="hd"><span style="display:flex;align-items:center;gap:2mm;font-family:var(--f-head);font-size:12pt;letter-spacing:0;text-transform:none;color:var(--ink)">${logo("#FFFFFF").replace('width="34" height="34"','width="22" height="22"')}innen kultur</span><span>Handout Woche 1</span></div>`;
  const R=[["var(--darm)","Bunt gegessen","Mindestens 1 Mahlzeit am Tag zur Hälfte aus Pflanzen. Ein Viertel Eiweiß, ein Viertel Vollkorn oder Hülsenfrüchte.","Video 1.1 und 1.6"],
    ["var(--schlaf)","Morgenlicht + feste Aufstehzeit","Innerhalb von 60 Minuten nach dem Aufstehen 10 Minuten bei Tageslicht draußen. Aufstehen zur festen Zeit ± 30 Minuten, auch am Wochenende.","Video 1.2 und 1.7"],
    ["var(--beweg)","30 Min bewegt","Zusammen 30 Minuten, bei denen du etwas schneller atmest. Aufgeteilt zählt, z. B. 3 × 10 Minuten.","Video 1.3, 1.8 und 1.9"]];
  const days=["Mo","Di","Mi","Do","Fr","Sa","So"], W=IN.WARNZEICHEN;
  return `<div class="ho">${hd}<h1>Deine <em>Basis</em> auf zwei Seiten</h1><p class="sub">Drei Routinen, jeden Abend im Check-in abhaken. Klein anfangen zählt.</p>
    ${R.map(([c,t,r,v])=>`<div class="ho-r" style="--c:${c}"><b>${t}</b><span>${r}</span><small>${v}</small></div>`).join("")}
    <div class="ho-plate"><svg viewBox="0 0 120 120" width="42mm" height="42mm" role="img" aria-label="Pflanzen-Teller: halb Pflanzen, ein Viertel Eiweiß, ein Viertel Vollkorn oder Hülsenfrüchte"><circle cx="60" cy="60" r="56" fill="#fff" stroke="var(--line)" stroke-width="3"/><path d="M60 10 A50 50 0 0 0 60 110 Z" fill="var(--darm)"/><path d="M60 10 A50 50 0 0 1 110 60 L60 60 Z" fill="var(--recap)"/><path d="M110 60 A50 50 0 0 1 60 110 L60 60 Z" fill="var(--schlaf)"/></svg>
      <div><b>Der Pflanzen-Teller</b><span class="lg"><i style="--c:var(--darm)"></i>Hälfte: Gemüse, Salat, Obst</span><span class="lg"><i style="--c:var(--recap)"></i>Viertel: Eiweiß, z. B. Ei, Fisch, Tofu, Joghurt</span><span class="lg"><i style="--c:var(--schlaf)"></i>Viertel: Vollkorn oder Hülsenfrüchte</span>
      <small>Beispiele: Linsen-Bowl mit Ofengemüse · Vollkornbrot mit Hummus und Gurke · Haferflocken mit Beeren und Nüssen</small></div></div>
    <div class="ho-2"><div class="tip"><b>Morgen in 30 Minuten</b><br>Aufstehen zur festen Zeit · ein Glas Wasser · 10 Minuten raus ins Tageslicht · wer mag: 10 Minuten Mobility</div>
    <div class="tip"><b>Bewegungssnacks im Büro</b><br>Nach jeder Stunde Sitzen 2 Minuten gehen · Treppe statt Aufzug · Telefonate im Stehen · Weg zur Mittagspause zu Fuß · eine Haltestelle früher aussteigen</div></div>
    <span class="ft">innen-kultur.de · Seite 1 von 2</span></div>
  <div class="ho">${hd}<h1>Deine <em>Woche</em></h1>
    <table class="wp"><thead><tr><th></th><th>Aufgestanden um</th><th>Bunt gegessen</th><th>Morgenlicht</th><th>30 Min bewegt</th></tr></thead><tbody>${days.map(d=>`<tr><td><b>${d}</b></td><td></td><td><i></i></td><td><i></i></td><td><i></i></td></tr>`).join("")}</tbody></table>
    <div class="ho-2"><div class="tip"><b>Mein Warum</b><br>${S.why?esc(S.why):"<span class='ln'></span><span class='ln'></span>"}</div>
    <div class="tip"><b>Mein Morgenlicht-Ort</b><br>${S.lightSpot?esc(S.lightSpot):"<span class='ln'></span>"}<br><b>Meine Aufstehzeit</b><br>${S.wakeTime?esc(S.wakeTime)+" Uhr":"<span class='ln'></span>"}</div></div>
    <div class="tip warn"><b>Wann zum Arzt?</b><br>${W.length?W.map(esc).join(" · "):"Die Warnzeichen erklären wir in Video 1.5. Bei Beschwerden, die neu sind, stark sind oder nicht weggehen, warte nicht ab und hol dir ärztlichen Rat."}</div>
    <div class="tip"><b>Dein Abend-Check-in</b><br>Jeden Abend ${S.reminderTime?"um "+esc(S.reminderTime)+" Uhr":"zu deiner Zeit"} in der App, ca. 1 Minute. Nach 7 Tagen kommt dein Wochen-Check.</div>
    <span class="ft">innen-kultur.de · Seite 2 von 2 · Ersetzt keine ärztliche Beratung.</span></div>`;
}

/* ---------- Willkommen und App-Tour (nach dem Onboarding, jederzeit unter Profil) ---------- */
let tour=null;
function startTour(){ tour={i:0}; showTourStep(); }
function endTour(){
  tour=null; S.tourDoneAt=S.tourDoneAt||new Date().toISOString(); save();
  const o=document.getElementById("tour"); if(o) o.remove(); tourEl=null;
  document.body.classList.remove("touring");
}
function showTourStep(){
  const st=IN.TOUR[tour.i];
  view=st.view; mat=null; wissen=null; kursWeek=null; flash=""; freshIds=[]; render(); window.scrollTo(0,0);
  document.body.classList.add("touring");
  requestAnimationFrame(drawTour);
}
function tourTarget(st){
  if(!st.target) return null;
  for(const sel of st.target.split(",")){ const el=[...document.querySelectorAll(sel.trim())].find(e=>e.getClientRects().length); if(el) return el; }
  return null;
}
function tourIntro(){
  const prod = S.product==="komplett" ? "Dein Komplettkurs: 8 Wochen, dazu 3 Monate Club." : "Dein Basiskurs: 4 Wochen. Woche 5 bis 8 kannst du später dazunehmen.";
  return `<ul class="tour-list"><li><b>Wissen</b><span>Kurze Videos, alle sofort frei, Woche für Woche sinnvoll sortiert.</span></li>
    <li><b>Umsetzung</b><span>Jeden Abend 1 Minute Check-in. Dazu kleine Routinen, die mit jeder Woche wachsen.</span></li>
    <li><b>Fortschritt</b><span>Dein Loop-Score und der Vergleich mit deinem Startpunkt.</span></li></ul>
    <p class="note">${prod}</p>`;
}
function tourSampleNotice(){
  return `<div class="card notice demo" style="--c:var(--darm);--s:var(--darm-soft)" aria-label="Beispiel einer Hinweis-Karte"><span class="eyebrow" style="color:var(--darm-text)">Beispiel · Neu im Check-in</span><b class="nt">„Bunt gegessen“ ist jetzt in deinem Check-in</b>
    <dl class="www"><div><dt>Wieso</dt><dd>Du weißt jetzt, warum Vielfalt auf dem Teller zählt.</dd></div><div><dt>Wann</dt><dd>Heute Abend im Check-in abhaken.</dd></div><div><dt>Wo</dt><dd>Abend-Check-in · Basis</dd></div></dl>
    <div class="btns"><span class="btn small" style="background:var(--darm)">Was zählt als Pflanze?</span><span class="btn ghost small">Verstanden</span></div></div>`;
}
// Saubere Vorschau statt Hervorhebung, wo das echte Element je nach Stand anders aussieht.
function tourPreview(k){
  if(k==="learn"){ const v=VID.VIDEOS.find(x=>x.id==="1.1"), b=IK.BASIS.find(x=>x.key==="bunt");
    return `<div class="tour-prev"><div class="learn" style="pointer-events:none"><span class="thumb" style="--s:${PS.darm};--c:${PC.darm}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5 19 12 8 19Z"/></svg></span>
      <span class="tx"><span class="eyebrow" style="color:${PT.darm}">Weiterlernen · Ernährung & Darm</span><b>1.1 ${esc(v.title)}</b><span class="note">${v.durationMin} Min. · schaltet „${esc(b.label)}“ frei</span></span></div>
      <div class="card" style="background:var(--navy);color:#fff;gap:4px"><span class="eyebrow" style="color:#C9D6E6">Mach jetzt · 30 Sekunden</span><span style="font-size:14px">${esc(v.machJetzt||"")}</span></div></div>`; }
  if(k==="material"){ const row=(kind,title,how,on)=>`<div class="tour-mat${on?" on":""}"><span class="eyebrow" style="color:var(--recap-text)">${kind}</span><b>${title}</b><span class="note">${how}</span></div>`;
    return `<div class="tour-prev">${row("Mini-Karte · Woche 1","Pflanzen-Teller","frei direkt nach Video 1.6",true)}${row("Handout · Woche 1","Deine Basis auf zwei Seiten","frei nach allen 5 Kernvideos der Woche",false)}${row("Goodie · Woche 1","Bunte Teller in 15 Minuten","frei mit deinem Wochen-Check",false)}
      <p class="note">Alles liegt danach in der Bibliothek. Gesperrtes zeigt, wodurch es frei wird.</p></div>`; }
  if(k==="loop") return `<div class="tour-prev"><span class="eyebrow" style="color:var(--recap-text)">Beispiel</span>${loopExample(false)}</div>`;
  return "";
}
function tourLogic(){
  return `<ul class="tour-logic">${IN.UNLOCK_OVERVIEW.map(([a,b,c])=>`<li><b>${esc(a)}</b><span>frei ${esc(b)}</span><small>${esc(c)}</small></li>`).join("")}</ul>`;
}
function drawTour(){
  if(!tour) return;
  const st=IN.TOUR[tour.i], last=tour.i===IN.TOUR.length-1, first=tour.i===0, el=tourTarget(st);
  let o=document.getElementById("tour"); if(!o){ o=document.createElement("div"); o.id="tour"; document.body.appendChild(o); }
  const r=el?{}:null; tourEl=null;
  const extra = first ? tourIntro() : st.kind==="notice" ? tourSampleNotice() : st.kind==="logic" ? tourLogic() : st.kind==="preview" ? tourPreview(st.preview) : "";
  const nx=IK.nextVideo(VID.VIDEOS,S,weeksTotal());
  const btns = first
    ? `<button class="btn" data-a="tour-next">Tour starten · 2 Min.</button><button class="btn link small" data-a="tour-end">Später ansehen</button>`
    : last
    ? `${nx?`<button class="btn" data-a="tour-finish" data-v="${nx.id}">Los geht's mit Video ${nx.id}</button>`:""}<button class="btn ghost" data-a="tour-finish">Zu Heute</button>`
    : `<div class="tour-row"><button class="btn ghost small" data-a="tour-back">Zurück</button><button class="btn small" data-a="tour-next">Weiter</button></div><button class="btn link small" data-a="tour-end">Tour beenden</button>`;
  o.innerHTML=`${r?`<div class="tour-hole"></div>`:`<div class="tour-dim"></div>`}
    <div class="tour-card${r?"":" center"}${extra?" wide":""}" role="dialog" aria-modal="true" aria-labelledby="tour-t" aria-describedby="tour-d">
      <span class="eyebrow">${first?"Willkommen":`Tour · ${tour.i} von ${IN.TOUR.length-1}`}</span>
      <h2 id="tour-t">${esc(st.title)}</h2><p id="tour-d">${esc(st.text)}</p>${extra}
      <div class="tour-btns">${btns}</div>
      ${first||last?"":`<div class="tour-dots" aria-hidden="true">${IN.TOUR.slice(1).map((_,i)=>`<i class="${i+1===tour.i?"on":""}"></i>`).join("")}</div>`}</div>`;
  tourEl=el;
  if(el && !isFixed(el)){ const pad=6, b0=el.getBoundingClientRect(); window.scrollBy(0, b0.top-(pad+12)); } // Element nach oben, Karte darunter
  tourY=window.scrollY; placeTour();
  [80,300,700].forEach(ms=>setTimeout(placeTour,ms)); // Schrift und Bilder können das Layout noch verschieben
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(placeTour);
  const f=o.querySelector('[data-a="tour-next"],[data-a="tour-finish"]'); if(f) f.focus({preventScroll:true});
}
let tourEl=null, tourY=0;
const isFixed = el => { for(let n=el;n&&n!==document.body;n=n.parentElement){ if(getComputedStyle(n).position==="fixed") return true; } return false; };
// Hervorhebung und Karte immer aus der aktuellen Position des Elements berechnen.
function placeTour(){
  const o=document.getElementById("tour"); if(!tour||!o) return;
  const c=o.querySelector(".tour-card"), hole=o.querySelector(".tour-hole");
  if(!tourEl||!hole||!document.body.contains(tourEl)){ if(hole){ hole.style.display="none"; } c.classList.add("center"); c.style.top=c.style.left=""; return; }
  const vw=document.documentElement.clientWidth, vh=(window.visualViewport?visualViewport.height:innerHeight), ch=c.offsetHeight, cw=c.offsetWidth, gap=12, pad=6;
  const b=tourEl.getBoundingClientRect(), fixed=isFixed(tourEl);
  const rad=parseFloat(getComputedStyle(tourEl).borderTopLeftRadius)||0;
  const top0=b.top-pad, left0=b.left-pad, w=b.width+2*pad;
  let h=b.height, top, left;
  const cx=Math.min(Math.max(8, b.left+b.width/2-cw/2), vw-cw-8), cyClamp=y=>Math.min(Math.max(8,y), vh-ch-8);
  if(top0+h+2*pad+gap+ch<=vh-8){ top=top0+h+2*pad+gap; left=cx; }                 // darunter
  else if(top0-gap-ch>=8){ top=top0-gap-ch; left=cx; }                                  // darüber
  else if(b.right+pad+gap+cw<=vw-8){ left=b.right+pad+gap; top=cyClamp(b.top); }       // rechts daneben
  else if(b.left-pad-gap-cw>=8){ left=b.left-pad-gap-cw; top=cyClamp(b.top); }         // links daneben
  else { // nur den oberen Teil hervorheben, Karte darunter
    h=Math.max(40, vh-8-ch-gap-2*pad-top0); top=Math.min(top0+h+2*pad+gap, vh-ch-8); left=cx; }
  hole.style.cssText=`display:block;top:${top0}px;left:${left0}px;width:${w}px;height:${h+2*pad}px;border-radius:${Math.min(rad+pad,40)}px`;
  c.classList.remove("center"); c.style.top=top+"px"; c.style.left=left+"px";
}
window.addEventListener("resize",()=>{ if(tour) placeTour(); });
window.addEventListener("scroll",()=>{ if(!tour) return; if(Math.abs(window.scrollY-tourY)>1) window.scrollTo(0,tourY); placeTour(); },{passive:true});
if(window.visualViewport) visualViewport.addEventListener("resize",()=>{ if(tour) placeTour(); });
// Während der Tour scrollt die Seite nicht mit dem Finger, nur die Tour-Karte selbst darf scrollen.
document.addEventListener("touchmove",e=>{ if(tour && !e.target.closest(".tour-card")) e.preventDefault(); },{passive:false});
document.addEventListener("wheel",e=>{ if(tour && !e.target.closest(".tour-card")) e.preventDefault(); },{passive:false});

/* ---------- Bibliothek (Screens 11 und 14) ---------- */
const EX={
  pflanzen:{p:"darm",title:"Der Pflanzen-Teller",short:"Bunt gegessen: der Pflanzen-Teller",check:"Im Check-in ab Tag 1 als „Bunt gegessen“.",
    rule:"Eine Mahlzeit, bei der mindestens die <b>Hälfte des Tellers</b> aus Pflanzen besteht. Einmal am Tag reicht für den Haken.",
    groupsLabel:"Das zählt als Pflanze",mini:[["Gemüse","Brokkoli, Paprika, Spinat, Zucchini, Möhren, Tomaten"],["Obst","Beeren, Äpfel, Bananen, Orangen, Kiwi"],["Hülsenfrüchte","Linsen, Kichererbsen, Bohnen, Erbsen, Edamame"],["Vollkorn","Haferflocken, Vollkornbrot, Quinoa, Naturreis, Buchweizen"],["Nüsse & Samen","Walnüsse, Mandeln, Leinsamen, Chia, Kürbiskerne"],["Kräuter & Pilze","Petersilie, Basilikum, Schnittlauch, Champignons"]],
    examples:"Linsen-Bowl mit Ofengemüse · Vollkornbrot mit Hummus und Gurke · Haferflocken mit Beeren und Nüssen · Pasta mit Tomaten-Bohnen-Sauce und Rucola",card:"pflanzen"},
  ferment:{p:"darm",title:"Was zählt als fermentiert?",short:"Fermentiertes",check:"Im Check-in als Baustein ab Kurswoche 3, nach Video 3.1.",
    rule:"Lebensmittel, die mit Bakterien oder Hefen haltbar gemacht wurden. Schon eine <b>kleine Portion</b> am Tag reicht für den Haken.",
    groupsLabel:"Beispiele",mini:[["Milchprodukte","Naturjoghurt, Kefir, Skyr"],["Gemüse","Sauerkraut, Kimchi, milchsaure Gurken"],["Soja & Co.","Miso, Tempeh, Natto"],["Getränke & Brot","Kombucha, Kwas, echter Sauerteig"]],
    tip:"<b>Einkaufs-Tipp:</b> Aus dem Kühlregal und „nicht pasteurisiert“. Sauerkraut aus der Dose ist meist erhitzt.",card:"ferment"},
  licht:{p:"schlaf",title:"Morgenlicht und feste Aufstehzeit",short:"Morgenlicht + feste Aufstehzeit",check:"Im Check-in als „Morgenlicht“, nach Video 1.2.",
    rule:"Innerhalb von <b>60 Minuten</b> nach dem Aufstehen <b>10 Minuten</b> bei Tageslicht draußen. Dazu eine feste Aufstehzeit, ± 30 Minuten, auch am Wochenende.",
    groupsLabel:"So klappt es",mini:[["Balkon oder Terrasse","Kaffee oder Tee draußen trinken"],["Weg zum Bäcker","oder zur Haltestelle zu Fuß"],["Hunderunde","die erste Runde am Morgen"],["Arbeitsweg","ein Stück zu Fuß oder mit dem Rad"],["Wecker","eine Uhrzeit für alle 7 Tage"],["Abends","Wecker stellen, bevor das Handy weggelegt wird"]],
    tip:"<b>Gut zu wissen:</b> Auch bei bewölktem Himmel ist es draußen deutlich heller als drinnen am Fenster.",card:"morgen"},
  aktiv:{p:"beweg",title:"Was zählt als 30 Minuten bewegt?",short:"30 Min bewegt",check:"Im Check-in ab Tag 1 als „30 Min bewegt“.",
    rule:"Mindestens <b>30 Minuten</b> Bewegung am Tag, bei der du etwas schneller atmest. Aufgeteilt zählt auch, z. B. 3 × 10 Minuten.",
    groupsLabel:"Das zählt alles",mini:[["Spazieren","zügig, auch der Weg zur Arbeit"],["Fahrrad","Pendeln, Tour, Ergometer"],["Cardio","Laufen, Schwimmen, Rudern"],["Kraft","Studio, Eigengewicht, Kurse"],["Mobility","Yoga, Pilates, Dehnen"],["Alltag","Garten, Treppen, mit Kindern toben"]],card:"aktiv"}
};
function vBibliothek(){
  if(wissen) return vWissen();
  if(mat) return vMaterial();
  const T=[["wissen","Wissen"],["rezepte","Rezepte"],["plaene","Pläne"],["handouts","Handouts"]];
  const body = libTab==="wissen"
    ? `<div class="covers">${Object.keys(EX).map(k=>{ const e=EX[k]; return cover(`data-a="wissen" data-v="${k}"`, `Wissen · ${({darm:"Darm",schlaf:"Schlaf",beweg:"Bewegung",recap:"Recap"})[e.p]}`, WISSEN_COVER[k]||e.short, e.title, e.check, e.p, false); }).join("")}</div>`
    : materialList(libTab) + `<div class="card soft"><h2>${libTab==="handouts"?"Weitere Handouts":libTab==="rezepte"?"Weitere Rezepte":"Pläne folgen"}</h2><p class="note">${libTab==="handouts"?"Das Handout einer Woche wird frei, sobald du alle Kernvideos der Woche gesehen hast. Ab Woche 2 folgen sie mit den nächsten Updates.":"Rezepte und Pläne schalten sich als Goodies mit deinen Wochen-Checks frei."}</p></div>`;
  return `${brandBar()}<div class="top"><div class="t"><small>Zum Nachlesen</small><b>Bibliothek</b></div></div>
  <div class="segc" role="group" aria-label="Bereich">${T.map(([k,l])=>`<button data-a="libtab" data-v="${k}" aria-pressed="${libTab===k}">${l}</button>`).join("")}</div>${body}`;
}
function vWissen(){
  const e=EX[wissen];
  return `<button class="back" data-a="wissen-close">${ICON.back.replace("<svg",'<svg width="20" height="20"')}Zurück</button>
  <span class="eyebrow" style="color:${PT[e.p]}">${IK.PILLARS[e.p].label}</span><h1>${e.title}</h1>
  ${lay(`<div class="card"><h2>So zählt es</h2><p style="margin:0">${e.rule}</p><p class="note">${e.check}</p></div>
  <div class="card"><b>${e.groupsLabel}</b><div class="mini">${e.mini.map(([a,b])=>`<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join("")}</div>
    ${e.examples?`<b>Beispiel-Teller</b><p style="margin:0;font-size:14px">${e.examples}</p>`:""}${e.tip?`<p class="note">${e.tip}</p>`:""}</div>`,
  `<div class="card soft"><b>${e.card==="aktiv"?"Aktivitäts-Karte":e.card==="morgen"?"Morgen-Karte":"Kühlschrank-Karte"} (A6)</b><p class="note" style="color:var(--ink)">Zum Ausdrucken oder im Druck-Dialog „Als PDF sichern“ wählen.</p>
    <button class="btn small" data-a="print" data-v="${e.card}">Karte als PDF speichern</button></div>`,"side-r")}`;
}
function cardHTML(k){
  const hd=t=>`<div class="hd"><span style="display:flex;align-items:center;gap:2mm;font-family:var(--f-head);font-size:11pt;letter-spacing:0;text-transform:none;color:var(--ink)">${logo("#FFFFFF").replace('width="34" height="34"','width="18" height="18"')}innen kultur</span><span>${t}</span></div>`;
  if(k==="aktiv"){ const days=["Mo","Di","Mi","Do","Fr","Sa","So"];
    return `<div class="fc" style="--c:var(--beweg)">${hd("Aktivitäts-Karte")}
    <div><h1>Meine <em>Bewegungswoche</em></h1><p class="sub">Plane 30 Minuten am Tag. Aufgeteilt zählt auch. Hak ab, was geklappt hat.</p></div>
    <table class="wp"><thead><tr><th></th><th>Was?</th><th>Wann?</th><th>Min.</th><th>✓</th></tr></thead><tbody>${days.map(d=>`<tr><td><b>${d}</b></td><td></td><td></td><td></td><td><i></i></td></tr>`).join("")}</tbody></table>
    <div class="tip"><b>Ideen:</b> Spazieren · Rad · Laufen · Schwimmen · Kraft · Yoga · Treppe statt Aufzug</div>
    <span class="ft">innen-kultur.de · Bewegung</span></div>`; }
  if(k==="pflanzen"){ const rows=[["Gemüse","Brokkoli, Paprika, Spinat"],["Obst","Beeren, Äpfel, Bananen"],["Hülsenfrüchte","Linsen, Kichererbsen"],["Vollkorn","Haferflocken, Quinoa"],["Nüsse & Samen","Walnüsse, Leinsamen"],["Kräuter","Petersilie, Basilikum"]];
    return `<div class="fc" style="--c:var(--darm)">${hd("Kühlschrank-Karte")}
    <div><h1>Meine <em>Pflanzen-Basics</em></h1><p class="sub">Einmal am Tag: die Hälfte des Tellers aus Pflanzen. Trag ein, was bei dir immer da sein soll.</p></div>
    <div class="rows">${rows.map(([a,b])=>`<div class="rw"><span><b>${esc(a)}</b><small>${esc(b)}</small></span><span class="ln"></span></div>`).join("")}</div>
    <div class="shop"><span class="k">Diese Woche einkaufen</span><span class="ln"></span><span class="ln"></span></div>
    <span class="ft">innen-kultur.de · Ernährung &amp; Darm</span></div>`; }
  const g=[["Milchprodukte",["Naturjoghurt","Kefir","Skyr"]],["Gemüse",["Sauerkraut (Kühlregal)","Kimchi","Milchsaure Gurken"]],["Soja & Co.",["Miso","Tempeh"]],["Getränke & Brot",["Kombucha","Echter Sauerteig"]]];
  return `<div class="fc" style="--c:var(--darm)">${hd("Kühlschrank-Karte")}
    <div><h1>Mein <em>Fermentiertes</em></h1><p class="sub">Eine kleine Portion am Tag reicht. Hak ab, was du magst, und ergänze deine Favoriten.</p></div>
    <div class="grid2">${g.map(([a,l])=>`<div><span class="k">${esc(a)}</span>${l.map(x=>`<span class="ck"><i></i>${esc(x)}</span>`).join("")}</div>`).join("")}</div>
    <div class="tip"><b>Beim Einkauf:</b> Kühlregal und „nicht pasteurisiert“ wählen. Erhitzte Konserven zählen meist nicht.</div>
    <div class="rows" style="gap:1.5mm"><span class="k">Meine Favoriten · einkaufen</span><span class="ln" style="height:5mm"></span><span class="ln" style="height:5mm"></span><span class="ln" style="height:5mm"></span></div>
    <span class="ft">innen-kultur.de · Ernährung &amp; Darm</span></div>`;
}
function printCard(k){ const el=document.getElementById("print"); el.innerHTML=k==="morgen"?morgenCard():k==="handout1"?handout1():cardHTML(k); el.className=k==="handout1"?"a4":""; setTimeout(()=>window.print(),150); }

/* ---------- Profil: Startpunkt, Erinnerung, Daten ---------- */
function vProfil(){
  const b=latestBaseline(), lb=S.lastBackup?new Date(S.lastBackup):null, days=lb?Math.floor((Date.now()-lb)/864e5):null;
  const status=!lb?"Noch keine Sicherung gespeichert.":days===0?"Letzte Sicherung: heute.":`Letzte Sicherung: vor ${days} ${days===1?"Tag":"Tagen"}.`;
  return `<div class="top"><div class="t"><small>Alles bleibt auf diesem Gerät</small><b>Profil und Daten</b></div><button class="iconbtn" data-a="back" data-v="heute" aria-label="Schließen">${ICON.close}</button></div>
  ${pending?`<div class="card soft"><p class="okmsg">Übertragung erkannt. Auf diesem Gerät sind schon Einträge. Mit „Übernehmen“ werden sie durch den übertragenen Stand ersetzt.</p><div class="btns"><button class="btn small" data-a="pend-yes">Übernehmen</button><button class="btn ghost small" data-a="pend-no">Verwerfen</button></div></div>`:""}
  ${flash?`<div class="card soft"><p class="okmsg">${flash}</p></div>`:""}
  <div class="masonry"><div class="card"><h2>Dein Startpunkt</h2>
    ${b?IK.BASELINE.map(x=>`<div class="kv"><span>${x.label}</span><b class="num">${b[x.key]} von 5</b></div>`).join("")+`<p class="note">Erfasst am ${new Date(b.createdAt).toLocaleDateString("de-DE")}.</p>`:`<p class="note">Noch nicht erfasst.</p>`}
    <button class="btn ghost small" data-a="rebase">Neu erfassen</button></div>
  <div class="card"><h2>Darstellung</h2>
    <span class="note" style="font-weight:600">Abendmodus</span>
    <div class="opt2" role="group" aria-label="Abendmodus"><button data-a="set-theme" data-v="auto" aria-pressed="${S.eveningMode!=="off"}">Ab 18 Uhr dunkel</button><button data-a="set-theme" data-v="off" aria-pressed="${S.eveningMode==="off"}">Immer hell</button></div>
    <span class="note" style="font-weight:600">Haptik</span>
    <div class="opt2" role="group" aria-label="Haptik"><button data-a="set-haptic" data-v="on" aria-pressed="${S.haptics!==false}">An</button><button data-a="set-haptic" data-v="off" aria-pressed="${S.haptics===false}">Aus</button></div>
    <p class="note">Ein kurzes Tippen beim Abhaken und ein Erfolgs-Muster beim Speichern. Auf Android-Handys zuverlässig, auf dem iPhone über einen Safari-Umweg, der nicht überall spürbar ist.</p></div>
  <div class="card"><h2>App-Tour</h2><p class="note">In 2 Minuten durch alle Bereiche, mit einer Übersicht, wodurch Handouts, Goodies und Bausteine frei werden.</p>
    <div class="btns"><button class="btn small" data-a="tour-start">Tour ansehen</button></div></div>
  ${basisFieldsCard()}
  ${bausteineCard()}
  <div class="card"><h2>Erinnerung</h2><div class="times" role="group" aria-label="Uhrzeit für die Erinnerung">${["20:00","21:00","22:00",null].map(t=>`<button type="button" data-a="ptime" data-v="${t||""}" aria-pressed="${S.reminderTime===t}">${t||"Aus"}</button>`).join("")}</div>
    <p class="note">Push-Nachrichten kommen in einem späteren Update.</p></div>
  <div class="card"><h2>Sicherung</h2><p class="note">${status} Speichere die Datei z. B. in iCloud Drive, Google Drive oder auf deinem PC.</p>
    <div class="btns"><button class="btn small" data-a="backup">Sicherung speichern</button><label class="btn ghost small" for="imp">Sicherung laden</label><input id="imp" type="file" accept=".json,application/json" hidden></div></div>
  <div class="card"><h2>Auf anderes Gerät übertragen</h2><p class="note">Zeig den QR-Code an und scanne ihn mit der Kamera des anderen Geräts. Die Daten stecken im Code und laufen nicht über einen Server.</p>
    ${transfer?`<div class="qr">${transfer.svg||'<p class="note">Zu viele Daten für einen QR-Code. Nutze den Code unten.</p>'}</div><div class="mono" id="tcode">${transfer.code}</div><div class="btns"><button class="btn ghost small" data-a="copy">Code kopieren</button></div>`
      :`<div class="btns"><button class="btn small" data-a="transfer">QR-Code anzeigen</button></div>`}
    <label class="note" for="tin" style="font-weight:600">Code vom anderen Gerät einfügen</label><textarea id="tin" rows="2" placeholder="Übertragungscode"></textarea>
    <div class="btns"><button class="btn ghost small" data-a="receive">Übernehmen</button></div></div>
  <div class="card"><h2>Als App installieren</h2><p class="note"><b>iPhone (Safari):</b> Teilen-Symbol → „Zum Home-Bildschirm“<br><b>Android (Chrome):</b> Menü ⋮ → „App installieren“<br><b>PC (Chrome/Edge):</b> Installieren-Symbol in der Adressleiste</p>
    <p class="note">Wichtig auf dem iPhone: Als App installiert bleiben deine Daten zuverlässig erhalten.</p></div>
  <div class="card"><h2>Freischaltung</h2><div class="kv"><span>Code</span><b>${esc(S.code||"Demo")}</b></div><div class="kv"><span>Umfang</span><b>${S.product==="komplett"?"Komplett · 8 Wochen":"Basis · 4 Wochen"}</b></div>
    ${S.product!=="komplett"?`<label class="note" for="up" style="font-weight:600">Upgrade auf Komplett</label><input id="up" type="text" placeholder="KOMPLETT-…"><div class="btns"><button class="btn ghost small" data-a="upgrade">Woche 5–8 freischalten</button></div>`:""}</div>
  <div class="card"><h2>Einwilligung und Löschen</h2>
    <p class="note">Einwilligung erteilt am ${S.consentHealthDataAt?new Date(S.consentHealthDataAt).toLocaleDateString("de-DE"):"–"}. Wenn du sie widerrufst, löschen wir alle Einträge auf diesem Gerät.</p>
    ${confirmWipe?`<p class="err">Wirklich alle Einträge auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen.</p><div class="btns"><button class="btn small" data-a="wipe-yes" style="background:var(--beweg)">Ja, alles löschen</button><button class="btn ghost small" data-a="wipe-no">Abbrechen</button></div>`
      :`<button class="btn danger" data-a="wipe">Einwilligung widerrufen und alle Daten löschen</button>`}</div></div>`;
}

function bausteineCard(){
  const un=IK.unlockedBausteine(S); if(!un.length) return "";
  const w=IK.currentWeek(S), paused=S.pausedBausteinIds||[];
  return `<div class="card"><h2>Deine Bausteine</h2>${un.map(b=>{ const p=paused.includes(b.id), a=w&&w.activeBausteinIds.includes(b.id);
    return `<div class="kv" style="align-items:center"><span style="display:flex;gap:8px;align-items:center"><span class="dot" style="--c:${PC[b.pillar]}"></span>${esc(b.label)}</span>
      <button class="btn ghost small" data-a="${p?"resume":"pause"}" data-v="${b.id}" style="min-height:40px">${p?"Wieder aufnehmen":"Pausieren"}</button></div>
      <p class="note" style="margin-top:-6px">${p?"pausiert":a?"in deinem Check-in":"kommt mit der nächsten Woche"}</p>`;}).join("")}</div>`;
}

/* ---------- Kodierung für Sicherung und QR ---------- */
const b64u = u8 => btoa(String.fromCharCode.apply(null,u8)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
async function encode(obj){ const raw=new TextEncoder().encode(JSON.stringify(obj));
  if(window.CompressionStream){ try{ const cs=new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw")); return "z"+b64u(new Uint8Array(await new Response(cs).arrayBuffer())); }catch(e){} }
  return "j"+b64u(raw); }
async function decode(code){ code=code.trim().replace(/^.*#t=/,""); const kind=code[0], u8=unb64u(code.slice(1));
  if(kind==="z"){ const ds=new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate-raw")); return JSON.parse(await new Response(ds).text()); }
  return JSON.parse(new TextDecoder().decode(u8)); }
function exportable(){ const o=Object.assign({}, S); delete o.lastBackup; return o; }
function adopt(o){
  if(!o||o.v!==2) throw new Error(o&&o.p?"Diese Sicherung stammt aus der alten Tracker-Version und passt nicht mehr.":"Das ist keine innen-kultur-Sicherung.");
  S=Object.assign(blank(), o); save();
}
async function backup(){
  const name=`innen-kultur-sicherung-${IK.localDay()}.json`, file=new File([JSON.stringify(exportable())],name,{type:"application/json"});
  try{
    if(navigator.canShare&&navigator.canShare({files:[file]})&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) await navigator.share({files:[file],title:"innen kultur Sicherung"});
    else{ const a=document.createElement("a"); a.href=URL.createObjectURL(file); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},1000); }
    S.lastBackup=Date.now(); save(); flash="Sicherung gespeichert.";
  }catch(e){ flash = e&&e.name==="AbortError" ? "Sicherung abgebrochen." : "Speichern hat nicht geklappt. Nutze die Übertragung per Code."; }
  render();
}
async function makeTransfer(){
  const code=await encode(exportable()), url=location.origin+location.pathname+"#t="+code; let svg="";
  try{ const q=qrcode(0,"L"); q.addData(url); q.make(); svg=q.createSvgTag({cellSize:4,margin:2,scalable:true}); }catch(e){ svg=""; }
  transfer={code,svg}; render();
}
function afterRestore(msg){ flash=msg; if(S.onboardingCompletedAt){ view="heute"; } else { ob=S.product?"goals":"code"; obD=null; startOnboarding(ob); return; } render(); window.scrollTo(0,0); }

/* ---------- Beispieldaten ---------- */
function loadDemo(){
  S=blank(); S.code="KOMPLETT-DEMO"; S.product="komplett"; S.demo=true; S.goals=["energie","bauch"];
  const now=new Date(), today=IK.localDay(now), start=IK.addDays(today,-17);
  S.consentHealthDataAt=S.onboardingCompletedAt=new Date(now-18*864e5).toISOString();
  S.baselines=[{createdAt:S.onboardingCompletedAt, energie:2, bauch:3, schlaf:2, bewegung:2, entspannt:2}];
  const rows=[ // bunt, licht, bewegt, erholt, bauch, energie, stress, schlaf, pflanzen, minuten
    [1,0,1,3,3,3,4,6.5,12,35],[1,1,0,3,3,3,3,7,15,10],[0,0,1,2,3,2,4,6,8,40],[1,1,0,3,3,3,3,7,14,15],[0,1,0,3,2,3,4,6.5,9,5],[1,0,1,3,3,3,3,7.5,18,45],[0,0,0,3,3,2,4,6,7,0],
    [1,1,1,4,3,3,3,7,20,40],[1,1,0,3,4,3,3,7,16,20],[1,0,1,4,4,4,2,7.5,22,35],[0,1,1,3,3,3,3,7,12,30],[1,1,0,4,4,3,3,7,19,15],[1,1,1,4,4,4,2,8,24,50],[1,0,1,4,3,4,3,7,17,30],
    [1,1,1,4,4,4,3,7.5,21,35],[1,1,0,4,4,3,3,7,18,20]];
  const ts=(day,h)=>new Date(day+"T"+h).toISOString();
  VID.VIDEOS.filter(v=>v.week===1).forEach(v=>IK.markSeen(S,v.id,ts(IK.addDays(start,-1),"19:00")));
  const seenOn={2:["2.0","2.1","2.2","2.3","2.4"], 9:["3.0","3.1","2.5"]};
  const bst=i=>({ballaststoff:i%3!==0, bildschirm:i%2===0, kraft:i%3===0, fermentiert:i%2===1});
  rows.forEach((r,i)=>{ const day=IK.addDays(start,i+(i>=7?1:0));
    (seenOn[i]||[]).forEach(id=>IK.markSeen(S,id,ts(day,"12:00")));
    IK.saveCheckIn(S,{basis:{bunt:!!r[0],morgenlicht:!!r[1],bewegt30:!!r[2]},bausteine:i>=7?bst(i):{},erholt:r[3],bauch:r[4],energie:r[5],stress:r[6],schlafStunden:r[7],pflanzen:r[8],bewegungMin:r[9]},day,ts(day,"21:00")); });
  S.wakeTime="06:45"; S.lightSpot="Weg zum Bäcker"; S.why="Mit meinen Enkeln noch auf Berge steigen."; S.standTest=11; S.standTestAt=S.onboardingCompletedAt;
  IK.unlockEvents(S,uctx()).forEach(x=>{ S.noticesSeen[x.id]=S.onboardingCompletedAt; });
  save(); view="heute"; render(); window.scrollTo(0,0);
}

/* ---------- Ereignisse ---------- */
document.addEventListener("click", e=>{
  const el=e.target.closest("[data-a]"); if(!el||el.disabled) return;
  const a=el.dataset.a, v=el.dataset.v;
  if(a==="tour-next"){ tour.i=Math.min(tour.i+1,IN.TOUR.length-1); return showTourStep(); }
  if(a==="tour-back"){ tour.i=Math.max(tour.i-1,0); return showTourStep(); }
  if(a==="tour-end"){ endTour(); return go("heute"); }
  if(a==="tour-finish"){ endTour(); if(v){ videoId=v; view="video"; flash=""; render(); return window.scrollTo(0,0); } return go("heute"); }
  if(a==="tour-start"){ return startTour(); }
  if(tour) return; // während der Tour reagiert nur die Tour
  if(a==="noop") return;
  if(a==="sheet"){ sheetOpen=true; sheetItem=null; return render(); }
  if(a==="sheet-close"){ sheetOpen=false; return render(); }
  if(a==="sheet-item"){ sheetItem = sheetItem===v ? "" : v; return render(); }
  if(a==="notice-all"){ openNotices().forEach(x=>markNotice(x.id)); sheetOpen=false; return render(); }
  if(a==="tick"){ toggleTick(v); haptic("tap"); return render(); }
  if(a==="focus-done"){ if(!basisState(v)) toggleTick(v); haptic("success"); flash="Abgehakt. Abends ist es im Check-in schon ausgewählt."; return render(); }
  if(a==="focus-later"){ const d=IK.localDay(); S.focusSnooze={[d]:(((S.focusSnooze||{})[d])||[]).concat(v)}; save(); return render(); }
  if(a==="ci-next"){ ciStep=2; render(); return window.scrollTo(0,0); }
  if(a==="ci-back"){ readNums(); ciStep=1; render(); return window.scrollTo(0,0); }
  if(a==="ci-more"){ readNums(); ciMore=!ciMore; return render(); }
  if(a==="set-theme"){ S.eveningMode=v; save(); return render(); }
  if(a==="set-haptic"){ S.haptics=v==="on"; save(); if(S.haptics) haptic("tap"); return render(); }
  if(a==="go"){ if(el.dataset.root) navStack=[]; else if(v!==view) pushNav(); return go(v); }
  if(a==="back") return back(v);
  if(a==="ob") return startOnboarding(v);
  if(a==="demo") return loadDemo();
  if(a==="goal"){ const g=obD.goals, i=g.indexOf(v); if(i>=0) g.splice(i,1); else if(g.length<3) g.push(v); return render(); }
  if(a==="time"){ obD.reminderTime=v||null; return render(); }
  if(a==="ptime"){ S.reminderTime=v||null; save(); return render(); }
  if(a==="consent"){ obD.consent=!obD.consent; return render(); }
  if(a==="finish") return finishOnboarding();
  if(a==="set"){ const [scope,k]=el.dataset.k.split("."), n=+v;
    if(scope==="bl"){ obD.baseline[k]=obD.baseline[k]===n?undefined:n; } else { readNums(); draft[k]=draft[k]===n?undefined:n; }
    haptic("tap"); return render(); }
  if(a==="basis"){ readNums(); draft.basis[v]=!draft.basis[v]; haptic("tap"); return render(); }
  if(a==="save-ci") return saveCheckin();
  if(a==="bst"){ readNums(); draft.bausteine[v]=draft.bausteine[v]!==true; haptic("tap"); return render(); }
  if(a==="pick-new"){ readNums(); const n=draft.newBausteinIds, i=n.indexOf(v); if(i>=0) n.splice(i,1); else if(n.length<IK.MAX_NEW_PER_WEEK) n.push(v); return render(); }
  if(a==="kursweek"){ kursWeek=+v; return render(); }
  if(a==="kurspart"){ // springt in die erste Woche des Teils, in der noch ein Video offen ist
    const ws=Object.keys(VID.WEEKS).map(Number).filter(n=>(v==="basis"?n<=4:n>4)&&n<=weeksTotal());
    kursWeek=ws.find(n=>{ const q=IK.weekVideoProgress(VID.VIDEOS,S,n); return q.seen<q.total; }) ?? ws[0] ?? 1; return render(); }
  if(a==="video"){ if(view!=="video") pushNav(); videoId=v; view="video"; flash=""; freshIds=[]; freshTodos=[]; render(); return window.scrollTo(0,0); }
  if(a==="seen"){ const before=new Set(IK.newUnlocks(S,uctx()).map(x=>x.id)), tBefore=new Set(IK.todoStatus(S,IN.TODOS).filter(t=>t.unlocked&&(!t.input||t.inputOpen)).map(t=>t.id)); IK.markSeen(S,v);
    freshTodos=starterActive()?IK.todoStatus(S,IN.TODOS).filter(t=>!t.done&&t.unlocked&&(!t.input||t.inputOpen)&&!tBefore.has(t.id)).map(t=>t.id):[];
    const fresh=IK.newUnlocks(S,uctx()).filter(x=>!before.has(x.id));
    fresh.filter(x=>x.type==="baustein").forEach(x=>markNotice(x.id)); // erklärt die Baustein-Karte darunter
    freshIds=fresh.filter(x=>x.type!=="baustein").map(x=>x.id); save(); haptic(fresh.length?"unlock":"tap");
    const b=IK.bausteinForVideo(v); flash=b?`Gesehen. Damit ist „${b.label}“ freigeschaltet.`:"Als gesehen markiert."; return render(); }
  if(a==="goto"){ let g=null; try{ g=JSON.parse(el.dataset.g); }catch(err){} if(el.dataset.n) markNotice(el.dataset.n); sheetOpen=false; lockFor=null; return goTo(g); }
  if(a==="lock"){ lockFor=v; haptic("tap"); return render(); }
  if(a==="lock-close"){ lockFor=null; return render(); }
  if(a==="notice-ok"){ markNotice(v); freshIds=freshIds.filter(x=>x!==v); sheetItem=null; return render(); }
  if(a==="todo-tick"){ S.todosDone=S.todosDone||{}; if(S.todosDone[v]) delete S.todosDone[v]; else S.todosDone[v]=new Date().toISOString(); save(); return render(); }
  if(a==="field"){ focusTodo=null; return saveField(v); }
  if(a==="mat"){ pushNav(); if(el.dataset.goLib){ view="bibliothek"; libTab="handouts"; wissen=null; } mat=v; render(); return window.scrollTo(0,0); }
  if(a==="mat-close"){ if(navStack.length) return back(); mat=null; render(); return window.scrollTo(0,0); }
  if(a==="weekcheck-done"){ const w=IK.currentWeek(S); IK.completeWeek(S); save(); view="heute"; haptic("strong");
    flash=`Woche ${w.index} abgeschlossen. Mit deinem nächsten Check-in startet Woche ${w.index+1}.`; render(); return window.scrollTo(0,0); }
  if(a==="unseen"){ IK.markUnseen(S,v); save(); flash=""; return render(); }
  if(a==="activate"){ const r=IK.activateNow(S,v); save(); flash=r==="active"?"Ab deinem nächsten Check-in dabei.":r==="queued"?"Kommt mit deiner nächsten Tracker-Woche zuerst dran.":""; return render(); }
  if(a==="pause"){ IK.pauseBaustein(S,v); save(); return render(); }
  if(a==="resume"){ const r=IK.resumeBaustein(S,v); save(); flash=r==="active"?"Wieder in deinem Check-in.":"Kommt mit deiner nächsten Tracker-Woche wieder dazu."; return render(); }
  if(a==="libtab"){ libTab=v; return render(); }
  if(a==="wissen"){ pushNav(); wissen=v; render(); return window.scrollTo(0,0); }
  if(a==="wissen-close"){ if(navStack.length) return back(); wissen=null; render(); return window.scrollTo(0,0); }
  if(a==="print") return printCard(v);
  if(a==="rebase"){ obD={goals:S.goals, reminderTime:S.reminderTime, consent:true, baseline:{}}; rebase=true; render(); return window.scrollTo(0,0); }
  if(a==="rebase-cancel"){ rebase=false; obD=null; return render(); }
  if(a==="rebase-save"){ S.baselines.push(Object.assign({createdAt:new Date().toISOString()}, obD.baseline)); save(); rebase=false; obD=null; flash="Neuer Startpunkt gespeichert."; render(); return window.scrollTo(0,0); }
  if(a==="backup") return backup();
  if(a==="transfer") return makeTransfer();
  if(a==="copy"){ (navigator.clipboard?navigator.clipboard.writeText(transfer.code):Promise.reject()).then(()=>{el.textContent="Kopiert";}).catch(()=>{const t=document.getElementById("tcode"), s=getSelection(), r=document.createRange(); r.selectNodeContents(t); s.removeAllRanges(); s.addRange(r); el.textContent="Markiert, jetzt kopieren";}); return; }
  if(a==="receive"){ const t=document.getElementById("tin").value; if(!t.trim()) return;
    decode(t).then(o=>{ adopt(o); transfer=null; afterRestore("Übertragung übernommen. Dieses Gerät hat jetzt denselben Stand."); })
      .catch(err=>{ flash=err&&err.message&&!/JSON|atob|decode/i.test(err.message)?err.message:"Der Code ist unvollständig. Kopier ihn noch einmal komplett."; render(); }); return; }
  if(a==="upgrade"){ const c=document.getElementById("up").value.trim().toUpperCase();
    if(/^KOMPLETT-[A-Z0-9]{4,}$/.test(c)){ S.product="komplett"; S.code=c; save(); flash="Komplett freigeschaltet: Woche 5 bis 8 sind offen."; } else flash="Für das Upgrade brauchst du einen Code, der mit KOMPLETT- beginnt.";
    return render(); }
  if(a==="pend-yes"){ try{ adopt(pending); flash="Übertragung übernommen."; }catch(err){ flash=err.message; } pending=null; return render(); }
  if(a==="pend-no"){ pending=null; return render(); }
  if(a==="wipe"){ confirmWipe=true; return render(); }
  if(a==="wipe-no"){ confirmWipe=false; return render(); }
  if(a==="wipe-yes"){ S=blank(); save(); confirmWipe=false; view="heute"; ob="welcome"; obD=null; flash=""; render(); return window.scrollTo(0,0); }
});
document.addEventListener("keydown", e=>{ if(tour&&e.key==="Escape"){ endTour(); return go("heute"); } if((sheetOpen||lockFor)&&e.key==="Escape"){ sheetOpen=false; lockFor=null; return render(); } if(e.key!=="Enter") return; const t=e.target; if(t&&t.id&&t.id.startsWith("f-")){ e.preventDefault(); saveField(t.id.slice(2)); } });
document.addEventListener("submit", e=>{ if(e.target.dataset.form==="code"){ e.preventDefault(); unlock(document.getElementById("code").value); } });
document.addEventListener("change", e=>{
  if(e.target.matches("[data-kf]")){ kursFilter=e.target.value; haptic("tap"); return render(); }
  if(e.target.id!=="imp") return; const f=e.target.files[0]; if(!f) return; const r=new FileReader();
  r.onload=()=>{ try{ adopt(JSON.parse(r.result)); S.lastBackup=Date.now(); save(); afterRestore("Sicherung geladen. Alle Einträge sind wieder da."); }
    catch(err){ flash=err instanceof SyntaxError?"Diese Datei ist keine innen-kultur-Sicherung.":err.message; render(); } };
  r.readAsText(f);
});

async function fromLink(){
  const m=location.hash.match(/^#t=(.+)$/); if(!m) return;
  try{ const o=await decode(m[1]);
    if(S.onboardingCompletedAt||S.checkins.length){ pending=o; view="profil"; } else { adopt(o); afterRestore("Übertragung übernommen."); }
  }catch(e){ flash="Der Übertragungs-Link ist unvollständig."; }
  history.replaceState(null,"",location.pathname);
}
// Wer schon vor diesem Update dabei war, bekommt keine Flut alter Hinweise.
if(migrateNotices && S.onboardingCompletedAt){ IK.unlockEvents(S,uctx()).forEach(x=>{ S.noticesSeen[x.id]="update"; }); save(); }
fromLink().then(render);
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
})();
