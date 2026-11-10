# -*- coding: utf-8 -*-
"""Daily Grades: Regeln vom 31.10.2026 und Notenzentrale.

Regeln: Kappung +1.50 (6.00 in jedem Kriterium erreichbar), Plus-Bausteine mindestens 0.50,
Hygiene fest doppelt (Kueche) bzw. Gastgeberhaltung und Hygiene fest doppelt (Service).

Notenzentrale: liest die JSON-Rapporte der Mobil- und Laptop-Fassung, fuehrt sie pro Paket zusammen
und muss fuer dieselben Daten exakt dieselben Noten rechnen wie die Apps (Tag, Praxis, Exam, Schlussnote).
Kueche 5T + 4T im gleichen Zyklus ergeben einen Einsatz.

Excel-Export: braucht SheetJS 0.18.5 lokal (ohne Internet im Test). Pfad ueber die Umgebungsvariable
DG_XLSX oder tests/.cache/xlsx.full.min.js (z. B. mit `npm pack xlsx@0.18.5` holen). Fehlt die Datei,
wird dieser Teil uebersprungen."""
import pathlib, json, os, tempfile
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R / "docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-78s %s" % (n, str(i)[:150]))
T = lambda d, o, c="K1", m=False: dict(datum=d, outlet=o, schicht=c, **({"market": True} if m else {}))
H1 = ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-09"]           # Kueche 5T
H2 = ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-16"]                         # Kueche 4T + Exam 17.11.
ALL9 = H1 + H2
plan = {"format": "praxisrapport-turnusplan", "version": 1, "semester": "HS26", "wochentage": ["mo", "tu", "we", "th"],
 "dozierende": [{"name": "Koch Campi", "bereich": "kueche", "outlets": ["Campigiana"], "sprache": "de"},
                {"name": "Koch Umami", "bereich": "kueche", "outlets": ["Umami"], "sprache": "th"},
                {"name": "Koch Essence", "bereich": "kueche", "outlets": ["The Essence"], "sprache": "de"},
                {"name": "Service Campi", "bereich": "service", "outlets": ["Campigiana"], "sprache": "de"}],
 "studierende": [
  {"nr": "101", "nachname": "Arnold", "vorname": "Anna", "nickname": "", "email": "a@x.ch", "klasse": "HFD", "gruppe": "Gruppe 1 Team A", "sprache": "de", "einsaetze": [
    {"bereich": "kueche", "outlet": "Campigiana", "von": H1[0], "bis": H1[-1], "variante": "5T", "block": "Zyklus 3.1", "tage": [T(d, "Campigiana") for d in H1]},
    {"bereich": "kueche", "outlet": "Umami", "von": H2[0], "bis": "2026-11-17", "variante": "4T", "block": "Zyklus 3.1", "exam": "2026-11-17", "tage": [T(d, "Umami") for d in H2]}]},
  {"nr": "105", "nachname": "Egli", "vorname": "Eva", "nickname": "Evi", "email": "e@x.ch", "klasse": "HFE1", "gruppe": "Gruppe 1 Team A", "sprache": "en", "einsaetze": [
    {"bereich": "kueche", "outlet": "Campigiana", "von": H1[0], "bis": H1[-1], "variante": "5T", "block": "Zyklus 3.1", "tage": [T(d, "Campigiana") for d in H1]},
    {"bereich": "kueche", "outlet": "Umami", "von": H2[0], "bis": "2026-11-17", "variante": "4T", "block": "Zyklus 3.1", "exam": "2026-11-17", "tage": [T(d, "Umami") for d in H2]}]},
  {"nr": "102", "nachname": "Bucher", "vorname": "Ben", "nickname": "", "email": "b@x.ch", "klasse": "HFD", "gruppe": "Gruppe 2 Team A", "sprache": "de", "einsaetze": [
    {"bereich": "kueche", "outlet": "The Essence", "von": ALL9[0], "bis": "2026-11-17", "variante": "10T", "block": "Zyklus 3.1", "exam": "2026-11-17",
     "tage": [T(d, "The Essence", "K2") for d in ALL9]}]},
  {"nr": "103", "nachname": "Caflisch", "vorname": "Carla", "nickname": "", "email": "c@x.ch", "klasse": "HFD", "gruppe": "Gruppe 2 Team B", "sprache": "de", "einsaetze": [
    {"bereich": "service", "outlet": "Campigiana", "von": ALL9[0], "bis": "2026-11-17", "variante": "10T", "block": "Zyklus 3.1", "exam": "2026-11-17",
     "tage": [T(d, "Campigiana", "S") for d in ALL9]}]}]}

