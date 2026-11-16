import os, json
from base import *
PH = lambda i: f"file://{D}/" + os.environ.get("MKPH", "photos") + f"/{i}.jpg"
XCSS = """
.mk{page:a6;width:105mm;height:148mm;position:relative;overflow:hidden;break-after:page;display:flex;flex-direction:column;background:#fff;font-size:8.4pt;line-height:1.38}
.mk:last-child{break-after:auto}
.mk .top{padding:6mm 7mm 0}.mk .brand{font-size:9.5pt}.mk .top .mono{font-size:6pt}
.mk .hd{margin:3.6mm 7mm 0;border-radius:4mm;background:var(--s);padding:4.2mm 5mm;position:relative;overflow:hidden}
.mk .hd::after{content:"";position:absolute;right:-9mm;top:-11mm;width:30mm;height:30mm;border-radius:50%;background:var(--c);opacity:.22}
.mk .hd.ph{padding:0;height:25mm;background-size:cover;background-position:center}
.mk .hd.ph::after{display:none}
.mk h1{font-size:17pt;color:var(--t);position:relative;z-index:1}
.mk h1 .acc{font-size:19pt}
.mk .hd p{font-size:8.5pt;margin-top:1.1mm;color:var(--t);position:relative;z-index:1;max-width:74mm;line-height:1.35}
.mk .tt{padding:3mm 7mm 0}
.mk .tt h1{color:var(--ink)} .mk .tt h1 .acc{color:var(--t)} .mk .tt p{font-size:8.5pt;color:var(--muted);margin-top:.6mm}
.mk .bk{display:flex;align-items:baseline;justify-content:space-between;gap:3mm;margin:4mm 7mm 0;padding-bottom:2.2mm;border-bottom:.45mm solid var(--c)}
.mk .bk h1{font-size:13.5pt;color:var(--ink)} .mk .bk h1 .acc{font-size:15.5pt;color:var(--t)}
.mk .bk .mono{font-size:5.8pt;color:var(--t);white-space:nowrap}
.mk .bd{padding:3.2mm 7mm 0;display:flex;flex-direction:column;gap:2.3mm;flex:1;min-height:0}
.mk .bd>*{flex-shrink:0}
.mk .end{margin-top:auto}
.mk .lb{font-family:"Geist Mono",monospace;font-size:6.3pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--t);padding-bottom:.9mm;border-bottom:.3mm solid var(--c);margin-bottom:.2mm;display:flex;justify-content:space-between}
.mk .lb span{color:var(--soft);font-weight:500}
.mk table{width:100%;border-collapse:collapse;font-size:8.2pt}
.mk th{font-family:"Geist Mono",monospace;font-size:5.7pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--soft);text-align:left;padding:0 1.5mm .9mm 0}
.mk td{border-top:.25mm solid var(--line);padding:1.05mm 1.5mm 1.05mm 0;vertical-align:top;line-height:1.3}
.mk tr:first-child td{border-top:0}
.mk th+*{}
.mk table.h tr:nth-child(2) td{border-top:.25mm solid var(--line)}
.mk td b{font-weight:600}
.mk td small{display:block;color:var(--muted);font-size:7.3pt;line-height:1.28}
.mk td.n{font-family:"Geist Mono",monospace;font-weight:600;color:var(--t);width:6mm}
.mk td.tm{font-family:"Geist Mono",monospace;font-weight:600;color:var(--t);width:12.5mm;white-space:nowrap;font-size:7.6pt;padding-top:1.3mm}
.mk td.k{font-weight:600;color:var(--t);white-space:nowrap;width:1%;padding-right:3mm}
.mk td.r,.mk th.r{text-align:right;padding-right:0;white-space:nowrap}
.mk td.c,.mk th.c{text-align:center;padding-right:0}
.mk td.c i{display:inline-block;width:4.2mm;height:4.2mm;border-radius:50%;border:.35mm solid var(--c);vertical-align:middle}
.mk td.c u{display:inline-block;width:100%;height:4.2mm;border-bottom:.3mm solid #A9B4C0;text-decoration:none}
.mk table.wk td{padding:.95mm 0;vertical-align:middle}
.mk table.wk td:first-child{width:9mm;font-weight:700}
.mk .sp{display:grid;grid-template-columns:6mm 1fr;padding:.7mm 0;font-size:8.4pt;line-height:1.36}
.mk .sp i{font-style:normal;width:4.4mm;height:4.4mm;border-radius:50%;background:var(--c);color:#fff;font-size:6.4pt;font-weight:800;display:grid;place-items:center;margin-top:.1mm}
.mk .note{border-radius:3mm;background:var(--bg);padding:2.2mm 3mm;font-size:8pt;line-height:1.38}
.mk .note.c{background:var(--s);color:var(--t)}
.mk .li{display:grid;grid-template-columns:4.5mm 1fr;font-size:8.3pt;line-height:1.36;padding:.4mm 0}
.mk .li span:first-child{color:var(--t);display:flex;padding-top:.5mm}
.mk .li.x span:first-child{color:var(--coral);font-weight:800;padding-top:0;line-height:1.25}
.mk .foot{padding:2mm 7mm 5mm}.mk .foot .mono{font-size:5.6pt}
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:1mm}
.flow div{background:var(--s);color:var(--t);padding:1.7mm 2mm;font-size:7.5pt;line-height:1.25;font-weight:600}
.flow div small{display:block;font-family:"Geist Mono",monospace;font-size:5.8pt;font-weight:500;letter-spacing:.06em;text-transform:uppercase;opacity:.85}
.flow div:first-child{border-radius:2.5mm 0 0 2.5mm}.flow div:last-child{border-radius:0 2.5mm 2.5mm 0}
.lad{display:grid;grid-template-columns:repeat(3,1fr);gap:1.6mm;align-items:end}
.lad div{background:var(--s);color:var(--t);border-radius:2.5mm;padding:2mm 2.6mm;display:flex;flex-direction:column;justify-content:flex-end}
.lad b{font-size:11pt;line-height:1.1}.lad span{font-size:7.3pt;line-height:1.25}.lad small{font-family:"Geist Mono",monospace;font-size:5.8pt;letter-spacing:.08em;text-transform:uppercase}
.lad.top3 div{justify-content:flex-start}
.breath{display:grid;grid-template-columns:4fr 6fr;gap:1mm}
.breath div{padding:2.8mm 3.4mm;display:flex;flex-direction:column;gap:.3mm}
.breath .in{background:var(--s);color:var(--t);border-radius:3mm 0 0 3mm}
.breath .out{background:var(--c);color:#fff;border-radius:0 3mm 3mm 0}
.breath b{font-size:15pt;line-height:1}.breath span{font-size:7.5pt}
.week7{display:grid;grid-template-columns:repeat(7,1fr);gap:1.4mm;text-align:center}
.week7 div{display:flex;flex-direction:column;align-items:center;gap:.8mm;font-family:"Geist Mono",monospace;font-size:6pt;color:var(--soft);text-transform:uppercase}
.week7 i{width:7mm;height:7mm;border-radius:50%;border:.4mm solid var(--c);display:block}
.wline{display:inline-block;border-bottom:.3mm solid #A9B4C0;width:15mm;height:4.6mm}
.plt{display:grid;grid-template-columns:25mm 1fr;gap:4mm;align-items:center}
.plt .lg{display:flex;flex-direction:column;gap:1.3mm}
.plt .lg div{display:grid;grid-template-columns:4mm 1fr;font-size:8.1pt;line-height:1.3}
.plt .lg i{width:2.8mm;height:2.8mm;border-radius:.8mm;background:var(--c);margin-top:.7mm}
.plt .lg b{font-weight:600}
.plt .lg span span{color:var(--muted)}
.fl{display:flex;align-items:flex-end;gap:1.5mm;font-size:8.3pt;font-weight:600;white-space:nowrap}
.fl u{flex:1;border-bottom:.3mm solid #A9B4C0;height:4.6mm;text-decoration:none;min-width:8mm}
.fbox{border-radius:3mm;background:var(--s);color:var(--t);padding:2.4mm 3mm;display:flex;flex-direction:column;gap:1.4mm}
.fbox .fl u{border-color:var(--c)}
.wl{display:block;border-bottom:.3mm solid #A9B4C0;height:4.9mm}
.pls{display:flex;flex-wrap:wrap;gap:1.1mm}
.pls span{font-size:7.5pt;font-weight:600;padding:.7mm 2.2mm;border-radius:10mm;background:var(--s);color:var(--t)}
.qb{display:grid;grid-template-columns:repeat(4,1fr);gap:.8mm}
.qb div{background:var(--c);color:#fff;padding:1.6mm 2mm;font-size:7.2pt;line-height:1.2;font-weight:600}
.qb div small{display:block;font-family:"Geist Mono",monospace;font-size:6.6pt;font-weight:600;opacity:.9}
.qb div:first-child{border-radius:2.5mm 0 0 2.5mm}.qb div:last-child{border-radius:0 2.5mm 2.5mm 0;background:var(--s);color:var(--t)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:1.6mm 4mm}
.g2 .k{font-size:7.6pt;font-weight:700;color:var(--t);margin-bottom:.5mm}
.g2 .ck{display:grid;grid-template-columns:4.4mm 1fr;font-size:8.1pt;line-height:1.3;padding:.35mm 0;align-items:start}
.g2 .ck i,.cb{display:inline-block;width:2.9mm;height:2.9mm;border:.3mm solid #8C99A6;border-radius:.8mm;background:#fff;margin-top:.5mm}
.fb{display:grid;grid-template-columns:27mm 1fr 9mm;gap:2mm;align-items:center;font-size:8.1pt;padding:.5mm 0}
.fb .tr{height:3mm;border-radius:1.5mm;background:var(--bg);overflow:hidden}
.fb .tr i{display:block;height:100%;border-radius:1.5mm;background:var(--c)}
.fb b{text-align:right;font-weight:700}
.tst{display:grid;grid-template-columns:6mm 1fr;padding:.9mm 0;font-size:8.3pt;line-height:1.36}
.tst i{font-style:normal;width:4.4mm;height:4.4mm;border-radius:50%;background:var(--c);color:#fff;font-size:6.4pt;font-weight:800;display:grid;place-items:center;margin-top:.1mm}
.tst em{font-style:normal;display:block;color:var(--t);font-weight:600;margin-top:.3mm}
"""
N = 11
def card(p, week, nr, body, video, side, hd):
    return f'<section class="mk" style="{pv(p)}">{top(f"Mini-Karte {nr:02d} · Woche {week}")}{hd}<div class="bd">{body}</div><div class="foot"><span class="mono">innen-kultur.de · Video {video}</span><span class="mono">{side}</span></div></section>'
