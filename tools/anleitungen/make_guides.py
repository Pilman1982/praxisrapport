# -*- coding: utf-8 -*-
"""Persönliche Gebrauchsanweisungen Praxisrapport (Noten 2.0) als PDF, eine pro Person, in ihrer Sprache."""
import json, zipfile, pathlib, html as H, io, base64, datetime
import segno
from playwright.sync_api import sync_playwright

G = pathlib.Path("/tmp/claude-0/guides"); SH = G / "shots"; OUT = G / "pdf"; OUT.mkdir(exist_ok=True)
FONTS = pathlib.Path("/tmp/claude-0/fonts/node_modules/@fontsource")
LOGO = open("/home/claude/praxisrapport/src/kueche/_logo.txt").read().strip()
SEM = zipfile.ZipFile("/tmp/claude-0/hs26/Semesterpakete_HS26.zip")
BASE = "https://pilman1982.github.io/praxisrapport/"

def ff(fam, file, w, uni=""):
    return "@font-face{font-family:'%s';src:url('%s') format('woff2');font-weight:%d;%s}" % (fam, (FONTS / file).as_uri(), w, ("unicode-range:" + uni + ";") if uni else "")
FACES = "".join([
    ff("Jost", "jost/files/jost-latin-400-normal.woff2", 400), ff("Jost", "jost/files/jost-latin-500-normal.woff2", 500),
    ff("Jost", "jost/files/jost-latin-600-normal.woff2", 600),
    ff("Newsreader", "newsreader/files/newsreader-latin-600-normal.woff2", 600),
    ff("NotoThai", "noto-sans-thai/files/noto-sans-thai-thai-400-normal.woff2", 400, "U+0E01-0E5B"),
    ff("NotoThai", "noto-sans-thai/files/noto-sans-thai-thai-600-normal.woff2", 600, "U+0E01-0E5B"),
    ff("NotoSerifThai", "noto-serif-thai/files/noto-serif-thai-thai-600-normal.woff2", 600, "U+0E01-0E5B"),
])
CSS = FACES + """
@page{size:A4;margin:14mm 15mm 13mm}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:Jost,NotoThai,sans-serif;color:#001436;font-size:9.8pt;line-height:1.5;background:#fff}
body.th{font-size:10.2pt;line-height:1.62}
.logo{height:10mm;width:auto;display:block;margin:0 0 6mm}
.head{display:flex;gap:6mm;align-items:flex-start}
.head .l{flex:1}
h1{font-family:Newsreader,NotoSerifThai,Georgia,serif;font-size:22pt;font-weight:600;margin:0 0 1mm;line-height:1.1}
.sub{font-size:11.5pt;color:#005779;margin:0 0 3mm;font-weight:500}
.qr{width:27mm;text-align:center;font-size:7pt;color:#5A6270}
.qr img{width:27mm;height:27mm;display:block}
.rule{border:0;border-top:1.5pt solid #001436;margin:2mm 0 4mm}
.lead{font-size:10.4pt;color:#3B4657;margin:0 0 4mm}
h2{font-family:Newsreader,NotoSerifThai,Georgia,serif;font-size:13pt;font-weight:600;margin:6mm 0 2mm;break-after:avoid}
h2 .n{display:inline-block;min-width:7mm;color:#005779}
p{margin:0 0 2mm}
ol,ul{margin:0 0 2mm;padding-left:5.5mm}
li{margin-bottom:1.2mm}
b{font-weight:600}
.k{font-weight:600;background:#EDF2F6;border:0.5pt solid #C9D5DF;border-radius:2.5pt;padding:0 1.3mm;white-space:nowrap}
table{width:100%;border-collapse:collapse;font-size:8.8pt;margin:1.5mm 0 3mm}
th{background:#EDEDEA;border:0.5pt solid #C0C0B8;padding:1.1mm 2mm;text-align:left;font-weight:600;font-size:7.6pt;letter-spacing:.04em;color:#3B4657}
td{border:0.5pt solid #C0C0B8;padding:1.1mm 2mm;vertical-align:top}
tr.now td{background:#E6F1F5;font-weight:600}
td.c{text-align:center;white-space:nowrap}
.box{border-left:2.5pt solid #005779;background:#F2F5F7;padding:2.6mm 3.6mm;margin:2.5mm 0 3.5mm;break-inside:avoid}
.box.warn{border-left-color:#B6633F;background:#F8EFE8}
.box .t{font-weight:600;margin-bottom:0.8mm}
.box p:last-child,.box ul:last-child{margin-bottom:0}
.shots{display:flex;gap:3mm;margin:2mm 0 1mm;break-inside:avoid}
.shot{flex:1;text-align:center;font-size:7.6pt;color:#5A6270}
.shot img{width:100%;border:0.6pt solid #C0C0B8;border-radius:3mm;display:block;margin-bottom:1mm}
.shot b{color:#001436}
.wide img{width:100%;height:78mm;object-fit:cover;object-position:top;border:0.6pt solid #C0C0B8;border-radius:2mm}
.two{display:flex;gap:6mm}.two>div{flex:1}
.foot{margin-top:6mm;border-top:0.5pt solid #DCDCD6;padding-top:2mm;font-size:7.4pt;color:#7A828E}
.pb{break-before:page}
.fr{float:right;width:40mm;margin:0 0 2mm 5mm;break-inside:avoid}
.fr .shot img{max-height:84mm;object-fit:cover;object-position:top}
table.sched td{padding:0.5mm 2mm;font-size:8.2pt}
.shots .shot img{max-height:118mm;object-fit:cover;object-position:top}
.avoid{break-inside:avoid}
.legend span{display:inline-block;padding:0 2mm;border-radius:6pt;font-weight:600;margin-right:1mm}
.g1{background:#dff1e5;color:#1d5c34}.g2{background:#eceef2;color:#1a1f2b}.g3{background:#f8dcd7;color:#8a2416}
"""

