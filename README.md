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
git commit -am "…" && git push      # GitHub Pages aktualisiert sich in 1 bis 2 Minuten
```

Feste Regeln (Basisnote 5.00, Verspätung startet bei 4.00, Team Market und OC zählen 5.00, Gewichte, Exam Day, 2/3 Praxis + 1/3 Exam) stehen in
`src/*/LIESMICH.txt` und werden nicht über die Oberfläche geändert.

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
