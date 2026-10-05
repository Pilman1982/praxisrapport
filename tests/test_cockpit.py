# -*- coding: utf-8 -*-
"""Cockpit: Plan pruefen, Fotos zuordnen, Pakete erzeugen und in den Apps laden, Eingangskontrolle."""
import pathlib, json, zipfile, io
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent
D = R/"docs"; LIB = pathlib.Path("/tmp/claude-0/libs/node_modules")
PLAN = (R/"testdaten/turnusplan_BEISPIEL.json").read_text(encoding="utf-8")
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-66s %s" % (n, str(i)[:130]))
def libs(route):
    u = route.request.url
    f = LIB/"pdfjs-dist/build/pdf.worker.min.js" if "pdf.worker" in u else LIB/"pdfjs-dist/build/pdf.min.js" if "pdf.js" in u else LIB/"jszip/dist/jszip.min.js" if "jszip" in u else None
    if f: route.fulfill(path=str(f), content_type="application/javascript")
    else: route.abort()
with sync_playwright() as p:
    b = p.chromium.launch()
    c = b.new_context(accept_downloads=True); c.route("https://cdnjs.cloudflare.com/**", libs)
    pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"cockpit.html").as_uri()); pg.wait_for_timeout(500)
    pg.fill("#planText", "```json\n" + PLAN + "\n```"); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    st = pg.evaluate("()=>({n:PLAN.studierende.length, packs:PACKS.length, err:ISSUES.filter(i=>i.lv==='err').map(i=>i.m), warn:ISSUES.filter(i=>i.lv==='warn').map(i=>i.m)})")
    ok("Plan mit Codeblock-Rahmen wird gelesen, 30 Personen", st["n"] == 30, st["n"])
    ok("Keine Fehler im Beispielplan", not st["err"], st["err"])
    ok("Pakete gebildet (Kueche 5 Outlets + Halbturnus, Service 3)", st["packs"] >= 8, st["packs"])
    packs = pg.evaluate("()=>PACKS.map(p=>({b:p.ber,o:p.outlet,o2:p.outlet2,v:p.v,n:p.studs.length,d:p.doz&&p.doz.name,si:p.startIdx}))")
    svc = [x for x in packs if x["b"] == "service" and x["o2"]]
    ok("Service Umami + Da Fortunat als ein Paket mit zweitem Restaurant", len(svc) == 1 and svc[0]["o2"] == "Da Fortunat", svc)
    ok("Halbturnus Kueche: 5T- und 4T-Paket vorhanden", any(x["v"]=="5T" for x in packs) and any(x["v"]=="4T" for x in packs), [x for x in packs if x["v"]!="10T"])
    # Fehler erkennen
    bad = json.loads(PLAN); bad["studierende"][0]["einsaetze"][0]["variante"] = "7T"; bad["studierende"][1]["nr"] = bad["studierende"][2]["nr"]
    bad["studierende"][4]["einsaetze"][0]["bis"] = "2026-10-20"
    pg.fill("#planText", json.dumps(bad, ensure_ascii=False)); pg.click("#btnPlan"); pg.wait_for_timeout(200)
    e = pg.evaluate("()=>ISSUES.map(i=>i.lv+': '+i.m)")
    ok("Erkennt falsche Variante", any("7T" in x for x in e), "")
    ok("Erkennt doppelte Nummer", any("doppelt" in x for x in e), "")
    ok("Warnt bei falscher Anzahl Einsatztage", any("Einsatztage" in x and "erwartet 10" in x for x in e), "")
    pg.fill("#planText", PLAN); pg.click("#btnPlan"); pg.wait_for_timeout(200)
    # Fotos
    pg.set_input_files("#pdfFile", str(R/"testdaten/Fotoliste_BEISPIEL.pdf")); pg.wait_for_timeout(4000)
    nf = pg.evaluate("()=>[FOTOS.n, PLAN.studierende.filter(s=>fotoFor(s)).length]")
    ok("Fotos aus PDF gelesen und per Nummer zugeordnet (20)", nf == [20, 20], nf)
    sz = pg.evaluate("()=>{ const f = fotoFor(PLAN.studierende[0]); return f ? f.length : 0; }")
    ok("Foto ist klein (unter 20 kB)", 0 < sz < 20000, sz)
    ok("Fotos in der Uebersicht sichtbar", pg.locator("#overview img.ava").count() >= 20, pg.locator("#overview img.ava").count())
    pg.screenshot(path="/tmp/claude-0/cockpit.png", full_page=False)
    # Suche
    pg.fill("#search", "Ethan"); pg.wait_for_timeout(100)
    ok("Suche nach Nickname findet die Person in Kueche und Service", pg.locator("#overview tr.hit").count() == 2, pg.locator("#overview tr.hit").count())
    pg.fill("#search", "")
    # ZIP
    with pg.expect_download() as dl: pg.click("#btnZip")
    z = zipfile.ZipFile(io.BytesIO(pathlib.Path(dl.value.path()).read_bytes()))
    names = z.namelist()
    ok("ZIP enthaelt alle Pakete und Startlinks.txt", "Startlinks.txt" in names and len(names) == st["packs"] + 1, names)
    umami_k = [n for n in names if "Kueche_Umami_10T" in n][0]
    pk = json.loads(z.read(umami_k)); svc_n = [n for n in names if "Umami-Da-Fortunat" in n][0]; pks = json.loads(z.read(svc_n))
    ok("Paket Kueche Umami: Sprache Thai, Dozent, Start Montag", pk["settings"]["uiLang"] == "th" and pk["settings"]["teacher"] == "Koch Umami" and pk["settings"]["startIdx"] == 0, pk["settings"])
    ok("Paket enthaelt Fotos", sum(1 for s in pk["students"] if s.get("foto")) >= 1, sum(1 for s in pk["students"] if s.get("foto")))
    ok("Service-Paket: outlet2 und Wochentagsplan", pks["settings"].get("outlet2") == "Da Fortunat" and pks["settings"].get("teacherPlan", {}).get("we") == "Service B", pks["settings"])
    ok("Service-Paket: Wechsel ab Einsatztag 5 bei geplanten Personen", any(s.get("wechselAb") == 5 for s in pks["students"]), [s.get("wechselAb") for s in pks["students"]])
    links = z.read("Startlinks.txt").decode("utf-8")
    ok("Startlink Service enthaelt outlet2 und plan", "outlet2=Da%20Fortunat" in links and "plan=mo:Service%20A" in links, "")
    errs_c = list(errs); c.close()
    pathlib.Path("/tmp/claude-0/pk_kueche.json").write_text(json.dumps(pk), encoding="utf-8")
    pathlib.Path("/tmp/claude-0/pk_service.json").write_text(json.dumps(pks), encoding="utf-8")
    # Paket in der App laden: Kueche mobil
    c = b.new_context(viewport={"width":390,"height":844}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"kueche/Kuechenrapport_Mobil.html").as_uri()); pg.wait_for_timeout(300)
    pg.evaluate("()=>{view='set';render();}")
    fi = pg.locator("input[type=file]").first; fi.set_input_files("/tmp/claude-0/pk_kueche.json"); pg.wait_for_timeout(500)
    r = pg.evaluate("()=>({n:S.students.length, l:S.settings.uiLang, t:S.settings.teacher, foto:S.students.filter(s=>s.foto).length})")
    ok("Kueche mobil: Paket laden ergibt Personen, Thai, Dozent", r["n"] == len(pk["students"]) and r["l"] == "th" and r["t"] == "Koch Umami", r)
    pg.evaluate("()=>{view='day';render();}"); pg.wait_for_timeout(200)
    if pg.locator("button.btn.pri.wide").count(): pg.locator("button.btn.pri.wide").first.click(); pg.wait_for_timeout(200)
    ok("Kueche mobil: Fotos und Nicknames in der Liste", pg.locator(".srow img.ava").count() == r["foto"] and r["foto"] > 0, pg.locator(".srow img.ava").count())
    pg.screenshot(path="/tmp/claude-0/mobil_fotos.png")
    ok("Kueche mobil: keine JavaScript-Fehler", not errs, errs); c.close()
    # Paket in der App laden: Service Laptop
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"service/Servicerapport.html").as_uri()); pg.wait_for_timeout(300)
    pg.evaluate("()=>{view='set';render();}")
    pg.set_input_files("#restoreFile", "/tmp/claude-0/pk_service.json"); pg.wait_for_timeout(300)
    if pg.evaluate("()=>S.students.length") != len(pks["students"]):   # zweiter Klick bei vorhandenen Daten
        pg.set_input_files("#restoreFile", "/tmp/claude-0/pk_service.json"); pg.wait_for_timeout(300)
    r = pg.evaluate("""()=>{ const sl=slots(); sl.forEach(s=>openSlot(s.id));
        const w = S.students.find(s=>s.wechselAb);
        return {n:S.students.length, o2:S.settings.outlet2, w: w ? [outletOfDay(sl[3].id,w.id), outletOfDay(sl[4].id,w.id), placementText(w.id,'de')] : null,
                foto:S.students.filter(s=>s.foto).length}; }""")
    ok("Service Laptop: Paket einlesen, zweites Restaurant gesetzt", r["n"] == len(pks["students"]) and r["o2"] == "Da Fortunat", r)
    ok("Service Laptop: Wechselplan ab Tag 5 automatisch", r["w"] and r["w"][0] == "Umami" and r["w"][1] == "Da Fortunat", r["w"])
    ok("Service Laptop: Fotos bleiben erhalten", r["foto"] >= 1, r["foto"])
    snap = pg.evaluate("()=>JSON.stringify(snapshot())")
    ok("Service Laptop: keine JavaScript-Fehler", not errs, errs); c.close()
    pathlib.Path("/tmp/claude-0/rep_service.json").write_text(snap, encoding="utf-8")
    # Eingangskontrolle
    c = b.new_context(); c.route("https://cdnjs.cloudflare.com/**", libs); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"cockpit.html").as_uri()); pg.wait_for_timeout(300)
    pg.fill("#planText", PLAN); pg.click("#btnPlan")
    pg.set_input_files("#repFile", "/tmp/claude-0/rep_service.json"); pg.wait_for_timeout(300)
    ok("Eingangskontrolle: Rapport erscheint in der Tabelle", pg.locator("#reports tr").count() == 2, pg.locator("#reports tr").count())
    ok("Eingangskontrolle: Paket zeigt 'Rapport da'", pg.locator("text=Rapport da").count() == 1, pg.locator("text=Rapport da").count())
    ok("Cockpit: keine JavaScript-Fehler", not errs and not errs_c, errs + errs_c); c.close()
    b.close()
