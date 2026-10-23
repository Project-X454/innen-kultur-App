# Innen Kultur Loop – Web-App

Loop-Tracker als installierbare Web-App (PWA). Start-Check, täglicher Tracker, Wochen-Check-in und Dashboard.

**Datenschutz:** Alle Einträge bleiben im Browser des Geräts (localStorage). Es gibt keinen Server und keine Datenbank.
Sicherung per Datei, Gerätewechsel per QR-Code oder Übertragungscode.

## Testen

1. Link öffnen (GitHub Pages, siehe unten).
2. Code eingeben: jeder Code im Format `BASIS-XXXX` (4 Wochen) oder `KOMPLETT-XXXX` (8 Wochen) – oder „Demo mit Beispieldaten“.
3. Als App installieren:
   - **iPhone (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“
   - **Android (Chrome):** Menü ⋮ → „App installieren“
   - **PC (Chrome/Edge):** Installieren-Symbol rechts in der Adressleiste

## Veröffentlichen mit GitHub Pages

Repository → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, Ordner: **/ (root)** → **Save**.
Nach 1–2 Minuten ist die App unter `https://project-x454.github.io/innen-kultur-app/` erreichbar.

## Umzug auf innen-kultur.de

Alle Dateien dieses Ordners in ein Verzeichnis auf dem Webspace kopieren, z. B. `innen-kultur.de/app/`. HTTPS ist Pflicht.
Alternativ eine Subdomain (z. B. `app.innen-kultur.de`) per CNAME auf GitHub Pages zeigen lassen.

## Dateien

- `index.html` – die komplette App (Oberfläche, Rechnung, Speicher)
- `manifest.webmanifest` – Name, Symbol, Farben für die Installation
- `sw.js` – Offline-Betrieb
- `icons/` – App-Symbole und Logos

## Offen für den Verkauf

- Freischaltcodes fälschungssicher machen (signierte Codes, weiterhin ohne Server)
- Bei jedem Update `VERSION` in `sw.js` hochzählen, damit Geräte die neue Version laden
