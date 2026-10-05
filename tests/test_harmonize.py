# -*- coding: utf-8 -*-
"""Pruefungen nach der Harmonisierung vom 05.10.2026 (Kueche und Service, Laptop und Mobil)."""
import pathlib, sys, json
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).parent.parent
KTXT = (R / "testdaten/Testklasse_ANONYM.txt").read_text(encoding="utf-8")
EXTRA = "Muster; Max; ; max.muster@beispiel.ch; de; HFe 2; team 2\nNeu; Nina; Nini; nina.neu@beispiel.ch; en; HFE1\nAlt; Anna; anna.alt@beispiel.ch; en; HFE\nOhne; Otto"
LIST = KTXT.strip() + "\n" + EXTRA
FILES = [
  ("Kueche Laptop",  R/"src/dist/Kuechenrapport.html",         "browser", "kueche"),
  ("Kueche Laptop 4T", R/"src/dist/Kuechenrapport_4Tage_Exam.html", "browser", "kueche"),
  ("Kueche Mobil",   R/"src/dist/Kuechenrapport_Mobil.html",   "mobil",   "kueche"),
  ("Kueche Mobil 5T", R/"src/dist/Kuechenrapport_Mobil_5Tage_ohneExam.html", "mobil", "kueche"),
  ("Service Laptop", R/"src/dist/Servicerapport.html",          "browser", "service"),
  ("Service Mobil",  R/"src/dist/Servicerapport_Mobil.html",    "mobil",   "service"),
]
res = []
def ok(name, cond, info=""):
    res.append(("OK    " if cond else "FEHLER") + "  %-58s %s" % (name, str(info)[:110]))

