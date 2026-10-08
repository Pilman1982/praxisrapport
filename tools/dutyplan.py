# -*- coding: utf-8 -*-
"""Duty-Plan-PDFs (HS26) -> Schicht-Kuerzel pro Person und Datum.
Aufruf: python3 dutyplan.py turnusplan_V2.json out_V3.json plan1.pdf plan2.pdf ...
"""
import sys, re, json, unicodedata, collections, pdfplumber
def norm(s): return re.sub(r"[^a-z ]"," ",unicodedata.normalize("NFD",s).encode("ascii","ignore").decode().lower()).split()
def key(*p): return frozenset(t for x in p for t in norm(x))
DATE = re.compile(r"^(\d{1,2})\.(\d{1,2})$")
CODE = re.compile(r"^[A-Za-z]{1,4}\d?[a-z]?$|^MePS?K?\d$|^MPK\d$")
SKIP = {"team","semester","date","tag","group","version","cycle","practical","kitchen","service","breakfast","note","1st","cuisine"}

def _words(chars, gap=2.5):
    """Zeichen einer Zeile zu Woertern (Abstand > gap trennt)."""
    out = []
    for c in sorted(chars, key=lambda c: c["x0"]):
        if c["text"].strip() == "": 
            if out: out[-1]["end"] = True
            continue
        if out and not out[-1].get("end") and c["x0"] - out[-1]["x1"] <= gap and abs(c["top"] - out[-1]["top"]) < 0.6:
            out[-1]["text"] += c["text"]; out[-1]["x1"] = c["x1"]
        else:
            out.append({"text": c["text"], "x0": c["x0"], "x1": c["x1"], "top": c["top"]})
    return out

def parse(path, year="2026"):
    res = collections.defaultdict(dict)   # namekey -> {datum: code}
    names = {}
    with pdfplumber.open(path) as pdf:
        for pg in pdf.pages:
            ws = pg.extract_words()
            lines = collections.defaultdict(list)
            for w in ws: lines[round(w["top"])].append(w)
            tops = sorted(lines)
            blocks = []   # (top_start, cols)
            for t in tops:
                if any(w["text"] in ("Datum", "Date") for w in lines[t]):
                    cols = []
                    for tt in tops:
                        if abs(tt - t) <= 3:
                            for w in lines[tt]:
                                m = DATE.match(w["text"])
                                if m: cols.append((w["x0"], "%s-%02d-%02d" % (year, int(m.group(2)), int(m.group(1)))))
                    cols.sort(); blocks.append((t, cols))
            blocks.append((10**6, None))
            chars = pg.chars
            for bi in range(len(blocks) - 1):
                t0, cols = blocks[bi]; t1 = blocks[bi + 1][0]
                if not cols: continue
                x0c = cols[0][0]
                for t in tops:
                    if not (t0 + 3 < t < t1 - 3): continue
                    L = sorted(lines[t], key=lambda w: w["x0"])
                    if not L or L[0]["x0"] > 70 or not re.match(r"^[A-Za-zÀ-ÿ]", L[0]["text"]) or L[0]["text"].lower() in SKIP: continue
                    ntop = L[0]["top"]
                    nch = [c for c in chars if abs(c["top"] - ntop) < 0.3]
                    # Name: zusammenhaengende Zeichen ab dem Zeilenanfang
                    nch.sort(key=lambda c: c["x0"]); nameend = nch[0]["x1"]
                    for c in nch[1:]:
                        if c["x0"] - nameend > 8: break
                        nameend = c["x1"]
                    nm = "".join(c["text"] for c in nch if c["x1"] <= nameend + 0.1)
                    codech = [c for c in chars if c["x0"] >= x0c - 25 and (
                              (ntop + 0.5 <= c["top"] <= ntop + 2.5) or (abs(c["top"] - ntop) < 0.3 and c["x0"] > nameend + 5))]
                    # Name ohne angeklebte Kuerzel (gleiche Zeile, aber tiefer gesetzt)
                    nm = re.sub(r"[^A-Za-zÀ-ÿ' \-]", " ", nm).strip()
                    if not nm or len(nm) < 3: continue
                    k = key(nm); names[k] = nm
                    best = {}
                    for w in _words(codech):
                        txt = w["text"].rstrip(".")
                        if not CODE.match(txt): continue
                        d, col = min(((abs(w["x0"] - c[0]), c) for c in cols), key=lambda z: z[0])
                        if d > 14: continue
                        score = abs(w["top"] - (ntop + 1.1))
                        if col[1] not in best or score < best[col[1]][0]: best[col[1]] = (score, txt)
                    for dt, (_, code) in best.items(): res[k][dt] = code
    return res, names

if __name__ == "__main__":
    plan = json.load(open(sys.argv[1], encoding="utf-8"))
    allres = {}; allnames = {}
    for p in sys.argv[3:]:
        r, n = parse(p)
        for k, v in r.items(): allres.setdefault(k, {}).update(v)
        allnames.update(n)
    hit = miss = 0; nomatch = []; codes = collections.Counter(); nicks = {}
    studs = plan["studierende"]
    for s in studs:
        nn = set(norm(s["nachname"])); vv = set(norm(s["vorname"])); ks = nn | vv
        rows = [k for k in allres if nn <= k]
        same = [o for o in studs if o is not s and set(norm(o["nachname"])) == nn]
        withv = [k for k in rows if k & vv]
        if same: rows = withv
        else: rows = withv + [k for k in rows if k == nn]      # Zeile nur mit Nachname (Umbruch im PDF)
        if not rows and not same: rows = [k for k in allres if nn <= k]   # Vorname im PDF anders geschrieben
        if not rows:   # Schreibvarianten: Burkhard/Burkhardt, Colque/Colque Lajo
            n0 = norm(s["nachname"])[0][:6]
            rows = [k for k in allres if any(t[:6] == n0 for t in k) and (k & vv)]
        if not rows: nomatch.append(s["nachname"] + " " + s["vorname"]); continue
        m = {}
        for k in rows: m.update(allres[k])
        # Rufname: ein zusaetzliches Wort hinter dem vollen Namen (z. B. "Wang Luting LuLu")
        ex = {allnames[k].split()[-1] for k in rows if ks < k and len(k - ks) == 1}
        if len(ex) == 1: nicks[s["nr"]] = ex.pop()
        elif len(ex) > 1: nomatch.append(s["nachname"] + " " + s["vorname"] + " (Rufname unklar: " + "/".join(sorted(ex)) + ")")
        for e in s["einsaetze"]:
            for tg in e.get("tage", []):
                c = m.get(tg["datum"])
                if c: tg["schicht"] = c; hit += 1; codes[c] += 1
                else: miss += 1
    neu = 0
    for s in studs:
        n = nicks.get(s["nr"])
        if n and not s.get("nickname") and n.lower() not in {x.lower() for x in s["vorname"].split()}:
            s["nickname"] = n[:1].upper() + n[1:]; neu += 1
    print("Rufnamen aus dem Duty Plan uebernommen:", neu)
    plan["version"] = max(plan.get("version", 1), 1)
    json.dump(plan, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Tage mit Kuerzel:", hit, "ohne:", miss)
    print("Personen ohne Treffer:", nomatch)
    print("Kuerzel:", dict(codes.most_common()))