# Erfassung pro Paket: Paketvariante -> {nr: {slot: rec}}
POS_K = ["hyg-p1", "hyg-p2", "hyg-p3", "pro-p1", "pro-p2", "pro-p3", "org-p1", "org-p2", "org-p3", "tea-p1", "tea-p5", "tea-p6",
         "sel-p2", "sel-p3", "sel-p5", "mot-p1", "mot-p2", "mot-p5", "fac-p1", "fac-p2", "fac-p3"]
REC = lambda att="present", obs=(), note=None: {"att": att, "obs": list(obs), "note": note}
DATA = {
 ("kueche", "5T"): {"101": {"d01": REC(obs=["hyg-p1", "hyg-p2", "hyg-p3", "tea-p5", "tea-p6", "tea-p1"]), "d02": REC("late", ["pro-p1"]), "d03": REC("tm"),
                            "d04": REC("excused"), "d05": REC(obs=["hyg-ko"], note={"txt": "Sehr gute Sauce", "crit": "fac", "dir": 1, "w": 1, "internal": False})},
                    "105": {"d01": REC(obs=["hyg-n3", "pro-n1"]), "d02": REC(), "d03": REC(obs=["sel-p5"]), "d04": REC("tml"), "d05": REC(obs=["mot-n1", "mot-n2", "mot-n3", "mot-n4"])}},
 ("kueche", "4T"): {"101": {"d01": REC("unexcused"), "d02": REC("tml"), "d03": REC(obs=POS_K), "d04": REC(), "d05": REC(obs=["fac-p1", "fac-p2"])},
                    "105": {"d01": REC(obs=["hyg-p5", "hyg-p4"]), "d02": REC(), "d03": REC("late"), "d04": REC(obs=POS_K), "d05": REC("excused")}},
 ("kueche", "10T"): {"102": {"d01": REC(obs=POS_K), "d02": REC(obs=POS_K), "d03": REC(obs=POS_K), "d04": REC(obs=POS_K), "d05": REC(obs=POS_K), "d06": REC(obs=POS_K),
                             "d07": REC(obs=POS_K), "d08": REC(obs=POS_K), "d09": REC(obs=POS_K), "d10": REC(obs=POS_K)}},
 ("service", "10T"): {"103": {"d01": REC(obs=["gas-p5", "gas-p6"]), "d02": REC(obs=["hyg-p1", "hyg-p3", "hyg-p4"]), "d03": REC(obs=["hyg-n6", "gas-n1"]),
                              "d04": REC("late", ["tea-p6", "tea-p7", "tea-p1"]), "d05": REC(obs=["gas-ko"]), "d06": REC("excused"), "d07": REC(),
                              "d08": REC(note={"txt": "Allergenfrage geklaert", "crit": "ver", "dir": -1, "w": 0.5, "internal": True}), "d09": REC("unexcused"),
                              "d10": REC(obs=["tec-p4", "tec-p1", "ver-p1"])}}}

MOBIL = {("kueche", "5T"): "kueche/Kuechenrapport_Mobil_5Tage_ohneExam.html", ("kueche", "4T"): "kueche/Kuechenrapport_Mobil_4Tage_Exam.html",
         ("kueche", "10T"): "kueche/Kuechenrapport_Mobil.html", ("service", "10T"): "service/Servicerapport_Mobil.html"}
LAPTOP = {("kueche", "5T"): "kueche/Kuechenrapport_5Tage_ohneExam.html", ("kueche", "4T"): "kueche/Kuechenrapport_4Tage_Exam.html",
          ("kueche", "10T"): "kueche/Kuechenrapport.html", ("service", "10T"): "service/Servicerapport.html"}
