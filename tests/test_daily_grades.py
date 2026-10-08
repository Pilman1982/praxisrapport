# -*- coding: utf-8 -*-
"""Daily Grades: Rueckmeldungen aus dem Pilot (08.10.2026).
Schicht-Kuerzel, OC wie Market, Verspaetung startet bei 4.00, Kriterien ohne Scrollen,
Freitext wird beim Schliessen gespeichert, Nickname im Blatt, Zusammenfassung an die Kursleitung,
Knopf zur Startseite, Nicknames im Cockpit uebernehmen."""
import pathlib, json
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-70s %s" % (n, str(i)[:120]))
T = lambda d, o, c, m=False: dict(datum=d, outlet=o, schicht=c, **({"market": True} if m else {}))
ESS = [("2026-11-02","CS1"),("2026-11-03","S"),("2026-11-04","OC"),("2026-11-05","S"),("2026-11-09","SW2"),
       ("2026-11-10","SW1"),("2026-11-11","S"),("2026-11-12","SM"),("2026-11-16","S")]
plan = {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th"],
 "dozierende":[{"name":"Martin Test","bereich":"service","outlets":["The Essence"],"sprache":"en"},
               {"name":"Koch DF","bereich":"kueche","outlets":["Da Fortunat"],"sprache":"de"}],
 "studierende":[
  {"nr":"11","nachname":"Muster","vorname":"Max","nickname":"","klasse":"HFE1","gruppe":"Gruppe 1 Team A","sprache":"en","einsaetze":[
   {"bereich":"service","outlet":"The Essence","von":"2026-11-02","bis":"2026-11-17","variante":"10T","block":"Zyklus 3.1","exam":"2026-11-17",
    "tage":[T(d,"The Essence",c,c=="SM") for d,c in ESS]},
   {"bereich":"kueche","outlet":"Da Fortunat","von":"2026-11-18","bis":"2026-11-25","variante":"5T","block":"Zyklus 3.2",
    "tage":[T("2026-11-18","Da Fortunat","K1"),T("2026-11-19","Da Fortunat","K2"),T("2026-11-23","Da Fortunat","TM",True),T("2026-11-24","Da Fortunat","K3"),T("2026-11-25","Da Fortunat","K1")]}]},
  {"nr":"12","nachname":"Beispiel","vorname":"Lu","nickname":"","klasse":"HFE1","gruppe":"Gruppe 1 Team A","sprache":"zh","einsaetze":[
   {"bereich":"service","outlet":"The Essence","von":"2026-11-02","bis":"2026-11-17","variante":"10T","block":"Zyklus 3.1","exam":"2026-11-17",
    "tage":[T(d,"The Essence",c) for d,c in [("2026-11-02","S"),("2026-11-03","CS1"),("2026-11-04","S"),("2026-11-05","OC"),("2026-11-09","S"),
            ("2026-11-10","S"),("2026-11-11","SW2"),("2026-11-12","SW1"),("2026-11-16","S")]]}]}]}

