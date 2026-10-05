# -*- coding: utf-8 -*-
"""Alte Rapporte (Programmstand vor dem 05.10.2026) lassen sich in die neue Fassung uebernehmen."""
import pathlib, json
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent.parent
OLD = pathlib.Path("/mnt/user-data/outputs/deploy")
LIST_OLD = "Ammann; Lea; Lulu; lea@beispiel.ch; de; HFD; Gruppe 1\nChen; Yuxuan; Ethan; yuxuan@beispiel.ch; en; HFE; Gruppe 2\nvan der Berg; Sanne; ; sanne@beispiel.ch; en"
res = []
def ok(n, c, i=""): res.append(("OK      " if c else "FEHLER  ") + "%-62s %s" % (n, str(i)[:120]))
APPLY = """() => {const ta=document.querySelector('#fStud');const b=[...document.querySelectorAll('button.pri')]
    .find(b=>ta.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);b.click();}"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for lab, old, new in (("Kueche", OLD/"k_arch/Kuechenrapport_2026-10-05_vor_Harmonisierung.html", R/"docs/kueche/Kuechenrapport.html"),
                          ("Service", OLD/"s_arch/Servicerapport_2026-10-05_vor_Harmonisierung.html", R/"docs/service/Servicerapport.html")):
        c = b.new_context(); pg = c.new_page()
        pg.goto(old.as_uri()); pg.wait_for_timeout(300)
        pg.evaluate("()=>{view='set';render();}"); pg.fill("#fStud", LIST_OLD); pg.evaluate(APPLY)
        snap = pg.evaluate("""()=>{ const sl=slots(); [0,1,2].forEach(i=>{ openSlot(sl[i].id); });
            const s=S.students[0]; S.days[sl[1].id][s.id].att='late'; return JSON.stringify(snapshot()); }""")
        src_filled = sum(1 for d in json.loads(snap)["days"].values() if d)
        c.close()
        c = b.new_context(); pg = c.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(new.as_uri()); pg.wait_for_timeout(300)
        r = pg.evaluate("""async (sn)=>{ S.students=[]; S.days={};
            await onMerge({target:{files:[new File([sn],'alt.json')], value:''}});
            const filled = Object.keys(S.days).filter(k=>Object.keys(S.days[k]).length).length;
            const a = S.students.find(x=>(x.last||x.nachname)==='Ammann');
            const v = S.students.find(x=>(x.last||x.nachname)==='van der Berg');
            return {n:S.students.length, filled, nick:a&&a.nick, late: Object.values(S.days).some(d=>Object.values(d).some(x=>x.att==='late')), vdb: !!v}; }""", snap)
        ok(lab + ": alter Rapport, 3 Personen uebernommen", r["n"] == 3, r)
        ok(lab + ": alle erfassten Tage und Verspaetung uebernommen", r["filled"] == src_filled and r["late"], [r["filled"], src_filled])
        ok(lab + ": Nickname und mehrteiliger Nachname bleiben", r["vdb"] and (r["nick"] in ("Lulu",)), r)
        ok(lab + ": keine JavaScript-Fehler", not errs, errs)
        c.close()
    b.close()
print("\n".join(res)); print(sum(x.startswith("OK") for x in res), "von", len(res))
(R/"tests"/"Testprotokoll_Altdaten.txt").write_text("PRUEFUNG ALTE RAPPORTE 05.10.2026\n\n" + "\n".join(res) + "\n", encoding="utf-8")
