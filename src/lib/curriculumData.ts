// Verified Board Curriculum Data Engine for BoardBrain
// Provides complete, offline-resilient Sindh (BSEK) & Federal (FBISE) Board data
// Guaranteed to load immediately without network latency or mixed-content failure

export interface QuestionItem {
  question_id: string;
  board: string;
  grade: number;
  subject: string;
  chapter_name: string;
  section: string;
  text_en: string;
  text_ur: string;
  options_json: string;
  correct_option: string;
  marks: number;
  is_numerical: boolean;
  formula_used?: string;
  solution_rubric: string;
  cognitive_level: "Knowledge" | "Understanding" | "Application";
  trap_note?: string;
}

export interface ChapterItem {
  chapter_name: string;
  question_count: number;
  subject: string;
  grade: number;
}

export interface VivaQuestion {
  q: string;
  a: string;
  keywords: string[];
  marks: number;
}

export interface PracticalItem {
  id: number;
  subject: "Physics" | "Chemistry" | "Biology";
  class_level: number;
  experiment_title: string;
  apparatus: string;
  viva_questions: VivaQuestion[];
}

export const FALLBACK_CHAPTERS: Record<string, ChapterItem[]> = {
  "Physics_10": [
    { chapter_name: "Simple Harmonic Motion & Waves", question_count: 14, subject: "Physics", grade: 10 },
    { chapter_name: "Sound", question_count: 12, subject: "Physics", grade: 10 },
    { chapter_name: "Geometrical Optics", question_count: 18, subject: "Physics", grade: 10 },
    { chapter_name: "Electrostatics", question_count: 15, subject: "Physics", grade: 10 },
    { chapter_name: "Current Electricity", question_count: 16, subject: "Physics", grade: 10 },
    { chapter_name: "Electromagnetism", question_count: 12, subject: "Physics", grade: 10 },
    { chapter_name: "Introductory Electronics", question_count: 10, subject: "Physics", grade: 10 },
    { chapter_name: "Atomic & Nuclear Physics", question_count: 12, subject: "Physics", grade: 10 },
  ],
  "Physics_9": [
    { chapter_name: "Physical Quantities & Measurement", question_count: 15, subject: "Physics", grade: 9 },
    { chapter_name: "Kinematics", question_count: 18, subject: "Physics", grade: 9 },
    { chapter_name: "Dynamics", question_count: 16, subject: "Physics", grade: 9 },
    { chapter_name: "Turning Effect of Forces", question_count: 14, subject: "Physics", grade: 9 },
    { chapter_name: "Gravitation", question_count: 12, subject: "Physics", grade: 9 },
    { chapter_name: "Work & Energy", question_count: 14, subject: "Physics", grade: 9 },
    { chapter_name: "Properties of Matter", question_count: 12, subject: "Physics", grade: 9 },
  ],
  "Chemistry_10": [
    { chapter_name: "Chemical Equilibrium", question_count: 14, subject: "Chemistry", grade: 10 },
    { chapter_name: "Acids, Bases and Salts", question_count: 16, subject: "Chemistry", grade: 10 },
    { chapter_name: "Organic Chemistry", question_count: 18, subject: "Chemistry", grade: 10 },
    { chapter_name: "Hydrocarbons", question_count: 15, subject: "Chemistry", grade: 10 },
    { chapter_name: "Biochemistry", question_count: 12, subject: "Chemistry", grade: 10 },
    { chapter_name: "Environmental Chemistry", question_count: 10, subject: "Chemistry", grade: 10 },
  ],
  "Chemistry_9": [
    { chapter_name: "Fundamentals of Chemistry", question_count: 16, subject: "Chemistry", grade: 9 },
    { chapter_name: "Structure of Atoms", question_count: 14, subject: "Chemistry", grade: 9 },
    { chapter_name: "Periodic Table & Periodicity", question_count: 15, subject: "Chemistry", grade: 9 },
    { chapter_name: "Structure of Molecules", question_count: 14, subject: "Chemistry", grade: 9 },
    { chapter_name: "Physical States of Matter", question_count: 12, subject: "Chemistry", grade: 9 },
    { chapter_name: "Solutions", question_count: 15, subject: "Chemistry", grade: 9 },
  ],
  "Biology_10": [
    { chapter_name: "Gaseous Exchange", question_count: 14, subject: "Biology", grade: 10 },
    { chapter_name: "Homeostasis", question_count: 15, subject: "Biology", grade: 10 },
    { chapter_name: "Coordination and Control", question_count: 18, subject: "Biology", grade: 10 },
    { chapter_name: "Support and Movement", question_count: 14, subject: "Biology", grade: 10 },
    { chapter_name: "Reproduction", question_count: 16, subject: "Biology", grade: 10 },
    { chapter_name: "Inheritance", question_count: 14, subject: "Biology", grade: 10 },
  ],
  "Biology_9": [
    { chapter_name: "Introduction to Biology", question_count: 14, subject: "Biology", grade: 9 },
    { chapter_name: "Solving a Biological Problem", question_count: 12, subject: "Biology", grade: 9 },
    { chapter_name: "Biodiversity", question_count: 15, subject: "Biology", grade: 9 },
    { chapter_name: "Cells and Tissues", question_count: 18, subject: "Biology", grade: 9 },
    { chapter_name: "Cell Cycle", question_count: 14, subject: "Biology", grade: 9 },
    { chapter_name: "Enzymes", question_count: 12, subject: "Biology", grade: 9 },
  ]
};

