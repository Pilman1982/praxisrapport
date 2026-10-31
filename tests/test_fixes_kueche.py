# -*- coding: utf-8 -*-
"""Kuechenrapport Laptop: Korrekturen nach der Durchsicht vom 31.10.2026 (Entscheide D1 bis D17).
Rundung und Farben, Schlussnote nur mit Exam, Freitext geht nie verloren, Namensliste behaelt Personen,
nur Kuechen-Dateien, Anzeigen legt nichts an, Exam-Day-Knoepfe, lange Mails, Beispiel verlassen,
Verspaetungs-Baustein, Beobachtungen nur aus gewerteten Tagen, Thai-Wochentage, Zusammenfuehren
ohne leere Ueberschreibungen, Tag verwerfen zweistufig, Uebersetzungen, Namen teilen, Rueckgabe Einlesen."""
import pathlib, json, datetime, urllib.parse
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R/"docs"/"kueche"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-74s %s" % (n, str(i)[:140]))

def page(b, f="Kuechenrapport.html"):
    c = b.new_context(viewport={"width": 1280, "height": 900})
    for u in ("https://cdnjs.cloudflare.com/**", "https://fonts.googleapis.com/**", "https://fonts.gstatic.com/**"):
        c.route(u, lambda r: r.abort())
    pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((D/f).as_uri()); pg.wait_for_timeout(300)
    return c, pg, errs

# Eine eigene Gruppe statt Beispiel: vier Personen, Tag 1 offen
GROUP = """()=>{ S = {settings:{...DEF, group:'HFE1', team:'Gruppe 1 Team A', outlet:'Umami', teacher:'Laura Arcuri'}, students:[], days:{}, dayMeta:{}};
  S.students = [{id:'p1', nr:'1001', last:'Ammann', first:'Lea', mail:'lea.ammann@stud.ehl.ch', foto:'data:image/png;base64,iVBORw0KGgo=', tmTage:[3], schichtPlan:['K1','K2','K3']},
                {id:'p2', nr:'1002', last:'Frei', first:'Anouk', mail:'anouk.frei@stud.ehl.ch'},
                {id:'p3', last:'Keller', first:'Timo', mail:'timo.keller@stud.ehl.ch'},
                {id:'p4', last:'Keller', first:'Timo', mail:'timo.keller2@stud.ehl.ch'}];
  normalizeStudents(); openSlot('d01'); S.days.d01.p1.obs = ['hyg-p2']; S.days.d01.p2.att = 'late';
  curSlot = 'd01'; view = 'day'; persist(); render(); return true; }"""
# Tag mit genau definierten Noten: Praxis 5.4375, Exam unentschuldigt 1.00 -> Schluss 3.958 (gezeigt 4.0)
HIGH = ['hyg-p2','hyg-p3','pro-p1','pro-p2','org-p1','org-p2','tea-p1','tea-p2','sel-p2','sel-p3','mot-p1','mot-p2','fac-p1']
APPLY = """(txt)=>{ document.querySelector('#fStud').value = txt; const ta = document.querySelector('#fStud');
  const b = [...document.querySelectorAll('button.pri')].find(b=>ta.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING); b.click(); return true; }"""
