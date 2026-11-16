# Erzeugt die JS-Blöcke für inhalte.js und rezepte.js aus den freigegebenen Material-Daten.
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))
from todos_data import TODOS
from apptexte_data import BX, TX, MAT, MSUB
from content import BAUSTEINE, MACH_JETZT_GO
import rezepte as R

J = lambda s: json.dumps(s, ensure_ascii=False)
OUT = {}

# ---------------------------------------------------------------- To-dos W2–4
# (Woche, Tag): Feld, Typ, Beschriftung, Vorschläge/Platzhalter kommen aus todos_data
F = {
 (2,1): ("booster", "text", "Mein Booster"), (2,2): ("screenStop", "time", "Bildschirm aus ab"),
 (2,3): ("strengthDays", "text", "Meine zwei Tage"), (2,5): ("bedroomFix", "text", "Das ändere ich"),
 (2,7): ("ifThen", "text", "Mein Wenn-dann-Satz"),
 (3,1): ("fermentPick", "text", "Das habe ich gekauft"), (3,2): ("kitchenClose", "time", "Küche zu ab"),
 (3,3): ("zone2Min", "number", "Minuten im Sprechtempo"), (3,4): ("prepChoice", "text", "Meine Entscheidung"),
 (3,5): ("weekendWake", "time", "Aufstehzeit am Wochenende"), (3,7): ("restartStep", "text", "Mein erster Schritt"),
 (4,2): ("lastCaffeine", "time", "Letztes Koffein bis"), (4,5): ("standTest4", "number", "Wiederholungen in 30 Sekunden"),
 (4,6): ("stressTool", "text", "Mein Werkzeug"), (4,7): ("loopPlan", "text", "Meine drei Bausteine"),
}
PLACE = {(2,7): "z. B. Wenn ich Kaffee koche, kommt Leinsamen ins Müsli", (4,7): "z. B. Booster, Bildschirm-Stopp, Kraft"}
LINK = {"Mini-Karte „15 Minuten Kraft“": "kraft_k", "Mini-Karte „Bohnen & Linsen“": "huelsen_k", "Mini-Karte „Sauerkraut“": "kraut_k",
        "Mini-Karte „Meal-Prep“": "prep_k", "Mini-Karten „Sauerkraut“ und „Meal-Prep“": "kraut_k", "Mini-Karte „Atemübung“": "atem_k",
        "Mini-Karte „Deine Selbsttests“": "tests_k", "Mini-Karte „Dein Fermentiertes“": "ferment_k", "Handout Woche 4": "handout4"}
ID = {"Mini-Karte": "", }

def todo_js(t):
    w, d = t["week"], t["day"]
    sh, q, win = TX[(w, d)]
    o = [f'id:"w{w}d{d}"', f'week:{w}', f'day:{d}', f'pillar:{J(t["pillar"])}', f'short:{J(sh)}', f'title:{J(t["title"])}',
         f'after:{J(t["after"])}', f'min:{J(t["min"])}']
    o.append(f'q:{J(q)}')
    o.append(f'why:{J(t["why"])}')
    o.append(f'how:{J(" ".join(t["steps"]))}')
    if (w, d) in F:
        f, ty, lab = F[(w, d)]
        inp = [f'field:{J(f)}', f'type:{J(ty)}', f'label:{J(lab)}']
        chips = t["eingabe"][1]
        if chips: inp.append("chips:[" + ", ".join(J(c) for c in chips) + "]")
        if (w, d) in PLACE: inp.append(f'placeholder:{J(PLACE[(w,d)])}')
        o.append("auto:{field:" + J(f) + "}")
        o.append("input:{" + ", ".join(inp) + "}")
    if t.get("link"):
        key = t["link"]
        mid = LINK[key]
        lab = "Dazu passt: " + key.replace("Mini-Karten", "Mini-Karte").split("“")[0].replace("Mini-Karte „", "Mini-Karte ").replace("Handout Woche 4", "Handout Woche 4")
        o.append("link:{kind:\"material\", id:" + J(mid) + ", label:" + J(lab) + "}")
    o.append(f'win:{J(win)}')
    return "  {" + ", ".join(o) + "}"

OUT["todos"] = ",\n".join(todo_js(t) for t in TODOS if t["week"] >= 2)

# ------------------------------------------------------- Bausteine: Hinweis und „Was zählt?“
def notice_js(b):
    x = BX[b["id"]]
    return ("  " + b["id"] + ":{title:" + J(f'„{b["label"]}“ ist jetzt in deinem Check-in') + ", why:" + J(b["why"]) +
            ", when:" + J(b["when"]) + ", where:\"Abend-Check-in · Bausteine\", go:{kind:\"baustein-info\", id:" + J(b["id"]) + ", label:" + J(x["go"]) + "}}")
