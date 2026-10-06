
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
  if(h.mode === "switch"){                                          // Wechsel Tablet <-> Laptop: Stand 1:1 übernehmen
    const p = JSON.parse(JSON.stringify(h.paket));
    Promise.resolve(load(p)).then(() => { view = "day"; render(); toast(h.titel || "✓"); });
    return;
  }
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
  Promise.resolve(load(p)).then(() => { n2GoToday(); view = "day"; render(); if(h.titel) toast("✓ " + h.titel); });
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
  /* neu im Plan: Person ergänzen (niemand wird entfernt, damit keine Erfassung verloren geht) */
  list.forEach(n => {
    if(!n || typeof n.name !== "string") return;
    const da = S.students.some(s => (s.nr && n.nr && String(s.nr) === String(n.nr)) || (!n.nr && s.id === n.id));
    if(da) return;
    const x = JSON.parse(JSON.stringify(n));
    if(!x.id || S.students.some(s => s.id === x.id)){ let i = S.students.length + 1; while(S.students.some(s => s.id === "s" + i)) i++; x.id = "s" + i; }
    S.students.push(x); ch = true;
  });
  if(ch && typeof normalizeStudents === "function") normalizeStudents();
  else if(ch && typeof saubereStudierende === "function") S.students = saubereStudierende(S.students);
  return ch;
}
/* Ansicht wechseln: gleiche Variante als Tablet- bzw. Laptop-Fassung öffnen, mit dem aktuellen Stand */
function n2SwitchTarget(){
  let me = ""; try{ me = decodeURIComponent((location.pathname || "").split("/").pop() || ""); }catch(e){}
  if(/_Mobil/.test(me)) return me.replace("_Mobil", "");
  return me.replace(/^(Kuechenrapport|Servicerapport)/, "$1_Mobil");
}
function n2SwitchView(){
  const target = n2SwitchTarget(); if(!target) return;
  const toLaptop = !/_Mobil/.test(target);
  const lg = (S.settings.uiLang || "de");
  const msg = {de:toLaptop ? "Laptop-Ansicht" : "Tablet-Ansicht", en:toLaptop ? "Laptop view" : "Tablet view", th:toLaptop ? "มุมมองแล็ปท็อป" : "มุมมองแท็บเล็ต"}[lg] || "";
  try{
    localStorage.setItem("praxisrapport.handoff", JSON.stringify({target, id:S.settings.paketId || "", titel:"✓ " + msg, at:Date.now(), mode:"switch", paket:snapshot()}));
  }catch(e){ try{ toast("Speicher voll"); }catch(_){} return; }
  location.href = target;
}
{ const sw = document.getElementById("btnSwitch"); if(sw) sw.addEventListener("click", n2SwitchView); }
