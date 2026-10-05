# -*- coding: utf-8 -*-
"""Halbturnus: 5T (Tage 1-5) und 4T+Exam (Tage 6-9 + Exam) werden in der 10T-Datei zusammengefuehrt."""
import pathlib, json
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent
LIST = (R/"testdaten/Testklasse_ANONYM.txt").read_text(encoding="utf-8")
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-62s %s" % (n, str(i)[:120]))
APPS = {"Kueche": "Kuechenrapport", "Service": "Servicerapport"}
FILL = """() => { const sl = slots(); S.students.forEach((s,k) => sl.forEach(x => {
    S.days[x.id] = S.days[x.id] || {}; S.days[x.id][s.id] = {att:'present', obs:[], note:null}; }));
    return JSON.stringify(snapshot()); }"""
APPLY = """() => {const ta=document.querySelector('#fStud');const b=[...document.querySelectorAll('button.pri')]
    .find(b=>ta.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);b.click();}"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for lab, base in APPS.items():
        snaps = {}; errs = []
        for var, fn in (("5T", base + "_5Tage_ohneExam.html"), ("4T", base + "_4Tage_Exam.html")):
            c = b.new_context(); pg = c.new_page(); pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto((R/"src/dist"/fn).as_uri()); pg.wait_for_timeout(300)
            pg.evaluate("()=>{view='set';render();}"); pg.fill("#fStud", LIST); pg.evaluate(APPLY)
            snaps[var] = pg.evaluate(FILL)
            ok(lab + " " + var + ": Datei traegt die Variante", json.loads(snaps[var]).get("variant") == var, json.loads(snaps[var]).get("variant"))
            c.close()
        c = b.new_context(); pg = c.new_page(); pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((R/"src/dist"/(base + ".html")).as_uri()); pg.wait_for_timeout(300)
        pg.evaluate("()=>{S.students=[];S.days={};}")
        r = pg.evaluate("""async (sn) => { const fs = sn.map((t,i) => new File([t], 'h'+i+'.json'));
            await onMerge({target:{files:fs, value:''}});
            const ex = slots().find(s => s.exam);
            const filled = Object.keys(S.days).filter(k => Object.keys(S.days[k]).length).sort();
            return {n:S.students.length, filled, exam: ex && ex.id}; }""", [snaps["5T"], snaps["4T"]])
        ok(lab + ": beide Halbturnus-Dateien zusammengefuehrt, 30 Personen", r["n"] == 30, r["n"])
        ok(lab + ": alle 10 Einsatztage belegt (5T = 1-5, 4T = 6-9, Exam = 10)", len(r["filled"]) == 10, r["filled"])
        ok(lab + ": Exam Day liegt auf Tag 10", r["exam"] in r["filled"], r["exam"])
        ok(lab + ": keine JavaScript-Fehler", not errs, errs)
        c.close()
    b.close()
print("\n".join(res)); n = sum(x.startswith("OK") for x in res); print(n, "von", len(res))
(R/"tests"/"Testprotokoll_Halbturnus.txt").write_text("PRUEFUNG HALBTURNUS 05.10.2026\n\n" + "\n".join(res) + "\n", encoding="utf-8")
