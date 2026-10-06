/* ==================================================================
   Küchenrapport Mobil  ·  Erfassung in der Küche auf iPhone und iPad
   Erzeugt eine JSON, die die Laptop-Datei mit «Rapporte zusammenführen»
   einliest. Gleiche Baustein-IDs, gleiche Slot-IDs, gleiche Variante.
   ================================================================== */

const ABS_MAIL = "michael.pilman@ehl.ch";

/* ===== Variante dieser Datei, bewusst nicht einstellbar =====
   Wird beim Erzeugen der Datei gesetzt, wie bei der Laptop-Datei.   */
const MVARIANT = "10T";

/* ---------- Oberflächentexte ---------- */
const T = {
de:{
  appTitle:"Rapport", setup:"Setup", done:"Fertig", back:"Zurück", cancel:"Abbrechen",
  students:"Studierende", noStudents:"Noch keine Studierenden erfasst.",
  toSetup:"Zum Setup", openDay:"Tag erfassen",
  dayClosed:"Dieser Tag ist noch nicht erfasst.",
  present:"Anwesend", late:"Verspätet", excused:"Entschuldigt", unexcused:"Unentschuldigt",
  teamMarket:"Team Market", attendance:"Anwesenheit",
  obs:"Beobachtungen", noObs:"nichts erfasst", showAll:"Alle Bausteine zeigen",
  showLess:"Nur die häufigsten", note:"Freitext", notePh:"Was kein Baustein abdeckt …",
  noteHint:"Der Freitext wirkt nicht auf die Note. Details erfassen Sie am Laptop.",
  quick:"Häufig", share:"Tag senden", absMail:"Absenzen",
  varFixed:"Fest eingestellt, wie in der Laptop-Datei.",
  loadPartial:"Andere Variante: nur Gruppe, Team, Outlet und die Studierenden übernommen, keine Einsatztage.",
  absNone:"Keine Absenzen und keine Verspätungen an diesem Tag.",
  absSubj:"Absenzen Küchenpraxis", absSent:"E-Mail vorbereitet",
  shared:"Gesendet", backup:"Sichern", backupPrefix:"Sicherung", backupTip:"Im Menü «In Dateien sichern» wählen", dayMailSubj:"Tagesrapport", dayMailTo:"An:", saved:"Gespeichert",
  group:"Gruppe", team:"Team", outlet:"Outlet / Abteilung", teacher:"Dozent/in",
  variant:"Variante", v10:"9 Einsatztage + Exam Day", v4:"4 Einsatztage + Exam Day",
  v5:"5 Einsatztage ohne Exam",
  weekdaysLbl:"Einsatztage pro Woche", startDay:"Turnus startet am",
  studentList:"Studierende, eine Person pro Zeile",
  studentHint:"Nachname; Vorname; Nickname; E-Mail; Sprache; Klasse; Gruppe. Nur der Nachname ist Pflicht.",
  klasseField:"Klasse",gruppeField:"Gruppe / Team",
  absCols:"Zeilenaufbau: Nachname, Vorname «Nickname» · Klasse · Gruppe — Grund",
  apply:"Übernehmen", loadBackup:"Sicherung vom Laptop laden",
  loadHint:"Legen Sie die JSON aus dem Laptop-Rapport in «Dateien» oder iCloud ab und laden Sie sie hier. Damit sind Gruppe, Team, Outlet, Dozent, Turnus und alle Studierenden mit E-Mail-Adresse sofort da.",
  loadBtn:"⤒ Sicherung laden", loadArm:"Ersetzt alles, nochmals tippen",
  loadDone:"Sicherung geladen", loadBad:"Datei nicht lesbar oder keine Küchenrapport-Sicherung", storeWarn:"Achtung: Dieses Gerät speichert gerade nichts (privater Modus oder Speicher voll). Bitte jetzt «⤓ Sichern» tippen und den Tag sofort senden.", loadSem:"Das ist Ihr Semesterpaket. Bitte auf Ihrer persönlichen Startseite laden (Symbol auf dem Home-Bildschirm), nicht hier.",
  saveBackup:"Sicherung sichern", saveBtn:"⤓ Als JSON sichern",
  shareHint:"«Tag senden» öffnet das Teilen-Menü: «Mail» wählen und an michael.pilman@ehl.ch senden. Die Absenzen des Tages stehen schon im Mailtext. «⤓ Sichern» legt eine eigene Sicherung in «Dateien» ab.",
  examDay:"Exam Day", week:"W", light:"leicht", medium:"mittel", heavy:"schwer", ko:"K.-o.",
  langTitle:"Sprache", setupDone:"Setup gespeichert",
  homeHint:"Tipp: über das Teilen-Symbol in Safari «Zum Home-Bildschirm» wählen, dann startet der Rapport wie eine App.",
  recorded:"erfasst", ofDay:"von", examAbs:"Am Exam Day ergibt jede Abwesenheit die Note 1.00."
},
en:{
  appTitle:"Report", setup:"Setup", done:"Done", back:"Back", cancel:"Cancel",
  students:"Students", noStudents:"No students yet.",
  toSetup:"Go to setup", openDay:"Open this day",
  dayClosed:"This day has not been opened yet.",
  present:"Present", late:"Late", excused:"Excused", unexcused:"Unexcused",
  teamMarket:"Team Market", attendance:"Attendance",
  obs:"Observations", noObs:"nothing recorded", showAll:"Show all building blocks",
  showLess:"Only the most used",
  note:"Free text", notePh:"Anything no building block covers …",
  noteHint:"Free text does not change the grade. Record the details on the laptop.",
  quick:"Frequent", share:"Send the day", absMail:"Absences",
  varFixed:"Fixed, exactly as in the laptop file.",
  loadPartial:"Different variant: only group, team, outlet and the students were taken over, no shift days.",
  absNone:"No absences and no lateness on this day.",
  absSubj:"Absences kitchen practice", absSent:"E-mail prepared",
  shared:"Sent", backup:"Back up", backupPrefix:"Backup", backupTip:"Choose «Save to Files» in the menu", dayMailSubj:"Day report", dayMailTo:"To:", saved:"Saved",
  group:"Group", team:"Team", outlet:"Outlet / department", teacher:"Lecturer",
  variant:"Variant", v10:"9 shift days + Exam Day", v4:"4 shift days + Exam Day",
  v5:"5 shift days without exam",
  weekdaysLbl:"Shift days per week", startDay:"Rotation starts on",
  studentList:"Students, one person per line",
  studentHint:"Last name; First name; Nickname; E-mail; Language; Class; Group. Only the last name is required.",
  klasseField:"Class",gruppeField:"Group / Team",
  absCols:"Line format: Last name, First name “Nickname” · Class · Group — Reason",
  apply:"Apply", loadBackup:"Load a backup from the laptop",
  loadHint:"Put the JSON from the laptop report into Files or iCloud and load it here. Group, team, outlet, lecturer, rotation and all students with their e-mail addresses are then in place.",
  loadBtn:"⤒ Load backup", loadArm:"Replaces everything, tap again",
  loadDone:"Backup loaded", loadBad:"File unreadable or not a kitchen report backup", storeWarn:"Warning: this device is not saving anything right now (private mode or storage full). Tap «⤓ Back up» now and send the day straight away.", loadSem:"This is your semester package. Please load it on your personal start page (icon on the Home Screen), not here.",
  saveBackup:"Save a backup", saveBtn:"⤓ Save as JSON",
  shareHint:"“Send the day” opens the share sheet: choose «Mail» and send it to michael.pilman@ehl.ch. The day's absences are already in the e-mail text. «⤓ Back up» saves your own backup in «Files».",
  examDay:"Exam Day", week:"W", light:"light", medium:"medium", heavy:"heavy", ko:"K.O.",
  langTitle:"Language", setupDone:"Setup saved",
  homeHint:"Tip: use the share icon in Safari and choose “Add to Home Screen”, then the report starts like an app.",
  recorded:"recorded", ofDay:"of", examAbs:"On the Exam Day any absence gives the grade 1.00."
},
th:{
  appTitle:"รายงาน", setup:"ตั้งค่า", done:"เสร็จ", back:"กลับ", cancel:"ยกเลิก",
  students:"นักศึกษา", noStudents:"ยังไม่มีรายชื่อนักศึกษา",
  toSetup:"ไปที่การตั้งค่า", openDay:"เปิดบันทึกวันนี้",
  dayClosed:"ยังไม่ได้เปิดบันทึกของวันนี้",
  present:"มาเรียน", late:"มาสาย", excused:"ลา (แจ้งแล้ว)", unexcused:"ขาด (ไม่แจ้ง)",
  teamMarket:"Team Market", attendance:"การเข้าเรียน",
  obs:"ข้อสังเกต", noObs:"ยังไม่มีข้อมูล", showAll:"แสดงข้อความทั้งหมด",
  showLess:"แสดงเฉพาะที่ใช้บ่อย",
  note:"ข้อความอิสระ", notePh:"สิ่งที่ไม่มีข้อความสำเร็จรูปครอบคลุม …",
  noteHint:"ข้อความอิสระไม่มีผลต่อคะแนน ให้บันทึกรายละเอียดที่แล็ปท็อป",
  quick:"ใช้บ่อย", share:"ส่งข้อมูลของวันนี้", absMail:"การขาด",
  varFixed:"กำหนดตายตัว เช่นเดียวกับไฟล์บนแล็ปท็อป",
  loadPartial:"คนละรูปแบบ: รับมาเฉพาะกลุ่ม ทีม เอาต์เล็ต และรายชื่อนักศึกษา ไม่รวมวันฝึก",
  absNone:"วันนี้ไม่มีผู้ขาดและไม่มีผู้มาสาย",
  absSubj:"การขาดเรียน การปฏิบัติงานครัว", absSent:"เตรียมอีเมลแล้ว",
  shared:"ส่งแล้ว", backup:"สำรองข้อมูล", backupPrefix:"Backup", backupTip:"เลือก «บันทึกไปยังแอปไฟล์» ในเมนู", dayMailSubj:"Tagesrapport", dayMailTo:"ถึง:", saved:"บันทึกแล้ว",
  group:"กลุ่ม", team:"ทีม", outlet:"เอาต์เล็ต / แผนก", teacher:"ผู้สอน",
  variant:"รูปแบบ", v10:"9 วันฝึก + วันสอบ", v4:"4 วันฝึก + วันสอบ",
  v5:"5 วันฝึก ไม่มีวันสอบ",
  weekdaysLbl:"วันฝึกต่อสัปดาห์", startDay:"รอบฝึกเริ่มวัน",
  studentList:"รายชื่อนักศึกษา บรรทัดละหนึ่งคน",
  studentHint:"นามสกุล; ชื่อ; ชื่อเล่น; อีเมล; ภาษา; ชั้นเรียน; กลุ่ม จำเป็นเฉพาะนามสกุล",
  klasseField:"ชั้นเรียน",gruppeField:"กลุ่ม / ทีม",
  absCols:"รูปแบบบรรทัด: นามสกุล ชื่อ «ชื่อเล่น» · ชั้นเรียน · กลุ่ม — เหตุผล",
  apply:"ยืนยัน", loadBackup:"โหลดไฟล์สำรองจากแล็ปท็อป",
  loadHint:"นำไฟล์ JSON จากรายงานในแล็ปท็อปไปไว้ใน Files หรือ iCloud แล้วโหลดที่นี่ จะได้กลุ่ม ทีม เอาต์เล็ต ผู้สอน รอบฝึก และรายชื่อนักศึกษาพร้อมอีเมลทันที",
  loadBtn:"⤒ โหลดไฟล์สำรอง", loadArm:"จะแทนที่ทั้งหมด แตะอีกครั้ง",
  loadDone:"โหลดไฟล์สำรองแล้ว", loadBad:"อ่านไฟล์ไม่ได้ หรือไม่ใช่ไฟล์สำรองของรายงานครัว", storeWarn:"คำเตือน: อุปกรณ์นี้ไม่ได้บันทึกข้อมูลอยู่ในขณะนี้ (โหมดส่วนตัวหรือพื้นที่เต็ม) กรุณากด «⤓ สำรองข้อมูล» ทันที และส่งข้อมูลของวันนี้เลย", loadSem:"นี่คือชุดข้อมูลภาคเรียนของคุณ กรุณาโหลดในหน้าเริ่มต้นส่วนตัว (ไอคอนบนหน้าจอโฮม) ไม่ใช่ที่นี่",
  saveBackup:"บันทึกไฟล์สำรอง", saveBtn:"⤓ บันทึกเป็น JSON",
  shareHint:"«ส่งข้อมูลของวันนี้» เปิดเมนูแชร์: เลือก «Mail» แล้วส่งถึง michael.pilman@ehl.ch การขาดของวันนี้อยู่ในข้อความอีเมลแล้ว «⤓ สำรองข้อมูล» บันทึกไฟล์สำรองของคุณไว้ใน «ไฟล์»",
  examDay:"วันสอบ", week:"สัปดาห์", light:"เบา", medium:"กลาง", heavy:"หนัก", ko:"ตัดสิทธิ์",
  langTitle:"ภาษา", setupDone:"บันทึกการตั้งค่าแล้ว",
  homeHint:"เคล็ดลับ: ใน Safari กดไอคอนแชร์ แล้วเลือก «เพิ่มไปยังโฮมสกรีน» จะเปิดใช้งานเหมือนแอป",
  recorded:"บันทึกแล้ว", ofDay:"จาก", examAbs:"ในวันสอบ การไม่มาไม่ว่าด้วยเหตุใดจะได้คะแนน 1.00"
}
};
const UI_LANGS = [{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"th",name:"ไทย"}];
let L = "de";
const t  = k => (T[L] && T[L][k]) || T.de[k] || k;
const tl = (k, lg) => (T[lg] && T[lg][k]) || T.de[k] || k;

