# -*- coding: utf-8 -*-
"""Daily Grades: Korrekturen Mobil und Startseite (Review 31.10.2026).
M1/M2 Freitext behält Kriterium, Wirkung und «intern» · M3 Namensliste ordnet nach Nr., E-Mail, Name zu ·
M4 heutiger Einsatztag nach dem Wechsel und nach einem neuen Kalendertag · M5 Zusammenfassung zählt «tml» ·
M6 neu ausgestelltes Paket, Erfolgsmeldung nur bei Erfolg, Rückfrage beim Wechsel · M7 alter Baustein «Verspätet» ·
M8 Anrede mit Vorname · M9 Hinweis Startseite · M10 Tag senden ohne Teilen-Menü · M11 mein.html robust ·
M13 Sicherung laden · M14 «Thank you» · D1 Rundung · D6 Anzeigen legt keine Datensätze an · D11 Beobachtungen nur
aus Tagen «anwesend»/«verspätet» · Startlink-Plan mit Komma im Namen."""
import pathlib, json, threading, functools, http.server, socketserver, datetime, copy, urllib.parse
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-78s %s" % (n, str(i)[:150]))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=str(D))); U = "http://127.0.0.1:%d/" % srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

# Einsatztage rund um heute: Tag 5 ist heute, Exam Day fünf Tage später
TODAY = datetime.date.today()
DAYS = [(TODAY + datetime.timedelta(days=k - 4)).isoformat() for k in range(9)]
EXAM = (TODAY + datetime.timedelta(days=5)).isoformat()
T = lambda d, o, c: dict(datum=d, outlet=o, schicht=c)
plan = {"format":"praxisrapport-turnusplan","version":1,"semester":"TEST","wochentage":["mo","tu","we","th","fr","sa","su"],
 "dozierende":[{"name":"Lehrer Service","bereich":"service","outlets":["Campigiana"],"sprache":"de"},
               {"name":"Lehrer Kueche","bereich":"kueche","outlets":["The Essence"],"sprache":"de"}],
 "studierende":[
  {"nr":"21","nachname":"Da Silva","vorname":"Rui","nickname":"Zé","email":"rui@beispiel.ch","klasse":"HFD","gruppe":"Gruppe 1 Team A","sprache":"de","einsaetze":[
   {"bereich":"service","outlet":"Campigiana","von":DAYS[0],"bis":EXAM,"variante":"10T","block":"Zyklus 4.1","exam":EXAM,"tage":[T(d,"Campigiana","S") for d in DAYS]},
   {"bereich":"kueche","outlet":"The Essence","von":DAYS[0],"bis":EXAM,"variante":"10T","block":"Zyklus 4.2","exam":EXAM,"tage":[T(d,"The Essence","K1") for d in DAYS]}]},
  {"nr":"22","nachname":"Muster","vorname":"Emma","nickname":"","email":"emma@beispiel.ch","klasse":"HFE1","gruppe":"Gruppe 1 Team A","sprache":"en","einsaetze":[
   {"bereich":"service","outlet":"Campigiana","von":DAYS[0],"bis":EXAM,"variante":"10T","block":"Zyklus 4.1","exam":EXAM,"tage":[T(d,"Campigiana","S") for d in DAYS]},
   {"bereich":"kueche","outlet":"The Essence","von":DAYS[0],"bis":EXAM,"variante":"10T","block":"Zyklus 4.2","exam":EXAM,"tage":[T(d,"The Essence","K1") for d in DAYS]}]}]}

APPS = [("kueche", "kueche/Kuechenrapport_Mobil.html", "Kuechenrapport_Mobil.html", "kueche/Kuechenrapport.html", "first"),
        ("service", "service/Servicerapport_Mobil.html", "Servicerapport_Mobil.html", "service/Servicerapport.html", "vorname")]
LOADJS = """async (o)=>{ return await onLoadBackup({target:{files:[new File([JSON.stringify(o)], 'p.json')], value:''}}); }"""
DLG = {"mode": "accept", "msgs": []}
def on_dialog(d):
    DLG["msgs"].append(d.message)
    d.accept() if DLG["mode"] == "accept" else d.dismiss()
