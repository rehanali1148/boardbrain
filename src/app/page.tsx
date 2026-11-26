"use client";

import React from "react";
import Link from "next/link";
import BoardBrainLogo from "@/components/navigation/BoardBrainLogo";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Cloud,
  Cpu,
  Play
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col justify-between selection:bg-brand-emerald selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#070C18]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BoardBrainLogo size={42} />

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              A SchoolOS Initiative
            </span>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all transform hover:-translate-y-0.5"
            >
              <span>Pilot Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Google Cloud & Gemini Alignment Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
          <Cloud className="w-4 h-4 text-sky-400" />
          <span>Powered by Google Cloud Platform & Gemini AI</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl leading-[1.15]">
          Pakistan&apos;s 1st Board Exam{" "}
          <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            AI Guru & Intelligence
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
          Built specifically for Sindh Board (BSEK) & Federal Board (FBISE). 
          Empowering educators with 60-second exam generation and equipping students with personalized 24/7 AI tutoring.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Launch Academic Pilot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-medium text-base transition-colors"
          >
            <Play className="w-4 h-4 text-brand-amber fill-brand-amber" />
            <span>Watch Video Walkthrough</span>
          </Link>
        </div>

        {/* Trust & Pilot Proof */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center w-full max-w-3xl">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">15+ Yrs</div>
            <div className="text-xs text-slate-400 mt-1">Past Papers Indexed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-sky-400">100%</div>
            <div className="text-xs text-slate-400 mt-1">SLO & Bloom&apos;s Aligned</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-brand-amber">&lt;60s</div>
            <div className="text-xs text-slate-400 mt-1">Exam Paper Generator</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">24/7</div>
            <div className="text-xs text-slate-400 mt-1">Gemini AI Socratic Guru</div>
          </div>
        </div>

        {/* Two Core Pillars: Teachers vs Students */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full">
          {/* Teacher Pillar */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">For Educators & Subject Heads</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Drastically eliminate the 4-hour burden of drafting exams, writing marking rubrics, and mapping Student Learning Outcomes.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Parallel Variants:</strong> Camera-ready Row A & Row B papers with step rubrics.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Diagnostic Trap Heatmaps:</strong> Identify exact formulas confusing 60%+ of the class.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Clean Print Export:</strong> Standard board formatting ready for school photocopiers.</span>
              </li>
            </ul>
          </div>

          {/* Student Pillar */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-5">
              <GraduationCap className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">For Matric & Intermediate Students</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Master the art of scoring an A-1 grade with an AI Guru that understands your mother tongue and trains you for the exam hall.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Understand Urdu ➔ Write Board English:</strong> Dual-card pedagogical explanations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>5-Min MCQ Blitz:</strong> Active practice uncovering tricky examiner distractors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span><strong>Topper Presentation Studio:</strong> Earn full marks on Given Data, Formulas, and Units.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Architecture & Google Cloud Integration Note */}
        <div className="mt-16 w-full p-6 sm:p-8 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Cpu className="w-4 h-4" />
              <span>Enterprise Cloud Infrastructure</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Engineered with Google Cloud Platform & Gemini AI
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              BoardBrain runs high-concurrency curriculum vector retrieval and multimodal AI tutoring on Google Cloud Run and Gemini 1.5/2.0 Flash APIs, providing sub-second inference for thousands of students simultaneously.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
          >
            Access Portal
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#060A14] text-slate-400 py-8 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-bold text-slate-200">BoardBrain</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>A Flagship AI Product of SchoolOS Technologies</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Contact: <a href="mailto:admin.nasra@nasraschool.edu.pk" className="text-slate-300 hover:text-white underline">admin.nasra@nasraschool.edu.pk</a></span>
            <Link href="/login" className="hover:text-slate-200">Pilot Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