/* ---------- Häufigste Bausteine pro Kriterium ---------- */
const QUICK = {
  hyg:["hyg-n1","hyg-n5","hyg-n8","hyg-p1","hyg-p2"],
  pro:["pro-n1","pro-n3","pro-p1","pro-p2","pro-p3"],
  org:["org-n2","org-n4","org-p1","org-p2","org-p3"],
  tea:["tea-n1","tea-n2","tea-p1","tea-p2","tea-p3"],
  sel:["sel-n1","sel-n2","sel-p1","sel-p2","sel-p3"],
  mot:["mot-n1","mot-n3","mot-p1","mot-p2","mot-p5"],
  fac:["fac-n1","fac-n3","fac-p1","fac-p2","fac-p3"]
};
const CHIP = {}; CHIPS.forEach(c=>CHIP[c.i]=c);
const critName = (k, lg) => { const c = CRITS.find(x=>x.k===k); return c ? (c[lg||L]||c.de) : k; };
const chipT = (c, lg) => c.t[lg||L] || c.t.de;
const wdName = (k, lg) => { const w = WDAYS.find(x=>x.k===k); return w ? (w[lg||L]||w.de) : k; };

/* ---------- Speicher, pro Datei getrennt ---------- */
const FILENAME = (function(){
  try{ const p = decodeURIComponent(location.pathname||""); const n = p.split("/").pop();
       return n || "Kuechenrapport_Mobil.html"; }catch(e){ return "Kuechenrapport_Mobil.html"; }
})();
const FILEID = (function(){
  let h = 0; const s = FILENAME;
  for(let i=0;i<s.length;i++){ h = ((h<<5)-h) + s.charCodeAt(i); h |= 0; }
  return "." + Math.abs(h).toString(36);
})();
const KEY = "kuechenrapport.mobil.v1" + FILEID;

