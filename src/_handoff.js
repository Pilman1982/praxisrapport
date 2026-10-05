
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
  if(id && S.settings.paketId === id && S.students.length) return; // dieses Paket ist schon da
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
