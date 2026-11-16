import sys, os, glob
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.abspath(__file__))
pat=sys.argv[1] if len(sys.argv)>1 else "*"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    for f in sorted(glob.glob(f"{D}/out/{pat}.html")):
        pg.goto("file://"+f); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(400)
        # Rezeptseiten: Fotohöhe anpassen, bis der Inhalt passt
        pg.evaluate("""()=>{document.querySelectorAll('.pg').forEach(e=>{const ph=e.querySelector('.rph'),rb=e.querySelector('.rb'); if(!ph) return; let h=100; const fits=()=>rb.scrollHeight<=rb.clientHeight+1&&e.scrollHeight<=e.clientHeight+1; while(!fits()&&h>70){h-=2; ph.style.height=h+'mm';} })}""")
        ov=pg.evaluate("[...document.querySelectorAll('.pg,.mk')].map((e,i)=>{const d=Math.max(e.scrollHeight-e.clientHeight,...[...e.querySelectorAll('.rb,.fit,.mk .bd,.card,.card .bd')].map(x=>x.scrollHeight-x.clientHeight));return d>1?[i+1,d]:0}).filter(Boolean)")
        phs=pg.evaluate("[...document.querySelectorAll('.rph')].map(e=>e.style.height||'100')")
        out=f.replace(".html",".pdf")
        pg.pdf(path=out,print_background=True,prefer_css_page_size=True)
        print(os.path.basename(out),"overflow:",ov, "photo:",phs if phs else "")
    b.close()
