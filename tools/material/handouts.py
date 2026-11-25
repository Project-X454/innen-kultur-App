import os, math
from base import *
from content import BAUSTEINE
from apptexte_data import BX

XCSS = """
.b3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.bc{border-radius:5mm;background:var(--s);padding:4.2mm 4.6mm 4mm;display:flex;flex-direction:column;gap:1.6mm}
.bc .ic{flex:none;width:9mm;height:9mm;border-radius:2.8mm;background:#fff;color:var(--t);display:grid;place-items:center}
.bc .hd{display:flex;align-items:center;gap:2.6mm;min-height:10mm}.bc b.n{font-size:12pt;line-height:1.15;color:var(--t);letter-spacing:-.01em}
.bc p{font-size:9.4pt;line-height:1.4}
.bc .no{color:var(--muted)}
.bc .lb{font-family:"Geist Mono",monospace;font-size:6.8pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--t);display:block;margin-bottom:.4mm}
.bc .v{margin-top:auto;padding-top:1.5mm;color:var(--t)}
.split{display:grid;grid-template-columns:1fr 66mm;gap:9mm}
.bar{display:grid;grid-template-columns:40mm 17mm 1fr 11mm;gap:2.5mm;align-items:center;padding:.85mm 0;font-size:9.6pt}
.bar small{font-size:8.2pt;color:var(--soft)}
.bar .tr{height:4.2mm;border-radius:2.1mm;background:var(--bg);overflow:hidden}
.bar .tr i{display:block;height:100%;border-radius:2.1mm;background:var(--c)}
.bar b{text-align:right;font-size:10pt}
.day{border-radius:5mm;background:var(--bg);padding:5.5mm 6mm;display:flex;flex-direction:column;gap:2.2mm}
.day h3{font-size:11.5pt}
.day .r{display:grid;grid-template-columns:1fr auto;gap:3mm;font-size:9.6pt;line-height:1.35;padding:1.4mm 0;border-bottom:.3mm solid var(--line)}
.day .r small{display:block;color:var(--muted);font-size:8.4pt}
.day .r b{font-size:10.5pt}
.day .sum{display:flex;justify-content:space-between;align-items:baseline;font-weight:800;font-size:13pt;color:var(--t);padding-top:1mm}
.strip{border-radius:4mm;background:var(--s);color:var(--t);padding:3.6mm 5mm;display:grid;grid-template-columns:7mm 1fr;font-size:10.2pt;line-height:1.45;align-items:start}
.strip span:first-child{display:flex;padding-top:.6mm}
.tl{display:grid;grid-template-columns:repeat(5,1fr);position:relative;margin-top:1mm}
.tl::before{content:"";position:absolute;left:4mm;right:4mm;top:4.4mm;height:.5mm;background:var(--c)}
.tl div{display:flex;flex-direction:column;gap:1.2mm;position:relative;padding-right:3mm}
.tl i{font-style:normal;width:9mm;height:9mm;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-size:7pt;font-weight:800;border:.8mm solid #fff;box-sizing:content-box;margin:-.8mm 0 0 -.8mm}
.tl b{font-size:10pt;line-height:1.2}
.tl span{font-size:8.8pt;line-height:1.35;color:var(--muted)}
.ci{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.ci.vier{grid-template-columns:repeat(4,1fr)}
.ci div{border-radius:4.5mm;background:var(--s);padding:3.4mm 4.2mm 3.2mm;display:flex;flex-direction:column;gap:.8mm}
.ci b{font-size:10.8pt;line-height:1.15;color:var(--t);letter-spacing:-.015em}
.ci span{font-size:9pt;line-height:1.35;color:var(--muted)}
.lead{font-size:10.2pt;line-height:1.45}
.bsp{font-size:9.6pt;line-height:1.45;color:var(--muted)}
.bsp b{color:var(--ink);font-weight:600}
table.t{width:100%;border-collapse:collapse;font-size:9.8pt}
table.t th{font-family:"Geist Mono",monospace;font-size:6.8pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--soft);text-align:left;padding:0 2mm 1.6mm 0}
table.t td{border-top:.3mm solid var(--line);padding:1.75mm 2mm 1.75mm 0;vertical-align:middle}
table.t td.c,table.t th.c{text-align:center;padding-right:0}
table.t td.r,table.t th.r{text-align:right;padding-right:0}
table.t td b{font-weight:600}
.qa{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.qa div{border:.35mm solid var(--line);border-radius:4mm;padding:4mm 4.4mm;display:flex;flex-direction:column;gap:1.5mm}
.qa b{font-size:10pt;line-height:1.25}
.qa p{font-size:9.2pt;line-height:1.42;color:var(--muted)}
.qa .lb{font-family:"Geist Mono",monospace;font-size:6.8pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--coral)}
.r4{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.rc{border-radius:5mm;background:var(--s);padding:3.8mm 4.6mm 3.4mm;display:flex;flex-direction:column;gap:1.6mm}
.rc .hd{display:flex;align-items:center;gap:2.6mm}
.rc .ic{flex:none;width:9mm;height:9mm;border-radius:2.8mm;background:#fff;color:var(--t);display:grid;place-items:center}
.rc b.n{display:block;font-size:11.6pt;line-height:1.1;color:var(--t);letter-spacing:-.015em;white-space:nowrap}
.rc .v{display:block;color:var(--t);font-size:6.6pt;margin-bottom:.5mm}
.rc .g{display:grid;grid-template-columns:1.6fr 1fr;gap:4mm}
.rc p{font-size:9pt;line-height:1.38}
.rc .no{color:var(--muted)}
.rc .lb{font-family:"Geist Mono",monospace;font-size:6.8pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--t);display:block;margin-bottom:.4mm}
.plate{display:grid;grid-template-columns:42mm 1fr 66mm;gap:7mm;align-items:center}
.plate .lg{display:flex;flex-direction:column;gap:2.6mm}
.plate .lg div{display:grid;grid-template-columns:5mm 1fr;gap:1.5mm;font-size:9.6pt;line-height:1.35}
.plate .lg i{width:3.6mm;height:3.6mm;border-radius:1mm;background:var(--c);margin-top:.8mm}
.plate .lg b{display:block;font-size:10.4pt}
.plate .lg span span{color:var(--muted)}
.g6{display:grid;grid-template-columns:repeat(3,1fr);gap:0 6mm}
.g6 div{border-top:.3mm solid var(--line);padding:1.7mm 0;font-size:9.2pt;line-height:1.35}
.g6 b{display:block;font-size:9.8pt;color:var(--t)}
.g6 span{color:var(--muted)}
.q4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2mm}
.q4 div{background:var(--s);padding:3.2mm 3.8mm;display:flex;flex-direction:column;gap:1mm}
.q4 div:first-child{border-radius:4mm 0 0 4mm}.q4 div:last-child{border-radius:0 4mm 4mm 0;background:var(--bg)}
.q4 .nr{font-family:"Geist Mono",monospace;font-size:8pt;font-weight:600;color:var(--t)}
.q4 b{font-size:10.6pt;color:var(--t);line-height:1.15}
.q4 p{font-size:8.9pt;line-height:1.38}
.warn{border-radius:4mm;background:#F9E9E4;color:#8E3A26;padding:3.4mm 5mm;font-size:9.6pt;line-height:1.42}
/* Tagesuhr */
.clock{position:relative;height:58mm;margin:0 2mm}
.clock .ax{position:absolute;left:0;right:0;top:27mm;height:4mm;border-radius:2mm;background:var(--bg)}
.clock .eat{position:absolute;top:27mm;height:4mm;border-radius:2mm;background:#CFE3D6}
.clock .gap3{position:absolute;top:27mm;height:4mm;background:repeating-linear-gradient(90deg,#C9D8EA 0 1.2mm,transparent 1.2mm 2.4mm);border-radius:2mm}
.clock .tk{position:absolute;top:32.5mm;font-family:"Geist Mono",monospace;font-size:6.4pt;color:var(--soft);transform:translateX(-50%)}
.clock .mk{position:absolute;width:26mm;margin-left:-13mm;display:flex;flex-direction:column;align-items:center;text-align:center;gap:.5mm}
.clock .mk.up{bottom:31mm}.clock .mk.dn{top:37mm}
.clock .mk b{font-size:8.8pt;line-height:1.15}
.clock .mk span{font-family:"Geist Mono",monospace;font-size:7.4pt;color:var(--t);font-weight:600}
.clock .dot{position:absolute;top:26mm;width:6mm;height:6mm;margin-left:-3mm;border-radius:50%;background:var(--c);border:.8mm solid #fff}
.clock .stem{position:absolute;width:.4mm;background:var(--c);margin-left:-.2mm}
.two2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.lst{border-radius:5mm;padding:5mm 5.5mm;display:flex;flex-direction:column;gap:1.6mm;font-size:9.8pt;line-height:1.4}
.lst h3{font-size:11pt;margin-bottom:.6mm}
.lst div{display:grid;grid-template-columns:6mm 1fr}
.scale{display:grid;grid-template-columns:1fr 1.25fr 1fr;gap:1.2mm}
.scale div{padding:3.6mm 4mm;display:flex;flex-direction:column;gap:.8mm;background:var(--bg)}
.scale div:first-child{border-radius:4mm 0 0 4mm}.scale div:last-child{border-radius:0 4mm 4mm 0}
.scale div.on{background:var(--c);color:#fff}
.scale b{font-size:11pt}.scale span{font-size:9.2pt;line-height:1.35}
.tool{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.tool>div{border-radius:5mm;background:var(--s);padding:5mm;display:flex;flex-direction:column;gap:1.6mm}
.tool .nr{font-family:"Geist Mono",monospace;font-size:8pt;font-weight:600;color:var(--t)}
.tool b{font-size:12pt;color:var(--t);line-height:1.15}
.tool p{font-size:9.5pt;line-height:1.42}
.plan{border-radius:5mm;background:var(--navy);color:#fff;padding:6mm 7mm 6.5mm;display:flex;flex-direction:column;gap:2.2mm;position:relative;overflow:hidden}
.plan::after{content:"";position:absolute;right:-12mm;top:-14mm;width:42mm;height:42mm;border-radius:50%;background:var(--coral);opacity:.9}
.plan h3{font-size:14pt}
.plan .q{font-size:9.8pt;font-weight:600;color:#D3DEEA;margin-top:1.2mm}
.plan .g{display:grid;grid-template-columns:1fr 1fr;gap:0 8mm}
"""
WK = {1: dict(p="navy", title="Deine", acc="Basis", sub="Vier Routinen tragen den ganzen Kurs. Hier steht, was genau zählt und wie sie in deinen Tag passen."),
      2: dict(p="darm", title="Deine ersten", acc="Bausteine", sub="Deine Basis läuft. Jetzt kommen drei Gewohnheiten dazu, eine für jeden Bereich. Hier steht, was genau zählt."),
      3: dict(p="schlaf", title="Timing für", acc="Bauch und Schlaf", sub="Nicht nur was du tust, zählt, sondern auch wann. Diese Woche ordnest du Essen, Bewegung und Schlaf über den Tag."),
      4: dict(p="recap", title="Stress und dein", acc="Loop-Plan", sub="Drei Bausteine für mehr Ruhe. Am Ende der Woche entscheidest du, welche Gewohnheiten nach dem Kurs bleiben.")}