const DEF = {group:"", team:"", outlet:"", teacher:"", uiLang:"de",
             variant:MVARIANT, weekdays:["mo","tu","we","th"], startIdx:0, base:5, hyg2:true};
let S, storeOK = true;
try{
  const raw = localStorage.getItem(KEY);
  S = raw ? JSON.parse(raw) : null;
}catch(e){ S = null; }
if(!S || !S.settings) S = {settings:{...DEF}, students:[], days:{}, dayMeta:{}};
S.settings = {...DEF, ...S.settings};
S.students = S.students || []; S.days = S.days || {}; S.dayMeta = S.dayMeta || {};
S.settings.variant = MVARIANT;   // die Datei bestimmt die Variante, nicht der Speicher

/* ---- Startlink (Noten 2.0): Voreinstellungen aus dem Link ----
   Beispiel: ...Kuechenrapport_Mobil.html#lang=th&outlet=Umami&dozent=Q
   Alles nach dem # bleibt im Browser und wird nie an einen Server geschickt.
   Gesetzt wird nur, was im Link steht; der Rest bleibt wie auf dem Geraet gespeichert.
   Schluessel: lang (de/en/th), outlet, dozent, klasse, gruppe,
   plan (Bewertende nach Wochentag, z. B. plan=mo:Sybille,tu:Sybille,we:Laura,th:Laura) */
const STARTLINK = (function(){
  const p = {};
  try{
    String(location.hash || "").replace(/^#/, "").split("&").forEach(kv=>{
      const i = kv.indexOf("="); if(i <= 0) return;
      p[decodeURIComponent(kv.slice(0, i)).trim().toLowerCase()] =
        decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " ")).trim();
    });
  }catch(e){ return {}; }
  const st = S.settings; let changed = false;
  const put = (k, v) => { if(v != null && v !== "" && st[k] !== v){ st[k] = v; changed = true; } };
  if(p.lang && ["de","en","th"].indexOf(p.lang.toLowerCase()) >= 0) put("uiLang", p.lang.toLowerCase());
  put("outlet", p.outlet);
  put("teacher", p.dozent);
  if(p.klasse) put("group", (typeof erkenneKlasse === "function" && erkenneKlasse(p.klasse)) || p.klasse);
  if(p.gruppe) put("team",  (typeof erkenneGruppe === "function" && erkenneGruppe(p.gruppe)) || p.gruppe);
  if(p.plan){
    const plan = {};
    p.plan.split(",").forEach(x=>{
      const m = x.split(":"); const wd = (m[0] || "").trim().toLowerCase(); const nm = (m[1] || "").trim();
      if(["mo","tu","we","th","fr","sa","su"].indexOf(wd) >= 0 && nm) plan[wd] = nm;
    });
    if(Object.keys(plan).length){
      if(JSON.stringify(st.teacherPlan || {}) !== JSON.stringify(plan)){ st.teacherPlan = plan; changed = true; }
      if(!p.dozent) put("teacher", Array.from(new Set(Object.values(plan))).join(" / "));
    }
  }
  if(changed){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
  return p;
})();
/* Bewertende Person eines Einsatztags: Plan nach Wochentag, sonst die Dozentin der Datei. */
const teacherForWd = wd => (S.settings.teacherPlan && S.settings.teacherPlan[wd]) || S.settings.teacher || "";

/* Beobachtungen immer als Liste lesen, auch wenn die Datei etwas anderes enthaelt. */
const obsOf = r => (r && Array.isArray(r.obs)) ? r.obs : [];
const ATT_OK = ["present","late","excused","unexcused","tm"];
const attOf = r => (r && ATT_OK.includes(r.att)) ? r.att : "present";
/* ---- Personendaten: Nachname, Vorname, Nickname, Klasse, Gruppe ---- */
const KLASSEN = ["HFD","HFE1","HFE2"];
/* Klasse und Gruppe am Inhalt erkennen, in Kueche und Service gleich.
   Klasse: HFD, HFE1, HFE2 (auch "HFe 1"); alte Werte wie HFE bleiben gueltig.
   Gruppe: "Gruppe 1", "Team 2", auch "Grp 1" oder "Group 1".               */
function erkenneKlasse(v){
  const m = String(v || "").trim().match(/^hf\s*([a-z])\s*(\d?)$/i);
  return m ? ("HF" + m[1] + m[2]).toUpperCase() : "";
}
function erkenneGruppe(v){
  const s = String(v || "").trim();
  /* EHL-Einteilung: "Gruppe 1 Team A", auch "Gruppe 1A", "Gr1 A" */
  const e = s.match(/^(?:gruppe|grp|gr|group)\s*(\d+)\s*(?:team\s*)?([a-z])$/i);
  if(e) return "Gruppe " + e[1] + " Team " + e[2].toUpperCase();
  const m = s.match(/^(gruppe|grp|group|team)\s*(\d+)$/i);
  return m ? ((/^t/i.test(m[1]) ? "Team " : "Gruppe ") + m[2]) : "";
}