def img(name): return (SH / name).as_uri()
def qr(url):
    b = io.BytesIO(); segno.make(url, error="m").save(b, kind="png", scale=8, border=2)
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
def dmy(iso): return iso[8:10] + "." + iso[5:7] + "."

# --------------------------------------------------------------------------- Personen
PEOPLE = [
  dict(key="Michael-Pilman", name="Michael Pilman", first="Michael", lang="de", area="kueche", outlet="The Essence", set="k_de10", lead=True),
  dict(key="Lars", name="Lars", first="Lars", lang="de", area="kueche", outlet="Patisserie", set="k_de"),
  dict(key="Q", name="Q", first="Q", lang="th", area="kueche", outlet="Umami", set="k_th"),
  dict(key="Mirco", name="Mirco", first="Mirco", lang="de", area="kueche", outlet="Da Fortunat", set="k_de"),
  dict(key="Michael-Campigiana", name="Küche Campigiana", first=None, lang="de", area="kueche", outlet="Campigiana", set="k_de"),
  dict(key="Martin", name="Martin", first="Martin", lang="en", area="service", outlet="The Essence", set="s_en"),
  dict(key="Sybille-Laura", name="Sybille", first="Sybille", lang="de", area="service", outlet="Da Fortunat ⇄ Umami", set="s_de2", shared="Laura", days="Montag und Dienstag", odays="Mittwoch und Donnerstag"),
  dict(key="Sybille-Laura", name="Laura", first="Laura", lang="de", area="service", outlet="Da Fortunat ⇄ Umami", set="s_de2", shared="Sybille", days="Mittwoch und Donnerstag", odays="Montag und Dienstag"),
  dict(key="Andre", name="Andre", first="Andre", lang="de", area="service", outlet="Campigiana", set="s_de"),
]

