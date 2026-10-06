# -*- coding: utf-8 -*-
"""QA-Loop mit vier Personas (06.10.2026)
A  gestresster Praxisinstruktor: schnell erfassen, richtiger Tag, Tag senden
B  Studierende: Feedback-Mail verständlich, fair, in der richtigen Sprache
C  Kursleitung/Prüfungsleitung: Notenrechnung, Zusammenführen der täglichen Dateien
D  Technik-Muffel: falsche Datei, Abbrechen, Speicher gesperrt, Doppeltipps
"""
import pathlib, json, threading, functools, http.server, socketserver, datetime, urllib.parse
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-74s %s" % (n, str(i)[:140]))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(D))); U = "http://127.0.0.1:%d/" % srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

T = lambda d, o: dict(datum=d, outlet=o)
EX = "2026-10-12"; D4 = ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"]
PEOPLE = [("Ammann", "Lea", "HFD"), ("Frei", "Anouk", "HFD"), ("Keller", "Timo", "HFD"), ("Okafor", "Ada", "HFE1"), ("Nguyen", "Minh", "HFE2")]
def plan(bereich, outlet, wer, wplan=None):
    doz = {"name": wer, "bereich": bereich, "outlets": [outlet], "sprache": "de"}
    if wplan: doz["plan"] = wplan
    return {"format": "praxisrapport-turnusplan", "version": 1, "semester": "TEST", "wochentage": ["mo", "tu", "we", "th"],
            "dozierende": [doz],
            "studierende": [{"nr": str(2000 + i), "nachname": n, "vorname": v, "klasse": k, "gruppe": "Gruppe 1 Team A",
                             "email": v.lower() + "." + n.lower() + "@stud.ehl.ch",
                             "sprache": "de" if k == "HFD" else "en", "einsaetze": [
                {"bereich": bereich, "outlet": outlet, "von": D4[0], "bis": EX, "variante": "4T", "block": "Zyklus 2.1", "exam": EX,
                 "tage": [T(d, outlet) for d in D4]}]} for i, (n, v, k) in enumerate(PEOPLE)]}
AT = lambda iso: datetime.datetime.fromisoformat(iso + "T09:00:00+02:00")