LOAD = """(a)=>{ const o = a[0], data = a[1]; S.settings = Object.assign(S.settings, o.settings); S.students = o.students.map(s=>Object.assign({}, s)); S.days = {}; S.dayMeta = {};
    if(typeof saubereStudierende === 'function') S.students = saubereStudierende(S.students);
    if(typeof normalizeStudents === 'function') normalizeStudents();
    slots().forEach(x=>openSlot(x.id));
    Object.keys(data).forEach(nr => { const s = S.students.find(x=>String(x.nr)===nr); Object.keys(data[nr]).forEach(d => { S.days[d][s.id] = JSON.parse(JSON.stringify(data[nr][d])); }); });
    persist(); if(typeof render === 'function') render(); return true; }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    xlsx = os.environ.get("DG_XLSX") or str(R / "tests" / ".cache" / "xlsx.full.min.js")
    def ctx(**kw):
        c = b.new_context(**kw)
        c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())          # spaeter registrierte Routen haben Vorrang
        if os.path.exists(xlsx): c.route("https://cdnjs.cloudflare.com/ajax/libs/xlsx/**", lambda r: r.fulfill(path=xlsx, content_type="application/javascript"))
        return c
    # ---------- Pakete aus dem Cockpit ----------
    c = ctx(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D / "cockpit.html").as_uri()); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    PK = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")
    ok("Cockpit: 4 Pakete (Kueche 5T, 4T, 10T, Service 10T)", sorted((x["app"], x["variant"]) for x in PK) == sorted([("Kuechenrapport", "5T"), ("Kuechenrapport", "4T"), ("Kuechenrapport", "10T"), ("Servicerapport", "10T")]),
       [(x["app"], x["variant"]) for x in PK])
    ok("Cockpit: Paket traegt Zyklus und Semester in den Einstellungen", all(x["settings"].get("block") == "Zyklus 3.1" and x["settings"].get("semester") == "HS26" for x in PK),
       [(x["settings"].get("block"), x["settings"].get("semester")) for x in PK])
    ok("Cockpit: keine JavaScript-Fehler", not errs, errs); c.close()
    area = lambda o: "kueche" if o["app"] == "Kuechenrapport" else "service"

    # ---------- Erfassen in der Mobil-Fassung, Noten der App, Rapport-JSON ----------
    REP, APPN = {}, {}
    for o in PK:
        key = (area(o), o["variant"])
        c = ctx(viewport={"width": 820, "height": 1180}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D / MOBIL[key]).as_uri()); pg.wait_for_timeout(300)
        pg.evaluate(LOAD, [o, DATA[key]])
        APPN[key] = pg.evaluate("""()=>{ const out = {}; S.students.forEach(s => { out[s.nr] = {days: slots().map(x=>n2Day(x.id, s.id)), praxis: n2Praxis(s.id).avg,
            exam: (typeof n2Exam === 'function') ? n2Exam(s.id) : null, final: n2Final(s.id), crit: slots().map(x=>n2Crit(x.id, s.id))}; }); return out; }""")
        REP[key] = pg.evaluate("()=>snapshot()")
        ok("Mobil %s %s: keine JavaScript-Fehler" % key, not errs, errs); c.close()

    # ---------- Regeln 31.10.2026 in der App ----------
    a5 = APPN[("kueche", "5T")]["101"]
    ok("Regel: drei Plus Hygiene = 6.00, drei Plus Team = 6.00 (Kueche)", a5["crit"][0]["hyg"] == 6 and a5["crit"][0]["tea"] == 6, a5["crit"][0])
    ok("Regel: Kueche Tag 1 = (2*6 + 6 + 5*4.5)/8 = 5.0625 (Hygiene doppelt)", abs(a5["days"][0] - (2 * 6 + 6 + 5 * 4.5) / 8) < 1e-9, a5["days"][0])
    ok("Regel: verspaetet + ein Plus = 4.00 im Kriterium, sonst 3.50", a5["crit"][1]["pro"] == 4 and a5["crit"][1]["hyg"] == 3.5, a5["crit"][1])
    a4 = APPN[("kueche", "4T")]["101"]
    ok("Regel: alle Kriterien mit drei Plus = Tagesnote 6.00", a4["days"][2] == 6, a4["days"][2])
    b10 = APPN[("kueche", "10T")]["102"]
    ok("Regel: Bestnote erreichbar: Praxis 6.00, Exam 6.00, Schlussnote 6.0", b10["praxis"] == 6 and b10["exam"] == 6 and round(b10["final"], 1) == 6.0, (b10["praxis"], b10["exam"], b10["final"]))
    s10 = APPN[("service", "10T")]["103"]
    ok("Regel Service: 1.00 + 0.50 Gastgeberhaltung = 6.00, Tag = (2*6 + 8*4.5)/11", s10["crit"][0]["gas"] == 6 and abs(s10["days"][0] - (2 * 6 + 2 * 4.5 + 7 * 4.5) / 11) < 1e-9, s10["days"][0])
    ok("Regel Service: Hygiene doppelt (Tag 2 = (2*6 + 2*4.5 + 7*4.5)/11)", abs(s10["days"][1] - (2 * 6 + 2 * 4.5 + 7 * 4.5) / 11) < 1e-9, s10["days"][1])
    ok("Regel Service: verspaetet, drei Plus Team = 5.00 (Deckel ab 3.50)", s10["crit"][3]["tea"] == 5 and s10["crit"][3]["gas"] == 3.5, s10["crit"][3])

    # ---------- Laptop rechnet gleich wie Mobil ----------
    for key, o in ((k, v) for k, v in REP.items()):
        c = ctx(viewport={"width": 1366, "height": 900}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D / LAPTOP[key]).as_uri()); pg.wait_for_timeout(300)
        pk = [x for x in PK if (area(x), x["variant"]) == key][0]
        pg.evaluate(LOAD, [pk, DATA[key]])
        lap = pg.evaluate("""()=>{ const out = {}; S.students.forEach(s => { const su = summary(s.id, 'all'), ex = (typeof examSummary === 'function') ? examSummary(s.id) : null;
            out[s.nr] = {days: slots().map(x=>dayTotal(x.id, s.id)), praxis: su.total, exam: ex ? ex.total : null}; }); return out; }""")
        same = all(all((x is None and y is None) or (x is not None and y is not None and abs(x - y) < 1e-9) for x, y in zip(lap[nr]["days"], APPN[key][nr]["days"]))
                   and abs((lap[nr]["praxis"] or 0) - (APPN[key][nr]["praxis"] or 0)) < 1e-9 for nr in lap)
        ok("Laptop %s %s: gleiche Tages- und Praxisnoten wie Mobil" % key, same, [lap, {k: (v["days"], v["praxis"]) for k, v in APPN[key].items()}])
        hy = pg.evaluate("()=>{ view = 'set'; render(); const h = document.getElementById('fHyg'); return h ? [h.checked, h.disabled] : null; }")
        ok("Laptop %s %s: Doppelgewichtung fest (Haken gesetzt und gesperrt)" % key, hy == [True, True], hy)
        ok("Laptop %s %s: keine JavaScript-Fehler" % key, not errs, errs); c.close()

    # ---------- Notenzentrale ----------
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="nz_"))
    files = []
    for i, (key, o) in enumerate(REP.items()):
        o = json.loads(json.dumps(o)); o["savedAt"] = "2026-11-17T18:0%d:00.000Z" % i
        f = tmp / ("Rapport_%s_%s.json" % key); f.write_text(json.dumps(o), encoding="utf-8"); files.append(f)
    # aeltere Datei des Service-Pakets: Tag 1 anders erfasst, Tag 2 fehlt -> neuere Datei gewinnt
    old = json.loads(json.dumps(REP[("service", "10T")])); old["savedAt"] = "2026-11-03T10:00:00.000Z"
    sid = [s["id"] for s in old["students"] if s["nr"] == "103"][0]
    old["days"] = {"d01": {sid: REC(obs=["gas-n1"])}, "d07": {sid: REC(obs=["mep-n1"])}}     # d07 ist in der neueren Datei leer
    (tmp / "Service_alt.json").write_text(json.dumps(old), encoding="utf-8"); files.append(tmp / "Service_alt.json")
    # Kopie mit gleichem Inhalt, Semesterpaket, kaputte Datei
    (tmp / "Kopie.json").write_text(files[0].read_text(encoding="utf-8"), encoding="utf-8"); files.append(tmp / "Kopie.json")
    (tmp / "Semesterpaket_X.json").write_text(json.dumps({"format": "praxisrapport-semesterpaket", "pakete": []}), encoding="utf-8"); files.append(tmp / "Semesterpaket_X.json")
    (tmp / "kaputt.json").write_text("{nicht json", encoding="utf-8"); files.append(tmp / "kaputt.json")

    c = ctx(viewport={"width": 1366, "height": 900}, accept_downloads=True); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D / "notenzentrale.html").as_uri()); pg.wait_for_timeout(300)
    pg.evaluate("()=>{ window.NZ_TODAY = '2026-11-18'; }")
    pg.set_input_files("#fileIn", [str(f) for f in files]); pg.wait_for_timeout(500)
    st = pg.evaluate("()=>({pk: NZ.PKGS.length, ein: NZ.EINS.length, raw: NZ.RAW.map(r=>[r.name, r.kind]), sem: NZ.F.sem})")
    ok("Notenzentrale: 4 Pakete, 4 Einsaetze (Anna und Eva je 5T + 4T als einer)", st["pk"] == 4 and st["ein"] == 4, st)
    kinds = dict(st["raw"])
    ok("Notenzentrale: Kopie, Semesterpaket und kaputte Datei erkannt", kinds.get("Kopie.json") == "ignoriert" and kinds.get("Semesterpaket_X.json") == "ignoriert" and kinds.get("kaputt.json") == "fehler", kinds)
    ok("Notenzentrale: Semester HS26 vorgewaehlt", st["sem"] == "HS26", st["sem"])
    NZ = pg.evaluate("""()=>NZ.EINS.map(e=>({nr: e.person.nr, area: e.area, cycle: e.cycle, praxis: e.praxis, exam: e.exam, final: e.final, done: e.done,
        counted: e.counted, expected: e.expected, days: e.days.map(d=>[d.p.variant, d.sl.id, d.total])}))""")
    by = {(x["nr"], x["area"]): x for x in NZ}
    # Anna: 5T + 4T zusammen
    for nr in ("101", "105"):
        days = [v for v in APPN[("kueche", "5T")][nr]["days"]] + [v for v in APPN[("kueche", "4T")][nr]["days"][:4]]
        cnt = [v for v in days if v is not None]
        pr = sum(cnt) / len(cnt); ex = APPN[("kueche", "4T")][nr]["exam"]
        e = by[(nr, "kueche")]
        ok("Notenzentrale %s: Praxis = Ø aller 9 Tage aus 5T und 4T" % nr, abs(e["praxis"] - pr) < 1e-9, (e["praxis"], pr))
        ok("Notenzentrale %s: Exam aus dem 4T-Paket, Schlussnote 2/3 + 1/3" % nr, abs(e["exam"] - ex) < 1e-9 and abs(e["final"] - (2 * pr + ex) / 3) < 1e-9 and e["done"], (e["exam"], e["final"], e["done"]))
        ok("Notenzentrale %s: Zyklus 3.1, 9 Tage erwartet" % nr, e["cycle"] == "Zyklus 3.1" and e["expected"] == 9, (e["cycle"], e["expected"]))
    for nr, key in (("102", ("kueche", "10T")), ("103", ("service", "10T"))):
        e = by[(nr, key[0])]; a = APPN[key][nr]
        ok("Notenzentrale %s: Praxis, Exam und Schlussnote identisch zur App" % nr,
           abs(e["praxis"] - a["praxis"]) < 1e-9 and abs(e["exam"] - a["exam"]) < 1e-9 and abs(e["final"] - a["final"]) < 1e-9, (e["praxis"], e["exam"], e["final"], a["praxis"], a["exam"], a["final"]))
        nzd = [d[2] for d in sorted(e["days"], key=lambda d: d[1])]
        apd = [v for v in a["days"]]
        ok("Notenzentrale %s: jede Tagesnote identisch zur App" % nr, all((x is None and y is None) or (x is not None and y is not None and abs(x - y) < 1e-9) for x, y in zip(nzd, apd)), (nzd, apd))
    iss = pg.evaluate("()=>NZ.ISSUES.map(i=>[i.lv, i.text])")
    ok("Kontrolle: unentschuldigt gemeldet (Anna 4T Tag 1, Carla Tag 9)", sum(1 for lv, t in iss if "unentschuldigt am" in t) == 2, [t for lv, t in iss if "unentschuldigt" in t])
    ok("Kontrolle: Exam entschuldigt = 1.00 als Hinweis (Eva)", any("Egli Eva" in t and "Exam Day entschuldigt" in t for lv, t in iss), iss)
    ok("Kontrolle: aeltere Datei ohne eigene Eintraege erzeugt keinen Hinweis", not any("nur in älteren" in t for lv, t in iss), [t for lv, t in iss if "älteren" in t])
    # Tag 1 Carla: aeltere Datei hatte gas-n1, neuere gas-p5 + gas-p6 -> 6.00 in Gastgeberhaltung
    ok("Kontrolle: in der neueren Datei leer ueberschriebene Beobachtung wird gemeldet (Carla 11.11.)", any(lv == "warn" and "Caflisch Carla" in t and "leer überschrieben" in t and "11.11." in t for lv, t in iss), [t for lv, t in iss if "leer" in t])
    g1 = pg.evaluate("()=>{ const e = NZ.EINS.find(x=>x.person.nr==='103'); const d = e.days.find(x=>x.sl.id==='d01'); return d.g.gas; }")
    ok("Notenzentrale: neuere Datei gewinnt (Tag 1 Gastgeberhaltung 6.00)", g1 == 6, g1)
    # Ansichten ohne Fehler
    for tab in ("ov", "pk", "ps", "ab", "ko", "fi"):
        pg.evaluate("(t)=>NZ.setTab(t)", tab); pg.wait_for_timeout(80)
    txt = pg.evaluate("()=>{ NZ.setTab('ov'); return document.getElementById('view').textContent; }")
    ok("Uebersicht: Schlussnote Ben 6.0 und Zyklus-Spalte sichtbar", "6.0" in txt and "Zyklus 3.1" in txt, txt[:200])
    pg.evaluate("()=>NZ.setTab('ps')"); pg.wait_for_timeout(80)
    ptxt = pg.evaluate("()=>document.getElementById('view').innerText")
    ok("Person: Beobachtungen im Wortlaut und Notiz sichtbar", "Uniform" in ptxt or "Arbeitsplatz" in ptxt or "Sauce" in ptxt, ptxt[:300])
    # Filter Bereich Service
    pg.select_option("#fArea", "service"); pg.wait_for_timeout(80)
    fr = pg.evaluate("()=>NZ.finalRows().map(r=>r['N°'])")
    ok("Filter Bereich: nur Service im Export", fr == ["103"], fr)
    pg.select_option("#fArea", ""); pg.wait_for_timeout(80)
    rows = pg.evaluate("()=>NZ.finalRows()")
    an = [r for r in rows if r["N°"] == "101"][0]
    ok("Export Schlussnoten: gerundet auf 0.1, Teilnoten 5T und 4T", an["Schlussnote gerundet"] == round(an["Schlussnote exakt"] + 1e-9, 1) and an["Ø 5 Tage"] is not None and an["Ø 4 Tage"] is not None, an)
    with pg.expect_download() as dl: pg.click("#btnCsv")
    csv = pathlib.Path(dl.value.path()).read_text(encoding="utf-8-sig")
    ok("CSV: Kopfzeile und 4 Zeilen, Semikolon", csv.splitlines()[0].startswith("Nachname;Vorname") and len(csv.strip().splitlines()) == 5, csv.splitlines()[0][:80])
    if os.path.exists(xlsx):
        with pg.expect_download() as dl: pg.click("#btnXlsx")
        xp = dl.value.path()
        wbinfo = pg.evaluate("""(b64)=>{ const wb = XLSX.read(b64, {type:'base64'}); const s = wb.Sheets['Schlussnoten']; const rows = XLSX.utils.sheet_to_json(s);
            return [wb.SheetNames, rows.length, rows.map(r=>r['Schlussnote gerundet'])]; }""", __import__("base64").b64encode(pathlib.Path(xp).read_bytes()).decode())
        ok("Excel: fuenf Blaetter, 4 Schlussnoten", wbinfo[0] == ["Schlussnoten", "Pakete", "Tagesnoten Küche", "Tagesnoten Service", "Absenzen"] and wbinfo[1] == 4, wbinfo)
    else:
        res.append("SKIP    Excel-Export: SheetJS lokal nicht vorhanden (DG_XLSX oder tests/.cache/xlsx.full.min.js)")
    ok("Notenzentrale: keine JavaScript-Fehler", not errs, errs)

    # ---------- Exam in der Zukunft: noch nicht fertig, Hinweis ----------
    fut = pg.evaluate("()=>{ window.NZ_TODAY = '2026-11-12'; NZ.addTexts([]); return [NZ.EINS.filter(e=>e.done).length, NZ.ISSUES.filter(i=>/in der Zukunft/.test(i.text)).length]; }")
    ok("Exam 17.11. am 12.11. schon geoeffnet: kein Einsatz fertig, Hinweis in der Kontrolle", fut[0] == 0 and fut[1] >= 1, fut)
    pg.evaluate("()=>{ window.NZ_TODAY = '2026-11-18'; NZ.addTexts([]); }")
    # ---------- Doppelt erfasst: am Laptop zusammengefuehrte Datei im Ordner ----------
    dup = json.loads(json.dumps(REP[("kueche", "5T")])); dup["savedAt"] = "2026-11-17T19:00:00.000Z"
    dup["settings"]["paketId"] = "Paket_Zyklus-3-1_Kueche_Zusammengefuehrt_10T_2026-11-02"; dup["variant"] = "10T"
    (tmp / "Zusammengefuehrt.json").write_text(json.dumps(dup), encoding="utf-8")
    pg.set_input_files("#fileIn", [str(tmp / "Zusammengefuehrt.json")]); pg.wait_for_timeout(300)
    iss = pg.evaluate("()=>NZ.ISSUES.filter(i=>i.lv==='err').map(i=>i.text)")
    ok("Kontrolle: gleiche Person am gleichen Tag in zwei Paketen = Fehler", any("in 2 Paketen erfasst" in t for t in iss), iss[:2])
    # ---------- Rueckstand: Rapport alt, Einsatztage vergangen ----------
    pg.evaluate("()=>{ window.NZ_TODAY = '2026-11-30'; }")
    late = json.loads(json.dumps(REP[("kueche", "10T")])); late["savedAt"] = "2026-11-04T18:00:00.000Z"
    late["settings"]["paketId"] = "Paket_Zyklus-3-2_Kueche_The-Essence_10T_2026-11-18"
    late["settings"]["slotDates"] = ["2026-11-18", "2026-11-19", "2026-11-23", "2026-11-24", "2026-11-25", "2026-11-26", "2026-11-30", "2026-12-01", "2026-12-02", "2026-12-03"]
    late["settings"]["block"] = "Zyklus 3.2"; late["days"] = {}
    (tmp / "Rueckstand.json").write_text(json.dumps(late), encoding="utf-8")
    pg.click("#btnClear"); pg.set_input_files("#fileIn", [str(tmp / "Rueckstand.json")]); pg.wait_for_timeout(300)
    iss = pg.evaluate("()=>NZ.ISSUES.map(i=>i.text)")
    ok("Kontrolle: Rueckstand seit dem letzten Rapport (6 vergangene Einsatztage)", any("seit dem letzten Rapport" in t and "6 Einsatztage" in t for t in iss), iss)
    ok("Notenzentrale: keine JavaScript-Fehler (nach Nachladen)", not errs, errs)
    c.close(); b.close()

out = R / "tests" / "Testprotokoll_Notenzentrale.txt"
txt = "Testprotokoll Daily Grades: Regeln 31.10.2026 und Notenzentrale\n" + "\n".join(res) + "\n\n%d von %d Pruefungen bestanden\n" % (
    sum(1 for r in res if r.startswith("OK")), sum(1 for r in res if r.startswith(("OK", "FEHLER"))))
out.write_text(txt, encoding="utf-8"); print(txt)
