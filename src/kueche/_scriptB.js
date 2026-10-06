const CHIP = Object.fromEntries(CHIPS.map(c=>[c.i,c]));

/* ---- EHL Notenskala ---- */
const SCALE = [
  {min:5.75,de:"Ausgezeichnet",en:"Excellent",th:"ดีเยี่ยม",zh:"优秀"},
  {min:5.25,de:"Sehr gut",en:"Very good",th:"ดีมาก",zh:"很好"},
  {min:4.75,de:"Gut",en:"Good",th:"ดี",zh:"良好"},
  {min:4.25,de:"Befriedigend",en:"Satisfactory",th:"น่าพอใจ",zh:"满意"},
  {min:3.95,de:"Genügend",en:"Sufficient",th:"ผ่านเกณฑ์",zh:"及格"},
  {min:3.45,de:"Ungenügend",en:"Insufficient",th:"ไม่ผ่านเกณฑ์",zh:"不及格"},
  {min:2.5, de:"Schwach",en:"Weak",th:"อ่อน",zh:"较差"},
  {min:1.5, de:"Sehr schwach",en:"Very weak",th:"อ่อนมาก",zh:"很差"},
  {min:0,   de:"Nicht erbracht",en:"Nugatory",th:"ไม่มีผลงาน",zh:"未完成"}
];

