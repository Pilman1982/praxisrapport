# -*- coding: utf-8 -*-
"""Uebertraegt src/_handoff.js in die Laptop-Skripte und den Mobil-Zusatz (wird von build.py aufgerufen)."""
import pathlib, re
R = pathlib.Path(__file__).parent.parent / "src"
H = (R / "_handoff.js").read_text(encoding="utf-8").strip("\n")
START = "/* ---- Noten 2.0: Übergabe von der persönlichen Startseite (mein.html) ----"
for f in ("kueche/_scriptB.js", "service/_scriptB.js", "_noten2_mobile.js"):
    p = R / f; s = p.read_text(encoding="utf-8")
    a = s.index(START); b = s.index("\nsetTimeout(() => n2Handoff(", a)
    s2 = s[:a] + H + s[b:]
    if s2 != s: p.write_text(s2, encoding="utf-8"); print("aktualisiert", f)