const GRUPPEN = ["Gruppe 1 Team A","Gruppe 1 Team B","Gruppe 2 Team A","Gruppe 2 Team B","Gruppe 3 Team A","Gruppe 3 Team B","Gruppe 1","Team 1","Gruppe 2","Team 2"];
const dispName = x => [x && x.last, x && x.first].filter(Boolean).join(" ") || (x && x.name) || "";
const sortName = x => [x && x.last, x && x.first].filter(Boolean).join(", ") || (x && x.name) || "";
const longName = x => sortName(x) + (x && x.nick ? " \u00ab" + x.nick + "\u00bb" : "");
const klasseOf = x => (x && x.klasse) || S.settings.group || "";
const gruppeOf = x => (x && x.gruppe) || S.settings.team  || "";
function normalizeStudents(){
  S.students = (Array.isArray(S.students) ? S.students : []).filter(x=>x && typeof x === "object");
  S.students.forEach(st=>{
    ["name","last","first","nick","mail","lang","klasse","gruppe"].forEach(k=>{
      if(typeof st[k] !== "string") st[k] = "";
    });
    if(!st.last && !st.first && st.name){
      const q = st.name.trim().split(/\s+/); st.last = q.shift() || ""; st.first = q.join(" ");
    }
    if(st.last && !st.first && /\s/.test(st.last)){
      const q = st.last.trim().split(/\s+/); st.last = q.shift(); st.first = q.join(" ");
    }
    st.name = [st.last, st.first].filter(Boolean).join(" ") || st.name;
    if(!st.id) st.id = "m" + Math.random().toString(36).slice(2,8);
  });
}
/* Nachname; Vorname; Nickname; E-Mail; Sprache; Klasse; Gruppe
   E-Mail, Sprache, Klasse und Gruppe werden am Inhalt erkannt. */
function parseStudentLine(line){
  const parts = line.split(/[;\t]/).map(x=>x.trim());
  let mail="", lang="", klasse="", gruppe="";
  const rest = [];
  parts.forEach(v=>{
    if(!mail && v.indexOf("@") >= 0){ mail = v; return; }
    if(!lang && /^(de|en|zh)$/i.test(v)){ lang = v.toLowerCase(); return; }
    if(!klasse && erkenneKlasse(v)){ klasse = erkenneKlasse(v); return; }
    if(!gruppe && erkenneGruppe(v)){ gruppe = erkenneGruppe(v); return; }
    rest.push(v);
  });
  let last = rest[0] || "", first = rest[1] || "", nick = rest[2] || "";
  if(last && !first && /\s/.test(last)){
    const q = last.split(/\s+/); last = q.shift(); first = q.join(" ");
  }
  return {last, first, nick, mail, lang, klasse, gruppe};
}
const studentLine = st => [st.last, st.first, st.nick, st.mail, st.lang, st.klasse, st.gruppe]
  .join("; ").replace(/(?:;\s*)+$/, "");
/* Typen erzwingen, damit eine fremde JSON die App nicht verbiegt. */
function normalizeSettings(){
  const num = (v,d)=>{ const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
  S.settings.base     = num(S.settings.base, 5);
  S.settings.startIdx = Math.max(0, Math.trunc(num(S.settings.startIdx, 0)));
  S.settings.hyg2     = !!S.settings.hyg2;
  if(!Array.isArray(S.settings.weekdays) || !S.settings.weekdays.length)
    S.settings.weekdays = ["mo","tu","we","th"];
  ["group","team","outlet","teacher"].forEach(k=>{
    if(typeof S.settings[k] !== "string") S.settings[k] = "";
  });
  if(!Array.isArray(S.students)) S.students = [];
}
/* Eingelesene Tagesdaten auf die erwartete Form bringen. */
function sanitizeDays(days){
  const out = {};
  Object.entries(days || {}).forEach(([k, recs])=>{
    if(!/^d\d\d$/.test(k) || !recs || typeof recs !== "object") return;
    out[k] = {};
    Object.entries(recs).forEach(([sid, r])=>{
      if(!r || typeof r !== "object") return;
      out[k][sid] = {
        att: ATT_OK.includes(r.att) ? r.att : "present",
        obs: Array.isArray(r.obs) ? r.obs.filter(x=>typeof x === "string") : [],
        note: (r.note && typeof r.note === "object" && typeof r.note.txt === "string")
          ? {txt:r.note.txt, crit:String(r.note.crit||""),
             dir:Number(r.note.dir)||0, w:Number(r.note.w)||0} : null
      };
    });
  });
  return out;
}
function pruneOrphans(){
  const ids = new Set(S.students.map(x=>x.id));
  Object.keys(S.days || {}).forEach(d=>{
    Object.keys(S.days[d] || {}).forEach(k=>{ if(!ids.has(k)) delete S.days[d][k]; });
  });
}
normalizeSettings();
normalizeStudents();
S.days = sanitizeDays(S.days);

try{ localStorage.setItem("kr.probe","1"); localStorage.removeItem("kr.probe"); }catch(e){ storeOK = false; }
function persist(){
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }
  catch(e){ if(storeOK){ storeOK = false; try{ toast(t("storeWarn")); }catch(_){} } }
}

/* ---------- Turnus ---------- */
const VDEF = {"10T":{n:10, exam:true}, "4T":{n:5, exam:true}, "5T":{n:5, exam:false}};
const vcfg = () => VDEF[MVARIANT] || VDEF["10T"];
function slots(){
  const wd = (S.settings.weekdays && S.settings.weekdays.length) ? S.settings.weekdays : ["mo","tu","we","th"];
  const n = vcfg().n, hasEx = vcfg().exam;
  const st = Math.max(0, Math.min(S.settings.startIdx||0, wd.length-1));
  const out = [];
  for(let i=0;i<n;i++){
    const j = st + i;
    out.push({id:"d"+String(i+1).padStart(2,"0"), wd:wd[j % wd.length],
              week:Math.floor(j/wd.length)+1, idx:i+1, exam: hasEx && i === n-1});
  }
  /* Noten 2.0: echte Daten aus dem Paket (S.settings.slotDates); der Wochentag folgt dann dem Datum */
  const dts = Array.isArray(S.settings.slotDates) ? S.settings.slotDates : [];
  out.forEach((s, i) => { const d = String(dts[i] || "");
    if(/^\d{4}-\d{2}-\d{2}$/.test(d)){ s.date = d; s.wd = ["su","mo","tu","we","th","fr","sa"][new Date(d + "T12:00:00").getDay()]; } });
  return out;
}
const slotById = id => slots().find(s=>s.id===id) || slots()[0];
const slotLabel = (s, lg) => s.exam ? tl("examDay", lg||L) + (s.date ? " " + dmy(s.date) : "")
                                     : (wdName(s.wd, lg) + " " + (s.date ? dmy(s.date) : "(" + s.idx + ")"));
const dayOpen = id => !!S.days[id];

