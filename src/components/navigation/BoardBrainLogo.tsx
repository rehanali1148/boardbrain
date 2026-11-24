import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: "full" | "icon" | "stacked";
}

export default function BoardBrainLogo({
  className = "",
  size = 40,
  showText = true,
  variant = "full",
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Scalable Vector Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-emerald-950/40"
        style={{ width: size, height: size }}
      >
        {/* Background gradient container */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Rounded Shield / Capsule */}
          <rect
            width="100"
            height="100"
            rx="22"
            fill="url(#bg-gradient)"
          />
          <rect
            x="1.5"
            y="1.5"
            width="97"
            height="97"
            rx="20.5"
            stroke="url(#border-gradient)"
            strokeWidth="3"
            strokeOpacity="0.8"
          />

          {/* Background Ambient Glow */}
          <circle cx="50" cy="50" r="32" fill="#10B981" fillOpacity="0.18" />

          {/* Stylized Open Book Foundation (Board Exam Base) */}
          <path
            d="M 24 68 C 36 63 46 66 50 71 C 54 66 64 63 76 68 L 76 60 C 64 55 54 58 50 63 C 46 58 36 55 24 60 Z"
            fill="url(#gold-gradient)"
          />

          {/* Neural Brain Hemispheres (Left & Right) */}
          {/* Left Brain Hemisphere (Logic & Concepts) */}
          <path
            d="M 47 28 C 38 27 30 33 30 42 C 30 47 33 50 35 53 C 38 56 42 58 47 59"
            stroke="url(#emerald-gradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 38 35 C 42 38 44 43 47 45"
            stroke="#34D399"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="30" cy="42" r="3" fill="#10B981" />
          <circle cx="38" cy="35" r="2.5" fill="#F59E0B" />

          {/* Right Brain Hemisphere (Creativity & Memory) */}
          <path
            d="M 53 28 C 62 27 70 33 70 42 C 70 47 67 50 65 53 C 62 56 58 58 53 59"
            stroke="url(#emerald-gradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 62 35 C 58 38 56 43 53 45"
            stroke="#34D399"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="70" cy="42" r="3" fill="#10B981" />
          <circle cx="62" cy="35" r="2.5" fill="#F59E0B" />

          {/* Central AI Nucleus & Board Distinction Star */}
          <path
            d="M 50 20 L 52.5 25.5 L 58 27 L 53.5 31 L 54.5 36.5 L 50 33.5 L 45.5 36.5 L 46.5 31 L 42 27 L 47.5 25.5 Z"
            fill="#FBBF24"
          />

          {/* Neural Synapse Dots */}
          <circle cx="50" cy="48" r="3.5" fill="#38BDF8" />
          <circle cx="50" cy="20" r="1.5" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="bg-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B132B" />
              <stop offset="1" stopColor="#06121E" />
            </linearGradient>
            <linearGradient id="border-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="emerald-gradient" x1="20" y1="20" x2="80" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gold-gradient" x1="24" y1="60" x2="76" y2="71" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg md:text-xl text-white tracking-tight leading-none">
              Board<span className="text-brand-emerald">Brain</span>
            </span>
            <span className="text-slate-500 text-xs font-light">•</span>
            <span
              className="text-brand-amber font-nastaliq text-base md:text-lg leading-none"
              dir="rtl"
            >
              بورڈ برین
            </span>
          </div>
          <p className="text-[10px] md:text-[11px] font-semibold text-brand-emerald/90 tracking-wide mt-0.5">
            🎯 Your Board Exam AI Coach (AI Ustad)
          </p>
        </div>
      )}
    </div>
  );
}
