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
 de:{
  stNames:"Alle Studierenden haben einen Namen",stClass:"Klasse und Gruppe sind gesetzt",
  dropConfirm:"Tag wirklich verwerfen?",dropDone:"Tag verworfen",
  sameName:"gleicher Name, andere E-Mail",
  ovClipCrit:"E-Mail vorbereitet. Die Werte je Kriterium liegen zusätzlich in der Zwischenablage.",
  ovShortHead:"Praxisnote / Prüfung / Schlussnote · Tage · Absenzen",
  ovMail:"Übersicht an die Kursleitung",ovCopy:"Übersicht kopieren",ovMailHint:"Sendet die Notenuebersicht dieser Gruppe an",ovFoot:"Die Rapportdatei wird separat als JSON abgelegt. Diese Mail enthält keinen Anhang.",ovClip:"Zu lang für die Mail: die ganze Übersicht liegt in der Zwischenablage, bitte einfügen.",ovClipHint:"Die Übersicht liegt in der Zwischenablage. Bitte hier einfügen.",absNone:"keine Absenzen",
  selfTest:"Selbsttest",selfTestBtn:"Selbsttest ausführen",selfTestHint:"Prüft die Rechenlogik und die Bausteinbibliothek dieser Datei. Die erfassten Tage werden dabei nicht verändert.",selfTestOkN:"bestanden",selfTestBad:"fehlgeschlagen",stChips:"Bausteine eindeutig",stCrit:"Jeder Baustein hat ein gültiges Kriterium",stAction:"Jeder negative Baustein hat eine Massnahme",stLang:"Alle vier Sprachen vorhanden",stLate:"Verlangter Baustein für Verspätung vorhanden",stSlots:"Einsatztage korrekt nummeriert",stBase:"Tag ohne Beobachtung ergibt die Basisnote",stLight:"Leichter Baustein verschiebt um 0.25",stMedium:"Mittlerer Baustein verschiebt um 0.50",stHeavy:"Schwerer Baustein verschiebt um 1.00",stCapDown:"Kappung nach unten bei −1.50",stCapUp:"Kappung nach oben bei +1.00",stKo:"K.-o.-Baustein trifft nur sein Kriterium",stLateEffect:"Verspätet zieht auf Teamfähigkeit ab",stUnexcused:"Unentschuldigt ergibt 1.00",stExcused:"Entschuldigt zählt nicht mit",stTm:"Team Market zählt mit 5.00",stExam:"Abwesenheit am Exam Day ergibt 1.00",stFinal:"Schlussnote zwei Drittel Praxis, ein Drittel Prüfung",stNote:"Freitext wirkt nur mit Kriterium und Wirkung",stStore:"Browserspeicher funktioniert",
day:"Erfassen",week:"Übersicht",rep:"Beurteilung",data:"Daten",set:"Eintragen",
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
  banner:"Daten bleiben nur in diesem Browser. Bis die Plattformfrage geklärt ist: mit Testdaten oder Kürzeln arbeiten.",
  weighting:"Gewichtung",gas2:"Gastgeberhaltung doppelt gewichten",base:"Basisnote «erfüllt die Erwartungen»",baseShort:"Basisnote",
  teamField:"Gruppe",
  restoreTitle:"Sicherung einlesen",
  restoreHint:"Liest eine zuvor gespeicherte JSON zurück in diese Datei. Damit holen Sie Gruppe, Team, Outlet, Dozent, Turnus, alle Studierenden mit E-Mail-Adresse und alle erfassten Tage zurück, zum Beispiel nach einem Gerätewechsel.",
  restoreBtn:"⤒ Sicherung einlesen",restoreArm:"Ersetzt alles, nochmals klicken",
  restoreWarn:"Ersetzt den gesamten Inhalt dieser Datei. Sichern Sie vorher, falls Sie hier schon etwas erfasst haben.",
  restoreDone:"Sicherung eingelesen",restoreBad:"Datei nicht lesbar oder keine Servicerapport-Sicherung",
  seedOff:"Beispieldaten löschen",group:"Gruppe / Outlet",teacher:"Dozent/in",
  studentList:"Studierende (eine Person pro Zeile)",apply:"Übernehmen",
  merge:"Rapporte zusammenführen",mergeHint:"JSON-Dateien der anderen Dozierenden auswählen. Namen und Einsatztage werden zusammengeführt.",
  exportJson:"Sicherung (JSON)",exportCsv:"CSV",exportXlsx:"Excel (.xlsx)",exportTxt:"Text (.txt)",
  printPdf:"Drucken / PDF",
  outlet2Field:"Zweites Restaurant (Wechsel)",outlet2Hint:"Nur ausfüllen, wenn Studierende zwischen zwei Restaurants wechseln. Beim Erfassen erscheint dann pro Person ein Umschalter, der sich pro Tag merkt, wo die Person war.",placements:"Einsatzorte",switchTitle:"Restaurant für diesen Tag wechseln",
  daysCounted:"gewertete Tage",obsCount:"Beobachtungen",topObs:"Häufigste Beobachtungen",
  emailSubj:"Servicerapport",openDay:"Tag erfassen",
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
  weightNote:"Gastgeberhaltung und Gästekontakt zählt doppelt. Anwesenheit und Pünktlichkeit wirken stark auf die Note.",
  storeWarn:"Dieses Gerät speichert nichts dauerhaft. Exportiere den Rapport am Ende jedes Einsatztages, sonst gehen die Eingaben verloren.",
  byTeacher:"Erfasst von",outlet:"Abteilung",
  studentListHint:"Eine Person pro Zeile: Nachname; Vorname; Nickname; E-Mail; Sprache; Klasse; Gruppe. Nur Nachname und Vorname sind Pflicht. Leere Klasse oder Gruppe = Wert aus der Kopfzeile. Beispiel: Ammann; Lea; Lulu; lea.ammann@stud.ehl.edu; de; HFE1; Gruppe 1",
  repLang:"Sprache der Beurteilung",repLangAll:"Sprache für alle setzen",
  absMailTitle:"Absenzen und Verspätungen melden",
  absMailBtn:"Meldung an die Kursleitung",
  absMailNone:"Keine Absenzen und keine Verspätungen an diesem Einsatztag.",
  absMailHint:"Bitte zusammen mit der Tagessicherung senden. Die Meldung geht an",
  absMailSubj:"Absenzen Servicepraxis",
  absMailSent:"E-Mail vorbereitet",
  sheetPrint:"Erfassungsblatt drucken",
  sheetDay:"Tagesblatt, alle Studierenden",
  sheetSingle:"Einzelbl\u00e4tter, ein Blatt pro Person",
  sheetTitle:"Erfassungsblatt Servicepraxis",
  sheetNotes:"Notizen",sheetLegend:"Kriterien",
  sheetHintDay:"Pro Kriterium ein Kreuz bei + oder \u2212, Einzelheiten in die Notizen. Danach im Programm nacherfassen.",
  sheetHintSingle:"Zutreffendes ankreuzen. Danach im Programm nacherfassen.",
  sheetAttShort:"Anw · Versp · Ents · Unent · TM",dateLbl:"Datum",
  email:"E-Mail",noMail:"Keine E-Mail-Adresse hinterlegt",
  hideBanner:"Hinweisfeld ausblenden",display:"Anzeige",
  fixedRules:"Fest eingestellt",examFixed:"Tag 10 ist der Exam Day",daysFixed:"Einsatztage",
  backupTitle:"Sicherung",
  backupHint:"Speichert die ganze Datei als JSON: Gruppe, Team, Outlet, Dozent, Turnus mit Starttag, alle Studierenden mit E-Mail-Adresse und Beurteilungssprache, alle erfassten Einsatztage und alle Einstellungen. Das ist die Datei, die Michael Pilman zum Zusammenführen braucht.",
  backupBtn:"⤓ Ganze Datei sichern (JSON)",backupDone:"Sicherung gespeichert",
  reset:"Alles zurücksetzen",resetConfirm:"Wirklich alles löschen?",
  resetHint:"Löscht Studierende, alle Einsatztage und die Gruppenangaben und hinterlässt eine leere Datei. Die Spracheinstellung bleibt. Exportieren Sie vorher eine Sicherung.",
  resetDone:"Datei zurückgesetzt",
  storeFile:"Speicher dieser Datei",
  teamMarket:"Team Market",tmDay:"Team Market, dieser Tag zählt mit 5.00",
  saveDay:"Tag speichern",savedAs:"Gespeichert",
  saveDayHint:"Zwei getrennte Knöpfe: der erste öffnet «Speichern unter» und legt den ganzen Rapport als JSON ab, Dateiname aus Dozent, Gruppe, Outlet, Variante und heutigem Datum. Der zweite bereitet die Meldung an die Kursleitung vor. Beide gehören zum Tagesabschluss.",
  groupOnly:"Klasse",outletField:"Outlet / Abteilung",absTm:"Absenzen · TM",
  variantLbl:"Variante",wrongVariant:"Passt nicht in diese Datei",
  halfPlace:"Halbturnus einordnen",halfAuto:"automatisch",
  halfFirst:"als erste Hälfte",halfSecond:"als zweite Hälfte",
  halfHint:"Dateien mit 5 Tagen und mit 4 Tagen plus Exam werden auf die zehn Einsatztage verteilt. Automatisch bedeutet: die 5 Tage werden zur ersten Hälfte, die 4 Tage plus Exam zur zweiten.",
  placedAs:"eingeordnet",
  vExam:"Exam Day",vNoExam:"ohne Exam Day",vDays:"Einsatztage"},
 en:{
  stNames:"Every student has a name",stClass:"Class and group are set",
  dropConfirm:"Really discard this day?",dropDone:"Day discarded",
  sameName:"same name, different e-mail",
  ovClipCrit:"E-mail ready. The per-criterion values are also on the clipboard.",
  ovShortHead:"Practice / Exam / Final · days · absences",
  ovMail:"Send overview to the course lead",ovCopy:"Copy overview",ovMailHint:"Sends this group’s grade overview to",ovFoot:"The report file is stored separately as JSON. This e-mail carries no attachment.",ovClip:"Too long for the e-mail: the full overview is on the clipboard, please paste it in.",ovClipHint:"The overview is on the clipboard. Please paste it here.",absNone:"no absences",
  selfTest:"Self-test",selfTestBtn:"Run self-test",selfTestHint:"Checks the grading logic and the building-block library of this file. Recorded days are not changed.",selfTestOkN:"passed",selfTestBad:"failed",stChips:"Building block IDs unique",stCrit:"Every block has a valid criterion",stAction:"Every negative block has an action",stLang:"All four languages present",stLate:"Required lateness block present",stSlots:"Shift days numbered correctly",stBase:"Day without observation gives the baseline grade",stLight:"Light block shifts by 0.25",stMedium:"Medium block shifts by 0.50",stHeavy:"Heavy block shifts by 1.00",stCapDown:"Capped at −1.50",stCapUp:"Capped at +1.00",stKo:"Knock-out block affects only its criterion",stLateEffect:"Late deducts from teamwork",stUnexcused:"Unexcused gives 1.00",stExcused:"Excused does not count",stTm:"Team Market counts as 5.00",stExam:"Absence on the Exam Day gives 1.00",stFinal:"Final grade two thirds practice, one third exam",stNote:"Free text only counts with criterion and direction",stStore:"Browser storage works",
day:"Record",week:"Overview",rep:"Feedback",data:"Data",set:"Setup",
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
  banner:"Data stays in this browser only. Until the platform is decided: use test data or initials.",
  weighting:"Weighting",gas2:"Weight host attitude double",base:"Baseline grade “meets expectations”",baseShort:"Baseline grade",
  teamField:"Group",
  restoreTitle:"Load a backup",
  restoreHint:"Reads a previously saved JSON back into this file. It brings back group, team, outlet, lecturer, rotation, all students with their e-mail addresses and every recorded day, for example after changing device.",
  restoreBtn:"⤒ Load a backup",restoreArm:"Replaces everything, click again",
  restoreWarn:"Replaces the whole content of this file. Save a backup first if you have already recorded something here.",
  restoreDone:"Backup loaded",restoreBad:"File unreadable or not a service report backup",
  seedOff:"Delete sample data",group:"Group / outlet",teacher:"Lecturer",
  studentList:"Students (one per line)",apply:"Apply",
  merge:"Merge reports",mergeHint:"Select the other lecturers' JSON files. Names and shift days are merged.",
  exportJson:"Backup (JSON)",exportCsv:"CSV",exportXlsx:"Excel (.xlsx)",exportTxt:"Text (.txt)",
  printPdf:"Print / PDF",
  outlet2Field:"Second restaurant (switch)",outlet2Hint:"Only fill in if students switch between two restaurants. A switch then appears for each person when recording and remembers per day where the person worked.",placements:"Placements",switchTitle:"Switch restaurant for this day",
  daysCounted:"counted days",obsCount:"observations",topObs:"Most frequent observations",
  emailSubj:"Service report",openDay:"Open this day",
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
  weightNote:"Host attitude and guest contact counts double. Attendance and punctuality weigh heavily on the grade.",
  storeWarn:"This device does not store anything permanently. Export the report at the end of each shift day or your entries are lost.",
  byTeacher:"Recorded by",outlet:"Outlet",
  studentListHint:"One person per line: surname; first name; nickname; e-mail; language; class; group. Only surname and first name are required. Empty class or group = value from the header. Example: Ammann; Lea; Lulu; lea.ammann@stud.ehl.edu; de; HFE1; Gruppe 1",
  repLang:"Feedback language",repLangAll:"Set the language for everyone",
  absMailTitle:"Report absences and lateness",
  absMailBtn:"Report to the course lead",
  absMailNone:"No absences and no lateness on this shift day.",
  absMailHint:"Please send it together with the daily backup. The report goes to",
  absMailSubj:"Absences service practice",
  absMailSent:"E-mail prepared",
  sheetPrint:"Print a paper sheet",
  sheetDay:"Day sheet, all students",
  sheetSingle:"Individual sheets, one per person",
  sheetTitle:"Recording sheet service practice",
  sheetNotes:"Notes",sheetLegend:"Criteria",
  sheetHintDay:"One tick at + or \u2212 per criterion, details in the notes. Enter it in the programme afterwards.",
  sheetHintSingle:"Tick what applies. Enter it in the programme afterwards.",
  sheetAttShort:"Pres · Late · Exc · Unexc · TM",dateLbl:"Date",
  email:"E-mail",noMail:"No e-mail address stored",
  hideBanner:"Hide the notice",display:"Display",
  fixedRules:"Fixed",examFixed:"Day 10 is the Exam Day",daysFixed:"shift days",
  backupTitle:"Backup",
  backupHint:"Saves the whole file as JSON: group, team, outlet, lecturer, rotation with start day, all students with e-mail address and feedback language, every recorded shift day and all settings. This is the file Michael Pilman needs for merging.",
  backupBtn:"⤓ Back up the whole file (JSON)",backupDone:"Backup saved",
  reset:"Reset everything",resetConfirm:"Really delete everything?",
  resetHint:"Deletes students, all shift days and the group details and leaves an empty file. The language setting is kept. Export a backup first.",
  resetDone:"File reset",
  storeFile:"Storage of this file",
  teamMarket:"Team Market",tmDay:"Team Market, this day counts as 5.00",
  saveDay:"Save day",savedAs:"Saved",
  saveDayHint:"Two separate buttons: the first opens “Save as” and stores the whole report as JSON, named after lecturer, group, outlet, variant and today's date. The second prepares the report to the course lead. Both belong to closing the day.",
  groupOnly:"Class",outletField:"Outlet / department",absTm:"Absences · TM",
  variantLbl:"Variant",wrongVariant:"Does not fit this file",
  halfPlace:"Place half rotation",halfAuto:"automatic",
  halfFirst:"as the first half",halfSecond:"as the second half",
  halfHint:"Files with 5 days and with 4 days plus exam are mapped onto the ten shift days. Automatic means: the 5 days become the first half, the 4 days plus exam the second.",
  placedAs:"placed",
  vExam:"Exam Day",vNoExam:"no Exam Day",vDays:"shift days"},
 th:{
  stNames:"นักศึกษาทุกคนมีชื่อ",stClass:"ตั้งชั้นเรียนและกลุ่มแล้ว",
  dropConfirm:"\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49\u0e08\u0e23\u0e34\u0e07\u0e2b\u0e23\u0e37\u0e2d",dropDone:"\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01\u0e41\u0e25\u0e49\u0e27",
  sameName:"\u0e0a\u0e37\u0e48\u0e2d\u0e0b\u0e49\u0e33 \u0e2d\u0e35\u0e40\u0e21\u0e25\u0e15\u0e48\u0e32\u0e07\u0e01\u0e31\u0e19",
  ovClipCrit:"เตรียมอีเมลแล้ว คะแนนแต่ละเกณฑ์อยู่ในคลิปบอร์ดด้วย",
  ovShortHead:"ปฏิบัติ / สอบ / รวม · วัน · การขาด",
  ovMail:"ส่งภาพรวมให้ผู้ดูแลหลักสูตร",ovCopy:"คัดลอกภาพรวม",ovMailHint:"ส่งสรุปคะแนนของกลุ่มนี้ไปที่",ovFoot:"ไฟล์รายงานเก็บแยกเป็น JSON อีเมลนี้ไม่มีไฟล์แนบ",ovClip:"ยาวเกินสำหรับอีเมล ภาพรวมทั้งหมดอยู่ในคลิปบอร์ด กรุณาวาง",ovClipHint:"ภาพรวมอยู่ในคลิปบอร์ด กรุณาวางที่นี่",absNone:"ไม่มีการขาด",
  selfTest:"การทดสอบระบบ",selfTestBtn:"เริ่มทดสอบ",selfTestHint:"ตรวจสอบการคำนวณคะแนนและคลังหัวข้อสังเกต ข้อมูลที่บันทึกไว้จะไม่ถูกแก้ไข",selfTestOkN:"ผ่าน",selfTestBad:"ไม่ผ่าน",stChips:"รหัสข้อสังเกตไม่ซ้ำ",stCrit:"ทุกข้อมีเกณฑ์ที่ถูกต้อง",stAction:"ข้อเชิงลบทุกข้อมีแนวทางแก้ไข",stLang:"มีครบทั้งสี่ภาษา",stLate:"มีข้อสำหรับการมาสาย",stSlots:"ลำดับวันฝึกถูกต้อง",stBase:"วันที่ไม่มีการบันทึกได้คะแนนพื้นฐาน",stLight:"น้ำหนักเบา 0.25",stMedium:"น้ำหนักกลาง 0.50",stHeavy:"น้ำหนักมาก 1.00",stCapDown:"จำกัดที่ −1.50",stCapUp:"จำกัดที่ +1.00",stKo:"ข้อ K.O. มีผลเฉพาะเกณฑ์ของตัวเอง",stLateEffect:"มาสายหักคะแนนการทำงานเป็นทีม",stUnexcused:"ขาดโดยไม่แจ้งได้ 1.00",stExcused:"ลาไม่นับรวม",stTm:"Team Market นับเป็น 5.00",stExam:"ขาดวันสอบได้ 1.00",stFinal:"คะแนนรวม สองส่วนสามปฏิบัติ หนึ่งส่วนสามสอบ",stNote:"ข้อความอิสระมีผลเมื่อระบุเกณฑ์",stStore:"หน่วยความจำทำงานได้",
day:"บันทึก",week:"ภาพรวม",rep:"ผลประเมิน",data:"ข้อมูล",set:"กรอกข้อมูล",
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
  banner:"ข้อมูลเก็บไว้ในเบราว์เซอร์นี้เท่านั้น ระหว่างนี้ให้ใช้ข้อมูลทดสอบหรือตัวย่อ",
  weighting:"การให้น้ำหนัก",gas2:"ให้น้ำหนักความเป็นเจ้าบ้านสองเท่า",base:"คะแนนพื้นฐาน «เป็นไปตามที่คาดหวัง»",baseShort:"คะแนนพื้นฐาน",
  teamField:"กลุ่ม",
  restoreTitle:"โหลดไฟล์สำรอง",
  restoreHint:"อ่านไฟล์ JSON ที่เคยบันทึกไว้กลับเข้าไฟล์นี้ จะได้กลุ่ม ทีม เอาต์เล็ต ผู้สอน รอบฝึก รายชื่อนักศึกษาพร้อมอีเมล และวันฝึกที่บันทึกไว้ทั้งหมดกลับคืนมา เช่น หลังเปลี่ยนอุปกรณ์",
  restoreBtn:"⤒ โหลดไฟล์สำรอง",restoreArm:"จะแทนที่ทั้งหมด กดอีกครั้ง",
  restoreWarn:"จะแทนที่เนื้อหาทั้งหมดของไฟล์นี้ หากบันทึกข้อมูลไว้แล้ว ควรสำรองก่อน",
  restoreDone:"โหลดไฟล์สำรองแล้ว",restoreBad:"อ่านไฟล์ไม่ได้ หรือไม่ใช่ไฟล์สำรองของรายงานบริการ",
  seedOff:"ลบข้อมูลตัวอย่าง",group:"กลุ่ม / เอาต์เล็ต",teacher:"ผู้สอน",
  studentList:"นักศึกษา (บรรทัดละหนึ่งคน)",apply:"ใช้งาน",
  merge:"รวมรายงาน",mergeHint:"เลือกไฟล์ JSON ของผู้สอนคนอื่น ระบบจะรวมชื่อและวันฝึกให้",
  exportJson:"สำรองข้อมูล (JSON)",exportCsv:"CSV",exportXlsx:"Excel (.xlsx)",exportTxt:"ข้อความ (.txt)",
  printPdf:"พิมพ์ / PDF",
  outlet2Field:"ร้านอาหารที่สอง (สลับ)",outlet2Hint:"กรอกเฉพาะเมื่อนักศึกษาสลับระหว่างสองร้าน ระบบจะแสดงปุ่มสลับสำหรับแต่ละคนและจำร้านของแต่ละวัน",placements:"สถานที่ฝึก",switchTitle:"สลับร้านอาหารของวันนี้",
  daysCounted:"วันที่นับคะแนน",obsCount:"ข้อสังเกต",topObs:"ข้อสังเกตที่พบบ่อย",
  emailSubj:"รายงานบริการ",openDay:"เปิดบันทึกวันนี้",
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
  weightNote:"ความเป็นเจ้าบ้านและการดูแลแขกคิดเป็นสองเท่า การมาเรียนและตรงต่อเวลามีผลต่อคะแนนมาก",
  storeWarn:"อุปกรณ์นี้ไม่บันทึกข้อมูลถาวร กรุณาส่งออกรายงานเมื่อจบแต่ละวัน มิฉะนั้นข้อมูลจะหาย",
  byTeacher:"บันทึกโดย",outlet:"แผนก",
  studentListHint:"หนึ่งคนต่อหนึ่งบรรทัด: นามสกุล; ชื่อ; ชื่อเล่น; อีเมล; ภาษา; ชั้นเรียน; กลุ่ม จำเป็นเฉพาะนามสกุลและชื่อ ตัวอย่าง: Ammann; Lea; Lulu; lea.ammann@stud.ehl.edu; de; HFE1; Gruppe 1",
  repLang:"ภาษาของผลประเมิน",repLangAll:"ตั้งภาษาให้ทุกคน",
  absMailTitle:"รายงานการขาดและมาสาย",
  absMailBtn:"ส่งรายงานถึงผู้ดูแลหลักสูตร",
  absMailNone:"วันนี้ไม่มีการขาดและไม่มีการมาสาย",
  absMailHint:"กรุณาส่งพร้อมกับไฟล์สำรองของวัน โดยส่งไปที่",
  absMailSubj:"การขาด การฝึกบริการ",
  absMailSent:"เตรียมอีเมลแล้ว",
  sheetPrint:"\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e41\u0e1a\u0e1a\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e01\u0e23\u0e30\u0e14\u0e32\u0e29",
  sheetDay:"\u0e41\u0e1c\u0e48\u0e19\u0e23\u0e32\u0e22\u0e27\u0e31\u0e19 \u0e23\u0e27\u0e21\u0e19\u0e31\u0e01\u0e28\u0e36\u0e01\u0e29\u0e32\u0e17\u0e38\u0e01\u0e04\u0e19",
  sheetSingle:"\u0e41\u0e1c\u0e48\u0e19\u0e23\u0e32\u0e22\u0e1a\u0e38\u0e04\u0e04\u0e25 \u0e04\u0e19\u0e25\u0e30\u0e41\u0e1c\u0e48\u0e19",
  sheetTitle:"\u0e41\u0e1a\u0e1a\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e01\u0e32\u0e23\u0e1d\u0e36\u0e01\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23",
  sheetNotes:"\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01",sheetLegend:"\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d\u0e1b\u0e23\u0e30\u0e40\u0e21\u0e34\u0e19",
  sheetHintDay:"\u0e17\u0e33\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e2b\u0e21\u0e32\u0e22\u0e17\u0e35\u0e48 + \u0e2b\u0e23\u0e37\u0e2d \u2212 \u0e02\u0e2d\u0e07\u0e41\u0e15\u0e48\u0e25\u0e30\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d \u0e23\u0e32\u0e22\u0e25\u0e30\u0e40\u0e2d\u0e35\u0e22\u0e14\u0e40\u0e02\u0e35\u0e22\u0e19\u0e43\u0e19\u0e0a\u0e48\u0e2d\u0e07\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01 \u0e41\u0e25\u0e49\u0e27\u0e04\u0e48\u0e2d\u0e22\u0e01\u0e23\u0e2d\u0e01\u0e43\u0e19\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21",
  sheetHintSingle:"\u0e17\u0e33\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e2b\u0e21\u0e32\u0e22\u0e15\u0e32\u0e21\u0e08\u0e23\u0e34\u0e07 \u0e41\u0e25\u0e49\u0e27\u0e04\u0e48\u0e2d\u0e22\u0e01\u0e23\u0e2d\u0e01\u0e43\u0e19\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21",
  sheetAttShort:"\u0e21\u0e32 · \u0e2a\u0e32\u0e22 · \u0e25\u0e32 · \u0e02\u0e32\u0e14 · TM",dateLbl:"\u0e27\u0e31\u0e19\u0e17\u0e35\u0e48",
  email:"อีเมล",noMail:"ไม่มีอีเมล",
  hideBanner:"ซ่อนข้อความแจ้งเตือน",display:"การแสดงผล",
  fixedRules:"กำหนดตายตัว",examFixed:"วันที่ 10 คือวันสอบ",daysFixed:"วันฝึก",
  backupTitle:"สำรองข้อมูล",
  backupHint:"บันทึกไฟล์ทั้งหมดเป็น JSON ได้แก่ กลุ่ม ทีม เอาต์เล็ต ผู้สอน รอบฝึกพร้อมวันเริ่ม รายชื่อนักศึกษาทั้งหมดพร้อมอีเมลและภาษาของผลประเมิน วันฝึกที่บันทึกไว้ทั้งหมด และการตั้งค่าทั้งหมด ไฟล์นี้คือไฟล์ที่ Michael Pilman ใช้รวมข้อมูล",
  backupBtn:"⤓ สำรองไฟล์ทั้งหมด (JSON)",backupDone:"บันทึกสำรองแล้ว",
  reset:"ล้างข้อมูลทั้งหมด",resetConfirm:"ยืนยันลบทั้งหมด?",
  resetHint:"ลบรายชื่อนักศึกษา วันฝึกทั้งหมด และข้อมูลกลุ่ม เหลือไฟล์เปล่า การตั้งค่าภาษาจะยังอยู่ ควรส่งออกสำรองก่อน",
  resetDone:"ล้างข้อมูลแล้ว",
  storeFile:"พื้นที่เก็บของไฟล์นี้",
  teamMarket:"Team Market",tmDay:"Team Market วันนี้นับเป็น 5.00",
  saveDay:"บันทึกวันนี้",savedAs:"บันทึกแล้ว",
  saveDayHint:"มีสองปุ่มแยกกัน ปุ่มแรกจะเปิด «บันทึกเป็น» และเก็บรายงานทั้งหมดเป็น JSON ชื่อไฟล์จากผู้สอน กลุ่ม เอาต์เล็ต รูปแบบ และวันที่วันนี้ ปุ่มที่สองเตรียมรายงานถึงผู้ดูแลหลักสูตร ทั้งสองอย่างเป็นส่วนหนึ่งของการปิดวัน",
  groupOnly:"ชั้นเรียน",outletField:"เอาต์เล็ต / แผนก",absTm:"การขาด · TM",
  variantLbl:"รูปแบบ",wrongVariant:"ไม่ตรงกับไฟล์นี้",
  halfPlace:"จัดครึ่งรอบ",halfAuto:"อัตโนมัติ",
  halfFirst:"เป็นครึ่งแรก",halfSecond:"เป็นครึ่งหลัง",
  halfHint:"ไฟล์ 5 วัน และ 4 วันพร้อมสอบ จะถูกจัดเข้าสิบวันฝึก อัตโนมัติหมายถึง 5 วันเป็นครึ่งแรก และ 4 วันพร้อมสอบเป็นครึ่งหลัง",
  placedAs:"จัดเข้า",
  vExam:"วันสอบ",vNoExam:"ไม่มีวันสอบ",vDays:"วันฝึก"} ,
 /* Chinesisch dient nur als Ausgabesprache fuer die Beurteilung, nicht als Bedienoberflaeche. */
 zh:{
  stNames:"每位学生都有姓名",stClass:"已设置班级与组别",
  dropConfirm:"\u786e\u5b9a\u4e22\u5f03\u8fd9\u4e00\u5929\uff1f",dropDone:"\u5df2\u4e22\u5f03",
  sameName:"\u540c\u540d\u4f46\u90ae\u7bb1\u4e0d\u540c",
  ovClipCrit:"邮件已就绪，各标准分值同时已复制到剪贴板。",
  ovMail:"向课程负责人发送总览",ovCopy:"复制总览",ovMailHint:"将本班组的成绩总览发送至",ovFoot:"报告文件单独以 JSON 保存，本邮件不含附件。",ovClip:"内容过长：完整总览已复制到剪贴板，请粘贴。",ovClipHint:"总览已在剪贴板，请在此粘贴。",absNone:"无缺勤",
  selfTest:"自检",selfTestBtn:"运行自检",selfTestHint:"检查本文件的计分逻辑与构块库，不会改动已记录的日子。",selfTestOkN:"通过",selfTestBad:"未通过",stChips:"构块编号唯一",stCrit:"每个构块都有有效标准",stAction:"每个负向构块都有改进建议",stLang:"四种语言均齐全",stLate:"迟到构块存在",stSlots:"实习日编号正确",stBase:"无观察的一天为基准分",stLight:"轻度构块偏移 0.25",stMedium:"中度构块偏移 0.50",stHeavy:"重度构块偏移 1.00",stCapDown:"下限截断于 −1.50",stCapUp:"上限截断于 +1.00",stKo:"一票否决仅影响自身标准",stLateEffect:"迟到扣减团队合作",stUnexcused:"旷工计 1.00",stExcused:"请假不计入",stTm:"Team Market 计 5.00",stExam:"考核日缺席计 1.00",stFinal:"最终成绩：三分之二实践、三分之一考核",stNote:"自由文本仅在选定标准与方向时生效",stStore:"浏览器存储可用",
day:"记录",week:"总览",rep:"评估",data:"数据",set:"设置",
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
  base:"基准分「符合预期」",weighting:"权重",gas2:"待客态度双倍计分",
  group:"班级 / 部门",teacher:"授课教师",
  placements:"实习地点",
  daysCounted:"个计分日",obsCount:"条观察记录",
  emailSubj:"餐厅服务实践评估",
  examDay:"考核日",examShort:"考核",praxis:"实践",
  praxisGrade:"实践成绩",examGrade:"考核成绩",finalGrade:"最终成绩",
  teamMarket:"Team Market",
  cl1:"表现出色。保持这个水平，并针对上述几点继续打磨，还能更进一步。",
  cl2:"完成得扎实。上述几点是你下次上岗提升最快的地方。",
  cl3:"基础已经具备。把上述几点逐条攻克，你会明显变得更有把握。",
  cl4:"还有提升空间，而上述几点都是具体可行的。需要支持时随时来找我们。",
  weightNote:"待客态度与客人接触按双倍计分。出勤与守时对成绩影响很大。",
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
function critShort(k, lg){
  const c = CRITS.find(x=>x.k===k); if(!c) return k;
  lg = lg || L;
  return (c.s && (c.s[lg] || c.s.de)) || critName(k, lg);
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
const KEY = "servicerapport.v1" + FILEID;
const OLDKEYS = ["servicerapport.v1"];
const DEF = {group:"", team:"", outlet:"", teacher:"", uiLang:"de", outLang:"de", base:5, gas2:true,
             weekdays:["mo","tu","we","th"], startIdx:0,
             hideBanner:false, customLangs:{}, isSample:false};

/* Einstellungen aus einer fremden oder alten Datei pruefen, bevor damit gerechnet wird.
   Eine Basisnote als Text oder eine Wochentagsliste als Zeichenkette haben frueher
   den Reiter Eintragen lahmgelegt und stillschweigend NaN-Noten erzeugt. */
function sanitizeSettings(s){
  const o = {...DEF, ...(s || {})};
  const bs = parseFloat(o.base);
  o.base = (isFinite(bs) && bs >= 1 && bs <= 6) ? bs : DEF.base;
  const gueltig = WDAYS.map(w => w.k);
  o.weekdays = Array.isArray(o.weekdays) ? o.weekdays.filter(k => gueltig.indexOf(k) >= 0) : [];
  if(!o.weekdays.length) o.weekdays = DEF.weekdays.slice();
  const ix = parseInt(o.startIdx, 10);
  o.startIdx = (isFinite(ix) && ix >= 0 && ix < o.weekdays.length) ? ix : 0;
  o.gas2 = !!o.gas2;
  o.hideBanner = !!o.hideBanner;
  if(!T[o.uiLang]) o.uiLang = "de";
  if(!OUT_LANGS.some(x => x.code === o.outLang)) o.outLang = "de";
  if(typeof o.customLangs !== "object" || !o.customLangs) o.customLangs = {};
  ["group","team","outlet","teacher"].forEach(k=>{ o[k] = String(o[k] == null ? "" : o[k]); });
  return o;
}
/* Nachname und Vorname aus einem alten einteiligen Namen ableiten: letztes Wort = Vorname.
   Nur fuer Altdaten; neu werden beide Felder getrennt erfasst. */
function splitName(voll){
  const teile = String(voll || "").trim().split(/\s+/).filter(Boolean);
  if(teile.length < 2) return {nachname: teile[0] || "", vorname: ""};
  return {nachname: teile.slice(0, -1).join(" "), vorname: teile[teile.length - 1]};
}
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
/* Klasse und Gruppe pro Person; leer = Vorgabe aus der Kopfzeile (wie im Kuechenrapport). */
const klasseOf = s => (s && s.klasse) || S.settings.group || "";
const gruppeOf = s => (s && s.gruppe) || S.settings.team  || "";
/* Anzeigename wie bisher: Nachname zuerst, dann Vorname. */
function anzeigeName(s){ return [s.nachname, s.vorname].filter(Boolean).join(" ") || s.name || ""; }
/* Eine Zeile der Studierendenliste zerlegen. Reihenfolge: Nachname; Vorname; Nickname;
   E-Mail; Sprache. E-Mail und Sprache werden am Inhalt erkannt, damit auch die alte
   Schreibweise "Ammann Lea; mail; de" noch richtig gelesen wird. */
function parseStudentZeile(line){
  const roh = String(line || "").split(/[;\t]/).map(x=>x.trim());
  let mail = "", lang = "", klasse = "", gruppe = "";
  const rest = [];
  roh.forEach(x=>{
    if(!x) return;
    if(!mail && x.indexOf("@") >= 0){ mail = x; return; }
    if(!klasse && erkenneKlasse(x)){ klasse = erkenneKlasse(x); return; }
    if(!gruppe && erkenneGruppe(x)){ gruppe = erkenneGruppe(x); return; }
    const lg = x.toLowerCase();
    if(!lang && OUT_LANGS.some(o=>o.code === lg) && x.length <= 3){ lang = lg; return; }
    rest.push(x);
  });
  let nachname = rest[0] || "", vorname = rest[1] || "", nick = rest[2] || "";
  if(nachname && !vorname){                    /* alte einteilige Schreibweise */
    const g = splitName(nachname); nachname = g.nachname; vorname = g.vorname;
  }
  if(!nachname && !vorname) return null;
  return {nachname, vorname, nick, mail, lang, klasse, gruppe};
}
function studentZeile(s){
  return [s.nachname || "", s.vorname || "", s.nick || "", s.mail || "", s.lang || "",
          s.klasse || "", s.gruppe || ""]
    .filter((x,i)=> i < 2 || x).join("; ");
}

/* Nur Personen mit Namen uebernehmen und alle Felder auf saubere Zeichenketten bringen.
   name bleibt der Anzeigename, damit Tabellen, Berichte und Druckvorlagen unveraendert laufen. */
function saubereStudierende(list){
  return (Array.isArray(list) ? list : [])
    .map(s => {
      if(!s) return null;
      let nach = String(s.nachname == null ? "" : s.nachname).trim();
      let vor  = String(s.vorname  == null ? "" : s.vorname ).trim();
      if(!nach && !vor){                       /* Altdatensatz mit einem Namensfeld */
        const g = splitName(s.name); nach = g.nachname; vor = g.vorname;
      }
      if(!nach && !vor) return null;
      const o = {
        id:       String(s.id || ("s" + Math.random().toString(36).slice(2,8))),
        nachname: nach,
        vorname:  vor,
        nick:     String(s.nick == null ? "" : s.nick).trim(),
        mail:     String(s.mail || "").trim(),
        lang:     OUT_LANGS.some(x => x.code === s.lang) ? s.lang : "",
        klasse:   erkenneKlasse(s.klasse) || String(s.klasse || "").trim(),
        gruppe:   erkenneGruppe(s.gruppe) || String(s.gruppe || "").trim()
      };
      /* Noten 2.0: Studierendennummer, Foto und Wechselplan aus dem Cockpit mitnehmen */
      if(s.nr) o.nr = String(s.nr).trim();
      if(typeof s.foto === "string" && s.foto.indexOf("data:image/") === 0) o.foto = s.foto;
      if(s.wechselAb && s.wechselOutlet){ o.wechselAb = parseInt(s.wechselAb, 10) || 0; o.wechselOutlet = String(s.wechselOutlet); }
      if(Array.isArray(s.ortPlan)) o.ortPlan = s.ortPlan.map(x => String(x || ""));
      if(Array.isArray(s.tmTage)) o.tmTage = s.tmTage.map(x => parseInt(x, 10)).filter(x => x > 0);
      o.name = anzeigeName(o);
      return o;
    })
    .filter(Boolean);
}
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
    settings:{...DEF, group:"Group 3", team:"Team A", outlet:"Bellavista", teacher:"M. Pilman", isSample:true},
    students: names.map((n,i)=>({id:"s"+(i+1), name:n,
      mail: n.toLowerCase().replace(/[^a-z ]/g,"").split(" ").reverse().join(".")+"@stud.ehl.edu"})),
    days:{},
    dayMeta:{ d01:{teacher:"M. Pilman", group:"Group 3", outlet:"Bellavista"},
              d02:{teacher:"M. Pilman", group:"Group 3", outlet:"Bellavista"} }
  };
  st.days["d01"] = {
    s1:{att:"present",obs:["hyg-p1","ver-p1"],note:null},
    s2:{att:"present",obs:["auf-n4","mep-n2"],note:null},
    s3:{att:"present",obs:[],note:null},
    s4:{att:"late",obs:["sel-p2"],note:null},
    s5:{att:"excused",obs:[],note:null},
    s6:{att:"present",obs:["hyg-n4","ver-n4"],note:null}
  };
  st.days["d02"] = {
    s1:{att:"present",obs:["tea-p1"],note:null},
    s2:{att:"present",obs:["auf-n3"],note:null},
    s3:{att:"present",obs:["ver-p3","mep-p1"],note:{txt:"Hat die Bar ohne Anleitung übernommen und sauber übergeben.",crit:"sel",dir:1,w:0.5}},
    s4:{att:"tm",obs:[],note:null},
    s5:{att:"present",obs:["sel-n1","auf-n2"],note:null},
    s6:{att:"unexcused",obs:[],note:null}
  };
  const EX = "d" + String(SLOT_COUNT).padStart(2,"0");
  if(HAS_EXAM) st.days[EX] = {                         // Exam Day, gleiches Raster
    s1:{att:"present",obs:["ver-p2","mep-p1"],note:null},
    s2:{att:"present",obs:["ver-n4"],note:null},
    s3:{att:"present",obs:["hyg-p3","ver-p1","auf-p2"],note:null},
    s4:{att:"present",obs:["auf-n4"],note:null},
    s5:{att:"present",obs:[],note:null},
    s6:{att:"present",obs:["hyg-n6","tea-n2"],note:{txt:"Prüfungsablauf wirkte unsicher, Reihenfolge im Weinservice mehrfach nachgefragt.",crit:"",dir:0,w:0,internal:true}}
  };
  st.dayMeta[EX] = {teacher:"M. Pilman", group:"Group 3", outlet:"Bellavista"};
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
S.settings = sanitizeSettings(S.settings);
/* Altbestand aufteilen: fruehere Dateien kannten nur ein Namensfeld. */
S.students = saubereStudierende(S.students || []); S.days = S.days || {};

S.dayMeta = S.dayMeta || {};
let storeOK = true;
try{ localStorage.setItem("sr.probe","1"); storeOK = localStorage.getItem("sr.probe")==="1"; localStorage.removeItem("sr.probe"); }
catch(e){ storeOK = false; }
let storeWarned = false;
function persist(){
  try{ S.variant = VARIANT; localStorage.setItem(KEY, JSON.stringify(S)); }
  catch(e){
    /* Voller oder gesperrter Browserspeicher darf nicht still bleiben: sonst tippt
       jemand den Freitext weiter, ohne zu merken, dass nichts mehr gesichert wird. */
    storeOK = false;
    if(!storeWarned){ storeWarned = true; try{ toast(t("storeWarn")); }catch(_){} }
    const sa = document.getElementById("storeAlert"); if(sa) sa.hidden = false;
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
  const nextOpen = all.find(s=>!s.exam && !S.days[s.id]);
  if(nextOpen) return nextOpen.id;
  const filled = all.filter(s=>S.days[s.id]);
  return (filled.length ? filled[filled.length-1] : all[0]).id;
})();
const repMode = "all";   // Auswertung immer über den ganzen Turnus

const dayOpen = id => !!S.days[id];
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
const dayMeta = id => (S.dayMeta && S.dayMeta[id]) || {teacher:"", group:"", team:"", outlet:""};
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
/* Wechselplan aus dem Cockpit: ab Einsatztag n im zweiten Restaurant */
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


/* Halbturnus in die volle Datei einordnen.
   5T liefert 5 Praxistage, 4T liefert 4 Praxistage plus den Exam Day.
   Zusammen ergeben sie genau die 10T-Struktur: 9 Praxistage plus Exam Day. */
let halfMode = "auto";
function mapSlotId(srcVariant, slid){
  if(!srcVariant || srcVariant === VARIANT) return slid;
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
  /* Team Market: kein Servicedienst, der Tag zählt fest mit 5.00. */
  if(r.att === "tm"){ const g0 = {}; CRITS.forEach(c=>g0[c.k]=5); return g0; }
  /* Exam Day: jede Abwesenheit ergibt 1.00, unabhängig vom Grund. */
  if(r.att === "excused" && !isExam) return null;
  const g = {};
  if(r.att === "unexcused" || (isExam && r.att === "excused")){ CRITS.forEach(c=>g[c.k]=1); return g; }
  const obs = (r.obs||[]).map(i=>CHIP[i]).filter(Boolean);
  if(r.att === "late" && !obs.some(o=>o.i==="tea-lt")) obs.push(CHIP["tea-lt"]);
  const nt = r.note;
  CRITS.forEach(c=>{
    const mine = obs.filter(o=>o.c===c.k);
    if(mine.some(o=>o.ko)){ g[c.k] = 1; return; }
    let d = 0;
    mine.forEach(o=>{ d += o.d * o.w; });
    if(nt && nt.crit === c.k && nt.dir && nt.w) d += nt.dir * nt.w;
    d = Math.max(CAP_NEG, Math.min(CAP_POS, d));
    g[c.k] = Math.max(1, Math.min(6, S.settings.base + d));
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
  CRITS.forEach(c=>{ const ww = (c.k==="gas" && S.settings.gas2) ? 2 : 1; sum += g[c.k]*ww; w += ww; });
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
    (r.obs||[]).forEach(i=>{ tally[i] = (tally[i]||0)+1; });
    const g = critGradesForDay(sl.id, sid); if(!g) return;
    counted++; CRITS.forEach(c=>per[c.k].push(g[c.k]));
  });
  if(!counted) return {counted:0, exc, unx, late, tm, tally, notes, crit:null, total:null};
  const crit = {};
  CRITS.forEach(c=>{ crit[c.k] = per[c.k].reduce((a,b)=>a+b,0)/per[c.k].length; });
  let sum = 0, wsum = 0;
  CRITS.forEach(c=>{ const w = (c.k==="gas" && S.settings.gas2) ? 2 : 1; sum += crit[c.k]*w; wsum += w; });
  return {counted, exc, unx, late, tm, tally, notes, crit, total: sum/wsum};
}
/* Exam Day separat */
function examSummary(sid){
  const sl = examSlot(); if(!sl) return null;
  const r = (S.days[sl.id]||{})[sid]; if(!r) return null;
  const g = critGradesForDay(sl.id, sid);
  return {slot:sl, att:r.att, crit:g, total: g ? dayTotal(sl.id, sid) : null,
          obs:(r.obs||[]).map(i=>CHIP[i]).filter(Boolean), note:r.note||null};
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
  setTimeout(()=>{ h.innerHTML=""; }, 2200);
}
const gradeClass = g => g==null ? "g-na" : (g>=5.25 ? "g-hi" : (g<4.25 ? "g-lo" : ""));
const subLine = () => [S.settings.group, S.settings.team, S.settings.outlet].filter(Boolean).join(" · ") || "Servicepraxis";
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
async function copy(txt, still){
  try{ await navigator.clipboard.writeText(txt); if(!still) toast(t("copied")); return true; }
  catch(e){
    const ta = el("textarea",{style:"position:fixed;opacity:0;top:0"}); ta.value = txt;
    document.body.appendChild(ta); ta.select();
    let ok=false; try{ ok = document.execCommand("copy"); }catch(_){}
    ta.remove(); if(ok && !still) toast(t("copied")); return ok;
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

/* ---------- Selbsttest: prueft die Rechenlogik und die Bausteinbibliothek ----------
   Laeuft auf einer Kopie der Daten. Die erfassten Tage werden dabei nicht veraendert. */
function selfTest(){
  const out = [];
  const add = (name, cond, info) => out.push({name:name, ok:!!cond, info:info==null?"":String(info)});
  const backup = JSON.parse(JSON.stringify(S));
  try{
    /* Bausteinbibliothek */
    const ids = CHIPS.map(c=>c.i);
    add(t("stChips"), ids.length === new Set(ids).size, CHIPS.length + " / " + CRITS.length);
    add(t("stCrit"), CHIPS.every(c=>CRITS.some(k=>k.k===c.c)));
    add(t("stAction"), CHIPS.filter(c=>c.d<0 && !c.ko).every(c=>c.a && c.a.de));
    const LG = ["de","en","th","zh"];
    add(t("stLang"), CHIPS.every(c=>LG.every(l=>c.t[l])) && CRITS.every(c=>LG.every(l=>c[l])));
    add(t("stLate"), !!CHIP["tea-lt"]);
    add(t("stSlots"), slots().every((s,i)=>s.id === "d"+String(i+1).padStart(2,"0")), slots().length + " " + t("days"));
    /* Vor dem Austausch der Testdaten: echte Studierendenliste und Stammdaten pruefen. */
    add(t("stNames"), S.students.every(s => s.nachname || s.vorname),
        S.students.length + " " + t("student"));
    add(t("stClass"), !!(S.settings.group && S.settings.team),
        [S.settings.group, S.settings.team].filter(Boolean).join(" \u00b7 ") || "\u2013");

    /* Rechenlogik auf einer Testperson */
    S.students = [{id:"__t", nachname:"Test", vorname:"Person", nick:"", name:"Test Person", mail:"", lang:""}];
    S.days = {}; S.dayMeta = {};
    const first = slots()[0].id, last = slots()[slots().length-1].id;
    const set = (sl, rec) => { S.days[sl] = {}; S.days[sl]["__t"] = rec; };
    const g = sl => critGradesForDay(sl, "__t");
    const K = CRITS[0].k;
    const base = S.settings.base;

    set(first, {att:"present", obs:[], note:null});
    add(t("stBase"), g(first)[K] === base, base.toFixed(2));

    /* je Gewicht einen Baustein suchen, egal in welchem Kriterium */
    [[W.l, 0.25, "stLight"], [W.m, 0.5, "stMedium"], [W.s, 1, "stHeavy"]].forEach(([gew, soll, key])=>{
      const c = CHIPS.find(x=>x.d<0 && !x.ko && x.w===gew);
      if(!c){ add(t(key), false, "kein Baustein mit diesem Gewicht"); return; }
      set(first,{att:"present",obs:[c.i],note:null});
      add(t(key), Math.abs(g(first)[c.c] - (base-soll)) < 1e-9, fmt(g(first)[c.c]));
    });

    const negs = CHIPS.filter(c=>c.c===K && c.d<0 && !c.ko).map(c=>c.i);
    set(first,{att:"present",obs:negs,note:null});
    add(t("stCapDown"), g(first)[K] === Math.max(1, base-1.5), fmt(g(first)[K]));
    const poss = CHIPS.filter(c=>c.c===K && c.d>0).map(c=>c.i);
    set(first,{att:"present",obs:poss,note:null});
    add(t("stCapUp"), g(first)[K] === Math.min(6, base+1), fmt(g(first)[K]));

    const ko = CHIPS.find(c=>c.ko);
    if(ko){ set(first,{att:"present",obs:[ko.i],note:null});
      const gg = g(first);
      add(t("stKo"), gg[ko.c] === 1 && CRITS.filter(c=>c.k!==ko.c).every(c=>gg[c.k] === base), critName(ko.c)); }

    set(first,{att:"late",obs:[],note:null});
    add(t("stLateEffect"), g(first)["tea"] < base, fmt(g(first)["tea"]));
    set(first,{att:"unexcused",obs:[],note:null});
    add(t("stUnexcused"), CRITS.every(c=>g(first)[c.k] === 1));
    set(first,{att:"excused",obs:[],note:null});
    add(t("stExcused"), g(first) === null);
    set(first,{att:"tm",obs:[],note:null});
    add(t("stTm"), CRITS.every(c=>g(first)[c.k] === 5));

    if(HAS_EXAM){
      set(last,{att:"excused",obs:[],note:null});
      const ge = g(last);
      add(t("stExam"), ge && CRITS.every(c=>ge[c.k] === 1));
      add(t("stFinal"), Math.abs(finalGrade(4,6) - (4*2/3 + 6/3)) < 1e-9, fmt(finalGrade(4,6)));
    }

    set(first,{att:"present",obs:[],note:{txt:"x",crit:"",dir:0,w:0}});
    const ohne = g(first)[K];
    set(first,{att:"present",obs:[],note:{txt:"x",crit:K,dir:-1,w:0.5}});
    add(t("stNote"), ohne === base && Math.abs(g(first)[K] - (base-0.5)) < 1e-9);

    add(t("stStore"), storeOK);
  }catch(err){
    out.push({name:"Fehler", ok:false, info:String(err)});
  }finally{
    S = backup;
  }
  return out;
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
    if(hasOutlet2()) head.appendChild(el("button",{class:"opill"+(r.outlet?" alt":""),title:t("switchTitle"),
      text:"⇄ " + (r.outlet || S.settings.outlet || "–"),
      onclick:()=>{ unseed(); toggleOutlet(r); persist(); renderDay(); }}));
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
      const shown = [...(r.obs||[])];
      if(r.att==="late" && !shown.includes("tea-n1")) shown.push("tea-n1");
      shown.forEach(id=>{
        const c = CHIP[id]; if(!c) return;
        const auto = (id==="tea-n1" && !(r.obs||[]).includes("tea-n1"));
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
      list.map(x=>el("span",{class:"obs m",style:"padding:3px 10px",text:x.name + " · " + x.kind}))));
  } else {
    box.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("absMailNone")}));
  }
  const foot = el("div",{class:"row",style:"align-items:center"});
  foot.appendChild(el("button",{class:"btn pri",text:"⤓ "+t("saveDay"),
    onclick:()=>saveFile(fileStem()+".json", JSON.stringify(snapshot(),null,1), "application/json")}));
  foot.appendChild(el("button",{class:"btn pri",style:"background:var(--petrol);border-color:var(--petrol)",
    text:"✉ "+t("absMailBtn"), onclick:()=>openAbsenceMail(curSlot)}));
  /* Zweistufig wie das Zuruecksetzen: ein Fehlklick darf nicht die Beobachtungen
     aller Studierenden dieses Tages loeschen. */
  let dropArmed = false;
  const dropBtn = el("button",{class:"btn sm",text:t("dropDay"),
    onclick:()=>{
      if(!dropArmed){
        dropArmed = true;
        dropBtn.textContent = t("dropConfirm");
        dropBtn.style.background = "var(--minus)"; dropBtn.style.color = "#fff";
        dropBtn.style.borderColor = "var(--minus)";
        setTimeout(()=>{ if(dropArmed){ dropArmed = false; if(view==="day") renderDay(); } }, 6000);
        return;
      }
      delete S.days[curSlot]; delete S.dayMeta[curSlot]; persist(); renderDay();
      toast(t("dropDone"));
    }});
  foot.appendChild(dropBtn);
  box.appendChild(foot);
  const pr = el("div",{class:"row",style:"margin-top:12px;padding-top:12px;border-top:1px solid var(--line)"});
  pr.appendChild(el("span",{class:"eyebrow",style:"width:100%",text:t("sheetPrint")}));
  pr.appendChild(el("button",{class:"btn sm",text:"\u2399 "+t("sheetDay"),onclick:()=>printSheets("day")}));
  pr.appendChild(el("button",{class:"btn sm",text:"\u2399 "+t("sheetSingle"),onclick:()=>printSheets("single")}));
  box.appendChild(pr);
  box.appendChild(el("p",{class:"muted",style:"margin:10px 0 0",
    text:t("saveDayHint") + " " + t("absMailHint") + " " + ABS_MAIL + "."}));
  root.appendChild(box);
}