BW = lambda w: [b for b in BAUSTEINE if b["week"] == w]

def bausteine(w):
    cards = "".join(f'<div class="bc" style="{pv(b["pillar"])}"><div class="hd"><span class="ic">{ico(b["pillar"],17)}</span><b class="n">{b["label"]}</b></div><p><span class="lb">Zählt</span>{b["yes"]}</p><p class="no"><span class="lb" style="color:var(--muted)">Zählt nicht</span>{b["no"]}</p><span class="mono v">Video {b["video"]}</span></div>' for b in BW(w))
    return f'<div class="b3">{cards}</div>'
def checkin(items, lead):
    """Was die App am Abend fragt. Abgehakt wird dort, nicht auf dem Blatt."""
    cards = "".join(f'<div style="{pv(p)}"><b>{name}</b><span>{sub}</span></div>' for p, name, sub in items)
    return f'<p class="lead">{lead}</p><div class="ci{" vier" if len(items) == 4 else ""}">{cards}</div>'

def ci_bausteine(w):
    return [(b["pillar"], b["label"], BX[b["id"]]["sub"]) for b in BW(w)]
def qa(items):
    return '<div class="qa">' + "".join(f'<div><span class="lb">Stolperstein</span><b>{q}</b><p>{a}</p></div>' for q, a in items) + "</div>"