let curSlot = (function(){
  const all = slots();
  /* Noten 2.0: Ist heute ein Einsatztag des Pakets, immer diesen zeigen. Sonst landen
     Beobachtungen auf einem falschen Datum (z. B. Kollegin mit eigenem Gerät ab Mittwoch). */
  { const d = new Date(), td = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const heute = all.find(s => s.date === td); if(heute) return heute.id; }
  const nx = all.find(s=>!s.exam && !S.days[s.id]);
  if(nx) return nx.id;
  const f = all.filter(s=>S.days[s.id]);
  return (f.length ? f[f.length-1] : all[0]).id;
})();
let view = S.students.length ? "day" : "set";

/* ---------- Hilfen ---------- */
function el(tag, attrs, kids){
  const n = document.createElement(tag);
  for(const k in (attrs||{})){
    const v = attrs[k];
    /* false und null: Attribut gar nicht setzen. setAttribute("selected", false) wuerde
       "selected=false" schreiben, das gilt als gesetzt; dann zeigte jedes Auswahlfeld
       den letzten Eintrag an (Fehler "Turnus startet am" immer Donnerstag). */
    if(v === undefined || v === null || v === false) continue;
    if(k === "text") n.textContent = v;
    else if(k === "html") n.innerHTML = v;
    else if(k.slice(0,2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? "" : v);
  }
  (Array.isArray(kids) ? kids : (kids ? [kids] : [])).forEach(c=>c && n.appendChild(c));
  return n;
}
let toastT;
function toast(msg){
  const b = document.getElementById("toast");
  b.textContent = msg; b.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(()=>b.classList.remove("on"), 2600);
}
const subLine = () => [S.settings.group, S.settings.team, S.settings.outlet]
  .filter(Boolean).join(" · ") || "Küchenpraxis";
function clean(x){
  return String(x||"").trim().replace(/[^A-Za-z0-9ÄÖÜäöüß]+/g,"-").replace(/^-+|-+$/g,"");
}
function fileStem(){
  const d = new Date();
  const iso = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const p = [clean(S.settings.teacher), clean(S.settings.group), clean(S.settings.outlet),
             MVARIANT, iso].filter(Boolean);
  return p.length > 2 ? p.join("_") : "Kuechenrapport_" + MVARIANT + "_" + iso;
}
function dayRec(id, sid){
  S.days[id] = S.days[id] || {};
  S.days[id][sid] = S.days[id][sid] || {att:"present", obs:[], note:null};
  return S.days[id][sid];
}

/* Foto und Nickname fuer die Erfassung (Noten 2.0). foto ist ein kleines JPEG aus dem Cockpit. */
function avatar(s, size){
  const px = (size || 32) + "px";
  if(s && typeof s.foto === "string" && s.foto.indexOf("data:image/") === 0)
    return el("img",{class:"ava",src:s.foto,alt:"",style:"width:"+px+";height:"+px});
  /* ohne Foto: Initialen, damit die Liste ruhig bleibt */
  const w = String((s && s.name) || "?").trim().split(/\s+/);
  const ini = ((w[0] || "?")[0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
  return el("span",{class:"ava ini",text:ini,style:"width:"+px+";height:"+px+";font-size:"+Math.round((size || 32) * 0.36)+"px"});
}
const nickTag = s => (s && s.nick) ? " «" + s.nick + "»" : "";

/* Tagesplan aus dem Cockpit: Team Market an diesem Einsatztag? */
function planTM(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return !!(s && Array.isArray(s.tmTage) && sl && s.tmTage.indexOf(sl.idx) >= 0);
}
function openSlot(id){
  S.days[id] = S.days[id] || {};
  S.students.forEach(s=>{ S.days[id][s.id] = S.days[id][s.id] || {att: planTM(s, id) ? "tm" : "present", obs:[], note:null}; });
  const sl = slotById(id);
  const m = S.dayMeta[id] || {};
  if(!m.teacher) m.teacher = teacherForWd(sl && sl.wd);
  if(!m.group)   m.group   = S.settings.group   || "";
  if(!m.team)    m.team    = S.settings.team    || "";
  if(!m.outlet)  m.outlet  = S.settings.outlet  || "";
  if(!m.label)   m.label   = slotLabel(sl, "de");
  if(!m.weekday) m.weekday = sl.wd;
  if(!m.date)    m.date    = new Date().toISOString().slice(0,10);
  m.source = "mobil";
  S.dayMeta[id] = m;
  persist();
}

/* ---------- Datensatz für die Laptop-Datei ---------- */
function snapshot(){
  const sl = slots();
  return {
    app:"Kuechenrapport", source:"mobil", variant:MVARIANT,
    savedAt:new Date().toISOString(),
    meta:{
      group:S.settings.group||"", team:S.settings.team||"", outlet:S.settings.outlet||"",
      teacher:S.settings.teacher||"", slotCount:vcfg().n, hasExam:vcfg().exam,
      weekdays:(S.settings.weekdays||[]).slice(), startIdx:S.settings.startIdx||0,
      startDay: sl.length ? wdName(sl[0].wd, "de") : "",
      studentCount:S.students.length, daysRecorded:Object.keys(S.days||{}).length,
      slots: sl.map(x=>({id:x.id, label:slotLabel(x,"de"), weekday:x.wd, exam:!!x.exam}))
    },
    settings:S.settings, students:S.students, days:S.days, dayMeta:S.dayMeta
  };
}
function jsonBlob(){
  return new Blob([JSON.stringify(snapshot(), null, 1)], {type:"application/json"});
}
async function shareDay(){
  /* Noten 2.0: per E-Mail an die Kursleitung. Teilen-Menü → «Mail»; Absenzen des Tages stehen im Mailtext. */
  const name = fileStem() + ".json";
  const blob = jsonBlob();
  const sl = slotById(curSlot);
  const subj = t("dayMailSubj") + " – " + [S.settings.outlet, S.settings.teacher, slotLabel(sl)].filter(Boolean).join(" · ");
  const abs = absenceList(curSlot);
  const text = [subj, "", t("absMail") + ":"].concat(abs.length ? abs.map(x => "- " + x) : [t("absNone")])
    .concat(["", t("dayMailTo") + " " + ABS_MAIL]).join("\n");
  try{
    const file = new File([blob], name, {type:"application/json"});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({files:[file], title:subj, text});
      toast(t("shared")); return;
    }
  }catch(e){ if(e && e.name === "AbortError") return; }
  downloadBlob(blob, name);
}
/* Noten 2.0: eigene Sicherung in «Dateien» (iPad) bzw. Downloads (Laptop) */
async function backupSave(){
  const name = t("backupPrefix") + "_" + fileStem() + ".json";
  const blob = jsonBlob();
  try{
    const file = new File([blob], name, {type:"application/json"});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      toast(t("backupTip"));
      await navigator.share({files:[file], title:name});
      return;
    }
  }catch(e){ if(e && e.name === "AbortError") return; }
  downloadBlob(blob, name);
}
function downloadBlob(blob, name){
  try{
    const url = URL.createObjectURL(blob);
    const a = el("a",{href:url, download:name, style:"display:none"});
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 6000);
    toast(t("saved") + ": " + name);
  }catch(e){ toast(name); }
}
function absenceList(id){
  const d = S.days[id] || {}; const out = [];
  S.students.forEach(st=>{
    const r = d[st.id]; if(!r) return;
    const a = attOf(r);
    if(a === "late" || a === "excused" || a === "unexcused"){
      const kg = [klasseOf(st), gruppeOf(st)].filter(Boolean).join(" \u00b7 ");
      out.push(longName(st) + (kg ? "   \u00b7   " + kg : "") + "   \u2014   " + t(a));
    }
  });
  return out;
}
function absenceMail(){
  const sl = slotById(curSlot);
  const list = absenceList(curSlot);
  const head = [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher]
    .filter(Boolean).join(" · ");
  const subj = t("absSubj") + " – " + [S.settings.group, S.settings.outlet, slotLabel(sl)]
    .filter(Boolean).join(" · ");
  const body = [head, slotLabel(sl) + " · " + MVARIANT, ""]
    .concat(list.length ? list.map(x=>"- " + x) : [t("absNone")])
    .concat(["", t("absCols"), "", "JSON: " + fileStem() + ".json"]).join("\n");
  location.href = "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj)
                + "&body=" + encodeURIComponent(body);
  toast(t("absSent"));
}

