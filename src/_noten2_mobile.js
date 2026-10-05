
/* ====================================================================================
   Noten 2.0 · gemeinsamer Zusatz fuer Kuechen- und Servicerapport Mobil (05.10.2026)
   - Noten sichtbar fuer Dozierende: Tagesnote, Praxis-Durchschnitt, Exam, Schlussnote
   - Wirkung jedes Bausteins auf die Note (z. B. -0.50, K.-o. = 1.0)
   - Rechnung identisch zur Laptop-Fassung (Basisnote, Abweichung, Kappung, Doppelgewicht)
   ==================================================================================== */
function dmy(d){ return String(d).slice(8,10) + "." + String(d).slice(5,7) + "."; }
const N2_DOUBLE = CRITS.some(c => c.k === "gas") ? "gas" : "hyg";
const N2_LATE = CHIP["tea-lt"] ? "tea-lt" : "tea-n1";
const N2T = {
  de:{grades:"Noten", today:"Tag", praxis:"Ø Praxis", exam:"Exam", final:"Schlussnote", counted:"Tage gewertet",
      none:"–", hint:"Gleiche Rechnung wie am Laptop: Basisnote, Abweichungen pro Kriterium, Kappung, doppelte Gewichtung. Exam Day separat, Schlussnote 2/3 Praxis + 1/3 Exam.",
      crit:"Kriterien Ø", abs:"Absenzen"},
  en:{grades:"Grades", today:"Day", praxis:"Ø Practice", exam:"Exam", final:"Final grade", counted:"days counted",
      none:"–", hint:"Same calculation as on the laptop: baseline, deviations per criterion, capping, double weight. Exam Day separate, final grade 2/3 practice + 1/3 exam.",
      crit:"Criteria Ø", abs:"Absences"},
  th:{grades:"คะแนน", today:"วันนี้", praxis:"เฉลี่ยภาคปฏิบัติ", exam:"สอบ", final:"คะแนนรวม", counted:"วันที่นับ",
      none:"–", hint:"คำนวณเหมือนบนแล็ปท็อป: คะแนนพื้นฐาน ส่วนต่างต่อเกณฑ์ การจำกัดค่า น้ำหนักสองเท่า วันสอบแยก คะแนนรวม 2/3 ภาคปฏิบัติ + 1/3 สอบ",
      crit:"เฉลี่ยตามเกณฑ์", abs:"ขาด/ลา"}
};
const n2t = k => (N2T[L] && N2T[L][k]) || N2T.de[k] || k;
function n2Base(){ const b = parseFloat(S.settings.base); return isFinite(b) ? b : 5; }
function n2Obs(r){ return (r && Array.isArray(r.obs)) ? r.obs : []; }
/* Kriteriennoten eines Tages, wie critGradesForDay am Laptop */
function n2Crit(slotId, sid){
  const r = (S.days[slotId] || {})[sid]; if(!r) return null;
  const sl = slots().find(x => x.id === slotId); const isExam = !!(sl && sl.exam);
  const att = ["present","late","excused","unexcused","tm"].indexOf(r.att) >= 0 ? r.att : "present";
  const g = {};
  if(att === "tm"){ CRITS.forEach(c => g[c.k] = 5); return g; }
  if(att === "excused" && !isExam) return null;
  if(att === "unexcused" || (isExam && att === "excused")){ CRITS.forEach(c => g[c.k] = 1); return g; }
  const obs = n2Obs(r).map(i => CHIP[i]).filter(Boolean);
  if(att === "late" && !obs.some(o => o.i === N2_LATE) && CHIP[N2_LATE]) obs.push(CHIP[N2_LATE]);
  const nt = r.note;
  CRITS.forEach(c => {
    const mine = obs.filter(o => o.c === c.k);
    if(mine.some(o => o.ko)){ g[c.k] = 1; return; }
    let d = 0; mine.forEach(o => { d += o.d * o.w; });
    if(nt && nt.crit === c.k && nt.dir && nt.w) d += nt.dir * nt.w;
    d = Math.max(CAP_NEG, Math.min(CAP_POS, d));
    g[c.k] = Math.max(1, Math.min(6, n2Base() + d));
  });
  return g;
}
function n2Day(slotId, sid){
  const g = n2Crit(slotId, sid); if(!g) return null;
  let sum = 0, w = 0;
  CRITS.forEach(c => { const ww = (c.k === N2_DOUBLE && S.settings[N2_DOUBLE + "2"] !== false) ? 2 : 1; sum += g[c.k] * ww; w += ww; });
  return sum / w;
}
function n2Praxis(sid){
  const v = slots().filter(s => !s.exam).map(s => n2Day(s.id, sid)).filter(x => x != null);
  return v.length ? {avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length} : {avg: null, n: 0};
}
function n2Exam(sid){ const ex = slots().find(s => s.exam); return ex ? n2Day(ex.id, sid) : null; }
function n2Final(sid){ const p = n2Praxis(sid).avg, e = n2Exam(sid); return (p != null && e != null) ? (2 * p + e) / 3 : null; }
const n2Fmt = v => v == null ? "–" : v.toFixed(2);
const n2Cls = v => v == null ? "g-na" : (v >= 5 ? "g-ok" : (v >= 4 ? "g-mid" : "g-bad"));
function n2Effect(c){ return c.ko ? "→ 1.0" : ((c.d > 0 ? "+" : "−") + c.w.toFixed(2)); }
function n2Pill(v, extra){ return el("span",{class:"gpill " + n2Cls(v) + (extra ? " " + extra : ""), text: n2Fmt(v)}); }
/* Kopf des Erfassungsblatts: Tagesnote und Praxisdurchschnitt, laufend aktualisiert */
function n2ShowHead(sid){
  const h = document.getElementById("n2grade"); if(!h) return;
  const d = n2Day(curSlot, sid), p = n2Praxis(sid);
  h.className = "gpill big " + n2Cls(d);
  h.textContent = n2t("today") + " " + n2Fmt(d) + "  ·  Ø " + n2Fmt(p.avg);
}
/* Notenuebersicht (Knopf Ø oben) */
function n2RenderGrades(){
  const root = document.getElementById("view"); root.innerHTML = "";
  const hasEx = slots().some(s => s.exam);
  root.appendChild(el("h2",{class:"sec",text:n2t("grades")}));
  const card = el("div",{class:"card"});
  const ul = el("ul",{class:"slist"});
  S.students.forEach(s => {
    const p = n2Praxis(s.id), e = hasEx ? n2Exam(s.id) : null, f = hasEx ? n2Final(s.id) : null;
    let abs = 0; slots().forEach(x => { const r = (S.days[x.id] || {})[s.id]; if(r && (r.att === "excused" || r.att === "unexcused")) abs++; });
    const li = el("li");
    const row = el("div",{class:"srow grow",style:"cursor:default"});
    const av = (typeof avatar === "function") ? avatar(s, 34) : null; if(av) row.appendChild(av);
    row.appendChild(el("span",{class:"nm"},[document.createTextNode((s.name || "") + ((typeof nickTag === "function") ? nickTag(s) : "")),
      el("div",{class:"sub",text:p.n + " " + n2t("counted") + (abs ? " · " + n2t("abs") + " " + abs : "")})]));
    const box = el("span",{class:"gbox"});
    box.appendChild(el("span",{class:"gl",text:n2t("praxis")})); box.appendChild(n2Pill(p.avg));
    if(hasEx){ box.appendChild(el("span",{class:"gl",text:n2t("exam")})); box.appendChild(n2Pill(e));
               box.appendChild(el("span",{class:"gl",text:n2t("final")})); box.appendChild(n2Pill(f, f != null ? "strong" : "")); }
    row.appendChild(box);
    li.appendChild(row); ul.appendChild(li);
  });
  card.appendChild(ul); root.appendChild(card);
  root.appendChild(el("p",{class:"muted",style:"margin:14px 2px 0",text:n2t("hint")}));
}

