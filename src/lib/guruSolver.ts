/**
 * Instant numerical solver for Matric (Class 9-10) Physics and Chemistry. No AI: it reads the numbers and units in the
 * student's question, picks the board formula, and writes the full board layout (Given, To find, Formula, Working, Answer).
 * If it is not sure which formula the student means, it returns null and the Guru tries something else.
 */

export interface GuruCard {
  headline: string;
  explanation: string;
  formula?: string;
  unit?: string;
  stepTip: string;
  challengeQuestion: string;
  source: "solver" | "bank";
}

type Kind =
  | "velocity" | "accel" | "time" | "mass" | "force" | "energy" | "power" | "voltage" | "current"
  | "resistance" | "length" | "charge" | "frequency" | "moles" | "volume" | "area" | "pressure";

interface Qty { kind: Kind; value: number; raw: string }

const fmt = (x: number) => {
  if (!isFinite(x)) return String(x);
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a));
    const m = x / Math.pow(10, e);
    return `${+m.toFixed(3)} × 10^${e}`;
  }
  return String(+x.toFixed(3));
};

/** Pull "number + unit" pairs out of free text, converting to SI. Case matters for A, V, W, N, J, C. */
export function extractQuantities(text: string): Qty[] {
  const t = text.replace(/×/g, "x").replace(/²/g, "^2").replace(/³/g, "^3").replace(/μ/g, "u").replace(/Ω/g, " ohm");
  const num = String.raw`(-?\d+(?:\.\d+)?(?:\s*[xX*]\s*10\s*\^\s*\(?-?\d+\)?)?)`;
  const units: [RegExp, Kind, number][] = [
    [/^(m\/s\^2|m\/s2|ms\^-2|ms-2|m s\^-2)/, "accel", 1],
    [/^(km\/h|kmh|km\/hr)/, "velocity", 1000 / 3600],
    [/^(m\/s|ms\^-1|ms-1)/, "velocity", 1],
    [/^(kg)\b/, "mass", 1],
    [/^(g|gram|grams)\b/, "mass", 0.001],
    [/^(kN)\b/, "force", 1000],
    [/^(N|newton|newtons)\b/, "force", 1],
    [/^(kJ)\b/, "energy", 1000],
    [/^(J|joule|joules)\b/, "energy", 1],
    [/^(kW)\b/, "power", 1000],
    [/^(W|watt|watts)\b/, "power", 1],
    [/^(V|volt|volts)\b/, "voltage", 1],
    [/^(mA)\b/, "current", 0.001],
    [/^(A|amp|amps|ampere|amperes)\b/, "current", 1],
    [/^(k\s?ohm|kohm)\b/, "resistance", 1000],
    [/^(ohm|ohms)\b/, "resistance", 1],
    [/^(uC|microcoulomb)/, "charge", 1e-6],
    [/^(C|coulomb|coulombs)\b/, "charge", 1],
    [/^(Hz|hz|hertz)\b/, "frequency", 1],
    [/^(mol|mole|moles)\b/, "moles", 1],
    [/^(dm\^3|dm3|L|litre|litres|liter|liters)\b/, "volume", 1], // volume kept in dm³ for molarity
    [/^(cm\^3|cm3|ml|mL)\b/, "volume", 0.001],
    [/^(m\^2|m2)\b/, "area", 1],
    [/^(cm\^2|cm2)\b/, "area", 1e-4],
    [/^(Pa|N\/m\^2|N\/m2)\b/, "pressure", 1],
    [/^(km)\b/, "length", 1000],
    [/^(cm)\b/, "length", 0.01],
    [/^(mm)\b/, "length", 0.001],
    [/^(m|meter|meters|metre|metres)\b/, "length", 1],
    [/^(ms)\b/, "time", 0.001],
    [/^(min|minute|minutes)\b/, "time", 60],
    [/^(h|hr|hour|hours|ghante|ghanta)\b/, "time", 3600],
    [/^(s|sec|second|seconds|secs|second\w*)\b/, "time", 1],
  ];
  const out: Qty[] = [];
  const re = new RegExp(num + String.raw`\s*`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const rest = t.slice(m.index + m[0].length);
    let value = parseFloat(m[1]);
    const exp = m[1].match(/10\s*\^\s*\(?(-?\d+)/);
    if (exp) value = parseFloat(m[1]) * Math.pow(10, parseInt(exp[1], 10));
    for (const [u, kind, factor] of units) {
      const um = rest.match(u);
      if (um) {
        out.push({ kind, value: value * factor, raw: `${m[1].trim()} ${um[0]}` });
        break;
      }
    }
  }
  return out;
}

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));
const isRomanUrdu = (t: string) => /\b(kya|kitna|kitni|kitne|ka|ki|ke|hai|hain|batao|nikalo|maloom|karo|se|mein|agar)\b/.test(t);

