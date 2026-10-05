import pathlib, json, threading, functools, http.server, socketserver, base64
from playwright.sync_api import sync_playwright
D=pathlib.Path("/home/claude/praxisrapport/docs"); O=pathlib.Path("/tmp/claude-0/guides/shots"); LIB=pathlib.Path("/tmp/claude-0/libs/node_modules")
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.TCPServer(("127.0.0.1",0),functools.partial(Q,directory=str(D))); U="http://127.0.0.1:%d/"%srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
def libs(route):
    u=route.request.url; f=LIB/"jszip/dist/jszip.min.js" if "jszip" in u else None
    route.fulfill(path=str(f),content_type="application/javascript") if f else route.abort()
def sil(bg,skin,hair):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150" viewBox="0 0 120 150"><rect width="120" height="150" fill="{bg}"/><ellipse cx="60" cy="150" rx="48" ry="42" fill="#2b3442"/><circle cx="60" cy="66" r="27" fill="{skin}"/><path d="M33 62 Q35 34 60 34 Q86 34 87 62 Q80 46 60 46 Q42 46 33 62Z" fill="{hair}"/></svg>'
    return "data:image/svg+xml;base64,"+base64.b64encode(svg.encode()).decode()
FOT=[sil("#dfe6ee","#e8c4a8","#5a3b25"),sil("#e9e4dc","#c99a78","#1d1a17"),sil("#dde8e3","#f1d3bd","#b07a3a"),sil("#e6e1ea","#8d5b3e","#121212"),sil("#e4e9ef","#f0cfb6","#2c2018")]
NAMES=[("Ammann","Lea",""),("Bertschi","Nino","Nini"),("Da Silva","Rui",""),("Frei","Anouk",""),("Keller","Timo",""),("Chen","Yu","Leo"),("Vogt","Sarina","")]
T=lambda d,o,m=False: dict(datum=d,outlet=o,**({"market":True} if m else {}))
D4=["2026-09-29","2026-09-30","2026-10-01","2026-10-12"]; EX="2026-10-13"
D9=["2026-09-21","2026-09-22","2026-09-23","2026-09-24","2026-09-28","2026-09-29","2026-09-30","2026-10-01","2026-10-12"]
def studs(einsatz_fn):
    out=[]
    for i,(n,v,nick) in enumerate(NAMES):
        out.append({"nr":str(9100+i),"nachname":n,"vorname":v,"nickname":nick,"klasse":"HFD" if i%2 else "HFE1","gruppe":"Gruppe 1 Team A","sprache":"de","einsaetze":[einsatz_fn(i)]})
    return out
