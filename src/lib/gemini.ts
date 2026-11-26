/**
 * Server-only Gemini helper. Switched on by the GEMINI_API_KEY environment variable (set it in Vercel).
 * Without the key every call throws AI_OFF and the pages fall back to their built-in content.
 */

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const apiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

export function aiEnabled() {
  return !!apiKey();
}

export async function geminiJSON<T>(opts: {
  system: string;
  turns: { role: "user" | "model"; text: string }[];
  schema: any;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<T> {
  const key = apiKey();
  if (!key) throw new Error("AI_OFF");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 25000);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: ctrl.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system }] },
        contents: opts.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
        generationConfig: {
          temperature: opts.temperature ?? 0.4,
          maxOutputTokens: opts.maxTokens ?? 2048,
          responseMimeType: "application/json",
          responseSchema: opts.schema,
          ...(MODEL.includes("2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });
    if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") || "";
    if (!text) throw new Error("AI_EMPTY");
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Very small per-instance rate limit so one device cannot burn the AI quota. */
const hits = new Map<string, number[]>();
export function rateLimited(id: string, perMinute = 15) {
  const now = Date.now();
  const list = (hits.get(id) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(id, list);
  if (hits.size > 5000) hits.clear();
  return list.length > perMinute;
}

export const GURU_SYSTEM = `You are "BoardBrain AI Guru", a patient, encouraging tutor for Pakistani Matric (Class 9 and 10) students in Karachi preparing for the Sindh Board (BSEK) and Aga Khan Board (AKU-EB) exams, following the Sindh Textbook Board syllabus. Students are 14 to 16 years old.

How to teach:
- Reply in the student's language. If they write Roman Urdu, explain in simple Roman Urdu, then give the exam-ready answer in clear board English. If they write English, use simple English. If they write Urdu script, explain in Urdu script.
- Be Socratic but not stingy: explain the idea, then end with one short check question so the student thinks.
- For numericals, solve step by step: Given data, Formula, Substitution, Answer with SI unit.
- For theory questions asked "for N marks", give an answer of the right length with the key points an examiner looks for.
- Use the learner profile (if given) to personalise: if the question touches a weak chapter or a listed misconception, gently address that misconception directly.
- Use the student's previous messages for context.

Honesty and safety:
- Be factually precise. If unsure, say so and suggest checking the textbook or teacher. Never invent past-paper years, board statistics or "guaranteed" questions.
- Stay on school study topics. If asked about anything unsafe, personal, or unrelated to studies, kindly steer back to studies. Never ask for personal information.
- Never write the student's homework or exam answers for cheating; for take-home tasks, guide them to the answer instead.

Output JSON only, matching the schema. Keep "explanation" under 220 words. Use plain text with simple formulas like F = kq1q2/r^2 (no LaTeX).`;

export const GURU_SCHEMA = {
  type: "OBJECT",
  properties: {
    headline: { type: "STRING", description: "Short title of the answer" },
    explanation: { type: "STRING", description: "The explanation in the student's language" },
    board_answer: { type: "STRING", description: "Exam-ready answer in board English (may be empty for pure chit-chat)" },
    formula: { type: "STRING", description: "Key formula if any, else empty" },
    unit: { type: "STRING", description: "SI unit if any, else empty" },
    step_tip: { type: "STRING", description: "One examiner tip about how marks are won or lost" },
    challenge_question: { type: "STRING", description: "One short check question for the student" },
    detected_subject: { type: "STRING" },
    detected_chapter: { type: "STRING" },
    misconception_spotted: { type: "STRING", description: "A misconception the student seems to have, or empty" },
  },
  required: ["headline", "explanation", "step_tip", "challenge_question"],
};

export const PRACTICE_SCHEMA = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          text_en: { type: "STRING" },
          text_ur: { type: "STRING", description: "Urdu translation of the question" },
          A: { type: "STRING" },
          B: { type: "STRING" },
          C: { type: "STRING" },
          D: { type: "STRING" },
          correct_option: { type: "STRING", enum: ["A", "B", "C", "D"] },
          explanation: { type: "STRING", description: "Why the correct option is right, 1-2 sentences" },
          trap: { type: "STRING", description: "The common mistake students make here, 1 sentence" },
          cognitive_level: { type: "STRING", enum: ["Knowledge", "Understanding", "Application"] },
        },
        required: ["text_en", "A", "B", "C", "D", "correct_option", "explanation", "trap"],
      },
    },
  },
  required: ["questions"],
};
