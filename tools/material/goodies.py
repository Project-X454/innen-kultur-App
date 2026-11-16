import json, os, sys
from base import *
from rezepte import GOODIES, nutrition
CRED = json.load(open(D + "/credits.json"))
PH = lambda i: f"file://{D}/photos/{i}.jpg"

XCSS = """
/* Titelseite */
.cov{background:var(--navy);color:#fff}
.cov .ph{height:158mm;background-size:cover;position:relative}
.cov .chip{position:absolute;left:15mm;top:11mm;display:flex;align-items:center;gap:2mm;background:#fff;color:var(--ink);font-weight:800;font-size:11.5pt;padding:1.6mm 3.6mm 1.6mm 2.2mm;border-radius:10mm}
.cov .bd{flex:1;padding:12mm 15mm 0;position:relative;overflow:hidden;display:flex;flex-direction:column}
.cov .bd::after{content:"";position:absolute;right:-22mm;bottom:-30mm;width:92mm;height:92mm;border-radius:50%;background:var(--coral);opacity:.92}
.cov .bd::before{content:"";position:absolute;right:42mm;bottom:34mm;width:30mm;height:30mm;border-radius:50%;background:rgba(255,255,255,.09)}
.cov .mono{color:#C9D8EA}
.cov h1{font-size:44pt;margin-top:5mm;max-width:150mm;position:relative;z-index:1}
.cov h1 .acc{font-size:50pt}
.cov .sub{font-size:14pt;color:#D3DEEA;margin-top:5mm;max-width:120mm;line-height:1.35;position:relative;z-index:1}
.cov .facts{margin-top:auto;padding-bottom:12mm;display:flex;gap:9mm;position:relative;z-index:1}
.cov .facts div{display:flex;flex-direction:column;gap:.6mm}
.cov .facts b{font-size:17pt;letter-spacing:-.01em}
/* Übersicht */
.lead{font-size:12pt;line-height:1.5;color:var(--ink);max-width:165mm}
.ov{display:flex;flex-direction:column}
.ov .it{display:grid;grid-template-columns:34mm 1fr auto;gap:5mm;align-items:center;padding:3mm 0;border-bottom:.3mm solid var(--line)}
.ov .it:last-child{border-bottom:0}
.ov .th{width:34mm;height:23mm;border-radius:3mm;background-size:cover;background-position:center}
.ov .it b{font-size:12.5pt;letter-spacing:-.01em;display:block;line-height:1.2}
.ov .it b .acc{font-size:14pt}
.ov .it .mono{color:var(--muted);display:block;margin-top:1.4mm}
.ov .pn{font-family:"Geist Mono",monospace;font-size:9pt;color:var(--t);font-weight:600}
.use{background:var(--s);border-radius:5mm;padding:6mm 7mm;display:flex;flex-direction:column;gap:2.4mm}
.use h3{font-size:12pt;color:var(--t)}
.use div{display:grid;grid-template-columns:6mm 1fr;font-size:10.5pt;line-height:1.45}
.use div span:first-child{color:var(--t);display:flex;padding-top:.8mm}
/* Einkaufsliste */
.shop{display:grid;grid-template-columns:1fr 1fr;gap:0 12mm}.shop .col{display:flex;flex-direction:column;gap:7mm}
.shop h3{font-size:11pt;display:flex;align-items:center;gap:2mm;color:var(--t);padding-bottom:1.6mm;border-bottom:.35mm solid var(--c);margin-bottom:1mm}
.shop .r{display:flex;gap:2.6mm;align-items:center;padding:1.3mm 0;font-size:10.2pt;border-bottom:.25mm solid var(--line)}
.shop .g.base .r{border:0;padding:.9mm 0}
.shop .g.base .rows{display:flex;flex-wrap:wrap;gap:1.6mm 2mm;padding-top:1.5mm}.basewrap{margin-top:7mm}
.note{font-size:9pt;color:var(--muted);line-height:1.5}
/* Rezept */
.rph{height:var(--ph,100mm);background-size:cover;position:relative;flex:none}
.rph .chip{position:absolute;left:15mm;top:10mm;display:flex;align-items:center;gap:1.8mm;background:#fff;color:var(--ink);font-weight:800;font-size:10.5pt;padding:1.4mm 3.2mm 1.4mm 2mm;border-radius:10mm}
.rph .nr{position:absolute;right:15mm;top:10mm;background:rgba(20,34,49,.72);color:#fff;padding:1.6mm 3.2mm;border-radius:10mm}
.rb{padding:5.5mm 15mm 0;display:flex;flex-direction:column;gap:3mm;flex:1;min-height:0}
.rb .k{color:var(--t)}
.rb h1{font-size:22pt;margin-top:1mm}
.rb h1 .acc{font-size:25pt;color:var(--t)}
.rb .intro{font-size:10.2pt;line-height:1.42;color:var(--muted);max-width:172mm}
.facts4{display:flex;border-top:.3mm solid var(--line);border-bottom:.3mm solid var(--line)}
.facts4 div{display:flex;flex-direction:column;gap:.5mm;padding:2.3mm 4.2mm 2.3mm 0;margin-right:4.2mm;flex:1 1 auto}.facts4 div.n{background:var(--s);margin:0;padding:2.3mm 3.4mm;flex:0 0 auto}.facts4 div.n b,.facts4 div.n .mono{color:var(--t)}.facts4 div.n+div.n{border-left:.3mm solid #fff}
.facts4 .mono{color:var(--soft);font-size:6.6pt}
.facts4 b{font-size:10.5pt;white-space:nowrap}
.rc{display:grid;grid-template-columns:66mm 1fr;gap:8mm}
.lbl{font-family:"Geist Mono",monospace;font-size:7.4pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--ink);padding-bottom:1.6mm;border-bottom:.35mm solid var(--ink);margin-bottom:1.2mm}
.zg{font-size:8.6pt;font-weight:700;color:var(--t);margin:2.4mm 0 .6mm}
.zg:first-of-type{margin-top:.6mm}
.z{display:grid;grid-template-columns:21mm 1fr;gap:2mm;padding:.95mm 0;border-bottom:.25mm solid var(--line);font-size:9.4pt;line-height:1.3}
.z b{font-weight:700}
.nut{margin-top:3.4mm;background:var(--s);border-radius:3.5mm;padding:3mm 3.6mm;display:grid;grid-template-columns:repeat(3,1fr);gap:2mm}
.nut div{display:flex;flex-direction:column}
.nut b{font-size:12pt;color:var(--t);line-height:1.1}
.nut span{font-size:7.4pt;color:var(--t)}
.nutn{font-size:7.2pt;color:var(--soft);margin-top:1.2mm}
.pl{margin-top:2.6mm;font-size:8.4pt;line-height:1.45;color:var(--muted)}
.pl b{color:var(--ink)}
.st{display:grid;grid-template-columns:8mm 1fr;padding:1.05mm 0;font-size:9.4pt;line-height:1.4}
.st i{font-style:normal;width:5.6mm;height:5.6mm;border-radius:50%;background:var(--c);color:#fff;font-size:8pt;font-weight:800;display:grid;place-items:center;margin-top:.3mm}
.st b{font-weight:700}
.tipp{margin-top:2mm;background:var(--s);border-radius:3.5mm;padding:2.6mm 3.6mm;display:grid;grid-template-columns:7mm 1fr;font-size:9.6pt;line-height:1.45;color:var(--t)}
.tipp span:first-child{display:flex;padding-top:.5mm}
.two{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7mm;border-top:.3mm solid var(--line);padding:3mm 0 1.5mm}
.two div{font-size:8.6pt;line-height:1.4;color:var(--muted)}
.two b{display:block;color:var(--ink);font-size:7.4pt;font-family:"Geist Mono",monospace;letter-spacing:.1em;text-transform:uppercase;font-weight:600;margin-bottom:.8mm}
"""

