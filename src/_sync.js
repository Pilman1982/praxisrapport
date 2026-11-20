/* ---- Daily Grades: gemeinsamer Stand pro Paket (Entscheid 20.11.2026) ----
   Vorher hatte jede Ansicht (Tablet und Laptop) ihren eigenen Speicher; der Knopf «Ansicht wechseln» kopierte
   den Stand nur einmal. Wer danach in der anderen Ansicht weiterarbeitete, über die Startseite einen neuen Zyklus
   öffnete oder dort «Laptop-Ansicht» wählte, sah alte oder leere Daten, oder die Rückfrage drohte mit Verlust.
   Neu führt jedes Gerät pro Paket EINEN gemeinsamen Stand im Browserspeicher (gleiche Adresse, verlässt das Gerät
   nie). Beide Ansichten schreiben jede Änderung sofort hinein und holen beim Öffnen, beim Zurückkehren in den Tab
   und nach «Zurück» den neusten Stand. Ein anderer Zyklus verdrängt nichts mehr: der bisherige bleibt in seinem
   Stand und erscheint wieder, sobald er erneut geöffnet wird.
   Einheiten (je mit Zeitstempel): Einstellungen «s», Reihenfolge «o», Person «p|id», Einsatztag «D|d01»,
   Tag und Person «d|d01|id», Tagesangaben «m|d01». Fotos stehen nicht im Stand; sie kommen mit dem Paket.
   Nur Dateien mit Paket (paketId) nehmen teil; Beispiel und Dateien ohne Paket bleiben wie bisher.
   Wichtig: hier nur var und function (kein const/let), weil persist() schon beim Start aufgerufen werden kann. */
var DGS = {ready:false, hold:false, applying:false, err:false, key:null, base:null};
var DGS_PFX = "dg.stand|", DGS_MAX = 60;
/* Gerätebezogene Einstellungen: bleiben in der jeweiligen Ansicht und gehören nicht in den Stand */
var DGS_LOCAL = ["variant", "isSample", "hideBanner", "customLangs"];

function dgsClone(v){ return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
/* JSON mit sortierten Schlüsseln: gleiche Daten ergeben immer denselben Text */
function dgsStable(v){
  if(v === null || typeof v !== "object") return JSON.stringify(v === undefined ? null : v);
  if(Array.isArray(v)) return "[" + v.map(dgsStable).join(",") + "]";
  return "{" + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ":" + dgsStable(v[k])).join(",") + "}";
}
function dgsApp(){ return /service/i.test(String(location.pathname || "").split("/").pop() || "") ? "Servicerapport" : "Kuechenrapport"; }
function dgsVariant(){ return typeof MVARIANT !== "undefined" ? MVARIANT : (typeof VARIANT !== "undefined" ? VARIANT : "10T"); }
function dgsKeyOf(){
  if(typeof S === "undefined" || !S || !S.settings || S.settings.isSample) return null;
  const id = String(S.settings.paketId || "").trim();
  return id ? DGS_PFX + dgsApp() + "|" + dgsVariant() + "|" + id : null;
}
function dgsHas(k){ return typeof k === "string" && k.indexOf(DGS_PFX) === 0 && !!dgsRead(k); }
/* Seitenzustand in Einheiten zerlegen (ohne Fotos und ohne gerätebezogene Einstellungen) */
function dgsCanon(){
  const sn = snapshot(), u = {};
  const st = dgsClone(sn.settings || {}) || {}; DGS_LOCAL.forEach(k => { delete st[k]; }); u.s = st;
  const studs = Array.isArray(sn.students) ? sn.students : [];
  u.o = studs.filter(x => x && x.id).map(x => String(x.id));
  studs.forEach(x => { if(!x || !x.id) return; const c = dgsClone(x); delete c.foto; u["p|" + x.id] = c; });
  const days = (sn.days && typeof sn.days === "object") ? sn.days : {};
  Object.keys(days).forEach(d => { u["D|" + d] = 1; const r = days[d] || {};
    Object.keys(r).forEach(sid => { if(r[sid]) u["d|" + d + "|" + sid] = dgsClone(r[sid]); }); });
  const dm = (sn.dayMeta && typeof sn.dayMeta === "object") ? sn.dayMeta : {};
  Object.keys(dm).forEach(d => { if(dm[d] != null) u["m|" + d] = dgsClone(dm[d]); });
  return u;
}
function dgsRead(k){
  try{ const o = JSON.parse(localStorage.getItem(k) || "null");
       return (o && o.v === 1 && o.u && typeof o.u === "object" && o.t && typeof o.t === "object") ? o : null; }catch(e){ return null; }
}
/* Alte Stände entfernen: nur solche, die lange nicht mehr benutzt wurden (zu viele: älter als 60 Tage;
   Speicher voll: älter als 30 Tage). Der aktuelle und frische Stände bleiben immer; reicht das nicht,
   schlägt das Schreiben fehl und es gilt die bisherige Rückfrage. */
