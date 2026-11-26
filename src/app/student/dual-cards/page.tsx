"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { Award, Sparkles, CheckCheck, BookOpen, GraduationCap } from "lucide-react";

interface DualCard {
  id: string;
  grade: number;
  subject: string;
  topic: string;
  marks: string;
  question_en: string;
  samjho_roman_urdu: string;
  exam_sheet_english: string;
  e_marking_keywords: string[];
}

const ALL_DUAL_CARDS: DualCard[] = [
  // ==================== CLASS 9 STUDY CARDS ====================
  {
    id: "newton_second_law",
    grade: 9,
    subject: "Physics",
    topic: "Dynamics & Force",
    marks: "4 Marks (Section B)",
    question_en: "State Newton's Second Law of Motion and derive the formula F = ma.",
    samjho_roman_urdu:
      "Simple Concept: Jab kisi body par net force lagti hai, to us mein force ki simt (direction) mein acceleration paida hota hai. Yeh acceleration force ke directly proportional hota hai aur mass ke inversely proportional hota hai. Jab dono ko combine karte hain to F = ma banta hai. 1 Newton ki board definition lazmi likhein: '1 N woh force hai jo 1 kg mass mein 1 m/s² ka acceleration paida kare'.",
    exam_sheet_english:
      "Newton's Second Law of Motion states that when a net external force acts on a body, it produces an acceleration in the direction of the force. The acceleration is directly proportional to the magnitude of the force and inversely proportional to the mass of the body.\n\nDerivation:\n  a ∝ F\n  a ∝ 1/m\n  => a ∝ F/m\n  => F = k · m · a\nIn SI units, constant k = 1, therefore:\n  F = m × a\n\nDefinition of 1 Newton:\nOne Newton (1 N) is that force which produces an acceleration of 1 m/s² in a body of mass 1 kg (1 N = 1 kg·m/s²).",
    e_marking_keywords: ["directly proportional to force", "inversely proportional to mass", "direction of force", "F = ma", "1 N = 1 kg·m/s²"]
  },
  {
    id: "gravitation_mass_earth",
    grade: 9,
    subject: "Physics",
    topic: "Gravitation",
    marks: "5 Marks (Section C)",
    question_en: "State Law of Universal Gravitation and calculate the mass of the Earth (Me).",
    samjho_roman_urdu:
      "Asan alfaz mein: Kainaat ka har jism doosre jism ko apni taraf khenchta hai. Yeh kashish dono ke masses ke product ke directly proportional aur darmiyani faasle ke square ke inversely proportional hoti hai: F = G(m1·m2)/r². Zameen ke mass ke liye weight (W = mg) ko gravitational force ke barabar rakhein: mg = G(m·Me)/R². m cancel ho jata hai, Me = gR²/G = 6.0 × 10²⁴ kg. R = 6.4 × 10⁶ m yaad rakhein.",
    exam_sheet_english:
      "Newton's Law of Universal Gravitation states that every object in the universe attracts every other object with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers.\n\nFormula:\n  F = G · (m₁ · m₂) / r²\n  where G = 6.673 × 10⁻¹¹ N·m²/kg²\n\nMass of Earth (M_e) Derivation:\nEquating weight to gravitational pull on surface:\n  m · g = G · (m · M_e) / R²\n  => M_e = (g · R²) / G\n\nSubstituting values (g = 9.8 m/s², R = 6.4 × 10⁶ m):\n  M_e = (9.8 × (6.4 × 10⁶)²) / (6.673 × 10⁻¹¹)\n  M_e ≈ 6.0 × 10²⁴ kg (Boxed final value with SI unit)",
    e_marking_keywords: ["product of masses", "inversely proportional to square of distance", "G = 6.673 × 10⁻¹¹", "M_e = gR²/G", "6.0 × 10²⁴ kg"]
  },
  {
    id: "mole_avogadro",
    grade: 9,
    subject: "Chemistry",
    topic: "Fundamentals of Chemistry",
    marks: "3 Marks (Section B)",
    question_en: "Define Mole and Avogadro's Number with suitable chemical examples.",
    samjho_roman_urdu:
      "Concept: Kisi bhi shai (element ya compound) ka atomic mass, molecular mass ya formula mass jab GRAMS mein zahir kiya jaye to usay 1 Mole kehte hain. 1 Mole mein particles (atoms, molecules ya ions) ki taadad hamesha 6.022 × 10²³ hoti hai, jisay Avogadro's Number (NA) kehte hain. Example: 1 mole Carbon = 12 g = 6.022 × 10²³ atoms; 1 mole H2O = 18 g = 6.022 × 10²³ molecules.",
    exam_sheet_english:
      "Mole:\nA mole is defined as the atomic mass, molecular mass, or formula mass of a substance expressed in grams.\n\nAvogadro's Number (N_A):\nThe number of particles (atoms, molecules, or formula units) present in exactly one mole of any substance. Its experimental value is:\n  N_A = 6.022 × 10²³ particles/mol\n\nExamples:\n• 1 mole of Carbon (C) = 12.0 g = 6.022 × 10²³ carbon atoms\n• 1 mole of Water (H₂O) = 18.0 g = 6.022 × 10²³ water molecules",
    e_marking_keywords: ["expressed in grams", "6.022 × 10²³", "N_A", "1 mole of C = 12 g", "1 mole of H2O = 18 g"]
  },
  {
    id: "mitosis_vs_meiosis_9",
    grade: 9,
    subject: "Biology",
    topic: "Cell Cycle",
    marks: "5 Marks (Section C Table)",
    question_en: "Differentiate between Mitosis and Meiosis across 5 standard board criteria.",
    samjho_roman_urdu:
      "Paper Presentation Trick: Board examiner paragraph ke bajaye 2-column tabular comparison ko poore 5/5 marks deta hai. Mitosis somatic (body) cells mein hoti hai, 2 daughter cells banti hain, chromosome number 2n (same) rehta hai, genetic crossing over nahi hoti. Meiosis germ/reproductive cells mein hoti hai, 4 haploid (n) cells banti hain, crossing over hoti hai jis se variations aati hain.",
    exam_sheet_english:
      "Comparison between Mitosis and Meiosis:\n\n1. Occurrence: Mitosis occurs in somatic (vegetative body) cells; Meiosis occurs exclusively in germ line (reproductive) cells.\n2. Number of Divisions: Mitosis involves 1 nuclear division; Meiosis involves 2 successive divisions (Meiosis I and II).\n3. Daughter Cells Produced: Mitosis produces 2 daughter cells; Meiosis produces 4 daughter cells.\n4. Chromosome Number: Daughter cells remain diploid (2n, identical to parent); Daughter cells become haploid (n, half of parent).\n5. Crossing Over & Variation: Crossing over is absent in Mitosis (genetic clones); Crossing over occurs during Prophase I of Meiosis (causes genetic variation).",
    e_marking_keywords: ["somatic cells vs germ cells", "2 daughter cells vs 4 daughter cells", "diploid (2n) vs haploid (n)", "crossing over Prophase I", "genetic variation"]
  },

  // ==================== CLASS 10 STUDY CARDS ====================
  {
    id: "snell_law",
    grade: 10,
    subject: "Physics",
    topic: "Refraction of Light",
    marks: "4 Marks (Section B)",
    question_en: "State both Laws of Refraction including Snell's Law and its mathematical formula.",
    samjho_roman_urdu:
      "Senior Rule: Pehla qanoon aksar bache bhool jate hain: Incident ray, refracted ray aur normal line teeno EK HI PLANE mein hote hain. Doosra qanoon (Snell's Law) kehta hai ke angle of incidence ke sine (sin i) aur angle of refraction ke sine (sin r) ka ratio hamesha CONSTANT rehta hai. Yeh constant 'Refractive Index (n)' kehlata hai: n = sin(i)/sin(r). Dono laws likhenge to poore 4 marks milenge.",
    exam_sheet_english:
      "Laws of Refraction of Light:\n\n1. First Law (Coplanar Law):\nThe incident ray, the refracted ray, and the normal at the point of incidence all lie in the same geometric plane.\n\n2. Second Law (Snell's Law):\nThe ratio of the sine of angle of incidence to the sine of angle of refraction is always constant for a given pair of media.\n\nMathematical Formula:\n  n = sin(i) / sin(r)\n\nWhere 'n' is the refractive index of the second medium with respect to the first medium (unitless ratio).",
    e_marking_keywords: ["lie in the same plane", "ratio of sine", "angle of incidence (sin i)", "angle of refraction (sin r)", "constant", "refractive index n = sin(i)/sin(r)"]
  },
  {
    id: "ohm_law",
    grade: 10,
    subject: "Physics",
    topic: "Current Electricity",
    marks: "3 Marks (Section B)",
    question_en: "State Ohm's Law and mention its necessary physical condition.",
    samjho_roman_urdu:
      "Concept yaad rakhein: Kisi bhi conductor ke do siron ke darmian potential difference (V) us mein behne wale current (I) ke directly proportional hota hai. LEKIN shart yeh hai ke conductor ka temperature aur physical state bilkul CONSTANT rehni chahiye. Agar temperature barh gaya to resistance change ho jaye gi aur graph straight line nahi rahega.",
    exam_sheet_english:
      "Ohm's Law states that the current (I) flowing through a conductor is directly proportional to the potential difference (V) applied across its ends, provided physical conditions (especially temperature) remain constant.\n\nMathematical Formula:\n  V ∝ I  =>  V = I × R\n\nWhere 'R' is the electrical resistance of the conductor measured in Ohms (Ω).",
    e_marking_keywords: ["directly proportional", "potential difference (V)", "current (I)", "temperature remains constant", "V = IR", "Ohms (Ω)"]
  },
  {
    id: "mirror_focal_length",
    grade: 10,
    subject: "Physics",
    topic: "Geometrical Optics",
    marks: "4 Marks (Section C Numericals)",
    question_en: "Explain the sign convention rule for focal length of Concave and Convex mirrors.",
    samjho_roman_urdu:
      "Golden Board Rule: Concave mirror ka focus mirror ke samnay (real) hota hai, is liye is ki focal length f HAMESHA POSITIVE (+) likhi jati hai. Convex mirror ka focus mirror ke peeche (virtual) hota hai, is liye is ki focal length f HAMESHA NEGATIVE (-) likhi jati hai. Numerical mein agar convex mirror ka f positive likha to poora question 0 ho jaye ga.",
    exam_sheet_english:
      "1. Concave Mirror: Since parallel light rays converge in front of the reflecting surface (real focus), its focal length (f) is always taken as POSITIVE (f > 0).\n\n2. Convex Mirror: Since rays appear to diverge from a point behind the mirror (virtual focus), its focal length (f) is always taken as NEGATIVE (f < 0).\n\n3. Object distance (p) is always positive. Image distance (q) is positive for real images (in front) and negative for virtual images (behind the mirror).",
    e_marking_keywords: ["real focus", "virtual focus", "converging", "diverging", "f > 0 positive for concave", "f < 0 negative for convex", "virtual image behind mirror"]
  },
  {
    id: "le_chatelier_10",
    grade: 10,
    subject: "Chemistry",
    topic: "Chemical Equilibrium",
    marks: "4 Marks (Section B)",
    question_en: "State Le Chatelier's Principle and explain effect of concentration change.",
    samjho_roman_urdu:
      "Asan Concept: Agar koi system dynamic equilibrium par ho aur aap bahar se koi tabdeeli (concentration, temperature, ya pressure) lagayein, to system us tabdeeli ko khatam (nullify) karne ke liye us taraf shift hota hai. Agar reactants barhayein ge to reaction FORWARD jaye ga taake zyada products banein.",
    exam_sheet_english:
      "Le Chatelier's Principle states that if a system at dynamic equilibrium is subjected to an external stress or change in concentration, temperature, or pressure, the system will adjust itself in such a direction as to counteract or nullify the effect of that change.\n\nEffect of Concentration:\n• Increasing Reactant Concentration: The equilibrium shifts in the forward direction to consume excess reactants and produce more products.\n• Increasing Product Concentration: The equilibrium shifts in the reverse direction to restore balance.",
    e_marking_keywords: ["system at equilibrium", "external stress", "nullify or counteract", "shifts forward", "shifts reverse"]
  }
];

