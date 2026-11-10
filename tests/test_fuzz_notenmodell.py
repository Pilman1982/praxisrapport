# -*- coding: utf-8 -*-
"""Zufallspruefung Notenmodell (Audit 10.11.2026): Tablet, Laptop und Notenzentrale rechnen aus denselben
Daten dieselben Noten, in allen sechs Varianten (Kueche und Service, 10T / 4T / 5T).

Teil A  saubere Zufallsdaten (alle Anwesenheiten, Bausteine mehrfach, K.-o., alter Baustein «Verspaetet»,
        Freitext mit Wirkung und ohne Text, fehlende Tage): Tagesnoten, Praxis, Exam und Schlussnote muessen in Tablet,
        Laptop und Notenzentrale bis auf 1e-9 gleich sein. Dazu Grenzen: jede Note zwischen 1 und 6,
        verspaetet hoechstens 5.00, Team Market fest 5.00 bzw. 4.00.
Teil B  beschaedigte Dateien (falsche Typen, unbekannte Werte, fremde Schluessel) ueber «Sicherung laden»:
        kein JavaScript-Fehler, und die Notenzentrale liest aus der rohen Datei dieselben Noten wie die App
        nach dem Einlesen.

Fester Startwert, damit ein Fehler wiederholbar ist. Anderer Lauf: DG_FUZZ_SEED=123 python3 tests/test_fuzz_notenmodell.py
"""
import pathlib, json, os, random
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent; D = R / "docs"
SEED = int(os.environ.get("DG_FUZZ_SEED", "20261110")); RUNDEN = int(os.environ.get("DG_FUZZ_RUNDEN", "3"))
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-86s %s" % (n, "" if c else str(i)[:400]))

VAR = {"10T": (10, True), "4T": (5, True), "5T": (5, False)}
SUF = {"10T": "", "4T": "_4Tage_Exam", "5T": "_5Tage_ohneExam"}
STEM = {"kueche": ("kueche/Kuechenrapport", "Kuechenrapport"), "service": ("service/Servicerapport", "Servicerapport")}
ATT = ["present", "present", "present", "late", "excused", "unexcused", "tm", "tml"]
DATES = ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-16", "2026-11-17"]

def students(area, n):
    out = []
    for i in range(n):
        s = {"id": "s%d" % (i + 1), "nr": str(500 + i), "name": "Test%d Person%d" % (i, i), "mail": "p%d@beispiel.ch" % i, "klasse": "HFD", "gruppe": "Gruppe 1"}
        if area == "service": s.update(nachname="Test%d" % i, vorname="Person%d" % i)
        else: s.update(last="Test%d" % i, first="Person%d" % i)
        out.append(s)
    return out

def paket(area, var, rng, n=6):
    cnt, _ = VAR[var]
    return {"app": STEM[area][1], "variant": var, "savedAt": "2026-11-18T10:00:00.000Z",
            "settings": {"group": "HFD", "team": "Gruppe 1", "outlet": "Campigiana", "teacher": "Test Dozent", "uiLang": "de", "outLang": "de",
                         "weekdays": ["mo", "tu", "we", "th"], "startIdx": 0, "slotDates": DATES[:cnt], "paketId": "Paket_Zyklus-9-9_%s_Campigiana_%s_%d" % (STEM[area][1][:-7] if area == "service" else "Kueche", var, rng.randrange(10**6)),
                         "block": "Zyklus 9.9", "semester": "HS26"},
            "students": students(area, n), "days": {}, "dayMeta": {}}

def sauber(o, chips, crits, rng):
    cnt, _ = VAR[o["variant"]]
    for d in range(1, cnt + 1):
        dk = "d%02d" % d; o["days"][dk] = {}
        o["dayMeta"][dk] = {"date": DATES[d - 1], "teacher": "Test Dozent"}
        for s in o["students"]:
            if rng.random() < 0.08: continue                                   # Person an diesem Tag nicht erfasst
            obs = [rng.choice(chips) for _ in range(rng.choice([0, 0, 1, 2, 3, 5, 9]))]   # auch derselbe Baustein mehrfach
            note = None
            if rng.random() < 0.3:
                note = {"txt": rng.choice(["Notiz %d" % rng.randrange(99)] * 4 + ["", "  "]), "crit": rng.choice(crits + [""]), "dir": rng.choice([-1, 0, 1]), "w": rng.choice([0, 0.25, 0.5, 1]), "internal": rng.random() < 0.3}
            o["days"][dk][s["id"]] = {"att": rng.choice(ATT), "obs": obs, "note": note}
    return o