function dgsGc(keep, force){
  try{
    const ks = [];
    for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(k && k.indexOf(DGS_PFX) === 0 && k !== keep) ks.push(k); }
    if(!force && ks.length < DGS_MAX) return;
    const tag = 24 * 3600 * 1000, grenze = Date.now() - (force ? 30 : 60) * tag;
    const alt = ks.map(k => { const o = dgsRead(k); return {k, at:o ? (o.at || 0) : 0}; }).filter(x => x.at < grenze).sort((a, b) => a.at - b.at);
    const weg = force ? alt.length : Math.min(alt.length, ks.length - DGS_MAX + 1);
    alt.slice(0, weg).forEach(x => { try{ localStorage.removeItem(x.k); }catch(e){} });
  }catch(e){}
}
function dgsWrite(st){
  st.at = Date.now();
  const txt = JSON.stringify(st);
  try{ localStorage.setItem(st.k, txt); dgsGc(st.k, false); return true; }
  catch(e){ dgsGc(st.k, true); try{ localStorage.setItem(st.k, txt); return true; }catch(e2){ return false; } }
}
function dgsSeenKey(){ return "dg.seen|" + (typeof KEY === "string" ? KEY : String(location.pathname || "")); }
function dgsSeenGet(){ try{ const o = JSON.parse(localStorage.getItem(dgsSeenKey()) || "null"); return (o && o.k) ? o : null; }catch(e){ return null; } }
function dgsSeenSet(k, rev){ try{ if(k) localStorage.setItem(dgsSeenKey(), JSON.stringify({k, rev})); else localStorage.removeItem(dgsSeenKey()); }catch(e){} }
function dgsRev(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
/* Wie viel ist in einem Tagesdatensatz erfasst (nur für alte Daten ohne Zeitstempel) */
function dgsWeight(r){
  if(!r || typeof r !== "object") return 0;
  return (r.att && r.att !== "present" ? 1 : 0) + (Array.isArray(r.obs) ? r.obs.length : 0) + (r.note && r.note.txt ? 1 : 0);
}
/* Zwei Stände vereinigen: pro Einheit gewinnt die neuere Änderung; bei Gleichstand A, ausser A hat sie nicht.
   Alte Daten (Zeit 0) auf beiden Seiten: beim Tagesdatensatz gewinnt der mit mehr Erfasstem. */
function dgsMerge(A, B){
  const out = {v:1, k:A.k, rev:A.rev, u:{}, t:{}};
  const keys = new Set(Object.keys(A.u).concat(Object.keys(A.t), Object.keys(B.u), Object.keys(B.t)));
  keys.forEach(x => {
    const ta = A.t[x] || 0, tb = B.t[x] || 0, inA = x in A.u, inB = x in B.u;
    let useB = tb > ta;
    if(tb === ta && !inA && inB) useB = true;
    if(tb === ta && ta === 0 && inA && inB && x.indexOf("d|") === 0 && dgsWeight(B.u[x]) > dgsWeight(A.u[x])) useB = true;
    const W = useB ? B : A;
    if(x in W.u) out.u[x] = dgsClone(W.u[x]);
    if(W.t[x]) out.t[x] = W.t[x];
  });
  /* Reihenfolge: die gewählte, dazu Personen der anderen Seite, die dort fehlen */
  const o = Array.isArray(out.u.o) ? out.u.o.slice() : [];
  [A.u.o, B.u.o].forEach(l => (Array.isArray(l) ? l : []).forEach(id => { if(!o.includes(id)) o.push(id); }));
  out.u.o = o;
  return out;
}
function dgsSame(a, b){ return dgsStable(a.u) === dgsStable(b.u) && dgsStable(a.t) === dgsStable(b.t); }
/* Stand -> Sicherungsform der App; Fotos aus den mitgegebenen Personen (gleiche Nummer, sonst gleiche ID und gleicher Name) */
function dgsToSnap(st, fotoFrom){
  const u = st.u, studs = [], had = new Set();
  const add = id => { const p = u["p|" + id]; if(p && !had.has(id)){ studs.push(dgsClone(p)); had.add(id); } };
  (Array.isArray(u.o) ? u.o : []).forEach(add);
  Object.keys(u).forEach(x => { if(x.indexOf("p|") === 0) add(x.slice(2)); });
  const pool = (fotoFrom || []).filter(x => x && typeof x === "object" && x.foto);
  studs.forEach(s => {
    if(s.foto) return;
    const m = (s.nr && pool.find(x => x.nr && String(x.nr) === String(s.nr))) || pool.find(x => x.id === s.id && x.name === s.name);
    if(m) s.foto = m.foto;
  });
  const days = {}, dayMeta = {};
  Object.keys(u).forEach(x => {
    const p = x.split("|");
    if(p[0] === "D" && p.length === 2) days[p[1]] = days[p[1]] || {};
    else if(p[0] === "d" && p.length === 3){ (days[p[1]] = days[p[1]] || {})[p[2]] = dgsClone(u[x]); }
    else if(p[0] === "m" && p.length === 2) dayMeta[p[1]] = dgsClone(u[x]);
  });
  return {settings:dgsClone(u.s || {}) || {}, students:studs, days, dayMeta};
}
/* Stand in die Seite übernehmen: ohne Meldung, ohne Ansichtswechsel; gerätebezogene Einstellungen bleiben */
function dgsApply(st, fotoFrom){
  const pool = (Array.isArray(fotoFrom) ? fotoFrom : []).concat(Array.isArray(S.students) ? S.students : []);
  const o = dgsToSnap(st, pool);
  DGS_LOCAL.forEach(k => { if(k !== "isSample" && k !== "variant" && S.settings && S.settings[k] !== undefined) o.settings[k] = dgsClone(S.settings[k]); });
  DGS.applying = true;
  try{ dgLoadObj(o); } finally { DGS.applying = false; }
  try{ if(typeof curSlot === "string" && !slots().some(x => x.id === curSlot)) curSlot = slots()[0].id; }catch(e){}
}
/* Änderungen der Seite seit dem letzten Abgleich in den Stand schreiben. true: der Stand enthält alles aus der Seite. */
function dgsCommit(){
  if(!DGS.ready || DGS.hold || DGS.applying || !DGS.key || !DGS.base) return !DGS.key;
  if(dgsKeyOf() !== DGS.key) return false;
  const cur = dgsCanon(), base = DGS.base, now = Date.now();
  const ch = [];
  new Set(Object.keys(base).concat(Object.keys(cur))).forEach(x => { if(dgsStable(base[x]) !== dgsStable(cur[x])) ch.push(x); });
  if(!ch.length) return !DGS.err;
  let st = dgsRead(DGS.key);
  const seen = dgsSeenGet(), inSync = !!(st && seen && seen.k === DGS.key && seen.rev === st.rev);
  if(!st) st = {v:1, k:DGS.key, rev:"", u:dgsClone(base), t:{}};
  let neu = false;
  ch.forEach(x => {
    if(dgsStable(st.u[x]) === dgsStable(cur[x])) return;           // steht schon so im Stand (z. B. von der anderen Ansicht)
    if(x in cur) st.u[x] = dgsClone(cur[x]); else delete st.u[x];
    st.t[x] = now; neu = true;
  });
  DGS.base = cur;
  if(!neu) return !DGS.err;
  st.rev = dgsRev();
  if(!dgsWrite(st)){ DGS.err = true; dgsSeenSet(null); return false; }  // nicht gesichert: beim nächsten Öffnen vereinigen statt überschreiben
  DGS.err = false;
  if(inSync) dgsSeenSet(DGS.key, st.rev);                            // sonst hat die andere Ansicht Neues: kommt beim nächsten Abgleich
  return true;
}
/* Beim Start, nach dem Laden eines Pakets und beim Zurückkehren: Seite und Stand abgleichen. true: Seite wurde ersetzt. */
function dgsInit(){
  if(DGS.hold) return false;
  const k = dgsKeyOf();
  if(!k){ DGS.key = null; DGS.base = null; DGS.ready = true; dgsSeenSet(null); return false; }
  if(DGS.ready && DGS.key === k && DGS.base){                       // gleiches Paket: zuerst eigene Änderungen, dann Neues holen
    dgsCommit();
    const st = dgsRead(k), seen = dgsSeenGet();
    if(!st || (seen && seen.k === k && seen.rev === st.rev)) return false;
    dgsApply(st); DGS.base = dgsCanon(); dgsSeenSet(k, st.rev);
    return true;
  }
  const cur = dgsCanon(), seen = dgsSeenGet();
  let st = dgsRead(k), applied = false, ok = true;
  if(!st){ st = {v:1, k, rev:dgsRev(), u:cur, t:{}}; ok = dgsWrite(st); }
  else if(seen && seen.k === k && seen.rev === st.rev){ /* Seite und Stand sind gleich */ }
  else if(seen && seen.k === k){ dgsApply(st); applied = true; }    // die andere Ansicht hat weitergearbeitet
  else{
    /* Paket neu in dieser Ansicht (oder Daten von vor dem 20.11.2026): vereinigen, der Stand gewinnt bei Neuerem */
    const m = dgsMerge(st, {u:cur, t:{}});
    if(!dgsSame(m, st)){ m.rev = dgsRev(); ok = dgsWrite(m); st = m; }
    dgsApply(st); applied = true;
  }
  DGS.key = k; DGS.base = dgsCanon(); DGS.ready = true; DGS.err = !ok;
  dgsSeenSet(ok ? k : null, st.rev);
  return applied;
}
/* Vor dem Wechsel der Ansicht: alles in den Stand schreiben. Gibt den Schlüssel zurück, wenn der Stand vollständig ist. */
function dgsFlush(){
  try{ if(!DGS.ready) dgsInit(); return (dgsCommit() && DGS.key && dgsHas(DGS.key)) ? DGS.key : ""; }catch(e){ return ""; }
}
/* Liegt alles aus dieser Seite sicher in ihrem Stand? Dann verliert ein anderes Paket oder eine andere Ansicht nichts. */
function dgsSafe(){
  try{ if(!DGS.ready) dgsInit(); return !!(DGS.key && dgsCommit() && dgsHas(DGS.key) && !DGS.err); }catch(e){ return false; }
}
/* Wechsel der Ansicht mit vollständigem Stand: diesen übernehmen statt der einmaligen Kopie */
function dgsAdopt(k, fotoFrom){
  const st = dgsRead(k); if(!st) return false;
  dgsSafe();                                                         // eigenen Stand (anderes Paket) zuerst sichern
  dgsApply(st, fotoFrom);
  DGS.key = dgsKeyOf(); DGS.base = dgsCanon(); DGS.ready = true;
  dgsSeenSet(DGS.key === k ? k : null, st.rev);
  if(DGS.key !== k){ DGS.ready = false; dgsInit(); }
  return true;
}
/* Aufruf aus persist(): jede Änderung sofort in den Stand */
function dgsChanged(){
  if(!DGS || !DGS.ready || DGS.hold || DGS.applying) return;
  try{
    if(dgsKeyOf() !== DGS.key){ DGS.ready = false; dgsInit(); return; }  // z. B. Sicherung eines anderen Pakets eingelesen
    if(DGS.key) dgsCommit();
  }catch(e){}
}
/* Offenes Erfassungsblatt ordentlich schliessen (speichert den Freitext), bevor ein neuer Stand übernommen wird */
function dgsCloseSheet(){
  const host = document.getElementById("sheetHost"); if(!host || !host.children.length) return;
  const x = host.querySelector(".scrim") || host.querySelector(".sheet-h .hbtn") || host.querySelector(".sheet-f .btn.pri");
  try{ if(x){ x.click(); } }catch(e){}
  if(host.children.length){ try{ const a = document.activeElement; if(a && a.blur) a.blur(); }catch(e){}
    persist(); host.innerHTML = ""; document.body.style.overflow = ""; }
}
/* Zurück in diesen Tab, «Zurück» im Browser, anderer Tab hat geschrieben: neusten Stand holen */
function dgsResume(){
  if(document.visibilityState === "hidden" || !DGS.ready || DGS.hold || !DGS.key) return;
  try{
    const st = dgsRead(DGS.key), seen = dgsSeenGet();
    if(!st || (seen && seen.k === DGS.key && seen.rev === st.rev)){ dgsCommit(); return; }
    dgsCloseSheet();
    if(dgsInit()) render();
  }catch(e){}
}
document.addEventListener("visibilitychange", dgsResume);
window.addEventListener("pageshow", dgsResume);
window.addEventListener("focus", dgsResume);
window.addEventListener("storage", e => { if(e && e.key && DGS.key && e.key === DGS.key) dgsResume(); });