def head(t, a, sub): return f'<div class="hd"><h1>{acc(t, a)}</h1><p>{sub}</p></div>'
def headph(img, t, a, sub, pos="center", h=25): return f'<div class="hd ph" style="background-image:url({PH(img)});background-position:{pos};height:{h}mm"></div><div class="tt"><h1>{acc(t, a)}</h1><p>{sub}</p></div>'
def back(t, a, right="Rückseite"): return f'<div class="bk"><h1>{acc(t, a)}</h1><span class="mono">{right}</span></div>'
sp = lambda items: "".join(f'<div class="sp"><i>{k+1}</i><span>{x}</span></div>' for k, x in enumerate(items))
li = lambda items: "".join(f'<div class="li"><span>{ico("check",9,3)}</span><span>{x}</span></div>' for x in items)
xl = lambda items: "".join(f'<div class="li x"><span>×</span><span>{x}</span></div>' for x in items)
lb = lambda t, r="": f'<div class="lb">{t}{f"<span>{r}</span>" if r else ""}</div>'
note = lambda t, c=True, end=False: f'<div class="note{" c" if c else ""}{" end" if end else ""}">{t}</div>'
kv = lambda rows: "<table>" + "".join(f"<tr><td class='k'>{a}</td><td>{b}</td></tr>" for a, b in rows) + "</table>"
tm = lambda rows: "<table>" + "".join(f"<tr><td class='tm'>{a}</td><td>{b}</td></tr>" for a, b in rows) + "</table>"
DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
def week(cols, line=()):
    th = "<tr><th></th>" + "".join(f"<th class='c'>{c}</th>" for c in cols) + "</tr>"
    return "<table class='wk h'>" + th + "".join(f"<tr><td>{d}</td>" + "".join(f"<td class='c'>{'<u></u>' if k in line else '<i></i>'}</td>" for k in range(len(cols))) + "</tr>" for d in DAYS) + "</table>"
