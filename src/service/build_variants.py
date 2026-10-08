# -*- coding: utf-8 -*-
"""Baut die Servicerapport-Browserdateien aus den Bausteinen.

  _head_top.html  Kopf, Styles, Druckansicht, Grundgeruest
  _scriptA.js     Logo, Gewichte, Wochentage
  _chips.js       Kriterien und Bausteinbibliothek   <- hier werden Bausteine geaendert
  _scriptB.js     Logik, Oberflaechentexte, Render
  _footer.html    Abschluss

Aufruf:  python3 build_variants.py
"""
import pathlib, sys

SRC = pathlib.Path(__file__).parent
OUT = SRC.parent / "dist"
OUT.mkdir(exist_ok=True)

VARIANTS = {
    "10T": dict(file="Servicerapport.html",                    slots=10, exam=True,
                title="Daily Grades · Service · 9 Tage + Exam (Laptop)"),
    "4T":  dict(file="Servicerapport_4Tage_Exam.html",         slots=5,  exam=True,
                title="Daily Grades · Service · 4 Tage + Exam (Laptop)"),
    "5T":  dict(file="Servicerapport_5Tage_ohneExam.html",     slots=5,  exam=False,
                title="Daily Grades · Service · 5 Tage (Laptop)"),
}

def read(n): return (SRC / n).read_text(encoding="utf-8")

def build(variant, only=None):
    if only and variant not in only: return None
    cfg = VARIANTS[variant]
    logo = read("_logo.txt").strip()
    head = read("_head_top.html").replace(
        "<title>Daily Grades · Service</title>",
        "<title>" + cfg["title"] + "</title>")
    a = read("_scriptA.js").replace("__LOGO__", logo)
    b = read("_scriptB.js")
    for old, new in (
        ('const VARIANT = "10T";',   'const VARIANT = "%s";' % variant),
        ('const SLOT_COUNT = 10;',   'const SLOT_COUNT = %d;' % cfg["slots"]),
        ('const HAS_EXAM = true;',   'const HAS_EXAM = %s;' % ("true" if cfg["exam"] else "false")),
    ):
        if old not in b:
            sys.exit("Platzhalter fehlt in _scriptB.js: " + old)
        b = b.replace(old, new)
    html = head + a + read("_chips.js") + "\n" + b + read("_footer.html")
    p = OUT / cfg["file"]
    p.write_text(html, encoding="utf-8")
    print("%-6s %-42s %7.1f kB" % (variant, cfg["file"], len(html.encode())/1024))
    return p

if __name__ == "__main__":
    only = sys.argv[1:] or None
    for v in VARIANTS: build(v, only)
