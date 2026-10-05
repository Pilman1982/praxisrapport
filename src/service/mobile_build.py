# -*- coding: utf-8 -*-
"""Baut die mobilen Servicerapport-Dateien fuer iPhone und iPad.

  _mobile_head.html  Kopf, Icon, Styles, Grundgeruest, Logo, Gewichte, Wochentage
  _chips.js          Kriterien und Bausteinbibliothek (identisch zur Browser-Datei)
  _mobile.js         Logik und Oberflaechentexte
  _mobile_footer.html

Aufruf:  python3 mobile_build.py
"""
import pathlib, sys

SRC = pathlib.Path(__file__).parent
OUT = SRC.parent / "dist"; OUT.mkdir(exist_ok=True)

VARIANTS = {
    "10T": dict(file="Servicerapport_Mobil.html",                   title="Servicerapport Mobil · 10 Tage"),
    "4T":  dict(file="Servicerapport_Mobil_4Tage_Exam.html",        title="Servicerapport Mobil · 4 Tage + Exam"),
    "5T":  dict(file="Servicerapport_Mobil_5Tage_ohneExam.html",    title="Servicerapport Mobil · 5 Tage ohne Exam"),
}

def read(n): return (SRC / n).read_text(encoding="utf-8")

def build(variant, only=None):
    if only and variant not in only: return None
    cfg = VARIANTS[variant]
    head = read("_mobile_head.html") \
        .replace("__LOGO__", read("_logo.txt").strip()) \
        .replace("__ICON__", read("_icon.txt").strip()) \
        .replace("<title>Servicerapport Mobil · 10 Tage</title>", "<title>" + cfg["title"] + "</title>")
    js = read("_mobile.js")
    # Noten 2.0: gemeinsamer Zusatz fuer beide mobilen Apps (Noten, Daten)
    js = js.replace("/* ---------- Start ---------- */", (SRC.parent / "_noten2_mobile.js").read_text(encoding="utf-8") + "\n/* ---------- Start ---------- */", 1)
    old = 'const MVARIANT = "10T";'
    if old not in js: sys.exit("Platzhalter fehlt in _mobile.js: " + old)
    js = js.replace(old, 'const MVARIANT = "%s";' % variant)
    html = head + read("_chips.js") + "\n" + js + read("_mobile_footer.html")
    p = OUT / cfg["file"]; p.write_text(html, encoding="utf-8")
    print("%-6s %-46s %7.1f kB" % (variant, cfg["file"], len(html.encode())/1024))
    return p

if __name__ == "__main__":
    only = sys.argv[1:] or None
    for v in VARIANTS: build(v, only)