/* ---- UI-Strings ---- */
const T = {
 de:{day:"Erfassen",week:"Übersicht",rep:"Beurteilung",data:"Daten",set:"Eintragen",
  present:"Anwesend",late:"Verspätet",excused:"Entschuldigt",unexcused:"Unentschuldigt",
  addObs:"Beobachtung",noObs:"Keine Abweichung – Tag zählt als «wie erwartet».",
  done:"Fertig",plus:"Läuft gut",minus:"Verbesserungspunkt",
  weekN:"Woche",wholeTurnus:"Ganzer Turnus",thisWeek:"Nur Woche",
  student:"Studierende/r",days:"Tage",abs:"Absenzen",total:"Gesamt",
  strengths:"Das läuft gut",improve:"Daran kannst du arbeiten",next:"Konkret für den nächsten Einsatz",
  notes:"Bemerkungen der Dozierenden",
  grade:"Note",copy:"Kopieren",copyAll:"Alle kopieren",copied:"Kopiert",mail:"E-Mail",
  noData:"Für diesen Zeitraum ist nichts erfasst.",excusedNote:"entschuldigt (zählt nicht)",
  unexcusedNote:"unentschuldigt (Tagesnote 1.0)",
  banner:"Die Daten bleiben nur in diesem Browser. Am Tagesende «Tag speichern» und die Datei an michael.pilman@ehl.ch senden. Oben rechts «📱 Tablet» wechselt zur Tablet-Ansicht.",
  hyg2:"Hygiene doppelt gewichten",base:"Basisnote «erfüllt die Erwartungen»",baseShort:"Basisnote",
  teamField:"Team",
  restoreTitle:"Sicherung einlesen",
  restoreHint:"Liest eine zuvor gespeicherte JSON zurück in diese Datei. Damit holen Sie Gruppe, Team, Outlet, Dozent, Turnus, alle Studierenden mit E-Mail-Adresse und alle erfassten Tage zurück, zum Beispiel nach einem Gerätewechsel.",
  restoreBtn:"⤒ Sicherung einlesen",restoreArm:"Ersetzt alles, nochmals klicken",
  restoreWarn:"Ersetzt den gesamten Inhalt dieser Datei. Sichern Sie vorher, falls Sie hier schon etwas erfasst haben.",
  restoreDone:"Sicherung eingelesen",restoreBad:"Datei nicht lesbar oder keine Küchenrapport-Sicherung",
  seedOff:"Beispieldaten löschen",group:"Gruppe / Outlet",teacher:"Dozent/in",
  studentList:"Studierende (eine Person pro Zeile)",apply:"Übernehmen",
  merge:"Rapporte zusammenführen",mergeHint:"JSON-Dateien der anderen Dozierenden auswählen. Namen und Einsatztage werden zusammengeführt.",
  exportJson:"Sicherung (JSON)",exportCsv:"CSV",exportXlsx:"Excel (.xlsx)",exportTxt:"Text (.txt)",
  printPdf:"Drucken / PDF",
  daysCounted:"gewertete Tage",obsCount:"Beobachtungen",topObs:"Häufigste Beobachtungen",
  emailSubj:"Küchenrapport",openDay:"Tag erfassen",
  openDayHint:"Dieser Einsatztag ist noch nicht erfasst. Alle Studierenden starten anwesend auf der Basisnote; erfasst wird nur, was abweicht.",
  dropDay:"Tag verwerfen",notRec:"offen",
  turnus:"Turnus",slotCount:"Anzahl Einsatztage",weekdaysLbl:"Einsatztage pro Woche",
  startOn:"Turnus startet am",turnusHint:"Der Turnus zählt Einsatztage, keine Kalenderdaten. Eine Study Week dazwischen ändert deshalb nichts an der Nummerierung.",
  note:"Freitext",noteTab:"Freitext",
  noteHint:"Für alles, was in den Bausteinen nicht vorkommt. Wirkt nur auf die Note, wenn du unten ein Kriterium und eine Wirkung wählst.",
  noteCrit:"Kriterium",noteEffect:"Wirkung auf die Note",neutral:"nur Bemerkung, keine Notenwirkung",
  langPack:"Weitere Sprache",langExport:"Vorlage exportieren",langImport:"Sprachpaket importieren",
  langHint:"Vorlage exportieren, übersetzen lassen, wieder importieren. Die Sprache erscheint danach in beiden Auswahlfeldern.",
  langDel:"Entfernen",calc:"Rechenlogik",
  examDay:"Exam Day",examShort:"Prüfung",praxis:"Praxis",
  praxisGrade:"Praxisnote",examGrade:"Prüfungsnote",finalGrade:"Schlussnote",
  examOn:"Letzter Einsatztag ist der Exam Day",
  examHint:"Der Exam Day wird mit demselben Raster bewertet, fliesst aber nicht in die Praxisnote ein, sondern wird separat ausgewiesen.",
  examBadge:"Prüfungstag mit gleichem Raster und eigener Note.",
  examOpen:"Exam Day noch nicht erfasst",
  finalMode:"Schlussnote berechnen",
  fmNone:"getrennt ausweisen, keine Schlussnote",fmPraxis:"nur Praxisnote",
  fm50:"50 % Praxis + 50 % Exam",fm67:"2/3 Praxis + 1/3 Exam",
  internal:"Nur interne Notiz, nicht in der Beurteilung",
  absent:"Abwesend",
  examAbsHint:"Abwesend am Exam Day ergibt die Note 1.00, unabhängig vom Grund. Nach einer Nachprüfung den Eintrag überschreiben.",
  takeaway:"Das nimmst du mit",gain:"Hier holst du am meisten heraus",
  observed:"Beobachtet",nextStep:"Dein nächster Schritt",
  cl1:"Starke Leistung. Halte dieses Niveau und nimm dir die Punkte oben gezielt vor, dann liegt noch mehr drin.",
  cl2:"Solide Arbeit. Mit den Punkten oben holst du im nächsten Einsatz am meisten heraus.",
  cl3:"Die Basis steht. Nimm dir die Punkte oben einzeln vor, dann wirst du merklich sicherer.",
  cl4:"Hier ist Luft nach oben, und die Punkte oben sind konkret machbar. Melde dich, wenn du dabei Unterstützung brauchst.",
  weightNote:"Hygiene zählt doppelt. Anwesenheit und Pünktlichkeit wirken stark auf die Note.",
  storeWarn:"Dieses Gerät speichert nichts dauerhaft. Exportiere den Rapport am Ende jedes Einsatztages, sonst gehen die Eingaben verloren.",
  byTeacher:"Erfasst von",outlet:"Abteilung",
  studentListHint:"Nachname; Vorname; Nickname; E-Mail; Sprache; Klasse; Gruppe  —  nur der Nachname ist Pflicht. Beispiel: Ammann; Lea; Lulu; lea.ammann@stud.ehl.edu; de; HFE1; Gruppe 1",
  klasseField:"Klasse",gruppeField:"Gruppe / Team",
  kgHint:"Gilt für alle Studierenden dieser Datei. In der Namensliste lässt sich beides pro Person überschreiben.",
  absMailCols:"Zeilenaufbau: Nachname, Vorname «Nickname» · Klasse · Gruppe — Grund",
  repLang:"Sprache der Beurteilung",repLangAll:"Sprache für alle setzen",
  absMailTitle:"Absenzen und Verspätungen melden",
  absMailBtn:"Meldung an die Kursleitung",
  absMailNone:"Keine Absenzen und keine Verspätungen an diesem Einsatztag.",
  absMailHint:"Bitte zusammen mit der Tagessicherung senden. Die Meldung geht an",
  absMailSubj:"Absenzen Küchenpraxis",
  absMailSent:"E-Mail vorbereitet",
  sheetPrint:"Erfassungsblatt drucken",
  sheetDay:"Tagesblatt, alle Studierenden",
  sheetSingle:"Einzelbl\u00e4tter, ein Blatt pro Person",
  sheetTitle:"Erfassungsblatt K\u00fcchenpraxis",
  sheetNotes:"Notizen",sheetLegend:"Kriterien",
  sheetHintDay:"Pro Kriterium ein Kreuz bei + oder \u2212, Einzelheiten in die Notizen. Danach im Programm nacherfassen.",
  sheetHintSingle:"Zutreffendes ankreuzen. Danach im Programm nacherfassen.",
  sheetAttShort:"Anw · Versp · Ents · Unent · TM",dateLbl:"Datum",
  email:"E-Mail",noMail:"Keine E-Mail-Adresse hinterlegt",
  hideBanner:"Hinweisfeld ausblenden",display:"Anzeige",
  fixedRules:"Fest eingestellt",examFixed:"Tag 10 ist der Exam Day",daysFixed:"Einsatztage",
  backupTitle:"Sicherung",
  ovMailBtn:"Übersicht an die Kursleitung",ovMailSubj:"Notenübersicht Küchenpraxis",
  ovMailFoot:"Details und Beobachtungsnachweis stehen in der Excel-Datei:",
  ovCName:"Name",ovCDays:"Tage",ovCPraxis:"Praxis",ovCExam:"Exam",ovCFinal:"Schluss",ovCTotal:"Note",
  ovMailHint:"Schickt die Tabelle dieser Seite als Text an die Kursleitung: Gruppe, Team, Outlet, Turnus und pro Person die Noten und die Absenzen. Details bleiben in der Excel-Datei.",
  ovMailSent:"E-Mail vorbereitet",ovMailNone:"Noch keine Noten zum Senden.",
  backupHint:"Speichert die ganze Datei als JSON: Gruppe, Team, Outlet, Dozent, Turnus mit Starttag, alle Studierenden mit E-Mail-Adresse und Beurteilungssprache, alle erfassten Einsatztage und alle Einstellungen. Das ist die Datei, die Michael Pilman zum Zusammenführen braucht.",
  backupBtn:"⤓ Ganze Datei sichern (JSON)",backupDone:"Sicherung gespeichert",
  reset:"Alles zurücksetzen",resetConfirm:"Wirklich alles löschen?",
  resetHint:"Löscht Studierende, alle Einsatztage und die Gruppenangaben und hinterlässt eine leere Datei. Die Spracheinstellung bleibt. Exportieren Sie vorher eine Sicherung.",
  resetDone:"Datei zurückgesetzt",
  storeFile:"Speicher dieser Datei",
  teamMarket:"Team Market",tmDay:"Team Market, dieser Tag zählt mit 5.00",
  saveDay:"Tag speichern",savedAs:"Gespeichert",
  saveDayHint:"Zwei getrennte Knöpfe: der erste öffnet «Speichern unter» und legt den ganzen Rapport als JSON ab, Dateiname aus Dozent, Gruppe, Outlet, Variante und heutigem Datum. Der zweite bereitet die Meldung an die Kursleitung vor. Beide gehören zum Tagesabschluss.",
  groupOnly:"Gruppe",outletField:"Outlet / Abteilung",absTm:"Absenzen · TM",
  variantLbl:"Variante",wrongVariant:"Passt nicht in diese Datei",
  halfPlace:"Halbturnus einordnen",halfAuto:"automatisch",
  halfFirst:"als erste Hälfte",halfSecond:"als zweite Hälfte",
  halfHint:"Dateien mit 5 Tagen und mit 4 Tagen plus Exam werden auf die zehn Einsatztage verteilt. Automatisch bedeutet: die 5 Tage werden zur ersten Hälfte, die 4 Tage plus Exam zur zweiten.",
  placedAs:"eingeordnet",
  vExam:"Exam Day",vNoExam:"ohne Exam Day",vDays:"Einsatztage"},
 en:{day:"Record",week:"Overview",rep:"Feedback",data:"Data",set:"Setup",
  present:"Present",late:"Late",excused:"Excused",unexcused:"Unexcused",
  addObs:"Observation",noObs:"No deviation – day counts as “as expected”.",
  done:"Done",plus:"Going well",minus:"To improve",
  weekN:"Week",wholeTurnus:"Whole rotation",thisWeek:"This week only",
  student:"Student",days:"Days",abs:"Absences",total:"Overall",
  strengths:"What is going well",improve:"What to work on",next:"Concretely, next shift",
  notes:"Lecturer remarks",
  grade:"Grade",copy:"Copy",copyAll:"Copy all",copied:"Copied",mail:"E-mail",
  noData:"Nothing recorded for this period.",excusedNote:"excused (not counted)",
  unexcusedNote:"unexcused (daily grade 1.0)",
  banner:"Data stays in this browser only. At the end of the day, «Save day» and send the file to michael.pilman@ehl.ch. «📱 Tablet» at the top right switches to the tablet view.",
  hyg2:"Weight hygiene double",base:"Baseline grade “meets expectations”",baseShort:"Baseline grade",
  teamField:"Team",
  restoreTitle:"Load a backup",
  restoreHint:"Reads a previously saved JSON back into this file. It brings back group, team, outlet, lecturer, rotation, all students with their e-mail addresses and every recorded day, for example after changing device.",
  restoreBtn:"⤒ Load a backup",restoreArm:"Replaces everything, click again",
  restoreWarn:"Replaces the whole content of this file. Save a backup first if you have already recorded something here.",
  restoreDone:"Backup loaded",restoreBad:"File unreadable or not a kitchen report backup",
  seedOff:"Delete sample data",group:"Group / outlet",teacher:"Lecturer",
  studentList:"Students (one per line)",apply:"Apply",
  merge:"Merge reports",mergeHint:"Select the other lecturers' JSON files. Names and shift days are merged.",
  exportJson:"Backup (JSON)",exportCsv:"CSV",exportXlsx:"Excel (.xlsx)",exportTxt:"Text (.txt)",
  printPdf:"Print / PDF",
  daysCounted:"counted days",obsCount:"observations",topObs:"Most frequent observations",
  emailSubj:"Kitchen report",openDay:"Open this day",
  openDayHint:"This shift day is not recorded yet. Everyone starts present at the baseline; you only record what deviates.",
  dropDay:"Discard day",notRec:"open",
  turnus:"Rotation",slotCount:"Number of shift days",weekdaysLbl:"Shift days per week",
  startOn:"Rotation starts on",turnusHint:"The rotation counts shift days, not calendar dates. A study week in between therefore changes nothing.",
  note:"Free text",noteTab:"Free text",
  noteHint:"For anything the building blocks do not cover. It only affects the grade if you pick a criterion and an effect below.",
  noteCrit:"Criterion",noteEffect:"Effect on the grade",neutral:"remark only, no effect on the grade",
  langPack:"Additional language",langExport:"Export template",langImport:"Import language pack",
  langHint:"Export the template, have it translated, import it again. The language then appears in both selectors.",
  langDel:"Remove",calc:"Calculation",
  examDay:"Exam Day",examShort:"Exam",praxis:"Practice",
  praxisGrade:"Practice grade",examGrade:"Exam grade",finalGrade:"Final grade",
  examOn:"Last shift day is the Exam Day",
  examHint:"The Exam Day uses the same rubric but is reported separately instead of feeding into the practice grade.",
  examBadge:"Exam day, same rubric, its own grade.",
  examOpen:"Exam Day not recorded yet",
  finalMode:"Calculate final grade",
  fmNone:"report separately, no final grade",fmPraxis:"practice grade only",
  fm50:"50 % practice + 50 % exam",fm67:"2/3 practice + 1/3 exam",
  internal:"Internal note only, not in the feedback",
  absent:"Absent",
  examAbsHint:"Being absent on the Exam Day gives a 1.00, whatever the reason. After a re-sit, overwrite the entry.",
  takeaway:"What you take with you",gain:"Where you gain the most",
  observed:"Observed",nextStep:"Your next step",
  cl1:"Strong performance. Hold this level and work on the points above, then there is even more in it.",
  cl2:"Solid work. The points above are where you gain most on your next shift.",
  cl3:"The basics are there. Take the points above one at a time and you will feel noticeably more confident.",
  cl4:"There is room to grow, and the points above are concrete and doable. Come and ask if you want support.",
  weightNote:"Hygiene counts double. Attendance and punctuality weigh heavily on the grade.",
  storeWarn:"This device does not store anything permanently. Export the report at the end of each shift day or your entries are lost.",
  byTeacher:"Recorded by",outlet:"Outlet",
  studentListHint:"Last name; First name; Nickname; E-mail; Language; Class; Group  —  only the last name is required. Example: Ammann; Lea; Lulu; lea.ammann@stud.ehl.edu; de; HFE1; Gruppe 1",
  klasseField:"Class",gruppeField:"Group / Team",
  kgHint:"Applies to all students in this file. Both can be overridden per person in the student list.",
  absMailCols:"Line format: Last name, First name “Nickname” · Class · Group — Reason",
  repLang:"Feedback language",repLangAll:"Set the language for everyone",
  absMailTitle:"Report absences and lateness",
  absMailBtn:"Report to the course lead",
  absMailNone:"No absences and no lateness on this shift day.",
  absMailHint:"Please send it together with the daily backup. The report goes to",
  absMailSubj:"Absences kitchen practice",
  absMailSent:"E-mail prepared",
  sheetPrint:"Print a paper sheet",
  sheetDay:"Day sheet, all students",
  sheetSingle:"Individual sheets, one per person",
  sheetTitle:"Recording sheet kitchen practice",
  sheetNotes:"Notes",sheetLegend:"Criteria",
  sheetHintDay:"One tick at + or \u2212 per criterion, details in the notes. Enter it in the programme afterwards.",
  sheetHintSingle:"Tick what applies. Enter it in the programme afterwards.",
  sheetAttShort:"Pres · Late · Exc · Unexc · TM",dateLbl:"Date",
  email:"E-mail",noMail:"No e-mail address stored",
  hideBanner:"Hide the notice",display:"Display",
  fixedRules:"Fixed",examFixed:"Day 10 is the Exam Day",daysFixed:"shift days",
  backupTitle:"Backup",
  ovMailBtn:"Overview to the course lead",ovMailSubj:"Grade overview kitchen practice",
  ovMailFoot:"Detail and observation record are in the Excel file:",
  ovCName:"Name",ovCDays:"Days",ovCPraxis:"Practice",ovCExam:"Exam",ovCFinal:"Final",ovCTotal:"Grade",
  ovMailHint:"Sends the table of this page as text to the course lead: group, team, outlet, rotation and per person the grades and the absences. The detail stays in the Excel file.",
  ovMailSent:"E-mail prepared",ovMailNone:"No grades to send yet.",
  backupHint:"Saves the whole file as JSON: group, team, outlet, lecturer, rotation with start day, all students with e-mail address and feedback language, every recorded shift day and all settings. This is the file Michael Pilman needs for merging.",
  backupBtn:"⤓ Back up the whole file (JSON)",backupDone:"Backup saved",
  reset:"Reset everything",resetConfirm:"Really delete everything?",
  resetHint:"Deletes students, all shift days and the group details and leaves an empty file. The language setting is kept. Export a backup first.",
  resetDone:"File reset",
  storeFile:"Storage of this file",
  teamMarket:"Team Market",tmDay:"Team Market, this day counts as 5.00",
  saveDay:"Save day",savedAs:"Saved",
  saveDayHint:"Two separate buttons: the first opens “Save as” and stores the whole report as JSON, named after lecturer, group, outlet, variant and today's date. The second prepares the report to the course lead. Both belong to closing the day.",
  groupOnly:"Group",outletField:"Outlet / department",absTm:"Absences · TM",
  variantLbl:"Variant",wrongVariant:"Does not fit this file",
  halfPlace:"Place half rotation",halfAuto:"automatic",
  halfFirst:"as the first half",halfSecond:"as the second half",
  halfHint:"Files with 5 days and with 4 days plus exam are mapped onto the ten shift days. Automatic means: the 5 days become the first half, the 4 days plus exam the second.",
  placedAs:"placed",
  vExam:"Exam Day",vNoExam:"no Exam Day",vDays:"shift days"},
 th:{day:"บันทึก",week:"ภาพรวม",rep:"ผลประเมิน",data:"ข้อมูล",set:"กรอกข้อมูล",
  present:"มาเรียน",late:"มาสาย",excused:"ลา (แจ้งแล้ว)",unexcused:"ขาด (ไม่แจ้ง)",
  addObs:"ข้อสังเกต",noObs:"ไม่มีข้อสังเกต – นับว่า «เป็นไปตามที่คาดหวัง»",
  done:"เสร็จสิ้น",plus:"ทำได้ดี",minus:"ควรพัฒนา",
  weekN:"สัปดาห์",wholeTurnus:"ทั้งรอบฝึก",thisWeek:"เฉพาะสัปดาห์นี้",
  student:"นักศึกษา",days:"วัน",abs:"การขาด",total:"รวม",
  strengths:"จุดแข็ง",improve:"สิ่งที่ควรพัฒนา",next:"สิ่งที่ควรทำในครั้งถัดไป",
  notes:"ความเห็นจากผู้สอน",
  grade:"คะแนน",copy:"คัดลอก",copyAll:"คัดลอกทั้งหมด",copied:"คัดลอกแล้ว",mail:"อีเมล",
  noData:"ไม่มีข้อมูลในช่วงเวลานี้",excusedNote:"ลา (ไม่นับคะแนน)",
  unexcusedNote:"ขาดโดยไม่แจ้ง (คะแนนวันนั้น 1.0)",
  banner:"ข้อมูลเก็บไว้ในเบราว์เซอร์นี้เท่านั้น เมื่อจบวันให้บันทึกข้อมูลของวันแล้วส่งไฟล์ถึง michael.pilman@ehl.ch ปุ่ม «📱 Tablet» มุมขวาบนจะเปลี่ยนเป็นมุมมองแท็บเล็ต",
  hyg2:"ให้น้ำหนักสุขอนามัยสองเท่า",base:"คะแนนพื้นฐาน «เป็นไปตามที่คาดหวัง»",baseShort:"คะแนนพื้นฐาน",
  teamField:"ทีม",
  restoreTitle:"โหลดไฟล์สำรอง",
  restoreHint:"อ่านไฟล์ JSON ที่เคยบันทึกไว้กลับเข้าไฟล์นี้ จะได้กลุ่ม ทีม เอาต์เล็ต ผู้สอน รอบฝึก รายชื่อนักศึกษาพร้อมอีเมล และวันฝึกที่บันทึกไว้ทั้งหมดกลับคืนมา เช่น หลังเปลี่ยนอุปกรณ์",
  restoreBtn:"⤒ โหลดไฟล์สำรอง",restoreArm:"จะแทนที่ทั้งหมด กดอีกครั้ง",
  restoreWarn:"จะแทนที่เนื้อหาทั้งหมดของไฟล์นี้ หากบันทึกข้อมูลไว้แล้ว ควรสำรองก่อน",
  restoreDone:"โหลดไฟล์สำรองแล้ว",restoreBad:"อ่านไฟล์ไม่ได้ หรือไม่ใช่ไฟล์สำรองของรายงานครัว",
  seedOff:"ลบข้อมูลตัวอย่าง",group:"กลุ่ม / เอาต์เล็ต",teacher:"ผู้สอน",
  studentList:"นักศึกษา (บรรทัดละหนึ่งคน)",apply:"ใช้งาน",
  merge:"รวมรายงาน",mergeHint:"เลือกไฟล์ JSON ของผู้สอนคนอื่น ระบบจะรวมชื่อและวันฝึกให้",
  exportJson:"สำรองข้อมูล (JSON)",exportCsv:"CSV",exportXlsx:"Excel (.xlsx)",exportTxt:"ข้อความ (.txt)",
  printPdf:"พิมพ์ / PDF",
  daysCounted:"วันที่นับคะแนน",obsCount:"ข้อสังเกต",topObs:"ข้อสังเกตที่พบบ่อย",
  emailSubj:"รายงานครัว",openDay:"เปิดบันทึกวันนี้",
  openDayHint:"ยังไม่ได้บันทึกวันฝึกนี้ ทุกคนเริ่มที่คะแนนพื้นฐานและถือว่ามาเรียน บันทึกเฉพาะสิ่งที่แตกต่าง",
  dropDay:"ยกเลิกวันนี้",notRec:"ยังไม่บันทึก",
  turnus:"รอบฝึก",slotCount:"จำนวนวันฝึก",weekdaysLbl:"วันฝึกต่อสัปดาห์",
  startOn:"รอบฝึกเริ่มวัน",turnusHint:"รอบฝึกนับเป็นวันฝึก ไม่ใช่วันที่ในปฏิทิน สัปดาห์อ่านหนังสือคั่นจึงไม่กระทบลำดับ",
  note:"ข้อความอิสระ",noteTab:"ข้อความอิสระ",
  noteHint:"สำหรับสิ่งที่ไม่มีในรายการสำเร็จรูป จะมีผลต่อคะแนนก็ต่อเมื่อเลือกหัวข้อและผลกระทบด้านล่าง",
  noteCrit:"หัวข้อประเมิน",noteEffect:"ผลต่อคะแนน",neutral:"บันทึกอย่างเดียว ไม่มีผลต่อคะแนน",
  langPack:"เพิ่มภาษา",langExport:"ส่งออกแม่แบบ",langImport:"นำเข้าชุดภาษา",
  langHint:"ส่งออกแม่แบบ แปล แล้วนำเข้ากลับมา ภาษานั้นจะปรากฏในช่องเลือกทั้งสอง",
  langDel:"ลบ",calc:"วิธีคำนวณ",
  examDay:"วันสอบ (Exam Day)",examShort:"สอบ",praxis:"ภาคปฏิบัติ",
  praxisGrade:"คะแนนภาคปฏิบัติ",examGrade:"คะแนนสอบ",finalGrade:"คะแนนสรุป",
  examOn:"วันฝึกสุดท้ายเป็นวันสอบ",
  examHint:"วันสอบใช้เกณฑ์เดียวกัน แต่แยกคะแนนออกจากคะแนนภาคปฏิบัติ",
  examBadge:"วันสอบ ใช้เกณฑ์เดียวกัน คะแนนแยกต่างหาก",
  examOpen:"ยังไม่ได้บันทึกวันสอบ",
  finalMode:"คำนวณคะแนนสรุป",
  fmNone:"แยกแสดง ไม่มีคะแนนสรุป",fmPraxis:"เฉพาะคะแนนภาคปฏิบัติ",
  fm50:"ปฏิบัติ 50 % + สอบ 50 %",fm67:"ปฏิบัติ 2/3 + สอบ 1/3",
  internal:"บันทึกภายในเท่านั้น ไม่แสดงในผลประเมิน",
  absent:"ขาด",
  examAbsHint:"ขาดสอบในวันสอบได้คะแนน 1.00 ไม่ว่าด้วยเหตุผลใด หากสอบซ่อมแล้วให้แก้ไขบันทึกทับ",
  takeaway:"สิ่งที่คุณทำได้ดี",gain:"จุดที่จะพัฒนาได้มากที่สุด",
  observed:"สิ่งที่สังเกตเห็น",nextStep:"ก้าวต่อไปของคุณ",
  cl1:"ผลงานดีมาก รักษาระดับนี้ไว้และพัฒนาตามจุดข้างต้น จะยิ่งดีขึ้นอีก",
  cl2:"ทำได้ดี จุดข้างต้นคือสิ่งที่จะช่วยให้ครั้งต่อไปดีขึ้นมากที่สุด",
  cl3:"พื้นฐานมั่นคงแล้ว ค่อย ๆ พัฒนาทีละจุดตามข้างต้น แล้วจะมั่นใจขึ้นชัดเจน",
  cl4:"ยังมีพื้นที่ให้พัฒนา และจุดข้างต้นทำได้จริง หากต้องการความช่วยเหลือ บอกได้เสมอ",
  weightNote:"สุขอนามัยคิดเป็นสองเท่า การมาเรียนและตรงต่อเวลามีผลต่อคะแนนมาก",
  storeWarn:"อุปกรณ์นี้ไม่บันทึกข้อมูลถาวร กรุณาส่งออกรายงานเมื่อจบแต่ละวัน มิฉะนั้นข้อมูลจะหาย",
  byTeacher:"บันทึกโดย",outlet:"แผนก",
  studentListHint:"นามสกุล; ชื่อ; ชื่อเล่น; อีเมล; ภาษา; ชั้นเรียน; กลุ่ม  —  จำเป็นเฉพาะนามสกุล ตัวอย่าง: Ammann; Lea; Lulu; lea.ammann@stud.ehl.edu; de; HFE1; Gruppe 1",
  klasseField:"ชั้นเรียน",gruppeField:"กลุ่ม / ทีม",
  kgHint:"ใช้กับนักศึกษาทุกคนในไฟล์นี้ และกำหนดรายบุคคลทับได้ในรายชื่อ",
  absMailCols:"รูปแบบบรรทัด: นามสกุล ชื่อ «ชื่อเล่น» · ชั้นเรียน · กลุ่ม — เหตุผล",
  repLang:"ภาษาของผลประเมิน",repLangAll:"ตั้งภาษาให้ทุกคน",
  absMailTitle:"รายงานการขาดและมาสาย",
  absMailBtn:"ส่งรายงานถึงผู้ดูแลหลักสูตร",
  absMailNone:"วันนี้ไม่มีการขาดและไม่มีการมาสาย",
  absMailHint:"กรุณาส่งพร้อมกับไฟล์สำรองของวัน โดยส่งไปที่",
  absMailSubj:"การขาด การฝึกครัว",
  absMailSent:"เตรียมอีเมลแล้ว",
  sheetPrint:"\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e41\u0e1a\u0e1a\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e01\u0e23\u0e30\u0e14\u0e32\u0e29",
  sheetDay:"\u0e41\u0e1c\u0e48\u0e19\u0e23\u0e32\u0e22\u0e27\u0e31\u0e19 \u0e23\u0e27\u0e21\u0e19\u0e31\u0e01\u0e28\u0e36\u0e01\u0e29\u0e32\u0e17\u0e38\u0e01\u0e04\u0e19",
  sheetSingle:"\u0e41\u0e1c\u0e48\u0e19\u0e23\u0e32\u0e22\u0e1a\u0e38\u0e04\u0e04\u0e25 \u0e04\u0e19\u0e25\u0e30\u0e41\u0e1c\u0e48\u0e19",
  sheetTitle:"\u0e41\u0e1a\u0e1a\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e01\u0e32\u0e23\u0e1d\u0e36\u0e01\u0e04\u0e23\u0e31\u0e27",
  sheetNotes:"\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01",sheetLegend:"\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d\u0e1b\u0e23\u0e30\u0e40\u0e21\u0e34\u0e19",
  sheetHintDay:"\u0e17\u0e33\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e2b\u0e21\u0e32\u0e22\u0e17\u0e35\u0e48 + \u0e2b\u0e23\u0e37\u0e2d \u2212 \u0e02\u0e2d\u0e07\u0e41\u0e15\u0e48\u0e25\u0e30\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d \u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e40\u0e02\u0e35\u0e22\u0e19\u0e43\u0e19\u0e0a\u0e48\u0e2d\u0e07\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01 \u0e41\u0e25\u0e49\u0e27\u0e04\u0e48\u0e2d\u0e22\u0e01\u0e23\u0e2d\u0e01\u0e43\u0e19\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21",
  sheetHintSingle:"\u0e17\u0e33\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e2b\u0e21\u0e32\u0e22\u0e15\u0e32\u0e21\u0e08\u0e23\u0e34\u0e07 \u0e41\u0e25\u0e49\u0e27\u0e04\u0e48\u0e2d\u0e22\u0e01\u0e23\u0e2d\u0e01\u0e43\u0e19\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21",
  sheetAttShort:"\u0e21\u0e32 · \u0e2a\u0e32\u0e22 · \u0e25\u0e32 · \u0e02\u0e32\u0e14 · TM",
  email:"อีเมล",noMail:"ไม่มีอีเมล",
  hideBanner:"ซ่อนข้อความแจ้งเตือน",display:"การแสดงผล",
  fixedRules:"กำหนดตายตัว",examFixed:"วันที่ 10 คือวันสอบ",daysFixed:"วันฝึก",
  backupTitle:"สำรองข้อมูล",
  ovMailBtn:"ส่งภาพรวมถึงผู้ดูแลหลักสูตร",ovMailSubj:"ภาพรวมคะแนน การปฏิบัติงานครัว",
  ovMailFoot:"รายละเอียดและหลักฐานข้อสังเกตอยู่ในไฟล์ Excel:",
  ovCName:"ชื่อ",ovCDays:"วัน",ovCPraxis:"ปฏิบัติ",ovCExam:"สอบ",ovCFinal:"รวม",ovCTotal:"คะแนน",
  ovMailHint:"ส่งตารางในหน้านี้เป็นข้อความถึงผู้ดูแลหลักสูตร ได้แก่ กลุ่ม ทีม เอาต์เล็ต รอบฝึก และคะแนนกับการขาดของแต่ละคน รายละเอียดยังอยู่ในไฟล์ Excel",
  ovMailSent:"เตรียมอีเมลแล้ว",ovMailNone:"ยังไม่มีคะแนนที่จะส่ง",
  backupHint:"บันทึกไฟล์ทั้งหมดเป็น JSON ได้แก่ กลุ่ม ทีม เอาต์เล็ต ผู้สอน รอบฝึกพร้อมวันเริ่ม รายชื่อนักศึกษาทั้งหมดพร้อมอีเมลและภาษาของผลประเมิน วันฝึกที่บันทึกไว้ทั้งหมด และการตั้งค่าทั้งหมด ไฟล์นี้คือไฟล์ที่ Michael Pilman ใช้รวมข้อมูล",
  backupBtn:"⤓ สำรองไฟล์ทั้งหมด (JSON)",backupDone:"บันทึกสำรองแล้ว",
  reset:"ล้างข้อมูลทั้งหมด",resetConfirm:"ยืนยันลบทั้งหมด?",
  resetHint:"ลบรายชื่อนักศึกษา วันฝึกทั้งหมด และข้อมูลกลุ่ม เหลือไฟล์เปล่า การตั้งค่าภาษาจะยังอยู่ ควรส่งออกสำรองก่อน",
  resetDone:"ล้างข้อมูลแล้ว",
  storeFile:"พื้นที่เก็บของไฟล์นี้",
  teamMarket:"Team Market",tmDay:"Team Market วันนี้นับเป็น 5.00",
  saveDay:"บันทึกวันนี้",savedAs:"บันทึกแล้ว",
  saveDayHint:"มีสองปุ่มแยกกัน ปุ่มแรกจะเปิด «บันทึกเป็น» และเก็บรายงานทั้งหมดเป็น JSON ชื่อไฟล์จากผู้สอน กลุ่ม เอาต์เล็ต รูปแบบ และวันที่วันนี้ ปุ่มที่สองเตรียมรายงานถึงผู้ดูแลหลักสูตร ทั้งสองอย่างเป็นส่วนหนึ่งของการปิดวัน",
  groupOnly:"กลุ่ม",outletField:"เอาต์เล็ต / แผนก",absTm:"การขาด · TM",
  variantLbl:"รูปแบบ",wrongVariant:"ไม่ตรงกับไฟล์นี้",
  halfPlace:"จัดครึ่งรอบ",halfAuto:"อัตโนมัติ",
  halfFirst:"เป็นครึ่งแรก",halfSecond:"เป็นครึ่งหลัง",
  halfHint:"ไฟล์ 5 วัน และ 4 วันพร้อมสอบ จะถูกจัดเข้าสิบวันฝึก อัตโนมัติหมายถึง 5 วันเป็นครึ่งแรก และ 4 วันพร้อมสอบเป็นครึ่งหลัง",
  placedAs:"จัดเข้า",
  vExam:"วันสอบ",vNoExam:"ไม่มีวันสอบ",vDays:"วันฝึก"} ,
 /* Chinesisch dient nur als Ausgabesprache fuer die Beurteilung, nicht als Bedienoberflaeche. */
 zh:{day:"记录",week:"总览",rep:"评估",data:"数据",set:"设置",
  present:"出勤",late:"迟到",excused:"请假",unexcused:"旷工",absent:"缺席",
  addObs:"观察记录",noObs:"无偏差，本日按「符合预期」计",
  done:"完成",plus:"表现良好",minus:"待改进",
  weekN:"第",wholeTurnus:"整个轮次",thisWeek:"仅本周",
  student:"学生",days:"天数",abs:"缺勤",total:"总评",
  strengths:"表现良好之处",improve:"待改进之处",next:"下次上岗的具体建议",
  notes:"教师备注",
  takeaway:"你做得好的地方",gain:"你最有提升空间的地方",
  observed:"观察到",nextStep:"你的下一步",
  grade:"成绩",copy:"复制",copyAll:"全部复制",copied:"已复制",mail:"邮件",
  noData:"该时段没有记录。",excusedNote:"已请假（不计入）",
  unexcusedNote:"旷工（当日成绩 1.00）",
  base:"基准分「符合预期」",hyg2:"卫生双倍计分",
  group:"班级 / 部门",teacher:"授课教师",
  daysCounted:"个计分日",obsCount:"条观察记录",
  emailSubj:"厨房实践评估",
  examDay:"考核日",examShort:"考核",praxis:"实践",
  praxisGrade:"实践成绩",examGrade:"考核成绩",finalGrade:"最终成绩",
  teamMarket:"Team Market",
  cl1:"表现出色。保持这个水平，并针对上述几点继续打磨，还能更进一步。",
  cl2:"完成得扎实。上述几点是你下次上岗提升最快的地方。",
  cl3:"基础已经具备。把上述几点逐条攻克，你会明显变得更有把握。",
  cl4:"还有提升空间，而上述几点都是具体可行的。需要支持时随时来找我们。",
  weightNote:"卫生按双倍计分。出勤与守时对成绩影响很大。",
  fleiss:"",internal:""}
};

