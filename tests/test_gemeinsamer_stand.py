# -*- coding: utf-8 -*-
"""Daily Grades: gemeinsamer Stand pro Paket (Entscheid 20.11.2026).
Tablet- und Laptop-Ansicht auf demselben Gerät zeigen immer denselben Stand, auch beim Zykluswechsel:
P1 Startseite «Laptop-Ansicht» bringt die Tablet-Einträge mit · P2 Startseite «Öffnen» bringt die Laptop-Einträge mit ·
P3 Umschaltknopf bei einem anderen offenen Zyklus: keine Rückfrage, neuer Zyklus da · Zyklus zurück: nichts verloren ·
zwei offene Tabs (Tablet und Laptop) gleichen sich beim Zurückkehren ab, ohne sich zu überschreiben ·
alte Daten (vor dem 20.11.2026) in beiden Ansichten werden vereinigt · Zurücksetzen und erneut öffnen ·
Datei ohne Paket wie bisher · Speicher voll: Rückfrage wie bisher · Fotos nicht im Stand, aber sichtbar."""
import pathlib, json, threading, functools, http.server, socketserver, datetime
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-86s %s" % (n, str(i)[:150]))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(D))); U = "http://127.0.0.1:%d/" % srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

TODAY = datetime.date.today()
def tage(start): return [(start + datetime.timedelta(days=k)).isoformat() for k in range(10)]
Z1 = tage(TODAY - datetime.timedelta(days=20)); Z2 = tage(TODAY - datetime.timedelta(days=2))
FOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8DwnwEJMDEgAQAbjAIDtIxvqQAAAABJRU5ErkJggg=="
AREAS = {
  "kueche":  dict(bereich="kueche",  outlet="The Essence", schicht="K1", mob="Kuechenrapport_Mobil.html", lap="Kuechenrapport.html",
                  plus="pro-p1", plus2="org-p1", plus3="hyg-p1"),
  "service": dict(bereich="service", outlet="Campigiana",  schicht="S",  mob="Servicerapport_Mobil.html", lap="Servicerapport.html",
                  plus=None, plus2=None, plus3=None),
}
def plan(a):
    T = lambda d: dict(datum=d, outlet=a["outlet"], schicht=a["schicht"])
    ein = lambda c, z: {"bereich":a["bereich"],"outlet":a["outlet"],"von":c[0],"bis":c[9],"variante":"10T","block":z,"exam":c[9],"tage":[T(d) for d in c[:9]]}
    return {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th","fr","sa","su"],
     "dozierende":[{"name":"Lehrer Test","bereich":a["bereich"],"outlets":[a["outlet"]],"sprache":"de"}],
     "studierende":[{"nr":"1021","nachname":"Da Silva","vorname":"Rui","nickname":"","email":"rui@beispiel.ch","klasse":"HFD","gruppe":"Gruppe 1","sprache":"de","einsaetze":[ein(Z1,"Zyklus 1.1")]},
                    {"nr":"1022","nachname":"Muster","vorname":"Emma","nickname":"","email":"emma@beispiel.ch","klasse":"HFE1","gruppe":"Gruppe 2","sprache":"en","einsaetze":[ein(Z2,"Zyklus 1.2")]},
                    {"nr":"1023","nachname":"Beispiel","vorname":"Berta","nickname":"","email":"berta@beispiel.ch","klasse":"HFE1","gruppe":"Gruppe 2","sprache":"de","einsaetze":[ein(Z2,"Zyklus 1.2")]}]}

DLG = {"mode":"accept", "msgs":[]}
def on_dialog(d):
    DLG["msgs"].append(d.message); d.accept() if DLG["mode"] == "accept" else d.dismiss()
def neu(b):
    c = b.new_context(viewport={"width":820,"height":1180}, has_touch=True)
    c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    pg = c.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("dialog", on_dialog)
    return c, pg, errs
ST = """()=>({file: decodeURIComponent(location.pathname.split('/').pop()), block: S.settings.block || '',
  names: S.students.map(s=>s.name), fotos: S.students.filter(s=>s.foto).length,
  rec: Object.keys(S.days).sort().flatMap(d=>Object.keys(S.days[d]).filter(k=>{ const r = S.days[d][k]; return r && ((r.obs||[]).length || (r.note && r.note.txt) || (r.att && r.att !== 'present')); })
        .map(k=>d+':'+S.students.find(s=>s.id===k).name.split(' ')[0]+':'+(S.days[d][k].obs||[]).join('+')+(S.days[d][k].note && S.days[d][k].note.txt ? '#'+S.days[d][k].note.txt : '')+(S.days[d][k].att !== 'present' ? '@'+S.days[d][k].att : '')))})"""