def semester(b, pl):
    c = b.new_context(); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort()); pg = c.new_page()
    pg.goto(U + "cockpit.html"); pg.fill("#planText", json.dumps(pl)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    s = pg.evaluate("()=>semesterPackages()[0].data"); c.close(); return s

def start(b, sem, day, laptop=False, init=None, vp=(820, 1180)):
    """Wie im Alltag: Startseite (Home-Bildschirm), Paket antippen. Uhr steht auf dem gegebenen Tag."""
    c = b.new_context(viewport={"width": vp[0], "height": vp[1]}); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    if init: c.add_init_script(init)
    pg = c.new_page(); pg.clock.install(time=AT(day)); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(U + "mein.html"); pg.set_input_files("#file", files=[{"name": "s.json", "mimeType": "application/json", "buffer": json.dumps(sem).encode()}])
    pg.wait_for_timeout(300); pg.evaluate("(l)=>openPack(SEM.pakete[0], l)", laptop); pg.wait_for_load_state(); pg.wait_for_timeout(600)
    return c, pg, errs

LBL = "()=>slotLabel(slotById(curSlot),'de')"
def E(pg, js, dflt):
    try: return pg.evaluate(js)
    except Exception as ex: res.append("FEHLER  Abbruch: " + str(ex).split("\n")[0][:120]); return dflt

with sync_playwright() as p:
    b = p.chromium.launch()
    for bereich, outlet, app in (("kueche", "Patisserie", "Kueche"), ("service", "Da Fortunat", "Service")):
        sem = semester(b, plan(bereich, outlet, "Muster Koch" if bereich == "kueche" else "Muster A / Muster B",
                               None if bereich == "kueche" else {"mo": "Muster A", "tu": "Muster A", "we": "Muster B", "th": "Muster B"}))
        P = app + " · "
        # ================= Persona A: gestresster Praxisinstruktor =================
        c, pg, errs = start(b, sem, "2026-10-07")
        ok(P + "A1 Paket öffnen am Mittwoch: Tag Mittwoch 07.10. vorgewählt", "07.10." in pg.evaluate(LBL), pg.evaluate(LBL))
        pg.reload(); pg.wait_for_timeout(500)
        ok(P + "A2 App erneut öffnen (ohne Startseite): wieder der heutige Tag", "07.10." in pg.evaluate(LBL), pg.evaluate(LBL))
        pg.goto(U + "mein.html"); pg.wait_for_timeout(300); pg.evaluate("()=>openPack(SEM.pakete[0], false)"); pg.wait_for_load_state(); pg.wait_for_timeout(500)
        ok(P + "A3 Gleiches Paket nochmals über Startseite: heutiger Tag", "07.10." in pg.evaluate(LBL), pg.evaluate(LBL))
        # einen ganzen Tag erfassen, nur mit Tippen
        pg.click("text=Tag erfassen"); pg.wait_for_timeout(150)
        clicks = 1
        pg.locator(".srow").first.click(); clicks += 1; pg.wait_for_timeout(100)
        g0 = pg.locator("#n2grade").text_content()
        pg.locator(".chips .chip.neg").first.click(); clicks += 1; pg.wait_for_timeout(80)
        g1 = pg.locator("#n2grade").text_content()
        pg.locator(".chips .chip.neg").first.click(); pg.wait_for_timeout(80)
        g2 = pg.locator("#n2grade").text_content()
        ok(P + "A4 Note im Blatt reagiert sofort, zweiter Tipp nimmt den Baustein zurück", g0 != g1 and g0 == g2, (g0, g1, g2))
        pg.locator(".chips .chip.pos").first.click(); clicks += 1
        for i in range(1, len(PEOPLE)):
            pg.locator(".sheet-f button", has_text="›").click(); clicks += 1; pg.wait_for_timeout(60)
            if i == 1: pg.locator(".att button").nth(1).click(); clicks += 1
            elif i == 3: pg.locator(".chips .chip.neg").nth(1).click(); clicks += 1
        pg.locator(".sheet-f .btn.pri").click(); clicks += 1; pg.wait_for_timeout(100)
        ok(P + "A5 Ganzer Tag (5 Personen, 4 Einträge) mit wenigen Tipps", clicks <= 12, "%d Tipps" % clicks)
        st = pg.evaluate("()=>{ const d = S.days[curSlot]; return S.students.map(s => [d[s.id].att, d[s.id].obs.length, n2Day(curSlot, s.id)]); }")
        ok(P + "A6 Verspätung zieht automatisch ab, Note unter 5.00", st[1][0] == "late" and st[1][2] < 5, st[1])
        sh = pg.evaluate("""async ()=>{ let got = null; navigator.canShare = () => true; navigator.share = async (o) => { got = {t:o.text, n:o.files[0].name, j:JSON.parse(await o.files[0].text())}; };
            await shareDay(); return got; }""")
        ok(P + "A7 Tag senden: Datei + Mailtext mit Verspätung und Adresse", sh and "michael.pilman@ehl.ch" in sh["t"] and "Frei" in sh["t"] and sh["n"].endswith(".json") and sh["j"]["days"], sh and sh["t"][:120])
        ok(P + "A8 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

        # ================= Persona B: Studierende (Feedback-Mail) =================
        c, pg, errs = start(b, sem, "2026-10-08")
        neg = pg.evaluate("()=>CHIPS.filter(c=>c.d<0)")
        miss = [x["i"] for x in neg if not (x.get("a") and x["a"].get("de") and x["a"].get("en"))]
        ok(P + "B1 Jeder negative Baustein hat einen Tipp auf DE und EN", not miss, miss[:6])
        pg.evaluate("""()=>{ slots().filter(s=>!s.exam).forEach(s=>openSlot(s.id));
            const by = x => S.students.find(s=>(s.last||s.name).indexOf(x)===0).id; const [a, f, k, o, n] = ["Ammann","Frei","Keller","Okafor","Nguyen"].map(by), sl = slots().filter(s=>!s.exam).map(s=>s.id);
            const negs = CHIPS.filter(c=>c.d<0 && !c.ko && c.a).map(c=>c.i), poss = CHIPS.filter(c=>c.d>0).map(c=>c.i);
            sl.forEach((d, i) => { S.days[d][a].obs = [poss[0], poss[1]]; S.days[d][o].obs = [negs[0], negs[3], negs[6], negs[9], poss[2]]; });
            S.days[sl[0]][o].att = 'late'; S.days[sl[1]][o].att = 'unexcused';
            sl.forEach(d => { S.days[d][n].att = 'excused'; });
            persist(); }""")
        fb = pg.evaluate("""()=>{ const by = x => S.students.find(s=>(s.last||s.name).indexOf(x)===0); const A = by('Ammann'), O = by('Okafor'), N = by('Nguyen'); return {
            de: n2FbText(A, n2FbLang(A), false), en: n2FbText(O, n2FbLang(O), true),
            lgA: n2FbLang(A), lgO: n2FbLang(O), lgN: n2FbLang(N) }; }""")
        ok(P + "B2 Sprache: HFD Deutsch, HFE1/HFE2 Englisch", (fb["lgA"], fb["lgO"], fb["lgN"]) == ("de", "en", "en"), (fb["lgA"], fb["lgO"], fb["lgN"]))
        ok(P + "B3 DE: Anrede mit Vorname, Lob, ohne Noten (Standard)", fb["de"]["body"].startswith("Hallo Lea,") and "besonders gefallen" in fb["de"]["body"] and "Note" not in fb["de"]["body"], fb["de"]["body"][:90])
        e = fb["en"]["body"]
        ok(P + "B4 EN: Verbesserung mit Tipp, Verspätung, unentschuldigt, Note", e.startswith("Hi Ada,") and "Where you can still improve" in e and "Tip:" in e and "late 1 time" in e and "unexcused" in e and "practice" in e, e[:80])
        imp = e.split("Where you can still improve:")[-1].split("\n\n")[0]
        ok(P + "B5 Höchstens 3 Verbesserungspunkte, jeder mit Tipp", imp.count("\n– ") == 3 and imp.count("Tip:") == 3, imp.count("\n– "))
        ok(P + "B6 Kein Doppelpunkt-Punkt-Fehler und keine leeren Platzhalter", "{" not in e and ".." not in e and ": ." not in e, "")
        pg.evaluate("()=>{ view='grades'; render(); }")
        pg.locator(".srow.grow", has_text="Nguyen").locator(".fbbtn").click(); pg.wait_for_timeout(150)
        warn = pg.locator(".sheet .banner").all_text_contents()
        ok(P + "B7 Person ohne bewerteten Tag: Warnung im Feedback-Blatt", any("bewertet" in w.lower() or "keine" in w.lower() for w in warn), warn)
        pg.locator(".sheet-h .hbtn").click()
        hrefs = E(pg, """()=>{ const s = S.students.find(x=>x.last==='Okafor'); const t = n2FbText(s, 'en', true); return n2FbMailto(s, t.subj, t.body, false); }""", {"href":"","copy":False})
        ok(P + "B8 Lange Feedback-Mail: Link bleibt unter 1900 Zeichen (Outlook Windows)", hrefs["href"].startswith("mailto:") and len(hrefs["href"]) <= 1900, len(hrefs["href"]))
        ok(P + "B9 Zu lang: Text wird kopiert und in der Mail eingefügt (Hinweis)", (len(hrefs["href"]) < 1900 and not hrefs["copy"]) or hrefs["copy"], hrefs["copy"])
        ios = E(pg, """()=>{ const s = S.students.find(x=>x.last==='Okafor'); const t = n2FbText(s, 'en', true); return n2FbMailto(s, t.subj, t.body, true); }""", {"href":"","copy":True})
        ok(P + "B10 iPad: ganzer Text direkt in der Mail", not ios["copy"] and "Where%20you%20can" in ios["href"], len(ios["href"]))
        pg.evaluate("()=>{ S.settings.uiLang='th'; render(); }")
        th = pg.evaluate("()=>n2FbText(S.students[0], n2FbLang(S.students[0]), false).body")
        ok(P + "B11 Thai-Oberfläche: Mail trotzdem Deutsch für HFD", th.startswith("Hallo"), th[:20])
        ok(P + "B12 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

        # ================= Persona C: Kursleitung / Prüfungsleitung =================
        c, pg, errs = start(b, sem, "2026-10-12")
        r = pg.evaluate("""()=>{ const sl = slots(), ids = S.students.map(s=>s.id); sl.forEach(s=>openSlot(s.id));
            const [a, f, k, o, n] = ids, ex = sl.find(s=>s.exam).id, d = sl.filter(s=>!s.exam).map(s=>s.id);
            S.days[d[0]][a].att = 'excused'; S.days[d[1]][a].att = 'tm';
            S.days[d[0]][f].att = 'unexcused';
            S.days[ex][k].att = 'excused';
            const ko = CHIPS.find(c=>c.ko); S.days[d[2]][o].obs = [ko.i];
            persist();
            return {pa: n2Praxis(a), pf: n2Praxis(f), ek: n2Exam(k), fk: n2Final(k), pk: n2Praxis(k).avg, ko: n2Crit(d[2], o)[ko.c], dko: n2Day(d[2], o), crits: CRITS.map(c=>c.k)}; }""")
        ok(P + "C1 Entschuldigt zählt nicht, Team Market = 5.00", r["pa"]["n"] == 3 and abs(r["pa"]["avg"] - 5) < 1e-9, r["pa"])
        ok(P + "C2 Unentschuldigt = 1.00 an diesem Tag", abs(r["pf"]["avg"] - (1 + 5 * 3) / 4) < 1e-9, r["pf"])
        ok(P + "C3 Exam Day entschuldigt = 1.00, Schlussnote 2/3 Praxis + 1/3 Exam", r["ek"] == 1 and abs(r["fk"] - (2 * r["pk"] + 1) / 3) < 1e-9, (r["ek"], r["fk"]))
        ok(P + "C4 K.-o. setzt das Kriterium auf 1.00", r["ko"] == 1 and r["dko"] < 5, (r["ko"], r["dko"]))
        # Laptop: gleiche Zahlen wie Tablet
        m = pg.evaluate("()=>S.students.map(s=>[n2Praxis(s.id).avg, n2Final(s.id)])")
        pg.click("#btnSwitch"); pg.wait_for_load_state(); pg.wait_for_timeout(700)
        lap = pg.evaluate("()=>S.students.map(s=>{ const g = gradedSlots().map(x=>dayTotal(x.id, s.id)).filter(v=>v!=null); return g.length ? g.reduce((a,b)=>a+b,0)/g.length : null; })")
        ok(P + "C5 Laptop rechnet dieselben Praxisnoten wie das Tablet", all((a is None and l is None) or abs(a - l) < 1e-9 for (a, _), l in zip(m, lap)), (m, lap))
        ok(P + "C6 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

        # Tägliche Dateien zusammenführen (kumulativ, mit Korrektur, zwei Geräte)
        c, pg, errs = start(b, sem, "2026-10-05")
        f1 = pg.evaluate("""()=>{ openSlot(curSlot); const s = S.students; S.days[curSlot][s[1].id].att = 'late'; S.days[curSlot][s[0].id].obs = [CHIPS.find(c=>c.d>0).i]; persist(); return snapshot(); }""")
        pg.clock.set_fixed_time(AT("2026-10-06")); pg.reload(); pg.wait_for_timeout(400)
        f2 = pg.evaluate("""()=>{ openSlot(curSlot); const s = S.students; S.days['d01'][s[1].id].att = 'excused'; S.days[curSlot][s[2].id].obs = [CHIPS.find(c=>c.d<0).i]; persist(); return snapshot(); }""")
        c.close()
        # zweites Gerät (Kollegin Mittwoch/Donnerstag)
        c, pg, errs2 = start(b, sem, "2026-10-07")
        f3 = pg.evaluate("""()=>{ openSlot(curSlot); S.days[curSlot][S.students[3].id].att = 'late'; persist(); return {snap: snapshot(), lab: slotLabel(slotById(curSlot),'de')}; }""")
        c.close()
        ok(P + "C7 Zweites Gerät erfasst am Mittwoch auf Mittwoch (nicht auf Montag)", "07.10." in f3["lab"], f3["lab"])
        f3 = f3["snap"]
        lapfile = sem["pakete"][0]["laptop"]
        c = b.new_context(viewport={"width": 1280, "height": 900}); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(U + lapfile); pg.wait_for_timeout(500)
        files = [{"name": "Tag3.json", "mimeType": "application/json", "buffer": json.dumps(f3).encode()},
                 {"name": "Tag2.json", "mimeType": "application/json", "buffer": json.dumps(f2).encode()},
                 {"name": "Tag1.json", "mimeType": "application/json", "buffer": json.dumps(f1).encode()}]
        pg.evaluate("()=>{ window.__t = []; const o = window.toast; window.toast = m => { __t.push(m); o(m); }; view='data'; render(); }"); pg.wait_for_timeout(100)
        pg.set_input_files("#mergeFiles", files=files); pg.wait_for_timeout(800)
        r = pg.evaluate("""()=>({n:S.students.length, names:S.students.map(s=>s.last||s.name), days:Object.keys(S.days).sort(), att:(S.days.d01||{})[S.students.find(s=>(s.last||s.name).indexOf('Frei')===0).id],
                 toast:__t.join(' | '), dates:S.settings.slotDates, out:S.settings.outlet, sample:S.settings.isSample})""")
        ok(P + "C8 Zusammenführen in neue Laptop-Datei: keine Beispielpersonen", r["n"] == 5 and not r["sample"], r["names"])
        ok(P + "C9 Alle Tage beider Geräte vorhanden", r["days"] == ["d01", "d02", "d03"], r["days"])
        ok(P + "C10 Korrektur vom Folgetag gewinnt (verspätet -> entschuldigt)", r["att"] and r["att"]["att"] == "excused", r["att"])
        ok(P + "C11 Keine Fehlalarme «doppelt erfasst» bei gleichen Einträgen", "doppelt" not in r["toast"], r["toast"][:140])
        ok(P + "C12 Daten und Outlet aus den Dateien übernommen", r["dates"] and r["dates"][0] == D4[0] and r["out"] == outlet, (r["dates"], r["out"]))
        ok(P + "C13 keine JavaScript-Fehler", not errs and not errs2, (errs + errs2)[:2]); c.close()

        # ================= Persona D: Technik-Muffel =================
        c, pg, errs = start(b, sem, "2026-10-06")
        pg.evaluate("()=>{ openSlot(curSlot); S.days[curSlot][S.students[0].id].obs=['" + ("hyg-n1" if bereich == "kueche" else "") + "'].filter(Boolean); persist(); render(); }")
        before = pg.evaluate("()=>JSON.stringify(S.days)")
        bad = [("Rapport.pdf", b"%PDF-1.4 kaputt"), ("leer.json", b""), ("sem.json", json.dumps(sem).encode())]
        msgs = []
        for n, buf in bad:
            pg.evaluate("()=>{ view='set'; render(); }")
            pg.set_input_files("#view input[type=file]", files=[{"name": n, "mimeType": "application/json", "buffer": buf}]); pg.wait_for_timeout(250)
            msgs.append(pg.locator("#toast").text_content())
        ok(P + "D1 Falsche Dateien: Meldung, nichts geht verloren", pg.evaluate("()=>JSON.stringify(S.days)") == before and all(msgs), msgs[:2])
        ok(P + "D2 Semesterpaket in der falschen Seite: Hinweis auf die Startseite", "Startseite" in msgs[2], msgs[2])
        r = pg.evaluate("""async ()=>{ let dl = 0; const oc = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function(){ if(this.download) dl++; else oc.call(this); };
            navigator.canShare = () => true; navigator.share = async () => { const e = new Error('x'); e.name = 'AbortError'; throw e; };
            await shareDay(); await backupSave(); HTMLAnchorElement.prototype.click = oc; return dl; }""")
        ok(P + "D3 Teilen abgebrochen: kein ungewollter Download, kein Fehler", r == 0, r)
        pg.evaluate("()=>{ view='day'; curSlot='d03'; render(); }")
        pg.locator("text=Tag erfassen").dblclick(); pg.wait_for_timeout(150)
        ok(P + "D4 Doppeltipp auf «Tag öffnen»: ein Tag, alle Personen", pg.evaluate("()=>Object.keys(S.days.d03||{}).length") == len(PEOPLE), "")
        # anderes Paket laden: Abbrechen behält die Daten, Text nennt den aktuellen Knopf
        dlg = []
        def onD(d): dlg.append(d.message); d.dismiss()
        pg.on("dialog", onD)
        pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
        pg.evaluate("()=>{ const p = JSON.parse(JSON.stringify(SEM.pakete[0])); p.id = 'anderes'; p.paket.settings.paketId = 'anderes'; openPack(p, false); }")
        pg.wait_for_load_state(); pg.wait_for_timeout(500)
        ok(P + "D5 Fremdes Paket: Rückfrage nennt «Tag senden», Abbrechen behält Daten", dlg and "Tag senden" in dlg[0] and pg.evaluate("()=>JSON.stringify(S.days)") != "{}", dlg[:1])
        pg.remove_listener("dialog", onD)
        ok(P + "D6 keine JavaScript-Fehler", not errs, errs[:2]); c.close()
        # Speicher gesperrt (z. B. privater Modus): Warnung sichtbar in der Tagesansicht
        blk = "(()=>{ const o = Storage.prototype.setItem; Storage.prototype.setItem = function(k, v){ if(String(k).indexOf('rapport.mobil') >= 0 || k === 'kr.probe') throw new Error('QuotaExceededError'); return o.call(this, k, v); }; })()"
        c, pg, errs = start(b, sem, "2026-10-06", init=blk)
        txt = pg.locator("#view").text_content()
        ok(P + "D7 Speicher gesperrt: Warnung direkt in der Tagesansicht", "speichert gerade nichts" in txt and "Sichern" in txt, txt[:120])
        ok(P + "D8 keine JavaScript-Fehler", not errs, errs[:2]); c.close()
    # C14: The Essence, 5 Tage + 4 Tage + Exam in der 10-Tage-Laptop-Datei, Daten an der richtigen Stelle
    pl = plan("kueche", "The Essence", "Muster Koch")
    D5 = ["2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-28"]
    for st in pl["studierende"]:
        st["einsaetze"] = [{"bereich": "kueche", "outlet": "The Essence", "von": D5[0], "bis": D5[-1], "variante": "5T", "block": "Zyklus 2.1", "tage": [T(d, "The Essence") for d in D5]}] + st["einsaetze"]
        st["einsaetze"][1]["outlet"] = "The Essence"; st["einsaetze"][1]["tage"] = [T(d, "The Essence") for d in D4]
    sem = semester(b, pl)
    snaps = []
    for i, pk in enumerate(sem["pakete"]):
        o = json.loads(json.dumps(pk["paket"])); o["variant"] = pk["variante"]; o["savedAt"] = "2026-10-0%dT10:00:00Z" % (i + 1)
        o["days"] = {"d01": {s["id"]: {"att": "present", "obs": [], "note": None} for s in o["students"]}}
        snaps.append({"name": "t%d.json" % i, "mimeType": "application/json", "buffer": json.dumps(o).encode()})
    c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(U + "kueche/Kuechenrapport.html"); pg.wait_for_timeout(400); pg.evaluate("()=>{ view='data'; render(); }")
    pg.set_input_files("#mergeFiles", files=snaps); pg.wait_for_timeout(600)
    r = pg.evaluate("()=>({d:S.settings.slotDates, k:Object.keys(S.days).sort(), n:S.students.length, l:slotLabel(slots()[5],'de'), x:slotLabel(slots()[9],'de')})")
    ok("Kueche · C14 10 Tage aus 5T + 4T: Daten und Tage an der richtigen Stelle", r["d"] and len(r["d"]) == 10 and r["d"][0] == D5[0] and r["d"][5] == D4[0] and r["d"][9] == EX and r["k"] == ["d01", "d06"] and r["n"] == 5, r)
    ok("Kueche · C15 keine JavaScript-Fehler", not errs, errs[:2]); c.close()
    b.close()
srv.shutdown()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Personas.txt").write_text("QA-LOOP MIT VIER PERSONAS %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + "\n".join(res) + "\n", encoding="utf-8")
