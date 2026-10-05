# -*- coding: utf-8 -*-
"""Noten 2.0, Schritt Tagesplan (05.10.2026):
- Studierende koennen einen Tagesplan aus dem Cockpit tragen:
    ortPlan = Restaurant pro Einsatztag (Index 0 = Tag 1, "" = Stammrestaurant)   [Service]
    tmTage  = Einsatztage mit Team Market (z. B. [3, 7])                          [Kueche und Service]
  Ein neu geoeffneter Tag setzt den Ort und den Status Team Market nach diesem Plan.
  Alles bleibt von Hand aenderbar.
- Gruppen der EHL: "Gruppe 1 Team A" bis "Gruppe 3 Team B" werden erkannt und angeboten.
"""
import pathlib, sys
R = pathlib.Path(__file__).parent.parent / "src"
def patch(path, pairs):
    p = R / path; s = p.read_text(encoding="utf-8")
    for old, new in pairs:
        n = s.count(old)
        if n != 1: sys.exit("%s: %d Treffer:\n%s" % (path, n, old[:200]))
        s = s.replace(old, new)
    p.write_text(s, encoding="utf-8"); print("ok", path, len(pairs))

GR_OLD = '''function erkenneGruppe(v){
  const m = String(v || "").trim().match(/^(gruppe|grp|group|team)\\s*(\\d+)$/i);
  return m ? ((/^t/i.test(m[1]) ? "Team " : "Gruppe ") + m[2]) : "";
}'''
GR_NEW = '''function erkenneGruppe(v){
  const s = String(v || "").trim();
  /* EHL-Einteilung: "Gruppe 1 Team A", auch "Gruppe 1A", "Gr1 A" */
  const e = s.match(/^(?:gruppe|grp|gr|group)\\s*(\\d+)\\s*(?:team\\s*)?([a-z])$/i);
  if(e) return "Gruppe " + e[1] + " Team " + e[2].toUpperCase();
  const m = s.match(/^(gruppe|grp|group|team)\\s*(\\d+)$/i);
  return m ? ((/^t/i.test(m[1]) ? "Team " : "Gruppe ") + m[2]) : "";
}'''
TM_HELPER = '''
/* Tagesplan aus dem Cockpit: Team Market an diesem Einsatztag? */
function planTM(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return !!(s && Array.isArray(s.tmTage) && sl && s.tmTage.indexOf(sl.idx) >= 0);
}
'''
GRUPPEN_EHL = '"Gruppe 1 Team A","Gruppe 1 Team B","Gruppe 2 Team A","Gruppe 2 Team B","Gruppe 3 Team A","Gruppe 3 Team B"'

# ---------- Kueche ----------
for f in ("kueche/_scriptB.js", "kueche/_mobile.js"):
    patch(f, [
        (GR_OLD, GR_NEW),
        ('const GRUPPEN = ["Gruppe 1","Team 1","Gruppe 2","Team 2"];',
         'const GRUPPEN = [' + GRUPPEN_EHL + ',"Gruppe 1","Team 1","Gruppe 2","Team 2"];'),
        ('function openSlot(id){', TM_HELPER + 'function openSlot(id){'),
        ('''  S.students.forEach(s=>{ S.days[id][s.id] = S.days[id][s.id] || {att:"present", obs:[], note:null}; });''',
         '''  S.students.forEach(s=>{ S.days[id][s.id] = S.days[id][s.id] || {att: planTM(s, id) ? "tm" : "present", obs:[], note:null}; });'''),
    ])

# ---------- Service ----------
patch("service/_chips.js", [('const GRUPPEN = ["Gruppe 1", "Gruppe 2", "Team 1", "Team 2"];',
                             'const GRUPPEN = [' + GRUPPEN_EHL + ', "Gruppe 1", "Gruppe 2", "Team 1", "Team 2"];')])
PLAN_OLD = '''function planOutlet(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return (s && s.wechselAb && s.wechselOutlet && sl && sl.idx >= s.wechselAb) ? s.wechselOutlet : "";
}'''
PLAN_NEW = '''function planOutlet(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  if(!s || !sl) return "";
  /* Tagesplan aus dem Cockpit: Restaurant pro Einsatztag */
  if(Array.isArray(s.ortPlan)){
    const o = String(s.ortPlan[sl.idx - 1] || "").trim();
    return (o && o !== String(S.settings.outlet || "").trim()) ? o : "";
  }
  return (s.wechselAb && s.wechselOutlet && sl.idx >= s.wechselAb) ? s.wechselOutlet : "";
}''' + TM_HELPER
for f in ("service/_scriptB.js", "service/_mobile.js"):
    patch(f, [
        (GR_OLD, GR_NEW),
        (PLAN_OLD, PLAN_NEW),
        ('''      S.days[id][s.id] = {att:"present", obs:[], note:null};''',
         '''      S.days[id][s.id] = {att: planTM(s, id) ? "tm" : "present", obs:[], note:null};'''),
    ])
patch("service/_scriptB.js", [
    ('''      if(s.wechselAb && s.wechselOutlet){ o.wechselAb = parseInt(s.wechselAb, 10) || 0; o.wechselOutlet = String(s.wechselOutlet); }''',
     '''      if(s.wechselAb && s.wechselOutlet){ o.wechselAb = parseInt(s.wechselAb, 10) || 0; o.wechselOutlet = String(s.wechselOutlet); }
      if(Array.isArray(s.ortPlan)) o.ortPlan = s.ortPlan.map(x => String(x || ""));
      if(Array.isArray(s.tmTage)) o.tmTage = s.tmTage.map(x => parseInt(x, 10)).filter(x => x > 0);'''),
])
print("fertig")