SETREC = """([d, who, obs, txt, att])=>{ const s = S.students.find(x=>x.name.startsWith(who)); S.days[d] = S.days[d] || {};
  S.days[d][s.id] = {att: att || 'present', obs: obs, note: txt ? {txt, crit:'', dir:0, w:0, internal:false} : null}; persist(); }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for area, a in AREAS.items():
        A = area.capitalize() + ": "
        c, pg, errs = neu(b)
        pg.goto(U + "cockpit.html"); pg.fill("#planText", json.dumps(plan(a))); pg.click("#btnPlan"); pg.wait_for_timeout(300)
        SEM = [x["data"] for x in pg.evaluate("()=>semesterPackages()")][0]
        for pk in SEM["pakete"]:
            for s in pk["paket"]["students"]: s["foto"] = FOTO
        c.close()
        # Bausteine: erste drei Plus-Bausteine aus der App
        c, pg, errs = neu(b)
        pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
        pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(SEM).encode()}]); pg.wait_for_timeout(400)
        st = lambda: pg.evaluate(ST)
        rec = lambda d, who, obs, txt="", att="": pg.evaluate(SETREC, [d, who, obs, txt, att])
        home = lambda: (pg.goto(U + "mein.html"), pg.wait_for_timeout(300))
        def open_(i, laptop):
            pg.evaluate("([i, l])=>openPack(SEM.pakete[i], l)", [i, laptop]); pg.wait_for_url("**/" + (a["lap"] if laptop else a["mob"]) + "**"); pg.wait_for_timeout(900)
        def switch():
            f = pg.evaluate("()=>decodeURIComponent(location.pathname.split('/').pop())")
            pg.click("#btnSwitch"); pg.wait_for_url("**/" + (a["lap"] if "_Mobil" in f else a["mob"]) + "**"); pg.wait_for_timeout(900)
        open_(0, False)
        CH = pg.evaluate("()=>CHIPS.filter(c=>c.d>0).map(c=>c.i)")
        P1, P2, P3 = CH[0], CH[1], CH[2]
        # Zyklus 1 am Tablet, Wechsel Laptop, weiter am Laptop
        rec("d01", "Da Silva", [P1])
        switch(); rec("d02", "Da Silva", [P2], "Laptop-Notiz")
        # P2: Startseite «Öffnen» (Tablet) bringt den Laptop-Eintrag
        home(); DLG["msgs"].clear(); open_(0, False); s = st()
        ok(A + "P2 Startseite «Öffnen»: Tablet zeigt den Laptop-Eintrag", "d02:Da:%s#Laptop-Notiz" % P2 in s["rec"] and "d01:Da:%s" % P1 in s["rec"], s["rec"])
        ok(A + "P2 ohne Rückfrage", not DLG["msgs"], DLG["msgs"][:1])
        # Nächster Zyklus am Tablet: keine Rückfrage, dann Umschaltknopf (Laptop hält noch Zyklus 1)
        home(); DLG["msgs"].clear(); open_(1, False); s = st()
        ok(A + "neuer Zyklus am Tablet: ohne Rückfrage «Tage werden ersetzt»", not DLG["msgs"] and s["block"] == "Zyklus 1.2", (DLG["msgs"][:1], s["block"]))
        rec("d01", "Muster", [P3])
        DLG["mode"] = "dismiss"; switch(); DLG["mode"] = "accept"; s = st()
        ok(A + "P3 Umschaltknopf: Laptop zeigt Zyklus 1.2 mit dem Tablet-Eintrag, keine Rückfrage",
           s["file"] == a["lap"] and s["block"] == "Zyklus 1.2" and "d01:Muster:%s" % P3 in s["rec"] and not DLG["msgs"], (s, DLG["msgs"][:1]))
        ok(A + "P3 Fotos kommen mit (stehen nicht im Stand)", s["fotos"] == 2, s["fotos"])
        rec("d02", "Beispiel", [], "", "late")
        # P1: Startseite «Laptop-Ansicht» und Tablet «Öffnen» für Zyklus 1.2
        home(); open_(1, True); s = st()
        ok(A + "P1 Startseite «Laptop-Ansicht»: Tablet- und Laptop-Eintrag da", "d01:Muster:%s" % P3 in s["rec"] and "d02:Beispiel:@late" in s["rec"], s["rec"])
        home(); open_(1, False); s = st()
        ok(A + "P1 danach am Tablet: gleicher Stand", "d01:Muster:%s" % P3 in s["rec"] and "d02:Beispiel:@late" in s["rec"], s["rec"])
        # Zurück zu Zyklus 1 (Tablet und Laptop): nichts verloren
        home(); open_(0, False); s1 = st(); home(); open_(0, True); s2 = st()
        want = ["d01:Da:%s" % P1, "d02:Da:%s#Laptop-Notiz" % P2]
        ok(A + "Zyklus 1.1 wieder öffnen: Tablet und Laptop haben beide Einträge", all(w in s1["rec"] for w in want) and all(w in s2["rec"] for w in want) and s1["block"] == "Zyklus 1.1", (s1["rec"], s2["rec"]))
        ok(A + "Fotos nach dem Zykluswechsel", s1["fotos"] == 1 and s2["fotos"] == 1, (s1["fotos"], s2["fotos"]))
        # Speicher: Stand ohne Fotos, alte Stände bleiben
        info = pg.evaluate("""()=>{ const ks = Object.keys(localStorage).filter(k=>k.startsWith('dg.stand|'));
            return {n: ks.length, foto: ks.some(k=>localStorage.getItem(k).includes('data:image')), keys: ks}; }""")
        ok(A + "je Zyklus ein Stand, ohne Fotos", info["n"] == 2 and not info["foto"], info)
        ok(A + "keine JavaScript-Fehler", not errs, errs[:2])

        # Zwei offene Tabs (Tablet und Laptop): Änderungen kommen beim Zurückkehren, keiner überschreibt den anderen
        home(); open_(1, False)
        pg2 = c.new_page(); pg2.on("pageerror", lambda e: errs.append(str(e))); pg2.on("dialog", on_dialog)
        pg2.goto(U + "mein.html"); pg2.wait_for_timeout(300)
        pg2.evaluate("()=>openPack(SEM.pakete[1], true)"); pg2.wait_for_url("**/" + a["lap"] + "**"); pg2.wait_for_timeout(900)
        pg.evaluate(SETREC, ["d03", "Muster", [P1], "aus Tablet", ""])           # Tab 1 (Tablet)
        pg2.evaluate(SETREC, ["d04", "Beispiel", [P2], "aus Laptop", ""])        # Tab 2 (Laptop), ohne vorher abzugleichen
        pg2.evaluate("()=>document.dispatchEvent(new Event('visibilitychange'))"); pg2.wait_for_timeout(200)
        pg.evaluate("()=>document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(200)
        r1 = pg.evaluate(ST)["rec"]; r2 = pg2.evaluate(ST)["rec"]
        w = ["d03:Muster:%s#aus Tablet" % P1, "d04:Beispiel:%s#aus Laptop" % P2]
        ok(A + "zwei Tabs: beide Einträge in beiden Ansichten", all(x in r1 for x in w) and all(x in r2 for x in w), (r1, r2))
        # offenes Erfassungsblatt: Freitext bleibt beim Abgleich erhalten
        pg.evaluate("()=>{ curSlot = 'd05'; view = 'day'; render(); openSheet(S.students.find(s=>s.name.startsWith('Muster'))); }")
        pg2.evaluate(SETREC, ["d05", "Beispiel", [P3], "", ""])
        pg.evaluate("()=>document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(300)
        r1 = pg.evaluate(ST)["rec"]; host = pg.evaluate("()=>document.getElementById('sheetHost').children.length")
        ok(A + "zwei Tabs: offenes Blatt geschlossen, neuer Eintrag aus dem Laptop da", host == 0 and "d05:Beispiel:%s" % P3 in r1, (host, r1))
        # «Zurück» im Browser (Seite aus dem Zwischenspeicher): pageshow holt den Stand
        pg2.evaluate(SETREC, ["d06", "Muster", [P2], "", ""])
        pg.evaluate("()=>window.dispatchEvent(new Event('pageshow'))"); pg.wait_for_timeout(200)
        ok(A + "Zurück (pageshow) holt den neusten Stand", "d06:Muster:%s" % P2 in pg.evaluate(ST)["rec"], pg.evaluate(ST)["rec"])
        pg2.close(); c.close()

        # Alte Daten (vor dem 20.11.2026): beide Ansichten haben das Paket mit verschiedenen Einträgen, kein Stand
        c, pg, errs = neu(b)
        pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
        pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(SEM).encode()}]); pg.wait_for_timeout(400)
        open_(1, False); rec("d01", "Muster", [P1]); rec("d02", "Muster", [P2])
        home(); open_(1, True); rec("d03", "Beispiel", [P3]); rec("d02", "Muster", [P2, P3])
        pg.evaluate("()=>{ Object.keys(localStorage).filter(k=>k.startsWith('dg.')).forEach(k=>localStorage.removeItem(k)); }")
        # Tablet-Seite hatte nur d01 + d02 (eine Beobachtung), Laptop d02 (zwei) + d03: so tun, als wäre es der alte Stand
        home(); open_(1, False); s = st()
        ok(A + "alte Daten: Tablet zuerst geöffnet zeigt seinen bisherigen Stand", "d01:Muster:%s" % P1 in s["rec"] and "d02:Muster:%s" % P2 in s["rec"], s["rec"])
        home(); open_(1, True); s = st()
        ok(A + "alte Daten: Laptop danach zeigt die Vereinigung (d01, d03, d02 mit mehr Erfasstem)",
           "d01:Muster:%s" % P1 in s["rec"] and "d03:Beispiel:%s" % P3 in s["rec"] and "d02:Muster:%s+%s" % (P2, P3) in s["rec"], s["rec"])
        home(); open_(1, False); s = st()
        ok(A + "alte Daten: Tablet beim nächsten Öffnen gleich", "d01:Muster:%s" % P1 in s["rec"] and "d03:Beispiel:%s" % P3 in s["rec"]
           and "d02:Muster:%s+%s" % (P2, P3) in s["rec"], s["rec"])
        home(); open_(1, True)
        # Zurücksetzen auf leere Datei: Stand bleibt, erneut öffnen bringt die Daten zurück
        pg.evaluate("()=>{ S = {settings:{...DEF, uiLang:S.settings.uiLang}, students:[], days:{}, dayMeta:{}}; persist(); curSlot = slots()[0].id; render(); }")   # wie «Zurücksetzen» am Laptop
        home(); DLG["msgs"].clear(); open_(1, True); s = st()
        ok(A + "nach Zurücksetzen: Paket erneut öffnen bringt die Einträge zurück", "d01:Muster:%s" % P1 in s["rec"] and len(s["names"]) == 2, s)
        # Sicherung einlesen (gleiches Paket) ersetzt wie bisher
        snap = pg.evaluate("()=>{ const o = JSON.parse(JSON.stringify(snapshot())); delete o.days.d03; return o; }")
        loader = "onRestore"
        pg.evaluate("async (o)=>await " + loader + "({target:{files:[new File([JSON.stringify(o)], 'b.json')], value:''}})", snap); pg.wait_for_timeout(300)
        home(); open_(1, False); s = st()
        ok(A + "Sicherung einlesen (gleiches Paket) gilt auch für die andere Ansicht", "d03:Beispiel:%s" % P3 not in s["rec"] and "d01:Muster:%s" % P1 in s["rec"], s["rec"])
        ok(A + "alte Daten/Zurücksetzen: keine JavaScript-Fehler", not errs, errs[:2])
        c.close()

        # Speicher voll für den gemeinsamen Stand: Rückfrage wie bisher, nichts geht still verloren
        c, pg, errs = neu(b)
        c.add_init_script("""(()=>{ const o = Storage.prototype.setItem; Storage.prototype.setItem = function(k, v){
            if(String(k).startsWith('dg.stand|')) throw new DOMException('voll', 'QuotaExceededError'); return o.call(this, k, v); }; })()""")
        pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
        pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(SEM).encode()}]); pg.wait_for_timeout(400)
        open_(0, False); rec("d01", "Da Silva", [P1])
        home(); DLG["mode"] = "dismiss"; DLG["msgs"].clear(); pg.evaluate("()=>openPack(SEM.pakete[1], false)"); pg.wait_for_timeout(900); s = st()
        ok(A + "Speicher voll: Rückfrage (nennt «Tag senden») vor dem Ersetzen, Abbrechen behält Zyklus 1.1",
           len(DLG["msgs"]) == 1 and "Tag senden" in DLG["msgs"][0] and s["block"] == "Zyklus 1.1" and "d01:Da:%s" % P1 in s["rec"], (DLG["msgs"][:1], s))
        DLG["mode"] = "accept"
        ok(A + "Speicher voll: keine JavaScript-Fehler", not errs, errs[:2])
        c.close()

        # Datei ohne Paket: wie bisher (kein Stand, Wechsel mit Kopie)
        c, pg, errs = neu(b)
        pg.goto(U + ("kueche/" if area == "kueche" else "service/") + a["mob"]); pg.wait_for_timeout(500)
        pk = json.loads(json.dumps(SEM["pakete"][1]["paket"])); pk["settings"].pop("paketId", None)
        pg.evaluate("async (o)=>await onLoadBackup({target:{files:[new File([JSON.stringify(o)], 'p.json')], value:''}})", pk); pg.wait_for_timeout(300)
        rec("d01", "Muster", [P1]); switch(); s = st()
        n = pg.evaluate("()=>Object.keys(localStorage).filter(k=>k.startsWith('dg.stand|')).length")
        ok(A + "ohne Paket: kein Stand, Wechsel bringt den Eintrag wie bisher", n == 0 and "d01:Muster:%s" % P1 in s["rec"], (n, s["rec"]))
        ok(A + "ohne Paket: keine JavaScript-Fehler", not errs, errs[:2])
        c.close()
    # Aufräumen: zu viele Stände -> nur lange unbenutzte (über 60 Tage) gehen, frische und der aktuelle bleiben
    c, pg, errs = neu(b)
    pg.goto(U + "kueche/Kuechenrapport.html"); pg.wait_for_timeout(500)
    r = pg.evaluate("""()=>{ const alt = Date.now() - 90*864e5, neu = Date.now() - 2*864e5;
        for(let i = 0; i < 40; i++) localStorage.setItem('dg.stand|Kuechenrapport|10T|alt' + i, JSON.stringify({v:1, k:'dg.stand|Kuechenrapport|10T|alt' + i, rev:'x', at:alt + i, u:{}, t:{}}));
        for(let i = 0; i < 30; i++) localStorage.setItem('dg.stand|Kuechenrapport|10T|neu' + i, JSON.stringify({v:1, k:'dg.stand|Kuechenrapport|10T|neu' + i, rev:'x', at:neu, u:{}, t:{}}));
        dgsWrite({v:1, k:'dg.stand|Kuechenrapport|10T|jetzt', rev:'y', u:{}, t:{}});
        const ks = Object.keys(localStorage).filter(k=>k.startsWith('dg.stand|'));
        return {n: ks.length, neu: ks.filter(k=>k.includes('|neu')).length, jetzt: ks.includes('dg.stand|Kuechenrapport|10T|jetzt'), alt: ks.filter(k=>k.includes('|alt')).length}; }""")
    ok("Aufräumen: höchstens 60 Stände, frische und aktueller bleiben, älteste zuerst weg", r["n"] <= 60 and r["neu"] == 30 and r["jetzt"] and r["alt"] == 29, r)
    r = pg.evaluate("""()=>{ dgsGc('dg.stand|Kuechenrapport|10T|jetzt', true);
        const ks = Object.keys(localStorage).filter(k=>k.startsWith('dg.stand|'));
        return {alt: ks.filter(k=>k.includes('|alt')).length, neu: ks.filter(k=>k.includes('|neu')).length}; }""")
    ok("Aufräumen bei vollem Speicher: nur Stände über 30 Tage", r == {"alt": 0, "neu": 30}, r)
    ok("Aufräumen: keine JavaScript-Fehler", not errs, errs[:2]); c.close()
    b.close()
srv.shutdown()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Gemeinsamer_Stand.txt").write_text("PRUEFUNG GEMEINSAMER STAND PRO PAKET %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + "\n".join(res) + "\n\n%d von %d\n" % (sum(x.startswith("OK") for x in res), len(res)), encoding="utf-8")
