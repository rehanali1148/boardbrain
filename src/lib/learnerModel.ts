"use client";

/**
 * BoardBrain learner model: "reads the student's mind" from how they answer.
 *
 * Every MCQ answer is stored with how long the student took. Speed + correctness tell us *why* they got it wrong:
 *   fast & wrong  -> confident misconception (they think they know)   -> fix the idea
 *   slow & wrong  -> knowledge gap (they don't know it yet)          -> teach it
 *   slow & right  -> shaky (got there, but not fluent)               -> practise more
 *   fast & right  -> mastered                                         -> move on
 *
 * Everything lives in this browser's localStorage, one store per student, so no student ever sees another's data.
 */

export interface AttemptRecord {
  qid: string;
  subject: string;
  grade: number;
  chapter: string;
  text: string;
  chosen: string;
  correct: string;
  isCorrect: boolean;
  ms: number;
  trap?: string;
  at: number;
  source: "bank" | "ai";
}

export interface VaultItem {
  id: string;
  question_id: string;
  subject: string;
  chapter_name: string;
  text_en: string;
  user_answer: string;
  correct_option: string;
  examiner_trap: string;
  missed_at: string;
  retry_at: number;
  hours_left: number;
}

interface Store {
  v: 1;
  attempts: AttemptRecord[];
  vault: VaultItem[];
  guruTopics: { text: string; at: number }[];
  activeDays: string[];
}

const EMPTY: Store = { v: 1, attempts: [], vault: [], guruTopics: [], activeDays: [] };
const FAST_MS = 20000; // under 20 s for an MCQ counts as "fast"

function keyFor(studentKey: string) {
  return `bb_learner_${studentKey || "anon"}`;
}

export function currentStudentKey(): string {
  try {
    return localStorage.getItem("boardbrain_role") || "student_10";
  } catch {
    return "student_10";
  }
}

function load(studentKey = currentStudentKey()): Store {
  try {
    const raw = localStorage.getItem(keyFor(studentKey));
    if (!raw) return { ...EMPTY, attempts: [], vault: [], guruTopics: [], activeDays: [] };
    const s = JSON.parse(raw);
    return { ...EMPTY, ...s };
  } catch {
    return { ...EMPTY, attempts: [], vault: [], guruTopics: [], activeDays: [] };
  }
}

function save(s: Store, studentKey = currentStudentKey()) {
  try {
    // Keep storage small: last 400 attempts, 60 vault items, 40 guru topics, 120 days
    s.attempts = s.attempts.slice(-400);
    s.vault = s.vault.slice(-60);
    s.guruTopics = s.guruTopics.slice(-40);
    s.activeDays = s.activeDays.slice(-120);
    localStorage.setItem(keyFor(studentKey), JSON.stringify(s));
  } catch {
    /* storage full or blocked: the app still works, it just won't remember */
  }
}

function markActive(s: Store) {
  const d = new Date().toISOString().slice(0, 10);
  if (!s.activeDays.includes(d)) s.activeDays.push(d);
}

export function recordAttempts(list: Omit<AttemptRecord, "at">[]) {
  const s = load();
  const now = Date.now();
  list.forEach((a) => {
    s.attempts.push({ ...a, at: now });
    if (!a.isCorrect && a.chosen !== "NONE") {
      s.vault = s.vault.filter((v) => v.question_id !== a.qid);
      s.vault.push({
        id: `${a.qid}-${now}`,
        question_id: a.qid,
        subject: a.subject,
        chapter_name: a.chapter,
        text_en: a.text,
        user_answer: a.chosen,
        correct_option: a.correct,
        examiner_trap: a.trap || "Review this concept in your textbook, then try again.",
        missed_at: new Date(now).toISOString(),
        retry_at: now + 48 * 3600 * 1000,
        hours_left: 48,
      });
    }
    if (a.isCorrect) {
      // Answering a vault question correctly clears it
      s.vault = s.vault.filter((v) => !(v.question_id === a.qid && Date.now() >= v.retry_at));
    }
  });
  markActive(s);
  save(s);
}

export function getVault(): VaultItem[] {
  const s = load();
  const now = Date.now();
  return s.vault
    .map((v) => ({ ...v, hours_left: Math.max(0, Math.ceil((v.retry_at - now) / 3600000)) }))
    .reverse();
}

export function clearVaultItem(qid: string) {
  const s = load();
  s.vault = s.vault.filter((v) => v.question_id !== qid);
  save(s);
}