/* ---- Sprachauflösung (Basissprachen + importierte Pakete) ---- */
let L = "de";
const packs = () => (S.settings.customLangs || {});
const pack  = lg => packs()[lg] || null;
const UI_LANGS  = [{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"th",name:"ไทย"}];
const OUT_LANGS = [{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"zh",name:"中文"}];
function langList(which){ return (which === "out") ? OUT_LANGS : UI_LANGS; }
/* Ausgabesprache: erst die Wahl bei der Person, sonst die Voreinstellung der Datei. */
const outLangOf = st => (st && st.lang) || S.settings.outLang || "de";
function t(key){
  const p = pack(L);
  if(p && p.ui && p.ui[key]) return p.ui[key];
  return (T[L] && T[L][key]) || T.de[key] || key;
}
function tOut(key, lg){
  lg = lg || S.settings.outLang;
  const p = pack(lg);
  if(p && p.ui && p.ui[key]) return p.ui[key];
  return (T[lg] && T[lg][key]) || T.de[key] || key;
}
function critName(k, lg){
  lg = lg || S.settings.outLang;
  const p = pack(lg); if(p && p.crits && p.crits[k]) return p.crits[k];
  const c = CRITS.find(x=>x.k===k); return (c && (c[lg]||c.de)) || k;
}
function wdName(k, lg){
  lg = lg || S.settings.uiLang;
  const p = pack(lg); if(p && p.wdays && p.wdays[k]) return p.wdays[k];
  const w = WDAYS.find(x=>x.k===k); return (w && (w[lg]||w.de)) || k;
}
function chipT(c, lg){
  const p = pack(lg); if(p && p.chips && p.chips[c.i] && p.chips[c.i].t) return p.chips[c.i].t;
  return c.t[lg] || c.t.de;
}
function chipA(c, lg){
  if(!c.a) return "";
  const p = pack(lg); if(p && p.chips && p.chips[c.i] && p.chips[c.i].a) return p.chips[c.i].a;
  return c.a[lg] || c.a.de;
}
function bandName(g, lg){
  const b = SCALE.find(s=>g>=s.min);
  const p = pack(lg); if(p && p.bands && p.bands[String(b.min)]) return p.bands[String(b.min)];
  return b[lg] || b.de;
}

/* ---- State ---- */
/* Jede Kopie der Datei bekommt einen eigenen Speicher, abgeleitet vom Dateinamen.
   Sonst teilen sich mehrere lokal geöffnete Rapporte denselben Browserspeicher. */
const FILEID = (function(){
  try{
    const n = decodeURIComponent((location.pathname||"").split("/").pop()||"").replace(/\.html?$/i,"");
    if(!n) return "";
    let h = 0; for(let i=0;i<n.length;i++){ h = (h*31 + n.charCodeAt(i)) >>> 0; }
    return "." + h.toString(36);
  }catch(e){ return ""; }
})();
const FILENAME = (function(){
  try{ return decodeURIComponent((location.pathname||"").split("/").pop()||"") || "—"; }catch(e){ return "—"; }
})();
const KEY = "kuechenrapport.v2" + FILEID;
const OLDKEYS = ["kuechenrapport.v2", "kuechenrapport.v1"];
const DEF = {group:"", team:"", outlet:"", teacher:"", uiLang:"de", outLang:"de", base:5, hyg2:true,
             weekdays:["mo","tu","we","th"], startIdx:0,
             hideBanner:false, customLangs:{}, isSample:false};
/* ===== Variante dieser Datei, bewusst nicht einstellbar =====
   Wird beim Erzeugen der Datei gesetzt. Drei Varianten sind im Umlauf:
   10T  10 Einsatztage, Tag 10 ist der Exam Day
   4T   5 Einsatztage,  Tag 5 ist der Exam Day
   5T   5 Einsatztage,  kein Exam Day                                        */
/* Absenzen und Verspaetungen werden immer hierhin gemeldet. */
const ABS_MAIL = "michael.pilman@ehl.ch";

const VARIANT = "10T";
const SLOT_COUNT = 10;
const HAS_EXAM = true;

function seed(){
  const names = ["Ammann Lea","Bertschi Nino","Da Silva Rui","Frei Anouk","Keller Timo","Vogt Sarina"];
  const st = {
    settings:{...DEF, group:"Group 3", team:"Team A", outlet:"Campigiana", teacher:"M. Pilman", isSample:true},
    students: names.map((n,i)=>({id:"s"+(i+1), name:n,
      mail: n.toLowerCase().replace(/[^a-z ]/g,"").split(" ").reverse().join(".")+"@stud.ehl.edu"})),
    days:{},
    dayMeta:{ d01:{teacher:"M. Pilman", group:"Group 3", outlet:"Campigiana"},
              d02:{teacher:"M. Pilman", group:"Group 3", outlet:"Campigiana"} }
  };
  st.days["d01"] = {
    s1:{att:"present",obs:["hyg-p2","fac-p1"],note:null},
    s2:{att:"present",obs:["pro-n1","org-n2"],note:null},
    s3:{att:"present",obs:[],note:null},
    s4:{att:"late",obs:["sel-p2"],note:null},
    s5:{att:"excused",obs:[],note:null},
    s6:{att:"present",obs:["hyg-n4","fac-n3"],note:null}
  };
  st.days["d02"] = {
    s1:{att:"present",obs:["tea-p1"],note:null},
    s2:{att:"present",obs:["pro-n3"],note:null},
    s3:{att:"present",obs:["fac-p3","org-p1"],note:{txt:"Hat den Posten Saucen ohne Anleitung übernommen und sauber übergeben.",crit:"sel",dir:1,w:0.5}},
    s4:{att:"tm",obs:[],note:null},
    s5:{att:"present",obs:["sel-n1","pro-n4"],note:null},
    s6:{att:"unexcused",obs:[],note:null}
  };
  const EX = "d" + String(SLOT_COUNT).padStart(2,"0");
  if(HAS_EXAM) st.days[EX] = {                         // Exam Day, gleiches Raster
    s1:{att:"present",obs:["fac-p2","org-p1"],note:null},
    s2:{att:"present",obs:["fac-n3"],note:null},
    s3:{att:"present",obs:["hyg-p3","fac-p1","pro-p2"],note:null},
    s4:{att:"present",obs:["pro-n1"],note:null},
    s5:{att:"present",obs:[],note:null},
    s6:{att:"present",obs:["hyg-n5","tea-n2"],note:{txt:"Prüfungsablauf wirkte unsicher, Rezeptur mehrfach nachgelesen.",crit:"",dir:0,w:0,internal:true}}
  };
  st.dayMeta[EX] = {teacher:"M. Pilman", group:"Group 3", outlet:"Campigiana"};
  return st;
}
let S;
try{
  const raw = localStorage.getItem(KEY);
  if(raw){ S = JSON.parse(raw); }
  else{
    const old = OLDKEYS.map(k=>localStorage.getItem(k)).find(Boolean);
    if(old){                                   // Migration: alter Speicher oder Datumsschlüssel
      const o = JSON.parse(old);
      S = {settings:{...DEF, ...(o.settings||{})}, students:o.students||[], days:{}, dayMeta:o.dayMeta||{}};
      const keys = Object.keys(o.days||{});
      if(keys.length && /^d\d\d$/.test(keys[0])) S.days = o.days;         // bereits Slot-Schlüssel
      else keys.sort().forEach((dt,ix)=>{ S.days["d"+String(ix+1).padStart(2,"0")] = o.days[dt]; });
    } else S = seed();
  }
}catch(e){ S = seed(); }
if(!S || !S.settings) S = seed();
S.settings = {...DEF, ...S.settings};
/* Typen erzwingen. Eine alte oder von Hand bearbeitete JSON darf weder die
   Notenrechnung verbiegen noch die Oberflaeche zum Absturz bringen.        */
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
  if(typeof normalizeStudents === "function") normalizeStudents();
}
normalizeSettings();
S.students = S.students || []; S.days = S.days || {};

S.dayMeta = S.dayMeta || {};
let storeOK = true;
try{ localStorage.setItem("kr.probe","1"); storeOK = localStorage.getItem("kr.probe")==="1"; localStorage.removeItem("kr.probe"); }
catch(e){ storeOK = false; }
function persist(){
  try{
    S.variant = VARIANT;
    localStorage.setItem(KEY, JSON.stringify(S));
  }catch(e){
    if(storeOK){                       // nur einmal melden, nicht bei jedem Klick
      storeOK = false;
      try{ toast(t("storeWarn")); }catch(_){}
      const sa = document.getElementById("storeAlert"); if(sa) sa.hidden = false;
    }
  }
}
function unseed(){ if(S.settings.isSample) S.settings.isSample = false; }

/* ---- Turnus-Slots ---- */
function slots(){
  const wd = (S.settings.weekdays && S.settings.weekdays.length) ? S.settings.weekdays : ["mo","tu","we","th"];
  const n  = SLOT_COUNT;
  const st = Math.max(0, Math.min(S.settings.startIdx||0, wd.length-1));
  const out = [];
  for(let i=0;i<n;i++){
    const j = st + i;
    out.push({id:"d"+String(i+1).padStart(2,"0"), wd:wd[j % wd.length], week:Math.floor(j/wd.length)+1,
              idx:i+1, exam: HAS_EXAM && i === n-1});
  }
  /* Noten 2.0: echte Daten aus dem Paket (S.settings.slotDates); der Wochentag folgt dann dem Datum */
  const dts = Array.isArray(S.settings.slotDates) ? S.settings.slotDates : [];
  out.forEach((s, i) => { const d = String(dts[i] || "");
    if(/^\d{4}-\d{2}-\d{2}$/.test(d)){ s.date = d; s.wd = ["su","mo","tu","we","th","fr","sa"][new Date(d + "T12:00:00").getDay()]; } });
  return out;
}
function dmy(d){ return String(d).slice(8,10) + "." + String(d).slice(5,7) + "."; }
/* Noten 2.0: Wochentag mit Datum statt Wochennummer; ohne Datum die Nummer des Einsatztags */
function slotLabel(s, lg){
  const L2 = lg || S.settings.uiLang;
  if(s.exam) return tOut("examDay", L2) + (s.date ? " " + dmy(s.date) : "");
  if(s.date) return wdName(s.wd, L2) + " " + dmy(s.date);
  return (L2 === "zh") ? ("第" + s.idx + "天 " + wdName(s.wd, L2))
                       : (wdName(s.wd, L2) + " (" + s.idx + ")");
}
const slotById = id => slots().find(s=>s.id===id) || slots()[0];
const examSlot = () => slots().find(s=>s.exam) || null;
const gradedSlots = () => slots().filter(s=>!s.exam);

let view = "day";
let curSlot = (function(){
  const all = slots();
  /* Noten 2.0: Ist heute ein Einsatztag des Pakets, immer diesen zeigen. Sonst landen
     Beobachtungen auf einem falschen Datum (z. B. Kollegin mit eigenem Gerät ab Mittwoch). */
  { const d = new Date(), td = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const heute = all.find(s => s.date === td); if(heute) return heute.id; }
  const nextOpen = all.find(s=>!s.exam && !S.days[s.id]);
  if(nextOpen) return nextOpen.id;
  const filled = all.filter(s=>S.days[s.id]);
  return (filled.length ? filled[filled.length-1] : all[0]).id;
})();
const repMode = "all";   // Auswertung immer über den ganzen Turnus

const dayOpen = id => !!S.days[id];

/* Tagesplan aus dem Cockpit: Team Market an diesem Einsatztag? */
function planTM(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  return !!(s && Array.isArray(s.tmTage) && sl && s.tmTage.indexOf(sl.idx) >= 0);
}
function openSlot(id){
  S.days[id] = S.days[id] || {};
  S.students.forEach(s=>{ S.days[id][s.id] = S.days[id][s.id] || {att: planTM(s, id) ? "tm" : "present", obs:[], note:null}; });
  const _m = S.dayMeta[id] || {};
  if(!_m.teacher) _m.teacher = S.settings.teacher || "";
  if(!_m.group)   _m.group   = S.settings.group   || "";
  if(!_m.team)    _m.team    = S.settings.team    || "";
  if(!_m.outlet)  _m.outlet  = S.settings.outlet  || "";
  if(!_m.label || !_m.weekday){
    const _sl = slots().find(x=>x.id===id);
    if(_sl){ _m.label = _m.label || slotLabel(_sl); _m.weekday = _m.weekday || _sl.wd; }
  }
  if(!_m.date) _m.date = new Date().toISOString().slice(0,10);
  S.dayMeta[id] = _m;
  persist();
}
function dayRec(id, sid){
  S.days[id] = S.days[id] || {};
  S.days[id][sid] = S.days[id][sid] || {att:"present", obs:[], note:null};
  return S.days[id][sid];
}
const dayMeta = id => (S.dayMeta && S.dayMeta[id]) || {teacher:"", group:"", team:"", outlet:""};
/* Beobachtungen immer als Liste lesen, auch wenn die Datei etwas anderes enthaelt. */
const obsOf = r => (r && Array.isArray(r.obs)) ? r.obs : [];
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
const dispName = s => [s && s.last, s && s.first].filter(Boolean).join(" ") || (s && s.name) || "";
const sortName = s => [s && s.last, s && s.first].filter(Boolean).join(", ") || (s && s.name) || "";
const klasseOf = s => (s && s.klasse) || S.settings.group || "";
const gruppeOf = s => (s && s.gruppe) || S.settings.team  || "";
/* Vollform fuer die Meldung: Nachname, Vorname «Nickname» */

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
const longName = s => sortName(s) + (s && s.nick ? " \u00ab" + s.nick + "\u00bb" : "");
/* Alte Dateien tragen nur "name". Nachname und Vorname daraus ableiten. */
function normalizeStudents(){
  S.students = (Array.isArray(S.students) ? S.students : []).filter(x=>x && typeof x === "object");
  S.students.forEach(st=>{
    ["name","last","first","nick","mail","lang","klasse","gruppe"].forEach(k=>{
      if(typeof st[k] !== "string") st[k] = "";
    });
    if(!st.last && !st.first && st.name){
      const parts = st.name.trim().split(/\s+/);
      st.last  = parts.shift() || "";
      st.first = parts.join(" ");
    }
    if(st.last && !st.first && /\s/.test(st.last)){
      const parts = st.last.trim().split(/\s+/);
      st.last = parts.shift(); st.first = parts.join(" ");
    }
    st.name = [st.last, st.first].filter(Boolean).join(" ") || st.name;
    if(!st.id) st.id = "s" + Math.random().toString(36).slice(2,8);
  });
}
/* Eine Zeile der Namensliste lesen. Reihenfolge:
   Nachname; Vorname; Nickname; E-Mail; Sprache; Klasse; Gruppe
   E-Mail, Sprache, Klasse und Gruppe werden am Inhalt erkannt, darum sind
   aeltere Zeilen wie "Ammann Lea; lea@x.ch; de" weiterhin lesbar.        */
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
  if(last && !first && /\s/.test(last)){            // "Ammann Lea" in einem Feld
    const q = last.split(/\s+/); last = q.shift(); first = q.join(" ");
  }
  return {last, first, nick, mail, lang, klasse, gruppe};
}
function studentLine(st){
  return [st.last, st.first, st.nick, st.mail, st.lang, st.klasse, st.gruppe]
    .join("; ").replace(/(?:;\s*)+$/, "");
}
/* Basisnote immer als Zahl, auch wenn zur Laufzeit etwas anderes darin landet. */
const baseNum = () => { const n = parseFloat(S.settings.base); return Number.isFinite(n) ? n : 5; };
const ATT_OK = ["present","late","excused","unexcused","tm"];
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
             dir:Number(r.note.dir)||0, w:Number(r.note.w)||0, internal:!!r.note.internal}
          : null
      };
    });
  });
  return out;
}
/* Datensaetze von entfernten Studierenden aufraeumen. */
function pruneOrphans(){
  const ids = new Set(S.students.map(x=>x.id));
  Object.keys(S.days || {}).forEach(d=>{
    Object.keys(S.days[d] || {}).forEach(k=>{ if(!ids.has(k)) delete S.days[d][k]; });
  });
}

