# -*- coding: utf-8 -*-
"""Pruefungen zum Audit vom 10.11.2026.

1  Befunde des Audits (jeder war vorher ein Fehler):
   - Service Mobil uebernahm eine Sicherung ungeprueft (alte Namensform, verwaiste Eintraege, kaputte Werte)
   - kaputte Tagesangaben (dayMeta) liessen «Tag erfassen» abbrechen
   - Dateien mit Byte-Order-Mark (UTF-8 mit BOM) wurden abgelehnt
   - Cockpit schob ein Datum, das es nicht gibt (31.11.), still in den Folgemonat
   - Feedback-Mail: eigene Textaenderungen gingen beim Wechsel von Sprache oder Notenhaken verloren
   - Erfassungsdatum in UTC statt Ortszeit
   - Notenzentrale wertete einen Freitext ohne Text, die Apps nicht
2  Stoerfestigkeit: zufaellig beschaedigte Dateien (falsche Typen an beliebiger Stelle) in Tablet, Laptop,
   Notenzentrale, Cockpit und «Meine Startseite»: nie ein JavaScript-Fehler, alle Ansichten zeichnen.

Anderer Zufallslauf: DG_FUZZ_SEED=7 python3 tests/test_audit_2026_11_10.py
"""
import pathlib, json, os, random, copy
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R / "docs"
SEED = int(os.environ.get("DG_FUZZ_SEED", "20261110")); N_MUT = int(os.environ.get("DG_FUZZ_N", "40"))
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-88s %s" % (n, "" if c else str(i)[:400]))

APPS = [("Kueche Mobil", "kueche/Kuechenrapport_Mobil.html", "Kuechenrapport", "onLoadBackup", True),
        ("Kueche Laptop", "kueche/Kuechenrapport.html", "Kuechenrapport", "onRestore", False),
        ("Service Mobil", "service/Servicerapport_Mobil.html", "Servicerapport", "onLoadBackup", True),
        ("Service Laptop", "service/Servicerapport.html", "Servicerapport", "onRestore", False)]
DATES = ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-16", "2026-11-17"]

def rapport(app, alt=False):
    studs = [{"id": "s1", "name": "Ammann Lea", "mail": "lea@beispiel.ch"}, {"id": "s2", "name": "van der Berg Sanne", "mail": ""}] if alt else \
            [dict(id="s1", nr="901", name="Ammann Lea", last="Ammann", first="Lea", nachname="Ammann", vorname="Lea", nick="Lulu", mail="lea@beispiel.ch", klasse="HFD", gruppe="Gruppe 1"),
             dict(id="s2", nr="902", name="Berg Sanne", last="Berg", first="Sanne", nachname="Berg", vorname="Sanne", nick="", mail="", klasse="HFE1", gruppe="Gruppe 1")]
    return {"app": app, "variant": "10T", "savedAt": "2026-11-10T16:00:00.000Z",
            "settings": {"group": "HFD", "team": "Gruppe 1", "outlet": "Campigiana", "teacher": "Test Dozent", "uiLang": "de", "weekdays": ["mo", "tu", "we", "th"], "startIdx": 0,
                         "slotDates": DATES, "paketId": "Paket_Zyklus-9-9_Test", "block": "Zyklus 9.9", "semester": "HS26"},
            "students": studs,
            "days": {"d01": {"s1": {"att": "late", "obs": [], "note": None}, "s2": {"att": "present", "obs": [], "note": {"txt": "Gute Mise en place", "crit": "", "dir": 0, "w": 0}}},
                     "d02": {"s1": {"att": "present", "obs": [], "note": None}}},
            "dayMeta": {"d01": {"date": "2026-11-02", "teacher": "Test Dozent"}}}

JUNK = [None, 0, -1, 3.7, "", "x", "2026-13-45", [], {}, [None], {"a": 1}, True, "<img src=x onerror=alert(1)>", 10**12]
def mutiere(o, rng, n=3):
    """n zufaellige Stellen der Datei durch einen falschen Wert ersetzen oder loeschen."""
    o = copy.deepcopy(o)
    for _ in range(n):
        node, tiefe = o, 0
        while True:
            keys = list(node.keys()) if isinstance(node, dict) else list(range(len(node))) if isinstance(node, list) else []
            if not keys: break
            k = rng.choice(keys); kind = node[k]
            if isinstance(kind, (dict, list)) and kind and rng.random() < 0.75 and tiefe < 6: node = kind; tiefe += 1; continue
            if rng.random() < 0.2 and isinstance(node, dict): del node[k]
            else: node[k] = copy.deepcopy(rng.choice(JUNK))
            break
    return o

