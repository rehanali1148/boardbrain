"use client";

import React, { useState } from "react";
import NastaliqText from "@/components/urdu/NastaliqText";
import { Award, BookOpen, Sparkles, CheckCheck } from "lucide-react";

interface DualCard {
  id: string;
  topic: string;
  marks: string;
  question_en: string;
  samjho_roman_urdu: string;
  exam_sheet_english: string;
  e_marking_keywords: string[];
}

const DUAL_CARDS_DATA: DualCard[] = [
  {
    id: "snell_law",
    topic: "Refraction of Light",
    marks: "3 Marks (Section B)",
    question_en: "State Snell's Law of refraction and write its mathematical formula.",
    samjho_roman_urdu:
      "Simple concept: Jab light ek medium se doosre medium mein dakhil hoti hai, to angle of incidence ka sine (sin i) aur angle of refraction ka sine (sin r) ka ratio hamesha CONSTANT rehta hai. Is constant ko doosre medium ka 'Refractive Index' kehte hain. Examiner formula n = (sin i)/(sin r) lazmi dekhta hai.",
    exam_sheet_english:
      "Snell's Law states that the ratio of the sine of the angle of incidence to the sine of the angle of refraction is always constant for a given pair of media.\n\nMathematical Formula:\n  n = sin(i) / sin(r)\n\nWhere 'n' is the refractive index of the second medium with respect to the first medium.",
    e_marking_keywords: ["ratio of sine", "angle of incidence", "angle of refraction", "constant", "refractive index", "n = sin(i) / sin(r)"],
  },
  {
    id: "ohm_law",
    topic: "Current Electricity",
    marks: "3 Marks (Section B)",
    question_en: "State Ohm's Law and mention its necessary physical condition.",
    samjho_roman_urdu:
      "Concept yaad rakhein: Kisi bhi conductor ke do siron ke darmian potential difference (V) us mein behne wale current (I) ke directly proportional hota hai. LEKIN shart yeh hai ke conductor ka temperature aur physical state bilkul CONSTANT rehni chahiye. Agar temperature barh gaya to resistance change ho jaye gi aur graph straight line nahi rahega.",
    exam_sheet_english:
      "Ohm's Law states that the current (I) flowing through a conductor is directly proportional to the potential difference (V) applied across its ends, provided physical conditions (especially temperature) remain constant.\n\nMathematical Formula:\n  V ∝ I  =>  V = I × R\n\nWhere 'R' is the electrical resistance of the conductor measured in Ohms (Ω).",
    e_marking_keywords: ["directly proportional", "potential difference", "current", "temperature remains constant", "V = IR", "Ohms (Ω)"],
  },
  {
    id: "mirror_focal_length",
    topic: "Optics & Mirrors",
    marks: "4 Marks (Section C Numericals)",
    question_en: "Explain the sign convention rule for focal length of Concave and Convex mirrors.",
    samjho_roman_urdu:
      "Golden Board Rule: Concave mirror ka focus mirror ke samnay (real) hota hai, is liye is ki focal length f HAMESHA POSITIVE (+) likhi jati hai. Convex mirror ka focus mirror ke peeche (virtual) hota hai, is liye is ki focal length f HAMESHA NEGATIVE (-) likhi jati hai. Numerical mein agar convex mirror ka f positive likha to poora question 0 ho jaye ga.",
    exam_sheet_english:
      "1. Concave Mirror: Since parallel light rays converge in front of the reflecting surface (real focus), its focal length (f) is always taken as POSITIVE (f > 0).\n\n2. Convex Mirror: Since rays appear to diverge from a point behind the mirror (virtual focus), its focal length (f) is always taken as NEGATIVE (f < 0).\n\n3. Object distance (p) is always positive. Image distance (q) is positive for real images and negative for virtual images behind the mirror.",
    e_marking_keywords: ["real focus", "virtual focus", "converging", "diverging", "f > 0 positive", "f < 0 negative", "virtual image behind mirror"],
  },
];

export default function DualCardsPage() {
  const [activeCardId, setActiveCardId] = useState<string>("snell_law");
  const [viewModes, setViewModes] = useState<Record<string, "samjho" | "exam">>({
    snell_law: "samjho",
    ohm_law: "samjho",
    mirror_focal_length: "samjho",
  });

  const toggleMode = (id: string, mode: "samjho" | "exam") => {
    setViewModes((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-emerald" />
          <span>"Samjho in Roman Urdu → Write in Board English" Dual Study Cards</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Master the concept in natural Roman Urdu first, then write the exact board-ready English answer with e-marking keywords.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-5">
        {DUAL_CARDS_DATA.map((card) => {
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
                    {card.topic} • {card.marks}
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
                        <span>Official Board Answer Format:</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">Full 100% Mark Allocation</span>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs md:text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {card.exam_sheet_english}
                    </div>

                    {/* E-Marking Keywords Pill Rack */}
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Board Examiner Must-See Keywords (E-Marking Tags):
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
        })}
      </div>
    </div>
  );
}
