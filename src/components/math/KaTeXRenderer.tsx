"use client";

import React, { useEffect, useRef } from "react";
import katex from "katex";

interface KaTeXRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export default function KaTeXRenderer({ math, block = false, className = "" }: KaTeXRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        // Clean raw delimiters if present
        let cleanMath = math.trim();
        if (cleanMath.startsWith("$$") && cleanMath.endsWith("$$")) {
          cleanMath = cleanMath.slice(2, -2);
        } else if (cleanMath.startsWith("$") && cleanMath.endsWith("$")) {
          cleanMath = cleanMath.slice(1, -1);
        } else if (cleanMath.startsWith("\\(") && cleanMath.endsWith("\\)")) {
          cleanMath = cleanMath.slice(2, -2);
        }

        katex.render(cleanMath, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.innerText = math;
        }
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className={`inline-block ${className}`} />;
}
