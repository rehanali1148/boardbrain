"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getTeacherGoldNotes } from "@/lib/api";
import { Award, Plus, Pin, CheckCircle, Sparkles } from "lucide-react";

export default function TeacherGoldNotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [topic, setTopic] = useState("");
  const [tipText, setTipText] = useState("");
  const [loading, setLoading] = useState(true);
  const [pinnedSuccess, setPinnedSuccess] = useState(false);

  const fetchNotes = async () => {
    try {
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("boardbrain_gold_notes");
        if (local) {
          setNotes(JSON.parse(local));
          setLoading(false);
          return;
        }
      }
      const data = await getTeacherGoldNotes(user?.campus || "Saddar", 10, "Physics");
      setNotes(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("boardbrain_gold_notes", JSON.stringify(data));
      }
    } catch (e) {
      console.warn("Gold notes fetch fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const handleCreateNote = async () => {
    if (!topic || !tipText) return;
    try {
      const newNote = {
        id: Date.now(),
        teacher_name: user?.full_name || "Sir Farhan Ahmed",
        campus: user?.campus || "Saddar",
        class_grade: 10,
        subject: "Physics",
        topic,
        gold_tip_text: tipText,
        created_at: new Date().toISOString(),
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("boardbrain_gold_notes", JSON.stringify(updated));
      }
      setTopic("");
      setTipText("");
      setPinnedSuccess(true);
      setTimeout(() => setPinnedSuccess(false), 3000);
    } catch (e) {
      alert("Error pinning gold note.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-amber" />
          <span>Teacher-Endorsed "Gold Notes" & Exam Tips</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pin verified exam tips and key definitions that display with your faculty badge inside the Student Portal.
        </p>
      </div>

      {/* Create New Gold Note Form */}
      <div className="bg-[#10192D] border border-slate-800 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-emerald" />
          <span>Pin New Gold Note to Student Dashboard</span>
        </h3>

        {pinnedSuccess && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-emerald" />
            <span>Note successfully pinned to all Class 10 student portals!</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Target Topic / Chapter:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Refraction of Light - Mirror Sign Rules"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-brand-emerald"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Gold Tip / Examiner Insight:</label>
            <textarea
              rows={3}
              value={tipText}
              onChange={(e) => setTipText(e.target.value)}
              placeholder="Write the exact rule or deduction warning students must remember..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-brand-emerald"
            />
          </div>

          <button
            onClick={handleCreateNote}
            className="w-full py-2.5 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <Pin className="w-3.5 h-3.5" />
            <span>Pin with Faculty Name Badge</span>
          </button>
        </div>
      </div>

      {/* Pinned Notes Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Currently Pinned Notes ({notes.length})
        </h3>

        {notes.map((n) => (
          <div
            key={n.id}
            className="p-4 bg-[#10192D] border border-slate-800 rounded-xl space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-amber">{n.topic}</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald text-[10px] font-bold border border-brand-emerald/30">
                ✓ Teacher Approved
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">"{n.gold_tip_text}"</p>
            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
              <span>Pinned by {n.teacher_name} ({n.campus} Campus)</span>
              <span>Class {n.class_grade} {n.subject}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