with sync_playwright() as p:
    b = p.chromium.launch()
    c = b.new_context(); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"cockpit.html").as_uri()); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    pk = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")
    svc = [x for x in pk if x["app"] == "Servicerapport"][0]; k5 = [x for x in pk if x["variant"] == "5T"][0]
    m = [s for s in svc["students"] if s["nr"] == "11"][0]
    ok("Cockpit: Schicht-Kuerzel pro Tag im Paket", m.get("schichtPlan") == [c for d, c in ESS], m.get("schichtPlan"))
    ok("Cockpit: OC (Tag 3) und Market (Tag 8) als Team-Market-Tage", m.get("tmTage") == [3, 8], m.get("tmTage"))
    ok("Cockpit: Kueche 5T traegt Kuechen-Kuerzel", k5["students"][0].get("schichtPlan") == ["K1","K2","TM","K3","K1"], k5["students"][0].get("schichtPlan"))
    ok("Cockpit: Titel und Logo Daily Grades", "Daily Grades" in pg.title() and pg.locator("link[rel=icon]").count() == 1, pg.title())
    # Nicknames aus einem Rapport uebernehmen
    rep = json.loads(json.dumps(svc)); rep["savedAt"] = "2026-11-03T12:00:00Z"
    [s for s in rep["students"] if s["nr"] == "12"][0]["nick"] = "Lulu"
    pg.evaluate("""(o)=>onReports([new File([JSON.stringify(o)], 'Martin_Tag.json')])""", rep); pg.wait_for_timeout(300)
    ch = pg.evaluate("()=>nickChanges().map(x=>[x.s.nr, x.alt, x.neu])")
    ok("Cockpit: neuer Nickname aus dem Rapport erkannt", ch == [["12", "", "Lulu"]], ch)
    with pg.expect_download() as dl: pg.click("#btnNicks")
    nk = pg.evaluate("()=>[PLAN.studierende.find(s=>s.nr==='12').nickname, nickChanges().length, PACKS.length]")
    ok("Cockpit: Nickname im Plan, Turnusplan gespeichert, Pakete neu", nk[0] == "Lulu" and nk[1] == 0 and nk[2] == 2 and dl.value.suggested_filename.startswith("turnusplan_TEST_Nicknames"), [nk, dl.value.suggested_filename])
    pk2 = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")
    ok("Cockpit: neues Paket enthaelt den Nickname", [s for s in [x for x in pk2 if x["app"] == "Servicerapport"][0]["students"] if s["nr"] == "12"][0]["nick"] == "Lulu")
    ok("Cockpit: keine JavaScript-Fehler", not errs, errs); c.close()

    LOAD = """(o)=>{ S.settings = Object.assign(S.settings, o.settings); S.students = o.students.map(s=>Object.assign({}, s)); S.days = {};
        if(typeof saubereStudierende === 'function') S.students = saubereStudierende(S.students);
        if(typeof normalizeStudents === 'function') normalizeStudents();
        slots().forEach(x=>openSlot(x.id)); curSlot = slots()[0].id; view = 'day'; persist(); render(); return true; }"""
    for vp, lab in (({"width": 820, "height": 1180}, "iPad"), ({"width": 390, "height": 844}, "iPhone")):
        c = b.new_context(viewport=vp, has_touch=True, user_agent="Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")
        pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D/"service/Servicerapport_Mobil.html").as_uri()); pg.wait_for_timeout(300)
        pg.evaluate(LOAD, svc); pg.wait_for_timeout(100)
        P = "Service Mobil " + lab + ": "
        sp = pg.locator("#view .srow .spill").all_inner_texts()
        ok(P + "Schicht-Kuerzel in der Tagesliste (CS1 und S)", sp[:2] == ["CS1", "S"] or sorted(sp[:2]) == ["CS1", "S"], sp)
        hh = pg.evaluate("()=>[document.getElementById('brandApp').textContent, document.querySelectorAll('.dgm svg').length, document.getElementById('btnHome').getAttribute('href')]")
        ok(P + "Kopf: Daily Grades, Logo, Knopf Startseite", hh[0].startswith("Daily Grades") and hh[1] == 1 and "mein.html" in hh[2], hh)
        hd = pg.evaluate("()=>{ const h = document.querySelector('header .hrow'); return h.scrollWidth <= h.clientWidth + 1; }")
        ok(P + "Kopfzeile passt ohne Ueberlauf", hd)
        pg.locator("#view .srow").first.click(); pg.wait_for_timeout(150)
        g = pg.evaluate("""()=>{ const bar = document.querySelector('.critbar'); const bs = [...bar.querySelectorAll('button')];
            const sh = document.querySelector('.sheet'); const r = sh.getBoundingClientRect();
            return {n: bs.length, grid: getComputedStyle(bar).display, noScroll: bar.scrollWidth <= bar.clientWidth + 1,
                    inside: bs.every(x=>{ const q = x.getBoundingClientRect(); return q.left >= r.left - 1 && q.right <= r.right + 1; })}; }""")
        ok(P + "alle 9 Kriterien und Notiz sichtbar, ohne seitliches Scrollen", g["n"] == 10 and g["grid"] == "grid" and g["noScroll"] and g["inside"], g)
        # Freitext: tippen, mit X schliessen -> gespeichert
        pg.locator(".critbar button").last.click(); pg.wait_for_timeout(80)
        pg.locator(".sheet textarea").fill("Hat heute den Tisch 4 allein betreut")
        pg.locator(".sheet-h .hbtn").click(); pg.wait_for_timeout(120)
        nt = pg.evaluate("()=>{ const s = S.students[0]; const r = S.days[curSlot][s.id]; return r.note && r.note.txt; }")
        ok(P + "Freitext nach Schliessen mit X gespeichert", nt == "Hat heute den Tisch 4 allein betreut", nt)
        stored = pg.evaluate("()=>{ const raw = localStorage.getItem(KEY); return raw && raw.indexOf('Tisch 4') > 0; }")
        ok(P + "Freitext steht im Geraetespeicher", stored)
        # Nickname im Blatt
        pg.evaluate("()=>{ const i = S.students.findIndex(x=>x.nr==='12'); document.querySelectorAll('#view .srow')[i].click(); }"); pg.wait_for_timeout(120)
        pg.locator("#nickBtn").click(); pg.locator(".nickbox input").fill("Lulu"); pg.locator(".nickbox .btn.pri").click(); pg.wait_for_timeout(100)
        nn = pg.evaluate("()=>[S.students.find(x=>x.nr==='12').nick, document.querySelector('.sheet-h .nm').textContent, !!S.students.find(x=>x.nr==='12').nickNeu]")
        ok(P + "Nickname im Blatt eingetragen und im Kopf sichtbar", nn[0] == "Lulu" and "Lulu" in nn[1] and nn[2], nn)
        pg.locator(".sheet-f .btn.pri").click(); pg.wait_for_timeout(80)
        # Paket ohne Nickname loescht ihn nicht, Paket mit Nickname aktualisiert
        r = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='12');
            n2Refresh([{nr:'12', nick:'', name:s.name}]); const a = s.nick; n2Refresh([{nr:'12', nick:'Lu Lu', name:s.name}]); return [a, s.nick]; }""")
        ok(P + "Leeres Paketfeld loescht Nickname nicht, neuer Nickname kommt an", r == ["Lulu", "Lu Lu"], r)
        # Verspaetung: Start bei 4.00
        late = pg.evaluate("""()=>{ const s = S.students[0]; const id = slots()[1].id; S.days[id][s.id] = {att:'late', obs:[], note:null};
            const g = n2Crit(id, s.id); return [n2Day(id, s.id), Object.values(g).every(v=>v===4)]; }""")
        ok(P + "Verspaetet ohne Beobachtung ergibt 4.00 in allen Kriterien", late == [4, True], late)
        # OC-Tag ist Team Market (5.00)
        oc = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='11'); const id = slots()[2].id; return [S.days[id][s.id].att, n2Day(id, s.id), planSchicht(s, id)]; }""")
        ok(P + "OC-Tag ist als Team Market vorbelegt und zaehlt 5.00", oc == ["tm", 5, "OC"], oc)
        # Zusammenfassung
        t = pg.evaluate("()=>n2SummaryText()")
        ok(P + "Zusammenfassung: Ø 9 Tage und Exam, an die Kursleitung", "Ø 9 Tage" in t["body"] and "Exam:" in t["body"] and "Muster, Max" in t["body"] and "«Lu Lu»" in t["body"], t["body"][:200])
        pg.evaluate("()=>{ curSlot = slots()[slots().length-1].id; render(); }")
        ok(P + "Am Exam Day steht die Zusammenfassung in der Tagesansicht", pg.locator("#view .sumcard").count() == 1)
        pg.evaluate("()=>{ view = 'grades'; render(); }")
        ok(P + "Notenuebersicht zeigt den Knopf Zusammenfassung", pg.locator("#view .sumcard button").count() == 1)
        ok(P + "keine JavaScript-Fehler", not errs, errs); c.close()

    # 4T und 5T: richtige Durchschnitte in der Zusammenfassung
    for app, lab, want, exam in (("kueche/Kuechenrapport_Mobil_5Tage_ohneExam.html", "Kueche 5T", "Ø 5 Tage", False),
                                 ("service/Servicerapport_Mobil_4Tage_Exam.html", "Service 4T", "Ø 4 Tage", True),
                                 ("kueche/Kuechenrapport_Mobil_4Tage_Exam.html", "Kueche 4T", "Ø 4 Tage", True)):
        c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D/app).as_uri()); pg.wait_for_timeout(300)
        pg.evaluate(LOAD, k5 if "5T" in app else svc | {"variant": "4T"}); pg.wait_for_timeout(100)
        t = pg.evaluate("()=>n2SummaryText()")
        ok(lab + ": Zusammenfassung mit " + want + (" und Exam" if exam else " ohne Exam"), want in t["body"] and (("Exam:" in t["body"]) == exam), t["subj"])
        if "5T" in app:
            sp = pg.locator("#view .srow .spill").all_inner_texts()
            ok(lab + ": Kuechen-Kuerzel K1 in der Tagesliste", sp[:1] == ["K1"], sp)
        ok(lab + ": keine JavaScript-Fehler", not errs, errs); c.close()

    # Laptop: Kuerzel, Nickname-Knopf, Verspaetung, Startseite
    for app in ("service/Servicerapport.html", "kueche/Kuechenrapport_5Tage_ohneExam.html"):
        c = b.new_context(viewport={"width": 1366, "height": 900}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D/app).as_uri()); pg.wait_for_timeout(300)
        pkg = svc if "service" in app else k5
        pg.evaluate("""(o)=>{ S.settings = Object.assign(S.settings, o.settings); S.students = o.students.map(s=>Object.assign({}, s)); S.days = {};
            if(typeof saubereStudierende === 'function') S.students = saubereStudierende(S.students);
            if(typeof normalizeStudents === 'function') normalizeStudents();
            slots().forEach(x=>openSlot(x.id)); curSlot = slots()[0].id; persist(); render(); }""", pkg); pg.wait_for_timeout(150)
        L = "Laptop " + app.split("/")[1] + ": "
        sp = pg.locator(".stud-h .spill").all_inner_texts()
        ok(L + "Schicht-Kuerzel neben dem Namen", len(sp) >= 1 and sp[0] in ("CS1", "S", "K1"), sp)
        ok(L + "Nickname-Knopf und Knopf Startseite", pg.locator(".stud-h .nickbtn").count() >= 1 and pg.locator("#btnHome").count() == 1)
        pg.on("dialog", lambda d: d.accept("Maxi"))
        pg.locator(".stud-h .nickbtn").first.click(); pg.wait_for_timeout(120)
        ok(L + "Nickname per Knopf eingetragen", pg.evaluate("()=>S.students[0].nick") == "Maxi", pg.evaluate("()=>S.students[0].nick"))
        late = pg.evaluate("""()=>{ const s = S.students[0]; const id = slots()[1].id; S.days[id][s.id] = {att:'late', obs:[], note:null};
            curSlot = id; render(); return [dayTotal(id, s.id), /4\\.00 (statt|instead of) 5\\.00/.test(document.body.innerText)]; }""")
        ok(L + "Verspaetet ergibt 4.00 und zeigt den Hinweis", late == [4, True], late)
        ok(L + "Titel Daily Grades und Logo", pg.title().startswith("Daily Grades") and pg.locator(".dgl svg").count() == 1, pg.title())
        if "service" in app:
            st = pg.evaluate("()=>{ const r = selfTest(); return r.filter(x=>!x.ok).map(x=>x.name); }")
            ok(L + "Selbsttest ohne Fehler (Verspaetung startet bei 4.00)", not st, st)
        ok(L + "keine JavaScript-Fehler", not errs, errs); c.close()

    # Startseite und mein.html
    c = b.new_context(); pg = c.new_page()
    pg.goto((D/"mein.html").as_uri()); pg.wait_for_timeout(200)
    ok("mein.html: Titel und Logo Daily Grades", pg.title() == "Daily Grades" and pg.locator("header svg").count() == 1, pg.title())
    pg.goto((D/"index.html").as_uri())
    ok("index.html: Titel Daily Grades", pg.title() == "Daily Grades", pg.title())
    c.close(); b.close()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_DailyGrades.txt").write_text("PRUEFUNG DAILY GRADES (Rueckmeldungen Pilot) 08.10.2026\n\n" + "\n".join(res) + "\n", encoding="utf-8")
