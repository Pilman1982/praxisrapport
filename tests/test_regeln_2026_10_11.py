# -*- coding: utf-8 -*-
"""Daily Grades: Regeln vom 11.10.2026.
Basisnote fest 4.50 (auch alte Dateien mit 5.00), verspaetet 3.50, Team Market und OC 5.00,
Team Market verspaetet 4.00, Feedback-Mail und Beurteilung in der Sie-Form (Deutsch), Dear (Englisch)."""
import pathlib, json, re
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-74s %s" % (n, str(i)[:140]))
DU = re.compile(r"\b(du|dich|dir|dein\w*|euch|euer)\b", re.I)
T = lambda d, o, c, m=False: dict(datum=d, outlet=o, schicht=c, **({"market": True} if m else {}))
TAGE = ["2026-11-02","2026-11-03","2026-11-04","2026-11-05","2026-11-09","2026-11-10","2026-11-11","2026-11-12","2026-11-16"]
plan = {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th"],
 "dozierende":[{"name":"Lehrer Service","bereich":"service","outlets":["Campigiana"],"sprache":"de"},
               {"name":"Lehrer Kueche","bereich":"kueche","outlets":["The Essence"],"sprache":"de"}],
 "studierende":[
  {"nr":"21","nachname":"Muster","vorname":"Max","nickname":"","email":"max@beispiel.ch","klasse":"HFD","gruppe":"Gruppe 1 Team A","sprache":"de","einsaetze":[
   {"bereich":"service","outlet":"Campigiana","von":TAGE[0],"bis":"2026-11-17","variante":"10T","block":"Zyklus 3.1","exam":"2026-11-17",
    "tage":[T(d,"Campigiana","OC" if i == 2 else "S") for i, d in enumerate(TAGE)]},
   {"bereich":"kueche","outlet":"The Essence","von":"2026-11-18","bis":"2026-12-02","variante":"10T","block":"Zyklus 3.2","exam":"2026-12-02",
    "tage":[T(d,"The Essence","TM" if i == 2 else "K1", i == 2) for i, d in enumerate(["2026-11-18","2026-11-19","2026-11-23","2026-11-24","2026-11-25","2026-11-26","2026-11-30","2026-12-01","2026-11-27"])]}]},
  {"nr":"22","nachname":"Beispiel","vorname":"Emma","nickname":"","email":"emma@beispiel.ch","klasse":"HFE1","gruppe":"Gruppe 1 Team A","sprache":"en","einsaetze":[
   {"bereich":"service","outlet":"Campigiana","von":TAGE[0],"bis":"2026-11-17","variante":"10T","block":"Zyklus 3.1","exam":"2026-11-17",
    "tage":[T(d,"Campigiana","S") for d in TAGE]}]}]}

