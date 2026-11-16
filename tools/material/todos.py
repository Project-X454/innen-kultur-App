import os
from base import *
from todos_data import WEEKS, TODOS

XCSS = """
.wk{display:flex;flex-direction:column}
.wk .r{display:grid;grid-template-columns:15mm 1fr 27mm 31mm 22mm 7mm;gap:3mm;align-items:center;padding:2.5mm 0;border-bottom:.3mm solid var(--line)}
.wk .r.h{padding:0 0 1.6mm;border-bottom:.3mm solid var(--line)}
.wk .r.h span{color:var(--soft)}
.wk .d{height:9mm;border-radius:2.6mm;background:var(--s);color:var(--t);display:flex;align-items:center;justify-content:center;gap:1.2mm;font-weight:800;font-size:10.5pt}
.wk .d small{font-size:6.6pt;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.wk b{font-size:10.8pt;line-height:1.25;font-weight:600}
.wk .m{font-size:9pt;color:var(--muted)}
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:8mm}
.box{border-radius:5mm;background:var(--bg);padding:6mm 6.5mm;display:flex;flex-direction:column;gap:2.4mm}
.box h3{font-size:11.5pt;display:flex;align-items:center;gap:2mm}
.box .li{display:grid;grid-template-columns:6.5mm 1fr;font-size:10pt;line-height:1.42;align-items:start}
.box .li .chk{margin-top:.6mm}
.box .li i{font-style:normal;font-family:"Geist Mono",monospace;font-size:8.5pt;font-weight:600;color:var(--blue);padding-top:.4mm}
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
.card .done{display:grid;grid-template-columns:6.5mm 1fr;align-items:start}
.card .done .chk{margin-top:.5mm;width:4.4mm;height:4.4mm;border-color:var(--c)}
.chips{display:flex;flex-wrap:wrap;gap:1.4mm;margin-top:1.6mm}
.rev{margin:0 15mm;border-radius:6mm;background:var(--bg);padding:7mm 8mm;display:flex;flex-direction:column;gap:3mm;flex:1}
.rev h2{font-size:15pt}
.rev .q{font-size:10.5pt;font-weight:600;margin-top:2mm}
.rev .ln{height:9mm}
"""
EIN = {"Uhrzeit": "Uhrzeit eintragen", "Text": "Antwort eintragen", "Zahl": "Zahl eintragen", "Abhaken": "Abhaken"}

def overview(w, n, N):
    W = WEEKS[w]; ts = [t for t in TODOS if t["week"] == w]
    rows = '<div class="r h"><span class="mono">Tag</span><span class="mono">To-do</span><span class="mono">Bereich</span><span class="mono">Dauer</span><span class="mono">Nach Video</span><span></span></div>'
    for t in ts:
        rows += f'<div class="r" style="{pv(t["pillar"])}"><span class="d"><small>Tag</small>{t["day"]}</span><b>{t["title"]}</b><span><span class="pill">{ico(t["pillar"],11,2.2)}{PSHORT[t["pillar"]]}</span></span><span class="m">{t["min"]}</span><span class="m">Video {t["after"]}</span><span class="chk"></span></div>'
    need = "".join(f'<div class="li"><span class="chk"></span><span>{x}</span></div>' for x in W["need"])
    rules = ["Jeden Tag wird ein To-do frei. Die meisten dauern 1 bis 5 Minuten.", "Ein To-do öffnet sich, sobald du das passende Video gesehen hast.", "Verpasst? Offene To-dos bleiben stehen. Du holst sie nach, wann es passt."]
    rl = "".join(f'<div class="li"><i>{k+1:02d}</i><span>{x}</span></div>' for k, x in enumerate(rules))
    return f'''<section class="pg">{top(f"Wochenplan · Woche {w}")}<div class="hero"><span class="mono">Wochenplan · Woche {w} von 8</span><h1>{acc2(W["title"], W["acc"])}</h1><p>{W["theme"]}</p></div>
<div class="pad" style="display:flex;flex-direction:column;gap:5mm;margin-top:8mm">{sec("01","Deine Woche auf einen Blick","7 To-dos")}<div class="wk" style="margin-top:-1mm">{rows}</div>
<div class="cols2" style="margin-top:3mm"><div class="box"><h3>{ico("box",15)}Das brauchst du diese Woche</h3>{need}</div><div class="box"><h3>{ico("check",15,2.4)}So funktionieren die To-dos</h3>{rl}</div></div></div>
{foot(f"Wochenplan Woche {w}", n, N)}</section>'''

def card(t):
    art, chips = t["eingabe"]
    ch = "".join(f'<span class="pill">{c}</span>' for c in chips)
    steps = "".join(f'<div class="sp"><i>{k+1}</i><span>{s}</span></div>' for k, s in enumerate(t["steps"]))
    link = f'<div><div class="lb">Dazu passt</div><p>{t["link"]}</p></div>' if t.get("link") else ""
    return f'''<div class="card" style="{pv(t["pillar"])}"><div class="hd"><span class="day"><small>Tag</small><b>{t["day"]}</b></span><div><span class="mono">{ico(t["pillar"],12,2.2)}{PSHORT[t["pillar"]]} · nach Video {t["after"]} · {t["min"]}</span><h2>{t["title"]}</h2></div></div>
<div class="bd"><div><div class="lb">Darum</div><p>{t["why"]}</p><div class="lb" style="margin-top:5mm">So geht's</div>{steps}</div>
<div class="side"><div><div class="lb">Fertig, wenn</div><div class="done"><span class="chk"></span><p>{t["done"]}</p></div></div>
<div><div class="lb">In der App</div><p>{EIN[art]}</p>{f'<div class="chips">{ch}</div>' if ch else ""}</div>
<div><div class="lb">Tipp</div><p>{t["tip"]}</p></div>{link}</div></div></div>'''

def review(w):
    nxt = f"Woche {w+1}" if w < 4 else "die nächsten Wochen"
    qs = ["Das lief diese Woche gut:", "Das war schwer, und das probiere ich anders:", f"Das nehme ich mit in {nxt}:"]
    return f'<div class="rev"><span class="mono" style="color:var(--blue)">Am Ende der Woche</span><h2>Dein {acc("kurzer", "Rückblick")}</h2>' + "".join(f'<div class="q">{q}</div><span class="ln"></span><span class="ln"></span>' for q in qs) + "</div>"

def build(w):
    ts = [t for t in TODOS if t["week"] == w]; N = 5
    pages = [overview(w, 1, N)]
    pairs = [(ts[0], ts[1]), (ts[2], ts[3]), (ts[4], ts[5]), (ts[6], None)]
    for k, (a, b) in enumerate(pairs):
        second = card(b) if b else review(w)
        pages.append(f'<section class="pg">{top(f"Wochenplan · Woche {w}")}<div class="fit" style="display:flex;flex-direction:column;gap:6mm;margin-top:7mm;flex:1;min-height:0;padding-bottom:3mm">{card(a)}{second}</div>{foot(f"Wochenplan Woche {w}", k+2, N)}</section>')
    return doc("".join(pages), f"Wochenplan Woche {w}", XCSS)

if __name__ == "__main__":
    os.makedirs(D + "/out", exist_ok=True)
    for w in (1, 2, 3, 4):
        open(f"{D}/out/innen-kultur-wochenplan-woche-{w}.html", "w").write(build(w))
    print("ok")
