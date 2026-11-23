"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { LayoutDashboard, Target, FlaskConical, MessageSquareHeart, FileText, BarChart3 } from "lucide-react";

export default function MobileDock() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "campus_head";

  const studentTabs = [
    { label: "Today", href: "/student", icon: LayoutDashboard },
    { label: "Practice", href: "/student/practice", icon: Target },
    { label: "Labs", href: "/student/labs", icon: FlaskConical },
    { label: "AI Ustad", href: "/student/ustad", icon: MessageSquareHeart },
  ];

  const teacherTabs = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Exam Gen", href: "/teacher/generator", icon: FileText },
    { label: "Doubts", href: "/teacher/doubts", icon: MessageSquareHeart },
    { label: "Heatmap", href: "/teacher/heatmap", icon: BarChart3 },
  ];

  const tabs = isTeacher ? teacherTabs : studentTabs;

  return (
    <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? "text-brand-emerald font-semibold scale-105"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-brand-emerald stroke-[2.5]" : "stroke-2"}`} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
