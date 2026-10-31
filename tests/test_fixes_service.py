# -*- coding: utf-8 -*-
"""Servicerapport Laptop: Korrekturen nach dem Review vom 31.10.2026 (Entscheide D0 bis D17).

    python3 build.py && python3 tests/test_fixes_service.py

SheetJS fuer den Excel-Teil: DG_XLSX oder tests/.cache/xlsx.full.min.js (sonst wird das Excel-Blatt
nur ueber gradeRows geprueft). Protokoll: tests/Testprotokoll_Fixes_Service.txt
"""
import pathlib, json, os, sys, datetime, urllib.parse
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).parent.parent
D = R / "docs" / "service"
XLSX = pathlib.Path(os.environ.get("DG_XLSX") or (R / "tests" / ".cache" / "xlsx.full.min.js"))
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-80s %s" % (n, str(i)[:150]))

def cdn(route):
    if "xlsx" in route.request.url and XLSX.exists():
        route.fulfill(path=str(XLSX), content_type="application/javascript")
    else:
        route.abort()

def page(b, fn="Servicerapport.html", pol=None, clip=False):
    c = b.new_context(viewport={"width": 1366, "height": 900})
    c.route("https://cdnjs.cloudflare.com/**", cdn)
    c.route("https://fonts.googleapis.com/**", lambda r: r.abort())
    c.route("https://fonts.gstatic.com/**", lambda r: r.abort())
    if clip: c.grant_permissions(["clipboard-read", "clipboard-write"])
    pg = c.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    if pol is not None:
        pg.on("dialog", lambda d: (pol["msgs"].append(d.message), d.accept() if pol["accept"] else d.dismiss()))
    pg.goto((D / fn).as_uri()); pg.wait_for_timeout(300)
    return c, pg, errs

# Klasse ohne Beispielinhalt laden (wie eine Sicherung)
LOAD = """(o)=>{ S = {settings: Object.assign(sanitizeSettings(Object.assign({outlet:'Umami', teacher:'Q', group:'HFD', team:'Gruppe 1'}, o.settings || {})), {isSample:false}),
    students: saubereStudierende(o.students), days: sanitizeDays(o.days || {}), dayMeta: {}};
    curSlot = o.cur || 'd01'; view = o.view || 'day'; persist(); render(); return S.students.length; }"""
APPLY = """() => { const ta = document.querySelector('#fStud'); const b = [...document.querySelectorAll('button.pri')]
    .find(b => ta.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING); b.click(); }"""
CATCH = """() => { window.__mail = []; window.__saved = [];
    const oc = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(){ if(String(this.href).startsWith('mailto:')) window.__mail.push(this.href); else oc.call(this); };
    window.saveFile = async (n, d) => { window.__saved.push([n, !!JSON.parse(d).days]); return true }; }"""
dec = lambda h: urllib.parse.unquote(h or "")

