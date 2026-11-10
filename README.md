# Daily Grades (Praxisrapport)

Praxisbeurteilung Küche und Service an der EHL Hotelfachschule Passugg.
Web-App ohne Installation: läuft im Browser auf Windows, iPhone, iPad und Android.

**Grundsatz: Das Programm ist online, die Daten bleiben auf dem Gerät.**
Dieses Repository enthält nur Programmcode und erfundene Testdaten.
Es werden nie Daten von Studierenden hier abgelegt (siehe `.gitignore`).

## Adressen (GitHub Pages)

| Seite | Zweck |
|---|---|
| `/` | Startseite mit allen Programmen |
| `/cockpit.html` | Cockpit Kursleitung: Turnusplan prüfen, Fotos zuordnen, Pakete pro Outlet, Eingangskontrolle |
| `/notenzentrale.html` | Notenzentrale Kursleitung: liest den Ordner mit allen JSON-Rapporten, zeigt Noten, Beobachtungen, Absenzen und Kontrolle, Excel für die Notensoftware |
| `/startlink.html` | Persönliche Startlinks für Dozierende erzeugen (Sprache, Outlet, Name, Wochentagsplan) |
| `/kueche/…` | Küchenrapport (Laptop und Mobil, 10T / 4T / 5T) |
| `/service/…` | Servicerapport (Laptop und Mobil, 10T / 4T / 5T) |

## Startlink

`…/kueche/Kuechenrapport_Mobil.html#lang=th&outlet=Umami&dozent=Q`

| Schlüssel | Wirkung |
|---|---|
| `lang` | Sprache der Oberfläche: `de`, `en`, `th` |
| `outlet`, `dozent` | Vorbelegung im Setup |
| `outlet2` | Service: zweites Restaurant, aktiviert den Umschalter pro Person und Tag |
| `klasse`, `gruppe` | Vorgabe für Klasse (`HFD`, `HFE1`, `HFE2`) und Gruppe |
| `plan` | Geteiltes Gerät: `plan=mo:Name,tu:Name,we:Name,th:Name` setzt pro Einsatztag die bewertende Person |

Alles nach `#` bleibt im Browser und wird nie an einen Server übertragen.

## Turnusplan (Austauschformat Copilot → Cockpit)

```json
{"format":"praxisrapport-turnusplan","version":1,"semester":"HS26","bezeichnung":"Turnus 3",
 "wochentage":["mo","tu","we","th"],
 "dozierende":[{"name":"…","bereich":"kueche|service","outlets":["…"],"sprache":"de|en|th","plan":{"mo":"…"}}],
 "studierende":[{"nr":"…","nachname":"…","vorname":"…","nickname":"","email":"","klasse":"HFD|HFE1|HFE2",
   "gruppe":"Gruppe 1","sprache":"de|en|zh",
   "einsaetze":[{"bereich":"kueche|patisserie|service","outlet":"…","von":"JJJJ-MM-TT","bis":"JJJJ-MM-TT",
                 "variante":"10T|4T|5T","wechsel":{"outlet":"…","ab":"JJJJ-MM-TT"}}]}]}
```

Beispiel mit erfundenen Daten: `testdaten/turnusplan_BEISPIEL.json`, Foto-PDF: `testdaten/Fotoliste_BEISPIEL.pdf`.
Das Cockpit erzeugt daraus Pakete im Sicherungsformat der Apps (Laden mit «Sicherung laden» / «Sicherung einlesen»).

## Aufbau

```
src/kueche/   Bauteile Küchenrapport (Bausteine in _chips.js)
src/service/  Bauteile Servicerapport (Bausteine und Klassenliste in _chips.js)
site/         Startseite und Startlink-Generator
docs/         fertige Webseite, wird von GitHub Pages veröffentlicht (nicht von Hand ändern)
tests/        automatische Prüfungen (Playwright)
testdaten/    erfundene Testklasse
```

## Ändern und veröffentlichen

