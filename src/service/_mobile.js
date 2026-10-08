/* ==================================================================
   Servicerapport Mobil  ·  Erfassung im Service auf iPhone und iPad
   Erzeugt eine JSON, die die Laptop-Datei mit «Rapporte zusammenführen»
   einliest. Gleiche Baustein-IDs, gleiche Slot-IDs, gleiche Variante.
   ================================================================== */

const ABS_MAIL = "michael.pilman@ehl.ch";
const APP_AREA = "Service";   // Daily Grades · Bereich

/* ===== Variante dieser Datei, bewusst nicht einstellbar =====
   Wird beim Erzeugen der Datei gesetzt, wie bei der Laptop-Datei.   */
const MVARIANT = "10T";

/* ---------- Oberflächentexte ---------- */
const T = {
de:{
  stNames:"Alle Studierenden haben einen Namen",stClass:"Klasse und Gruppe sind gesetzt",
  selfTest:"Selbsttest",selfTestBtn:"Selbsttest ausführen",selfTestHint:"Prüft die Bausteine und den Turnus dieser Datei.",selfTestOkN:"bestanden",stChips:"Bausteine eindeutig",stCrit:"Jeder Baustein hat ein gültiges Kriterium",stAction:"Jeder negative Baustein hat eine Massnahme",stLang:"Alle vier Sprachen vorhanden",stLate:"Baustein für Verspätung vorhanden",stSlots:"Einsatztage korrekt nummeriert",stStart:"Starttag stimmt mit Tag 1 überein",stQuick:"Schnellwahl zeigt gültige Bausteine",stStore:"Browserspeicher funktioniert",days:"Tage",
  outlet2:"Zweites Restaurant (Wechsel)", outlet2Hint:"Nur bei Wechsel zwischen zwei Restaurants. Dann erscheint pro Person ein Umschalter.", switchTitle:"Restaurant wechseln",
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
  absSubj:"Absenzen Servicepraxis", absSent:"E-Mail vorbereitet",
  shared:"Gesendet", backup:"Sichern", backupPrefix:"Sicherung", backupTip:"Im Menü «In Dateien sichern» wählen", dayMailSubj:"Tagesrapport", dayMailTo:"An:", saved:"Gespeichert",
  group:"Klasse", team:"Gruppe", outlet:"Outlet / Abteilung", teacher:"Dozent/in",
  variant:"Variante", v10:"9 Einsatztage + Exam Day", v4:"4 Einsatztage + Exam Day",
  v5:"5 Einsatztage ohne Exam",
  weekdaysLbl:"Einsatztage pro Woche", startDay:"Turnus startet am",
  studentList:"Studierende, eine Person pro Zeile",
  studentHint:"Pro Zeile: Nachname; Vorname; Nickname; E-Mail; Sprache; Klasse; Gruppe",
  apply:"Übernehmen", loadBackup:"Sicherung vom Laptop laden",
  loadHint:"Legen Sie die JSON aus dem Laptop-Rapport in «Dateien» oder iCloud ab und laden Sie sie hier. Damit sind Gruppe, Team, Outlet, Dozent, Turnus und alle Studierenden mit E-Mail-Adresse sofort da.",
  loadBtn:"⤒ Sicherung laden", loadArm:"Ersetzt alles, nochmals tippen",
  loadDone:"Sicherung geladen", loadBad:"Datei nicht lesbar oder keine Servicerapport-Sicherung", storeWarn:"Achtung: Dieses Gerät speichert gerade nichts (privater Modus oder Speicher voll). Bitte jetzt «⤓ Sichern» tippen und den Tag sofort senden.", loadSem:"Das ist Ihr Semesterpaket. Bitte auf Ihrer persönlichen Startseite laden (Symbol auf dem Home-Bildschirm), nicht hier.",
  saveBackup:"Sicherung sichern", saveBtn:"⤓ Als JSON sichern",
  shareHint:"«Tag senden» öffnet das Teilen-Menü: «Mail» wählen und an michael.pilman@ehl.ch senden. Die Absenzen des Tages stehen schon im Mailtext. «⤓ Sichern» legt eine eigene Sicherung in «Dateien» ab.",
  examDay:"Exam Day", week:"W", light:"leicht", medium:"mittel", heavy:"schwer", ko:"K.-o.",
  langTitle:"Sprache", setupDone:"Setup gespeichert",
  homeHint:"Tipp: über das Teilen-Symbol in Safari «Zum Home-Bildschirm» wählen, dann startet der Rapport wie eine App.",
  recorded:"erfasst", ofDay:"von", examAbs:"Am Exam Day ergibt jede Abwesenheit die Note 1.00."
},
en:{
  stNames:"Every student has a name",stClass:"Class and group are set",
  selfTest:"Self-test",selfTestBtn:"Run self-test",selfTestHint:"Checks the building blocks and the rotation of this file.",selfTestOkN:"passed",stChips:"Building block IDs unique",stCrit:"Every block has a valid criterion",stAction:"Every negative block has an action",stLang:"All four languages present",stLate:"Lateness block present",stSlots:"Shift days numbered correctly",stStart:"Start day matches day 1",stQuick:"Quick list points to valid blocks",stStore:"Browser storage works",days:"days",
  outlet2:"Second restaurant (switch)", outlet2Hint:"Only if students switch between two restaurants. A switch then appears for each person.", switchTitle:"Switch restaurant",
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
  absSubj:"Absences service practice", absSent:"E-mail prepared",
  shared:"Sent", backup:"Back up", backupPrefix:"Backup", backupTip:"Choose «Save to Files» in the menu", dayMailSubj:"Day report", dayMailTo:"To:", saved:"Saved",
  group:"Class", team:"Group", outlet:"Outlet / department", teacher:"Lecturer",
  variant:"Variant", v10:"9 shift days + Exam Day", v4:"4 shift days + Exam Day",
  v5:"5 shift days without exam",
  weekdaysLbl:"Shift days per week", startDay:"Rotation starts on",
  studentList:"Students, one person per line",
  studentHint:"Per line: surname; first name; nickname; e-mail; language; class; group",
  apply:"Apply", loadBackup:"Load a backup from the laptop",
  loadHint:"Put the JSON from the laptop report into Files or iCloud and load it here. Group, team, outlet, lecturer, rotation and all students with their e-mail addresses are then in place.",
  loadBtn:"⤒ Load backup", loadArm:"Replaces everything, tap again",
  loadDone:"Backup loaded", loadBad:"File unreadable or not a service report backup", storeWarn:"Warning: this device is not saving anything right now (private mode or storage full). Tap «⤓ Back up» now and send the day straight away.", loadSem:"This is your semester package. Please load it on your personal start page (icon on the Home Screen), not here.",
  saveBackup:"Save a backup", saveBtn:"⤓ Save as JSON",
  shareHint:"“Send the day” opens the share sheet: choose «Mail» and send it to michael.pilman@ehl.ch. The day's absences are already in the e-mail text. «⤓ Back up» saves your own backup in «Files».",
  examDay:"Exam Day", week:"W", light:"light", medium:"medium", heavy:"heavy", ko:"K.O.",
  langTitle:"Language", setupDone:"Setup saved",
  homeHint:"Tip: use the share icon in Safari and choose “Add to Home Screen”, then the report starts like an app.",
  recorded:"recorded", ofDay:"of", examAbs:"On the Exam Day any absence gives the grade 1.00."
},
th:{
  stNames:"นักศึกษาทุกคนมีชื่อ",stClass:"ตั้งชั้นเรียนและกลุ่มแล้ว",
  selfTest:"การทดสอบระบบ",selfTestBtn:"เริ่มทดสอบ",selfTestHint:"ตรวจสอบคลังข้อสังเกตและรอบการฝึก",selfTestOkN:"ผ่าน",stChips:"รหัสข้อสังเกตไม่ซ้ำ",stCrit:"ทุกข้อมีเกณฑ์ที่ถูกต้อง",stAction:"ข้อเชิงลบมีแนวทางแก้ไข",stLang:"มีครบทั้งสี่ภาษา",stLate:"มีข้อสำหรับการมาสาย",stSlots:"ลำดับวันฝึกถูกต้อง",stStart:"วันเริ่มตรงกับวันที่ 1",stQuick:"รายการใช้บ่อยถูกต้อง",stStore:"หน่วยความจำทำงานได้",days:"วัน",
  outlet2:"ร้านอาหารที่สอง (สลับ)", outlet2Hint:"เฉพาะเมื่อนักศึกษาสลับระหว่างสองร้าน จะมีปุ่มสลับสำหรับแต่ละคน", switchTitle:"สลับร้านอาหาร",
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
  absSubj:"การขาดเรียน การปฏิบัติงานบริการ", absSent:"เตรียมอีเมลแล้ว",
  shared:"ส่งแล้ว", backup:"สำรองข้อมูล", backupPrefix:"Backup", backupTip:"เลือก «บันทึกไปยังแอปไฟล์» ในเมนู", dayMailSubj:"Tagesrapport", dayMailTo:"ถึง:", saved:"บันทึกแล้ว",
  group:"ชั้นเรียน", team:"กลุ่ม", outlet:"เอาต์เล็ต / แผนก", teacher:"ผู้สอน",
  variant:"รูปแบบ", v10:"9 วันฝึก + วันสอบ", v4:"4 วันฝึก + วันสอบ",
  v5:"5 วันฝึก ไม่มีวันสอบ",
  weekdaysLbl:"วันฝึกต่อสัปดาห์", startDay:"รอบฝึกเริ่มวัน",
  studentList:"รายชื่อนักศึกษา บรรทัดละหนึ่งคน",
  studentHint:"ต่อบรรทัด: นามสกุล; ชื่อ; ชื่อเล่น; อีเมล; ภาษา; ชั้นเรียน; กลุ่ม",
  apply:"ยืนยัน", loadBackup:"โหลดไฟล์สำรองจากแล็ปท็อป",
  loadHint:"นำไฟล์ JSON จากรายงานในแล็ปท็อปไปไว้ใน Files หรือ iCloud แล้วโหลดที่นี่ จะได้กลุ่ม ทีม เอาต์เล็ต ผู้สอน รอบฝึก และรายชื่อนักศึกษาพร้อมอีเมลทันที",
  loadBtn:"⤒ โหลดไฟล์สำรอง", loadArm:"จะแทนที่ทั้งหมด แตะอีกครั้ง",
  loadDone:"โหลดไฟล์สำรองแล้ว", loadBad:"อ่านไฟล์ไม่ได้ หรือไม่ใช่ไฟล์สำรองของรายงานบริการ", storeWarn:"คำเตือน: อุปกรณ์นี้ไม่ได้บันทึกข้อมูลอยู่ในขณะนี้ (โหมดส่วนตัวหรือพื้นที่เต็ม) กรุณากด «⤓ สำรองข้อมูล» ทันที และส่งข้อมูลของวันนี้เลย", loadSem:"นี่คือชุดข้อมูลภาคเรียนของคุณ กรุณาโหลดในหน้าเริ่มต้นส่วนตัว (ไอคอนบนหน้าจอโฮม) ไม่ใช่ที่นี่",
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
  gas:["gas-n1","gas-n3","gas-p1","gas-p3","gas-p4"],
  hyg:["hyg-n1","hyg-n3","hyg-p1","hyg-p3","hyg-p4"],
  mep:["mep-n1","mep-n2","mep-p1","mep-p2","mep-p3"],
  tec:["tec-n1","tec-n3","tec-p1","tec-p2","tec-p3"],
  ver:["ver-n1","ver-n2","ver-p1","ver-p2","ver-p3"],
  tea:["tea-lt","tea-n1","tea-p1","tea-p2","tea-p3"],
  sel:["sel-n1","sel-n2","sel-p1","sel-p2","sel-p3"],
  mot:["mot-n1","mot-n3","mot-p1","mot-p2","mot-p3"],
  auf:["auf-n1","auf-n3","auf-p1","auf-p2","auf-p3"]
};
const CHIP = {}; CHIPS.forEach(c=>CHIP[c.i]=c);
const critName = (k, lg) => { const c = CRITS.find(x=>x.k===k); return c ? (c[lg||L]||c.de) : k; };
function splitName(voll){
  const teile = String(voll || "").trim().split(/\s+/).filter(Boolean);
  if(teile.length < 2) return {nachname: teile[0] || "", vorname: ""};
  return {nachname: teile.slice(0,-1).join(" "), vorname: teile[teile.length-1]};
}
const anzeigeName = s => [s.nachname, s.vorname].filter(Boolean).join(" ") || s.name || "";
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
const klasseOf = s => (s && s.klasse) || S.settings.group || "";
const gruppeOf = s => (s && s.gruppe) || S.settings.team  || "";
/* Nachname; Vorname; Nickname; E-Mail; Sprache. E-Mail und Sprache werden am Inhalt
   erkannt, damit die alte Schreibweise "Ammann Lea; mail; de" weiter funktioniert. */
function parseStudentZeile(line){
  const roh = String(line || "").split(/[;\t]/).map(x=>x.trim());
  let mail = "", lang = "", klasse = "", gruppe = ""; const rest = [];
  roh.forEach(x=>{
    if(!x) return;
    if(!mail && x.indexOf("@") >= 0){ mail = x; return; }
    if(!klasse && erkenneKlasse(x)){ klasse = erkenneKlasse(x); return; }
    if(!gruppe && erkenneGruppe(x)){ gruppe = erkenneGruppe(x); return; }
    const lg = x.toLowerCase();
    if(!lang && ["de","en","zh"].indexOf(lg) >= 0 && x.length <= 3){ lang = lg; return; }
    rest.push(x);
  });
  let nachname = rest[0] || "", vorname = rest[1] || "", nick = rest[2] || "";
  if(nachname && !vorname){ const g = splitName(nachname); nachname = g.nachname; vorname = g.vorname; }
  if(!nachname && !vorname) return null;
  return {nachname, vorname, nick, mail, lang, klasse, gruppe};
}
const studentZeile = s => [s.nachname||"", s.vorname||"", s.nick||"", s.mail||"", s.lang||"",
                           s.klasse||"", s.gruppe||""]
  .filter((x,i)=> i < 2 || x).join("; ");
const critShort = (k, lg) => { const c = CRITS.find(x=>x.k===k); return c && c.s ? (c.s[lg||L]||c.s.de) : critName(k,lg); };
const chipT = (c, lg) => c.t[lg||L] || c.t.de;
const wdName = (k, lg) => { const w = WDAYS.find(x=>x.k===k); return w ? (w[lg||L]||w.de) : k; };

/* ---------- Speicher, pro Datei getrennt ---------- */
const FILENAME = (function(){
  try{ const p = decodeURIComponent(location.pathname||""); const n = p.split("/").pop();
       return n || "Servicerapport_Mobil.html"; }catch(e){ return "Servicerapport_Mobil.html"; }
})();
const FILEID = (function(){
  let h = 0; const s = FILENAME;
  for(let i=0;i<s.length;i++){ h = ((h<<5)-h) + s.charCodeAt(i); h |= 0; }
  return "." + Math.abs(h).toString(36);
})();
const KEY = "servicerapport.mobil.v1" + FILEID;

const DEF = {group:"", team:"", outlet:"", teacher:"", uiLang:"de",
             variant:MVARIANT, weekdays:["mo","tu","we","th"], startIdx:0, base:5, gas2:true};
let S, storeOK = true;
try{
  const raw = localStorage.getItem(KEY);
  S = raw ? JSON.parse(raw) : null;
}catch(e){ S = null; }
if(!S || !S.settings) S = {settings:{...DEF}, students:[], days:{}, dayMeta:{}};
S.settings = {...DEF, ...S.settings};
/* Altbestand aufteilen: fruehere Dateien kannten nur ein Namensfeld. */
S.students = (S.students || []).map(s=>{
  if(!s) return null;
  let nach = String(s.nachname == null ? "" : s.nachname).trim();
  let vor  = String(s.vorname  == null ? "" : s.vorname ).trim();
  if(!nach && !vor){ const g = splitName(s.name); nach = g.nachname; vor = g.vorname; }
  if(!nach && !vor) return null;
  const o = {...s, nachname:nach, vorname:vor, nick:String(s.nick || "").trim(),
             klasse:String(s.klasse || "").trim(), gruppe:String(s.gruppe || "").trim()};
  o.name = anzeigeName(o);
  return o;
}).filter(Boolean);
S.days = S.days || {}; S.dayMeta = S.dayMeta || {};
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
  put("outlet2", p.outlet2);
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
    /* false und null bedeuten: Attribut gar nicht setzen. setAttribute("selected", false)
       wuerde sonst "selected=false" schreiben, und das gilt im HTML als gesetzt. */
    if(v === undefined || v === null || v === false) continue;
    if(k === "text") n.textContent = v;
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
  .filter(Boolean).join(" · ") || "Servicepraxis";
function clean(x){
  return String(x||"").trim().replace(/[^A-Za-z0-9ÄÖÜäöüß]+/g,"-").replace(/^-+|-+$/g,"");
}
function fileStem(){
  const d = new Date();
  const iso = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  const p = [clean(S.settings.teacher), clean(S.settings.group), clean(S.settings.outlet),
             MVARIANT, iso].filter(Boolean);
  return p.length > 2 ? p.join("_") : "Servicerapport_" + MVARIANT + "_" + iso;
}
function dayRec(id, sid){
  S.days[id] = S.days[id] || {};
  S.days[id][sid] = S.days[id][sid] || {att:"present", obs:[], note:null};
  return S.days[id][sid];
}

/* ---- Restaurantwechsel: Ort pro Person und Einsatztag ----
   S.settings.outlet = Stammrestaurant, S.settings.outlet2 = zweites Restaurant (freiwillig).
   r.outlet steht im Tagesdatensatz nur, wenn die Person nicht im Stammrestaurant war. */
const hasOutlet2 = () => !!String(S.settings.outlet2 || "").trim();
function outletOfDay(slotId, sid){
  const r = (S.days[slotId] || {})[sid];
  return (r && r.outlet) ? r.outlet : (S.settings.outlet || "");
}
/* Vorgabe fuer einen neuen Tag: Ort des letzten erfassten Tages dieser Person. */
function prevOutlet(slotId, sid){
  const all = slots(); const i = all.findIndex(s => s.id === slotId);
  for(let k = i - 1; k >= 0; k--){ const r = (S.days[all[k].id] || {})[sid]; if(r) return r.outlet || ""; }
  return "";
}
function planOutlet(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  if(!s || !sl) return "";
  /* Tagesplan aus dem Cockpit: Restaurant pro Einsatztag */
  if(Array.isArray(s.ortPlan)){
    const o = String(s.ortPlan[sl.idx - 1] || "").trim();
    return (o && o !== String(S.settings.outlet || "").trim()) ? o : "";
  }
  return (s.wechselAb && s.wechselOutlet && sl.idx >= s.wechselAb) ? s.wechselOutlet : "";
}
/* Tagesplan aus dem Cockpit: Team Market an diesem Einsatztag? */
function planTM(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return !!(s && Array.isArray(s.tmTage) && sl && s.tmTage.indexOf(sl.idx) >= 0);
}

function toggleOutlet(r){
  r.outlet = r.outlet ? "" : String(S.settings.outlet2 || "").trim();
  if(!r.outlet) delete r.outlet;
}
/* Einsatzorte als Text: "Umami (Tag 1–5), Da Fortunat (Tag 6–10)". Leer, wenn die Person
   nur im Stammrestaurant war. lg = Sprache des Textes (de, en, zh, th). */
function placementText(sid, lg){
  const segs = [];
  slots().forEach(sl => {
    const r = (S.days[sl.id] || {})[sid]; if(!r) return;
    const o = r.outlet || S.settings.outlet || "–";
    const last = segs[segs.length - 1];
    if(last && last.o === o) last.to = sl.idx; else segs.push({o: o, from: sl.idx, to: sl.idx});
  });
  if(!segs.length) return "";
  if(segs.length === 1 && segs[0].o === (S.settings.outlet || "–")) return "";
  const rng = g => g.from === g.to ? String(g.from) : (g.from + "–" + g.to);
  const fmtR = g => (lg === "zh") ? ("第" + rng(g) + "天") : (lg === "en") ? ("Day " + rng(g))
                  : (lg === "th") ? ("วันที่ " + rng(g)) : ("Tag " + rng(g));
  return segs.map(g => g.o + " (" + fmtR(g) + ")").join(", ");
}
/* Beim Zusammenfuehren: Tage aus einer Datei mit anderem Stammrestaurant behalten ihren Ort. */
function mitOrt(r, o){
  const src = String((o && o.meta && o.meta.outlet) || (o && o.settings && o.settings.outlet) || "").trim();
  if(r && !r.outlet && src && src !== String(S.settings.outlet || "").trim()) return Object.assign({}, r, {outlet: src});
  return r;
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
function openSlot(id){
  S.days[id] = S.days[id] || {};
  S.students.forEach(s=>{
    if(!S.days[id][s.id]){
      S.days[id][s.id] = {att: planTM(s, id) ? "tm" : "present", obs:[], note:null};
      /* Mit Tagesplan gilt nur der Plan (leer = Stammrestaurant); sonst Ort vom Vortag */
      const vo = Array.isArray(s.ortPlan) ? planOutlet(s, id)
               : (planOutlet(s, id) || (hasOutlet2() ? prevOutlet(id, s.id) : ""));
      if(vo) S.days[id][s.id].outlet = vo;
    }
  });
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
    app:"Servicerapport", source:"mobil", variant:MVARIANT,
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
  S.students.forEach(s=>{
    const r = d[s.id]; if(!r) return;
    const k = r.att === "late" ? t("late")
            : r.att === "excused" ? t("excused")
            : r.att === "unexcused" ? t("unexcused") : null;
    if(!k) return;
    /* Name, Vorname, Nickname, Klasse, Gruppe und Grund auf einer Zeile, damit eine
       einzelne Zeile ohne den Kopf der Mail weitergeleitet werden kann. */
    const person = [s.nachname || s.name || "", s.vorname || ""].filter(Boolean).join(", ")
                 + (s.nick ? " \u00ab" + s.nick + "\u00bb" : "");
    const kg = [klasseOf(s), gruppeOf(s)].filter(Boolean).join(" \u00b7 ");
    const ort = (hasOutlet2() || r.outlet) ? outletOfDay(id, s.id) : "";
    out.push(person + (kg ? "   \u00b7   " + kg : "") + (ort ? "   \u00b7   " + ort : "") + "   \u2014   " + k);
  });
  return out;
}
function absenceMail(){
  const sl = slotById(curSlot);
  const list = absenceList(curSlot);
  const head = [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher]
    .filter(Boolean).join(" · ");
  const subj = t("absSubj") + " – " + [S.settings.group, S.settings.team, S.settings.outlet, slotLabel(sl)]
    .filter(Boolean).join(" · ");
  const body = [head, slotLabel(sl) + " · " + MVARIANT, ""]
    .concat(list.length ? list.map(x=>"- " + x) : [t("absNone")])
    .concat(["", "JSON: " + fileStem() + ".json"]).join("\n");
  /* Ueber einen Link statt ueber location.href: funktioniert auch dort, wo die Seite
     in einem Rahmen laeuft und eine Navigation des ganzen Fensters blockiert wird. */
  const href = "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj)
             + "&body=" + encodeURIComponent(body);
  const a = el("a",{href:href, target:"_blank", rel:"noopener", style:"display:none"});
  document.body.appendChild(a); a.click(); a.remove();
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
  return (r.obs||[]).length + ((r.note && r.note.txt) ? 1 : 0);
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
    b.appendChild(el("span",{class:"dot "+(r.att||"present")}));
    const av = avatar(s, 34); if(av) b.appendChild(av);
    b.appendChild(el("span",{class:"nm"},[
      el("span",{}),
      document.createTextNode(s.name + nickTag(s)),
      el("div",{class:"sub"},[schichtPill(s, curSlot), document.createTextNode(t((r.att||"present") === "tm" ? "teamMarket" : (r.att||"present")) + (n ? " · " + n + " " + t("obs") : " · " + t("noObs"))
        + " · \u00d8 " + n2Fmt(n2Praxis(s.id).avg)
        + (r.outlet ? " · \u21c4 " + r.outlet : ""))])
    ]));
    if(n) b.appendChild(el("span",{class:"pill on",text:String(n)}));
    b.appendChild(n2Pill(n2Day(curSlot, s.id)));
    b.appendChild(el("span",{class:"chev",text:"›"}));
    li.appendChild(b); ul.appendChild(li);
  });
  root.appendChild(el("div",{class:"card"}, ul));

  if(sl.exam) root.appendChild(el("div",{class:"banner",style:"margin-top:14px",text:t("examAbs")}));
  /* Letzter Tag (Exam Day bzw. Tag 5): Zusammenfassung an die Kursleitung gleich hier anbieten */
  if(sl.id === slots()[slots().length - 1].id){ const sc = n2SummaryCard(); sc.style.marginTop = "14px"; root.appendChild(sc); }
  root.appendChild(el("p",{class:"muted",style:"margin:14px 2px 0",text:t("shareHint")}));
}

