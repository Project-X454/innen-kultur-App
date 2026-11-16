import os, json
from base import *
from content import BAUSTEINE, MACH_JETZT, MACH_JETZT_GO, WARNZEICHEN, NOTFALL
from todos_data import TODOS

from apptexte_data import BX, TX, MAT, MSUB, PLACEHOLDER as PLH
VID = {v["id"]: v for v in json.load(open(D + "/videos.json"))}
GO = dict(MACH_JETZT_GO, **{"2.1": "To-do Booster", "2.2": "To-do Bildschirm-Stopp", "2.3": "To-do Krafttermine", "2.7": "To-do Schlafzimmer", "3.1": "To-do Fermentiertes", "3.2": "To-do Küche zu",
     "3.3": "To-do Zone-2-Tempo", "3.4": "To-do Nach dem Essen", "3.8": "To-do Wochenende", "4.1": "To-do In Ruhe essen", "4.3": "To-do Runterfahren", "4.5": "To-do Atemübung"})
MJ = lambda i: MACH_JETZT.get(i) or VID[i].get("mj") or ""
WT = {2: ("Deine ersten", "Bausteine"), 3: ("Dein", "Timing"), 4: ("Ruhe und dein", "Loop-Plan")}
N = 11
XCSS = """
.mono.k{font-size:6.4pt;color:var(--soft);display:block;margin-bottom:.7mm;font-weight:600}
.hdr{display:flex;align-items:flex-end;justify-content:space-between;gap:8mm}
.hdr h1{font-size:23pt;white-space:nowrap}.hdr h1 .acc{font-size:26pt}
.hdr p{font-size:9.4pt;color:var(--muted);text-align:right;max-width:78mm;line-height:1.4}
table.t{width:100%;border-collapse:collapse;font-size:8.7pt;line-height:1.36}
table.t th{font-family:"Geist Mono",monospace;font-size:6.6pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--soft);text-align:left;padding:0 3mm 1.5mm 0}
table.t td{border-top:.3mm solid var(--line);padding:1.3mm 3mm 1.3mm 0;vertical-align:top}
table.t td:last-child,table.t th:last-child{padding-right:0}
table.t td b{font-weight:600}
table.t small{display:block;color:var(--muted);font-size:8pt;line-height:1.35}
.id{font-family:"Geist Mono",monospace;font-weight:600;font-size:8.8pt;color:var(--t)}
.vt{color:var(--muted);font-size:8.1pt}
.go{display:inline-block;font-size:7.8pt;font-weight:600;color:var(--blue);background:#EAF1F8;border-radius:10mm;padding:.6mm 2.4mm;white-space:nowrap}
.dy{display:inline-flex;align-items:center;justify-content:center;width:7.5mm;height:7.5mm;border-radius:2.2mm;background:var(--s);color:var(--t);font-weight:800;font-size:9.6pt}
.chs{display:flex;flex-wrap:wrap;gap:1mm;margin-top:1mm}
.chs span{font-size:7.4pt;font-weight:600;padding:.4mm 2mm;border-radius:10mm;border:.3mm solid var(--line);color:var(--muted);white-space:nowrap}
/* Baustein-Block */
.bb{display:grid;grid-template-columns:46mm 1fr 56mm;gap:7mm;border-top:.3mm solid var(--line);padding:4mm 0 4.4mm}
.bb:first-of-type{border-top:0;padding-top:0}
.bb .nm{font-size:12pt;font-weight:700;line-height:1.2;color:var(--t);margin:1.6mm 0 .6mm}
.row{display:grid;grid-template-columns:5.5mm 1fr;align-items:center;border:.3mm solid var(--line);border-radius:2.6mm;padding:1.8mm 2.4mm;margin-top:.4mm;background:#fff}
.row b{display:block;font-size:8.6pt;line-height:1.2}.row small{display:block;font-size:7.6pt;color:var(--muted);line-height:1.25}
.row .chk{width:3.4mm;height:3.4mm}
.nt{border-radius:3.5mm;background:var(--s);padding:3.4mm 4mm 3.6mm;display:flex;flex-direction:column;gap:1.3mm}
.nt .ti{font-size:9.6pt;font-weight:700;line-height:1.25;color:var(--t)}
.nt p{font-size:8.7pt;line-height:1.38}
.nt .wh{font-family:"Geist Mono",monospace;font-size:6.4pt;letter-spacing:.08em;text-transform:uppercase;color:var(--t);opacity:.85}
.nt .bt{align-self:flex-start;margin-top:.8mm;font-size:8pt;font-weight:700;color:#fff;background:var(--c);border-radius:10mm;padding:1mm 3.2mm}
.wz3{display:flex;flex-direction:column;gap:1.5mm;font-size:8.6pt;line-height:1.36}
.wz3 .no{color:var(--muted)}
/* Übersicht */
.ov{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;align-items:start}
.ov>div{display:flex;flex-direction:column;gap:3.6mm}
.oc{border:.35mm solid var(--line);border-radius:4.5mm;padding:3.6mm 4mm 4mm;display:flex;flex-direction:column;gap:1.6mm;}
.oc .hd{display:flex;align-items:baseline;gap:2.4mm}
.oc .hd i{font-style:normal;font-family:"Geist Mono",monospace;font-size:8pt;font-weight:600;color:var(--blue)}
.oc .hd b{font-size:10.4pt;line-height:1.2}
.oc .ds{font-size:8.3pt;color:var(--muted);line-height:1.36}
.oc .mock{margin-top:.6mm}
.oc .mj{background:var(--bg);border:0}
.oc .row{background:var(--bg);border:0}
.oc .wz3{background:var(--bg);border-radius:3mm;padding:2.4mm 3mm}
.oc .nt p,.oc .wz3,.oc .mj{font-size:8.2pt}
.oc .nt .ti{font-size:9pt}
.oc .cnt{font-family:"Geist Mono",monospace;font-size:6.8pt;letter-spacing:.08em;text-transform:uppercase;color:var(--blue);font-weight:600}
.mj{border-radius:3mm;background:#fff;border:.3mm solid var(--line);padding:2.4mm 3mm;display:flex;flex-direction:column;gap:1.2mm;font-size:8.7pt;line-height:1.35}
.wkf{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1.6mm}
.wkf>div{border-radius:3.5mm;background:var(--bg);padding:2.8mm 2.2mm 2.8mm;display:flex;flex-direction:column;gap:1.3mm;font-size:8pt;line-height:1.3;min-height:27mm}
.wkf .d{font-family:"Geist Mono",monospace;font-size:6.6pt;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--soft)}
.wkf b{font-size:7.9pt;line-height:1.2;color:var(--t);hyphens:auto;overflow-wrap:anywhere;letter-spacing:-.01em}
.wkf small{font-size:7.2pt;color:var(--muted);line-height:1.3}
.wkf .new{margin-top:auto;font-size:6.8pt;font-weight:700;color:var(--t);background:var(--s);border-radius:2mm;padding:.9mm 1.4mm;line-height:1.25;align-self:flex-start}
table.mjt td{padding-top:1.1mm;padding-bottom:1.1mm}
table.td td{padding-top:2.1mm;padding-bottom:2.2mm}
table.td .q{font-weight:600;font-size:9pt;display:block;margin-bottom:.8mm}
.rules{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm}
.rules div{border-radius:4mm;background:var(--bg);padding:2.8mm 3.6mm;font-size:8.3pt;line-height:1.36}
.rules b{display:block;font-size:9.4pt;margin-bottom:.6mm}
.wz{display:grid;grid-template-columns:1fr 1fr;gap:8mm}
.wz .c{border-radius:5mm;background:var(--s);padding:6mm 6.5mm;display:flex;flex-direction:column;gap:2.2mm}
.wz h3{font-size:13pt;color:var(--t);display:flex;align-items:center;gap:2mm}
.wz .li{display:grid;grid-template-columns:6mm 1fr;font-size:10.4pt;line-height:1.42;padding:.6mm 0}
.wz .li i{font-style:normal;font-family:"Geist Mono",monospace;font-size:8pt;font-weight:600;color:var(--t);padding-top:.6mm}
.alert{border-radius:5mm;background:#F9E9E4;color:#8E3A26;padding:5mm 6.5mm;font-size:10.6pt;line-height:1.45}
.draft{border:.35mm dashed #C0583E;border-radius:4mm;padding:3.4mm 5mm;font-size:9.4pt;color:#8E3A26;line-height:1.45}
"""
k = lambda t: f'<span class="mono k">{t}</span>'
PG = lambda label, inner, n, gap="4mm", mt="8mm": f'<section class="pg">{top(label)}<div class="pad fit" style="display:flex;flex-direction:column;gap:{gap};margin-top:{mt};flex:1;min-height:0">{inner}</div>{foot("App-Texte Woche 1–4", n, N)}</section>'
def crow(b): return f'<div class="row"><span class="chk"></span><span><b>{b["label"]}</b><small>{BX[b["id"]]["sub"]}</small></span></div>'
def notice(b): return f'<div class="nt"><span class="ti">„{b["label"]}“ ist jetzt in deinem Check-in</span><p>{b["why"]}</p><p><b>{b["when"]}</b></p><span class="wh">Abend-Check-in · Bausteine</span><span class="bt">{BX[b["id"]]["go"]}</span></div>'
def zaehlt(b): return f'<div class="wz3"><div>{k("Zählt")}{b["yes"]}</div><div class="no">{k("Zählt nicht")}{b["no"]}</div><div>{k("Beispiel")}{BX[b["id"]]["bsp"]}</div></div>'

