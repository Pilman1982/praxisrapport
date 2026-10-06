# -*- coding: utf-8 -*-
"""Laptop-Fassungen starten ohne Startseite; Wechsel Tablet <-> Laptop übernimmt den Stand in beide Richtungen."""
import pathlib, json, threading, functools, http.server, socketserver, datetime
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-70s %s" % (n, str(i)[:130]))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(D))); U = "http://127.0.0.1:%d/" % srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

FILES = [a + "/" + f for a, fs in (("kueche", ["Kuechenrapport", "Kuechenrapport_4Tage_Exam", "Kuechenrapport_5Tage_ohneExam"]),
                                   ("service", ["Servicerapport", "Servicerapport_4Tage_Exam", "Servicerapport_5Tage_ohneExam"])) for f in fs]
T = lambda d, o: dict(datum=d, outlet=o)
EX = "2026-10-13"; D4 = ["2026-09-29", "2026-09-30", "2026-10-01", "2026-10-12"]
plan = {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th"],
 "dozierende":[{"name":"Muster Koch","bereich":"kueche","outlets":["Patisserie"],"sprache":"de"}],
 "studierende":[{"nr":str(1000+i),"nachname":n,"vorname":v,"klasse":"HFD","gruppe":"Gruppe 1 Team A","sprache":"de","einsaetze":[
   {"bereich":"kueche","outlet":"Patisserie","von":D4[0],"bis":EX,"variante":"4T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"Patisserie") for d in D4]}]}
   for i, (n, v) in enumerate([("Ammann","Lea"),("Frei","Anouk"),("Keller","Timo")])]}

with sync_playwright() as p:
    b = p.chromium.launch()
    # 1 · alle Fassungen starten ohne Startseite
    for f in FILES:
        for mob in (False, True):
            name = f.replace("rapport", "rapport_Mobil", 1) if mob else f
            c = b.new_context(viewport={"width":1280,"height":800}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(U + name + ".html"); pg.wait_for_timeout(500)
            if mob: r = pg.evaluate("()=>document.getElementById('view').innerHTML.length")
            else: r = pg.evaluate("()=>document.getElementById('v-day').innerHTML.length + (document.getElementById('brandLogo').src ? 0 : -99999)")
            sw = pg.locator("#btnSwitch").count()
            ok(name + ": startet, Inhalt sichtbar, Umschalter da", r > 200 and sw == 1 and not errs, (r, sw, errs[:1]))
            c.close()
    # 2 · Paket aus dem Cockpit, Tablet -> Laptop -> Tablet
    c = b.new_context(viewport={"width":1280,"height":900}); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("dialog", lambda d: d.accept())
    pg.goto(U + "cockpit.html"); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    sem = pg.evaluate("()=>semesterPackages()[0].data")
    pg.goto(U + "mein.html"); pg.set_input_files("#file", files=[{"name":"s.json","mimeType":"application/json","buffer":json.dumps(sem).encode()}]); pg.wait_for_timeout(400)
    pg.evaluate("()=>openPack(SEM.pakete[0], false)"); pg.wait_for_load_state(); pg.wait_for_timeout(700)
    pg.evaluate("""()=>{ const s1 = slots()[0].id; openSlot(s1); S.days[s1][S.students[0].id].obs = ['hyg-n1']; S.days[s1][S.students[1].id].att = 'late'; persist(); render(); }""")
    m = pg.evaluate("()=>({n:S.students.length, d:n2Day(slots()[0].id, S.students[0].id)})")
    pg.click("#btnSwitch"); pg.wait_for_load_state(); pg.wait_for_timeout(800)
    r = pg.evaluate("()=>({u:location.pathname, n:S.students.length, obs:(S.days[slots()[0].id]||{})[S.students[0].id], att:((S.days[slots()[0].id]||{})[S.students[1].id]||{}).att, lab:slotLabel(slots()[0],'de'), t:dayTotal(slots()[0].id, S.students[0].id), foto:!!S.students[0].foto, v:document.getElementById('v-day').innerHTML.length})")
    ok("Tablet -> Laptop: richtige Datei (4 Tage + Exam)", r["u"].endswith("/kueche/Kuechenrapport_4Tage_Exam.html"), r["u"])
    ok("Tablet -> Laptop: Personen, Beobachtung und Verspätung übernommen", r["n"] == 3 and r["obs"] and r["obs"].get("obs") == ["hyg-n1"] and r["att"] == "late", r)
    ok("Tablet -> Laptop: Datum und gleiche Note", r["lab"] == "Dienstag 29.09." and abs(r["t"] - m["d"]) < 1e-9 and r["v"] > 200, (r["lab"], r["t"], m["d"]))
    pg.evaluate("""()=>{ const s2 = slots()[1].id; openSlot(s2); S.days[s2][S.students[2].id].obs = ['hyg-n2']; persist(); render(); }""")
    pg.click("#btnSwitch"); pg.wait_for_load_state(); pg.wait_for_timeout(800)
    r = pg.evaluate("()=>({u:location.pathname, a:(S.days[slots()[0].id]||{})[S.students[0].id], b:(S.days[slots()[1].id]||{})[S.students[2].id], view:document.getElementById('view').innerHTML.length})")
    ok("Laptop -> Tablet: zurück in der Mobil-Datei", r["u"].endswith("/kueche/Kuechenrapport_Mobil_4Tage_Exam.html"), r["u"])
    ok("Laptop -> Tablet: Erfassung von beiden Seiten vorhanden", r["a"] and r["a"].get("obs") == ["hyg-n1"] and r["b"] and r["b"].get("obs") == ["hyg-n2"] and r["view"] > 200, r)
    ok("Wechsel: keine JavaScript-Fehler", not errs, errs[:2]); c.close()
    b.close()
srv.shutdown()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Laptop_Wechsel.txt").write_text("PRUEFUNG LAPTOP UND WECHSEL TABLET/LAPTOP %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + "\n".join(res) + "\n", encoding="utf-8")