/* ---------- Erfassungsblaetter fuer den Service ---------- */
const CRIT_ABBR = {gas:"GAS", hyg:"HYG", mep:"MEP", tec:"TEC", ver:"VER", tea:"TEA", sel:"SEL", mot:"MOT", auf:"AUF"};

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
  hr.appendChild(el("th",{style:"width:34mm",text:t("abs")}));
  CRITS.forEach(c=>hr.appendChild(el("th",{class:"sep",style:"width:12.5mm",
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
      (st.name || "________________________") + "     \u00b7     "
      + [S.settings.group, S.settings.team, S.settings.outlet].filter(Boolean).join(" \u00b7 "),
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
    const k = r.att === "late" ? t("late")
            : r.att === "excused" ? t("excused")
            : r.att === "unexcused" ? t("unexcused") : null;
    if(k) out.push({st:st, name:st.name, kind:k, outlet: (hasOutlet2() || r.outlet) ? outletOfDay(slotId, st.id) : ""});
  });
  return out;
}
/* Eine Meldezeile: Name, Vorname, Nickname, Klasse, Gruppe, Grund.
   Klasse und Gruppe stehen bewusst auf jeder Zeile, damit eine einzelne Zeile
   weitergeleitet werden kann, ohne den Kopf der Mail mitzunehmen. */
function absenceZeile(x){
  const s = x.st || {};
  const person = [s.nachname || s.name || "", s.vorname || ""].filter(Boolean).join(", ")
               + (s.nick ? " \u00ab" + s.nick + "\u00bb" : "");
  const kg = [klasseOf(s), gruppeOf(s)].filter(Boolean).join(" \u00b7 ");
  return "- " + person + (kg ? "   \u00b7   " + kg : "") + (x.outlet ? "   \u00b7   " + x.outlet : "")
       + "   \u2014   " + x.kind;
}
function absenceMailHref(slotId){
  const sl = slotById(slotId);
  const list = absenceList(slotId);
  const head = [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher].filter(Boolean).join(" · ");
  const subj = t("absMailSubj") + " – " + [S.settings.group, S.settings.team, S.settings.outlet, slotLabel(sl)].filter(Boolean).join(" · ");
  const body = [head, slotLabel(sl) + " · " + VARIANT, ""]
    .concat(list.length ? list.map(absenceZeile) : [t("absMailNone")])
    .concat(["", "JSON: " + fileStem() + ".json"])
    .join("\n");
  return "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
}
function openAbsenceMail(slotId){
  const a = el("a",{href:absenceMailHref(slotId), target:"_blank", rel:"noopener", style:"display:none"});
  document.body.appendChild(a); a.click(); a.remove();
  toast(t("absMailSent"));
}

/* ---------- Bottom Sheet ---------- */
let sheetCrit = "gas";
function openSheet(student){
  const host = document.getElementById("sheetHost"); host.innerHTML = "";
  const close = ()=>{ host.innerHTML=""; document.removeEventListener("keydown", onKey); renderDay(); };
  const onKey = e => { if(e.key==="Escape") close(); };
  document.addEventListener("keydown", onKey);
  host.appendChild(el("div",{class:"scrim",onclick:close}));
  const sheet = el("div",{class:"sheet",role:"dialog","aria-modal":"true"});
  sheet.appendChild(el("div",{class:"sheet-h"},[
    el("h3",{text:student.name + " · " + slotLabel(slotById(curSlot))}),
    el("button",{class:"btn sm pri",text:t("done"),onclick:close})
  ]));
  const tabs = el("div",{class:"crittabs"});
  /* Kurzname im Reiter, damit alle neun Kriterien ohne Scrollen sichtbar bleiben */
  CRITS.forEach(c=>tabs.appendChild(el("button",{text:critShort(c.k, S.settings.uiLang),
    title:critName(c.k, S.settings.uiLang),
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
        const on = (r.obs||[]).includes(c.i);
        const sig = c.ko ? "K.-o." : (c.d>0?"+":"−") + (c.w >= 1 ? c.w.toFixed(2) : c.w.toFixed(2).slice(1));
        const b = el("button",{class:"opt "+(c.d>0?"p":"m")+(on?" on":"")+(c.ko?" ko":""),
          onclick:()=>{ unseed();
            r.obs = (r.obs||[]).includes(c.i) ? r.obs.filter(x=>x!==c.i) : [...(r.obs||[]), c.i];
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
/* ---------- Notenuebersicht als Text und als E-Mail an die Kursleitung ----------
   mailto kann keine Datei anhaengen und Outlook kuerzt lange Adressen. Deshalb gibt es
   drei Ausfuehrlichkeiten; gesendet wird die laengste, die sicher durchgeht. Die volle
   Fassung liegt immer zusaetzlich in der Zwischenablage. */
function overviewRows(){
  return S.students.map(s=>({s:s, sum:summary(s.id, repMode)}))
                   .filter(r=>r.sum.counted || r.sum.exc || r.sum.unx || r.sum.tm);
}
function absText(sum){
  const a = [];
  if(sum.exc)  a.push(sum.exc + "\u00d7 " + t("excused"));
  if(sum.unx)  a.push(sum.unx + "\u00d7 " + t("unexcused"));
  if(sum.late) a.push(sum.late + "\u00d7 " + t("late"));
  if(sum.tm)   a.push(sum.tm + "\u00d7 " + t("teamMarket"));
  return a.length ? a.join(", ") : t("absNone");
}
/* stufe 2 = mit Kriterien, 1 = eine Zeile pro Person, 0 = knappste Fassung */
function overviewText(stufe){
  const lg = S.settings.uiLang, withExam = !!examSlot(), rows = overviewRows();
  const out = [];
  out.push(t("emailSubj") + " \u00b7 " + [S.settings.group, S.settings.team, S.settings.outlet].filter(Boolean).join(" \u00b7 "));
  out.push(t("teacher") + ": " + (S.settings.teacher || "\u2013") + "  \u00b7  " + VARIANT
           + "  \u00b7  " + new Date().toISOString().slice(0,10));
  out.push("");
  if(!rows.length){ out.push(t("noData")); return out.join("\n"); }
  if(stufe === 0)
    out.push(withExam ? t("ovShortHead") : t("total") + " \u00b7 " + t("days") + " \u00b7 " + t("abs"));
  rows.forEach(function(r){
    const s = r.s, sum = r.sum;
    const ex  = withExam ? examSummary(s.id) : null;
    const fin = withExam ? finalGrade(sum.total, ex ? ex.total : null) : sum.total;
    if(stufe === 0){
      const n = withExam ? [fmt(sum.total), fmt(ex ? ex.total : null), fmt(fin)].join(" / ") : fmt(sum.total);
      out.push(s.name + ": " + n + " \u00b7 " + sum.counted + " \u00b7 " + absText(sum));
      return;
    }
    const k = [];
    k.push((withExam ? t("praxisGrade") : t("total")) + " " + fmt(sum.total));
    if(withExam){ k.push(t("examShort") + " " + fmt(ex ? ex.total : null));
                  k.push(t("finalGrade") + " " + fmt(fin)); }
    k.push(sum.counted + " " + t("days"));
    k.push(absText(sum));
    out.push(s.name + "  \u2014  " + k.join("  \u00b7  "));
    if(stufe === 2 && sum.crit)
      out.push("   " + CRITS.map(function(c){ return (CRIT_ABBR[c.k]||c.k.toUpperCase()) + " " + fmt1(sum.crit[c.k]); }).join("  \u00b7  "));
  });
  if(stufe === 2){
    out.push("");
    out.push(CRITS.map(function(c){ return (CRIT_ABBR[c.k]||c.k.toUpperCase()) + " = " + critName(c.k, lg); }).join("  \u00b7  "));
  }
  out.push("");
  out.push(t("ovFoot"));
  return out.join("\n");
}
const OV_LIMIT = 1900;     /* sichere Gesamtlaenge einer mailto-Adresse fuer Outlook */
function mailOverview(){
  const subj = t("emailSubj") + " \u2013 "
             + [S.settings.group, S.settings.team, S.settings.outlet, S.settings.teacher].filter(Boolean).join(" \u00b7 ");
  const bau = function(body){ return "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(subj)
                                   + "&body=" + encodeURIComponent(body); };
  const voll = overviewText(2);
  let gewaehlt = null, stufeUsed = -1;
  [2,1,0].some(function(stufe){
    const txt = overviewText(stufe);
    if(bau(txt).length <= OV_LIMIT){ gewaehlt = txt; stufeUsed = stufe; return true; }
    return false;
  });
  if(gewaehlt === null){                    /* selbst die knappste Fassung passt nicht */
    gewaehlt = overviewText(0).split("\n").slice(0,3).join("\n") + "\n" + t("ovClipHint");
    stufeUsed = -1;
  }
  const a = el("a",{href:bau(gewaehlt), target:"_blank", rel:"noopener", style:"display:none"});
  document.body.appendChild(a); a.click(); a.remove();
  if(stufeUsed === 2){ toast(t("absMailSent")); return; }
  /* Die volle Fassung mit den Kriterienwerten passt nicht in die Mail und geht still
     in die Zwischenablage. Die Meldung sagt, was in der Mail steht. */
  copy(voll, true).then(function(){
    toast(stufeUsed >= 0 ? t("ovClipCrit") : t("ovClip"));
  });
}

function renderWeek(){
  const root = document.getElementById("v-week"); root.innerHTML = "";
  const rows = S.students.map(s=>({s, sum:summary(s.id, repMode)}));
  if(!rows.some(r=>r.sum.counted)){ root.appendChild(el("p",{class:"muted",text:t("noData")})); return; }

  const withExam = (repMode === "all") && !!examSlot();
  const showFinal = withExam;
  const tbl = el("table");
  const trh = el("tr");
  trh.appendChild(el("th",{text:t("student")}));
  /* Kuerzel statt Langnamen: bei neun Kriterien passt die Tabelle sonst nicht mehr in die Breite */
  CRITS.forEach(c=>trh.appendChild(el("th",{class:"abbr", title:critName(c.k, S.settings.uiLang),
    text:CRIT_ABBR[c.k] || critName(c.k, S.settings.uiLang).split(" ")[0]})));
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
        el("span",{class:"grade num "+gradeClass(f),style:"padding:2px 8px;font-size:13.5px;font-weight:600",text:fmt(f)})));
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

  /* Versand der ganzen Uebersicht an die Kursleitung */
  const acts = el("div",{class:"row",style:"margin-bottom:12px"});
  acts.appendChild(el("button",{class:"btn pri",text:"\u2709 " + t("ovMail"),
    title:t("ovMailHint") + " " + ABS_MAIL, onclick:mailOverview}));
  acts.appendChild(el("button",{class:"btn",text:t("ovCopy"),onclick:()=>copy(overviewText(2))}));
  acts.appendChild(el("span",{class:"muted",style:"margin-left:auto",text:ABS_MAIL}));
  root.appendChild(acts);

  root.appendChild(el("div",{class:"tblwrap"}, tbl));
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
  out.push(s.name + (klasseOf(s) ? " · " + klasseOf(s) : ""));
  out.push(period + " · " + sum.counted + " " + P("daysCounted"));
  const _pl = placementText(s.id, lg);
  if(_pl) out.push(P("placements") + ": " + _pl);
  if(sum.total!=null) out.push(P(ex?"praxisGrade":"grade") + ": " + fmt(sum.total) + " (" + bandName(sum.total, lg) + ")");
  if(ex){
    out.push(P("examGrade") + ": " + (ex.total!=null
      ? fmt(ex.total) + " (" + bandName(ex.total, lg) + ")"
      : P("noData")));
  }
  if(fin!=null) out.push(P("finalGrade") + ": " + fmt(fin) + " (" + bandName(fin, lg) + ")");
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
      el("div",{class:"pmeta",text:[klasseOf(s), gruppeOf(s), S.settings.teacher, recordedPeriod(s.id, repMode, lg),
        sum.counted+" "+tOut("daysCounted",lg)].filter(Boolean).join("   ·   ")}),
      placementText(s.id, lg) ? el("div",{class:"pmeta",text:tOut("placements",lg) + ": " + placementText(s.id, lg)}) : null
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
      + tOut("base",lg) + " " + S.settings.base.toFixed(2)
      + (S.settings.gas2 ? " · " + tOut("gas2",lg) : "")}));
    area.appendChild(doc);
  });
  if(!n){ toast(t("noData")); return; }
  document.body.classList.add("printing");
  const done = ()=>{ document.body.classList.remove("printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  setTimeout(()=>{ try{ window.print(); }catch(e){ toast("Print"); } setTimeout(done, 1500); }, 60);
}

/* ---------- Daten ---------- */
function csvEsc(v){ const s = String(v==null?"":v); return /[";\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }
function gradeRows(){
  const rng = slotsInRange(repMode);
  const period = rng.length ? slotLabel(rng[0],"de")+" – "+slotLabel(rng[rng.length-1],"de") : "";
  const withExam = (repMode === "all") && !!examSlot();
  const head = ["Klasse","Gruppe","Outlet","Einsatzorte","Dozent","Nachname","Vorname","Nickname","E-Mail","Turnus","Tage gewertet","Entschuldigt","Unentschuldigt","Verspaetet","Team Market",
    ...CRITS.map(c=>c.de), withExam?"Praxisnote":"Gesamtnote","Gerundet","Prädikat"]
    .concat(withExam ? [...CRITS.map(c=>"Exam "+c.de), "Prüfungsnote","Exam Anwesenheit"] : [])
    .concat(withExam ? ["Schlussnote"] : []).concat(["Sprache","Beurteilung"]);
  const rows = S.students.map(s=>{
    const su = summary(s.id, repMode);
    const ex = withExam ? examSummary(s.id) : null;
    const base = [klasseOf(s), gruppeOf(s), S.settings.outlet||"", placementText(s.id, "de"), S.settings.teacher,
                  s.nachname||s.name||"", s.vorname||"", s.nick||"", s.mail||"", period,
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
      row = row.concat([fin!=null?Number(fin.toFixed(2)):""]);
    }
    row = row.concat([outLangOf(s)]);
    row = row.concat([buildReport(s, repMode, outLangOf(s))]);
    return row;
  });
  return {head, rows};
}
function evidenceRows(){
  const head = ["Studierende","Einsatztag","Woche","Art","Erfasst von","Gruppe","Team","Outlet","Anwesenheit",
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
      const pre = [s.name, lab, sl.week, kind, mt.teacher, mt.group, mt.team||"", outletOfDay(sl.id, s.id) || mt.outlet || "", att];
      (r.obs||[]).forEach(id=>{
        const c = CHIP[id]; if(!c) return;
        rows.push(pre.concat([critName(c.c,"de"), c.ko?"K.-o.":(c.d>0?"+":"−"), c.ko?"":c.w, chipT(c,"de")]));
      });
      if(r.note && r.note.txt)
        rows.push(pre.concat([r.note.crit?critName(r.note.crit,"de"):"",
          r.note.dir>0?"+":(r.note.dir<0?"−":""), r.note.w||"",
          (r.note.internal?"Freitext (intern): ":"Freitext: ")+r.note.txt]));
      if((!r.obs||!r.obs.length) && !(r.note&&r.note.txt) && r.att!=="present")
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
  ws1["!cols"] = g.head.map((h,i)=>({wch: i===3?24 : i===4?30 : (i<6?18:12)}));
  ws1["!cols"][g.head.length-1] = {wch:90};
  XLSX.utils.book_append_sheet(wb, ws1, "Noten");
  const ws2 = XLSX.utils.aoa_to_sheet([e.head, ...e.rows]);
  ws2["!cols"] = [{wch:24},{wch:14},{wch:6},{wch:10},{wch:18},{wch:20},{wch:14},{wch:7},{wch:20},{wch:9},{wch:8},{wch:70}];
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
    app: "Servicerapport",
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
      base: S.settings.base,
      gas2: !!S.settings.gas2,
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
  return parts.length > 2 ? parts.join("_") : "Servicerapport_" + VARIANT + "_" + iso;
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
  slotsInRange(repMode).forEach(sl=>Object.values(S.days[sl.id]||{}).forEach(r=>(r.obs||[]).forEach(i=>{counts[i]=(counts[i]||0)+1;totalObs++;})));
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
  for(const f of files){
    try{
      const o = JSON.parse(await f.text());
      if(!o || !o.students || !o.days) continue;
      if(!acceptsVariant(o.variant)){ wrongVar.push(f.name + " (" + o.variant + ")"); continue; }
      if(o.variant && o.variant !== VARIANT) placed.push(o.variant);
      const map = {};
      saubereStudierende(o.students).forEach(st=>{
        /* Name allein reicht nicht: zwei gleichnamige Studierende duerfen nicht
           zu einer Person verschmelzen. Die E-Mail-Adresse entscheidet mit. */
        let ex = S.students.find(x =>
          x.name.trim().toLowerCase() === st.name.trim().toLowerCase() &&
          (!x.mail || !st.mail || x.mail.toLowerCase() === st.mail.toLowerCase()));
        if(!ex && S.students.some(x => x.name.trim().toLowerCase() === st.name.trim().toLowerCase()))
          clash.push(st.name + " (" + t("sameName") + ")");
        if(!ex){
          ex = {...st, id:"m"+Math.random().toString(36).slice(2,8)};
          S.students.push(ex); addedS++;
        } else {                       // bestehende Person: fehlende Angaben nachtragen
          if(!ex.mail && st.mail) ex.mail = st.mail;
          if(!ex.lang && st.lang) ex.lang = st.lang;
          if(!ex.nick && st.nick) ex.nick = st.nick;
          if(!ex.klasse && st.klasse) ex.klasse = st.klasse;
          if(!ex.gruppe && st.gruppe) ex.gruppe = st.gruppe;
          if(!ex.vorname && st.vorname){ ex.vorname = st.vorname; ex.name = anzeigeName(ex); }
        }
        map[st.id] = ex.id;
      });
      Object.entries(o.days).forEach(([srcId,recs])=>{
        const slid = mapSlotId(o.variant, srcId);
        if(!slid) return;
        S.days[slid] = S.days[slid] || {};
        if(o.dayMeta && o.dayMeta[srcId] && !S.dayMeta[slid]) S.dayMeta[slid] = o.dayMeta[srcId];
        Object.entries(recs).forEach(([oldId,r])=>{
          const nid = map[oldId]; if(!nid) return;
          if(!S.days[slid][nid]){ S.days[slid][nid] = mitOrt(r, o); addedD++; }
          else{
            const nm = (S.students.find(x=>x.id===nid)||{}).name || nid;
            const sl = slots().find(x=>x.id===slid);
            clash.push(nm + " / " + (sl ? slotLabel(sl) : slid));
          }
        });
      });
    }catch(err){}
  }
  unseed(); persist();
  let msg = "+"+addedS+" "+t("student")+" · +"+addedD+" "+t("days");
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
    if(!o || !o.settings || !Array.isArray(o.students)) throw new Error("format");
    if(o.variant && o.variant !== VARIANT){ toast(t("wrongVariant") + ": " + o.variant); return; }
    S = { settings:{...sanitizeSettings(o.settings), isSample:false},
          students:saubereStudierende(o.students), days:o.days || {}, dayMeta:o.dayMeta || {} };
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
  const txtField = (id, label, key, sub) => {
    const f = el("div",{class:"field"});
    f.appendChild(el("label",{for:id, text:label, title:label}));
    f.appendChild(el("input",{id:id, value:S.settings[key]||"",
      oninput:e=>{ S.settings[key]=e.target.value; persist();
                   if(sub) document.getElementById("brandSub").textContent = subLine(); }}));
    return f;
  };
  /* Klasse und Gruppe sind feste Listen (KLASSEN und GRUPPEN in _chips.js). Ein bereits
     gespeicherter Wert ausserhalb der Liste bleibt als zusaetzliche Option erhalten. */
  const selField = (id, label, key, liste) => {
    const f = el("div",{class:"field"});
    f.appendChild(el("label",{for:id, text:label, title:label}));
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
  g2.appendChild(selField("fGroup", t("groupOnly"),  "group", KLASSEN));
  g2.appendChild(selField("fTeam",  t("teamField"),  "team",  GRUPPEN));
  g2.appendChild(txtField("fOutlet",  t("outletField"), "outlet",  true));
  g2.appendChild(txtField("fTeacher", t("teacher"),     "teacher", false));
  const f3 = el("div",{class:"field"});
  f3.appendChild(el("label",{for:"fBase",text:t("baseShort"),title:t("base")}));
  const selB = el("select",{id:"fBase",onchange:e=>{S.settings.base=parseFloat(e.target.value);persist();}});
  [4.5,4.75,5,5.25,5.5].forEach(v=>selB.appendChild(el("option",{value:String(v),text:v.toFixed(2),selected:S.settings.base===v})));
  f3.appendChild(selB); g2.appendChild(f3);
  const fO2 = el("div",{class:"field",style:"margin-top:4px"});
  fO2.appendChild(el("label",{for:"fOutlet2",text:t("outlet2Field")}));
  fO2.appendChild(el("input",{id:"fOutlet2",value:S.settings.outlet2||"",
    oninput:e=>{ S.settings.outlet2 = e.target.value; persist(); }}));
  fO2.appendChild(el("span",{class:"muted",style:"font-size:12.5px",text:t("outlet2Hint")}));
  const f4 = el("div",{class:"field"});
  f4.appendChild(el("label",{text:t("weighting")}));
  const lbl = el("label",{style:"display:flex;gap:8px;align-items:center;font-size:14px;text-transform:none;letter-spacing:0;color:var(--ink);padding:8px 0"});
  lbl.appendChild(el("input",{type:"checkbox",id:"fHyg",checked:!!S.settings.gas2,style:"width:auto",
    onchange:e=>{S.settings.gas2=e.target.checked;persist();}}));
  lbl.appendChild(el("span",{text:t("gas2")}));
  f4.appendChild(lbl);
  c1.appendChild(g2);
  c1.appendChild(fO2);
  c1.appendChild(el("div",{class:"grid2"}, f4));

  const f5 = el("div",{class:"field"});
  f5.appendChild(el("label",{for:"fStud",text:t("studentList")}));
  const ta = el("textarea",{id:"fStud"});
  ta.value = S.students.map(s=>studentZeile(s)).join("\n");
  f5.appendChild(ta);
  f5.appendChild(el("span",{class:"muted",text:t("studentListHint")}));
  c1.appendChild(f5);
  const rowb = el("div",{class:"row"});
  rowb.appendChild(el("button",{class:"btn pri",text:t("apply"),onclick:()=>{
    const lines = ta.value.split("\n").map(x=>x.trim()).filter(Boolean);
    const neu = lines.map(line=>{
      const g = parseStudentZeile(line);
      if(!g) return null;
      const ex = S.students.find(s=>
        (s.nachname||"").trim().toLowerCase() === g.nachname.toLowerCase() &&
        (s.vorname ||"").trim().toLowerCase() === g.vorname.toLowerCase());
      const o = ex ? {...ex, ...g,
                      nick: g.nick || ex.nick || "",
                      mail: g.mail || ex.mail || "",
                      lang: g.lang || ex.lang || "",
                      klasse: g.klasse || ex.klasse || "",
                      gruppe: g.gruppe || ex.gruppe || ""}
                   : {id:"s"+Math.random().toString(36).slice(2,8), ...g};
      o.name = anzeigeName(o);
      return o;
    }).filter(Boolean);
    S.students = neu;
    unseed(); persist(); toast(S.students.length+" "+t("student")); render();
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
  info.innerHTML = "Jeder Einsatztag startet pro Kriterium auf der Basisnote <b class='num'>"+Number(S.settings.base).toFixed(2)+"</b>. "+
    "Jede angetippte Beobachtung verschiebt diese Note: leicht <b class='num'>0.25</b>, mittel <b class='num'>0.50</b>, schwer <b class='num'>1.00</b>. "+
    "Pro Tag und Kriterium sind maximal <b class='num'>−1.50</b> und <b class='num'>+1.00</b> möglich. "+
    "Ein K.-o.-Baustein setzt das Kriterium auf <b class='num'>1.00</b>. "+
    "Ein Tag ohne Beobachtung zählt bewusst als «wie erwartet». "+
    "Unentschuldigt ergibt eine Tagesnote von <b class='num'>1.00</b>, entschuldigt zählt nicht in den Durchschnitt. "+
    "«Verspätet» setzt automatisch einen Abzug auf Teamfähigkeit. "+
    "Ein Freitext wirkt nur dann auf die Note, wenn ein Kriterium und eine Wirkung gewählt sind. "+
    (S.settings.gas2 ? "Gastgeberhaltung und Gästekontakt zählt im Gesamtschnitt <b>doppelt</b>. " : "Gastgeberhaltung und Gästekontakt zählt im Gesamtschnitt einfach. ")+
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

  /* Selbsttest */
  const cT = el("div",{class:"card pad",style:"margin-top:14px"});
  cT.appendChild(el("span",{class:"eyebrow",text:t("selfTest"),style:"display:block;margin-bottom:8px"}));
  cT.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text:t("selfTestHint")}));
  const tOut = el("div",{style:"margin-top:10px"});
  cT.appendChild(el("div",{class:"row"},
    el("button",{class:"btn",text:t("selfTestBtn"),onclick:()=>{
      const res = selfTest();
      const bad = res.filter(r=>!r.ok).length;
      tOut.innerHTML = "";
      tOut.appendChild(el("div",{style:"font-weight:600;margin-bottom:6px;color:"
        + (bad ? "var(--minus)" : "var(--plus)"),
        text:(res.length-bad) + " / " + res.length + " " + t("selfTestOkN")
             + (bad ? "  \u00b7  " + bad + " " + t("selfTestBad") : "")}));
      res.forEach(r=>{
        const row = el("div",{style:"display:flex;gap:8px;align-items:flex-start;font-size:13px;"
          + "padding:3px 0;border-top:1px solid var(--line)"});
        row.appendChild(el("span",{style:"flex:0 0 16px;font-weight:700;color:"
          + (r.ok ? "var(--plus)" : "var(--minus)"), text: r.ok ? "\u2713" : "\u2717"}));
        row.appendChild(el("span",{style:"flex:1", text:r.name}));
        if(r.info) row.appendChild(el("span",{class:"num",style:"color:var(--ink3);font-size:12px",text:r.info}));
        tOut.appendChild(row);
      });
      toast((res.length-bad) + " / " + res.length);
    }})));
  cT.appendChild(tOut);
  root.appendChild(cT);

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
        setTimeout(()=>{ if(armed){ armed=false; if(view==="set") renderSet(); } }, 6000);
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
setTimeout(() => n2Handoff(o => onRestore({target:{files:[new File([JSON.stringify(o)], "paket.json")], value:""}})), 30);
