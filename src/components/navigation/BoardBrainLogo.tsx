"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: "full" | "icon" | "horizontal";
}

export default function BoardBrainLogo({
  className = "",
  size = 40,
  showText = true,
  variant = "horizontal",
}: LogoProps) {
  if (variant === "full") {
    return (
      <div className={`inline-flex flex-col items-center text-center ${className}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-cyan-950/30 bg-white p-2">
          <Image
            src="/boardbrain-logo.png"
            alt="BoardBrain — Your Board Exam AI Guru"
            width={size * 4}
            height={size * 4}
            className="w-auto h-auto object-contain max-w-full"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Emblem Icon */}
      <div
        className="relative shrink-0 rounded-xl overflow-hidden shadow-md shadow-cyan-950/40 bg-white p-1 border border-slate-700/60 flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/boardbrain-icon.png"
          alt="BoardBrain Emblem"
          width={size * 2}
          height={size * 2}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg md:text-xl tracking-tight leading-none text-white">
              <span className="text-[#1E3A8A] font-extrabold text-white">Board</span>
              <span className="text-[#0EA5E9] font-black">Brain</span>
            </span>
            <span className="text-slate-500 text-xs font-light">•</span>
            <span
              className="text-amber-400 font-nastaliq text-base md:text-lg leading-none"
              dir="rtl"
            >
              بورڈ برین
            </span>
          </div>
          <p className="text-[10px] md:text-[11px] font-bold text-sky-400 tracking-wider uppercase mt-0.5 flex items-center gap-1">
            <span>🎯 YOUR BOARD EXAM AI GURU</span>
          </p>
        </div>
      )}
    </div>
  );
}
