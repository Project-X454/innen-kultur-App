# Zusatztexte für die App (Entwurf): Check-in-Zeile, Beispiel und Knopf je Baustein; Kurzname, Frage und Rückblick-Text je To-do; Texte zu den Freischaltungen
BX = {
 "ballaststoff": dict(sub="Eine Portion zusätzlich", bsp="1 EL geschrotete Leinsamen im Müsli", go="Was zählt als Booster?"),
 "bildschirm":   dict(sub="Letzte Stunde ohne Bildschirm", bsp="Das Handy liegt ab 21:30 Uhr im Flur", go="So klappt die letzte Stunde"),
 "kraft":        dict(sub="2 Einheiten pro Woche", bsp="Dienstag und Freitag je 15 Minuten", go="Was zählt als Krafteinheit?"),
 "fermentiert":  dict(sub="Eine Portion mit lebenden Kulturen", bsp="150 g Naturjoghurt zum Frühstück", go="Was zählt als fermentiert?"),
 "letzte_mz":    dict(sub="3 Stunden vor dem Schlafen fertig", bsp="Abendessen bis 19:30 Uhr, Schlafen um 22:30 Uhr", go="So findest du deine Zeit"),
 "zone2":        dict(sub="20 Minuten im Sprechtempo", bsp="Zügig zur Arbeit gehen und zurück", go="So geht der Sprechtest"),
 "in_ruhe":      dict(sub="Eine Mahlzeit ohne Bildschirm", bsp="Abendessen am Tisch, das Handy liegt im Flur", go="Was zählt als „in Ruhe“?"),
 "koffein":      dict(sub="Letztes Koffein bis 12 Uhr", bsp="Nach dem Mittag Kräutertee statt Kaffee", go="Wo Koffein drinsteckt"),
 "runterfahren": dict(sub="15 Minuten vor dem Schlafen", bsp="Video 4.3 mitmachen oder 10 Atemzüge im Bett", go="Was zählt als Runterfahren?"),
}
# (Woche, Tag): (Kurzname, Frage auf der To-do-Seite, Text im Wochenrückblick; {v} = eingetragener Wert)
TX = {
 (2,1): ("Dein Booster", "Welchen Booster nimmst du diese Woche jeden Tag dazu?", "Dein Booster: {v}"),
 (2,2): ("Bildschirm-Stopp", "Ab wann bleibt der Bildschirm abends aus?", "Bildschirm-Stopp: {v} Uhr"),
 (2,3): ("Krafttermine", "An welchen zwei Tagen trainierst du diese Woche?", "Kraft an: {v}"),
 (2,4): ("Hülsenfrüchte", "Hast du heute Hülsenfrüchte selbst gekocht?", "Hülsenfrüchte selbst gekocht"),
 (2,5): ("Schlafzimmer", "Was änderst du heute in deinem Schlafzimmer?", "Schlafzimmer: {v}"),
 (2,6): ("Kraft mitmachen", "Hast du die 15 Minuten Kraft heute geschafft?", "Erste Krafteinheit geschafft"),
 (2,7): ("Wenn-dann", "An welche Gewohnheit koppelst du einen Baustein?", "{v}"),
 (3,1): ("Fermentiertes", "Welches fermentierte Lebensmittel hast du gekauft?", "Im Kühlschrank: {v}"),
 (3,2): ("Küche zu", "Ab wann isst du abends nichts mehr?", "Küche zu: {v} Uhr"),
 (3,3): ("Zone-2-Tempo", "Wie viele Minuten warst du im Sprechtempo unterwegs?", "{v} Minuten im Zone-2-Tempo"),
 (3,4): ("Ansetzen oder vorkochen", "Wofür entscheidest du dich?", "{v} gemacht"),
 (3,5): ("Wochenende", "Wann stehst du am Wochenende auf?", "Am Wochenende auf um {v} Uhr"),
 (3,6): ("Nach dem Essen", "Bist du heute nach dem Abendessen gegangen?", "10 Minuten nach dem Essen gegangen"),
 (3,7): ("Wiedereinstieg", "Was machst du nach einem schlechten Tag als Erstes?", "Wiedereinstieg: {v}"),
 (4,1): ("In Ruhe essen", "Hast du heute eine Mahlzeit ohne Bildschirm gegessen?", "Eine Mahlzeit in Ruhe gegessen"),
 (4,2): ("Letzter Kaffee", "Bis wann trinkst du ab jetzt Koffein?", "Letzter Kaffee: {v} Uhr"),
 (4,3): ("Runterfahren", "Hast du die Runterfahr-Routine heute mitgemacht?", "Runterfahr-Routine ausprobiert"),
 (4,4): ("Atemübung", "Hast du die Atemübung heute Abend gemacht?", "Atemübung ausprobiert"),
 (4,5): ("Aufsteh-Test", "Wie oft stehst du jetzt in 30 Sekunden ganz auf?", "Aufsteh-Test: {v}, Start: {start}"),
 (4,6): ("Stress-Werkzeug", "Welches Werkzeug passt am besten in deinen Alltag?", "Dein Stress-Werkzeug: {v}"),
 (4,7): ("Loop-Plan", "Welche drei Bausteine behältst du?", "Dein Loop: {v}"),
}
# Freischaltungen: (Woche, Art, Titel, frei nach, Warum, Wann)
MAT = [
 (2,"Mini-Karte","15 Minuten Kraft","Video 2.4","Sechs Übungen ohne Geräte, mit leichterer und schwererer Variante.","Leg sie neben die Matte. So brauchst du beim nächsten Mal kein Video."),
 (2,"Mini-Karte","Bohnen & Linsen","Video 2.6","Einweich- und Kochzeiten auf einen Blick, dazu fünf schnelle Ideen.","Häng sie in die Küche, bevor du das erste Mal Hülsenfrüchte kochst."),
 (2,"Handout","Deine ersten Bausteine","allen Kernvideos der Woche","Die drei Bausteine, Ballaststoffe pro Portion, Abendroutine und Kraftplan auf zwei Seiten.","Druck es aus und hak die Woche darauf ab."),
 (2,"Goodie","Ballaststoff-Frühstücke","dem Wochen-Check","Dein Dankeschön für Woche 2: fünf Frühstücke, in die dein Booster gleich hineinpasst.","Such dir eines aus und iss es drei Tage hintereinander."),
 (3,"Mini-Karte","Dein Fermentiertes","Video 3.1","Was mit lebenden Kulturen zählt, was nicht, und wie groß eine Portion ist.","Nimm sie beim nächsten Einkauf mit ans Kühlregal."),
 (3,"Mini-Karte","Sauerkraut selbst machen","Video 3.5","Zutaten, fünf Schritte und was in den ersten Wochen im Glas passiert.","Kauf Weißkohl und Salz und setz am Wochenende ein Glas an."),
 (3,"Mini-Karte","Meal-Prep in 60 Minuten","Video 3.7","Ein Ablauf im Minutentakt, die Einkaufsliste und drei Geschmacksrichtungen.","Such dir einen festen Tag in der Woche aus, am besten den Sonntag."),
 (3,"Handout","Timing für Bauch und Schlaf","allen Kernvideos der Woche","Dein Tag als Uhr, der Sprechtest für Zone 2 und eine Einkaufshilfe für Fermentiertes.","Trag deine eigenen Uhrzeiten ein und häng es an den Kühlschrank."),
 (3,"Goodie","Leichte Abendessen mit Fermentiertem","dem Wochen-Check","Dein Dankeschön für Woche 3: fünf leichte Gerichte für die Zeit vor „Küche zu“.","Plane zwei davon für die kommende Woche ein."),
 (4,"Mini-Karte","Atemübung zum Einschlafen","Video 4.5","Die Übung in fünf Schritten, mit Hilfe für Abende, an denen es nicht klappt.","Leg sie auf den Nachttisch und probier sie sieben Abende lang."),
 (4,"Mini-Karte","Deine Selbsttests","Video 4.7","Drei Tests für zu Hause und eine Tabelle für Woche 1, 4 und 8.","Trag heute deine Werte ein und vergleich mit deinem Start."),
 (4,"Handout","Stress und dein Loop-Plan","allen Kernvideos der Woche","Koffein im Überblick, drei Stress-Werkzeuge und dein Loop-Plan zum Ausfüllen.","Füll den Loop-Plan nach Video 4.10 aus und häng ihn sichtbar auf."),
 (4,"Goodie","Feierabend-Küche","dem Wochen-Check","Dein Dankeschön für Woche 4: drei ruhige Abendessen und zwei Getränke ohne Koffein.","Probier die goldene Milch als Ersatz für den Kaffee am Nachmittag."),
]