/* ---------- Erfassung pro Person ---------- */
let sheetCrit = "gas", sheetAll = false;
function openSheet(student){
  const host = document.getElementById("sheetHost");
  sheetCrit = "gas"; sheetAll = false;
  /* Die Scrollsperre wird an einer Stelle geloest, damit sie nicht haengen bleibt. */
  let nickOpen = false;
  /* Vor dem Schliessen das aktive Feld verlassen und speichern: Freitext geht nie verloren, egal wo man schliesst */
  const entsperren = ()=>{ try{ const a = document.activeElement; if(a && a.blur) a.blur(); }catch(e){} persist();
    host.innerHTML = ""; try{ document.body.style.overflow = ""; }catch(e){} };
  const close = ()=>{ entsperren(); render(); };
  document.body.style.overflow = "hidden";
  const sh = el("div",{class:"sheet"});
  const hd = el("div",{class:"sheet-h"});
  { const av0 = avatar(student, 44); if(av0) hd.appendChild(av0); }
  hd.appendChild(el("div",{style:"min-width:0;flex:1"},[
    el("div",{class:"nm"},[document.createTextNode(student.name + nickTag(student)),
      el("button",{class:"nickbtn",id:"nickBtn",title:n2x("nick"),"aria-label":n2x("nick"),text:"✎",onclick:()=>{ nickOpen = !nickOpen; draw(); }})]),
    el("div",{class:"sb"},[document.createTextNode(slotLabel(slotById(curSlot)) + "  "), schichtPill(student, curSlot), el("span",{id:"n2grade",class:"gpill big"})])
  ]));
  if(hasOutlet2()){
    const rr = dayRec(curSlot, student.id);
    const ob = el("button",{class:"opill"+(rr.outlet?" alt":""),title:t("switchTitle"),
      text:"\u21c4 " + (rr.outlet || S.settings.outlet || "\u2013")});
    ob.addEventListener("click", ()=>{ toggleOutlet(rr); persist();
      ob.className = "opill" + (rr.outlet ? " alt" : ""); ob.textContent = "\u21c4 " + (rr.outlet || S.settings.outlet || "\u2013"); });
    hd.appendChild(ob);
  }
  hd.appendChild(el("button",{class:"hbtn",text:"✕","aria-label":t("done"),onclick:close}));
  sh.appendChild(hd);
  const body = el("div",{class:"sheet-b"});
  sh.appendChild(body);
  const ft = el("div",{class:"sheet-f"});
  const ix = S.students.findIndex(x=>x.id===student.id);
  if(ix > 0) ft.appendChild(el("button",{class:"btn",text:"‹",
    onclick:()=>{ entsperren(); openSheet(S.students[ix-1]); }}));
  ft.appendChild(el("button",{class:"btn pri",text:t("done"),onclick:close}));
  if(ix < S.students.length-1) ft.appendChild(el("button",{class:"btn",text:"›",
    onclick:()=>{ entsperren(); openSheet(S.students[ix+1]); }}));
  sh.appendChild(ft);
  host.innerHTML = ""; host.appendChild(sh);

  function draw(){
    body.innerHTML = "";
    const r = dayRec(curSlot, student.id);
    n2ShowHead(student.id);
    const n2cg = n2Crit(curSlot, student.id);

    if(nickOpen) body.appendChild(n2NickBox(student, ()=>{ nickOpen = false; const nm0 = sh.querySelector(".sheet-h .nm");
      if(nm0 && nm0.firstChild) nm0.firstChild.textContent = student.name + nickTag(student); draw(); }));
    /* Anwesenheit */
    body.appendChild(el("span",{class:"eyebrow",style:"display:block;margin-bottom:7px",text:t("attendance")}));
    const att = el("div",{class:"att"});
    [["present",""],["late","warn"],["excused",""],["unexcused","bad"],["teamMarket","tm"]]
      .forEach(([k,cls],i)=>{
        const val = (k === "teamMarket") ? "tm" : k;
        att.appendChild(el("button",{class:cls,"aria-pressed":String((r.att||"present")===val),
          text:t(k), onclick:()=>{ r.att = val; persist(); draw(); }}));
      });
    body.appendChild(att);
    if((r.att||"present") === "late") body.appendChild(el("div",{class:"banner",style:"margin-top:9px",text:n2x("lateDay")}));
    if((r.att||"present") === "tm" && planSchicht(student, curSlot).toUpperCase() === "OC") body.appendChild(el("div",{class:"banner",style:"margin-top:9px",text:n2x("ocDay")}));

    /* Kriterien */
    body.appendChild(el("span",{class:"eyebrow",style:"display:block;margin:18px 0 7px",text:t("obs")}));
    const bar = el("div",{class:"critbar"});
    CRITS.forEach(c=>{
      const n = (r.obs||[]).filter(id=>CHIP[id] && CHIP[id].c === c.k).length;
      const b = el("button",{"aria-current":String(sheetCrit===c.k),
        onclick:()=>{ sheetCrit = c.k; sheetAll = false; draw(); }});
      b.appendChild(el("span",{text:critShort(c.k)}));
      if(n2cg) b.appendChild(el("span",{class:"cg",text:n2cg[c.k].toFixed(2)}));
      if(n) b.appendChild(el("span",{class:"n",text:"("+n+")"}));
      bar.appendChild(b);
    });
    bar.appendChild(el("button",{"aria-current":String(sheetCrit==="__note"),
      onclick:()=>{ sheetCrit = "__note"; draw(); }, text:"✎ "+t("note")}));
    body.appendChild(bar);

    if(sheetCrit === "__note"){
      const nt = r.note || {txt:""};
      const f = el("div",{class:"field"});
      const ta = el("textarea",{placeholder:t("notePh"),
        oninput:e=>{ r.note = {txt:e.target.value, crit:"", dir:0, w:0}; persist(); const ok = document.getElementById("noteOk"); if(ok) ok.textContent = n2x("saved"); },
        onblur:()=>persist()});
      ta.value = nt.txt || "";
      f.appendChild(ta);
      body.appendChild(f);
      body.appendChild(el("p",{class:"muted",style:"margin:0",text:t("noteHint")}));
      body.appendChild(el("p",{class:"muted",id:"noteOk",style:"margin:6px 0 0;font-size:13px;color:var(--plus,#2f7d4f)",text:""}));
      return;
    }

    const set = new Set(r.obs || []);
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
          const s2 = new Set(r.obs || []);
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
  /* Klasse und Gruppe als feste Listen, gleich wie in der Laptop-Datei. */
  const sf = (id, label, key, liste) => {
    const f = el("div",{class:"field"});
    f.appendChild(el("label",{for:id,text:label}));
    const cur = S.settings[key] || "";
    const opts = liste.slice();
    if(cur && opts.indexOf(cur) < 0) opts.push(cur);
    const sel = el("select",{id:id, onchange:e=>{
      S.settings[key] = e.target.value; persist();
      document.getElementById("brandSub").textContent = subLine();
    }});
    sel.appendChild(el("option",{value:"", text:"\u2013", selected: !cur}));
    opts.forEach(v=>sel.appendChild(el("option",{value:v, text:v, selected: cur === v})));
    f.appendChild(sel);
    return f;
  };
  g.appendChild(sf("mGroup", t("group"), "group", KLASSEN));
  g.appendChild(sf("mTeam",  t("team"),  "team",  GRUPPEN));
  c1.appendChild(g);
  c1.appendChild(tf("mOutlet",  t("outlet"),  "outlet"));
  const fO2 = tf("mOutlet2", t("outlet2"), "outlet2");
  fO2.appendChild(el("span",{class:"muted",text:t("outlet2Hint")}));
  c1.appendChild(fO2);
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
  ta.value = S.students.map(s=>studentZeile(s)).join("\n");
  f5.appendChild(ta);
  f5.appendChild(el("span",{class:"muted",text:t("studentHint")}));
  c1.appendChild(f5);
  c1.appendChild(el("button",{class:"btn pri wide",text:t("apply"),onclick:()=>{
    const lines = ta.value.split("\n").map(x=>x.trim()).filter(Boolean);
    S.students = lines.map(line=>{
      const g = parseStudentZeile(line);
      if(!g) return null;
      const ex = S.students.find(s=>
        (s.nachname||"").trim().toLowerCase() === g.nachname.toLowerCase() &&
        (s.vorname ||"").trim().toLowerCase() === g.vorname.toLowerCase());
      const o = ex ? {...ex, ...g, nick:g.nick||ex.nick||"", mail:g.mail||ex.mail||"", lang:g.lang||ex.lang||"",
                      klasse:g.klasse||ex.klasse||"", gruppe:g.gruppe||ex.gruppe||""}
                   : {id:"m"+Math.random().toString(36).slice(2,8), ...g};
      o.name = anzeigeName(o);
      return o;
    }).filter(Boolean);
    persist(); toast(S.students.length + " " + t("students"));
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

  /* Selbsttest */
  root.appendChild(el("h2",{class:"sec",text:t("selfTest")}));
  const c3 = el("div",{class:"card pad"});
  c3.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("selfTestHint")}));
  const tOut = el("div",{});
  c3.appendChild(el("button",{class:"btn wide",text:t("selfTestBtn"),onclick:()=>{
    const res = selfTest(), bad = res.filter(r=>!r.ok).length;
    tOut.innerHTML = "";
    tOut.appendChild(el("div",{style:"font-weight:700;margin:12px 0 6px;color:"
      + (bad ? "var(--minus)" : "var(--plus)"),
      text:(res.length-bad)+" / "+res.length+" "+t("selfTestOkN")}));
    res.forEach(r=>{
      const row = el("div",{style:"display:flex;gap:9px;align-items:flex-start;font-size:14px;"
        + "padding:7px 0;border-top:1px solid var(--line)"});
      row.appendChild(el("span",{style:"flex:0 0 15px;font-weight:700;color:"
        + (r.ok?"var(--plus)":"var(--minus)"), text:r.ok?"\u2713":"\u2717"}));
      row.appendChild(el("span",{style:"flex:1;line-height:1.35", text:r.name}));
      if(r.info) row.appendChild(el("span",{style:"color:var(--ink3);font-size:12.5px",text:r.info}));
      tOut.appendChild(row);
    });
    toast((res.length-bad)+" / "+res.length);
  }}));
  c3.appendChild(tOut);
  root.appendChild(c3);

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
         students:o.students||[],
         days: other ? {} : (o.days||{}),
         dayMeta: other ? {} : (o.dayMeta||{})};
    delete S.settings.isSample;
    L = (T[S.settings.uiLang] ? S.settings.uiLang : "de");
    persist();
    curSlot = slots()[0].id;
    view = "day"; render();
    toast(other ? t("loadPartial")
                : (t("loadDone") + ": " + S.students.length + " " + t("students")));
  }catch(err){ toast(t("loadBad")); }
}