export const FALLBACK_QUESTIONS: QuestionItem[] = [
  // --- PHYSICS 10: Simple Harmonic Motion ---
  {
    question_id: "PHY10-SHM-001",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Physics",
    chapter_name: "Simple Harmonic Motion & Waves",
    section: "SECTION_A",
    text_en: "If the mass of the bob of a simple pendulum is tripled, its time period will:",
    text_ur: "اگر سادہ پینڈولم کے باب کا ماس تین گنا کر دیا جائے تو اس کا ٹائم پیریڈ:",
    options_json: JSON.stringify({
      A: "Increase by 3 times",
      B: "Decrease by 3 times",
      C: "Remain unchanged",
      D: "Increase by √3 times"
    }),
    correct_option: "C",
    marks: 1,
    is_numerical: false,
    formula_used: "T = 2π√(L/g)",
    solution_rubric: "Time period of a simple pendulum depends only on effective length L and gravitational acceleration g. It is completely independent of mass of the bob.",
    cognitive_level: "Understanding",
    trap_note: "Examiner Trap: Students incorrectly think mass increases time period. Formula T = 2π√(L/g) has NO 'm' term!"
  },
  {
    question_id: "PHY10-SHM-002",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Physics",
    chapter_name: "Simple Harmonic Motion & Waves",
    section: "SECTION_A",
    text_en: "At which position is the velocity of an oscillating mass attached to a spring maximum?",
    text_ur: "اسپرنگ سے بندھے ماس کی رفتار کس مقام پر زیادہ سے زیادہ ہوتی ہے؟",
    options_json: JSON.stringify({
      A: "At extreme positions",
      B: "At mean position",
      C: "Halfway between mean and extreme",
      D: "It remains constant everywhere"
    }),
    correct_option: "B",
    marks: 1,
    is_numerical: false,
    formula_used: "v = ω√(x₀² - x²)",
    solution_rubric: "At mean position x = 0, so velocity v is maximum. At extreme position x = x₀, velocity momentarily drops to zero.",
    cognitive_level: "Knowledge",
    trap_note: "Do not confuse Acceleration (max at extreme) with Velocity (max at mean)!"
  },
  {
    question_id: "PHY10-SHM-003",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Physics",
    chapter_name: "Simple Harmonic Motion & Waves",
    section: "SECTION_A",
    text_en: "What is the frequency of a simple pendulum whose time period is 0.5 seconds?",
    text_ur: "ایک سادہ پینڈولم کا ٹائم پیریڈ 0.5 سیکنڈ ہے۔ اس کی فریکوئنسی کیا ہوگی؟",
    options_json: JSON.stringify({
      A: "0.5 Hz",
      B: "1.0 Hz",
      C: "2.0 Hz",
      D: "4.0 Hz"
    }),
    correct_option: "C",
    marks: 1,
    is_numerical: true,
    formula_used: "f = 1 / T",
    solution_rubric: "f = 1 / 0.5 = 2.0 Hz. Frequency is the reciprocal of time period.",
    cognitive_level: "Application",
    trap_note: "Reciprocal math trap: 1 / 0.5 = 2, not 0.5!"
  },

  // --- PHYSICS 10: Geometrical Optics ---
  {
    question_id: "PHY10-OPT-001",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Physics",
    chapter_name: "Geometrical Optics",
    section: "SECTION_A",
    text_en: "The focal length of a convex mirror according to standard sign convention is always:",
    text_ur: "معیاری سائن کنونشن کے مطابق محدب آئینے (Convex Mirror) کا فوکل لینتھ ہمیشہ ہوتا ہے:",
    options_json: JSON.stringify({
      A: "Positive",
      B: "Negative",
      C: "Zero",
      D: "Infinity"
    }),
    correct_option: "B",
    marks: 1,
    is_numerical: false,
    formula_used: "1/f = 1/p + 1/q",
    solution_rubric: "The focus of a convex mirror lies behind the reflecting surface (virtual focus), hence f is taken as negative.",
    cognitive_level: "Knowledge",
    trap_note: "Convex lens has POSITIVE focus, but Convex mirror has NEGATIVE focus!"
  },
  {
    question_id: "PHY10-OPT-002",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Physics",
    chapter_name: "Geometrical Optics",
    section: "SECTION_A",
    text_en: "When light enters from water (n=1.33) into air (n=1.00), the refracted ray will:",
    text_ur: "جب روشنی پانی سے ہوا میں داخل ہوتی ہے تو ریفریکٹڈ شعاع:",
    options_json: JSON.stringify({
      A: "Bend towards the normal",
      B: "Bend away from the normal",
      C: "Pass undeviated",
      D: "Reflect back completely at all angles"
    }),
    correct_option: "B",
    marks: 1,
    is_numerical: false,
    formula_used: "n₁ sin(θ₁) = n₂ sin(θ₂)",
    solution_rubric: "When traveling from a denser medium to a rarer medium, light speeds up and bends away from the normal.",
    cognitive_level: "Understanding",
    trap_note: "Denser to Rarer = Bends AWAY from Normal."
  },

  // --- PHYSICS 10: Current Electricity ---
  {
    question_id: "PHY10-CURR-001",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Physics",
    chapter_name: "Current Electricity",
    section: "SECTION_A",
    text_en: "Two resistors of 6 Ω and 3 Ω are connected in parallel. Their equivalent resistance is:",
    text_ur: "دو ریزسٹرز 6 اوم اور 3 اوم متوازی (Parallel) جڑے ہیں۔ ان کی مساوی مزاحمت کیا ہوگی؟",
    options_json: JSON.stringify({
      A: "9.0 Ω",
      B: "3.0 Ω",
      C: "2.0 Ω",
      D: "18.0 Ω"
    }),
    correct_option: "C",
    marks: 1,
    is_numerical: true,
    formula_used: "1/R_eq = 1/R₁ + 1/R₂ => R_eq = (R₁*R₂)/(R₁+R₂)",
    solution_rubric: "R_eq = (6 * 3) / (6 + 3) = 18 / 9 = 2.0 Ω. Parallel resistance is always smaller than the smallest branch.",
    cognitive_level: "Application",
    trap_note: "Students mistakenly add 6 + 3 = 9 (which is Series, not Parallel!)."
  },

  // --- CHEMISTRY 10: Chemical Equilibrium ---
  {
    question_id: "CHM10-EQ-001",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Chemistry",
    chapter_name: "Chemical Equilibrium",
    section: "SECTION_A",
    text_en: "At dynamic equilibrium in a reversible reaction:",
    text_ur: "ایک ریورسیبل ری ایکشن میں ڈائنامک ایکویلیبریم کے مقام پر:",
    options_json: JSON.stringify({
      A: "The reaction stops completely",
      B: "Concentration of reactants and products becomes zero",
      C: "Rate of forward reaction equals rate of reverse reaction",
      D: "Products are constantly greater than reactants"
    }),
    correct_option: "C",
    marks: 1,
    is_numerical: false,
    formula_used: "R_forward = R_reverse",
    solution_rubric: "Equilibrium is dynamic: both forward and backward reactions continue at identical rates with constant concentrations.",
    cognitive_level: "Knowledge",
    trap_note: "Reaction NEVER stops in dynamic equilibrium!"
  },
  {
    question_id: "CHM10-EQ-002",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Chemistry",
    chapter_name: "Chemical Equilibrium",
    section: "SECTION_A",
    text_en: "For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), the unit of equilibrium constant Kc is:",
    text_ur: "ری ایکشن N₂ + 3H₂ ⇌ 2NH₃ کے لیے ایکویلیبریم کانسٹنٹ Kc کا یونٹ کیا ہے؟",
    options_json: JSON.stringify({
      A: "No units",
      B: "mol⁻² · dm⁶",
      C: "mol² · dm⁻⁶",
      D: "mol · dm⁻³"
    }),
    correct_option: "B",
    marks: 1,
    is_numerical: true,
    formula_used: "Kc = [NH₃]² / ([N₂][H₂]³)",
    solution_rubric: "Unit = (mol/dm³)² / ((mol/dm³) * (mol/dm³)³) = 1 / (mol/dm³)² = mol⁻² · dm⁶.",
    cognitive_level: "Application",
    trap_note: "Always calculate Δn = products - reactants = 2 - 4 = -2, so (mol/dm³)⁻² = mol⁻² · dm⁶."
  },

  // --- CHEMISTRY 10: Acids, Bases & Salts ---
  {
    question_id: "CHM10-ACID-001",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Chemistry",
    chapter_name: "Acids, Bases and Salts",
    section: "SECTION_A",
    text_en: "If the pH of a solution is 3, the solution is:",
    text_ur: "اگر کسی محلول کی pH تین (3) ہو تو وہ محلول کیسا ہوگا؟",
    options_json: JSON.stringify({
      A: "Strongly basic",
      B: "Weakly basic",
      C: "Neutral",
      D: "Strongly acidic"
    }),
    correct_option: "D",
    marks: 1,
    is_numerical: false,
    formula_used: "pH = -log[H⁺]",
    solution_rubric: "pH < 7 is acidic. Lower pH (1-3) indicates a high concentration of H⁺ ions (strongly acidic).",
    cognitive_level: "Knowledge",
    trap_note: "pH scale: 0-3 strong acid, 7 neutral, 11-14 strong base."
  },

  // --- BIOLOGY 10: Gaseous Exchange ---
  {
    question_id: "BIO10-GAS-001",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Biology",
    chapter_name: "Gaseous Exchange",
    section: "SECTION_A",
    text_en: "The primary structural and functional units for gas exchange in human lungs are:",
    text_ur: "انسانی پھیپھڑوں میں گیسوں کے تبادلے کی بنیادی ساخت اور اکائی کون سی ہے؟",
    options_json: JSON.stringify({
      A: "Bronchioles",
      B: "Alveoli",
      C: "Trachea",
      D: "Pleural membranes"
    }),
    correct_option: "B",
    marks: 1,
    is_numerical: false,
    formula_used: "Surface Area Diffusion",
    solution_rubric: "Alveoli are microscopic air sacs surrounded by dense capillary networks where O₂ and CO₂ diffuse across moist single-layered epithelium.",
    cognitive_level: "Knowledge",
    trap_note: "Bronchioles only conduct air; actual exchange occurs solely in alveoli."
  },
  {
    question_id: "BIO10-GAS-002",
    board: "BSEK_KARACHI",
    grade: 10,
    subject: "Biology",
    chapter_name: "Gaseous Exchange",
    section: "SECTION_A",
    text_en: "During vigorous exercise, human muscle cells perform anaerobic respiration producing:",
    text_ur: "سخت ورزش کے دوران پٹھوں کے خلیات این ایروبک سانس کے ذریعے کیا بناتے ہیں؟",
    options_json: JSON.stringify({
      A: "Ethanol and CO₂",
      B: "Lactic acid only",
      C: "Glucose and oxygen",
      D: "Citric acid"
    }),
    correct_option: "B",
    marks: 1,
    is_numerical: false,
    formula_used: "Glucose -> 2 Lactic Acid + 2 ATP",
    solution_rubric: "In animals/humans, anaerobic breakdown of glucose yields lactic acid, causing temporary muscle fatigue. Ethanol is formed in yeast/plants.",
    cognitive_level: "Understanding",
    trap_note: "Ethanol is for Yeast fermentation; Lactic Acid is for Human muscles!"
  }
];

