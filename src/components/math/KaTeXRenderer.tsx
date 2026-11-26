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
    if (!containerRef.current || !math) return;

    // Check if the string actually contains LaTeX math syntax
    // e.g., formulas with $, \(, \frac, \sqrt, _, ^, \times, \pi, =, \pm
    const hasMathDelimiters =
      math.includes("$") ||
      math.includes("\\(") ||
      math.includes("\\[") ||
      math.includes("\\frac") ||
      math.includes("\\sqrt") ||
      math.includes("\\times") ||
      math.includes("^{") ||
      math.includes("_{");

    // If it's plain text without math syntax, render as normal text to preserve spaces
    if (!hasMathDelimiters) {
      containerRef.current.innerText = math;
      return;
    }

    try {
      // If the string contains $math$ mixed with normal text, parse parts
      if (math.includes("$")) {
        const parts = math.split(/(\$[^$]+\$)/g);
        containerRef.current.innerHTML = "";

        parts.forEach((part) => {
          if (part.startsWith("$") && part.endsWith("$")) {
            const mathContent = part.slice(1, -1);
            const span = document.createElement("span");
            katex.render(mathContent, span, {
              displayMode: false,
              throwOnError: false,
            });
            containerRef.current?.appendChild(span);
          } else if (part) {
            const textNode = document.createTextNode(part);
            containerRef.current?.appendChild(textNode);
          }
        });
        return;
      }

      // If it's purely a math expression
      let cleanMath = math.trim();
      if (cleanMath.startsWith("\\(") && cleanMath.endsWith("\\)")) {
        cleanMath = cleanMath.slice(2, -2);
      } else if (cleanMath.startsWith("\\[") && cleanMath.endsWith("\\]")) {
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
  }, [math, block]);

  return <span ref={containerRef} className={`inline-block ${className}`} />;
}
