# Praxisrapport

Praxisbeurteilung Küche und Service an der EHL Hotelfachschule Passugg.
Web-App ohne Installation: läuft im Browser auf Windows, iPhone, iPad und Android.

**Grundsatz: Das Programm ist online, die Daten bleiben auf dem Gerät.**
Dieses Repository enthält nur Programmcode und erfundene Testdaten.
Es werden nie Daten von Studierenden hier abgelegt (siehe `.gitignore`).

## Adressen (GitHub Pages)

| Seite | Zweck |
|---|---|
| `/` | Startseite mit allen Programmen |
| `/startlink.html` | Persönliche Startlinks für Dozierende erzeugen (Sprache, Outlet, Name, Wochentagsplan) |
| `/kueche/…` | Küchenrapport (Laptop und Mobil, 10T / 4T / 5T) |
| `/service/…` | Servicerapport (Laptop und Mobil, 10T) |

## Startlink

`…/kueche/Kuechenrapport_Mobil.html#lang=th&outlet=Umami&dozent=Q`

| Schlüssel | Wirkung |
|---|---|
| `lang` | Sprache der Oberfläche: `de`, `en`, `th` |
| `outlet`, `dozent` | Vorbelegung im Setup |
| `klasse`, `gruppe` | Vorgabe für Klasse (`HFD`, `HFE1`, `HFE2`) und Gruppe |
| `plan` | Geteiltes Gerät: `plan=mo:Name,tu:Name,we:Name,th:Name` setzt pro Einsatztag die bewertende Person |

Alles nach `#` bleibt im Browser und wird nie an einen Server übertragen.

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
git commit -am "…" && git push      # GitHub Pages aktualisiert sich in 1 bis 2 Minuten
```

Feste Regeln (Basisnote 5.00, Gewichte, Exam Day, 2/3 Praxis + 1/3 Exam) stehen in
`src/*/LIESMICH.txt` und werden nicht über die Oberfläche geändert.

## Fahrplan Noten 2.0

1. Okt. 2026: Küche und Service harmonisiert, Startlinks, Veröffentlichung ✓
2. Okt./Nov.: Cockpit Kursleitung (Klassenliste, Nicknames, Einteilung, Pakete pro Outlet, Eingangskontrolle)
3. Nov.: Testlauf mit den Outlets
4. Dez.: zweiter Testlauf, Kriterien pro Outlet, Anleitungen DE/EN/TH
5. Jan. 2027: Go-live
