"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { getClassHeatmap, getTeacherDoubts } from "@/lib/api";
import OrientationVideoModal from "@/components/common/OrientationVideoModal";
import { FileText, MessageSquareHeart, BarChart3, AlertTriangle, Sparkles, Play } from "lucide-react";

export default function TeacherHomePage() {
  const { user } = useAuth();
  const [heatmap, setHeatmap] = useState<any>(null);
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    // Offer the briefing once per browser session
    try {
      if (!sessionStorage.getItem("bb_teacher_intro_seen")) {
        setShowVideoModal(true);
        sessionStorage.setItem("bb_teacher_intro_seen", "1");
      }
    } catch {
      /* storage blocked */
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "teacher" && user?.role !== "campus_head") return;
    async function load() {
      try {
        setLoadError(false);
        const [hData, dData] = await Promise.all([
          getClassHeatmap(user?.campus || "Saddar", 10, user?.subject || "Physics"),
          getTeacherDoubts(user?.campus || "Saddar", 10, "A"),
        ]);
        setHeatmap(hData);
        setDoubts(Array.isArray(dData) ? dData : []);
      } catch (e) {
        console.warn("Teacher data load failed:", e);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const pendingCount = doubts.filter((d) => d.status === "pending").length;
  const traps = [...(heatmap?.chapter_trap_distribution || [])].sort((a: any, b: any) => b.failure_rate_pct - a.failure_rate_pct);
  const topTrap = traps[0];
  const sectionsLabel = (user?.sections || ["10-A"]).join(" & ");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {loadError && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200">
          Class data could not be loaded. Check your connection and reload the page.
        </div>
      )}
      {heatmap?.is_sample && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/60 text-xs text-amber-200">
          Sample data: the class figures below are examples until your students start using BoardBrain. Student doubts are real.
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-br from-[#10192D] via-[#1E293B] to-[#0B1120] border border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber text-xs font-semibold border border-brand-amber/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user?.campus} Campus • Teacher</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Welcome, <span className="text-brand-emerald">{user?.full_name}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              {user?.subject || "Physics"} • Sections {sectionsLabel}
              {heatmap ? ` • ${heatmap.active_students} of ${heatmap.total_students} students active this week` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs md:text-sm border border-amber-500/40 shadow-sm transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>ویڈیو بریفنگ دیکھیں (2.5 Min)</span>
            </button>

            <Link
              href="/teacher/generator"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber to-brand-emerald text-slate-950 font-bold text-xs md:text-sm shadow-md hover:opacity-95 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Exam Paper Generator</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Class Readiness</span>
            <BarChart3 className="w-4 h-4 text-brand-emerald" />
          </div>
          <p className="text-2xl font-black text-white">{heatmap ? `${heatmap.average_readiness_pct}%` : "—"}</p>
          <p className="text-[11px] text-brand-emerald font-semibold">
            {heatmap
              ? `${heatmap.passing_students} of ${heatmap.total_students} students above the ${heatmap.pass_mark_pct}% pass mark`
              : "No data yet"}
          </p>
        </div>

        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Doubts Waiting for You</span>
            <MessageSquareHeart className="w-4 h-4 text-brand-amber" />
          </div>
          <p className="text-2xl font-black text-brand-amber">{loading ? "…" : pendingCount}</p>
          <Link href="/teacher/doubts" className="text-[11px] text-brand-amber hover:underline font-semibold block">
            Open the doubt inbox →
          </Link>
        </div>

        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Most Common Mistake</span>
            <AlertTriangle className="w-4 h-4 text-brand-rose" />
          </div>
          <p className="text-sm font-bold text-slate-200 truncate">{topTrap ? topTrap.chapter_name : "No data yet"}</p>
          <p className="text-[11px] text-slate-400">{topTrap ? `${topTrap.failure_rate_pct}% got it wrong: ${topTrap.top_trap}` : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#10192D] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-emerald" />
              <span>Where the class goes wrong ({heatmap?.class_label || "10-A"})</span>
            </h3>
            <Link href="/teacher/heatmap" className="text-xs text-brand-emerald hover:underline">
              Full heatmap →
            </Link>
          </div>
          <div className="space-y-3">
            {!loading && traps.length === 0 && <p className="text-xs text-slate-400">No data yet.</p>}
            {traps.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{item.chapter_name}</span>
                  <span className="text-brand-rose font-bold">{item.failure_rate_pct}% wrong</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  <b>Common mistake:</b> {item.top_trap}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#10192D] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-brand-amber" />
              <span>Latest Student Doubts</span>
            </h3>
            <Link href="/teacher/doubts" className="text-xs text-brand-amber hover:underline">
              View all ({doubts.length}) →
            </Link>
          </div>
          <div className="space-y-3">
            {!loading && doubts.length === 0 && !loadError && <p className="text-xs text-slate-400">No doubts from students yet.</p>}
            {doubts.slice(0, 3).map((d: any) => (
              <div key={d.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">
                    {d.student_name} (Class {d.class_grade}-{d.section})
                  </span>
                  <span className="text-brand-amber font-semibold">
                    {d.subject} • {d.topic}
                  </span>
                </div>
                <p className="text-slate-300 italic">&quot;{d.student_attempt_summary || d.student_query}&quot;</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-500">{d.status === "answered" ? "✓ Answered" : "⏳ Waiting for your reply"}</span>
                  <Link href="/teacher/doubts" className="text-brand-emerald font-bold hover:underline">
                    Reply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OrientationVideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoSrc="/videos/boardbrain_teacher_walkthrough_with_voiceover.mp4"
        title="🎓 Teacher Briefing — BoardBrain"
        subtitle="2.5 منٹ کی مکمل ویڈیو بریفنگ مع اردو وائس اوور • اساتذہ اور اسکول قیادت کے لیے"
        theme="teacher"
      />
    </div>
  );
}