SETS={
 "k_de":(dict(name="Lars",bereich="kueche",outlets=["Patisserie"],sprache="de"),
         lambda i:{"bereich":"kueche","outlet":"Patisserie","von":D4[0],"bis":EX,"variante":"4T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"Patisserie",i==3 and d==D4[1]) for d in D4]}),
 "k_th":(dict(name="Q",bereich="kueche",outlets=["Umami"],sprache="th"),
         lambda i:{"bereich":"kueche","outlet":"Umami","von":D4[0],"bis":EX,"variante":"4T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"Umami",i==3 and d==D4[1]) for d in D4]}),
 "s_de2":(dict(name="Sybille / Laura",bereich="service",outlets=["Da Fortunat","Umami"],sprache="de",plan={"mo":"Sybille","tu":"Sybille","we":"Laura","th":"Laura"}),
         lambda i:{"bereich":"service","outlet":"Da Fortunat","von":D4[0],"bis":EX,"variante":"4T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"Umami" if (i+j)%2 else "Da Fortunat") for j,d in enumerate(D4)]}),
 "s_de":(dict(name="Andre",bereich="service",outlets=["Campigiana"],sprache="de"),
         lambda i:{"bereich":"service","outlet":"Campigiana","von":D4[0],"bis":EX,"variante":"4T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"Campigiana") for d in D4]}),
 "s_en":(dict(name="Martin",bereich="service",outlets=["The Essence"],sprache="en"),
         lambda i:{"bereich":"service","outlet":"The Essence","von":D9[0],"bis":EX,"variante":"10T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"The Essence") for d in D9]}),
 "k_de10":(dict(name="Michael Pilman",bereich="kueche",outlets=["The Essence"],sprache="de"),
         lambda i:{"bereich":"kueche","outlet":"The Essence","von":D9[0],"bis":EX,"variante":"10T","block":"Zyklus 2.1","exam":EX,"tage":[T(d,"The Essence") for d in D9]}),
}
with sync_playwright() as p:
    b=p.chromium.launch()
    for key,(doz,fn) in SETS.items():
        plan={"format":"praxisrapport-turnusplan","version":1,"semester":"HS26","wochentage":["mo","tu","we","th"],"dozierende":[doz],"studierende":studs(fn)}
        c=b.new_context(); c.route("https://cdnjs.cloudflare.com/**",libs); pg=c.new_page()
        pg.goto(U+"cockpit.html"); pg.fill("#planText",json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
        pg.evaluate("(f)=>{ f.forEach((x,i)=>{ FOTOS.byNr[String(9100+[0,1,3,4,5][i])]=x; }); FOTOS.n=5; }",FOT)
        if key=="k_de10":
            pg.set_viewport_size({"width":1200,"height":900}); pg.evaluate("()=>{ build(); render(); renderSem(); }"); pg.wait_for_timeout(300)
            pg.screenshot(path=str(O/"cockpit.png"),full_page=False)
        sp=pg.evaluate("()=>semesterPackages()")[0]["data"]; c.close()
        c=b.new_context(viewport={"width":390,"height":780},device_scale_factor=2); pg=c.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.on("dialog",lambda d:d.accept())
        pg.goto(U+"mein.html"+("#lang="+doz["sprache"])); pg.wait_for_timeout(200)
        pg.set_input_files("#file",files=[{"name":"s.json","mimeType":"application/json","buffer":json.dumps(sp).encode()}]); pg.wait_for_timeout(500)
        pg.evaluate("()=>{ const m=document.querySelector('#main .card:not(.now)'); if(m && m.textContent.length<60) m.remove(); }")
        pg.screenshot(path=str(O/f"{key}_1_mein.png"))
        pg.click("#main .card.now .btn.pri"); pg.wait_for_load_state(); pg.wait_for_timeout(900)
        pg.evaluate("()=>{ const t=document.getElementById('toast'); if(t){t.classList.remove('on'); t.style.display='none';} }")
        # Tag noch nicht eröffnet
        pg.evaluate("()=>{ const sl=slots().filter(s=>!s.exam); curSlot=sl[1].id; delete S.days[curSlot]; persist(); render(); {const t=document.getElementById('toast'); if(t){t.classList.remove('on'); t.style.display='none';}} }")
        pg.screenshot(path=str(O/f"{key}_2_open.png"))
        pg.evaluate("""()=>{ const sl=slots().filter(s=>!s.exam); openSlot(sl[0].id); curSlot=sl[1].id; openSlot(curSlot);
            const ids=S.students.map(s=>s.id), D=S.days[curSlot];
            const neg=Object.keys(CHIP).filter(k=>CHIP[k].d<0&&!CHIP[k].ko&&CHIP[k].c===CRITS[0].k)[0];
            const pos=Object.keys(CHIP).filter(k=>CHIP[k].d>0&&CHIP[k].c===CRITS[2].k)[0];
            const pos2=Object.keys(CHIP).filter(k=>CHIP[k].d>0&&CHIP[k].c===CRITS[1].k)[0];
            D[ids[0]].obs=[neg,pos]; D[ids[1]].att='late'; D[ids[2]].obs=[pos2]; D[ids[4]].att='excused';
            S.days[sl[0].id][ids[0]].obs=[pos2]; persist(); render(); {const t=document.getElementById('toast'); if(t){t.classList.remove('on'); t.style.display='none';}} }""")
        pg.wait_for_timeout(200); pg.screenshot(path=str(O/f"{key}_3_tag.png"))
        pg.evaluate("()=>openSheet(S.students[0])"); pg.wait_for_timeout(300); pg.screenshot(path=str(O/f"{key}_4_blatt.png"))
        pg.evaluate("()=>{ document.getElementById('sheetHost').innerHTML=''; document.body.style.overflow=''; }")
        pg.click("#btnGrades"); pg.wait_for_timeout(300); pg.screenshot(path=str(O/f"{key}_5_noten.png"))
        pg.locator("#view .fbbtn").first.click(); pg.wait_for_timeout(300); pg.screenshot(path=str(O/f"{key}_6_feedback.png"))
        print("-----", key); print(pg.evaluate("()=>document.getElementById('n2fbtext').value"))
        pg.evaluate("()=>{ document.getElementById('sheetHost').innerHTML=''; document.body.style.overflow=''; }")
        print(key, errs); c.close()
    b.close()
srv.shutdown()
