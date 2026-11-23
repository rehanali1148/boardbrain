"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "teacher" || user?.role === "campus_head") {
      router.replace("/teacher");
    } else {
      router.replace("/student");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Entering BoardRadar Academic Command Center...</p>
      </div>
    </div>
  );
}
