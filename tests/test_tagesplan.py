# -*- coding: utf-8 -*-
"""Tagesplan: Ort und Team Market pro Einsatztag aus dem Turnusplan bis in die Apps; Gruppen 'Gruppe 1 Team A'."""
import pathlib, json
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-64s %s" % (n, str(i)[:120]))
T = lambda d, o, m=False: dict(datum=d, outlet=o, **({"market": True} if m else {}))
plan = {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th"],
 "dozierende":[{"name":"Service A / Service B","bereich":"service","outlets":["Da Fortunat","Umami"],"sprache":"de"},
               {"name":"Koch DF","bereich":"kueche","outlets":["Da Fortunat"],"sprache":"de"},{"name":"Koch U","bereich":"kueche","outlets":["Umami"],"sprache":"th"}],
 "studierende":[{"nr":"1","nachname":"Muster","vorname":"Max","nickname":"Maxi","klasse":"HFE1","gruppe":"gr1 a","sprache":"en","einsaetze":[
   {"bereich":"service","outlet":"Da Fortunat","von":"2026-11-02","bis":"2026-11-17","variante":"10T","block":"W5","exam":"2026-11-17",
    "tage":[T("2026-11-02","Da Fortunat"),T("2026-11-03","Umami"),T("2026-11-04","Da Fortunat"),T("2026-11-05","Da Fortunat",True),T("2026-11-09","Umami"),
            T("2026-11-10","Umami"),T("2026-11-11","Da Fortunat"),T("2026-11-12","Da Fortunat"),T("2026-11-16","Umami")]},
   {"bereich":"kueche","outlet":"Da Fortunat","von":"2026-11-18","bis":"2026-11-24","variante":"5T","block":"W6",
    "tage":[T("2026-11-18","Da Fortunat",True),T("2026-11-19","Da Fortunat"),T("2026-11-23","Da Fortunat"),T("2026-11-24","Da Fortunat"),T("2026-11-25","Da Fortunat")]},
   {"bereich":"kueche","outlet":"Umami","von":"2026-11-26","bis":"2026-12-03","variante":"4T","block":"W6","exam":"2026-12-03",
    "tage":[T("2026-11-26","Umami"),T("2026-11-30","Umami",True),T("2026-12-01","Umami"),T("2026-12-02","Umami")]}]}]}
with sync_playwright() as p:
    b = p.chromium.launch(); c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    pg.goto((D/"cockpit.html").as_uri()); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    r = pg.evaluate("()=>({iss:ISSUES.filter(i=>i.lv==='err').map(i=>i.m), packs:PACKS.map(p=>[p.block,p.ber,p.v,p.outlet,p.outlet2]), g:PLAN.studierende[0].gruppe})")
    ok("Keine Fehler, Halbturnus im selben Block ueberschneidet sich nicht", not r["iss"], r["iss"])
    ok("Drei Pakete: Service W5, Kueche W6 5T und 4T", len(r["packs"]) == 3, r["packs"])
    ok("Gruppe 'gr1 a' wird zu 'Gruppe 1 Team A'", r["g"] == "Gruppe 1 Team A", r["g"])
    pk = pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")
    svc = [x for x in pk if x["app"] == "Servicerapport"][0]; k5 = [x for x in pk if x["variant"] == "5T"][0]
    st = svc["students"][0]
    ok("Service: ortPlan markiert die Umami-Tage", st.get("ortPlan") == ["", "Umami", "", "", "Umami", "Umami", "", "", "Umami"], st.get("ortPlan"))
    ok("Service: Team Market an Tag 4", st.get("tmTage") == [4], st.get("tmTage"))
    ok("Kueche 5T: Team Market an Tag 1, kein ortPlan", k5["students"][0].get("tmTage") == [1] and "ortPlan" not in k5["students"][0], k5["students"][0])
    c.close()
    for app, pkg, check in (("service/Servicerapport_Mobil.html", svc, "svc"), ("service/Servicerapport.html", svc, "svc"), ("kueche/Kuechenrapport_Mobil_5Tage_ohneExam.html", k5, "k5"), ("kueche/Kuechenrapport_5Tage_ohneExam.html", k5, "k5")):
        c = b.new_context(); pg = c.new_page(); errs2 = []; pg.on("pageerror", lambda e: errs2.append(str(e)))
        pg.goto((D/app).as_uri()); pg.wait_for_timeout(300)
        r = pg.evaluate("""(o)=>{ S.settings = Object.assign(S.settings, o.settings); S.students = o.students.map(s=>Object.assign({}, s)); S.days = {};
            if(typeof saubereStudierende === 'function') S.students = saubereStudierende(S.students);
            const sl = slots(); sl.forEach(x=>openSlot(x.id)); const s = S.students[0];
            return {att: sl.map(x=>S.days[x.id][s.id].att), ort: sl.map(x=>S.days[x.id][s.id].outlet||'')}; }""", pkg)
        if check == "svc":
            ok(app + ": Umami an Tag 2, 5, 6, 9", [i+1 for i, o in enumerate(r["ort"][:9]) if o == "Umami"] == [2, 5, 6, 9], r["ort"])
            ok(app + ": Team Market an Tag 4 vorbelegt", r["att"][3] == "tm" and r["att"].count("tm") == 1, r["att"])
        else:
            ok(app + ": Team Market an Tag 1 vorbelegt", r["att"][0] == "tm" and r["att"].count("tm") == 1, r["att"])
        ok(app + ": keine JavaScript-Fehler", not errs2, errs2); c.close()
    b.close()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Tagesplan.txt").write_text("PRUEFUNG TAGESPLAN 05.10.2026\n\n" + "\n".join(res) + "\n", encoding="utf-8")