# Zugriff auf die Felder: Kueche heisst last/first, Service nachname/vorname
JS_STUD = """() => S.students.map(s => [s.last||s.nachname||"", s.first||s.vorname||"", s.nick||"", s.mail||"", s.lang||"", s.klasse||"", s.gruppe||""])"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for label, path, kind, app in FILES:
        ctx = b.new_context(viewport={"width":390,"height":844} if kind=="mobil" else {"width":1400,"height":900})
        pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(path.as_uri()); pg.wait_for_timeout(400)
        # Namensliste ueber die Oberflaeche einfuegen
        pg.evaluate("() => { view = 'set'; render(); }")
        ta = "#fStud" if kind=="browser" else "#mStud"
        pg.fill(ta, LIST)
        pg.locator(ta).locator("xpath=ancestor::*[self::div][1]/following-sibling::*").first  # nur zur Sicherheit
        # Knopf "Uebernehmen": erster Primaerknopf nach dem Textfeld
        pg.evaluate("""(sel) => { const ta = document.querySelector(sel);
            let n = ta; while(n && !n.querySelector?.('button.pri')) n = n.parentElement;
            const btns = [...document.querySelectorAll('button.pri')];
            const after = btns.find(b => ta.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
            after.click(); }""", ta)
        pg.wait_for_timeout(200)
        st = pg.evaluate(JS_STUD)
        byLast = {s[0]: s for s in st}
        ok(label+": alle 34 Personen gelesen", len(st) == 34, len(st))
        ok(label+": HFE1 bleibt erhalten", byLast.get("Neu", [""]*7)[5] == "HFE1", byLast.get("Neu"))
        ok(label+": 'HFe 2' und 'team 2' werden HFE2 / Team 2", byLast.get("Muster",[""]*7)[5:7] == ["HFE2","Team 2"], byLast.get("Muster"))
        ok(label+": ohne Nickname landet Klasse nicht im Nickname", byLast.get("Muster",[""]*7)[2] == "", byLast.get("Muster"))
        ok(label+": altes HFE bleibt lesbar", byLast.get("Alt",[""]*7)[5] == "HFE", byLast.get("Alt"))
        ok(label+": Nur Name ohne weitere Felder", byLast.get("Ohne",[""]*7)[:2] == ["Ohne","Otto"], byLast.get("Ohne"))
        ok(label+": Mehrteiliger Nachname 'van der Berg'", "van der Berg" in byLast, "")
        ok(label+": Nickname 'Ethan' bei Chen", byLast.get("Chen",[""]*7)[2] == "Ethan", byLast.get("Chen"))
        # Zurueckschreiben und erneut einlesen aendert nichts
        txt = pg.input_value(ta) if pg.locator(ta).count() else ""
        pg.evaluate("() => { view = 'set'; render(); }")
        txt = pg.input_value(ta)
        ok(label+": Liste wird mit 7 Feldern zurueckgeschrieben", any(l.replace("; ;",";").replace(";  ;",";") .startswith("Muster; Max") and "max.muster@beispiel.ch; de; HFE2; Team 2" in l for l in txt.split("\n")), [l for l in txt.split("\n") if l.startswith("Muster")])
        # Absenzmeldung: Klasse und Gruppe pro Person
        line = pg.evaluate("""() => {
            const sl = (typeof slots === 'function') ? slots()[0].id : null;
            const s = S.students.find(x => (x.last||x.nachname) === 'Chen');
            S.days[sl] = S.days[sl] || {}; S.days[sl][s.id] = Object.assign(S.days[sl][s.id]||{}, {att:'late', obs:[]});
            const s2 = S.students.find(x => (x.last||x.nachname) === 'Ammann');
            S.days[sl][s2.id] = Object.assign(S.days[sl][s2.id]||{}, {att:'unexcused', obs:[]});
            if (typeof absenceLine === 'function') return absenceList(sl).map(absenceLine);
            if (typeof absenceZeile !== 'function' && typeof absenceList === 'function') {
              const r = absenceList(sl); if (r.length && typeof r[0] === 'string') return r; }
            if (typeof absenceZeile === 'function') return absenceList(sl).map(absenceZeile);
            if (typeof absenceLines === 'function') return absenceLines(sl);
            return 'keine Funktion';
        }""")
        if isinstance(line, str):
            # mobile: Funktionsname suchen
            line = pg.evaluate("""() => { const names = Object.getOwnPropertyNames(window); return names.filter(n=>/absen/i.test(n)); }""")
        txtl = json.dumps(line, ensure_ascii=False)
        ok(label+": Meldezeile mit Nickname in «»", "«Ethan»" in txtl, txtl)
        ok(label+": Meldezeile mit Klasse/Gruppe der Person", "HFE1 · Gruppe 1" in txtl, txtl)
        # Mobile: Auswahlfeld "Turnus startet am"
        if kind == "mobil":
            pg.evaluate("() => { S.settings.startIdx = 1; view = 'set'; render(); }")
            v = pg.evaluate("() => { const s = document.getElementById('mStart'); return s ? [s.value, s.selectedIndex] : null; }")
            ok(label+": 'Turnus startet am' zeigt die Auswahl (Dienstag)", v and v[0] == "1", v)
            pg.evaluate("() => { S.settings.startIdx = 0; render(); }")
            v = pg.evaluate("() => document.getElementById('mStart').value")
            ok(label+": 'Turnus startet am' zeigt Montag", v == "0", v)
        # Selbsttest Service
        if app == "service" and kind == "browser":
            st_res = pg.evaluate("() => selfTest()")
            bad = [x for x in st_res if not x["ok"]]
            ok(label+": eingebauter Selbsttest", not bad, bad or "%d Pruefungen" % len(st_res))
        ok(label+": keine JavaScript-Fehler", not errs, errs)
        ctx.close()
    b.close()

out = "\n".join(res)
n_ok = sum(1 for r in res if r.startswith("OK"))
out += "\n\n%d von %d bestanden.\n" % (n_ok, len(res))
print(out)
(R / "tests" / "Testprotokoll_Harmonisierung.txt").write_text("PRUEFUNG HARMONISIERUNG 05.10.2026\n\n" + out, encoding="utf-8")
sys.exit(0 if n_ok == len(res) else 1)
