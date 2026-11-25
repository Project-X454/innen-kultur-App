import os
from base import *
from todos_data import WEEKS, TODOS, BASIS
from content import BAUSTEINE

XCSS = """
/* Kopf der ersten Seite: was diese Woche dazukommt */
.neu{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.neu.vier{grid-template-columns:repeat(4,1fr)}
.neu div{border-radius:4.5mm;background:var(--s);padding:3.2mm 4mm 3mm;display:flex;flex-direction:column;gap:1mm}
.neu .ic{flex:none;width:7.5mm;height:7.5mm;border-radius:2.4mm;background:#fff;color:var(--t);display:grid;place-items:center}
.neu b{font-size:10.8pt;line-height:1.15;color:var(--t);letter-spacing:-.015em}
.neu .mono{color:var(--t);margin-top:auto;padding-top:1mm}
.lead{font-size:10.6pt;line-height:1.45;max-width:170mm}
.need{font-size:9.2pt;line-height:1.4;color:var(--muted)}
.need b{color:var(--ink);font-weight:600}
/* To-do-Karte */
.card{margin:0 15mm;border:.35mm solid var(--line);border-radius:6mm;overflow:hidden;display:flex;flex-direction:column;flex:1 1 auto}
.card .hd{display:grid;grid-template-columns:22mm 1fr;gap:6mm;align-items:center;padding:5mm 7mm 4.5mm;background:var(--s)}
.card .day{width:22mm;height:22mm;border-radius:5mm;background:var(--c);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.card .day small{font-size:7pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;opacity:.9}
.card .day b{font-size:27pt;font-weight:800;letter-spacing:-.02em;margin-top:.6mm}
.card .hd .mono{color:var(--t);display:flex;align-items:center;gap:1.6mm}
.card .hd h2{font-size:17pt;margin-top:1.8mm;color:var(--ink);line-height:1.15}
.card .bd{display:grid;grid-template-columns:1fr 60mm;gap:8mm;padding:5.5mm 7mm 5.5mm;flex:1}
.card .lb{font-family:"Geist Mono",monospace;font-size:7.2pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--t);margin-bottom:1.4mm}
.card p{font-size:10.5pt;line-height:1.46}
.card .sp{display:grid;grid-template-columns:8mm 1fr;padding:1.5mm 0;font-size:10.5pt;line-height:1.44}
.card .sp i{font-style:normal;width:5.8mm;height:5.8mm;border-radius:50%;background:var(--c);color:#fff;font-size:8pt;font-weight:800;display:grid;place-items:center;margin-top:.2mm}
.card .side{display:flex;flex-direction:column;gap:3.6mm;border-left:.3mm solid var(--line);padding-left:7mm}
.card .side p{font-size:9.6pt;line-height:1.43}
.chips{display:flex;flex-wrap:wrap;gap:1.4mm;margin-top:1.6mm}
"""
EIN = {"Uhrzeit": "Die App fragt nach einer Uhrzeit.", "Text": "Die App fragt nach einer kurzen Antwort.",
       "Zahl": "Die App fragt nach einer Zahl.", "Abhaken": "Du hakst das To-do ab, wenn es erledigt ist."}

def kopf(w):
    """Kopf der ersten Seite: Hero, ein Absatz zur Woche und die Bausteine, die dazukommen."""
    W = WEEKS[w]
    if w == 1:
        neu = [(p, label, vid) for (label, vid), p in zip(BASIS, ["darm", "schlaf", "beweg", "schlaf"])]
        titel, rechts = "Deine vier Routinen", "jeden Abend im Check-in"
    else:
        neu = [(b["pillar"], b["label"], b["video"]) for b in BAUSTEINE if b["week"] == w]
        titel, rechts = "Das kommt diese Woche dazu", "zusätzlich zu deinen Routinen"
    cards = "".join(f'<div style="{pv(p)}"><span class="ic">{ico(p,15)}</span><b>{label}</b><span class="mono">Video {vid}</span></div>' for p, label, vid in neu)
    need = " · ".join(W["need"])
    return f'''<div class="hero" style="padding:7mm 10mm 7mm"><span class="mono">Wochenplan · Woche {w} von 8</span><h1>{acc2(W["title"], W["acc"])}</h1></div>
<div class="pad" style="display:flex;flex-direction:column;gap:3.6mm;margin-top:6mm">
  <p class="lead">{W["lead"]}</p>
  {sec("01", titel, rechts)}<div class="neu{" vier" if len(neu) == 4 else ""}">{cards}</div>
  <p class="need"><b>Das brauchst du diese Woche:</b> {need}</p></div>'''

def card(t):
    art, chips = t["eingabe"]
    ch = "".join(f'<span class="pill">{c}</span>' for c in chips)
    steps = "".join(f'<div class="sp"><i>{k+1}</i><span>{s}</span></div>' for k, s in enumerate(t["steps"]))
    link = f'<div><div class="lb">Dazu passt</div><p>{t["link"]}</p></div>' if t.get("link") else ""
    return f'''<div class="card" style="{pv(t["pillar"])}"><div class="hd"><span class="day"><small>Tag</small><b>{t["day"]}</b></span><div><span class="mono">{ico(t["pillar"],12,2.2)}{PSHORT[t["pillar"]]} · nach Video {t["after"]} · {t["min"]}</span><h2>{t["title"]}</h2></div></div>
<div class="bd"><div><div class="lb">Darum</div><p>{t["why"]}</p><div class="lb" style="margin-top:5mm">So geht's</div>{steps}</div>
<div class="side"><div><div class="lb">Geschafft, wenn</div><p>{t["done"]}</p></div>
<div><div class="lb">In der App</div><p>{EIN[art]}</p>{f'<p style="font-size:8.8pt;color:var(--soft);margin-top:1.6mm">Vorschläge zum Antippen</p><div class="chips" style="margin-top:1mm">{ch}</div>' if ch else ""}</div>
<div><div class="lb">Tipp</div><p>{t["tip"]}</p></div>{link}</div></div></div>'''

def build(w):
    ts = [t for t in TODOS if t["week"] == w]; N = 4
    # Seite 1: Kopf und das erste To-do, danach je zwei To-dos pro Seite
    pages = [f'<section class="pg">{top(f"Wochenplan · Woche {w}")}{kopf(w)}'
             f'<div class="fit" style="display:flex;flex-direction:column;margin-top:6mm;flex:1;min-height:0;padding-bottom:3mm">{card(ts[0])}</div>'
             f'{foot(f"Wochenplan Woche {w}", 1, N)}</section>']
    for k, (a, b) in enumerate([(ts[1], ts[2]), (ts[3], ts[4]), (ts[5], ts[6])]):
        pages.append(f'<section class="pg">{top(f"Wochenplan · Woche {w}")}<div class="fit" style="display:flex;flex-direction:column;gap:6mm;margin-top:7mm;flex:1;min-height:0;padding-bottom:3mm">{card(a)}{card(b)}</div>{foot(f"Wochenplan Woche {w}", k+2, N)}</section>')
    return doc("".join(pages), f"Wochenplan Woche {w}", XCSS)

if __name__ == "__main__":
    os.makedirs(D + "/out", exist_ok=True)
    for w in (1, 2, 3, 4):
        open(f"{D}/out/innen-kultur-wochenplan-woche-{w}.html", "w").write(build(w))
    print("ok")
