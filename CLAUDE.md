# innen kultur – Hinweise für die Arbeit am Projekt

## Sprache und Ton

Alles, was Nutzerinnen und Nutzer lesen, ist auf Deutsch, in der Du-Form, ohne
Ausrufezeichen und ohne Heilsversprechen. Konkrete Zahlen statt „mehr“ oder
„weniger“: Minuten, Gramm, Uhrzeiten. Jeder Text sagt, was jetzt zu tun ist.

## Materialien: informativ, nicht zum Ausfüllen

Wochenpläne, Handouts, Mini-Karten und Goodies werden gelesen, nicht
ausgedruckt und ausgefüllt. Deshalb gilt für jedes neue und jedes überarbeitete
Dokument:

- **keine Kästchen zum Ankreuzen**, keine Tracker-Tabellen zum Abhaken,
  keine Linien zum Beschriften, keine Felder zum Eintragen
- Eingetragen, abgehakt und nachgehalten wird **in der App**. Das Material
  erklärt, was die App fragt, und zeigt Beispielwerte.
- Statt „Fertig, wenn ☐“ heißt es „Geschafft, wenn …“ als Aussage.
  Statt „Uhrzeit eintragen“ heißt es „Die App fragt nach einer Uhrzeit“.
- Wo früher eine leere Zeile stand, steht jetzt ein Beispiel oder eine
  Erklärung. Nichts bleibt leer stehen.

Die Druckvorlagen in `app.js` (Handout Woche 1, Mini-Karte Morgen, Mini-Karte
Abend) folgen derselben Regel. Sie unterscheiden sich von den PDFs nur darin,
dass sie die eigenen Angaben aus den To-dos als Werte einsetzen.

## Wo was liegt

- `tools/material/` – Texte und Generator für alle PDFs, siehe README dort.
  Ein Lauf: `python3 tools/material/build.py`
- `inhalte.js` – To-dos, Materialien, Baustein-Texte der App
- `logic.js` – Rechenmodul, Bausteine, Freischaltregeln. Tests: `node --test`
- `data/kursplan.csv` → `node tools/kursplan-import.js` schreibt `videos.js`

## Nach jeder Änderung

1. `node --test` muss grün sein.
2. `VERSION` in `sw.js` hochzählen, sonst behalten installierte Apps den alten
   Stand aus dem Cache.
3. Änderungen über einen Branch und einen Pull Request, nicht direkt auf `main`.
