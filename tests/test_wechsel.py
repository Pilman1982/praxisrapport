# -*- coding: utf-8 -*-
"""Service: Restaurantwechsel pro Person und Einsatztag."""
import pathlib
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent
LIST = (R/"testdaten/Testklasse_ANONYM.txt").read_text(encoding="utf-8")
D = R/"src/dist"; res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-64s %s" % (n, str(i)[:130]))
APPLY = """(sel) => {const ta=document.querySelector(sel);const b=[...document.querySelectorAll('button.pri')]
    .find(b=>ta.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);b.click();}"""
def load(pg, sel):
    pg.evaluate("()=>{view='set';render();}"); pg.fill(sel, LIST); pg.evaluate(APPLY, sel)
with sync_playwright() as p:
    b = p.chromium.launch()
    # ---------- Laptop 10T ----------
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"Servicerapport.html").as_uri()); pg.wait_for_timeout(300)
    load(pg, "#fStud")
    pg.evaluate("()=>{view='set';render();}")
    ok("Laptop: Feld 'Zweites Restaurant' im Reiter Eintragen", pg.locator("#fOutlet2").count() == 1)
    pg.fill("#fOutlet", "Umami"); pg.fill("#fOutlet2", "Da Fortunat")
    r = pg.evaluate("""()=>{ const sl = slots(); const chen = S.students.find(s=>s.nachname==='Chen');
        for(let i=0;i<5;i++) openSlot(sl[i].id);
        openSlot(sl[5].id); toggleOutlet(S.days[sl[5].id][chen.id]);
        for(let i=6;i<10;i++) openSlot(sl[i].id);
        S.days[sl[6].id][chen.id].att = 'late';
        const amm = S.students.find(s=>s.nachname==='Ammann');
        return {chen: placementText(chen.id,'de'), en: placementText(chen.id,'en'), zh: placementText(chen.id,'zh'),
                amm: placementText(amm.id,'de'), d10: S.days[sl[9].id][chen.id].outlet||'',
                abs: absenceList(sl[6].id).map(absenceZeile), rep: buildReport(chen,'all','de')}; }""")
    ok("Laptop: Wechsel ab Tag 6 bleibt bis Tag 10 erhalten", r["d10"] == "Da Fortunat", r["d10"])
    ok("Laptop: Einsatzorte DE", r["chen"] == "Umami (Tag 1–5), Da Fortunat (Tag 6–10)", r["chen"])
    ok("Laptop: Einsatzorte EN und ZH", r["en"].startswith("Umami (Day 1") and "第6–10天" in r["zh"], [r["en"], r["zh"]])
    ok("Laptop: ohne Wechsel kein Eintrag", r["amm"] == "", r["amm"])
    ok("Laptop: Absenzmeldung nennt Restaurant des Tages", any("Da Fortunat" in x for x in r["abs"]), r["abs"])
    ok("Laptop: Beurteilung enthaelt Einsatzorte", "Einsatzorte: Umami (Tag 1" in r["rep"], "")
    pg.evaluate("()=>{ view='day'; curSlot=slots()[6].id; render(); }")
    n_pill = pg.locator(".opill").count(); n_alt = pg.locator(".opill.alt").count()
    ok("Laptop: Umschalter pro Person sichtbar (30), 1 im zweiten Restaurant", n_pill == 30 and n_alt == 1, [n_pill, n_alt])
    pg.locator(".opill").first.click()
    ok("Laptop: Klick auf Umschalter wechselt", pg.locator(".opill.alt").count() == 2)
    pg.screenshot(path="/tmp/claude-0/wechsel_laptop.png")
    # Ohne zweites Restaurant: keine Umschalter
    pg.evaluate("()=>{ S.settings.outlet2=''; render(); }")
    ok("Laptop: ohne zweites Restaurant keine Umschalter", pg.locator(".opill").count() == 0)
    ok("Laptop: keine JavaScript-Fehler", not errs, errs)
    c.close()
    # ---------- Zusammenfuehren 5T (Umami) + 4T (Da Fortunat) ----------
    snaps = []
    for fn, outl in (("Servicerapport_5Tage_ohneExam.html", "Umami"), ("Servicerapport_4Tage_Exam.html", "Da Fortunat")):
        c = b.new_context(); pg = c.new_page(); pg.goto((D/fn).as_uri()); pg.wait_for_timeout(300)
        load(pg, "#fStud"); pg.evaluate("(o)=>{ S.settings.outlet=o; }", outl)
        snaps.append(pg.evaluate("()=>{ slots().forEach(s=>openSlot(s.id)); return JSON.stringify(snapshot()); }")); c.close()
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"Servicerapport.html").as_uri()); pg.wait_for_timeout(300)
    r = pg.evaluate("""async (sn)=>{ S.students=[]; S.days={}; S.settings.outlet='Umami';
        await onMerge({target:{files:sn.map((t,i)=>new File([t],'h'+i+'.json')), value:''}});
        const chen = S.students.find(s=>s.nachname==='Chen'); return placementText(chen.id,'de'); }""", snaps)
    ok("Zusammenfuehren: Halbturnus aus anderem Restaurant behaelt Ort", r == "Umami (Tag 1–5), Da Fortunat (Tag 6–10)", r)
    ok("Zusammenfuehren: keine JavaScript-Fehler", not errs, errs)
    c.close()
    # ---------- Mobil ----------
    c = b.new_context(viewport={"width":390,"height":844}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/"Servicerapport_Mobil.html").as_uri() + "#outlet=Umami&outlet2=Da%20Fortunat"); pg.wait_for_timeout(300)
    ok("Mobil: Startlink setzt zweites Restaurant", pg.evaluate("()=>S.settings.outlet2") == "Da Fortunat")
    load(pg, "#mStud")
    r = pg.evaluate("""()=>{ const sl=slots(); const chen=S.students.find(s=>s.nachname==='Chen');
        openSlot(sl[0].id); openSlot(sl[1].id); toggleOutlet(S.days[sl[1].id][chen.id]); openSlot(sl[2].id);
        S.days[sl[2].id][chen.id].att='unexcused'; curSlot = sl[2].id; view='day'; render();
        return {d3: S.days[sl[2].id][chen.id].outlet||'', abs: absenceList(sl[2].id)}; }""")
    ok("Mobil: neuer Tag uebernimmt Restaurant vom Vortag", r["d3"] == "Da Fortunat", r["d3"])
    ok("Mobil: Absenzmeldung nennt Restaurant", any("Da Fortunat" in x for x in r["abs"]), r["abs"])
    ok("Mobil: Liste zeigt den Wechsel", pg.locator("text=⇄ Da Fortunat").count() >= 1)
    pg.locator(".srow").nth(10).click(); pg.wait_for_timeout(200)
    ok("Mobil: Umschalter im Erfassungsblatt", pg.locator(".sheet .opill").count() == 1)
    pg.screenshot(path="/tmp/claude-0/wechsel_mobil.png")
    ok("Mobil: keine JavaScript-Fehler", not errs, errs)
    c.close(); b.close()
print("\n".join(res)); n = sum(x.startswith("OK") for x in res); print(n, "von", len(res))
(R/"tests"/"Testprotokoll_Wechsel.txt").write_text("PRUEFUNG RESTAURANTWECHSEL SERVICE 05.10.2026\n\n" + "\n".join(res) + "\n", encoding="utf-8")
