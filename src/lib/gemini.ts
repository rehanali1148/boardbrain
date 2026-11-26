/**
 * Server-only AI helper with a free-first fallback chain. Every engine is optional and switched on by env vars:
 *   1. Groq (free tier)       GROQ_API_KEY, GROQ_API_KEY_2 … GROQ_API_KEY_9, or GROQ_API_KEYS="k1,k2"; GROQ_MODELS="m1,m2"
 *   2. Gemini (free tier)     GEMINI_API_KEY or GOOGLE_API_KEY; GEMINI_MODEL, GEMINI_FALLBACK_MODEL
 *   3. OpenRouter (:free)     OPENROUTER_API_KEY(S) like Groq; OPENROUTER_MODELS
 *   4. Ollama on our server   OLLAMA_URL, OLLAMA_TOKEN, OLLAMA_MODEL
 * Each key × model pair is tried in turn; one that hits a rate limit or quota is rested for a while and the next one
 * is used. If nothing is configured or everything is resting, it throws and the pages use their built-in content.
 */

const GEMINI_MODELS = [process.env.GEMINI_MODEL || "gemini-2.5-flash", process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite"];
const geminiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const ollamaUrl = () => (process.env.OLLAMA_URL || "").replace(/\/+$/, "");

/** Collect PREFIX_API_KEY, PREFIX_API_KEY_2 … _9 and PREFIX_API_KEYS (comma separated), without duplicates. */
function keysFor(prefix: string): string[] {
  const list: string[] = [];
  const add = (v?: string) => (v || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((k) => !list.includes(k) && list.push(k));
  add(process.env[`${prefix}_API_KEYS`]);
  add(process.env[`${prefix}_API_KEY`]);
  for (let i = 2; i <= 9; i++) add(process.env[`${prefix}_API_KEY_${i}`]);
  return list;
}
const listEnv = (name: string, fallback: string) => (process.env[name] || fallback).split(",").map((s) => s.trim()).filter(Boolean);

interface OpenAIProvider { name: string; baseUrl: string; keys: string[]; models: string[] }
function openAIProviders(): OpenAIProvider[] {
  return [
    { name: "groq", baseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1", keys: keysFor("GROQ"), models: listEnv("GROQ_MODELS", "openai/gpt-oss-120b,openai/gpt-oss-20b") },
    { name: "openrouter", baseUrl: "https://openrouter.ai/api/v1", keys: keysFor("OPENROUTER"), models: listEnv("OPENROUTER_MODELS", "openai/gpt-oss-20b:free") },
  ].filter((p) => p.keys.length && p.models.length);
}

export function aiEnabled() {
  return !!geminiKey() || !!ollamaUrl() || openAIProviders().length > 0;
}

/** Rest a key×model that ran out, so the next request skips it. Per server instance. */
const restingUntil = new Map<string, number>();
const slotId = (provider: string, key: string, model: string) => `${provider}:${key.slice(-6)}:${model}`;
const isResting = (id: string) => (restingUntil.get(id) || 0) > Date.now();
function rest(id: string, status: number, retryAfterSec?: number) {
  // Rate limit: a minute (or what the server says). Bad key: an hour. Server error: 20 s.
  const ms = status === 429 ? Math.max(60, retryAfterSec || 0) * 1000 : status === 401 || status === 403 ? 3600 * 1000 : 20 * 1000;
  restingUntil.set(id, Date.now() + ms);
}

class HttpError extends Error {
  constructor(public status: number, public retryAfter?: number) {
    super(`AI_HTTP_${status}`);
  }
}

/** Describe the JSON schema in plain words for providers that only support "json_object" mode. */
function schemaHint(schema: any): string {
  const props = schema?.properties || {};
  const lines = Object.entries(props).map(([k, v]: any) => {
    if (v.type === "ARRAY" && v.items?.properties) {
      return `"${k}": array of objects with keys ${Object.keys(v.items.properties).map((x) => `"${x}"`).join(", ")}${v.items.properties.correct_option ? ' ("correct_option" is one of "A","B","C","D")' : ""}`;
    }
    return `"${k}": ${String(v.type).toLowerCase()}${v.description ? ` (${v.description})` : ""}`;
  });
  return `Reply with ONE JSON object only, no other text, with these keys:\n${lines.join("\n")}\nRequired keys: ${(schema?.required || []).join(", ")}.`;
}

async function callOpenAICompatible<T>(p: OpenAIProvider, key: string, model: string, o: AIOptions): Promise<T> {
  return withTimeout(o.timeoutMs ?? 20000, async (signal) => {
    const res = await fetch(`${p.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        ...(p.name === "openrouter" ? { "X-Title": "BoardBrain" } : {}),
      },
      signal,
      body: JSON.stringify({
        model,
        temperature: o.temperature ?? 0.4,
        max_tokens: Math.min(o.maxTokens ?? 2048, 4000),
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${o.system}\n\n${schemaHint(o.schema)}` },
          ...o.turns.map((t) => ({ role: t.role === "model" ? "assistant" : "user", content: t.text })),
        ],
      }),
    });
    if (!res.ok) {
      const ra = Number(res.headers.get("retry-after")) || undefined;
      throw new HttpError(res.status, ra);
    }
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content || "";
    if (!text) throw new Error("AI_EMPTY");
    const jsonText = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    return JSON.parse(jsonText) as T;
  });
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
  // A CPU-only server is slow; it gets whatever time is left in the request budget
  return withTimeout(o.timeoutMs ?? 25000, async (signal) => {
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
  const deadline = Date.now() + 26000; // stay inside the 30 s function limit
  const timeLeft = () => deadline - Date.now();
  const note = (id: string, e: any) => {
    lastErr = e;
    if (e instanceof HttpError) rest(id, e.status, e.retryAfter);
    else rest(id, 0); // timeout or bad JSON: short rest
  };

  // 1. Groq, then 3. OpenRouter are handled by the same loop; Gemini sits between them
  const providers = openAIProviders();
  const groq = providers.filter((p) => p.name === "groq");
  const openrouter = providers.filter((p) => p.name === "openrouter");

  const tryOpenAI = async (list: OpenAIProvider[]) => {
    for (const p of list) {
      for (const model of p.models) {
        for (const key of p.keys) {
          const id = slotId(p.name, key, model);
          if (isResting(id) || timeLeft() < 4000) continue;
          try {
            const data = await callOpenAICompatible<T>(p, key, model, { ...o, timeoutMs: Math.min(o.timeoutMs ?? 20000, timeLeft()) });
            return { data, engine: `${p.name}:${model}` };
          } catch (e) {
            note(id, e);
          }
        }
      }
    }
    return null;
  };

  const g = await tryOpenAI(groq);
  if (g) return g;

  if (geminiKey()) {
    for (const model of GEMINI_MODELS) {
      const id = slotId("gemini", geminiKey(), model);
      if (isResting(id) || timeLeft() < 4000) continue;
      try {
        return { data: await callGemini<T>(model, { ...o, timeoutMs: Math.min(o.timeoutMs ?? 22000, timeLeft()) }), engine: model };
      } catch (e: any) {
        const m = String(e?.message).match(/AI_HTTP_(\d+)/);
        note(id, m ? new HttpError(Number(m[1])) : e);
      }
    }
  }

  const r = await tryOpenAI(openrouter);
  if (r) return r;

  if (ollamaUrl() && timeLeft() > 8000) {
    try {
      return { data: await callOllama<T>({ ...o, timeoutMs: timeLeft() }), engine: "ollama" };
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