export function recordGuruQuestion(text: string) {
  const s = load();
  s.guruTopics.push({ text: text.slice(0, 200), at: Date.now() });
  markActive(s);
  save(s);
}

export interface ChapterInsight {
  subject: string;
  chapter: string;
  attempts: number;
  correct: number;
  accuracy: number;
  fastWrong: number;
  slowWrong: number;
  slowRight: number;
  fastRight: number;
  state: "mastered" | "shaky" | "misconception" | "gap" | "new";
}

export interface LearnerInsights {
  totalAttempts: number;
  accuracy: number;
  streakDays: number;
  activeDays: number;
  chapters: ChapterInsight[];
  weakest?: ChapterInsight;
  strongest?: ChapterInsight;
  misconceptions: string[];
  headline: string;
  headlineUr: string;
  nextAction: string;
  enoughData: boolean;
  recentGuruTopics: string[];
}

function streak(days: string[]): number {
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  // Count back from today (or yesterday if not active yet today)
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function getInsights(studentKey = currentStudentKey()): LearnerInsights {
  const s = load(studentKey);
  const byCh = new Map<string, ChapterInsight>();
  s.attempts.forEach((a) => {
    if (a.chosen === "NONE") return;
    const k = `${a.subject}|${a.chapter}`;
    const c =
      byCh.get(k) ||
      { subject: a.subject, chapter: a.chapter, attempts: 0, correct: 0, accuracy: 0, fastWrong: 0, slowWrong: 0, slowRight: 0, fastRight: 0, state: "new" as const };
    c.attempts++;
    const fast = a.ms > 0 && a.ms < FAST_MS;
    if (a.isCorrect) {
      c.correct++;
      fast ? c.fastRight++ : c.slowRight++;
    } else {
      fast ? c.fastWrong++ : c.slowWrong++;
    }
    byCh.set(k, c);
  });

  const chapters = Array.from(byCh.values()).map((c) => {
    c.accuracy = c.attempts ? Math.round((c.correct / c.attempts) * 100) : 0;
    if (c.attempts < 2) c.state = "new";
    else if (c.accuracy >= 80 && c.fastRight >= c.slowRight) c.state = "mastered";
    else if (c.fastWrong > c.slowWrong && c.accuracy < 70) c.state = "misconception";
    else if (c.accuracy < 50) c.state = "gap";
    else c.state = "shaky";
    return c;
  });

  // A chapter is "needs work" below 70% and "strongest" at 70% or more, so one chapter can never be both.
  const rated = chapters.filter((c) => c.attempts >= 2);
  const weakest = [...rated].filter((c) => c.accuracy < 70).sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)[0];
  const strongest = [...rated].filter((c) => c.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)[0];

  const answered = s.attempts.filter((a) => a.chosen !== "NONE");
  const total = answered.length;
  const accuracy = total ? Math.round((answered.filter((a) => a.isCorrect).length / total) * 100) : 0;
  const enoughData = total >= 5;

  // Misconceptions: the trap notes behind fast wrong answers, most frequent first, each tied to its chapter.
  // The weakest chapter's misconception comes first so the card's label and text always match.
  const trapCount = new Map<string, { chapter: string; note: string; n: number }>();
  s.attempts
    .filter((a) => !a.isCorrect && a.chosen !== "NONE" && a.trap && a.ms > 0 && a.ms < FAST_MS)
    .forEach((a) => {
      const k = `${a.chapter}|${a.trap}`;
      const cur = trapCount.get(k) || { chapter: a.chapter, note: a.trap!, n: 0 };
      cur.n++;
      trapCount.set(k, cur);
    });
  const misconceptions = enoughData
    ? Array.from(trapCount.values())
        .sort((a, b) => Number(b.chapter === weakest?.chapter) - Number(a.chapter === weakest?.chapter) || b.n - a.n)
        .slice(0, 3)
        .map((m) => `${m.chapter}: ${m.note}`)
    : [];

  let headline = "Answer a few MCQ Blitz questions and BoardBrain will start reading how you think.";
  let headlineUr = "چند سوال حل کریں، پھر BoardBrain آپ کی سوچ کو سمجھنا شروع کرے گا۔";
  let nextAction = "Start a 5-minute MCQ Blitz in any chapter.";
  if (total > 0 && !enoughData) {
    const left = 5 - total;
    headline = `Good start! Answer ${left} more MCQ${left === 1 ? "" : "s"} and BoardBrain will tell you what it notices about how you think.`;
    headlineUr = `شاباش! مزید ${left} سوال حل کریں، پھر BoardBrain آپ کو بتائے گا کہ وہ آپ کی سوچ کے بارے میں کیا سمجھتا ہے۔`;
    nextAction = "Keep going in the MCQ Blitz.";
  } else if (enoughData && !weakest) {
    headline = strongest
      ? `Strong work: you are doing well in ${strongest.chapter}. Try a chapter you have not practised yet.`
      : "Practise a few more questions in the same chapter so BoardBrain can see a pattern.";
    headlineUr = strongest
      ? `شاباش! ${strongest.chapter} میں آپ اچھا کر رہے ہیں۔ اب کوئی نیا باب آزمائیں۔`
      : "ایک ہی باب میں چند مزید سوال حل کریں تاکہ BoardBrain پیٹرن دیکھ سکے۔";
    nextAction = strongest ? "Pick a new chapter in the MCQ Blitz." : "Do two more questions in one chapter.";
  }
  if (enoughData && weakest) {
    if (weakest.state === "misconception") {
      headline = `You answer ${weakest.chapter} questions quickly but often wrongly. That usually means one wrong idea, not a lack of effort.`;
      headlineUr = `آپ ${weakest.chapter} کے سوال جلدی مگر اکثر غلط کرتے ہیں — یعنی ایک غلط تصور ذہن میں بیٹھا ہے۔`;
      nextAction = `Ask the AI Guru to explain the idea behind your ${weakest.chapter} mistakes, then retry the Blitz.`;
    } else if (weakest.state === "gap") {
      headline = `${weakest.chapter} is new ground for you (${weakest.accuracy}% correct). Learn the basics before more practice.`;
      headlineUr = `${weakest.chapter} ابھی آپ کے لیے نیا ہے (${weakest.accuracy}% درست)۔ پہلے بنیادی باتیں سیکھیں۔`;
      nextAction = `Read the ${weakest.chapter} Dual Study Card, then do a Blitz on it.`;
    } else if (weakest.state === "shaky") {
      headline = `You know ${weakest.chapter} but you are slow and unsure (${weakest.accuracy}%). More short practice will make it automatic.`;
      headlineUr = `${weakest.chapter} آپ کو آتا ہے مگر ابھی پختہ نہیں (${weakest.accuracy}%)۔ مزید مشق کریں۔`;
      nextAction = `Do two quick Blitz rounds on ${weakest.chapter} today.`;
    } else {
      headline = `Strong work: you are fluent in ${strongest?.chapter || weakest.chapter}. Time to push a new chapter.`;
      headlineUr = `شاباش! ${strongest?.chapter || weakest.chapter} آپ کو اچھی طرح آتا ہے۔ اب نیا باب شروع کریں۔`;
      nextAction = "Pick a chapter you have not tried yet in the MCQ Blitz.";
    }
  }

  return {
    totalAttempts: total,
    accuracy,
    streakDays: streak(s.activeDays),
    activeDays: s.activeDays.length,
    chapters,
    weakest,
    strongest,
    misconceptions,
    headline,
    headlineUr,
    nextAction,
    enoughData,
    recentGuruTopics: s.guruTopics.slice(-5).map((g) => g.text),
  };
}

/** Short plain-text summary the AI Guru receives so it can personalise its help. No names, no IDs. */
export function learnerSummaryForAI(): string {
  const i = getInsights();
  if (!i.totalAttempts && !i.recentGuruTopics.length) return "No practice history yet.";
  const parts: string[] = [];
  parts.push(`Answered ${i.totalAttempts} MCQs, ${i.accuracy}% correct.`);
  const weak = i.chapters.filter((c) => c.attempts >= 2 && c.accuracy < 70).slice(0, 3);
  if (weak.length) parts.push(`Weak chapters: ${weak.map((c) => `${c.subject} ${c.chapter} (${c.accuracy}%, ${c.state})`).join("; ")}.`);
  if (i.misconceptions.length) parts.push(`Likely misconceptions: ${i.misconceptions.join(" | ")}.`);
  if (i.recentGuruTopics.length) parts.push(`Recently asked about: ${i.recentGuruTopics.join(" | ")}.`);
  return parts.join(" ").slice(0, 1200);
}
