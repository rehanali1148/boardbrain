"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getChapters, generateExam } from "@/lib/api";
import NastaliqText from "@/components/urdu/NastaliqText";
import {
  FileText,
  Printer,
  Sparkles,
  CheckCircle,
  RefreshCw,
  Edit2,
  Copy,
  Lock
} from "lucide-react";

export default function ExamGeneratorPage() {
  const { user } = useAuth();
  const [campus, setCampus] = useState(user?.campus || "Saddar");
  const [grade, setGrade] = useState(10);
  const [board, setBoard] = useState("BSEK_KARACHI");
  const [subject, setSubject] = useState("Physics");
  const [examFormat, setExamFormat] = useState("20-Mark Monthly Test");
  const [chapters, setChapters] = useState<string[]>([
    "Refraction of Light & Optical Instruments",
    "Current Electricity",
    "Simple Harmonic Motion & Waves"
  ]);

  const [activeTab, setActiveTab] = useState<"row_a" | "row_b" | "marking_key">("row_a");
  const [examPackage, setExamPackage] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  // Generate on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const pkg = await generateExam({
        campus,
        board,
        grade,
        subject,
        exam_format: examFormat,
        completed_chapters: chapters,
        generate_variants: true,
      });
      setExamPackage(pkg);
    } catch (e) {
      alert("Error generating exam paper. Check backend connection.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title & Print Actions (Hidden in Print) */}
      <div className="no-print border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-emerald" />
            <span>60-Second Human-in-the-Loop Exam Paper Generator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generates Row A, Row B (anti-cheating parallel variants), and official step marking schemes.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-brand-amber" />
          <span>Print / Save PDF (@media print)</span>
        </button>
      </div>

      {/* Generator Controls Box (Hidden in Print) */}
      <div className="no-print bg-[#10192D] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Campus:</label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="Saddar">Saddar Campus</option>
              <option value="Depot Lines">Depot Lines (Main)</option>
              <option value="Korangi">Korangi Campus</option>
              <option value="Malir">Malir Campus</option>
              <option value="North Karachi">North Karachi</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Board & Grade:</label>
            <select
              value={`${board}_${grade}`}
              onChange={(e) => {
                const parts = e.target.value.split("_");
                setBoard(e.target.value.includes("AKUEB") ? "AKUEB" : "BSEK_KARACHI");
                const lastPart = parts[parts.length - 1];
                setGrade(Number(lastPart) || 10);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="BSEK_KARACHI_10">BSEK Karachi • Class 10</option>
              <option value="BSEK_KARACHI_9">BSEK Karachi • Class 9</option>
              <option value="AKUEB_10">AKU-EB • Class 10</option>
              <option value="AKUEB_9">AKU-EB • Class 9</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Subject:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Exam Format:</label>
            <select
              value={examFormat}
              onChange={(e) => setExamFormat(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value="20-Mark Monthly Test">20-Mark Monthly (45 Min)</option>
              <option value="40-Mark Mid-Term">40-Mark Mid-Term (1.5 Hr)</option>
              <option value="60-Mark Full Mock">60-Mark Board Mock (3 Hr)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2.5 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Assembling Camera-Ready Exam Paper...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Regenerate Paper & Parallel Row B Variant</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Switcher (Hidden in Print) */}
      <div className="no-print flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("row_a")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "row_a"
              ? "bg-brand-emerald text-slate-950 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📄 Student Paper (Row A)
        </button>
        <button
          onClick={() => setActiveTab("row_b")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "row_b"
              ? "bg-brand-amber text-slate-950 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔀 Anti-Cheating (Row B Variant)
        </button>
        <button
          onClick={() => setActiveTab("marking_key")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "marking_key"
              ? "bg-brand-sky text-slate-950 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔑 Teacher Marking Rubric
        </button>
      </div>

      {/* PRINTABLE EXAM PAPER CONTAINER */}
      {examPackage && (
        <div className="exam-sheet-paper bg-white text-black p-6 md:p-8 rounded-2xl shadow-xl font-serif max-w-4xl mx-auto border border-slate-300">
          {/* Official School Header */}
          <div className="text-center border-b-2 border-black pb-3 mb-5 space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              EDUCATION TRUST NASRA SCHOOLS ({campus.toUpperCase()} CAMPUS)
            </h2>
            <h4 className="text-sm md:text-base font-semibold uppercase tracking-wider">
              ACADEMIC SESSION 2026-2027 • {examFormat.toUpperCase()}
              {activeTab === "row_b" && <span className="ml-2 text-red-600">[ROW B VARIANT]</span>}
            </h4>
            <div className="flex justify-between items-center text-xs font-sans font-medium px-2 pt-1">
              <span><b>Subject:</b> {subject} (Theory)</span>
              <span><b>Class:</b> {grade}th ({board === "AKUEB" ? "AKU-EB" : "BSEK"})</span>
              <span><b>Time:</b> {examPackage.time_allowed}</span>
              <span><b>Max Marks:</b> {examPackage.total_marks}</span>
            </div>
          </div>

          {/* Student Fill-in Info Bar */}
          <div className="flex justify-between items-center text-xs font-sans border-b border-gray-400 pb-2 mb-4 px-2">
            <span><b>Student Name:</b> ___________________________</span>
            <span><b>Roll No:</b> ____________</span>
            <span><b>Section:</b> _______</span>
          </div>

          {/* TAB 1 & 2: QUESTION CONTENT (Row A or Row B) */}
          {(activeTab === "row_a" || activeTab === "row_b") && (
            <div className="space-y-6">
              {/* SECTION A: MCQS */}
              <div className="space-y-3">
                <div className="border-b border-black pb-1">
                  <h4 className="font-bold text-sm">
                    SECTION "A" — MULTIPLE CHOICE QUESTIONS (20% Marks)
                  </h4>
                  <p className="text-xs italic text-gray-700">
                    Instructions: Choose the correct option. Each question carries 1 Mark.
                  </p>
                </div>

                <div className="space-y-3 text-xs md:text-sm pl-2">
                  {(activeTab === "row_a" ? examPackage.row_a_questions : examPackage.row_b_questions)
                    .filter((q: any) => q.section === "Section A")
                    .map((q: any, i: number) => {
                      const opts = q.options ? JSON.parse(q.options) : {};
                      return (
                        <div key={i} className="space-y-1">
                          <p className="font-semibold">
                            <b>Q1.{i + 1}</b> {q.text_en}
                          </p>
                          {q.text_ur && (
                            <p className="font-nastaliq text-right text-xs text-gray-700" dir="rtl">
                              {q.text_ur}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 pl-4 pt-1 font-sans text-xs">
                            {Object.entries(opts).map(([k, v]: any) => (
                              <span key={k}>
                                <b>({k})</b> {String(v).replace(/\s*\(Verified\)/gi, "").trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* SECTION B: SHORT QUESTIONS */}
              <div className="space-y-3">
                <div className="border-b border-black pb-1">
                  <h4 className="font-bold text-sm">
                    SECTION "B" — SHORT ANSWER QUESTIONS (40% Marks)
                  </h4>
                  <p className="text-xs italic text-gray-700">
                    Instructions: Answer all questions with scientific reasoning and concise steps.
                  </p>
                </div>

                <div className="space-y-3 text-xs md:text-sm pl-2">
                  {(activeTab === "row_a" ? examPackage.row_a_questions : examPackage.row_b_questions)
                    .filter((q: any) => q.section === "Section B")
                    .map((q: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between">
                          <p className="font-semibold">
                            <b>Q{i + 2}.</b> {q.text_en}
                          </p>
                          <span className="font-sans font-bold text-xs">[{q.marks} Marks]</span>
                        </div>
                        {q.text_ur && (
                          <p className="font-nastaliq text-right text-xs text-gray-700" dir="rtl">
                            {q.text_ur}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* SECTION C: DETAILED QUESTIONS & NUMERICALS */}
              <div className="space-y-3">
                <div className="border-b border-black pb-1">
                  <h4 className="font-bold text-sm">
                    SECTION "C" — DETAILED QUESTIONS & NUMERICALS (40% Marks)
                  </h4>
                  <p className="text-xs italic text-gray-700">
                    Instructions: Solve multi-step problems showing complete Given Data, Formula, Working, and SI Units.
                  </p>
                </div>

                <div className="space-y-3 text-xs md:text-sm pl-2">
                  {(activeTab === "row_a" ? examPackage.row_a_questions : examPackage.row_b_questions)
                    .filter((q: any) => q.section === "Section C")
                    .map((q: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between">
                          <p className="font-semibold">
                            <b>Q{i + 4}.</b> {q.text_en}
                          </p>
                          <span className="font-sans font-bold text-xs">[{q.marks} Marks]</span>
                        </div>
                        {q.text_ur && (
                          <p className="font-nastaliq text-right text-xs text-gray-700" dir="rtl">
                            {q.text_ur}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHER STEP-BY-STEP MARKING KEY */}
          {activeTab === "marking_key" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 text-xs font-sans text-emerald-900">
                <b>FACULTY MARKING SCHEME:</b> Use these exact step-by-step mark allocations during grading to maintain uniform scoring across campus sections.
              </div>

              <div className="space-y-3 text-xs font-sans">
                {examPackage.rubrics.map((r: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>{r.question_no} Evaluation Rubric</span>
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