/* Halbturnus in die volle Datei einordnen.
   5T liefert 5 Praxistage, 4T liefert 4 Praxistage plus den Exam Day.
   Zusammen ergeben sie genau die 10T-Struktur: 9 Praxistage plus Exam Day. */
let halfMode = "auto";
function mapSlotId(srcVariant, slid){
  const valid = id => slots().some(x=>x.id===id);
  if(!srcVariant || srcVariant === VARIANT) return valid(slid) ? slid : null;
  if(VARIANT !== "10T") return null;                       // nur die volle Datei nimmt Hälften auf
  const n = parseInt(String(slid).slice(1), 10);
  if(!n) return null;
  const pad = x => "d" + String(x).padStart(2,"0");
  if(srcVariant === "5T"){
    if(n < 1 || n > 5) return null;
    return pad(n + (halfMode === "second" ? 4 : 0));        // erste Hälfte 1-5, zweite 5-9
  }
  if(srcVariant === "4T"){
    if(n === 5) return "d10";                               // Exam Day gehört immer ans Ende
    if(n < 1 || n > 4) return null;
    return pad(n + (halfMode === "first" ? 0 : 5));         // zweite Hälfte 6-9, erste 1-4
  }
  return null;
}
const acceptsVariant = v => !v || v === VARIANT || (VARIANT === "10T" && (v === "4T" || v === "5T"));

/* ---- Notenlogik ---- */
function critGradesForDay(id, sid){
  const r = (S.days[id]||{})[sid];
  if(!r) return null;
  const sl = slots().find(x=>x.id===id);
  const isExam = !!(sl && sl.exam);
  const att = ATT_OK.includes(r.att) ? r.att : "present";   // unbekannter Wert zaehlt als anwesend
  /* Team Market: kein Küchendienst, der Tag zählt fest mit 5.00. */
  if(att === "tm"){ const g0 = {}; CRITS.forEach(c=>g0[c.k]=5); return g0; }
  /* Exam Day: jede Abwesenheit ergibt 1.00, unabhängig vom Grund. */
  if(att === "excused" && !isExam) return null;
  const g = {};
  if(att === "unexcused" || (isExam && att === "excused")){ CRITS.forEach(c=>g[c.k]=1); return g; }
  const obs = obsOf(r).map(i=>CHIP[i]).filter(Boolean);
  if(att === "late" && !obs.some(o=>o.i==="tea-n1")) obs.push(CHIP["tea-n1"]);
  const nt = r.note;
  CRITS.forEach(c=>{
    const mine = obs.filter(o=>o.c===c.k);
    if(mine.some(o=>o.ko)){ g[c.k] = 1; return; }
    let d = 0;
    mine.forEach(o=>{ d += o.d * o.w; });
    if(nt && nt.crit === c.k && nt.dir && nt.w) d += nt.dir * nt.w;
    d = Math.max(CAP_NEG, Math.min(CAP_POS, d));
    g[c.k] = Math.max(1, Math.min(6, baseNum() + d));
  });
  return g;
}
/* Bewertungszeitraum: der Exam Day zählt nie mit, er wird separat ausgewiesen. */
function slotsInRange(mode){
  const all = gradedSlots();
  if(mode === "all") return all;
  const cur = slotById(curSlot);
  const w = cur.exam ? (all.length ? all[all.length-1].week : 1) : cur.week;
  return all.filter(s=>s.week === w);
}
function dayTotal(id, sid){
  const g = critGradesForDay(id, sid); if(!g) return null;
  let sum = 0, w = 0;
  CRITS.forEach(c=>{ const ww = (c.k==="hyg" && S.settings.hyg2) ? 2 : 1; sum += g[c.k]*ww; w += ww; });
  return sum/w;
}
function summary(sid, mode){
  const rng = slotsInRange(mode);
  const per = {}; CRITS.forEach(c=>per[c.k]=[]);
  let counted = 0, exc = 0, unx = 0, late = 0, tm = 0;
  const tally = {}, notes = [];
  rng.forEach(sl=>{
    const r = (S.days[sl.id]||{})[sid]; if(!r) return;
    if(r.note && r.note.txt) notes.push({slot:sl, ...r.note});
    if(r.att === "excused"){ exc++; return; }
    if(r.att === "unexcused") unx++;
    if(r.att === "late") late++;
    if(r.att === "tm") tm++;
    obsOf(r).forEach(i=>{ tally[i] = (tally[i]||0)+1; });
    const g = critGradesForDay(sl.id, sid); if(!g) return;
    counted++; CRITS.forEach(c=>per[c.k].push(g[c.k]));
  });
  if(!counted) return {counted:0, exc, unx, late, tm, tally, notes, crit:null, total:null};
  const crit = {};
  CRITS.forEach(c=>{ crit[c.k] = per[c.k].reduce((a,b)=>a+b,0)/per[c.k].length; });
  let sum = 0, wsum = 0;
  CRITS.forEach(c=>{ const w = (c.k==="hyg" && S.settings.hyg2) ? 2 : 1; sum += crit[c.k]*w; wsum += w; });
  return {counted, exc, unx, late, tm, tally, notes, crit, total: sum/wsum};
}
/* Exam Day separat */
function examSummary(sid){
  const sl = examSlot(); if(!sl) return null;
  const r = (S.days[sl.id]||{})[sid]; if(!r) return null;
  const g = critGradesForDay(sl.id, sid);
  return {slot:sl, att:r.att, crit:g, total: g ? dayTotal(sl.id, sid) : null,
          obs:obsOf(r).map(i=>CHIP[i]).filter(Boolean), note:r.note||null};
}
/* Schlussnote: zwei Drittel Praxis, ein Drittel Exam Day. */
function finalGrade(praxis, exam){
  if(praxis == null) return exam;
  if(exam == null) return praxis;
  return (2*praxis + exam) / 3;
}
function recordedPeriod(sid, mode, lg){
  const rec = slotsInRange(mode).filter(sl=>(S.days[sl.id]||{})[sid]);
  if(!rec.length) return "–";
  return rec.length===1 ? slotLabel(rec[0], lg)
    : slotLabel(rec[0], lg) + " – " + slotLabel(rec[rec.length-1], lg);
}
const fmt  = g => (g==null ? "–" : g.toFixed(2));
const fmt1 = g => (g==null ? "–" : (Math.round(g*10)/10).toFixed(1));

/* ---- DOM-Helfer ---- */
const el = (tag, attrs={}, kids=[]) => {
  const n = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(v===false||v==null) continue;
    if(k==="class") n.className = v;
    else if(k==="text") n.textContent = v;
    else if(k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v===true ? "" : v);
  }
  (Array.isArray(kids)?kids:[kids]).forEach(c=>c && n.appendChild(c));
  return n;
};
function toast(msg){
  const h = document.getElementById("toastHost");
  h.innerHTML = ""; h.appendChild(el("div",{class:"toast",text:msg}));
  clearTimeout(toast._t); toast._t = setTimeout(()=>{ h.innerHTML=""; }, Math.min(9000, 2200 + String(msg).length * 35));
}
const gradeClass = g => g==null ? "g-na" : (g>=5.25 ? "g-hi" : (g<4.25 ? "g-lo" : ""));
const subLine = () => [S.settings.group, S.settings.team, S.settings.outlet].filter(Boolean).join(" · ") || "Küchenpraxis";
const variantText = () => HAS_EXAM
  ? (SLOT_COUNT-1) + " " + t("vDays") + " + " + t("vExam")
  : SLOT_COUNT + " " + t("vDays");

/* ---- Dateiausgabe: Capability, sonst Direktdownload, sonst Zwischenablage ---- */
let dl = null;
function claudeUse(n){
  try{ return (window.claude && window.claude.use) ? window.claude.use(n).catch(()=>null) : Promise.resolve(null); }
  catch(e){ return Promise.resolve(null); }
}
claudeUse("downloads").then(d=>{ dl = d; if(view==="data") renderData(); });
async function copy(txt){
  try{ await navigator.clipboard.writeText(txt); toast(t("copied")); return true; }
  catch(e){
    const ta = el("textarea",{style:"position:fixed;opacity:0;top:0"}); ta.value = txt;
    document.body.appendChild(ta); ta.select();
    let ok=false; try{ ok = document.execCommand("copy"); }catch(_){}
    ta.remove(); if(ok) toast(t("copied")); return ok;
  }
}
async function saveFile(filename, data, mime){
  if(dl){
    try{ await dl.save({filename, data}); return true; }
    catch(e){ if(e && e.code === "declined") return false; }
  }
  const blob = (data instanceof Blob) ? data
             : new Blob([data], {type: mime || "text/plain;charset=utf-8"});
  /* Speichern unter: der Dozent waehlt Ordner und Namen selbst.
     Chrome und Edge koennen das; sonst faellt es auf den Download zurueck. */
  if(window.showSaveFilePicker){
    try{
      const ext = "." + (filename.split(".").pop() || "txt");
      const h = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{description: ext.slice(1).toUpperCase(),
                 accept: {[mime || "application/octet-stream"]: [ext]}}]
      });
      const w = await h.createWritable();
      await w.write(blob); await w.close();
      toast(t("savedAs") + ": " + (h.name || filename));
      return true;
    }catch(e){
      if(e && e.name === "AbortError") return false;   // Dialog abgebrochen
      /* SecurityError und Co.: weiter mit dem normalen Download */
    }
  }
  try{
    const url = URL.createObjectURL(blob);
    const a = el("a",{href:url, download:filename, style:"display:none"});
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
    return true;
  }catch(e){}
  if(typeof data === "string") copy(data);
  return false;
}

/* ============================ RENDER ============================ */
function fillLangSelects(){
  [["uiLang","ui",S.settings.uiLang],["outLang","out",S.settings.outLang]].forEach(([id,which,cur])=>{
    const sel = document.getElementById(id);
    sel.innerHTML = "";
    langList(which).forEach(l=>sel.appendChild(el("option",{value:l.code, text:l.name, selected:l.code===cur})));
    sel.value = cur;
  });
}
function renderTabs(){
  const nav = document.getElementById("tabs"); nav.innerHTML = "";
  [["day",t("day")],["week",t("week")],["rep",t("rep")],["data",t("data")],["set",t("set")]]
    .forEach(([k,label])=>nav.appendChild(el("button",{text:label,"aria-current":String(view===k),
      onclick:()=>{view=k;render();}})));
}
function render(){
  L = S.settings.uiLang || "de";
  fillLangSelects();
  const lg0 = document.getElementById("brandLogo"); if(lg0 && !lg0.src) lg0.src = LOGO;
  document.getElementById("brandVar").textContent = variantText();
  document.getElementById("brandSub").textContent = subLine();
  document.getElementById("bannerTxt").textContent = t("banner");
  document.getElementById("protoBanner").hidden = !!S.settings.hideBanner;
  const sa = document.getElementById("storeAlert");
  sa.hidden = storeOK;
  document.getElementById("storeAlertTxt").textContent = t("storeWarn");
  renderTabs();
  ["day","week","rep","data","set"].forEach(k=>{ document.getElementById("v-"+k).hidden = (k!==view); });
  ({day:renderDay, week:renderWeek, rep:renderRep, data:renderData, set:renderSet})[view]();
}

/* ---------- Erfassen ---------- */
function slotStrip(onPick){
  const strip = el("div",{class:"slots"});
  const n = slots().length;
  slots().forEach(s=>{
    const b = el("button",{class:"slot"+(dayOpen(s.id)?" filled":"")+(s.exam?" exam":""),
      "aria-current":String(s.id===curSlot), onclick:()=>{ curSlot = s.id; onPick(); }});
    b.appendChild(el("span",{class:"sd",text: s.exam ? t("examShort") : wdName(s.wd)}));
    b.appendChild(el("span",{class:"sw",text: s.exam
      ? (s.date ? wdName(s.wd)+" "+dmy(s.date) : wdName(s.wd)+" · "+s.idx+"/"+n)
      : (s.date ? dmy(s.date) : s.idx+"/"+n)}));
    if(s.id===curSlot) setTimeout(()=>{ try{ b.scrollIntoView({block:"nearest",inline:"center"}); }catch(e){} }, 0);
    strip.appendChild(b);
  });
  return strip;
}
function renderDay(){
  const root = document.getElementById("v-day"); root.innerHTML = "";
  root.appendChild(slotStrip(renderDay));

  if(!S.students.length){
    root.appendChild(el("div",{class:"card pad"},[
      el("p",{class:"muted",style:"margin:0 0 10px",text:t("noData")}),
      el("button",{class:"btn pri",text:t("set"),onclick:()=>{view="set";render();}})
    ]));
    return;
  }
  const sl = slotById(curSlot);
  if(sl.exam) root.appendChild(el("div",{class:"examnote"},[
    el("span",{text:"◆"}),
    el("div",{},[el("b",{text:t("examDay")+". "}), el("span",{text:t("examBadge")+" "+t("examAbsHint")})])
  ]));
  if(!dayOpen(curSlot)){
    root.appendChild(el("div",{class:"card pad",style:"text-align:center"},[
      el("p",{class:"muted",style:"margin:0 0 12px",text:t("openDayHint")}),
      el("button",{class:"btn pri",text:t("openDay")+" · "+slotLabel(sl),
        onclick:()=>{ unseed(); openSlot(curSlot); renderDay(); }})
    ]));
    return;
  }

  S.students.forEach(s=>{
    const r = dayRec(curSlot, s.id);
    const tot = dayTotal(curSlot, s.id);
    const card = el("article",{class:"stud"+(r.att==="excused"||r.att==="unexcused"||r.att==="tm"?" absent":"")});
    const head = el("div",{class:"stud-h"},[avatar(s, 34), el("div",{class:"nm",text:s.name + nickTag(s)})]);
    head.appendChild(el("div",{class:"grade num "+gradeClass(tot),text: tot==null ? t("excused") : fmt(tot)}));
    card.appendChild(head);
    const seg = el("div",{class:"seg"+(sl.exam?" two":" five")});
    (sl.exam
      ? [["present",t("present"),""],["unexcused",t("absent"),"v-unx"]]
      : [["present",t("present"),""],["late",t("late"),"v-late"],["excused",t("excused"),"v-exc"],
         ["unexcused",t("unexcused"),"v-unx"],["tm",t("teamMarket"),"v-tm"]]
    ).forEach(([k,label,cls])=>seg.appendChild(el("button",{class:cls,text:label,
        "aria-pressed":String(sl.exam ? (k==="present" ? r.att==="present" : r.att!=="present") : r.att===k),
        onclick:()=>{ unseed(); r.att = k; persist(); renderDay(); }})));
    card.appendChild(seg);

    if(r.att === "tm"){
      card.appendChild(el("div",{class:"stud-b"}, el("span",{class:"emptyhint",text:t("tmDay")})));
    }
    if(r.att !== "excused" && r.att !== "unexcused" && r.att !== "tm"){
      const body = el("div",{class:"stud-b"});
      const shown = [...obsOf(r)];
      if(r.att==="late" && !shown.includes("tea-n1")) shown.push("tea-n1");
      shown.forEach(id=>{
        const c = CHIP[id]; if(!c) return;
        const auto = (id==="tea-n1" && !obsOf(r).includes("tea-n1"));
        const pill = el("span",{class:"obs "+(c.d>0?"p":"m")},
          el("span",{class:"tx",text:(c.ko ? "K.-o. " : (c.d>0?"+":"\u2212") + c.w.toFixed(2).slice(1) + " ") + chipT(c, S.settings.uiLang)}));
        if(!auto) pill.appendChild(el("button",{class:"x",text:"×","aria-label":"x",
          onclick:()=>{ unseed(); r.obs = r.obs.filter(x=>x!==id); persist(); renderDay(); }}));
        body.appendChild(pill);
      });
      if(r.note && r.note.txt){
        const sign = r.note.dir && r.note.w ? (r.note.dir>0?"+":"−")+r.note.w.toFixed(2).slice(1)+" " : "";
        body.appendChild(el("span",{class:"obs nt"},[
          el("span",{class:"tx",text:(r.note.internal?"🔒 ":"✎ ")+sign+r.note.txt}),
          el("button",{class:"x",text:"×","aria-label":"x",
            onclick:()=>{ unseed(); r.note = null; persist(); renderDay(); }})
        ]));
      }
      if(!shown.length && !(r.note && r.note.txt)) body.appendChild(el("span",{class:"emptyhint",text:t("noObs")}));
      body.appendChild(el("button",{class:"addbtn",text:"+ "+t("addObs"),onclick:()=>openSheet(s)}));
      card.appendChild(body);
    }
    root.appendChild(card);
  });

  const list = absenceList(curSlot);
  const box = el("div",{class:"card pad",style:"margin-top:16px"});
  box.appendChild(el("span",{class:"eyebrow",text:t("absMailTitle"),style:"display:block;margin-bottom:8px"}));
  if(list.length){
    box.appendChild(el("div",{class:"row",style:"gap:6px;margin-bottom:10px"},
      list.map(x=>el("span",{class:"obs m",style:"padding:3px 10px",
        text:x.name + " · " + x.kind}))));
  } else {
    box.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("absMailNone")}));
  }
  const foot = el("div",{class:"row",style:"align-items:center"});
  foot.appendChild(el("button",{class:"btn sm",text:t("dropDay"),
    onclick:()=>{ delete S.days[curSlot]; persist(); renderDay(); }}));
  box.appendChild(foot);
  const pr = el("div",{class:"row",style:"margin-top:12px;padding-top:12px;border-top:1px solid var(--line)"});
  pr.appendChild(el("span",{class:"eyebrow",style:"width:100%",text:t("sheetPrint")}));
  pr.appendChild(el("button",{class:"btn sm",text:"\u2399 "+t("sheetDay"),onclick:()=>printSheets("day")}));
  pr.appendChild(el("button",{class:"btn sm",text:"\u2399 "+t("sheetSingle"),onclick:()=>printSheets("single")}));
  box.appendChild(pr);
  box.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",
    text:t("absMailHint") + " " + ABS_MAIL + "."}));
  root.appendChild(box);
  root.appendChild(n2LapBar());
}

