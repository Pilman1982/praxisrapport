
/* ---- Noten 2.0: Übergabe von der persönlichen Startseite (mein.html) ----
   Die Startseite legt das passende Paket für genau diese Datei in den Browserspeicher
   (gleiche Adresse, die Daten verlassen das Gerät nie) und öffnet dann diese Datei.
   Hier wird es geladen. Bereits erfasste Tage eines anderen Pakets werden nur nach
   Rückfrage ersetzt. */
/* Daily Grades (08.10.2026): Schicht-Kürzel und Weg zurück zur Startseite, gemeinsam für alle Fassungen */
/* Schicht-Kürzel aus dem Duty Plan (Legende der Einsatzpläne HS26) */
const SCHICHT_INFO = {
  S:"Service", SA:"Service Asia (Umami)", SM:"Service «The Market», MeP & Lunch", ST:"Service Tournant", Sv:"Supervisor (Host)",
  BS:"Bar & Service", CS1:"Chef de Service", CS2:"Assistant Chef de Service", CS2W:"Assistant Chef de Service, Wein",
  SW1:"Sommelier", SW2:"Wine Waiter / Assistent", OC:"Office & Daily MeP, Stewarding (zählt wie Team Market)",
  OST:"Office & Daily MeP in Service-Uniform", OTB:"Office, Daily MeP & Buffet Market", OS:"Office & Daily MeP in Service-Uniform",
  KC:"Chef de Cuisine", KS:"Sous-Chef", Sc:"Saucier", E:"Entremetier", G:"Garde-manger", T:"Tournant", TM:"Tournant «The Market»",
  K:"Casserolier", TK:"Tournant / Casserolier", K1:"Entremetier", K2:"Saucier", K3:"Garde-manger",
  A1:"Entremetier Asia", A2:"Saucier Asia", A3:"Garde-manger Asia", TA:"Tournant Asia", P:"Pâtisserie", C:"Küche Campigiana"
};
function planSchicht(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  if(!s || !sl || !Array.isArray(s.schichtPlan)) return "";
  return String(s.schichtPlan[sl.idx - 1] || "").trim();
}
function schichtPill(s, slotId){
  const c = planSchicht(s, slotId); if(!c) return null;
  const info = SCHICHT_INFO[c] || SCHICHT_INFO[c.toUpperCase()] || "";
  return el("span",{class:"spill" + (c.toUpperCase() === "OC" ? " oc" : ""), title: "Schicht · Shift " + c + (info ? ": " + info : ""), text:c});
}

/* Zurück zur persönlichen Startseite: liegt eine Ebene höher (…/mein.html) */
function n2HomeHref(){
  return /^https?:/.test(location.protocol) ? "../mein.html" : "https://pilman1982.github.io/praxisrapport/mein.html";
}
{ const h = document.getElementById("btnHome"); if(h){ h.setAttribute("href", n2HomeHref());  } }

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
    if(n2Refresh(h.paket.students)) persist();                       // nur Fotos, Nicknames usw. nachführen
    n2GoToday(); view = "day"; render();                              // und den heutigen Einsatztag zeigen
    return;
  }
  const hatDaten = !S.settings.isSample && Object.keys(S.days || {}).some(k => S.days[k] && Object.keys(S.days[k]).length);
  if(hatDaten && S.settings.paketId !== id){
    const lg = (S.settings.uiLang || "de");
    const msg = {
      de: "Neues Paket laden: " + (h.titel || id) + "?\n\nDie bisher in dieser Datei erfassten Tage werden ersetzt. Bitte vorher «Tag senden» oder «Sichern», falls noch nicht geschehen.",
      en: "Load new package: " + (h.titel || id) + "?\n\nThe days recorded so far in this file will be replaced. Please use «Send the day» or «Back up» first if you have not done so.",
      th: "โหลดชุดข้อมูลใหม่: " + (h.titel || id) + "?\n\nวันที่บันทึกไว้ในไฟล์นี้จะถูกแทนที่ กรุณากด «ส่งข้อมูลของวันนี้» ก่อน หากยังไม่ได้ทำ"
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
    ["foto","nick","klasse","gruppe","mail","email","ortPlan","tmTage","schichtPlan"].forEach(k => {
      if(n[k] === undefined || JSON.stringify(n[k]) === JSON.stringify(s[k])) return;
      /* Nickname: ein leeres Feld im Paket löscht keinen Nickname, der auf dem Gerät eingetragen wurde */
      if(k === "nick" && !String(n[k] || "").trim()) return;
      s[k] = n[k]; ch = true;
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