def cover():
    b = BAUSTEINE[0]; t = [x for x in TODOS if x["week"] == 2 and x["day"] == 1][0]; sh, q, win = TX[(2, 1)]
    m = [x for x in MAT if x[2] == "15 Minuten Kraft"][0]
    nb, nt, nm, nf = len(BAUSTEINE), len(TX), sum(1 for i in VID if i[0] in "234" and MJ(i)), len(MAT)
    cards = [
     ("A", "„Mach jetzt“ unter dem Video", "Ein Satz mit einer Handlung für sofort. Bei manchen Videos führt ein Knopf direkt weiter.", f"{nm} Sätze", f'<div class="mj"><span>{k("Video 2.4 · 15 Minuten Kraft")}{MJ("2.4")}</span><span class="go" style="align-self:flex-start">→ {GO["2.4"]}</span></div>'),
     ("B", "Hinweis beim Freischalten", "Erscheint einmal nach dem Video: Titel, Warum, Ab wann, Ort und Knopf.", f"{nb} Hinweise", f'<div style="{pv(b["pillar"])}">{notice(b)}</div>'),
     ("C", "Zeile im Check-in", "Name und Unterzeile des Bausteins, sichtbar ab dem Video.", f"{nb} Bausteine", f'<div style="{pv(b["pillar"])}">{crow(b)}</div>'),
     ("D", "„Was zählt?“", "Öffnet sich über das Info-Symbol neben dem Baustein. Immer drei Angaben.", f"{nb} × 3 Texte", f'<div style="{pv(b["pillar"])}">{zaehlt(b)}</div>'),
     ("E", "To-do des Tages", "Kurzname, Titel, Frage, „Darum“, Eingabeart und Vorschläge zum Antippen.", f"{nt} To-dos", f'<div class="mj"><span>{k("Kurzname")}<b>{sh}</b></span><span>{k("Frage")}{q}</span><div class="chs" style="margin:0">' + "".join(f"<span>{c}</span>" for c in t["eingabe"][1]) + "</div></div>"),
     ("F", "Zeile im Wochenrückblick", "Was die App aus der Eingabe macht. {v} steht für den eingetragenen Wert.", f"{nt} Zeilen", f'<div class="mj"><span>{k("Vorlage")}{win}</span><span>{k("So sieht es aus")}<b>{win.replace("{v}", t["eingabe"][1][0])}</b></span></div>'),
     ("G", "Neues Material", "Titel, Unterzeile und zwei Sätze: was es ist und was du damit tust.", f"{nf} Freischaltungen", f'<div class="mj"><span>{k(m[1] + " · frei nach " + m[3])}<b>{m[2]}</b><small style="display:block;color:var(--muted);font-size:7.8pt">{MSUB[m[2]]}</small></span><span>{m[4]}</span><span>{m[5]}</span></div>'),
     ("H", "Warnzeichen", "Liste zu Video 1.5, für Handout und App.", f"{len(WARNZEICHEN)} Punkte", '<div class="mj" style="border-color:#C0583E;border-style:dashed;color:#8E3A26"><span><b>Entwurf.</b> Steht auf der letzten Seite und muss ärztlich geprüft werden.</span></div>'),
    ]
    one = lambda x: f'<div class="oc"><div class="hd"><i>{x[0]}</i><b>{x[1]}</b></div><p class="ds">{x[2]}</p><span class="cnt">{x[3]}</span><div class="mock">{x[4]}</div></div>'
    oc = "".join("<div>" + "".join(one(x) for x in grp) + "</div>" for grp in (cards[0:3], cards[3:5], cards[5:8]))
    rules = [("Du-Form", "Direkt und freundlich, ohne Ausrufezeichen."), ("Eine Handlung", "Jeder Text sagt, was jetzt zu tun ist."), ("Konkrete Zahlen", "Minuten, Gramm und Uhrzeiten statt „mehr“ oder „weniger“."), ("Keine Versprechen", "Keine Heilaussagen, keine Diagnosen.")]
    rh = "".join(f"<div><b>{a}</b>{b_}</div>" for a, b_ in rules)
    return PG("App-Texte · Übersicht", f'''<div class="hdr"><h1>{acc("App-Texte", "Woche 1–4")}</h1><p>Alle neuen Texte für die App an einem Ort, zur Freigabe. Die Texte von Woche 1 sind bereits in der App.</p></div>
{sec("01", "Acht Textarten und wo sie stehen", "jeweils mit einem echten Beispiel")}<div class="ov">{oc}</div>
{sec("02", "Vier Regeln für alle Texte")}<div class="rules">{rh}</div>''', 1, gap="3.4mm", mt="6mm")

