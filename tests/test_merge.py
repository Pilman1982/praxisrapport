import pathlib, json
from playwright.sync_api import sync_playwright
R=pathlib.Path(__file__).parent.parent
LIST=(R/"testdaten/Testklasse_ANONYM.txt").read_text(encoding="utf-8")
out=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    for label,f in (("Kueche",R/"src/dist/Kuechenrapport.html"),("Service",R/"src/dist/Servicerapport.html")):
        # Quelle: Datei A mit Liste, Export als JSON
        c=b.new_context(); pg=c.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.goto(f.as_uri()+"?a"); pg.wait_for_timeout(300)
        pg.evaluate("()=>{view='set';render();}"); pg.fill("#fStud",LIST)
        pg.evaluate("""()=>{const ta=document.querySelector('#fStud');const b=[...document.querySelectorAll('button.pri')].find(b=>ta.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);b.click();}""")
        snap=pg.evaluate("()=>JSON.stringify(snapshot())")
        c.close()
        # Ziel: leere Datei, Zusammenfuehren
        c=b.new_context(); pg=c.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.goto(f.as_uri()); pg.wait_for_timeout(300)
        pg.evaluate("()=>{S.students=[];S.days={};}")
        r=pg.evaluate("""async (snap)=>{const file=new File([snap],'a.json',{type:'application/json'});
            await onMerge({target:{files:[file],value:''}});
            const s=S.students.find(x=>(x.last||x.nachname)==='Chen');
            const v=S.students.find(x=>(x.last||x.nachname)==='van der Berg'); return [S.students.length, !!v, s&&s.klasse, s&&s.gruppe, s&&s.nick, s&&s.mail];}""",snap)
        out.append((label,"Zusammenfuehren",r, r[0]==30 and r[1] and r[2]=="HFE1" and r[3]=="Gruppe 1" and r[4]=="Ethan"))
        # Excel-Zeile: Klasse pro Person
        rows=pg.evaluate("""()=>{ if(typeof xlsxData==='function') return 'xlsxData'; return Object.getOwnPropertyNames(window).filter(n=>/xlsx|rows/i.test(n)); }""")
        out.append((label,"JS-Fehler",errs,not errs))
        c.close()
    b.close()
lines=[("OK      " if o[3] else "FEHLER  ")+"%s: %s %s"%(o[0],o[1],o[2]) for o in out]
print("\n".join(lines))
open(R/"tests"/"Testprotokoll_Harmonisierung.txt","a",encoding="utf-8").write("\nZUSAMMENFUEHREN (Rapport A -> leere Datei B)\n"+"\n".join(lines)+"\n")
