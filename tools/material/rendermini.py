import os, glob
from playwright.sync_api import sync_playwright
D = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    for f in sorted(glob.glob(D + "/out/mini/*.html")):
        pg.goto("file://" + f); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(250)
        ov = pg.evaluate("[...document.querySelectorAll('.mk')].map((e,i)=>{const d=e.querySelector('.bd');return d.scrollHeight-d.clientHeight>1?i+1:0}).filter(Boolean)")
        out = f.replace(".html", ".pdf"); pg.pdf(path=out, print_background=True, prefer_css_page_size=True)
        print(os.path.basename(out), os.path.getsize(out)//1024, "KB", "overflow:", ov)
    b.close()