def week_a(w, n):
    bb = "".join(f'<div class="bb" style="{pv(b["pillar"])}"><div><span class="pill">{ico(b["pillar"],11,2.2)}{PSHORT[b["pillar"]]}</span><div class="nm">{b["label"]}</div><span class="vt">frei nach Video {b["video"]} · {VID[b["video"]]["t"]}</span><div style="margin-top:3mm">{k("Zeile im Check-in")}{crow(b)}</div></div><div>{k("Hinweis beim Freischalten")}{notice(b)}</div><div style="padding-top:.2mm">{zaehlt(b)}</div></div>' for b in BAUSTEINE if b["week"] == w)
    bv = {b["video"]: b for b in BAUSTEINE if b["week"] == w}
    wk = ""
    for t in [x for x in TODOS if x["week"] == w]:
        sh = TX[(w, t["day"])][0]; nb = bv.get(t["after"])
        new = '<span class="new">+ Baustein</span>' if nb else ('<span class="new">+ Wochen-Check, Goodie</span>' if t["day"] == 7 else "")
        wk += f'<div style="{pv(t["pillar"])}"><span class="d">Tag {t["day"]}</span><b>{sh}</b><small>nach Video {t["after"]}</small>{new}</div>'
    T_, A_ = WT[w]
    return PG(f"App-Texte · Woche {w}", f"""<div class="hdr"><h1>{acc(f"Woche {w}", A_)}</h1><p>Teil 1 von 3: die drei Bausteine dieser Woche und der Ablauf über sieben Tage.</p></div>
{sec("01", "Bausteine", "Zeile, Hinweis und „Was zählt?“")}<div>{bb}</div>
{sec("02", "Die Woche im Ablauf", "wann welcher Text erscheint")}<div class="wkf">{wk}</div>""", n, gap="4.4mm", mt="8mm")