# Unterzeile je Material (Kachel in der Bibliothek)
MSUB = {"15 Minuten Kraft":"6 Übungen ohne Geräte","Bohnen & Linsen":"Einweichen, kochen, steigern","Deine ersten Bausteine":"Woche 2 auf zwei Seiten","Ballaststoff-Frühstücke":"5 Frühstücke mit Ballaststoffen",
 "Dein Fermentiertes":"Was zählt und was nicht","Sauerkraut selbst machen":"In 5 Schritten ins Glas","Meal-Prep in 60 Minuten":"4 Boxen in 60 Minuten","Timing für Bauch und Schlaf":"Woche 3 auf zwei Seiten",
 "Leichte Abendessen mit Fermentiertem":"5 leichte Abendessen","Atemübung zum Einschlafen":"4 Sekunden ein, 6 aus","Deine Selbsttests":"3 Tests, 3 Messpunkte","Stress und dein Loop-Plan":"Woche 4 auf zwei Seiten","Feierabend-Küche":"3 Abendessen, 2 Getränke"}

# Beispieltext, der im leeren Eingabefeld steht (Woche, Tag)
PLACEHOLDER = {(2, 7): "Wenn ich Kaffee koche, kommt Leinsamen ins Müsli.",
               (4, 7): "Booster, Bildschirm-Stopp, Kraft"}
