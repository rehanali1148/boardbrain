"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { getClassHeatmap, getTeacherDoubts } from "@/lib/api";
import {
  FileText,
  MessageSquareHeart,
  BarChart3,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award
} from "lucide-react";

export default function TeacherHomePage() {
  const { user } = useAuth();
  const [heatmap, setHeatmap] = useState<any>(null);
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const hData = await getClassHeatmap(user?.campus || "Saddar", 10, "Physics");
        setHeatmap(hData);
        const dData = await getTeacherDoubts(user?.campus || "Saddar", 10, "A");
        setDoubts(dData);
      } catch (e) {
        console.warn("Teacher data load fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Teacher Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#10192D] via-[#1E293B] to-[#0B1120] border border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber text-xs font-semibold border border-brand-amber/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user?.campus} Campus • Faculty Co-Pilot Active</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Welcome, <span className="text-brand-emerald">{user?.full_name}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              Monitoring Class 10 Physics (Sections A & B) • 42 Active Students
            </p>
          </div>

          <Link
            href="/teacher/generator"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber to-brand-emerald text-slate-950 font-bold text-xs md:text-sm shadow-md hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>60s Exam Paper Generator</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Section Readiness</span>
            <BarChart3 className="w-4 h-4 text-brand-emerald" />
          </div>
          <p className="text-2xl font-black text-white">{heatmap?.average_readiness_pct || 74.5}%</p>
          <p className="text-[11px] text-brand-emerald font-semibold">✓ 38/42 students passing 40% threshold</p>
        </div>

        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Student Doubts</span>
            <MessageSquareHeart className="w-4 h-4 text-brand-amber" />
          </div>
          <p className="text-2xl font-black text-brand-amber">{doubts.filter(d => d.status === 'pending').length || 1}</p>
          <Link href="/teacher/doubts" className="text-[11px] text-brand-amber hover:underline font-semibold block">
            Review Escalation Queue →
          </Link>
        </div>

        <div className="bg-[#10192D] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Top Class Trap This Week</span>
            <AlertTriangle className="w-4 h-4 text-brand-rose" />
          </div>
          <p className="text-sm font-bold text-slate-200 truncate">1/q Reciprocal Inversion</p>
          <p className="text-[11px] text-slate-400">42% of section made this error in Blitz</p>
        </div>
      </div>

      {/* Weekly Weakness Heatmap & Quick Action Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Heatmap Box */}
        <div className="bg-[#10192D] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-emerald" />
              <span>Section Trap Distribution (Class 10-A)</span>
            </h3>
            <Link href="/teacher/heatmap" className="text-xs text-brand-emerald hover:underline">
              Full Heatmap →
            </Link>
          </div>

          <div className="space-y-3">
            {heatmap?.chapter_trap_distribution?.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{item.chapter_name}</span>
                  <span className="text-brand-rose font-bold">{item.failure_rate_pct}% Failure</span>
                </div>
                <p className="text-slate-400 text-[11px]"><b>Top Trap:</b> {item.top_trap}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Doubt Queue Quick View */}
        <div className="bg-[#10192D] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquareHeart className="w-4 h-4 text-brand-amber" />
              <span>Recent Escalations from Students</span>
            </h3>
            <Link href="/teacher/doubts" className="text-xs text-brand-amber hover:underline">
              View All ({doubts.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {doubts.map((d: any) => (
              <div key={d.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">{d.student_name} (Sec {d.section})</span>
                  <span className="text-brand-amber font-semibold">{d.subject} • {d.topic}</span>
                </div>
                <p className="text-slate-300 italic">"{d.student_attempt_summary}"</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-500">Status: {d.status}</span>
                  <Link href="/teacher/doubts" className="text-brand-emerald font-bold hover:underline">
                    Reply to Student →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