def cover(g):
    n = len(g["recipes"])
    return f'''<section class="pg cov" style="{pv(g["pillar"])}"><div class="ph" style="background-image:url({PH(g["cover"])});background-position:{g["cpos"]}"><span class="chip">{logo(20)}innen kultur</span></div>
<div class="bd"><span class="mono">Goodie · Woche {g["week"]}</span><h1>{g["title"]}<br><span class="acc">{g["acc"]}</span></h1><p class="sub">{g["sub"]}</p>
<div class="facts"><div><b>{n}</b><span class="mono">Rezepte</span></div><div><b>2</b><span class="mono">Portionen je Rezept</span></div><div><b>1</b><span class="mono">Einkaufsliste</span></div></div></div></section>'''

def overview(g, n, N):
    rows = ""
    for i, r in enumerate(g["recipes"]):
        nu = nutrition(r)
        meta = f'{r["aktiv"]} Min. aktiv · {len(r["plants"])} Pflanzen' + (f' · {nu[2]} g Ballaststoffe' if nu and nu[2] else "")
        rows += f'<div class="it"><span class="th" style="background-image:url({PH(r["id"])});background-position:{r["pos"]}"></span><span><b>{acc(r["t"], r["a"])}</b><span class="mono">{meta}</span></span><span class="pn">S. {4+i:02d}</span></div>'
    use = "".join(f'<div><span>{ico("check",13,2.6)}</span><span>{u}</span></div>' for u in g["use"])
    return f'''<section class="pg" style="{pv(g["pillar"])}">{top(f"Goodie · Woche {g['week']}")}<div class="pad" style="display:flex;flex-direction:column;gap:6mm;margin-top:9mm">
<h1 style="font-size:26pt">{acc("Auf einen", "Blick")}</h1><p class="lead">{g["intro"]}</p>
{sec("01","Die Rezepte", "je 2 Portionen")}<div class="ov" style="margin-top:-3mm">{rows}</div>
<div class="use"><h3>So nutzt du dieses Goodie</h3>{use}</div></div>{foot(g["title"].rstrip("-")+("" if g["title"].endswith("-") else " ")+g["acc"] if False else "Goodie Woche "+str(g["week"]), n, N)}</section>'''

