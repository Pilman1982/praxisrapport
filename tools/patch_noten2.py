# -*- coding: utf-8 -*-
"""Noten 2.0, Schritt 'Noten sichtbar, Datum statt Woche, Fotos' (05.10.2026)."""
import pathlib, sys
R = pathlib.Path(__file__).parent.parent / "src"
def patch(path, pairs):
    p = R / path; s = p.read_text(encoding="utf-8")
    for old, new in pairs:
        n = s.count(old)
        if n != 1: sys.exit("%s: %d Treffer:\n%s" % (path, n, old[:220]))
        s = s.replace(old, new)
    p.write_text(s, encoding="utf-8"); print("ok", path, len(pairs))

DATES = '''
  /* Noten 2.0: echte Daten aus dem Paket (S.settings.slotDates); der Wochentag folgt dann dem Datum */
  const dts = Array.isArray(S.settings.slotDates) ? S.settings.slotDates : [];
  out.forEach((s, i) => { const d = String(dts[i] || "");
    if(/^\\d{4}-\\d{2}-\\d{2}$/.test(d)){ s.date = d; s.wd = ["su","mo","tu","we","th","fr","sa"][new Date(d + "T12:00:00").getDay()]; } });
  return out;'''

# ---------------- Mobil (beide) ----------------
for app in ("kueche", "service"):
    f = app + "/_mobile.js"
    patch(f, [
        # Daten statt Woche
        ('''              week:Math.floor(j/wd.length)+1, idx:i+1, exam: hasEx && i === n-1});
  }
  return out;''', '''              week:Math.floor(j/wd.length)+1, idx:i+1, exam: hasEx && i === n-1});
  }''' + DATES),
        ('''const slotLabel = (s, lg) => s.exam ? tl("examDay", lg||L) : (wdName(s.wd, lg) + " " + s.week);''',
         '''const slotLabel = (s, lg) => s.exam ? tl("examDay", lg||L) + (s.date ? " " + dmy(s.date) : "")
                                     : (wdName(s.wd, lg) + " " + (s.date ? dmy(s.date) : "(" + s.idx + ")"));'''),
        ('''    b.appendChild(el("span",{class:"sw", text: s.exam ? (s.idx+"/"+all.length)
                                                      : (t("week")+" "+s.week+" · "+s.idx+"/"+all.length)}));''',
         '''    b.appendChild(el("span",{class:"sw", text: s.date ? dmy(s.date) : (s.idx+"/"+all.length)}));'''),
        # Liste: Tagesnote
        ('''    if(n) b.appendChild(el("span",{class:"pill on",text:String(n)}));''',
         '''    if(n) b.appendChild(el("span",{class:"pill on",text:String(n)}));
    b.appendChild(n2Pill(n2Day(curSlot, s.id)));'''),
        # Erfassungsblatt: Foto, Note im Kopf, Kriteriennoten, Wirkung der Bausteine
        ('''  hd.appendChild(el("div",{style:"min-width:0;flex:1"},[''',
         '''  { const av0 = avatar(student, 44); if(av0) hd.appendChild(av0); }
  hd.appendChild(el("div",{style:"min-width:0;flex:1"},['''),
        ('''  hd.appendChild(el("button",{class:"hbtn",text:"✕","aria-label":t("done"),onclick:close}));''',
         '''  hd.appendChild(el("div",{id:"n2grade",class:"gpill big"}));
  hd.appendChild(el("button",{class:"hbtn",text:"✕","aria-label":t("done"),onclick:close}));'''),
        ('''    const r = dayRec(curSlot, student.id);''',
         '''    const r = dayRec(curSlot, student.id);
    n2ShowHead(student.id);
    const n2cg = n2Crit(curSlot, student.id);'''),
        ('''        el("div",{class:"w",text:(c.d>0?"+ ":"− ")+wtxt})''',
         '''        el("div",{class:"w",text:(c.d>0?"+ ":"− ")+wtxt+"  \\u00b7  "+n2Effect(c)})'''),
        # Notenuebersicht
        ('''  if(view === "set"){''', '''  if(view === "set" || view === "grades"){'''),
        ('''  if(view === "set") renderSet(); else renderDay();''',
         '''  if(view === "set") renderSet(); else if(view === "grades") n2RenderGrades(); else renderDay();'''),
        ('''document.getElementById("btnLang").addEventListener("click", cycleLang);''',
         '''document.getElementById("btnLang").addEventListener("click", cycleLang);
document.getElementById("btnGrades").addEventListener("click", ()=>{
  view = (view === "grades") ? "day" : "grades"; render();
});'''),
    ])
    patch(app + "/_mobile_head.html", [
        ('''    <button class="hbtn" id="btnLang" aria-label="Sprache">文</button>''',
         '''    <button class="hbtn" id="btnGrades" aria-label="Noten">Ø</button>
    <button class="hbtn" id="btnLang" aria-label="Sprache">文</button>'''),
        ('.srow .nm{', '''.gpill{flex:0 0 auto;font-weight:700;font-size:13.5px;padding:5px 9px;border-radius:999px;background:var(--surf2,#eee);margin-left:6px;font-variant-numeric:tabular-nums}
.gpill.big{font-size:13px;padding:7px 11px;margin:0 8px 0 0;white-space:nowrap}
.gpill.g-ok{background:#dff1e5;color:#1d5c34}.gpill.g-mid{background:#fbefd5;color:#7a5408}.gpill.g-bad{background:#f8dcd7;color:#8a2416}
.gpill.strong{outline:2px solid currentColor}
.gbox{display:grid;grid-template-columns:auto auto;gap:4px 6px;align-items:center;justify-items:end;flex:0 0 auto}
.gbox .gl{font-size:11px;color:var(--ink3,#777)}
.critbar .cg{font-size:11px;opacity:.75;margin-left:5px;font-variant-numeric:tabular-nums}
.srow .nm{'''),
    ])