/* ---------- Erfassungsblaetter fuer die Kueche ---------- */
const CRIT_ABBR = {hyg:"HYG", pro:"PRO", org:"ORG", tea:"TEA", sel:"SEL", mot:"MOT", fac:"FAC"};

function sheetHead(sub, right){
  const h = el("div",{class:"sh-head"});
  h.appendChild(el("img",{src:LOGO,alt:"EHL"}));
  const ti = el("div",{class:"ti"});
  ti.appendChild(el("h2",{text:t("sheetTitle")}));
  ti.appendChild(el("div",{class:"mt",text:sub}));
  h.appendChild(ti);
  h.appendChild(el("div",{class:"dt",text:right}));
  return h;
}
function attCell(){
  const td = el("td",{style:"text-align:center;white-space:nowrap"});
  for(let i=0;i<5;i++) td.appendChild(el("span",{class:"bx"}));
  td.appendChild(el("div",{class:"pm",style:"margin-top:.8mm",text:t("sheetAttShort")}));
  return td;
}
function pmCell(){
  const td = el("td",{class:"sep",style:"text-align:center"});
  td.appendChild(el("span",{class:"bx pos"}));
  td.appendChild(el("span",{class:"bx neg"}));
  td.appendChild(el("div",{class:"pm",style:"margin-top:.8mm",text:"+  \u2212"}));
  return td;
}
/* Tagesblatt: eine Seite quer, alle Studierenden als Zeilen */
function buildDaySheet(area){
  const sl = slotById(curSlot);
  const doc = el("div",{class:"sheet-doc"});
  doc.appendChild(sheetHead(
    [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher].filter(Boolean).join("  \u00b7  "),
    slotLabel(sl) + "     " + t("dateLbl") + ": ___________"));
  const tb = el("table",{class:"grid"});
  const hr = el("tr");
  hr.appendChild(el("th",{style:"width:34mm",text:t("student")}));
  hr.appendChild(el("th",{style:"width:31mm",text:t("abs")}));
  CRITS.forEach(c=>hr.appendChild(el("th",{class:"sep",style:"width:13mm",
    text:CRIT_ABBR[c.k] || c.k.toUpperCase()})));
  hr.appendChild(el("th",{class:"sep",text:t("sheetNotes")}));
  tb.appendChild(el("thead",{},hr));
  const body = el("tbody");
  const rows = S.students.slice();
  while(rows.length < 12) rows.push({name:""});     // Leerzeilen zum Nachtragen
  rows.forEach(st=>{
    const tr = el("tr");
    tr.appendChild(el("td",{class:"nmc",text:st.name||""}));
    tr.appendChild(attCell());
    CRITS.forEach(()=>tr.appendChild(pmCell()));
    tr.appendChild(el("td",{class:"sep"}));
    body.appendChild(tr);
  });
  tb.appendChild(body);
  doc.appendChild(tb);
  const leg = el("div",{class:"sh-leg"});
  CRITS.forEach(c=>leg.appendChild(el("span",{},[
    el("b",{text:(CRIT_ABBR[c.k]||c.k.toUpperCase())+" "}), el("span",{text:critName(c.k, S.settings.uiLang)})])));
  doc.appendChild(leg);
  doc.appendChild(el("div",{class:"sh-leg",style:"margin-top:1.5mm"},
    el("span",{text:t("sheetHintDay")})));
  area.appendChild(doc);
}
/* Einzelblatt: eine Seite hoch pro Studierendem, alle Bausteine zum Ankreuzen */
function buildSingleSheets(area){
  const sl = slotById(curSlot);
  const rows = S.students.length ? S.students : [{name:""}];
  rows.forEach(st=>{
    const doc = el("div",{class:"sheet-doc"});
    doc.appendChild(sheetHead(
      (dispName(st) || "________________________") + "     \u00b7     "
      + [klasseOf(st), gruppeOf(st), S.settings.outlet].filter(Boolean).join(" \u00b7 "),
      slotLabel(sl) + "     " + t("dateLbl") + ": ___________"));
    const att = el("div",{style:"margin:0 0 2.5mm;font-size:8pt"});
    att.appendChild(el("b",{text:t("abs") + ":   "}));
    [t("present"),t("late"),t("excused"),t("unexcused"),t("teamMarket")].forEach(lbl=>{
      att.appendChild(el("span",{class:"bx"}));
      att.appendChild(el("span",{style:"margin:0 3.5mm 0 1mm",text:lbl}));
    });
    doc.appendChild(att);
    const cols = el("div",{class:"cols"});
    CRITS.forEach(c=>{
      const blk = el("div",{class:"critblk"});
      blk.appendChild(el("h4",{text:critName(c.k, S.settings.uiLang)}));
      [1,-1].forEach(dir=>{
        CHIPS.filter(x=>x.c===c.k && x.d===dir).forEach(x=>{
          const it = el("div",{class:"it"});
          it.appendChild(el("span",{class:"bx "+(dir>0?"pos":"neg")}));
          it.appendChild(el("span",{text:(dir>0?"+ ":"\u2212 ")+chipT(x, S.settings.uiLang)}));
          blk.appendChild(it);
        });
      });
      cols.appendChild(blk);
    });
    doc.appendChild(cols);
    const nb = el("div",{class:"notesblk"});
    nb.appendChild(el("h4",{style:"font-size:8.5pt;font-weight:600;margin:0 0 1.5mm;padding:0.8mm 1.5mm;background:#EDEDEA;border-left:2pt solid #001436;text-transform:uppercase;letter-spacing:.05em",
      text:t("sheetNotes")}));
    for(let i=0;i<5;i++) nb.appendChild(el("div",{class:"lines"}));
    doc.appendChild(nb);
    doc.appendChild(el("div",{class:"sh-leg",style:"margin-top:2mm"},
      el("span",{text:t("sheetHintSingle")})));
    area.appendChild(doc);
  });
}
function printSheets(kind){
  const area = document.getElementById("printArea");
  area.innerHTML = "";
  const old = document.getElementById("pageStyle"); if(old) old.remove();
  const st = el("style",{id:"pageStyle"});
  st.textContent = (kind === "day")
    ? "@media print{@page{size:A4 landscape;margin:10mm 10mm 9mm}}"
    : "@media print{@page{size:A4 portrait;margin:11mm 12mm 10mm}}";
  document.head.appendChild(st);
  if(kind === "day") buildDaySheet(area); else buildSingleSheets(area);
  document.body.classList.add("printing");
  const done = ()=>{ document.body.classList.remove("printing");
    const p = document.getElementById("pageStyle"); if(p) p.remove();
    window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  setTimeout(()=>{ try{ window.print(); }catch(e){} setTimeout(done, 1500); }, 80);
}

/* ---------- Absenz- und Verspaetungsmeldung ---------- */
function absenceList(slotId){
  const d = S.days[slotId] || {};
  const out = [];
  S.students.forEach(st=>{
    const r = d[st.id]; if(!r) return;
    const a = ATT_OK.includes(r.att) ? r.att : "present";
    if(a === "late" || a === "excused" || a === "unexcused")
      out.push({st, name:dispName(st), kind:t(a)});
  });
  return out;
}
/* Eine Meldezeile: Nachname, Vorname «Nickname» · Klasse · Gruppe — Grund */
function absenceLine(x){
  const kg = [klasseOf(x.st), gruppeOf(x.st)].filter(Boolean).join(" \u00b7 ");
  return "- " + longName(x.st) + (kg ? "   \u00b7   " + kg : "") + "   \u2014   " + x.kind;
}
function absenceMailHref(slotId){
  const sl = slotById(slotId);
  const list = absenceList(slotId);
  const head = [S.settings.group, S.settings.outlet, S.settings.teacher].filter(Boolean).join(" · ");
  const subj = t("absMailSubj") + " – " + [S.settings.group, S.settings.outlet, slotLabel(sl)].filter(Boolean).join(" · ");
  const body = [head, slotLabel(sl) + " · " + VARIANT, ""]
    .concat(list.length ? list.map(absenceLine) : [t("absMailNone")])
    .concat(["", t("absMailCols"), "", "JSON: " + fileStem() + ".json"])
    .join("\n");
  return "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
}
/* Notenuebersicht als Klartext an die Kursleitung.
   Bewusst kompakt: mailto-Links sind in Outlook auf rund 2000 Zeichen begrenzt. */
function overviewMailHref(){
  const rows = S.students.map(s=>({s, sum:summary(s.id, repMode)}));
  const withExam = !!examSlot();
  const sl = slots();
  const period = sl.length ? (slotLabel(sl[0]) + " – " + slotLabel(sl[sl.length-1])) : "";
  const head = [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher]
    .filter(Boolean).join(" · ");
  const subj = t("ovMailSubj") + " – "
    + [S.settings.group, S.settings.outlet, VARIANT].filter(Boolean).join(" · ");
  const w = Math.min(26, Math.max(12, ...rows.map(r=>r.s.name.length)));
  const C1 = 8;                                  // Breite der Zahlenspalten
  const line = [];
  line.push(head);
  line.push(period + "  ·  " + VARIANT + "  ·  " + new Date().toLocaleDateString("de-CH"));
  line.push("");
  let hdr = t("ovCName").padEnd(w) + t("ovCDays").padStart(6)
    + (withExam ? t("ovCPraxis").padStart(C1) : t("ovCTotal").padStart(C1));
  if(withExam) hdr += t("ovCExam").padStart(C1) + t("ovCFinal").padStart(C1);
  line.push(hdr);
  line.push("-".repeat(hdr.length));
  rows.forEach(({s,sum})=>{
    const ex = withExam ? examSummary(s.id) : null;
    const fin = withExam ? finalGrade(sum.total, ex?ex.total:null) : null;
    let r = s.name.slice(0,w).padEnd(w) + String(sum.counted).padStart(6)
          + fmt(sum.total).padStart(C1);
    if(withExam) r += (ex ? fmt(ex.total) : "–").padStart(C1) + fmt1(fin).padStart(C1);
    const a = [];
    if(sum.exc)  a.push(sum.exc + "e");
    if(sum.unx)  a.push(sum.unx + "u");
    if(sum.late) a.push(sum.late + "v");
    if(sum.tm)   a.push(sum.tm + "tm");
    if(a.length) r += "   (" + a.join(" ") + ")";
    line.push(r);
  });
  line.push("");
  line.push(t("excused") + " = e · " + t("unexcused") + " = u · "
    + t("late") + " = v · " + t("teamMarket") + " = tm");
  line.push(t("ovMailFoot"));
  line.push(fileStem() + ".xlsx");
  const body = line.join("\n");
  return "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj)
       + "&body=" + encodeURIComponent(body);
}
function openOverviewMail(){
  if(!S.students.some(s=>summary(s.id, repMode).counted)){ toast(t("ovMailNone")); return; }
  location.href = overviewMailHref();
  toast(t("ovMailSent"));
}
/* ---- Noten 2.0: Tagesabschluss am Laptop wie auf dem Tablet (06.10.2026) ----
   «Tag senden»: öffnet die fertige Mail an die Kursleitung (Absenzen im Text, Dateiname genannt)
   und gleichzeitig «Speichern unter» für die Tagesdatei. Eine Webseite darf keine Datei selbst
   an eine Mail hängen: die eben gespeicherte Datei wird in die Mail gezogen.
   Reihenfolge bewusst: zuerst die Mail (braucht den Klick), dann der Speichern-Dialog. */
const N2LAP = {
  de:{mUpd:"{n} Einträge aktualisiert (neuere Datei)", mOld:"{n} Einträge aus älteren Dateien nicht übernommen", mNew:"Beispielinhalt entfernt, Angaben aus der ersten Datei übernommen", sem:"Das ist ein Semesterpaket. Es gehört auf die persönliche Startseite (mein.html), nicht in den Rapport.", send:"Tag senden", abs:"Absenzen", backup:"Sichern", subj:"Tagesrapport", absHead:"Absenzen:", none:"Keine Absenzen.",
      att:"Anhang: {f}", attHint:"Die Datei wurde eben gespeichert (Ordner «Downloads» oder der gewählte Ordner). Bitte an diese Mail anhängen.",
      bar:"«Tag senden» speichert die Tagesdatei und öffnet die Mail an {m}: Datei anhängen, senden. «Sichern» legt eine eigene Sicherung ab."},
  en:{mUpd:"{n} entries updated (newer file)", mOld:"{n} entries from older files not taken over", mNew:"Sample content removed, details taken from the first file", sem:"This is a semester package. It belongs on the personal start page (mein.html), not in the report.", send:"Send the day", abs:"Absences", backup:"Back up", subj:"Day report", absHead:"Absences:", none:"No absences.",
      att:"Attachment: {f}", attHint:"The file has just been saved (Downloads or the folder you chose). Please attach it to this e-mail.",
      bar:"«Send the day» saves the day file and opens the e-mail to {m}: attach the file, send. «Back up» saves your own backup."},
  th:{mUpd:"อัปเดต {n} รายการ (ไฟล์ใหม่กว่า)", mOld:"ไม่นำ {n} รายการจากไฟล์ที่เก่ากว่ามาใช้", mNew:"ลบข้อมูลตัวอย่างแล้ว ใช้ข้อมูลจากไฟล์แรก", sem:"นี่คือชุดข้อมูลภาคเรียน ใช้ในหน้าเริ่มต้นส่วนตัว (mein.html) ไม่ใช่ในรายงาน", send:"ส่งข้อมูลของวันนี้", abs:"การขาด", backup:"สำรองข้อมูล", subj:"Tagesrapport", absHead:"การขาด:", none:"ไม่มีการขาด",
      att:"ไฟล์แนบ: {f}", attHint:"บันทึกไฟล์แล้ว (โฟลเดอร์ Downloads หรือโฟลเดอร์ที่เลือก) กรุณาแนบไฟล์กับอีเมลนี้",
      bar:"«ส่งข้อมูลของวันนี้» บันทึกไฟล์ของวันและเปิดอีเมลถึง {m}: แนบไฟล์แล้วส่ง «สำรองข้อมูล» บันทึกไฟล์สำรองของคุณเอง"}
};
const n2l = k => ((N2LAP[S.settings.uiLang] || N2LAP.de)[k] || N2LAP.de[k]);
function n2LapDayMailHref(slotId, fname){
  const sl = slotById(slotId), list = absenceList(slotId);
  const head = [S.settings.group, S.settings.outlet, S.settings.teacher].filter(Boolean).join(" · ");
  const subj = n2l("subj") + " – " + [S.settings.outlet, S.settings.teacher, slotLabel(sl)].filter(Boolean).join(" · ");
  const body = [head, slotLabel(sl) + " · " + VARIANT, "", n2l("absHead")]
    .concat(list.length ? list.map(absenceLine) : [n2l("none")])
    .concat(["", n2l("att").replace("{f}", fname), n2l("attHint")]).join("\n");
  return "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
}
function n2LapSendDay(){
  const fname = fileStem() + ".json";
  const a = el("a",{href:n2LapDayMailHref(curSlot, fname), target:"_blank", rel:"noopener", style:"display:none"});
  document.body.appendChild(a); a.click(); a.remove();
  saveFile(fname, JSON.stringify(snapshot(), null, 1), "application/json");
}
function n2LapBackup(){
  saveFile("Sicherung_" + fileStem() + ".json", JSON.stringify(snapshot(), null, 1), "application/json");
}
function n2LapBar(){
  const bar = el("div",{class:"n2bar"});
  bar.appendChild(el("button",{class:"btn pri",text:"✉ " + n2l("send"),onclick:n2LapSendDay}));
  bar.appendChild(el("button",{class:"btn",text:"✉ " + n2l("abs"),onclick:()=>openAbsenceMail(curSlot)}));
  bar.appendChild(el("button",{class:"btn",text:"⤓ " + n2l("backup"),onclick:n2LapBackup}));
  bar.appendChild(el("span",{class:"muted n2hint",text:n2l("bar").replace("{m}", ABS_MAIL)}));
  return bar;
}
function openAbsenceMail(slotId){
  const a = el("a",{href:absenceMailHref(slotId), target:"_blank", rel:"noopener", style:"display:none"});
  document.body.appendChild(a); a.click(); a.remove();
  toast(t("absMailSent"));
}

/* ---------- Bottom Sheet ---------- */
let sheetCrit = "hyg";
function openSheet(student){
  const host = document.getElementById("sheetHost"); host.innerHTML = "";
  const close = ()=>{ host.innerHTML=""; document.body.style.overflow="";
                      document.removeEventListener("keydown", onKey); renderDay(); };
  document.body.style.overflow = "hidden";   // Seite hinter dem Sheet nicht mitscrollen
  const onKey = e => { if(e.key==="Escape") close(); };
  document.addEventListener("keydown", onKey);
  host.appendChild(el("div",{class:"scrim",onclick:close}));
  const sheet = el("div",{class:"sheet",role:"dialog","aria-modal":"true"});
  sheet.appendChild(el("div",{class:"sheet-h"},[
    el("h3",{text:student.name + " · " + slotLabel(slotById(curSlot))}),
    el("button",{class:"btn sm pri",text:t("done"),onclick:close})
  ]));
  const tabs = el("div",{class:"crittabs"});
  CRITS.forEach(c=>tabs.appendChild(el("button",{text:critName(c.k, S.settings.uiLang),
    "aria-current":String(sheetCrit===c.k), onclick:()=>{ sheetCrit=c.k; draw(); }})));
  tabs.appendChild(el("button",{class:"note",text:"✎ "+t("noteTab"),
    "aria-current":String(sheetCrit==="__note"), onclick:()=>{ sheetCrit="__note"; draw(); }}));
  sheet.appendChild(tabs);
  const body = el("div",{class:"sheet-b"}); sheet.appendChild(body);
  host.appendChild(sheet);

  function draw(){
    [...tabs.children].forEach((b,ix)=>{
      const k = (ix < CRITS.length) ? CRITS[ix].k : "__note";
      b.setAttribute("aria-current", String(k===sheetCrit));
    });
    body.innerHTML = "";
    const r = dayRec(curSlot, student.id);

    if(sheetCrit === "__note"){
      body.appendChild(el("p",{class:"muted",style:"margin:0",text:t("noteHint")}));
      const nt = r.note || {txt:"",crit:"",dir:0,w:0};
      const f1 = el("div",{class:"field",style:"margin:0"});
      const ta = el("textarea",{id:"noteTxt",placeholder:t("note")}); ta.value = nt.txt||"";
      f1.appendChild(ta); body.appendChild(f1);

      const g = el("div",{class:"grid2"});
      const f2 = el("div",{class:"field"});
      f2.appendChild(el("label",{for:"noteCrit",text:t("noteCrit")}));
      const sc = el("select",{id:"noteCrit"});
      sc.appendChild(el("option",{value:"",text:"—",selected:!nt.crit}));
      CRITS.forEach(c=>sc.appendChild(el("option",{value:c.k,text:critName(c.k,S.settings.uiLang),selected:nt.crit===c.k})));
      f2.appendChild(sc); g.appendChild(f2);

      const f3 = el("div",{class:"field"});
      f3.appendChild(el("label",{for:"noteEff",text:t("noteEffect")}));
      const se = el("select",{id:"noteEff"});
      const cur = (nt.dir&&nt.w) ? (nt.dir>0?"+":"-")+nt.w : "0";
      [["0",t("neutral")],["+0.25","+ 0.25"],["+0.5","+ 0.50"],["+1","+ 1.00"],
       ["-0.25","− 0.25"],["-0.5","− 0.50"],["-1","− 1.00"]]
        .forEach(([v,lb])=>se.appendChild(el("option",{value:v,text:lb,selected:cur===v})));
      f3.appendChild(se); g.appendChild(f3);
      body.appendChild(g);

      const ci = el("input",{type:"checkbox",id:"noteInt",checked:!!nt.internal});
      body.appendChild(el("label",{class:"chk",for:"noteInt"},[ci, el("span",{text:t("internal")})]));

      body.appendChild(el("button",{class:"btn pri",text:t("done"),onclick:()=>{
        unseed();
        const txt = ta.value.trim();
        if(!txt){ r.note = null; }
        else{
          const num = parseFloat(se.value);
          r.note = {txt, crit: sc.value||"", dir: num>0?1:(num<0?-1:0), w: Math.abs(num)||0, internal: ci.checked};
          if(!r.note.crit){ r.note.dir = 0; r.note.w = 0; }
        }
        persist(); close();
      }}));
      return;
    }

    [[1,t("plus")],[-1,t("minus")]].forEach(([dir,label])=>{
      const list = CHIPS.filter(c=>c.c===sheetCrit && c.d===dir);
      if(!list.length) return;
      const grp = el("div",{class:"grp"});
      grp.appendChild(el("span",{class:"eyebrow",text:label}));
      const opts = el("div",{class:"opts"});
      list.forEach(c=>{
        const on = obsOf(r).includes(c.i);
        const sig = c.ko ? "K.-o." : (c.d>0?"+":"−") + c.w.toFixed(2).slice(1);
        const b = el("button",{class:"opt "+(c.d>0?"p":"m")+(on?" on":"")+(c.ko?" ko":""),
          onclick:()=>{ unseed();
            r.obs = obsOf(r).includes(c.i) ? obsOf(r).filter(x=>x!==c.i) : [...obsOf(r), c.i];
            persist(); draw(); }},
          [el("span",{class:"sig num",text:sig}), el("span",{text:chipT(c, S.settings.uiLang)})]);
        opts.appendChild(b);
      });
      grp.appendChild(opts); body.appendChild(grp);
    });
  }
  draw();
}

/* ---------- Übersicht ---------- */
function renderWeek(){
  const root = document.getElementById("v-week"); root.innerHTML = "";
  const rows = S.students.map(s=>({s, sum:summary(s.id, repMode)}));
  if(!rows.some(r=>r.sum.counted)){ root.appendChild(el("p",{class:"muted",text:t("noData")})); return; }

  const withExam = (repMode === "all") && !!examSlot();
  const showFinal = withExam;
  const tbl = el("table");
  const trh = el("tr");
  trh.appendChild(el("th",{text:t("student")}));
  CRITS.forEach(c=>trh.appendChild(el("th",{text:critName(c.k, S.settings.uiLang).split(" ")[0]})));
  trh.appendChild(el("th",{class:"sep",text: withExam ? t("praxisGrade") : t("total")}));
  if(withExam) trh.appendChild(el("th",{text:t("examShort")}));
  if(showFinal) trh.appendChild(el("th",{text:t("finalGrade")}));
  trh.appendChild(el("th",{class:"sep",text:t("days")}));
  trh.appendChild(el("th",{text:t("absTm")}));
  tbl.appendChild(el("thead",{},trh));
  const tb = el("tbody");
  rows.forEach(({s,sum})=>{
    const ex = withExam ? examSummary(s.id) : null;
    const tr2 = el("tr");
    tr2.appendChild(el("td",{class:"nm"},[avatar(s, 26), document.createTextNode(" " + s.name + nickTag(s))]));
    CRITS.forEach(c=>{
      const g = sum.crit ? sum.crit[c.k] : null;
      tr2.appendChild(el("td",{class:"n"},
        el("span",{class:"grade num "+gradeClass(g),style:"min-width:0;padding:1px 6px;font-size:13px",text:fmt1(g)})));
    });
    tr2.appendChild(el("td",{class:"n sep"},
      el("span",{class:"grade num "+gradeClass(sum.total),style:"padding:2px 8px;font-size:13.5px",text:fmt(sum.total)})));
    if(withExam) tr2.appendChild(el("td",{class:"n"},
      el("span",{class:"grade num "+gradeClass(ex?ex.total:null),style:"padding:2px 8px;font-size:13.5px",
        text: ex ? fmt(ex.total) : "–"})));
    if(showFinal){
      const f = finalGrade(sum.total, ex?ex.total:null);
      tr2.appendChild(el("td",{class:"n"},
        el("span",{class:"grade num "+gradeClass(f),style:"padding:2px 8px;font-size:13.5px;font-weight:600",text:fmt1(f),title:fmt(f)})));
    }
    tr2.appendChild(el("td",{class:"n sep",text:String(sum.counted)}));
    const a = [];
    if(sum.exc) a.push(sum.exc+"× "+t("excused"));
    if(sum.unx) a.push(sum.unx+"× "+t("unexcused"));
    if(sum.late) a.push(sum.late+"× "+t("late"));
    if(sum.tm) a.push(sum.tm+"× "+t("teamMarket"));
    if(ex && (ex.att==="excused"||ex.att==="unexcused")) a.push(t("examShort")+": "+t("absent"));
    tr2.appendChild(el("td",{text: a.length ? a.join(", ") : "–"}));
    tb.appendChild(tr2);
  });
  tbl.appendChild(tb);
  root.appendChild(el("div",{class:"tblwrap"}, tbl));

  const ovb = el("div",{class:"card pad",style:"margin-top:14px"});
  ovb.appendChild(el("span",{class:"eyebrow",style:"display:block;margin-bottom:8px",text:t("ovMailBtn")}));
  ovb.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("ovMailHint")}));
  ovb.appendChild(el("div",{class:"row"},[
    el("button",{class:"btn pri",text:"\u2709 "+t("ovMailBtn"),onclick:openOverviewMail}),
    el("button",{class:"btn",text:t("exportXlsx"),onclick:()=>{
      const b = buildXlsx();
      if(b) saveFile(fileStem()+".xlsx", b);
      else { saveFile(fileStem()+".csv", buildCsv(), "text/csv;charset=utf-8"); toast("CSV"); }
    }})
  ]));
  ovb.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",text:ABS_MAIL}));
  root.appendChild(ovb);
  if(withExam && !dayOpen(examSlot().id))
    root.appendChild(el("p",{class:"muted",style:"margin:8px 0 0",text:"◆ "+t("examOpen")}));

  const legend = el("div",{class:"card pad",style:"margin-top:14px"});
  legend.appendChild(el("span",{class:"eyebrow",text:"EHL "+t("grade"),style:"display:block;margin-bottom:8px"}));
  const sc = el("div",{class:"scale"});
  [["6.0","Excellent"],["5.5","Very good"],["5.0","Good"],["4.5","Satisfactory"],["4.0","Sufficient"],["3.5","Insufficient"],["1.0","Nugatory"]]
    .forEach(([n,d])=>{ sc.appendChild(el("b",{text:n})); sc.appendChild(el("span",{class:"muted",text:d})); });
  legend.appendChild(sc);
  root.appendChild(legend);
}