LADE = "async (a)=>{ return await %s({target:{files:[new File([a], 'datei.json')], value:''}}); }"
with sync_playwright() as p:
    b = p.chromium.launch()
    def seite(rel, vp=None, **kw):
        c = b.new_context(viewport=vp or {"width": 1366, "height": 900}, **kw); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
        pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("dialog", lambda d: d.accept())
        pg.goto((D / rel).as_uri()); pg.wait_for_timeout(250)
        return c, pg, errs

    # ================= 1 · Befunde =================
    for lab, rel, app, fn, mobil in APPS:
        c, pg, errs = seite(rel, {"width": 820, "height": 1180} if mobil else None)
        # alte Namensform, verwaister Eintrag, kaputte Tagesangabe, kaputter Eintrag
        o = rapport(app, alt=True)
        o["days"]["d01"]["geist"] = {"att": "unexcused", "obs": [], "note": None}
        o["days"]["d02"]["s2"] = "kaputt"; o["dayMeta"]["d03"] = "kaputt"; o["dayMeta"]["d04"] = None
        r = pg.evaluate(LADE % fn, json.dumps(o))
        st = pg.evaluate("""()=>({n: S.students.length, names: S.students.map(s=>[s.last||s.nachname||'', s.first||s.vorname||'']), geist: !!(S.days.d01||{}).geist,
            kaputt: (S.days.d02||{}).s2 === undefined, meta: Object.keys(S.dayMeta||{}).sort(), ids: S.students.every(s=>!!s.id)})""")
        ok(lab + ": Sicherung mit alter Namensform laedt, Nachname und Vorname getrennt", r is True and st["n"] == 2 and ["Ammann", "Lea"] in st["names"] and st["ids"], (r, st))
        ok(lab + ": verwaister und kaputter Eintrag werden nicht uebernommen", not st["geist"] and st["kaputt"], st)
        ok(lab + ": kaputte Tagesangaben werden nicht uebernommen", st["meta"] == ["d01"], st["meta"])
        e3 = pg.evaluate("()=>{ try{ openSlot('d03'); openSlot('d04'); return typeof S.dayMeta.d03 === 'object' && !!S.days.d03; }catch(e){ return String(e); } }")
        ok(lab + ": «Tag erfassen» funktioniert an einem Tag mit vorher kaputter Tagesangabe", e3 is True, e3)
        # Erfassungsdatum in Ortszeit
        dt = pg.evaluate("()=>{ const d = new Date(); return [S.dayMeta.d03.date, d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')]; }")
        ok(lab + ": Erfassungsdatum ist das Datum des Geraets (Ortszeit)", dt[0] == dt[1], dt)
        # BOM
        r = pg.evaluate(LADE % fn, "\ufeff" + json.dumps(rapport(app)))
        ok(lab + ": Datei mit Byte-Order-Mark laedt", r is True and pg.evaluate("()=>S.students.length") == 2, r)
        # Datei aus dem anderen Bereich bleibt abgelehnt, nichts geaendert
        other = rapport("Servicerapport" if app == "Kuechenrapport" else "Kuechenrapport"); other["students"] = other["students"][:1]
        r = pg.evaluate(LADE % fn, json.dumps(other))
        ok(lab + ": Datei aus dem anderen Bereich abgelehnt, Stand unveraendert", r is False and pg.evaluate("()=>S.students.length") == 2, r)
        ok(lab + ": keine JavaScript-Fehler", not errs, errs[:3]); c.close()

    # Zeitzone: kurz nach Mitternacht in Zuerich ist es in UTC noch der Vortag
    for lab, rel, app, fn, mobil in APPS[:1] + APPS[3:]:
        c, pg, errs = seite(rel, None, timezone_id="Europe/Zurich")
        pg.clock.install(time="2026-11-10T23:30:00Z")             # 00:30 Uhr am 11.11. in Zuerich
        pg.goto((D / rel).as_uri()); pg.wait_for_timeout(200)
        pg.evaluate(LADE % fn, json.dumps(rapport(app)))
        d = pg.evaluate("()=>{ openSlot('d05'); return S.dayMeta.d05.date; }")
        ok(lab + ": 00:30 Uhr in Zuerich wird als 11.11. erfasst, nicht als 10.11. (UTC)", d == "2026-11-11", d); c.close()

    # Feedback-Mail: eigene Aenderung nicht still ueberschreiben
    for lab, rel, app, fn, mobil in (APPS[0], APPS[2]):
        c = b.new_context(viewport={"width": 820, "height": 1180}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        fragen = []; antwort = {"ja": False}
        pg.on("dialog", lambda d: (fragen.append(d.message), d.accept() if antwort["ja"] else d.dismiss()))
        pg.goto((D / rel).as_uri()); pg.wait_for_timeout(250)
        pg.evaluate(LADE % fn, json.dumps(rapport(app)))
        pg.evaluate("()=>n2OpenFb(S.students[0])"); pg.wait_for_timeout(100)
        pg.locator("#n2fbtext").fill("Mein eigener Text."); pg.locator("#n2fbtext").dispatch_event("input")
        pg.locator(".fbopts input[type=checkbox]").click(); pg.wait_for_timeout(80)
        v = pg.input_value("#n2fbtext"); haken = pg.locator(".fbopts input[type=checkbox]").is_checked()
        ok(lab + ": Feedback, Notenhaken nach eigener Aenderung fragt nach; Abbrechen behaelt Text und Haken", len(fragen) == 1 and v == "Mein eigener Text." and not haken, (fragen, v, haken))
        pg.locator(".fbopts select").select_option("en"); pg.wait_for_timeout(80)
        ok(lab + ": Feedback, Sprachwechsel abgebrochen: Text und Sprache bleiben", len(fragen) == 2 and pg.input_value("#n2fbtext") == "Mein eigener Text." and pg.input_value(".fbopts select") == "de", fragen)
        antwort["ja"] = True
        pg.locator(".fbopts select").select_option("en"); pg.wait_for_timeout(80)
        ok(lab + ": Feedback, nach Bestaetigung neuer Vorschlag in Englisch", pg.input_value("#n2fbtext").startswith("Dear Lea"), pg.input_value("#n2fbtext")[:40])
        n = len(fragen); pg.locator(".fbopts input[type=checkbox]").click(); pg.wait_for_timeout(80)
        ok(lab + ": Feedback, ohne eigene Aenderung keine Rueckfrage", len(fragen) == n and "practice grade" in pg.input_value("#n2fbtext"), fragen)
        ok(lab + ": Feedback ohne JavaScript-Fehler", not errs, errs[:3]); c.close()

    # Cockpit: Datum, das es nicht gibt
    plan = json.loads((R / "testdaten" / "turnusplan_BEISPIEL.json").read_text(encoding="utf-8"))
    c, pg, errs = seite("cockpit.html")
    bad = copy.deepcopy(plan); bad["studierende"][0]["einsaetze"][0]["bis"] = "2026-11-31"
    pg.fill("#planText", json.dumps(bad)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    iss = pg.evaluate("()=>ISSUES.filter(i=>i.lv==='err').map(i=>i.m)")
    ok("Cockpit: 31.11. wird als falsches Datum gemeldet (vorher still 01.12.)", any("Ammann" in m and "Datum fehlt oder falsch" in m for m in iss), iss[:3])
    pg.fill("#planText", "\ufeff" + json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    ok("Cockpit: Beispielplan (mit Byte-Order-Mark) ohne Fehlermeldung", pg.evaluate("()=>PACKS.length > 0 && !ISSUES.some(i=>i.lv==='err')"), pg.evaluate("()=>ISSUES.filter(i=>i.lv==='err').map(i=>i.m)")[:3])
    pakete = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))"); sem = pg.evaluate("()=>semesterPackages().map(x=>x.data)")
    ok("Cockpit: keine JavaScript-Fehler", not errs, errs[:3]); c.close()

    # Notenzentrale: Freitext ohne Text zaehlt nicht (wie in den Apps), CSV entschaerft Formeln
    c, nz, nzerr = seite("notenzentrale.html")
    nz.evaluate("()=>{ window.NZ_TODAY = '2026-11-18'; }")
    o = rapport("Kuechenrapport"); o["days"]["d02"]["s1"]["note"] = {"crit": "hyg", "dir": 1, "w": 1}
    o["students"][1]["nick"] = "=HYPERLINK(\"http://x\")"
    g = nz.evaluate("""(t)=>{ NZ.addTexts([{name:'a.json', text:t}]); const e = NZ.EINS.find(x=>x.person.nr==='901'); return e.days.find(d=>d.sl.id==='d02').total; }""", json.dumps(o))
    ok("Notenzentrale: Freitext ohne Text wirkt nicht auf die Note (4.50 wie in der App)", g == 4.5, g)
    with nz.expect_download() as dl: nz.click("#btnCsv")
    csv = pathlib.Path(dl.value.path()).read_text(encoding="utf-8-sig")
    ok("Notenzentrale: CSV entschaerft einen Nickname, der wie eine Formel beginnt", "'=HYPERLINK" in csv and ";=HYPERLINK" not in csv, [l for l in csv.splitlines() if "HYPER" in l][:1])

    # Kopfzeile in der Sprache der Oberflaeche, Reiter «Exam Day», Telefonbreite
    for lab, rel, app, fn, mobil in APPS:
        c, pg, errs = seite(rel, {"width": 360, "height": 800} if mobil else None)
        o = rapport(app); o["settings"]["uiLang"] = "th"; o["students"][1].update(name="Wickramasinghe-Bandaranaike Chandrika", last="Wickramasinghe-Bandaranaike", first="Chandrika", nachname="Wickramasinghe-Bandaranaike", vorname="Chandrika")
        pg.evaluate(LADE % fn, json.dumps(o)); pg.evaluate("()=>{ view = 'day'; render(); }")
        kopf = pg.evaluate("()=>[(document.querySelector('#brandApp .happ2') || document.querySelector('header.top .brand .txt b')).textContent, document.getElementById('btnHome').getAttribute('title'), document.getElementById('btnHome').textContent]")
        want = "บริการ" if app == "Servicerapport" else "ครัว"
        ok(lab + ": Kopfzeile auf Thai (Bereich und Knopf Startseite)", want in kopf[0] and "Küche" not in kopf[0] and "Startseite" not in kopf[1] + kopf[2], kopf)
        pg.evaluate("()=>{ S.settings.uiLang = 'de'; render(); }")
        kopf = pg.evaluate("()=>(document.querySelector('#brandApp .happ2') || document.querySelector('header.top .brand .txt b')).textContent")
        ok(lab + ": Kopfzeile wieder Deutsch nach Sprachwechsel", ("Service" if app == "Servicerapport" else "Küche") in kopf, kopf)
        if not mobil:
            tabs = pg.evaluate("()=>[...document.querySelectorAll('.sd')].map(x=>x.textContent)")
            ok(lab + ": Reiter des Pruefungstags heisst «Exam Day» (wie am Tablet), nicht «Prüfung»", "Exam Day" in tabs and "Prüfung" not in tabs, tabs[-2:])
        else:
            pg.evaluate("()=>{ slots().forEach(s=>openSlot(s.id)); view = 'day'; render(); }")
            bar = pg.evaluate("()=>[...document.querySelectorAll('#bar .btn')].map(b=>{ const r = b.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; })")
            ok(lab + ": Telefon 360 px, alle drei Knoepfe der Fussleiste im Bild", len(bar) == 3 and all(l >= 0 and r <= 360 for l, r in bar), bar)
            pg.evaluate("()=>openSheet(S.students[1])"); pg.wait_for_timeout(80)
            nb = pg.evaluate("()=>{ const r = document.getElementById('nickBtn').getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), r.width > 0]; }")
            ok(lab + ": Telefon 360 px, Stift fuer den Nickname bei langem Namen sichtbar", nb[2] and nb[0] >= 0 and nb[1] <= 360, nb)
        ok(lab + ": Kopfzeile und Telefonbreite ohne JavaScript-Fehler", not errs, errs[:3]); c.close()

    # Freitext ohne Text wirkt nie auf die Note; am Tablet entfernt ein geleerter Text den Freitext ganz
    for lab, rel, app, fn, mobil in APPS:
        c, pg, errs = seite(rel, {"width": 820, "height": 1180} if mobil else None)
        o = rapport(app); krit = "hyg"
        o["days"]["d02"]["s1"]["note"] = {"txt": "", "crit": krit, "dir": -1, "w": 1, "internal": False}       # Altbestand: Wirkung ohne Text
        o["days"]["d02"]["s2"] = {"att": "present", "obs": [], "note": {"txt": "Kochjacke fleckig", "crit": krit, "dir": -1, "w": 1, "internal": False}}
        pg.evaluate(LADE % fn, json.dumps(o))
        tag = "(sid)=>(typeof n2Day === 'function' ? n2Day('d02', sid) : dayTotal('d02', sid))"
        g1, g2 = pg.evaluate(tag, "s1"), pg.evaluate(tag, "s2")
        ok(lab + ": Freitext ohne Text wirkt nicht (4.50), mit Text wirkt er", g1 == 4.5 and g2 is not None and g2 < 4.5, (g1, g2))
        if mobil:
            pg.evaluate("()=>{ curSlot = 'd02'; view = 'day'; render(); openSheet(S.students.find(s=>s.id==='s2')); }"); pg.wait_for_timeout(100)
            pg.locator(".sheet button", has_text="Freitext").click(); pg.wait_for_timeout(80)
            ta = pg.locator(".sheet textarea").first
            ta.fill(""); ta.dispatch_event("input"); pg.wait_for_timeout(50)
            leer = pg.evaluate("()=>[S.days.d02.s2.note, n2Day('d02', 's2')]")
            ok(lab + ": Tablet, Text geleert: Freitext entfernt, Tagesnote wieder 4.50", leer[0] is None and leer[1] == 4.5, leer)
            ta.fill("Kochjacke gewechselt"); ta.dispatch_event("input"); pg.wait_for_timeout(50)
            wieder = pg.evaluate("()=>S.days.d02.s2.note")
            ok(lab + ": Tablet, im offenen Blatt weitergetippt: Kriterium und Wirkung vom Laptop wieder da", wieder and wieder["crit"] == krit and wieder["dir"] == -1 and wieder["w"] == 1, wieder)
        ok(lab + ": Freitext ohne JavaScript-Fehler", not errs, errs[:3]); c.close()

    # Zusammenfuehren am Laptop: gleiche Studierendennummer = dieselbe Person, auch nach einer Namenskorrektur
    for lab, rel, app, fn, mobil in (APPS[1], APPS[3]):
        c, pg, errs = seite(rel)
        pg.evaluate(LADE % fn, json.dumps(rapport(app)))
        neu = rapport(app); neu["savedAt"] = "2026-11-11T16:00:00.000Z"
        neu["students"][1].update(name="Berg-Meier Sanne", last="Berg-Meier", nachname="Berg-Meier")          # Name laut Excel korrigiert, Nummer 902 gleich
        neu["students"].append(dict(id="s3", nr="903", name="Ammann Lea", last="Ammann", first="Lea", nachname="Ammann", vorname="Lea", nick="", mail="", klasse="HFD", gruppe="Gruppe 1"))   # gleicher Name, andere Nummer
        neu["days"] = {"d03": {"s2": {"att": "late", "obs": [], "note": None}, "s3": {"att": "unexcused", "obs": [], "note": None}}}
        pg.evaluate("async (a)=>{ await onMerge({target:{files:[new File([a], 'neu.json')], value:''}}); }", json.dumps(neu))
        r = pg.evaluate("""()=>({n: S.students.length, nrs: S.students.map(s=>s.nr).sort(), late902: (S.days.d03 || {})[S.students.find(s=>s.nr==='902').id],
            u903: (S.days.d03 || {})[(S.students.find(s=>s.nr==='903') || {}).id], u901: (S.days.d03 || {})[S.students.find(s=>s.nr==='901').id] || null})""")
        ok(lab + ": Zusammenfuehren, korrigierter Name mit gleicher Nummer bleibt eine Person", r["n"] == 3 and r["late902"] and r["late902"]["att"] == "late", r)
        ok(lab + ": Zusammenfuehren, gleicher Name mit anderer Nummer wird nicht vermischt", r["nrs"] == ["901", "902", "903"] and r["u903"] and r["u903"]["att"] == "unexcused" and r["u901"] is None, r)
        ok(lab + ": Zusammenfuehren ohne JavaScript-Fehler", not errs, errs[:3]); c.close()

    # ================= 2 · Stoerfestigkeit =================
    rng = random.Random(SEED)
    for lab, rel, app, fn, mobil in APPS:
        c, pg, errs = seite(rel, {"width": 820, "height": 1180} if mobil else None)
        views = ("day", "grades", "set") if mobil else ("day", "week", "rep", "data", "set")
        basis = next((x for x in pakete if x["app"] == app and x["variant"] == "10T"), rapport(app))
        basis = copy.deepcopy(basis); ids = [s["id"] for s in basis["students"]]
        basis["days"] = {"d%02d" % d: {i: {"att": rng.choice(["present", "late", "tm", "excused"]), "obs": [], "note": {"txt": "ok", "crit": "", "dir": 0, "w": 0}} for i in ids} for d in (1, 2, 10)}
        basis["dayMeta"] = {"d01": {"date": "2026-11-02", "teacher": "X"}}
        geladen = 0; fehler = []
        for i in range(N_MUT):
            m = mutiere(basis, rng, rng.choice([1, 2, 4]))
            try:
                r = pg.evaluate(LADE % fn, json.dumps(m)); geladen += r is True
                for v in views: pg.evaluate("(v)=>{ view = v; render(); }", v)
                if r is True:
                    pg.evaluate("""()=>{ const sl = slots(); openSlot(sl[0].id); openSlot(sl[sl.length-1].id); view = 'day'; render();
                        if(S.students.length){ const s = S.students[0]; if(typeof openSheet === 'function'){ openSheet(s); const h = document.getElementById('sheetHost'); if(h) h.innerHTML = ''; document.body.style.overflow = ''; }
                          if(typeof n2FbText === 'function') n2FbText(s, 'de', true); if(typeof n2SummaryText === 'function') n2SummaryText();
                          if(typeof gradeRows === 'function'){ gradeRows(); evidenceRows(); buildCsv(); } if(typeof buildReport === 'function') buildReport(s, 'all', 'de'); }
                        snapshot(); }""")
            except Exception as e: fehler.append((i, str(e)[:200]))
            if errs: fehler.append((i, errs[:2], json.dumps(m)[:0])); del errs[:]
        ok("%s: %d beschaedigte Dateien, kein JavaScript-Fehler (%d geladen, Rest sauber abgelehnt)" % (lab, N_MUT, geladen), not fehler, fehler[:2])
        c.close()

    fehler = []; basis = rapport("Servicerapport")
    for i in range(N_MUT * 2):
        m = mutiere(basis, rng, rng.choice([1, 2, 4]))
        try:
            nz.evaluate("(t)=>{ document.getElementById('btnClear').click(); NZ.addTexts([{name:'m.json', text:t}, {name:'n.json', text:t.replace('16:00', '17:00')}]); ['ov','pk','ps','ab','ko','fi'].forEach(x=>NZ.setTab(x)); NZ.finalRows(); NZ.dayRows('kueche'); NZ.dayRows('service'); NZ.pkgRows(); NZ.absExportRows(); }", json.dumps(m))
        except Exception as e: fehler.append((i, str(e)[:300]))
        if nzerr: fehler.append((i, nzerr[:2])); del nzerr[:]
    ok("Notenzentrale: %d beschaedigte Rapporte, kein JavaScript-Fehler in allen Ansichten und Exporten" % (N_MUT * 2), not fehler, fehler[:2])
    c.close()

    c, pg, errs = seite("cockpit.html"); fehler = []
    for i in range(N_MUT * 2):
        m = mutiere(plan, rng, rng.choice([1, 3, 6]))
        try:
            pg.fill("#planText", json.dumps(m)); pg.click("#btnPlan")
            pg.evaluate("()=>{ PACKS.forEach(p=>{ packageJSON(p); startLink(p); }); if(PACKS.length) semesterPackages(); }")
        except Exception as e: fehler.append((i, str(e)[:300]))
        if errs: fehler.append((i, errs[:2])); del errs[:]
    ok("Cockpit: %d beschaedigte Turnusplaene, kein JavaScript-Fehler (Pruefen, Pakete, Semesterpakete)" % (N_MUT * 2), not fehler, fehler[:2])
    c.close()

    c, pg, errs = seite("mein.html", {"width": 820, "height": 1180}); fehler = []
    for i in range(N_MUT):
        m = mutiere(sem[0], rng, rng.choice([1, 3, 6])) if i else sem[0]
        try:
            pg.set_input_files("#file", {"name": "Semesterpaket.json", "mimeType": "application/json", "buffer": ("\ufeff" + json.dumps(m)).encode("utf-8")}); pg.wait_for_timeout(60)
            if i == 0: ok("Meine Startseite: Semesterpaket mit Byte-Order-Mark laedt", pg.evaluate("()=>!!SEM && SEM.pakete.length > 0"), pg.evaluate("()=>document.getElementById('main').textContent")[:120])
        except Exception as e: fehler.append((i, str(e)[:300]))
        if errs: fehler.append((i, errs[:2])); del errs[:]
    ok("Meine Startseite: %d beschaedigte Semesterpakete, kein JavaScript-Fehler" % N_MUT, not fehler, fehler[:2])
    c.close(); b.close()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res), "(Startwert %d)" % SEED)
(R / "tests" / "Testprotokoll_Audit_2026-11-10.txt").write_text("PRUEFUNG AUDIT 10.11.2026 (Startwert %d)\n\n" % SEED + "\n".join(res) + "\n", encoding="utf-8")
raise SystemExit(0 if all(x.startswith("OK") for x in res) else 1)
