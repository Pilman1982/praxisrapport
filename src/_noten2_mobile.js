
/* ====================================================================================
   Noten 2.0 · gemeinsamer Zusatz fuer Kuechen- und Servicerapport Mobil (05.10.2026)
   - Noten sichtbar fuer Dozierende: Tagesnote, Praxis-Durchschnitt, Exam, Schlussnote
   - Wirkung jedes Bausteins auf die Note (z. B. -0.50, K.-o. = 1.0)
   - Rechnung identisch zur Laptop-Fassung (Basisnote, Abweichung, Kappung, Doppelgewicht)
   ==================================================================================== */
function dmy(d){ return String(d).slice(8,10) + "." + String(d).slice(5,7) + "."; }
const N2_DOUBLE = CRITS.some(c => c.k === "gas") ? "gas" : "hyg";
const N2_LATE = CHIP["tea-lt"] ? "tea-lt" : "tea-n1";
const N2T = {
  de:{grades:"Noten", today:"Tag", praxis:"Ø Praxis", exam:"Exam", final:"Schlussnote", counted:"Tage gewertet",
      none:"–", hint:"Gleiche Rechnung wie am Laptop: Basisnote, Abweichungen pro Kriterium, Kappung, doppelte Gewichtung. Exam Day separat, Schlussnote 2/3 Praxis + 1/3 Exam.",
      crit:"Kriterien Ø", abs:"Absenzen"},
  en:{grades:"Grades", today:"Day", praxis:"Ø Practice", exam:"Exam", final:"Final grade", counted:"days counted",
      none:"–", hint:"Same calculation as on the laptop: baseline, deviations per criterion, capping, double weight. Exam Day separate, final grade 2/3 practice + 1/3 exam.",
      crit:"Criteria Ø", abs:"Absences"},
  th:{grades:"คะแนน", today:"วันนี้", praxis:"เฉลี่ยภาคปฏิบัติ", exam:"สอบ", final:"คะแนนรวม", counted:"วันที่นับ",
      none:"–", hint:"คำนวณเหมือนบนแล็ปท็อป: คะแนนพื้นฐาน ส่วนต่างต่อเกณฑ์ การจำกัดค่า น้ำหนักสองเท่า วันสอบแยก คะแนนรวม 2/3 ภาคปฏิบัติ + 1/3 สอบ",
      crit:"เฉลี่ยตามเกณฑ์", abs:"ขาด/ลา"}
};
const n2t = k => (N2T[L] && N2T[L][k]) || N2T.de[k] || k;
function n2Base(){ const b = parseFloat(S.settings.base); return isFinite(b) ? b : 5; }
function n2Obs(r){ return (r && Array.isArray(r.obs)) ? r.obs : []; }
/* Kriteriennoten eines Tages, wie critGradesForDay am Laptop */
function n2Crit(slotId, sid){
  const r = (S.days[slotId] || {})[sid]; if(!r) return null;
  const sl = slots().find(x => x.id === slotId); const isExam = !!(sl && sl.exam);
  const att = ["present","late","excused","unexcused","tm"].indexOf(r.att) >= 0 ? r.att : "present";
  const g = {};
  if(att === "tm"){ CRITS.forEach(c => g[c.k] = 5); return g; }
  if(att === "excused" && !isExam) return null;
  if(att === "unexcused" || (isExam && att === "excused")){ CRITS.forEach(c => g[c.k] = 1); return g; }
  const obs = n2Obs(r).map(i => CHIP[i]).filter(Boolean);
  /* Verspätet (Entscheid 08.10.2026): der Tag startet eine Note tiefer, 4.00 statt 5.00. */
  const b0 = n2Base() - (att === "late" ? 1 : 0);
  const nt = r.note;
  CRITS.forEach(c => {
    const mine = obs.filter(o => o.c === c.k);
    if(mine.some(o => o.ko)){ g[c.k] = 1; return; }
    let d = 0; mine.forEach(o => { d += o.d * o.w; });
    if(nt && nt.crit === c.k && nt.dir && nt.w) d += nt.dir * nt.w;
    d = Math.max(CAP_NEG, Math.min(CAP_POS, d));
    g[c.k] = Math.max(1, Math.min(6, b0 + d));
  });
  return g;
}
function n2Day(slotId, sid){
  const g = n2Crit(slotId, sid); if(!g) return null;
  let sum = 0, w = 0;
  CRITS.forEach(c => { const ww = (c.k === N2_DOUBLE && S.settings[N2_DOUBLE + "2"] !== false) ? 2 : 1; sum += g[c.k] * ww; w += ww; });
  return sum / w;
}
function n2Praxis(sid){
  const v = slots().filter(s => !s.exam).map(s => n2Day(s.id, sid)).filter(x => x != null);
  return v.length ? {avg: v.reduce((a, b) => a + b, 0) / v.length, n: v.length} : {avg: null, n: 0};
}
function n2Exam(sid){ const ex = slots().find(s => s.exam); return ex ? n2Day(ex.id, sid) : null; }
function n2Final(sid){ const p = n2Praxis(sid).avg, e = n2Exam(sid); return (p != null && e != null) ? (2 * p + e) / 3 : null; }
const n2Fmt = v => v == null ? "–" : v.toFixed(2);
const n2Fmt1 = v => v == null ? "–" : (Math.round(v * 10) / 10).toFixed(1);   // Schlussnote: auf 0.1 gerundet
/* Farben wie am Laptop: grün ab 5.25 (über Erwartung), rot unter 4.25, dazwischen neutral */
const n2Cls = v => v == null ? "g-na" : (v >= 5.25 ? "g-ok" : (v < 4.25 ? "g-bad" : "g-mid"));
function n2Effect(c){ return c.ko ? "→ 1.0" : ((c.d > 0 ? "+" : "−") + c.w.toFixed(2)); }
function n2Pill(v, extra){ return el("span",{class:"gpill " + n2Cls(v) + (extra ? " " + extra : ""), text: n2Fmt(v)}); }
/* Kopf des Erfassungsblatts: Tagesnote und Praxisdurchschnitt, laufend aktualisiert */
function n2ShowHead(sid){
  const h = document.getElementById("n2grade"); if(!h) return;
  const d = n2Day(curSlot, sid), p = n2Praxis(sid);
  h.className = "gpill big " + n2Cls(d);
  h.textContent = n2t("today") + " " + n2Fmt(d) + "  ·  Ø " + n2Fmt(p.avg);
}
/* Notenuebersicht (Knopf Ø oben) */
function n2RenderGrades(){
  const root = document.getElementById("view"); root.innerHTML = "";
  const hasEx = slots().some(s => s.exam);
  root.appendChild(el("h2",{class:"sec",text:n2t("grades")}));
  root.appendChild(n2SummaryCard());
  root.appendChild(el("p",{class:"muted",style:"margin:14px 2px 10px",text:n2u("fbHint")}));
  const card = el("div",{class:"card"});
  const ul = el("ul",{class:"slist"});
  S.students.forEach(s => {
    const p = n2Praxis(s.id), e = hasEx ? n2Exam(s.id) : null, f = hasEx ? n2Final(s.id) : null;
    let abs = 0; slots().forEach(x => { const r = (S.days[x.id] || {})[s.id]; if(r && (r.att === "excused" || r.att === "unexcused")) abs++; });
    const li = el("li");
    const row = el("div",{class:"srow grow",style:"cursor:default"});
    const av = (typeof avatar === "function") ? avatar(s, 34) : null; if(av) row.appendChild(av);
    row.appendChild(el("span",{class:"nm"},[document.createTextNode((s.name || "") + ((typeof nickTag === "function") ? nickTag(s) : "")),
      el("div",{class:"sub",text:p.n + " " + n2t("counted") + (abs ? " · " + n2t("abs") + " " + abs : "")})]));
    const box = el("span",{class:"gbox"});
    box.appendChild(el("span",{class:"gl",text:n2t("praxis")})); box.appendChild(n2Pill(p.avg));
    if(hasEx){ box.appendChild(el("span",{class:"gl",text:n2t("exam")})); box.appendChild(n2Pill(e));
               box.appendChild(el("span",{class:"gl",text:n2t("final")})); { const fp = n2Pill(f, f != null ? "strong" : ""); fp.textContent = n2Fmt1(f); if(f != null) fp.title = n2Fmt(f); box.appendChild(fp); } }
    row.appendChild(box);
    const sent = n2FbSent(s.id);
    row.appendChild(el("button",{class:"btn fbbtn" + (sent ? " done" : ""),text:"✉ " + n2u("fb") + (sent ? " ✓" : ""),
      title: sent ? n2u("sent") + " " + sent : "", onclick:()=>n2OpenFb(s)}));
    li.appendChild(row); ul.appendChild(li);
  });
  card.appendChild(ul); root.appendChild(card);
  root.appendChild(el("p",{class:"muted",style:"margin:14px 2px 0",text:n2t("hint")}));
}

