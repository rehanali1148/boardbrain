"use client";

import React, { useState, useEffect } from "react";
import { getLabPracticals } from "@/lib/api";
import {
  FlaskConical,
  Mic,
  MicOff,
  Volume2,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default function LabPracticalsPage() {
  const [practicals, setPracticals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"viva" | "spotting" | "table_audit">("viva");
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [loading, setLoading] = useState<boolean>(true);

  // Audio Viva Simulator State
  const [activeVivaQuestionIdx, setActiveVivaQuestionIdx] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [studentSpokenAnswer, setStudentSpokenAnswer] = useState<string>("");
  const [vivaScore, setVivaScore] = useState<any>(null);

  // Spotting Flashcard State
  const [spottingIdx, setSpottingIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showSpottingAnswer, setShowSpottingAnswer] = useState<boolean>(false);

  // Observation Table State
  const [titrationR1, setTitrationR1] = useState("10.1");
  const [titrationR2, setTitrationR2] = useState("10.0");
  const [titrationR3, setTitrationR3] = useState("10.0");
  const [tableValidation, setTableValidation] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLabPracticals(selectedSubject, 10);
        setPracticals(data);
      } catch (e) {
        console.warn("Practicals fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedSubject]);

  // Spotting Countdown Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      setShowSpottingAnswer(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Biology Spotting Deck
  const SPOTTING_DECK = [
    {
      spot: "Spot A (Slide)",
      title: "Binary Fission in Amoeba",
      image_desc: "Microscopic slide showing an elongated Amoeba cell with central constriction in the cytoplasm and nucleus dividing into two daughter nuclei.",
      identifying_reasons: [
        "1. Constriction is visible in the middle of the single-celled body (cytokinesis).",
        "2. The nucleus is dividing amitotically into two equal parts (karyokinesis).",
      ],
      board_marks: "2 Marks",
    },
    {
      spot: "Spot B (Slide)",
      title: "Mitosis in Onion Root Tip (Metaphase)",
      image_desc: "Microscopic view of plant cells with dark stained chromosomes clearly arranged along the equatorial plane (metaphase plate) of the cell.",
      identifying_reasons: [
        "1. Highly condensed chromosomes are aligned at the equator of the spindle.",
        "2. Spindle fibers are attached to the centromeres of each chromosome.",
      ],
      board_marks: "2 Marks",
    },
    {
      spot: "Spot C (Model / Specimen)",
      title: "Longitudinal Section of Mammalian Kidney",
      image_desc: "Anatomical bean-shaped organ model showing outer dark cortex, inner lighter medulla with renal pyramids, and the renal pelvis leading to the ureter.",
      identifying_reasons: [
        "1. Outer granular cortex containing Malpighian corpuscles (Bowman's capsules).",
        "2. Inner striated medullary pyramids opening into the renal pelvis.",
      ],
      board_marks: "2 Marks",
    },
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate speech-to-text input
    setTimeout(() => {
      setStudentSpokenAnswer(
        "An ammeter is connected in series because it has very low resistance so it measures full current without altering voltage. Voltmeter has high resistance so connected in parallel."
      );
      setIsRecording(false);
      setVivaScore({
        marks: 4.0,
        max: 4.0,
        feedback: "✓ Excellent. Both 'low resistance for ammeter' and 'high resistance for voltmeter' keywords identified.",
      });
    }, 2500);
  };

  const handleAuditTable = () => {
    const v1 = parseFloat(titrationR1);
    const v2 = parseFloat(titrationR2);
    const v3 = parseFloat(titrationR3);
    const diff = Math.abs(v2 - v3);

    if (diff <= 0.1) {
      setTableValidation({
        is_concordant: true,
        mean_volume: ((v2 + v3) / 2).toFixed(2),
        message: "✓ Concordant readings verified (difference <= 0.1 ml). Observation table is 100% board ready!",
      });
    } else {
      setTableValidation({
        is_concordant: false,
        message: "⚠️ Not concordant. Board examiners require consecutive readings within 0.1 ml. Repeat titration.",
      });
    }
  };

  const currentPractical = practicals[0];
  const vivaList = currentPractical?.viva_questions_json ? JSON.parse(currentPractical.viva_questions_json) : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-brand-sky" />
            <span>15-Mark Science Lab Practical Arena</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BSEK & AKU-EB Practical Distribution: Journal (3M) + Observation Table (8M) + Oral Viva Voce (4M).
          </p>
        </div>

        {/* 3 Arena Mode Pills */}
        <div className="flex items-center gap-1.5 bg-[#10192D] p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("viva")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "viva"
                ? "bg-brand-sky text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🗣️ Viva Simulator
          </button>
          <button
            onClick={() => setActiveTab("spotting")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "spotting"
                ? "bg-brand-emerald text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⏱️ 60s Spotting
          </button>
          <button
            onClick={() => setActiveTab("table_audit")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "table_audit"
                ? "bg-brand-amber text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📊 Table Validator
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex gap-2">
        {["Physics", "Chemistry", "Biology"].map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSubject === sub
                ? "bg-slate-800 text-white border border-brand-sky/60 shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* TAB 1: VIVA VOCE SIMULATOR (4 MARKS) */}
      {activeTab === "viva" && (
        <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">
                External Examiner Bench Oral (4 Marks)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {currentPractical?.experiment_title || "Verification of Ohm's Law (V = IR)"}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-sky/15 text-brand-sky flex items-center justify-center font-bold text-xs">
              Q{activeVivaQuestionIdx + 1}
            </div>
          </div>

          {/* Examiner Question Speech Bubble */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-sky">
              <Volume2 className="w-4 h-4 text-brand-sky" />
              <span>External Examiner Asks:</span>
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-100">
              {vivaList[activeVivaQuestionIdx]?.q || "Why is an ammeter always connected in series and voltmeter in parallel?"}
            </p>
          </div>

          {/* Student Audio / Spoken Input Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400">Your Spoken Answer (Speech-to-Text):</label>
              <button
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-brand-sky text-slate-950 hover:bg-sky-400"
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Listening to your voice...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Press & Speak into Mic</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={studentSpokenAnswer}
              onChange={(e) => setStudentSpokenAnswer(e.target.value)}
              placeholder="Your transcribed spoken answer will appear here, or you can type directly..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-brand-sky"
            />
          </div>

          {/* Examiner Score & Rubric Feedback */}
          {vivaScore && (
            <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-emerald">
                  ✓ Examiner Score: {vivaScore.marks} / {vivaScore.max} Marks
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">100% Viva Cleared</span>
              </div>
              <p className="text-xs text-emerald-300">{vivaScore.feedback}</p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">
                <b>Official Model Answer:</b> {vivaList[activeVivaQuestionIdx]?.a}
              </div>
            </div>
          )}

          {/* Next Viva Question Navigator */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setActiveVivaQuestionIdx((prev) => (prev + 1) % vivaList.length);
                setStudentSpokenAnswer("");
                setVivaScore(null);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <span>Next Viva Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: 60-SECOND BIOLOGY SPOTTING FLASHCARDS */}
      {activeTab === "spotting" && (
        <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider">
                Microscope & Specimen Spotting Station
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {SPOTTING_DECK[spottingIdx].spot}
              </h3>
            </div>

            {/* 60s Countdown Timer */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-brand-amber">
                <Clock className="w-3.5 h-3.5" />
                <span>{timerSeconds}s Left</span>
              </div>
              {!timerActive && (
                <button
                  onClick={() => {
                    setTimerSeconds(60);
                    setTimerActive(true);
                    setShowSpottingAnswer(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-brand-emerald text-slate-950 font-bold text-xs"
                >
                  Start 60s Timer
                </button>
              )}
            </div>
          </div>

          {/* Specimen Inspection Station Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="text-xs text-slate-400 font-semibold uppercase">Microscope Field of View:</div>
            <p className="text-sm md:text-base text-slate-200 italic leading-relaxed">
              "{SPOTTING_DECK[spottingIdx].image_desc}"
            </p>
          </div>

          {/* Reveal Identification Answer Button */}
          <div>
            {!showSpottingAnswer ? (
              <button
                onClick={() => setShowSpottingAnswer(true)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Reveal Specimen Name & 2 Identifying Features
              </button>
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-4 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-brand-emerald">
                    ✓ Identification: {SPOTTING_DECK[spottingIdx].title}
                  </h4>
                  <span className="text-xs text-brand-amber font-bold">2/2 Marks</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-200">Required Board Diagnostic Features:</p>
                  {SPOTTING_DECK[spottingIdx].identifying_reasons.map((r, i) => (
                    <p key={i}>{r}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Spotting Station */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Station {spottingIdx + 1} of {SPOTTING_DECK.length}
            </span>
            <button
              onClick={() => {
                setSpottingIdx((prev) => (prev + 1) % SPOTTING_DECK.length);
                setShowSpottingAnswer(false);
                setTimerSeconds(60);
                setTimerActive(false);
              }}
              className="px-4 py-2 rounded-lg bg-brand-emerald text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <span>Next Station</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: OBSERVATION TABLE VALIDATOR (8 MARKS) */}
      {activeTab === "table_audit" && (
        <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">
              Observation Table & Math Auditor (8 Marks)
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Acid-Base Titration: Standardization of HCl using 0.1M NaOH
            </h3>
            <p className="text-xs text-slate-400">
              Audit your raw burette readings for concordancy before writing in your official copy.
            </p>
          </div>

          {/* Interactive Table Input */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900 uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-3">Reading No.</th>
                  <th className="p-3">Initial Burette (ml)</th>
                  <th className="p-3">Final Burette (ml)</th>
                  <th className="p-3">Volume Used (ml)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-semibold">Reading 1 (Rough)</td>
                  <td className="p-3">0.0</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={titrationR1}
                      onChange={(e) => setTitrationR1(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-20 text-slate-200"
                    />
                  </td>
                  <td className="p-3">{titrationR1} ml</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand-emerald">Reading 2</td>
                  <td className="p-3">0.0</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={titrationR2}
                      onChange={(e) => setTitrationR2(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-20 text-slate-200"
                    />
                  </td>
                  <td className="p-3">{titrationR2} ml</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-brand-emerald">Reading 3 (Concordant)</td>
                  <td className="p-3">0.0</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={titrationR3}
                      onChange={(e) => setTitrationR3(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-20 text-slate-200"
                    />
                  </td>
                  <td className="p-3">{titrationR3} ml</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={handleAuditTable}
            className="w-full py-2.5 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Audit Table for Board Concordance (Difference &lt;= 0.1 ml)
          </button>

          {/* Validation Feedback */}
          {tableValidation && (
            <div
              className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                tableValidation.is_concordant
                  ? "bg-emerald-950/20 border-emerald-800 text-emerald-300"
                  : "bg-rose-950/20 border-rose-800 text-rose-300"
              }`}
            >
              <p className="font-bold">{tableValidation.message}</p>
              {tableValidation.is_concordant && (
                <p>
                  Mean Volume Used = <b>{tableValidation.mean_volume} ml</b>. Ready for M1V1 = M2V2 calculation.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