CLIP = """()=>{ window.__clip = null; Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText: async t => { window.__clip = t; }}}); return true; }"""

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---------------- D1 Rundung, Farbe, Praedikat, Schlusssatz, PDF ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("()=>[fmt1(4.45), fmt1((2*4.425+4.5)/3), fmt1(4.449999999999999), fmt1(3.95), fmt1(null), round1(4.75)]")
    ok("D1 fmt1 rundet x.x5 immer auf (4.45 -> 4.5, auch mit Rundungsfehler)", r == ["4.5", "4.5", "4.5", "4.0", "–", 4.8], r)
    r = pg.evaluate("""(hi)=>{ const s = S.students[0]; S.days.d01[s.id] = {att:'present', obs:hi, note:null};
        openSlot('d10'); S.days.d10[s.id].att = 'unexcused'; persist(); view = 'week'; render();
        const su = summary(s.id,'all'), ex = examSummary(s.id), f = finalGrade(su.total, ex.total);
        const row = [...document.querySelectorAll('#v-week tbody tr')][0]; const cells = [...row.querySelectorAll('td .grade')];
        const fin = cells[cells.length-1];
        const txt = buildReport(s,'all','de');
        window.print = ()=>{}; printReports(); const boxes = [...document.querySelectorAll('#printArea .pgbox')].slice(0,3).map(x=>x.querySelector('.vl').textContent + '|' + x.querySelector('.bd').textContent);
        document.body.classList.remove('printing');
        return {p: su.total, f, cell: fin.textContent, cls: fin.className, line: txt.split('\\n').find(l=>l.startsWith('Schlussnote')),
                close: txt.indexOf(tOut('cl3','de')) >= 0 && txt.indexOf(tOut('cl4','de')) < 0, boxes}; }""", HIGH)
    ok("D1 Schlussnote 3.958 wird als 4.0 gezeigt, nicht rot", r["cell"] == "4.0" and "g-lo" not in r["cls"] and abs(r["f"] - 3.9583333) < 1e-6, [r["p"], r["f"], r["cell"], r["cls"]])
    ok("D1 Beurteilung: «Schlussnote: 4.0 (Genügend)», Schlusssatz aus 4.0 (cl3)", r["line"] == "Schlussnote: 4.0 (Genügend)" and r["close"], r["line"])
    ok("D1 PDF: Schlussnote im Kasten auf 0.1 gerundet mit Prädikat", r["boxes"][2] == "4.0|Genügend", r["boxes"])
    r = pg.evaluate("""()=>{ const s = S.students[2]; ['d01','d02','d03','d04','d05','d06'].forEach((d,i)=>{ openSlot(d); S.days[d][s.id] = {att:'present', obs: i === 5 ? ['org-n1','org-n5'] : ['org-n1'], note:null}; });
        persist(); view='week'; render(); const row = [...document.querySelectorAll('#v-week tbody tr')][2];
        const td = row.querySelectorAll('td')[3].querySelector('.grade'); return [summary(s.id,'all').crit.org, td.textContent, td.className]; }""")
    ok("D1 Übersicht: Kriterium 3.958 als 4.0, Farbe aus dem gerundeten Wert (nicht rot)", abs(r[0] - 3.9583333) < 1e-6 and r[1] == "4.0" and "g-lo" not in r[2], r)
    ok("D1 keine JavaScript-Fehler", not errs, errs); c.close()
    # Zwei Stellen: Praxis 4.7455 wird als 4.75 gezeigt -> gruen, «Gut», Schlusssatz cl1 (Nachtrag 31.10.2026)
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ const s = S.students[2]; const base = ['pro-p1','pro-p2','org-p1','org-p2'];
        ['d01','d02','d03','d04','d05','d06','d07'].forEach((d,i)=>{ openSlot(d); S.days[d][s.id] = {att:'present', obs: i === 6 ? base.concat(['org-n5']) : base, note:null}; });
        persist(); view='week'; render();
        const row = [...document.querySelectorAll('#v-week tbody tr')][2]; const cell = row.querySelectorAll('td')[8].querySelector('.grade');
        const txt = buildReport(s,'all','de'); const g = gradeRows();
        return {p: summary(s.id,'all').total, cell: cell.textContent, cls: cell.className, line: txt.split('\\n').find(l=>l.startsWith('Praxisnote')),
                cl1: txt.indexOf(tOut('cl1','de')) >= 0, xl: g.rows[2][g.head.indexOf('Prädikat')]}; }""")
    ok("D1 Zwei Stellen: gezeigte 4.75 (4.7455) ist grün", r["p"] < 4.75 and r["cell"] == "4.75" and "g-hi" in r["cls"], [r["p"], r["cell"], r["cls"]])
    ok("D1 Zwei Stellen: Prädikat «Gut» in Beurteilung und Excel, Schlusssatz cl1", r["line"] == "Praxisnote: 4.75 (Gut)" and r["xl"] == "Gut" and r["cl1"], [r["line"], r["xl"], r["cl1"]])
    ok("D1 Zwei Stellen: keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D2 Schlussnote nur mit Exam ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ const s = S.students[0]; view='week'; render();
        const row = [...document.querySelectorAll('#v-week tbody tr')][0]; const cells = [...row.querySelectorAll('td .grade')];
        const g = gradeRows(); const i = g.head.indexOf('Schlussnote');
        const mail = decodeURIComponent(overviewMailHref()); const ml = mail.split('\\n').find(l=>l.startsWith('Ammann'));
        const rep = buildReport(s,'all','de').split('\\n');
        return {fn: [finalGrade(4.6, null), finalGrade(null, 4.5), finalGrade(4.5, 4.5)], cell: cells[cells.length-1].textContent,
                xl: g.rows[0][i], ml, rep: rep.slice(2,5)}; }""")
    ok("D2 10T: finalGrade ohne Exam oder ohne Praxis = null", r["fn"][:2] == [None, None] and abs(r["fn"][2] - 4.5) < 1e-9, r["fn"])
    ok("D2 Übersicht und Excel: Schlussnote leer («–» / leer)", r["cell"] == "–" and r["xl"] == "", [r["cell"], r["xl"]])
    ok("D2 Übersicht-Mail: Exam und Schluss «–»", bool(r["ml"]) and r["ml"].split()[-2:] == ["–", "–"], r["ml"])
    ok("D2 Beurteilung: Praxisnote, Prüfungsnote –, Schlussnote –", r["rep"][1] == "Prüfungsnote: –" and r["rep"][2] == "Schlussnote: –" and r["rep"][0].startswith("Praxisnote: "), r["rep"])
    ok("D2 keine JavaScript-Fehler", not errs, errs); c.close()
    c, pg, errs = page(b, "Kuechenrapport_5Tage_ohneExam.html")
    r = pg.evaluate("()=>[finalGrade(4.6, null), finalGrade(null, null)]")
    ok("D2 5T: Schlussnote = Praxisnote", r == [4.6, None], r)
    c.close()

    # ---------------- D3 Freitext geht nie verloren ----------------
    for how in ("Fertig oben", "Esc", "Hintergrund", "Reiterwechsel"):
        c, pg, errs = page(b)
        pg.evaluate(GROUP)
        pg.locator("article.stud").nth(2).locator(".addbtn").click(); pg.wait_for_timeout(80)
        pg.locator(".crittabs button.note").click(); pg.wait_for_timeout(50)
        pg.fill("#noteTxt", "Hat den Posten allein geführt (" + how + ")")
        if how == "Fertig oben": pg.locator(".sheet-h .btn.pri").click()
        elif how == "Esc": pg.keyboard.press("Escape")
        elif how == "Hintergrund": pg.mouse.click(5, 5)
        else:
            pg.locator(".crittabs button").first.click(); pg.wait_for_timeout(50)
            nt_mid = pg.evaluate("()=>((S.days.d01[S.students[2].id]||{}).note||{}).txt||null")
            pg.locator(".sheet-h .btn.pri").click()
        pg.wait_for_timeout(80)
        r = pg.evaluate("()=>[document.getElementById('sheetHost').innerHTML.length, ((S.days.d01[S.students[2].id]||{}).note||{}).txt || null, localStorage.getItem(KEY).indexOf('allein geführt') > 0]")
        ok("D3 Freitext bleibt beim Schliessen über «" + how + "»", r[0] == 0 and r[1] and how in r[1] and r[2] and (how != "Reiterwechsel" or nt_mid), r)
        c.close()
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ const s = S.students[0]; S.days.d01[s.id].note = {txt:'Alt', crit:'sel', dir:1, w:0.75, internal:false};
        openSheet(s); document.querySelector('.crittabs button.note').click(); document.querySelector('.sheet-h .btn.pri').click();
        return S.days.d01[s.id].note; }""")
    ok("D3 Unveränderter Freitext bleibt unberührt (auch ungewöhnliche Wirkung)", r == {"txt": "Alt", "crit": "sel", "dir": 1, "w": 0.75, "internal": False}, r)
    ok("D3 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D4 Übernehmen ----------------
    c, pg, errs = page(b)
    dlg = []; accept = [False]
    def on_dialog(d):
        dlg.append(d.message)
        if accept[0]: d.accept()
        else: d.dismiss()
    pg.on("dialog", on_dialog)
    pg.evaluate(GROUP); pg.evaluate("()=>{ view='set'; render(); }")
    txt = pg.input_value("#fStud")
    ok("D4 Liste schreibt die Nummer als #Nr zurück", "#1001" in txt.split("\n")[0], txt.split("\n")[0])
    new = txt.replace("Ammann; Lea", "Amman; Lea Sophie", 1).replace("anouk.frei@stud.ehl.ch", "anouk.frei@beispiel.ch", 1).replace("Frei; Anouk", "Frey; Anouk", 1)
    pg.evaluate(APPLY, new); pg.wait_for_timeout(150)
    r = pg.evaluate("""()=>{ const a = S.students.find(s=>s.nr==='1001'), f = S.students.find(s=>s.nr==='1002');
        return {ids:S.students.map(s=>s.id), a:[a.id, a.last, a.first, !!a.foto, JSON.stringify(a.tmTage), JSON.stringify(a.schichtPlan), JSON.stringify(S.days.d01[a.id].obs)],
                f:[f.id, f.last, f.mail, S.days.d01[f.id].att], n:S.students.length}; }""")
    ok("D4 Namenskorrektur: Kennung, Foto, Pläne und Einträge bleiben (über #Nr)", r["a"] == ["p1", "Amman", "Lea Sophie", True, "[3]", '["K1","K2","K3"]', '["hyg-p2"]'], r["a"])
    ok("D4 Name und E-Mail geändert, gleiche #Nr: gleiche Person", r["f"] == ["p2", "Frey", "anouk.frei@beispiel.ch", "late"], r["f"])
    ok("D4 Gleicher Name, verschiedene E-Mail: zwei Personen", r["n"] == 4 and r["ids"] == ["p1", "p2", "p3", "p4"], r["ids"])
    pg.evaluate("()=>{ view='set'; render(); }")
    txt = pg.input_value("#fStud")
    keep = "\n".join(l for l in txt.split("\n") if "1002" not in l)
    dlg.clear(); accept[0] = False
    before = pg.evaluate("()=>JSON.stringify([S.students, S.days])")
    pg.evaluate(APPLY, keep); pg.wait_for_timeout(150)
    after = pg.evaluate("()=>JSON.stringify([S.students, S.days])")
    ok("D4 Person mit Einträgen fällt weg: Rückfrage, Abbrechen ändert nichts", len(dlg) == 1 and "Frey Anouk" in dlg[0] and before == after and pg.input_value("#fStud") == keep, dlg)
    dlg.clear(); accept[0] = True
    pg.evaluate(APPLY, keep); pg.wait_for_timeout(150)
    r = pg.evaluate("()=>[S.students.length, !S.students.some(s=>s.nr==='1002'), !Object.values(S.days).some(d=>d.p2)]")
    ok("D4 Bestätigt: Person und Einträge entfernt", len(dlg) == 1 and r == [3, True, True], [dlg, r])
    dlg.clear(); pg.evaluate("()=>{ view='set'; render(); }")
    keep2 = "\n".join(l for l in pg.input_value("#fStud").split("\n") if "timo.keller2" not in l)
    pg.evaluate(APPLY, keep2); pg.wait_for_timeout(150)
    ok("D4 Person ohne Einträge fällt weg: keine Rückfrage", not dlg and pg.evaluate("()=>S.students.length") == 2, dlg)
    ok("D4 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D5 nur Küchenrapporte ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""async ()=>{ const svc = JSON.parse(JSON.stringify(snapshot())); svc.app = 'Servicerapport'; svc.settings.outlet = 'Bellavista';
        const before = JSON.stringify(S);
        const ret = await onRestore({target:{files:[new File([JSON.stringify(svc)], 'Service.json')], value:''}});
        const t1 = document.getElementById('toastHost').textContent;
        const same1 = JSON.stringify(S) === before;
        await onMerge({target:{files:[new File([JSON.stringify(svc)], 'Service.json')]}});
        const t2 = document.getElementById('toastHost').textContent;
        S = {settings:{...DEF}, students:[], days:{}, dayMeta:{}};
        await onMerge({target:{files:[new File([JSON.stringify(svc)], 'Service.json')]}});
        return {ret, t1, same1, t2, n:S.students.length, out:S.settings.outlet}; }""")
    ok("D5 Sicherung einlesen: Service-Datei abgelehnt (false, Meldung, nichts geändert)", r["ret"] is False and r["same1"] and "nicht lesbar" in r["t1"], r["t1"])
    ok("D5 Zusammenführen: Service-Datei abgelehnt, auch in leerer Datei", "Passt nicht in diese Datei" in r["t2"] and "Servicerapport" in r["t2"] and r["n"] == 0 and r["out"] == "", [r["t2"], r["n"], r["out"]])
    c.close()

    # ---------------- D6 Anzeigen legt nichts an ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ openSlot('d10'); S.students.push({id:'p9', last:'Neu', first:'Nina', name:'Neu Nina', mail:''}); normalizeStudents(); persist();
        curSlot = 'd01'; render(); curSlot = 'd10'; render(); openSheet(S.students[4]); document.querySelector('.sheet-h .btn.pri').click();
        renderWeek(); renderRep(); gradeRows(); evidenceRows();
        const card = [...document.querySelectorAll('#v-day article.stud')].find(a=>a.innerText.includes('Neu Nina'));
        return {d01: S.days.d01.p9 === undefined, d10: S.days.d10.p9 === undefined, ex: examSummary('p9'), cnt: summary('p9','all').counted,
                pill: card.querySelector('.grade').textContent, pressed: [...card.querySelectorAll('.seg button[aria-pressed=true]')].length}; }""")
    ok("D6 Anzeigen von Tag 1, Exam Day und Blatt legt keinen Eintrag an", r["d01"] and r["d10"] and r["ex"] is None and r["cnt"] == 0, r)
    ok("D6 Person ohne Eintrag erscheint als «offen», kein Knopf gedrückt", r["pill"] == "offen" and r["pressed"] == 0, r)
    pg.locator("article.stud", has_text="Neu Nina").locator(".seg button").first.click(); pg.wait_for_timeout(80)
    r = pg.evaluate("()=>[S.days.d10.p9 && S.days.d10.p9.att, examSummary('p9') && examSummary('p9').total]")
    ok("D6 Antippen von «Anwesend» legt den Eintrag an", r == ["present", 4.5], r)
    r = pg.evaluate("""()=>{ curSlot='d01'; render(); openSheet(S.students.find(s=>s.id==='p9'));
        [...document.querySelectorAll('.sheet .opt')][0].click(); const x = S.days.d01.p9; document.querySelector('.sheet-h .btn.pri').click(); return x && x.obs.length; }""")
    ok("D6 Baustein im Blatt legt den Eintrag an", r == 1, r)
    ok("D6 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D7 Exam Day zeigt den wirklichen Stand ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ openSlot('d10'); const ids = S.students.map(s=>s.id);
        S.days.d10[ids[0]].att = 'late'; S.days.d10[ids[1]].att = 'excused'; S.days.d10[ids[2]].att = 'tm'; S.days.d10[ids[3]].att = 'tml';
        curSlot = 'd10'; view = 'day'; render();
        const cards = [...document.querySelectorAll('#v-day article.stud')];
        return {btn: cards.map(c=>[...c.querySelectorAll('.seg button')].map(b=>b.textContent + (b.getAttribute('aria-pressed')==='true' ? '*' : ''))),
                g: ids.map(i=>dayTotal('d10', i))}; }""")
    ok("D7 Exam: verspätet zeigt «Verspätet», nicht «Abwesend»", r["btn"][0] == ["Anwesend", "Verspätet*", "Entschuldigt", "Unentschuldigt"], r["btn"][0])
    ok("D7 Exam: entschuldigt sichtbar und zählt 1.00", r["btn"][1][2] == "Entschuldigt*" and r["g"][1] == 1, [r["btn"][1], r["g"][1]])
    ok("D7 Exam: gespeichertes Team Market sichtbar (tm, tml)", r["btn"][2][-1] == "Team Market*" and r["btn"][3][1] == "Verspätet*" and r["btn"][3][-1] == "Team Market*", r["btn"][2:])
    ok("D7 Exam: Noten unverändert (3.50 / 1.00 / 5.00 / 4.00)", r["g"] == [3.5, 1, 5, 4], r["g"])
    pg.locator("article.stud").nth(0).locator(".seg button").nth(3).click(); pg.wait_for_timeout(60)
    r = pg.evaluate("()=>[S.days.d10[S.students[0].id].att, dayTotal('d10', S.students[0].id), absenceList('d10').map(x=>x.kind)]")
    ok("D7 Exam: Unentschuldigt antippen ergibt 1.00, Meldung nennt den Grund", r[0] == "unexcused" and r[1] == 1 and "Entschuldigt" in r[2], r)
    ok("D7 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D8 lange Mails ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP); pg.evaluate(CLIP)
    r = pg.evaluate("""()=>{ const sl = slots(); const neg = CHIPS.filter(c=>c.d<0 && !c.ko).map(c=>c.i), pos = CHIPS.filter(c=>c.d>0).map(c=>c.i);
        sl.forEach((x,j)=>{ openSlot(x.id); S.students.forEach((s,i)=>{ S.days[x.id][s.id].obs = [neg[(i*3+j)%neg.length], neg[(i+2*j+5)%neg.length], pos[(i*5+j)%pos.length]]; }); });
        S.students[1].lang = 'zh'; S.students[2].lang = 'de'; persist(); view = 'rep'; render();
        const links = [...document.querySelectorAll('#v-rep a.btn')].map(a=>a.href);
        const long = buildReport(S.students[1], 'all', 'zh');
        return {links: links.map(h=>h.length), clipHint: links.map(h=>decodeURIComponent(h).indexOf(T.de.mailClip) >= 0), full: long.length}; }""")
    ok("D8 Beurteilungs-Mails: Link nie länger als 1800 Zeichen", all(n <= 1800 for n in r["links"]), r["links"])
    ok("D8 Zu lange Beurteilung: Mail mit Hinweis zum Einfügen", any(r["clipHint"]), r["clipHint"])
    r2 = pg.evaluate("""()=>{ const a = [...document.querySelectorAll('#v-rep a.btn')][1]; a.addEventListener('click', e=>e.preventDefault());
        a.click(); return [window.__clip ? window.__clip.length : 0, document.getElementById('toastHost').textContent, buildReport(S.students[1],'all','zh') === window.__clip]; }""")
    ok("D8 Klick: ganzer Text in der Zwischenablage, Hinweis gezeigt", r2[2] and r2[1] == "Der Text ist in der Zwischenablage. Bitte hier mit Strg+V einfügen.", r2[:2])
    r = pg.evaluate("""()=>{ S.students = S.students.concat(Array.from({length:16}, (_,i)=>({id:'q'+i, last:'Nachname'+i, first:'Vorname'+i, mail:''}))); normalizeStudents();
        slots().forEach(x=>openSlot(x.id)); persist(); window.__clip = null;
        const ab = absenceMailPlan('d01');
        const pl = overviewMailPlan(); openOverviewMail();
        return {len: pl.href.length, clip: !!pl.clip, got: window.__clip === pl.clip, toast: document.getElementById('toastHost').textContent,
                ab: [ab.clip, ab.href.length < 1800 && decodeURIComponent(ab.href).indexOf('Frei') >= 0]}; }""")
    ok("D8 Übersicht-Mail zu lang: kurzer Link, Text in der Zwischenablage", r["len"] <= 1800 and r["clip"] and r["got"] and "Zwischenablage" in r["toast"], r)
    ok("D8 Kurze Mail (Absenzen) bleibt vollständig", r["ab"] == [None, True], r["ab"])
    ok("D8 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D9 Beispiel verlassen ----------------
    c, pg, errs = page(b)
    r = pg.evaluate("()=>[S.settings.isSample, Object.keys(S.days).length > 0, !!document.querySelector('#v-set')]")
    pg.evaluate("()=>{ view='set'; render(); }")
    seedbtn = pg.locator("#v-set button", has_text="Beispieldaten löschen").count()
    pg.fill("#fGroup", "HFD")
    pg.evaluate("()=>{ curSlot='d01'; view='day'; render(); }")
    pg.locator("article.stud").first.locator(".seg button.v-late").click(); pg.wait_for_timeout(60)      # im Beispiel herumtippen
    pg.evaluate("()=>{ view='set'; render(); }")
    pg.evaluate(APPLY, "Muster; Max; max.muster@beispiel.ch\nBeispiel; Lu")
    r2 = pg.evaluate("()=>({sample:S.settings.isSample, days:Object.keys(S.days), meta:Object.keys(S.dayMeta), set:[S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher], names:S.students.map(s=>s.name)})")
    ok("D9 Beispiel mit Knopf «Beispieldaten löschen»", r[0] and r[1] and seedbtn == 1, [r, seedbtn])
    ok("D9 Echte Liste übernommen: Beispieltage und Tagesangaben weg", not r2["sample"] and r2["days"] == [] and r2["meta"] == [], r2)
    ok("D9 Beispielangaben geleert, eigene Eingabe (Klasse HFD) bleibt", r2["set"] == ["HFD", "", "", ""] and r2["names"] == ["Muster Max", "Beispiel Lu"], r2["set"])
    c.close()
    c, pg, errs = page(b)
    src = pg.evaluate(GROUP.replace("persist(); render(); return true;", "const o = JSON.parse(JSON.stringify(snapshot())); return o;"))
    c.close()
    c, pg, errs = page(b)
    pg.evaluate("()=>{ curSlot='d01'; view='day'; render(); }")
    pg.locator("article.stud").first.locator(".seg button.v-late").click(); pg.wait_for_timeout(60)
    r = pg.evaluate("""async (o)=>{ await onMerge({target:{files:[new File([JSON.stringify(o)], 'A.json')]}});
        return {names:S.students.map(s=>s.name), out:S.settings.outlet, team:S.settings.team, sample:S.settings.isSample}; }""", src)
    ok("D9 Zusammenführen nach Herumtippen im Beispiel: keine Beispielpersonen", r["names"] == ["Ammann Lea", "Frei Anouk", "Keller Timo", "Keller Timo"] and r["out"] == "Umami" and not r["sample"], r)
    ok("D9 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D10 Verspätungs-Baustein ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ const s = S.students[2]; sheetCrit = 'tea'; openSheet(s);
        const a = [...document.querySelectorAll('.sheet .opt')].map(b=>b.textContent).some(x=>x.indexOf('Verspätet zum Dienst') >= 0);
        document.querySelector('.sheet-h .btn.pri').click();
        S.days.d01[s.id].obs = ['tea-n1']; persist(); openSheet(s);
        const b2 = [...document.querySelectorAll('.sheet .opt')].find(b=>b.textContent.indexOf('Verspätet zum Dienst') >= 0);
        const on = b2 && b2.className.indexOf(' on') >= 0; b2 && b2.click(); const gone = S.days.d01[s.id].obs.length === 0;
        document.querySelector('.sheet-h .btn.pri').click();
        window.print = ()=>{}; printSheets('single'); const paper = document.getElementById('printArea').innerText.indexOf('Verspätet zum Dienst') >= 0;
        document.body.classList.remove('printing');
        S.days.d01[s.id].obs = ['tea-n1']; const su = summary(s.id, 'all'); const txt = buildReport(s, 'all', 'de');
        return {offered:a, shownWhenSet:!!on, removable:gone, paper, late:su.late, line:txt.split('\\n').find(l=>l.startsWith('Absenzen'))}; }""")
    ok("D10 Blatt: Baustein «Verspätet zum Dienst» nicht mehr angeboten", not r["offered"], r)
    ok("D10 Blatt: schon erfasst bleibt er sichtbar und entfernbar", r["shownWhenSet"] and r["removable"], r)
    ok("D10 Papier-Einzelblatt ohne den Baustein", not r["paper"], r)
    ok("D10 Beurteilung: Tag mit dem alten Baustein zählt als verspätet", r["late"] == 1 and r["line"] == "Absenzen: 1 × Verspätet", r["line"])
    ok("D10 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D11 Beobachtungen nur aus gewerteten Tagen ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    r = pg.evaluate("""()=>{ const s = S.students[2]; ['d02','d03','d04'].forEach(openSlot);
        S.days.d02[s.id] = {att:'unexcused', obs:['mot-n1'], note:{txt:'Nicht erschienen, Handy', crit:'', dir:0, w:0, internal:false}};
        S.days.d03[s.id] = {att:'tm', obs:['tea-n3'], note:null};
        S.days.d04[s.id] = {att:'excused', obs:['fac-n3'], note:{txt:'Arztzeugnis', crit:'', dir:0, w:0, internal:false}};
        S.days.d01[s.id] = {att:'present', obs:['org-n2'], note:null};
        const txt = buildReport(s, 'all', 'de'); const su = summary(s.id, 'all');
        return {tally:Object.keys(su.tally), handy:txt.indexOf('Handy') >= 0, umgang:txt.indexOf('Umgangston') >= 0, abschmecken:txt.indexOf('Abschmecken') >= 0,
                arzt:txt.indexOf('Arztzeugnis') >= 0, mise:txt.indexOf('Mise en Place') >= 0}; }""")
    ok("D11 Beobachtungen von unentschuldigt, Team Market und entschuldigt fehlen", r["tally"] == ["org-n2"] and not r["handy"] and not r["umgang"] and not r["abschmecken"] and not r["arzt"], r)
    ok("D11 Beobachtung vom anwesenden Tag erscheint", r["mise"], r)
    c.close()

    # ---------------- D12 Wochentage kurz ----------------
    c, pg, errs = page(b)
    r = pg.evaluate("""()=>{ const out = {}; ['de','en','th'].forEach(lg=>{ S.settings.uiLang = lg; view='set'; render();
        out[lg] = [...document.querySelectorAll('#v-set .wdays button')].map(b=>b.textContent); }); S.settings.uiLang='de'; render(); return out; }""")
    ok("D12 Thai: จ. อ. พ. พฤ. ศ. ส. อา.", r["th"] == ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."], r["th"])
    ok("D12 Deutsch und Englisch: Mo … So, Mon … Sun", r["de"] == ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] and r["en"] == ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], [r["de"], r["en"]])
    c.close()

    # ---------------- D13 Zusammenführen: leere Einträge ersetzen nichts ----------------
    c, pg, errs = page(b)
    A = pg.evaluate(GROUP.replace("persist(); render(); return true;", "const o = JSON.parse(JSON.stringify(snapshot())); o.savedAt = '2026-11-02T16:00:00Z'; return o;"))
    Bf = json.loads(json.dumps(A)); Bf["savedAt"] = "2026-11-02T17:00:00Z"
    for sid in Bf["days"]["d01"]: Bf["days"]["d01"][sid] = {"att": "present", "obs": [], "note": None}
    Bf["days"]["d01"]["p3"] = {"att": "present", "obs": ["org-n2"], "note": None}
    Cf = json.loads(json.dumps(A)); Cf["savedAt"] = "2026-11-03T09:00:00Z"; Cf["days"]["d01"]["p2"] = {"att": "excused", "obs": [], "note": None}
    r = pg.evaluate("""async (docs)=>{ S = {settings:{...DEF}, students:[], days:{}, dayMeta:{}};
        await onMerge({target:{files:docs.map((d,i)=>new File([JSON.stringify(d)], 'f'+i+'.json'))}});
        const id = m => S.students.find(s=>s.mail===m).id;
        return {p1:S.days.d01[id('lea.ammann@stud.ehl.ch')].obs, p2:S.days.d01[id('anouk.frei@stud.ehl.ch')].att,
                p3:S.days.d01[id('timo.keller@stud.ehl.ch')].obs, toast:document.getElementById('toastHost').textContent}; }""", [A, Bf, Cf])
    ok("D13 Leerer Eintrag aus neuerer Datei ersetzt keine Beobachtung", r["p1"] == ["hyg-p2"], r)
    ok("D13 Neuere Datei mit Inhalt gewinnt weiterhin (verspätet -> entschuldigt, Baustein neu)", r["p2"] == "excused" and r["p3"] == ["org-n2"], r)
    ok("D13 Meldung nennt die übersprungenen leeren Einträge", "leere Einträge übersprungen" in r["toast"], r["toast"])
    ok("D13 keine JavaScript-Fehler", not errs, errs); c.close()

    # ---------------- D14 Tag verwerfen zweistufig ----------------
    c, pg, errs = page(b)
    pg.evaluate(GROUP)
    btn = pg.locator("#v-day button", has_text="Tag verwerfen")
    btn.click(); pg.wait_for_timeout(60)
    r1 = pg.evaluate("()=>[!!S.days.d01, [...document.querySelectorAll('#v-day button')].some(b=>b.textContent==='Tag wirklich verwerfen?')]")
    pg.locator("#v-day button", has_text="Tag wirklich verwerfen?").click(); pg.wait_for_timeout(60)
    r2 = pg.evaluate("()=>[!!S.days.d01, !!S.dayMeta.d01, document.getElementById('toastHost').textContent]")
    ok("D14 Erster Klick: nichts gelöscht, Rückfrage im Knopf", r1 == [True, True], r1)
    ok("D14 Zweiter Klick: Tag und Tagesangaben gelöscht", r2 == [False, False, "Tag verworfen"], r2)
    c.close()

    # ---------------- D15 Übersetzungen ----------------
    c, pg, errs = page(b)
    r = pg.evaluate("()=>[T.th.dateLbl, tOut('tmLateShort','zh'), ['notRecHint','removeConfirm','dropConfirm','dropDone','mailClip','mergeKeep'].every(k=>T.de[k] && T.en[k] && T.th[k])]")
    ok("D15 Thai «วันที่», Chinesisch «其中迟到», neue Texte DE/EN/TH vollständig", r == ["วันที่", "其中迟到", True], r)
    c.close()

    # ---------------- D16 einteilige Namen ----------------
    c, pg, errs = page(b)
    r = pg.evaluate("""()=>{ S.students = [{id:'x1', name:'Da Silva Rui'}, {id:'x2', name:'Ammann Lea'}, {id:'x3', name:'Solo'}]; normalizeStudents();
        const l = parseStudentLine('Da Silva Rui; rui@x.ch'); return [S.students.map(s=>[s.last, s.first]), [l.last, l.first]]; }""")
    ok("D16 «Da Silva Rui» -> Nachname «Da Silva», Vorname «Rui» (auch in der Liste)", r == [[["Da Silva", "Rui"], ["Ammann", "Lea"], ["Solo", ""]], ["Da Silva", "Rui"]], r)
    # Namensliste wie auf dem Tablet: #Nr als letztes Feld, «#…» an beliebiger Stelle (Nachtrag 31.10.2026)
    MOB = "Muster; Max; ; max@x.ch; de; HFD; Gruppe 1 Team A; #21"
    r = pg.evaluate("""(line)=>{ const a = parseStudentLine(line), b = parseStudentLine('#21; Muster; Max; max@x.ch'),
        c = parseStudentLine('Muster; #x@y.ch; Max; #22; HFD'); return {a, back: studentLine(Object.assign({}, a)), b, c}; }""", MOB)
    ok("D4 Tablet-Zeile gelesen: Nummer 21, Klasse, Gruppe, E-Mail richtig", r["a"] == {"last": "Muster", "first": "Max", "nick": "", "mail": "max@x.ch", "lang": "de", "klasse": "HFD", "gruppe": "Gruppe 1 Team A", "nr": "21"}, r["a"])
    ok("D4 Laptop schreibt dieselbe Zeile zurück (#Nr am Schluss)", r["back"] == MOB, r["back"])
    ok("D4 «#…» an beliebiger Stelle ist Nummer, nie E-Mail oder Name", r["b"]["nr"] == "21" and r["b"]["last"] == "Muster" and r["c"]["nr"] == "x@y.ch" and r["c"]["mail"] == "" and r["c"]["first"] == "Max" and r["c"]["klasse"] == "HFD", [r["b"], r["c"]])
    c.close()

    # ---------------- D17 Rückgabe von onRestore ----------------
    c, pg, errs = page(b, "Kuechenrapport_4Tage_Exam.html")
    r = pg.evaluate("""async ()=>{ const good = JSON.parse(JSON.stringify(snapshot())); const tenT = Object.assign({}, good, {variant:'10T'});
        const svc = Object.assign({}, good, {app:'Servicerapport'});
        const f = o => ({target:{files:[new File([typeof o === 'string' ? o : JSON.stringify(o)], 'x.json')], value:''}});
        const cb = o => onRestore(f(o));
        return [await cb(good), await cb(tenT), await cb(svc), await cb('{kaputt'), await onRestore({target:{files:[], value:''}})]; }""")
    ok("D17 onRestore: true geladen, false bei Variante, App, Datei, ohne Datei", r == [True, False, False, False, False], r)
    ok("D17 keine JavaScript-Fehler", not errs, errs); c.close()
    b.close()

print("\n".join(res)); n = sum(x.startswith("OK") for x in res); print(n, "von", len(res))
(R/"tests"/"Testprotokoll_Fixes_Kueche.txt").write_text("PRUEFUNG KORREKTUREN KUECHENRAPPORT LAPTOP %s\n\n" % datetime.date.today().strftime("%d.%m.%Y") + "\n".join(res) + "\n", encoding="utf-8")