/* ====================================================================================
   Feedback-Mail an die Studierenden (Noten 2.0, 05.10.2026)
   Jede/r Dozierende löst sie am Ende ihres/seines Einsatzes selbst aus (Notenübersicht Ø).
   Sprache: Deutsch für HFD, Englisch für HFE1/HFE2 (oder die Sprache aus der Klassenliste).
   Inhalt: was gut lief, wo die Person sich verbessern kann (mit Tipp), freundlicher Abschluss.
   Der Text ist im Blatt frei bearbeitbar und geht über die Mail-App der Dozierenden hinaus.
   ==================================================================================== */
const N2FB = {
  de:{subj:"Dein Feedback aus der Praxis", hi:"Hallo", thanks:"vielen Dank für deinen Einsatz bei uns", period:"vom {a} bis {b}", intro:"Gerne gebe ich dir ein kurzes Feedback.",
      good:"Das hat mir besonders gefallen:", goodNone:"Du hast die Erwartungen zuverlässig erfüllt, besonders in diesen Bereichen: {c}.",
      improve:"Hier kannst du dich noch verbessern:", improveNone:"Mir sind keine Punkte aufgefallen, an denen du dringend arbeiten musst. Bleib so dran!",
      tip:"Tipp", often:"mehrmals", late:"Achte bitte auf Pünktlichkeit: Du warst {n}× verspätet.", unex:"Bitte melde Abwesenheiten immer im Voraus: {n} Tag(e) waren nicht entschuldigt.",
      grades:"Deine Praxisnote für diesen Einsatz: {p}",
      c1:"Du warst eine echte Stütze im Team. Mach genau so weiter!", c2:"Du bist auf einem guten Weg. Mit den Tipps oben holst du noch mehr heraus.",
      c3:"Die Grundlage stimmt. Nimm dir die Punkte oben Schritt für Schritt vor, dann merkst du schnell Fortschritte.",
      c4:"Ich sehe, dass bei dir noch einiges drin liegt, und ich traue es dir zu. Komm gerne auf mich zu, wenn du Unterstützung möchtest.",
      wish:"Ich wünsche dir viel Erfolg und Freude im nächsten Einsatz.", bye:"Herzliche Grüsse"},
  en:{subj:"Your feedback from practical training", hi:"Hi", thanks:"thank you for your work with us", period:"from {a} to {b}", intro:"Here is some short feedback from me.",
      good:"What I particularly liked:", goodNone:"You reliably met expectations, especially in these areas: {c}.",
      improve:"Where you can still improve:", improveNone:"I did not notice anything you urgently need to work on. Keep it up!",
      tip:"Tip", often:"several times", late:"Please watch your punctuality: you were late {n} time(s).", unex:"Please always report absences in advance: {n} day(s) were unexcused.",
      grades:"Your practice grade for this assignment: {p}",
      c1:"You were a real asset to the team. Keep it up exactly like this!", c2:"You are on a good path. With the tips above you will get even more out of it.",
      c3:"The foundation is there. Work through the points above step by step and you will soon see progress.",
      c4:"I can see there is more in you, and I am confident you can do it. Feel free to come to me if you would like support.",
      wish:"I wish you every success and enjoyment on your next assignment.", bye:"Kind regards"}
};
const N2FBUI = {
  de:{fb:"Feedback", fbTitle:"Feedback-Mail", fbHint:"Am Ende deines Einsatzes: pro Person eine Feedback-Mail. Der Text ist ein Vorschlag, du kannst ihn ändern.",
      withGrades:"Praxisnote mitschicken (ohne Exam)", open:"In Mail öffnen", copy:"Kopieren", close:"Schliessen", noMail:"Keine E-Mail-Adresse hinterlegt. Text kopieren und selbst senden.",
      sent:"gesendet", copied:"Kopiert", lang:"Sprache",
      noDays:"Für diese Person gibt es noch keinen bewerteten Tag (z. B. nur Absenzen). Bitte den Text prüfen, bevor du ihn sendest.",
      pasted:"Der Text ist lang und wurde kopiert. In der Mail mit Strg+V (Mac: Cmd+V) einfügen.", pasteHere:"(Feedback-Text hier einfügen: Strg+V)"},
  en:{fb:"Feedback", fbTitle:"Feedback e-mail", fbHint:"At the end of your assignment: one feedback e-mail per student. The text is a suggestion; you can change it.",
      withGrades:"Include practice grade (no exam)", open:"Open in Mail", copy:"Copy", close:"Close", noMail:"No e-mail address on file. Copy the text and send it yourself.",
      sent:"sent", copied:"Copied", lang:"Language",
      noDays:"There is no graded day for this student yet (e.g. only absences). Please check the text before sending it.",
      pasted:"The text is long and has been copied. Paste it into the e-mail with Ctrl+V (Mac: Cmd+V).", pasteHere:"(Paste the feedback text here: Ctrl+V)"},
  th:{fb:"ข้อเสนอแนะ", fbTitle:"อีเมลข้อเสนอแนะ", fbHint:"เมื่อจบการฝึก: ส่งอีเมลข้อเสนอแนะให้นักศึกษาแต่ละคน ข้อความเป็นเพียงข้อเสนอ แก้ไขได้",
      withGrades:"ส่งคะแนนภาคปฏิบัติด้วย (ไม่รวมสอบ)", open:"เปิดในแอปเมล", copy:"คัดลอก", close:"ปิด", noMail:"ไม่มีที่อยู่อีเมล ให้คัดลอกข้อความแล้วส่งเอง",
      sent:"ส่งแล้ว", copied:"คัดลอกแล้ว", lang:"ภาษา",
      noDays:"นักศึกษาคนนี้ยังไม่มีวันที่ได้รับการประเมิน (เช่น มีแต่การขาด) กรุณาตรวจข้อความก่อนส่ง",
      pasted:"ข้อความยาวและถูกคัดลอกแล้ว วางในอีเมลด้วย Ctrl+V (Mac: Cmd+V)", pasteHere:"(วางข้อความข้อเสนอแนะที่นี่: Ctrl+V)"}
};
const n2u = k => (N2FBUI[L] && N2FBUI[L][k]) || N2FBUI.de[k];
function n2FbLang(s){
  if(s && (s.lang === "de" || s.lang === "en")) return s.lang;
  const k = String((s && s.klasse) || "").toUpperCase();
  if(k === "HFD") return "de";
  if(/^HFE/.test(k)) return "en";
  return (S.settings.outLang === "en") ? "en" : "de";
}
function n2Teacher(){
  const wds = ["su","mo","tu","we","th","fr","sa"], wd = wds[new Date().getDay()];
  const p = S.settings.teacherPlan;
  if(p && typeof p === "object" && p[wd]) return p[wd];
  return S.settings.teacher || "";
}
/* Auswertung pro Person über alle Tage dieses Pakets */
function n2FbData(sid){
  const tally = {}; let late = 0, unex = 0, days = 0;
  slots().filter(x => !x.exam).forEach(sl => {                    // Exam Day bleibt aus der Mail (noch nicht kommunizierbar)
    const r = (S.days[sl.id] || {})[sid]; if(!r) return;
    const att = r.att || "present";
    if(att === "late") late++;
    if(att === "unexcused") unex++;
    if(att === "excused" || att === "unexcused" || att === "tm") return;
    days++;
    n2Obs(r).forEach(i => { tally[i] = (tally[i] || 0) + 1; });
  });
  const per = {}; CRITS.forEach(c => per[c.k] = []);
  slots().filter(x => !x.exam).forEach(sl => { const g = n2Crit(sl.id, sid); if(g) CRITS.forEach(c => per[c.k].push(g[c.k])); });
  const crit = {}; CRITS.forEach(c => { const v = per[c.k]; crit[c.k] = v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; });
  const list = Object.keys(tally).map(i => ({c: CHIP[i], n: tally[i]})).filter(x => x.c);
  const pos = list.filter(x => x.c.d > 0).sort((a, b) => (b.n * (b.c.w || 1)) - (a.n * (a.c.w || 1)));
  const neg = list.filter(x => x.c.d < 0 && x.c.i !== N2_LATE).sort((a, b) => ((b.c.ko ? 9 : 0) + b.n * (b.c.w || 1)) - ((a.c.ko ? 9 : 0) + a.n * (a.c.w || 1)));
  return {pos, neg, late, unex, days, crit};
}
function n2FbText(s, lg, withGrades){
  const X = N2FB[lg] || N2FB.de, D = n2FbData(s.id);
  const sl = slots().filter(x => x.date && !x.exam), a = sl.length ? dmy(sl[0].date) : "", b = sl.length ? dmy(sl[sl.length - 1].date) : "";
  const outlet = [S.settings.outlet, S.settings.outlet2].filter(Boolean).join(" / ");
  const first = (s.nick || s.first || String(s.name || "").split(/\s+/).slice(1).join(" ") || s.name || "").trim();
  const cn = k => { const c = CRITS.find(x => x.k === k); return c ? (c[lg] || c.de) : k; };
  const ct = c => (c.t && (c.t[lg] || c.t.de)) || "";
  const ca = c => (c.a && (c.a[lg] || c.a.de)) || "";
  const o = [];
  o.push(X.hi + " " + first + ",", "");
  o.push(X.thanks + (outlet ? " (" + outlet + (a ? ", " + X.period.replace("{a}", a).replace("{b}", b) : "") + ")" : (a ? " " + X.period.replace("{a}", a).replace("{b}", b) : "")) + ". " + X.intro, "");
  if(D.pos.length){
    o.push(X.good);
    D.pos.slice(0, 3).forEach(x => o.push("– " + ct(x.c) + (x.n > 1 ? " (" + X.often + ")" : "")));
  } else {
    const best = CRITS.filter(c => D.crit[c.k] != null && D.crit[c.k] >= 5).sort((a, b) => D.crit[b.k] - D.crit[a.k]).map(c => cn(c.k)).slice(0, 3);
    if(best.length) o.push(X.goodNone.replace("{c}", best.join(", ")));
  }
  o.push("");
  if(D.neg.length){
    o.push(X.improve);
    D.neg.slice(0, 3).forEach(x => {
      o.push("– " + cn(x.c.c) + ": " + ct(x.c) + (x.n > 1 ? " (" + X.often + ")" : "") + ".");
      if(ca(x.c)) o.push("  " + X.tip + ": " + ca(x.c));
    });
  } else o.push(X.improveNone);
  o.push("");
  if(D.late) o.push(X.late.replace("{n}", D.late));
  if(D.unex) o.push(X.unex.replace("{n}", D.unex));
  if(D.late || D.unex) o.push("");
  /* Entscheid 06.10.2026: nur die Praxisnote (Einsatztage ohne Exam) darf mitgeteilt werden, auf 0.1 gerundet.
     Exam-Note und Schlussnote werden nie in die Mail geschrieben. */
  const p = n2Praxis(s.id).avg;
  if(withGrades && p != null){ o.push(X.grades.replace("{p}", n2Fmt1(p)) + ".", ""); }
  const g = p == null ? 5 : p;
  o.push(g >= 5.25 ? X.c1 : g >= 4.75 ? X.c2 : g >= 4 ? X.c3 : X.c4);
  o.push(X.wish, "", X.bye, n2Teacher());
  const subj = X.subj + (outlet ? " – " + outlet : "") + (a ? " " + a + "–" + b : "");
  return {subj, body: o.join("\n").replace(/\n{3,}/g, "\n\n")};
}
/* Mail-Link. Outlook unter Windows schneidet Links ab ca. 2000 Zeichen ab (Umlaute zählen dreifach).
   Am Laptop wird ein langer Text deshalb kopiert und die Mail nur mit Betreff geöffnet.
   Auf iPad/iPhone gibt es diese Grenze nicht: dort steht der ganze Text in der Mail. */
