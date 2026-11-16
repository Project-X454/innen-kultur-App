import sys, glob, os, subprocess
from PIL import Image
pdf, cols, dpi = sys.argv[1], int(sys.argv[2]), sys.argv[3]
pages = sys.argv[4] if len(sys.argv) > 4 else None
D = os.path.dirname(os.path.abspath(__file__)); os.makedirs(D + "/chk", exist_ok=True); tmp = D + "/chk/_s"
for f in glob.glob(tmp + "-*.png"): os.remove(f)
cmd = ["pdftoppm", "-r", dpi, "-png"]
if pages: a, b = pages.split("-"); cmd += ["-f", a, "-l", b]
subprocess.run(cmd + [pdf, tmp], check=True)
fs = sorted(glob.glob(tmp + "-*.png")); ims = [Image.open(f) for f in fs]
w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (w * cols + 6 * (cols + 1), h * rows + 6 * (rows + 1)), "#777")
for i, im in enumerate(ims): S.paste(im, (6 + (i % cols) * (w + 6), 6 + (i // cols) * (h + 6)))
out = D + "/chk/" + (sys.argv[5] if len(sys.argv) > 5 else "sheet") + ".png"; S.save(out); print(out, S.size)