/* ---------- Kopf und Tagesleiste ---------- */
function renderHead(){
  const lg = document.getElementById("brandLogo");
  if(lg && !lg.getAttribute("src")) lg.setAttribute("src", LOGO);
  document.getElementById("brandSub").textContent = subLine();
}
function renderSlots(){
  const nav = document.getElementById("slots");
  nav.innerHTML = "";
  if(view !== "day"){ nav.classList.add("hide"); return; }
  nav.classList.remove("hide");
  const all = slots();
  all.forEach(s=>{
    const b = el("button",{class:"slot"+(dayOpen(s.id)?" filled":"")+(s.exam?" exam":""),
      "aria-current":String(s.id===curSlot),
      onclick:()=>{ curSlot = s.id; render(); }});
    b.appendChild(el("span",{class:"sd", text: s.exam ? t("examDay") : wdName(s.wd)}));
    b.appendChild(el("span",{class:"sw", text: s.date ? dmy(s.date) : (s.idx+"/"+all.length)}));
    if(s.id === curSlot) setTimeout(()=>{ try{ b.scrollIntoView({block:"nearest",inline:"center"}); }catch(e){} }, 0);
    nav.appendChild(b);
  });
}

/* ---------- Tagesliste ---------- */
function obsCount(id, sid){
  const r = (S.days[id]||{})[sid];
  if(!r) return 0;
  return obsOf(r).length + ((r.note && r.note.txt) ? 1 : 0);
}
function renderDay(){
  const root = document.getElementById("view"); root.innerHTML = "";
  const sl = slotById(curSlot);

  if(!S.students.length){
    root.appendChild(el("div",{class:"card pad"},[
      el("p",{style:"margin:0 0 12px",text:t("noStudents")}),
      el("button",{class:"btn pri wide",text:t("toSetup"),onclick:()=>{ view="set"; render(); }})
    ]));
    return;
  }
  if(!storeOK) root.appendChild(el("div",{class:"banner bad",style:"margin-bottom:12px",text:t("storeWarn")}));
  if(!dayOpen(curSlot)){
    root.appendChild(el("div",{class:"card pad"},[
      el("span",{class:"eyebrow",style:"display:block;margin-bottom:6px",text:slotLabel(sl)}),
      el("p",{style:"margin:0 0 12px",text:t("dayClosed")}),
      el("button",{class:"btn pri wide",text:"＋ "+t("openDay"),
        onclick:()=>{ openSlot(curSlot); render(); }})
    ]));
    if(sl.exam) root.appendChild(el("div",{class:"banner",style:"margin-top:14px",text:t("examAbs")}));
    return;
  }

  const done = S.students.filter(s=>obsCount(curSlot,s.id) > 0
    || ((S.days[curSlot][s.id]||{}).att || "present") !== "present").length;
  root.appendChild(el("div",{class:"row",style:"justify-content:space-between;align-items:baseline;margin-bottom:8px"},[
    el("span",{class:"eyebrow",text:slotLabel(sl) + " · " + MVARIANT}),
    el("span",{class:"muted",text:done + " " + t("ofDay") + " " + S.students.length + " " + t("recorded")})
  ]));

  const ul = el("ul",{class:"slist"});
  S.students.forEach(s=>{
    const r = dayRec(curSlot, s.id);
    const n = obsCount(curSlot, s.id);
    const li = el("li");
    const b = el("button",{class:"srow",onclick:()=>openSheet(s)});
    b.appendChild(el("span",{class:"dot "+attOf(r)}));
    const av = avatar(s, 34); if(av) b.appendChild(av);
    b.appendChild(el("span",{class:"nm"},[
      el("span",{html:""}),
      document.createTextNode(dispName(s) + nickTag(s)),
      el("div",{class:"sub",text:t(attOf(r) === "tm" ? "teamMarket" : attOf(r)) + (n ? " · " + n + " " + t("obs") : " · " + t("noObs"))
        + " · \u00d8 " + n2Fmt(n2Praxis(s.id).avg)})
    ]));
    if(n) b.appendChild(el("span",{class:"pill on",text:String(n)}));
    b.appendChild(n2Pill(n2Day(curSlot, s.id)));
    b.appendChild(el("span",{class:"chev",text:"›"}));
    li.appendChild(b); ul.appendChild(li);
  });
  root.appendChild(el("div",{class:"card"}, ul));

  if(sl.exam) root.appendChild(el("div",{class:"banner",style:"margin-top:14px",text:t("examAbs")}));
  root.appendChild(el("p",{class:"muted",style:"margin:14px 2px 0",text:t("shareHint")}));
}

