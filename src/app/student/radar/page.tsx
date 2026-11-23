"use client";

import React, { useState, useEffect } from "react";
import { getBoardRadar } from "@/lib/api";
import { Flame, Clock, CheckSquare, Sparkles, AlertCircle, Compass } from "lucide-react";

export default function BoardRadarPage() {
  const [radarItems, setRadarItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 48-Hour Rescue Mode State
  const [rescueHours, setRescueHours] = useState<number>(6);
  const [selectedWeakChapter, setSelectedWeakChapter] = useState<string>("Refraction of Light & Optical Instruments");
  const [rescueSchedule, setRescueSchedule] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBoardRadar("BSEK_KARACHI", 10, "Physics");
        setRadarItems(data);
      } catch (e) {
        console.warn("Radar fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenerateRescuePlan = () => {
    setRescueSchedule([
      {
        hour: "Hour 1 - 2",
        focus: "High-Yield Overdue Topic: Snell's Law & Refractive Index",
        tasks: [
          "Learn exact board definition: n = sin(i)/sin(r) (+1.0 Mark)",
          "Practice 3 Section C numericals (f=8cm, p=12cm => q=24cm)",
          "Memorize: Convex mirror f < 0, Concave mirror f > 0"
        ]
      },
      {
        hour: "Hour 3 - 4",
        focus: "15-Mark Practical Viva Voce & Spotting Defense",
        tasks: [
          "Ohm's Law: Explain why ammeter is series and voltmeter is parallel (+2.0 Marks)",
          "Biology Spotting: Memorize 2 reasons for Amoeba Binary Fission slide",
          "Chemistry: Verify concordant burette reading rule (<= 0.1 ml difference)"
        ]
      },
      {
        hour: "Hour 5 - 6",
        focus: "Timed 5-Minute Section A Blitz Drills",
        tasks: [
          "Complete 4 chapter MCQ blitzes in Mistake Vault",
          "Audit SI units (cm, m/s, ohms) on all rough paper calculations",
          "Rest & recharge before examination hall"
        ]
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-rose" />
          <span>15-Year Historical Frequency & Weightage Radar</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Temporal gap analysis tracking Pakistani paper setter rotation cycles across 2014–2024 annual board papers.
        </p>
      </div>

      {/* Radar Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Loading 15-Year Historical Frequency Data...
          </div>
        ) : (
          radarItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#10192D] border border-slate-800 p-4 md:p-5 rounded-2xl hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 border border-rose-800/60 text-rose-300 uppercase tracking-wide">
                  {item.urgency_tag}
                </span>
                <span className="text-xs font-bold text-brand-emerald">
                  {item.probability_score}% Frequency Weightage
                </span>
              </div>

              <h3 className="text-sm md:text-base font-bold text-white">
                {item.chapter_name}: <span className="text-slate-300 font-normal">{item.question_summary}</span>
              </h3>

              <div className="p-3 bg-slate-900/80 rounded-xl text-xs text-slate-300 space-y-1 border border-slate-800/80">
                <p className="font-semibold text-brand-amber">📊 Board Paper History:</p>
                <p>{item.examiner_insight}</p>
              </div>
            </div>
          ))
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
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
            >
              <option value={4}>4 Hours (Emergency Night Before)</option>
              <option value={6}>6 Hours (Recommended Sprint)</option>
              <option value={10}>10 Hours (Full Weekend Rescue)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Target Weak Chapter:</label>
            <select
              value={selectedWeakChapter}
              onChange={(e) => setSelectedWeakChapter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200"
            >
              <option value="Refraction of Light & Optical Instruments">Refraction of Light & Optical Instruments</option>
              <option value="Current Electricity">Current Electricity</option>
              <option value="Simple Harmonic Motion & Waves">Simple Harmonic Motion & Waves</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateRescuePlan}
          className="w-full py-2.5 rounded-xl bg-brand-rose text-white font-bold text-xs hover:bg-rose-600 transition-colors"
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
