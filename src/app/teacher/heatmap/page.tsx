"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getClassHeatmap } from "@/lib/api";
import { BarChart3, AlertTriangle, Users, TrendingDown, Sparkles } from "lucide-react";

export default function ClassHeatmapPage() {
  const { user } = useAuth();
  const [heatmap, setHeatmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (user?.role !== "teacher" && user?.role !== "campus_head") return;
    async function load() {
      try {
        setLoadError(false);
        const data = await getClassHeatmap(user?.campus || "Saddar", 10, user?.subject || "Physics");
        setHeatmap(data);
      } catch (e) {
        console.warn("Heatmap error:", e);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const traps = [...(heatmap?.chapter_trap_distribution || [])].sort((a: any, b: any) => b.failure_rate_pct - a.failure_rate_pct);
  const critical = traps.filter((t: any) => t.failure_rate_pct > 35).length;
  const participation = heatmap ? Math.round((heatmap.active_students / heatmap.total_students) * 1000) / 10 : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-emerald" />
          <span>Class Weakness Heatmap</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Which chapters your class gets wrong most often in the MCQ Blitz, and the mistake behind it.
        </p>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200">
          The heatmap could not be loaded. Check your connection and reload the page.
        </div>
      )}
      {heatmap?.is_sample && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/60 text-xs text-amber-200">
          Sample data: these figures are examples. Real figures will appear once your students use the MCQ Blitz.
        </div>
      )}
      {loading && !loadError && <p className="text-xs text-slate-400">Loading...</p>}

      {heatmap && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-[#10192D] border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Class Average Readiness</span>
            <p className="text-2xl font-black text-brand-emerald">{heatmap.average_readiness_pct}%</p>
            <span className="text-[10px] text-slate-400">
              {heatmap.passing_students} of {heatmap.total_students} above the {heatmap.pass_mark_pct}% pass mark
            </span>
          </div>
          <div className="p-4 bg-[#10192D] border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Students Active This Week</span>
            <p className="text-2xl font-black text-white">
              {heatmap.active_students} / {heatmap.total_students}
            </p>
            <span className="text-[10px] text-brand-emerald">{participation}% took part</span>
          </div>
          <div className="p-4 bg-[#10192D] border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Critical Chapters</span>
            <p className="text-2xl font-black text-brand-rose">
              {critical} {critical === 1 ? "Chapter" : "Chapters"}
            </p>
            <span className="text-[10px] text-brand-rose">more than 35% wrong in the MCQ Blitz</span>
          </div>
        </div>
      )}

      {/* Chapter Trap Detail Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Diagnostic Breakdown by Chapter
        </h3>

        {traps.map((item: any, i: number) => (
          <div
            key={i}
            className="p-5 bg-[#10192D] border border-slate-800 rounded-2xl space-y-3 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <h4 className="text-sm md:text-base font-bold text-white">{item.chapter_name}</h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/60 border border-rose-800 text-rose-300">
                {item.failure_rate_pct}% Failure Rate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                <span className="font-bold text-brand-amber">⚠️ Primary Student Trap:</span>
                <p className="text-slate-300">{item.top_trap}</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl space-y-1 border border-slate-800">
                <span className="font-bold text-brand-sky">💬 Typical Student Doubt:</span>
                <p className="text-slate-300 italic">"{item.sample_doubt}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
