"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import {
  getClassBadges,
  awardStudentBadge,
  ClassBadgesResponse,
  StudentWallItem,
  BadgeItem
} from "@/lib/api";
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  PlusCircle,
  Zap,
  Users,
  GraduationCap,
  ShieldCheck,
  Send
} from "lucide-react";

export default function TeacherClassBadgeWallPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ClassBadgesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>("all");
  
  // Award Badge Modal State
  const [awardModalStudent, setAwardModalStudent] = useState<StudentWallItem | null>(null);
  const [selectedBadgeSlug, setSelectedBadgeSlug] = useState("teachers_pride");
  const [customNote, setCustomNote] = useState("Outstanding dedication and improvement in solving board numericals.");
  const [awarding, setAwarding] = useState(false);
  const [awardSuccess, setAwardSuccess] = useState(false);

  const [campus, setCampus] = useState("Saddar");
  const [classGrade, setClassGrade] = useState(10);
  const [section, setSection] = useState("A");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getClassBadges(campus, classGrade, section);
      setData(res);
    } catch (err) {
      console.error("Failed to load class badges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [campus, classGrade, section]);

  const handleAwardSubmit = async () => {
    if (!awardModalStudent) return;
    setAwarding(true);
    try {
      await awardStudentBadge(awardModalStudent.id, selectedBadgeSlug, customNote);
      setAwardSuccess(true);
      setTimeout(() => {
        setAwardSuccess(false);
        setAwardModalStudent(null);
        loadData();
      }, 1200);
    } catch (err) {
      alert("Failed to award badge. Check backend connection.");
    } finally {
      setAwarding(false);
    }
  };

  const students = data?.students || [];

  // Filter students by search and badge filter
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedBadgeFilter === "all") return true;
    return s.earned_badges.some((b) => b.slug === selectedBadgeFilter);
  });

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-cyan-950/70 border-cyan-400/50 text-cyan-300 shadow-sm shadow-cyan-500/10";
      case "gold":
        return "bg-amber-950/70 border-amber-400/50 text-amber-300 shadow-sm shadow-amber-500/10";
      case "silver":
        return "bg-slate-800/80 border-slate-400/40 text-slate-200";
      default:
        return "bg-orange-950/70 border-orange-500/40 text-orange-300";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {data?.is_sample && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/60 text-xs text-amber-200">
          Sample class list: these names are examples until BoardBrain is connected to the school&apos;s student records.
        </div>
      )}
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10192D] via-[#1E293B] to-[#0B1120] border border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald text-xs font-semibold border border-brand-emerald/30">
              <Medal className="w-3.5 h-3.5" />
              <span>Institutional Gamification Suite</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Class Honors &amp; Badge Wall</span>
              <span className="text-brand-amber text-sm font-nastaliq" dir="rtl">کلاس آنرز اور بیجز وال</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Strictly zero marks or competitive pressure — purely celebrating student milestones, lab proficiencies, and board habits. Award custom teacher honors in 1 tap!
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-4 self-start md:self-auto shadow-md">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-brand-emerald flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Class Roster</p>
              <p className="text-base font-extrabold text-white">
                {data?.students?.filter((s) => s.badge_count > 0).length || 0} of {data?.total_students || 0} Students Recognized
              </p>
            </div>
          </div>
        </div>

        {/* Section Switcher Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Campus &amp; Section:</span>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { setClassGrade(10); setSection("A"); }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  classGrade === 10 && section === "A"
                    ? "bg-brand-emerald text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                10-A ({user?.subject || "Physics"})
              </button>
              <button
                onClick={() => { setClassGrade(10); setSection("B"); }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  classGrade === 10 && section === "B"
                    ? "bg-brand-emerald text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                10-B ({user?.subject || "Physics"})
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-brand-amber" />
            <span>Saddar Campus • BSEK &amp; AKU-EB Pilot</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name..."
            className="w-full bg-[#10192D] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
          />
        </div>

        {/* Filter by Badge Type */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Badge:</span>
          </span>
          {[
            { id: "all", label: "All Badges" },
            { id: "teachers_pride", label: "Teacher's Pride ⭐" },
            { id: "section_a_destroyer", label: "Section A Destroyer" },
            { id: "si_unit_master", label: "SI Unit Master" },
            { id: "lab_arena_legend", label: "Lab Legend" },
            { id: "fire_streak_3d", label: "3-Day Streak" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedBadgeFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                selectedBadgeFilter === f.id
                  ? "bg-brand-emerald text-slate-950 font-bold"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Badge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-[#10192D] border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm hover:border-slate-700 transition-all"
          >
            {/* Student Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-emerald flex items-center justify-center font-bold text-white shadow-inner text-sm">
                  {student.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm tracking-tight">
                    {student.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{student.board}</span>
                    <span>•</span>
                    <span className="text-brand-amber font-medium">{student.group_name}</span>
                    <span>•</span>
                    <span>Section {student.section}</span>
                  </div>
                </div>
              </div>

              {/* Award Badge Button */}
              <button
                onClick={() => {
                  setAwardModalStudent(student);
                  setCustomNote(`Outstanding work and dedication in Physics, ${student.full_name.split(" ")[0]}!`);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-brand-amber/15 text-brand-amber border border-brand-amber/30 hover:bg-brand-amber/25 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Award Badge</span>
              </button>
            </div>

            {/* Badges Collection (Visual Medals - Strictly No Numbers) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Honors Earned ({student.badge_count})
                </span>
                <span className="text-[10px] text-brand-emerald font-semibold">
                  {student.badge_count >= 5 ? "🏆 Class Champion" : student.badge_count > 0 ? "✨ High Achiever" : ""}
                </span>
              </div>

              {student.earned_badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.earned_badges.map((badge) => {
                    const isTeacherBadge = badge.slug === "teachers_pride";
                    return (
                      <div
                        key={badge.slug}
                        title={badge.endorsement_note || badge.title}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${getTierBadgeStyle(
                          badge.tier
                        )}`}
                      >
                        <Medal className="w-3.5 h-3.5 shrink-0" />
                        <span>{badge.title}</span>
                        {isTeacherBadge && <span className="text-brand-amber">⭐</span>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  No badges claimed yet. Ready for first 5-Min Blitz!
                </p>
              )}

              {/* Endorsement Note Quote if present */}
              {student.earned_badges.find((b) => b.endorsement_note) && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-emerald">Teacher Endorsement:</span>{" "}
                    <span className="italic">
                      &ldquo;
                      {
                        student.earned_badges.find((b) => b.endorsement_note)
                          ?.endorsement_note
                      }
                      &rdquo;
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Award Badge Popup Modal */}
      {awardModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10192D] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close */}
            <button
              onClick={() => setAwardModalStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber text-[11px] font-semibold border border-brand-amber/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teacher Direct Commendation</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Award Badge to {awardModalStudent.full_name}
              </h2>
              <p className="text-xs text-slate-400">
                This badge and your note will immediately show on the student&apos;s Trophy Room.
              </p>
            </div>

            {/* Badge Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Honor Badge:</label>
              <select
                value={selectedBadgeSlug}
                onChange={(e) => setSelectedBadgeSlug(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald"
              >
                <option value="teachers_pride">Teacher&apos;s Pride Badge (استاد کا فخر)</option>
                <option value="topper_sheet_architect">Topper Sheet Architect (ٹاپپر شیٹ آرکیٹیکٹ)</option>
                <option value="lab_arena_legend">15-Mark Lab Legend (15 مارکس لیب لیجنڈ)</option>
                <option value="si_unit_master">SI Unit Perfectionist (ایس آئی یونٹس ماسٹر)</option>
                <option value="fire_streak_3d">3-Day Fire Streak (3 روزہ مسلسل محنت)</option>
              </select>
            </div>

            {/* Personalized Commendation Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Teacher&apos;s Personal Commendation Note:
              </label>
              <textarea
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Write an encouraging note that will inspire the student..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            {/* Confirm Button */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleAwardSubmit}
                disabled={awarding || awardSuccess}
                className="flex-1 bg-brand-emerald text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {awardSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Badge Awarded Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{awarding ? "Endorsing..." : "Confirm & Award Badge"}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setAwardModalStudent(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