def week_t(w, n):
    rows = ""
    for t in [x for x in TODOS if x["week"] == w]:
        sh, q, win = TX[(w, t["day"])]; art, chips = t["eingabe"]
        ch = '<div class="chs">' + "".join(f"<span>{c}</span>" for c in chips) + "</div>" if chips else (f'<small style="margin-top:.8mm">Im Feld steht als Beispiel: „{PLH[(w, t["day"])]}“</small>' if (w, t["day"]) in PLH else "")
        rows += f'<tr style="{pv(t["pillar"])}"><td style="width:11mm"><span class="dy">{t["day"]}</span></td><td style="width:44mm"><b style="font-size:9.4pt;color:var(--t)">{sh}</b><small style="color:var(--ink);font-size:8.6pt">{t["title"]}</small><small style="margin-top:.8mm">nach Video {t["after"]} · {t["min"]}</small></td><td><span class="q">{q}</span><span style="color:var(--muted);font-size:8.4pt">{t["why"]}</span></td><td style="width:30mm">{art}{ch}</td><td style="width:33mm">{win}</td></tr>'
    T_, A_ = WT[w]
    return PG(f"App-Texte · Woche {w}", f"""<div class="hdr"><h1>{acc(f"Woche {w}", A_)}</h1><p>Teil 2 von 3: die sieben To-dos. Schritte und Tipps dazu stehen im Wochenplan.</p></div>
{sec("03", "To-dos", "Texte auf der To-do-Seite und im Wochenrückblick")}<table class="t td" style="margin-top:-1mm"><tr><th>Tag</th><th>Kurzname und Titel</th><th>Frage und „Darum“</th><th>Eingabe</th><th>Zeile im Wochenrückblick</th></tr>{rows}</table>""", n, gap="4mm", mt="7mm")