```
python3 build.py                    # baut docs/
python3 tests/test_harmonize.py     # Namensliste, Klassen, Meldezeile
python3 tests/test_merge.py         # Zusammenführen
python3 tests/test_startlink.py     # Startlinks
python3 tests/test_halbturnus.py    # 5T + 4T in die 10T-Datei
python3 tests/test_wechsel.py       # Service: Restaurantwechsel
python3 tests/test_cockpit.py       # Cockpit: Plan, Fotos, Pakete, Eingangskontrolle
python3 tests/test_altdaten.py      # Rapporte aus dem Pilot (alte Programme vom 05.10.2026 liegen in testdaten/alt/)
python3 tests/test_daily_grades.py  # Rückmeldungen Pilot 08.10.2026 (Schichten, OC, Verspätung, Nickname, Zusammenfassung)
python3 tests/test_regeln_2026_10_11.py  # Basis 4.50, Team Market verspätet 4.00, Sie-Form
python3 tests/test_notenzentrale.py      # Regeln 31.10.2026 (6.00 erreichbar, Hygiene fest doppelt), Notenzentrale = gleiche Noten wie die Apps
python3 tests/test_fixes_kueche.py       # Fehlerkorrekturen 31.10.2026 Küche Laptop
python3 tests/test_fixes_service.py      # Fehlerkorrekturen 31.10.2026 Service Laptop
python3 tests/test_fixes_mobil.py        # Fehlerkorrekturen 31.10.2026 Mobil und Startseite
python3 tests/test_abnahme_2026_10_31.py # Befunde der unabhängigen Abnahme 31.10.2026
python3 tests/test_fuzz_notenmodell.py   # Zufallsprüfung: Tablet, Laptop und Notenzentrale rechnen gleich (alle 6 Varianten)
python3 tests/test_audit_2026_11_10.py   # Audit 10.11.2026: Befunde und Störfestigkeit (beschädigte Dateien in allen Seiten)
git commit -am "…" && git push      # GitHub Pages aktualisiert sich in 1 bis 2 Minuten
```

Ohne Internet (CDN gesperrt) brauchen einige Tests lokale Bibliotheken, die nicht im Repository liegen (`tests/.cache/`, siehe `.gitignore`):
SheetJS 0.18.5 als `tests/.cache/xlsx.full.min.js` (oder Umgebungsvariable `DG_XLSX`), pdfjs-dist 3.11.174 und jszip 3.10.1 unter
`tests/.cache/node_modules/` (oder `DG_LIBS`). Holen mit `npm pack xlsx@0.18.5 pdfjs-dist@3.11.174 jszip@3.10.1` und entpacken.

Feste Regeln (Basisnote 4.50, Verspätung startet eine Note tiefer bei 3.50, Team Market und OC zählen 5.00, Team Market verspätet 4.00,
Gewichte, Exam Day, 2/3 Praxis + 1/3 Exam) stehen in `src/*/LIESMICH.txt` und werden nicht über die Oberfläche geändert.

## Fahrplan Noten 2.0

1. Okt. 2026: Küche und Service harmonisiert, Startlinks, Veröffentlichung ✓
2. Okt.: Cockpit Kursleitung (Turnusplan, Fotos, Pakete pro Outlet, Eingangskontrolle) ✓, Fotos und Nicknames in den Apps ✓
2b. Nov.: Durchmischung (Einteilungsvorschlag), Live-Übersicht prüfen
3. Nov.: Testlauf mit den Outlets
4. Dez.: zweiter Testlauf, Kriterien pro Outlet, Anleitungen DE/EN/TH
5. Jan. 2027: Go-live

## Rückmeldungen aus dem Pilot (08.10.2026)

