/* innen kultur · Videoliste
   VORLÄUFIG: Woche 2 stammt aus dem App-Mockup (Screen 05), die übrigen Titel sind Platzhalter.
   Ersetzen durch den CSV-Export des Kursplan-Boards (Collection „videos“: title, woche, saeule, typ, dauer, baustein, order), SPEC §6.
   Felder wie SPEC §4 „Video“. url bleibt leer, bis Kurs-Plattform und Player feststehen (SPEC §10). */
(function(root){
"use strict";
const WEEKS = {
  1:{title:"Deine Basis"},
  2:{title:"Futter & Kraft"},
  3:{title:"Fermentiert & Ausdauer"},
  4:{title:"Ruhe & Rhythmus"}
};
// [id, Woche, Säule, Typ, Titel, Minuten, machJetzt]
const ROWS = [
  ["1.0",1,"intro","Intro","Willkommen in deinem Loop",3],
  ["1.1",1,"darm","Kern","Der Pflanzen-Teller",10],
  ["1.2",1,"schlaf","Kern","Morgenlicht und feste Aufstehzeit",10],
  ["1.3",1,"beweg","Kern","30 Minuten Bewegung am Tag",10],
  ["1.4",1,"recap","Kern","Recap: Was die Basis für später bedeutet",8],

  ["2.0",2,"intro","Intro","Deine Basis läuft, jetzt kommen Bausteine",3],
  ["2.1",2,"darm","Kern","Ballaststoffe & Präbiotika",12],
  ["2.1b",2,"darm","Praxis","30 Pflanzen pro Woche ohne Mehraufwand",10],
  ["2.1c",2,"darm","Praxis","Hülsenfrüchte ohne Blähungen",10],
  ["2.2",2,"schlaf","Kern","Die Abendroutine Schritt für Schritt",12,"Stell dir eine Erinnerung 30 Minuten vor deiner Schlafenszeit. Ab dann bleibt das Handy weg."],
  ["2.2b",2,"schlaf","Kern","Schlaf & Hunger",12],
  ["2.2c",2,"schlaf","Vertiefung","Bildschirm & Blaulicht",10],
  ["2.3",2,"beweg","Kern","Warum Muskelkraft zählt",12],
  ["2.3b",2,"beweg","Mitmach","15 Minuten Kraft",15],
  ["2.3c",2,"beweg","Kern","Protein & Muskel",12],
  ["2.4",2,"recap","Kern","Gewohnheiten, die bleiben",12],

  ["3.0",3,"intro","Intro","Woche 3: tiefer rein",3],
  ["3.1",3,"darm","Kern","Fermentiertes für deinen Darm",12,"Schau in deinen Kühlschrank: Was davon ist fermentiert? Schreib dir eine Sache auf die Einkaufsliste."],
  ["3.2",3,"schlaf","Kern","Die letzte Mahlzeit und dein Schlaf",12],
  ["3.3",3,"beweg","Kern","Zone 2: locker und lange",12],
  ["3.4",3,"recap","Kern","Recap: Ausdauer für die nächsten Jahre",10],

  ["4.0",4,"intro","Intro","Woche 4: Ruhe reinbringen",3],
  ["4.1",4,"darm","Kern","In Ruhe essen",12],
  ["4.2",4,"schlaf","Kern","Dein Schlafrhythmus",10],
  ["4.2b",4,"schlaf","Kern","Koffein und Schlaf",10],
  ["4.3",4,"beweg","Kern","Die Runterfahr-Routine",12],
  ["4.4",4,"recap","Kern","Dein Loop-Plan nach dem Kurs",12]
];
const VIDEOS = ROWS.map(([id,week,pillar,type,title,durationMin,machJetzt],i)=>({id,week,pillar,type,title,durationMin,order:i,machJetzt:machJetzt||null,url:null}));
const api = {WEEKS, VIDEOS};
if(typeof module!=="undefined" && module.exports) module.exports = api; else root.IK_VIDEOS = api;
})(typeof globalThis!=="undefined" ? globalThis : this);