OUT["notice"] = ",\n".join(notice_js(b) for b in BAUSTEINE)

def info_js(b):
    x = BX[b["id"]]
    return ("  " + b["id"] + ":{sub:" + J(x["sub"]) + ", video:" + J(b["video"]) + ", yes:" + J(b["yes"]) +
            ", no:" + J(b["no"]) + ", bsp:" + J(x["bsp"]) + "}")
OUT["info"] = ",\n".join(info_js(b) for b in BAUSTEINE)

# ---------------------------------------------------------------- Materialien
# id, kind, week, Titel, short, sub, pillar, unlock, pdf, tab, why, when
MINI = {"15 Minuten Kraft": ("kraft_k", "beweg", "innen-kultur-mini-05-15-minuten-kraft.pdf"),
        "Bohnen & Linsen": ("huelsen_k", "darm", "innen-kultur-mini-06-bohnen-und-linsen.pdf"),
        "Dein Fermentiertes": ("ferment_k", "darm", "innen-kultur-mini-07-dein-fermentiertes.pdf"),
        "Sauerkraut selbst machen": ("kraut_k", "darm", "innen-kultur-mini-08-sauerkraut.pdf"),
        "Meal-Prep in 60 Minuten": ("prep_k", "darm", "innen-kultur-mini-09-meal-prep.pdf"),
        "Atemübung zum Einschlafen": ("atem_k", "schlaf", "innen-kultur-mini-10-atemuebung.pdf"),
        "Deine Selbsttests": ("tests_k", "beweg", "innen-kultur-mini-11-selbsttests.pdf")}
HAND = {2: ("handout2", "Deine ersten Bausteine", "innen-kultur-handout-woche-2-deine-ersten-bausteine.pdf"),
        3: ("handout3", "Timing für Bauch und Schlaf", "innen-kultur-handout-woche-3-timing.pdf"),
        4: ("handout4", "Stress und dein Loop-Plan", "innen-kultur-handout-woche-4-stress-und-loop-plan.pdf")}
GOOD = {1: ("goodie1", "Bunte Teller in 15 Minuten", "Bunte Teller", "5 Rezepte in 15 Minuten", "innen-kultur-goodie-1-bunte-teller.pdf"),
        2: ("goodie2", "Ballaststoff-Frühstücke", "Ballaststoff-Frühstücke", "5 Frühstücke mit Ballaststoffen", "innen-kultur-goodie-2-ballaststoff-fruehstuecke.pdf"),
        3: ("goodie3", "Leichte Abendessen mit Fermentiertem", "Leichte Abendessen", "5 leichte Abendessen", "innen-kultur-goodie-3-leichte-abendessen.pdf"),
        4: ("goodie4", "Feierabend-Küche", "Feierabend-Küche", "3 Abendessen, 2 Getränke", "innen-kultur-goodie-4-feierabend-kueche.pdf")}
PLAN_THEME = {1: "Vier Routinen, ein kleiner Schritt pro Tag.", 2: "Ballaststoffe, Bildschirm-Stopp und zwei Krafteinheiten.",
              3: "Fermentiertes, Essenszeiten und Zone 2.", 4: "Ruhe für Bauch und Schlaf, dann dein Loop-Plan."}
PLAN_TITLE = {1: "Deine Basis", 2: "Deine ersten Bausteine", 3: "Dein Timing", 4: "Ruhe und dein Loop-Plan"}

def m(id, kind, week, title, short, sub, pillar, unlock, tab, why, when, pdf=None, card=None):
    o = [f'id:{J(id)}', f'kind:{J(kind)}', f'week:{week}', f'title:{J(title)}', f'short:{J(short)}', f'sub:{J(sub)}',
         f'pillar:{J(pillar)}', f'unlock:{unlock}']
    if pdf: o.append(f'pdf:{J(pdf)}')
    if card: o.append(f'card:{J(card)}')
    o.append(f'tab:{J(tab)}')
    o.append(f'why:{J(why)}')
    o.append(f'when:{J(when)}')
    return "  {" + ", ".join(o) + "}"

mats = []
# Woche 1: vier Mini-Karten, Wochenplan, Handout, Goodie
mats.append(m("plan1", "Wochenplan", 1, "Wochenplan Woche 1: Deine Basis", "Deine Basis", "Woche 1 · 7 To-dos", "recap", '{video:"1.0"}', "plaene",
  "Alle sieben To-dos der Woche auf fünf Seiten, mit Schritten, Tipp und Platz für deine Antworten.",
  "Druck ihn am Wochenanfang aus oder überflieg ihn einmal. Dann weißt du, was diese Woche auf dich zukommt.",
  "innen-kultur-wochenplan-woche-1.pdf"))