const N2_MAILTO_MAX = 1900;
function n2Touch(){ const u = navigator.userAgent || ""; return /iPad|iPhone|Android/.test(u) || (/Macintosh/.test(u) && (navigator.maxTouchPoints || 0) > 1); }
function n2FbMailto(s, subj, body, touch){
  const base = "mailto:" + encodeURIComponent((s && s.mail) || "") + "?subject=" + encodeURIComponent(subj);
  const full = base + "&body=" + encodeURIComponent(body);
  if(touch || full.length <= N2_MAILTO_MAX) return {href: full, copy: false};
  return {href: base + "&body=" + encodeURIComponent(n2u("pasteHere")), copy: true};
}
function n2FbSent(sid){ return (S.settings.fbSent && S.settings.fbSent[sid]) || ""; }
function n2OpenFb(s){
  const host = document.getElementById("sheetHost");
  let lg = n2FbLang(s), withGrades = false, edited = false;
  const close = () => { host.innerHTML = ""; document.body.style.overflow = ""; render(); };
  document.body.style.overflow = "hidden";
  const sh = el("div",{class:"sheet"});
  const hd = el("div",{class:"sheet-h"});
  { const av = (typeof avatar === "function") ? avatar(s, 44) : null; if(av) hd.appendChild(av); }
  hd.appendChild(el("div",{style:"min-width:0;flex:1"},[el("div",{class:"nm",text:n2u("fbTitle")}), el("div",{class:"sb",text:(s.name || "") + (s.mail ? " · " + s.mail : "")})]));
  hd.appendChild(el("button",{class:"hbtn",text:"✕","aria-label":n2u("close"),onclick:close}));
  sh.appendChild(hd);
  const body = el("div",{class:"sheet-b"});
  const ta = el("textarea",{class:"fbtext",id:"n2fbtext",oninput:()=>{ edited = true; }});
  const fill = () => { ta.value = n2FbText(s, lg, withGrades).body; edited = false; };
  const row = el("div",{class:"fbopts"});
  const ls = el("select",{"aria-label":n2u("lang"),onchange:e=>{ lg = e.target.value; fill(); }});
  [["de","Deutsch"],["en","English"]].forEach(([v, n]) => ls.appendChild(el("option",{value:v,text:n,selected:v === lg})));
  row.appendChild(el("label",{},[document.createTextNode(n2u("lang") + " "), ls]));
  const cb = el("input",{type:"checkbox",onchange:e=>{ withGrades = e.target.checked; fill(); }});
  row.appendChild(el("label",{},[cb, document.createTextNode(" " + n2u("withGrades"))]));
  body.appendChild(row);
  if(!s.mail) body.appendChild(el("div",{class:"banner",text:n2u("noMail")}));
  if(!n2FbData(s.id).days) body.appendChild(el("div",{class:"banner bad",text:n2u("noDays")}));
  body.appendChild(ta);
  sh.appendChild(body);
  const ft = el("div",{class:"sheet-f"});
  ft.appendChild(el("button",{class:"btn",text:n2u("copy"),onclick:()=>{
    try{ navigator.clipboard.writeText(ta.value).then(()=>toast(n2u("copied"))); }catch(e){ ta.select(); try{ document.execCommand("copy"); toast(n2u("copied")); }catch(_){} } }}));
  ft.appendChild(el("button",{class:"btn pri",text:"✉ " + n2u("open"),onclick:()=>{
    const subj = n2FbText(s, lg, withGrades).subj;
    S.settings.fbSent = S.settings.fbSent || {}; S.settings.fbSent[s.id] = new Date().toISOString().slice(0, 10); persist();
    const m = n2FbMailto(s, subj, ta.value, n2Touch());
    if(m.copy){                                                      // zu lang für Outlook unter Windows: Text in die Zwischenablage
      try{ navigator.clipboard.writeText(ta.value); }catch(e){ try{ ta.select(); document.execCommand("copy"); }catch(_){} }
      toast(n2u("pasted"));
    }
    location.href = m.href;
  }}));
  sh.appendChild(ft);
  host.innerHTML = ""; host.appendChild(sh);
  fill();
}

