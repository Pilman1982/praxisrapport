# -*- coding: utf-8 -*-
"""Baut die Webseite fuer GitHub Pages in den Ordner docs/.

    python3 build.py

1. Baut Kuechen- und Servicerapport aus src/kueche und src/service (nach src/dist)
2. Kopiert die benoetigten Programme nach docs/kueche und docs/service
3. Kopiert Startseite, Startlink-Generator, Cockpit und Notenzentrale aus site/ nach docs/
   (in die Notenzentrale wird dabei das Notenmodell der Apps eingesetzt)
Danach committen und pushen; GitHub Pages veroeffentlicht docs/ automatisch.
"""
import pathlib, shutil, subprocess, sys

R = pathlib.Path(__file__).parent
SRC, DIST, DOCS = R / "src", R / "src" / "dist", R / "docs"

def run(folder, script):
    subprocess.run([sys.executable, script], cwd=SRC / folder, check=True, stdout=subprocess.DEVNULL)

subprocess.run([sys.executable, str(R / "tools" / "sync_handoff.py")], check=True)
if DIST.exists(): shutil.rmtree(DIST)
for folder in ("kueche", "service"):
    run(folder, "build_variants.py"); run(folder, "mobile_build.py")

PUBLISH = {
    "kueche":  ["Kuechenrapport.html", "Kuechenrapport_4Tage_Exam.html", "Kuechenrapport_5Tage_ohneExam.html",
                "Kuechenrapport_Mobil.html", "Kuechenrapport_Mobil_4Tage_Exam.html", "Kuechenrapport_Mobil_5Tage_ohneExam.html"],
    "service": ["Servicerapport.html", "Servicerapport_4Tage_Exam.html", "Servicerapport_5Tage_ohneExam.html",
                "Servicerapport_Mobil.html", "Servicerapport_Mobil_4Tage_Exam.html", "Servicerapport_Mobil_5Tage_ohneExam.html"],
}
# Daily Grades (08.10.2026): Logo, Zeichen und Symbol in alle Seiten einsetzen
BRAND = SRC / "_brand"
import base64
DG = {"__DG_LOGO__": (BRAND / "dg_logo.svg").read_text(encoding="utf-8").strip(),
      "__DG_MARK__": (BRAND / "dg_mark.svg").read_text(encoding="utf-8").strip(),
      "__DG_ICON__": "data:image/png;base64," + base64.b64encode((BRAND / "dg_180.png").read_bytes()).decode()}
def brand(path):
    s = path.read_text(encoding="utf-8"); s2 = s
    for k, v in DG.items(): s2 = s2.replace(k, v)
    if s2 != s: path.write_text(s2, encoding="utf-8")
for f in DIST.glob("*.html"): brand(f)

# Notenzentrale (31.10.2026): das Notenmodell der Apps unverändert einsetzen, damit die Noten identisch gerechnet werden
import re
CW = "const critWeight = k => DOUBLE_CRITS.includes(k) ? 2 : 1;"
def model_js(area):
    a = (SRC / area / "_scriptA.js").read_text(encoding="utf-8")
    chips = (SRC / area / "_chips.js").read_text(encoding="utf-8")
    i = a.index("const W = "); j = a.index(CW, i) + len(CW)
    crits = ""
    if "const CRITS" not in chips:
        k = a.index("const CRITS = ["); crits = a[k:a.index("\n];", k) + 3]
    return ("(function(){\n" + a[i:j] + "\n" + crits + "\n" + chips
            + "\nconst CHIP = {}; CHIPS.forEach(c => CHIP[c.i] = c);"
            + "\nreturn {CAP_NEG, CAP_POS, DOUBLE_CRITS, critWeight, CRITS, CHIPS, CHIP};\n})()")
# Gleiche Kappung und Doppelgewichtung in der Service-Laptop- und der Service-Mobil-Fassung
def regeln(txt):
    return (re.search(r"const CAP_NEG = (-?[\d.]+), CAP_POS = ([\d.]+);", txt).groups(),
            re.search(r"const DOUBLE_CRITS = (\[[^\]]*\]);", txt).group(1).replace(" ", ""))
assert regeln((SRC / "service" / "_scriptA.js").read_text(encoding="utf-8")) == regeln((SRC / "service" / "_mobile_head.html").read_text(encoding="utf-8")), \
    "Service: Kappung oder Doppelgewichtung in _scriptA.js und _mobile_head.html verschieden"

if DOCS.exists(): shutil.rmtree(DOCS)
for folder, files in PUBLISH.items():
    (DOCS / folder).mkdir(parents=True)
    for f in files:
        shutil.copy2(DIST / f, DOCS / folder / f)
for f in (R / "site").iterdir():
    if f.is_dir(): shutil.copytree(f, DOCS / f.name); continue      # lib/: Bibliotheken im eigenen Repository (seit 10.11.2026)
    shutil.copy2(f, DOCS / f.name)
    if f.name == "notenzentrale.html":
        t = (DOCS / f.name).read_text(encoding="utf-8")
        for area in ("kueche", "service"):
            ph = "/*__MODEL_%s__*/null" % area
            assert t.count(ph) == 1, ph
            t = t.replace(ph, model_js(area))
        (DOCS / f.name).write_text(t, encoding="utf-8")
    if f.suffix == ".html": brand(DOCS / f.name)
(DOCS / ".nojekyll").write_text("")
for p in sorted(DOCS.rglob("*.html")):
    print("%-48s %7.1f kB" % (p.relative_to(DOCS), p.stat().st_size / 1024))