- Name **Daily Grades**, Logo DG (`src/_brand/`), wird beim Bauen in alle Seiten eingesetzt.
- Schicht-Kürzel aus dem Duty Plan pro Einsatztag (`tage[].schicht` im Turnusplan → `schichtPlan` im Paket), Anzeige neben dem Namen.
- OC (Office und Daily MeP) zählt wie Team Market (5.00), wird im Cockpit als Team-Market-Tag vorbelegt.
- Verspätet: der Tag startet eine Note tiefer (4.00 statt 5.00), kein automatischer Baustein mehr.
- Kriterien im Tablet-Blatt als Raster, ohne seitliches Scrollen. Freitext wird beim Schliessen immer gespeichert.
- Nickname im Blatt eintragen (✎); das Cockpit sammelt neue Nicknames aus den Rapporten und übernimmt sie in den Turnusplan.
- Zusammenfassung an die Kursleitung nach dem Exam (Ø 9 Tage + Exam, Ø 5 Tage, Ø 4 Tage + Exam).
- Service immer 9 Tage + Exam in derselben Abteilung (Umami und Da Fortunat = eine Abteilung); 5 + 4 Tage nur noch in der Küche (ausser The Essence).
- Feedback-Mail vom geteilten Gerät: beide unterschreiben («Anna Muster und Berta Beispiel»).
- Knopf ⌂ zurück zur persönlichen Startseite (mein.html).

## Regeln ab 11.10.2026

- **Basisnote 4.50** («erfüllt die Erwartungen») in Küche und Service, Laptop und Mobil. Fest eingebaut:
  auch ältere Dateien und Sicherungen mit 5.00 rechnen beim nächsten Öffnen mit 4.50 (die Auswahl am Laptop ist gesperrt).
- **Verspätet**: der Tag startet eine Note tiefer, 3.50.
- **Team Market und OC**: fester Tag mit 5.00; **verspätet** 4.00. Bedienung: «Team Market» und «Verspätet» antippen
  (beide Knöpfe aktiv). Gespeichert als Anwesenheit `tml`; zählt in Meldung, Zusammenfassung und Excel als Verspätung.
- Farben: grün ab 4.75 (über der Erwartung), rot unter 4.00 (ungenügend). Schlusssätze in Mail und Beurteilung
  relativ zur Basis (ab 4.75, ab 4.25, ab 4.00, darunter).
- **Sie-Form**: Feedback-Mail Deutsch «Guten Tag Vorname» mit Sie, «Freundliche Grüsse»; Englisch «Dear …».
  Auch die Beurteilung am Laptop und die Massnahmentexte (Tipps) der Service-Bausteine sind in der Sie-Form.

## Regeln ab 31.10.2026

- **6.00 in jedem Kriterium erreichbar**: Kappung pro Tag und Kriterium −1.50 / **+1.50** (vorher +1.00, also bei Basis 4.50 höchstens 5.50).
  Spanne 3.00 bis 6.00, K.-o. bleibt 1.00. Verspätet: Start 3.50, höchstens 5.00.
- **Plus-Bausteine mindestens 0.50** (vorher teils 0.25): drei Plus-Beobachtungen im gleichen Kriterium ergeben 6.00.
  Minus-Bausteine unverändert (0.25, 0.50, 1.00).
- Neue Soft-Skill-Bausteine (Plus, 0.50): Küche `hyg-p5` Listen lückenlos geführt, `tea-p5` freundlich und respektvoll,
  `tea-p6` kommuniziert klar, `sel-p5` nimmt Feedback an; Service `gas-p6` persönlich und herzlich betreut,
  `tea-p6` freundlich und respektvoll, `tea-p7` Kritik angenommen und umgesetzt.
- **Doppelt gewichtet, fest** (nicht mehr abschaltbar): Küche Hygiene; Service Gastgeberhaltung **und** Hygiene.
  Steht in `DOUBLE_CRITS` (src/kueche/_scriptA.js, src/service/_scriptA.js und src/service/_mobile_head.html; `build.py` prüft, dass Service-Laptop und -Mobil gleich sind).
- Noten werden nie gespeichert, sondern immer aus den Beobachtungen gerechnet: die Regeln gelten sofort für alle Dateien, auch für bereits erfasste Tage.

## Notenzentrale (Kursleitung)