def week_b(w, n):
    ids = sorted([i for i in VID if i.startswith(f"{w}.") and MJ(i)], key=lambda x: int(x.split(".")[1]))
    mj = "".join(f'<tr style="{pv(VID[i]["p"] if VID[i]["p"] in P else "navy")}"><td style="width:11mm"><span class="id">{i}</span></td><td style="width:60mm" class="vt">{VID[i]["t"]}</td><td>{MJ(i)}</td><td style="width:41mm;text-align:right">{f"<span class=go>→ {GO[i]}</span>" if i in GO else ""}</td></tr>' for i in ids)
    mt = "".join(f'<tr><td style="width:57mm"><span class="vt">{a} · nach {v.replace("allen Kernvideos der Woche","allen Kernvideos")}</span><b style="display:block;font-size:9.4pt">{t}</b><small>{MSUB[t]}</small></td><td>{why}</td><td style="width:60mm">{when}</td></tr>' for ww, a, t, v, why, when in MAT if ww == w)
    T_, A_ = WT[w]
    return PG(f"App-Texte · Woche {w}", f"""<div class="hdr"><h1>{acc(f"Woche {w}", A_)}</h1><p>Teil 3 von 3: der Satz unter jedem Video und die Texte zu neuem Material.</p></div>
{sec("04", "Mach jetzt", "ein Satz unter jedem Video")}<table class="t mjt" style="margin-top:-1mm"><tr><th>Video</th><th>Titel</th><th>Satz in der App</th><th style="text-align:right">Knopf führt zu</th></tr>{mj}</table>
{sec("05", "Neues Material", "Texte beim Freischalten in der Bibliothek")}<table class="t" style="margin-top:-1mm"><tr><th>Material</th><th>Was es ist</th><th>Was du damit tust</th></tr>{mt}</table>""", n, gap="3.4mm", mt="6mm")

def warn(n):
    col = lambda kk, p, ic: f'<div class="c" style="{pv(p)}"><h3>{ico(ic,17)}{kk}</h3>' + "".join(f'<div class="li"><i>{j+1:02d}</i><span>{b}</span></div>' for j, (a, b) in enumerate([x for x in WARNZEICHEN if x[0] == kk])) + "</div>"
    return PG("App-Texte · Woche 1", f'''<div class="hdr"><h1>{acc("Wann", "zum Arzt?")}</h1><p>Warnzeichen zu Video 1.5. Sie erscheinen im Handout von Woche 1 und in der App.</p></div>
<div class="draft"><b>Entwurf.</b> Diese Liste muss vor der Veröffentlichung von einer Ärztin oder einem Arzt geprüft und freigegeben werden. Bis dahin zeigt die App nur den allgemeinen Hinweis aus dem Handout.</div>
{sec("01", "Warnzeichen", "bitte zeitnah ärztlich abklären")}<div class="wz">{col("Bauch","darm","darm")}{col("Schlaf","schlaf","schlaf")}</div>
<div class="alert"><b>Notfall.</b> {NOTFALL}</div>
{sec("02", "Fester Hinweis in der App")}<p style="font-size:10.4pt;line-height:1.5;max-width:150mm">Der Kurs ersetzt keine ärztliche Beratung. Wer Medikamente nimmt, schwanger ist oder eine chronische Erkrankung hat, bespricht größere Umstellungen vorher mit der Praxis.</p>''', n, gap="5mm", mt="9mm")

if __name__ == "__main__":
    body = cover() + "".join(week_a(w, 2 + 3 * j) + week_t(w, 3 + 3 * j) + week_b(w, 4 + 3 * j) for j, w in enumerate((2, 3, 4))) + warn(11)
    open(f"{D}/out/innen-kultur-app-texte-woche-1-4.html", "w").write(doc(body, "App-Texte Woche 1–4", XCSS))
    print("ok")
