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
- [ ] 5. Halbzeit (08) und Wochen-Check (09)
- [~] 6. Fortschritt (10): Loop-Score und Startpunkt → jetzt sind da, Wochenverlauf und Zusammenhänge fehlen
- [~] 7. Bibliothek (11, 14): Tab Wissen mit Kühlschrank-Karten ist da, Goodies, Abschluss (12) und Upgrade fehlen

## Veröffentlichen mit GitHub Pages

Repository → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, Ordner: **/ (root)** → **Save**.
Nach 1–2 Minuten ist die App unter `https://project-x454.github.io/innen-kultur-app/` erreichbar.

## Umzug auf innen-kultur.de

Alle Dateien dieses Ordners in ein Verzeichnis auf dem Webspace kopieren, z. B. `innen-kultur.de/app/`. HTTPS ist Pflicht.
Alternativ eine Subdomain (z. B. `app.innen-kultur.de`) per CNAME auf GitHub Pages zeigen lassen.

## Dateien

- `index.html` – Gerüst und Gestaltung (CI „Weiß & Blau“)
- `app.js` – Screens, Abläufe, Speicher, Sicherung und Übertragung
- `logic.js` – Rechenmodul ohne Oberfläche: Loop-Score, Startpunkt-Vergleich, größter Hebel, Tracker-Wochen, Freischaltung der Bausteine
- `videos.js` – Videoliste. Vorläufig: Woche 2 aus dem Mockup, sonst Platzhalter. Wird durch den CSV-Export des Kursplan-Boards ersetzt.
- `tests/` – Tests für das Rechenmodul
- `manifest.webmanifest` – Name, Symbol, Farben für die Installation
- `sw.js` – Offline-Betrieb
- `icons/` – App-Symbole

## Offen für den Verkauf

- Freischaltcodes fälschungssicher machen (signierte Codes, weiterhin ohne Server)
- App-Symbole in `icons/` auf das neue Logo „Innere Schleife“ umstellen
- Echte Videoliste (Kursplan-Board) und Video-Player mit Fortschritts-Event (ab 90 % = gesehen) anbinden
- Bei jedem Update `VERSION` in `sw.js` hochzählen, damit Geräte die neue Version laden
