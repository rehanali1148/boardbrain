"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getChapters, getQuestions, submitBlitz, getMistakeVault } from "@/lib/api";
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
  BookOpen
} from "lucide-react";

export default function PracticeBlitzPage() {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("Simple Harmonic Motion & Waves");
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [blitzResult, setBlitzResult] = useState<any>(null);
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load chapters & vault on mount
  useEffect(() => {
    async function init() {
      try {
        const boardKey = user?.board === "AKU-EB" ? "AKUEB" : "BSEK_KARACHI";
        const grade = user?.class_grade || 10;
        const chData = await getChapters(boardKey, grade, "Physics");
        setChapters(chData);
        if (chData.length > 0) {
          setSelectedChapter(chData[0].chapter_name);
        }
        const vData = await getMistakeVault();
        setVaultItems(vData);
      } catch (e) {
        console.warn("Curriculum fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [user]);

  // Load questions when selectedChapter changes
  useEffect(() => {
    async function loadQs() {
      if (!selectedChapter) return;
      setLoading(true);
      setUserAnswers({});
      setBlitzResult(null);
      try {
        const boardKey = user?.board === "AKU-EB" ? "AKUEB" : "BSEK_KARACHI";
        const grade = user?.class_grade || 10;
        const secKey = user?.board === "AKU-EB" ? "PAPER_I_MCQ" : "SECTION_A";
        const qData = await getQuestions(boardKey, grade, "Physics", secKey, selectedChapter);
        setQuestions(qData.slice(0, 5));
      } catch (e) {
        console.warn("Questions fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadQs();
  }, [selectedChapter, user]);

  const handleSelectOption = (qId: string, opt: string) => {
    if (blitzResult) return; // Locked after submission
    setUserAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitBlitz = async () => {
    if (questions.length === 0) return;
    setSubmitting(true);
    const answersPayload = questions.map((q) => ({
      question_id: q.question_id,
      selected_option: userAnswers[q.question_id] || "NONE",
    }));

    try {
      const res = await submitBlitz("Physics", selectedChapter, answersPayload);
      setBlitzResult(res);
      // Refresh vault
      const vData = await getMistakeVault();
      setVaultItems(vData);
    } catch (e) {
      alert("Submission error, please verify backend connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setBlitzResult(null);
  };

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

        {/* Chapter Selector Dropdown */}
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="bg-[#10192D] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-brand-emerald"
        >
          {chapters.map((ch) => (
            <option key={ch.chapter_name} value={ch.chapter_name}>
              {ch.chapter_name} ({ch.question_count} Qs)
            </option>
          ))}
        </select>
      </div>

      {/* Main Blitz Questions Card Deck */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-2 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading Board Questions for {selectedChapter}...
          </div>
        ) : questions.length === 0 ? (
          <div className="p-6 bg-[#10192D] border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
            No MCQs found for this chapter. Try selecting another chapter from the dropdown.
          </div>
        ) : (
          questions.map((q, idx) => {
            const resultItem = blitzResult?.results?.find((r: any) => r.question_id === q.question_id);
            const selectedOpt = userAnswers[q.question_id];
            const opts = q.options_json ? JSON.parse(q.options_json) : {};

            return (
              <div
                key={q.question_id}
                className={`p-4 md:p-5 rounded-xl border transition-all ${
                  resultItem
                    ? resultItem.is_correct
                      ? "bg-emerald-950/20 border-emerald-800/60"
                      : "bg-rose-950/20 border-rose-800/60"
                    : "bg-[#10192D] border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    Question {idx + 1} of {questions.length} • [1 Mark]
                  </span>
                  {resultItem && (
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        resultItem.is_correct ? "text-brand-emerald" : "text-brand-rose"
                      }`}
                    >
                      {resultItem.is_correct ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1.0)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Saved to Vault
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* English Question Text */}
                <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed mb-1">
                  {q.text_en}
                </p>

                {/* Bilingual Urdu Translation */}
                {q.text_ur && (
                  <NastaliqText className="text-xs mb-3 text-slate-400">
                    {q.text_ur}
                  </NastaliqText>
                )}

                {/* MCQ Options A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {Object.entries(opts).map(([key, val]: any) => {
                    const isSelected = selectedOpt === key;
                    const isCorrectKey = resultItem && q.correct_option === key;
                    const isWrongSelected = resultItem && !resultItem.is_correct && isSelected;

                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectOption(q.question_id, key)}
                        disabled={!!blitzResult}
                        className={`text-left px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-2.5 border ${
                          isCorrectKey
                            ? "bg-brand-emerald/20 border-brand-emerald text-brand-emerald font-bold"
                            : isWrongSelected
                            ? "bg-brand-rose/20 border-brand-rose text-brand-rose font-bold"
                            : isSelected
                            ? "bg-brand-amber/20 border-brand-amber text-brand-amber font-semibold"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {key}
                        </span>
                        <span className="truncate">{val}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Examiner Trap Explanation (if submitted) */}
                {resultItem && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border ${
                      resultItem.is_correct
                        ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                        : "bg-rose-950/30 border-rose-800/40 text-rose-300"
                    }`}
                  >
                    <p className="font-bold mb-0.5">
                      {resultItem.is_correct ? "✓ STBB Answer Key:" : "⚠️ Examiner Trap:"}
                    </p>
                    <p>{resultItem.solution_rubric || resultItem.examiner_trap}</p>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Submit / Reset Actions */}
        {questions.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            {!blitzResult ? (
              <button
                onClick={handleSubmitBlitz}
                disabled={submitting || Object.keys(userAnswers).length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber to-brand-emerald text-slate-950 text-xs md:text-sm font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? "Scoring Blitz..." : "Submit 5-Min Blitz & Check Traps"}
              </button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="text-xs">
                  <span className="text-slate-400">Blitz Score: </span>
                  <span className="text-base font-bold text-brand-emerald">
                    {blitzResult.score} / {blitzResult.total} ({blitzResult.percentage}%)
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spaced-Repetition Mistake Vault Section */}
      <div className="border-t border-slate-800 pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-amber" />
            <span>Spaced-Repetition Mistake Vault (48h Schedule)</span>
          </h3>
          <span className="text-xs bg-slate-800 text-brand-amber font-bold px-2 py-0.5 rounded-full">
            {vaultItems.length} Saved
          </span>
        </div>

        {vaultItems.length === 0 ? (
          <div className="p-4 bg-[#10192D] border border-slate-800 rounded-xl text-center text-xs text-slate-400">
            ✓ Your Mistake Vault is clear. All questions answered correctly!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vaultItems.map((v) => (
              <div
                key={v.id}
                className="bg-[#10192D] border border-slate-800 p-3.5 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-brand-amber font-bold">{v.chapter_name}</span>
                  <span className="text-slate-400">Retry in 48h</span>
                </div>
                <p className="text-slate-300 font-medium line-clamp-2">{v.examiner_trap_note}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Your Pick: {v.user_attempt}</span>
                  <span className="text-brand-emerald font-semibold">Active in Memory Deck</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