/* ====================================================================================
   Daily Grades · Rückmeldungen aus dem Pilot (08.10.2026)
   - Schicht-Kürzel aus dem Duty Plan neben dem Namen (CS1, SW2, OC, Sc …)
   - Nickname direkt im Erfassungsblatt eintragen
   - Zusammenfassung an die Kursleitung nach dem Exam (Ø 9 Tage + Exam, Ø 5 Tage, Ø 4 Tage + Exam)
   - Knopf zurück zur persönlichen Startseite (mein.html)
   ==================================================================================== */
const N2X = {
  de:{home:"Meine Startseite", nick:"Nickname", nickPh:"z. B. Lulu", nickSave:"Übernehmen", nickDel:"Löschen",
      nickHint:"Gilt sofort auf diesem Gerät. Mit «Tag senden» geht er an die Kursleitung und kommt mit dem nächsten Paket zu allen.",
      saved:"✓ gespeichert", lateDay:"Verspätet: Der Tag startet eine Note tiefer (4.00 statt 5.00).",
      sum:"Zusammenfassung an die Kursleitung", sumHint:"Nach dem Exam: die Durchschnitte aller Personen per Mail an Michael Pilman.",
      sumHint5:"Nach dem letzten Tag: der Durchschnitt aller Personen per Mail an Michael Pilman.", sumSent:"gesendet am",
      sumOpen:"Der Exam Day ist noch nicht erfasst. Trotzdem senden?", sumCopy:"Text kopiert. Bitte in die Mail einfügen.",
      sumNow:"Heute ist der letzte Tag. Danach: Zusammenfassung an die Kursleitung senden.", shift:"Schicht", ocDay:"OC (Office und Daily MeP): zählt wie Team Market mit 5.00."},
  en:{home:"My start page", nick:"Nickname", nickPh:"e.g. Lulu", nickSave:"Apply", nickDel:"Delete",
      nickHint:"Applies on this device at once. «Send the day» passes it to the course lead; everyone gets it with the next package.",
      saved:"✓ saved", lateDay:"Late: the day starts one grade lower (4.00 instead of 5.00).",
      sum:"Summary to the course lead", sumHint:"After the exam: e-mail the averages of all students to Michael Pilman.",
      sumHint5:"After the last day: e-mail the average of all students to Michael Pilman.", sumSent:"sent on",
      sumOpen:"The Exam Day has not been recorded yet. Send anyway?", sumCopy:"Text copied. Please paste it into the e-mail.",
      sumNow:"Today is the last day. Afterwards: send the summary to the course lead.", shift:"Shift", ocDay:"OC (office and daily MeP): counts like Team Market with 5.00."},
  th:{home:"หน้าเริ่มต้นของฉัน", nick:"ชื่อเล่น", nickPh:"เช่น Lulu", nickSave:"ใช้", nickDel:"ลบ",
      nickHint:"ใช้ได้ทันทีบนอุปกรณ์นี้ เมื่อกด «ส่งข้อมูลของวันนี้» ชื่อเล่นจะถูกส่งให้ผู้ประสานงาน และทุกคนจะได้รับในชุดข้อมูลถัดไป",
      saved:"✓ บันทึกแล้ว", lateDay:"มาสาย: วันนี้เริ่มต่ำลงหนึ่งคะแนน (4.00 แทน 5.00)",
      sum:"สรุปส่งผู้ประสานงาน", sumHint:"หลังวันสอบ: ส่งคะแนนเฉลี่ยของทุกคนทางอีเมลถึง Michael Pilman",
      sumHint5:"หลังวันสุดท้าย: ส่งคะแนนเฉลี่ยของทุกคนทางอีเมลถึง Michael Pilman", sumSent:"ส่งแล้วเมื่อ",
      sumOpen:"ยังไม่ได้บันทึกวันสอบ ต้องการส่งหรือไม่", sumCopy:"คัดลอกข้อความแล้ว กรุณาวางในอีเมล",
      sumNow:"วันนี้เป็นวันสุดท้าย หลังจากนั้น: ส่งสรุปให้ผู้ประสานงาน", shift:"กะ", ocDay:"OC (งานสำนักงานและเตรียมงาน): นับเหมือน Team Market ที่ 5.00"}
};
const n2x = k => (N2X[L] && N2X[L][k]) || N2X.de[k] || k;

