# -*- coding: utf-8 -*-
"""Noten 2.0, Schritt Profil (05.10.2026):
- Studierende tragen optional nr (Studierendennummer), foto (kleines JPEG als Data-URL),
  wechselAb / wechselOutlet (Service: Restaurantwechsel ab Einsatztag n, aus dem Cockpit)
- Foto und Nickname werden beim Erfassen angezeigt (Laptop und Mobil, Kueche und Service)
- Service: ein neuer Einsatztag setzt den Ort nach dem Plan aus dem Cockpit
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

AVA_JS = r'''
/* Foto und Nickname fuer die Erfassung (Noten 2.0). foto ist ein kleines JPEG aus dem Cockpit. */
function avatar(s, size){
  const px = (size || 32) + "px";
  if(s && typeof s.foto === "string" && s.foto.indexOf("data:image/") === 0)
    return el("img",{class:"ava",src:s.foto,alt:"",style:"width:"+px+";height:"+px});
  return null;
}
const nickTag = s => (s && s.nick) ? " «" + s.nick + "»" : "";
'''
CSS = ".ava{border-radius:50%;object-fit:cover;flex:0 0 auto;background:#ddd;vertical-align:middle}\n"

# ---------- Kueche Laptop ----------
patch("kueche/_scriptB.js", [
  ('const longName = s => sortName(s)', AVA_JS + 'const longName = s => sortName(s)'),
  ('    const head = el("div",{class:"stud-h"},[el("div",{class:"nm",text:s.name})]);',
   '    const head = el("div",{class:"stud-h"},[avatar(s, 34), el("div",{class:"nm",text:s.name + nickTag(s)})]);'),
  ('''          ex = {id:"m"+Math.random().toString(36).slice(2,8), name:st.name||"",
                last:st.last||"", first:st.first||"", nick:st.nick||"",''',
   '''          ex = {id:"m"+Math.random().toString(36).slice(2,8), name:st.name||"",
                last:st.last||"", first:st.first||"", nick:st.nick||"",
                nr:st.nr||"", foto:st.foto||"",'''),
  ('''          ["last","first","nick","mail","lang","klasse","gruppe"].forEach(k=>{''',
   '''          ["last","first","nick","mail","lang","klasse","gruppe","nr","foto"].forEach(k=>{'''),
])
patch("kueche/_head_top.html", [('.stud-h .nm{', CSS + '.stud-h .nm{')])

# ---------- Kueche Mobil ----------
patch("kueche/_mobile.js", [
  ('function openSlot(id){', AVA_JS + 'function openSlot(id){'),
  ('''    b.appendChild(el("span",{class:"nm"},[
      el("span",{html:""}),
      document.createTextNode(dispName(s)),''',
   '''    const av = avatar(s, 34); if(av) b.appendChild(av);
    b.appendChild(el("span",{class:"nm"},[
      el("span",{html:""}),
      document.createTextNode(dispName(s) + nickTag(s)),'''),
  ('    el("div",{class:"nm",text:dispName(student)}),',
   '    el("div",{class:"nm",text:dispName(student) + nickTag(student)}),'),
])
patch("kueche/_mobile_head.html", [('.srow .nm{', CSS + '.srow .nm{')])

# ---------- Service Laptop ----------
patch("service/_scriptB.js", [
  ('''        klasse:   erkenneKlasse(s.klasse) || String(s.klasse || "").trim(),
        gruppe:   erkenneGruppe(s.gruppe) || String(s.gruppe || "").trim()
      };''',
   '''        klasse:   erkenneKlasse(s.klasse) || String(s.klasse || "").trim(),
        gruppe:   erkenneGruppe(s.gruppe) || String(s.gruppe || "").trim()
      };
      /* Noten 2.0: Studierendennummer, Foto und Wechselplan aus dem Cockpit mitnehmen */
      if(s.nr) o.nr = String(s.nr).trim();
      if(typeof s.foto === "string" && s.foto.indexOf("data:image/") === 0) o.foto = s.foto;
      if(s.wechselAb && s.wechselOutlet){ o.wechselAb = parseInt(s.wechselAb, 10) || 0; o.wechselOutlet = String(s.wechselOutlet); }'''),
  ('function toggleOutlet(r){', '''/* Wechselplan aus dem Cockpit: ab Einsatztag n im zweiten Restaurant */
function planOutlet(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return (s && s.wechselAb && s.wechselOutlet && sl && sl.idx >= s.wechselAb) ? s.wechselOutlet : "";
}
function toggleOutlet(r){'''),
  ('''      const vo = hasOutlet2() ? prevOutlet(id, s.id) : "";''',
   '''      const vo = planOutlet(s, id) || (hasOutlet2() ? prevOutlet(id, s.id) : "");'''),
  ('''    const head = el("div",{class:"stud-h"},[el("div",{class:"nm",text:s.name})]);''',
   '''    const head = el("div",{class:"stud-h"},[avatar(s, 34), el("div",{class:"nm",text:s.name + nickTag(s)})]);'''),
  ('const dayMeta = id => (S.dayMeta && S.dayMeta[id])', AVA_JS + 'const dayMeta = id => (S.dayMeta && S.dayMeta[id])'),
])
patch("service/_head_top.html", [('.stud-h .nm{', CSS + '.stud-h .nm{')])

# ---------- Service Mobil ----------
patch("service/_mobile.js", [
  ('function toggleOutlet(r){', '''function planOutlet(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return (s && s.wechselAb && s.wechselOutlet && sl && sl.idx >= s.wechselAb) ? s.wechselOutlet : "";
}
function toggleOutlet(r){'''),
  ('''      const vo = hasOutlet2() ? prevOutlet(id, s.id) : "";''',
   '''      const vo = planOutlet(s, id) || (hasOutlet2() ? prevOutlet(id, s.id) : "");'''),
  ('function openSlot(id){', AVA_JS + 'function openSlot(id){'),
  ('''    b.appendChild(el("span",{class:"nm"},[
      el("span",{}),
      document.createTextNode(s.name),''',
   '''    const av = avatar(s, 34); if(av) b.appendChild(av);
    b.appendChild(el("span",{class:"nm"},[
      el("span",{}),
      document.createTextNode(s.name + nickTag(s)),'''),
  ('    el("div",{class:"nm",text:student.name}),',
   '    el("div",{class:"nm",text:student.name + nickTag(student)}),'),
])
patch("service/_mobile_head.html", [('.srow .nm{', CSS + '.srow .nm{')])
print("fertig")