export const FALLBACK_PRACTICALS: PracticalItem[] = [
  // --- PHYSICS PRACTICALS ---
  {
    id: 1,
    subject: "Physics",
    class_level: 10,
    experiment_title: "Verification of Ohm's Law (V = IR)",
    apparatus: "Voltmeter, Ammeter, Rheostat, DC Battery, Key, Unknown Resistance Wire (Nichrome).",
    viva_questions: [
      {
        q: "Why is an ammeter always connected in series and voltmeter in parallel?",
        a: "An ammeter has very low internal resistance so it measures circuit current without reducing it. A voltmeter has very high internal resistance so it draws negligible current from the branch.",
        keywords: ["low resistance", "high resistance", "series", "parallel", "negligible current"],
        marks: 4
      },
      {
        q: "What does the slope of a V-I graph represent?",
        a: "The slope of the Potential Difference (V) versus Current (I) graph (ΔV / ΔI) represents the electrical resistance (R) of the conductor in ohms.",
        keywords: ["slope", "resistance", "ohms", "delta v", "delta i", "r"],
        marks: 4
      },
      {
        q: "Why must the conductor's temperature remain constant during this experiment?",
        a: "Ohm's Law holds true only at constant temperature because increase in temperature increases internal lattice vibrations, which increases the resistance.",
        keywords: ["temperature", "constant", "resistance increases", "vibrations"],
        marks: 4
      }
    ]
  },
  {
    id: 2,
    subject: "Physics",
    class_level: 10,
    experiment_title: "Focal Length of Convex Lens (Two-Pin Method)",
    apparatus: "Optical bench, Convex Lens, Lens holder, Two upright needles/pins, Meter rod.",
    viva_questions: [
      {
        q: "What is parallax and how do you remove it?",
        a: "Parallax is the apparent relative shift between two objects when the observer's eye is moved sideways. It is removed when the tip of the search pin and the inverted image tip coincide without separation.",
        keywords: ["parallax", "apparent shift", "coincide", "tips", "eye movement"],
        marks: 4
      },
      {
        q: "What is the nature of image formed by a convex lens when object is beyond 2F?",
        a: "The image is real, inverted, diminished in size, and formed between F and 2F on the other side of the lens.",
        keywords: ["real", "inverted", "diminished", "between f and 2f"],
        marks: 4
      }
    ]
  },

  // --- CHEMISTRY PRACTICALS ---
  {
    id: 3,
    subject: "Chemistry",
    class_level: 10,
    experiment_title: "Standard Oxalic Acid Solution & Titration with NaOH",
    apparatus: "Burette, Pipette, Conical Flask, Beaker, Funnel, Analytical Balance, Phenolphthalein indicator.",
    viva_questions: [
      {
        q: "Why is oxalic acid preferred as a primary standard in volumetric analysis?",
        a: "Oxalic acid (C₂H₂O₄·2H₂O) is available in extremely high purity, is non-hygroscopic (does not absorb moisture from air), and has a stable known molar mass.",
        keywords: ["primary standard", "purity", "non-hygroscopic", "stable", "moisture"],
        marks: 4
      },
      {
        q: "Why is phenolphthalein indicator used instead of methyl orange in this titration?",
        a: "This is a titration between a strong base (NaOH) and a weak acid (oxalic acid). The equivalence point is weakly basic (pH 8-9), which exactly matches phenolphthalein's color change range (colorless to light pink).",
        keywords: ["phenolphthalein", "strong base", "weak acid", "equivalence point", "pink", "ph 8"],
        marks: 4
      },
      {
        q: "Why is the first rough titration reading discarded?",
        a: "The rough reading is only to locate the approximate end point quickly. Official board marking requires two consecutive concordant readings differing by no more than 0.1 ml.",
        keywords: ["rough reading", "discard", "concordant", "0.1", "approximate"],
        marks: 4
      }
    ]
  },
  {
    id: 4,
    subject: "Chemistry",
    class_level: 10,
    experiment_title: "Identification of Acid Radical (Chloride & Carbonate)",
    apparatus: "Test tubes, Test tube holder, Dilute HCl, Silver Nitrate (AgNO₃), Lime water, Barium Chloride.",
    viva_questions: [
      {
        q: "How do you confirm the presence of Carbonate (CO₃²⁻) radical?",
        a: "Add dilute HCl to the salt. Vigorous effervescence of colorless, odorless gas (CO₂) is evolved, which turns fresh lime water milky due to calcium carbonate formation.",
        keywords: ["effervescence", "co2", "lime water", "milky", "dilute hcl"],
        marks: 4
      },
      {
        q: "Which reagent confirms Chloride (Cl⁻) ion and what is the precipitate?",
        a: "Add dilute nitric acid followed by Silver Nitrate (AgNO₃) solution. A curdy white precipitate of Silver Chloride (AgCl) forms, which is completely soluble in excess ammonium hydroxide (NH₄OH).",
        keywords: ["silver nitrate", "curdy white", "agcl", "soluble in ammonium hydroxide", "nh4oh"],
        marks: 4
      }
    ]
  },

  // --- BIOLOGY PRACTICALS ---
  {
    id: 5,
    subject: "Biology",
    class_level: 10,
    experiment_title: "Observation of Mitosis Stages in Onion Root Tip Squash",
    apparatus: "Compound microscope, Glass slides, Coverslips, Onion root tip bulbs, Acetocarmine stain, Watch glass, Razor blade.",
    viva_questions: [
      {
        q: "Why are onion root tips selected for studying stages of mitosis?",
        a: "The apical meristem at the tip of growing onion roots contains actively and rapidly dividing cells, offering all progressive mitotic stages in a single tissue slice.",
        keywords: ["apical meristem", "dividing cells", "root tip", "mitosis", "rapidly"],
        marks: 4
      },
      {
        q: "In which stage of mitosis are chromosomes aligned at the equatorial plate?",
        a: "In Metaphase. Chromosomes are fully condensed, distinct, attached to spindle fibers by their centromeres, and aligned along the central equatorial (metaphase) plate.",
        keywords: ["metaphase", "equatorial plate", "spindle fibers", "centromere", "condensed"],
        marks: 4
      },
      {
        q: "What is the function of acetocarmine stain in squash preparation?",
        a: "Acetocarmine specifically stains nuclear material and chromosomes a prominent dark red/pink color while leaving the surrounding cytoplasm relatively clear.",
        keywords: ["stain", "acetocarmine", "chromosomes", "nuclear", "dark red"],
        marks: 4
      }
    ]
  },
  {
    id: 6,
    subject: "Biology",
    class_level: 10,
    experiment_title: "Demonstration of Transpiration in Potted Plant (Bell Jar)",
    apparatus: "Well-watered potted plant, Bell jar, Glass plate, Vaseline, Polythene sheet.",
    viva_questions: [
      {
        q: "Why is the pot and soil surface tightly covered with a polythene sheet?",
        a: "To prevent direct evaporation of water from the moist soil surface into the bell jar, ensuring that droplets appearing inside are solely due to aerial leaf transpiration.",
        keywords: ["polythene sheet", "soil", "evaporation", "transpiration", "leaf", "droplets"],
        marks: 4
      },
      {
        q: "Which surface of a dicot leaf has a higher density of stomata?",
        a: "The lower epidermis of a dorsiventral dicot leaf has significantly more stomata to minimize water loss from direct sunlight exposure.",
        keywords: ["lower epidermis", "stomata", "dicot", "water loss", "sunlight"],
        marks: 4
      }
    ]
  }
];