/* Nickname im Erfassungsblatt */
function n2NickBox(student, onDone){
  const box = el("div",{class:"nickbox"});
  const inp = el("input",{type:"text",value:student.nick || "",placeholder:n2x("nickPh"),autocapitalize:"words","aria-label":n2x("nick"),maxlength:"30"});
  const save = v => { student.nick = String(v || "").trim(); student.nickNeu = new Date().toISOString().slice(0, 10); persist(); onDone(); };
  inp.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); save(inp.value); } });
  box.appendChild(el("label",{class:"eyebrow",text:n2x("nick")}));
  box.appendChild(el("div",{class:"row",style:"gap:8px;flex-wrap:nowrap"},[inp,
    el("button",{class:"btn pri",text:n2x("nickSave"),onclick:()=>save(inp.value)})]));
  if(student.nick) box.appendChild(el("button",{class:"morebtn",style:"margin-top:6px",text:n2x("nickDel"),onclick:()=>save("")}));
  box.appendChild(el("p",{class:"muted",style:"margin:6px 0 0;font-size:13px",text:n2x("nickHint")}));
  setTimeout(() => { try{ inp.focus(); }catch(e){} }, 30);
  return box;
}

/* Zusammenfassung an die Kursleitung (nach dem Exam bzw. nach dem letzten Tag) */
const N2_VAR_LABEL = {"10T":"9 Tage + Exam", "4T":"4 Tage + Exam", "5T":"5 Tage"};
function n2SumName(s){
  const n = [s.nachname || s.last || "", s.vorname || s.first || ""].filter(Boolean).join(", ") || s.name || "";
  return n + (s.nick ? " «" + s.nick + "»" : "");
}
function n2SummaryText(){
  const V = MVARIANT, pr = slots().filter(x => !x.exam), hasEx = slots().some(x => x.exam);
  const avgLbl = "Ø " + pr.length + " Tage";
  const st = S.settings || {};
  const dts = slots().map(x => x.date).filter(Boolean);
  const fd = d => d ? String(d).slice(8,10) + "." + String(d).slice(5,7) + "." + String(d).slice(0,4) : "";
  const area = (typeof APP_AREA !== "undefined") ? APP_AREA : "";
  const head = ["Daily Grades · Zusammenfassung " + area,
    [st.outlet, N2_VAR_LABEL[V] || V].filter(Boolean).join(" · ") + (dts.length ? " · " + fd(dts[0]) + " bis " + fd(dts[dts.length - 1]) : ""),
    "Dozent/in: " + (st.teacher || "–"),
    [st.group ? "Klasse " + st.group : "", st.team || ""].filter(Boolean).join(" · "), ""];
  const lines = S.students.map(s => {
    const p = n2Praxis(s.id), e = hasEx ? n2Exam(s.id) : null;
    const cnt = {excused:0, unexcused:0, late:0, tm:0};
    slots().forEach(x => { const r = (S.days[x.id] || {})[s.id]; if(r && cnt[r.att] != null) cnt[r.att]++; });
    const ab = [cnt.excused ? "entsch. " + cnt.excused : "", cnt.unexcused ? "unentsch. " + cnt.unexcused : "",
                cnt.late ? "verspätet " + cnt.late : "", cnt.tm ? "TM/OC " + cnt.tm : ""].filter(Boolean).join(", ");
    const kl = [s.klasse || st.group || "", s.gruppe || st.team || ""].filter(Boolean).join(" · ");
    return n2SumName(s) + (kl ? " · " + kl : "") + "\n   " + avgLbl + ": " + n2Fmt(p.avg) + " (" + p.n + " gewertet)"
      + (hasEx ? " · Exam: " + n2Fmt(e) : "") + (ab ? " · " + ab : "");
  });
  const subj = "Daily Grades · Zusammenfassung · " + [area, st.outlet, V, dts.length ? fd(dts[0]) : ""].filter(Boolean).join(" · ");
  return {subj, body: head.concat(lines).join("\n") + "\n\n" + (hasEx ? avgLbl + " ohne Exam Day. Exam separat. " : "") + "Durchschnitte auf 0.01, ungerundet."};
}
function n2SendSummary(){
  const ex = slots().find(x => x.exam);
  const filled = id => !!(S.days[id] && Object.keys(S.days[id]).length);
  const last = ex || slots()[slots().length - 1];
  if(last && !filled(last.id)){ try{ if(!window.confirm(n2x("sumOpen"))) return; }catch(e){ return; } }
  const T = n2SummaryText();
  const base = "mailto:" + ABS_MAIL + "?subject=" + encodeURIComponent(T.subj);
  let href = base + "&body=" + encodeURIComponent(T.body);
  if(!n2Touch() && href.length > N2_MAILTO_MAX){
    try{ navigator.clipboard.writeText(T.body); }catch(e){}
    href = base + "&body=" + encodeURIComponent(n2x("sumCopy")); toast(n2x("sumCopy"));
  }
  S.settings.sumSent = new Date().toISOString().slice(0, 10); persist();
  location.href = href;
}
function n2SummaryCard(){
  const c = el("div",{class:"card pad sumcard"});
  const V = MVARIANT;
  c.appendChild(el("span",{class:"eyebrow",style:"display:block;margin-bottom:6px",text:n2x("sum")}));
  c.appendChild(el("p",{class:"muted",style:"margin:0 0 10px",text: V === "5T" ? n2x("sumHint5") : n2x("sumHint")}));
  c.appendChild(el("button",{class:"btn pri wide",text:"✉ " + n2x("sum") + (S.settings.sumSent ? " ✓" : ""),onclick:n2SendSummary}));
  if(S.settings.sumSent) c.appendChild(el("p",{class:"muted",style:"margin:8px 0 0;font-size:13px",text:n2x("sumSent") + " " + S.settings.sumSent.split("-").reverse().join(".")}));
  return c;
}

