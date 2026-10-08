#!/usr/bin/env python3
"""Erzeugt die drei Varianten des Küchenrapports als eigenständige HTML-Dateien."""
import pathlib, re

BASE = pathlib.Path(__file__).parent
OUT  = BASE.parent / 'dist'; OUT.mkdir(exist_ok=True)
parts = [BASE/'_head_top.html', BASE/'_scriptA.js', BASE/'_chips.js', BASE/'_scriptB.js']
body  = "".join(p.read_text(encoding='utf-8') for p in parts)

HEAD = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n'
        '<meta name="theme-color" content="#001436">\n'
        '<style>html{color-scheme:light dark}body{margin:0}img{max-width:100%}'
        '[hidden]{display:none!important}</style>\n')

VARIANTS = [
    # (Dateiname,                          VARIANT, SLOT_COUNT, HAS_EXAM, Titelzusatz)
    ("Kuechenrapport.html",                "10T", 10, "true",  "10 Tage · Exam Day"),
    ("Kuechenrapport_4Tage_Exam.html",     "4T",   5, "true",  "4 Tage · Exam Day"),
    ("Kuechenrapport_5Tage_ohneExam.html", "5T",   5, "false", "5 Tage · ohne Exam"),
]

for fname, vid, slots, hasx, label in VARIANTS:
    v = body
    v = v.replace('const VARIANT = "10T";',   'const VARIANT = "%s";' % vid, 1)
    v = v.replace('const SLOT_COUNT = 10;',   'const SLOT_COUNT = %d;' % slots, 1)
    v = v.replace('const HAS_EXAM = true;',   'const HAS_EXAM = %s;' % hasx, 1)
    v = v.replace('<title>Daily Grades · Küche</title>',
                  '<title>Daily Grades · Küche · %s</title>' % label, 1)
    assert 'const VARIANT = "%s";' % vid in v and 'const SLOT_COUNT = %d;' % slots in v
    full = HEAD + v.replace('\n<header class="top">', '\n</head>\n<body>\n<header class="top">', 1) + '\n</body>\n</html>\n'
    (OUT / fname).write_text(full, encoding='utf-8')
    print("%-38s VARIANT=%-4s SLOTS=%2d EXAM=%-5s  %d Bytes" % (fname, vid, slots, hasx, len(full)))
