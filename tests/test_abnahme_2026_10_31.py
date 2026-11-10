# -*- coding: utf-8 -*-
"""Daily Grades: Befunde der unabhaengigen Abnahme vom 31.10.2026.
1 Notenzentrale: Kueche 5T + 4T ohne Zyklusangabe = ein Einsatz
2 Cockpit: Plan ohne Tagesplan bekommt trotzdem Einsatzdaten
3 Tablet: Sicherung aus dem anderen Bereich wird abgelehnt
4 Notenzentrale: alter Baustein «Verspaetet» zaehlt als Verspaetung
5 Laptop: bewertende Person pro Wochentag laut Plan (geteiltes Geraet)
6 mein.html: zwei gleichzeitig laufende Pakete, «1 Person»
(Wechsel Tablet/Laptop behaelt den Tag: tests/test_fixes_mobil.py, M4)"""
import pathlib, json, datetime, tempfile
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R / "docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-78s %s" % (n, str(i)[:150]))
REC = lambda att="present", obs=(): {"att": att, "obs": list(obs), "note": None}
STUD = {"id": "p77", "nr": "77", "name": "Muster Max", "last": "Muster", "first": "Max", "nachname": "Muster", "vorname": "Max", "nick": "", "mail": "m@x.ch", "lang": "de", "klasse": "HFD", "gruppe": "Gruppe 1"}
def rapport(app, variant, outlet, teacher, dates, days, saved):
    return {"app": app, "variant": variant, "source": "mobil", "savedAt": saved, "meta": {"outlet": outlet, "teacher": teacher},
            "settings": {"outlet": outlet, "teacher": teacher, "weekdays": ["mo", "tu", "we", "th"], "startIdx": 0, "slotDates": dates},
            "students": [dict(STUD)], "days": {k: {"p77": v} for k, v in days.items()}, "dayMeta": {}}

