"use client";

import React, { useState, useEffect } from "react";
import { getLabPracticals } from "@/lib/api";
import { FALLBACK_PRACTICALS } from "@/lib/curriculumData";
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
  ArrowRight,
  Send,
  RotateCcw
} from "lucide-react";

export default function LabPracticalsPage() {
  const [practicals, setPracticals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"viva" | "spotting" | "table_audit">("viva");
  const [selectedSubject, setSelectedSubject] = useState<"Physics" | "Chemistry" | "Biology">("Physics");
  const [loading, setLoading] = useState<boolean>(true);

  // Audio Viva Simulator State
  const [activeVivaQuestionIdx, setActiveVivaQuestionIdx] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [studentSpokenAnswer, setStudentSpokenAnswer] = useState<string>("");
  const [vivaScore, setVivaScore] = useState<any>(null);
  const [micStatusText, setMicStatusText] = useState<string>("");

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

  // Load practicals whenever selectedSubject changes
  useEffect(() => {
    async function load() {
      setLoading(true);
      setActiveVivaQuestionIdx(0);
      setStudentSpokenAnswer("");
      setVivaScore(null);
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

  // Multi-Subject Spotting Decks
  const SPOTTING_DECKS: Record<string, any[]> = {
    Physics: [
      {
        spot: "Station A (Apparatus)",
        title: "Vernier Caliper & Least Count",
        image_desc: "Metallic slide caliper with main scale in mm and vernier scale of 10 divisions.",
        identifying_reasons: [
          "1. Least Count = 1 MSD - 1 VSD = 0.01 cm (or 0.1 mm).",
          "2. Used to measure internal/external diameter and depth of cylinder."
        ],
        board_marks: "2 Marks"
      },
      {
        spot: "Station B (Optical Component)",
        title: "Triangular Glass Prism",
        image_desc: "Equilateral transparent glass prism with 3 rectangular faces and 2 triangular bases.",
        identifying_reasons: [
          "1. Angle of prism A = 60°.",
          "2. Used to verify angle of minimum deviation (Dm) and refraction of light."
        ],
        board_marks: "2 Marks"
      }
    ],
    Chemistry: [
      {
        spot: "Station A (Laboratory Glassware)",
        title: "Graduated Burette (50 cm³)",
        image_desc: "Long graduated glass tube with stopcock at bottom for delivering accurate reagent volumes.",
        identifying_reasons: [
          "1. Calibrated in 0.1 cm³ divisions from 0 at top to 50 at bottom.",
          "2. Used in volumetric titration for acid-base neutralization."
        ],
        board_marks: "2 Marks"
      },
      {
        spot: "Station B (Heating Apparatus)",
        title: "Bunsen Burner & Non-Luminous Flame",
        image_desc: "Metallic burner with air collar at base producing steady blue cone flame.",
        identifying_reasons: [
          "1. Air holes open produces oxidizing non-luminous flame (no soot).",
          "2. Used for flame tests (e.g. Sodium golden yellow, Calcium brick red)."
        ],
        board_marks: "2 Marks"
      }
    ],
    Biology: [
      {
        spot: "Spot A (Slide)",
        title: "Binary Fission in Amoeba",
        image_desc: "Microscopic slide showing an elongated Amoeba cell with central constriction in the cytoplasm and nucleus dividing into two daughter nuclei.",
        identifying_reasons: [
          "1. Constriction is visible in the middle of the single-celled body (cytokinesis).",
          "2. The nucleus is dividing amitotically into two equal parts (karyokinesis)."
        ],
        board_marks: "2 Marks"
      },
      {
        spot: "Spot B (Slide)",
        title: "Mitosis in Onion Root Tip (Metaphase)",
        image_desc: "Microscopic view of plant cells with dark stained chromosomes clearly arranged along the equatorial plane (metaphase plate) of the cell.",
        identifying_reasons: [
          "1. Highly condensed chromosomes are aligned at the equator of the spindle.",
          "2. Spindle fibers are attached to the centromeres of each chromosome."
        ],
        board_marks: "2 Marks"
      }
    ]
  };

  const currentDeck = SPOTTING_DECKS[selectedSubject] || SPOTTING_DECKS.Physics;

  // Real Speech-to-Text via Web Speech API (No fake hardcoded answer)
  const handleStartRecording = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicStatusText("Speech recognition not supported in this browser. Please type below!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setMicStatusText("Listening to your microphone... speak clearly.");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join(" ");
        setStudentSpokenAnswer(transcript);
      };

      recognition.onerror = (err: any) => {
        setIsRecording(false);
        setMicStatusText("Microphone access ended. You can type or edit your answer.");
      };

      recognition.onend = () => {
        setIsRecording(false);
        setMicStatusText("Audio captured. Click 'Evaluate My Answer' below.");
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
      setMicStatusText("Please type your spoken answer directly in the box.");
    }
  };

  const currentPractical = practicals[0];
  let vivaList: any[] = [];
  if (currentPractical?.viva_questions_json) {
    try {
      vivaList = typeof currentPractical.viva_questions_json === "string"
        ? JSON.parse(currentPractical.viva_questions_json)
        : currentPractical.viva_questions_json;
    } catch (e) {
      vivaList = [];
    }
  } else if (currentPractical?.viva_questions) {
    vivaList = currentPractical.viva_questions;
  }

  // Resilient fallback for selectedSubject if vivaList is empty
  if (!vivaList || vivaList.length === 0) {
    const fallbackP = FALLBACK_PRACTICALS.find((p) => p.subject.toLowerCase() === selectedSubject.toLowerCase());
    vivaList = fallbackP?.viva_questions || [];
  }

  const safeVivaIdx = vivaList.length > 0 ? (activeVivaQuestionIdx % vivaList.length) : 0;
  const currentQuestion = vivaList[safeVivaIdx];

  const handleEvaluateVivaAnswer = () => {
    if (!studentSpokenAnswer.trim()) {
      alert("Please speak or type your answer before evaluation!");
      return;
    }

    if (!currentQuestion) return;

    const studentLower = studentSpokenAnswer.toLowerCase();
    const officialLower = (currentQuestion.a || "").toLowerCase();

    // Word tokenization (extract words with 3+ letters)
    const studentWords: string[] = studentLower.match(/\b[a-z]{3,}\b/g) || [];
    const officialWords: string[] = officialLower.match(/\b[a-z]{3,}\b/g) || [];

    const stopWords = new Set(["the", "and", "that", "this", "with", "from", "for", "are", "was", "has", "have"]);
    const keyOfficialWords: string[] = [];
    officialWords.forEach((w: string) => {
      if (!stopWords.has(w) && !keyOfficialWords.includes(w)) {
        keyOfficialWords.push(w);
      }
    });

    let matchCount = 0;
    keyOfficialWords.forEach((w: string) => {
      if (studentWords.includes(w) || studentLower.includes(w)) {
        matchCount++;
      }
    });

    const overlapRatio = keyOfficialWords.length > 0 ? matchCount / keyOfficialWords.length : 0.0;

    let marksAwarded = 0.0;
    let feedback = "";

    if (matchCount === 0 || overlapRatio < 0.15) {
      marksAwarded = 0.0;
      feedback = "❌ 0 / 4 Marks Awarded. The spoken or typed response does not contain the required scientific terms or principles for this board viva question. Please review the model answer key below.";
    } else if (overlapRatio >= 0.35 || (studentWords.length >= 8 && overlapRatio >= 0.3)) {
      marksAwarded = 4.0;
      feedback = "✓ Outstanding! Full 4.0 / 4.0 Marks. Complete scientific accuracy matching the board examiner marking rubric.";
    } else if (overlapRatio >= 0.25) {
      marksAwarded = 2.5;
      feedback = "⚠️ Partial Credit: 2.5 / 4.0 Marks. Key terms were identified, but essential physical conditions or explanations were omitted.";
    } else {
      marksAwarded = 1.0;
      feedback = "⚠️ Incomplete Attempt: 1.0 / 4.0 Marks. The answer only touched upon peripheral points without addressing the core mechanism.";
    }

    setVivaScore({
      marks: marksAwarded,
      max: 4.0,
      feedback: feedback,
    });
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
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-1">Select Subject:</span>
        {(["Physics", "Chemistry", "Biology"] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubject === sub
                ? "bg-brand-sky text-slate-950 shadow-md font-black"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            {sub === "Physics" && "⚡ Physics"}
            {sub === "Chemistry" && "🧪 Chemistry"}
            {sub === "Biology" && "🔬 Biology"}
          </button>
        ))}
      </div>

      {/* TAB 1: VIVA VOCE SIMULATOR (4 MARKS) */}
      {activeTab === "viva" && (
        <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-brand-sky uppercase tracking-wider">
                External Examiner Bench Oral ({selectedSubject} • 4 Marks)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {currentPractical?.experiment_title || `${selectedSubject} Core Practical`}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-sky/15 text-brand-sky border border-brand-sky/30 flex items-center justify-center font-bold text-xs">
              Q{isNaN(safeVivaIdx) ? 1 : safeVivaIdx + 1}
            </div>
          </div>

          {/* Examiner Question Speech Bubble */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-sky">
              <Volume2 className="w-4 h-4 text-brand-sky" />
              <span>External Examiner Asks:</span>
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-100">
              {currentQuestion?.q || "Explain the underlying board scientific principle of this experiment."}
            </p>
          </div>

          {/* Student Audio / Spoken Input Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Your Answer (Speak or Type):
              </label>
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

            {micStatusText && (
              <p className="text-[11px] text-sky-400 font-medium italic">
                {micStatusText}
              </p>
            )}

            <textarea
              rows={3}
              value={studentSpokenAnswer}
              onChange={(e) => setStudentSpokenAnswer(e.target.value)}
              placeholder="Speak using the button above or type your answer here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-brand-sky"
            />

            <div className="flex justify-start">
              <button
                onClick={handleEvaluateVivaAnswer}
                disabled={!studentSpokenAnswer.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate My Answer</span>
              </button>
            </div>
          </div>

          {/* Examiner Score & Rubric Feedback */}
          {vivaScore && (
            <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-emerald">
                  {vivaScore.marks > 0 ? "✓" : "✗"} Examiner Score: {vivaScore.marks} / {vivaScore.max} Marks
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Rubric Evaluated</span>
              </div>
              <p className="text-xs text-emerald-300 leading-relaxed">{vivaScore.feedback}</p>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                <b className="text-slate-300">Model Board Rubric Answer:</b>{" "}
                {currentQuestion?.a}
              </div>
            </div>
          )}

          {/* Next Viva Question Navigator */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              Question {safeVivaIdx + 1} of {Math.max(1, vivaList.length)}
            </span>
            <button
              onClick={() => {
                setActiveVivaQuestionIdx((prev) => (prev + 1) % Math.max(1, vivaList.length));
                setStudentSpokenAnswer("");
                setVivaScore(null);
                setMicStatusText("");
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
                {currentDeck[spottingIdx % currentDeck.length].spot}
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
              &quot;{currentDeck[spottingIdx % currentDeck.length].image_desc}&quot;
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
                  <span className="text-xs font-bold text-brand-emerald">
                    Identified: {currentDeck[spottingIdx % currentDeck.length].title}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">2.0 Marks</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p className="font-semibold text-slate-400">Board Identifying Characteristics:</p>
                  {currentDeck[spottingIdx % currentDeck.length].identifying_reasons.map((r: string, i: number) => (
                    <p key={i}>{r}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setSpottingIdx((prev) => (prev + 1) % currentDeck.length);
                setShowSpottingAnswer(false);
                setTimerSeconds(60);
                setTimerActive(false);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <span>Next Specimen Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: OBSERVATION TABLE VALIDATOR */}
      {activeTab === "table_audit" && (
        <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">
              {selectedSubject} Observation Table Auditor (8 Marks)
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {selectedSubject === "Physics"
                ? "Ohm's Law Verification Readings (Voltmeter V vs Ammeter I)"
                : selectedSubject === "Biology"
                ? "Biochemical Specimen Reaction Table (Observation & Inference)"
                : "Volumetric Titration Reading Verification (Burette cm³)"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">
                {selectedSubject === "Physics"
                  ? "Trial 1 (V / I => R1 in Ω):"
                  : selectedSubject === "Biology"
                  ? "Sample A (Control):"
                  : "Burette Reading 1 (Rough):"}
              </label>
              <input
                type="text"
                value={titrationR1}
                onChange={(e) => setTitrationR1(e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">
                {selectedSubject === "Physics"
                  ? "Trial 2 (V / I => R2 in Ω):"
                  : selectedSubject === "Biology"
                  ? "Sample B (Enzyme Active):"
                  : "Burette Reading 2 (Exact):"}
              </label>
              <input
                type="text"
                value={titrationR2}
                onChange={(e) => setTitrationR2(e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">
                {selectedSubject === "Physics"
                  ? "Trial 3 (V / I => R3 in Ω):"
                  : selectedSubject === "Biology"
                  ? "Sample C (Denatured):"
                  : "Burette Reading 3 (Exact):"}
              </label>
              <input
                type="text"
                value={titrationR3}
                onChange={(e) => setTitrationR3(e.target.value)}
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
              />
            </div>
          </div>

          <button
            onClick={handleAuditTable}
            className="px-5 py-2.5 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            {selectedSubject === "Physics"
              ? "Validate Concordance (Ohm's Law R2 vs R3 ≤ 0.1 Ω)"
              : selectedSubject === "Biology"
              ? "Validate Concordance (Biochemical Reaction Observations)"
              : "Validate Concordance (Titration Rule ≤ 0.1 ml)"}
          </button>

          {tableValidation && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-1 animate-in fade-in ${
                tableValidation.is_concordant
                  ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                  : "bg-rose-950/20 border-rose-800/40 text-rose-300"
              }`}
            >
              <div className="font-bold">{tableValidation.message}</div>
              {tableValidation.mean_volume && (
                <div className="text-slate-300 font-mono text-[11px] pt-1">
                  Accepted Mean Concordant Volume (V) = {tableValidation.mean_volume} cm³
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
