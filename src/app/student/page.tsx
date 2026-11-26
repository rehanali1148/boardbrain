"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { getStudentProgress, getStudentGoldNotes, getStudentBadges } from "@/lib/api";
import { getInsights, getVault } from "@/lib/learnerModel";
import OrientationVideoModal from "@/components/common/OrientationVideoModal";
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
  Award,
  Medal,
  Zap,
  Play
} from "lucide-react";

export default function StudentHomePage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  useEffect(() => {
    // Auto popup on login / initial entry for student
    const seen = sessionStorage.getItem("bb_student_intro_seen");
    if (!seen) {
      setShowVideoModal(true);
      sessionStorage.setItem("bb_student_intro_seen", "1");
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const roleKey = user?.class_grade === 9 ? "student_09" : "student_10";
        const data = await getStudentProgress();
        // Incorporate any local blitz drill activity if available
        let localPct = null;
        try {
          const stored = localStorage.getItem("boardbrain_last_score_pct");
          if (stored) localPct = Number(stored);
        } catch (e) {}

        setProgress({
          ...data,
          theory_readiness_pct: localPct !== null ? Math.round((data.theory_readiness_pct + localPct) / 2) : data.theory_readiness_pct,
          streak_days: data.streak_days || (user?.class_grade === 9 ? 6 : 5),
          mistake_vault_pending_count: data.mistake_vault_pending_count ?? (user?.class_grade === 9 ? 1 : 2)
        });
      } catch (err) {
        // Resilient fallback strictly matching student class
        const isGrade9 = user?.class_grade === 9;
        setProgress({
          theory_readiness_pct: isGrade9 ? 72.0 : 76.5,
          practical_readiness_pct: isGrade9 ? 80.0 : 84.0,
          streak_days: isGrade9 ? 6 : 5,
          mistake_vault_pending_count: isGrade9 ? 1 : 2,
          weak_chapters: isGrade9 ? ["Dynamics", "Kinematics Equations"] : ["Refraction of Light & Optical Instruments", "Current Electricity"],
          predicted_grade_band: "A-1 (Shield Active)",
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // Expected start of the BSEK / AKU-EB Matric annual exams. Update when the board publishes the date sheet.
  const EXPECTED_EXAM_START = new Date("2027-04-01T00:00:00+05:00");
  const examDaysLeft = Math.max(0, Math.ceil((EXPECTED_EXAM_START.getTime() - Date.now()) / 86400000));

  const [goldNotes, setGoldNotes] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.class_grade) return;
    getStudentGoldNotes(user.class_grade).then(setGoldNotes);
  }, [user?.class_grade]);

  const [insights, setInsights] = useState<any>(null);
  const [vaultCount, setVaultCount] = useState(0);
  const [vaultFirst, setVaultFirst] = useState<string>("");
  useEffect(() => {
    if (!user) return;
    setInsights(getInsights());
    const v = getVault();
    setVaultCount(v.length);
    setVaultFirst(v[0]?.chapter_name || "");
  }, [user]);

  // Same number the Awards page shows
  const [earnedBadges, setEarnedBadges] = useState<number | null>(null);
  useEffect(() => {
    if (!user) return;
    getStudentBadges()
      .then((b) => setEarnedBadges(b.unlocked_count))
      .catch(() => setEarnedBadges(0));
  }, [user]);

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
              Welcome to <span className="text-sky-400 font-bold">BoardBrain</span> — Your Board Exam AI Guru. Target: <span className="text-brand-emerald font-bold">Grade A-1</span> in Board Finals.
            </p>
            <div className="pt-1.5">
              <button
                onClick={() => setShowVideoModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/40 shadow-sm transition-all inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-sky-300 text-sky-300" />
                <span>ویڈیو واک تھرو دیکھیں (2.5 Min)</span>
              </button>
            </div>
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
                <p className="text-sm font-bold text-slate-100">{insights ? insights.streakDays : 0} {insights?.streakDays === 1 ? "Day" : "Days"}</p>
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
                <p className="text-[9px] text-slate-500">expected 1 April 2027</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {goldNotes.length > 0 && (
        <div className="bg-[#10192D] border border-amber-700/50 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-brand-amber flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Tips from your teachers</span>
          </h3>
          {goldNotes.slice(0, 3).map((n: any) => (
            <div key={n.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-200">
                {n.subject} • {n.topic}
              </p>
              <p className="text-slate-300">{n.gold_tip_text}</p>
              <p className="text-[10px] text-slate-500">— {n.teacher_name}</p>
            </div>
          ))}
        </div>
      )}

      {/* BoardBrain's read on you: built from how this student actually answers */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-[#10192D] to-[#10192D] border border-indigo-700/50 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>BoardBrain&apos;s read on you</span>
          </h3>
          {insights?.enoughData && (
            <span className="text-[10px] text-indigo-300/80">from {insights.totalAttempts} answers</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-100 leading-relaxed">{insights?.headline}</p>
          <p className="font-nastaliq text-sm text-slate-400 text-right" dir="rtl">{insights?.headlineUr}</p>
        </div>

        {insights?.enoughData && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-lg font-black text-white">{insights.accuracy}%</p>
              <p className="text-[10px] text-slate-400">MCQs correct</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-sm font-bold text-emerald-300 truncate">{insights.strongest?.chapter || "—"}</p>
              <p className="text-[10px] text-slate-400">strongest</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-sm font-bold text-rose-300 truncate">{insights.weakest?.chapter || "—"}</p>
              <p className="text-[10px] text-slate-400">needs work</p>
            </div>
          </div>
        )}

        {insights?.misconceptions?.length ? (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 text-xs text-rose-200 space-y-1">
            <p className="font-bold">🧠 The idea that keeps tripping you up:</p>
            <p>{insights.misconceptions[0]}</p>
          </div>
        ) : null}

        {insights?.chapters?.filter((c: any) => c.attempts >= 2).length ? (
          <div className="flex flex-wrap gap-1.5">
            {insights.chapters
              .filter((c: any) => c.attempts >= 2)
              .map((c: any) => (
                <span
                  key={c.subject + c.chapter}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border ${
                    c.state === "mastered"
                      ? "bg-emerald-950/50 border-emerald-700 text-emerald-300"
                      : c.state === "misconception"
                      ? "bg-rose-950/50 border-rose-700 text-rose-300"
                      : c.state === "gap"
                      ? "bg-orange-950/50 border-orange-700 text-orange-300"
                      : "bg-amber-950/50 border-amber-700 text-amber-300"
                  }`}
                >
                  {c.chapter}: {c.state === "mastered" ? "mastered" : c.state === "misconception" ? "wrong idea" : c.state === "gap" ? "not learnt yet" : "shaky"} ({c.accuracy}%)
                </span>
              ))}
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <p className="text-xs text-slate-300">
            <b className="text-indigo-200">Do this next:</b> {insights?.nextAction}
          </p>
          <Link
            href={insights?.weakest?.state === "misconception" ? "/student/ustad" : "/student/practice"}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 text-center"
          >
            Go →
          </Link>
        </div>
      </div>

      {/* Gamified Honors & Badges Showcase Bar */}
      <div className="bg-gradient-to-r from-[#10192D] via-[#162238] to-[#10192D] border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Medal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">Trophy Room &amp; Honors</h4>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                {earnedBadges === null ? "…" : `${earnedBadges} Earned`}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Earn badges by practising. Your teacher can also award you one.
            </p>
          </div>
        </div>

        {/* Mini Badges Preview & Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/student/awards"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-emerald text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
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
      {vaultCount > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Mistake Vault ({vaultCount} to re-try)
              </h4>
              <p className="text-xs text-slate-300">
                You missed a question on <span className="font-semibold text-white">{vaultFirst}</span>. Re-try it after 48 hours to lock it in.
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

      {/* Student Orientation Video Popup */}
      <OrientationVideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoSrc="/videos/boardbrain_student_walkthrough_with_voiceover.mp4"
        title="🚀 Welcome to BoardBrain! — Student Orientation Walkthrough"
        subtitle="دیکھیں رٹے کے بغیر گیم بیجز کے ساتھ بورڈ امتحان میں A-1 گریڈ کیسے حاصل کرنا ہے"
        theme="student"
      />
    </div>
  );
}
