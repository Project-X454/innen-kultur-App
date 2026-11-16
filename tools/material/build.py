#!/usr/bin/env python3
"""Baut alle Material-PDFs neu und legt sie im Ordner pdf/ ab.

Ausführen im Projektordner:  python3 tools/material/build.py
Nur bauen, nichts kopieren:  python3 tools/material/build.py --nur-bauen

Braucht Python mit Playwright (Chromium) und Pillow. Ablauf:
  1. Die Generatoren schreiben HTML nach tools/material/out/
  2. Chromium rendert daraus die PDFs
  3. Die PDFs, die die App ausliefert, werden nach pdf/ kopiert

Das Prüfdokument „App-Texte“ bleibt in out/: es gehört nicht in die App.
"""
import os, shutil, subprocess, sys, glob

D = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(os.path.dirname(os.path.dirname(D)), "innen-kultur-app", "pdf")
if not os.path.isdir(PDF):
    PDF = os.path.join(os.path.dirname(os.path.dirname(D)), "pdf")
OUT = os.path.join(D, "out")

# Generator → Umgebung. Die Mini-Karten nehmen die kleineren Fotos: Sie zeigen sie nur 25 mm hoch,
# und 11 einzelne PDFs mit den großen Fotos wären zusammen rund 5 MB statt 2,3 MB.
GENS = [("todos.py", {}), ("handouts.py", {}), ("minis.py", {"MKPH": "photos_mini"}), ("goodies.py", {}), ("texte.py", {})]

def run(script, env=None, args=()):
    e = dict(os.environ, **(env or {}))
    r = subprocess.run([sys.executable, os.path.join(D, script), *args], cwd=D, env=e, capture_output=True, text=True)
    if r.returncode:
        print(r.stdout, r.stderr, sep="\n")
        sys.exit(f"Abbruch: {script} ist fehlgeschlagen.")
    return r.stdout.strip()

def main():
    kopieren = "--nur-bauen" not in sys.argv
    os.makedirs(OUT, exist_ok=True)
    print("1 · HTML erzeugen")
    for script, env in GENS:
        run(script, env)
        print("   ", script)

    print("2 · PDFs rendern")
    bericht = run("render2.py", args=("*",)) + "\n" + run("rendermini.py")
    probleme = [z for z in bericht.splitlines() if "overflow: []" not in z and "overflow:" in z]
    probleme += [z for z in bericht.splitlines() if "overflow: []" not in z and "overflow:" not in z and "Überlauf: []" not in z and z.strip()]
    for z in bericht.splitlines():
        print("   ", z)

    if kopieren:
        print("3 · Nach pdf/ kopieren")
        n = 0
        for f in sorted(glob.glob(OUT + "/innen-kultur-wochenplan-*.pdf") + glob.glob(OUT + "/innen-kultur-handout-*.pdf")
                        + glob.glob(OUT + "/innen-kultur-goodie-*.pdf") + glob.glob(OUT + "/mini/innen-kultur-mini-*.pdf")):
            shutil.copy2(f, os.path.join(PDF, os.path.basename(f))); n += 1
        print(f"    {n} Dateien nach {PDF}")
        print("    Nicht kopiert (nur zur Prüfung): innen-kultur-app-texte-woche-1-4.pdf, innen-kultur-mini-karten-woche-1-4.pdf")
    else:
        print("3 · übersprungen (--nur-bauen)")

    if probleme:
        print("\nAchtung, diese Seiten laufen über:")
        for z in probleme: print("   ", z)
        sys.exit(1)
    print("\nFertig. Keine überlaufenden Seiten.")

if __name__ == "__main__":
    main()