print("\n".join(res)); n = sum(x.startswith("OK") for x in res); print(n, "von", len(res))
(R/"tests"/"Testprotokoll_Cockpit.txt").write_text("PRUEFUNG COCKPIT 05.10.2026\n\n" + "\n".join(res) + "\n", encoding="utf-8")

# ---- Teil hinzufuegen ----
with sync_playwright() as p:
    b = p.chromium.launch(); c = b.new_context(); c.route("https://cdnjs.cloudflare.com/**", libs); pg = c.new_page()
    P = json.loads(PLAN); a = dict(P); a["studierende"] = P["studierende"][:10]; t = dict(P); t["studierende"] = P["studierende"][10:]; t.pop("dozierende")
    pg.goto((D/"cockpit.html").as_uri()); pg.fill("#planText", json.dumps(a)); pg.click("#btnPlan")
    pg.fill("#planText", json.dumps(t)); pg.click("#btnAdd"); pg.wait_for_timeout(200)
    r = pg.evaluate("()=>[PLAN.studierende.length, PACKS.length, ISSUES.filter(i=>i.lv==='err').length]")
    pg.fill("#planText", json.dumps(t)); pg.click("#btnAdd"); pg.wait_for_timeout(200)
    r2 = pg.evaluate("()=>PLAN.studierende.length")
    ok2 = r == [30, 10, 0] and r2 == 30
    res.append(("OK      " if ok2 else "FEHLER  ") + "Teil hinzufuegen: 10 + 20 = 30, doppelter Teil ersetzt statt verdoppelt  " + str([r, r2]))
    b.close()
print(res[-1])
(R/"tests"/"Testprotokoll_Cockpit.txt").write_text("PRUEFUNG COCKPIT 05.10.2026\n\n" + "\n".join(res) + "\n%d von %d bestanden.\n" % (sum(x.startswith("OK") for x in res), len(res)), encoding="utf-8")