def kaputt(o, chips, crits, rng):
    """Dieselbe Datei, aber mit Werten, wie sie nach einem Fehler oder von Hand in einer JSON stehen koennen."""
    sauber(o, chips, crits, rng)
    murks = [lambda r: r.update(att="krank"), lambda r: r.update(att=None), lambda r: r.update(obs="hyg-p1"), lambda r: r.update(obs=None),
             lambda r: r.update(obs=r["obs"] + [7, None, {"i": "x"}, "gibt-es-nicht"]), lambda r: r.update(note="nur Text"),
             lambda r: r.update(note={"txt": "Zahl als Text", "crit": rng.choice(crits), "dir": "1", "w": "0.5"}),
             lambda r: r.update(note={"txt": "riesig", "crit": rng.choice(crits), "dir": -1, "w": 99}),
             lambda r: r.update(note={"txt": 5, "crit": rng.choice(crits), "dir": 1, "w": 1}),
             lambda r: r.update(note={"crit": rng.choice(crits), "dir": 1, "w": 1}),
             lambda r: r.pop("obs", None), lambda r: r.pop("att", None)]
    for dk, recs in o["days"].items():
        for sid in list(recs):
            if rng.random() < 0.45: rng.choice(murks)(recs[sid])
            if rng.random() < 0.03: recs[sid] = None
            if rng.random() < 0.03: recs[sid] = "kaputt"
    o["days"]["d99"] = {"s1": {"att": "present", "obs": [], "note": None}}     # Tag ausserhalb der Variante
    o["days"]["heute"] = {"s1": {"att": "unexcused"}}                          # kein Slot-Schluessel
    o["days"]["d01"]["geist"] = {"att": "unexcused", "obs": [], "note": None}  # Person, die es nicht gibt
    o["dayMeta"]["d02"] = "kaputt"
    return o

LOAD_RAW = """(o)=>{ S.settings = Object.assign(S.settings, JSON.parse(JSON.stringify(o.settings))); S.settings.isSample = false;
    S.students = JSON.parse(JSON.stringify(o.students)); S.days = JSON.parse(JSON.stringify(o.days)); S.dayMeta = JSON.parse(JSON.stringify(o.dayMeta));
    if(typeof normalizeStudents === 'function') normalizeStudents(); persist(); if(typeof render === 'function') render(); return S.students.length; }"""
NOTEN_MOBIL = """()=>{ const out = {}; S.students.forEach(s => { out[s.nr] = {days: slots().map(x=>n2Day(x.id, s.id)), crit: slots().map(x=>n2Crit(x.id, s.id)),
    att: slots().map(x=>((S.days[x.id]||{})[s.id]||{}).att || null),
    praxis: n2Praxis(s.id).avg, exam: slots().some(x=>x.exam) ? n2Exam(s.id) : null, final: slots().some(x=>x.exam) ? n2Final(s.id) : n2Praxis(s.id).avg}; }); return out; }"""
NOTEN_LAPTOP = """()=>{ const out = {}; S.students.forEach(s => { const su = summary(s.id, 'all'), ex = examSummary(s.id);
    out[s.nr] = {days: slots().map(x=>dayTotal(x.id, s.id)), praxis: su.total, exam: ex ? ex.total : null, final: finalGrade(su.total, ex ? ex.total : null)}; }); return out; }"""
NOTEN_NZ = """(txt)=>{ NZ.addTexts([{name:'fuzz.json', text: txt}]); const out = {};
    NZ.EINS.forEach(e => { const days = {}; e.days.forEach(d => { days[d.sl.id] = d.total; });
      out[e.person.nr] = {days: e.parts[0].slots.map(sl => (sl.id in days) ? days[sl.id] : null), praxis: e.praxis, exam: e.exam, final: e.final}; });
    const n = NZ.EINS.length; NZ.addTexts([]); return {out, n, raw: NZ.RAW.map(r=>[r.kind, r.why])}; }"""

def gleich(a, b): return (a is None and b is None) or (a is not None and b is not None and abs(a - b) < 1e-9)
def vergleiche(x, y, felder=("praxis", "exam", "final")):
    diff = []
    for nr in sorted(set(x) | set(y)):
        if nr not in x or nr not in y: diff.append((nr, "fehlt")); continue
        for i, (p, q) in enumerate(zip(x[nr]["days"], y[nr]["days"])):
            if not gleich(p, q): diff.append((nr, "Tag %d" % (i + 1), p, q))
        if len(x[nr]["days"]) != len(y[nr]["days"]): diff.append((nr, "Anzahl Tage", len(x[nr]["days"]), len(y[nr]["days"])))
        for f in felder:
            if not gleich(x[nr][f], y[nr][f]): diff.append((nr, f, x[nr][f], y[nr][f]))
    return diff

