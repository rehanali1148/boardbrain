import { FALLBACK_QUESTIONS, QuestionItem } from "./curriculumData";

/**
 * Single source of truth for the teacher exam generator.
 * Used by the API route (server) and by api.ts as the offline fallback, so both always agree.
 *
 * Honesty rules:
 *  - questions never cross class or subject;
 *  - a question is never repeated inside one paper;
 *  - when the bank is too small for the chosen format, the paper is shorter and `bank_notice` says so
 *    (total_marks is always the real sum of the questions printed);
 *  - Section B/C items are standard syllabus questions, labelled as such, never as past-paper questions.
 */

export type TheoryItem = {
  grade: number;
  subject: string;
  chapter: string;
  kind: "short" | "long";
  en: string;
  ur: string;
  key: string;
};

const S = (grade: number, subject: string, chapter: string, en: string, ur: string, key: string): TheoryItem =>
  ({ grade, subject, chapter, kind: "short", en, ur, key });
const L = (grade: number, subject: string, chapter: string, en: string, ur: string, key: string): TheoryItem =>
  ({ grade, subject, chapter, kind: "long", en, ur, key });

export const THEORY_BANK: TheoryItem[] = [
  // ---------------- Physics, Class 9 ----------------
  S(9, "Physics", "Kinematics",
    "Differentiate between distance and displacement. Give one example of each.",
    "فاصلہ اور ہٹاؤ میں فرق بیان کریں۔ ہر ایک کی ایک مثال دیں۔",
    "• Distance: length of actual path, scalar (1.5)\n• Displacement: shortest straight-line distance in a given direction, vector (1.5)\n• One correct example of each (1.0)"),
  S(9, "Physics", "Physical Quantities & Measurement",
    "Define base and derived quantities. Give two examples of each with their SI units.",
    "بنیادی اور ماخوذ مقداروں کی تعریف کریں۔ ہر ایک کی دو مثالیں ان کے ایس آئی یونٹس کے ساتھ دیں۔",
    "• Both definitions (2.0)\n• Two base quantities with units, e.g. length (m), mass (kg) (1.0)\n• Two derived quantities with units, e.g. speed (m/s), force (N) (1.0)"),
  S(9, "Physics", "Dynamics",
    "State Newton's first law of motion. Why is it also called the law of inertia?",
    "نیوٹن کا حرکت کا پہلا قانون بیان کریں۔ اسے قانونِ جمود کیوں کہا جاتا ہے؟",
    "• Correct statement of the law (2.0)\n• Inertia: tendency of a body to resist change in its state of rest or motion, so the law describes inertia (2.0)"),
  S(9, "Physics", "Dynamics",
    "What is friction? Give two advantages of friction and two methods of reducing it.",
    "رگڑ کیا ہے؟ رگڑ کے دو فوائد اور اسے کم کرنے کے دو طریقے لکھیں۔",
    "• Definition of friction (1.0)\n• Two advantages, e.g. walking, writing, brakes (1.5)\n• Two methods, e.g. lubrication, ball bearings, streamlining (1.5)"),
  S(9, "Physics", "Turning Effect of Forces",
    "Define torque. Write its formula and SI unit, and state the two conditions of equilibrium.",
    "ٹارک کی تعریف کریں۔ اس کا فارمولا اور ایس آئی یونٹ لکھیں اور توازن کی دو شرائط بیان کریں۔",
    "• Definition and τ = F × d (1.5)\n• SI unit N m (0.5)\n• First condition ΣF = 0 (1.0)\n• Second condition Στ = 0 (1.0)"),
  S(9, "Physics", "Work & Energy",
    "Define power and write its SI unit. A motor does 3000 J of work in 10 s. Find its power.",
    "طاقت کی تعریف کریں اور اس کا ایس آئی یونٹ لکھیں۔ ایک موٹر ۱۰ سیکنڈ میں ۳۰۰۰ جول کام کرتی ہے۔ اس کی طاقت معلوم کریں۔",
    "• Definition: rate of doing work, P = W/t (1.5)\n• SI unit watt (W) (0.5)\n• P = 3000/10 = 300 W with unit (2.0)"),
  L(9, "Physics", "Kinematics",
    "Derive the second equation of motion, S = vi·t + ½·a·t², using a speed-time graph. Draw the graph and label the axes.",
    "سپیڈ ٹائم گراف کی مدد سے حرکت کی دوسری مساوات S = vi·t + ½·a·t² اخذ کریں۔ گراف بنا کر محوروں پر لیبل لگائیں۔",
    "• Correct speed-time graph with labelled axes (2.0)\n• Distance = area under graph = area of rectangle + area of triangle (2.0)\n• Substitution vf − vi = a·t and simplification (3.0)\n• Final equation stated clearly (1.0)"),
  L(9, "Physics", "Gravitation",
    "State Newton's law of universal gravitation. Derive the expression for the mass of the Earth, M = gR²/G, and calculate it using g = 9.8 m/s², R = 6.4 × 10⁶ m and G = 6.67 × 10⁻¹¹ N m² kg⁻².",
    "نیوٹن کا قانونِ تجاذب بیان کریں۔ زمین کی کمیت کا فارمولا M = gR²/G اخذ کریں اور دی گئی قیمتوں سے اس کا حساب لگائیں۔",
    "• Statement with F = G·m₁m₂/r² (2.0)\n• Equating weight mg to gravitational force and deriving M = gR²/G (3.0)\n• Substitution and answer M ≈ 6.0 × 10²⁴ kg with unit (3.0)"),
  L(9, "Physics", "Kinematics",
    "A car starts from rest and accelerates uniformly at 2 m/s² for 10 s. Find (a) its final velocity (b) the distance covered (c) the distance covered if it then moves at that constant velocity for another 5 s.",
    "ایک کار سکون سے چل کر ۱۰ سیکنڈ تک ۲ میٹر فی سیکنڈ مربع کی یکساں اسراع سے چلتی ہے۔ (الف) آخری رفتار (ب) طے شدہ فاصلہ (ج) اگر وہ مزید ۵ سیکنڈ اسی مستقل رفتار سے چلے تو طے شدہ فاصلہ معلوم کریں۔",
    "• Given data and formulas (2.0)\n• (a) vf = vi + at = 20 m/s (2.0)\n• (b) S = vi·t + ½at² = 100 m (2.0)\n• (c) S = v·t = 20 × 5 = 100 m, units throughout (2.0)"),

  // ---------------- Physics, Class 10 ----------------
  S(10, "Physics", "Simple Harmonic Motion & Waves",
    "Define simple harmonic motion. State its two necessary conditions.",
    "سادہ ہارمونک حرکت کی تعریف کریں اور اس کی دو لازمی شرائط بیان کریں۔",
    "• Definition (2.0)\n• Acceleration is directly proportional to displacement from the mean position (1.0)\n• Acceleration is always directed towards the mean position, a = −kx (1.0)"),
  S(10, "Physics", "Simple Harmonic Motion & Waves",
    "What is resonance? Give two examples of resonance from daily life.",
    "گمک (ریزوننس) کیا ہے؟ روزمرہ زندگی سے اس کی دو مثالیں دیں۔",
    "• Definition: driving frequency equals natural frequency, so amplitude becomes maximum (2.0)\n• Two correct examples, e.g. swing, tuning a radio, soldiers breaking step on a bridge (2.0)"),
  S(10, "Physics", "Sound",
    "What is an echo? State two conditions necessary to hear an echo clearly.",
    "بازگشت (ایکو) کیا ہے؟ بازگشت واضح سننے کے لیے دو ضروری شرائط بیان کریں۔",
    "• Definition: reflection of sound heard after the original sound (2.0)\n• Time gap at least 0.1 s (1.0)\n• Minimum distance about 17 m from the reflecting surface (1.0)"),
  S(10, "Physics", "Geometrical Optics",
    "Define total internal reflection and critical angle. State the two conditions for total internal reflection.",
    "کلی اندرونی انعکاس اور فاصل زاویہ کی تعریف کریں۔ کلی اندرونی انعکاس کی دو شرائط بیان کریں۔",
    "• Both definitions (2.0)\n• Light travels from denser to rarer medium (1.0)\n• Angle of incidence greater than the critical angle (1.0)"),
  S(10, "Physics", "Electrostatics",
    "State Coulomb's law. Write its mathematical form and the value and unit of the constant k.",
    "کولمب کا قانون بیان کریں۔ اس کی ریاضیاتی شکل اور مستقل k کی قیمت اور یونٹ لکھیں۔",
    "• Statement (1.5)\n• F = k·q₁q₂/r² (1.5)\n• k = 9 × 10⁹ N m² C⁻² (1.0)"),
  S(10, "Physics", "Current Electricity",
    "State Ohm's law. Under what condition is it valid? Draw its V–I graph.",
    "اوہم کا قانون بیان کریں۔ یہ کس شرط پر درست ہے؟ اس کا V–I گراف بنائیں۔",
    "• Statement with V = IR (2.0)\n• Condition: temperature (physical state) of the conductor stays constant (1.0)\n• Straight-line graph through the origin (1.0)"),
  L(10, "Physics", "Geometrical Optics",
    "An object 4.0 cm high is placed 12.0 cm in front of a concave mirror of focal length 8.0 cm. Using 1/f = 1/p + 1/q (real-is-positive convention), find (a) the position of the image (b) its height (c) its nature.",
    "ایک ۴ سینٹی میٹر اونچی شے ۸ سینٹی میٹر فوکل لینتھ والے مقعر آئینے کے سامنے ۱۲ سینٹی میٹر پر رکھی ہے۔ (الف) عکس کا مقام (ب) عکس کی اونچائی (ج) عکس کی نوعیت معلوم کریں۔",
    "• Given data and formula (2.0)\n• (a) 1/q = 1/8 − 1/12 = 1/24, q = 24 cm (2.5)\n• (b) m = q/p = 2, image height = 8 cm (2.0)\n• (c) Real, inverted and enlarged (1.5)"),
  L(10, "Physics", "Current Electricity",
    "Three resistors of 2 Ω, 3 Ω and 6 Ω are connected to a 6 V battery, first in series and then in parallel. In each case find the equivalent resistance and the total current.",
    "۲، ۳ اور ۶ اوہم کے تین مزاحمے ۶ وولٹ کی بیٹری سے پہلے سلسلہ وار اور پھر متوازی جوڑے جاتے ہیں۔ دونوں صورتوں میں مساوی مزاحمت اور کل کرنٹ معلوم کریں۔",
    "• Formulas for series and parallel (2.0)\n• Series: R = 11 Ω, I = 6/11 ≈ 0.55 A (3.0)\n• Parallel: 1/R = 1/2 + 1/3 + 1/6 = 1, R = 1 Ω, I = 6 A (3.0)"),
  L(10, "Physics", "Simple Harmonic Motion & Waves",
    "A simple pendulum is 1.0 m long. Find its time period (g = 10 m/s²). What happens to the time period if the length becomes 4.0 m, and if the mass of the bob is doubled?",
    "ایک سادہ پنڈولم کی لمبائی ۱ میٹر ہے۔ اس کا وقتِ دور معلوم کریں (g = 10)۔ اگر لمبائی ۴ میٹر ہو جائے یا گولے کی کمیت دگنی کر دی جائے تو وقتِ دور پر کیا اثر ہوگا؟",
    "• Formula T = 2π√(L/g) (2.0)\n• T ≈ 1.99 s with unit (2.5)\n• Length ×4 gives T doubled ≈ 3.97 s (2.0)\n• Mass has no effect on T (1.5)"),

  // ---------------- Chemistry, Class 9 ----------------
  S(9, "Chemistry", "Fundamentals of Chemistry",
    "Define empirical formula and molecular formula. Give one example of each.",
    "تجرباتی فارمولا اور سالماتی فارمولا کی تعریف کریں۔ ہر ایک کی ایک مثال دیں۔",
    "• Both definitions (2.0)\n• Example, e.g. benzene: empirical CH, molecular C₆H₆ (2.0)"),
  S(9, "Chemistry", "Fundamentals of Chemistry",
    "Define molarity. Write its formula and unit.",
    "مولیرٹی کی تعریف کریں۔ اس کا فارمولا اور یونٹ لکھیں۔",
    "• Definition: moles of solute per dm³ of solution (2.0)\n• M = moles of solute / volume in dm³ (1.0)\n• Unit mol dm⁻³ (1.0)"),
  S(9, "Chemistry", "Structure of Atoms",
    "State two postulates of Rutherford's atomic model and two of its defects.",
    "رودرفورڈ کے ایٹمی ماڈل کے دو مفروضے اور اس کی دو خامیاں بیان کریں۔",
    "• Two postulates, e.g. dense positive nucleus, electrons revolve around it (2.0)\n• Two defects, e.g. could not explain atomic stability or line spectra (2.0)"),
  S(9, "Chemistry", "Periodic Table & Periodicity",
    "Define ionization energy. How does it vary down a group and across a period?",
    "آئنائزیشن انرجی کی تعریف کریں۔ گروپ میں نیچے جانے اور پیریڈ میں آگے جانے پر یہ کیسے تبدیل ہوتی ہے؟",
    "• Definition (2.0)\n• Decreases down a group (larger atomic size, more shielding) (1.0)\n• Increases across a period (greater nuclear charge) (1.0)"),
  S(9, "Chemistry", "Structure of Molecules",
    "Differentiate between ionic and covalent bonds. Give one example of each.",
    "آئیونک اور کوویلنٹ بانڈ میں فرق بیان کریں۔ ہر ایک کی ایک مثال دیں۔",
    "• Ionic: transfer of electrons (1.5)\n• Covalent: sharing of electrons (1.5)\n• Examples, e.g. NaCl and H₂ / Cl₂ (1.0)"),
  S(9, "Chemistry", "Physical States of Matter",
    "State Boyle's law and write its mathematical form.",
    "بوائل کا قانون بیان کریں اور اس کی ریاضیاتی شکل لکھیں۔",
    "• Statement: at constant temperature, volume is inversely proportional to pressure (2.0)\n• PV = constant or P₁V₁ = P₂V₂ (2.0)"),
  L(9, "Chemistry", "Fundamentals of Chemistry",
    "(a) Calculate the number of moles and the number of molecules in 9 g of water (H = 1, O = 16). (b) Find the mass of 2 moles of carbon dioxide (C = 12, O = 16).",
    "(الف) ۹ گرام پانی میں مولز اور مالیکیولز کی تعداد معلوم کریں۔ (ب) کاربن ڈائی آکسائیڈ کے ۲ مولز کی کمیت معلوم کریں۔",
    "• Molar mass of H₂O = 18 g/mol (1.0)\n• Moles = 9/18 = 0.5 mol (2.0)\n• Molecules = 0.5 × 6.022 × 10²³ = 3.011 × 10²³ (2.5)\n• Mass of 2 mol CO₂ = 2 × 44 = 88 g (2.5)"),
  L(9, "Chemistry", "Structure of Atoms",
    "Describe Rutherford's alpha-particle scattering experiment with a labelled diagram. State its observations and conclusions.",
    "رودرفورڈ کے الفا ذرات کے بکھراؤ کے تجربے کو نامزد خاکے کے ساتھ بیان کریں۔ اس کے مشاہدات اور نتائج لکھیں۔",
    "• Labelled diagram (2.0)\n• Procedure (2.0)\n• Three observations (2.0)\n• Conclusions: empty space, small dense positive nucleus (2.0)"),
  L(9, "Chemistry", "Solutions",
    "How many grams of NaOH are needed to prepare 500 cm³ of a 0.2 M solution? (Na = 23, O = 16, H = 1). Also describe how you would prepare this solution in the laboratory.",
    "۰.۲ مولر محلول کے ۵۰۰ مکعب سینٹی میٹر تیار کرنے کے لیے کتنے گرام NaOH درکار ہوں گے؟ لیبارٹری میں یہ محلول تیار کرنے کا طریقہ بھی بیان کریں۔",
    "• Molar mass NaOH = 40 g/mol (1.0)\n• Moles = 0.2 × 0.5 = 0.1 mol (2.0)\n• Mass = 0.1 × 40 = 4 g (2.0)\n• Preparation steps with a volumetric flask (3.0)"),

  // ---------------- Chemistry, Class 10 ----------------
  S(10, "Chemistry", "Chemical Equilibrium",
    "State the law of mass action. Write the Kc expression for N₂ + 3H₂ ⇌ 2NH₃.",
    "قانونِ عملِ کمیت بیان کریں۔ N₂ + 3H₂ ⇌ 2NH₃ کے لیے Kc کی مساوات لکھیں۔",
    "• Statement of the law (2.0)\n• Kc = [NH₃]² / ([N₂][H₂]³) (2.0)"),
  S(10, "Chemistry", "Chemical Equilibrium",
    "State Le Chatelier's principle. What is the effect of increasing pressure on N₂ + 3H₂ ⇌ 2NH₃?",
    "لی شاتلیئے کا اصول بیان کریں۔ N₂ + 3H₂ ⇌ 2NH₃ پر دباؤ بڑھانے کا کیا اثر ہوگا؟",
    "• Statement (2.0)\n• Equilibrium shifts forward, more NH₃ forms (1.0)\n• Reason: fewer gas moles on the product side (1.0)"),
  S(10, "Chemistry", "Acids, Bases and Salts",
    "Differentiate between an Arrhenius acid and a Brønsted-Lowry acid. Give one example of each.",
    "آرہینیئس ایسڈ اور برونسٹڈ لوری ایسڈ میں فرق بیان کریں۔ ہر ایک کی ایک مثال دیں۔",
    "• Arrhenius: gives H⁺ ions in water (1.5)\n• Brønsted-Lowry: proton donor (1.5)\n• Examples, e.g. HCl in water; HCl donating H⁺ to NH₃ (1.0)"),
  S(10, "Chemistry", "Acids, Bases and Salts",
    "Define pH. Calculate the pH of a solution in which [H⁺] = 1 × 10⁻³ mol dm⁻³.",
    "pH کی تعریف کریں۔ اس محلول کا pH معلوم کریں جس میں [H⁺] = 1 × 10⁻³ مول فی مکعب ڈیسی میٹر ہو۔",
    "• Definition pH = −log[H⁺] (2.0)\n• pH = −log(10⁻³) = 3, acidic (2.0)"),
  S(10, "Chemistry", "Hydrocarbons",
    "Differentiate between saturated and unsaturated hydrocarbons. Give one example of each.",
    "سیر شدہ اور غیر سیر شدہ ہائیڈروکاربنز میں فرق بیان کریں۔ ہر ایک کی ایک مثال دیں۔",
    "• Saturated: only single C–C bonds (1.5)\n• Unsaturated: at least one double or triple bond (1.5)\n• Examples, e.g. ethane; ethene or ethyne (1.0)"),
  S(10, "Chemistry", "Environmental Chemistry",
    "What is acid rain? State two of its harmful effects.",
    "تیزابی بارش کیا ہے؟ اس کے دو نقصان دہ اثرات بیان کریں۔",
    "• Definition and cause (SO₂, NO₂ dissolving in rain water) (2.0)\n• Two effects, e.g. damage to buildings, aquatic life, soil (2.0)"),
  L(10, "Chemistry", "Chemical Equilibrium",
    "For H₂ + I₂ ⇌ 2HI, 4.0 mol of H₂ and 4.0 mol of I₂ are placed in a 1 dm³ vessel. At equilibrium Kc = 49. Calculate the equilibrium concentrations of H₂, I₂ and HI.",
    "H₂ + I₂ ⇌ 2HI کے لیے ۴ مول H₂ اور ۴ مول I₂ ایک مکعب ڈیسی میٹر برتن میں رکھے گئے ہیں۔ توازن پر Kc = 49 ہے۔ H₂، I₂ اور HI کے توازنی ارتکاز معلوم کریں۔",
    "• Equilibrium table with x (2.0)\n• Kc = (2x)² / (4 − x)² = 49, so 2x/(4 − x) = 7 (2.0)\n• x = 28/9 ≈ 3.11 (2.0)\n• [HI] ≈ 6.22, [H₂] = [I₂] ≈ 0.89 mol dm⁻³ (2.0)"),
  L(10, "Chemistry", "Hydrocarbons",
    "Write the names and structural formulas of the first four alkanes. Describe two methods of preparing alkanes, with balanced equations.",
    "پہلے چار الکینز کے نام اور ساختی فارمولے لکھیں۔ متوازن مساوات کے ساتھ الکینز تیار کرنے کے دو طریقے بیان کریں۔",
    "• Methane, ethane, propane, butane with structures (4.0)\n• Hydrogenation of alkenes, e.g. C₂H₄ + H₂ → C₂H₆ (Ni catalyst) (2.0)\n• Reduction of alkyl halides, e.g. CH₃Cl + 2[H] → CH₄ + HCl (Zn/HCl) (2.0)"),
  L(10, "Chemistry", "Biochemistry",
    "What are carbohydrates? Classify them into monosaccharides, disaccharides and polysaccharides with one example of each. State two uses of carbohydrates.",
    "کاربوہائیڈریٹس کیا ہیں؟ انہیں مونوسیکرائیڈز، ڈائی سیکرائیڈز اور پولی سیکرائیڈز میں مثال کے ساتھ تقسیم کریں۔ ان کے دو استعمال لکھیں۔",
    "• Definition (2.0)\n• Three classes with examples: glucose, sucrose, starch (4.0)\n• Two uses (2.0)"),

  // ---------------- Biology, Class 9 ----------------
  S(9, "Biology", "Cell Cycle",
    "Differentiate between mitosis and meiosis (any four points).",
    "مائٹوسس اور میوسس میں کوئی چار فرق بیان کریں۔",
    "• Four correct differences, 1 mark each: number of divisions, daughter cells (2 vs 4), chromosome number (same vs half), where it occurs (somatic vs reproductive cells)"),
  S(9, "Biology", "Enzymes",
    "Define enzyme. State any three characteristics of enzymes.",
    "انزائم کی تعریف کریں۔ انزائمز کی کوئی تین خصوصیات بیان کریں۔",
    "• Definition: biological catalyst, mostly protein (1.0)\n• Three characteristics, e.g. specific, affected by temperature and pH, not used up (3.0)"),
  S(9, "Biology", "Enzymes",
    "Explain the lock-and-key model of enzyme action.",
    "انزائم کے عمل کا لاک اینڈ کی ماڈل بیان کریں۔",
    "• Active site has a specific shape (1.5)\n• Only the matching substrate fits, forming the enzyme-substrate complex (1.5)\n• Products released, enzyme unchanged (1.0)"),
  S(9, "Biology", "Cells and Tissues",
    "Differentiate between prokaryotic and eukaryotic cells (any four points).",
    "پروکیریوٹک اور یوکیریوٹک خلیوں میں کوئی چار فرق بیان کریں۔",
    "• Four correct differences, 1 mark each: nucleus, membrane-bound organelles, size, ribosome size / DNA form"),
  S(9, "Biology", "Biodiversity",
    "What is binomial nomenclature? State two rules for writing a scientific name.",
    "دو اسمی نظامِ نام کیا ہے؟ سائنسی نام لکھنے کے دو اصول بیان کریں۔",
    "• Definition: two-part name, genus and species (2.0)\n• Two rules, e.g. genus capitalised, species lowercase, italicised or underlined (2.0)"),
  S(9, "Biology", "Solving a Biological Problem",
    "List the steps of the scientific method in the correct order.",
    "سائنسی طریقہ کار کے مراحل درست ترتیب سے لکھیں۔",
    "• Recognition of problem and observation, hypothesis, deduction, experiment, results and conclusion, reporting (4.0, deduct 1 for wrong order)"),
  L(9, "Biology", "Cell Cycle",
    "Describe the phases of mitosis with labelled diagrams.",
    "مائٹوسس کے مراحل نامزد خاکوں کے ساتھ بیان کریں۔",
    "• Prophase (2.0)\n• Metaphase (2.0)\n• Anaphase (2.0)\n• Telophase and cytokinesis (2.0); diagrams required for full marks"),
  L(9, "Biology", "Cells and Tissues",
    "Draw a labelled diagram of a plant cell. Describe the structure and function of the cell membrane, mitochondria and chloroplast.",
    "پودے کے خلیے کا نامزد خاکہ بنائیں۔ خلوی جھلی، مائٹوکونڈریا اور کلوروپلاسٹ کی ساخت اور افعال بیان کریں۔",
    "• Labelled diagram (2.0)\n• Cell membrane (2.0)\n• Mitochondria (2.0)\n• Chloroplast (2.0)"),
  L(9, "Biology", "Enzymes",
    "Explain how temperature, pH and substrate concentration affect the rate of enzyme action. Draw a graph for each.",
    "درجہ حرارت، pH اور سبسٹریٹ کے ارتکاز کا انزائم کے عمل کی رفتار پر اثر بیان کریں۔ ہر ایک کا گراف بنائیں۔",
    "• Temperature with optimum and denaturation (3.0)\n• pH with optimum (2.5)\n• Substrate concentration with saturation (2.5); graphs required"),

  // ---------------- Biology, Class 10 ----------------
  S(10, "Biology", "Gaseous Exchange",
    "Differentiate between aerobic and anaerobic respiration (any four points).",
    "ہوائی اور غیر ہوائی تنفس میں کوئی چار فرق بیان کریں۔",
    "• Four correct differences, 1 mark each: oxygen use, products, energy released (38 vs 2 ATP), site"),
  S(10, "Biology", "Gaseous Exchange",
    "State any four adaptations of the alveoli for efficient gaseous exchange.",
    "مؤثر گیسوں کے تبادلے کے لیے الویولائی کی کوئی چار موافقتیں بیان کریں۔",
    "• Four adaptations, 1 mark each: large surface area, thin walls, moist lining, rich blood supply"),
  S(10, "Biology", "Homeostasis",
    "Name the structural and functional unit of the kidney and list its main parts.",
    "گردے کی ساختی اور فعلی اکائی کا نام بتائیں اور اس کے اہم حصے لکھیں۔",
    "• Nephron (1.0)\n• Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct (3.0)"),
  S(10, "Biology", "Coordination and Control",
    "Differentiate between voluntary and reflex actions. Give one example of each.",
    "ارادی اور اضطراری افعال میں فرق بیان کریں۔ ہر ایک کی ایک مثال دیں۔",
    "• Voluntary: under conscious control of the brain (1.5)\n• Reflex: automatic, rapid, via the spinal cord (1.5)\n• Examples (1.0)"),
  S(10, "Biology", "Inheritance",
    "Define gene and allele. Differentiate between dominant and recessive traits.",
    "جین اور ایلیل کی تعریف کریں۔ غالب اور مغلوب خصوصیات میں فرق بیان کریں۔",
    "• Gene and allele definitions (2.0)\n• Dominant expressed in heterozygote; recessive only when homozygous (2.0)"),
  S(10, "Biology", "Reproduction",
    "What is vegetative propagation? Give two natural methods with examples.",
    "نباتاتی افزائش کیا ہے؟ دو قدرتی طریقے مثالوں کے ساتھ بیان کریں۔",
    "• Definition (2.0)\n• Two methods with examples, e.g. runners (grass), tubers (potato), bulbs (onion) (2.0)"),
  L(10, "Biology", "Gaseous Exchange",
    "Explain the mechanism of breathing in humans (inspiration and expiration). Draw a labelled diagram of the human respiratory system.",
    "انسان میں سانس لینے کے عمل (سانس اندر لینا اور باہر نکالنا) کی وضاحت کریں۔ انسانی نظامِ تنفس کا نامزد خاکہ بنائیں۔",
    "• Inspiration: diaphragm and ribs, volume up, pressure down (3.0)\n• Expiration (2.0)\n• Labelled diagram (3.0)"),
  L(10, "Biology", "Homeostasis",
    "Describe the structure of a nephron with a labelled diagram and explain how urine is formed.",
    "نیفران کی ساخت نامزد خاکے کے ساتھ بیان کریں اور پیشاب بننے کا عمل واضح کریں۔",
    "• Labelled diagram (3.0)\n• Pressure filtration (1.5)\n• Selective reabsorption (2.0)\n• Tubular secretion (1.5)"),
  L(10, "Biology", "Inheritance",
    "State Mendel's law of segregation. Explain it with a monohybrid cross between a tall (TT) and a dwarf (tt) pea plant up to the F2 generation.",
    "مینڈل کا قانونِ علیحدگی بیان کریں۔ لمبے (TT) اور بونے (tt) مٹر کے پودوں کے درمیان یک خصوصی کراس کی F2 نسل تک وضاحت کریں۔",
    "• Statement (2.0)\n• F1 all Tt, tall (2.0)\n• F2 Punnett square (2.0)\n• Ratios 3:1 phenotypic, 1:2:1 genotypic (2.0)"),
];