def ctx(b, mobile=True):
    c = b.new_context(viewport={"width": 820, "height": 1180} if mobile else {"width": 1366, "height": 900}, accept_downloads=True,
                      has_touch=mobile, user_agent=("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)" if mobile else None))
    c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
    return c
def page(c):
    pg = c.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("dialog", on_dialog)
    return pg, errs

with sync_playwright() as p:
    b = p.chromium.launch()
    c = ctx(b, False); pg, errs = page(c)
    pg.goto(U + "cockpit.html"); pg.fill("#planText", json.dumps(plan)); pg.click("#btnPlan"); pg.wait_for_timeout(300)
    PK = {x["app"]: x for x in pg.evaluate("()=>PACKS.map(p=>packageJSON(p))")}
    SEM = {x["data"]["dozent"]["bereich"]: x["data"] for x in pg.evaluate("()=>semesterPackages()")}
    c.close()
    PKG = {"kueche": PK["Kuechenrapport"], "service": PK["Servicerapport"]}
    FOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8DwnwEJMDEgAQAbjAIDtIxvqQAAAABJRU5ErkJggg=="
    for pk in PKG.values():
        for s in pk["students"]: s["foto"] = FOTO

    # ================= A · Mobil: Erfassung, Mail, Namensliste =================
    for area, app, fname, laptop, fkey in APPS:
        A = "Mobil " + area + ": "
        c = ctx(b); pg, errs = page(c)
        pg.goto(U + app); pg.wait_for_timeout(300)
        r = pg.evaluate("""async (o)=>{ const bad = await onLoadBackup({target:{files:[new File(['{kaputt'], 'x.json')], value:''}});
            const sem = await onLoadBackup({target:{files:[new File([JSON.stringify({format:'praxisrapport-semesterpaket', pakete:[]})], 's.json')], value:''}});
            const good = await onLoadBackup({target:{files:[new File([JSON.stringify(o)], 'p.json')], value:''}});
            return [bad, sem, good, S.students.length]; }""", PKG[area])
        ok(A + "Sicherung laden meldet true/false (kaputt, Semesterpaket, gültig)", r == [False, False, True, 2], r)
        pg.evaluate("()=>{ slots().forEach(x=>openSlot(x.id)); persist(); }")

        # M1/M2: Freitext am Tablet ändern, Laptop-Zuordnung und «intern» bleiben
        crit = "sel"
        before = pg.evaluate("""(k)=>{ const s = S.students[0], d = slots()[0].id;
            S.days[d][s.id] = {att:'present', obs:[], note:{txt:'Hat den Posten übernommen', crit:k, dir:1, w:0.5, internal:true}};
            persist(); curSlot = d; view = 'day'; render(); openSheet(s); return n2Day(d, s.id); }""", crit)
        pg.locator(".sheet .critbar button").last.click(); pg.wait_for_timeout(80)
        info = pg.locator(".sheet .sheet-b").inner_text()
        pg.locator(".sheet textarea").click(); pg.keyboard.press("End"); pg.keyboard.type("."); pg.wait_for_timeout(80)
        pg.locator(".sheet .sheet-f .btn.pri").click(); pg.wait_for_timeout(80)
        after = pg.evaluate("()=>{ const s = S.students[0], d = slots()[0].id; return [n2Day(d, s.id), S.days[d][s.id].note]; }")
        n = after[1] or {}
        ok(A + "M1 Freitext ändern: Kriterium, Wirkung, intern und Tagesnote bleiben", abs(after[0] - before) < 1e-9 and n.get("txt") == "Hat den Posten übernommen."
           and n.get("crit") == crit and n.get("dir") == 1 and n.get("w") == 0.5 and n.get("internal") is True, (before, after))
        ok(A + "M1 Blatt zeigt die Laptop-Zuordnung und «intern»", "+0.50" in info and "🔒" in info, info[-160:])
        pg.reload(); pg.wait_for_timeout(400)
        n = pg.evaluate("()=>S.days[slots()[0].id][S.students[0].id].note")
        ok(A + "M2 nach dem Neuladen bleibt die Notiz intern", bool(n and n.get("internal") is True and n.get("crit") == crit), n)
        r = pg.evaluate("""async ()=>{ const o = JSON.parse(JSON.stringify(snapshot())); await onLoadBackup({target:{files:[new File([JSON.stringify(o)], 'p.json')], value:''}});
            return S.days[slots()[0].id][S.students[0].id].note.internal; }""")
        ok(A + "M2 Sicherung laden behält «intern»", r is True, r)

        # D6: Anzeigen legt keine Tagesdatensätze an
        r = pg.evaluate("""()=>{ const s = S.students[1], d = slots()[3].id; delete S.days[d][s.id]; persist();
            curSlot = d; view = 'day'; render(); const a = !!S.days[d][s.id];
            openSheet(s); const b2 = !!S.days[d][s.id];
            [...document.querySelectorAll('.sheet .critbar button')][1].click(); const c2 = !!S.days[d][s.id];
            document.querySelector('.sheet .att button.warn').click(); const r2 = S.days[d][s.id];
            document.querySelector('.sheet .sheet-f .btn.pri').click(); return [a, b2, c2, r2 && r2.att]; }""")
        ok(A + "D6 Liste und Blatt ansehen legt nichts an, Tippen schon", r == [False, False, False, "late"], r)

        # M7: alter Baustein «Verspätet» wird nicht mehr angeboten
        r = pg.evaluate("""()=>{ const s = S.students[1], d = slots()[4].id; S.days[d][s.id] = {att:'present', obs:[], note:null}; curSlot = d; render(); openSheet(s);
            const tea = [...document.querySelectorAll('.sheet .critbar button')].find(b => /team/i.test(b.textContent));
            tea.click(); const ids = () => [...document.querySelectorAll('.sheet .chip .tx')].map(x => x.firstChild.textContent);
            const q = ids(); const more = document.querySelector('.sheet .morebtn'); if(more) more.click(); const all = ids();
            document.querySelector('.sheet .sheet-f .btn.pri').click();
            return {q, all, late: CHIP[N2_LATE].t.de, inQuick: Object.values(QUICK).some(a => a.includes(N2_LATE))}; }""")
        ok(A + "M7 «Verspätet» weder in Häufig noch in «alle zeigen»", r["late"] not in r["q"] and r["late"] not in r["all"] and not r["inQuick"] and len(r["all"]) > len(r["q"]), (len(r["q"]), len(r["all"]), r["late"]))
        r = pg.evaluate("""()=>{ const s = S.students[1], d = slots()[4].id; S.days[d][s.id] = {att:'present', obs:[N2_LATE], note:null}; render(); openSheet(s);
            const tea = [...document.querySelectorAll('.sheet .critbar button')].find(b => /team/i.test(b.textContent)); tea.click();
            const chip = [...document.querySelectorAll('.sheet .chip')].find(x => x.querySelector('.tx').firstChild.textContent === CHIP[N2_LATE].t.de);
            const shown = !!chip && chip.getAttribute('aria-pressed') === 'true'; if(chip) chip.click();
            const left = [...document.querySelectorAll('.sheet .chip .tx')].some(x => x.firstChild.textContent === CHIP[N2_LATE].t.de);
            document.querySelector('.sheet .sheet-f .btn.pri').click(); return [shown, S.days[d][s.id].obs.includes(N2_LATE), left]; }""")
        ok(A + "M7 gesetzter alter Baustein bleibt sichtbar und lässt sich entfernen", r == [True, False, False], r)

        # M7/D11/M8/M14: Feedback-Mail
        r = pg.evaluate("""(fk)=>{ const s = S.students[0], sl = slots().filter(x=>!x.exam);
            sl.forEach(x => { S.days[x.id][s.id] = {att:'present', obs:[], note:null}; });
            S.days[sl[1].id][s.id] = {att:'present', obs:[N2_LATE], note:null};
            S.days[sl[2].id][s.id] = {att:'late', obs:[N2_LATE], note:null};
            const pos = CHIPS.find(c => c.d > 0 && c.c === CRITS[2].k), neg = CHIPS.find(c => c.d < 0 && !c.ko && c.i !== N2_LATE && c.c === CRITS[3].k);
            S.days[sl[5].id][s.id] = {att:'tm', obs:[pos.i, neg.i], note:null};
            S.days[sl[6].id][s.id] = {att:'excused', obs:[pos.i, neg.i], note:null};
            persist(); const de = n2FbText(s, 'de', false).body, en = n2FbText(S.students[1], 'en', false).body;
            const s2 = JSON.parse(JSON.stringify(s)); delete s2.first; s2.name = (s2.nachname || s2.last) + ' ' + (s2.vorname || s2.first || 'Rui');
            return {de, en, pos: pos.t.de, neg: neg.t.de, late: CHIP[N2_LATE].t.de, ohneFirst: n2FbText(Object.assign(s2, {vorname: s2.vorname || 'Rui'}), 'de', false).body.split('\\n')[0]}; }""", fkey)
        ok(A + "M7 Tage mit altem Baustein zählen als Verspätung (2×), kein Verbesserungspunkt", "Sie waren 2× verspätet." in r["de"] and r["late"] not in r["de"], [x for x in r["de"].split("\n") if "verspät" in x.lower()])
        ok(A + "D11 Beobachtungen von Team-Market- und entschuldigten Tagen nicht in der Mail", r["pos"] not in r["de"] and r["neg"] not in r["de"], (r["pos"], r["neg"]))
        ok(A + "M8 Anrede mit Vorname, nicht mit Nickname", r["de"].startswith("Guten Tag Rui,") and r["ohneFirst"] == "Guten Tag Rui,", (r["de"][:20], r["ohneFirst"]))
        ok(A + "M14 Englisch: «Thank you» gross", "\n\nThank you for your work with us" in r["en"] and r["en"].startswith("Dear Emma,"), r["en"][:70])

        # M5: Zusammenfassung zählt tml als Verspätung und TM/OC
        r = pg.evaluate("""()=>{ const s = S.students[1], sl = slots().filter(x=>!x.exam);
            sl.forEach(x => { S.days[x.id][s.id] = {att:'present', obs:[], note:null}; });
            S.days[sl[0].id][s.id] = {att:'tml', obs:[], note:null}; S.days[sl[1].id][s.id] = {att:'late', obs:[], note:null};
            return n2SummaryText().body.split('\\n').filter(x => x.indexOf('Muster') >= 0 || x.indexOf('verspätet') >= 0).join(' | '); }""")
        ok(A + "M5 Zusammenfassung: tml zählt als Verspätung und TM/OC", "verspätet 2" in r and "TM/OC 1" in r, r)

        # D1: Rundung auf 0.1 mit Zuschlag, Schlusssatz und Farbe nach dem gerundeten Wert
        r = pg.evaluate("""()=>{ const g = (2*4 + 4.45)/3; const s = S.students[0];   // 4.15, als Zahl 4.1499999…
            const oP = n2Praxis, oF = n2Final;
            n2Praxis = () => ({avg: 3.96, n: 1}); const txt = n2FbText(s, 'de', true).body;
            n2Final = () => 3.96; view = 'grades'; render(); const pill = document.querySelector('#view .gbox .gpill.strong');
            const out = [Math.round(g * 10) / 10 === 4.1, n2Fmt1(g), txt.indexOf(N2FB.de.c3) >= 0, txt.indexOf(N2FB.de.c4) >= 0, txt.indexOf('Praxisnote für diesen Einsatz: 4.0.') >= 0,
                         pill ? pill.textContent : null, pill ? pill.className : ''];
            n2Praxis = oP; n2Final = oF; view = 'day'; render(); return out; }""")
        ok(A + "D1 4.15 aus einer Rechnung (4.1499…) ergibt 4.2", r[0] and r[1] == "4.2", r[:2])
        ok(A + "D1 Praxisnote 3.96 → «4.0», Schlusssatz und Farbe wie 4.0", r[2] and not r[3] and r[4] and r[5] == "4.0" and "g-mid" in r[6] and "g-bad" not in r[6], r[2:])

        # M9: Hinweis auf die persönliche Startseite
        r = pg.evaluate("()=>['de','en','th'].map(l => T[l].homeHint)")
        ok(A + "M9 Setup-Hinweis: Rapport über das Symbol «Daily Grades» öffnen (DE/EN/TH)", all("Daily Grades" in x for x in r) and "Zum Home-Bildschirm" not in r[0], r[0][:80])

        # M10: Tag senden ohne Teilen-Menü
        pg.evaluate("""()=>{ Object.defineProperty(navigator, 'canShare', {value: () => false, configurable: true}); window.__mail = '';
            window.n2Mailto = h => { window.__mail = h; }; const s = S.students[1], d = slots()[0].id; S.days[d][s.id].att = 'late';
            curSlot = d; view = 'day'; render(); }""")
        with pg.expect_download() as dl:
            pg.locator("#bar .btn.pri").click()
        pg.wait_for_timeout(700)
        mail = urllib.parse.unquote(pg.evaluate("()=>window.__mail"))
        ok(A + "M10 ohne Teilen-Menü: Datei geladen, dann Mail an die Kursleitung", dl.value.suggested_filename.endswith(".json") and mail.startswith("mailto:michael.pilman@ehl.ch?subject=Tagesrapport"), (dl.value.suggested_filename, mail[:80]))
        ok(A + "M10 Mail mit Absenzen und Bitte, die Datei anzuhängen", "Absenzen:" in mail and "Muster" in mail and ("Anhang: " + dl.value.suggested_filename) in mail and "Bitte hänge" in mail, mail[-200:])

        # M13: Sicherung laden, Timer zeichnet das Setup nicht über die Tagesansicht
        pg.evaluate("()=>{ view = 'set'; render(); }")
        lb = pg.locator("#view .card.pad .btn.pri.wide").first
        lb.click(); pg.wait_for_timeout(150)
        with pg.expect_file_chooser() as fc:
            lb.click()
        fc.value.set_files(files=[{"name": "Sicherung.json", "mimeType": "application/json", "buffer": json.dumps(PKG[area]).encode()}])
        pg.wait_for_timeout(6600)
        r = pg.evaluate("()=>[view, !!document.getElementById('mStud'), document.getElementById('slots').classList.contains('hide')]")
        ok(A + "M13 nach dem Laden bleibt die Tagesansicht (kein Setup nach 6 s)", r == ["day", False, False], r)
        pg.evaluate("()=>{ view = 'set'; render(); }")
        lb = pg.locator("#view .card.pad .btn.pri.wide").first
        lb.click(); pg.wait_for_timeout(100); pg.evaluate("()=>{ view = 'day'; render(); }"); pg.wait_for_timeout(6200)
        r = pg.evaluate("()=>[view, !!document.getElementById('mStud')]")
        ok(A + "M13 scharf geschaltet und weggewechselt: kein Setup in der Tagesansicht", r == ["day", False], r)

        # M3: Namensliste, Zuordnung nach Nr., E-Mail, Name
        pg.evaluate(LOADJS, PKG[area]); pg.wait_for_timeout(100)
        g0 = pg.evaluate("""()=>{ slots().forEach(x=>openSlot(x.id)); const s = S.students.find(x=>x.nr==='21'), e = S.students.find(x=>x.nr==='22');
            S.days[slots()[0].id][s.id] = {att:'present', obs:[CHIPS.find(c=>c.d<0 && !c.ko).i], note:null};
            S.days[slots()[1].id][e.id] = {att:'late', obs:[], note:null}; persist(); view = 'set'; render();
            return [s.id, e.id, n2Praxis(s.id).avg, !!s.foto, !!s.schichtPlan]; }""")
        v = pg.locator("#mStud").input_value()
        ok(A + "M3 Namensliste schreibt die Nummer mit (#21)", "; #21" in v and "; #22" in v, v.replace("\n", " | ")[:160])
        if area == "kueche":     # Umbenennen ohne E-Mail: Zuordnung über die Nummer
            v2 = "\n".join(("Da Silva; Rui Pedro; Zé; #21" if l.startswith("Da Silva") else l) for l in v.split("\n"))
        else:                    # Umbenennen ohne Nummer: Zuordnung über die E-Mail
            v2 = "\n".join(("Da Silva Costa; Rui; Zé; rui@beispiel.ch" if l.startswith("Da Silva") else l) for l in v.split("\n"))
        v2 += "\nMuster; Emma; emma.zwei@beispiel.ch"
        pg.fill("#mStud", v2); pg.locator("#view .card.pad >> text=Übernehmen").click(); pg.wait_for_timeout(150)
        g1 = pg.evaluate("""(o)=>{ const s = S.students.find(x=>x.id===o[0]); const emmas = S.students.filter(x=>(x.vorname||x.first)==='Emma');
            return [!!s, s && (s.first||s.vorname), s && (s.last||s.nachname), s && s.nr, s && !!s.foto, s && !!s.schichtPlan, s && n2Praxis(s.id).avg, S.students.length,
                    emmas.map(x=>[x.id===o[1], x.mail]), s && s.name]; }""", g0)
        ok(A + "M3 Namenskorrektur: gleiche Person (ID, Nr., Foto, Schichtplan, Tage)", g1[0] and g1[3] == "21" and g1[4] == g0[3] and g1[5] == g0[4] and abs(g1[6] - g0[2]) < 1e-9, g1[:7])
        ok(A + "M3 gleicher Name, andere E-Mail: zwei Personen", g1[7] == 3 and sorted(x[0] for x in g1[8]) == [False, True], g1[7:9])
        # Person mit erfassten Tagen entfernen: zuerst fragen, Abbrechen ändert nichts
        pg.evaluate("()=>{ view = 'set'; render(); }")
        v3 = "\n".join(l for l in pg.locator("#mStud").input_value().split("\n") if "emma@beispiel.ch" not in l)
        DLG["mode"] = "dismiss"; DLG["msgs"].clear()
        pg.fill("#mStud", v3); pg.locator("#view .card.pad >> text=Übernehmen").click(); pg.wait_for_timeout(150)
        r = pg.evaluate("(eid)=>[S.students.length, !!S.students.find(x=>x.id===eid), !!S.days[slots()[1].id][eid], view]", g0[1])
        ok(A + "M3 Entfernen mit erfassten Tagen: Rückfrage, Abbrechen ändert nichts", len(DLG["msgs"]) == 1 and "Muster" in DLG["msgs"][0] and r == [3, True, True, "set"], (DLG["msgs"][:1], r))
        DLG["mode"] = "accept"; DLG["msgs"].clear()
        pg.locator("#view .card.pad >> text=Übernehmen").click(); pg.wait_for_timeout(150)
        r = pg.evaluate("(eid)=>[S.students.length, !!S.students.find(x=>x.id===eid), Object.keys(S.days).some(d => S.days[d][eid])]", g0[1])
        ok(A + "M3 bestätigt: Person und ihre Tage entfernt (keine verwaisten Datensätze)", len(DLG["msgs"]) == 1 and r == [2, False, False], r)
        ok(A + "keine JavaScript-Fehler", not errs, errs[:2]); c.close()

        # Startlink: Plan mit Komma im Namen, alte Links
        for h, want, lab in (("#plan=mo:Geiser%2C%20Sybille,we:Laura%20Arcuri", {"mo": "Geiser, Sybille", "we": "Laura Arcuri"}, "Komma im Namen"),
                             ("#plan=mo%3ASybille%2Cwe%3ALaura", {"mo": "Sybille", "we": "Laura"}, "alter Link, ganz verschlüsselt"),
                             ("#plan=mo:Sybille+Geiser,tu:Laura", {"mo": "Sybille Geiser", "tu": "Laura"}, "alter Link mit +")):
            c = ctx(b); pg, errs = page(c)
            pg.goto(U + app + h); pg.wait_for_timeout(300)
            r = pg.evaluate("()=>S.settings.teacherPlan")
            ok(A + "Startlink-Plan: " + lab, r == want, r)
            c.close()

    # ================= B · Übergabe von mein.html, Wechsel, neuer Kalendertag =================
    for area, app, fname, laptop, fkey in APPS:
        B = "Übergabe " + area + ": "
        c = ctx(b); pg, errs = page(c)
        pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
        pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(SEM[area]).encode()}]); pg.wait_for_timeout(400)
        pg.evaluate("()=>openPack(SEM.pakete[0], false)"); pg.wait_for_url("**/" + fname + "**"); pg.wait_for_timeout(700)
        r = pg.evaluate("()=>[curSlot, slotById(curSlot).date, S.students.length, document.getElementById('toast').textContent]")
        ok(B + "mein.html: heutiger Einsatztag (Tag 5) und Erfolgsmeldung", r[0] == "d05" and r[1] == TODAY.isoformat() and r[2] == 2 and r[3].startswith("✓"), r)
        pg.evaluate("""()=>{ slots().forEach(x=>openSlot(x.id)); const s = S.students[0]; S.days.d01[s.id].obs = [CHIPS.find(c=>c.d>0).i]; persist(); }""")
        # M4: neuer Kalendertag, während die Seite offen war
        r = pg.evaluate("""()=>{ curSlot = 'd01'; view = 'day'; render(); openSheet(S.students[0]);
            document.dispatchEvent(new Event('visibilitychange')); const ohne = curSlot;
            n2Shown = '2000-01-01'; document.dispatchEvent(new Event('visibilitychange'));
            return [ohne, curSlot, !!document.getElementById('n2grade'), document.querySelector('.slot[aria-current=true] .sw').textContent]; }""")
        ok(B + "M4 neuer Kalendertag: heutiger Einsatztag, offenes Blatt geschlossen", r[0] == "d01" and r[1] == "d05" and r[2] is False, r)
        # M4 (Abnahme 31.10.2026): Wechsel Tablet -> Laptop -> Tablet bleibt auf dem Tag, an dem gearbeitet wurde
        pg.evaluate("()=>{ curSlot = 'd02'; render(); }")
        pg.click("#btnSwitch"); pg.wait_for_url("**/" + laptop.split("/")[1]); pg.wait_for_timeout(800)
        r1 = pg.evaluate("()=>curSlot")
        pg.evaluate("()=>{ curSlot = 'd02'; render(); }")
        pg.click("#btnSwitch"); pg.wait_for_url("**/" + fname); pg.wait_for_timeout(800)
        r2 = pg.evaluate("()=>[curSlot, S.days.d01[S.students[0].id].obs.length]")
        ok(B + "M4 nach dem Wechsel Laptop und zurück: gleicher Einsatztag wie vorher", r1 == "d02" and r2 == ["d02", 1], (r1, r2))
        # M6: gleiches Paket neu ausgestellt
        s2 = copy.deepcopy(SEM[area]); pk = s2["pakete"][0]["paket"]["settings"]
        neuEx = (TODAY + datetime.timedelta(days=6)).isoformat()
        pk["slotDates"][-1] = neuEx; pk["teacherPlan"] = {"mo": "Laura Arcuri", "tu": "Sybille Geiser"}; pk["block"] = "Zyklus 9.9"; pk["semester"] = "FS27"; pk["outlet2"] = "Umami"
        pg.goto(U + "mein.html"); pg.wait_for_timeout(200)
        pg.set_input_files("#file", files=[{"name":"S2.json","mimeType":"application/json","buffer":json.dumps(s2).encode()}]); pg.wait_for_timeout(400)
        pg.evaluate("()=>openPack(SEM.pakete[0], false)"); pg.wait_for_url("**/" + fname + "**"); pg.wait_for_timeout(700)
        r = pg.evaluate("()=>[S.settings.slotDates[9], slots()[9].date, S.settings.teacherPlan, S.settings.block, S.settings.semester, S.settings.outlet2, S.days.d01[S.students[0].id].obs.length]")
        ok(B + "M6 neu ausgestelltes Paket: Exam-Datum, Plan, Zyklus, Semester, 2. Restaurant übernommen", r[:6] == [neuEx, neuEx, {"mo": "Laura Arcuri", "tu": "Sybille Geiser"}, "Zyklus 9.9", "FS27", "Umami"], r[:6])
        ok(B + "M6 erfasste Tage bleiben", r[6] == 1, r[6])
        # M6: Erfolgsmeldung nur bei Erfolg
        pg.evaluate("""(o)=>{ const p = JSON.parse(JSON.stringify(o)); p.students = 'kaputt';
            localStorage.setItem('praxisrapport.handoff', JSON.stringify({target:location.pathname.split('/').pop(), id:'anderes-Paket', titel:'Zyklus X', at:Date.now(), paket:p})); }""", PKG[area])
        DLG["mode"] = "accept"; pg.reload(); pg.wait_for_timeout(700)
        r = pg.evaluate("()=>[document.getElementById('toast').textContent, S.students.length]")
        ok(B + "M6 abgelehntes Paket: keine Erfolgsmeldung, Daten unverändert", not r[0].startswith("✓") and r[1] == 2, r)
        # M6: Wechsel mit Tagen, die im mitgebrachten Stand fehlen
        pg.evaluate("""()=>{ const s = S.students[0]; S.days.d03[s.id] = {att:'present', obs:[CHIPS.find(c=>c.d>0).i], note:null}; persist();
            const o = JSON.parse(JSON.stringify(snapshot())); delete o.days.d03;
            localStorage.setItem('praxisrapport.handoff', JSON.stringify({target:location.pathname.split('/').pop(), id:S.settings.paketId, titel:'✓ Test', at:Date.now(), mode:'switch', paket:o})); }""")
        DLG["mode"] = "dismiss"; DLG["msgs"].clear(); pg.reload(); pg.wait_for_timeout(700)
        r = pg.evaluate("()=>!!(S.days.d03 && S.days.d03[S.students[0].id] && S.days.d03[S.students[0].id].obs.length)")
        ok(B + "M6 Wechsel: Rückfrage bei fehlenden Tagen, Abbrechen behält sie", len(DLG["msgs"]) == 1 and "fehlen" in DLG["msgs"][0] and r is True, (DLG["msgs"][:1], r))
        pg.evaluate("""()=>{ const o = JSON.parse(JSON.stringify(snapshot())); delete o.days.d03;
            localStorage.setItem('praxisrapport.handoff', JSON.stringify({target:location.pathname.split('/').pop(), id:S.settings.paketId, titel:'✓ Test', at:Date.now(), mode:'switch', paket:o})); }""")
        DLG["mode"] = "accept"; DLG["msgs"].clear(); pg.reload(); pg.wait_for_timeout(700)
        r = pg.evaluate("()=>!!(S.days.d03 && S.days.d03[S.students[0].id])")
        ok(B + "M6 Wechsel bestätigt: Stand übernommen", len(DLG["msgs"]) == 1 and r is False, r)
        ok(B + "keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ================= C · mein.html: robuste Felder, nur eigene Rapporte =================
    c = ctx(b); pg, errs = page(c)
    pg.goto(U + "mein.html"); pg.evaluate("()=>localStorage.setItem('praxisrapport.lang','en')"); pg.reload(); pg.wait_for_timeout(200)
    good = copy.deepcopy(SEM["kueche"]["pakete"][0])
    bad1 = copy.deepcopy(good); bad1.pop("von"); bad1["personen"] = None; bad1["titel"] = None
    bad2 = copy.deepcopy(good); bad2["mobil"] = "javascript:document.title='PWNED'"; bad2["id"] = "X"
    sem = {"format": "praxisrapport-semesterpaket", "version": 1, "dozent": {"name": "Test", "sprache": "en", "outlets": "kein Array"}, "pakete": [good, bad1, None, bad2]}
    pg.set_input_files("#file", files=[{"name":"S.json","mimeType":"application/json","buffer":json.dumps(sem).encode()}]); pg.wait_for_timeout(400)
    pg.reload(); pg.wait_for_timeout(400)
    btns = pg.evaluate("()=>[...document.querySelectorAll('main button')].map(b=>b.textContent)")
    ok("mein.html: Paket ohne «von», leere Felder, kein Array: keine Fehler", not errs, errs[:2])
    ok("mein.html: «Anderes Semesterpaket laden» und «entfernen» immer da", "Load another semester package" in btns and "Remove semester package from this device" in btns, btns)
    DLG["mode"] = "accept"; DLG["msgs"].clear()
    pg.evaluate("()=>openPack(SEM.pakete[3], false)"); pg.wait_for_timeout(300)
    ok("mein.html: fremdes Ziel (javascript:) abgelehnt, Meldung in der Seitensprache", pg.title() == "Daily Grades" and len(DLG["msgs"]) == 1 and DLG["msgs"][0].startswith("This package"), (pg.title(), DLG["msgs"]))
    DLG["msgs"].clear()
    pg.evaluate("()=>{ const p = JSON.parse(JSON.stringify(SEM.pakete[0])); delete p.paket; openPack(p, false); }"); pg.wait_for_timeout(200)
    ok("mein.html: Paket ohne Inhalt abgelehnt (Englisch)", len(DLG["msgs"]) == 1 and DLG["msgs"][0].startswith("Part of the semester"), DLG["msgs"])
    ok("mein.html: keine JavaScript-Fehler", not errs, errs[:2]); c.close()
    b.close()
srv.shutdown()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Fixes_Mobil.txt").write_text("PRUEFUNG KORREKTUREN MOBIL UND STARTSEITE %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + "\n".join(res) + "\n\n%d von %d\n" % (sum(x.startswith("OK") for x in res), len(res)), encoding="utf-8")