# --------------------------------------------------------------------------- Texte
TX = {}
TX["de"] = dict(
  title="Praxisrapport", sub="Gebrauchsanweisung für {who}", subn="Gebrauchsanweisung · {outlet}",
  area={"kueche":"Küche","service":"Service"},
  lead="Mit dem Praxisrapport beurteilen Sie die Studierenden direkt am Posten auf dem iPad. Jede Person startet auf der Basisnote <b>5.00</b>. Sie tippen nur an, was davon abweicht. Die Noten rechnet die App sofort aus, und Sie sehen bei jedem Klick, wie er die Note verändert.",
  qr="Meine Startseite<br>mit dem iPad scannen",
  glance="Ihr Semester HS26 auf einen Blick", gcols=["Einsatz","Tage","Personen"],
  glance_note10="Pro Zyklus haben Sie <b>ein</b> Paket: 9 Einsatztage und den Exam Day.",
  glance_note54="Pro Zyklus haben Sie <b>zwei</b> Pakete: zuerst 5 Tage, danach 4 Tage + Exam Day mit anderen Studierenden. Die Startseite wechselt automatisch zum richtigen Paket.",
  s1="Einmal einrichten (5 Minuten, einmal pro Semester)",
  s1l=["Michael schickt Ihnen die Datei <b>«Semesterpaket_HS26_{key}.json»</b> per Teams. Auf dem iPad in Teams die Datei antippen, dann Teilen <span class='k'>⬆</span> → <b>«In Dateien sichern»</b>.",
       "In <b>Safari</b> die Startseite öffnen: QR-Code oben rechts mit der Kamera scannen oder <b>pilman1982.github.io/praxisrapport/mein.html</b> eintippen.",
       "<span class='k'>Semesterpaket laden</span> antippen und die Datei aus «Dateien» wählen.",
       "Teilen <span class='k'>⬆</span> → <b>«Zum Home-Bildschirm»</b> → Name «Mein Rapport» → Hinzufügen. Ab jetzt starten Sie immer über dieses Symbol."],
  s1box="Nicht im privaten Modus von Safari arbeiten und die Website-Daten nicht löschen. Die Daten bleiben nur auf diesem iPad, nichts geht ins Internet.",
  cap_mein="<b>Startseite</b><br>zeigt den aktuellen Einsatz",
  s2="Jeden Einsatztag",
  s2l=["Symbol <b>«Mein Rapport»</b> antippen → <span class='k'>Rapport öffnen</span>. Die richtige Datei mit den richtigen Personen öffnet sich. Ist heute ein Einsatztag, steht er schon oben ausgewählt.",
       "Oben den Tag prüfen: Wochentag mit Datum, z. B. «Mittwoch 30.09.». Beim ersten Mal am Tag <span class='k'>+ Tag erfassen</span> drücken. Damit sind alle anwesend und stehen auf 5.00. Team Market ist schon vorbelegt.",
       "Eine Person antippen. Im Blatt wählen Sie die <b>Anwesenheit</b> und darunter den <b>Reiter des Kriteriums</b>. Einen Baustein antippen: rot = Abzug, grün = Plus. <span class='k'>Alle Bausteine zeigen</span> öffnet die ganze Liste.",
       "<span class='k'>›</span> springt zur nächsten Person, <span class='k'>Fertig</span> schliesst das Blatt. Alles wird sofort gespeichert."],
  cap_open="<b>Tag erfassen</b><br>einmal pro Tag", cap_list="<b>Tagesliste</b><br>Note pro Person rechts", cap_sheet="<b>Erfassungsblatt</b><br>Wirkung bei jedem Baustein",
  s3="Noten sehen und verstehen",
  s3p="In der Tagesliste steht rechts die <b>Tagesnote</b>. Im Blatt sehen Sie oben «Tag» und «Ø» (Durchschnitt aller bisherigen Tage), im Reiter die Note pro Kriterium und bei jedem Baustein die Wirkung, z. B. «− mittel · −0.50». Der Knopf <span class='k'>Ø</span> oben zeigt die Übersicht mit Ø Praxis, Exam und Schlussnote. Stimmt etwas nicht, tippen Sie den Baustein einfach nochmals an: Er ist dann weg, und die Note rechnet sich neu.",
  rules=[("Basisnote","5.00 pro Kriterium. Erfasst wird nur die Abweichung."),
         ("Gewicht","leicht ± 0.25 · mittel ± 0.50 · schwer ± 1.00"),
         ("Grenze","pro Kriterium und Tag höchstens −1.50 und +1.00"),
         ("K.-o.","Ein K.-o.-Baustein setzt dieses Kriterium auf 1.0."),
         ("Doppelt","{double} zählt im Durchschnitt doppelt."),
         ("Verspätet","zählt automatisch als «Verspätet zum Dienst erschienen» (Teamfähigkeit −0.50)."),
         ("Abwesend","entschuldigt: Tag zählt nicht · unentschuldigt: Tag = 1.0 · Team Market: Tag = 5.00"),
         ("Exam Day","Jede Abwesenheit ergibt 1.0, egal aus welchem Grund."),
         ("Schlussnote","2/3 Ø Praxis + 1/3 Exam Day")],
  double={"kueche":"Hygiene","service":"Gastgeberhaltung und Gästekontakt"},
  half="Bei 5 Tagen und 4 Tagen + Exam sehen Sie in der App die Noten Ihrer Hälfte. Die definitive Schlussnote setzt die Kursleitung aus beiden Hälften zusammen.",
  legend="Farben: <span class='g1'>ab 5.25</span> über der Erwartung · <span class='g2'>4.25 bis 5.24</span> im Rahmen · <span class='g3'>unter 4.25</span> deutlich darunter",
  cap_grades="<b>Notenübersicht</b><br>Knopf Ø oben",
  s4="Am Ende des Einsatztags",
  s4l=["<span class='k'>⬆ Tag teilen</span> → <b>Teams</b> → an <b>Michael Pilman</b> senden. Das ist Ihre Sicherung und die Grundlage für die Noten.",
       "<span class='k'>✉ Absenzen</span> öffnet eine fertige Mail an die Kursleitung. Nur noch senden."],
  s4box="Täglich teilen. Geht das iPad verloren oder wird der Verlauf gelöscht, sind nur die geteilten Tage gesichert.",
  s5="Neuer Zyklus",
  s5p="Sie müssen nichts tun. Die Startseite zeigt immer den aktuellen Einsatz unter «Jetzt», danach «Als Nächstes». Öffnen Sie ein neues Paket, obwohl in derselben Datei noch Tage vom letzten Paket liegen, fragt die App zuerst nach. Haben Sie die Tage geteilt, bestätigen Sie mit OK.",
  s6="Wenn etwas nicht klappt",
  faq=[("Falsche Personen oder alter Zyklus","Startseite öffnen und in der Liste «Alle Einsätze im Semester» den richtigen Einsatz antippen."),
       ("Foto fehlt","Statt des Fotos stehen die Initialen. Schickt Michael ein neues Semesterpaket: «Anderes Semesterpaket laden» und den Rapport öffnen. Fotos erscheinen, Erfasstes bleibt."),
       ("Person fehlt oder ist zu viel","Michael Bescheid geben. Sie bekommen ein neues Semesterpaket, eingetragene Tage bleiben erhalten."),
       ("Sprache ändern","Knopf <span class='k'>文</span> oben rechts."),
       ("Neues iPad","Einrichten wie oben. Bereits erfasste Tage liegen bei Michael, weil Sie sie geteilt haben.")],
  contact="Fragen: Michael Pilman · michael.pilman@ehl.ch",
  foot="EHL Hotelfachschule Passugg · Praxisrapport Noten 2.0 · Stand {date} · Die Bildschirmfotos zeigen erfundene Namen.",
  shared="<b>Geteiltes iPad mit {other}.</b> Sie arbeiten am {days}, {other} am {odays}. Die App trägt die richtige Person als Dozent/in automatisch pro Tag ein. Sie müssen nichts umstellen.",
  switch="<b>Zwei Restaurants.</b> Bei jeder Person steht oben im Blatt das Restaurant des Tages, z. B. <span class='k'>⇄ Umami</span>. Es ist aus dem Einsatzplan vorbelegt. Arbeitet jemand ausnahmsweise im anderen Restaurant, tippen Sie den Knopf an. Das Restaurant erscheint später im Rapport und in der Absenzmeldung.",
  campi="Ihr voller Name fehlt noch im Plan. Bitte Michael mitteilen, dann erscheint er im Rapport.",
  L1="Kursleitung: Semester vorbereiten und abschliessen",
  L1l=["<b>Cockpit</b> öffnen: pilman1982.github.io/praxisrapport/cockpit.html (am Laptop).",
       "<b>1 · Turnusplan laden</b>: turnusplan_HS26.json wählen.",
       "<b>2 · Fotos</b>: die Foto-PDFs aller Klassen (HFd, HFe1, HFe2) hineinziehen. Ziel: «71 von 71».",
       "<b>3 · Prüfung</b> durchsehen. Rote Meldungen zuerst klären.",
       "<b>Semesterpakete pro Person (ZIP)</b> drücken. Jede Person bekommt ihre Datei per Teams, dazu den Link aus «Startseiten.txt».",
       "Planänderung oder neue Fotos: neu erzeugen und nur den Betroffenen schicken. In der App bleiben erfasste Tage erhalten, neue Personen und Fotos werden ergänzt."],
  L2="Während des Zyklus",
  L2l=["Tag-Dateien aus Teams in <b>03 Rapporte</b> ablegen.",
       "<b>6 · Eingangskontrolle</b> im Cockpit: Dateien hineinziehen. Sie sehen, wer welche Tage geschickt hat."],
  L3="Am Zyklusende",
  L3l=["Laptop-Datei 9 Tage + Exam öffnen (Kuechenrapport.html bzw. Servicerapport.html).",
       "<b>Daten → Rapporte zusammenführen</b>: alle Tag-Dateien des Zyklus wählen. 5 Tage landen auf Tag 1 bis 5, 4 Tage + Exam auf Tag 6 bis 10.",
       "Beurteilungen prüfen, Excel nach <b>04 Auswertung</b> exportieren, Notentabelle per Knopf an sich selbst schicken."],
  cap_cockpit="Cockpit Kursleitung mit Semesterpaketen (Beispieldaten)",
)
TX["en"] = dict(
  title="Practical Report", sub="User guide for {who}", subn="User guide · {outlet}",
  area={"kueche":"Kitchen","service":"Service"},
  lead="With the practical report you assess the students right at their station on the iPad. Everyone starts at the baseline grade <b>5.00</b>. You only tap what differs from it. The app calculates the grades immediately, and with every tap you see how it changes the grade.",
  qr="My start page<br>scan with the iPad",
  glance="Your semester HS26 at a glance", gcols=["Assignment","Dates","Students"],
  glance_note10="Per cycle you have <b>one</b> package: 9 shift days and the Exam Day.",
  glance_note54="Per cycle you have <b>two</b> packages: first 5 days, then 4 days + Exam Day with other students. The start page switches to the right package automatically.",
  s1="Set up once (5 minutes, once per semester)",
  s1l=["Michael sends you the file <b>«Semesterpaket_HS26_{key}.json»</b> via Teams. On the iPad, tap the file in Teams, then Share <span class='k'>⬆</span> → <b>«Save to Files»</b>.",
       "Open the start page in <b>Safari</b>: scan the QR code at the top right with the camera, or type <b>pilman1982.github.io/praxisrapport/mein.html</b>.",
       "Tap <span class='k'>Load semester package</span> and choose the file from «Files».",
       "Share <span class='k'>⬆</span> → <b>«Add to Home Screen»</b> → name it «My report» → Add. From now on, always start with this icon."],
  s1box="Do not use Safari's private mode and do not clear website data. The data stays on this iPad only; nothing is sent to the internet.",
  cap_mein="<b>Start page</b><br>shows the current assignment",
  s2="Every shift day",
  s2l=["Tap the <b>«My report»</b> icon → <span class='k'>Open report</span>. The right file with the right students opens. If today is a shift day, it is already selected at the top.",
       "Check the day at the top: weekday with date, e.g. «Wednesday 30.09.». The first time each day, tap <span class='k'>+ Open this day</span>. Everyone is then present at 5.00. Team Market is already preset.",
       "Tap a student. In the sheet, choose <b>attendance</b> and below it the <b>criterion tab</b>. Tap a building block: red = deduction, green = plus. <span class='k'>Show all building blocks</span> opens the full list.",
       "<span class='k'>›</span> goes to the next student, <span class='k'>Done</span> closes the sheet. Everything is saved immediately."],
  cap_open="<b>Open this day</b><br>once per day", cap_list="<b>Day list</b><br>grade per student on the right", cap_sheet="<b>Recording sheet</b><br>effect shown for each block",
  s3="Seeing and understanding the grades",
  s3p="The day list shows the <b>day grade</b> on the right. At the top of the sheet you see «Day» and «Ø» (average of all days so far), the grade per criterion in each tab, and the effect of every block, e.g. «− medium · −0.50». The <span class='k'>Ø</span> button at the top shows the overview with Ø practice, exam and final grade. If something is wrong, simply tap the block again: it is removed and the grade is recalculated.",
  rules=[("Baseline","5.00 per criterion. Only deviations are recorded."),
         ("Weight","light ± 0.25 · medium ± 0.50 · heavy ± 1.00"),
         ("Limit","per criterion and day at most −1.50 and +1.00"),
         ("K.O.","A K.O. block sets this criterion to 1.0."),
         ("Double","{double} counts double in the average."),
         ("Late","automatically counts as «Arrived late for the shift» (Teamwork −0.50)."),
         ("Absent","excused: day does not count · unexcused: day = 1.0 · Team Market: day = 5.00"),
         ("Exam Day","Any absence gives 1.0, whatever the reason."),
         ("Final grade","2/3 Ø practice + 1/3 Exam Day")],
  double={"kueche":"Hygiene","service":"Host attitude and guest contact"},
  half="With 5 days and 4 days + exam, the app shows the grades of your half. The course lead combines both halves into the final grade.",
  legend="Colours: <span class='g1'>5.25 and above</span> above expectations · <span class='g2'>4.25 to 5.24</span> as expected · <span class='g3'>below 4.25</span> clearly below",
  cap_grades="<b>Grade overview</b><br>Ø button at the top",
  s4="At the end of the shift day",
  s4l=["<span class='k'>⬆ Share the day</span> → <b>Teams</b> → send to <b>Michael Pilman</b>. This is your backup and the basis for the grades.",
       "<span class='k'>✉ Absences</span> opens a ready-made e-mail to the course lead. Just send it."],
  s4box="Share every day. If the iPad is lost or the history is cleared, only the shared days are safe.",
  s5="New cycle",
  s5p="You do not need to do anything. The start page always shows the current assignment under «Now», then «Next». If you open a new package while the same file still holds days from the previous package, the app asks first. If you have shared those days, confirm with OK.",
  s6="If something does not work",
  faq=[("Wrong students or old cycle","Open the start page and tap the right assignment in the list «All assignments this semester»."),
       ("Photo missing","Initials are shown instead. When Michael sends a new semester package: «Load another semester package», then open the report. Photos appear, recorded data stays."),
       ("Student missing or extra","Tell Michael. You will get a new semester package; recorded days are kept."),
       ("Change language","Button <span class='k'>文</span> at the top right."),
       ("New iPad","Set up as above. Days already recorded are with Michael because you shared them.")],
  contact="Questions: Michael Pilman · michael.pilman@ehl.ch",
  foot="EHL Hotelfachschule Passugg · Practical report Noten 2.0 · as of {date} · Screenshots show invented names.",
)
TX["th"] = dict(
  title="รายงานภาคปฏิบัติ", sub="คู่มือการใช้งานสำหรับ {who}", subn="คู่มือการใช้งาน · {outlet}",
  area={"kueche":"ครัว","service":"บริการ"},
  lead="รายงานภาคปฏิบัติใช้ประเมินนักศึกษาที่จุดทำงานโดยตรงบน iPad ทุกคนเริ่มต้นที่คะแนนพื้นฐาน <b>5.00</b> คุณแตะเฉพาะสิ่งที่แตกต่างจากที่คาดหวัง แอปจะคำนวณคะแนนทันที และทุกครั้งที่แตะ คุณจะเห็นว่าคะแนนเปลี่ยนไปอย่างไร",
  qr="หน้าเริ่มต้นของฉัน<br>สแกนด้วย iPad",
  glance="ภาคเรียน HS26 ของคุณโดยสรุป", gcols=["การฝึก","วันที่","จำนวนนักศึกษา"],
  glance_note10="ในแต่ละ Zyklus คุณมีชุดข้อมูล <b>หนึ่ง</b> ชุด: 9 วันทำงานและวันสอบ",
  glance_note54="ในแต่ละ Zyklus คุณมีชุดข้อมูล <b>สอง</b> ชุด: 5 วันแรก แล้วตามด้วย 4 วัน + วันสอบ กับนักศึกษากลุ่มอื่น หน้าเริ่มต้นจะเปลี่ยนไปยังชุดที่ถูกต้องให้อัตโนมัติ",
  s1="ตั้งค่าครั้งเดียว (5 นาที ครั้งเดียวต่อภาคเรียน)",
  s1l=["Michael จะส่งไฟล์ <b>«Semesterpaket_HS26_{key}.json»</b> ให้ทาง Teams บน iPad ให้แตะไฟล์ใน Teams แล้วแตะ แชร์ <span class='k'>⬆</span> → <b>«บันทึกไปยังแอปไฟล์»</b>",
       "เปิดหน้าเริ่มต้นใน <b>Safari</b>: สแกน QR code มุมขวาบนด้วยกล้อง หรือพิมพ์ <b>pilman1982.github.io/praxisrapport/mein.html</b>",
       "แตะ <span class='k'>โหลดชุดข้อมูลภาคเรียน</span> แล้วเลือกไฟล์จาก «ไฟล์»",
       "แตะ แชร์ <span class='k'>⬆</span> → <b>«เพิ่มไปยังหน้าจอโฮม»</b> → ตั้งชื่อ «รายงานของฉัน» → เพิ่ม ต่อจากนี้ให้เริ่มจากไอคอนนี้ทุกครั้ง"],
  s1box="อย่าใช้โหมดส่วนตัวของ Safari และอย่าลบข้อมูลเว็บไซต์ ข้อมูลอยู่บน iPad เครื่องนี้เท่านั้น ไม่มีการส่งขึ้นอินเทอร์เน็ต",
  cap_mein="<b>หน้าเริ่มต้น</b><br>แสดงการฝึกปัจจุบัน",
  s2="ทุกวันที่มีการฝึก",
  s2l=["แตะไอคอน <b>«รายงานของฉัน»</b> → <span class='k'>เปิดรายงาน</span> ไฟล์ที่ถูกต้องพร้อมรายชื่อนักศึกษาที่ถูกต้องจะเปิดขึ้น ถ้าวันนี้เป็นวันฝึก วันนั้นจะถูกเลือกไว้ด้านบนแล้ว",
       "ตรวจสอบวันด้านบน: ชื่อวันพร้อมวันที่ เช่น «วันพุธ 30.09.» ครั้งแรกของวันให้แตะ <span class='k'>+ เปิดบันทึกวันนี้</span> ทุกคนจะมาเรียนและอยู่ที่ 5.00 Team Market ถูกกำหนดไว้ล่วงหน้าแล้ว",
       "แตะชื่อนักศึกษา ในหน้าบันทึกให้เลือก <b>การเข้าเรียน</b> และด้านล่างเลือก <b>แท็บของเกณฑ์</b> แตะข้อสังเกต: สีแดง = หักคะแนน สีเขียว = เพิ่มคะแนน <span class='k'>แสดงข้อความทั้งหมด</span> เปิดรายการทั้งหมด",
       "<span class='k'>›</span> ไปยังคนถัดไป <span class='k'>เสร็จ</span> ปิดหน้าบันทึก ทุกอย่างบันทึกทันที"],
  cap_open="<b>เปิดบันทึกวันนี้</b><br>วันละครั้ง", cap_list="<b>รายชื่อประจำวัน</b><br>คะแนนของแต่ละคนอยู่ด้านขวา", cap_sheet="<b>หน้าบันทึก</b><br>แสดงผลของข้อสังเกตแต่ละข้อ",
  s3="ดูและเข้าใจคะแนน",
  s3p="ในรายชื่อประจำวัน ด้านขวาคือ <b>คะแนนของวัน</b> ด้านบนของหน้าบันทึกจะเห็น «วันนี้» และ «Ø» (ค่าเฉลี่ยของทุกวันที่ผ่านมา) ในแต่ละแท็บจะเห็นคะแนนของเกณฑ์ และที่ข้อสังเกตแต่ละข้อจะเห็นผลต่อคะแนน เช่น «− กลาง · −0.50» ปุ่ม <span class='k'>Ø</span> ด้านบนแสดงภาพรวม: เฉลี่ยภาคปฏิบัติ สอบ และคะแนนรวม ถ้าบันทึกผิด ให้แตะข้อสังเกตนั้นอีกครั้ง ข้อสังเกตจะหายไปและคะแนนคำนวณใหม่",
  rules=[("คะแนนพื้นฐาน","5.00 ต่อเกณฑ์ บันทึกเฉพาะส่วนที่แตกต่าง"),
         ("น้ำหนัก","เบา ± 0.25 · กลาง ± 0.50 · หนัก ± 1.00"),
         ("ขีดจำกัด","ต่อเกณฑ์ต่อวัน ไม่เกิน −1.50 และ +1.00"),
         ("K.-o.","ข้อสังเกตแบบ K.-o. ทำให้เกณฑ์นั้นเป็น 1.0"),
         ("สองเท่า","{double} นับสองเท่าในค่าเฉลี่ย"),
         ("มาสาย","นับอัตโนมัติเป็น «มาทำงานสาย» (การทำงานเป็นทีม −0.50)"),
         ("ไม่มา","ลา (แจ้งแล้ว): วันนั้นไม่นับ · ขาด (ไม่แจ้ง): วันนั้น = 1.0 · Team Market: วันนั้น = 5.00"),
         ("วันสอบ","ไม่มาไม่ว่าด้วยเหตุผลใด ได้ 1.0"),
         ("คะแนนรวม","2/3 เฉลี่ยภาคปฏิบัติ + 1/3 วันสอบ")],
  double={"kueche":"สุขอนามัย","service":"ความเป็นเจ้าบ้านและการดูแลแขก"},
  half="สำหรับ 5 วัน และ 4 วัน + สอบ แอปจะแสดงคะแนนของช่วงที่คุณสอน คะแนนรวมสุดท้ายผู้รับผิดชอบหลักสูตรจะรวมจากทั้งสองช่วง",
  legend="สี: <span class='g1'>ตั้งแต่ 5.25</span> ดีกว่าที่คาดหวัง · <span class='g2'>4.25 ถึง 5.24</span> ตามที่คาดหวัง · <span class='g3'>ต่ำกว่า 4.25</span> ต่ำกว่าอย่างชัดเจน",
  cap_grades="<b>ภาพรวมคะแนน</b><br>ปุ่ม Ø ด้านบน",
  s4="เมื่อจบวันฝึก",
  s4l=["<span class='k'>⬆ แชร์ข้อมูลของวันนี้</span> → <b>Teams</b> → ส่งถึง <b>Michael Pilman</b> นี่คือข้อมูลสำรองของคุณและเป็นพื้นฐานของคะแนน",
       "<span class='k'>✉ การขาด</span> เปิดอีเมลที่เขียนไว้แล้วถึงผู้รับผิดชอบหลักสูตร เพียงกดส่ง"],
  s4box="แชร์ทุกวัน ถ้า iPad หายหรือประวัติถูกลบ จะเหลือเฉพาะวันที่แชร์แล้วเท่านั้น",
  s5="Zyklus ใหม่",
  s5p="คุณไม่ต้องทำอะไร หน้าเริ่มต้นจะแสดงการฝึกปัจจุบันใต้ «ตอนนี้» และถัดไปใต้ «ถัดไป» ถ้าเปิดชุดข้อมูลใหม่ในขณะที่ไฟล์เดียวกันยังมีวันจากชุดก่อนหน้า แอปจะถามก่อน ถ้าคุณแชร์วันเหล่านั้นแล้ว ให้กด OK",
  s6="ถ้ามีปัญหา",
  faq=[("นักศึกษาไม่ถูกต้อง หรือเป็น Zyklus เก่า","เปิดหน้าเริ่มต้น แล้วแตะการฝึกที่ถูกต้องในรายการ «การฝึกทั้งหมดในภาคเรียน»"),
       ("ไม่มีรูปถ่าย","จะแสดงอักษรย่อแทน เมื่อ Michael ส่งชุดข้อมูลภาคเรียนใหม่: «โหลดชุดข้อมูลภาคเรียนอื่น» แล้วเปิดรายงาน รูปจะปรากฏ ข้อมูลที่บันทึกไว้ยังอยู่"),
       ("ขาดนักศึกษาหรือมีเกิน","แจ้ง Michael คุณจะได้รับชุดข้อมูลภาคเรียนใหม่ วันที่บันทึกไว้ยังอยู่"),
       ("เปลี่ยนภาษา","ปุ่ม <span class='k'>文</span> มุมขวาบน"),
       ("iPad เครื่องใหม่","ตั้งค่าตามข้างบน วันที่บันทึกแล้วอยู่ที่ Michael เพราะคุณแชร์ไว้แล้ว")],
  contact="สอบถาม: Michael Pilman · michael.pilman@ehl.ch",
  foot="EHL Hotelfachschule Passugg · Praxisrapport Noten 2.0 · ฉบับวันที่ {date} · ภาพหน้าจอใช้ชื่อสมมติ",
)

