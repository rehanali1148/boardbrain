/**
 * Server-only AI helper with a free-first fallback chain:
 *   1. Gemini (free tier works; GEMINI_API_KEY or GOOGLE_API_KEY), main model then a lighter one if rate-limited
 *   2. Ollama on our own server (OLLAMA_URL, optional OLLAMA_TOKEN, OLLAMA_MODEL), used when Gemini is off or out of quota
 *   3. If neither is available: throws AI_OFF and the pages use their built-in content.
 */

const GEMINI_MODELS = [process.env.GEMINI_MODEL || "gemini-2.5-flash", process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite"];
const geminiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const ollamaUrl = () => (process.env.OLLAMA_URL || "").replace(/\/+$/, "");

export function aiEnabled() {
  return !!geminiKey() || !!ollamaUrl();
}

type Turn = { role: "user" | "model"; text: string };
interface AIOptions {
  system: string;
  turns: Turn[];
  schema: any;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

async function withTimeout<T>(ms: number, fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini<T>(model: string, o: AIOptions): Promise<T> {
  return withTimeout(o.timeoutMs ?? 22000, async (signal) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey() },
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: o.system }] },
        contents: o.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
        generationConfig: {
          temperature: o.temperature ?? 0.4,
          maxOutputTokens: o.maxTokens ?? 2048,
          responseMimeType: "application/json",
          responseSchema: o.schema,
          ...(model.includes("2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
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
  });
}

/** Gemini's schema uses upper-case types; Ollama expects standard JSON Schema. */
function toJsonSchema(s: any): any {
  if (Array.isArray(s)) return s.map(toJsonSchema);
  if (!s || typeof s !== "object") return s;
  const out: any = {};
  for (const [k, v] of Object.entries(s)) out[k] = k === "type" && typeof v === "string" ? v.toLowerCase() : toJsonSchema(v);
  return out;
}

async function callOllama<T>(o: AIOptions): Promise<T> {
  // A CPU-only server is slow, so it gets a longer budget (the route allows 60 s)
  return withTimeout(Math.max(o.timeoutMs ?? 0, 50000), async (signal) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.OLLAMA_TOKEN) headers.Authorization = `Bearer ${process.env.OLLAMA_TOKEN}`;
    const res = await fetch(`${ollamaUrl()}/api/chat`, {
      method: "POST",
      headers,
      signal,
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "qwen2.5:3b",
        stream: false,
        format: toJsonSchema(o.schema),
        options: { temperature: o.temperature ?? 0.4, num_predict: Math.min(o.maxTokens ?? 1200, 1200) },
        messages: [
          { role: "system", content: o.system },
          ...o.turns.map((t) => ({ role: t.role === "model" ? "assistant" : "user", content: t.text })),
        ],
      }),
    });
    if (!res.ok) throw new Error(`AI_HTTP_${res.status}`);
    const data = await res.json();
    const text = data?.message?.content || "";
    if (!text) throw new Error("AI_EMPTY");
    return JSON.parse(text) as T;
  });
}

/** Runs the free-first chain and reports which engine answered. */
export async function aiJSON<T>(o: AIOptions): Promise<{ data: T; engine: string }> {
  let lastErr: any = new Error("AI_OFF");
  if (geminiKey()) {
    for (const model of GEMINI_MODELS) {
      try {
        return { data: await callGemini<T>(model, o), engine: model };
      } catch (e: any) {
        lastErr = e;
        // Bad key or bad request will not get better with another Gemini model
        if (/AI_HTTP_(400|401|403)/.test(String(e?.message))) break;
      }
    }
  }
  if (ollamaUrl()) {
    try {
      return { data: await callOllama<T>(o), engine: "ollama" };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** Back-compatible helper used by the routes. */
export async function geminiJSON<T>(o: AIOptions): Promise<T> {
  return (await aiJSON<T>(o)).data;
}

/** Very small per-instance rate limit so one device cannot burn the free quota. */
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
