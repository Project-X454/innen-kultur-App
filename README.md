# innen kultur – Web-App

Begleit-App zum Online-Kurs als installierbare Web-App (PWA): Onboarding mit Startpunkt, täglicher Abend-Check-in, Fortschritt mit Loop-Score und Bibliothek.
Grundlage ist die Spezifikation `SPEC.md` (Version 1.0 vom 24.10.2026, liegt nicht im Repository).

**Datenschutz:** Alle Einträge bleiben im Browser des Geräts (localStorage). Es gibt keinen Server und keine Datenbank.
Sicherung per Datei, Gerätewechsel per QR-Code oder Übertragungscode. Vor dem ersten Check-in gibt es eine ausdrückliche Einwilligung, die sich unter Profil widerrufen lässt (dabei werden alle Daten gelöscht).

## Testen

1. Link öffnen (GitHub Pages, siehe unten).
2. „Los geht's“ → Code eingeben: jeder Code im Format `BASIS-XXXX` (4 Wochen) oder `KOMPLETT-XXXX` (8 Wochen) – oder „Demo mit Beispieldaten“.
3. Als App installieren:
   - **iPhone (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“
   - **Android (Chrome):** Menü ⋮ → „App installieren“
   - **PC (Chrome/Edge):** Installieren-Symbol rechts in der Adressleiste

Rechenmodul testen (Node 18 oder neuer): `node --test`

## Stand der Umsetzung (Reihenfolge aus SPEC §8)

- [x] 1. Onboarding (01–03) mit Freischaltcode statt Login, Ziele, Erinnerungszeit, Einwilligung, Startpunkt
- [x] 2. Abend-Check-in (07) mit Basis, Skalen und Zahlenfeldern, Tracker-Wochen, Heute (04)
- [x] 3. Kurs und Video-Fortschritt (05, 06), Freischaltung der Bausteine. Videos werden vorerst per Knopf als gesehen markiert, bis Kurs-Plattform und Player feststehen.
- [ ] 4. Erinnerungen und Nachtragen (13)
- [~] 5. Halbzeit (08) und Wochen-Check (09): schlanker Wochen-Check mit Abschluss ist da, ausführliche Auswertung und Halbzeit fehlen
- [~] 6. Fortschritt (10): Loop-Score und Startpunkt → jetzt sind da, Wochenverlauf und Zusammenhänge fehlen
- [~] 7. Bibliothek (11, 14): Wissen, Handout und Mini-Karten Woche 1, Goodie Woche 1 (Inhalt folgt), Abschluss (12) fehlt
- [x] Woche 1: ein To-do pro Tag, Freischalt-Hinweise, Mach-jetzt-Aufgaben, Basis-Routinen erst nach ihrem Video

## Kursplan übernehmen

Die Videos kommen aus dem Kursplan-Board. Nach Änderungen dort:

1. Im Board auf **„Als CSV exportieren“** klicken.
2. Die Datei als `data/kursplan.csv` speichern und die alte Datei ersetzen.
3. Im Repository-Ordner `node tools/kursplan-import.js` ausführen. Das Skript schreibt `videos.js` neu.
4. `node --test` ausführen und `VERSION` in `sw.js` hochzählen.

Die Nummer aus dem Board (z. B. 2.1) ist die Video-ID. Die Bausteine in `logic.js` hängen an diesen IDs: 2.1–2.3, 3.1–3.3, 4.1–4.3.
Verschiebt man im Board eines dieser Videos, warnt das Skript, und die `videoId` in `logic.js` muss angepasst werden.
Videos im Ideen-Pool kommen nicht in die App.

## Veröffentlichen mit GitHub Pages

Repository → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, Ordner: **/ (root)** → **Save**.
Nach 1–2 Minuten ist die App unter `https://project-x454.github.io/innen-kultur-app/` erreichbar.

## Umzug auf innen-kultur.de

Alle Dateien dieses Ordners in ein Verzeichnis auf dem Webspace kopieren, z. B. `innen-kultur.de/app/`. HTTPS ist Pflicht.
Alternativ eine Subdomain (z. B. `app.innen-kultur.de`) per CNAME auf GitHub Pages zeigen lassen.

## Dateien

- `index.html` – Gerüst und Gestaltung (CI „Weiß & Blau“). Im Browser ab 960 px Breite: Seitenleiste statt Tab-Leiste und Inhalte in zwei Spalten; mobil bleibt alles wie gehabt.
- `app.js` – Screens, Abläufe, Speicher, Sicherung und Übertragung
- `logic.js` – Rechenmodul ohne Oberfläche: Loop-Score, Startpunkt-Vergleich, größter Hebel, Tracker-Wochen, Freischaltung der Bausteine
- `videos.js` – Videoliste mit allen 89 Videos aus dem Kursplan-Board (Woche 1–8). Wird automatisch erzeugt, nicht von Hand bearbeiten.
- `data/kursplan.csv` – CSV-Export des Kursplan-Boards, Quelle für `videos.js`
- `tools/kursplan-import.js` – erzeugt `videos.js` aus `data/kursplan.csv`
- `inhalte.js` – Texte und Regeln für To-dos, Freischalt-Hinweise, Handouts, Mini-Karten und Goodies. Texte hier sicher änderbar.
- `tests/` – Tests für das Rechenmodul
- `manifest.webmanifest` – Name, Symbol, Farben für die Installation
- `sw.js` – Offline-Betrieb
- `icons/` – App-Symbole

## Gestaltung (Redesign Oktober 2026)

- **Heute** zeigt eine Fokus-Karte, die sich nach der Tageszeit richtet. Die Reihenfolge: Wochen-Check, abends der Check-in, morgens das Morgenlicht, tagsüber das nächste Video, sonst „erledigt“. „Später“ blendet einen Fokus für den Tag aus.
- **Routinen tagsüber abhaken:** Die drei Basis-Kacheln auf Heute lassen sich direkt antippen. Vor dem Check-in merkt sich die App das nur für heute (`dayTicks`), danach ändert ein Tipp den Eintrag des Tages.
- **Glocke mit Neu-Blatt:** Freischaltungen sammeln sich hinter der Glocke und öffnen sich als Blatt von unten mit Wieso, Wann und Wo.
- **Check-in in 3 Schritten:** Kacheln, dann Skalen, dann der Erfolgsmoment mit Zwischenstand und dem, was morgen wartet.
- **Abendmodus:** von 18 bis 4 Uhr dunkel, unter Profil → Darstellung abschaltbar. Die Druckvorlagen bleiben hell.
- **Haptik:** kurzes Tippen beim Abhaken, Erfolgs-Muster beim Speichern, weicher Impuls bei Freischaltungen, kräftig beim Wochenabschluss. Android nutzt `navigator.vibrate`. Auf dem iPhone läuft es über einen Safari-Umweg mit einem unsichtbaren Switch-Feld, der mit iOS-Updates wegfallen kann. Unter Profil abschaltbar.

## Willkommen und App-Tour

Nach dem Onboarding begrüßt die App einmalig mit „Herzlich willkommen“ und dem, was Käufer erwartet. Danach führt eine Tour in 11 Schritten über die echten Screens: Check-in, Starter-Liste, Weiterlernen, Navigation, Kurs, Videos, Handout und Goodie, Freischalt-Hinweise mit Beispiel, Bibliothek, Fortschritt. Am Ende kommt eine Übersicht, was wodurch frei wird. Die Tour lässt sich überspringen und jederzeit unter **Profil → App-Tour** neu starten. Texte und Reihenfolge stehen in `inhalte.js` (`TOUR`, `UNLOCK_OVERVIEW`).

## Woche 1: so funktioniert es

- **To-dos:** ein kleines To-do pro Tracker-Tag (7 in Woche 1), je einem Bereich zugeordnet (Darm, Schlaf, Bewegung, Recap). Frei, sobald sein Tag erreicht und sein Video gesehen ist. Heute zeigt das To-do des Tages und „x von 7 diese Woche geschafft“. Weiterleitungen öffnen nur dieses eine To-do (Frage, Feld, Knopf). Die Liste hat einen Filter Alle/Offen/Erledigt. Logik: `trackerDay()` und `todoStatus()` in logic.js.
- **Freischalt-Hinweise:** Jede Freischaltung bekommt eine Karte mit Wieso, Wann und Wo plus einem Knopf, der direkt dorthin führt. Sie erscheint sofort nach der auslösenden Aktion und auf Heute, bis sie bestätigt ist (höchstens zwei auf einmal, die neueste zuerst).
- **Basis-Routinen:** „Bunt gegessen“ erscheint im Check-in nach Video 1.1, „Morgenlicht“ nach 1.2, „30 Min bewegt“ nach 1.3. Vorher führt ein Tipp darauf zum Video.
- **Materialien:** Mini-Karte Pflanzen-Teller (nach 1.6), Mini-Karte Dein Morgen (nach 1.9), Handout Woche 1 (nach allen 5 Kernvideos), Goodie (nach Wochen-Check 1). Handout und Karten erzeugt die App selbst zum Drucken, mit den eigenen Angaben.

**Noch vom Team zu liefern** (Platzhalter in `inhalte.js`):
- `WARNZEICHEN`: die Warnzeichen aus Video 1.5, ärztlich geprüft. Bis dahin steht im Handout ein allgemeiner Hinweis.
- `recipes` im Goodie: 5 Rezepte mit Titel, Minuten, Pflanzenanzahl, Zutaten und Schritten. Bis dahin zeigt die App „kommen mit dem nächsten Update“.
- Mobility-Übungen aus Video 1.9 als Bildfolge (optional für die Mini-Karte Dein Morgen).

## Offen für den Verkauf

- Freischaltcodes fälschungssicher machen (signierte Codes, weiterhin ohne Server)
- App-Symbole in `icons/` auf das neue Logo „Innere Schleife“ umstellen
- Video-Player mit Fortschritts-Event (ab 90 % = gesehen) anbinden. Die Videoliste kommt bereits aus dem Kursplan-Board.
- Bei jedem Update `VERSION` in `sw.js` hochzählen, damit Geräte die neue Version laden

## Menü und Logo
- Die Leiste unten ist dunkles Navy und hebt sich vom Inhalt ab. Der Check-in in der Mitte ist das Logo selbst. Die Logo-Form ist 1:1 aus dem App-Icon nachgezeichnet (`BLOBPATH`/`INNERPATH` in app.js, weiße Linien auf Koralle) und wird überall gleich verwendet.
- Das Logo steht in der Kopfzeile von Heute, Kurs, Fortschritt und Bibliothek, im „Geschafft“-Moment nach dem Check-in und im leeren Neu-Blatt.
- Kursliste: Auswahlfeld „Alle Themen / Darm / Schlaf / Bewegung / Recap“. „Alle Themen“ (Standard) zeigt die empfohlene Reihenfolge neutral grau, das Thema steht in der Unterzeile. Ein gewähltes Thema färbt Nummern-Kacheln und Haken in seiner Farbe. Der Filter bleibt beim Wochenwechsel erhalten.

## Gesperrte Inhalte und Zurück
- Tippen auf etwas Gesperrtes (Goodie, Mini-Karte, Handout in Bibliothek oder Kurs) öffnet ein Blatt: warum es gesperrt ist, die Schritte zum Freischalten mit Stand, und was sich jetzt sofort erledigen lässt (Frage mit Knopf dorthin). Ist für heute alles getan, steht dort „Für heute ist alles erledigt“. Logik in `lockInfo()` in app.js.
- Zurück führt dorthin, wo man herkam (Verlauf `navStack`, auch die Zurück-Taste unter Android). Ein Tipp in der Tab-Leiste beginnt den Verlauf neu.
- Karten nach dem Video und Freischalt-Hinweise nutzen den Stil der Wissens-Kacheln (`tcard`).
- Knöpfe: auf Standardflächen blau (Haupt) und grau (Neben), auf getönten Karten weiß und halbweiß, nie mit Rahmen. Farben über `--btn2-*` und `--tbtn-*` in index.html. Einzige Ausnahme: Rot beim endgültigen Löschen aller Daten.
- Gesperrt-Blatt: Kopf im Stil der Bibliotheks-Kachel (Themenfarbe, Logo-Form, Kurzname), Schritt-Nummern in der Themenfarbe.


## Kleine Erfolge
- Nach dem 7. Check-in zeigt der Erfolgsmoment einen Wochenrückblick nach Bereich: erledigte To-dos mit ihrem Wert, Routinen-Tage und Bausteine, dazu das Warum. Danach weiter zum Wochen-Check.
- Fortschritt hat zwei Ansichten: „Loop-Score“ und „Deine Erfolge“. Der Wochenfilter steht rechts neben der Überschrift. Ab Woche 2 führt die Zeile auf Heute dorthin.
- Texte im Rückblick kommen aus `win` je To-do in inhalte.js. Für Woche 2 bis 8 braucht es je 7 To-dos vom Team.- Bibliothek: Detailseiten (Wissen, Mini-Karte, Handout, Goodie) folgen dem Aufbau der To-do-Seite: Kachel in Themenfarbe, Titel, getönte Karten mit weißem Knopf (`libHead()`, `printTile()` in app.js).

## Schriften, Lesbarkeit, Erinnerung, Sicherung (Okt 2026)
- Schriften laut CI-Leitfaden liegen in `fonts/` und funktionieren offline: Inter (Text und Überschriften), Instrument Serif kursiv (ein Akzent pro Screen, z. B. „Guten *Morgen*“), Geist Mono (Etiketten). Lizenz SIL OFL, Dateien beiliegend.
- Mindestgrößen angehoben (Fließtext 16 px, kleinste Etiketten 12 px), dunkleres Grau. Unter Profil · Darstellung gibt es „Schriftgröße: Größer“ (vergrößert die ganze Oberfläche um 15 %).
- Heute zeigt oben genau eine Einrichtungs-Karte: zuerst „Auf den Home-Bildschirm“ (Android/Chrome mit Installieren-Knopf, iPhone mit Anleitung), dann „Erinnerung einrichten“, nach jedem Wochen-Check „Sichere deine Woche“.
- Erinnerung: Kalender-Termin (`reminders/abend-20|21|22.ics`, täglich, mit Alarm, funktioniert überall) und auf dem Home-Bildschirm zusätzlich Benachrichtigungen. Ohne eigenen Server kommen Benachrichtigungen auf dem iPhone nur, solange die App im Hintergrund läuft; der Kalender ist die verlässliche Variante. Der Service Worker kennt nur Uhrzeit und letzten Check-in-Tag (`ik-meta`).
- Willkommen, Startpunkt, Profil und Wochen-Check im neuen Look (Mockups 15–18). Profil als Gruppen mit Zeilen; Felder der Basis öffnen das passende To-do. Wochen-Check mit Ring, Routinen-Kacheln, „Was dir gut tat“ (`weekInsight()`, nur bei mindestens 2 Tagen mit und ohne Routine) und dem Goodie.
- Bibliothek-Detailseiten: farbiger Kopf in Themenfarbe, darunter weiße Karten mit Etikett in Themenfarbe und Koralle als Akzent.
- Vierte Basis-Routine „Abendroutine“ (frei nach Video 1.2): zur festen Zeit ins Bett ± 30 Min., die letzten 30 Min. ohne Handy. Sie zählt für den Vorabend (`yesterday:true` in `BASIS`) und steht im Check-in unter „Gestern Abend“. Der Baustein aus Video 2.2 heißt jetzt „60 Min. bildschirmfrei“ (Vertiefung). Umsetzung im Loop-Score rechnet mit 4 Basis-Routinen.
- Heute: abgehakte Routinen im Stil der Bibliotheks-Kacheln (Symbol bleibt, Haken oben rechts), 2×2-Raster; Status „Check-in heute · offen/erledigt“ unter der Begrüßung (am Computer rechts daneben).