LOAD = """(o)=>{ S.settings = Object.assign(S.settings, o.settings); S.students = o.students.map(s=>Object.assign({}, s)); S.days = {};
    if(typeof saubereStudierende === 'function') S.students = saubereStudierende(S.students);
    if(typeof normalizeStudents === 'function') normalizeStudents();
    slots().forEach(x=>openSlot(x.id)); curSlot = slots()[0].id; persist(); render(); return true; }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    c = b.new_context(); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"cockpit.html").as_uri()); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    pk = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")
    svc = [x for x in pk if x["app"] == "Servicerapport"][0]; kue = [x for x in pk if x["app"] != "Servicerapport"][0]
    ok("Cockpit: Pakete mit Basisnote 4.50", svc["settings"].get("base") == 4.5 and kue["settings"].get("base") == 4.5, (svc["settings"].get("base"), kue["settings"].get("base")))
    rep = {"days": {"d01": {svc["students"][0]["id"]: {"att": "tml", "obs": [], "note": None}}}}
    rep = json.loads(json.dumps(svc)); rep["days"] = {"d01": {rep["students"][0]["id"]: {"att": "tml", "obs": [], "note": None}}}; rep["savedAt"] = "2026-11-03T12:00:00Z"
    pg.evaluate("""(o)=>onReports([new File([JSON.stringify(o)], 'Tag.json')])""", rep); pg.wait_for_timeout(300)
    rr = pg.evaluate("()=>REPS.map(r=>[r.l, r.tm])")
    ok("Cockpit: Eingangskontrolle zaehlt Team Market verspaetet als Verspaetung und Market", rr == [[1, 1]], rr)
    ok("Cockpit: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- Laptop ----------------
    for app, pkg in (("service/Servicerapport.html", svc), ("kueche/Kuechenrapport.html", kue)):
        c = b.new_context(viewport={"width": 1366, "height": 900}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D/app).as_uri()); pg.wait_for_timeout(300)
        pg.evaluate(LOAD, pkg); pg.wait_for_timeout(100)
        L = "Laptop " + app.split("/")[1] + ": "
        # alte Datei mit Basis 5.00 simulieren und neu laden
        pg.evaluate("()=>{ S.settings.base = 5; persist(); }"); pg.reload(); pg.wait_for_timeout(400)
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'), d = slots()[0].id; S.days[d][s.id] = {att:'present', obs:[], note:null};
            const sel = document.getElementById('fBase'); view = 'set'; render(); const sb = document.getElementById('fBase');
            return [S.settings.base, dayTotal(d, s.id), sb ? sb.disabled : null, sb ? sb.options.length : null]; }""")
        ok(L + "alte Datei mit 5.00: Basis wird 4.50, Tag ohne Beobachtung 4.50, Auswahl gesperrt", g == [4.5, 4.5, True, 1], g)
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'), d = slots()[1].id; S.days[d][s.id] = {att:'late', obs:[], note:null}; return dayTotal(d, s.id); }""")
        ok(L + "verspaetet: 3.50", g == 3.5, g)
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'), d = slots()[2].id; return [S.days[d][s.id].att, dayTotal(d, s.id)]; }""")
        ok(L + "OC bzw. Team Market vorbelegt: 5.00", g == ["tm", 5], g)
        # Bedienung: Team Market + Verspaetet kombinieren
        pg.evaluate("()=>{ curSlot = slots()[2].id; view = 'day'; render(); }"); pg.wait_for_timeout(100)
        card = pg.locator("article.stud", has_text="Muster")
        card.locator(".seg button.v-late").click(); pg.wait_for_timeout(100)
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'), d = slots()[2].id; const card = [...document.querySelectorAll('article.stud')].find(a=>a.innerText.includes('Muster'));
            return [S.days[d][s.id].att, dayTotal(d, s.id), card.querySelector('.seg button.v-late').getAttribute('aria-pressed'),
                    card.querySelector('.seg button.v-tm').getAttribute('aria-pressed'), /4\\.00/.test(card.innerText)]; }""")
        ok(L + "Market + Verspaetet: 4.00, beide Knoepfe aktiv, Hinweis 4.00", g == ["tml", 4, "true", "true", True], g)
        al = pg.evaluate("()=>absenceList(slots()[2].id).map(x=>x.kind)")
        ok(L + "Meldung: Team Market verspaetet erscheint als Verspaetung", len(al) == 1 and "Verspätet" in al[0] and "Team Market" in al[0], al)
        pg.locator("article.stud", has_text="Muster").locator(".seg button.v-late").click(); pg.wait_for_timeout(100)
        g = pg.evaluate("()=>{ const s = S.students.find(x=>x.nr==='21'), d = slots()[2].id; return [S.days[d][s.id].att, dayTotal(d, s.id)]; }")
        ok(L + "Verspaetet erneut tippen: zurueck auf Team Market 5.00", g == ["tm", 5], g)
        pg.locator("article.stud", has_text="Muster").locator(".seg button.v-late").click(); pg.wait_for_timeout(100)
        # Zaehlung und Beurteilung
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'); const su = summary(s.id, 'all'); const txt = buildReport(s, 'all', 'de');
            return [su.late, su.tm, su.tml, txt]; }""")
        ok(L + "Zusammenfassung: 2x verspaetet, 1x Market, davon 1x verspaetet", g[:3] == [2, 1, 1], g[:3])
        ok(L + "Beurteilung nennt Team Market verspaetet (4.00)", "davon verspätet 1 × (4.00)" in g[3], [x for x in g[3].split("\n") if "Team Market" in x])
        ok(L + "Beurteilung Deutsch ohne Du-Form", not DU.search(g[3]) and " Sie " in g[3] + " ", DU.findall(g[3]))
        g = pg.evaluate("()=>[gradeClass(4.75), gradeClass(4.5), gradeClass(3.9)]")
        ok(L + "Farben: gruen ab 4.75, neutral 4.50, rot unter 4.00", g == ["g-hi", "", "g-lo"], g)
        if "service" in app:
            st = pg.evaluate("()=>{ const r = selfTest(); return r.filter(x=>!x.ok && x.name !== t('stClass')).map(x=>x.name); }")   # Kopfzeile Klasse/Gruppe ist bei gemischten Paketen leer
            ok(L + "Selbsttest Rechenlogik ohne Fehler", not st, st)
        ok(L + "keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- Mobil ----------------
    for app, pkg in (("service/Servicerapport_Mobil.html", svc), ("kueche/Kuechenrapport_Mobil.html", kue)):
        c = b.new_context(viewport={"width": 820, "height": 1180}, has_touch=True, user_agent="Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")
        pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D/app).as_uri()); pg.wait_for_timeout(300)
        pg.evaluate(LOAD, pkg); pg.wait_for_timeout(100)
        M = "Mobil " + app.split("/")[1] + ": "
        pg.evaluate("()=>{ S.settings.base = 5; persist(); }"); pg.reload(); pg.wait_for_timeout(400)
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'); const d0 = slots()[0].id, d1 = slots()[1].id, d2 = slots()[2].id;
            S.days[d0][s.id] = {att:'present', obs:[], note:null}; S.days[d1][s.id] = {att:'late', obs:[], note:null};
            return [S.settings.base, n2Day(d0, s.id), n2Day(d1, s.id), S.days[d2][s.id].att, n2Day(d2, s.id)]; }""")
        ok(M + "Basis 4.50 (alte Datei 5.00), verspaetet 3.50, Market 5.00", g == [4.5, 4.5, 3.5, "tm", 5], g)
        pg.evaluate("()=>{ curSlot = slots()[2].id; render(); openSheet(S.students.find(x=>x.nr==='21')); }"); pg.wait_for_timeout(150)
        pg.locator(".sheet .att button.warn").click(); pg.wait_for_timeout(120)
        g = pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'), d = slots()[2].id; const sh = document.querySelector('.sheet');
            return [S.days[d][s.id].att, n2Day(d, s.id), sh.querySelector('.att button.warn').getAttribute('aria-pressed'),
                    sh.querySelector('.att button.tm').getAttribute('aria-pressed'), /4\\.00/.test(sh.innerText)]; }""")
        ok(M + "Market + Verspaetet im Blatt: 4.00, beide Knoepfe aktiv, Hinweis", g == ["tml", 4, "true", "true", True], g)
        al = pg.evaluate("()=>JSON.stringify(absenceList(slots()[2].id))")
        ok(M + "Absenzmeldung nennt Team Market verspaetet", "Team Market" in al and "Verspätet" in al, al)
        # Feedback-Mail
        pg.evaluate("""()=>{ const s = S.students.find(x=>x.nr==='21'); const neg = CHIPS.find(c=>c.d<0 && !c.ko && c.a && c.a.de);
            slots().filter(x=>!x.exam).slice(3,6).forEach(x=>{ S.days[x.id][s.id] = {att:'present', obs:[neg.i], note:null}; }); persist(); }""")
        fb = pg.evaluate("()=>n2FbText(S.students.find(x=>x.nr==='21'), 'de', true)")
        body = fb["body"]
        ok(M + "Mail Deutsch beginnt mit «Guten Tag Max,»", body.startswith("Guten Tag Max,"), body[:40])
        ok(M + "Mail Deutsch in Sie-Form, ohne du/dich/dein", " Sie " in body and not DU.search(body), DU.findall(body))
        ok(M + "Mail Deutsch: Betreff «Ihr Feedback», Gruss «Freundliche Grüsse»", fb["subj"].startswith("Ihr Feedback") and "Freundliche Grüsse" in body, fb["subj"])
        ok(M + "Mail Deutsch: Verspaetung inkl. Market gezaehlt (2x)", "Sie waren 2× verspätet" in body, [x for x in body.split("\n") if "verspätet" in x])
        if "service" in app:
            en = pg.evaluate("()=>n2FbText(S.students.find(s=>s.nr==='22'), 'en', false)")["body"]
            ok(M + "Mail Englisch beginnt mit «Dear Emma,»", en.startswith("Dear Emma,"), en[:30])
        ok(M + "keine JavaScript-Fehler", not errs, errs); c.close()
    b.close()

bad = [r for r in res if r.startswith("FEHLER")]
(R/"tests"/"Testprotokoll_Regeln_2026-10-11.txt").write_text("\n".join(res) + "\n\n%d von %d\n" % (len(res) - len(bad), len(res)), encoding="utf-8")
print("\n".join(res)); print("%d von %d" % (len(res) - len(bad), len(res)))
