/* innen kultur · Inhalte für To-dos, Freischaltungen und Materialien
   Hier stehen nur Texte und Regeln, kein Ablauf. Änderungen an Texten sind hier sicher möglich.
   Freigegeben im Dokument „Woche 1: Handouts, Goodies, Routinen & To-dos“ (25.10.2026), To-dos am 25.10.2026 auf eins pro Tag umgestellt.
   Woche 2 bis 4 ergänzt am 13.11.2026 (Wochenpläne, Handouts, Mini-Karten, Goodies, Baustein-Texte). Die Rezepte stehen nur in den Goodie-PDFs, nicht in der App.

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
    why:"Zählen macht Vielfalt sichtbar. Jede Sorte zählt einmal, auch Kräuter und Gewürze. Trägst du die Zahl abends im Check-in unter „Mehr eintragen“ ein, hakt sich das To-do von selbst ab.",
    auto:{field:"plantCount"}, input:{field:"plantCount", type:"number", label:"Verschiedene Pflanzen heute", chips:["10","15","20"]}, win:"{v} verschiedene Pflanzen an einem Tag gezählt"},
  {id:"d7", week:1, day:7, pillar:"recap", short:"Dein Warum", title:"Schreib dein Warum in einem Satz", after:"1.11", min:"1 Minute",
    q:"Wofür willst du mit 80 noch fit sein?",
    why:"Dein Satz steht danach im Fortschritt und im Wochenrückblick.",
    auto:{field:"why"}, input:{field:"why", type:"text", label:"Mein Warum", placeholder:"z. B. Mit meinen Enkeln noch auf Berge steigen"}},
  {id:"w2d1", week:2, day:1, pillar:"darm", short:"Dein Booster", title:"Wähl deinen Ballaststoff-Booster", after:"2.1", min:"1 Minute", q:"Welchen Booster nimmst du diese Woche jeden Tag dazu?", why:"Eine feste Zutat ist leichter als ein neuer Ernährungsplan. Sie kommt einfach zu etwas dazu, das du ohnehin isst.", how:"Überleg, was du jeden Tag isst: Müsli, Joghurt, Brot, Suppe oder Salat. Wähl den Booster, der dazu passt: 1 EL geschrotete Leinsamen, 3 EL Haferflocken oder eine Handvoll Linsen. Stell ihn sichtbar dorthin, wo du ihn brauchst, und trag ihn in der App ein.", auto:{field:"booster"}, input:{field:"booster", type:"text", label:"Mein Booster", chips:["Leinsamen", "Haferflocken", "Linsen"]}, win:"Dein Booster: {v}"},
  {id:"w2d2", week:2, day:2, pillar:"schlaf", short:"Bildschirm-Stopp", title:"Leg deine Bildschirm-Stopp-Zeit fest", after:"2.2", min:"1 Minute", q:"Ab wann bleibt der Bildschirm abends aus?", why:"Die letzte Stunde ohne Bildschirm gibt deinem Kopf Zeit, herunterzufahren. Eine feste Uhrzeit nimmt dir die Entscheidung ab.", how:"Nimm deine Schlafenszeit und zieh 60 Minuten ab. Stell im Handy eine tägliche Erinnerung auf diese Uhrzeit. Leg fest, wo das Handy über Nacht liegt. Am besten außerhalb des Schlafzimmers.", auto:{field:"screenStop"}, input:{field:"screenStop", type:"time", label:"Bildschirm aus ab", chips:["21:30", "22:00", "22:30"]}, win:"Bildschirm-Stopp: {v} Uhr"},
  {id:"w2d3", week:2, day:3, pillar:"beweg", short:"Krafttermine", title:"Trag deine 2 Krafteinheiten in den Kalender ein", after:"2.3", min:"2 Minuten", q:"An welchen zwei Tagen trainierst du diese Woche?", why:"Muskeln brauchen den Reiz zweimal pro Woche. Feste Termine sorgen dafür, dass die Einheiten nicht ans Wochenende rutschen.", how:"Such zwei Tage mit mindestens einem Tag Pause dazwischen. Wähl eine Uhrzeit, zu der du selten gestört wirst. Morgens vor dem Duschen klappt bei vielen am besten. Trag beide Termine mit 20 Minuten und einer Erinnerung ein.", auto:{field:"strengthDays"}, input:{field:"strengthDays", type:"text", label:"Meine zwei Tage", chips:["Mo + Do", "Di + Fr", "Mi + Sa"]}, win:"Kraft an: {v}"},
  {id:"w2d4", week:2, day:4, pillar:"darm", short:"Hülsenfrüchte", title:"Koch einmal Hülsenfrüchte selbst", after:"2.6", min:"15 Minuten aktiv", q:"Hast du heute Hülsenfrüchte selbst gekocht?", why:"Richtig vorbereitet sind Bohnen und Linsen gut bekömmlich. Einmal selbst gekocht, verlieren sie ihren Schrecken.", how:"Für den schnellen Weg nimmst du rote Linsen. Sie brauchen kein Einweichen und sind in 12 Minuten gar. Für Kichererbsen oder Bohnen: am Vorabend einweichen, das Wasser wegschütten und in frischem Wasser weich kochen. Iss beim ersten Mal eine kleine Portion, etwa 3 Esslöffel, zum Beispiel im Salat oder in der Suppe.", link:{kind:"material", id:"huelsen_k", label:"Dazu passt: Mini-Karte Bohnen & Linsen"}, win:"Hülsenfrüchte selbst gekocht"},
  {id:"w2d5", week:2, day:5, pillar:"schlaf", short:"Schlafzimmer", title:"Ändere eine Sache in deinem Schlafzimmer", after:"2.7", min:"5 Minuten", q:"Was änderst du heute in deinem Schlafzimmer?", why:"Dunkel, kühl und ruhig: Das ist der Rahmen für guten Schlaf. Eine einzige Veränderung reicht für heute.", how:"Geh abends bei ausgeschaltetem Licht ins Schlafzimmer und schau dich um: Was leuchtet, was stört? Wähl eine Sache: Lichtquellen abkleben, vor dem Schlafen 10 Minuten lüften oder das Handy auslagern. Setz sie heute um und trag ein, was du geändert hast.", auto:{field:"bedroomFix"}, input:{field:"bedroomFix", type:"text", label:"Das ändere ich", chips:["Abdunkeln", "Kühler lüften", "Handy raus"]}, win:"Schlafzimmer: {v}"},
  {id:"w2d6", week:2, day:6, pillar:"beweg", short:"Kraft mitmachen", title:"Mach die 15 Minuten Kraft einmal mit", after:"2.4", min:"15 Minuten", q:"Hast du die 15 Minuten Kraft heute geschafft?", why:"Das erste Mal ist das schwerste. Danach kennst du jede Übung und weißt, welche Variante zu dir passt.", how:"Leg Matte und Wasser bereit und starte Video 2.4. Mach alle sechs Übungen mit. Wähl die leichtere Variante, wenn die Ausführung unsauber wird. Notier danach, welche Übung dir am schwersten fiel. Dort steigerst du zuerst.", link:{kind:"material", id:"kraft_k", label:"Dazu passt: Mini-Karte 15 Minuten Kraft"}, win:"Erste Krafteinheit geschafft"},
  {id:"w2d7", week:2, day:7, pillar:"recap", short:"Wenn-dann", title:"Schreib deinen Wenn-dann-Satz", after:"2.12", min:"1 Minute", q:"An welche Gewohnheit koppelst du einen Baustein?", why:"Neue Gewohnheiten halten am besten, wenn sie an etwas hängen, das du ohnehin jeden Tag tust.", how:"Wähl den Baustein, der dir diese Woche am schwersten fiel. Such einen festen Auslöser im Alltag: Kaffee kochen, Zähne putzen, Laptop zuklappen. Schreib den Satz nach dem Muster „Wenn ich …, dann …“ und trag ihn ein.", auto:{field:"ifThen"}, input:{field:"ifThen", type:"text", label:"Mein Wenn-dann-Satz", placeholder:"z. B. Wenn ich Kaffee koche, kommt Leinsamen ins Müsli"}, win:"{v}"},
  {id:"w3d1", week:3, day:1, pillar:"darm", short:"Fermentiertes", title:"Kauf ein fermentiertes Lebensmittel mit lebenden Kulturen", after:"3.1", min:"beim Einkauf", q:"Welches fermentierte Lebensmittel hast du gekauft?", why:"Fermentiertes bringt lebende Bakterien mit. Sie überleben aber nur, wenn das Produkt nicht erhitzt wurde.", how:"Geh ans Kühlregal. Was ungekühlt im Regal steht, wurde fast immer erhitzt. Wähl ein Produkt, das dir schmeckt: Naturjoghurt, Kefir, frisches Sauerkraut oder Kimchi. Lies das Etikett. Steht dort „pasteurisiert“ oder „wärmebehandelt“, stell es zurück.", auto:{field:"fermentPick"}, input:{field:"fermentPick", type:"text", label:"Das habe ich gekauft", chips:["Naturjoghurt", "Kefir", "Frisches Sauerkraut"]}, win:"Im Kühlschrank: {v}"},
  {id:"w3d2", week:3, day:2, pillar:"schlaf", short:"Küche zu", title:"Leg deine „Küche zu“-Zeit fest", after:"3.2", min:"1 Minute", q:"Ab wann isst du abends nichts mehr?", why:"Wer 3 Stunden vor dem Schlafen fertig gegessen hat, schläft meist ruhiger. Die Verdauung ist dann durch.", how:"Nimm deine Schlafenszeit und zieh 3 Stunden ab. Das ist deine „Küche zu“-Zeit. Plane das Abendessen so, dass du 30 Minuten vorher am Tisch sitzt. Trag die Zeit ein und überleg, was du abends stattdessen trinkst: Wasser oder Kräutertee.", auto:{field:"kitchenClose"}, input:{field:"kitchenClose", type:"time", label:"Küche zu ab", chips:["18:30", "19:00", "19:30"]}, win:"Küche zu: {v} Uhr"},
  {id:"w3d3", week:3, day:3, pillar:"beweg", short:"Zone-2-Tempo", title:"Finde dein Zone-2-Tempo mit dem Sprechtest", after:"3.3", min:"10 Minuten", q:"Wie viele Minuten warst du im Sprechtempo unterwegs?", why:"Zone 2 ist das Tempo, bei dem du schneller atmest, dich aber noch unterhalten kannst. Hier trainierst du Ausdauer, ohne dich zu erschöpfen.", how:"Geh zügig los oder steig aufs Rad. Nach 3 Minuten sagst du einen ganzen Satz laut. Klappt er ohne Luftholen in der Mitte, passt das Tempo. Kannst du singen, bist du zu langsam. Schaffst du nur einzelne Wörter, bist du zu schnell. Halt dieses Tempo 10 Minuten und trag die Minuten ein.", auto:{field:"zone2Min"}, input:{field:"zone2Min", type:"number", label:"Minuten im Sprechtempo", chips:["10", "20", "30"]}, win:"{v} Minuten im Zone-2-Tempo"},
  {id:"w3d4", week:3, day:4, pillar:"darm", short:"Ansetzen oder vorkochen", title:"Setz ein Sauerkraut an oder mach 60 Minuten Meal-Prep", after:"3.5", min:"30 bis 60 Minuten", q:"Wofür entscheidest du dich?", why:"Beides nimmt dir unter der Woche Arbeit ab. Was vorbereitet im Kühlschrank steht, wird auch gegessen.", how:"Entscheide dich: Sauerkraut braucht 30 Minuten und zwei Wochen Geduld. Meal-Prep braucht 60 Minuten und reicht für vier Mahlzeiten. Nimm die passende Mini-Karte und kauf ein, was fehlt. Leg los und trag ein, wofür du dich entschieden hast.", auto:{field:"prepChoice"}, input:{field:"prepChoice", type:"text", label:"Meine Entscheidung", chips:["Sauerkraut", "Meal-Prep"]}, link:{kind:"material", id:"kraut_k", label:"Dazu passt: Mini-Karte Sauerkraut"}, win:"{v} gemacht"},
  {id:"w3d5", week:3, day:5, pillar:"schlaf", short:"Wochenende", title:"Leg deine Aufstehzeit fürs Wochenende fest", after:"3.8", min:"1 Minute", q:"Wann stehst du am Wochenende auf?", why:"Wer am Wochenende drei Stunden länger schläft, fühlt sich montags wie nach einem Flug. Eine Stunde Unterschied verkraftet die innere Uhr gut.", how:"Schau auf deine feste Aufstehzeit aus Woche 1. Leg fürs Wochenende eine Zeit fest, die höchstens 1 Stunde später liegt. Stell den Wecker für Samstag und Sonntag und plan etwas Schönes für den Morgen.", auto:{field:"weekendWake"}, input:{field:"weekendWake", type:"time", label:"Aufstehzeit am Wochenende", chips:["07:30", "08:00", "08:30"]}, win:"Am Wochenende auf um {v} Uhr"},
  {id:"w3d6", week:3, day:6, pillar:"beweg", short:"Nach dem Essen", title:"Geh 10 Minuten nach dem Abendessen", after:"3.4", min:"10 Minuten", q:"Bist du heute nach dem Abendessen gegangen?", why:"Ein kurzer Spaziergang nach dem Essen lässt den Blutzucker flacher ansteigen und hilft der Verdauung.", how:"Stell die Schuhe vor dem Essen an die Tür. Geh innerhalb von 30 Minuten nach der Mahlzeit los. Gemütliches Tempo reicht. Nach 5 Minuten drehst du um. Fertig.", win:"10 Minuten nach dem Essen gegangen"},
  {id:"w3d7", week:3, day:7, pillar:"recap", short:"Wiedereinstieg", title:"Leg deinen ersten Schritt nach einem schlechten Tag fest", after:"3.12", min:"1 Minute", q:"Was machst du nach einem schlechten Tag als Erstes?", why:"Schlechte Tage kommen. Entscheidend ist, dass aus einem Tag keine Woche wird. Ein fester erster Schritt bringt dich zurück.", how:"Denk an deinen letzten schlechten Tag. Was hätte dir am nächsten Morgen geholfen? Wähl eine Routine, die du immer schaffst. Sie soll höchstens 10 Minuten dauern. Schreib sie auf und merk dir die Regel: nie zweimal hintereinander auslassen.", auto:{field:"restartStep"}, input:{field:"restartStep", type:"text", label:"Mein erster Schritt", chips:["Morgens raus ins Licht", "Bunt essen", "10 Minuten gehen"]}, win:"Wiedereinstieg: {v}"},
  {id:"w4d1", week:4, day:1, pillar:"darm", short:"In Ruhe essen", title:"Iss eine Mahlzeit ohne Handy und Bildschirm", after:"4.1", min:"15 Minuten", q:"Hast du heute eine Mahlzeit ohne Bildschirm gegessen?", why:"Verdauung beginnt im Kopf. Wer in Ruhe isst, kaut besser, merkt früher, dass er satt ist, und entlastet den Bauch.", how:"Wähl die Mahlzeit, bei der es am ehesten klappt. Für viele ist das das Abendessen. Leg das Handy in einen anderen Raum, schalt den Fernseher aus und setz dich an den Tisch. Nimm dir mindestens 15 Minuten. Leg das Besteck zwischendurch ab.", win:"Eine Mahlzeit in Ruhe gegessen"},
  {id:"w4d2", week:4, day:2, pillar:"schlaf", short:"Letzter Kaffee", title:"Leg deine letzte Kaffee-Uhrzeit fest", after:"4.2", min:"1 Minute", q:"Bis wann trinkst du ab jetzt Koffein?", why:"Koffein wirkt lange nach. Vom Kaffee um 15 Uhr ist am späten Abend noch etwa die Hälfte im Blut.", how:"Schreib auf, wann du gestern Kaffee, Schwarztee, Cola oder Energy getrunken hast. Leg eine letzte Uhrzeit fest. Als Richtwert gilt 12 Uhr. Überleg, was du am Nachmittag stattdessen trinkst, und stell es bereit.", auto:{field:"lastCaffeine"}, input:{field:"lastCaffeine", type:"time", label:"Letztes Koffein bis", chips:["10:00", "12:00", "13:00"]}, win:"Letzter Kaffee: {v} Uhr"},
  {id:"w4d3", week:4, day:3, pillar:"beweg", short:"Runterfahren", title:"Mach die Runterfahr-Routine einmal mit", after:"4.3", min:"15 Minuten", q:"Hast du die Runterfahr-Routine heute mitgemacht?", why:"Ruhige Bewegung am Abend senkt die Anspannung im Körper. Sie ist das Signal: Der Tag ist vorbei.", how:"Leg die Matte bereit und dimm das Licht. Starte Video 4.3 etwa eine Stunde vor dem Schlafen und mach alle Übungen mit. Achte darauf, länger aus- als einzuatmen. Danach kommt kein Bildschirm mehr.", win:"Runterfahr-Routine ausprobiert"},
  {id:"w4d4", week:4, day:4, pillar:"schlaf", short:"Atemübung", title:"Probier die Atemübung im Bett aus", after:"4.5", min:"5 Minuten", q:"Hast du die Atemübung heute Abend gemacht?", why:"Langes Ausatmen bremst den Puls. Die Übung gibt deinem Kopf eine einfache Aufgabe, wenn die Gedanken kreisen.", how:"Leg dich auf den Rücken, eine Hand auf den Bauch, Licht aus. Atme 4 Sekunden durch die Nase ein und 6 Sekunden langsam aus. Wiederhol das 10 Runden. Schweifst du ab, fängst du einfach wieder bei 1 an.", link:{kind:"material", id:"atem_k", label:"Dazu passt: Mini-Karte Atemübung"}, win:"Atemübung ausprobiert"},
  {id:"w4d5", week:4, day:5, pillar:"beweg", short:"Aufsteh-Test", title:"Mach den Aufsteh-Test noch einmal", after:"4.7", min:"1 Minute", q:"Wie oft stehst du jetzt in 30 Sekunden ganz auf?", why:"Vier Wochen sind vergangen. Der Vergleich mit deinem Startwert zeigt, was regelmäßige Bewegung schon verändert hat.", how:"Nimm denselben Stuhl wie in Woche 1 und kreuz die Arme vor der Brust. 30 Sekunden so oft wie möglich ganz aufstehen und wieder hinsetzen. Trag die Zahl ein. Die App zeigt dir den Vergleich mit Woche 1.", auto:{field:"standTest4"}, input:{field:"standTest4", type:"number", label:"Wiederholungen in 30 Sekunden", chips:["10", "14", "18"]}, link:{kind:"material", id:"tests_k", label:"Dazu passt: Mini-Karte Deine Selbsttests"}, win:"Aufsteh-Test: {v}, Start: {start}"},
  {id:"w4d6", week:4, day:6, pillar:"recap", short:"Stress-Werkzeug", title:"Wähl dein Stress-Werkzeug für zwischendurch", after:"4.8", min:"1 Minute", q:"Welches Werkzeug passt am besten in deinen Alltag?", why:"Stress lässt sich nicht vermeiden. Ein Werkzeug, das du kennst, nutzt du aber auch dann, wenn es eng wird.", how:"Probier alle drei Werkzeuge aus dem Video einmal aus: länger ausatmen, 2 Minuten raus, Treppe hoch. Wähl das, was am besten in deinen Alltag passt. Leg einen Auslöser fest, zum Beispiel: vor jedem Meeting oder nach jeder schwierigen Mail.", auto:{field:"stressTool"}, input:{field:"stressTool", type:"text", label:"Mein Werkzeug", chips:["Länger ausatmen", "2 Minuten raus", "Treppe hoch"]}, win:"Dein Stress-Werkzeug: {v}"},
  {id:"w4d7", week:4, day:7, pillar:"recap", short:"Loop-Plan", title:"Leg deinen Loop-Plan fest", after:"4.10", min:"3 Minuten", q:"Welche drei Bausteine behältst du?", why:"Neun Bausteine auf einmal hält niemand durch. Deine Basis plus drei feste Bausteine: Das ist dein Loop für die nächsten Wochen.", how:"Schau im Fortschritt nach, welche Bausteine du am häufigsten geschafft hast. Wähl drei aus, am besten je einen für Darm, Schlaf und Bewegung. Trag sie ein und schreib sie zusätzlich ins Handout von Woche 4.", auto:{field:"loopPlan"}, input:{field:"loopPlan", type:"text", label:"Meine drei Bausteine", chips:["Ballaststoff-Booster", "60 Min. bildschirmfrei", "Krafteinheit"], placeholder:"z. B. Booster, Bildschirm-Stopp, Kraft"}, win:"Dein Loop: {v}"}
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
    where:"Abend-Check-in · Basis", go:{kind:"wissen", id:"aktiv", label:"Was zählt alles?"}},
  abend:{title:"„Abendroutine“ ist jetzt in deinem Check-in",
    why:"Ein ruhiger Abend und eine feste Zubettgehzeit sind die andere Hälfte deiner inneren Uhr.",
    when:"Ab heute Abend: zur festen Zeit ins Bett, die letzten 30 Minuten ohne Handy. Im Check-in am nächsten Abend unter „Gestern Abend“ abhaken.",
    where:"Abend-Check-in · Basis", go:{kind:"wissen", id:"abend", label:"So klappt die Abendroutine"}}
};

/* Freischaltung der Bausteine (Woche 2 bis 4): derselbe Aufbau wie oben, ein Eintrag je Baustein aus logic.js. */
const BAUSTEIN_NOTICE = {
  ballaststoff:{title:"„Ballaststoff-Booster“ ist jetzt in deinem Check-in", why:"Ballaststoffe füttern die guten Bakterien in deinem Darm.", when:"Ab heute: jeden Tag eine Portion deines Boosters zusätzlich.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"ballaststoff", label:"Was zählt als Booster?"}},
  bildschirm:{title:"„60 Min. bildschirmfrei“ ist jetzt in deinem Check-in", why:"Ohne Bildschirm kommt dein Kopf leichter zur Ruhe.", when:"Ab heute Abend: die letzte Stunde vor dem Schlafen ohne Bildschirm.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"bildschirm", label:"So klappt die letzte Stunde"}},
  kraft:{title:"„Krafteinheit (2 pro Woche)“ ist jetzt in deinem Check-in", why:"Muskeln halten dich stark, stabil und im Stoffwechsel aktiv.", when:"Diese Woche zweimal, am besten an festen Tagen.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"kraft", label:"Was zählt als Krafteinheit?"}},
  fermentiert:{title:"„Fermentiertes“ ist jetzt in deinem Check-in", why:"Lebende Kulturen bringen neue Bakterien mit.", when:"Ab heute: eine Portion am Tag.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"fermentiert", label:"Was zählt als fermentiert?"}},
  letzte_mz:{title:"„Letzte Mahlzeit 3 Std. vorher“ ist jetzt in deinem Check-in", why:"Wenn die Verdauung durch ist, schläfst du tiefer.", when:"Ab heute Abend: nach deiner „Küche zu“-Zeit nichts mehr essen.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"letzte_mz", label:"So findest du deine Zeit"}},
  zone2:{title:"„Zone-2-Minuten“ ist jetzt in deinem Check-in", why:"Sanfte Ausdauer stärkt Herz und Stoffwechsel, ohne dich zu erschöpfen.", when:"Ab heute: an 3 Tagen pro Woche je 20 Minuten im Sprechtempo.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"zone2", label:"So geht der Sprechtest"}},
  in_ruhe:{title:"„In Ruhe gegessen“ ist jetzt in deinem Check-in", why:"In Ruhe essen schaltet deinen Bauch auf Verdauung.", when:"Ab heute: eine Mahlzeit am Tag ohne Bildschirm.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"in_ruhe", label:"Was zählt als „in Ruhe“?"}},
  koffein:{title:"„Kein Koffein nach dem Mittag“ ist jetzt in deinem Check-in", why:"Koffein am Nachmittag ist abends noch im Blut.", when:"Ab heute: nach 12 Uhr kein Koffein mehr.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"koffein", label:"Wo Koffein drinsteckt"}},
  runterfahren:{title:"„Runterfahr-Routine“ ist jetzt in deinem Check-in", why:"Ruhige Bewegung am Abend senkt die Anspannung.", when:"Ab heute Abend: 15 Minuten vor dem Schlafen ruhig bewegen oder atmen.", where:"Abend-Check-in · Bausteine", go:{kind:"baustein-info", id:"runterfahren", label:"Was zählt als Runterfahren?"}}
};

/* „Was zählt?“ zu jedem Baustein: Unterzeile im Check-in, dazu zählt / zählt nicht / ein Beispiel. */
const BAUSTEIN_INFO = {
  ballaststoff:{sub:"Eine Portion zusätzlich", video:"2.1", yes:"Eine Portion zusätzlich, z. B. 1 EL Leinsamen, eine Handvoll Hülsenfrüchte oder 3 EL Haferflocken.", no:"Was du ohnehin jeden Tag isst.", bsp:"1 EL geschrotete Leinsamen im Müsli"},
  bildschirm:{sub:"Letzte Stunde ohne Bildschirm", video:"2.2", yes:"60 Minuten vor dem Schlafen kein Handy, Tablet, Laptop oder Fernseher.", no:"Nur den Nachtmodus einschalten.", bsp:"Das Handy liegt ab 21:30 Uhr im Flur"},
  kraft:{sub:"2 Einheiten pro Woche", video:"2.3", yes:"Mindestens 15 Minuten Kraftübungen, bis die Muskeln müde werden.", no:"Ein Spaziergang oder Treppensteigen allein.", bsp:"Dienstag und Freitag je 15 Minuten"},
  fermentiert:{sub:"Eine Portion mit lebenden Kulturen", video:"3.1", yes:"Eine Portion mit lebenden Kulturen: Naturjoghurt, Kefir, frisches Sauerkraut, Kimchi.", no:"Erhitztes, Pasteurisiertes, Sauerkraut aus der Dose, Essiggurken.", bsp:"150 g Naturjoghurt zum Frühstück"},
  letzte_mz:{sub:"3 Stunden vor dem Schlafen fertig", video:"3.2", yes:"Nach der „Küche zu“-Zeit nichts mehr gegessen. Wasser und Kräutertee sind okay.", no:"Ein „kleiner“ Snack auf dem Sofa.", bsp:"Abendessen bis 19:30 Uhr, Schlafen um 22:30 Uhr"},
  zone2:{sub:"20 Minuten im Sprechtempo", video:"3.3", yes:"Mindestens 20 Minuten, in denen du schneller atmest, aber noch ganze Sätze sprechen kannst.", no:"Schlendern oder Sprints, bei denen du nicht mehr sprechen kannst.", bsp:"Zügig zur Arbeit gehen und zurück"},
  in_ruhe:{sub:"Eine Mahlzeit ohne Bildschirm", video:"4.1", yes:"Eine Mahlzeit im Sitzen, ohne Bildschirm, mindestens 15 Minuten.", no:"Essen am Schreibtisch oder im Gehen.", bsp:"Abendessen am Tisch, das Handy liegt im Flur"},
  koffein:{sub:"Letztes Koffein bis 12 Uhr", video:"4.2", yes:"Nach 12 Uhr kein Kaffee, Schwarz- oder Grüntee, Mate, Cola oder Energy. Entkoffeiniert ist in Ordnung.", no:"Ein Espresso nach dem Mittagessen oder eine Cola am Nachmittag.", bsp:"Nach dem Mittag Kräutertee statt Kaffee"},
  runterfahren:{sub:"15 Minuten vor dem Schlafen", video:"4.3", yes:"Die 15 Minuten aus Video 4.3 oder die Atemübung aus Video 4.5.", no:"Sport oder Training am späten Abend.", bsp:"Video 4.3 mitmachen oder 10 Atemzüge im Bett"}
};

// Handouts, Mini-Karten und Goodies. card = druckbare Karte in der App, recipes = Inhalt des Goodies.
const MATERIALS = [
  {id:"plan1", kind:"Wochenplan", week:1, title:"Wochenplan Woche 1: Deine Basis", short:"Deine Basis", sub:"Woche 1 · 7 To-dos", pillar:"recap", unlock:{video:"1.0"}, pdf:"innen-kultur-wochenplan-woche-1.pdf", tab:"plaene", why:"Alle sieben To-dos der Woche auf fünf Seiten, mit Schritten, Tipp und Platz für deine Antworten.", when:"Druck ihn am Wochenanfang aus oder überflieg ihn einmal. Dann weißt du, was diese Woche auf dich zukommt."},
  {id:"teller", kind:"Mini-Karte", week:1, title:"Mini-Karte: Der Pflanzen-Teller", short:"Pflanzen-Teller", sub:"Was als Pflanze zählt", pillar:"darm", unlock:{video:"1.6"}, pdf:"innen-kultur-mini-01-pflanzen-teller.pdf", tab:"handouts", why:"Der Teller in Bildern, drei Beispiel-Teller und die Liste, was als Pflanze zählt.", when:"Häng sie an den Kühlschrank, bevor du das nächste Mal einkaufen gehst."},
  {id:"morgen", kind:"Mini-Karte", week:1, title:"Mini-Karte: Dein Morgen", short:"Dein Morgen", sub:"Aufstehen, Licht, Mobility", pillar:"schlaf", unlock:{video:"1.9"}, pdf:"innen-kultur-mini-02-dein-morgen.pdf", card:"morgen", tab:"handouts", why:"Deine ersten 30 Minuten im Ablauf, dazu deine Aufstehzeit, dein Morgenlicht-Ort und sieben Tage zum Abhaken.", when:"Leg sie heute Abend neben das Bett, dann ist sie morgen früh als Erstes da."},
  {id:"abend_k", kind:"Mini-Karte", week:1, title:"Mini-Karte: Dein Abend", short:"Dein Abend", sub:"Die drei Grundpfeiler", pillar:"schlaf", unlock:{video:"1.2"}, pdf:"innen-kultur-mini-03-dein-abend.pdf", card:"abend", tab:"handouts", why:"Die drei Grundpfeiler mit Uhrzeiten, die Extras und wie die App deinen Abend rechnet.", when:"Leg sie auf den Nachttisch und trag deine eigenen Zeiten ein."},
  {id:"bewegt_k", kind:"Mini-Karte", week:1, title:"Mini-Karte: 30 Minuten bewegt", short:"30 Minuten bewegt", sub:"Was alles zählt", pillar:"beweg", unlock:{video:"1.8"}, pdf:"innen-kultur-mini-04-30-minuten-bewegt.pdf", tab:"handouts", why:"Was alles als Bewegung zählt, Bewegungssnacks fürs Büro und eine Woche zum Planen.", when:"Trag am Wochenanfang ein, was wann passt. Aufgeteilt zählt genauso."},
  {id:"handout1", kind:"Handout", week:1, title:"Handout Woche 1: Deine Basis", short:"Deine Basis", sub:"Woche 1 auf zwei Seiten", pillar:"recap", unlock:{kernOfWeek:1}, pdf:"innen-kultur-handout-woche-1-deine-basis.pdf", card:"handout1", tab:"handouts", why:"Alle vier Routinen mit „Zählt“ und „Zählt nicht“, der Pflanzen-Teller, dein Morgen, dein Abend und der Wochen-Tracker.", when:"Druck es für den Rest der Woche aus. Deine Angaben aus den To-dos stehen schon drin."},
  {id:"goodie1", kind:"Goodie", week:1, title:"Goodie: Bunte Teller in 15 Minuten", short:"Bunte Teller", sub:"5 Rezepte in 15 Minuten", pillar:"beweg", unlock:{weekCompleted:1}, pdf:"innen-kultur-goodie-1-bunte-teller.pdf", tab:"rezepte", why:"Dein Dankeschön für die erste Woche: fünf schnelle Gerichte nach dem Pflanzen-Teller, mit Einkaufsliste.", when:"Such dir für Woche 2 zwei Rezepte aus. Sie passen schon zu den Ballaststoffen, die jetzt kommen."},
  {id:"plan2", kind:"Wochenplan", week:2, title:"Wochenplan Woche 2: Deine ersten Bausteine", short:"Deine ersten Bausteine", sub:"Woche 2 · 7 To-dos", pillar:"recap", unlock:{video:"2.0"}, pdf:"innen-kultur-wochenplan-woche-2.pdf", tab:"plaene", why:"Alle sieben To-dos der Woche auf fünf Seiten, mit Schritten, Tipp und Platz für deine Antworten.", when:"Druck ihn am Wochenanfang aus oder überflieg ihn einmal. Dann weißt du, was diese Woche auf dich zukommt."},
  {id:"kraft_k", kind:"Mini-Karte", week:2, title:"Mini-Karte: 15 Minuten Kraft", short:"15 Minuten Kraft", sub:"6 Übungen ohne Geräte", pillar:"beweg", unlock:{video:"2.4"}, pdf:"innen-kultur-mini-05-15-minuten-kraft.pdf", tab:"handouts", why:"Sechs Übungen ohne Geräte, mit leichterer und schwererer Variante.", when:"Leg sie neben die Matte. So brauchst du beim nächsten Mal kein Video."},
  {id:"huelsen_k", kind:"Mini-Karte", week:2, title:"Mini-Karte: Bohnen & Linsen", short:"Bohnen & Linsen", sub:"Einweichen, kochen, steigern", pillar:"darm", unlock:{video:"2.6"}, pdf:"innen-kultur-mini-06-bohnen-und-linsen.pdf", tab:"handouts", why:"Einweich- und Kochzeiten auf einen Blick, dazu fünf schnelle Ideen.", when:"Häng sie in die Küche, bevor du das erste Mal Hülsenfrüchte kochst."},
  {id:"handout2", kind:"Handout", week:2, title:"Handout Woche 2: Deine ersten Bausteine", short:"Deine ersten Bausteine", sub:"Woche 2 auf zwei Seiten", pillar:"recap", unlock:{kernOfWeek:2}, pdf:"innen-kultur-handout-woche-2-deine-ersten-bausteine.pdf", tab:"handouts", why:"Die drei Bausteine, Ballaststoffe pro Portion, Abendroutine und Kraftplan auf zwei Seiten.", when:"Druck es aus und hak die Woche darauf ab."},
  {id:"goodie2", kind:"Goodie", week:2, title:"Goodie: Ballaststoff-Frühstücke", short:"Ballaststoff-Frühstücke", sub:"5 Frühstücke mit Ballaststoffen", pillar:"beweg", unlock:{weekCompleted:2}, pdf:"innen-kultur-goodie-2-ballaststoff-fruehstuecke.pdf", tab:"rezepte", why:"Dein Dankeschön für Woche 2: fünf Frühstücke, in die dein Booster gleich hineinpasst.", when:"Such dir eines aus und iss es drei Tage hintereinander."},
  {id:"plan3", kind:"Wochenplan", week:3, title:"Wochenplan Woche 3: Dein Timing", short:"Dein Timing", sub:"Woche 3 · 7 To-dos", pillar:"recap", unlock:{video:"3.0"}, pdf:"innen-kultur-wochenplan-woche-3.pdf", tab:"plaene", why:"Alle sieben To-dos der Woche auf fünf Seiten, mit Schritten, Tipp und Platz für deine Antworten.", when:"Druck ihn am Wochenanfang aus oder überflieg ihn einmal. Dann weißt du, was diese Woche auf dich zukommt."},
  {id:"ferment_k", kind:"Mini-Karte", week:3, title:"Mini-Karte: Dein Fermentiertes", short:"Dein Fermentiertes", sub:"Was zählt und was nicht", pillar:"darm", unlock:{video:"3.1"}, pdf:"innen-kultur-mini-07-dein-fermentiertes.pdf", tab:"handouts", why:"Was mit lebenden Kulturen zählt, was nicht, und wie groß eine Portion ist.", when:"Nimm sie beim nächsten Einkauf mit ans Kühlregal."},
  {id:"kraut_k", kind:"Mini-Karte", week:3, title:"Mini-Karte: Sauerkraut selbst machen", short:"Sauerkraut selbst machen", sub:"In 5 Schritten ins Glas", pillar:"darm", unlock:{video:"3.5"}, pdf:"innen-kultur-mini-08-sauerkraut.pdf", tab:"handouts", why:"Zutaten, fünf Schritte und was in den ersten Wochen im Glas passiert.", when:"Kauf Weißkohl und Salz und setz am Wochenende ein Glas an."},
  {id:"prep_k", kind:"Mini-Karte", week:3, title:"Mini-Karte: Meal-Prep in 60 Minuten", short:"Meal-Prep in 60 Minuten", sub:"4 Boxen in 60 Minuten", pillar:"darm", unlock:{video:"3.7"}, pdf:"innen-kultur-mini-09-meal-prep.pdf", tab:"handouts", why:"Ein Ablauf im Minutentakt, die Einkaufsliste und drei Geschmacksrichtungen.", when:"Such dir einen festen Tag in der Woche aus, am besten den Sonntag."},
  {id:"handout3", kind:"Handout", week:3, title:"Handout Woche 3: Timing für Bauch und Schlaf", short:"Timing für Bauch und Schlaf", sub:"Woche 3 auf zwei Seiten", pillar:"recap", unlock:{kernOfWeek:3}, pdf:"innen-kultur-handout-woche-3-timing.pdf", tab:"handouts", why:"Dein Tag als Uhr, der Sprechtest für Zone 2 und eine Einkaufshilfe für Fermentiertes.", when:"Trag deine eigenen Uhrzeiten ein und häng es an den Kühlschrank."},
  {id:"goodie3", kind:"Goodie", week:3, title:"Goodie: Leichte Abendessen mit Fermentiertem", short:"Leichte Abendessen", sub:"5 leichte Abendessen", pillar:"beweg", unlock:{weekCompleted:3}, pdf:"innen-kultur-goodie-3-leichte-abendessen.pdf", tab:"rezepte", why:"Dein Dankeschön für Woche 3: fünf leichte Gerichte für die Zeit vor „Küche zu“.", when:"Plane zwei davon für die kommende Woche ein."},
  {id:"plan4", kind:"Wochenplan", week:4, title:"Wochenplan Woche 4: Ruhe und dein Loop-Plan", short:"Ruhe und dein Loop-Plan", sub:"Woche 4 · 7 To-dos", pillar:"recap", unlock:{video:"4.0"}, pdf:"innen-kultur-wochenplan-woche-4.pdf", tab:"plaene", why:"Alle sieben To-dos der Woche auf fünf Seiten, mit Schritten, Tipp und Platz für deine Antworten.", when:"Druck ihn am Wochenanfang aus oder überflieg ihn einmal. Dann weißt du, was diese Woche auf dich zukommt."},
  {id:"atem_k", kind:"Mini-Karte", week:4, title:"Mini-Karte: Atemübung zum Einschlafen", short:"Atemübung zum Einschlafen", sub:"4 Sekunden ein, 6 aus", pillar:"schlaf", unlock:{video:"4.5"}, pdf:"innen-kultur-mini-10-atemuebung.pdf", tab:"handouts", why:"Die Übung in fünf Schritten, mit Hilfe für Abende, an denen es nicht klappt.", when:"Leg sie auf den Nachttisch und probier sie sieben Abende lang."},
  {id:"tests_k", kind:"Mini-Karte", week:4, title:"Mini-Karte: Deine Selbsttests", short:"Deine Selbsttests", sub:"3 Tests, 3 Messpunkte", pillar:"beweg", unlock:{video:"4.7"}, pdf:"innen-kultur-mini-11-selbsttests.pdf", tab:"handouts", why:"Drei Tests für zu Hause und eine Tabelle für Woche 1, 4 und 8.", when:"Trag heute deine Werte ein und vergleich mit deinem Start."},
  {id:"handout4", kind:"Handout", week:4, title:"Handout Woche 4: Stress und dein Loop-Plan", short:"Stress und dein Loop-Plan", sub:"Woche 4 auf zwei Seiten", pillar:"recap", unlock:{kernOfWeek:4}, pdf:"innen-kultur-handout-woche-4-stress-und-loop-plan.pdf", tab:"handouts", why:"Koffein im Überblick, drei Stress-Werkzeuge und dein Loop-Plan zum Ausfüllen.", when:"Füll den Loop-Plan nach Video 4.10 aus und häng ihn sichtbar auf."},
  {id:"goodie4", kind:"Goodie", week:4, title:"Goodie: Feierabend-Küche", short:"Feierabend-Küche", sub:"3 Abendessen, 2 Getränke", pillar:"beweg", unlock:{weekCompleted:4}, pdf:"innen-kultur-goodie-4-feierabend-kueche.pdf", tab:"rezepte", why:"Dein Dankeschön für Woche 4: drei ruhige Abendessen und zwei Getränke ohne Koffein.", when:"Probier die goldene Milch als Ersatz für den Kaffee am Nachmittag."}
];

// Mach jetzt: Knopf, der direkt zur passenden Stelle führt (nur wo die App die Aufgabe selbst aufnehmen kann).
const MACH_JETZT_GO = {
  "1.2":  {kind:"todo", id:"d1", label:"Aufstehzeit eintragen"},
  "1.4":  {kind:"profil", label:"Erinnerungszeit prüfen"},
  "1.6":  {kind:"material", id:"teller", label:"Mini-Karte Pflanzen-Teller"},
  "1.9":  {kind:"material", id:"morgen", label:"Mini-Karte Dein Morgen"},
  "1.11": {kind:"todo", id:"d7", label:"Warum notieren"},
  "2.1": {kind:"todo", id:"w2d1", label:"Booster eintragen"},
  "2.2": {kind:"todo", id:"w2d2", label:"Bildschirm-Stopp eintragen"},
  "2.3": {kind:"todo", id:"w2d3", label:"Krafttermine eintragen"},
  "2.4": {kind:"material", id:"kraft_k", label:"Mini-Karte 15 Minuten Kraft"},
  "2.6": {kind:"material", id:"huelsen_k", label:"Mini-Karte Bohnen & Linsen"},
  "2.7": {kind:"todo", id:"w2d5", label:"Schlafzimmer eintragen"},
  "2.12": {kind:"todo", id:"w2d7", label:"Wenn-dann-Satz schreiben"},
  "3.1": {kind:"material", id:"ferment_k", label:"Mini-Karte Dein Fermentiertes"},
  "3.2": {kind:"todo", id:"w3d2", label:"„Küche zu“ eintragen"},
  "3.3": {kind:"todo", id:"w3d3", label:"Zone-2-Minuten eintragen"},
  "3.5": {kind:"material", id:"kraut_k", label:"Mini-Karte Sauerkraut"},
  "3.7": {kind:"material", id:"prep_k", label:"Mini-Karte Meal-Prep"},
  "3.8": {kind:"todo", id:"w3d5", label:"Aufstehzeit fürs Wochenende"},
  "3.12": {kind:"todo", id:"w3d7", label:"Wiedereinstieg festlegen"},
  "4.1": {kind:"todo", id:"w4d1", label:"To-do „In Ruhe essen“"},
  "4.2": {kind:"todo", id:"w4d2", label:"Letzten Kaffee eintragen"},
  "4.3": {kind:"todo", id:"w4d3", label:"To-do Runterfahren"},
  "4.5": {kind:"material", id:"atem_k", label:"Mini-Karte Atemübung"},
  "4.7": {kind:"material", id:"tests_k", label:"Mini-Karte Selbsttests"},
  "4.8": {kind:"todo", id:"w4d6", label:"Stress-Werkzeug wählen"},
  "4.10": {kind:"todo", id:"w4d7", label:"Loop-Plan festlegen"}
};

/* App-Tour nach dem Onboarding (und jederzeit unter Profil).
   view = welcher Screen · target = welches Element hervorgehoben wird (CSS-Auswahl, mehrere durch Komma)
   kind "intro" | "notice" | "logic" = Karte in der Mitte ohne Hervorhebung */
const TOUR = [
  {kind:"intro", title:"Herzlich willkommen",
    text:"In 2 Minuten zeigen wir dir, wie die App funktioniert. Alles bleibt hier auf dieser Karte, du musst nirgends hin."},
  {kind:"fokus", title:"Dein Fokus für heute",
    text:"Oben auf Heute steht immer das eine, was gerade dran ist. Ab 18 Uhr wird die App ruhig und dunkel."},
  {kind:"routinen", title:"Routinen tagsüber abhaken",
    text:"Tipp eine Routine an, sobald du sie erledigt hast. Abends bestätigst du im Check-in nur noch."},
  {kind:"checkin", title:"Check-in von überall",
    text:"Der Check-in ist das Logo unten in der Mitte, auf jedem Screen, am Computer oben links. Daneben erreichst du Heute, Kurs, Fortschritt und Bibliothek."},
  {kind:"kurs", title:"Videos schalten deinen Tracker frei",
    text:"Alle Videos sind frei, solange du an 5 von 7 Tagen eincheckst. Eine Routine erscheint im Check-in, sobald du ihr Video gesehen hast."},
  {kind:"glocke", title:"Wenn etwas frei wird, sagen wir es dir",
    text:"Neues sammelt sich hinter der Glocke oben rechts. Jeder Eintrag sagt wieso und wo, ein Knopf führt dich hin."},
  {kind:"todos", title:"Jeden Tag ein kleines To-do",
    text:"Pro Tag ein kleiner Schritt aus Ernährung, Schlaf oder Bewegung. Am Ende der Woche siehst du, was du alles geschafft hast."},
  {kind:"loop", title:"Dein Loop-Score",
    text:"Eine Zahl von 0 bis 100, die zeigt, wie rund dein Loop läuft. Sie entsteht aus deinen Check-ins."},
  {kind:"ende", title:"Alles klar, los geht's",
    text:"Du findest die Tour jederzeit wieder unter Profil."}
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
  ["Wochenplan", "mit dem ersten Video der Woche", "Bibliothek · Pläne"],
  ["Handout der Woche", "nach allen Kernvideos der Woche", "Bibliothek · Handouts"],
  ["Wochen-Check", "nach 7 eingetragenen Tagen, ab 5, wenn die Woche schon länger läuft", "Heute"],
  ["Goodie", "mit dem Wochen-Check", "Bibliothek · Rezepte"],
  ["Woche 5 bis 8", "mit dem Komplett-Code", "Kurs"]
];

// Warnzeichen aus Video 1.5 für Handout Woche 1. Vom Team zu liefern und vor der Veröffentlichung ärztlich zu prüfen.
const WARNZEICHEN = [];

const api = {TODOS, BASIS_NOTICE, BAUSTEIN_NOTICE, BAUSTEIN_INFO, MATERIALS, MACH_JETZT_GO, TOUR, LOOP_EXAMPLE, UNLOCK_OVERVIEW, WARNZEICHEN};
if(typeof module!=="undefined" && module.exports) module.exports = api; else root.IK_INHALT = api;
})(typeof globalThis!=="undefined" ? globalThis : this);