/* ---- Noten 2.0: Übergabe von der persönlichen Startseite (mein.html) ----
   Die Startseite legt das passende Paket für genau diese Datei in den Browserspeicher
   (gleiche Adresse, die Daten verlassen das Gerät nie) und öffnet dann diese Datei.
   Hier wird es geladen. Bereits erfasste Tage eines anderen Pakets werden nur nach
   Rückfrage ersetzt. */
function n2Handoff(load){
  let h = null;
  try{ h = JSON.parse(localStorage.getItem("praxisrapport.handoff") || "null"); }catch(e){ h = null; }
  if(!h || !h.target || !h.paket || !h.paket.settings) return;
  let me = ""; try{ me = decodeURIComponent((location.pathname || "").split("/").pop() || ""); }catch(e){}
  if(String(h.target).split("/").pop() !== me) return;
  try{ localStorage.removeItem("praxisrapport.handoff"); }catch(e){}
  if(Date.now() - (h.at || 0) > 10 * 60 * 1000) return;          // nur frische Übergaben
  const id = String(h.id || "");
  if(id && S.settings.paketId === id && S.students.length){        // dieses Paket ist schon da:
    if(n2Refresh(h.paket.students)){ persist(); render(); }          // nur Fotos, Nicknames usw. nachführen
    return;
  }
  const hatDaten = !S.settings.isSample && Object.keys(S.days || {}).some(k => S.days[k] && Object.keys(S.days[k]).length);
  if(hatDaten && S.settings.paketId !== id){
    const lg = (S.settings.uiLang || "de");
    const msg = {
      de: "Neues Paket laden: " + (h.titel || id) + "?\n\nDie bisher in dieser Datei erfassten Tage werden ersetzt. Bitte vorher «Tag teilen», falls noch nicht geschehen.",
      en: "Load new package: " + (h.titel || id) + "?\n\nThe days recorded so far in this file will be replaced. Please use «Share day» first if you have not done so.",
      th: "โหลดชุดข้อมูลใหม่: " + (h.titel || id) + "?\n\nวันที่บันทึกไว้ในไฟล์นี้จะถูกแทนที่ กรุณากด «แชร์ข้อมูลของวันนี้» ก่อน หากยังไม่ได้ทำ"
    }[lg] || "";
    try{ if(!window.confirm(msg)) return; }catch(e){ return; }
  }
  const p = JSON.parse(JSON.stringify(h.paket));
  p.settings.paketId = id;
  Promise.resolve(load(p)).then(() => { n2GoToday(); view = "day"; render(); });
}
/* Heute ein Einsatztag des Pakets? Dann direkt diesen Tag zeigen. */
function n2GoToday(){
  const d = new Date(), td = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const s = slots().find(x => x.date === td); if(s) curSlot = s.id;
  return !!s;
}
/* Gleiches Paket, neuer Stand (z. B. Fotos nachgeliefert): Personendaten ergänzen, erfasste Tage bleiben. */
function n2Refresh(list){
  if(!Array.isArray(list)) return false;
  let ch = false;
  S.students.forEach(s => {
    const n = list.find(x => x && ((s.nr && x.nr && String(x.nr) === String(s.nr)) || (!s.nr && x.id === s.id)));
    if(!n) return;
    ["foto","nick","klasse","gruppe","email","ortPlan","tmTage"].forEach(k => {
      if(n[k] !== undefined && JSON.stringify(n[k]) !== JSON.stringify(s[k])){ s[k] = n[k]; ch = true; }
    });
  });
  return ch;
}
setTimeout(() => n2Handoff(o => onLoadBackup({target:{files:[new File([JSON.stringify(o)], "paket.json")], value:""}})), 30);