/* ---------- Erfassung pro Person ---------- */
let sheetCrit = "hyg", sheetAll = false;
function openSheet(student){
  const host = document.getElementById("sheetHost");
  sheetCrit = "hyg"; sheetAll = false;
  const close = ()=>{ host.innerHTML = ""; document.body.style.overflow = ""; render(); };
  document.body.style.overflow = "hidden";
  const sh = el("div",{class:"sheet"});
  const hd = el("div",{class:"sheet-h"});
  { const av0 = avatar(student, 44); if(av0) hd.appendChild(av0); }
  hd.appendChild(el("div",{style:"min-width:0;flex:1"},[
    el("div",{class:"nm",text:dispName(student) + nickTag(student)}),
    el("div",{class:"sb"},[document.createTextNode(slotLabel(slotById(curSlot)) + "  "), el("span",{id:"n2grade",class:"gpill big"})])
  ]));
  hd.appendChild(el("button",{class:"hbtn",text:"✕","aria-label":t("done"),onclick:close}));
  sh.appendChild(hd);
  const body = el("div",{class:"sheet-b"});
  sh.appendChild(body);
  const ft = el("div",{class:"sheet-f"});
  const ix = S.students.findIndex(x=>x.id===student.id);
  if(ix > 0) ft.appendChild(el("button",{class:"btn",text:"‹",
    onclick:()=>{ host.innerHTML=""; document.body.style.overflow=""; openSheet(S.students[ix-1]); }}));
  ft.appendChild(el("button",{class:"btn pri",text:t("done"),onclick:close}));
  if(ix < S.students.length-1) ft.appendChild(el("button",{class:"btn",text:"›",
    onclick:()=>{ host.innerHTML=""; document.body.style.overflow=""; openSheet(S.students[ix+1]); }}));
  sh.appendChild(ft);
  host.innerHTML = ""; host.appendChild(sh);

  function draw(){
    body.innerHTML = "";
    const r = dayRec(curSlot, student.id);
    n2ShowHead(student.id);
    const n2cg = n2Crit(curSlot, student.id);

    /* Anwesenheit */
    body.appendChild(el("span",{class:"eyebrow",style:"display:block;margin-bottom:7px",text:t("attendance")}));
    const att = el("div",{class:"att"});
    [["present",""],["late","warn"],["excused",""],["unexcused","bad"],["teamMarket","tm"]]
      .forEach(([k,cls],i)=>{
        const val = (k === "teamMarket") ? "tm" : k;
        att.appendChild(el("button",{class:cls,"aria-pressed":String(attOf(r)===val),
          text:t(k), onclick:()=>{ r.att = val; persist(); draw(); }}));
      });
    body.appendChild(att);

    /* Kriterien */
    body.appendChild(el("span",{class:"eyebrow",style:"display:block;margin:18px 0 7px",text:t("obs")}));
    const bar = el("div",{class:"critbar"});
    CRITS.forEach(c=>{
      const n = obsOf(r).filter(id=>CHIP[id] && CHIP[id].c === c.k).length;
      const b = el("button",{"aria-current":String(sheetCrit===c.k),
        onclick:()=>{ sheetCrit = c.k; sheetAll = false; draw(); }});
      b.appendChild(el("span",{text:critName(c.k)}));
      if(n2cg) b.appendChild(el("span",{class:"cg",text:n2cg[c.k].toFixed(2)}));
      if(n) b.appendChild(el("span",{class:"n",text:"("+n+")"}));
      if(sheetCrit === c.k) setTimeout(()=>{ try{ b.scrollIntoView({block:"nearest",inline:"center"}); }catch(e){} }, 0);
      bar.appendChild(b);
    });
    bar.appendChild(el("button",{"aria-current":String(sheetCrit==="__note"),
      onclick:()=>{ sheetCrit = "__note"; draw(); }, text:"✎ "+t("note")}));
    body.appendChild(bar);

    if(sheetCrit === "__note"){
      const nt = r.note || {txt:""};
      const f = el("div",{class:"field"});
      const ta = el("textarea",{placeholder:t("notePh"),
        oninput:e=>{ r.note = {txt:e.target.value, crit:"", dir:0, w:0}; persist(); }});
      ta.value = nt.txt || "";
      f.appendChild(ta);
      body.appendChild(f);
      body.appendChild(el("p",{class:"muted",style:"margin:0",text:t("noteHint")}));
      return;
    }

    const set = new Set(obsOf(r));
    const quick = QUICK[sheetCrit] || [];
    const list = CHIPS.filter(c=>c.c === sheetCrit);
    const shown = sheetAll ? list
      : list.filter(c=>quick.indexOf(c.i) >= 0 || set.has(c.i));
    const order = c => (quick.indexOf(c.i) >= 0 ? quick.indexOf(c.i) : 90) + (c.d > 0 ? 0 : -0.5);
    shown.sort((a,b)=>order(a)-order(b));

    const box = el("div",{class:"chips"});
    shown.forEach(c=>{
      const on = set.has(c.i);
      const wtxt = c.ko ? t("ko") : (c.w === W.l ? t("light") : (c.w === W.s ? t("heavy") : t("medium")));
      const b = el("button",{class:"chip "+(c.d>0?"pos":"neg")+(c.ko?" ko":""),
        "aria-pressed":String(on),
        onclick:()=>{
          const s2 = new Set(obsOf(r));
          if(s2.has(c.i)) s2.delete(c.i); else s2.add(c.i);
          r.obs = [...s2]; persist(); draw();
        }});
      b.appendChild(el("span",{class:"sg",text: on ? "✓" : (c.d>0 ? "+" : "−")}));
      b.appendChild(el("span",{class:"tx"},[
        document.createTextNode(chipT(c)),
        el("div",{class:"w",text:(c.d>0?"+ ":"− ")+wtxt+"  \u00b7  "+n2Effect(c)})
      ]));
      box.appendChild(b);
    });
    body.appendChild(box);
    if(list.length > shown.length || sheetAll)
      body.appendChild(el("button",{class:"morebtn",style:"margin-top:9px",
        text: sheetAll ? t("showLess") : t("showAll")+" ("+list.length+")",
        onclick:()=>{ sheetAll = !sheetAll; draw(); }}));
  }
  draw();
}

