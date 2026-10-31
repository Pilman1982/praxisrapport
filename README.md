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
python3 tests/test_altdaten.py      # Rapporte aus dem Pilot (alter Programmstand)
python3 tests/test_daily_grades.py  # Rückmeldungen Pilot 08.10.2026 (Schichten, OC, Verspätung, Nickname, Zusammenfassung)
python3 tests/test_regeln_2026_10_11.py  # Basis 4.50, Team Market verspätet 4.00, Sie-Form
python3 tests/test_notenzentrale.py      # Regeln 31.10.2026 (6.00 erreichbar, Hygiene fest doppelt), Notenzentrale = gleiche Noten wie die Apps
git commit -am "…" && git push      # GitHub Pages aktualisiert sich in 1 bis 2 Minuten
```

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
- Feedback-Mail vom geteilten Gerät: beide unterschreiben («Laura Arcuri und Sybille Geiser»).
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
