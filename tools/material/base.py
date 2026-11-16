# Gemeinsame Bausteine für alle innen-kultur-PDFs (siehe README.md in diesem Ordner) (CI: Inter, Instrument Serif, Geist Mono; Navy, Blau, Coral; vier Bereichsfarben)
import json, os
D = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(os.path.dirname(D))  # Projektordner: tools/material → tools → Wurzel (für die Schriften)
_L = json.load(open(D + "/logo.json"))
P = {"darm": ("#5E8C72", "#E8F1EB", "#2F5A42", "Ernährung & Darm"), "schlaf": ("#4F78A8", "#E7EEF7", "#2E5582", "Schlaf"),
     "beweg": ("#C0583E", "#F9E9E4", "#8E3A26", "Bewegung"), "recap": ("#A87A2C", "#F6EFDF", "#6B4A10", "Recap"),
     "navy": ("#2D5F93", "#EAF1F8", "#1E3A5A", "innen kultur")}
PSHORT = {"darm": "Darm", "schlaf": "Schlaf", "beweg": "Bewegung", "recap": "Recap"}
def pv(p):
    c, s, t, _ = P[p]
    return f"--c:{c};--s:{s};--t:{t}"
def logo(sz=20, inner="#fff"):
    return f'<svg width="{sz}" height="{sz}" viewBox="0 0 100 100"><path d="{_L["B"]}" fill="#E9765B"/><path d="{_L["I"]}" fill="{inner}"/></svg>'
_IC = {
 "darm": '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/>',
 "schlaf": '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z"/>',
 "beweg": '<circle cx="13" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v4M11 15l1-6 4 3h3M12 9l-4 1-2 3"/>',
 "recap": '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
 "check": '<path d="M5 12.5 10 17 19 7"/>',
 "clock": '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
 "play": '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5 15 12l-5 2.5Z"/>',
 "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
 "phone": '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
 "bulb": '<path d="M9 18h6M10 21h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-.6.6-1 1.4-1 2.2V17h-5v-.3c0-.8-.4-1.6-1-2.2Z"/>',
 "box": '<path d="M4 8l8-4 8 4v8l-8 4-8-4Z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
 "cart": '<path d="M4 5h2l2.2 9.5h9.3L19.5 8H7"/><circle cx="9.5" cy="18.5" r="1.3"/><circle cx="16.5" cy="18.5" r="1.3"/>',
 "pot": '<path d="M5 10h14v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3ZM3 11h2M19 11h2M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/>',
}
def ico(name, sz=16, sw=1.9):
    return f'<svg width="{sz}" height="{sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{_IC[name]}</svg>'

CSS = f"""
@font-face{{font-family:Inter;src:url(file://{APP}/fonts/inter.woff);font-weight:100 900}}
@font-face{{font-family:"Geist Mono";src:url(file://{APP}/fonts/geist-mono.woff);font-weight:100 900}}
@font-face{{font-family:"Instrument Serif";src:url(file://{APP}/fonts/instrument-serif-italic.woff);font-style:italic}}
:root{{--ink:#142231;--muted:#4F5B68;--soft:#7A8794;--line:#E4E9EF;--bg:#F4F6F9;--blue:#2D5F93;--navy:#1E3A5A;--coral:#E9765B}}
*{{box-sizing:border-box}} html,body{{margin:0;padding:0}}
body{{font-family:Inter,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:10pt;line-height:1.45}}
@page{{size:A4;margin:0}}
@page a6{{size:105mm 148mm;margin:0}}
p{{margin:0}} h1,h2,h3{{margin:0;letter-spacing:-.015em;line-height:1.1}}
.acc{{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;letter-spacing:0}}
.mono{{font-family:"Geist Mono",monospace;font-size:7.2pt;letter-spacing:.09em;text-transform:uppercase;font-weight:500}}
.pg{{width:210mm;height:297mm;position:relative;overflow:hidden;break-after:page;display:flex;flex-direction:column;background:#fff}}
.pg:last-child{{break-after:auto}}
.pad{{padding:0 15mm}}
/* Kopf und Fuß */
.top{{display:flex;justify-content:space-between;align-items:center;padding:11mm 15mm 0}}
.brand{{display:flex;align-items:center;gap:2mm;font-weight:800;font-size:11.5pt;letter-spacing:-.01em}}
.top .mono{{color:var(--muted)}}
.foot{{margin-top:auto;padding:0 15mm 8mm;display:flex;justify-content:space-between;align-items:flex-end;color:var(--soft)}}
.foot .mono{{font-size:6.6pt}}
/* Abschnittskopf */
.sec{{display:flex;align-items:baseline;gap:3mm;border-top:.35mm solid var(--ink);padding-top:2.2mm}}
.sec .n{{font-family:"Geist Mono",monospace;font-size:8pt;font-weight:600;color:var(--t,var(--blue))}}
.sec h2{{font-size:13.5pt}}
.sec .r{{margin-left:auto;color:var(--muted)}}
/* Hero-Band */
.hero{{margin:6mm 15mm 0;border-radius:6mm;background:var(--navy);color:#fff;padding:9mm 10mm 9mm;position:relative;overflow:hidden}}
.hero::after{{content:"";position:absolute;right:-18mm;top:-22mm;width:70mm;height:70mm;border-radius:50%;background:var(--coral);opacity:.9}}
.hero::before{{content:"";position:absolute;right:22mm;top:24mm;width:34mm;height:34mm;border-radius:50%;background:rgba(255,255,255,.1)}}
.hero .mono{{color:#D3DEEA;position:relative;z-index:1}}
.hero h1{{font-size:30pt;margin-top:3mm;position:relative;z-index:1;max-width:125mm}}
.hero h1 .acc{{font-size:34pt}}
.hero p{{margin-top:3mm;font-size:11.5pt;line-height:1.4;color:#D3DEEA;max-width:118mm;position:relative;z-index:1}}
.chk{{display:inline-block;flex:none;width:3.8mm;height:3.8mm;border:.4mm solid #8C99A6;border-radius:1mm;background:#fff}}
.ln{{display:block;border-bottom:.35mm solid #C5CED8;height:8mm}}
.pill{{display:inline-flex;align-items:center;gap:1.2mm;font-size:8pt;font-weight:600;padding:.9mm 2.6mm;border-radius:10mm;background:var(--s);color:var(--t);white-space:nowrap}}
.pill.o{{background:#fff;border:.3mm solid var(--line);color:var(--muted)}}
"""
def doc(body, title, extra=""):
    return f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>{title}</title><style>{CSS}{extra}</style></head><body>{body}</body></html>'
def top(label):
    return f'<div class="top"><span class="brand">{logo()}innen kultur</span><span class="mono">{label}</span></div>'
def foot(left, n, N, mid=""):
    return f'<div class="foot"><span class="mono">innen-kultur.de · {left}</span><span class="mono">{mid}</span><span class="mono">{n:02d} / {N:02d}</span></div>'
def sec(n, title, right="", p=None):
    st = f' style="{pv(p)}"' if p else ""
    return f'<div class="sec"{st}><span class="n">{n}</span><h2>{title}</h2>{f'<span class="mono r">{right}</span>' if right else ""}</div>'
def acc(main, a, after=""):
    sp = "" if (main.endswith("-") or not main) else " "
    return f'{main}{sp}<span class="acc">{a}</span>{" "+after if after else ""}'

def acc2(main, a):
    return f'{main}<br><span class="acc">{a}</span>'
