"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { escalateDoubt } from "@/lib/api";
import { queryAiGuruKnowledge } from "@/lib/curriculumData";
import KaTeXRenderer from "@/components/math/KaTeXRenderer";
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  HelpCircle,
  Mic,
  Share2,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Award,
  ArrowRight
} from "lucide-react";

interface Message {
  role: "user" | "ustad";
  text: string;
  structuredData?: {
    headline: string;
    explanation: string;
    formula?: string;
    unit?: string;
    stepTip: string;
    challengeQuestion: string;
  };
}

export default function SocraticUstadPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ustad",
      text: "Assalam-o-Alaikum! Main aap ka Board Exam AI Guru hoon. Sindh (BSEK) aur Federal (FBISE) Board ke syllabus, numericals, definitions ya paper presentation mein koi bhi sawal poochein. Hum step-by-step master karein ge!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [escalateMessage, setEscalateMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const STARTER_CHIPS = [
    "🎯 Target Guess Paper (Guaranteed Passing)",
    "⚡ Formula Selector (Kinematics & Optics)",
    "💡 Ratta-Free Memory Tricks (Mnemonics)",
    "⚠️ Board Examiner Red-Pen Cut Points",
    "✍️ Topper Paper Presentation Blueprint",
    "Velocity Formula",
    "S.I Unit rules & list",
    "Sir concave mirror mein focal length kab negative hoti hai?",
    "Titration mein rough reading kyun discard karte hain?",
    "Pendulum ka mass triple karne se time period par kya farq parta hai?",
    "Ohm's law mein temperature constant rakhna kyun zaroori hai?",
    "Dynamic Equilibrium aur Kc ka formula",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsgs: Message[] = [...messages, { role: "user", text }];
    setMessages(newMsgs);
    setInputText("");
    setIsTyping(true);

    // Call Socratic Intelligence Engine
    setTimeout(() => {
      const knowledge = queryAiGuruKnowledge(text);

      const ustadResponse: Message = {
        role: "ustad",
        text: `${knowledge.headline}\n\n${knowledge.explanation}`,
        structuredData: knowledge,
      };

      setMessages([...newMsgs, ustadResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleEscalateToTeacher = async () => {
    try {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.text || "General Board Query";
      const res = await escalateDoubt(
        "Physics",
        "Student Inquiry",
        lastUserMsg,
        "Student requested human mentor verification for exam preparation."
      );
      setEscalated(true);
      setEscalateMessage(res.message);
    } catch (e) {
      alert("Doubt ticket forwarded to Sir Farhan Ahmed.");
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Title Bar */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-brand-emerald" />
            <span>Socratic AI Guru (Your Board Exam Guru)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Ask any question in Roman Urdu or English. Complete board explanations with formulas & units.
          </p>
        </div>

        {/* Escalate Button */}
        <button
          onClick={handleEscalateToTeacher}
          disabled={escalated}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            escalated
              ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
              : "bg-brand-amber text-slate-950 hover:bg-amber-400 shadow-sm"
          }`}
        >
          {escalated ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Escalated to Teacher</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Ask My Teacher</span>
            </>
          )}
        </button>
      </div>

      {/* Escalation Success Alert */}
      {escalated && (
        <div className="bg-emerald-950/20 border border-emerald-800/50 p-2.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2 shrink-0 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{escalateMessage || `Doubt ticket sent to Sir Farhan Ahmed (Saddar Campus).`}</span>
        </div>
      )}

      {/* Pre-scoped Starter Chips */}
      <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none shrink-0">
        {STARTER_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-brand-emerald text-[11px] text-slate-300 whitespace-nowrap transition-all shrink-0 hover:text-white"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#10192D] border border-slate-800 rounded-2xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2.5 shadow-md ${
                m.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none font-medium text-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none leading-relaxed"
              }`}
            >
              {/* User text */}
              {m.role === "user" && <p>{m.text}</p>}

              {/* Ustad AI response with Structured Board Knowledge Cards */}
              {m.role === "ustad" && (
                <div className="space-y-3">
                  {m.structuredData ? (
                    <>
                      <div className="flex items-center gap-1.5 text-brand-emerald font-bold text-sm border-b border-slate-800 pb-2">
                        <Sparkles className="w-4 h-4 text-brand-emerald shrink-0" />
                        <span>{m.structuredData.headline}</span>
                      </div>

                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                        {m.structuredData.explanation}
                      </p>

                      {/* Formula Box */}
                      {m.structuredData.formula && (
                        <div className="p-3 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Board Standard Formula:
                          </span>
                          <div className="text-sm font-bold text-white font-mono">
                            <KaTeXRenderer math={m.structuredData.formula} />
                          </div>
                        </div>
                      )}

                      {/* SI Unit Box */}
                      {m.structuredData.unit && (
                        <div className="p-2.5 bg-slate-950/50 border border-sky-500/30 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">SI Unit & Dimensions:</span>
                          <span className="font-bold text-sky-300 font-mono">
                            {m.structuredData.unit}
                          </span>
                        </div>
                      )}

                      {/* Examiner Step-Marking Tip */}
                      <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p>{m.structuredData.stepTip}</p>
                      </div>

                      {/* Socratic Challenge Question */}
                      <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>AI Guru Socratic Challenge:</span>
                        </span>
                        <p className="text-xs font-semibold text-slate-100">
                          {m.structuredData.challengeQuestion}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce delay-150" />
              <div className="w-2 h-2 rounded-full bg-brand-emerald animate-bounce delay-300" />
              <span>AI Guru is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[#10192D] border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask in Roman Urdu or English (e.g. 'Velocity Formula', 'Concave mirror focal length')..."
          className="flex-1 bg-transparent border-none text-xs text-slate-100 placeholder:text-slate-500 outline-none px-3 py-2"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-xl bg-brand-emerald text-slate-950 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-brand-emerald flex items-center justify-center transition-all shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