`site/notenzentrale.html` liest alle Rapport-Dateien («Tag senden», «Sichern») aus einem Ordner, führt sie pro Paket zusammen
(pro Tag und Person gewinnt die neuere Datei, ältere ergänzen nur Fehlendes) und rechnet mit dem Notenmodell der Apps:
`build.py` setzt Kappung, Doppelgewichtung, Kriterien und Bausteine aus `src/kueche` und `src/service` unverändert ein.
Küche 5T + 4T im gleichen Zyklus = ein Einsatz (Ø 9 Tage, Exam, Schlussnote). Zyklus und Semester kommen aus dem Paket
(`settings.block`, `settings.semester`, seit 31.10.2026), sonst aus der Paket-ID bzw. dem Datum. Ansichten: Übersicht, Pakete,
Person, Absenzen, Kontrolle, Dateien. Export: Excel (Schlussnoten, Pakete, Tagesnoten Küche und Service, Absenzen) oder CSV.
Die Seite speichert keine Daten; in Chrome und Edge merkt sie sich nur den gewählten Ordner, um ihn mit einem Klick neu einzulesen.

## Fehlerkorrekturen 31.10.2026 (Prüfung aller Apps)

- Service Laptop: «Tag senden» brach ab, sobald jemand verspätet oder abwesend war.
- Rundung auf 0.1 immer «halb auf» mit kleinem Zuschlag (x.x5 aus einer Rechnung wurde teils abgerundet); Farbe, Prädikat und Schlusssatz folgen der angezeigten Note.
- Schlussnote nur, wenn Praxis und Exam vorliegen (Laptop wie Tablet); 5T: Praxisnote.
- Freitext: am Tablet bleiben Kriterium, Wirkung und «intern» beim Bearbeiten erhalten; am Laptop wird die Notiz bei jedem Schliessen gespeichert.
- Namensliste: Abgleich über Nummer (`#Nr` am Zeilenende), E-Mail, dann Name; Umbenennen behält alle Daten; vor dem Entfernen von Personen mit Einträgen wird gefragt.
- Anzeigen eines Tages legt keine Einträge mehr an; Einträge entstehen nur durch «Tag erfassen» oder eine Eingabe.
- Fremde Dateien (Service-Datei in der Küche und umgekehrt) werden abgelehnt; kaputte Dateien laden ohne Absturz.
- Baustein «Verspätet zum Dienst erschienen» nicht mehr wählbar (Verspätung nur über den Knopf), zählt in alten Daten als Verspätung.
- Wechsel Tablet/Laptop: landet auf dem heutigen Tag, fragt vor dem Überschreiben; neu ausgestellte Pakete übernehmen Daten, Plan, Zyklus.
- Zusammenfassung zählt «Team Market verspätet» richtig; Anrede mit Vorname; Startlinks mit Komma im Namen; mein.html robust gegen fehlerhafte Pakete.
- Cockpit: Restaurantwechsel und Tagesplan nach Datum statt Position, Wechseldatum an Einsatztagen, Nicknames nur bei echter Änderung, doppelte Namen und Dozierende ohne Namen erkannt.
- Abnahme: Plan ohne Tagesplan bekommt Einsatzdaten aus von/bis; Wechsel Tablet/Laptop bleibt auf dem bearbeiteten Tag;
  Tablet lehnt Dateien aus dem anderen Bereich ab; Laptop übernimmt die bewertende Person pro Wochentag; mein.html zeigt
  alle gleichzeitig laufenden Pakete; Notenzentrale verbindet 5T + 4T auch ohne Zyklusangabe und zählt den alten Baustein «Verspätet».

## Audit 10.11.2026 (Prüfung des ganzen Projekts)

Behoben:
- **Service Mobil** übernahm «Sicherung laden» ungeprüft: alte Namensform, Einträge ohne Person und kaputte Werte blieben stehen.
  Jetzt gleiche Bereinigung wie Laptop und Küche (`saubereStudierende`, `sanitizeDays`, `sanitizeMeta`), auch beim Start.
- Kaputte Tagesangaben (`dayMeta`) liessen in der Küche «Tag erfassen» abbrechen; Service Laptop behielt Einträge ohne Person.
- **Notenzentrale** liest jeden Eintrag wie die Apps (`cleanRec`): ein Freitext ohne Text zählt nicht, Personenangaben sind immer Text.
  Vorher konnte dieselbe (beschädigte) Datei in App und Notenzentrale verschiedene Noten ergeben oder die Übersicht anhalten.