/* ---------- Beurteilungstexte ---------- */
function buildReport(s, mode, lg){
  const sum = summary(s.id, mode);
  const period = recordedPeriod(s.id, mode, lg);
  const P = k => tOut(k, lg);
  const ex = (mode === "all") ? examSummary(s.id) : null;
  const fin = ex ? finalGrade(sum.total, ex.total) : null;
  const out = [];
  out.push(longName(s) + [klasseOf(s), gruppeOf(s)].filter(Boolean)
    .map(x=>" \u00b7 " + x).join(""));
  out.push(period + " · " + sum.counted + " " + P("daysCounted"));
  if(sum.total!=null) out.push(P(ex?"praxisGrade":"grade") + ": " + fmt(sum.total) + " (" + bandName(sum.total, lg) + ")");
  if(ex){
    out.push(P("examGrade") + ": " + (ex.total!=null
      ? fmt(ex.total) + " (" + bandName(ex.total, lg) + ")"
      : P("noData")));
  }
  if(fin!=null) out.push(P("finalGrade") + ": " + fmt1(fin) + " (" + bandName(fin, lg) + ")");
  out.push("");
  if(!sum.counted && !sum.notes.length){ out.push(P("noData")); return out.join("\n"); }

  const entries = Object.entries(sum.tally).map(([id,n])=>({c:CHIP[id],n})).filter(x=>x.c);
  const pos = entries.filter(x=>x.c.d>0).sort((a,b)=>b.n-a.n||b.c.w-a.c.w);
  const neg = entries.filter(x=>x.c.d<0).sort((a,b)=>(b.n*(b.c.w||1))-(a.n*(a.c.w||1)));

  if(pos.length){
    out.push(P("takeaway") + ":");
    pos.slice(0,6).forEach(x=>out.push("• " + critName(x.c.c, lg) + ": " + chipT(x.c, lg) + (x.n>1?" ("+x.n+"×)":"")));
    out.push("");
  }
  if(neg.length){
    /* Beobachtung bleibt nachvollziehbar, der Schwerpunkt liegt auf dem nächsten Schritt. */
    out.push(P("gain") + ":");
    neg.slice(0,4).forEach((x,ix)=>{
      out.push((ix+1) + ". " + critName(x.c.c, lg));
      out.push("   " + P("observed") + ": " + chipT(x.c, lg) + (x.n>1?" ("+x.n+"×)":""));
      if(x.c.a) out.push("   " + P("nextStep") + ": " + chipA(x.c, lg));
    });
    out.push("");
  }
  const openNotes = sum.notes.filter(n=>!n.internal);
  if(openNotes.length){
    out.push(P("notes") + ":");
    openNotes.forEach(n=>out.push("• " + slotLabel(n.slot, lg) + ": " + n.txt));
    out.push("");
  }
  if(sum.exc || sum.unx || sum.late){
    const a = [];
    if(sum.exc) a.push(sum.exc + " × " + P("excusedNote"));
    if(sum.unx) a.push(sum.unx + " × " + P("unexcusedNote"));
    if(sum.late) a.push(sum.late + " × " + P("late"));
    out.push(P("abs") + ": " + a.join(", "));
    out.push("");
  }
  if(sum.tm){
    out.push(P("teamMarket") + ": " + sum.tm + " × (5.00)");
    out.push("");
  }
  const g0 = (fin!=null) ? fin : (sum.total!=null ? sum.total : (ex?ex.total:null));
  if(g0!=null) out.push(P(g0>=5.25 ? "cl1" : g0>=4.75 ? "cl2" : g0>=4.0 ? "cl3" : "cl4"));
  out.push("");
  out.push(P("weightNote"));
  out.push("");
  if(sum.crit) out.push(P(ex?"praxis":"grade") + ": " + CRITS.map(c=>critName(c.k, lg)+" "+fmt1(sum.crit[c.k])).join("  ·  "));
  if(ex && ex.crit) out.push(P("examShort") + ": " + CRITS.map(c=>critName(c.k, lg)+" "+fmt1(ex.crit[c.k])).join("  ·  "));
  return out.join("\n").trim();
}
const allReports = () => S.students.map(s=>buildReport(s, repMode, outLangOf(s)))
  .join("\n\n" + "—".repeat(30) + "\n\n");

function renderRep(){
  const root = document.getElementById("v-rep"); root.innerHTML = "";
  const bar = el("div",{class:"row",style:"margin-bottom:14px"});
  bar.appendChild(el("button",{class:"btn sm",text:t("copyAll"),onclick:()=>copy(allReports())}));
  bar.appendChild(el("button",{class:"btn sm pri",text:t("printPdf"),onclick:printReports}));
  bar.appendChild(el("span",{class:"muted",style:"margin-left:auto",text:t("repLangAll")}));
  const selAll = el("select",{class:"mini","aria-label":t("repLangAll"),
    onchange:e=>{ if(!e.target.value) return; unseed();
      S.students = S.students.map(x=>({...x, lang:e.target.value})); persist(); renderRep(); }});
  selAll.appendChild(el("option",{value:"",text:"—"}));
  OUT_LANGS.forEach(l=>selAll.appendChild(el("option",{value:l.code,text:l.name})));
  bar.appendChild(selAll);
  root.appendChild(bar);

  let any = false;
  S.students.forEach(s=>{
    const sum = summary(s.id, repMode); if(!sum.counted && !sum.exc && !sum.notes.length) return;
    any = true;
    const lg = outLangOf(s);
    const txt = buildReport(s, repMode, lg);
    const box = el("div",{class:"rep"});
    const hd = el("div",{class:"rep-h"});
    hd.appendChild(el("h3",{text:s.name}));
    const selL = el("select",{class:"mini","aria-label":t("repLang"),title:t("repLang"),
      onchange:e=>{ unseed(); s.lang = e.target.value; persist(); renderRep(); }});
    OUT_LANGS.forEach(l=>selL.appendChild(el("option",{value:l.code,text:l.name,selected:lg===l.code})));
    hd.appendChild(selL);
    box.appendChild(hd);
    const exq = (repMode==="all") ? examSummary(s.id) : null;
    box.appendChild(el("div",{class:"meta",text:
      (sum.total!=null ? t(exq?"praxisGrade":"grade")+" "+fmt(sum.total)+" · " : "")
      + (exq && exq.total!=null ? t("examGrade")+" "+fmt(exq.total)+" · " : "")
      + sum.counted+" "+t("daysCounted")}));
    box.appendChild(el("pre",{text:txt}));
    box.appendChild(el("div",{class:"row acts"},[
      el("button",{class:"btn sm",text:t("copy"),onclick:()=>copy(txt)}),
      el("a",{class:"btn sm",target:"_blank",rel:"noopener",
        title: s.mail || t("noMail"),
        href:"mailto:"+encodeURIComponent(s.mail||"")+"?subject="+encodeURIComponent(t("emailSubj")+" – "+s.name)
             +"&body="+encodeURIComponent(txt),
        text:t("mail")+(s.mail?"":" ⚠︎")})
    ]));
    root.appendChild(box);
  });
  if(!any) root.appendChild(el("p",{class:"muted",text:t("noData")}));
}