export default function DualCardsPage() {
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<number>(10);
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [viewModes, setViewModes] = useState<Record<string, "samjho" | "exam">>({});

  // Sync with user's class grade on mount
  useEffect(() => {
    if (user?.class_grade) {
      setSelectedGrade(user.class_grade);
    }
  }, [user]);

  const toggleMode = (id: string, mode: "samjho" | "exam") => {
    setViewModes((prev) => ({ ...prev, [id]: mode }));
  };

  const filteredCards = ALL_DUAL_CARDS.filter((card) => {
    const gradeMatch = card.grade === selectedGrade;
    const subjectMatch = selectedSubject === "All" || card.subject === selectedSubject;
    return gradeMatch && subjectMatch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-emerald" />
            <span>"Samjho in Roman Urdu → Write in Board English" Dual Study Cards</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Master the concept in natural Roman Urdu first, then write the exact board-ready English answer with the keywords examiners look for.
          </p>
        </div>

        {/* Grade Toggle Pills (Class 9 vs Class 10) */}
        <div className="flex items-center gap-2 bg-[#10192D] p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedGrade(9)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedGrade === 9
                ? "bg-brand-indigo text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Class 9 (SSC-I)</span>
          </button>
          <button
            onClick={() => setSelectedGrade(10)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedGrade === 10
                ? "bg-brand-emerald text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Class 10 (SSC-II)</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2">
        {(["All", "Physics", "Chemistry", "Biology"] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedSubject === sub
                ? "bg-slate-800 text-brand-emerald border border-brand-emerald/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {sub}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto font-mono">
          Showing {filteredCards.length} study cards for Class {selectedGrade}
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-5">
        {filteredCards.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-[#10192D] border border-slate-800 rounded-2xl">
            No study cards found for Class {selectedGrade} {selectedSubject}.
          </div>
        ) : (
          filteredCards.map((card) => {
            const currentMode = viewModes[card.id] || "samjho";

            return (
              <div
                key={card.id}
                className="bg-[#10192D] border border-slate-800 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Card Header */}
                <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">
                      Class {card.grade} • {card.subject} • {card.topic} • {card.marks}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
                      {card.question_en}
                    </h3>
                  </div>

                  {/* 2-Mode Toggle Pill */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => toggleMode(card.id, "samjho")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        currentMode === "samjho"
                          ? "bg-brand-amber text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      💡 Samjho (Roman Urdu)
                    </button>
                    <button
                      onClick={() => toggleMode(card.id, "exam")}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        currentMode === "exam"
                          ? "bg-brand-emerald text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      📝 Exam Sheet (Board English)
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {currentMode === "samjho" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-amber uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-brand-amber" />
                        <span>Senior Mentor Guidance:</span>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed text-slate-200 font-medium">
                        {card.samjho_roman_urdu}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Concept understood?</span>
                        <button
                          onClick={() => toggleMode(card.id, "exam")}
                          className="text-brand-emerald font-bold hover:underline flex items-center gap-1"
                        >
                          Switch to Board English Sheet →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-brand-emerald uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <CheckCheck className="w-4 h-4 text-brand-emerald" />
                          <span>Board-style answer:</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">Full 100% Mark Allocation</span>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs md:text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                        {card.exam_sheet_english}
                      </div>

                      {/* E-Marking Keywords Pill Rack */}
                      <div className="space-y-1.5 pt-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Keywords examiners look for:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {card.e_marking_keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[11px] font-semibold"
                            >
                              ✓ {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
