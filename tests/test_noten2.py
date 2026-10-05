# -*- coding: utf-8 -*-
"""Noten 2.0: Datum statt Woche, Zyklus, Noten und Wirkung sichtbar, Fotos, Semesterpaket und persoenliche Startseite."""
import pathlib, json, threading, functools, http.server, socketserver, datetime
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"; LIB = pathlib.Path("/tmp/claude-0/libs/node_modules")
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-70s %s" % (n, str(i)[:130]))
def libs(route):
    u = route.request.url
    f = next((x for x in [LIB/"jszip/dist/jszip.min.js"] if "jszip" in u and x.exists()), None)
    if f: route.fulfill(path=str(f), content_type="application/javascript")
    else: route.abort()

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(D))); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
U = "http://127.0.0.1:%d/" % PORT

FOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8DwnwEJMDEgAQAbjAIDtIxvqQAAAABJRU5ErkJggg=="
T = lambda d, o, m=False: dict(datum=d, outlet=o, **({"market": True} if m else {}))
EX = "2026-09-01"
plan = {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th"],
 "dozierende":[{"name":"Koch Pat","bereich":"kueche","outlets":["Patisserie"],"sprache":"de"},
               {"name":"Chef Essence","bereich":"kueche","outlets":["The Essence"],"sprache":"en"},
               {"name":"Service A / Service B","bereich":"service","outlets":["Da Fortunat","Umami"],"sprache":"de",
                "plan":{"mo":"Service A","tu":"Service A","we":"Service B","th":"Service B"}}],
 "studierende":[
  {"nr":"1001","nachname":"Muster","vorname":"Max","nickname":"Maxi","klasse":"HFE1","gruppe":"Gruppe 1 Team A","sprache":"en","einsaetze":[
    {"bereich":"kueche","outlet":"Patisserie","von":"2026-08-17","bis":"2026-08-24","variante":"5T","block":"Zyklus 1.1",
     "tage":[T("2026-08-17","Patisserie"),T("2026-08-18","Patisserie"),T("2026-08-19","Patisserie"),T("2026-08-20","Patisserie"),T("2026-08-24","Patisserie")]},
    {"bereich":"kueche","outlet":"Patisserie","von":"2026-08-25","bis":EX,"variante":"4T","block":"Zyklus 1.1","exam":EX,
     "tage":[T("2026-08-25","Patisserie"),T("2026-08-26","Patisserie"),T("2026-08-27","Patisserie"),T("2026-08-31","Patisserie")]},
    {"bereich":"service","outlet":"Da Fortunat","von":"2026-09-02","bis":"2026-09-17","variante":"10T","block":"Zyklus 1.2","exam":"2026-09-17",
     "tage":[T(d,"Da Fortunat") for d in ["2026-09-02","2026-09-03","2026-09-07","2026-09-08","2026-09-09","2026-09-10","2026-09-14","2026-09-15","2026-09-16"]]}]},
  {"nr":"1002","nachname":"van der Berg","vorname":"Lea","klasse":"HFD","gruppe":"Gruppe 2 Team B","sprache":"de","einsaetze":[
    {"bereich":"kueche","outlet":"Patisserie","von":"2026-08-25","bis":EX,"variante":"4T","block":"Zyklus 1.1","exam":EX,
     "tage":[T("2026-08-25","Patisserie"),T("2026-08-26","Patisserie"),T("2026-08-27","Patisserie"),T("2026-08-31","Patisserie")]},
    {"bereich":"kueche","outlet":"The Essence","von":"2026-09-02","bis":"2026-09-17","variante":"10T","block":"Zyklus 1.2","exam":"2026-09-17",
     "tage":[T(d,"The Essence") for d in ["2026-09-02","2026-09-03","2026-09-07","2026-09-08","2026-09-09","2026-09-10","2026-09-14","2026-09-15","2026-09-16"]]}]}]}

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---------- 1 Cockpit: Semesterpakete ----------
    c = b.new_context(accept_downloads=True); c.route("https://cdnjs.cloudflare.com/**", libs); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(U + "cockpit.html"); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    pg.evaluate("(f)=>{ FOTOS.byNr['1001'] = f; FOTOS.byNr['1002'] = f; FOTOS.n = 2; }", FOTO)
    sp = pg.evaluate("()=>semesterPackages()")
    names = [x["name"] for x in sp]
    ok("Cockpit: ein Semesterpaket pro Person", sorted(names) == ["Chef Essence", "Koch Pat", "Service A / Service B"], names)
    pat = [x for x in sp if x["name"] == "Koch Pat"][0]; d = pat["data"]
    ok("Semesterpaket: Format und Dozent", d["format"] == "praxisrapport-semesterpaket" and d["dozent"]["name"] == "Koch Pat", d["dozent"])
    ok("Semesterpaket Patisserie: 5T und 4T in zeitlicher Reihenfolge", [x["variante"] for x in d["pakete"]] == ["5T", "4T"], [x["variante"] for x in d["pakete"]])
    ok("Paket-Titel nennt den Zyklus", all("Zyklus 1.1" in x["titel"] for x in d["pakete"]), [x["titel"] for x in d["pakete"]])
    p4 = d["pakete"][1]["paket"]
    ok("4T: slotDates = 4 Einsatztage + Exam Day", p4["settings"].get("slotDates") == ["2026-08-25","2026-08-26","2026-08-27","2026-08-31",EX], p4["settings"].get("slotDates"))
    ok("4T: paketId gesetzt, gleich der Paket-ID", p4["settings"].get("paketId") == d["pakete"][1]["id"] and p4["settings"]["paketId"], p4["settings"].get("paketId"))
    ok("4T: beide Personen mit Foto", all(s.get("foto", "").startswith("data:image/") for s in p4["students"]), len(p4["students"]))
    ok("Ziel-Dateien: Mobil und Laptop passend zur Variante", d["pakete"][1]["mobil"].endswith("Kuechenrapport_Mobil_4Tage_Exam.html") and d["pakete"][1]["laptop"].endswith("Kuechenrapport_4Tage_Exam.html"), d["pakete"][1]["mobil"])
    ok("Startseiten-Link zeigt auf mein.html", pat["link"].split("#")[0].endswith("mein.html"), pat["link"])
    pg.evaluate("()=>renderSem()"); ok("Cockpit: Liste der Semesterpakete sichtbar", pg.locator("#semList tr").count() == 4, pg.locator("#semList tr").count())
    with pg.expect_download() as dl: pg.click("#btnSem")
    ok("Cockpit: ZIP mit Semesterpaketen", dl.value.suggested_filename == "Semesterpakete_TEST.zip", dl.value.suggested_filename)
    ok("Cockpit: keine JavaScript-Fehler", not errs, errs); c.close()
    svc = [x for x in sp if x["name"] == "Service A / Service B"][0]["data"]

    # ---------- 2 mein.html -> Mobil (Kueche 4T) ----------
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    dialogs = []; pg.on("dialog", lambda dg: (dialogs.append(dg.message), dg.accept() if ACCEPT[0] else dg.dismiss()))
    ACCEPT = [True]
    pg.goto(U + "mein.html")
    ok("mein.html: ohne Paket Hinweis zum Laden", pg.locator("#main .btn.pri").count() == 1)
    pg.set_input_files("#file", files=[{"name":"Semesterpaket.json","mimeType":"application/json","buffer":json.dumps(d).encode()}]); pg.wait_for_timeout(400)
    pg.reload(); pg.wait_for_timeout(400)
    txt = pg.inner_text("#main")
    ok("mein.html: Paket bleibt nach Neuladen (IndexedDB)", "Zyklus 1.1" in txt and "Koch Pat" in pg.inner_text("#who"), pg.inner_text("#who"))
    ok("mein.html: beide Pakete in der Liste", pg.locator("#main li").count() == 2, pg.locator("#main li").count())
    ok("mein.html: Semesterpaket nicht im localStorage", pg.evaluate("()=>localStorage.getItem('praxisrapport.semester')") is None)
    pg.locator("#main li").nth(1).locator("button").click(); pg.wait_for_load_state(); pg.wait_for_timeout(700)
    ok("Uebergabe: richtige Datei geoeffnet (Mobil 4T)", pg.url.split("#")[0].endswith("Kuechenrapport_Mobil_4Tage_Exam.html"), pg.url)
    r = pg.evaluate("()=>({n:S.students.length, id:S.settings.paketId, lab:slots().map(s=>slotLabel(s,'de')), sw:[...document.querySelectorAll('.sw')].map(x=>x.textContent), ho:localStorage.getItem('praxisrapport.handoff')})")
    ok("Uebergabe: zwei Personen geladen, paketId gesetzt", r["n"] == 2 and r["id"] == d["pakete"][1]["id"], r)
    ok("Uebergabe: Uebergabe-Eintrag danach geloescht", r["ho"] is None)
    ok("Mobil: Wochentag + Datum statt Woche", r["lab"][0] == "Dienstag 25.08." and r["lab"][3] == "Montag 31.08." and r["lab"][4].endswith("01.09."), r["lab"])
    ok("Mobil: Tagesleiste zeigt Datum, keine Woche", r["sw"][:2] == ["25.08.", "26.08."] and not any("Woche" in x for x in r["sw"]), r["sw"])

    # Noten im Mobil: Baustein setzen, Wirkung sichtbar
    g = pg.evaluate("""()=>{ const sid = S.students[0].id, s1 = slots()[0].id; curSlot = s1; openSlot(s1);
        S.days[s1][sid].obs = ['hyg-n1']; persist(); render();
        const pill = document.querySelector('#view .gpill'); openSheet(S.students[0]);
        const head = document.getElementById('n2grade').textContent;
        const ava = !!document.querySelector('.sheet-h img.ava');
        const cg = [...document.querySelectorAll('.critbar .cg')].map(x=>x.textContent);
        const w = [...document.querySelectorAll('.sheet .w')].map(x=>x.textContent).find(x=>x.includes('−0.50'));
        return {day:n2Day(s1, sid), pill: pill && pill.textContent, head, ava, cg, w, crit:n2Crit(s1, sid), n:CRITS.length}; }""")
    k = g["n"]; exp = (2*4.5 + (k-1)*5) / (k+1)
    ok("Mobil: Tagesnote mit Hygiene doppelt (4.50 bei −0.50)", abs(g["day"] - exp) < 1e-9 and g["crit"]["hyg"] == 4.5, (g["day"], exp))
    ok("Mobil: Note in der Liste sichtbar", g["pill"] == "%.2f" % exp, g["pill"])
    ok("Mobil: Note im Kopf des Erfassungsblatts", g["head"].startswith("Tag %.2f" % exp), g["head"])
    ok("Mobil: Foto im Erfassungsblatt", g["ava"])
    ok("Mobil: Kriteriennoten in den Reitern", "4.50" in g["cg"] and len(g["cg"]) == k, g["cg"])
    ok("Mobil: Wirkung des Bausteins sichtbar (−0.50)", bool(g["w"]), g["w"])
    pg.evaluate("()=>{ document.getElementById('sheetHost').innerHTML=''; document.body.style.overflow=''; }")
    pg.click("#btnGrades"); pg.wait_for_timeout(150)
    v = pg.inner_text("#view")
    ok("Mobil: Notenuebersicht mit Ø Praxis, Exam, Schlussnote", "Ø Praxis" in v and "Schlussnote" in v and pg.locator("#view .gbox").count() == 2, v[:80])
    ok("Mobil: Notenuebersicht mit Fotos", pg.locator("#view img.ava").count() == 2, pg.locator("#view img.ava").count())
    # Laptop rechnet gleich
    st = pg.evaluate("()=>JSON.stringify({settings:S.settings, students:S.students, days:S.days, dayMeta:S.dayMeta})")
    days = json.loads(st)["days"]

    # gleiches Paket nochmals -> nichts passiert; anderes Paket -> Rueckfrage
    pg.goto(U + "mein.html"); pg.wait_for_timeout(400)
    pg.locator("#main li").nth(1).locator("button").click(); pg.wait_for_load_state(); pg.wait_for_timeout(600)
    r = pg.evaluate("()=>Object.keys(S.days).length")
    ok("Gleiches Paket erneut oeffnen: Erfassung bleibt, keine Rueckfrage", r == 1 and not dialogs, (r, dialogs))
    pg.goto(U + "mein.html"); pg.wait_for_timeout(400)
    pg.evaluate("()=>{ SEM.pakete[1] = Object.assign({}, SEM.pakete[1], {id:'anderes', titel:'Anderes Paket'}); openPack(SEM.pakete[1], false); }")
    ACCEPT[0] = False; pg.wait_for_load_state(); pg.wait_for_timeout(600)
    r = pg.evaluate("()=>({d:Object.keys(S.days).length, id:S.settings.paketId})")
    ok("Anderes Paket bei erfassten Tagen: Rueckfrage, Abbruch behaelt Daten", len(dialogs) == 1 and r["d"] == 1 and r["id"] != "anderes", (dialogs[:1], r))
    ok("mein.html / Mobil: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------- 3 mein.html -> Laptop ----------
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
    pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(d).encode()}]); pg.wait_for_timeout(400)
    pg.evaluate("()=>openPack(SEM.pakete[1], true)"); pg.wait_for_load_state(); pg.wait_for_timeout(700)
    r = pg.evaluate("()=>({u:location.pathname, n:S.students.length, lab:slots().map(s=>slotLabel(s,'de')), view})")
    ok("Laptop: Uebergabe in die Laptop-Datei 4T", r["u"].endswith("Kuechenrapport_4Tage_Exam.html") and r["n"] == 2, r)
    ok("Laptop: Wochentag + Datum", r["lab"][0] == "Dienstag 25.08." and r["lab"][4].startswith("Exam"), r["lab"])
    lt = pg.evaluate("""(days)=>{ S.days = days; const sid = S.students[0].id, s1 = slots()[0].id; return dayTotal(s1, sid); }""", days)
    ok("Laptop und Mobil rechnen gleich", abs(lt - exp) < 1e-9, (lt, exp))
    ok("Laptop: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------- 4 Service: Foto, Noten, Datum ----------
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
    pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(svc).encode()}]); pg.wait_for_timeout(400)
    pg.evaluate("()=>openPack(SEM.pakete[0], false)"); pg.wait_for_load_state(); pg.wait_for_timeout(700)
    g = pg.evaluate("""()=>{ const s = S.students[0], s1 = slots()[0].id; curSlot = s1; openSlot(s1); render(); openSheet(s);
        return {u:location.pathname, lab:slotLabel(slots()[0],'de'), ava:!!document.querySelector('.sheet-h img.ava'), head:document.getElementById('n2grade').textContent,
                cg:document.querySelectorAll('.critbar .cg').length, n:CRITS.length, dbl:N2_DOUBLE}; }""")
    ok("Service: Mobil 10T geoeffnet", g["u"].endswith("Servicerapport_Mobil.html"), g["u"])
    ok("Service: Mittwoch 02.09. statt Woche", g["lab"] == "Mittwoch 02.09.", g["lab"])
    ok("Service: Foto im Erfassungsblatt", g["ava"])
    ok("Service: Tagesnote 5.00 im Kopf, Kriteriennoten sichtbar", g["head"].startswith("Tag 5.00") and g["cg"] == g["n"], g)
    ok("Service: Gastgeberhaltung doppelt gewichtet", g["dbl"] == "gas", g["dbl"])
    ok("Service: keine JavaScript-Fehler", not errs, errs); c.close()
    b.close()
srv.shutdown()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Noten2.txt").write_text("PRUEFUNG NOTEN 2.0 (Datum, Noten, Fotos, Semesterpaket) %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + "\n".join(res) + "\n", encoding="utf-8")
