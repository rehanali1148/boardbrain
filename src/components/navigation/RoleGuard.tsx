"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/authContext";

/**
 * Keeps students out of /teacher/* pages. The server also refuses teacher API calls from a student token,
 * so this is the visible half of the check, not the only one.
 */
export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const { roleKey, isReady } = useAuth();
  const isStaff = roleKey === "teacher" || roleKey === "campus_head";

  if (!pathname.startsWith("/teacher")) return <>{children}</>;

  if (!isReady) {
    return <div className="p-8 text-center text-xs text-slate-400">Checking your access...</div>;
  }

  if (!isStaff) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#10192D] border border-rose-800/60 rounded-2xl text-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-brand-rose mx-auto" />
        <h1 className="text-base font-bold text-white">Teachers only</h1>
        <p className="text-xs text-slate-300">
          This page is for teachers and campus heads. You are signed in as a student.
        </p>
        <p className="font-nastaliq text-sm text-slate-400" dir="rtl">
          یہ صفحہ صرف اساتذہ کے لیے ہے۔
        </p>
        <Link
          href="/student"
          className="inline-block px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 text-xs font-bold"
        >
          Go to my student dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