mats.append(m("teller", "Mini-Karte", 1, "Mini-Karte: Der Pflanzen-Teller", "Pflanzen-Teller", "Was als Pflanze zählt", "darm", '{video:"1.6"}', "handouts",
  "Der Teller in Bildern, drei Beispiel-Teller und die Liste, was als Pflanze zählt.",
  "Häng sie an den Kühlschrank, bevor du das nächste Mal einkaufen gehst.", "innen-kultur-mini-01-pflanzen-teller.pdf"))
mats.append(m("morgen", "Mini-Karte", 1, "Mini-Karte: Dein Morgen", "Dein Morgen", "Aufstehen, Licht, Mobility", "schlaf", '{video:"1.9"}', "handouts",
  "Deine ersten 30 Minuten im Ablauf, dazu deine Aufstehzeit, dein Morgenlicht-Ort und sieben Tage zum Abhaken.",
  "Leg sie heute Abend neben das Bett, dann ist sie morgen früh als Erstes da.", "innen-kultur-mini-02-dein-morgen.pdf", "morgen"))
mats.append(m("abend_k", "Mini-Karte", 1, "Mini-Karte: Dein Abend", "Dein Abend", "Die drei Grundpfeiler", "schlaf", '{video:"1.2"}', "handouts",
  "Die drei Grundpfeiler mit Uhrzeiten, die Extras und wie die App deinen Abend rechnet.",
  "Leg sie auf den Nachttisch und trag deine eigenen Zeiten ein.", "innen-kultur-mini-03-dein-abend.pdf", "abend"))
mats.append(m("bewegt_k", "Mini-Karte", 1, "Mini-Karte: 30 Minuten bewegt", "30 Minuten bewegt", "Was alles zählt", "beweg", '{video:"1.8"}', "handouts",
  "Was alles als Bewegung zählt, Bewegungssnacks fürs Büro und eine Woche zum Planen.",
  "Trag am Wochenanfang ein, was wann passt. Aufgeteilt zählt genauso.", "innen-kultur-mini-04-30-minuten-bewegt.pdf"))
mats.append(m("handout1", "Handout", 1, "Handout Woche 1: Deine Basis", "Deine Basis", "Woche 1 auf zwei Seiten", "recap", '{kernOfWeek:1}', "handouts",
  "Alle vier Routinen mit „Zählt“ und „Zählt nicht“, der Pflanzen-Teller, dein Morgen, dein Abend und der Wochen-Tracker.",
  "Druck es für den Rest der Woche aus. Deine Angaben aus den To-dos stehen schon drin.", "innen-kultur-handout-woche-1-deine-basis.pdf", "handout1"))
g = GOOD[1]
mats.append(m(g[0], "Goodie", 1, "Goodie: " + g[1], g[2], g[3], "beweg", '{weekCompleted:1}', "rezepte",
  "Dein Dankeschön für die erste Woche: fünf schnelle Gerichte nach dem Pflanzen-Teller, mit Einkaufsliste.",
  "Such dir für Woche 2 zwei Rezepte aus. Sie passen schon zu den Ballaststoffen, die jetzt kommen.", g[4]))

for w in (2, 3, 4):
    mats.append(m(f"plan{w}", "Wochenplan", w, f"Wochenplan Woche {w}: {PLAN_TITLE[w]}", PLAN_TITLE[w], f"Woche {w} · 7 To-dos", "recap", '{video:"%d.0"}' % w, "plaene",
      "Alle sieben To-dos der Woche auf fünf Seiten, mit Schritten, Tipp und Platz für deine Antworten.",
      "Druck ihn am Wochenanfang aus oder überflieg ihn einmal. Dann weißt du, was diese Woche auf dich zukommt.",
      f"innen-kultur-wochenplan-woche-{w}.pdf"))
    for ww, kind, title, vid, why, when in MAT:
        if ww != w or kind != "Mini-Karte": continue
        mid, pil, pdf = MINI[title]
        mats.append(m(mid, "Mini-Karte", w, "Mini-Karte: " + title, title, MSUB[title], pil, '{video:%s}' % J(vid.replace("Video ", "")), "handouts", why, when, pdf))
    hid, htitle, hpdf = HAND[w]
    hwhy = [x[4] for x in MAT if x[0] == w and x[1] == "Handout"][0]
    hwhen = [x[5] for x in MAT if x[0] == w and x[1] == "Handout"][0]
    mats.append(m(hid, "Handout", w, f"Handout Woche {w}: {htitle}", htitle, f"Woche {w} auf zwei Seiten", "recap", "{kernOfWeek:%d}" % w, "handouts", hwhy, hwhen, hpdf))
    g = GOOD[w]
    gwhy = [x[4] for x in MAT if x[0] == w and x[1] == "Goodie"][0]
    gwhen = [x[5] for x in MAT if x[0] == w and x[1] == "Goodie"][0]
    mats.append(m(g[0], "Goodie", w, "Goodie: " + g[1], g[2], g[3], "beweg", "{weekCompleted:%d}" % w, "rezepte", gwhy, gwhen, g[4]))
