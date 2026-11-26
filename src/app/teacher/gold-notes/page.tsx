"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getTeacherGoldNotes, pinGoldNote } from "@/lib/api";
import { Award, Plus, Pin, CheckCircle } from "lucide-react";

export default function TeacherGoldNotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [topic, setTopic] = useState("");
  const [tipText, setTipText] = useState("");
  const [classGrade, setClassGrade] = useState(10);
  const [loading, setLoading] = useState(true);
  const [pinning, setPinning] = useState(false);
  const [pinnedSuccess, setPinnedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const subject = user?.subject || "Physics";

  const fetchNotes = async () => {
    try {
      setLoadError(false);
      const data = await getTeacherGoldNotes(user?.campus || "Saddar", classGrade, subject);
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("Gold notes fetch failed:", e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "teacher" && user?.role !== "campus_head") return;
    // Notes used to live only in this browser; clear that old copy so it can't hide server data.
    try {
      localStorage.removeItem("boardbrain_gold_notes");
    } catch {
      /* storage blocked */
    }
    fetchNotes();
  }, [user]);

  const handleCreateNote = async () => {
    if (!topic.trim() || !tipText.trim()) {
      setFormError("Please fill in both the topic and the tip.");
      return;
    }
    setFormError(null);
    setPinning(true);
    try {
      await pinGoldNote({
        topic: topic.trim(),
        gold_tip_text: tipText.trim(),
        subject,
        class_grade: classGrade,
        teacher_name: user?.full_name || "Teacher",
        campus: user?.campus || "Saddar",
      });
      setTopic("");
      setTipText("");
      setPinnedSuccess(true);
      setTimeout(() => setPinnedSuccess(false), 3000);
      await fetchNotes();
    } catch (e) {
      setFormError("The note could not be pinned. Check your connection and try again.");
    } finally {
      setPinning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-amber" />
          <span>Teacher Gold Notes</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pin exam tips and key definitions. Students of that class see them on their Today page with your name.
        </p>
      </div>

      <div className="bg-[#10192D] border border-slate-800 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-emerald" />
          <span>Pin a new note</span>
        </h3>

        {pinnedSuccess && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-emerald" />
            <span>Note pinned for Class {classGrade} {subject} students.</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Class:</label>
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              <option value={10}>Class 10</option>
              <option value={9}>Class 9</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Topic / chapter:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Geometrical Optics - mirror sign rules"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-brand-emerald"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Tip:</label>
            <textarea
              rows={3}
              value={tipText}
              onChange={(e) => setTipText(e.target.value)}
              placeholder="Write the exact rule or warning students must remember..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-brand-emerald"
            />
          </div>

          {formError && <p className="text-[11px] text-rose-300">{formError}</p>}

          <button
            onClick={handleCreateNote}
            disabled={pinning}
            className="w-full py-2.5 rounded-xl bg-brand-amber text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{pinning ? "Pinning..." : "Pin with my name"}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Pinned notes ({notes.length})
        </h3>
        {loadError && (
          <p className="text-xs text-rose-300">Notes could not be loaded. Check your connection and reload the page.</p>
        )}
        {!loading && !loadError && notes.length === 0 && <p className="text-xs text-slate-400">No notes pinned yet.</p>}

        {notes.map((n) => (
          <div key={n.id} className="p-4 bg-[#10192D] border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-amber">{n.topic}</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-emerald/15 text-brand-emerald text-[10px] font-bold border border-brand-emerald/30">
                Class {n.class_grade} {n.subject}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">&quot;{n.gold_tip_text}&quot;</p>
            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
              Pinned by {n.teacher_name} ({n.campus} Campus)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