def schedule(key, lang):
    d = json.loads(SEM.read("Semesterpaket_HS26_%s.json" % key))
    today = datetime.date.today().isoformat(); rows = []; nxt = None
    for p in d["pakete"]:
        if nxt is None and p["bis"] >= today: nxt = p["id"]
    for p in d["pakete"]:
        t = p["titel"].rsplit(" · ", 1)[0]
        rows.append("<tr%s><td>%s</td><td class='c'>%s – %s</td><td class='c'>%d</td></tr>" % (" class='now'" if p["id"] == nxt else "", H.escape(t), dmy(p["von"]), dmy(p["bis"]), p["personen"]))
    return rows, d

def guide(P):
    X = TX[P["lang"]]; s = P["set"]; area = P["area"]
    rows, d = schedule(P["key"], P["lang"])
    has10 = any(p["variante"] == "10T" for p in d["pakete"])
    who = P["name"]
    sub = X["sub"].format(who=who + " · " + X["area"][area] + " " + P["outlet"]) if P["first"] else X["subn"].format(outlet=X["area"][area] + " " + P["outlet"])
    url = BASE + "mein.html#lang=" + P["lang"]
    li = lambda arr: "".join("<li>%s</li>" % x.format(key=P["key"]) for x in arr)
    shot = lambda f, cap: "<div class='shot'><img src='%s'>%s</div>" % (img(f), cap)
    extra = ""
    if P.get("shared"): extra += "<div class='box'><p>%s</p></div>" % TX["de"]["shared"].format(other=P["shared"], days=P["days"], odays=P["odays"])
    if "⇄" in P["outlet"]: extra += "<div class='box'><p>%s</p></div>" % TX["de"]["switch"]
    if P["key"] == "Michael-Campigiana": extra += "<div class='box warn'><p>%s</p></div>" % TX["de"]["campi"]
    rules = "".join("<tr><td style='width:28mm'><b>%s</b></td><td>%s</td></tr>" % (a, b.format(double=X["double"][area])) for a, b in X["rules"])
    faq = "".join("<tr><td style='width:45mm'><b>%s</b></td><td>%s</td></tr>" % (a, b) for a, b in X["faq"])
    lead_block = ""
    if P.get("lead"):
        T = TX["de"]
        lead_block = f"""<div class="pb"></div><h2><span class="n">7</span>{T['L1']}</h2><ol>{li(T['L1l'])}</ol>
<div class="wide avoid"><img src="{img('cockpit.png')}"><div class="shot" style="margin-top:1mm">{T['cap_cockpit']}</div></div>
<h2><span class="n">8</span>{T['L2']}</h2><ol>{li(T['L2l'])}</ol>
<h2><span class="n">9</span>{T['L3']}</h2><ol>{li(T['L3l'])}</ol>"""
    body = f"""
<img class="logo" src="{LOGO}">
<div class="head"><div class="l"><h1>{X['title']}</h1><div class="sub">{H.escape(sub)}</div>
<p class="lead">{X['lead']}</p></div>
<div class="qr"><img src="{qr(url)}">{X['qr']}</div></div>
<hr class="rule">
{extra}
<div class="avoid"><h2 style="margin-top:2mm">{X['glance']}</h2>
<p>{X['glance_note10'] if has10 else X['glance_note54']}</p>
<table class='sched'><tr><th>{X['gcols'][0]}</th><th>{X['gcols'][1]}</th><th>{X['gcols'][2]}</th></tr>{''.join(rows)}</table></div>

<h2><span class="n">1</span>{X['s1']}</h2>
<div class="fr">{shot(s+'_1_mein.png', X['cap_mein'])}</div><ol>{li(X['s1l'])}</ol><div class="box warn"><p>{X['s1box']}</p></div><div style="clear:both"></div>

<div class="avoid"><h2><span class="n">2</span>{X['s2']}</h2>
<ol>{li(X['s2l'])}</ol></div>
<div class="shots">{shot(s+'_2_open.png', X['cap_open'])}{shot(s+'_3_tag.png', X['cap_list'])}{shot(s+'_4_blatt.png', X['cap_sheet'])}{shot(s+'_5_noten.png', X['cap_grades'])}</div>

<h2><span class="n">3</span>{X['s3']}</h2>
<div><p>{X['s3p']}</p>
<table>{rules}</table>
<p class="legend">{X['legend']}</p>
{'' if has10 else "<div class='box'><p>"+X['half']+"</p></div>"}</div><div style="clear:both"></div>

<h2><span class="n">4</span>{X['s4']}</h2>
<ol>{li(X['s4l'])}</ol>
<div class="box warn"><p>{X['s4box']}</p></div>

<h2><span class="n">5</span>{X['s5']}</h2>
<p>{X['s5p']}</p>

<div class="avoid"><h2><span class="n">6</span>{X['s6']}</h2>
<table>{faq}</table>
<p><b>{X['contact']}</b></p></div>
{lead_block}
<div class="foot">{X['foot'].format(date=datetime.date.today().strftime('%d.%m.%Y'))}</div>
"""
    return f"<!doctype html><html lang='{P['lang']}'><head><meta charset='utf-8'><style>{CSS}</style></head><body class='{P['lang']}'>{body}</body></html>"

NAMES = {"de":"Anleitung_Praxisrapport_{n}.pdf","en":"Guide_Practical_Report_{n}.pdf","th":"Guide_Praxisrapport_TH_{n}.pdf"}
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page()
    for P in PEOPLE:
        h = guide(P); f = G / ("g_" + P["name"].replace(" ", "_") + ".html"); f.write_text(h, encoding="utf-8")
        pg.goto(f.as_uri()); pg.wait_for_timeout(500)
        nm = P["name"].replace(" ", "-").replace("ü", "ue")
        out = OUT / NAMES[P["lang"]].format(n=nm)
        pg.pdf(path=str(out), format="A4", print_background=True, margin={"top":"14mm","bottom":"13mm","left":"15mm","right":"15mm"})
        print(out.name)
    b.close()