OUT["materials"] = ",\n".join(mats)

# ---------------------------------------------------------------- Mach jetzt: Knopfziele
MJ_MAP = {"2.4": ("material", "kraft_k", "Mini-Karte 15 Minuten Kraft"), "2.6": ("material", "huelsen_k", "Mini-Karte Bohnen & Linsen"),
 "3.1": ("material", "ferment_k", "Mini-Karte Dein Fermentiertes"), "3.5": ("material", "kraut_k", "Mini-Karte Sauerkraut"),
 "3.7": ("material", "prep_k", "Mini-Karte Meal-Prep"), "4.5": ("material", "atem_k", "Mini-Karte Atemübung"),
 "4.7": ("material", "tests_k", "Mini-Karte Selbsttests")}
TODO_GO = {"2.1": (2,1,"Booster eintragen"), "2.2": (2,2,"Bildschirm-Stopp eintragen"), "2.3": (2,3,"Krafttermine eintragen"),
 "2.7": (2,5,"Schlafzimmer eintragen"), "2.12": (2,7,"Wenn-dann-Satz schreiben"), "3.2": (3,2,"„Küche zu“ eintragen"),
 "3.3": (3,3,"Zone-2-Minuten eintragen"), "3.8": (3,5,"Aufstehzeit fürs Wochenende"), "3.12": (3,7,"Wiedereinstieg festlegen"),
 "4.1": (4,1,"To-do „In Ruhe essen“"), "4.2": (4,2,"Letzten Kaffee eintragen"), "4.3": (4,3,"To-do Runterfahren"),
 "4.8": (4,6,"Stress-Werkzeug wählen"), "4.10": (4,7,"Loop-Plan festlegen")}
rows = []
for vid in sorted(set(list(MJ_MAP) + list(TODO_GO)), key=lambda x: (int(x.split(".")[0]), int(x.split(".")[1]))):
    if vid in MJ_MAP:
        k, i, lab = MJ_MAP[vid]
        rows.append(f'  {J(vid)}: {{kind:"material", id:{J(i)}, label:{J(lab)}}}')
    else:
        w, d, lab = TODO_GO[vid]
        rows.append(f'  {J(vid)}: {{kind:"todo", id:"w{w}d{d}", label:{J(lab)}}}')
OUT["machjetzt"] = ",\n".join(rows)

# ---------------------------------------------------------------- Rezepte
def recipe_js(r):
    nut = R.nutrition(r)
    ing = []
    for name, items in r["groups"]:
        for z in items:
            ing.append((z[0] + " " + z[1]).strip())
    steps = [(lead + " " + text).strip() for lead, text in r["steps"]]
    o = [f'title:{J(r["t"] + " " + r["a"])}', f'minutes:{r["aktiv"]}', f'plants:{len(r["plants"])}']
    if nut: o += [f'kcal:{nut[0]}', f'protein:{nut[1]}', f'fiber:{nut[2]}']
    if r.get("serves"): o.append(f'serves:{J(r["serves"])}')
    o += [f'intro:{J(r["intro"])}',
         "ingredients:[" + ", ".join(J(x) for x in ing) + "]",
         "steps:[" + ", ".join(J(x) for x in steps) + "]",
         f'tip:{J(r["tip"])}', f'keep:{J(r["keep"])}', f'swap:{J(r["swap"])}']
    return "    {" + ", ".join(o) + "}"

blocks = []
for g in R.GOODIES:
    gid = GOOD[g["week"]][0]
    shop = ", ".join("{group:" + J(name) + ", items:[" + ", ".join(J(i) for i in items) + "]}" for name, items in g["shop"])
    blocks.append(f'  {gid}:{{intro:{J(g["intro"])}, use:[' + ", ".join(J(u) for u in g["use"]) + "], shop:[" + shop + "],\n   recipes:[\n" + ",\n".join(recipe_js(r) for r in g["recipes"]) + "\n  ]}")
OUT["rezepte"] = ",\n".join(blocks)

os.makedirs(os.path.join(D, "out"), exist_ok=True)
for k, v in OUT.items():
    open(os.path.join(D, "out", f"js_{k}.txt"), "w").write(v)
    print(k, len(v.splitlines()), "Zeilen", len(v) // 1024, "KB")
