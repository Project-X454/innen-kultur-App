# Material: Wochenpläne, Handouts, Mini-Karten, Goodies

Hier entstehen die PDFs im Ordner `pdf/`, die die App zum Laden anbietet. Texte ändern,
neu bauen, fertig — die App selbst muss dafür nicht angefasst werden.

## Neu bauen

```
python3 tools/material/build.py
```

Das erzeugt alle PDFs neu und kopiert die 23 Dateien nach `pdf/`. Mit `--nur-bauen`
bleibt `pdf/` unberührt und alles landet nur in `tools/material/out/`.

Gebraucht werden Python mit **Playwright** (Chromium) und **Pillow**:

```
pip install playwright pillow && playwright install chromium
```

Am Ende steht hinter jeder Datei `overflow: []`. Steht dort eine Seitenzahl, läuft diese
Seite über: Der Text ist zu lang geworden und würde abgeschnitten gedruckt. Dann den
Text kürzen und noch einmal bauen.

## Wo welcher Text steht

| Datei | Inhalt |
|---|---|
| `todos_data.py` | die 28 To-dos: Titel, Darum, drei Schritte, Fertig-wenn, Tipp, Eingabe |
| `content.py` | die neun Bausteine (Zählt, Zählt nicht), die „Mach jetzt“-Sätze, die Warnzeichen |
| `apptexte_data.py` | Texte, die nur die App braucht: Kurzname, Frage, Zeile im Wochenrückblick, Freischalt-Texte |
| `rezepte.py` | die 20 Rezepte mit Zutaten, Schritten, Einkaufsliste und Nährwerttabelle |
| `base.py` | das gemeinsame Design: Farben, Schriften, Kopf und Fuß, Symbole |

Die vier Bauskripte dazu: `todos.py` (Wochenpläne), `handouts.py`, `minis.py`,
`goodies.py`. `texte.py` baut das Prüfdokument „App-Texte“, das nicht in die App geht.

## Von hier in die App

`gen_app.py` erzeugt aus denselben Daten die Blöcke für `inhalte.js` und `rezepte.js`:

```
python3 tools/material/gen_app.py
```

Die Dateien landen in `tools/material/out/js_*.txt` und werden von Hand in `inhalte.js`
beziehungsweise `rezepte.js` übernommen. Wer hier Texte ändert, sollte also auch dort
nachziehen, sonst sagen PDF und App Unterschiedliches.

Drei Druckvorlagen laufen nicht über diesen Ordner, weil die App sie mit den eigenen
Angaben füllt: Handout Woche 1, Mini-Karte Morgen und Mini-Karte Abend stehen in
`app.js` und werden über `tools/pdf-export.js` zu PDFs. Das Design ist dasselbe.

## Fotos

`photos/` enthält die Bilder für die Goodies (eine Seite je Rezept), `photos_mini/`
dieselben Motive kleiner für die Mini-Karten. Die Quellen stehen in `credits.json`
(Unsplash, Nutzername und Foto-Kennung); der Nachweis wird im Goodie auf der Seite
„Fotos“ mitgedruckt. Wer ein Foto austauscht, legt es unter demselben Namen ab und
baut neu.

## Was wohin gehört

```
tools/material/out/     Zwischenstand, nicht im Repository (HTML und PDFs)
pdf/                    was die App ausliefert, hier landen 23 Dateien
```

Zwei PDFs sind nur zur Prüfung gedacht und werden nicht kopiert:
`innen-kultur-app-texte-woche-1-4.pdf` (alle App-Texte zum Gegenlesen) und
`innen-kultur-mini-karten-woche-1-4.pdf` (alle Karten in einer Datei).

## Kleine Helfer

```
python3 tools/material/sheet.py out/innen-kultur-wochenplan-woche-2.pdf 3 110 1-5 blatt
```

legt alle Seiten einer PDF nebeneinander als `chk/blatt.png` ab — praktisch, um ein
Layout schnell im Ganzen zu sehen. Die Zahlen sind: Spalten, Auflösung, Seitenbereich.
