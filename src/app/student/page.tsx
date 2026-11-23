"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { getStudentProgress } from "@/lib/api";
import {
  Flame,
  ShieldCheck,
  Target,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

export default function StudentHomePage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStudentProgress();
        setProgress(data);
      } catch (err) {
        // Fallback default
        setProgress({
          theory_readiness_pct: 74.0,
          practical_readiness_pct: 82.5,
          streak_days: 4,
          mistake_vault_pending_count: 2,
          weak_chapters: ["Refraction of Light & Optical Instruments", "Current Electricity"],
          predicted_grade_band: "A-1 (Shield Active)",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const examDaysLeft = 78;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Greeting & Countdown Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10192D] via-[#1E293B] to-[#0B1120] border border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald text-xs font-semibold border border-brand-emerald/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nasra {user?.campus} Campus • Class {user?.class_grade} ({user?.board})</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Assalam-o-Alaikum, <span className="text-brand-amber">{user?.full_name?.split(" ")[0]}</span>!
            </h1>
            <p className="text-xs md:text-sm text-slate-300">
              Welcome to your Midnight Study Command Center. Target: <span className="text-brand-emerald font-bold">Grade A-1</span> in Board Finals.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Streak */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 fill-orange-400 text-orange-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Streak</p>
                <p className="text-sm font-bold text-slate-100">{progress?.streak_days || 4} Days</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-brand-indigo/20 text-brand-indigo flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Board Exam</p>
                <p className="text-sm font-bold text-slate-100">{examDaysLeft} Days Left</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 40% Pass + A-1 Shield Readiness Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Theory Readiness Card */}
        <div className="bg-[#10192D] border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-emerald uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                <span>Theory Readiness (BSEK Section A/B/C)</span>
              </div>
              <h3 className="text-2xl font-black text-slate-100">{progress?.theory_readiness_pct || 74}%</h3>
              <p className="text-xs text-slate-400">
                <span className="text-brand-emerald font-semibold">✓ 40% Pass Threshold Secured.</span> Working toward 85%+ A-1 Shield.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-brand-emerald flex items-center justify-center text-xs font-bold text-brand-emerald bg-brand-emerald/10">
              {progress?.theory_readiness_pct || 74}%
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-amber to-brand-emerald h-full rounded-full transition-all duration-500"
              style={{ width: `${progress?.theory_readiness_pct || 74}%` }}
            />
          </div>
        </div>

        {/* Practical Readiness Card */}
        <div className="bg-[#10192D] border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-sky uppercase tracking-wider">
                <FlaskConical className="w-4 h-4 text-brand-sky" />
                <span>15-Mark Lab Practical Readiness</span>
              </div>
              <h3 className="text-2xl font-black text-slate-100">{progress?.practical_readiness_pct || 82.5}%</h3>
              <p className="text-xs text-slate-400">
                <span className="text-brand-sky font-semibold">✓ 6/15 Pass Cleared.</span> Journal + Viva + Observation Tables ready.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-brand-sky flex items-center justify-center text-xs font-bold text-brand-sky bg-brand-sky/10">
              {progress?.practical_readiness_pct || 82.5}%
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-sky to-brand-indigo h-full rounded-full transition-all duration-500"
              style={{ width: `${progress?.practical_readiness_pct || 82.5}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Giant One-Tap Action Launchers */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>🚀 Rapid Practice Launchers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Launcher 1: MCQ Blitz */}
          <Link
            href="/student/practice"
            className="group bg-gradient-to-b from-[#10192D] to-[#0D1526] hover:from-[#142038] hover:to-[#10192D] border border-slate-800 hover:border-brand-emerald/50 p-4 rounded-xl transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-brand-emerald/15 text-brand-emerald flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-brand-emerald transition-colors">
                5-Min Section A Blitz
              </h4>
              <p className="text-xs text-slate-400">
                5 rapid-fire board MCQs with instant examiner trap notes. Missed questions go to 48h Mistake Vault.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-emerald">
              <span>Start Drill</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Launcher 2: Step Numericals & OCR */}
          <Link
            href="/student/numericals"
            className="group bg-gradient-to-b from-[#10192D] to-[#0D1526] hover:from-[#142038] hover:to-[#10192D] border border-slate-800 hover:border-brand-amber/50 p-4 rounded-xl transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-brand-amber/15 text-brand-amber flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-brand-amber transition-colors">
                Topper Step Solver
              </h4>
              <p className="text-xs text-slate-400">
                Given Data (+1.0) → Formula (+1.0) → Math (+1.5) → SI Unit (+0.5). Avoid the 0.5-mark missing unit penalty.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-amber">
              <span>Build Steps</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Launcher 3: 15-Mark Lab Arena */}
          <Link
            href="/student/labs"
            className="group bg-gradient-to-b from-[#10192D] to-[#0D1526] hover:from-[#142038] hover:to-[#10192D] border border-slate-800 hover:border-brand-sky/50 p-4 rounded-xl transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-brand-sky/15 text-brand-sky flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-brand-sky transition-colors">
                15-Mark Lab Arena
              </h4>
              <p className="text-xs text-slate-400">
                Oral Viva Voce Simulator, 60s Biology Spotting Flashcards, and Concordant Observation Table Auditor.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-sky">
              <span>Enter Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Mistake Vault Attention Box */}
      {progress?.mistake_vault_pending_count > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Spaced-Repetition Mistake Vault ({progress.mistake_vault_pending_count} Pending)
              </h4>
              <p className="text-xs text-slate-300">
                You missed a question on <span className="font-semibold text-white">Simple Harmonic Motion</span>. Scheduled for retry today.
              </p>
            </div>
          </div>
          <Link
            href="/student/practice"
            className="px-3 py-1.5 rounded-lg bg-brand-amber text-slate-950 text-xs font-bold shrink-0 hover:bg-amber-400 transition-colors"
          >
            Clear Vault
          </Link>
        </div>
      )}
    </div>
  );
}
