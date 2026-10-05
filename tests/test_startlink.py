import pathlib
from playwright.sync_api import sync_playwright
R=pathlib.Path(__file__).parent.parent; res=[]
def ok(n,c,i=""): res.append(("OK      " if c else "FEHLER  ")+"%-60s %s"%(n,i))
with sync_playwright() as p:
    b=p.chromium.launch()
    for lab,f in (("Kueche Mobil","Kuechenrapport_Mobil.html"),("Service Mobil","Servicerapport_Mobil.html")):
        c=b.new_context(viewport={"width":390,"height":844}); pg=c.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        url=(R/"src/dist"/f).as_uri()+"#lang=th&outlet=Umami&klasse=hfe1&gruppe=team%202&plan=mo:Sybille,tu:Sybille,we:Laura,th:Laura"
        pg.goto(url); pg.wait_for_timeout(300)
        st=pg.evaluate("()=>({l:S.settings.uiLang,o:S.settings.outlet,g:S.settings.group,t:S.settings.team,te:S.settings.teacher,lang:document.documentElement.lang})")
        ok(lab+": Sprache Thai aus dem Link",st["l"]=="th" and st["lang"]=="th",st)
        ok(lab+": Outlet, Klasse, Gruppe aus dem Link",st["o"]=="Umami" and st["g"]=="HFE1" and st["t"]=="Team 2",st)
        ok(lab+": Dozent = beide Namen",st["te"]=="Sybille / Laura",st["te"])
        tp=pg.evaluate("""()=>{ const sl=slots(); const mo=sl.find(s=>s.wd==='mo'), we=sl.find(s=>s.wd==='we');
            openSlot(mo.id); openSlot(we.id); return [S.dayMeta[mo.id].teacher, S.dayMeta[we.id].teacher]; }""")
        ok(lab+": Montag bewertet Sybille, Mittwoch Laura",tp==["Sybille","Laura"],tp)
        # neu laden ohne Link: Einstellungen bleiben
        pg.goto((R/"src/dist"/f).as_uri()); pg.wait_for_timeout(300)
        st2=pg.evaluate("()=>[S.settings.uiLang,S.settings.outlet]")
        ok(lab+": ohne Link bleibt Thai und Umami gespeichert",st2==["th","Umami"],st2)
        # Link ohne Hash veraendert nichts, unbekannte Sprache wird ignoriert
        pg.goto((R/"src/dist"/f).as_uri()+"#lang=xx"); pg.wait_for_timeout(200)
        ok(lab+": unbekannte Sprache wird ignoriert",pg.evaluate("()=>S.settings.uiLang")=="th")
        pg.screenshot(path="/tmp/claude-0/sl_%s.png"%lab.split()[0])
        ok(lab+": keine JavaScript-Fehler",not errs,errs)
        c.close()
    b.close()
print("\n".join(res)); print(sum(r.startswith("OK") for r in res),"von",len(res))
open(R/"tests"/"Testprotokoll_Startlink.txt","w",encoding="utf-8").write("PRUEFUNG STARTLINK 05.10.2026\n\n"+"\n".join(res)+"\n")
