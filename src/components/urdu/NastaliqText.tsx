"use client";

import React from "react";

interface NastaliqTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function NastaliqText({ children, className = "" }: NastaliqTextProps) {
  if (!children) return null;
  return (
    <div
      dir="rtl"
      className={`font-nastaliq text-right text-base leading-loose text-slate-300 ${className}`}
      style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}
    >
      {children}
    </div>
  );
}