# Kriteriennote im Reiter (Name unterscheidet sich: critName / critShort)
patch("kueche/_mobile.js", [('''      b.appendChild(el("span",{text:critName(c.k)}));''',
    '''      b.appendChild(el("span",{text:critName(c.k)}));
      if(n2cg) b.appendChild(el("span",{class:"cg",text:n2cg[c.k].toFixed(2)}));'''),
    ('''      el("div",{class:"sub",text:t(attOf(r)) + (n ? " · " + n + " " + t("obs") : " · " + t("noObs"))})''',
     '''      el("div",{class:"sub",text:t(attOf(r) === "tm" ? "teamMarket" : attOf(r)) + (n ? " · " + n + " " + t("obs") : " · " + t("noObs"))
        + " · \\u00d8 " + n2Fmt(n2Praxis(s.id).avg)})''')])
patch("service/_mobile.js", [('''      b.appendChild(el("span",{text:critShort(c.k)}));''',
    '''      b.appendChild(el("span",{text:critShort(c.k)}));
      if(n2cg) b.appendChild(el("span",{class:"cg",text:n2cg[c.k].toFixed(2)}));'''),
    ('''      el("div",{class:"sub",text:t(r.att||"present") + (n ? " · " + n + " " + t("obs") : " · " + t("noObs"))''',
     '''      el("div",{class:"sub",text:t((r.att||"present") === "tm" ? "teamMarket" : (r.att||"present")) + (n ? " · " + n + " " + t("obs") : " · " + t("noObs"))
        + " · \\u00d8 " + n2Fmt(n2Praxis(s.id).avg)''')])

# ---------------- Laptop (beide) ----------------
for app in ("kueche", "service"):
    f = app + "/_scriptB.js"
    patch(f, [
        ('''              idx:i+1, exam: HAS_EXAM && i === n-1});
  }
  return out;''', '''              idx:i+1, exam: HAS_EXAM && i === n-1});
  }''' + DATES),
        ('''function slotLabel(s, lg){
  const L2 = lg || S.settings.uiLang;
  if(s.exam) return tOut("examDay", L2);
  return (L2 === "zh") ? ("第" + s.week + "周 " + wdName(s.wd, L2))
                       : (wdName(s.wd, L2) + " " + s.week);
}''', '''function dmy(d){ return String(d).slice(8,10) + "." + String(d).slice(5,7) + "."; }
/* Noten 2.0: Wochentag mit Datum statt Wochennummer; ohne Datum die Nummer des Einsatztags */
function slotLabel(s, lg){
  const L2 = lg || S.settings.uiLang;
  if(s.exam) return tOut("examDay", L2) + (s.date ? " " + dmy(s.date) : "");
  if(s.date) return wdName(s.wd, L2) + " " + dmy(s.date);
  return (L2 === "zh") ? ("第" + s.idx + "天 " + wdName(s.wd, L2))
                       : (wdName(s.wd, L2) + " (" + s.idx + ")");
}'''),
        ('''      ? wdName(s.wd)+" · "+s.idx+"/"+n
      : t("weekN")+" "+s.week+" · "+s.idx+"/"+n}));''',
         '''      ? (s.date ? wdName(s.wd)+" "+dmy(s.date) : wdName(s.wd)+" · "+s.idx+"/"+n)
      : (s.date ? dmy(s.date) : s.idx+"/"+n)}));'''),
        ('''    tr2.appendChild(el("td",{class:"nm",text:s.name}));''',
         '''    tr2.appendChild(el("td",{class:"nm"},[avatar(s, 26), document.createTextNode(" " + s.name + nickTag(s))]));'''),
        ('''          el("span",{class:"tx",text:chipT(c, S.settings.uiLang)}));''',
         '''          el("span",{class:"tx",text:(c.ko ? "K.-o. " : (c.d>0?"+":"\\u2212") + c.w.toFixed(2).slice(1) + " ") + chipT(c, S.settings.uiLang)}));'''),
    ])
print("fertig")
