"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { getStudentBadges, BadgeItem, StudentBadgesResponse } from "@/lib/api";
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Share2,
  ChevronRight,
  Flame,
  Target,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  Zap,
  Medal,
  Star,
  ExternalLink
} from "lucide-react";

export default function StudentAwardsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<StudentBadgesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getStudentBadges();
        setData(res);
      } catch (err) {
        console.error("Failed to load badges:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const badges = data?.badges || [];
  const unlockedCount = data?.unlocked_count ?? badges.filter((b) => b.is_unlocked === 1).length;
  const totalBadges = data?.total_badges ?? (badges.length || 5);
  const totalXp = data?.total_xp ?? 450;
  const tierCounts = data?.tier_counts ?? { platinum: 1, gold: 1, silver: 1, bronze: 0 };

  const filteredBadges = badges.filter((b) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unlocked") return b.is_unlocked === 1;
    if (selectedFilter === "locked") return b.is_unlocked === 0;
    if (selectedFilter === "blitz") return b.category === "blitz";
    if (selectedFilter === "numericals") return b.category === "numericals";
    if (selectedFilter === "labs") return b.category === "labs";
    if (selectedFilter === "consistency") return b.category === "consistency" || b.category === "endorsement";
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return {
          border: "border-cyan-400/60 shadow-cyan-500/20",
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
          iconBg: "bg-gradient-to-tr from-cyan-600 to-blue-500 text-white",
          glow: "from-cyan-950/40 to-slate-900",
        };
      case "gold":
        return {
          border: "border-amber-400/60 shadow-amber-500/20",
          badge: "bg-amber-500/20 text-amber-300 border-amber-400/40",
          iconBg: "bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-bold",
          glow: "from-amber-950/35 to-slate-900",
        };
      case "silver":
        return {
          border: "border-slate-400/60 shadow-slate-400/15",
          badge: "bg-slate-400/20 text-slate-200 border-slate-400/40",
          iconBg: "bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 font-bold",
          glow: "from-slate-800/40 to-slate-900",
        };
      default: // bronze
        return {
          border: "border-orange-500/50 shadow-orange-500/10",
          badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
          iconBg: "bg-gradient-to-tr from-amber-700 to-orange-500 text-white",
          glow: "from-orange-950/30 to-slate-900",
        };
    }
  };

  const handleShare = (badge: BadgeItem) => {
    const text = `🎖️ I just unlocked the "${badge.title} (${badge.title_urdu})" badge on BoardBrain! Preparing for Class ${user?.class_grade} Board Finals with my AI Guru. 🚀`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTaskLink = (category: string) => {
    if (category === "blitz") return "/student/practice";
    if (category === "numericals") return "/student/numericals";
    if (category === "labs") return "/student/labs";
    return "/student/practice";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Hero Banner: Trophy Room & XP */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10192D] via-[#1E293B] to-[#0B1120] border border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber text-xs font-semibold border border-brand-amber/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>BoardBrain Trophy Room &amp; Milestones</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Class {user?.class_grade} Honors &amp; Badges</span>
              <span className="text-brand-amber text-sm font-nastaliq" dir="rtl">اعزازات اور بیجز</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Earn badges by mastering Section A MCQs, formatting 4-step numericals, and speaking in audio lab vivas. Zero stress, no rank pressure — just celebrating your mastery!
            </p>
          </div>

          {/* Gamified XP & Badge Counter Widget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-5 shrink-0 shadow-lg">
            <div className="text-center border-r border-slate-800 pr-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-brand-amber mx-auto flex items-center justify-center font-extrabold mb-1">
                <Medal className="w-5 h-5" />
              </div>
              <p className="text-lg font-black text-white">{unlockedCount} / {totalBadges}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Badges Earned</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-brand-emerald mx-auto flex items-center justify-center font-extrabold mb-1">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-lg font-black text-brand-emerald">{totalXp} XP</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total XP Earned</p>
            </div>
          </div>
        </div>

        {/* Tiers Distribution Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Your Collection:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-semibold">
            💎 {tierCounts.platinum} Platinum
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-300 font-semibold">
            🥇 {tierCounts.gold} Gold
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-600/40 text-slate-200 font-semibold">
            🥈 {tierCounts.silver} Silver
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-950/50 border border-orange-500/30 text-orange-300 font-semibold">
            🥉 {tierCounts.bronze} Bronze
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: "all", label: `All (${badges.length})` },
          { id: "unlocked", label: `Unlocked (${unlockedCount})` },
          { id: "locked", label: `In Progress (${Math.max(0, totalBadges - unlockedCount)})` },
          { id: "blitz", label: "MCQs & Blitz" },
          { id: "numericals", label: "Numericals & Steps" },
          { id: "labs", label: "15-Mark Labs" },
          { id: "consistency", label: "Streaks & Teacher Honors" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedFilter === tab.id
                ? "bg-brand-emerald text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.is_unlocked === 1;
          const tierStyle = getTierColor(badge.tier);

          return (
            <div
              key={badge.slug}
              onClick={() => setSelectedBadge(badge)}
              className={`relative rounded-2xl p-4 transition-all cursor-pointer border flex flex-col justify-between ${
                isUnlocked
                  ? `bg-gradient-to-b ${tierStyle.glow} ${tierStyle.border} shadow-lg hover:scale-[1.02] hover:-translate-y-0.5`
                  : "bg-slate-900/40 border-slate-800/80 opacity-70 hover:opacity-90 hover:border-slate-700"
              }`}
            >
              <div>
                {/* Header: Icon & Tier Tag */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        isUnlocked
                          ? tierStyle.iconBg
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {isUnlocked ? (
                        <Medal className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    {isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-black rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isUnlocked
                          ? tierStyle.badge
                          : "bg-slate-800/70 text-slate-400 border-slate-700"
                      }`}
                    >
                      {badge.tier}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-brand-amber" />
                      <span>+{badge.xp_points} XP</span>
                    </span>
                  </div>
                </div>

                {/* Title & Urdu Tag */}
                <h3 className="font-bold text-white text-sm tracking-tight flex items-baseline justify-between gap-2">
                  <span>{badge.title}</span>
                  <span className="text-xs text-brand-amber font-nastaliq" dir="rtl">{badge.title_urdu}</span>
                </h3>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>

                {/* Teacher Endorsement Callout if present */}
                {isUnlocked && badge.endorsement_by && (
                  <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    <span className="italic line-clamp-1">
                      <strong>{badge.endorsement_by}:</strong> &ldquo;{badge.endorsement_note}&rdquo;
                    </span>
                  </div>
                )}
              </div>

              {/* Footer: Criteria / Status */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {isUnlocked ? (
                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 line-clamp-1">
                    <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{badge.criteria_text}</span>
                  </span>
                )}

                <span className="text-[11px] text-slate-400 hover:text-white flex items-center gap-0.5 font-medium">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10192D] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Emblem Header */}
            <div className="text-center space-y-2 pt-2">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
                  selectedBadge.is_unlocked
                    ? getTierColor(selectedBadge.tier).iconBg
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {selectedBadge.is_unlocked ? (
                  <Trophy className="w-8 h-8" />
                ) : (
                  <Lock className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    selectedBadge.is_unlocked
                      ? getTierColor(selectedBadge.tier).badge
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {selectedBadge.tier} Badge • +{selectedBadge.xp_points} XP
                </span>
                <h2 className="text-xl font-bold text-white mt-1.5">{selectedBadge.title}</h2>
                <p className="text-base text-brand-amber font-nastaliq" dir="rtl">{selectedBadge.title_urdu}</p>
              </div>
            </div>

            {/* Description & Criteria */}
            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Achievement Description:</p>
                <p className="text-slate-200 leading-relaxed mt-0.5">{selectedBadge.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <p className="text-slate-400 font-medium">Official Board Requirement:</p>
                <p className="text-brand-emerald font-semibold mt-0.5">{selectedBadge.criteria_text}</p>
              </div>
            </div>

            {/* Teacher Endorsement note if any */}
            {selectedBadge.endorsement_by && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-xs space-y-1">
                <p className="text-brand-amber font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Teacher&apos;s Personal Commendation</span>
                </p>
                <p className="text-slate-200 italic leading-relaxed">
                  &ldquo;{selectedBadge.endorsement_note}&rdquo;
                </p>
                <p className="text-right text-[10px] text-emerald-400 font-medium">— {selectedBadge.endorsement_by}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              {selectedBadge.is_unlocked ? (
                <button
                  onClick={() => handleShare(selectedBadge)}
                  className="flex-1 bg-brand-emerald text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied to Clipboard!" : "Share Badge / WhatsApp"}</span>
                </button>
              ) : (
                <Link
                  href={getTaskLink(selectedBadge.category)}
                  className="flex-1 bg-brand-emerald text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Practice to Unlock Badge</span>
                </Link>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
