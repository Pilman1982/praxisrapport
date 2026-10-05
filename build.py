# -*- coding: utf-8 -*-
"""Baut die Webseite fuer GitHub Pages in den Ordner docs/.

    python3 build.py

1. Baut Kuechen- und Servicerapport aus src/kueche und src/service (nach src/dist)
2. Kopiert die benoetigten Programme nach docs/kueche und docs/service
3. Kopiert Startseite und Startlink-Generator aus site/ nach docs/
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
if DOCS.exists(): shutil.rmtree(DOCS)
for folder, files in PUBLISH.items():
    (DOCS / folder).mkdir(parents=True)
    for f in files:
        shutil.copy2(DIST / f, DOCS / folder / f)
for f in (R / "site").iterdir():
    shutil.copy2(f, DOCS / f.name)
(DOCS / ".nojekyll").write_text("")
for p in sorted(DOCS.rglob("*.html")):
    print("%-48s %7.1f kB" % (p.relative_to(DOCS), p.stat().st_size / 1024))