# Fall aus einer Zufallssuche: Praxis 4.1409…, Exam 3.5682…, Schlussnote genau 3.95 (gerechnet 3.9499999999999993)
CASE = [["d01","present",["tea-n2","ver-n4"]],["d02","late",["tea-n2","ver-n7"]],["d03","present",["mep-n1","tec-p3","sel-n1","gas-n7"]],
        ["d04","present",["tec-n4","auf-n1","sel-p3","tec-n6","auf-n4"]],["d05","present",["mep-n7","mep-n2","auf-n4","auf-n2"]],
        ["d10","late",["mot-n3","gas-p3"]]]

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---------- D0 «Tag senden» mit Absenzen ----------
    c, pg, errs = page(b)
    pg.evaluate("()=>{ curSlot = 'd01'; view = 'day'; render(); }")         # Beispiel: Tag 1 mit Verspätung und Absenz
    pg.evaluate(CATCH)
    pg.locator(".n2bar .btn.pri").click(); pg.wait_for_timeout(300)
    r = pg.evaluate("()=>({mail: window.__mail, saved: window.__saved})")
    m = dec(r["mail"][0]) if r["mail"] else ""
    ok("D0 Tag senden mit Absenzen: Mail mit Verspätung und Anhang-Hinweis", m.startswith("mailto:michael.pilman@ehl.ch?subject=Tagesrapport") and "Verspätet" in m and "Anhang: " in m, m[:120])
    ok("D0 Tag senden mit Absenzen: Tagesdatei gespeichert", len(r["saved"]) == 1 and r["saved"][0][1] and r["saved"][0][0].endswith(".json"), r["saved"])
    ok("D0 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D1 Rundung auf 0.1 ----------
    c, pg, errs = page(b)
    f = pg.evaluate("()=>[fmt1(3.9499999999999993), bandName(3.9499999999999993,'de'), gradeClass(round1(3.9499999999999993)), fmt1(4.35-1e-15), fmt1(4.25), fmt1(null)]")
    ok("D1 fmt1/bandName mit Toleranz: 3.9499… -> 4.0 Genügend, nicht rot", f[:3] == ["4.0", "Genügend", ""] and f[3:] == ["4.4", "4.3", "–"], f)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max", "mail": "max@beispiel.ch"}],
                       "days": {d: {"a1": {"att": a, "obs": o, "note": None}} for d, a, o in CASE}, "view": "week"})
    r = pg.evaluate("""()=>{ const su = summary('a1','all'), ex = examSummary('a1'), fin = finalGrade(su.total, ex.total);
        const cell = [...document.querySelectorAll('#v-week tbody tr')][0].querySelectorAll('td')[CRITS.length + 3].querySelector('.grade');
        const rep = buildReport(S.students[0],'all','de');
        const g = gradeRows(), i = g.head.indexOf('Schlussnote'), j = g.head.indexOf('Gerundet');
        window.print = ()=>{}; printReports();
        const boxes = [...document.querySelectorAll('#printArea .pgbox')].map(x=>x.innerText.replace(/\\n/g,' '));
        return {fin, txt: cell.textContent, cls: cell.className, rep: rep.split('\\n').find(l=>l.startsWith('Schlussnote')),
                cl3: rep.includes(tOut('cl3','de')), xl: [g.rows[0][i], g.rows[0][i+1], g.rows[0][j]], box: boxes[2] || '',
                mail: overviewText(1).split('\\n').find(l=>l.startsWith('Muster')) }; }""")
    ok("D1 Übersicht: exakt 3.95 wird 4.0, nicht rot", abs(r["fin"] - 3.95) < 1e-9 and r["txt"] == "4.0" and "g-lo" not in r["cls"], (r["fin"], r["txt"], r["cls"]))
    ok("D1 Beurteilung: «Schlussnote: 4.0 (Genügend)» und Schlusssatz ab 4.00", r["rep"] == "Schlussnote: 4.0 (Genügend)" and r["cl3"], r["rep"])
    ok("D1 Excel: Schlussnote 3.95, gerundet 4.0", r["xl"][:2] == [3.95, 4.0], r["xl"])
    ok("D1 PDF: Schlussnote auf 0.1 gerundet mit Prädikat aus dem gerundeten Wert", "4.0" in r["box"] and "3.95" not in r["box"] and "Genügend" in r["box"], r["box"])
    ok("D1 Übersichtsmail: Schlussnote 4.0", r["mail"] and "Schlussnote 4.0" in r["mail"], r["mail"])
    # Breite Prüfung: gerundete Schlussnote = exakte Rechnung in Viertelpunkten, gerundet halb aufwärts
    r = pg.evaluate("""(N)=>{ let seed = 12345; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
        const pool = CHIPS.filter(c=>!c.ko && c.i !== LATE_CHIP);
        S.students = []; S.days = {}; for(let i=0;i<N;i++) S.students.push({id:'x'+i, nachname:'N'+i, vorname:'V', name:'N'+i+' V', mail:'', lang:''});
        slots().forEach(s=>{ S.days[s.id] = {}; S.students.forEach(st=>{ const o = []; const k = Math.floor(rnd()*5);
          for(let j=0;j<k;j++){ const c = pool[Math.floor(rnd()*pool.length)]; if(!o.includes(c.i)) o.push(c.i); }
          S.days[s.id][st.id] = {att: rnd() < 0.15 ? 'late' : 'present', obs:o, note:null}; }); });
        const wsum = BigInt(CRITS.reduce((a,c)=>a+critWeight(c.k),0)); let bad = 0;
        S.students.forEach(st=>{ let sumQ = 0n, n = 0n;
          gradedSlots().forEach(s=>{ const g = critGradesForDay(s.id, st.id); if(!g) return; n++; CRITS.forEach(c=>{ sumQ += BigInt(Math.round(g[c.k]*4) * critWeight(c.k)); }); });
          const ge = critGradesForDay(examSlot().id, st.id); let se = 0n; CRITS.forEach(c=>{ se += BigInt(Math.round(ge[c.k]*4) * critWeight(c.k)); });
          const num = 2n*sumQ + n*se, den = 12n*wsum*n, q = (num*20n + den) / (2n*den);
          const su = summary(st.id,'all'), ex = examSummary(st.id);
          if(fmt1(finalGrade(su.total, ex.total)) !== (Number(q)/10).toFixed(1)) bad++; });
        return bad; }""", 3000)
    ok("D1 3000 Zufallspersonen: gerundete Schlussnote stimmt mit exakter Rechnung", r == 0, r)
    # Farbe zweistelliger Noten aus dem gezeigten Wert (toFixed(2)): 3.995 -> «4.00» nicht rot, 4.745 -> «4.75» grün
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}, {"id": "b2", "nachname": "Beispiel", "vorname": "Emma"}],
                       "days": {"d01": {"a1": {"att": "present", "obs": [], "note": None}, "b2": {"att": "present", "obs": [], "note": None}}}})
    r = pg.evaluate("""()=>{ const orig = window.dayTotal; window.dayTotal = (d, sid) => sid === 'a1' ? 3.995 : 4.745; render();
        const p = [...document.querySelectorAll('article.stud .grade')].map(x=>[x.textContent, x.className]); window.dayTotal = orig;
        const os = window.summary; window.summary = (sid, m) => { const su = os(sid, m); if(su.total != null) su.total = sid === 'a1' ? 3.995 : 4.745; return su; };
        view = 'week'; render(); const w = [...document.querySelectorAll('#v-week tbody tr')].map(tr=>{ const s = tr.querySelectorAll('td')[CRITS.length + 1].querySelector('.grade'); return [s.textContent, s.className]; });
        const rep = buildReport(S.students[1],'all','de').split('\\n').find(l=>l.startsWith('Praxisnote')); window.summary = os; return {p, w, rep}; }""")
    ok("D1 Tagesnote: Farbe aus der gezeigten Zahl («4.00» nicht rot, «4.75» grün)", r["p"][0][0] == "4.00" and "g-lo" not in r["p"][0][1] and r["p"][1][0] == "4.75" and "g-hi" in r["p"][1][1], r["p"])
    ok("D1 Übersicht Praxisnote: Farbe aus der gezeigten Zahl", r["w"][0][0] == "4.00" and "g-lo" not in r["w"][0][1] and r["w"][1][0] == "4.75" and "g-hi" in r["w"][1][1], r["w"])
    ok("D1 Beurteilung: Prädikat aus der gezeigten Zahl («4.75» = Gut)", r["rep"] == "Praxisnote: 4.75 (Gut)", r["rep"])
    ok("D1 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D2 Schlussnote nur mit Praxis und Exam ----------
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}, {"id": "b2", "nachname": "Beispiel", "vorname": "Emma"}]})
    r = pg.evaluate("""()=>{ openSlot('d01'); openSlot('d02'); view = 'week'; render();
        const td = [...document.querySelectorAll('#v-week tbody tr')][0].querySelectorAll('td');
        const g = gradeRows(), i = g.head.indexOf('Schlussnote'); const rep = buildReport(S.students[0],'all','de').split('\\n');
        return {fn: [finalGrade(4.5, null), finalGrade(null, 4.5), finalGrade(4.5, 6)], cell: td[CRITS.length + 3].textContent,
                xl: [g.rows[0][i], g.rows[0][i+1]], rep: rep.slice(2,5), mail: overviewText(1).split('\\n').find(l=>l.startsWith('Muster')),
                hint: document.getElementById('v-week').innerText.includes(t('examOpen')) }; }""")
    ok("D2 finalGrade 10T: ohne Exam oder ohne Praxis null", r["fn"][:2] == [None, None] and abs(r["fn"][2] - 5) < 1e-9, r["fn"])
    ok("D2 Übersicht und Excel: Schlussnote leer («–» / leer)", r["cell"] == "–" and r["xl"] == ["", ""], (r["cell"], r["xl"]))
    ok("D2 Beurteilung: Praxisnote, Prüfungsnote –, Schlussnote –", r["rep"][0].startswith("Praxisnote: 4.50") and r["rep"][1] == "Prüfungsnote: –" and r["rep"][2] == "Schlussnote: –", r["rep"])
    ok("D2 Übersichtsmail: Schlussnote –", r["mail"] and "Prüfung –" in r["mail"] and "Schlussnote –" in r["mail"], r["mail"])
    ok("D2 keine JavaScript-Fehler", not errs, errs[:2]); c.close()
    c, pg, errs = page(b, "Servicerapport_5Tage_ohneExam.html")
    r = pg.evaluate("()=>[finalGrade(4.5, null), HAS_EXAM]")
    ok("D2 5T ohne Exam: Schlussnote = Praxisnote", r == [4.5, False], r); c.close()

    # ---------- D3 Freitext geht nie verloren ----------
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}, {"id": "b2", "nachname": "Beispiel", "vorname": "Emma"}]})
    pg.evaluate("()=>{ openSlot('d01'); render(); }")
    for how in ("Fertig oben", "Esc", "Klick daneben", "Reiterwechsel"):
        pg.evaluate("()=>{ curSlot = 'd01'; view = 'day'; render(); }")
        pg.locator("article.stud").nth(0).locator(".addbtn").click()
        pg.locator(".crittabs button.note").click()
        pg.fill("#noteTxt", "Notiz " + how); pg.select_option("#noteCrit", "sel"); pg.select_option("#noteEff", "-0.5")
        if how == "Fertig oben": pg.locator(".sheet-h button").click()
        elif how == "Esc": pg.keyboard.press("Escape")
        elif how == "Klick daneben": pg.mouse.click(6, 6)
        else:
            pg.locator(".crittabs button").first.click()
            ok("D3 Reiterwechsel: Freitext sofort übernommen", (pg.evaluate("()=>(S.days.d01.a1.note||{}).txt") or "") == "Notiz " + how)
            pg.locator(".sheet-h button").click()
        n = pg.evaluate("()=>S.days.d01.a1.note")
        ok("D3 Freitext bleibt nach Schliessen über «%s»" % how, bool(n) and n["txt"] == "Notiz " + how and n["crit"] == "sel" and n["dir"] == -1 and n["w"] == 0.5, n)
    pg.locator("article.stud").nth(0).locator(".addbtn").click(); pg.locator(".crittabs button.note").click()
    pg.fill("#noteTxt", "Notiz vor dem Neuladen")
    pg.evaluate("()=>window.dispatchEvent(new Event('pagehide'))")
    ok("D3 Freitext wird auch beim Verlassen der Seite übernommen", pg.evaluate("()=>S.days.d01.a1.note.txt") == "Notiz vor dem Neuladen")
    pg.locator(".sheet-h button").click()
    r = pg.evaluate("""()=>{ delete S.days.d01.b2; render(); return true; }""")
    pg.locator("article.stud").nth(1).locator(".addbtn").click(); pg.locator(".crittabs button.note").click(); pg.locator(".sheet-h button").click()
    ok("D3 leerer Freitext legt keinen Datensatz an", pg.evaluate("()=>S.days.d01.b2 === undefined"))
    ok("D3 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D4 «Übernehmen»: Zuordnung über Nummer, E-Mail, Name ----------
    pol = {"accept": False, "msgs": []}
    c, pg, errs = page(b, pol=pol)
    FOTO = "data:image/png;base64,iVBORw0KGgo="
    pg.evaluate(LOAD, {"students": [
        {"id": "p1", "nachname": "Amman", "vorname": "Lea", "mail": "lea@beispiel.ch", "nr": "1000000001", "foto": FOTO, "tmTage": [2], "schichtPlan": ["S", "OC"], "ortPlan": ["", "Da Fortunat"]},
        {"id": "p2", "nachname": "Keller", "vorname": "Timo", "mail": "timo@beispiel.ch"},
        {"id": "p3", "nachname": "Muster", "vorname": "Max"}]})
    pg.evaluate("()=>{ openSlot('d01'); S.days.d01.p1.obs = ['gas-p1']; S.days.d01.p2.att = 'late'; persist(); view = 'set'; render(); }")
    txt = pg.input_value("#fStud")
    ok("D4 Liste zeigt die Studierendennummer mit #", "#1000000001" in txt, [l for l in txt.split("\n") if l.startswith("Amman")])
    neu = txt.replace("Amman; Lea", "Ammann; Lea").replace("Keller; Timo", "Keller; Tim").replace("Muster; Max", "Muster; Max; max1@beispiel.ch") + "\nMuster; Max; max2@beispiel.ch"
    pg.fill("#fStud", neu); pg.evaluate(APPLY); pg.wait_for_timeout(100)
    r = pg.evaluate("""()=>S.students.map(s=>[s.id, s.nachname, s.vorname, s.nr||'', !!s.foto, JSON.stringify(s.tmTage||null), s.mail||''])""")
    a = [x for x in r if x[1] == "Ammann"]; k = [x for x in r if x[1] == "Keller"]; mu = [x for x in r if x[1] == "Muster"]
    ok("D4 Namenskorrektur mit Nummer: gleiche Id, Nummer, Foto und Plan bleiben", a and a[0][0] == "p1" and a[0][3] == "1000000001" and a[0][4] and a[0][5] == "[2]", a)
    ok("D4 Namenskorrektur mit gleicher E-Mail: gleiche Id", k and k[0][0] == "p2" and k[0][2] == "Tim", k)
    ok("D4 gleicher Name, zwei E-Mail-Adressen: zwei Personen", len(mu) == 2 and len({x[0] for x in mu}) == 2 and "p3" in {x[0] for x in mu}, mu)
    s1 = pg.evaluate("()=>{ const s = S.students.find(x=>x.id==='p1'); return summary(s.id,'all').counted; }")
    ok("D4 erfasste Tage bleiben bei der Person", s1 == 1 and not pol["msgs"], (s1, pol["msgs"]))
    # Person mit Einträgen fällt weg: Rückfrage, Abbrechen ändert nichts
    pg.evaluate("()=>{ view = 'set'; render(); }")
    weg = "\n".join(l for l in pg.input_value("#fStud").split("\n") if not l.startswith("Ammann"))
    before = pg.evaluate("()=>JSON.stringify(S.students)")
    pg.fill("#fStud", weg); pg.evaluate(APPLY); pg.wait_for_timeout(100)
    ok("D4 Wegfall mit Einträgen: Rückfrage, Abbrechen ändert nichts", len(pol["msgs"]) == 1 and "Ammann Lea" in pol["msgs"][0] and pg.evaluate("()=>JSON.stringify(S.students)") == before, pol["msgs"][:1])
    pol["accept"] = True
    pg.evaluate(APPLY); pg.wait_for_timeout(100)
    ok("D4 Wegfall bestätigt: Person entfernt", len(pol["msgs"]) == 2 and not pg.evaluate("()=>S.students.some(s=>s.id==='p1')"), pg.evaluate("()=>S.students.map(s=>s.name)"))
    ok("D4 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D5 Dateien anderer Apps ----------
    KUE = {"app": "Kuechenrapport", "variant": "10T", "savedAt": "2026-11-03T17:00:00Z", "settings": {"outlet": "Campigiana", "teacher": "K"},
           "students": [{"id": "k1", "name": "Muster Max", "last": "Muster", "first": "Max"}],
           "days": {"d01": {"k1": {"att": "present", "obs": ["hyg-ko", "tea-n1"], "note": None}}}, "dayMeta": {}}
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}]})
    r = pg.evaluate("""async (k)=>{ const t0 = []; const o = window.toast; window.toast = m => { t0.push(m); o(m); };
        await onMerge({target:{files:[new File([JSON.stringify(k)], 'Q_HFD_Campigiana_10T.json')], value:''}});
        const merged = JSON.stringify(S.days);
        const back = await onRestore({target:{files:[new File([JSON.stringify(k)], 'k.json')], value:''}});
        return {merged, toast: t0, back, outlet: S.settings.outlet, n: S.students.length}; }""", KUE)
    ok("D5 Zusammenführen: Küchenrapport abgelehnt, keine Tage übernommen", r["merged"] == "{}" and any("Passt nicht" in x and "Kuechenrapport" in x for x in r["toast"]), r["toast"][:1])
    ok("D5 Sicherung einlesen: Küchenrapport abgelehnt, nichts ersetzt", r["back"] is False and r["outlet"] == "Umami" and r["n"] == 1 and any("keine Servicerapport-Sicherung" in x for x in r["toast"]), (r["back"], r["outlet"]))
    ok("D5 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D6 Anzeigen legt keine Datensätze an ----------
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}, {"id": "b2", "nachname": "Neu", "vorname": "Nina"}],
                       "days": {"d01": {"a1": {"att": "present", "obs": [], "note": None}}, "d10": {"a1": {"att": "present", "obs": [], "note": None}}}})
    r = pg.evaluate("""()=>{ ['d01','d10','d01'].forEach(d=>{ curSlot = d; view = 'day'; render(); }); persist();
        const card = [...document.querySelectorAll('article.stud')][1];
        const st = JSON.parse(localStorage.getItem(KEY)).days;
        return {d01: S.days.d01.b2 === undefined && !('b2' in st.d01), d10: S.days.d10.b2 === undefined, counted: summary('b2','all').counted,
                ex: examSummary('b2'), badge: card.querySelector('.grade').textContent, pressed: card.querySelectorAll('.seg button[aria-pressed=true]').length}; }""")
    ok("D6 Tag ansehen legt für spätere Person keinen Datensatz an (auch Exam Day)", r["d01"] and r["d10"] and r["counted"] == 0 and r["ex"] is None, r)
    ok("D6 Person ohne Datensatz erscheint als «offen», keine Anwesenheit gewählt", r["badge"] == "offen" and r["pressed"] == 0, (r["badge"], r["pressed"]))
    pg.locator("article.stud").nth(1).locator(".seg button").first.click(); pg.wait_for_timeout(100)
    r = pg.evaluate("()=>[S.days.d01.b2 && S.days.d01.b2.att, summary('b2','all').counted]")
    ok("D6 Antippen von «Anwesend» legt den Datensatz an", r == ["present", 1], r)
    ok("D6 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D7 Exam Day mit denselben Knöpfen ----------
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}, {"id": "b2", "nachname": "Beispiel", "vorname": "Emma"}],
                       "days": {"d10": {"a1": {"att": "late", "obs": [], "note": None}, "b2": {"att": "excused", "obs": [], "note": None}}}, "cur": "d10"})
    r = pg.evaluate("""()=>[...document.querySelectorAll('article.stud')].map(c=>({n: c.querySelectorAll('.seg button').length,
        p: [...c.querySelectorAll('.seg button[aria-pressed=true]')].map(b=>b.textContent), g: c.querySelector('.grade').textContent}))""")
    ok("D7 Exam Day: fünf Knöpfe, verspätet erscheint als «Verspätet»", r[0]["n"] == 5 and r[0]["p"] == ["Verspätet"], r[0])
    ok("D7 Exam Day: entschuldigt bleibt 1.00", r[1]["p"] == ["Entschuldigt"] and r[1]["g"] == "1.00", r[1])
    ok("D7 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D8 Lange Mails: Text in die Zwischenablage ----------
    c, pg, errs = page(b, clip=True)
    many = [{"id": "s%d" % i, "nachname": "Nachname%d" % i, "vorname": "Vorname%d" % i, "mail": "s%d@beispiel.ch" % i, "lang": "zh" if i == 0 else "de"} for i in range(14)]
    pg.evaluate(LOAD, {"students": many})
    pg.evaluate("""()=>{ const pool = CHIPS.filter(c=>!c.ko && c.i !== LATE_CHIP); let k = 0;
        slots().forEach(s=>{ openSlot(s.id); S.students.forEach(st=>{ S.days[s.id][st.id].obs = [pool[k++ % pool.length].i, pool[k++ % pool.length].i, pool[k++ % pool.length].i]; }); });
        persist(); view = 'rep'; render(); }""")
    pg.evaluate(CATCH)
    hint = pg.evaluate("()=>t('mailClip')")
    href = pg.evaluate("()=>document.querySelector('#v-rep .rep a.btn').href")
    ok("D8 Feedback-Mail: Link höchstens 1800 Zeichen, mit Hinweis", len(href) <= 1800 and hint in dec(href), len(href))
    full = pg.evaluate("()=>buildReport(S.students[0],'all',outLangOf(S.students[0]))")
    pg.locator("#v-rep .rep a.btn").first.click(); pg.wait_for_timeout(400)
    r = pg.evaluate("async ()=>({clip: await navigator.clipboard.readText(), mail: window.__mail, toast: document.getElementById('toastHost').textContent})")
    ok("D8 Feedback-Mail: ganzer Text in der Zwischenablage, Meldung = Hinweis", r["clip"] == full and len(r["mail"]) == 1 and len(r["mail"][0]) <= 1800 and r["toast"] == hint, (len(r["clip"]), len(full), r["toast"][:60]))
    pg.evaluate("()=>{ window.__mail = []; view = 'week'; render(); }")
    pg.locator("#v-week .btn.pri").first.click(); pg.wait_for_timeout(400)
    r = pg.evaluate("async ()=>({clip: await navigator.clipboard.readText(), mail: window.__mail})")
    ok("D8 Übersichtsmail an die Kursleitung: Link höchstens 1800 Zeichen", len(r["mail"]) == 1 and len(r["mail"][0]) <= 1800 and "Nachname13" in r["clip"], [len(x) for x in r["mail"]])
    ok("D8 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D9 Beispiel verlassen ----------
    c, pg, errs = page(b)
    pg.evaluate("()=>{ view = 'set'; render(); }")
    pg.fill("#fOutlet", "Umami")
    pg.fill("#fStud", "Ammann; Lea\nChen; Yu")
    pg.evaluate(APPLY); pg.wait_for_timeout(100)
    r = pg.evaluate("""()=>({days: Object.keys(S.days), meta: Object.keys(S.dayMeta), sample: S.settings.isSample, cur: curSlot,
        set: [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher], obs: S.students.map(s=>summary(s.id,'all').counted)})""")
    ok("D9 «Übernehmen» aus dem Beispiel: Beispieltage und Tagesangaben weg", r["days"] == [] and r["meta"] == [] and r["sample"] is False and r["obs"] == [0, 0], r)
    ok("D9 Beispiel-Kopfwerte geleert, eigenes Outlet bleibt, Start bei Tag 1", r["set"] == ["", "", "Umami", ""] and r["cur"] == "d01", (r["set"], r["cur"]))
    c.close()
    c, pg, errs = page(b)
    SVC = {"app": "Servicerapport", "variant": "10T", "savedAt": "2026-11-03T17:00:00Z", "settings": {"outlet": "Da Fortunat", "teacher": "R"},
           "students": [{"id": "x1", "nachname": "Chen", "vorname": "Yu"}], "days": {"d02": {"x1": {"att": "late", "obs": [], "note": None}}}, "dayMeta": {}}
    r = pg.evaluate("""async (o)=>{ await onMerge({target:{files:[new File([JSON.stringify(o)], 'a.json')], value:''}});
        return {days: Object.keys(S.days), set: [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher], n: S.students.length, cur: curSlot}; }""", SVC)
    ok("D9 Zusammenführen in die Beispieldatei: nur Daten der Datei, keine Beispielwerte", r["days"] == ["d02"] and r["set"] == ["", "", "Da Fortunat", "R"] and r["n"] == 1 and r["cur"] == "d01", r)
    ok("D9 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D10 alter Verspätungs-Baustein ----------
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}, {"id": "b2", "nachname": "Beispiel", "vorname": "Emma"}],
                       "days": {"d01": {"a1": {"att": "present", "obs": ["tea-lt"], "note": None}, "b2": {"att": "present", "obs": [], "note": None}},
                                "d02": {"a1": {"att": "late", "obs": [], "note": None}, "b2": {"att": "present", "obs": [], "note": None}}}})
    lt = pg.evaluate("()=>CHIP['tea-lt'].t.de")
    pg.locator("article.stud").nth(1).locator(".addbtn").click()
    pg.locator(".crittabs button", has_text="Team").first.click()
    offered_b = pg.locator(".sheet .opt", has_text=lt).count()
    pg.locator(".sheet-h button").click()
    pg.locator("article.stud").nth(0).locator(".addbtn").click()
    pg.locator(".crittabs button", has_text="Team").first.click()
    offered_a = pg.locator(".sheet .opt", has_text=lt).count()
    pg.locator(".sheet .opt", has_text=lt).first.click()
    removed = pg.evaluate("()=>!S.days.d01.a1.obs.includes('tea-lt')")
    pg.locator(".sheet-h button").click()
    ok("D10 Baustein nicht mehr angeboten, nur zum Entfernen sichtbar", offered_b == 0 and offered_a == 1 and removed, (offered_b, offered_a, removed))
    r = pg.evaluate("""()=>{ S.days.d01.a1.obs = ['tea-lt']; const g = critGradesForDay('d01','a1').tea; const rep = buildReport(S.students[0],'all','de');
        window.print = ()=>{}; curSlot = 'd01'; printSheets('single'); const sheet = document.getElementById('printArea').innerText;
        return {g, abs: rep.split('\\n').find(l=>l.startsWith('Absenzen')), obsTxt: rep.includes(CHIP['tea-lt'].t.de), sheet: sheet.includes(CHIP['tea-lt'].t.de)}; }""")
    ok("D10 Note alter Daten unverändert (Team 4.00)", r["g"] == 4, r["g"])
    ok("D10 Beurteilung: Tag mit dem Baustein zählt als Verspätung", r["abs"] == "Absenzen: 2 × Verspätet" and not r["obsTxt"], r["abs"])
    ok("D10 Einzelblatt ohne den alten Baustein", not r["sheet"], r["sheet"])
    ok("D10 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D11 Beobachtungen nur an Tagen anwesend oder verspätet ----------
    c, pg, errs = page(b)
    pg.evaluate(LOAD, {"students": [{"id": "a1", "nachname": "Muster", "vorname": "Max"}],
                       "days": {"d01": {"a1": {"att": "tm", "obs": ["gas-p1"], "note": None}}, "d02": {"a1": {"att": "unexcused", "obs": ["ver-p1"], "note": None}},
                                "d03": {"a1": {"att": "present", "obs": ["mep-p1"], "note": None}}, "d04": {"a1": {"att": "late", "obs": ["tec-p1"], "note": None}}}})
    r = pg.evaluate("()=>{ const rep = buildReport(S.students[0],'all','de'); return ['gas-p1','ver-p1','mep-p1','tec-p1'].map(i=>rep.includes(CHIP[i].t.de)); }")
    ok("D11 Beurteilung: Bausteine nur von Tagen anwesend/verspätet", r == [False, False, True, True], r)
    ok("D11 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D12 Wochentage als echte Kurznamen ----------
    c, pg, errs = page(b)
    r = {lg: pg.evaluate("(lg)=>{ S.settings.uiLang = lg; view = 'set'; render(); return [...document.querySelectorAll('.wdays button')].map(b=>b.textContent); }", lg) for lg in ("de", "en", "th")}
    ok("D12 Wochentage DE", r["de"] == ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], r["de"])
    ok("D12 Wochentage EN", r["en"] == ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], r["en"])
    ok("D12 Wochentage TH unterscheidbar", r["th"] == ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], r["th"])
    ok("D12 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D13 Zusammenführen: Restaurant und leere Standardeinträge ----------
    def rep_file(saved, recs):
        return {"app": "Servicerapport", "variant": "10T", "savedAt": saved, "settings": {"outlet": "Umami", "outlet2": "Da Fortunat"},
                "students": [{"id": "a1", "nachname": "Ammann", "vorname": "Lea"}, {"id": "c2", "nachname": "Chen", "vorname": "Yu"}],
                "days": {"d01": recs}, "dayMeta": {}}
    f1 = rep_file("2026-11-02T17:00:00Z", {"a1": {"att": "present", "obs": [], "note": None}, "c2": {"att": "present", "obs": ["gas-p1"], "note": None}})
    f2 = rep_file("2026-11-03T17:00:00Z", {"a1": {"att": "present", "obs": [], "note": None, "outlet": "Da Fortunat"}, "c2": {"att": "present", "obs": [], "note": None}})
    c, pg, errs = page(b)
    r = pg.evaluate("""async (fs)=>{ const t0 = []; const o = window.toast; window.toast = m => { t0.push(m); o(m); };
        S.students = []; S.days = {}; S.dayMeta = {}; S.settings.isSample = false;
        await onMerge({target:{files: fs.map((x,i)=>new File([JSON.stringify(x)], 'f'+i+'.json')), value:''}});
        const a = S.students.find(s=>s.nachname==='Ammann'), ch = S.students.find(s=>s.nachname==='Chen');
        return {out: S.days.d01[a.id].outlet || '', obs: S.days.d01[ch.id].obs, toast: t0.join(' | ')}; }""", [f2, f1])
    ok("D13 Korrektur nur des Restaurants kommt an", r["out"] == "Da Fortunat", r["out"])
    ok("D13 leerer Standardeintrag ersetzt keinen Eintrag mit Inhalt, Meldung", r["obs"] == ["gas-p1"] and "1 Einträge mit Inhalt behalten" in r["toast"], r["toast"][:160])
    ok("D13 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D14 Kaputte Dateien laden ohne Fehler ----------
    BAD = {"app": "Servicerapport", "variant": "10T", "settings": {"outlet": "Umami"},
           "students": [{"id": "a1", "nachname": "Ammann", "vorname": "Lea"}, {"id": "b2", "nachname": "Chen", "vorname": "Yu"}],
           "days": {"d01": {"a1": {"att": "present", "obs": ["gas-p1"], "note": {"txt": "gut", "crit": "sel", "dir": "1", "w": "0.5"}},
                            "b2": {"att": "absent?", "obs": "gas-p1", "note": None}, "x9": None},
                    "d02": None, "d03": [], "zz": {"a1": {}}}, "dayMeta": {"d01": "kaputt"}}
    c, pg, errs = page(b)
    back = pg.evaluate("async (o)=>onRestore({target:{files:[new File([JSON.stringify(o)], 'x.json')], value:''}})", BAD)
    for v in ("day", "week", "rep", "data", "set"):
        pg.evaluate("(v)=>{ curSlot = 'd01'; view = v; render(); }", v)
    r = pg.evaluate("()=>({w: S.days.d01.a1.note.w, d: S.days.d01.a1.note.dir, obs: S.days.d01.b2.obs, att: S.days.d01.b2.att, keys: Object.keys(S.days), sel: critGradesForDay('d01','a1').sel})")
    ok("D14 kaputte Sicherung: eingelesen, Werte bereinigt", back is True and r["w"] == 0.5 and r["d"] == 1 and r["obs"] == [] and r["att"] == "present" and r["keys"] == ["d01"] and r["sel"] == 5, r)
    ok("D14 Erfassen, Übersicht, Beurteilung, Daten ohne JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D15 Halbturnus ohne Pläne, chinesischer Text ----------
    c, pg, errs = page(b, "Servicerapport_4Tage_Exam.html")
    f4 = pg.evaluate("""()=>{ S = {settings: Object.assign(sanitizeSettings({outlet:'Essenz', teacher:'B'}), {isSample:false}),
        students: saubereStudierende([{id:'p1', nachname:'Chen', vorname:'Yu', tmTage:[2], schichtPlan:['SW1','OC','SW2','SW1'], ortPlan:['','Umami','',''], wechselAb:3, wechselOutlet:'Umami'}]),
        days:{}, dayMeta:{}}; slots().forEach(s=>openSlot(s.id)); return JSON.stringify(snapshot()); }""")
    c.close()
    c, pg, errs = page(b)
    r = pg.evaluate("""async (f)=>{ S.students = []; S.days = {}; S.dayMeta = {}; S.settings.isSample = false;
        await onMerge({target:{files:[new File([f], 'b.json')], value:''}});
        const s = S.students[0]; return {keys: Object.keys(S.days), plan: ['tmTage','schichtPlan','ortPlan','wechselAb','wechselOutlet'].filter(k=>k in s), d07: S.days.d07[s.id].att}; }""", f4)
    ok("D15 4T in 10T: Tage eingeordnet, Pläne der Halbdatei entfernt", r["keys"] == ["d06", "d07", "d08", "d09", "d10"] and r["plan"] == [] and r["d07"] == "tm", r)
    zh = pg.evaluate("""()=>{ const s = S.students[0]; s.lang = 'zh'; S.days.d07[s.id].att = 'tml'; return buildReport(s,'all','zh'); }""")
    ok("D15 ZH: Team Market verspätet auf Chinesisch", "其中迟到" in zh and "davon verspätet" not in zh, [l for l in zh.split("\n") if "Team Market" in l])
    ok("D15 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- D16 Namen: letztes Wort = Vorname (bleibt) ----------
    c, pg, errs = page(b)
    r = pg.evaluate("()=>['Da Silva Rui; x@y.ch','van der Berg Sanne','Muster; Max; #21'].map(l=>{ const g = parseStudentZeile(l); return [g.nachname, g.vorname, g.nr]; })")
    ok("D16 Einteiliger Name: letztes Wort ist der Vorname; #Nummer erkannt", r == [["Da Silva", "Rui", ""], ["van der Berg", "Sanne", ""], ["Muster", "Max", "21"]], r)
    # Liste wie auf dem Tablet: «#21» als letztes Feld, überall gelesen, nie Klasse/Gruppe/E-Mail
    r = pg.evaluate("""()=>{ const P = l => { const g = parseStudentZeile(l); return [g.nachname, g.vorname, g.nick, g.mail, g.lang, g.klasse, g.gruppe, g.nr]; };
        return {tab: P('Muster; Max; ; max@x.ch; de; HFD; Gruppe 1 Team A; #21'), vorn: P('#21; Muster; Max; HFD'), leer: P('Muster; Max; #'),
                zeile: studentZeile({nachname:'Muster', vorname:'Max', nick:'', mail:'max@x.ch', lang:'de', klasse:'HFD', gruppe:'Gruppe 1 Team A', nr:'21'})}; }""")
    ok("Nummer: Tablet-Zeile mit #21 am Schluss richtig gelesen", r["tab"] == ["Muster", "Max", "", "max@x.ch", "de", "HFD", "Gruppe 1 Team A", "21"], r["tab"])
    ok("Nummer: #21 auch vorne gelesen, leeres # ignoriert", r["vorn"] == ["Muster", "Max", "", "", "", "HFD", "", "21"] and r["leer"][:3] == ["Muster", "Max", ""] and r["leer"][7] == "", (r["vorn"], r["leer"]))
    ok("Nummer: Liste schreibt #21 als letztes Feld", r["zeile"].endswith("; #21") and r["zeile"].startswith("Muster; Max;"), r["zeile"])
    c.close()

    # ---------- D17 onRestore meldet, ob geladen wurde ----------
    c, pg, errs = page(b)
    PKG = {"app": "Servicerapport", "variant": "10T", "source": "cockpit", "settings": {"outlet": "Umami", "paketId": "P1"},
           "students": [{"id": "p1", "nachname": "Ammann", "vorname": "Lea"}], "days": {}, "dayMeta": {}}
    r = pg.evaluate("""async (o)=>{ const run = async (txt) => onRestore({target:{files:[new File([txt], 'p.json')], value:''}});
        const cb = x => onRestore({target:{files:[new File([JSON.stringify(x)], "paket.json")], value:""}});
        return [await run(JSON.stringify(Object.assign({}, o, {variant:'4T'}))), await run(JSON.stringify(Object.assign({}, o, {app:'Kuechenrapport'}))),
                await run('{kaputt'), await run(JSON.stringify({format:'praxisrapport-semesterpaket', pakete:[]})), await cb(o), S.settings.paketId]; }""", PKG)
    ok("D17 onRestore: false bei Variante, App, kaputt, Semesterpaket; true beim Paket", r == [False, False, False, False, True, "P1"], r)
    ok("D17 keine JavaScript-Fehler", not errs, errs[:2]); c.close()

    # ---------- Selbsttest in allen drei Fassungen ----------
    for fn in ("Servicerapport.html", "Servicerapport_4Tage_Exam.html", "Servicerapport_5Tage_ohneExam.html"):
        c, pg, errs = page(b, fn)
        bad = pg.evaluate("()=>selfTest().filter(x=>!x.ok).map(x=>x.name)")
        for v in ("day", "week", "rep", "data", "set"):
            pg.evaluate("(v)=>{ view = v; render(); }", v)
        ok(fn + ": Selbsttest und alle Reiter ohne Fehler", not bad and not errs, (bad, errs[:1])); c.close()
    b.close()

out = "\n".join(res)
n_ok = sum(1 for x in res if x.startswith("OK"))
print(out); print(n_ok, "von", len(res))
(R / "tests" / "Testprotokoll_Fixes_Service.txt").write_text(
    "PRUEFUNG KORREKTUREN SERVICERAPPORT LAPTOP %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + out + "\n\n%d von %d bestanden.\n" % (n_ok, len(res)), encoding="utf-8")
sys.exit(0 if n_ok == len(res) else 1)