function card(
  title: string,
  given: string[],
  find: string,
  formula: string,
  working: string[],
  answer: string,
  unit: string,
  tip: string,
  check: string,
  urduNote: string,
  roman: boolean
): GuruCard {
  const lines = [
    roman ? `Samjho: ${urduNote}` : "",
    "GIVEN DATA:",
    ...given.map((g) => `  ${g}`),
    `TO FIND: ${find}`,
    `FORMULA: ${formula}`,
    "SOLUTION:",
    ...working.map((w) => `  ${w}`),
    `ANSWER: ${answer}`,
  ].filter(Boolean);
  return { headline: `🧮 ${title} — solved step by step`, explanation: lines.join("\n"), formula, unit, stepTip: tip, challengeQuestion: check, source: "solver" };
}

// ---------------- Chemistry helpers ----------------
const ATOMIC: Record<string, number> = {
  H: 1, He: 4, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 63.5, Zn: 65, Ag: 108, I: 127, Ba: 137,
};
export function molarMass(formula: string): number | null {
  const f = formula.replace(/₂/g, "2").replace(/₃/g, "3").replace(/₄/g, "4");
  const parse = (s: string): number | null => {
    let total = 0;
    const re = /\(([^()]+)\)(\d*)|([A-Z][a-z]?)(\d*)/g;
    let m: RegExpExecArray | null;
    let consumed = 0;
    while ((m = re.exec(s))) {
      consumed += m[0].length;
      if (m[1]) {
        const inner = parse(m[1]);
        if (inner === null) return null;
        total += inner * (m[2] ? parseInt(m[2], 10) : 1);
      } else {
        const a = ATOMIC[m[3]];
        if (a === undefined) return null;
        total += a * (m[4] ? parseInt(m[4], 10) : 1);
      }
    }
    return consumed === s.length ? total : null;
  };
  return parse(f);
}
function findFormula(text: string): string | null {
  const cands = text.match(/\b(?:[A-Z][a-z]?\d*|\([A-Za-z0-9]+\)\d*){1,8}\b/g) || [];
  for (const c of cands.sort((a, b) => b.length - a.length)) {
    if (c.length < 2 && !/^[A-Z]$/.test(c)) continue;
    if (/^(I|A|V|W|N|J|C|K)$/.test(c)) continue; // single letters are usually units, not compounds
    if (/\d/.test(c) || c.length >= 3 || ["CO", "NO", "HCl", "NaCl", "KCl", "HI"].includes(c)) {
      const mm = molarMass(c);
      if (mm) return c;
    }
  }
  return null;
}