- **Freitext ohne Text wirkt nie auf die Note** (Tablet, Laptop, Notenzentrale gleich). Am Tablet liess ein geleerter Text die am Laptop
  gesetzte Wirkung (z. B. −1.00 Hygiene) unsichtbar stehen; jetzt entfernt ein geleerter Text den Freitext ganz, wie am Laptop.
- **Feedback-Mail**: eigene Änderungen am Text gingen verloren, sobald man die Sprache oder den Haken «Praxisnote mitschicken» wechselte. Jetzt Rückfrage.
- **Cockpit**: ein Datum, das es nicht gibt (31.11.), wurde still in den Folgemonat geschoben; jetzt Fehlermeldung. Zahlen statt Text im Plan
  (Copilot) halten die Seite nicht mehr an; kein Plan-Objekt ergibt eine Meldung.
- Erfassungsdatum, «Feedback gesendet» und «Zusammenfassung gesendet» in Ortszeit statt UTC.
- Dateien mit Byte-Order-Mark (UTF-8 mit BOM) laden in allen Seiten.
- Zusammenführen am Laptop gleicht zuerst über die Studierendennummer ab (wie die Namensliste).
- CSV im Service und in der Notenzentrale entschärft Formeln (wie in der Küche).
- **Telefon (360 bis 430 px)**: in der Fussleiste lief «Sichern» rechts aus dem Bild, und ein langer Name schob den Stift für den Nickname
  aus dem Blattkopf. Die Knöpfe brechen jetzt um, der Name kürzt mit «…», der Stift bleibt sichtbar.
- Kopfzeile (Bereich, Knopf «Startseite») folgt der Sprache der Oberfläche (vorher fest Deutsch, auch auf Thai und Englisch);
  am Laptop heisst der Reiter des Prüfungstags «Exam Day» wie am Tablet.
- Aufgeräumt: ungenutzte Funktionen, alte Patch-Skripte (`tools/patch_*.py`), feste Pfade in `tools/anleitungen/`, `test_altdaten.py` ohne festen Pfad,
  Namen von Dozierenden in Kommentaren und Tests durch erfundene ersetzt.

Neu geprüft: `tests/test_fuzz_notenmodell.py` (Zufallsdaten, drei Fassungen müssen auf 1e-9 gleich rechnen) und
`tests/test_audit_2026_11_10.py` (zufällig beschädigte Dateien in Tablet, Laptop, Notenzentrale, Cockpit und «Meine Startseite»).
Stand 10.11.2026: 908 Prüfungen in 20 Testreihen bestanden, Darstellung in 360 bis 1366 px und drei Sprachen ohne seitliches Scrollen.
Prüfung des Quelltexts: `node --check` und ESLint über alle gebauten Seiten (keine Fehler), `pyflakes` über die Python-Skripte.

## Entscheide 10.11.2026 (nach dem Audit)

- **Service: nur die Gastgeberhaltung zählt doppelt, Hygiene einfach** (`DOUBLE_CRITS = ["gas"]` in `src/service/_scriptA.js` und `_mobile_head.html`).
  Küche unverändert: Hygiene doppelt. Gilt sofort für alle Dateien, auch für bereits erfasste Tage.
- **Freitext mit Wirkung auf die Note auch am Tablet**: Text, Kriterium und Wirkung (+ 0.50, + 1.00, − 0.50, − 1.00), gespeichert wie am Laptop
  (`n2NoteForm` in `src/_noten2_mobile.js`). Ohne Kriterium oder ohne Text bleibt es eine Bemerkung ohne Wirkung.
- **Bibliotheken im eigenen Repository** (`site/lib/`, veröffentlicht unter `/lib/`): SheetJS, PDF.js, JSZip, QRCode.js. Die Seiten laden nichts mehr
  von cdnjs; nur eine einzeln geöffnete Kopie ausserhalb der Webseite lädt von dort nach. Für die Tests braucht es `tests/.cache/` nur noch für die PDF-Fotoliste.
- Git-Verlauf bereinigt: Namen von Dozierenden stehen in keinem Commit mehr.