with sync_playwright() as p:
    b = p.chromium.launch()
    def ctx(**kw):
        c = b.new_context(**kw); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort()); return c
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="dg_abn_"))
    # ---------- 1 und 4: Notenzentrale ----------
    r5 = rapport("Kuechenrapport", "5T", "Umami", "Koch U", ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-19"],
                 {"d01": REC(obs=["hyg-p1", "hyg-p2", "hyg-p3"]), "d02": REC(), "d03": REC(obs=["tea-n1"]), "d04": REC(), "d05": REC()}, "2026-10-19T18:00:00Z")
    r4 = rapport("Kuechenrapport", "4T", "Campigiana", "Koch C", ["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-26", "2026-10-27"],
                 {"d01": REC(), "d02": REC("late"), "d03": REC(), "d04": REC(), "d05": REC(obs=["fac-p1"])}, "2026-10-27T18:00:00Z")
    (tmp / "r5.json").write_text(json.dumps(r5), encoding="utf-8"); (tmp / "r4.json").write_text(json.dumps(r4), encoding="utf-8")
    c = ctx(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D / "notenzentrale.html").as_uri()); pg.wait_for_timeout(200); pg.evaluate("()=>{ window.NZ_TODAY = '2026-10-30'; }")
    pg.set_input_files("#fileIn", [str(tmp / "r5.json"), str(tmp / "r4.json")]); pg.wait_for_timeout(400)
    e = pg.evaluate("()=>NZ.EINS.map(e=>({cycle:e.cycle, parts:e.parts.length, expected:e.expected, done:e.done, praxis:e.praxis, exam:e.exam, final:e.final, late:e.abs.v}))")
    ok("1 Notenzentrale: 5T + 4T ohne Zyklus = ein Einsatz (9 Tage, Exam, Schlussnote)", len(e) == 1 and e[0]["parts"] == 2 and e[0]["expected"] == 9 and e[0]["done"] and e[0]["final"] is not None, e)
    ok("4 Notenzentrale: alter Baustein «Verspaetet» und Knopf zusammen 2 Verspaetungen", len(e) == 1 and e[0]["late"] == 2, e)
    ab = pg.evaluate("()=>NZ.absExportRows().map(r=>r['Art'])")
    ok("4 Absenzen: alter Baustein als «verspaetet (alter Baustein)» gelistet", "verspätet (alter Baustein)" in ab and "verspätet" in ab, ab)
    ok("Notenzentrale: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------- 2: Cockpit, Plan ohne Tagesplan ----------
    plan = json.loads((R / "testdaten" / "turnusplan_BEISPIEL.json").read_text(encoding="utf-8"))
    c = ctx(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D / "cockpit.html").as_uri()); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    pk = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")
    full = [x for x in pk if x["settings"].get("slotDates") and all(x["settings"]["slotDates"])]
    ok("2 Cockpit: Beispielplan ohne Tagesplan, alle Pakete mit Einsatzdaten", len(full) == len(pk) and len(pk) > 0, [(x["meta"]["paketId"], x["settings"].get("slotDates")) for x in pk if x not in full][:2])
    svc = [x for x in pk if x["app"] == "Servicerapport"][0]; kue = [x for x in pk if x["app"] == "Kuechenrapport"][0]
    ok("Cockpit: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------- 3: Tablet lehnt Datei aus dem anderen Bereich ab ----------
    for app, own, foreign in (("kueche/Kuechenrapport_Mobil.html", kue, svc), ("service/Servicerapport_Mobil.html", svc, kue)):
        if own["variant"] != "10T": app = app.replace("_Mobil.html", "_Mobil_" + {"4T": "4Tage_Exam", "5T": "5Tage_ohneExam"}[own["variant"]] + ".html")
        c = ctx(viewport={"width": 820, "height": 1180}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D / app).as_uri()); pg.wait_for_timeout(300)
        r = pg.evaluate("""async (a)=>{ const ld = o => onLoadBackup({target:{files:[new File([JSON.stringify(o)], 'x.json')], value:''}});
            const r1 = await ld(a[0]); const n1 = S.students.length; const r2 = await ld(a[1]);
            return [r1, r2, S.students.length === n1, document.getElementById('toast').textContent]; }""", [own, foreign])
        ok("3 Tablet %s: eigene Datei geladen, fremde abgelehnt, nichts geaendert" % app.split("/")[0], r[0] is True and r[1] is False and r[2], r)
        ok("3 Tablet %s: keine JavaScript-Fehler" % app.split("/")[0], not errs, errs); c.close()

    # ---------- 5: Laptop, bewertende Person laut Wochentagsplan ----------
    pkg = json.loads(json.dumps(svc)); pkg["settings"]["teacherPlan"] = {"mo": "Person A", "tu": "Person A", "we": "Person B", "th": "Person B"}
    pkg["settings"]["teacher"] = "Person A / Person B"
    app = "service/Servicerapport.html" if pkg["variant"] == "10T" else "service/Servicerapport_" + {"4T": "4Tage_Exam", "5T": "5Tage_ohneExam"}[pkg["variant"]] + ".html"
    c = ctx(viewport={"width": 1366, "height": 900}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D / app).as_uri()); pg.wait_for_timeout(300)
    r = pg.evaluate("""async (o)=>{ await onRestore({target:{files:[new File([JSON.stringify(o)], 'p.json')], value:''}});
        const out = {}; slots().slice(0, 4).forEach(s => { openSlot(s.id); out[s.wd] = S.dayMeta[s.id].teacher; }); return out; }""", pkg)
    exp = {wd: pkg["settings"]["teacherPlan"][wd] for wd in r}
    ok("5 Laptop Service: bewertende Person pro Wochentag laut Plan", r == exp, r)
    ok("5 Laptop: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------- 6: mein.html, zwei laufende Pakete, Einzahl ----------
    td = datetime.date.today(); iso = lambda d: d.isoformat()
    def pak(i, persons, variant):
        o = json.loads(json.dumps(kue)); o["variant"] = variant
        return {"id": "P%d" % i, "titel": "Paket %d" % i, "bereich": "kueche", "variante": variant, "von": iso(td - datetime.timedelta(days=1)),
                "bis": iso(td + datetime.timedelta(days=3)), "personen": persons, "mobil": "kueche/Kuechenrapport_Mobil.html",
                "laptop": "kueche/Kuechenrapport.html", "start": "", "paket": o}
    sem = {"format": "praxisrapport-semesterpaket", "version": 1, "semester": "HS26", "dozent": {"name": "Koch", "sprache": "de"},
           "pakete": [pak(1, 1, "10T"), pak(2, 6, "10T")]}
    c = ctx(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D / "mein.html").as_uri()); pg.wait_for_timeout(200)
    pg.set_input_files("#file", files=[{"name": "S.json", "mimeType": "application/json", "buffer": json.dumps(sem).encode()}]); pg.wait_for_timeout(400)
    r = pg.evaluate("()=>[document.querySelectorAll('.card.now').length, document.body.innerText.includes('1 Person ') || document.body.innerText.includes('1 Person\\n'), document.body.innerText.includes('1 Personen')]")
    ok("6 mein.html: beide laufenden Pakete als «Jetzt», «1 Person» in der Einzahl", r[0] == 2 and not r[2], r)
    ok("6 mein.html: keine JavaScript-Fehler", not errs, errs); c.close()
    b.close()

out = R / "tests" / "Testprotokoll_Abnahme_2026-10-31.txt"
txt = "Testprotokoll Daily Grades: Befunde der Abnahme 31.10.2026\n" + "\n".join(res) + "\n\n%d von %d Pruefungen bestanden\n" % (
    sum(1 for r in res if r.startswith("OK")), len(res))
out.write_text(txt, encoding="utf-8"); print(txt)