fl = lambda *parts: '<div class="fl">' + "".join("<u></u>" if x is None else f"<span>{x}</span>" for x in parts) + "</div>"

def build():
    o = ""
    # ---------- 01 Pflanzen-Teller (Woche 1) ----------
    plate = '<svg viewBox="0 0 120 120" style="width:25mm;height:25mm;display:block"><circle cx="60" cy="60" r="58" fill="#fff" stroke="#E4E9EF" stroke-width="3"/><path d="M60 9 A51 51 0 0 0 60 111 Z" fill="#5E8C72"/><path d="M60 9 A51 51 0 0 1 111 60 L60 60 Z" fill="#A87A2C"/><path d="M111 60 A51 51 0 0 1 60 111 L60 60 Z" fill="#4F78A8"/><path d="M60 7V113M60 60H113" stroke="#fff" stroke-width="3"/><text x="34" y="65" text-anchor="middle" font-family="Inter" font-weight="800" font-size="14" fill="#fff">½</text><text x="84" y="41" text-anchor="middle" font-family="Inter" font-weight="800" font-size="12" fill="#fff">¼</text><text x="84" y="91" text-anchor="middle" font-family="Inter" font-weight="800" font-size="12" fill="#fff">¼</text></svg>'
    lg = [("darm", "Die Hälfte: Pflanzen.", "Gemüse, Salat, Obst."), ("recap", "Ein Viertel: Eiweiß.", "Ei, Fisch, Tofu, Joghurt, Quark."), ("schlaf", "Ein Viertel: Vollkorn oder Hülsenfrüchte.", "Brot, Naturreis, Linsen, Bohnen.")]
    plt = f'<div class="plt">{plate}<div class="lg">' + "".join(f'<div style="{pv(p)}"><i></i><span><b>{a}</b> <span>{b}</span></span></div>' for p, a, b in lg) + "</div></div>"
    o += card("darm", 1, 1, lb("So baust du den Teller") + plt + lb("Drei Teller als Beispiel") +
        kv([("Morgens", "Haferflocken mit Beeren, Nüssen und Naturjoghurt"), ("Mittags", "Linsen-Bowl mit Ofengemüse und Feta"), ("Abends", "Vollkornbrot mit Hummus, Gurke und Ei")]) +
        note("<b>So zählt es.</b> Mindestens die Hälfte des Tellers besteht aus Pflanzen. Tiefkühlgemüse zählt genauso wie frisches.", end=True), "1.6", "Vorderseite",
        headph("g1r4", "Der Pflanzen-", "Teller", "Einmal am Tag reicht für den Haken „Bunt gegessen“.", "center 45%"))
    grp = [("Gemüse", "Brokkoli, Paprika, Spinat, Möhren, Tomaten"), ("Obst", "Beeren, Äpfel, Bananen, Orangen, Kiwi"), ("Hülsenfrüchte", "Linsen, Kichererbsen, Bohnen, Erbsen"),
           ("Vollkorn", "Haferflocken, Vollkornbrot, Naturreis"), ("Nüsse, Samen", "Walnüsse, Mandeln, Leinsamen"), ("Kräuter, Pilze", "Petersilie, Basilikum, Champignons")]
    o += card("darm", 1, 1, lb("Das zählt als Pflanze") + kv(grp) + lb("Das habe ich immer zu Hause") + '<span class="wl"></span><span class="wl"></span><span class="wl"></span>' +
        lb("Diese Woche probiere ich neu") + '<span class="wl"></span><span class="wl"></span>' +
        note("<b>Mitzählen.</b> Jede Sorte zählt einmal, auch Kräuter und Gewürze. Die Zahl trägst du abends im Check-in unter „Mehr eintragen“ ein.", end=True), "1.6", "Rückseite", back("Der Pflanzen-", "Teller", "Für den Kühlschrank"))

    # ---------- 02 Dein Morgen (Woche 1) ----------
    o += card("schlaf", 1, 2, lb("Dein Ablauf", "Minuten nach dem Aufstehen") +
        tm([("0", "<b>Aufstehen.</b> Zur festen Zeit, ohne Schlummertaste."), ("+ 2", "<b>Wasser.</b> Ein großes Glas. Es steht schon am Bett."), ("+ 5", "<b>Tageslicht.</b> 10 Minuten draußen, etwa auf dem Balkon."),
            ("+ 15", "<b>Mobility.</b> Wer mag: 10 Minuten mit Video 1.9."), ("+ 30", "<b>Start.</b> Frühstück, oder du gehst los.")]) +
        lb("So zählt es") + li(["<b>Licht:</b> 10 Minuten draußen, in der ersten Stunde nach dem Aufstehen.", "<b>Aufstehzeit:</b> jeden Tag gleich, ±&nbsp;30 Minuten."]) +
        lb("Am Abend vorbereiten") + li(["Wecker stellen, bevor du das Handy weglegst.", "Wasserglas ans Bett, Jacke und Schuhe an die Tür."]) +
        note("<b>Gut zu wissen.</b> Auch bei bewölktem Himmel ist es draußen deutlich heller als drinnen am Fenster.", end=True), "1.7 und 1.9", "Vorderseite",
        head("Dein", "Morgen", "Die ersten 30 Minuten stellen deine innere Uhr."))
    o += card("schlaf", 1, 2, f'<div class="fbox">{fl("Meine Aufstehzeit", None, "Uhr")}{fl("Mein Morgenlicht-Ort", None)}</div>' +
        lb("Meine Woche") + week(["Aufgestanden", "Licht", "Mobility"]) + lb("Wenn es hakt") +
        kv([("Noch dunkel", "Mach drinnen helles Licht an und geh raus, sobald es hell ist."), ("Keine Zeit", "Verbinde das Licht mit einem Weg, etwa zu Fuß zur Bahn."),
            ("Kurze Nacht", "Steh trotzdem zur festen Zeit auf. Abends schläfst du dann leichter ein.")]),
        "1.7 und 1.9", "Rückseite", back("Dein", "Morgen", "Zum Abhaken"))

    # ---------- 03 Dein Abend (Woche 1) ----------
    ext = ["Glas Wasser", "Gelesen", "Kräutertee", "Dehnen oder Atmen", "3 gute Dinge", "Gelüftet", "Ohne Alkohol"]
    qb = '<div class="qb"><div><small>25 %</small>Eingeleitet</div><div><small>25 %</small>Bildschirm aus</div><div><small>25 %</small>Bettgehzeit</div><div><small>25 %</small>Extras, voll ab zwei</div></div>'
    o += card("schlaf", 1, 3, lb("Die drei Grundpfeiler", "Minuten vor dem Schlafen") +
        tm([("− 60", "<b>Bildschirm aus.</b> Die letzte Stunde ohne Handy, Laptop und Fernseher.<small>Beispiel: 21:30 Uhr</small>"), ("− 30", "<b>Routine einleiten.</b> Licht dimmen, runterfahren.<small>Beispiel: 22:00 Uhr</small>"), ("0", "<b>Feste Bettgehzeit.</b> Im Bett zu deiner Zeit, ±&nbsp;30 Minuten.<small>Beispiel: 22:30 Uhr</small>")]) +
        lb("Extras") + '<div class="pls">' + "".join(f"<span>{x}</span>" for x in ext) + "</div>" + lb("So rechnet die App") + qb +
        note("<b>Im Check-in.</b> Den Abend hakst du am nächsten Tag unter „Gestern Abend“ ab. Ausführlich erklärt ihn Video 2.2.", end=True), "1.2 und 2.2", "Vorderseite",
        head("Dein", "Abend", "Drei Grundpfeiler und ein paar Extras bringen dich zur Ruhe."))
    o += card("schlaf", 1, 3, f'<div class="fbox">{fl("Meine Bettgehzeit", None, "Uhr")}{fl("Bildschirm aus ab", None, "Uhr", "Zubett-Wecker", None, "Uhr")}</div>' +
        lb("Meine Woche") + week(["Eingeleitet", "Bildschirm aus", "Im Bett", "Extras"], line=(3,)) + lb("Das hilft") +
        li(["Stell einen Zubett-Wecker, 30 Minuten vor deiner Zeit.", "Das Handy lädt außerhalb des Schlafzimmers.", "Buch und Wasserglas liegen schon am Bett."]),
        "1.2 und 2.2", "Rückseite", back("Dein", "Abend", "Zum Abhaken"))

    # ---------- 04 30 Minuten bewegt (Woche 1) ----------
    fl3 = '<div class="flow" style="grid-template-columns:repeat(3,1fr)"><div><small>Morgens · 10 Min.</small>Zu Fuß zur Bahn</div><div><small>Mittags · 10 Min.</small>Nach dem Essen</div><div><small>Abends · 10 Min.</small>Um den Block</div></div>'
    o += card("beweg", 1, 4, lb("Aufgeteilt zählt") + fl3 + lb("Das zählt alles") +
        kv([("Spazieren", "zügig, auch der Weg zur Arbeit"), ("Fahrrad", "Pendeln, Tour oder Ergometer"), ("Cardio", "Laufen, Schwimmen, Rudern"), ("Kraft", "Studio, Eigengewicht, Kurse"), ("Mobility", "Yoga, Pilates, Dehnen"), ("Alltag", "Garten, Treppen, mit Kindern toben")]) +
        lb("Wenn der Tag voll ist") + li(["10 Minuten gehen, direkt nach dem Aufstehen.", "Abends eine Runde um den Block."]) +
        note("<b>Woran du es merkst.</b> Du atmest etwas schneller, kannst dich aber noch unterhalten.", end=True), "1.3 und 1.8", "Vorderseite",
        head("30 Minuten", "bewegt", "Über den Tag verteilt, mit etwas schnellerem Atem."))
    wk = "<table class='wk h'><tr><th></th><th>Was?</th><th class='c' style='width:13mm'>Min.</th><th class='c' style='width:9mm'>✓</th></tr>" + "".join(f"<tr><td>{d}</td><td><u style='display:block;height:4.2mm;border-bottom:.3mm solid #A9B4C0;margin-right:3mm'></u></td><td class='c'><u></u></td><td class='c'><i></i></td></tr>" for d in DAYS) + "</table>"
    o += card("beweg", 1, 4, lb("Bewegungssnacks im Büro") +
        li(["Nach jeder Stunde Sitzen 2 Minuten gehen.", "Treppe statt Aufzug.", "Telefonate im Stehen oder Gehen.", "Eine Haltestelle früher aussteigen."]) +
        lb("Meine Bewegungswoche") + wk +
        note("<b>Timer.</b> Stell dir eine Erinnerung nach 60 Minuten Sitzen.", False, True), "1.3 und 1.8", "Rückseite", back("30 Minuten", "bewegt", "Zum Planen"))

    # ---------- 05 Kraft (Woche 2) ----------
    ex = [("Kniebeuge zum Stuhl", "Po nach hinten, den Stuhl nur antippen.", "10"), ("Liegestütz am Tisch", "Der Körper bleibt eine gerade Linie.", "8"), ("Ausfallschritt rückwärts", "Das vordere Knie bleibt über dem Fuß.", "6 je Seite"),
          ("Brücke", "Oben den Po fest anspannen.", "10"), ("Unterarmstütz", "Ellbogen unter den Schultern.", "20 Sek."), ("Wadenheben", "Oben eine Sekunde halten.", "12")]
    t1 = "<table class='h'><tr><th></th><th>Übung</th><th class='r'>Zum Start</th></tr>" + "".join(f"<tr><td class='n'>{k+1}</td><td><b>{a}</b><small>{b}</small></td><td class='r'><b>{c}</b></td></tr>" for k, (a, b, c) in enumerate(ex)) + "</table>"
    flow = '<div class="flow"><div><small>2 Min.</small>Aufwärmen</div><div><small>6 Min.</small>Runde 1</div><div><small>1 Min.</small>Pause</div><div><small>6 Min.</small>Runde 2</div></div>'
    o += card("beweg", 2, 5, lb("Ablauf") + flow + lb("Die sechs Übungen", "eine Runde") + t1 +
        note("<b>Tempo.</b> 2 Sekunden absenken, 1 Sekunde hoch.", end=True), "2.4", "Vorderseite",
        head("15 Minuten", "Kraft", "Zweimal pro Woche, ohne Geräte, mit Pausentag."))
    var = [("Kniebeuge", "Hände auf den Beinen", "3 Sek. absenken"), ("Liegestütz", "an der Wand", "am Boden, kniend"), ("Ausfallschritt", "Hand am Stuhl", "tiefer gehen"),
           ("Brücke", "kleinere Bewegung", "einbeinig"), ("Unterarmstütz", "auf den Knien", "45 Sekunden"), ("Wadenheben", "mit Halt an der Wand", "einbeinig")]
    t2 = "<table class='h'><tr><th>Übung</th><th>Leichter</th><th>Schwerer</th></tr>" + "".join(f"<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>" for a, b, c in var) + "</table>"
    o += card("beweg", 2, 5, lb("Leichter oder schwerer") + t2 + lb("Dein Plan") +
        kv([("Woche 2", "2 Runden mit den Werten von der Vorderseite"), ("Woche 3", "2 Runden, je 2 Wiederholungen mehr"), ("Ab Woche 4", "3 Runden")]) +
        lb("Meine Termine") + f'<div class="fbox">{fl("Tag 1", None, "Tag 2", None)}</div>' +
        note("<b>Achte auf:</b> Rücken gerade, Bauch leicht angespannt, weiteratmen. <b>Stopp</b> bei Schmerz im Gelenk oder Schwindel.", False, True), "2.4", "Rückseite", back("15 Minuten", "Kraft", "Für neben die Matte"))

    # ---------- 06 Bohnen & Linsen (Woche 2) ----------
    h = [("Rote Linsen", "nein", "10–12 Min."), ("Berglinsen", "nein", "25–30 Min."), ("Kichererbsen", "12 Std.", "60–90 Min."), ("Weiße Bohnen", "12 Std.", "60–90 Min."), ("Kidneybohnen", "12 Std.", "60–90 Min. *")]
    t3 = "<table class='h'><tr><th>Sorte</th><th>Einweichen</th><th class='r'>Kochen</th></tr>" + "".join(f"<tr><td><b>{a}</b></td><td>{b}</td><td class='r'>{c}</td></tr>" for a, b, c in h) + "</table>"
    o += card("darm", 2, 6, lb("Einweichen und kochen") + t3 + lb("Drei Regeln") +
        sp(["Einweichwasser wegschütten, frisch aufsetzen.", "Erst nach dem Kochen salzen.", "Mit Kümmel, Fenchel oder Ingwer würzen."]) +
        note("<b>* Kidneybohnen</b> die ersten 10 Minuten sprudelnd kochen und nie roh essen.", end=True), "2.6", "Vorderseite",
        headph("g1r2", "Bohnen &amp;", "Linsen", "Richtig vorbereitet sind sie gut bekömmlich.", "center 55%", 18))
    lad = '<div class="lad"><div style="height:12mm"><small>Woche 1</small><b>2 EL</b><span>am Tag</span></div><div style="height:15mm"><small>Woche 2</small><b>4 EL</b><span>am Tag</span></div><div style="height:18mm"><small>Woche 3</small><b>150 g</b><span>eine volle Portion</span></div></div>'
    fb = "".join(f'<div class="fb"><span>{a}</span><span class="tr"><i style="width:{c/12*100:.0f}%"></i></span><b>{c} g</b></div>' for a, c in [("Linsen", 12), ("Kichererbsen", 11), ("Kidneybohnen", 10)])
    o += card("darm", 2, 6, lb("Langsam steigern") + lad + lb("Ballaststoffe", "je 150 g gekocht") + f"<div>{fb}</div>" + lb("Fünf schnelle Ideen") +
        li(["Eine Handvoll Linsen in den Salat.", "Kichererbsen in die Gemüsepfanne.", "Weiße Bohnen in die Suppe.", "Bohnen zerdrückt als Aufstrich aufs Brot.", "Hummus mit Möhre, Gurke und Paprika."]) +
        note("<b>Aus der Dose ist völlig in Ordnung.</b> Im Sieb abspülen, bis nichts mehr schäumt. <b>Selbst gekocht</b> halten sie 3 Tage im Kühlschrank.", end=True), "2.6", "Rückseite", back("Bohnen &amp;", "Linsen", "Für die Küche"))

    # ---------- 07 Fermentiertes (Woche 3) ----------
    por = '<div class="lad top3" style="align-items:stretch"><div><b>150 g</b><span>Joghurt oder Kefir</span></div><div><b>2 EL</b><span>Sauerkraut, Kimchi</span></div><div><b>1 TL</b><span>Misopaste</span></div></div>'
    o += card("darm", 3, 7, lb("Eine Portion ist") + por + lb("Mit lebenden Kulturen") +
        li(["Naturjoghurt, Kefir und Skyr", "Frisches Sauerkraut und Kimchi aus dem Kühlregal", "Miso, in die nicht mehr kochende Suppe gerührt"]) + lb("Zählt nicht") +
        xl(["Sauerkraut aus Dose, Glas oder Beutel, ungekühlt", "Joghurt mit dem Hinweis „wärmebehandelt“", "Essiggurken und Mixed Pickles", "Alles, was du mitkochst oder überbackst"]), "3.1 und 3.6", "Vorderseite",
        headph("g3r1", "Dein", "Fermentiertes", "Eine Portion mit lebenden Kulturen am Tag.", "center 40%", 21))
    g = [("Milchprodukte", ["Naturjoghurt", "Kefir", "Skyr"]), ("Gemüse", ["Frisches Sauerkraut", "Kimchi", "Milchsaure Gurken"]), ("Zum Würzen", ["Miso, hell oder dunkel"]), ("Getränke", ["Kombucha, gekühlt", "Wasserkefir"])]
    g2 = '<div class="g2">' + "".join(f'<div><div class="k">{a}</div>' + "".join(f'<span class="ck"><i></i>{x}</span>' for x in l) + "</div>" for a, l in g) + "</div>"
    o += card("darm", 3, 7, lb("Am Kühlregal") +
        sp(["Such im Kühlregal. Was ungekühlt im Regal steht, ist fast immer erhitzt.", "Lies das Etikett: „pasteurisiert“ oder „wärmebehandelt“ heißt, die Kulturen leben nicht mehr.", "Kurze Zutatenliste: Milch und Kulturen, oder Kohl und Salz."]) +
        lb("Das mag ich", "ankreuzen") + g2 + lb("Meine Favoriten") + '<span class="wl"></span>' +
        note("<b>Sanft starten.</b> Fang mit 1 EL Sauerkraut oder einem halben Becher Joghurt an und steigere über eine Woche.", end=True), "3.1 und 3.6", "Rückseite", back("Dein", "Fermentiertes", "Für den Einkauf"))

    # ---------- 08 Sauerkraut (Woche 3) ----------
    o += card("darm", 3, 8, note("<b>Du brauchst:</b> 1 kg Weißkohl · 20 g Salz (2 %) · 1 TL Kümmel nach Wunsch · 1 Glas mit Deckel (1 Liter)") +
        sp(["Ein äußeres Blatt aufheben. Kohl vierteln, Strunk entfernen, fein hobeln.", "Mit dem Salz 10 Minuten kräftig kneten, bis reichlich Saft austritt.", "Fest ins saubere Glas drücken. Der Saft muss den Kohl bedecken.", "Mit dem Blatt abdecken und mit einem kleinen Glas beschweren.", "Deckel lose auflegen, Glas auf einen Teller stellen."]) +
        note("<b>Sauber arbeiten.</b> Glas und Deckel vorher mit kochendem Wasser ausspülen, Hände gründlich waschen.", False, True),
        "3.5", "Vorderseite", headph("mk_kraut", "Sauerkraut", "selbst machen", "30 Minuten Arbeit, zwei Wochen Geduld.", "center", 22))
    o += card("darm", 3, 8, lb("Was in den nächsten Wochen passiert") +
        kv([("Tag 1–3", "Es blubbert. Das Glas steht bei Zimmertemperatur, Deckel einmal täglich kurz lüften."), ("Tag 4–7", "Der Geruch wird säuerlich. Jetzt an einen kühleren Ort stellen, zum Beispiel in den Keller."), ("Woche 2–4", "Probieren. Schmeckt es dir, kommt es in den Kühlschrank.")]) +
        lb("Wenn etwas anders aussieht") +
        kv([("Zu wenig Saft", "Salzlake nachgießen: 10 g Salz auf 500 ml Wasser."), ("Weißer Film", "Abschöpfen. Das ist harmlose Kahmhefe."), ("Bunt und pelzig", "Das ist Schimmel. Alles wegwerfen.")]) +
        lb("So isst du es") + li(["Roh als Beilage, erst auf dem Teller dazugeben.", "Mit geriebenem Apfel und etwas Öl als Salat.", "Zu Kartoffeln, aufs Brot oder in die Bowl."]) +
        note("<b>Deine Portion:</b> 2 gehäufte EL am Tag. Im Kühlschrank hält es mehrere Monate. Immer mit sauberer Gabel entnehmen.", end=True), "3.5", "Rückseite", back("Sauerkraut", "selbst machen", "Für die Küche"))

    # ---------- 09 Meal-Prep (Woche 3) ----------
    plan = [("0", "Ofen auf 200 °C. Gemüse in mundgerechte Stücke schneiden."), ("10", "Gemüse mit Öl und Salz aufs Blech, 35 Minuten backen."), ("15", "Vollkornreis oder Quinoa aufsetzen."), ("20", "Linsen in frischem Wasser kochen, 25 Minuten."), ("40", "Dressing rühren, Kräuter hacken."), ("50", "Abkühlen lassen, in vier Boxen füllen, kalt stellen.")]
    res = '<div class="lad top3" style="align-items:stretch"><div><b>4</b><span>Boxen für vier Tage</span></div><div><b>11</b><span>verschiedene Pflanzen</span></div><div><b>60</b><span>Minuten, einmal pro Woche</span></div></div>'
    o += card("darm", 3, 9, lb("Dein Ablauf", "Minute") + tm(plan) + lb("Das Ergebnis") + res +
        note("<b>Du brauchst:</b> 1 Backblech · 2 Töpfe · 4 Boxen mit Deckel", end=True), "3.7", "Vorderseite", headph("mk_prep", "Meal-Prep", "in 60 Minuten", "Einmal kochen, viermal essen.", "center", 22))
    shop = ["250 g Vollkornreis oder Quinoa", "200 g Berglinsen", "1 kg Ofengemüse: Paprika, Zucchini, Möhren, Brokkoli", "1 Dose Mais oder Kichererbsen", "2 Zitronen, 4 EL Olivenöl, 1 TL Senf", "Zum Auffrischen: Kirschtomaten, Gurke, Kräuter"]
    shl = "".join(f'<div class="li"><span><i class="cb"></i></span><span>{x}</span></div>' for x in shop)
    box = '<div class="flow" style="grid-template-columns:1fr 1fr 2fr"><div><small>ein Viertel</small>Getreide</div><div><small>ein Viertel</small>Linsen</div><div><small>die Hälfte</small>Gemüse</div></div>'
    o += card("darm", 3, 9, lb("Einkauf für vier Boxen") + shl + lb("So füllst du eine Box") + box + lb("Drei Richtungen", "kurz vor dem Essen dazu") +
        kv([("Mediterran", "Zitronen-Dressing, Feta, Oliven"), ("Orientalisch", "Joghurt mit Kreuzkümmel, Minze"), ("Asiatisch", "Sojasauce, Limette, Sesam")]) +
        note("<b>Haltbarkeit.</b> 3 bis 4 Tage im Kühlschrank. Dressing getrennt aufbewahren, Tomaten, Gurke und Kräuter erst am Tag selbst dazugeben.", end=True), "3.7", "Rückseite", back("Meal-Prep", "in 60 Minuten", "Für die Küche"))

    # ---------- 10 Atemübung (Woche 4) ----------
    br = '<div class="breath"><div class="in"><span>einatmen</span><b>4 Sek.</b><span>durch die Nase</span></div><div class="out"><span>ausatmen</span><b>6 Sek.</b><span>langsam, wie durch einen Strohhalm</span></div></div>'
    o += card("schlaf", 4, 10, lb("Ein Atemzug") + br + lb("So geht's") +
        sp(["Rückenlage, Licht aus, eine Hand auf den Bauch.", "4 Sekunden durch die Nase einatmen. Die Hand hebt sich.", "6 Sekunden langsam ausatmen. Die Hand senkt sich.", "10 Runden wiederholen und mitzählen. Das dauert knapp 2 Minuten.", "Noch wach? Häng 10 Runden an. Danach normal weiteratmen."]) +
        note("<b>Warum es wirkt.</b> Langes Ausatmen bremst den Puls und signalisiert dem Körper: Ruhe.", end=True), "4.5", "Vorderseite",
        head("Atemübung", "zum Einschlafen", "Wenige Minuten im Bett. Für den Nachttisch."))
    w7 = '<div class="week7">' + "".join(f"<div><i></i>{d}</div>" for d in DAYS) + "</div>"
    o += card("schlaf", 4, 10, lb("Wenn es nicht klappt") +
        kv([("Die Gedanken kreisen", "Fang wieder bei 1 an. Das Zurückkommen ist die Übung."), ("Das Zählen stresst", "Nimm 3 Sekunden ein und 5 Sekunden aus."), ("Zu wenig Luft", "Atme normal weiter. Nichts erzwingen."), ("Du wirst wacher", "Hör auf zu zählen und atme nur noch lang aus.")]) +
        lb("Auch am Tag") +
        kv([("Vor einem Termin", "6 Atemzüge im Sitzen, das ist eine Minute."), ("Vor dem Essen", "3 Atemzüge, dann der erste Bissen (Video 4.6)."), ("Nach Ärger", "Erst ausatmen, dann antworten.")]) +
        lb("Sieben Abende", "ausmalen") + w7 +
        note("<b>Dranbleiben.</b> Die Übung fällt mit jedem Abend leichter. Gib ihr eine Woche.", end=True), "4.5", "Rückseite", back("Atemübung", "zum Einschlafen", "Zum Abhaken"))

    # ---------- 11 Selbsttests (Woche 4) ----------
    ts = [("Aufsteh-Test", "Stabiler Stuhl ohne Rollen, mit der Lehne an der Wand. Arme vor der Brust kreuzen. 30 Sekunden so oft wie möglich ganz aufstehen und wieder hinsetzen.", "Du zählst jedes vollständige Aufstehen."),
          ("Treppe", "3 Stockwerke zügig hinaufgehen, nicht rennen. Das Geländer ist erlaubt.", "Du stoppst die Sekunden bis zur letzten Stufe."),
          ("Griffkraft", "Nur mit Messgerät: im Stehen, Arm am Körper, drei Versuche pro Hand.", "Du notierst den besten Wert in Kilogramm.")]
    t8 = "".join(f'<div class="tst"><i>{k+1}</i><span><b>{a}.</b> {b}<em>{c}</em></span></div>' for k, (a, b, c) in enumerate(ts))
    o += card("beweg", 4, 11, lb("Drei Tests für zu Hause") + t8 + lb("Vorher") + li(["2 Minuten locker gehen.", "Timer oder Stoppuhr bereitlegen."]) +
        note("<b>Nur ohne Beschwerden.</b> Bei Schwindel, Schmerzen oder Atemnot brichst du ab.", end=True), "4.7", "Vorderseite",
        head("Deine", "Selbsttests", "Einfach messen, was sich in vier Wochen verändert."))
    rows = [("Aufsteh-Test", "Wiederholungen"), ("Treppe", "Sekunden"), ("Griffkraft", "Kilogramm")]
    t9 = "<table class='h'><tr><th>Test</th><th>Woche 1</th><th>Woche 4</th><th>Woche 8</th></tr>" + "".join(f"<tr><td><b>{a}</b><small>{b}</small></td>" + "<td><span class='wline'></span></td>" * 3 + "</tr>" for a, b in rows) + "</table>"
    o += card("beweg", 4, 11, lb("Deine Werte") + t9 + lb("So misst du fair") +
        li(["Immer zur gleichen Tageszeit.", "Gleicher Stuhl, gleiche Treppe, gleiche Schuhe.", "Ein Versuch zählt. Kein Üben direkt davor."]) +
        lb("Mein Fortschritt nach vier Wochen") + f'<div class="fbox">{fl("Aufsteh-Test:", None, "Wiederholungen mehr")}{fl("Treppe:", None, "Sekunden schneller")}</div>' +
        note("<b>Zur Einordnung.</b> Es zählt dein Vergleich mit dir selbst. Schon zwei Wiederholungen mehr sind ein echter Fortschritt.", False, True), "4.7", "Rückseite", back("Deine", "Selbsttests", "Zum Eintragen"))
    return doc(o, "Mini-Karten Woche 1–4", XCSS)

SLUGS = ["01-pflanzen-teller", "02-dein-morgen", "03-dein-abend", "04-30-minuten-bewegt", "05-15-minuten-kraft", "06-bohnen-und-linsen",
         "07-dein-fermentiertes", "08-sauerkraut", "09-meal-prep", "10-atemuebung", "11-selbsttests"]

if __name__ == "__main__":
    os.makedirs(D + "/out", exist_ok=True)
    full = build()
    open(f"{D}/out/innen-kultur-mini-karten-woche-1-4.html", "w").write(full)
    # Einzelkarten (Vorder- und Rückseite) für die App
    body = full.split("<body>", 1)[1].rsplit("</body>", 1)[0]
    parts = ['<section class="mk"' + x for x in body.split('<section class="mk"')[1:]]
    assert len(parts) == 2 * len(SLUGS), len(parts)
    os.makedirs(D + "/out/mini", exist_ok=True)
    for k, slug in enumerate(SLUGS):
        open(f"{D}/out/mini/innen-kultur-mini-{slug}.html", "w").write(doc(parts[2*k] + parts[2*k+1], "Mini-Karte " + slug, XCSS))
    print("ok")