/* ---------- Setup ---------- */
let loadArmed = false;
function renderSet(){
  const root = document.getElementById("view"); root.innerHTML = "";

  if(!storeOK) root.appendChild(el("div",{class:"banner bad",text:t("storeWarn")}));

  /* Sicherung laden */
  const c0 = el("div",{class:"card pad"});
  c0.appendChild(el("span",{class:"eyebrow",style:"display:block;margin-bottom:6px",text:t("loadBackup")}));
  c0.appendChild(el("p",{class:"muted",style:"margin:0 0 11px",text:t("loadHint")}));
  const fin = el("input",{type:"file",accept:".json,application/json",style:"display:none",onchange:onLoadBackup});
  const lb = el("button",{class:"btn pri wide",text:t("loadBtn"),onclick:()=>{
    const hasData = S.students.length || Object.keys(S.days||{}).length;
    if(hasData && !loadArmed){
      loadArmed = true; lb.textContent = t("loadArm");
      lb.style.background = "var(--minus)"; lb.style.borderColor = "var(--minus)";
      setTimeout(()=>{ if(loadArmed){ loadArmed = false; renderSet(); } }, 6000);
      return;
    }
    fin.click();
  }});
  c0.appendChild(lb); c0.appendChild(fin);
  root.appendChild(c0);

  /* Angaben */
  root.appendChild(el("h2",{class:"sec",text:t("setup")}));
  const c1 = el("div",{class:"card pad"});
  const tf = (id, label, key) => {
    const f = el("div",{class:"field"});
    f.appendChild(el("label",{for:id,text:label}));
    f.appendChild(el("input",{id:id,value:S.settings[key]||"",autocapitalize:"words",
      oninput:e=>{ S.settings[key]=e.target.value; persist();
                   document.getElementById("brandSub").textContent = subLine(); }}));
    return f;
  };
  const g = el("div",{class:"grid2"});
  g.appendChild(tf("mGroup", t("klasseField"), "group"));
  g.appendChild(tf("mTeam",  t("gruppeField"),  "team"));
  c1.appendChild(g);
  c1.appendChild(tf("mOutlet",  t("outlet"),  "outlet"));
  c1.appendChild(tf("mTeacher", t("teacher"), "teacher"));

  const fv = el("div",{class:"field"});
  fv.appendChild(el("label",{text:t("variant")}));
  fv.appendChild(el("div",{style:"padding:11px 12px;border:1px solid var(--line);border-radius:10px;"
    + "background:var(--surf2);font-weight:600", text:{"10T":t("v10"),"4T":t("v4"),"5T":t("v5")}[MVARIANT]}));
  fv.appendChild(el("span",{class:"muted",text:t("varFixed")}));
  c1.appendChild(fv);

  const fs = el("div",{class:"field"});
  fs.appendChild(el("label",{for:"mStart",text:t("startDay")}));
  const ss = el("select",{id:"mStart",onchange:e=>{
    S.settings.startIdx = parseInt(e.target.value,10) || 0; persist(); render();
  }});
  (S.settings.weekdays||["mo","tu","we","th"]).forEach((k,i)=>
    ss.appendChild(el("option",{value:String(i),text:wdName(k),selected:(S.settings.startIdx||0)===i})));
  fs.appendChild(ss); c1.appendChild(fs);

  const f5 = el("div",{class:"field"});
  f5.appendChild(el("label",{for:"mStud",text:t("studentList")}));
  const ta = el("textarea",{id:"mStud",autocapitalize:"words"});
  ta.value = S.students.map(studentLine).join("\n");
  f5.appendChild(ta);
  f5.appendChild(el("span",{class:"muted",text:t("studentHint")}));
  c1.appendChild(f5);
  c1.appendChild(el("button",{class:"btn pri wide",text:t("apply"),onclick:()=>{
    const lines = ta.value.split("\n").map(x=>x.trim()).filter(Boolean);
    S.students = lines.map(line=>{
      const f = parseStudentLine(line);
      const nm = [f.last, f.first].filter(Boolean).join(" ");
      const lang = ["de","en","zh"].indexOf(f.lang) >= 0 ? f.lang : "";
      const ex = S.students.find(x=>dispName(x).trim().toLowerCase() === nm.toLowerCase());
      const base = ex || {id:"m"+Math.random().toString(36).slice(2,8)};
      return {...base, name:nm, last:f.last, first:f.first,
              nick:   f.nick   || (ex && ex.nick)   || "",
              mail:   f.mail   || (ex && ex.mail)   || "",
              lang:   lang     || (ex && ex.lang)   || "",
              klasse: f.klasse || (ex && ex.klasse) || "",
              gruppe: f.gruppe || (ex && ex.gruppe) || ""};
    });
    normalizeStudents(); pruneOrphans(); persist(); toast(S.students.length + " " + t("students"));
    view = "day"; render();
  }}));
  root.appendChild(c1);

  /* Sicherung sichern */
  root.appendChild(el("h2",{class:"sec",text:t("saveBackup")}));
  const c2 = el("div",{class:"card pad"});
  c2.appendChild(el("div",{class:"row"},[
    el("button",{class:"btn",text:t("saveBtn"),
      onclick:()=>downloadBlob(jsonBlob(), fileStem()+".json")}),
    el("button",{class:"btn",text:"✉ "+t("share"),onclick:shareDay})
  ]));
  c2.appendChild(el("p",{class:"muted",style:"margin:11px 0 0",text:fileStem()+".json"}));
  root.appendChild(c2);

  root.appendChild(el("p",{class:"muted",style:"margin:16px 2px 0",text:t("homeHint")}));
}
async function onLoadBackup(e){
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if(!f) return;
  try{
    const o = JSON.parse(await f.text());
    if(o && o.format === "praxisrapport-semesterpaket"){ toast(t("loadSem")); return; }
    if(!o || !o.settings || !Array.isArray(o.students)) throw new Error("format");
    const other = o.variant && o.variant !== MVARIANT;
    S = {settings:{...DEF, ...o.settings, variant:MVARIANT},
         students:o.students.filter(x=>x && typeof x.name === "string"),
         days: other ? {} : sanitizeDays(o.days),
         dayMeta: other ? {} : ((o.dayMeta && typeof o.dayMeta === "object") ? o.dayMeta : {})};
    delete S.settings.isSample;
    normalizeSettings(); normalizeStudents(); pruneOrphans();
    L = (T[S.settings.uiLang] ? S.settings.uiLang : "de");
    persist();
    curSlot = slots()[0].id;
    view = "day"; render();
    toast(other ? t("loadPartial")
                : (t("loadDone") + ": " + S.students.length + " " + t("students")));
  }catch(err){ toast(t("loadBad")); }
}

/* ---------- Fussleiste ---------- */
function renderBar(){
  const bar = document.getElementById("bar"); bar.innerHTML = "";
  if(view === "set" || view === "grades"){
    bar.appendChild(el("button",{class:"btn pri wide",text:t("done"),
      onclick:()=>{ view = "day"; render(); }}));
    return;
  }
  bar.appendChild(el("button",{class:"btn pri",text:"✉ "+t("share"),onclick:shareDay}));
  bar.appendChild(el("button",{class:"btn",text:"✉ "+t("absMail"),onclick:absenceMail}));
  bar.appendChild(el("button",{class:"btn",text:"⤓ "+t("backup"),onclick:backupSave}));
}

/* ---------- Sprache ---------- */
function cycleLang(){
  const i = UI_LANGS.findIndex(x=>x.code === L);
  L = UI_LANGS[(i+1) % UI_LANGS.length].code;
  S.settings.uiLang = L; persist();
  document.documentElement.setAttribute("lang", L);
  render();
  toast(t("langTitle") + ": " + UI_LANGS.find(x=>x.code===L).name);
}

/* ---------- Start ---------- */
function render(){
  L = T[S.settings.uiLang] ? S.settings.uiLang : "de";
  document.documentElement.setAttribute("lang", L);
  renderHead(); renderSlots(); renderBar();
  if(view === "set") renderSet(); else if(view === "grades") n2RenderGrades(); else renderDay();
}
document.getElementById("btnSet").addEventListener("click", ()=>{
  view = (view === "set") ? "day" : "set"; loadArmed = false; render();
});
document.getElementById("btnLang").addEventListener("click", cycleLang);
document.getElementById("btnGrades").addEventListener("click", ()=>{
  view = (view === "grades") ? "day" : "grades"; render();
});
render();
