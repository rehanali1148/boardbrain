"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { getChapters, generateExam } from "@/lib/api";
import { GENERATOR_SUBJECTS } from "@/lib/examGenerator";
import { FileText, Printer, Sparkles, RefreshCw, AlertTriangle, BookOpen } from "lucide-react";

type ChapterOption = { chapter_name: string; question_count: number };

export default function ExamGeneratorPage() {
  const { user } = useAuth();
  const [campus, setCampus] = useState(user?.campus || "Saddar");
  const [grade, setGrade] = useState(10);
  const [board, setBoard] = useState("BSEK_KARACHI");
  const [subject, setSubject] = useState<string>(user?.subject && (GENERATOR_SUBJECTS as readonly string[]).includes(user.subject) ? user.subject : "Physics");
  const [examFormat, setExamFormat] = useState("20-Mark Monthly Test");
  const [chapterOptions, setChapterOptions] = useState<ChapterOption[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"row_a" | "row_b" | "marking_key">("row_a");
  const [examPackage, setExamPackage] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestNo = useRef(0);

  // Load the chapter list whenever class or subject changes; start with nothing ticked (= whole syllabus).
  useEffect(() => {
    let cancelled = false;
    getChapters(board, grade, subject).then((list) => {
      if (cancelled) return;
      setChapterOptions(list.map((c: any) => ({ chapter_name: c.chapter_name, question_count: c.question_count })));
      setChapters([]);
    });
    return () => {
      cancelled = true;
    };
  }, [board, grade, subject]);

  // Regenerate automatically when any setting changes, so the paper always matches the controls.
  useEffect(() => {
    const t = setTimeout(() => handleGenerate(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, grade, subject, examFormat, chapters, campus]);

  const handleGenerate = async () => {
    const myNo = ++requestNo.current;
    setGenerating(true);
    setError(null);
    try {
      const pkg = await generateExam({
        campus,
        board,
        grade,
        subject,
        exam_format: examFormat,
        completed_chapters: chapters,
        generate_variants: true,
        seed: Math.floor(Math.random() * 1e9),
      });
      if (myNo === requestNo.current) setExamPackage(pkg);
    } catch (e: any) {
      if (myNo !== requestNo.current) return;
      const msg = String(e?.message || "");
      setError(
        msg.includes("TEACHER_ONLY")
          ? "Only teachers can generate papers. Switch to the Teacher role."
          : "The paper could not be generated. Check your internet connection and try again."
      );
    } finally {
      if (myNo === requestNo.current) setGenerating(false);
    }
  };

  const toggleChapter = (name: string) =>
    setChapters((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

  const questions = (tab: "row_a" | "row_b") =>
    (tab === "row_a" ? examPackage?.row_a_questions : examPackage?.row_b_questions) || [];
  const paperTab = activeTab === "row_b" ? "row_b" : "row_a";
  const sectionA = questions(paperTab).filter((q: any) => q.section === "Section A");
  const sectionB = questions(paperTab).filter((q: any) => q.section === "Section B");
  const sectionC = questions(paperTab).filter((q: any) => q.section === "Section C");
  const marks = examPackage?.section_marks || { A: 0, B: 0, C: 0 };
  const generatedAt = examPackage?.generated_at ? new Date(examPackage.generated_at).toLocaleTimeString() : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="no-print border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-emerald" />
            <span>Exam Paper Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Row A, Row B (same questions, MCQs reordered) and a marking scheme with a separate MCQ key for each row.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          disabled={!examPackage}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <Printer className="w-4 h-4 text-brand-amber" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Controls */}
      <div className="no-print bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Campus:</label>
            <select value={campus} onChange={(e) => setCampus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option value="Saddar">Saddar Campus</option>
              <option value="Depot Lines">Depot Lines (Main)</option>
              <option value="Korangi">Korangi Campus</option>
              <option value="Malir">Malir Campus</option>
              <option value="North Karachi">North Karachi</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Board & Class:</label>
            <select
              value={`${board}|${grade}`}
              onChange={(e) => {
                const [b, g] = e.target.value.split("|");
                setBoard(b);
                setGrade(Number(g));
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="BSEK_KARACHI|10">BSEK Karachi • Class 10</option>
              <option value="BSEK_KARACHI|9">BSEK Karachi • Class 9</option>
              <option value="AKUEB|10">AKU-EB • Class 10</option>
              <option value="AKUEB|9">AKU-EB • Class 9</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Subject:</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              {GENERATOR_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Exam Format:</label>
            <select value={examFormat} onChange={(e) => setExamFormat(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option value="20-Mark Monthly Test">20-Mark Monthly (45 Min)</option>
              <option value="40-Mark Mid-Term">40-Mark Mid-Term (1.5 Hr)</option>
              <option value="60-Mark Full Mock">60-Mark Board Mock (3 Hr)</option>
            </select>
          </div>
        </div>

        {/* Chapter picker */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-sky" />
            Chapters covered so far (none ticked = whole syllabus):
          </p>
          <div className="flex flex-wrap gap-2">
            {chapterOptions.map((c) => {
              const on = chapters.includes(c.chapter_name);
              return (
                <button
                  key={c.chapter_name}
                  onClick={() => toggleChapter(c.chapter_name)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    on ? "bg-brand-sky text-slate-950 border-brand-sky" : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {c.chapter_name} <span className="opacity-70">({c.question_count} MCQ{c.question_count === 1 ? "" : "s"})</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2.5 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Building the paper...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Make a different version</span>
            </>
          )}
        </button>
        {generatedAt && !generating && (
          <p className="text-[11px] text-slate-500 text-center">
            Paper built at {generatedAt} • version #{examPackage.seed}
          </p>
        )}
      </div>

      {error && (
        <div className="no-print p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {examPackage?.bank_notice && (
        <div className="no-print p-3 rounded-xl bg-amber-950/40 border border-amber-700 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{examPackage.bank_notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="no-print flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "row_a", label: "📄 Student Paper (Row A)", on: "bg-brand-emerald" },
          { id: "row_b", label: "🔀 Student Paper (Row B)", on: "bg-brand-amber" },
          { id: "marking_key", label: "🔑 Marking Scheme (teacher only)", on: "bg-brand-sky" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id ? `${t.on} text-slate-950 shadow-sm` : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {examPackage && (
        <div className="exam-sheet-paper bg-white text-black p-6 md:p-8 rounded-2xl shadow-xl font-serif max-w-4xl mx-auto border border-slate-300">
          <div className="text-center border-b-2 border-black pb-3 mb-5 space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">EDUCATION TRUST NASRA SCHOOLS ({campus.toUpperCase()} CAMPUS)</h2>
            <h4 className="text-sm md:text-base font-semibold uppercase tracking-wider">
              ACADEMIC SESSION 2026-2027 • {examFormat.toUpperCase()}
              {activeTab === "row_b" && <span className="ml-2">[ROW B]</span>}
              {activeTab === "marking_key" && <span className="ml-2">[MARKING SCHEME]</span>}
            </h4>
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-sans font-medium px-2 pt-1">
              <span><b>Subject:</b> {subject} (Theory)</span>
              <span><b>Class:</b> {grade}th ({board === "AKUEB" ? "AKU-EB" : "BSEK"})</span>
              <span><b>Time:</b> {examPackage.time_allowed}</span>
              <span><b>Max Marks:</b> {examPackage.total_marks}</span>
            </div>
          </div>

          {activeTab !== "marking_key" && (
            <>
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-sans border-b border-gray-400 pb-2 mb-4 px-2">
                <span><b>Student Name:</b> ___________________________</span>
                <span><b>Roll No:</b> ____________</span>
                <span><b>Section:</b> _______</span>
              </div>

              <div className="space-y-6">
                {sectionA.length > 0 && (
                  <div className="space-y-3">
                    <div className="border-b border-black pb-1">
                      <h4 className="font-bold text-sm">SECTION &quot;A&quot; — MULTIPLE CHOICE QUESTIONS ({marks.A} Marks)</h4>
                      <p className="text-xs italic text-gray-700">Q1. Choose the correct option. Each part carries 1 mark.</p>
                    </div>
                    <div className="space-y-3 text-xs md:text-sm pl-2">
                      {sectionA.map((q: any, i: number) => {
                        const opts = q.options ? JSON.parse(q.options) : {};
                        return (
                          <div key={i} className="space-y-1">
                            <p className="font-semibold"><b>1.{i + 1}</b> {q.text_en}</p>
                            {q.text_ur && <p className="font-nastaliq text-right text-xs text-gray-700" dir="rtl">{q.text_ur}</p>}
                            <div className="flex flex-wrap gap-4 pl-4 pt-1 font-sans text-xs">
                              {Object.entries(opts).map(([k, v]: any) => (
                                <span key={k}><b>({k})</b> {String(v)}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sectionB.length > 0 && (
                  <div className="space-y-3">
                    <div className="border-b border-black pb-1">
                      <h4 className="font-bold text-sm">SECTION &quot;B&quot; — SHORT ANSWER QUESTIONS ({marks.B} Marks)</h4>
                      <p className="text-xs italic text-gray-700">Answer all questions. Each question carries 4 marks.</p>
                    </div>
                    <div className="space-y-3 text-xs md:text-sm pl-2">
                      {sectionB.map((q: any, i: number) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between gap-3">
                            <p className="font-semibold"><b>Q{i + 2}.</b> {q.text_en}</p>
                            <span className="font-sans font-bold text-xs shrink-0">[{q.marks}]</span>
                          </div>
                          {q.text_ur && <p className="font-nastaliq text-right text-xs text-gray-700" dir="rtl">{q.text_ur}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sectionC.length > 0 && (
                  <div className="space-y-3">
                    <div className="border-b border-black pb-1">
                      <h4 className="font-bold text-sm">SECTION &quot;C&quot; — DETAILED QUESTIONS ({marks.C} Marks)</h4>
                      <p className="text-xs italic text-gray-700">Show given data, formula, working and units where needed. Each question carries 8 marks.</p>
                    </div>
                    <div className="space-y-3 text-xs md:text-sm pl-2">
                      {sectionC.map((q: any, i: number) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between gap-3">
                            <p className="font-semibold"><b>Q{sectionB.length + i + 2}.</b> {q.text_en}</p>
                            <span className="font-sans font-bold text-xs shrink-0">[{q.marks}]</span>
                          </div>
                          {q.text_ur && <p className="font-nastaliq text-right text-xs text-gray-700" dir="rtl">{q.text_ur}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "marking_key" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 text-xs font-sans text-emerald-900">
                <b>MARKING SCHEME:</b> Use these mark allocations so every section is marked the same way. Section B and C
                are identical in Row A and Row B; only the MCQ key differs. Section B and C are standard syllabus
                questions written for practice, not copied from past board papers.
              </div>
              <div className="space-y-3 text-xs font-sans">
                {examPackage.rubrics.map((r: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>{r.question_no}</span>
                      <span>[{r.marks} Marks]</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{r.key}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
