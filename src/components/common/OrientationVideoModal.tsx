"use client";

import React, { useEffect, useRef } from "react";
import { X, Play, Sparkles, Volume2 } from "lucide-react";

interface OrientationVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
  subtitle: string;
  theme?: "teacher" | "student";
}

export default function OrientationVideoModal({
  isOpen,
  onClose,
  videoSrc,
  title,
  subtitle,
  theme = "student",
}: OrientationVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Attempt auto-play when opened
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            console.log("Autoplay blocked by browser policy, user can click play.");
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isTeacher = theme === "teacher";
  const accentBorder = isTeacher ? "border-amber-500/50" : "border-sky-500/50";
  const accentGlow = isTeacher ? "shadow-amber-500/20" : "shadow-sky-500/20";
  const badgeBg = isTeacher ? "bg-amber-500/20 text-brand-amber border-amber-500/40" : "bg-sky-500/20 text-brand-sky border-sky-500/40";
  const btnBg = isTeacher ? "bg-gradient-to-r from-brand-amber to-brand-emerald text-slate-950" : "bg-gradient-to-r from-sky-500 to-brand-emerald text-slate-950";

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl bg-[#0B1222] border ${accentBorder} rounded-2xl shadow-2xl ${accentGlow} overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F172A] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg border ${badgeBg}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{title}</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Close Video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            playsInline
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#0F172A] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>اردو وائس اوور کے ساتھ مکمل گائیڈ • آواز آن کر کے دیکھیں</span>
          </div>

          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 ${btnBg}`}
          >
            <span>سمجھ گئے! پلیٹ فارم شروع کریں</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
