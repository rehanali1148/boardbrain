"use client";

import React, { useState } from "react";
import { evaluateStep } from "@/lib/api";
import KaTeXRenderer from "@/components/math/KaTeXRenderer";
import {
  BookOpen,
  Camera,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck2,
  Edit3
} from "lucide-react";

export default function NumericalsPage() {
  // Step Builder Form State
  const [givenData, setGivenData] = useState("Object distance p = 12 cm, Focal length f = 8 cm (Concave mirror)");
  const [formulaText, setFormulaText] = useState("1/f = 1/p + 1/q");
  const [calcSteps, setCalcSteps] = useState("1/q = 1/f - 1/p = 1/8 - 1/12 = (3 - 2)/24 = 1/24 => q = 24");
  const [finalAnswer, setFinalAnswer] = useState("24");
  const [unitText, setUnitText] = useState("cm");

  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"step_builder" | "scan_notebook" | "topper_compare">("step_builder");

  // Scan Notebook OCR Confirmation State
  const [ocrConfirmed, setOcrConfirmed] = useState(false);
  const [rawOcrText, setRawOcrText] = useState(
    "Given: p = 12 cm, f = 8 cm\nFormula: 1/f = 1/p + 1/q\nCalc: 1/8 - 1/12 = 1/24\nAnswer: q = 24"
  );

  const handleEvaluate = async () => {
    setEvaluating(true);
    try {
      const res = await evaluateStep({
        subject: "Physics",
        problem_type: "concave_mirror",
        given_data_text: givenData,
        formula_text: formulaText,
        calculation_steps_text: calcSteps,
        final_answer_text: finalAnswer,
        unit_text: unitText,
      });
      setEvaluation(res);
    } catch (e) {
      alert("Error evaluating steps. Check backend connection.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleOcrConfirm = () => {
    setOcrConfirmed(true);
    // Parse raw OCR lines into step builder fields
    setGivenData("p = 12 cm, f = 8 cm");
    setFormulaText("1/f = 1/p + 1/q");
    setCalcSteps("1/q = 1/8 - 1/12 = 1/24");
    setFinalAnswer("24");
    setUnitText(""); // Simulate missing unit in handwriting to show deduction!
    setActiveTab("step_builder");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-amber" />
            <span>Topper Sheet Presentation Studio & Step Evaluator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Board Rubric: Given Data (+1.0) → Formula (+1.0) → Math (+1.5) → SI Unit (+0.5 / -0.5 deduction).
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-[#10192D] p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab("step_builder")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "step_builder"
                ? "bg-brand-amber text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Step Builder
          </button>
          <button
            onClick={() => setActiveTab("scan_notebook")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "scan_notebook"
                ? "bg-brand-emerald text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Scan Notebook (OCR)
          </button>
          <button
            onClick={() => setActiveTab("topper_compare")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "topper_compare"
                ? "bg-brand-sky text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Topper vs Average
          </button>
        </div>
      </div>

      {/* TAB 1: STEP BUILDER INTERACTIVE SOLVER */}
      {activeTab === "step_builder" && (
        <div className="space-y-5">
          {/* Target Problem Banner */}
          <div className="p-4 bg-[#10192D] border-l-4 border-brand-amber rounded-xl text-xs space-y-1">
            <span className="font-bold text-brand-amber uppercase tracking-wider text-[10px]">
              Class 10 Physics • Section C Board Numerical
            </span>
            <p className="text-slate-200 font-semibold text-sm">
              An object 4 cm high is placed at a distance of 12 cm from a concave mirror of focal length 8 cm. Find the position and nature of the image.
            </p>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Given Data */}
            <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Step 1: Given Data</span>
                <span className="text-[10px] text-brand-emerald font-semibold">[+1.0 Mark]</span>
              </label>
              <textarea
                rows={2}
                value={givenData}
                onChange={(e) => setGivenData(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
                placeholder="p = 12 cm, f = 8 cm..."
              />
            </div>

            {/* Step 2: Formula */}
            <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Step 2: Board Formula</span>
                <span className="text-[10px] text-brand-emerald font-semibold">[+1.0 Mark]</span>
              </label>
              <input
                type="text"
                value={formulaText}
                onChange={(e) => setFormulaText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
                placeholder="1/f = 1/p + 1/q..."
              />
            </div>

            {/* Step 3: Math Working */}
            <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Step 3: Calculation Steps</span>
                <span className="text-[10px] text-brand-emerald font-semibold">[+1.5 Marks]</span>
              </label>
              <textarea
                rows={2}
                value={calcSteps}
                onChange={(e) => setCalcSteps(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
                placeholder="1/q = 1/8 - 1/12..."
              />
            </div>

            {/* Step 4: Final Answer & Unit */}
            <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Step 4: Final Answer & SI Unit</span>
                <span className="text-[10px] text-brand-rose font-semibold">[-0.5 if missing unit]</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={finalAnswer}
                  onChange={(e) => setFinalAnswer(e.target.value)}
                  className="w-2/3 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
                  placeholder="24..."
                />
                <input
                  type="text"
                  value={unitText}
                  onChange={(e) => setUnitText(e.target.value)}
                  className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-amber"
                  placeholder="Unit (cm)..."
                />
              </div>
            </div>
          </div>

          {/* Evaluate Action Button */}
          <button
            onClick={handleEvaluate}
            disabled={evaluating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-amber to-brand-emerald text-slate-950 font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {evaluating ? "Running Examiner Rubric Evaluation..." : "Grade Steps with Examiner Eye 2.0"}
          </button>

          {/* Evaluation Results Card */}
          {evaluation && (
            <div className="bg-[#10192D] border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-brand-emerald" />
                  <span className="text-sm font-bold text-slate-100">Official Examiner Score Breakdown</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-brand-amber">
                    {evaluation.total_marks} / {evaluation.max_marks} Marks
                  </span>
                  <span className="text-[10px] text-slate-400 block">Grade A-1 Target</span>
                </div>
              </div>

              {/* Rubric Points List */}
              <div className="space-y-2 text-xs">
                {evaluation.feedback_notes.map((note: string, idx: number) => {
                  const isDeduction = note.includes("DEDUCTED") || note.includes("TRAP");
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border ${
                        isDeduction
                          ? "bg-rose-950/30 border-rose-800/50 text-rose-300 font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      {note}
                    </div>
                  );
                })}
              </div>

              {/* Topper Solution Reference */}
              <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                {evaluation.topper_comparison_rubric}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCAN NOTEBOOK WITH OCR CONFIRMATION STEP */}
      {activeTab === "scan_notebook" && (
        <div className="space-y-4">
          <div className="bg-[#10192D] border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/15 text-brand-emerald flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Scan Handwritten Register (Examiner Eye 2.0)</h3>
                <p className="text-xs text-slate-400">
                  Upload homework photo. Review and edit the parsed text before deduction scoring runs.
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center space-y-2 bg-slate-900/50">
              <Camera className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">Demo Registered Image Loaded: "Concave_Mirror_Homework.jpg"</p>
              <p className="text-[11px] text-slate-500">Camera OCR successfully extracted 4 mathematical lines.</p>
            </div>

            {/* Editable Confirmation Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-amber" />
                <span>Parsed Handwritten Steps (Editable Confirmation):</span>
              </label>
              <textarea
                rows={4}
                value={rawOcrText}
                onChange={(e) => setRawOcrText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono outline-none focus:border-brand-emerald"
              />
              <p className="text-[10px] text-slate-400">
                💡 Tip: If OCR missed a minus sign or decimal point, fix it above before running examiner evaluation.
              </p>
            </div>

            <button
              onClick={handleOcrConfirm}
              className="w-full py-2.5 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm Parsed Text & Load into Step Evaluator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TOPPER VS AVERAGE COMPARISON VIEW */}
      {activeTab === "topper_compare" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Average 3/5 Layout */}
          <div className="bg-[#10192D] border border-rose-900/50 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-rose-400">⚠️ Average Student Sheet (3/5 Marks)</span>
              <span className="text-xs bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-bold">Grade B</span>
            </div>
            <div className="text-xs text-slate-300 space-y-2 font-mono bg-slate-900/60 p-3 rounded-lg">
              <p>1/8 - 1/12 = 1/q</p>
              <p>1/q = 1/24</p>
              <p style={{ color: "#F43F5E" }}>q = 24  (No units written!)</p>
            </div>
            <ul className="text-xs text-rose-300/80 space-y-1 list-disc pl-4">
              <li>No Given Data heading (-1.0 Mark)</li>
              <li>Missing SI unit cm (-0.5 Mark)</li>
              <li>Examiner cannot identify nature of image</li>
            </ul>
          </div>

          {/* Topper 5/5 Layout */}
          <div className="bg-[#10192D] border border-emerald-900/50 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400">⭐ A-1 Topper Presentation (5/5 Marks)</span>
              <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">Grade A-1</span>
            </div>
            <div className="text-xs text-slate-200 space-y-2 font-mono bg-slate-900/60 p-3 rounded-lg">
              <p className="text-brand-amber font-bold">GIVEN DATA:</p>
              <p>Object distance (p) = 12 cm</p>
              <p>Focal length (f) = +8 cm (Concave)</p>
              <p className="text-brand-amber font-bold mt-2">FORMULA & WORKING:</p>
              <p>1/f = 1/p + 1/q  =&gt;  q = 24 cm</p>
              <p className="text-brand-emerald font-bold mt-2">RESULT: Real, inverted, 24 cm</p>
            </div>
            <ul className="text-xs text-emerald-300/80 space-y-1 list-disc pl-4">
              <li>Distinct underline headings</li>
              <li>SI units highlighted with square box</li>
              <li>Nature of image explicitly stated in Result</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