def page(w, inner, n):
    c = WK[w]
    return f'<section class="pg" style="{pv(c["p"])}">{top(f"Handout · Woche {w}")}{inner}{foot(f"Handout Woche {w}", n, 2)}</section>'
def hero(w):
    c = WK[w]
    return f'<div class="hero"><span class="mono">Handout · Woche {w} von 8</span><h1>{acc2(c["title"], c["acc"])}</h1><p>{c["sub"]}</p></div>'
BODY = lambda inner, gap="5mm", mt="7mm": f'<div class="pad fit" style="display:flex;flex-direction:column;gap:{gap};margin-top:{mt};flex:1;min-height:0">{inner}</div>'

# ---------------- Woche 1 ----------------
def h1():
    R = [("darm", "Bunt gegessen", "1.1 und 1.6", "Mindestens eine Mahlzeit am Tag, bei der die Hälfte des Tellers aus Pflanzen besteht.", "Ein Salatblatt als Beilage oder ein Glas Saft."),
         ("schlaf", "Morgenlicht + feste Aufstehzeit", "1.2 und 1.7", "In den ersten 60 Minuten nach dem Aufstehen 10 Minuten draußen im Tageslicht. Aufstehen zur festen Zeit, ± 30 Minuten.", "Drinnen am Fenster sitzen. Am Wochenende lange ausschlafen."),
         ("beweg", "30 Min bewegt", "1.3, 1.8 und 1.9", "Zusammen 30 Minuten, bei denen du etwas schneller atmest. Aufgeteilt zählt, etwa 3 × 10 Minuten.", "Schlendern, bei dem dein Atem ganz ruhig bleibt."),
         ("schlaf", "Abendroutine", "1.2, vertieft in 2.2", "30 Minuten vorher einleiten, die letzte Stunde ohne Bildschirm, zur festen Zeit ins Bett. Dazu Extras.", "Im Bett noch „kurz“ aufs Handy schauen.")]
    rc = "".join(f'<div class="rc" style="{pv(p)}"><div class="hd"><span class="ic">{ico(p,17)}</span><span><span class="mono v">Video {v}</span><b class="n">{t}</b></span></div><div class="g"><p><span class="lb">Zählt</span>{y}</p><p class="no"><span class="lb" style="color:var(--muted)">Zählt nicht</span>{n}</p></div></div>' for p, t, v, y, n in R)
    plate = '<svg viewBox="0 0 120 120" style="width:42mm;height:42mm;display:block"><circle cx="60" cy="60" r="58" fill="#fff" stroke="#E4E9EF" stroke-width="2.5"/><path d="M60 9 A51 51 0 0 0 60 111 Z" fill="#5E8C72"/><path d="M60 9 A51 51 0 0 1 111 60 L60 60 Z" fill="#A87A2C"/><path d="M111 60 A51 51 0 0 1 60 111 L60 60 Z" fill="#4F78A8"/><path d="M60 7V113M60 60H113" stroke="#fff" stroke-width="2.6"/><text x="34" y="64" text-anchor="middle" font-family="Inter" font-weight="800" font-size="12" fill="#fff">½</text><text x="84" y="40" text-anchor="middle" font-family="Inter" font-weight="800" font-size="11" fill="#fff">¼</text><text x="84" y="90" text-anchor="middle" font-family="Inter" font-weight="800" font-size="11" fill="#fff">¼</text></svg>'
    lg = [("darm", "Die Hälfte: Pflanzen", "Gemüse, Salat, Obst. Auch aus dem Tiefkühlfach."), ("recap", "Ein Viertel: Eiweiß", "Ei, Fisch, Tofu, Joghurt, Quark oder Käse."), ("schlaf", "Ein Viertel: Vollkorn, Hülsenfrüchte", "Vollkornbrot, Naturreis, Linsen, Bohnen.")]
    lgh = "".join(f'<div style="{pv(p)}"><i></i><span><b>{a}</b><span>{b}</span></span></div>' for p, a, b in lg)
    ex = [("Frühstück", "Haferflocken, Beeren, Nüsse"), ("Mittag", "Linsen-Bowl mit Ofengemüse"), ("Abend", "Vollkornbrot, Hummus, Gurke, Ei")]
    exh = "".join(f'<div class="r" style="grid-template-columns:1fr"><span><small style="font-family:Geist Mono,monospace;letter-spacing:.08em;text-transform:uppercase;font-size:6.8pt;color:var(--t)">{a}</small>{b}</span></div>' for a, b in ex)
    grp = [("Gemüse", "Brokkoli, Paprika, Spinat, Zucchini, Möhren, Tomaten"), ("Obst", "Beeren, Äpfel, Bananen, Orangen, Kiwi"), ("Hülsenfrüchte", "Linsen, Kichererbsen, Bohnen, Erbsen, Edamame"),
           ("Vollkorn", "Haferflocken, Vollkornbrot, Quinoa, Naturreis"), ("Nüsse und Samen", "Walnüsse, Mandeln, Leinsamen, Kürbiskerne"), ("Kräuter und Pilze", "Petersilie, Basilikum, Schnittlauch, Champignons")]
    g6 = "".join(f'<div><b>{a}</b><span>{b}</span></div>' for a, b in grp)
    p1 = hero(1) + BODY(sec("01", "Deine vier Routinen", "jeden Abend in der App") + f'<div class="r4">{rc}</div>' +
        sec("02", "Der Pflanzen-Teller", "einmal am Tag reicht für den Haken", "darm") +
        f'<div class="plate" style="{pv("darm")}">{plate}<div class="lg">{lgh}</div><div class="day" style="padding:4.4mm 5.4mm;gap:1.2mm"><h3>Drei Teller als Beispiel</h3>{exh}</div></div>' +
        f'<div class="strip" style="{pv("darm")}"><span>{ico("bulb",15)}</span><span><b>Klein anfangen zählt.</b> Welche Lebensmittel als Pflanze zählen, steht auf der Mini-Karte „Der Pflanzen-Teller“. Jede Sorte zählt einmal, auch Kräuter.</span></div>', gap="4.2mm", mt="6mm")
    tl = [("0", "Aufstehen", "Zur festen Zeit, ohne Schlummertaste."), ("+2", "Wasser", "Ein großes Glas. Es steht schon am Bett."), ("+5", "Tageslicht", "10 Minuten draußen: Balkon, Bäcker, Hunderunde."), ("+15", "Mobility", "Wer mag: 10 Minuten mit Video 1.9."), ("+30", "Start", "Frühstück, oder du gehst los.")]
    tlh = "".join(f'<div><i>{a}</i><b>{b}</b><span>{c}</span></div>' for a, b, c in tl)
    q4 = [("25 %", "Routine eingeleitet", "30 Minuten vor dem Schlafen: Licht dimmen, runterfahren."), ("25 %", "Bildschirm aus", "Die letzten 60 Minuten ohne Handy, Laptop und Fernseher."), ("25 %", "Feste Bettgehzeit", "Im Bett zu deiner Zeit, ± 30 Minuten."),
          ("25 %", "Extras", "Voll ab zwei: Wasser, Lesen, Kräutertee, Dehnen oder Atmen, 3 gute Dinge, Lüften, ohne Alkohol.")]
    q4h = "".join(f'<div><span class="nr">{a}</span><b>{b}</b><p>{c}</p></div>' for a, b, c in q4)
    d30 = [("Morgens", "Zu Fuß zur Bahn oder zum Bäcker", "10 Min."), ("Mittags", "Eine Runde nach dem Essen", "10 Min."), ("Abends", "Spaziergang oder Rad", "10 Min.")]
    d30h = "".join(f'<div style="grid-template-columns:17mm 1fr auto;gap:2mm"><b>{a}</b><span>{b}</span><b style="color:var(--t)">{c}</b></div>' for a, b, c in d30)
    sn = ["Nach jeder Stunde Sitzen 2 Minuten gehen", "Treppe statt Aufzug", "Telefonate im Stehen oder Gehen", "Eine Haltestelle früher aussteigen"]
    snh = "".join(f'<div><span style="color:var(--t);display:flex;padding-top:.7mm">{ico("check",12,2.8)}</span><span>{x}</span></div>' for x in sn)
    vier = [("darm", "Bunt gegessen", "Halber Teller Pflanzen"), ("schlaf", "Morgenlicht", "10 Min. draußen, feste Zeit"),
            ("beweg", "30 Min bewegt", "Aufgeteilt zählt auch"), ("schlaf", "Abendroutine", "Für den Abend davor")]
    p2 = BODY(sec("03", "Dein Morgen in 30 Minuten", "Minuten nach dem Aufstehen", "schlaf") + f'<div class="tl" style="{pv("schlaf")}">{tlh}</div>' +
        '<p class="bsp"><b>In der App:</b> Du legst deine Aufstehzeit und deinen Morgenlicht-Ort fest. Beides steht danach jeden Morgen auf „Heute“.</p>' +
        sec("04", "Dein Abend", "so rechnet die App", "schlaf") + f'<div class="q4" style="{pv("schlaf")}">{q4h}</div>' +
        '<p class="bsp"><b>Beispiel:</b> Bettgehzeit 22:30 Uhr, Bildschirm aus ab 21:30 Uhr, Zubett-Wecker um 22:00 Uhr. Deine eigene Zeit stellst du in der App ein.</p>' +
        sec("05", "30 Minuten in deinem Tag", "aufgeteilt zählt", "beweg") +
        f'<div class="two2" style="{pv("beweg")}"><div class="lst" style="background:var(--s);padding:4mm 5mm;gap:1.2mm"><h3 style="color:var(--t)">So kommst du auf 30 Minuten</h3>{d30h}</div><div class="lst" style="background:var(--bg);padding:4mm 5mm;gap:1.2mm"><h3>Bewegungssnacks im Büro</h3>{snh}</div></div>' +
        sec("06", "Jeden Abend im Check-in", "dauert etwa eine Minute") +
        checkin(vier, "Die App fragt am Abend nach diesen vier Routinen. Was du tagsüber schon abgehakt hast, ist vorausgewählt. Am siebten Tag kommt dein Warum dazu: ein Satz, wofür du mit 80 noch fit sein willst.") +
        '<div class="warn"><b>Wann zum Arzt?</b> Die Warnzeichen erklären wir in Video 1.5. Sind Beschwerden neu, stark oder gehen sie nicht weg, holst du dir ärztlichen Rat.</div>', gap="3.5mm", mt="7mm")
    return page(1, p1, 1) + page(1, p2, 2)

