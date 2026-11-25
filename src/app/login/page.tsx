"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import BoardBrainLogo from "@/components/navigation/BoardBrainLogo";
import {
  GraduationCap,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Award,
  KeyRound,
  School,
  Lock
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"quick" | "pin">("quick");
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState<"student_10" | "student_09" | "teacher">("student_10");
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleQuickLogin = async (role: "student_10" | "student_09" | "teacher" | "campus_head") => {
    await switchRole(role);
    if (role === "teacher" || role === "campus_head") {
      router.push("/teacher");
    } else {
      router.push("/student");
    }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg("Please enter the pilot passcode (1234)");
      return;
    }
    if (pin.trim() !== "1234") {
      setErrorMsg("Invalid pilot passcode. Please use pilot PIN: 1234");
      return;
    }

    // Validated
    setErrorMsg("");
    await switchRole(customRole);
    if (customRole === "teacher") {
      router.push("/teacher");
    } else {
      router.push("/student");
    }
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar Branding */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <BoardBrainLogo size={44} />

        <div className="flex items-center gap-2">
          <span className="bg-emerald-950/80 border border-emerald-500/30 text-brand-emerald text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
            <span>Saddar Pilot 2026</span>
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-white p-1.5 flex items-center justify-center">
            <img
              src="/boardbrain-icon.png"
              alt="BoardBrain — Your Board Exam AI Guru"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Academic Pilot Portal
          </h1>
          <p className="text-xs text-sky-400 font-semibold mt-0.5">
            YOUR BOARD EXAM AI GURU
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Education Trust Nasra Schools • Saddar Campus
          </p>
        </div>

        {/* Urdu Audio Briefing Player */}
        <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-center shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>🎙️</span>
              <span>اردو آڈیو بریفنگ (Audio Guide)</span>
            </span>
            <span className="text-[10px] bg-brand-emerald text-slate-950 font-bold px-2 py-0.5 rounded-full">
              2.5 Min Walkthrough
            </span>
          </div>
          <audio controls className="w-full h-8 rounded-lg outline-none" style={{ filter: "invert(0.9) hue-rotate(180deg)" }}>
            <source src="/boardbrain_audio_walkthrough_urdu.mp3" type="audio/mpeg" />
            Your browser does not support audio.
          </audio>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#131D33] rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("quick")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "quick"
                ? "bg-brand-emerald text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Tap Demo Entry</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pin")}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "pin"
                ? "bg-brand-amber text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Passcode Login</span>
          </button>
        </div>

        {/* TAB 1: 1-Tap Quick Pilot Access */}
        {activeTab === "quick" && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400 font-medium text-center mb-2">
              Select your role for instantaneous live demo access:
            </p>

            {/* Teacher: Sir Farhan */}
            <button
              onClick={() => handleQuickLogin("teacher")}
              disabled={isLoading}
              className="w-full text-left p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-950/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-brand-amber flex items-center justify-center text-lg font-bold border border-amber-500/40">
                  👨‍🏫
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-brand-amber transition-colors">
                      Sir Farhan Ahmed
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                      Teacher
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Class 9 & 10 Physics • Saddar Campus</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Student: Areeba Tariq (Class 10) */}
            <button
              onClick={() => handleQuickLogin("student_10")}
              disabled={isLoading}
              className="w-full text-left p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-brand-emerald flex items-center justify-center text-lg font-bold border border-emerald-500/40">
                  👩‍🎓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-brand-emerald transition-colors">
                      Areeba Tariq
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Matric Target 95%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Class 10-A • Biology & Physics Suite</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Student: Hamza Siddiqui (Class 9) */}
            <button
              onClick={() => handleQuickLogin("student_09")}
              disabled={isLoading}
              className="w-full text-left p-3.5 rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/30 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-950/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-brand-sky flex items-center justify-center text-lg font-bold border border-sky-500/40">
                  👨‍🎓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-brand-sky transition-colors">
                      Hamza Siddiqui
                    </span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full border border-sky-500/30">
                      Class 9
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Class 9-B • Computer Science & Physics</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Head: Mrs. Nasreen Shah */}
            <button
              onClick={() => handleQuickLogin("campus_head")}
              disabled={isLoading}
              className="w-full text-left p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-950/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-brand-rose flex items-center justify-center text-lg font-bold border border-rose-500/40">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-brand-rose transition-colors">
                      Mrs. Nasreen Shah
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                      Head of Campus
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Academic Leadership & Analytics Hub</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        )}

        {/* TAB 2: Passcode Login */}
        {activeTab === "pin" && (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Full Name or Username
              </label>
              <input
                type="text"
                placeholder="e.g. Miss Samina / Ahmed Ali"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#131D33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Pilot Role
              </label>
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as any)}
                className="w-full bg-[#131D33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-emerald transition-colors"
              >
                <option value="student_10">Class 10 Student (Matric Exam Prep)</option>
                <option value="student_09">Class 9 Student (Foundation & MCQs)</option>
                <option value="teacher">Subject Teacher (Paper Generator & Doubts)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Pilot Passcode
                </label>
                <span className="text-[11px] text-brand-emerald font-medium">Pilot PIN: 1234</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter 1234"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-[#131D33] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 tracking-widest focus:outline-none focus:border-brand-amber transition-colors font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-950/40 border border-rose-500/30 rounded-lg p-2 text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-amber to-brand-emerald font-bold text-slate-950 text-sm hover:opacity-95 shadow-lg shadow-emerald-950/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter BoardBrain Command</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security & ERP Bridge Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Isolated Pilot Container (Oracle Cloud VM) • Zero ERP Conflict</span>
          </div>
        </div>
      </div>

      {/* Footer Credentials Info */}
      <div className="text-center text-xs text-slate-500 pb-2">
        BoardBrain © 2026 • Education Trust Nasra Schools (Saddar Campus Pilot)
      </div>
    </div>
  );
}