export const GENERATOR_SUBJECTS = ["Physics", "Chemistry", "Biology"] as const;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chapters first (those the teacher ticked), then the rest of the same class+subject; never repeats. */
function pickPreferring<T>(items: T[], chapterOf: (x: T) => string, chapters: string[], n: number, rnd: () => number): T[] {
  const sel = chapters.map((c) => c.toLowerCase());
  const inSel = (x: T) => sel.length === 0 || sel.some((c) => chapterOf(x).toLowerCase() === c);
  const first = shuffle(items.filter(inSel), rnd);
  const rest = sel.length ? shuffle(items.filter((x) => !inSel(x)), rnd) : [];
  return [...first, ...rest].slice(0, n);
}

const LETTERS = ["A", "B", "C", "D"];

export interface ExamRequest {
  board?: string;
  grade?: number;
  subject?: string;
  exam_format?: string;
  completed_chapters?: string[];
  seed?: number;
}

export function generateExamPaper(req: ExamRequest) {
  const subject = req.subject || "Physics";
  const grade = Number(req.grade) || 10;
  const format = req.exam_format || "20-Mark Monthly Test";
  const chapters = req.completed_chapters || [];
  const seed = Number.isFinite(req.seed) ? Number(req.seed) : Date.now();
  const rnd = mulberry32(seed);

  const is60 = format.includes("60");
  const is40 = format.includes("40");
  const targetMarks = is60 ? 60 : is40 ? 40 : 20;
  const timeAllowed = is60 ? "3 Hours" : is40 ? "1.5 Hours" : "45 Minutes";
  const want = { mcq: is60 ? 12 : is40 ? 8 : 4, short: is60 ? 6 : is40 ? 4 : 2, long: is60 ? 3 : is40 ? 2 : 1 };

  const sameClassSubject = (s: string, g: number) => s.toLowerCase() === subject.toLowerCase() && g === grade;
  const mcqPool = FALLBACK_QUESTIONS.filter((q) => sameClassSubject(q.subject, q.grade));
  const theoryPool = THEORY_BANK.filter((t) => sameClassSubject(t.subject, t.grade));

  const mcqs: QuestionItem[] = pickPreferring(mcqPool, (q) => q.chapter_name, chapters, want.mcq, rnd);
  const shorts = pickPreferring(theoryPool.filter((t) => t.kind === "short"), (t) => t.chapter, chapters, want.short, rnd);
  const longs = pickPreferring(theoryPool.filter((t) => t.kind === "long"), (t) => t.chapter, chapters, want.long, rnd);

  const clean = (t: string) => String(t).replace(/\s*\(Verified\)/gi, "").trim();

  // ---- Row A ----
  const rowA: any[] = [];
  mcqs.forEach((q) => {
    let opts: Record<string, string> = {};
    try { opts = JSON.parse(q.options_json); } catch { /* keep empty */ }
    const cleanOpts: Record<string, string> = {};
    LETTERS.forEach((k) => { if (opts[k] !== undefined) cleanOpts[k] = clean(opts[k]); });
    rowA.push({ section: "Section A", question_id: q.question_id, chapter: q.chapter_name, text_en: q.text_en, text_ur: q.text_ur, options: JSON.stringify(cleanOpts), marks: 1, correct_option: q.correct_option });
  });
  shorts.forEach((t) => rowA.push({ section: "Section B", chapter: t.chapter, text_en: t.en, text_ur: t.ur, marks: 4, key: t.key }));
  longs.forEach((t) => rowA.push({ section: "Section C", chapter: t.chapter, text_en: t.en, text_ur: t.ur, marks: 8, key: t.key }));

  // ---- Row B: MCQs in reverse order with reversed options; B/C identical so one rubric serves both ----
  const rowAMcq = rowA.filter((q) => q.section === "Section A");
  const rowBMcq = [...rowAMcq].reverse().map((q) => {
    const opts: Record<string, string> = JSON.parse(q.options);
    const keys = LETTERS.filter((k) => opts[k] !== undefined);
    const rev = [...keys].reverse();
    const newOpts: Record<string, string> = {};
    let newCorrect = q.correct_option;
    keys.forEach((k, i) => {
      newOpts[k] = opts[rev[i]];
      if (rev[i] === q.correct_option) newCorrect = k;
    });
    return { ...q, options: JSON.stringify(newOpts), correct_option: newCorrect };
  });
  const rowB = [...rowBMcq, ...rowA.filter((q) => q.section !== "Section A")];

  // ---- Numbering and rubric ----
  const mcqMarks = rowAMcq.length;
  const shortMarks = shorts.length * 4;
  const longMarks = longs.length * 8;
  const totalMarks = mcqMarks + shortMarks + longMarks;

  const rubrics: any[] = [];
  if (rowAMcq.length) {
    rubrics.push({
      question_no: `Q1 (MCQs 1.1 to 1.${rowAMcq.length})`,
      marks: mcqMarks,
      key: `1 mark per correct option. Blank, wrong or double-marked answers get 0.\nRow A key: ${rowAMcq.map((q, i) => `1.${i + 1}-${q.correct_option}`).join(", ")}\nRow B key: ${rowBMcq.map((q, i) => `1.${i + 1}-${q.correct_option}`).join(", ")}`,
    });
  }
  let qNo = 2;
  shorts.forEach((t) => rubrics.push({ question_no: `Q${qNo++} (Section B)`, marks: 4, key: t.key }));
  longs.forEach((t) => rubrics.push({ question_no: `Q${qNo++} (Section C)`, marks: 8, key: t.key }));

  const notices: string[] = [];
  if (mcqs.length < want.mcq) notices.push(`only ${mcqs.length} of ${want.mcq} MCQs`);
  if (shorts.length < want.short) notices.push(`only ${shorts.length} of ${want.short} short questions`);
  if (longs.length < want.long) notices.push(`only ${longs.length} of ${want.long} long questions`);
  const outsideChapters = chapters.length
    ? [...mcqs.map((q) => q.chapter_name), ...shorts.map((t) => t.chapter), ...longs.map((t) => t.chapter)].filter(
        (c) => !chapters.some((s) => s.toLowerCase() === c.toLowerCase())
      ).length
    : 0;
  if (outsideChapters > 0) notices.push(`${outsideChapters} question(s) come from chapters you did not tick, because the bank had too few in the ticked chapters`);

  return {
    total_marks: totalMarks,
    target_marks: targetMarks,
    time_allowed: timeAllowed,
    section_marks: { A: mcqMarks, B: shortMarks, C: longMarks },
    row_a_questions: rowA,
    row_b_questions: rowB,
    rubrics,
    seed,
    generated_at: new Date().toISOString(),
    bank_notice: notices.length
      ? `Question bank for Class ${grade} ${subject} is limited: ${notices.join("; ")}. This paper totals ${totalMarks} of the ${targetMarks} marks requested.`
      : null,
  };
}