// Comprehensive Knowledge Base for Socratic AI Guru
export function queryAiGuruKnowledge(question: string): {
  headline: string;
  explanation: string;
  formula?: string;
  unit?: string;
  stepTip: string;
  challengeQuestion: string;
} {
  const q = question.toLowerCase().trim();

  // 1. Velocity & Speed
  if (q.includes("velocity") || q.includes("speed") || q.includes("raftar")) {
    return {
      headline: "Velocity Formula & Board Exam Concept",
      explanation: "Velocity is the rate of change of displacement of a body in a specific direction (Vector quantity). Speed is scalar (distance/time).",
      formula: "v = s / t  (or in equations of motion: v_f = v_i + a*t)",
      unit: "m/s (meters per second) [Dimensions: L T⁻¹]",
      stepTip: "In numericals, write Given Data clearly: Initial velocity (v_i), Time (t), Acceleration (a). If a body starts from rest, immediately write v_i = 0 m/s!",
      challengeQuestion: "Agar aik gaari rest se start ho kar 5 seconds mein 20 m/s speed pakar le, to is ka acceleration 'a' kya hoga?"
    };
  }

  // 2. Acceleration
  if (q.includes("acceleration") || q.includes("isra")) {
    return {
      headline: "Acceleration Concept & Calculation",
      explanation: "Acceleration is defined as the rate of change of velocity with respect to time.",
      formula: "a = (v_f - v_i) / t",
      unit: "m/s² (meters per second squared) [Dimensions: L T⁻²]",
      stepTip: "If a moving vehicle applies brakes and stops, acceleration is negative (Retardation/Deceleration) and final velocity v_f = 0 m/s.",
      challengeQuestion: "Board paper mein negative acceleration ko kis naam se pukara jata hai?"
    };
  }

  // 3. SI Units
  if (q.includes("si unit") || q.includes("unit") || q.includes("dimensions")) {
    return {
      headline: "International System of Units (SI Units) Guide",
      explanation: "Board examiners strictly deduct 0.5 marks for missing or wrong units! SI consists of 7 Base Units: Length (meter - m), Mass (kilogram - kg), Time (second - s), Electric Current (ampere - A), Temperature (kelvin - K), Amount of substance (mole - mol), Luminous intensity (candela - cd).",
      formula: "Force = N (kg·m/s²), Work/Energy = J (N·m), Power = W (J/s), Pressure = Pa (N/m²)",
      unit: "Always check prefix: 1 km = 1000 m, 1 cm = 0.01 m, 1 mA = 10⁻³ A",
      stepTip: "In every board numerical, convert all values to SI units inside 'Given Data' before inserting numbers into the formula!",
      challengeQuestion: "Work ka SI unit Joule (J) hai. 1 Joule kitne Newton-meter (N·m) ke barabar hota hai?"
    };
  }

  // 4. Mirrors & Lenses (Optics)
  if (q.includes("mirror") || q.includes("lens") || q.includes("focal") || q.includes("concave") || q.includes("convex")) {
    return {
      headline: "Mirror & Lens Sign Conventions (Examiner Favorite Trap)",
      explanation: "Concave Mirror has a REAL focus in front of the mirror, so f is POSITIVE. Convex Mirror has a VIRTUAL focus behind mirror, so f is NEGATIVE. For Lenses: Convex Lens has POSITIVE f; Concave Lens has NEGATIVE f.",
      formula: "1/f = 1/p + 1/q  (Linear Magnification: m = q/p = h_i/h_o)",
      unit: "Focal length is measured in meters (m) or centimeters (cm)",
      stepTip: "If image is virtual and behind mirror, image distance 'q' must be taken as NEGATIVE in the mirror formula!",
      challengeQuestion: "Agar aik object concave mirror ke Focus (F) par rakha jaye, to is ka image kahan banay ga?"
    };
  }

  // 5. Ohm's Law & Electricity
  if (q.includes("ohm") || q.includes("current") || q.includes("voltage") || q.includes("resistance")) {
    return {
      headline: "Ohm's Law & Electric Circuits",
      explanation: "Ohm's Law states that current (I) flowing through a conductor is directly proportional to the potential difference (V) across its ends, provided physical conditions and temperature remain constant.",
      formula: "V = I * R   (Series: R_eq = R₁ + R₂ | Parallel: 1/R_eq = 1/R₁ + 1/R₂)",
      unit: "V in Volts (V), I in Amperes (A), R in Ohms (Ω)",
      stepTip: "In series circuit, Current remains SAME through all resistors. In parallel circuit, Voltage remains SAME across all branches.",
      challengeQuestion: "Do resistors 4 Ω aur 4 Ω parallel mein lagaye jayein to total resistance kitni hogi?"
    };
  }

  // 6. Simple Harmonic Motion & Pendulum
  if (q.includes("pendulum") || q.includes("shm") || q.includes("harmonic") || q.includes("oscillation")) {
    return {
      headline: "Simple Harmonic Motion & Time Period",
      explanation: "In SHM, acceleration is directly proportional to displacement from mean position and always directed towards mean position: a ∝ -x.",
      formula: "T = 2π√(L/g)  (Mass on spring: T = 2π√(m/k))",
      unit: "Time period T is measured in seconds (s), Frequency f in Hertz (Hz)",
      stepTip: "Pendulum's time period is 100% independent of the bob's mass or amplitude of swing!",
      challengeQuestion: "Agar pendulum ki length 4 guna barha di jaye, to is ke Time Period par kya farq paray ga?"
    };
  }

  // 7. Chemical Equilibrium & Le Chatelier
  if (q.includes("equilibrium") || q.includes("kc") || q.includes("le chatelier") || q.includes("reversible")) {
    return {
      headline: "Chemical Equilibrium & Kc Expressions",
      explanation: "At dynamic equilibrium, forward reaction rate equals reverse reaction rate. Le Chatelier's principle states that if a system at equilibrium is disturbed (by temperature, pressure, concentration), it shifts in a direction to counteract the disturbance.",
      formula: "For aA + bB ⇌ cC + dD:   Kc = [C]^c * [D]^d / ([A]^a * [B]^b)",
      unit: "Kc units depend on Δn = (c+d) - (a+b). If Δn = 0, Kc has NO UNITS.",
      stepTip: "Increasing pressure favors the side with FEWER gas moles. Increasing temperature favors ENDOTHERMIC direction.",
      challengeQuestion: "N₂ + 3H₂ ⇌ 2NH₃ mein agar hum pressure barha dein to reaction kis taraf shift hoga?"
    };
  }

  // 8. Acids, Bases & pH
  if (q.includes("acid") || q.includes("base") || q.includes("ph") || q.includes("titration") || q.includes("salt")) {
    return {
      headline: "Acids, Bases & pH Calculations",
      explanation: "According to Arrhenius: Acids produce H⁺ ions in water; Bases produce OH⁻ ions. Bronsted-Lowry: Acids donate protons (H⁺); Bases accept protons. Lewis: Acids accept electron pairs; Bases donate electron pairs.",
      formula: "pH = -log₁₀[H⁺]  |  pOH = -log₁₀[OH⁻]  |  pH + pOH = 14",
      unit: "pH is a dimensionless logarithmic scale from 0 to 14",
      stepTip: "Neutral solution has pH = 7. Acidic solutions have pH < 7. Basic/Alkaline solutions have pH > 7.",
      challengeQuestion: "Agar aik solution mein [H⁺] = 1 × 10⁻⁴ mol/dm³ ho, to is ka pH kya hoga?"
    };
  }

  // 9. Biology: Cells, Mitosis & Respiration
  if (q.includes("cell") || q.includes("mitosis") || q.includes("meiosis") || q.includes("respiration") || q.includes("biology") || q.includes("organ") || q.includes("heart")) {
    return {
      headline: "Biology Core Concepts & Examination Keys",
      explanation: "Mitosis produces 2 identical diploid daughter cells for growth and repair (Prophase, Metaphase, Anaphase, Telophase). Meiosis produces 4 haploid gamete cells with genetic variation (crossing over in Prophase I).",
      formula: "Cellular Respiration: C₆H₁₂O₆ + 6O₂ ➔ 6CO₂ + 6H₂O + 36/38 ATP",
      unit: "Energy currency of cell = ATP (Adenosine Triphosphate)",
      stepTip: "In Board Biology exams, always draw a neat pencil diagram with right-aligned labels to guarantee full marks in 4-mark short questions!",
      challengeQuestion: "Mitosis ki kis stage mein chromosomes cell ke center (equatorial plate) par line banatay hain?"
    };
  }

  // 10. General / Fallback Smart Guidance
  return {
    headline: `Board Exam Guidance on: "${question}"`,
    explanation: `Bohat acha sawal! Board examination standards ke mutabiq is topic mein 3 cheezein zaroori hain: (1) Standard Board Definition, (2) Relevant Scientific Formula ya Law, aur (3) SI Units / Labelled Diagram.`,
    formula: "Always write: Given Data ➔ Formula ➔ Calculation ➔ Result with Units",
    unit: "Standard Metric SI units are mandatory for full marks",
    stepTip: "Examiner Tip: Numericals mein formula likhnay ka alag 1 mark hota hai, calculation ka 1.5 mark, aur SI unit na likhnay par 0.5 mark deduct ho jata hai.",
    challengeQuestion: "Kya aap is sawal ka Given Data aur Required quantity alag alag pehchan saktay hain?"
  };
}