# ---------------- Woche 2 ----------------
def h2():
    fib = [("Linsen, gekocht", "150 g", 12), ("Kichererbsen, gekocht", "150 g", 11), ("Kidneybohnen, gekocht", "150 g", 10), ("Himbeeren", "125 g", 6), ("Brokkoli", "200 g", 6),
           ("Haferflocken", "50 g", 5), ("Chiasamen", "1 EL", 4), ("Vollkornbrot", "1 Scheibe", 4), ("Mandeln", "30 g", 4), ("Leinsamen, geschrotet", "1 EL", 3)]
    bars = "".join(f'<div class="bar"><span>{a}</span><small>{b}</small><span class="tr"><i style="width:{c/12*100:.0f}%"></i></span><b>{c} g</b></div>' for a, b, c in fib)
    day = [("Frühstück", "50 g Haferflocken, 1 EL Leinsamen", 8), ("Mittag", "Salat mit 150 g Linsen", 12), ("Nachmittag", "30 g Mandeln", 4), ("Abend", "2 Scheiben Vollkornbrot", 8)]
    drows = "".join(f'<div class="r"><span>{a}<small>{b}</small></span><b>{c} g</b></div>' for a, b, c in day)
    p1 = hero(2) + BODY(sec("01", "Deine drei Bausteine", "ab dieser Woche im Check-in") + bausteine(2) +
        sec("02", "Wo Ballaststoffe stecken", "Richtwert: 30 g am Tag") +
        f'<div class="split" style="{pv("darm")}"><div>{bars}</div><div class="day"><h3>So kommst du auf 30 g</h3>{drows}<div class="sum"><span>Summe</span><span>{sum(x[2] for x in day)} g</span></div><p style="font-size:8.8pt;color:var(--muted);line-height:1.4"><b style="color:var(--ink)">Langsam steigern.</b> Etwa 5 g mehr pro Woche, dazu 1,5 bis 2 Liter trinken. So bleibt der Bauch ruhig.</p></div></div>', gap="4mm", mt="6mm")
    tl = [("−60", "Bildschirm aus", "Handy lädt außerhalb des Schlafzimmers."), ("−45", "Licht dimmen", "Kleidung und Tasche für morgen bereitlegen."), ("−30", "Ruhig werden", "Lesen, dehnen oder eine Tasse Abendtee."), ("−10", "Bad", "Zähne putzen, kurz lüften."), ("0", "Licht aus", "Zur festen Zeit, auch am Wochenende.")]
    tlh = "".join(f'<div><i>{a}</i><b>{b}</b><span>{c}</span></div>' for a, b, c in tl)
    kr = [("Kniebeuge zum Stuhl", "2 × 10", "2 × 12", "3 × 12"), ("Liegestütz am Tisch", "2 × 8", "2 × 10", "3 × 10"), ("Ausfallschritt rückwärts, je Seite", "2 × 6", "2 × 8", "3 × 8"),
          ("Brücke", "2 × 10", "2 × 12", "3 × 12"), ("Unterarmstütz", "2 × 20 Sek.", "2 × 30 Sek.", "3 × 30 Sek."), ("Wadenheben", "2 × 12", "2 × 15", "3 × 15")]
    krt = "".join(f'<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in kr)
    stolper = [("Der Bauch grummelt", "Halbier die Menge und steigere langsamer. Gekochtes Gemüse ist am Anfang verträglicher als rohes."),
               ("Abends doch am Handy", "Ladekabel in den Flur legen und einen einfachen Wecker ans Bett stellen. Was nicht greifbar ist, wird nicht benutzt."),
               ("Keine Zeit für Kraft", "Zwei Übungen zählen auch: Kniebeuge und Liegestütz, je zwei Sätze. Das dauert 5 Minuten.")]
    p2 = BODY(sec("03", "Deine Abendroutine", "Minuten vor dem Schlafen", "schlaf") + f'<div class="tl" style="{pv("schlaf")}">{tlh}</div>' +
        '<p class="bsp" style="margin-top:1mm"><b>Beispiel:</b> Wer um 22:30 Uhr schläft, macht den Bildschirm um 21:30 Uhr aus und leitet die Routine um 22:00 Uhr ein. In der App legst du deine eigene Bildschirm-Stopp-Zeit fest.</p>' +
        sec("04", "Dein Kraftplan", "2 Einheiten pro Woche", "beweg") + f'<table class="t"><tr><th>Übung</th><th>Woche 2</th><th>Woche 3</th><th>Ab Woche 4</th></tr>{krt}</table><p style="font-size:9pt;color:var(--muted);margin-top:-2mm">Sätze × Wiederholungen. Zwischen zwei Einheiten liegt mindestens ein Tag Pause. Alle Übungen zeigt Video 2.4.</p>' +
        sec("05", "Wenn es hakt") + qa(stolper) +
        sec("06", "Jeden Abend im Check-in", "dauert etwa eine Minute") +
        checkin(ci_bausteine(2), "Zu deinen vier Routinen kommen diese drei Bausteine dazu. Am letzten Tag der Woche schreibst du einen Wenn-dann-Satz in der App, zum Beispiel: „Wenn ich Kaffee koche, kommt Leinsamen ins Müsli.“"), gap="4.4mm", mt="9mm")
    return page(2, p1, 1) + page(2, p2, 2)

# ---------------- Woche 3 ----------------
def h3():
    X = lambda h: (h - 6) / 17 * 100
    marks = [(6.5, "up", "schlaf", "Aufstehen", "06:30", "Raus ins Licht"), (7.5, "dn", "darm", "Frühstück", "07:30", ""), (12.5, "up", "darm", "Mittagessen", "12:30", ""),
             (13.25, "dn", "beweg", "10 Min. gehen", "13:00", ""), (17.25, "up", "beweg", "Zone 2", "17:15", ""), (18.5, "dn", "darm", "Abendessen", "18:30", ""),
             (19.5, "up", "schlaf", "Küche zu", "19:30", ""), (21.5, "dn", "schlaf", "Bildschirm aus", "21:30", ""), (22.5, "up", "schlaf", "Schlafen", "22:30", "")]
    mk = ""
    for h, pos, p, a, t, _ in marks:
        stem = f'<span class="stem" style="left:{X(h):.2f}%;{"top:21mm;height:6mm" if pos=="up" else "top:31mm;height:5mm"};{pv(p)}"></span>'
        mk += stem + f'<span class="dot" style="left:{X(h):.2f}%;{pv(p)}"></span><span class="mk {pos}" style="left:{X(h):.2f}%;{pv(p)}"><b>{a}</b><span>{t}</span></span>'
    ticks = "".join(f'<span class="tk" style="left:{X(h):.2f}%">{h}</span>' for h in range(6, 24, 2))
    clock = f'<div class="clock"><span class="ax"></span><span class="eat" style="left:{X(7.5):.2f}%;width:{X(19.5)-X(7.5):.2f}%"></span><span class="gap3" style="left:{X(19.5):.2f}%;width:{X(22.5)-X(19.5):.2f}%"></span>{ticks}{mk}</div>'
    legend = '<div style="display:flex;gap:7mm;font-size:8.8pt;color:var(--muted);margin-top:-2mm"><span style="display:flex;align-items:center;gap:1.6mm"><i style="width:8mm;height:3mm;border-radius:1.5mm;background:#CFE3D6;display:block"></i>Essensfenster, etwa 12 Stunden</span><span style="display:flex;align-items:center;gap:1.6mm"><i style="width:8mm;height:3mm;border-radius:1.5mm;display:block;background:repeating-linear-gradient(90deg,#C9D8EA 0 1.2mm,transparent 1.2mm 2.4mm)"></i>3 Stunden ohne Essen vor dem Schlafen</span></div>'
    fill = '<p class="bsp"><b>Die Zeiten sind ein Beispiel.</b> In der App legst du deine eigenen fest: Aufstehzeit, „Küche zu“ und Bildschirm-Stopp. Der Rest richtet sich danach.</p>'
    p1 = hero(3) + BODY(sec("01", "Deine drei Bausteine", "ab dieser Woche im Check-in") + bausteine(3) +
        sec("02", "Dein Tag als Uhr", "ein Beispieltag") + clock + legend + fill +
        f'<div class="strip" style="{pv("schlaf")}"><span>{ico("bulb",15)}</span><span><b>Fang hinten an.</b> Leg zuerst deine Schlafenszeit fest. Alles andere ergibt sich daraus: Bildschirm aus eine Stunde vorher, Küche zu drei Stunden vorher.</span></div>', gap="4.6mm")
    yes = ["Naturjoghurt und Kefir", "Frisches Sauerkraut aus dem Kühlregal", "Kimchi, ungekocht", "Miso, in die nicht mehr kochende Suppe", "Ungekühlter Hinweis: steht „lebende Kulturen“ drauf?"][:4]
    no = ["Sauerkraut aus Dose, Glas oder Beutel, ungekühlt", "Joghurt mit dem Hinweis „wärmebehandelt“", "Essiggurken und Mixed Pickles", "Alles, was du mitkochst oder überbackst"]
    ly = "".join(f'<div><span style="color:var(--t);display:flex;padding-top:.7mm">{ico("check",12,2.8)}</span><span>{x}</span></div>' for x in yes)
    ln = "".join(f'<div><span style="color:var(--coral);font-weight:800">×</span><span>{x}</span></div>' for x in no)
    stolper = [("Abends kommt der Hunger", "Das Abendessen war zu klein. Mehr Eiweiß und Gemüse auf den Teller, danach hilft eine Tasse Kräutertee."),
               ("Das Wochenende wirft alles um", "Höchstens eine Stunde später aufstehen. Fehlt Schlaf, hilft ein Mittagsschlaf von 20 Minuten vor 15 Uhr."),
               ("Fermentiertes schmeckt mir nicht", "Naturjoghurt und Kefir zählen voll. Sauerkraut wird milder, wenn du es mit geriebenem Apfel mischst.")]
    p2 = BODY(sec("03", "Fermentiertes einkaufen", "eine Portion am Tag", "darm") +
        f'<div class="two2" style="{pv("darm")}"><div class="lst" style="background:var(--s)"><h3 style="color:var(--t)">Mit lebenden Kulturen</h3>{ly}</div><div class="lst" style="background:var(--bg)"><h3>Ohne lebende Kulturen</h3>{ln}</div></div>' +
        '<p style="font-size:9.4pt;color:var(--muted);margin-top:-1.5mm"><b style="color:var(--ink)">Eine Portion ist:</b> 150 g Joghurt oder Kefir · 2 gehäufte EL Sauerkraut oder Kimchi · 1 TL Misopaste</p>' +
        sec("04", "Zone 2: der Sprechtest", "Atmung statt Pulsuhr", "beweg") +
        f'<div class="scale" style="{pv("beweg")}"><div><b>Zu locker</b><span>Du könntest dabei singen. Gut zum Aufwärmen.</span></div><div class="on"><b>Zone 2</b><span>Du atmest schneller, sprichst aber noch in ganzen Sätzen. Hier bleibst du.</span></div><div><b>Zu schnell</b><span>Nur einzelne Wörter gehen. Nimm Tempo heraus.</span></div></div>' +
        '<p style="font-size:9.4pt;color:var(--muted);margin-top:-1.5mm"><b style="color:var(--ink)">Dein Einstieg:</b> 3 × 20 Minuten pro Woche, zügig gehen oder locker Rad fahren. <b style="color:var(--ink)">Fernziel:</b> 150 Minuten pro Woche.</p>' +
        sec("05", "Wenn es hakt") + qa(stolper) +
        sec("06", "Jeden Abend im Check-in", "dauert etwa eine Minute") +
        checkin(ci_bausteine(3), "Diese drei Bausteine kommen zu deinen Routinen dazu. Am letzten Tag legst du in der App fest, was dein erster Schritt nach einem schlechten Tag ist, zum Beispiel: morgens raus ins Licht."), gap="4.2mm", mt="9mm")
    return page(3, p1, 1) + page(3, p2, 2)

# ---------------- Woche 4 ----------------
def h4():
    # Koffein-Kurve: Rest in Prozent bei einer Halbwertszeit von 5 Stunden
    W_, H_ = 400, 190; x0, x1, y0, y1 = 38, 394, 30, 158
    X = lambda h: x0 + (h - 9) / 17 * (x1 - x0); Y = lambda v: y1 - v / 100 * (y1 - y0)
    def curve(start):
        pts = [(X(start), Y(0)), (X(start), Y(100))] + [(X(start + k * 0.25), Y(100 * 0.5 ** (k * 0.25 / 5))) for k in range(1, int((26 - start) * 4) + 1)]
        return "M" + " L".join(f"{a:.1f} {b:.1f}" for a, b in pts)
    r10 = 100 * 0.5 ** (12.5 / 5); r15 = 100 * 0.5 ** (7.5 / 5)
    T = lambda x, y, s, col, size=9.5, anchor="start", w=700: f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-size="{size}" fill="{col}" font-weight="{w}" font-family="Inter">{s}</text>'
    grid = "".join(f'<line x1="{x0}" x2="{x1}" y1="{Y(v):.1f}" y2="{Y(v):.1f}" stroke="#E4E9EF" stroke-width=".7"/><text x="{x0-5}" y="{Y(v)+3:.1f}" text-anchor="end" font-size="8.5" fill="#7A8794" font-family="Geist Mono">{v} %</text>' for v in (0, 50, 100))
    xt = "".join(f'<text x="{X(h):.1f}" y="{y1+13}" text-anchor="middle" font-size="8.5" fill="#7A8794" font-family="Geist Mono">{h if h<=24 else h-24} Uhr</text>' for h in (9, 12, 15, 18, 21, 24))
    svg = f'''<svg viewBox="0 0 {W_} {H_}" style="width:100%;display:block">
<rect x="{X(22.5):.1f}" y="{y0}" width="{x1-X(22.5):.1f}" height="{y1-y0}" fill="#E7EEF7"/>{grid}{xt}
<line x1="{X(22.5):.1f}" x2="{X(22.5):.1f}" y1="{y0-8}" y2="{y1}" stroke="#4F78A8" stroke-width="1" stroke-dasharray="3 2"/>
{T(x1, y0-12, "Schlafenszeit 22:30", "#2E5582", 9, "end")}
<path d="{curve(10)}" fill="none" stroke="#5E8C72" stroke-width="2.4" stroke-linejoin="round"/><path d="{curve(15)}" fill="none" stroke="#C0583E" stroke-width="2.4" stroke-linejoin="round"/>
<circle cx="{X(22.5):.1f}" cy="{Y(r10):.1f}" r="3.6" fill="#5E8C72" stroke="#fff" stroke-width="1.4"/><circle cx="{X(22.5):.1f}" cy="{Y(r15):.1f}" r="3.6" fill="#C0583E" stroke="#fff" stroke-width="1.4"/>
{T(X(22.5)+8, Y(r15)-9, f"noch {r15:.0f} %", "#8E3A26", 11)}{T(X(22.5)+8, Y(r10)+16, f"noch {r10:.0f} %", "#2F5A42", 11)}
{T(X(10), y0-12, "Kaffee um 10 Uhr", "#2F5A42", 9, "middle")}{T(X(15), y0-12, "Kaffee um 15 Uhr", "#8E3A26", 9, "middle")}</svg>'''
    kof = [("Filterkaffee", "200 ml", 90), ("Espresso", "1 Tasse", 80), ("Energy-Drink", "250 ml", 80), ("Schwarztee", "220 ml", 50), ("Cola", "330 ml", 35), ("Grüntee", "220 ml", 30)]
    kt = "".join(f'<tr><td><b>{a}</b></td><td>{b}</td><td class="r"><b>{c} mg</b></td></tr>' for a, b, c in kof)
    p1 = hero(4) + BODY(sec("01", "Deine drei Bausteine", "ab dieser Woche im Check-in") + bausteine(4) +
        sec("02", "Wie lange Koffein wirkt", "Rest im Blut", "schlaf") +
        f'<div class="split" style="grid-template-columns:1fr 62mm;gap:8mm;align-items:start"><div>{svg}<p style="font-size:8.6pt;color:var(--muted);line-height:1.4;margin-top:1mm">Gerechnet mit einer Halbwertszeit von 5 Stunden. Je nach Person sind es 3 bis 7 Stunden.</p></div><div><table class="t"><tr><th>Getränk</th><th>Menge</th><th class="r">Koffein, ca.</th></tr>{kt}</table><p style="font-size:7.6pt;color:var(--soft);margin-top:1.5mm">Richtwerte nach EFSA</p></div></div>' +
        f'<div class="strip" style="{pv("schlaf")}"><span>{ico("bulb",15)}</span><span><b>Faustregel.</b> Der letzte Kaffee um 12 Uhr. Danach entkoffeiniert, Kräutertee oder die goldene Milch aus dem Goodie.</span></div>', gap="4.4mm")
    tools = [("Länger ausatmen", "4 Sekunden einatmen, 6 Sekunden ausatmen. Sechs Atemzüge dauern eine Minute und gehen überall, auch im Meeting."),
             ("2 Minuten raus", "Ans offene Fenster oder vor die Tür. Blick in die Ferne, Schultern fallen lassen, Kiefer lockern."),
             ("Treppe hoch", "Ein Stockwerk zügig hoch und wieder herunter, oder 20 Kniebeugen. Bewegung baut Anspannung am schnellsten ab.")]
    th = "".join(f'<div><span class="nr">Werkzeug {k+1}</span><b>{a}</b><p>{b}</p></div>' for k, (a, b) in enumerate(tools))
    tests = [("Aufsteh-Test", "Wiederholungen in 30 Sekunden", "Kraft und Ausdauer der Beine"),
             ("Treppe", "Sekunden für 3 Stockwerke", "Kondition im Alltag"),
             ("Griffkraft", "Kilogramm, falls du ein Messgerät hast", "gilt als Marker für die Gesamtkraft")]
    tt = "".join(f'<tr><td style="width:36mm"><b>{a}</b></td><td style="width:52mm;color:var(--muted)">{b}</td><td>{c}</td></tr>' for a, b, c in tests)
    plan = '''<div class="plan"><span class="mono" style="color:#C9D8EA">Nach Video 4.10 in der App</span><h3>Dein Loop-Plan</h3>
<p style="font-size:10pt;line-height:1.5;color:#D3DEEA;max-width:120mm;position:relative;z-index:1">Neun Bausteine hält auf Dauer niemand durch. Am letzten Tag wählst du in der App drei aus, die bleiben, dazu ein Stress-Werkzeug und den einen Baustein, der auch in einer vollen Woche nicht ausfällt.</p>
<div class="g" style="margin-top:.5mm;position:relative;z-index:1"><div><div class="q">Vier Angaben</div><p style="font-size:9.6pt;line-height:1.5;color:#D3DEEA">Deine Basis bleibt · drei Bausteine · ein Stress-Werkzeug · dein Warum</p></div>
<div><div class="q">So könnte er aussehen</div><p style="font-size:9.6pt;line-height:1.5;color:#D3DEEA">Booster, Bildschirm-Stopp und Kraft. Werkzeug: länger ausatmen. Wenn es eng wird, bleibt der Bildschirm-Stopp.</p></div></div></div>'''
    p2 = BODY(sec("03", "Drei Werkzeuge für zwischendurch", "je unter 2 Minuten", "recap") + f'<div class="tool" style="{pv("recap")}">{th}</div>' +
        sec("04", "Deine Selbsttests", "Werte stehen in der App", "beweg") + f'<table class="t"><tr><th>Test</th><th>Gemessen wird</th><th>Das sagt er dir</th></tr>{tt}</table>' +
        '<p class="bsp">Den Startwert hast du in Woche 1 gemacht, jetzt kommt der zweite. Wichtig ist der Vergleich mit dir selbst: gleicher Stuhl, gleiche Treppe, gleiche Tageszeit. Schon zwei Wiederholungen mehr sind ein echter Fortschritt.</p>' +
        sec("05", "Was bleibt", "deine Entscheidung am Ende der Woche") + plan +
        sec("06", "Jeden Abend im Check-in", "dauert etwa eine Minute") +
        checkin(ci_bausteine(4), "Die letzten drei Bausteine. Am Ende der Woche entscheidest du in der App, welche davon bleiben."), gap="4.4mm", mt="9mm")
    return page(4, p1, 1) + page(4, p2, 2)

if __name__ == "__main__":
    os.makedirs(D + "/out", exist_ok=True)
    for w, fn, nm in [(1, h1, "deine-basis"), (2, h2, "deine-ersten-bausteine"), (3, h3, "timing"), (4, h4, "stress-und-loop-plan")]:
        open(f"{D}/out/innen-kultur-handout-woche-{w}-{nm}.html", "w").write(doc(fn(), f"Handout Woche {w}", XCSS))
    print("ok")
