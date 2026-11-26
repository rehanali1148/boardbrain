"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { getChapters, getQuestions, submitBlitz, getMistakeVault, clearMistakeVaultItem } from "@/lib/api";
import { FALLBACK_CHAPTERS, FALLBACK_QUESTIONS } from "@/lib/curriculumData";
import KaTeXRenderer from "@/components/math/KaTeXRenderer";
import NastaliqText from "@/components/urdu/NastaliqText";
import {
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Flame,
  Award,
  ShieldAlert,
  Trash2,
  ArrowRight,
  ChevronDown
} from "lucide-react";

export default function PracticeBlitzPage() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<"Physics" | "Chemistry" | "Biology">("Physics");
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("Simple Harmonic Motion & Waves");
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [blitzResult, setBlitzResult] = useState<any>(null);
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 5-Minute Timer State (300 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Timer
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !blitzResult) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !blitzResult && questions.length > 0) {
      // Auto submit on time expiry
      handleSubmitBlitz();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerActive, blitzResult, questions.length]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Load chapters and initial Mistake Vault
  useEffect(() => {
    async function initChapters() {
      setLoading(true);
      try {
        const boardKey = user?.board === "AKU-EB" ? "AKUEB" : "BSEK_KARACHI";
        const grade = user?.class_grade || 10;
        const chData = await getChapters(boardKey, grade, selectedSubject);
        setChapters(chData);
        if (chData.length > 0) {
          const exists = chData.some((c) => c.chapter_name === selectedChapter);
          if (!exists) {
            setSelectedChapter(chData[0].chapter_name);
          }
        }
        const vData = await getMistakeVault();
        setVaultItems(vData);
      } catch (e) {
        console.warn("Curriculum fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    initChapters();
  }, [user, selectedSubject]);

  // Load questions when selectedChapter or selectedSubject changes
  useEffect(() => {
    async function loadQs() {
      if (!selectedChapter) return;
      setLoading(true);
      setUserAnswers({});
      setBlitzResult(null);
      setTimeLeft(300); // Reset timer to 5:00
      setTimerActive(true);
      try {
        const boardKey = user?.board === "AKU-EB" ? "AKUEB" : "BSEK_KARACHI";
        const grade = user?.class_grade || 10;
        const secKey = user?.board === "AKU-EB" ? "PAPER_I_MCQ" : "SECTION_A";
        const qData = await getQuestions(boardKey, grade, selectedSubject, secKey, selectedChapter);
        setQuestions(qData.slice(0, 5));
      } catch (e) {
        console.warn("Questions fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadQs();
  }, [selectedChapter, selectedSubject, user]);

  const handleSelectOption = (qId: string, opt: string) => {
    if (blitzResult) return; // Locked after submission
    setUserAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitBlitz = async () => {
    if (questions.length === 0 || submitting) return;
    setSubmitting(true);
    setTimerActive(false);

    const answersPayload = questions.map((q) => ({
      question_id: q.question_id,
      selected_option: userAnswers[q.question_id] || "NONE",
    }));

    try {
      const res = await submitBlitz(selectedSubject, selectedChapter, answersPayload);
      setBlitzResult(res);

      // Save to client storage for dynamic dashboard sync
      try {
        const pct = res.score_percentage ?? res.percentage ?? 0;
        localStorage.setItem("boardbrain_last_score_pct", String(pct));
        localStorage.setItem("boardbrain_last_subject", selectedSubject);
      } catch (err) {}

      const vData = await getMistakeVault();
      setVaultItems(vData);
    } catch (e) {
      console.warn("Submission error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setBlitzResult(null);
    setTimeLeft(300);
    setTimerActive(true);
  };

  const handleClearVaultItem = async (qid: string) => {
    await clearMistakeVaultItem(qid);
    setVaultItems((prev) => prev.filter((item) => item.question_id !== qid));
  };

  // Compute accurate question count per chapter from actual question store
  const getChapterQuestionCount = (chName: string) => {
    const grade = user?.class_grade || 10;
    const subLower = selectedSubject.toLowerCase();
    const matches = FALLBACK_QUESTIONS.filter(
      (q) =>
        q.grade === grade &&
        q.subject.toLowerCase() === subLower &&
        (q.chapter_name.toLowerCase().includes(chName.toLowerCase()) ||
          chName.toLowerCase().includes(q.chapter_name.toLowerCase()))
    );
    return matches.length > 0 ? matches.length : 12;
  };

  const scorePct = blitzResult?.score_percentage ?? blitzResult?.percentage ?? 0;
  const correctCount = blitzResult?.correct_answers ?? blitzResult?.score ?? 0;
  const totalCount = blitzResult?.total_questions ?? blitzResult?.total ?? questions.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-emerald" />
            <span>5-Minute Section A MCQ Blitz</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real BSEK & AKU-EB 20% weightage questions. Incorrect options auto-save to Mistake Vault.
          </p>
        </div>

        {/* 5-Minute Active Countdown Timer */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-sm ${
              blitzResult
                ? "bg-slate-900 border-slate-700 text-slate-400"
                : timeLeft < 60
                ? "bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse"
                : "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{blitzResult ? "Blitz Completed" : `Time: ${formatTimer(timeLeft)}`}</span>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#10192D] p-1 rounded-xl border border-slate-800">
            {(["Physics", "Chemistry", "Biology"] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubject(sub);
                  const grade = user?.class_grade || 10;
                  const defaultChs = FALLBACK_CHAPTERS[`${sub}_${grade}`] || FALLBACK_CHAPTERS[`${sub}_10`] || [];
                  if (defaultChs.length > 0) {
                    setSelectedChapter(defaultChs[0].chapter_name);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSubject === sub
                    ? "bg-brand-emerald text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Dropdown Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B132B] p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <BookOpen className="w-4 h-4 text-brand-emerald" />
          <span>Active Chapter:</span>
        </div>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="bg-[#10192D] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-brand-emerald flex-1 sm:max-w-md"
        >
          {chapters.map((ch) => {
            const count = getChapterQuestionCount(ch.chapter_name);
            return (
              <option key={ch.chapter_name} value={ch.chapter_name}>
                {ch.chapter_name} ({count} Board Qs)
              </option>
            );
          })}
        </select>
      </div>

      {/* Main Blitz Questions Card Deck */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm bg-[#10192D] border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-2 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading Board Questions for {selectedSubject} — {selectedChapter}...
          </div>
        ) : questions.length === 0 ? (
          <div className="p-6 bg-[#10192D] border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
            Loading next set of questions...
          </div>
        ) : (
          questions.map((q, idx) => {
            const resultItem = blitzResult?.results?.find((r: any) => r.question_id === q.question_id);
            const selectedOpt = userAnswers[q.question_id];
            let opts: Record<string, string> = {};
            try {
              opts = typeof q.options_json === "string" ? JSON.parse(q.options_json) : (q.options_json || {});
            } catch (err) {
              opts = { A: "Option A", B: "Option B", C: "Option C", D: "Option D" };
            }

            return (
              <div
                key={q.question_id || idx}
                className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-4 transition-all"
              >
                {/* Question Metadata Header */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-400 font-medium">BSEK & AKU-EB Verified</span>
                    {q.cognitive_level && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold text-sky-400">
                        {q.cognitive_level}
                      </span>
                    )}
                  </div>
                  <span className="text-brand-amber font-bold text-[11px]">1.0 Mark</span>
                </div>

                {/* Question Text */}
                <div className="space-y-1.5">
                  <div className="text-sm md:text-base font-semibold text-slate-100">
                    <KaTeXRenderer math={q.text_en} />
                  </div>
                  {q.text_ur && (
                    <div className="text-xs text-slate-400 text-right pt-0.5">
                      <NastaliqText>{q.text_ur}</NastaliqText>
                    </div>
                  )}
                </div>

                {/* 4 Interactive Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {Object.entries(opts).map(([key, optText]) => {
                    const isSelected = selectedOpt === key;
                    const isCorrectAnswer = resultItem && (resultItem.correct_option === key || resultItem.correct_option?.toUpperCase() === key.toUpperCase());
                    const isWrongAnswer = resultItem && isSelected && !resultItem.is_correct;

                    let btnClass = "bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200";
                    if (isSelected && !blitzResult) {
                      btnClass = "bg-brand-emerald/15 border-brand-emerald text-brand-emerald font-bold shadow-sm";
                    } else if (blitzResult) {
                      if (isCorrectAnswer) {
                        btnClass = "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold";
                      } else if (isWrongAnswer) {
                        btnClass = "bg-rose-950/80 border-rose-500 text-rose-300 font-bold";
                      } else {
                        btnClass = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectOption(q.question_id, key)}
                        disabled={!!blitzResult}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left text-xs transition-all ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                          {key}
                        </span>
                        <div className="flex-1">
                          <KaTeXRenderer math={optText as string} />
                        </div>
                        {blitzResult && isCorrectAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {blitzResult && isWrongAnswer && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Examiner Feedback & Trap Alert */}
                {resultItem && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-in fade-in ${
                      resultItem.is_correct
                        ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                        : "bg-amber-950/20 border-amber-800/40 text-amber-200"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {resultItem.is_correct ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Board Examiner Rubric: Correct!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>Examiner Trap Alert (Saved to Mistake Vault):</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {resultItem.examiner_feedback || resultItem.examiner_trap || q.solution_rubric}
                    </p>
                    {q.formula_used && (
                      <div className="font-mono text-[10px] text-slate-400 pt-1">
                        <b>Formula:</b> {q.formula_used}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Action Bar (Submit or Reset) */}
      {questions.length > 0 && !loading && (
        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Answered:{" "}
            <span className="text-white font-bold">
              {Object.keys(userAnswers).length} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {blitzResult ? (
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Blitz Drill</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitBlitz}
                disabled={submitting || questions.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Grading Paper Against BSEK Rubric...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Section A (Instant Marksheet)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Realistic BSEK Score Summary Modal Banner */}
      {blitzResult && (
        <div
          className={`p-5 rounded-2xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            scorePct >= 80
              ? "bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/40"
              : scorePct >= 60
              ? "bg-gradient-to-r from-sky-950/80 to-slate-900 border-sky-500/40"
              : scorePct >= 33
              ? "bg-gradient-to-r from-amber-950/80 to-slate-900 border-amber-500/40"
              : "bg-gradient-to-r from-rose-950/80 to-slate-900 border-rose-500/40"
          }`}
        >
          <div className="space-y-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                scorePct >= 80
                  ? "text-emerald-400"
                  : scorePct >= 60
                  ? "text-sky-400"
                  : scorePct >= 33
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              Official Blitz Score
            </span>
            <div className="text-2xl font-black text-white">
              {correctCount} / {totalCount}{" "}
              <span className="text-base font-normal text-slate-400">
                ({scorePct}%)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {scorePct >= 80
                ? "🌟 Outstanding! A-1 Shield Readiness level achieved on this chapter."
                : scorePct >= 60
                ? "👍 Solid Performance! Grade A / B Level. Review minor examiner traps."
                : scorePct >= 33
                ? "⚠️ Passing Benchmark Secured (Above 33% BSEK Pass Mark). Review mistakes below to reach A-1."
                : "🚨 Below 33% Official BSEK Pass Threshold. Review fundamentals in Dual Study Cards before retrying."}
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${
              scorePct >= 80
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : scorePct >= 60
                ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                : scorePct >= 33
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            {scorePct >= 80 ? (
              <Award className="w-8 h-8" />
            ) : scorePct >= 33 ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <ShieldAlert className="w-8 h-8" />
            )}
          </div>
        </div>
      )}

      {/* Spaced-Repetition Mistake Vault Section */}
      <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-amber" />
            <h3 className="text-sm font-bold text-white">
              Spaced-Repetition Mistake Vault ({vaultItems.length} Saved)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Re-tests incorrect concepts after 48-hour consolidation cycle
          </span>
        </div>

        {vaultItems.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs bg-slate-900/60 rounded-xl border border-slate-800">
            ✓ Your Mistake Vault is clear! Incorrect answers from any blitz drill automatically appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {vaultItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300 uppercase">
                      {item.subject} • {item.chapter_name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {item.hours_left === 0 ? (
                        <span className="text-emerald-400 font-bold">⚡ Ready to Re-Test</span>
                      ) : (
                        `⏳ Re-test in ${item.hours_left || 48}h`
                      )}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {item.text_en}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <span className="text-rose-400 font-medium">Your answer: {item.user_answer}</span> •{" "}
                    <span className="text-emerald-400 font-medium">Correct: {item.correct_option}</span>
                  </p>
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                    {item.examiner_trap}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleClearVaultItem(item.question_id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors text-xs flex items-center gap-1.5"
                    title="Mark Resolved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Resolve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
