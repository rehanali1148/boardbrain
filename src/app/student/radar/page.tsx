"use client";

import React, { useState, useEffect } from "react";
import { getBoardRadar } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import { getInsights } from "@/lib/learnerModel";
import { Flame, Clock, CheckSquare, Sparkles, AlertCircle, Compass, Calendar, BookOpen } from "lucide-react";

export default function BoardRadarPage() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<"Physics" | "Chemistry" | "Biology">("Physics");
  const [radarItems, setRadarItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [myChapters, setMyChapters] = useState<any[]>([]);
  useEffect(() => {
    setMyChapters(getInsights().chapters);
  }, [user]);

  // 48-Hour Rescue Mode State
  const [rescueHours, setRescueHours] = useState<number>(6);
  const [selectedWeakChapter, setSelectedWeakChapter] = useState<string>("Geometrical Optics");
  const [rescueSchedule, setRescueSchedule] = useState<any[]>([]);

  const CHAPTER_OPTIONS: Record<string, string[]> = {
    Physics: [
      "Geometrical Optics",
      "Current Electricity",
      "Simple Harmonic Motion & Waves",
      "Electrostatics",
      "Electromagnetism"
    ],
    Chemistry: [
      "Chemical Equilibrium",
      "Acids, Bases and Salts",
      "Organic Chemistry",
      "Hydrocarbons"
    ],
    Biology: [
      "Gaseous Exchange & Respiration",
      "Homeostasis & Kidney Nephron",
      "Coordination and Control",
      "Reproduction & Cell Division"
    ]
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const boardKey = user?.board === "AKU-EB" ? "AKUEB" : "BSEK_KARACHI";
        const grade = user?.class_grade || 10;
        const data = await getBoardRadar(boardKey, grade, selectedSubject);
        setRadarItems(data);
        const options = CHAPTER_OPTIONS[selectedSubject] || [];
        if (options.length > 0 && !options.includes(selectedWeakChapter)) {
          setSelectedWeakChapter(options[0]);
        }
      } catch (e) {
        console.warn("Radar fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, selectedSubject]);

  const handleGenerateRescuePlan = () => {
    // Dynamically construct schedule based on hours and target chapter
    if (rescueHours === 4) {
      setRescueSchedule([
        {
          hour: "Hour 1 - 2",
          focus: `Emergency Core: ${selectedWeakChapter} High-Yield Definitions & Numericals`,
          tasks: [
            `Memorize 2 exact board definitions and formulas for ${selectedWeakChapter} (+3.0 Marks)`,
            "Solve 2 past-paper numericals with full Given Data + Formula + SI Unit steps",
            "Review senior teacher trap tips in Gold Notes"
          ]
        },
        {
          hour: "Hour 3 - 4",
          focus: "Rapid Mark Sheet Defense: Section A & 15-Mark Viva",
          tasks: [
            "Complete two 5-minute Section A MCQ blitzes in Mistake Vault",
            `Audit oral viva voce questions for ${selectedSubject} lab apparatus`,
            "Sleep 7+ hours before board exam for maximum memory retention"
          ]
        }
      ]);
    } else if (rescueHours === 10) {
      setRescueSchedule([
        {
          hour: "Hour 1 - 3",
          focus: `Deep Dive: ${selectedWeakChapter} Theory & Mathematical Derivations`,
          tasks: [
            `Complete step-by-step mathematical derivation for ${selectedWeakChapter} (+4.0 Marks)`,
            "Practice 4 multi-step board numericals with correct SI units",
            "Draw and label 2 board-standard diagrams using sharp HB pencil"
          ]
        },
        {
          hour: "Hour 4 - 6",
          focus: "Comprehensive Cross-Subject Review & Formula Audit",
          tasks: [
            "Audit all constant values and formulas in Dual Study Cards",
            "Solve 10 past paper MCQs with Examiner Trap notes",
            "Verify Le Chatelier / Ohm's Law / Snell's Law boundary conditions"
          ]
        },
        {
          hour: "Hour 7 - 8",
          focus: "15-Mark Lab Arena Spotting & Viva Mastery",
          tasks: [
            `Spotting Drill: Practice 60s slides for ${selectedSubject}`,
            "Observation Table: Verify concordant reading rules (<= 0.1 ml difference)",
            "Practice viva oral defense with instant voice tester"
          ]
        },
        {
          hour: "Hour 9 - 10",
          focus: "Full Mock Paper Simulation & Hall Strategy",
          tasks: [
            "Timed Section A blitz under strict 5-minute countdown",
            "Box all final answers with black cut marker (medium)",
            "Prepare examination geometry box with extra blue pens"
          ]
        }
      ]);
    } else {
      // 6 Hours Sprint
      setRescueSchedule([
        {
          hour: "Hour 1 - 2",
          focus: `High-Yield Topic: ${selectedWeakChapter} Definitions & Formulas`,
          tasks: [
            `Learn exact board definition and formula for ${selectedWeakChapter} (+2.0 Marks)`,
            "Practice 3 Section C numericals with boxed final answer and SI units",
            "Memorize positive vs negative sign convention rules"
          ]
        },
        {
          hour: "Hour 3 - 4",
          focus: "15-Mark Practical Viva Voce & Spotting Defense",
          tasks: [
            `${selectedSubject} Viva: Explain instrument zero error and standard operating procedure (+2.0 Marks)`,
            "Biology/Chemistry Spotting: Memorize key identification features",
            "Verify concordant observation table rules"
          ]
        },
        {
          hour: "Hour 5 - 6",
          focus: "Timed 5-Minute Section A Blitz Drills & Mistake Vault",
          tasks: [
            "Complete 3 chapter MCQ blitzes in Mistake Vault",
            "Audit SI units (cm, m/s, ohms) on rough calculation sheet",
            "Pack stationery and review final topper presentation sheet"
          ]
        }
      ]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-rose" />
            <span>High-Yield Topic Radar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            The core topics of your syllabus that carry the most marks, with how you are doing on each. Past-paper years will appear here once real BSEK / AKU-EB papers are added.
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#10192D] p-1 rounded-xl border border-slate-800">
          {(["Physics", "Chemistry", "Biology"] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSubject === sub
                  ? "bg-brand-rose text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-[#10192D] border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-2 border-brand-rose border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading high-yield topics for {selectedSubject}...
          </div>
        ) : (
          radarItems.map((item) => {
            const mine = myChapters.find((c: any) => c.subject === selectedSubject && c.chapter.toLowerCase() === String(item.chapter_name).toLowerCase());
            const status = !mine || mine.attempts < 2
              ? { label: "Not practised yet", cls: "bg-slate-800 border-slate-700 text-slate-300" }
              : mine.state === "mastered"
              ? { label: `Mastered (${mine.accuracy}%)`, cls: "bg-emerald-950/60 border-emerald-700 text-emerald-300" }
              : mine.state === "misconception"
              ? { label: `Wrong idea to fix (${mine.accuracy}%)`, cls: "bg-rose-950/60 border-rose-700 text-rose-300" }
              : mine.state === "gap"
              ? { label: `Not learnt yet (${mine.accuracy}%)`, cls: "bg-orange-950/60 border-orange-700 text-orange-300" }
              : { label: `Shaky (${mine.accuracy}%)`, cls: "bg-amber-950/60 border-amber-700 text-amber-300" };
            return (
              <div key={item.id} className="bg-[#10192D] border border-slate-800 p-4 md:p-5 rounded-2xl hover:border-slate-700 transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 border border-rose-800/60 text-rose-300 uppercase tracking-wide">
                    {item.question_types}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.cls}`}>You: {status.label}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-white">
                  {item.chapter_name}: <span className="text-slate-300 font-normal">{item.question_summary}</span>
                </h3>
                {item.years_appeared && item.years_appeared.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-amber" />
                      <span>Appeared in board papers:</span>
                    </span>
                    {item.years_appeared.map((yr: number) => (
                      <span key={yr} className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-[11px] font-mono font-bold text-sky-300">{yr}</span>
                    ))}
                  </div>
                )}
                <div className="p-3 bg-slate-900/80 rounded-xl text-xs text-slate-300 space-y-1 border border-slate-800/80">
                  <p className="font-semibold text-brand-amber flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why it matters:</span>
                  </p>
                  <p className="leading-relaxed">{item.why}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 48-Hour Exam Rescue Mode Planner */}
      <div className="bg-gradient-to-br from-[#10192D] to-[#0A0F1D] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-rose/15 text-brand-rose flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">48-Hour Exam Rescue Planner</h3>
            <p className="text-xs text-slate-400">
              Short on time? Select your remaining study hours and weakest chapter to generate a high-yield hourly sprint.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Available Study Hours:</label>
            <select
              value={rescueHours}
              onChange={(e) => setRescueHours(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-rose"
            >
              <option value={4}>4 Hours (Emergency Night Before Exam)</option>
              <option value={6}>6 Hours (Recommended Sprint)</option>
              <option value={10}>10 Hours (Full Weekend Rescue Plan)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Target Weak Chapter ({selectedSubject}):
            </label>
            <select
              value={selectedWeakChapter}
              onChange={(e) => setSelectedWeakChapter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-brand-rose"
            >
              {(CHAPTER_OPTIONS[selectedSubject] || ["General Chapter"]).map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateRescuePlan}
          className="w-full py-2.5 rounded-xl bg-brand-rose hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-950/40"
        >
          Generate Concrete Hourly Rescue Schedule
        </button>

        {/* Generated Schedule */}
        {rescueSchedule.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            {rescueSchedule.map((block, i) => (
              <div key={i} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-amber">{block.hour}</span>
                  <span className="text-slate-300 font-semibold">{block.focus}</span>
                </div>
                <div className="space-y-1 text-slate-400">
                  {block.tasks.map((t: string, j: number) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