with sync_playwright() as p:
    b = p.chromium.launch()
    def seite(rel, vp, upload=None):
        c = b.new_context(viewport=vp); c.route("https://cdnjs.cloudflare.com/**", lambda r: r.abort())
        pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((D / rel).as_uri()); pg.wait_for_timeout(250)
        return c, pg, errs
    rng = random.Random(SEED)
    cz, nz, nzerr = seite("notenzentrale.html", {"width": 1366, "height": 900})
    nz.evaluate("()=>{ window.NZ_TODAY = '2026-11-18'; }")
    for area in ("kueche", "service"):
        for var in ("10T", "4T", "5T"):
            lab = "%s %s" % (area, var)
            cm, mob, merr = seite(STEM[area][0] + "_Mobil" + SUF[var] + ".html", {"width": 820, "height": 1180})
            cl, lap, lerr = seite(STEM[area][0] + SUF[var] + ".html", {"width": 1366, "height": 900})
            chips = mob.evaluate("()=>CHIPS.map(c=>c.i)"); crits = mob.evaluate("()=>CRITS.map(c=>c.k)")
            dA, dB, grenzen, n_rec = [], [], [], 0
            for runde in range(RUNDEN):
                # ---------- Teil A ----------
                o = sauber(paket(area, var, rng), chips, crits, rng)
                mob.evaluate(LOAD_RAW, o); lap.evaluate(LOAD_RAW, o)
                m = mob.evaluate(NOTEN_MOBIL); l = lap.evaluate(NOTEN_LAPTOP)
                z = nz.evaluate("()=>{ NZ.addTexts([]); document.getElementById('btnClear').click(); }") or nz.evaluate(NOTEN_NZ, json.dumps(o))
                dA += [("Tablet/Laptop",) + x for x in vergleiche(m, l)] + [("Tablet/Notenzentrale",) + x for x in vergleiche(m, z["out"])]
                if z["n"] != len(o["students"]): dA.append(("Notenzentrale Einsaetze", z["n"], z["raw"]))
                for nr, v in m.items():
                    for i, (t, g, a) in enumerate(zip(v["days"], v["crit"], v["att"])):
                        if t is None: continue
                        n_rec += 1
                        if not (1 <= t <= 6) or any(not (1 <= x <= 6) for x in g.values()): grenzen.append((nr, i, t))
                        if a == "late" and max(g.values()) > 5 + 1e-9: grenzen.append((nr, i, "verspaetet ueber 5.00", g))
                        if a == "tm" and set(g.values()) != {5}: grenzen.append((nr, i, "Team Market nicht 5.00", g))
                        if a == "tml" and set(g.values()) != {4}: grenzen.append((nr, i, "Team Market verspaetet nicht 4.00", g))
                    for f in ("praxis", "exam", "final"):
                        if v[f] is not None and not (1 <= v[f] <= 6): grenzen.append((nr, f, v[f]))
                # ---------- Teil B ----------
                o = kaputt(paket(area, var, rng), chips, crits, rng)
                txt = json.dumps(o)
                for pg, fn in ((mob, "onLoadBackup"), (lap, "onRestore")):
                    r = pg.evaluate("async (a)=>{ return await %s({target:{files:[new File([a], 'kaputt.json')], value:''}}); }" % fn, txt)
                    if r is not True: dB.append((fn, "nicht geladen", r))
                m = mob.evaluate(NOTEN_MOBIL); l = lap.evaluate(NOTEN_LAPTOP)
                nz.evaluate("()=>document.getElementById('btnClear').click()"); z = nz.evaluate(NOTEN_NZ, txt)
                dB += [("Tablet/Laptop",) + x for x in vergleiche(m, l)] + [("App/Notenzentrale",) + x for x in vergleiche(m, z["out"])]
                # alle Ansichten einmal zeichnen
                for v in ("day", "week", "rep", "data", "set"): lap.evaluate("(v)=>{ view = v; render(); }", v)
                for v in ("day", "grades", "set"): mob.evaluate("(v)=>{ view = v; render(); }", v)
                for tab in ("ov", "pk", "ps", "ab", "ko", "fi"): nz.evaluate("(t)=>NZ.setTab(t)", tab)
            ok("%s: saubere Daten, Tablet = Laptop = Notenzentrale (%d Tagesnoten)" % (lab, n_rec), not dA, dA[:4])
            ok("%s: alle Noten in den Grenzen (1 bis 6, verspaetet hoechstens 5.00, Team Market fest)" % lab, not grenzen, grenzen[:4])
            ok("%s: beschaedigte Datei laedt, App und Notenzentrale rechnen gleich" % lab, not dB, dB[:4])
            ok("%s: keine JavaScript-Fehler (Tablet, Laptop)" % lab, not merr and not lerr, (merr + lerr)[:3])
            cm.close(); cl.close()
    ok("Notenzentrale: keine JavaScript-Fehler", not nzerr, nzerr[:3])
    cz.close(); b.close()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res), "(Startwert %d)" % SEED)
(R / "tests" / "Testprotokoll_Fuzz_Notenmodell.txt").write_text("ZUFALLSPRUEFUNG NOTENMODELL 10.11.2026 (Startwert %d, %d Runden)\n\n" % (SEED, RUNDEN) + "\n".join(res) + "\n", encoding="utf-8")
raise SystemExit(0 if all(x.startswith("OK") for x in res) else 1)