SHOPIC = {"Gemüse & Obst": "darm", "Kühlregal": "box", "Vorrat": "cart", "Meist im Haus": "pot"}
def shopping(g, n, N):
    def block(name, items):
        rows = "".join(f'<div class="r"><span class="chk"></span>{x}</div>' for x in items)
        return f'<div class="g"><h3>{ico(SHOPIC[name],15)}{name}</h3><div class="rows">{rows}</div></div>'
    sh = dict(g["shop"])
    base = "".join(f'<span class="pill o">{x}</span>' for x in sh["Meist im Haus"])
    creds = " · ".join(f'{r["t"]}: @{CRED[r["id"]][0]}' for r in g["recipes"])
    return f'''<section class="pg" style="{pv(g["pillar"])}">{top(f"Goodie · Woche {g['week']}")}<div class="pad" style="display:flex;flex-direction:column;gap:6mm;margin-top:9mm">
<h1 style="font-size:26pt">{acc("Deine", "Einkaufsliste")}</h1><p class="lead" style="font-size:11pt;color:var(--muted)">Mengen für alle fünf Rezepte mit je 2 Portionen. Kochst du nur einzelne Gerichte, schau in die Zutatenliste des Rezepts.</p>
<div class="shop"><div class="col">{block("Gemüse & Obst", sh["Gemüse & Obst"])}</div><div class="col">{block("Kühlregal", sh["Kühlregal"])}{block("Vorrat", sh["Vorrat"])}</div></div>
<div class="shop" style="display:block"><div class="g base"><h3>{ico("pot",15)}Meist im Haus</h3><div class="rows">{base}</div></div></div><div style="margin-top:2mm"><div class="lbl" style="border-color:var(--line);color:var(--muted)">Notizen</div><span class="ln"></span><span class="ln"></span></div></div>
<p class="note pad" style="margin-top:auto;padding-bottom:4mm;font-size:7.4pt;color:var(--soft)">Fotos: Unsplash, als Serviervorschlag. {creds}</p>
<div class="foot" style="margin-top:0"><span class="mono">innen-kultur.de · Goodie Woche {g["week"]}</span><span class="mono"></span><span class="mono">{n:02d} / {N:02d}</span></div></section>'''

def recipe(g, r, i, n, N):
    nu = nutrition(r)
    zut = ""
    for gn, zs in r["groups"]:
        zut += f'<div class="zg">{gn}</div>' + "".join(f'<div class="z"><b>{m}</b><span>{nm}</span></div>' for m, nm, _k, _g in zs)
    steps = "".join(f'<div class="st"><i>{k+1}</i><span><b>{a}</b> {b}</span></div>' for k, (a, b) in enumerate(r["steps"]))
    serves = r.get("serves", "2 Portionen")
    f = lambda a, b, c="": f'<div class="{c}"><span class="mono">{a}</span><b>{b}</b></div>'
    facts = f("Aktiv", f'{r["aktiv"]} Min.') + f("Gesamt", r["gesamt"]) + f("Ergibt", serves) + f("Pflanzen", len(r["plants"]))
    if nu: facts += f("Energie", f"{nu[0]} kcal", "n") + f("Eiweiß", f"{nu[1]} g", "n") + f("Ballaststoffe", f"{nu[2]} g", "n")
    else: facts += f("Energie", "0 kcal", "n") + f("Koffein", "keins", "n")
    name = g["title"] + ("" if g["title"].endswith("-") else " ") + g["acc"]
    return f'''<section class="pg" style="{pv(g["pillar"])}"><div class="rph" style="background-image:url({PH(r["id"])});background-position:{r["pos"]}"><span class="chip">{logo(18)}innen kultur</span><span class="nr mono">Rezept {i+1} von {len(g["recipes"])}</span></div>
<div class="rb"><div><span class="mono k">{name} · Goodie Woche {g["week"]}</span><h1>{r["t"]} <span class="acc">{r["a"]}</span></h1></div>
<p class="intro">{r["intro"]}</p>
<div class="facts4">{facts}</div>
<div class="rc"><div><div class="lbl">Zutaten</div>{zut}</div>
<div><div class="lbl">Zubereitung</div>{steps}<div class="tipp"><span>{ico("bulb",15)}</span><span><b>Tipp.</b> {r["tip"]}</span></div></div></div>
<div class="two"><div><b>Aufbewahren</b>{r["keep"]}</div><div><b>Abwandeln</b>{r["swap"]}</div><div><b>Zählt als {len(r["plants"])} Pflanzen</b>{", ".join(r["plants"])}</div></div></div>
{foot(f"Goodie Woche {g['week']}", n, N, f"Foto: @{CRED[r['id']][0]} / Unsplash")}</section>'''

def build(g):
    N = 3 + len(g["recipes"])
    pages = [cover(g), overview(g, 2, N), shopping(g, 3, N)] + [recipe(g, r, i, 4 + i, N) for i, r in enumerate(g["recipes"])]
    return doc("".join(pages), f'Goodie Woche {g["week"]}: {g["title"]} {g["acc"]}', XCSS)

if __name__ == "__main__":
    os.makedirs(D + "/out", exist_ok=True)
    for g in GOODIES:
        open(f'{D}/out/{g["file"]}.html', "w").write(build(g))
    print("ok")