/* ---- Noten 2.0: Übergabe von der persönlichen Startseite (mein.html) ----
   Die Startseite legt das passende Paket für genau diese Datei in den Browserspeicher
   (gleiche Adresse, die Daten verlassen das Gerät nie) und öffnet dann diese Datei.
   Hier wird es geladen. Bereits erfasste Tage eines anderen Pakets werden nur nach
   Rückfrage ersetzt. */
/* Daily Grades (08.10.2026): Schicht-Kürzel und Weg zurück zur Startseite, gemeinsam für alle Fassungen */
/* Schicht-Kürzel aus dem Duty Plan (Legende der Einsatzpläne HS26) */
const SCHICHT_INFO = {
  S:"Service", SA:"Service Asia (Umami)", SM:"Service «The Market», MeP & Lunch", ST:"Service Tournant", Sv:"Supervisor (Host)",
  BS:"Bar & Service", CS1:"Chef de Service", CS2:"Assistant Chef de Service", CS2W:"Assistant Chef de Service, Wein",
  SW1:"Sommelier", SW2:"Wine Waiter / Assistent", OC:"Office & Daily MeP, Stewarding (zählt wie Team Market)",
  OST:"Office & Daily MeP in Service-Uniform", OTB:"Office, Daily MeP & Buffet Market", OS:"Office & Daily MeP in Service-Uniform",
  KC:"Chef de Cuisine", KS:"Sous-Chef", Sc:"Saucier", E:"Entremetier", G:"Garde-manger", T:"Tournant", TM:"Tournant «The Market»",
  K:"Casserolier", TK:"Tournant / Casserolier", K1:"Entremetier", K2:"Saucier", K3:"Garde-manger",
  A1:"Entremetier Asia", A2:"Saucier Asia", A3:"Garde-manger Asia", TA:"Tournant Asia", P:"Pâtisserie", C:"Küche Campigiana"
};
function planSchicht(s, slotId){
  const sl = slots().find(x => x.id === slotId);
  if(!s || !sl || !Array.isArray(s.schichtPlan)) return "";
  return String(s.schichtPlan[sl.idx - 1] || "").trim();
}
function schichtPill(s, slotId){
  const c = planSchicht(s, slotId); if(!c) return null;
  const info = SCHICHT_INFO[c] || SCHICHT_INFO[c.toUpperCase()] || "";
  return el("span",{class:"spill" + (c.toUpperCase() === "OC" ? " oc" : ""), title: "Schicht · Shift " + c + (info ? ": " + info : ""), text:c});
}

/* Zurück zur persönlichen Startseite: liegt eine Ebene höher (…/mein.html) */
function n2HomeHref(){
  return /^https?:/.test(location.protocol) ? "../mein.html" : "https://pilman1982.github.io/praxisrapport/mein.html";
}
{ const h = document.getElementById("btnHome"); if(h){ h.setAttribute("href", n2HomeHref());  } }

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
    ["foto","nick","klasse","gruppe","mail","email","ortPlan","tmTage","schichtPlan"].forEach(k => {
      if(n[k] === undefined || JSON.stringify(n[k]) === JSON.stringify(s[k])) return;
      /* Nickname: ein leeres Feld im Paket löscht keinen Nickname, der auf dem Gerät eingetragen wurde */
      if(k === "nick" && !String(n[k] || "").trim()) return;
      s[k] = n[k]; ch = true;
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
setTimeout(() => n2Handoff(o => onLoadBackup({target:{files:[new File([JSON.stringify(o)], "paket.json")], value:""}})), 30);