/* ---------- Druckansicht / PDF ---------- */
function printReports(){
  const area = document.getElementById("printArea");
  area.innerHTML = "";
  let n = 0;
  const gbox = (label, g, strong, lg) => {
    const b = el("div",{class:"pgbox"});
    b.appendChild(el("div",{class:"lb",text:label}));
    b.appendChild(el("div",{class:"vl",style:strong?"":"font-weight:500",text:fmt(g)}));
    b.appendChild(el("div",{class:"bd",text: g==null ? "–" : bandName(g,lg)}));
    return b;
  };
  S.students.forEach(s=>{
    const sum = summary(s.id, repMode);
    if(!sum.counted && !sum.exc && !sum.notes.length) return;
    n++;
    const lg = outLangOf(s);
    const closings = ["cl1","cl2","cl3","cl4"].map(k=>tOut(k,lg));
    const ex = (repMode==="all") ? examSummary(s.id) : null;
    const fin = ex ? finalGrade(sum.total, ex.total) : null;
    const doc = el("div",{class:"pdoc"});
    doc.appendChild(el("img",{class:"plogo",src:LOGO,alt:"EHL Hotelfachschule Passugg"}));
    doc.appendChild(el("div",{class:"phead"},[
      el("h2",{text:s.name}),
      el("div",{class:"pmeta",text:[S.settings.group, S.settings.teacher, recordedPeriod(s.id, repMode, lg),
        sum.counted+" "+tOut("daysCounted",lg)].filter(Boolean).join("   ·   ")})
    ]));
    const gr = el("div",{class:"pgrades"});
    gr.appendChild(gbox(tOut(ex?"praxisGrade":"grade",lg), sum.total, !ex || fin==null, lg));
    if(ex) gr.appendChild(gbox(tOut("examGrade",lg), ex.total, fin==null, lg));
    if(fin!=null) gr.appendChild(gbox(tOut("finalGrade",lg), fin, true, lg));
    doc.appendChild(gr);
    if(sum.crit){
      const tb = el("table");
      const hr = el("tr"); hr.appendChild(el("th",{text:""}));
      CRITS.forEach(c=>hr.appendChild(el("th",{text:critName(c.k,lg)})));
      tb.appendChild(el("thead",{},hr));
      const body2 = el("tbody");
      const dr = el("tr"); dr.appendChild(el("td",{style:"font-weight:600",text:tOut(ex?"praxis":"grade",lg)}));
      CRITS.forEach(c=>dr.appendChild(el("td",{text:fmt1(sum.crit[c.k])})));
      body2.appendChild(dr);
      if(ex && ex.crit){
        const er = el("tr"); er.appendChild(el("td",{style:"font-weight:600",text:tOut("examShort",lg)}));
        CRITS.forEach(c=>er.appendChild(el("td",{text:fmt1(ex.crit[c.k])})));
        body2.appendChild(er);
      }
      tb.appendChild(body2);
      doc.appendChild(tb);
    }
    const lines = buildReport(s, repMode, lg).split("\n");
    const skip = lines.findIndex(l=>l==="");
    lines.slice(skip+1).forEach(line=>{
      if(!line) return;
      if(line.endsWith(":") && !line.startsWith("•")) doc.appendChild(el("h3",{text:line.slice(0,-1)}));
      else if(/^\s{3}/.test(line)) doc.appendChild(el("div",{style:"margin-left:8mm;color:#3B4657",text:line.trim()}));
      else if(line.startsWith("•") || /^\d+\./.test(line)) doc.appendChild(el("div",{class:"li",text:line}));
      else if(line.indexOf("  ·  ") > -1) return;      // Kriterienzeile steckt schon in der Tabelle
      else if(line === tOut("weightNote",lg)) doc.appendChild(el("div",{class:"pnote",text:line}));
      else if(closings.indexOf(line) > -1) doc.appendChild(el("div",{class:"pclose",text:line}));
      else doc.appendChild(el("div",{style:"margin-bottom:1.5mm",text:line}));
    });
    doc.appendChild(el("div",{class:"psign"},[
      el("div",{text:tOut("teacher",lg)}),
      el("div",{text:tOut("student",lg)})
    ]));
    doc.appendChild(el("div",{class:"pfoot",text:"EHL Hotelfachschule Passugg · Hauptstrasse 12, 7062 Chur-Passugg · "
      + tOut("base",lg) + " " + baseNum().toFixed(2)
      + (S.settings.hyg2 ? " · " + tOut("hyg2",lg) : "")}));
    area.appendChild(doc);
  });
  if(!n){ toast(t("noData")); return; }
  document.body.classList.add("printing");
  const done = ()=>{ document.body.classList.remove("printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  setTimeout(()=>{ try{ window.print(); }catch(e){ toast("Print"); } setTimeout(done, 1500); }, 60);
}

/* ---------- Daten ---------- */
function csvEsc(v){
  let s = String(v==null?"":v);
  if(/^[=+\-@\t\r]/.test(s)) s = "'" + s;            // entschaerft Excel-Formeln
  return /[";\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s;
}
function gradeRows(){
  const rng = slotsInRange(repMode);
  const period = rng.length ? slotLabel(rng[0],"de")+" – "+slotLabel(rng[rng.length-1],"de") : "";
  const withExam = (repMode === "all") && !!examSlot();
  const head = ["Klasse","Gruppe/Team","Outlet","Dozent","Studierende","Nachname","Vorname","Nickname","E-Mail","Turnus","Tage gewertet","Entschuldigt","Unentschuldigt","Verspaetet","Team Market",
    ...CRITS.map(c=>c.de), withExam?"Praxisnote":"Gesamtnote","Gerundet","Prädikat"]
    .concat(withExam ? [...CRITS.map(c=>"Exam "+c.de), "Prüfungsnote","Exam Anwesenheit"] : [])
    .concat(withExam ? ["Schlussnote","Schlussnote gerundet"] : []).concat(["Sprache","Beurteilung"]);
  const rows = S.students.map(s=>{
    const su = summary(s.id, repMode);
    const ex = withExam ? examSummary(s.id) : null;
    const base = [klasseOf(s), gruppeOf(s), S.settings.outlet||"", S.settings.teacher,
                  dispName(s), s.last||"", s.first||"", s.nick||"", s.mail||"", period,
                  su.counted, su.exc, su.unx, su.late, su.tm||0,
      ...CRITS.map(c=>su.crit?Number(su.crit[c.k].toFixed(2)):""),
      su.total!=null?Number(su.total.toFixed(2)):"", su.total!=null?Number(fmt1(su.total)):"",
      su.total!=null?bandName(su.total,"de"):""];
    let row = base;
    if(withExam){
      const att = {present:"Anwesend",late:"Verspätet",excused:"Abwesend",unexcused:"Abwesend",tm:"Team Market"};
      row = row.concat([
        ...CRITS.map(c=>(ex&&ex.crit)?Number(ex.crit[c.k].toFixed(2)):""),
        (ex&&ex.total!=null)?Number(ex.total.toFixed(2)):"",
        ex?(att[ex.att]||ex.att):"nicht erfasst"
      ]);
    }
    if(withExam){
      const fin = finalGrade(su.total, ex?ex.total:null);
      row = row.concat([fin!=null?Number(fin.toFixed(2)):"", fin!=null?Number(fmt1(fin)):""]);   // Schlussnote auf 0.1 gerundet (Entscheid 06.10.2026)
    }
    row = row.concat([outLangOf(s)]);
    row = row.concat([buildReport(s, repMode, outLangOf(s))]);
    return row;
  });
  return {head, rows};
}
function evidenceRows(){
  const head = ["Studierende","Nachname","Vorname","Nickname","Einsatztag","Woche","Art","Erfasst von","Klasse","Gruppe/Team","Outlet","Anwesenheit",
                "Kriterium","Richtung","Gewicht","Beobachtung"];
  const rows = [];
  const rng = slotsInRange(repMode).concat(
    (repMode==="all" && examSlot()) ? [examSlot()] : []);
  rng.forEach(sl=>{
    const d = S.days[sl.id]; if(!d) return;
    S.students.forEach(s=>{
      const r = d[s.id]; if(!r) return;
      const att = {present:"Anwesend",late:"Verspätet",excused:"Entschuldigt",unexcused:"Unentschuldigt",tm:"Team Market"}[r.att]||r.att;
      const kind = sl.exam ? "Exam Day" : "Praxis";
      const lab = sl.exam ? "Exam Day" : slotLabel(sl,"de");
      const mt = dayMeta(sl.id);
      const pre = [dispName(s), s.last||"", s.first||"", s.nick||"", lab, sl.week, kind,
                   mt.teacher, klasseOf(s), gruppeOf(s), mt.outlet||"", att];
      obsOf(r).forEach(id=>{
        const c = CHIP[id]; if(!c) return;
        rows.push(pre.concat([critName(c.c,"de"), c.ko?"K.-o.":(c.d>0?"+":"−"), c.ko?"":c.w, chipT(c,"de")]));
      });
      if(r.note && r.note.txt)
        rows.push(pre.concat([r.note.crit?critName(r.note.crit,"de"):"",
          r.note.dir>0?"+":(r.note.dir<0?"−":""), r.note.w||"",
          (r.note.internal?"Freitext (intern): ":"Freitext: ")+r.note.txt]));
      if(!obsOf(r).length && !(r.note&&r.note.txt) && r.att!=="present")
        rows.push(pre.concat(["", "", "", ""]));
    });
  });
  return {head, rows};
}
function buildCsv(){
  const {head, rows} = gradeRows();
  return "﻿" + [head.map(csvEsc).join(";")].concat(rows.map(r=>r.map(csvEsc).join(";"))).join("\r\n");
}
function buildXlsx(){
  if(typeof XLSX === "undefined") return null;
  const g = gradeRows(), e = evidenceRows();
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet([g.head, ...g.rows]);
  ws1["!cols"] = g.head.map((h,i)=>({wch: i===4?24 : i===8?30 : (i<10?16:12)}));
  ws1["!cols"][g.head.length-1] = {wch:90};
  XLSX.utils.book_append_sheet(wb, ws1, "Noten");
  const ws2 = XLSX.utils.aoa_to_sheet([e.head, ...e.rows]);
  ws2["!cols"] = [{wch:24},{wch:16},{wch:14},{wch:12},{wch:14},{wch:6},{wch:10},
                  {wch:18},{wch:9},{wch:14},{wch:20},{wch:14},{wch:20},{wch:9},{wch:8},{wch:70}];
  XLSX.utils.book_append_sheet(wb, ws2, "Beobachtungen");
  const buf = XLSX.write(wb, {bookType:"xlsx", type:"array"});
  return new Blob([buf], {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}
/* Vollstaendiger Datensatz fuer jede JSON-Sicherung.
   Kopf mit Klartext oben, danach die Rohdaten wie bisher, damit das
   Zusammenfuehren mit aelteren Dateien weiter funktioniert.            */
function snapshot(){
  const sl = slots();
  return {
    app: "Kuechenrapport",
    variant: VARIANT,
    savedAt: new Date().toISOString(),
    meta: {
      group:   S.settings.group   || "",
      team:    S.settings.team    || "",
      outlet:  S.settings.outlet  || "",
      teacher: S.settings.teacher || "",
      slotCount: SLOT_COUNT,
      hasExam: HAS_EXAM,
      weekdays: (S.settings.weekdays || []).slice(),
      startIdx: S.settings.startIdx || 0,
      startDay: sl.length ? wdName(sl[0].wd) : "",
      uiLang: S.settings.uiLang,
      outLang: S.settings.outLang,
      base: baseNum(),
      hyg2: !!S.settings.hyg2,
      studentCount: S.students.length,
      daysRecorded: Object.keys(S.days || {}).length,
      slots: sl.map(x=>({id:x.id, label:slotLabel(x), weekday:x.wd, exam:!!x.exam}))
    },
    settings: S.settings,
    students: S.students,
    days: S.days,
    dayMeta: S.dayMeta
  };
}
function fileStem(){
  const d = new Date();
  const iso = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
  const clean = x => String(x||"").trim().replace(/[^A-Za-z0-9ÄÖÜäöüß]+/g,"-").replace(/^-+|-+$/g,"");
  const parts = [clean(S.settings.teacher), clean(S.settings.group), clean(S.settings.outlet), VARIANT, iso].filter(Boolean);
  return parts.length > 2 ? parts.join("_") : "Kuechenrapport_" + VARIANT + "_" + iso;
}

function renderData(){
  const root = document.getElementById("v-data"); root.innerHTML = "";

  const ex = el("details",{class:"exp",open:true});
  ex.appendChild(el("summary",{text:"Export"}));
  const r1 = el("div",{class:"row"});
  r1.appendChild(el("button",{class:"btn pri",text:t("exportXlsx"),onclick:()=>{
    const b = buildXlsx();
    if(b) saveFile(fileStem()+".xlsx", b);
    else { saveFile(fileStem()+".csv", buildCsv(), "text/csv;charset=utf-8"); toast("CSV"); }
  }}));
  r1.appendChild(el("button",{class:"btn",text:t("printPdf"),onclick:printReports}));
  r1.appendChild(el("button",{class:"btn",text:t("exportCsv"),onclick:()=>saveFile(fileStem()+".csv",buildCsv(),"text/csv;charset=utf-8")}));
  r1.appendChild(el("button",{class:"btn",text:t("exportTxt"),onclick:()=>saveFile(fileStem()+".txt",allReports())}));
  r1.appendChild(el("button",{class:"btn",text:t("exportJson"),onclick:()=>saveFile(fileStem()+".json",JSON.stringify(snapshot(),null,1),"application/json")}));
  ex.appendChild(el("div",{},[r1, el("p",{class:"muted",style:"margin:10px 0 0",
    text:"Excel enthält zwei Blätter: Noten und den Beobachtungsnachweis pro Einsatztag. PDF entsteht über den Druckdialog («Als PDF speichern»)."})]));
  root.appendChild(ex);

  const mg = el("details",{class:"exp"});
  mg.appendChild(el("summary",{text:t("merge")}));
  const mgb = el("div",{},[el("p",{class:"muted",style:"margin:0 0 10px",text:t("mergeHint")})]);
  if(VARIANT === "10T"){
    const fh = el("div",{class:"field"});
    fh.appendChild(el("label",{for:"fHalf",text:t("halfPlace")}));
    const selH = el("select",{id:"fHalf",onchange:e=>{ halfMode = e.target.value; }});
    [["auto",t("halfAuto")],["first",t("halfFirst")],["second",t("halfSecond")]]
      .forEach(([v,lb])=>selH.appendChild(el("option",{value:v,text:lb,selected:halfMode===v})));
    fh.appendChild(selH);
    fh.appendChild(el("span",{class:"muted",text:t("halfHint")}));
    mgb.appendChild(fh);
  }
  mgb.appendChild(el("input",{type:"file",accept:".json,application/json",multiple:true,id:"mergeFiles",onchange:onMerge}));
  mg.appendChild(mgb);
  root.appendChild(mg);

  const st = el("details",{class:"exp"});
  st.appendChild(el("summary",{text:t("topObs")}));
  const stb = el("div");
  const counts = {}; let totalObs = 0;
  slotsInRange(repMode).forEach(sl=>Object.values(S.days[sl.id]||{}).forEach(r=>obsOf(r).forEach(i=>{counts[i]=(counts[i]||0)+1;totalObs++;})));
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,12);
  if(!top.length) stb.appendChild(el("p",{class:"muted",text:t("noData")}));
  else{
    const max = top[0][1];
    top.forEach(([id,n])=>{
      const c = CHIP[id]; if(!c) return;
      stb.appendChild(el("div",{class:"row",style:"gap:10px;margin-bottom:6px;flex-wrap:nowrap"},[
        el("span",{class:"num",style:"width:2.2em;text-align:right;color:var(--ink3);font-size:12.5px",text:String(n)}),
        el("span",{class:"bar",style:"width:"+Math.max(6,Math.round(n/max*110))+"px;background:"+(c.d>0?"var(--plus)":"var(--minus)")}),
        el("span",{style:"font-size:13px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap",text:chipT(c,S.settings.uiLang)})
      ]));
    });
    stb.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",text:totalObs+" "+t("obsCount")}));
  }
  st.appendChild(stb); root.appendChild(st);
}
async function onMerge(e){
  const files = [...e.target.files]; let addedS=0, addedD=0; const clash=[], wrongVar=[], placed=[];
  /* Noten 2.0 (06.10.2026): Jede Tagesdatei enthält den ganzen Stand bis zu diesem Tag.
     Darum zuerst alle Dateien lesen und nach Speicherzeit ordnen. Gleiche Einträge werden
     still übersprungen (früher: Fehlalarm «doppelt erfasst»), bei Abweichungen gewinnt die
     neuere Datei (Korrekturen vom Folgetag kommen an). In eine neue Datei mit Beispielinhalt
     wird nicht hineingemischt: Beispielpersonen weg, Angaben aus der ersten Datei. */
  const docs = [];
  for(const f of files){
    try{ const o = JSON.parse(await f.text()); if(o && Array.isArray(o.students) && o.days) docs.push({o, f}); }catch(err){}
  }
  docs.sort((a, b) => String(a.o.savedAt || "").localeCompare(String(b.o.savedAt || "")));
  let updD = 0, oldD = 0, fresh = false;
  if(docs.length && (S.settings.isSample || (!S.students.length && !Object.keys(S.days || {}).some(k => Object.keys(S.days[k] || {}).length)))){
    const o0 = docs[0].o.settings || {};
    S.students = []; S.days = {}; S.dayMeta = {};
    ["group","team","outlet","outlet2","teacher","teacherPlan","paketId","weekdays","startIdx"].forEach(k => { if(o0[k] !== undefined) S.settings[k] = JSON.parse(JSON.stringify(o0[k])); });
    S.settings.isSample = false; S.settings.slotDates = []; fresh = !!S.settings.outlet;
  }
  const sameRec = (a, b) => { const n = r => JSON.stringify([r.att || "present", [...(r.obs || [])].sort(), r.note || null]); return n(a) === n(b); };
  for(const {o, f} of docs){
    try{
      const stand = String(o.savedAt || "");
      o.days = sanitizeDays(o.days);                 // fremde Datei auf die erwartete Form bringen
      if(!acceptsVariant(o.variant)){ wrongVar.push(f.name + " (" + o.variant + ")"); continue; }
      if(o.variant && o.variant !== VARIANT) placed.push(o.variant);
      const map = {};
      o.students.forEach(st=>{
        if(!st || typeof st !== "object") return;
        const nmOf = x => (dispName(x) || "").trim().toLowerCase();
        /* Gleicher Name und (falls beide vorhanden) gleiche E-Mail = dieselbe Person.
           Alle Felder werden uebernommen: vorher gingen Nachname/Vorname getrennt,
           Nickname, Klasse und Gruppe neuer Personen verloren (Fehler bis 05.10.2026). */
        let ex = S.students.find(x => nmOf(x) === nmOf(st) &&
          (!x.mail || !st.mail || x.mail.toLowerCase() === String(st.mail).toLowerCase()));
        if(!ex){
          ex = {id:"m"+Math.random().toString(36).slice(2,8), name:st.name||"",
                last:st.last||"", first:st.first||"", nick:st.nick||"",
                nr:st.nr||"", foto:st.foto||"",
                mail:st.mail||"", lang:st.lang||"",
                klasse:st.klasse||"", gruppe:st.gruppe||""};
          S.students.push(ex); addedS++;
        } else {                       // bestehende Person: fehlende Angaben nachtragen
          ["last","first","nick","mail","lang","klasse","gruppe","nr","foto"].forEach(k=>{
            if(!ex[k] && st[k]) ex[k] = st[k];
          });
        }
        map[st.id] = ex.id;
      });
      normalizeStudents();
      /* Daten der Einsatztage nachtragen (auch 5T + 4T in der 10-Tage-Datei) */
      const sd = Array.isArray(o.settings && o.settings.slotDates) ? o.settings.slotDates : [];
      if(sd.length){
        const arr = Array.isArray(S.settings.slotDates) ? S.settings.slotDates.slice() : [];
        sd.forEach((d, i) => { const slid = mapSlotId(o.variant, "d" + String(i + 1).padStart(2, "0"));
          if(slid && /^\d{4}-\d{2}-\d{2}$/.test(String(d))){ const n = parseInt(slid.slice(1), 10) - 1; if(!arr[n]) arr[n] = d; } });
        for(let i = 0; i < arr.length; i++) if(!arr[i]) arr[i] = "";
        S.settings.slotDates = arr;
      }
      Object.entries(o.days).forEach(([srcId,recs])=>{
        const slid = mapSlotId(o.variant, srcId);
        if(!slid) return;
        S.days[slid] = S.days[slid] || {};
        if(o.dayMeta && o.dayMeta[srcId] && !S.dayMeta[slid]) S.dayMeta[slid] = o.dayMeta[srcId];
        const standVorher = String((S.dayMeta[slid] || {}).stand || "");
        Object.entries(recs).forEach(([oldId,r])=>{
          const nid = map[oldId]; if(!nid) return;
          const cur = S.days[slid][nid];
          if(!cur){ S.days[slid][nid] = r; addedD++; }
          else if(sameRec(cur, r)) return;                                 // gleicher Eintrag aus einer späteren Tagesdatei
          else if(stand >= String((S.dayMeta[slid] || {}).stand || "")){ S.days[slid][nid] = r; updD++; }
          else oldD++;
        });
        if(stand && stand > standVorher){ S.dayMeta[slid] = S.dayMeta[slid] || {}; S.dayMeta[slid].stand = stand; }
      });
    }catch(err){}
  }
  unseed(); persist();
  let msg = "+"+addedS+" "+t("student")+" · +"+addedD+" "+t("days");
  if(fresh) msg = n2l("mNew") + "  ·  " + msg;
  if(updD) msg += "  ·  " + n2l("mUpd").replace("{n}", updD);
  if(oldD) msg += "  ⚠︎ " + n2l("mOld").replace("{n}", oldD);
  if(clash.length) msg += "  ⚠︎ "+clash.length+"× doppelt erfasst, bestehender Eintrag behalten: "
    + clash.slice(0,3).join(", ") + (clash.length>3 ? " …" : "");
  if(placed.length) msg += "  · " + [...new Set(placed)].join(", ") + " " + t("placedAs");
  if(wrongVar.length) msg += "  ⚠︎ " + t("wrongVariant") + ": " + wrongVar.join(", ");
  toast(msg); renderData();
}
/* Sicherung wieder einlesen: ersetzt den gesamten Inhalt dieser Datei */
async function onRestore(e){
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if(!f) return;
  try{
    const o = JSON.parse(await f.text());
    if(o && o.format === "praxisrapport-semesterpaket"){ toast(n2l("sem")); return; }
    if(!o || !o.settings || !Array.isArray(o.students)) throw new Error("format");
    if(o.variant && o.variant !== VARIANT){ toast(t("wrongVariant") + ": " + o.variant); return; }
    S = { settings:{...DEF, ...o.settings, isSample:false},
          students:o.students.filter(x=>x && typeof x.name === "string"),
          days:sanitizeDays(o.days),
          dayMeta:(o.dayMeta && typeof o.dayMeta === "object") ? o.dayMeta : {} };
    normalizeSettings(); pruneOrphans();
    persist();
    curSlot = slots()[0].id;
    view = "set"; render();
    toast(t("restoreDone") + ": " + S.students.length + " " + t("student")
          + " · " + Object.keys(S.days).length + " " + t("days"));
  }catch(err){ toast(t("restoreBad")); }
}

/* ---------- Einstellungen ---------- */
function renderSet(){
  const root = document.getElementById("v-set"); root.innerHTML = "";

  /* Gruppe */
  const c1 = el("div",{class:"card pad"});
  const g2 = el("div",{class:"grid5"});
  const txtField = (id, label, key, sub, opts) => {
    const f = el("div",{class:"field"});
    f.appendChild(el("label",{for:id, text:label, title:label}));
    const inp = el("input",{id:id, value:S.settings[key]||"",
      oninput:e=>{ S.settings[key]=e.target.value; persist();
                   if(sub) document.getElementById("brandSub").textContent = subLine(); }});
    if(opts && opts.length){                        // Vorschlagsliste, Freitext bleibt moeglich
      inp.setAttribute("list", id + "List");
      const dl = el("datalist",{id:id+"List"});
      opts.forEach(o=>dl.appendChild(el("option",{value:o})));
      f.appendChild(inp); f.appendChild(dl);
    } else f.appendChild(inp);
    return f;
  };
  g2.appendChild(txtField("fGroup",   t("klasseField"), "group",   true, KLASSEN));
  g2.appendChild(txtField("fTeam",    t("gruppeField"), "team",    true, GRUPPEN));
  g2.appendChild(txtField("fOutlet",  t("outletField"), "outlet",  true));
  g2.appendChild(txtField("fTeacher", t("teacher"),     "teacher", false));
  const f3 = el("div",{class:"field"});
  f3.appendChild(el("label",{for:"fBase",text:t("baseShort"),title:t("base")}));
  const selB = el("select",{id:"fBase",onchange:e=>{S.settings.base=parseFloat(e.target.value);persist();}});
  [4.5,4.75,5,5.25,5.5].forEach(v=>selB.appendChild(el("option",{value:String(v),text:v.toFixed(2),selected:baseNum()===v})));
  f3.appendChild(selB); g2.appendChild(f3);
  const f4 = el("div",{class:"field"});
  f4.appendChild(el("label",{text:"HACCP"}));
  const lbl = el("label",{style:"display:flex;gap:8px;align-items:center;font-size:14px;text-transform:none;letter-spacing:0;color:var(--ink);padding:8px 0"});
  lbl.appendChild(el("input",{type:"checkbox",id:"fHyg",checked:!!S.settings.hyg2,style:"width:auto",
    onchange:e=>{S.settings.hyg2=e.target.checked;persist();}}));
  lbl.appendChild(el("span",{text:t("hyg2")}));
  f4.appendChild(lbl);
  c1.appendChild(g2);
  c1.appendChild(el("p",{class:"muted",style:"margin:-4px 0 12px",text:t("kgHint")}));
  c1.appendChild(el("div",{class:"grid2"}, f4));

  const f5 = el("div",{class:"field"});
  f5.appendChild(el("label",{for:"fStud",text:t("studentList")}));
  const ta = el("textarea",{id:"fStud"});
  ta.value = S.students.map(studentLine).join("\n");
  f5.appendChild(ta);
  f5.appendChild(el("span",{class:"muted",text:t("studentListHint")}));
  c1.appendChild(f5);
  const rowb = el("div",{class:"row"});
  rowb.appendChild(el("button",{class:"btn pri",text:t("apply"),onclick:()=>{
    const lines = ta.value.split("\n").map(x=>x.trim()).filter(Boolean);
    S.students = lines.map(line=>{
      const f = parseStudentLine(line);
      const nm = [f.last, f.first].filter(Boolean).join(" ");
      const lang = OUT_LANGS.some(x=>x.code===f.lang) ? f.lang : "";
      const ex = S.students.find(s=>dispName(s).trim().toLowerCase() === nm.toLowerCase());
      const base = ex || {id:"s"+Math.random().toString(36).slice(2,8)};
      return {...base, name:nm, last:f.last, first:f.first,
              nick:   f.nick   || (ex && ex.nick)   || "",
              mail:   f.mail   || (ex && ex.mail)   || "",
              lang:   lang     || (ex && ex.lang)   || "",
              klasse: f.klasse || (ex && ex.klasse) || "",
              gruppe: f.gruppe || (ex && ex.gruppe) || ""};
    });
    normalizeStudents();
    pruneOrphans(); unseed(); persist(); toast(S.students.length+" "+t("student")); render();
  }}));
  const cb = el("input",{type:"checkbox",id:"fBan",checked:!!S.settings.hideBanner,
    onchange:e=>{S.settings.hideBanner=e.target.checked;persist();render();}});
  c1.appendChild(el("label",{class:"chk",for:"fBan"},[cb, el("span",{text:t("hideBanner")})]));
  c1.appendChild(rowb);
  root.appendChild(c1);

  /* Turnus */
  const c2 = el("div",{class:"card pad",style:"margin-top:14px"});
  c2.appendChild(el("span",{class:"eyebrow",text:t("turnus"),style:"display:block;margin-bottom:10px"}));
  const fw = el("div",{class:"field"});
  fw.appendChild(el("label",{text:t("weekdaysLbl")}));
  const wd = el("div",{class:"wdays"});
  WDAYS.forEach(w=>wd.appendChild(el("button",{text:wdName(w.k).slice(0,3),
    "aria-pressed":String((S.settings.weekdays||[]).includes(w.k)),
    onclick:()=>{
      const cur = S.settings.weekdays||[];
      S.settings.weekdays = cur.includes(w.k) ? cur.filter(x=>x!==w.k)
        : WDAYS.filter(x=>cur.includes(x.k)||x.k===w.k).map(x=>x.k);
      if(!S.settings.weekdays.length) S.settings.weekdays = [w.k];
      if(S.settings.startIdx >= S.settings.weekdays.length) S.settings.startIdx = 0;
      persist(); renderSet();
    }})));
  fw.appendChild(wd); c2.appendChild(fw);

  const g3 = el("div",{class:"grid2"});
  const fs = el("div",{class:"field"});
  fs.appendChild(el("label",{for:"fStart",text:t("startOn")}));
  const selS = el("select",{id:"fStart",onchange:e=>{S.settings.startIdx=parseInt(e.target.value,10);persist();curSlot=slots()[0].id;render();}});
  (S.settings.weekdays||[]).forEach((k,ix)=>selS.appendChild(el("option",{value:String(ix),text:wdName(k),selected:S.settings.startIdx===ix})));
  fs.appendChild(selS); g3.appendChild(fs);
  const fx = el("div",{class:"field"});
  fx.appendChild(el("label",{text:t("fixedRules")}));
  fx.appendChild(el("div",{style:"padding:8px 0;font-size:13.5px;color:var(--ink2);line-height:1.5",
    text: HAS_EXAM
      ? SLOT_COUNT + " " + t("daysFixed") + " · " + t("examFixed").replace("10", String(SLOT_COUNT)) + " · " + t("fm67")
      : SLOT_COUNT + " " + t("daysFixed") + " · " + t("vNoExam") + " · " + t("fmPraxis")}));
  g3.appendChild(fx);
  c2.appendChild(g3);
  c2.appendChild(el("p",{class:"muted",style:"margin:2px 0 10px",text:t("turnusHint")+" "+t("examHint")}));
  c2.appendChild(el("div",{class:"row",style:"gap:5px"},
    slots().map(s=>el("span",{class:"obs "+(s.exam?"p":"nt"),style:"padding:2px 9px;font-size:12px",
      text:(s.exam ? t("examDay")+" ("+wdName(s.wd)+")" : slotLabel(s))+(dayOpen(s.id)?" ✓":"")}))));
  root.appendChild(c2);

  /* Rechenlogik */
  const c4 = el("div",{class:"card pad",style:"margin-top:14px"});
  c4.appendChild(el("span",{class:"eyebrow",text:t("calc"),style:"display:block;margin-bottom:8px"}));
  const info = el("div",{style:"font-size:13.5px;line-height:1.65;color:var(--ink2)"});
  info.innerHTML = "Jeder Einsatztag startet pro Kriterium auf der Basisnote <b class='num'>"+baseNum().toFixed(2)+"</b>. "+
    "Jede angetippte Beobachtung verschiebt diese Note: leicht <b class='num'>0.25</b>, mittel <b class='num'>0.50</b>, schwer <b class='num'>1.00</b>. "+
    "Pro Tag und Kriterium sind maximal <b class='num'>−1.50</b> und <b class='num'>+1.00</b> möglich. "+
    "Ein K.-o.-Baustein setzt das Kriterium auf <b class='num'>1.00</b>. "+
    "Ein Tag ohne Beobachtung zählt bewusst als «wie erwartet». "+
    "Unentschuldigt ergibt eine Tagesnote von <b class='num'>1.00</b>, entschuldigt zählt nicht in den Durchschnitt. "+
    "«Verspätet» setzt automatisch einen Abzug auf Teamfähigkeit. "+
    "Ein Freitext wirkt nur dann auf die Note, wenn ein Kriterium und eine Wirkung gewählt sind. "+
    (S.settings.hyg2 ? "Hygiene zählt im Gesamtschnitt <b>doppelt</b>. " : "Hygiene zählt im Gesamtschnitt einfach. ")+
    (HAS_EXAM
      ? "Der <b>Exam Day</b> ist der " + SLOT_COUNT + ". und letzte Einsatztag. Er wird mit demselben Raster bewertet, "
        + "ergibt eine <b>eigene Note</b> und fliesst nicht in die Praxisnote ein. Abwesenheit am Exam Day ergibt "
        + "<b class='num'>1.00</b>, unabhängig vom Grund; nach einer Nachprüfung wird der Eintrag überschrieben. "
        + "Die <b>Schlussnote</b> ist fest gerechnet: zwei Drittel Praxisnote, ein Drittel Prüfungsnote. "
      : "Diese Variante hat <b>keinen Exam Day</b>. Alle " + SLOT_COUNT + " Einsatztage ergeben zusammen eine Note. ")
    + ""
    + "<b>Team Market</b> ist keine Absenz: der Tag zählt in allen Kriterien fest mit <b class='num'>5.00</b>.";
  c4.appendChild(info);
  root.appendChild(c4);

  /* Sicherung */
  const cB = el("div",{class:"card pad",style:"margin-top:14px"});
  cB.appendChild(el("span",{class:"eyebrow",text:t("backupTitle"),style:"display:block;margin-bottom:8px"}));
  cB.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("backupHint")}));
  cB.appendChild(el("div",{class:"row"},
    el("button",{class:"btn pri",text:t("backupBtn"),onclick:()=>{
      saveFile(fileStem()+".json", JSON.stringify(snapshot(),null,1), "application/json");
      toast(t("backupDone"));
    }})));
  cB.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",
    text:fileStem()+".json"}));
  /* Gegenrichtung: Sicherung wieder einlesen */
  cB.appendChild(el("div",{style:"margin-top:14px;padding-top:12px;border-top:1px solid var(--line)"},[
    el("span",{class:"eyebrow",style:"display:block;margin-bottom:8px",text:t("restoreTitle")}),
    el("p",{class:"muted",style:"margin:0 0 10px",text:t("restoreHint")})
  ]));
  const rin = el("input",{type:"file",accept:".json,application/json",id:"restoreFile",
                          style:"display:none",onchange:onRestore});
  let rArmed = false;
  const rbtn = el("button",{class:"btn",text:t("restoreBtn"),onclick:()=>{
    const hasData = S.students.length || Object.keys(S.days||{}).length;
    if(hasData && !rArmed){
      rArmed = true;
      rbtn.textContent = t("restoreArm");
      rbtn.style.borderColor = "var(--minus)"; rbtn.style.color = "var(--minus)";
      setTimeout(()=>{ if(rArmed){ rArmed=false; renderSet(); } }, 6000);
      return;
    }
    rin.click();
  }});
  cB.appendChild(el("div",{class:"row"},[rbtn, rin]));
  cB.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",text:t("restoreWarn")}));
  root.appendChild(cB);

  /* Zurücksetzen */
  const c5 = el("div",{class:"card pad",style:"margin-top:14px"});
  c5.appendChild(el("span",{class:"eyebrow",text:t("reset"),style:"display:block;margin-bottom:8px"}));
  c5.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("resetHint")}));
  const rrow = el("div",{class:"row"});
  rrow.appendChild(el("button",{class:"btn sm",text:t("exportJson"),
    onclick:()=>saveFile(fileStem()+".json", JSON.stringify(snapshot(),null,1), "application/json")}));
  let armed = false;
  const rb = el("button",{class:"btn sm",style:"border-color:var(--minus);color:var(--minus)",text:t("reset"),
    onclick:()=>{
      if(!armed){
        armed = true;
        rb.textContent = t("resetConfirm");
        rb.style.background = "var(--minus)"; rb.style.color = "#fff"; rb.style.borderColor = "var(--minus)";
        setTimeout(()=>{ if(armed){ armed=false; renderSet(); } }, 6000);
        return;
      }
      const keep = {...DEF, uiLang:S.settings.uiLang, outLang:S.settings.outLang,
                    customLangs:S.settings.customLangs||{}, hideBanner:S.settings.hideBanner};
      S = {settings:keep, students:[], days:{}, dayMeta:{}};
      persist(); curSlot = slots()[0].id; view = "set"; render(); toast(t("resetDone"));
    }});
  rrow.appendChild(rb);
  c5.appendChild(rrow);
  c5.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",
    text:t("storeFile")+": "+FILENAME}));
  root.appendChild(c5);
}

/* ---------- Sprachumschalter ---------- */
document.getElementById("uiLang").addEventListener("change", e=>{
  S.settings.uiLang = e.target.value; persist(); render();
});
document.getElementById("outLang").addEventListener("change", e=>{
  S.settings.outLang = e.target.value; persist(); render();
});


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
setTimeout(() => n2Handoff(o => onRestore({target:{files:[new File([JSON.stringify(o)], "paket.json")], value:""}})), 30);
/* Start: Ansicht zeichnen. Steht bewusst NACH der Übergabe-Zeile, weil tools/sync_handoff.py den Block davor ersetzt. */
render();
</script>
