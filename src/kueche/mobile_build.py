# -*- coding: utf-8 -*-
import io, pathlib
SRC = pathlib.Path(__file__).parent
OUT = SRC.parent / "dist"; OUT.mkdir(exist_ok=True)
head = io.open(SRC/"_mobile_head.html", encoding="utf-8").read()
icon = io.open(SRC/"_icon.txt", encoding="utf-8").read().strip()
a    = io.open(SRC/"_scriptA.js", encoding="utf-8").read()
# _scriptA.js ist ein Fragment und beginnt mit den Script-Tags der Laptop-Datei.
# Die mobile App braucht kein SheetJS, darum nur den JS-Teil uebernehmen.
a    = a[a.index('"use strict"'):] if '"use strict"' in a[:400] else a
chips= io.open(SRC/"_chips.js", encoding="utf-8").read()
app  = io.open(SRC/"_mobile.js", encoding="utf-8").read()

VARIANTS = [
  ("Kuechenrapport_Mobil.html",                "10T", "Küchenrapport Mobil · 10 Tage"),
  ("Kuechenrapport_Mobil_4Tage_Exam.html",     "4T",  "Küchenrapport Mobil · 4 Tage + Exam"),
  ("Kuechenrapport_Mobil_5Tage_ohneExam.html", "5T",  "Küchenrapport Mobil · 5 Tage"),
]
for name, var, title in VARIANTS:
    js = app.replace('const MVARIANT = "10T";', 'const MVARIANT = "%s";' % var, 1)
    hd = head.replace("__ICON__", icon).replace(
        "<title>Küchenrapport Mobil</title>", "<title>%s</title>" % title)
    html = hd + "\n" + a + "\n" + chips + "\n" + js + "\n</script>\n</body>\n</html>\n"
    (OUT / name).write_text(html, encoding="utf-8")
    print("%-42s VARIANT=%-4s %d Bytes" % (name, var, len(html.encode("utf-8"))))

