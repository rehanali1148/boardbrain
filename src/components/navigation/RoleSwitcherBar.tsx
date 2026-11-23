"use client";

import React from "react";
import { useAuth } from "@/lib/authContext";
import { UserCheck, Moon, Sun, ShieldAlert, Sparkles } from "lucide-react";

export default function RoleSwitcherBar() {
  const { user, roleKey, switchRole, isExamLightMode, toggleExamLightMode, isLoading } = useAuth();

  return (
    <header className="no-print bg-[#10192D] border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      {/* Brand & Campus Tag */}
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-brand-amber to-brand-emerald text-black font-extrabold px-2 py-0.5 rounded text-[11px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>Saddar Pilot</span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <span className="text-brand-emerald text-base">📡</span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-sm">BoardRadar</span>
              <span className="text-slate-500">•</span>
              <span className="text-brand-amber font-nastaliq text-xs" dir="rtl">بورڈ ریڈار</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 text-brand-emerald text-[10px] md:text-[11px] font-semibold border border-emerald-500/30">
              <span>🎯 Your Board Exam AI Coach (AI Ustad)</span>
            </span>
          </div>
          <span className="text-slate-500 hidden lg:inline">•</span>
          <span className="text-slate-400 font-normal hidden lg:inline">Education Trust Nasra Schools</span>
        </div>
      </div>

      {/* Role Switcher Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-brand-emerald" />
          <span className="hidden md:inline">Role:</span>
        </span>

        <button
          onClick={() => switchRole("student_10")}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            roleKey === "student_10"
              ? "bg-brand-emerald text-slate-950 shadow-sm shadow-emerald-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Class 10 (Areeba)
        </button>

        <button
          onClick={() => switchRole("student_09")}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            roleKey === "student_09"
              ? "bg-brand-sky text-slate-950 shadow-sm shadow-sky-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Class 9 (Hamza)
        </button>

        <button
          onClick={() => switchRole("teacher")}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            roleKey === "teacher"
              ? "bg-brand-amber text-slate-950 shadow-sm shadow-amber-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Teacher (Sir Farhan)
        </button>

        <button
          onClick={() => switchRole("campus_head")}
          disabled={isLoading}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            roleKey === "campus_head"
              ? "bg-brand-rose text-slate-950 shadow-sm shadow-rose-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Head (Mrs. Nasreen)
        </button>

        {/* Exam Light Mode Toggle */}
        <button
          onClick={toggleExamLightMode}
          title="Toggle Exam Paper Light Mode"
          className="ml-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
        >
          {isExamLightMode ? (
            <>
              <Moon className="w-3.5 h-3.5 text-brand-indigo" />
              <span className="hidden sm:inline">Midnight</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-brand-amber" />
              <span className="hidden sm:inline">Paper Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
