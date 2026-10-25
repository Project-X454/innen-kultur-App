/* innen kultur · Inhalte für To-dos, Freischaltungen und Materialien
   Hier stehen nur Texte und Regeln, kein Ablauf. Änderungen an Texten sind hier sicher möglich.
   Freigegeben im Dokument „Woche 1: Handouts, Goodies, Routinen & To-dos“ (25.10.2026), To-dos am 25.10.2026 auf eins pro Tag umgestellt.

   Ein To-do pro Tracker-Tag (Tag 1 bis 7), jeweils einem Bereich zugeordnet:
     id        feste Kennung, nie ändern (daran hängt der Haken auf dem Gerät)
     week, day Tracker-Woche und -Tag, ab dem es dran ist
     pillar    darm | schlaf | beweg | recap
     short     Kurzname für Kachel und Liste · title  was zu tun ist · q  die eine Frage auf der To-do-Seite
     why       ein Satz wieso · how  optional: kurze Anleitung
     after     Video, das es erklärt. Vorher gesperrt.
     input     Eingabe (field = Profilfeld, type time|text|number, chips = Vorschläge zum Antippen). Ohne input: selbst abhaken.
     auto      wird automatisch abgehakt, sobald das Profilfeld ausgefüllt ist
     link      optional: Wissenskarte mit Ideen
     win       wie es im Wochenrückblick heißt ({v} = eingetragener Wert) */
