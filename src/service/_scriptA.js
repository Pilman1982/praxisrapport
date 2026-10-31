const LOGO = "data:image/png;base64,__LOGO__";

const W = {l:0.25, m:0.5, s:1.0};            // leicht / mittel / schwer
const CAP_NEG = -1.5, CAP_POS = 1.5;         // max. Abweichung pro Tag und Kriterium: Spanne 3.00 bis 6.00 (seit 31.10.2026, vorher +1.00)
/* Doppelt gewichtete Kriterien, fest (Entscheid 31.10.2026): Hygiene immer doppelt; im Service zusaetzlich die Gastgeberhaltung. */
const DOUBLE_CRITS = ["gas", "hyg"];
const critWeight = k => DOUBLE_CRITS.includes(k) ? 2 : 1;

const WDAYS = [
  {k:"mo", de:"Montag",     en:"Monday",    th:"วันจันทร์", zh:"星期一"},
  {k:"tu", de:"Dienstag",   en:"Tuesday",   th:"วันอังคาร", zh:"星期二"},
  {k:"we", de:"Mittwoch",   en:"Wednesday", th:"วันพุธ", zh:"星期三"},
  {k:"th", de:"Donnerstag", en:"Thursday",  th:"วันพฤหัสบดี", zh:"星期四"},
  {k:"fr", de:"Freitag",    en:"Friday",    th:"วันศุกร์", zh:"星期五"},
  {k:"sa", de:"Samstag",    en:"Saturday",  th:"วันเสาร์", zh:"星期六"},
  {k:"su", de:"Sonntag",    en:"Sunday",    th:"วันอาทิตย์", zh:"星期日"}
];

