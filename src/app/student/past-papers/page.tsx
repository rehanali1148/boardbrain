"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { PAST_QUESTIONS, pastPaperIndex } from "@/lib/pastPapers";
import { ScrollText, Eye, EyeOff } from "lucide-react";

const LETTERS = ["A", "B", "C", "D"];

export default function PastPapersPage() {
  const { user } = useAuth();
  const index = useMemo(() => pastPaperIndex(), []);
  const [grade, setGrade] = useState<number>(10);
  const [subject, setSubject] = useState<string>("Physics");
  const [year, setYear] = useState<number | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [picked, setPicked] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.class_grade) setGrade(user.class_grade);
  }, [user?.class_grade]);

  const available = index.filter((p) => p.paperGrade === grade);
  const current = available.find((p) => p.subject === subject) || available[0];
  const years = current?.years || [];
  const activeYear = year && years.includes(year) ? year : years[0];

  const paper = PAST_QUESTIONS.filter((q) => q.paperGrade === grade && q.subject === current?.subject && q.year === activeYear);
  const secA = paper.filter((q) => q.section === "A");
  const secB = paper.filter((q) => q.section === "B");
  const secC = paper.filter((q) => q.section === "C");

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-brand-amber" />
          <span>Karachi Board Past Papers</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real BSEK annual papers, typed from the original papers. MCQ answers were worked out and checked by BoardBrain.
          More subjects are being added.
        </p>
      </div>

      <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-slate-400 font-semibold">Class:</span>
          {[10, 9].map((g) => (
            <button key={g} onClick={() => { setGrade(g); setYear(null); }}
              className={`px-3 py-1 rounded-lg font-bold ${grade === g ? "bg-brand-emerald text-slate-950" : "bg-slate-900 text-slate-300 border border-slate-700"}`}>
              Class {g}
            </button>
          ))}
          <span className="text-slate-400 font-semibold ml-3">Subject:</span>
          {available.length === 0 && <span className="text-slate-500">Coming soon for Class {grade}.</span>}
          {available.map((p) => (
            <button key={p.subject} onClick={() => { setSubject(p.subject); setYear(null); }}
              className={`px-3 py-1 rounded-lg font-bold ${current?.subject === p.subject ? "bg-brand-sky text-slate-950" : "bg-slate-900 text-slate-300 border border-slate-700"}`}>
              {p.subject} ({p.years.length} years)
            </button>
          ))}
        </div>
        {years.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-slate-400 font-semibold mr-1">Year:</span>
            {years.map((y) => (
              <button key={y} onClick={() => { setYear(y); setPicked({}); }}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold ${activeYear === y ? "bg-brand-amber text-slate-950" : "bg-slate-900 text-sky-300 border border-slate-700"}`}>
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {paper.length > 0 && (
        <div className="bg-white text-black rounded-2xl p-5 md:p-7 font-serif space-y-6 shadow-xl">
          <div className="text-center border-b-2 border-black pb-2">
            <h2 className="text-lg font-bold">BOARD OF SECONDARY EDUCATION KARACHI</h2>
            <p className="text-sm font-semibold">
              SSC Annual Examination {activeYear} • Class {grade} • {current?.subject}
            </p>
          </div>

          {secA.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-1">
                <h3 className="font-bold text-sm">SECTION &quot;A&quot; — MULTIPLE CHOICE QUESTIONS</h3>
                <button onClick={() => setShowAnswers((s) => !s)} className="no-print font-sans text-[11px] px-2 py-1 rounded bg-slate-800 text-white flex items-center gap-1">
                  {showAnswers ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showAnswers ? "Hide answers" : "Show answers"}
                </button>
              </div>
              <p className="text-[11px] font-sans text-gray-600">Tap an option to try it. Unclear questions from the original scan are left out.</p>
              {secA.map((q) => {
                const mine = picked[q.id];
                return (
                  <div key={q.id} className="space-y-1 text-sm">
                    <p className="font-semibold">({q.qno}) {q.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-3 font-sans text-xs">
                      {q.options!.map((o, i) => {
                        const letter = LETTERS[i];
                        const isAns = letter === q.answer;
                        const reveal = showAnswers || !!mine;
                        const cls = reveal && isAns ? "bg-emerald-100 border-emerald-600" : mine === letter ? "bg-rose-100 border-rose-500" : "border-gray-300";
                        return (
                          <button key={letter} onClick={() => setPicked((p) => ({ ...p, [q.id]: letter }))}
                            className={`text-left px-2 py-1 rounded border ${cls}`}>
                            <b>({letter})</b> {o}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] font-sans text-gray-500 pl-3">Chapter: {q.chapter}</p>
                  </div>
                );
              })}
            </div>
          )}

          {[{ label: "SECTION \"B\" — SHORT ANSWER QUESTIONS", list: secB }, { label: "SECTION \"C\" — DETAILED ANSWER QUESTIONS", list: secC }].map(
            (s) =>
              s.list.length > 0 && (
                <div key={s.label} className="space-y-2">
                  <h3 className="font-bold text-sm border-b border-black pb-1">{s.label}</h3>
                  {s.list.map((q) => (
                    <div key={q.id} className="text-sm">
                      <p>
                        <b>Q{q.qno}.</b> {q.text} {q.marks ? <span className="font-sans text-xs font-bold">[{q.marks}]</span> : null}
                      </p>
                      <p className="text-[10px] font-sans text-gray-500">Chapter: {q.chapter}</p>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