(function(root){
"use strict";

const TODOS = [
  {id:"d1", week:1, day:1, pillar:"schlaf", short:"Aufstehzeit", title:"Leg deine feste Aufstehzeit fest", after:"1.2", min:"1 Minute",
    q:"Wann stehst du ab jetzt jeden Tag auf, auch am Wochenende?",
    why:"Eine feste Zeit stellt deine innere Uhr. Stell den Wecker gleich darauf.",
    auto:{field:"wakeTime"}, input:{field:"wakeTime", type:"time", label:"Meine Aufstehzeit", chips:["06:30","07:00","07:30"]}, win:"Feste Aufstehzeit: {v} Uhr"},
  {id:"d2", week:1, day:2, pillar:"darm", short:"3 neue Pflanzen", title:"Kauf beim nächsten Einkauf 3 neue Pflanzen", after:"1.1", min:"beim Einkauf",
    q:"Welche 3 Pflanzen kaufst du sonst nie?",
    why:"Mehr Vielfalt auf dem Teller ist der einfachste Schritt für deinen Bauch. Gemüse, Obst, Hülsenfrüchte, Nüsse und Kräuter zählen.",
    link:{kind:"wissen", id:"pflanzen", label:"Ideen auf der Pflanzen-Karte"}, win:"3 neue Pflanzen gekauft"},
  {id:"d3", week:1, day:3, pillar:"beweg", short:"Aufsteh-Test", title:"Mach den Aufsteh-Test als Startwert", after:"1.3", min:"1 Minute",
    q:"Wie oft stehst du in 30 Sekunden ganz auf?",
    why:"In Woche 4 machst du ihn noch einmal und siehst, was sich getan hat.",
    how:"Stabiler Stuhl ohne Rollen, Arme vor der Brust gekreuzt. 30 Sekunden so oft wie möglich ganz aufstehen und wieder hinsetzen. Nur ohne Beschwerden.",
    auto:{field:"standTest"}, input:{field:"standTest", type:"number", label:"Wiederholungen in 30 Sekunden", chips:["8","12","16"]}, win:"Aufsteh-Test: {v} Wiederholungen, dein Startwert"},
  {id:"d4", week:1, day:4, pillar:"schlaf", short:"Morgenlicht-Ort", title:"Leg deinen Morgenlicht-Ort fest", after:"1.2", min:"1 Minute",
    q:"Wo bekommst du morgens 10 Minuten Tageslicht?",
    why:"Ein fester Ort macht es leichter. Ab morgen steht er in deinem Morgen-Fokus.",
    auto:{field:"lightSpot"}, input:{field:"lightSpot", type:"text", label:"Mein Ort", chips:["Balkon","Weg zum Bäcker","Fenster am Esstisch"]}, win:"Morgenlicht-Ort: {v}"},
  {id:"d5", week:1, day:5, pillar:"beweg", short:"Bewegungssnacks", title:"Leg zwei Bewegungssnacks in den Kalender", after:"1.8", min:"2 Minuten",
    q:"Wann passen dir diese Woche zwei kurze Bewegungspausen?",
    why:"Was im Kalender steht, passiert eher als ein guter Vorsatz. 5 bis 10 Minuten reichen.",
    link:{kind:"wissen", id:"aktiv", label:"Was zählt als Bewegung?"}, win:"2 Bewegungssnacks im Kalender"},
  {id:"d6", week:1, day:6, pillar:"darm", short:"Pflanzen zählen", title:"Zähl deine Pflanzen von heute", after:"1.1", min:"1 Minute",
    q:"Wie viele verschiedene Pflanzen hast du heute gegessen?",
    why:"Zählen macht Vielfalt sichtbar. Jede Sorte zählt einmal, auch Kräuter und Gewürze.",
    auto:{field:"plantCount"}, input:{field:"plantCount", type:"number", label:"Verschiedene Pflanzen heute", chips:["10","15","20"]}, win:"{v} verschiedene Pflanzen an einem Tag gezählt"},
  {id:"d7", week:1, day:7, pillar:"recap", short:"Dein Warum", title:"Schreib dein Warum in einem Satz", after:"1.11", min:"1 Minute",
    q:"Wofür willst du mit 80 noch fit sein?",
    why:"Dein Satz steht danach im Fortschritt und im Wochenrückblick.",
    auto:{field:"why"}, input:{field:"why", type:"text", label:"Mein Warum", placeholder:"z. B. Mit meinen Enkeln noch auf Berge steigen"}}
];

// Freischaltung der Basis-Routinen: was, wann, wo, wieso.
const BASIS_NOTICE = {
  bunt:{title:"„Bunt gegessen“ ist jetzt in deinem Check-in",
    why:"Du weißt jetzt, warum Vielfalt auf dem Teller für deinen Bauch zählt.",
    when:"Heute Abend im Check-in abhaken, wenn eine Mahlzeit zur Hälfte aus Pflanzen bestand.",
    where:"Abend-Check-in · Basis", go:{kind:"wissen", id:"pflanzen", label:"Was zählt als Pflanze?"}},
  morgenlicht:{title:"„Morgenlicht“ ist jetzt in deinem Check-in",
    why:"Licht am Morgen und eine feste Aufstehzeit stellen deine innere Uhr.",
    when:"Ab morgen früh: innerhalb von 60 Minuten nach dem Aufstehen 10 Minuten raus. Abends im Check-in abhaken.",
    where:"Abend-Check-in · Basis", go:{kind:"wissen", id:"licht", label:"So klappt Morgenlicht"}},
  bewegt30:{title:"„30 Min bewegt“ ist jetzt in deinem Check-in",
    why:"Bewegung im Alltag zählt genauso wie Sport.",
    when:"Heute schon möglich: 30 Minuten zusammen, aufgeteilt zählt auch. Abends im Check-in abhaken.",
    where:"Abend-Check-in · Basis", go:{kind:"wissen", id:"aktiv", label:"Was zählt alles?"}}
};

// Handouts, Mini-Karten und Goodies. card = druckbare Karte in der App, recipes = Inhalt des Goodies.
const MATERIALS = [
  {id:"teller", kind:"Mini-Karte", week:1, title:"Mini-Karte: Pflanzen-Teller", short:"Pflanzen-Teller", sub:"Was als Pflanze zählt", pillar:"darm", unlock:{video:"1.6"}, card:"pflanzen", tab:"handouts",
    why:"Für den Kühlschrank: was als Pflanze zählt und was du diese Woche einkaufst.",
    when:"Druck sie aus oder speichere sie als PDF, bevor du das nächste Mal einkaufen gehst."},
  {id:"morgen", kind:"Mini-Karte", week:1, title:"Mini-Karte: Dein Morgen", short:"Dein Morgen", sub:"Aufstehen, Licht, Mobility", pillar:"schlaf", unlock:{video:"1.9"}, card:"morgen", tab:"handouts",
    why:"Deine Aufstehzeit, dein Morgenlicht-Ort und 10 Minuten Mobility für 7 Tage zum Abhaken.",
    when:"Leg sie heute Abend neben das Bett, dann ist sie morgen früh als Erstes da."},
  {id:"handout1", kind:"Handout", week:1, title:"Handout Woche 1: Deine Basis auf zwei Seiten", short:"Deine Basis", sub:"Woche 1 auf zwei Seiten", pillar:"recap", unlock:{kernOfWeek:1}, card:"handout1", tab:"handouts",
    why:"Alle drei Routinen, dein Wochenplan und die Warnzeichen auf zwei Seiten.",
    when:"Druck es für den Rest der Woche aus. Deine Angaben aus den To-dos stehen schon drin."},
  {id:"goodie1", kind:"Goodie", week:1, title:"Goodie: Bunte Teller in 15 Minuten", short:"Bunte Teller", sub:"5 Rezepte in 15 Minuten", pillar:"beweg", unlock:{weekCompleted:1}, tab:"rezepte",
    why:"Dein Dankeschön für die erste Woche: 5 schnelle Rezepte nach dem Pflanzen-Teller und eine Einkaufsliste.",
    when:"Such dir für Woche 2 zwei Rezepte aus. Sie passen schon zu den Ballaststoffen, die jetzt kommen.",
    recipes:[] /* 5 Rezepte vom Team: {title, minutes, plants, ingredients:[…], steps:[…]} */}
];

// Mach jetzt: Knopf, der direkt zur passenden Stelle führt (nur wo die App die Aufgabe selbst aufnehmen kann).
const MACH_JETZT_GO = {
  "1.2":  {kind:"todo", id:"d1", label:"Aufstehzeit eintragen"},
  "1.4":  {kind:"profil", label:"Erinnerungszeit prüfen"},
  "1.6":  {kind:"material", id:"teller", label:"Mini-Karte Pflanzen-Teller"},
  "1.9":  {kind:"material", id:"morgen", label:"Mini-Karte Dein Morgen"},
  "1.11": {kind:"todo", id:"d7", label:"Warum notieren"}
};

/* App-Tour nach dem Onboarding (und jederzeit unter Profil).
   view = welcher Screen · target = welches Element hervorgehoben wird (CSS-Auswahl, mehrere durch Komma)
   kind "intro" | "notice" | "logic" = Karte in der Mitte ohne Hervorhebung */
const TOUR = [
  {kind:"intro", view:"heute", title:"Herzlich willkommen bei innen kultur",
    text:"Schön, dass du da bist. In den nächsten Wochen bringen wir Ernährung & Darm, Schlaf und Bewegung in einen Loop, der zu deinem Alltag passt. In 2 Minuten zeigen wir dir, wie die App funktioniert."},
  {view:"heute", target:".focus", title:"Dein Fokus für heute",
    text:"Oben steht immer, was gerade dran ist: morgens das Morgenlicht, tagsüber dein nächstes Video, abends der Check-in. Ab 18 Uhr wird die App ruhig und dunkel, passend zum Feierabend."},
  {view:"heute", target:".rts", title:"Routinen schon tagsüber abhaken",
    text:"Tipp eine Routine an, sobald du sie erledigt hast. Abends ist sie im Check-in schon ausgewählt, du bestätigst nur noch. Eine Routine erscheint, sobald du ihr Video gesehen hast."},
  {view:"heute", target:".starter-card", title:"Jeden Tag ein kleines To-do",
    text:"Pro Tag wartet ein kleiner Schritt aus Ernährung, Schlaf oder Bewegung, z. B. deine Aufstehzeit festlegen. Hier siehst du, wie viele du diese Woche geschafft hast. Am Ende der Woche zeigt dir die App alles, was du erreicht hast."},
  {kind:"preview", preview:"learn", view:"heute", title:"Weiterlernen",
    text:"Hier steht immer dein nächstes Video. Am Ende jedes Videos wartet eine Mach-jetzt-Aufgabe, die in 30 Sekunden erledigt ist."},
  {view:"heute", target:"nav.tabs .ci, aside.side .btn", title:"Check-in von überall",
    text:"Den Check-in öffnest du von jedem Screen aus: auf dem Handy mit dem Logo unten in der Mitte, am Computer oben links. Daneben erreichst du Heute, Kurs, Fortschritt und Bibliothek."},
  {view:"kurs", target:".kseg", title:"Der Kurs: alle Videos sind frei",
    text:"Schau in deinem Tempo, so viel du willst. Die Wochen geben dir eine sinnvolle Reihenfolge. Basis sind Woche 1 bis 4, Komplett zusätzlich Woche 5 bis 8."},
  {view:"kurs", target:".vrow:nth-child(2), .vrow", title:"Videos schalten deinen Tracker frei",
    text:"Eine Routine oder ein Baustein erscheint im Check-in erst, wenn du das Video dazu gesehen hast. So weißt du immer, warum du etwas abhakst."},
  {kind:"preview", preview:"material", view:"kurs", title:"Handout und Goodie jeder Woche",
    text:"Das Handout einer Woche wird frei, sobald du ihre Kernvideos gesehen hast. Das Goodie gibt es als Dankeschön für deinen Wochen-Check, unabhängig davon, wie die Woche lief."},
  {kind:"notice", view:"heute", title:"Wenn etwas frei wird, sagen wir es dir",
    text:"Neues sammelt sich hinter der Glocke oben rechts. Jede Freischaltung sagt dir wieso, wann und wo, und ein Knopf führt dich direkt hin."},
  {view:"bibliothek", target:".segc", title:"Die Bibliothek",
    text:"Wissenskarten zum Nachlesen, Rezepte, Pläne und Handouts. Was noch gesperrt ist, zeigt dir, wodurch es frei wird. Ein Tipp darauf bringt dich zum passenden Video."},
  {kind:"preview", preview:"loop", view:"fortschritt", title:"Dein Loop-Score",
    text:"Eine Zahl von 0 bis 100, die zeigt, wie rund dein Loop gerade läuft. Sie entsteht aus deinen Check-ins, hier ein Beispiel nach einer Woche. Nach Woche 1 vergleichen wir außerdem mit deinem Startpunkt."},
  {kind:"logic", view:"heute", title:"So wird was frei",
    text:"Damit du nichts suchen musst, hier alles auf einen Blick. Du findest die Tour jederzeit wieder unter Profil."}
];
// Beispiel für den Loop-Score (Tour und leerer Fortschritt). Der Score wird mit derselben Formel wie in der App berechnet.
const LOOP_EXAMPLE = {
  values:{erholt:3.8, energie:3.4, bauch:3.7, stress:3.0, basisPct:68, bausteinePct:75, days:6},
  start:[["Schlafqualität",2,3.8],["Energie",3,3.4],["Bauchgefühl",3,3.7]]
};
// Übersicht für die letzte Tour-Karte: was, wodurch, wo.
const UNLOCK_OVERVIEW = [
  ["Basis-Routine im Check-in", "nach ihrem Video (1.1, 1.2, 1.3)", "Check-in"],
  ["Baustein im Check-in", "nach seinem Video, ab der nächsten Tracker-Woche oder sofort per „Ab heute mittracken“", "Check-in"],
  ["To-do des Tages", "an seinem Tracker-Tag, nach seinem Video", "Heute · To-dos"],
  ["Mini-Karte", "nach ihrem Video", "Bibliothek · Handouts"],
  ["Handout der Woche", "nach allen Kernvideos der Woche", "Bibliothek · Handouts"],
  ["Wochen-Check", "nach 7 eingetragenen Tagen, ab 5, wenn die Woche schon länger läuft", "Heute"],
  ["Goodie", "mit dem Wochen-Check", "Bibliothek · Rezepte"],
  ["Woche 5 bis 8", "mit dem Komplett-Code", "Kurs"]
];

// Warnzeichen aus Video 1.5 für Handout Woche 1. Vom Team zu liefern und vor der Veröffentlichung ärztlich zu prüfen.
const WARNZEICHEN = [];

const api = {TODOS, BASIS_NOTICE, MATERIALS, MACH_JETZT_GO, TOUR, LOOP_EXAMPLE, UNLOCK_OVERVIEW, WARNZEICHEN};
if(typeof module!=="undefined" && module.exports) module.exports = api; else root.IK_INHALT = api;
})(typeof globalThis!=="undefined" ? globalThis : this);
