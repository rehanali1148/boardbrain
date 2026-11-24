"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { escalateDoubt } from "@/lib/api";
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  HelpCircle,
  Mic,
  Share2,
  CheckCircle2
} from "lucide-react";

interface Message {
  role: "user" | "ustad";
  text: string;
}

export default function SocraticUstadPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ustad",
      text: "Assalam-o-Alaikum! Main aap ka AI Ustad hoon — BoardBrain ka Socratic Exam Coach. Board exam ya numericals mein koi bhi mushkil ho, bina jhijhak poochein. Hum step-by-step solve karein ge.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [escalateMessage, setEscalateMessage] = useState("");

  const STARTER_CHIPS = [
    "Sir concave mirror mein focal length kab negative hoti hai?",
    "Titration mein rough reading kyun discard karte hain?",
    "Pendulum ka mass triple karne se time period par kya farq parta hai?",
    "Ohm's law mein temperature constant rakhna kyun zaroori hai?",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsgs: Message[] = [...messages, { role: "user", text }];
    setMessages(newMsgs);
    setInputText("");

    // Socratic response logic
    setTimeout(() => {
      let reply = "Bohat acha sawal. Board ka rule simple hai: ";
      if (text.toLowerCase().includes("concave") || text.toLowerCase().includes("mirror")) {
        reply +=
          "Concave mirror ka focus mirror ke samnay (real) hota hai, is liye is ki focal length f hamesha POSITIVE hoti hai. Convex mirror ka focus mirror ke peeche (virtual) hota hai, is liye wahan f NEGATIVE hoti hai. Ab aap batao: agar image mirror ke peeche bane to q ka sign kya hoga?";
      } else if (text.toLowerCase().includes("titration") || text.toLowerCase().includes("rough")) {
        reply +=
          "Titration mein rough reading sirf approximate endpoint range check karne ke liye hoti hai (jaise 10.4 ml). Board examiners sirf un consecutive readings ka average maante hain jo 0.1 ml se zyada differ na karein (concordant readings).";
      } else if (text.toLowerCase().includes("pendulum") || text.toLowerCase().includes("mass")) {
        reply +=
          "Yeh Section B ka classic trick question hai! Formula yaad karein: T = 2π√(L/g). Is formula mein mass 'm' kahin maujood hi nahi hai! Yani time period bob ke mass se bilkul independent hota hai. Agar mass triple ho jaye, to T par ZERO effect hoga.";
      } else {
        reply +=
          "Is concept mein sab se ahem cheez definition aur SI units hain. Kya aap ne is problem mein Given Data alag se likh liya hai?";
      }

      setMessages([...newMsgs, { role: "ustad", text: reply }]);
    }, 800);
  };

  const handleEscalateToTeacher = async () => {
    try {
      const res = await escalateDoubt(
        "Physics",
        "Refraction & Mirrors",
        "Student asked about concave mirror sign rules and struggled with virtual image distance sign.",
        "Confusing image behind mirror with real image in front of mirror."
      );
      setEscalated(true);
      setEscalateMessage(res.message);
    } catch (e) {
      alert("Error escalating doubt. Check backend connection.");
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Title */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-brand-emerald" />
            <span>Socratic AI Ustad (Your Board Exam Coach)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Ask in Roman Urdu or English. Guided step-by-step without giving away answers immediately.
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
              <span>Still Stuck? Ask My Teacher</span>
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

      {/* Pre-scoped Starter Chips (Never Blank Screen) */}
      <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none shrink-0">
        {STARTER_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-brand-emerald text-[11px] text-slate-300 whitespace-nowrap transition-all shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#10192D] border border-slate-800 rounded-2xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs md:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-emerald text-slate-950 font-medium rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask in Roman Urdu or English (e.g. 'Sir convex mirror ka f kab negative hoga?')..."
          className="flex-1 bg-[#10192D] border border-slate-700 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-200 outline-none focus:border-brand-emerald"
        />
        <button
          onClick={() => handleSend()}
          className="w-10 h-10 rounded-xl bg-brand-emerald text-slate-950 flex items-center justify-center font-bold hover:bg-emerald-400 transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
