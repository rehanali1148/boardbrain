"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getTeacherDoubts, replyDoubt } from "@/lib/api";
import {
  MessageSquareHeart,
  Send,
  CheckCircle,
  Clock,
  User,
  Sparkles,
  HelpCircle
} from "lucide-react";

export default function DoubtInboxPage() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const fetchDoubts = async () => {
    try {
      const data = await getTeacherDoubts(user?.campus || "Saddar", 10, "A");
      setDoubts(data);
    } catch (e) {
      console.warn("Doubts fetch fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [user]);

  const handleReply = async (doubtId: number) => {
    const text = replyTextMap[doubtId];
    if (!text || !text.trim()) return;

    setSubmittingId(doubtId);
    try {
      await replyDoubt(doubtId, text);
      await fetchDoubts();
      setReplyTextMap((prev) => ({ ...prev, [doubtId]: "" }));
    } catch (e) {
      alert("Error sending teacher reply. Check connection.");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-brand-amber" />
            <span>Student Doubt Escalation Queue (Saddar Campus)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Doubts escalated after 3 unsuccessful Socratic AI hints. Review and answer in 5 minutes before class.
          </p>
        </div>
        <span className="text-xs bg-brand-amber/15 text-brand-amber font-bold px-3 py-1 rounded-full border border-brand-amber/30">
          {doubts.filter((d) => d.status === "pending").length} Unresolved
        </span>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading Section Doubts...</div>
        ) : doubts.length === 0 ? (
          <div className="p-8 bg-[#10192D] border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            ✓ No pending doubt tickets. Your section is clear!
          </div>
        ) : (
          doubts.map((d) => (
            <div
              key={d.id}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                d.status === "answered"
                  ? "bg-slate-900/40 border-slate-800/60 opacity-80"
                  : "bg-[#10192D] border-slate-800 hover:border-slate-700 shadow-md"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-indigo/20 text-brand-indigo flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{d.student_name}</h4>
                    <span className="text-[10px] text-slate-400">
                      Class {d.class_grade} • Section {d.section} • {d.campus} Campus
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-brand-amber bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                    {d.subject} • {d.topic}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.status === "answered"
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-rose-950 text-rose-400"
                    }`}
                  >
                    {d.status === "answered" ? "✓ Answered" : "⏳ Pending"}
                  </span>
                </div>
              </div>

              {/* Student Attempt Summary */}
              <div className="space-y-1 text-xs">
                <p className="text-slate-400 font-semibold">Student Attempted Step:</p>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-[11px] border border-slate-800">
                  {d.student_attempt_summary}
                </div>
              </div>

              {/* Detected Misconception */}
              <div className="text-xs space-y-0.5">
                <span className="text-brand-rose font-semibold">AI Compressed Misconception:</span>
                <p className="text-slate-300 italic">{d.misconception}</p>
              </div>

              {/* Existing Teacher Reply or Reply Input */}
              {d.status === "answered" ? (
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-brand-emerald">Your Delivered Teacher Explanation:</span>
                  <p className="text-emerald-200">{d.teacher_reply}</p>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300">Reply to {d.student_name}:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyTextMap[d.id] || ""}
                      onChange={(e) => setReplyTextMap({ ...replyTextMap, [d.id]: e.target.value })}
                      placeholder="Write concise explanation or board tip..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-amber"
                    />
                    <button
                      onClick={() => handleReply(d.id)}
                      disabled={submittingId === d.id}
                      className="px-4 py-2 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingId === d.id ? "Sending..." : "Send"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
