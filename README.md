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
- [x] Woche 1: Starter-Liste, Freischalt-Hinweise, Mach-jetzt-Aufgaben, Basis-Routinen erst nach ihrem Video

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
- `inhalte.js` – Texte und Regeln für Starter-Liste, Freischalt-Hinweise, Handouts, Mini-Karten und Goodies. Texte hier sicher änderbar.
- `tests/` – Tests für das Rechenmodul
- `manifest.webmanifest` – Name, Symbol, Farben für die Installation
- `sw.js` – Offline-Betrieb
- `icons/` – App-Symbole

## Woche 1: so funktioniert es

- **Starter-Liste:** 10 einmalige To-dos auf Heute. 6 haken sich selbst ab (Videos, erster Check-in, Profilfelder, Wochen-Check), 4 hakt man selbst ab. Sie verschwindet nach dem Wochen-Check 1.
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
