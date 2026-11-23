"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  LayoutDashboard,
  Target,
  FlaskConical,
  MessageSquareHeart,
  FileText,
  BarChart3,
  Flame,
  Award,
  BookOpen,
  GraduationCap
} from "lucide-react";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "campus_head";

  const studentLinks = [
    { label: "Today's Command", href: "/student", icon: LayoutDashboard },
    { label: "5-Min MCQ Blitz", href: "/student/practice", icon: Target },
    { label: "Step Numericals & OCR", href: "/student/numericals", icon: BookOpen },
    { label: "Dual Study Cards", href: "/student/dual-cards", icon: Award },
    { label: "15-Mark Lab Arena", href: "/student/labs", icon: FlaskConical },
    { label: "Board Radar (Cyclical)", href: "/student/radar", icon: Flame },
    { label: "Socratic AI Ustad", href: "/student/ustad", icon: MessageSquareHeart },
  ];

  const teacherLinks = [
    { label: "Class Overview", href: "/teacher", icon: LayoutDashboard },
    { label: "60s Exam Generator", href: "/teacher/generator", icon: FileText },
    { label: "Doubt Escalations", href: "/teacher/doubts", icon: MessageSquareHeart },
    { label: "Class Weakness Heatmap", href: "/teacher/heatmap", icon: BarChart3 },
    { label: "Teacher Gold Notes", href: "/teacher/gold-notes", icon: Award },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <aside className="no-print hidden md:flex flex-col w-64 bg-[#0B1120] border-r border-slate-800/80 p-4 shrink-0 h-[calc(100vh-45px)] sticky top-[45px] overflow-y-auto">
      {/* User Mini Profile Card */}
      <div className="bg-[#10192D] border border-slate-800 rounded-xl p-3 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-emerald flex items-center justify-center font-bold text-white shadow-inner text-sm">
            {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : "NA"}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-100 truncate">{user?.full_name}</h4>
            <p className="text-[11px] text-slate-400 capitalize">
              {user?.role === "teacher" ? "Faculty" : `Class ${user?.class_grade || 10} • ${user?.section || 'A'}`}
            </p>
            <p className="text-[10px] text-brand-emerald font-semibold">
              {user?.campus} Campus ({user?.board || "BSEK"})
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="space-y-1 flex-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          {isTeacher ? "Teacher Co-Pilot" : "Student Command"}
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-brand-emerald/15 text-brand-emerald font-bold border-l-2 border-brand-emerald shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-emerald" : "text-slate-400"}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Board Badge */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-brand-amber" />
          <span>BSEK & AKU-EB</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">v1.0</span>
      </div>
    </aside>
  );
}