/** Try to solve. Returns null when the question is not a recognisable numerical. */
export function solveNumerical(question: string): GuruCard | null {
  const raw = question;
  const t = question.toLowerCase();
  const roman = isRomanUrdu(t);
  const q = extractQuantities(raw);
  const all = (k: Kind) => q.filter((x) => x.kind === k);
  const one = (k: Kind) => all(k)[0];
  const fromRest = has(t, "rest", "sakoon", "sukoon", "start from 0", "0 se", "from 0", "starts from rest");

  // --- Chemistry: moles / molecules / mass from a formula ---
  const formula = findFormula(raw);
  if (formula && (has(t, "mole", "mol", "molecule", "particles", "gram", "mass") || one("mass") || one("moles"))) {
    const M = molarMass(formula)!;
    const mass = one("mass");
    const moles = one("moles");
    if (mass && !moles) {
      const g = mass.value * 1000;
      const n = g / M;
      const N = n * 6.022e23;
      const wantMolecules = has(t, "molecule", "particles", "atoms");
      return card(
        `Moles${wantMolecules ? " and molecules" : ""} in ${fmt(g)} g of ${formula}`,
        [`Mass of ${formula} = ${fmt(g)} g`, `Molar mass of ${formula} = ${fmt(M)} g/mol`],
        wantMolecules ? "number of moles (n) and number of molecules (N)" : "number of moles (n)",
        wantMolecules ? "n = mass / molar mass ;  N = n × Nₐ (Nₐ = 6.022 × 10²³)" : "n = mass / molar mass",
        [`n = ${fmt(g)} / ${fmt(M)} = ${fmt(n)} mol`, ...(wantMolecules ? [`N = ${fmt(n)} × 6.022 × 10²³ = ${fmt(N)}`] : [])],
        wantMolecules ? `${fmt(n)} mol and ${fmt(N)} molecules` : `${fmt(n)} mol`,
        "mol (and number of particles has no unit)",
        "Always work out the molar mass first and show it in Given Data.",
        `How many moles are in ${fmt(2 * g)} g of ${formula}?`,
        "Pehle molar mass nikalo (atomic masses jama karo), phir mass ko molar mass se divide karo.",
        roman
      );
    }
    if (moles && !mass && has(t, "mass", "gram", "kitne gram", "how many grams")) {
      const g = moles.value * M;
      return card(
        `Mass of ${fmt(moles.value)} mol of ${formula}`,
        [`Moles of ${formula} = ${fmt(moles.value)} mol`, `Molar mass = ${fmt(M)} g/mol`],
        "mass (m)",
        "mass = n × molar mass",
        [`m = ${fmt(moles.value)} × ${fmt(M)} = ${fmt(g)} g`],
        `${fmt(g)} g`,
        "g",
        "Write the unit g/mol with the molar mass; examiners check it.",
        `What is the mass of 0.5 mol of ${formula}?`,
        "Moles ko molar mass se multiply karo.",
        roman
      );
    }
  }

  // --- Molarity ---
  if (has(t, "molarity", "molar solution", " m solution") || (one("moles") && one("volume"))) {
    const n = one("moles");
    const v = one("volume");
    if (n && v) {
      const M = n.value / v.value;
      return card("Molarity of a solution", [`Moles of solute = ${fmt(n.value)} mol`, `Volume of solution = ${fmt(v.value)} dm³`], "molarity (M)", "M = moles of solute / volume of solution (dm³)",
        [`M = ${fmt(n.value)} / ${fmt(v.value)} = ${fmt(M)} mol dm⁻³`], `${fmt(M)} mol dm⁻³ (${fmt(M)} M)`, "mol dm⁻³", "Convert cm³ to dm³ by dividing by 1000 before using the formula.",
        "What is the molarity if the same moles are dissolved in double the volume?", "Moles ko volume (dm³ mein) se divide karo.", roman);
    }
  }

  // --- pH ---
  const ph = t.match(/\[h\+?\]\s*=?\s*([\d.]+\s*[x×*]\s*10\s*\^?\s*-?\d+|[\d.e-]+)/) || t.match(/h\+\s*(?:concentration|=)\s*([\d.]+\s*[x×*]\s*10\s*\^?\s*-?\d+|[\d.e-]+)/);
  if (has(t, "ph") && ph) {
    const s = ph[1];
    const e = s.match(/10\s*\^?\s*(-?\d+)/);
    const h = e ? parseFloat(s) * Math.pow(10, parseInt(e[1], 10)) : parseFloat(s);
    if (h > 0) {
      const val = -Math.log10(h);
      return card("pH of a solution", [`[H⁺] = ${fmt(h)} mol dm⁻³`], "pH", "pH = −log[H⁺]", [`pH = −log(${fmt(h)}) = ${fmt(val)}`], `pH = ${fmt(val)} (${val < 7 ? "acidic" : val > 7 ? "basic" : "neutral"})`, "no unit",
        "pH has no unit. Below 7 is acidic, 7 neutral, above 7 basic.", "What is the pH if [H⁺] = 1 × 10⁻⁵ mol dm⁻³?", "[H⁺] ka −log lo.", roman);
    }
  }

  // --- Resistors in series / parallel ---
  const Rs = all("resistance");
  if (Rs.length >= 2 && has(t, "series", "parallel", "silsila", "mutawazi")) {
    const vals = Rs.map((r) => r.value);
    const series = vals.reduce((a, b) => a + b, 0);
    const par = 1 / vals.reduce((a, b) => a + 1 / b, 0);
    const V = one("voltage");
    const both = has(t, "series") && has(t, "parallel");
    const work: string[] = [];
    if (has(t, "series") || both) work.push(`Series: R = ${vals.map(fmt).join(" + ")} = ${fmt(series)} Ω${V ? ` ; I = V/R = ${fmt(V.value)}/${fmt(series)} = ${fmt(V.value / series)} A` : ""}`);
    if (has(t, "parallel") || both) work.push(`Parallel: 1/R = ${vals.map((v) => `1/${fmt(v)}`).join(" + ")} → R = ${fmt(par)} Ω${V ? ` ; I = V/R = ${fmt(V.value)}/${fmt(par)} = ${fmt(V.value / par)} A` : ""}`);
    return card("Equivalent resistance", [...vals.map((v, i) => `R${i + 1} = ${fmt(v)} Ω`), ...(V ? [`V = ${fmt(V.value)} V`] : [])], `equivalent resistance${V ? " and current" : ""}`,
      "Series: R = R1 + R2 + …   |   Parallel: 1/R = 1/R1 + 1/R2 + …", work,
      [has(t, "series") || both ? `series ${fmt(series)} Ω` : "", has(t, "parallel") || both ? `parallel ${fmt(par)} Ω` : ""].filter(Boolean).join(", "), "Ω (ohm)",
      "In parallel the total resistance is always smaller than the smallest resistor. Use that to check your answer.", "What happens to the total resistance if one more resistor is added in parallel?",
      "Series mein resistance jama hoti hai; parallel mein ulta (1/R) jama karte hain.", roman);
  }

  // --- Ohm's law V = IR ---
  const V = one("voltage"), I = one("current"), R = Rs[0];
  if ((has(t, "current", "resistance", "voltage", "potential", "ohm", "volt") || (V && I) || (V && R) || (I && R)) && [V, I, R].filter(Boolean).length === 2 && !has(t, "power", "energy", "watt")) {
    if (V && R && !I) return card("Current using Ohm's law", [`V = ${fmt(V.value)} V`, `R = ${fmt(R.value)} Ω`], "current (I)", "V = IR  →  I = V / R", [`I = ${fmt(V.value)} / ${fmt(R.value)} = ${fmt(V.value / R.value)} A`], `I = ${fmt(V.value / R.value)} A`, "A (ampere)", "State that temperature is constant when you quote Ohm's law.", "If the voltage is doubled, what happens to the current?", "Current = voltage ÷ resistance.", roman);
    if (V && I && !R) return card("Resistance using Ohm's law", [`V = ${fmt(V.value)} V`, `I = ${fmt(I.value)} A`], "resistance (R)", "V = IR  →  R = V / I", [`R = ${fmt(V.value)} / ${fmt(I.value)} = ${fmt(V.value / I.value)} Ω`], `R = ${fmt(V.value / I.value)} Ω`, "Ω (ohm)", "Convert mA to A before dividing.", "If the current doubles at the same voltage, what is the new resistance?", "Resistance = voltage ÷ current.", roman);
    if (I && R && !V) return card("Voltage using Ohm's law", [`I = ${fmt(I.value)} A`, `R = ${fmt(R.value)} Ω`], "potential difference (V)", "V = IR", [`V = ${fmt(I.value)} × ${fmt(R.value)} = ${fmt(I.value * R.value)} V`], `V = ${fmt(I.value * R.value)} V`, "V (volt)", "Write V = IR first, then substitute.", "What voltage is needed to pass 2 A through the same resistor?", "Voltage = current × resistance.", roman);
  }

  // --- Electrical power P = VI, energy ---
  if (has(t, "power", "watt", "taqat") && V && I) {
    const P = V.value * I.value;
    return card("Electrical power", [`V = ${fmt(V.value)} V`, `I = ${fmt(I.value)} A`], "power (P)", "P = V × I", [`P = ${fmt(V.value)} × ${fmt(I.value)} = ${fmt(P)} W`], `P = ${fmt(P)} W`, "W (watt)", "1 kW = 1000 W; electricity bills use kWh.", "How much energy in kWh does it use in 5 hours?", "Power = voltage × current.", roman);
  }

  const Pw = one("power");
  if (Pw && V && !I && has(t, "current", "ampere")) {
    const cur = Pw.value / V.value;
    return card("Current from power and voltage", [`P = ${fmt(Pw.value)} W`, `V = ${fmt(V.value)} V`], "current (I)", "P = V I  →  I = P / V", [`I = ${fmt(Pw.value)} / ${fmt(V.value)} = ${fmt(cur)} A`], `I = ${fmt(cur)} A`, "A (ampere)", "Rearrange P = VI before substituting.", "What is the resistance of this bulb? (R = V/I)", "Current = power ÷ voltage.", roman);
  }
  if (Pw && V && has(t, "resistance")) {
    const res = (V.value * V.value) / Pw.value;
    return card("Resistance from power and voltage", [`P = ${fmt(Pw.value)} W`, `V = ${fmt(V.value)} V`], "resistance (R)", "P = V² / R  →  R = V² / P", [`R = (${fmt(V.value)})² / ${fmt(Pw.value)} = ${fmt(res)} Ω`], `R = ${fmt(res)} Ω`, "Ω (ohm)", "Square the voltage first.", "What current does it draw?", "Voltage ka square ÷ power.", roman);
  }
  if (Pw && one("time") && has(t, "energy", "kwh", "units", "bill")) {
    const hrs = one("time")!.value / 3600;
    const kwh = (Pw.value / 1000) * hrs;
    return card("Electrical energy (kWh)", [`P = ${fmt(Pw.value)} W = ${fmt(Pw.value / 1000)} kW`, `t = ${fmt(hrs)} h`], "energy in kWh (units)", "E = P × t", [`E = ${fmt(Pw.value / 1000)} kW × ${fmt(hrs)} h = ${fmt(kwh)} kWh`], `${fmt(kwh)} kWh (units)`, "kWh", "Convert W to kW and time to hours for kWh.", "What is the cost at Rs 50 per unit?", "kW × ghante = units.", roman);
  }

  // --- Charge Q = It ---
  if (has(t, "charge") && I && one("time") && !all("charge").length) {
    const tt = one("time")!.value;
    return card("Charge", [`I = ${fmt(I.value)} A`, `t = ${fmt(tt)} s`], "charge (Q)", "Q = I × t", [`Q = ${fmt(I.value)} × ${fmt(tt)} = ${fmt(I.value * tt)} C`], `Q = ${fmt(I.value * tt)} C`, "C (coulomb)", "Convert minutes to seconds first.", "What current carries 60 C in 30 s?", "Charge = current × time.", roman);
  }

  // --- Coulomb's law ---
  const Qs = all("charge"), r = one("length");
  if (Qs.length >= 2 && r && has(t, "force", "coulomb", "quwwat")) {
    const F = (9e9 * Qs[0].value * Qs[1].value) / (r.value * r.value);
    return card("Electrostatic force (Coulomb's law)", [`q1 = ${fmt(Qs[0].value)} C`, `q2 = ${fmt(Qs[1].value)} C`, `r = ${fmt(r.value)} m`, "k = 9 × 10⁹ N m² C⁻²"], "force (F)", "F = k q1 q2 / r²",
      [`F = 9 × 10⁹ × ${fmt(Qs[0].value)} × ${fmt(Qs[1].value)} / (${fmt(r.value)})²`, `F = ${fmt(Math.abs(F))} N`], `F = ${fmt(Math.abs(F))} N`, "N (newton)",
      "Convert μC to C (× 10⁻⁶) and cm to m before substituting.", "What happens to F if the distance is doubled?", "Charges ko multiply karo, k se multiply karo, distance ke square se divide karo.", roman);
  }

  // --- Mirror / lens formula ---
  if (has(t, "mirror", "lens", "focal", "aina", "aaina", "image")) {
    const lens = has(t, "lens");
    // Read every "<number> cm", then label them: focal length, object height, and the object distance is what is left
    const cms: { v: number; at: number; len: number }[] = [];
    const cmRe = /(-?\d+(?:\.\d+)?)\s*cm\b/g;
    let cm: RegExpExecArray | null;
    while ((cm = cmRe.exec(t))) cms.push({ v: parseFloat(cm[1]), at: cm.index, len: cm[0].length });
    const after = (c: { at: number; len: number }) => t.slice(c.at + c.len, c.at + c.len + 12);
    const before = (c: { at: number }) => t.slice(Math.max(0, c.at - 22), c.at);
    const fC = cms.find((c) => /focal length|f\s*=\s*$|focus/.test(before(c)));
    const hC = cms.find((c) => c !== fC && (/^\s*(high|tall|long|height)/.test(after(c)) || /height[^\d]*$/.test(before(c))));
    const pC = cms.find((c) => c !== fC && c !== hC);
    const f = fC ? [null, String(fC.v)] : t.match(/f\s*=\s*(-?[\d.]+)/);
    const p = pC ? [null, String(pC.v)] : t.match(/p\s*=\s*(-?[\d.]+)/);
    const h = hC ? [null, String(hC.v)] : null;
    if (f && p) {
      const fv = parseFloat(f[1]!) * (has(t, "convex mirror", "concave lens", "diverging") && parseFloat(f[1]!) > 0 ? -1 : 1);
      const pv = parseFloat(p[1]!);
      const inv = 1 / fv - 1 / pv;
      const qv = 1 / inv;
      const mag = Math.abs(qv / pv);
      const hv = h ? parseFloat(h[1]!) : null;
      const nature = qv > 0 ? "real and inverted" : "virtual and erect";
      return card(`${lens ? "Lens" : "Mirror"} formula`, [`f = ${fmt(fv)} cm`, `p = ${fmt(pv)} cm`, ...(hv ? [`object height = ${fmt(hv)} cm`] : [])], `image distance (q)${hv ? ", image height" : ""} and nature`,
        "1/f = 1/p + 1/q  ;  m = q/p (real-is-positive convention)",
        [`1/q = 1/f − 1/p = 1/${fmt(fv)} − 1/${fmt(pv)}`, `q = ${fmt(qv)} cm`, `m = |q/p| = ${fmt(mag)}`, ...(hv ? [`image height = m × object height = ${fmt(mag * hv)} cm`] : [])],
        `q = ${fmt(qv)} cm; image is ${nature}, ${mag > 1 ? "magnified" : mag < 1 ? "diminished" : "same size"}${hv ? `, ${fmt(mag * hv)} cm tall` : ""}`, "cm",
        "Use the sign convention from your textbook: real is positive; a convex mirror and a concave lens have negative f.", "Where must the object be placed to get an image of the same size?",
        "1/q = 1/f − 1/p se q nikalo; q positive ho to image real hai.", roman);
    }
  }

  // --- Simple pendulum ---
  if (has(t, "pendulum", "pendolum", "time period") && one("length") && !one("time")) {
    const L = one("length")!.value;
    const g = /g\s*=\s*9\.8/.test(t) ? 9.8 : 10;
    const T = 2 * Math.PI * Math.sqrt(L / g);
    return card("Time period of a simple pendulum", [`L = ${fmt(L)} m`, `g = ${g} m/s²`], "time period (T)", "T = 2π √(L / g)", [`T = 2 × 3.14 × √(${fmt(L)} / ${g})`, `T = ${fmt(T)} s`], `T = ${fmt(T)} s`, "s (second)",
      "The mass of the bob does not appear in the formula: changing it does not change T.", "What happens to T if the length is made 4 times longer?", "Length ko g se divide karo, square root lo, 2π se multiply karo.", roman);
  }

  // --- Waves v = fλ, T = 1/f ---
  if (has(t, "wave", "wavelength", "frequency", "lehar") ) {
    const fq = one("frequency"), lam = one("length"), vel = one("velocity");
    if (fq && lam && !vel) return card("Wave speed", [`f = ${fmt(fq.value)} Hz`, `λ = ${fmt(lam.value)} m`], "wave speed (v)", "v = f λ", [`v = ${fmt(fq.value)} × ${fmt(lam.value)} = ${fmt(fq.value * lam.value)} m/s`], `v = ${fmt(fq.value * lam.value)} m/s`, "m/s", "Convert cm to m before multiplying.", "If frequency doubles in the same medium, what happens to λ?", "Speed = frequency × wavelength.", roman);
    if (fq && vel && !lam) return card("Wavelength", [`f = ${fmt(fq.value)} Hz`, `v = ${fmt(vel.value)} m/s`], "wavelength (λ)", "v = f λ → λ = v / f", [`λ = ${fmt(vel.value)} / ${fmt(fq.value)} = ${fmt(vel.value / fq.value)} m`], `λ = ${fmt(vel.value / fq.value)} m`, "m", "Write v = fλ first, then rearrange.", "What is the time period of this wave?", "Wavelength = speed ÷ frequency.", roman);
    if (lam && vel && !fq) return card("Frequency", [`λ = ${fmt(lam.value)} m`, `v = ${fmt(vel.value)} m/s`], "frequency (f)", "v = f λ → f = v / λ", [`f = ${fmt(vel.value)} / ${fmt(lam.value)} = ${fmt(vel.value / lam.value)} Hz`], `f = ${fmt(vel.value / lam.value)} Hz`, "Hz", "Frequency is measured in hertz (Hz) = 1/s.", "What is the time period T = 1/f?", "Frequency = speed ÷ wavelength.", roman);
  }
  if (has(t, "time period", "period") && one("frequency")) {
    const fq = one("frequency")!.value;
    return card("Time period from frequency", [`f = ${fmt(fq)} Hz`], "time period (T)", "T = 1 / f", [`T = 1 / ${fmt(fq)} = ${fmt(1 / fq)} s`], `T = ${fmt(1 / fq)} s`, "s", "T and f are reciprocals of each other.", "What is f if T = 0.5 s?", "Time period = 1 ÷ frequency.", roman);
  }

  // --- Kinematics ---
  const vels = all("velocity"), tm = one("time"), acc = one("accel"), dist = one("length");
  let vi: number | null = null, vf: number | null = null;
  if (vels.length >= 2) { vi = vels[0].value; vf = vels[1].value; }
  else if (vels.length === 1 && fromRest) { vi = 0; vf = vels[0].value; }
  if (has(t, "accel", "asra", "acceleration") && vi !== null && vf !== null && tm && !acc) {
    const a = (vf - vi) / tm.value;
    return card("Acceleration", [`vi = ${fmt(vi)} m/s`, `vf = ${fmt(vf)} m/s`, `t = ${fmt(tm.value)} s`], "acceleration (a)", "a = (vf − vi) / t", [`a = (${fmt(vf)} − ${fmt(vi)}) / ${fmt(tm.value)}`, `a = ${fmt(a)} m/s²`], `a = ${fmt(a)} m/s²${a < 0 ? " (deceleration)" : ""}`, "m/s²",
      "Starting 'from rest' means vi = 0. Write it in Given Data.", "How far does it travel in that time? Use S = vi·t + ½at².", "Velocity mein tabdeeli ko time se divide karo.", roman);
  }
  if (acc && tm && (has(t, "final velocity", "velocity", "speed", "raftar", "raftaar")) && !has(t, "distance", "fasla")) {
    const v0 = vi ?? (fromRest ? 0 : vels[0]?.value ?? 0);
    const v = v0 + acc.value * tm.value;
    return card("Final velocity", [`vi = ${fmt(v0)} m/s`, `a = ${fmt(acc.value)} m/s²`, `t = ${fmt(tm.value)} s`], "final velocity (vf)", "vf = vi + a t", [`vf = ${fmt(v0)} + ${fmt(acc.value)} × ${fmt(tm.value)}`, `vf = ${fmt(v)} m/s`], `vf = ${fmt(v)} m/s`, "m/s",
      "This is the first equation of motion; it works only for uniform acceleration.", "What distance is covered in this time?", "Shuru ki velocity mein acceleration × time jama karo.", roman);
  }
  if (acc && tm && has(t, "distance", "fasla", "displacement", "how far")) {
    const v0 = vi ?? (fromRest ? 0 : vels[0]?.value ?? 0);
    const S = v0 * tm.value + 0.5 * acc.value * tm.value * tm.value;
    return card("Distance with uniform acceleration", [`vi = ${fmt(v0)} m/s`, `a = ${fmt(acc.value)} m/s²`, `t = ${fmt(tm.value)} s`], "distance (S)", "S = vi t + ½ a t²", [`S = ${fmt(v0)} × ${fmt(tm.value)} + ½ × ${fmt(acc.value)} × (${fmt(tm.value)})²`, `S = ${fmt(S)} m`], `S = ${fmt(S)} m`, "m",
      "This is the second equation of motion. Square the time before multiplying.", "What is the final velocity at the end of this time?", "vi·t aur ½·a·t² jama karo.", roman);
  }
  if (dist && tm && !acc && vels.length === 0 && has(t, "speed", "velocity", "raftar", "raftaar")) {
    const v = dist.value / tm.value;
    return card("Speed", [`S = ${fmt(dist.value)} m`, `t = ${fmt(tm.value)} s`], "speed (v)", "v = S / t", [`v = ${fmt(dist.value)} / ${fmt(tm.value)} = ${fmt(v)} m/s`], `v = ${fmt(v)} m/s`, "m/s", "Convert km to m and hours/minutes to seconds first.", "What is this speed in km/h?", "Fasla ÷ waqt.", roman);
  }
  if (vels.length === 1 && tm && has(t, "distance", "fasla", "how far") && !acc) {
    const S = vels[0].value * tm.value;
    return card("Distance at constant speed", [`v = ${fmt(vels[0].value)} m/s`, `t = ${fmt(tm.value)} s`], "distance (S)", "S = v t", [`S = ${fmt(vels[0].value)} × ${fmt(tm.value)} = ${fmt(S)} m`], `S = ${fmt(S)} m`, "m", "Only valid when the speed stays constant.", "How long would it take to cover double the distance?", "Raftaar × waqt.", roman);
  }

  // --- Dynamics ---
  const mass = one("mass"), force = one("force");
  if (mass && acc && !force && has(t, "force", "quwwat", "newton")) {
    const F = mass.value * acc.value;
    return card("Force (Newton's second law)", [`m = ${fmt(mass.value)} kg`, `a = ${fmt(acc.value)} m/s²`], "force (F)", "F = m a", [`F = ${fmt(mass.value)} × ${fmt(acc.value)} = ${fmt(F)} N`], `F = ${fmt(F)} N`, "N (newton)", "1 N = 1 kg m/s². Convert grams to kg first.", "What acceleration would the same force give a mass twice as big?", "Mass × acceleration.", roman);
  }
  if (force && mass && !acc && has(t, "accel", "asra")) {
    const a = force.value / mass.value;
    return card("Acceleration (Newton's second law)", [`F = ${fmt(force.value)} N`, `m = ${fmt(mass.value)} kg`], "acceleration (a)", "F = m a → a = F / m", [`a = ${fmt(force.value)} / ${fmt(mass.value)} = ${fmt(a)} m/s²`], `a = ${fmt(a)} m/s²`, "m/s²", "Write F = ma first, then rearrange.", "What force gives the same mass an acceleration of 5 m/s²?", "Force ÷ mass.", roman);
  }
  if (mass && has(t, "weight", "wazan") && !force) {
    const g = /g\s*=\s*9\.8/.test(t) ? 9.8 : 10;
    return card("Weight", [`m = ${fmt(mass.value)} kg`, `g = ${g} m/s²`], "weight (W)", "W = m g", [`W = ${fmt(mass.value)} × ${g} = ${fmt(mass.value * g)} N`], `W = ${fmt(mass.value * g)} N`, "N", "Mass is in kg, weight is a force in N. Do not mix them up.", "What would the weight be on the Moon (g = 1.6 m/s²)?", "Mass × g.", roman);
  }
  if (mass && vels.length && has(t, "momentum")) {
    const p = mass.value * vels[0].value;
    return card("Momentum", [`m = ${fmt(mass.value)} kg`, `v = ${fmt(vels[0].value)} m/s`], "momentum (p)", "p = m v", [`p = ${fmt(mass.value)} × ${fmt(vels[0].value)} = ${fmt(p)} kg m/s`], `p = ${fmt(p)} kg m/s`, "kg m/s (or N s)", "Momentum is a vector: it has the direction of the velocity.", "What force stops it in 2 s?", "Mass × velocity.", roman);
  }

  // --- Work, energy, power ---
  if (mass && vels.length && has(t, "kinetic", "k.e", "ke ")) {
    const KE = 0.5 * mass.value * vels[0].value ** 2;
    return card("Kinetic energy", [`m = ${fmt(mass.value)} kg`, `v = ${fmt(vels[0].value)} m/s`], "kinetic energy (K.E.)", "K.E. = ½ m v²", [`K.E. = ½ × ${fmt(mass.value)} × (${fmt(vels[0].value)})²`, `K.E. = ${fmt(KE)} J`], `K.E. = ${fmt(KE)} J`, "J (joule)", "Square the velocity before multiplying by the mass.", "What happens to K.E. if the speed is doubled?", "Aadhi mass × velocity ka square.", roman);
  }
  if (mass && dist && has(t, "potential", "p.e", "height", "unchai")) {
    const g = /g\s*=\s*9\.8/.test(t) ? 9.8 : 10;
    const PE = mass.value * g * dist.value;
    return card("Potential energy", [`m = ${fmt(mass.value)} kg`, `h = ${fmt(dist.value)} m`, `g = ${g} m/s²`], "potential energy (P.E.)", "P.E. = m g h", [`P.E. = ${fmt(mass.value)} × ${g} × ${fmt(dist.value)} = ${fmt(PE)} J`], `P.E. = ${fmt(PE)} J`, "J (joule)", "Height must be in metres.", "What speed would it have just before hitting the ground?", "Mass × g × unchai.", roman);
  }
  if (force && dist && has(t, "work", "kaam")) {
    const W = force.value * dist.value;
    return card("Work done", [`F = ${fmt(force.value)} N`, `S = ${fmt(dist.value)} m`], "work (W)", "W = F S", [`W = ${fmt(force.value)} × ${fmt(dist.value)} = ${fmt(W)} J`], `W = ${fmt(W)} J`, "J (joule)", "Work is done only when the force moves the body in its own direction.", "What power is used if this work is done in 5 s?", "Force × fasla.", roman);
  }
  const energy = one("energy");
  if (energy && tm && has(t, "power", "taqat", "watt")) {
    const P = energy.value / tm.value;
    return card("Power", [`W = ${fmt(energy.value)} J`, `t = ${fmt(tm.value)} s`], "power (P)", "P = W / t", [`P = ${fmt(energy.value)} / ${fmt(tm.value)} = ${fmt(P)} W`], `P = ${fmt(P)} W`, "W (watt)", "1 horsepower = 746 W in your textbook.", "How much work is done in 1 minute at this power?", "Kaam ÷ waqt.", roman);
  }

  // --- Density, pressure ---
  const vol = one("volume");
  if (mass && vol && has(t, "density", "kasafat")) {
    const m3 = vol.value / 1000; // dm³ -> m³
    const d = mass.value / m3;
    return card("Density", [`m = ${fmt(mass.value)} kg`, `V = ${fmt(m3)} m³`], "density (ρ)", "ρ = m / V", [`ρ = ${fmt(mass.value)} / ${fmt(m3)} = ${fmt(d)} kg/m³`], `ρ = ${fmt(d)} kg/m³`, "kg/m³", "1 dm³ = 0.001 m³ and 1 cm³ = 10⁻⁶ m³.", "Will it float on water (density 1000 kg/m³)?", "Mass ÷ volume.", roman);
  }
  const area = one("area");
  if (force && area && has(t, "pressure", "dabao")) {
    const P = force.value / area.value;
    return card("Pressure", [`F = ${fmt(force.value)} N`, `A = ${fmt(area.value)} m²`], "pressure (P)", "P = F / A", [`P = ${fmt(force.value)} / ${fmt(area.value)} = ${fmt(P)} Pa`], `P = ${fmt(P)} Pa`, "Pa (N/m²)", "Convert cm² to m² (× 10⁻⁴).", "Why are knife edges made sharp?", "Force ÷ area.", roman);
  }

  return null;
}