/* ---------- Selbsttest ---------- */
function selfTest(){
  const out = []; const add = (n,c,i)=>out.push({name:n, ok:!!c, info:i==null?"":String(i)});
  const ids = CHIPS.map(c=>c.i);
  add(t("stChips"), ids.length === new Set(ids).size, CHIPS.length + " / " + CRITS.length);
  add(t("stCrit"), CHIPS.every(c=>CRITS.some(k=>k.k===c.c)));
  add(t("stAction"), CHIPS.filter(c=>c.d<0 && !c.ko).every(c=>c.a && c.a.de));
  const LG = ["de","en","th","zh"];
  add(t("stLang"), CHIPS.every(c=>LG.every(l=>c.t[l])) && CRITS.every(c=>LG.every(l=>c[l])));
  add(t("stLate"), !!CHIP["tea-lt"]);
  add(t("stSlots"), slots().every((s,i)=>s.id === "d"+String(i+1).padStart(2,"0")), slots().length + " " + t("days"));
  const wd = S.settings.weekdays || ["mo","tu","we","th"];
  const soll = wdName(wd[Math.max(0, Math.min(S.settings.startIdx||0, wd.length-1))]);
  add(t("stStart"), slotLabel(slots()[0]).indexOf(soll) === 0, soll);
  add(t("stQuick"), Object.keys(QUICK).every(k=>CRITS.some(c=>c.k===k))
      && Object.values(QUICK).every(a=>a.every(i=>!!CHIP[i])));
  add(t("stNames"), S.students.every(s => s.nachname || s.vorname), S.students.length);
  add(t("stClass"), !!(S.settings.group && S.settings.team),
      [S.settings.group, S.settings.team].filter(Boolean).join(" \u00b7 ") || "\u2013");
  add(t("stStore"), storeOK);
  return out;
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

