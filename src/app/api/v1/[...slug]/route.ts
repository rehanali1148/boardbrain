import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  FALLBACK_CHAPTERS,
  FALLBACK_QUESTIONS,
  FALLBACK_PRACTICALS,
  QuestionItem
} from "@/lib/curriculumData";
import { generateExamPaper } from "@/lib/examGenerator";
import { radarFor } from "@/lib/radarTopics";
import { aiEnabled, geminiJSON, rateLimited, GURU_SYSTEM, GURU_SCHEMA, PRACTICE_SCHEMA } from "@/lib/gemini";

// AI calls can take several seconds
export const maxDuration = 30;

function clientId(req: NextRequest) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}

/**
 * NOTE ON STATE: the lists below live in this server instance's memory. On Vercel each instance has its own copy and
 * it is wiped on every cold start or deploy, so nothing here is durable. Real persistence needs a database.
 */

/**
 * Tokens: "demo_jwt_token_<role>_<ts>" for students, plus "_<signature>" for staff.
 * The staff signature is an HMAC keyed by the STAFF_PIN environment variable, so a student cannot forge a teacher token.
 * Without STAFF_PIN set, staff login is locked. (Real per-person accounts are still to come.)
 */
const STAFF_ROLES = ["teacher", "campus_head"];

function staffSignature(role: string, ts: string) {
  const secret = process.env.STAFF_PIN || "";
  return createHmac("sha256", `boardbrain-staff:${secret}`).update(`${role}.${ts}`).digest("hex").slice(0, 32);
}

function issueToken(role: string) {
  const ts = String(Date.now());
  return STAFF_ROLES.includes(role) ? `demo_jwt_token_${role}_${ts}_${staffSignature(role, ts)}` : `demo_jwt_token_${role}_${ts}`;
}

function roleFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/demo_jwt_token_(student_10|student_09|teacher|campus_head)_(\d+)(?:_([a-f0-9]{32}))?/);
  if (!m) return null;
  const [, role, ts, sig] = m;
  if (!STAFF_ROLES.includes(role)) return role;
  if (!process.env.STAFF_PIN || !sig) return null;
  const expected = staffSignature(role, ts);
  const ok = sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  const fresh = Date.now() - Number(ts) < 14 * 24 * 3600 * 1000; // staff sessions last 14 days
  return ok && fresh ? role : null;
}

/** Teacher-only endpoints refuse students (and requests with no token). */
function requireStaff(req: NextRequest) {
  const role = roleFromRequest(req);
  if (role === "teacher" || role === "campus_head") return null;
  return NextResponse.json({ detail: "TEACHER_ONLY: this page is for teachers and campus heads." }, { status: 403 });
}

/** Sample class data shown until real student activity is stored. Always flagged is_sample so the UI can say so. */
const SAMPLE_HEATMAP = {
  is_sample: true,
  class_label: "10-A Physics",
  total_students: 42,
  active_students: 38,
  passing_students: 36,
  pass_mark_pct: 33,
  average_readiness_pct: 74.5,
  chapter_trap_distribution: [
    { chapter_name: "Geometrical Optics", failure_rate_pct: 48, top_trap: "Wrong sign for the focal length or image distance in 1/f = 1/p + 1/q", sample_doubt: "Sir concave mirror mein focal length kab negative hoti hai?" },
    { chapter_name: "Simple Harmonic Motion & Waves", failure_rate_pct: 41, top_trap: "Assuming a heavier bob changes the time period of a pendulum", sample_doubt: "Agar bob ka mass double karein to time period double kyun nahi hota?" },
    { chapter_name: "Current Electricity", failure_rate_pct: 29, top_trap: "Leaving out 'temperature constant' when stating Ohm's law", sample_doubt: "Parallel mein voltage same kyun rehta hai?" },
  ],
};

const SAMPLE_ROSTER: Record<string, string[]> = {
  "10-A": ["Areeba Tariq", "Ahmed Raza", "Fatima Noor", "Bilal Khan", "Sana Iqbal", "Usman Ali"],
  "10-B": ["Hira Shah", "Zain Ahmed", "Maryam Siddiqui", "Hassan Javed", "Ayesha Malik"],
};
let awardedBadges: { student_id: number; badge_slug: string; endorsement_note: string; awarded_at: string }[] = [];

// User fallback mapping for demo token
const USER_PROFILES: Record<string, any> = {
  student_10: {
    erp_user_id: "NASRA-SAD-STD-10",
    full_name: "Areeba Tariq",
    role: "student",
    campus: "Saddar",
    class_grade: 10,
    section: "A",
    board: "BSEK",
    group_name: "Biology",
  },
  student_09: {
    erp_user_id: "NASRA-SAD-STD-09",
    full_name: "Hamza Siddiqui",
    role: "student",
    campus: "Saddar",
    class_grade: 9,
    section: "B",
    board: "AKU-EB",
    group_name: "Computer Science",
  },
  teacher: {
    erp_user_id: "NASRA-SAD-TCH-01",
    full_name: "Sir Farhan Ahmed",
    role: "teacher",
    campus: "Saddar",
    class_grade: 10,
    section: "A",
    board: "BSEK",
    group_name: "Science",
    subject: "Physics",
    sections: ["10-A", "10-B"],
  },
  campus_head: {
    erp_user_id: "NASRA-SAD-ADM-01",
    full_name: "Mrs. Nasreen Shah",
    role: "campus_head",
    campus: "Saddar",
    board: "BSEK",
  },
};

// In-memory persistence for live demo session
let liveGoldNotes: any[] = [
  {
    id: 1,
    teacher_name: "Sir Farhan Ahmed",
    campus: "Saddar",
    class_grade: 10,
    subject: "Physics",
    topic: "Geometrical Optics - Mirror Sign Rules",
    gold_tip_text: "Examiner Trap: If concave mirror forms virtual image behind mirror, q must be negative in 1/f = 1/p + 1/q. Many students forget the negative sign.",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    teacher_name: "Sir Farhan Ahmed",
    campus: "Saddar",
    class_grade: 10,
    subject: "Physics",
    topic: "Current Electricity - Resistors in Parallel",
    gold_tip_text: "In parallel circuits, voltage is identical across branches: V_total = V1 = V2. Do NOT add voltages!",
    created_at: new Date().toISOString(),
  }
];

let liveDoubts: any[] = [
  {
    id: "DBT-2026-101",
    student_name: "Areeba Tariq",
    class_grade: 10,
    section: "A",
    subject: "Physics",
    topic: "Mirrors & Lenses Sign Rule",
    campus: "Saddar",
    student_query: "Sir concave mirror mein focal length kab negative hoti hai?",
    student_attempt_summary: "Sir concave mirror mein focal length kab negative hoti hai?",
    misconception: "Mixes up the sign rules for concave and convex mirrors.",
    status: "pending",
    teacher_reply: null,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    is_sample: true
  }
];

let liveMistakeVault: any[] = [
  {
    id: "MSTK-001",
    question_id: "PHY10-SHM-001",
    subject: "Physics",
    grade: 10,
    chapter_name: "Simple Harmonic Motion & Waves",
    text_en: "If the mass of the bob of a simple pendulum is tripled, its time period will:",
    user_answer: "Increase by 3 times",
    correct_option: "Remain unchanged",
    examiner_trap: "Examiner Trap: Students incorrectly think mass increases time period. Formula T = 2π√(L/g) has NO mass term!",
    missed_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    retry_available_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    hours_left: 12
  },
  {
    id: "MSTK-002",
    question_id: "PHY10-OPT-001",
    subject: "Physics",
    grade: 10,
    chapter_name: "Geometrical Optics",
    text_en: "The focal length of a convex mirror according to standard sign convention is always:",
    user_answer: "Positive",
    correct_option: "Negative",
    examiner_trap: "Convex lens has POSITIVE focus, but Convex mirror has NEGATIVE focus behind reflecting surface!",
    missed_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    retry_available_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    hours_left: 0
  }
];

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = params.slug.join("/");
  const url = new URL(req.url);

  // 1. Chapters
  if (path === "curriculum/chapters") {
    const grade = Number(url.searchParams.get("grade")) || 10;
    const rawSub = (url.searchParams.get("subject") || "Physics").trim();
    const subClean = rawSub.charAt(0).toUpperCase() + rawSub.slice(1).toLowerCase();
    const key = `${subClean}_${grade}`;
    const chapters = FALLBACK_CHAPTERS[key] || [];
    // Report how many MCQs the bank really holds per chapter (the static list carried invented counts).
    return NextResponse.json(
      chapters.map((c) => ({
        ...c,
        question_count: FALLBACK_QUESTIONS.filter(
          (q) => q.grade === grade && q.subject.toLowerCase() === subClean.toLowerCase() && q.chapter_name.toLowerCase() === c.chapter_name.toLowerCase()
        ).length,
      }))
    );
  }

  // 1b. Gold notes as students see them (read-only)
  if (path === "curriculum/gold-notes") {
    const grade = Number(url.searchParams.get("class_grade")) || 0;
    return NextResponse.json(grade ? liveGoldNotes.filter((n) => n.class_grade === grade) : liveGoldNotes);
  }

  // 2. Questions
  if (path === "curriculum/questions") {
    const grade = Number(url.searchParams.get("grade")) || 10;
    const subject = (url.searchParams.get("subject") || "Physics").toLowerCase();
    const chapter = url.searchParams.get("chapter_name");

    let matches = FALLBACK_QUESTIONS.filter(
      (q) => q.grade === grade && q.subject.toLowerCase() === subject
    );

    if (chapter && matches.length > 0) {
      const chMatch = matches.filter(
        (q) =>
          q.chapter_name.toLowerCase().includes(chapter.toLowerCase()) ||
          chapter.toLowerCase().includes(q.chapter_name.toLowerCase())
      );
      if (chMatch.length > 0) matches = chMatch;
    }

    if (matches.length === 0) {
      matches = FALLBACK_QUESTIONS.filter((q) => q.subject.toLowerCase() === subject);
    }

    return NextResponse.json(matches.length > 0 ? matches : FALLBACK_QUESTIONS.slice(0, 5));
  }

  // 3. Radar
  if (path === "curriculum/radar") {
    const grade = Number(url.searchParams.get("grade")) || 10;
    const subject = url.searchParams.get("subject") || "Physics";
    return NextResponse.json(radarFor(grade, subject));
  }

  // 4. Practicals
  if (path === "curriculum/practicals") {
    const subject = (url.searchParams.get("subject") || "Physics").toLowerCase();
    const filtered = FALLBACK_PRACTICALS.filter((p) => p.subject.toLowerCase() === subject);
    return NextResponse.json(filtered.length > 0 ? filtered : [FALLBACK_PRACTICALS[0]]);
  }

  // Whether AI features are switched on (no secrets returned)
  if (path === "student/ai-status") {
    return NextResponse.json({ enabled: aiEnabled() });
  }

  // Everything under teacher/ is staff-only
  if (path.startsWith("teacher/")) {
    const denied = requireStaff(req);
    if (denied) return denied;
  }

  // 5. Teacher Gold Notes
  if (path === "teacher/gold-notes") {
    return NextResponse.json(liveGoldNotes);
  }

  // 6. Teacher Doubts
  if (path === "teacher/doubts") {
    return NextResponse.json(liveDoubts);
  }

  // 6b. Class heatmap (sample until real blitz results are stored)
  if (path === "teacher/heatmap") {
    return NextResponse.json(SAMPLE_HEATMAP);
  }

  // 6c. Class badge wall (sample roster until real enrolment data is connected)
  if (path === "teacher/class-badges") {
    const grade = Number(url.searchParams.get("class_grade")) || 10;
    const section = (url.searchParams.get("section") || "A").toUpperCase();
    const label = `${grade}-${section}`;
    const names = SAMPLE_ROSTER[label] || [];
    const students = names.map((full_name, i) => {
      const id = grade * 1000 + section.charCodeAt(0) * 10 + i;
      const earned = awardedBadges
        .filter((a) => a.student_id === id)
        .map((a) => ({
          slug: a.badge_slug,
          title: a.badge_slug.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          title_urdu: "",
          category: "endorsement",
          tier: "gold",
          icon: "Award",
          description: a.endorsement_note,
          criteria_text: "Awarded by teacher",
          xp_points: 100,
          earned_at: a.awarded_at,
          endorsement_by: "Sir Farhan Ahmed",
          endorsement_note: a.endorsement_note,
          is_unlocked: 1,
        }));
      return {
        id,
        erp_user_id: `NASRA-SAD-${label}-${String(i + 1).padStart(2, "0")}`,
        full_name,
        campus: "Saddar",
        class_grade: grade,
        section,
        board: "BSEK",
        group_name: "Science",
        earned_badges: earned,
        badge_count: earned.length,
      };
    });
    return NextResponse.json({ is_sample: true, campus: "Saddar", class_grade: grade, section, total_students: students.length, students });
  }

  // 7. Teacher Class Traps Heatmap
  if (path === "teacher/class-traps") {
    return NextResponse.json({
      campus: "Saddar",
      class_grade: 10,
      subject: "Physics",
      traps: [
        { topic: "Concave Mirror Sign Convention", fail_rate: "48%", error: "Taking focal length as negative instead of positive" },
        { topic: "Ohm's Law Temperature Condition", fail_rate: "42%", error: "Omitting 'temperature must remain constant' condition" },
        { topic: "Simple Pendulum Mass Independence", fail_rate: "51%", error: "Assuming increasing bob mass changes the time period" }
      ]
    });
  }

  // 8. Student Badges & Awards Suite
  if (path === "student/badges") {
    const base: any = {
      student_name: "Areeba Tariq",
      erp_user_id: "NASRA-SAD-STD-10",
      total_badges: 5,
      unlocked_count: 3,
      total_xp: 450,
      tier_counts: { platinum: 1, gold: 1, silver: 1, bronze: 0 },
      badges: [
        {
          slug: "blitz-master",
          title: "MCQ Blitz Ace",
          title_urdu: "ایم سی کیو چیمپئن",
          category: "blitz",
          tier: "gold",
          icon: "Zap",
          description: "Scored 100% on 3 consecutive 5-minute Section A board blitzes.",
          criteria_text: "3 perfect blitz sessions",
          xp_points: 150,
          earned_at: "Yesterday",
          endorsement_by: "Sir Farhan Ahmed",
          endorsement_note: "Flawless conceptual speed on Sindh past papers.",
          is_unlocked: 1
        },
        {
          slug: "rubric-perfectionist",
          title: "Topper Step Scholar",
          title_urdu: "مارکنگ روبرک ماسٹر",
          category: "numericals",
          tier: "platinum",
          icon: "Award",
          description: "Achieved full 4/4 rubric marks on Section C numerical step builder.",
          criteria_text: "Full Given Data + Formula + Working + Units",
          xp_points: 200,
          earned_at: "2 days ago",
          endorsement_by: "Sir Farhan Ahmed",
          endorsement_note: "Model presentation matching official board standards.",
          is_unlocked: 1
        },
        {
          slug: "viva-champion",
          title: "Oral Viva Pro",
          title_urdu: "ویوا وائس چیمپئن",
          category: "labs",
          tier: "silver",
          icon: "Medal",
          description: "Successfully cleared external examiner bench oral with full marks.",
          criteria_text: "Score 4.0/4.0 on Lab Viva Simulator",
          xp_points: 100,
          earned_at: "3 days ago",
          endorsement_by: null,
          endorsement_note: null,
          is_unlocked: 1
        },
        {
          slug: "lab-virtuoso",
          title: "Concordant Titration Auditor",
          title_urdu: "پریکٹیکل لیب ماہر",
          category: "labs",
          tier: "bronze",
          icon: "Star",
          description: "Validated burette readings with concordancy under 0.1 cm³.",
          criteria_text: "Audit 3 concordant table readings",
          xp_points: 50,
          earned_at: null,
          endorsement_by: null,
          endorsement_note: null,
          is_unlocked: 0
        },
        {
          slug: "streak-legend",
          title: "7-Day Consistent Scholar",
          title_urdu: "مستقل مزاج طالب علم",
          category: "consistency",
          tier: "gold",
          icon: "Flame",
          description: "Maintained active study streak for 7 consecutive days.",
          criteria_text: "Complete 1 practice drill daily for 7 days",
          xp_points: 150,
          earned_at: null,
          endorsement_by: null,
          endorsement_note: null,
          is_unlocked: 0
        }
      ]
    };
    // Badges a teacher awarded on the Badge Wall (sample roster: Areeba Tariq is 10-A #1, id 10650)
    const role = roleFromRequest(req);
    const myId = role === "student_09" ? -1 : 10 * 1000 + "A".charCodeAt(0) * 10 + 0;
    const fromTeacher = awardedBadges
      .filter((a) => a.student_id === myId)
      .map((a, i) => ({
        slug: `${a.badge_slug}-${i}`,
        title: a.badge_slug.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        title_urdu: "استاد کی طرف سے اعزاز",
        category: "endorsement",
        tier: "gold",
        icon: "Award",
        description: a.endorsement_note || "Awarded by your teacher.",
        criteria_text: "Awarded by your teacher",
        xp_points: 100,
        earned_at: a.awarded_at,
        endorsement_by: "Sir Farhan Ahmed",
        endorsement_note: a.endorsement_note,
        is_unlocked: 1,
      }));
    // The built-in badges are goals to work towards; nobody has earned them until it is really recorded.
    const goals = base.badges.map((b: any) => ({ ...b, is_unlocked: 0, earned_at: null, endorsement_by: null, endorsement_note: null }));
    const badges = [...fromTeacher, ...goals];
    const unlocked = badges.filter((x: any) => x.is_unlocked);
    const tier_counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 } as Record<string, number>;
    unlocked.forEach((x: any) => { tier_counts[x.tier] = (tier_counts[x.tier] || 0) + 1; });
    return NextResponse.json({
      ...base,
      badges,
      total_badges: badges.length,
      unlocked_count: unlocked.length,
      total_xp: unlocked.reduce((sum: number, x: any) => sum + (x.xp_points || 0), 0),
      tier_counts,
    });
  }

  // 9. Student Mistake Vault
  if (path === "student/vault") {
    return NextResponse.json(liveMistakeVault);
  }

  // 10. Student Progress Dashboard Metrics
  if (path === "student/progress") {
    const roleKey = url.searchParams.get("role_key") || "student_10";
    const studentUser = roleKey.includes("09") ? USER_PROFILES.student_09 : USER_PROFILES.student_10;
    return NextResponse.json({
      student_name: studentUser.full_name,
      class_grade: studentUser.class_grade,
      board: studentUser.board,
      campus: studentUser.campus,
      theory_readiness_pct: studentUser.class_grade === 9 ? 72.0 : 76.5,
      practical_readiness_pct: studentUser.class_grade === 9 ? 80.0 : 84.0,
      streak_days: 5,
      mistake_vault_pending_count: liveMistakeVault.length,
      weak_chapters: studentUser.class_grade === 9
        ? ["Dynamics", "Kinematics Equations"]
        : ["Refraction of Light & Optical Instruments", "Current Electricity"],
      predicted_grade_band: "A-1 (Shield Active)",
      official_pass_mark_pct: 33,
      pass_benchmark_met: true
    });
  }

  return NextResponse.json({ detail: `Unknown endpoint: ${path}` }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = params.slug.join("/");
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    // Empty body
  }

  // 1. Auth Demo Token
  if (path === "auth/demo-token") {
    const requested = body.role_key || body.roleKey || "student_10";
    const roleKey = USER_PROFILES[requested] ? requested : "student_10";
    if (STAFF_ROLES.includes(roleKey)) {
      const pin = process.env.STAFF_PIN;
      if (!pin) {
        return NextResponse.json({ detail: "STAFF_LOCKED: teacher login is not set up yet. Ask the school admin." }, { status: 403 });
      }
      const given = String(body.staff_pin || "");
      const okPin = given.length === pin.length && timingSafeEqual(Buffer.from(given), Buffer.from(pin));
      if (!okPin) {
        return NextResponse.json({ detail: "STAFF_PIN_WRONG: that staff PIN is not correct." }, { status: 403 });
      }
    }
    const profile = USER_PROFILES[roleKey];
    return NextResponse.json({
      access_token: issueToken(roleKey),
      token_type: "bearer",
      user: profile,
    });
  }

  // 2. Exam Generator (shared with the offline fallback in lib/api.ts)
  if (path === "teacher/generate-exam") {
    const denied = requireStaff(req);
    if (denied) return denied;
    return NextResponse.json(generateExamPaper(body));
  }

  // 2b. AI Guru (Gemini). Returns 503 AI_OFF when no key is configured; the page then uses its built-in answers.
  if (path === "student/guru") {
    if (!aiEnabled()) return NextResponse.json({ detail: "AI_OFF" }, { status: 503 });
    if (rateLimited(`guru:${clientId(req)}`, 20)) {
      return NextResponse.json({ detail: "Too many questions in one minute. Take a breath and try again shortly." }, { status: 429 });
    }
    const message = String(body.message || "").slice(0, 1500).trim();
    if (!message) return NextResponse.json({ detail: "Empty question" }, { status: 400 });
    const history: { role: "user" | "model"; text: string }[] = (Array.isArray(body.history) ? body.history : [])
      .slice(-8)
      .map((m: any) => ({ role: m.role === "user" ? "user" : "model", text: String(m.text || "").slice(0, 1500) }))
      .filter((m: any) => m.text);
    // Gemini requires the conversation to start with a user turn
    while (history.length && history[0].role !== "user") history.shift();
    const grade = Number(body.class_grade) || 10;
    const board = String(body.board || "BSEK").slice(0, 20);
    const profile = String(body.learner_profile || "").slice(0, 1200);
    const context = `Student: Class ${grade}, ${board} board.\nLearner profile: ${profile || "none yet"}`;
    try {
      const answer = await geminiJSON<any>({
        system: `${GURU_SYSTEM}\n\n${context}`,
        turns: [...history, { role: "user", text: message }],
        schema: GURU_SCHEMA,
        temperature: 0.35,
      });
      return NextResponse.json({ ...answer, source: "ai" });
    } catch (e: any) {
      const msg = String(e?.message || "");
      return NextResponse.json({ detail: msg.startsWith("AI_") ? msg : "AI_ERROR" }, { status: 502 });
    }
  }

  // 2c. AI practice MCQs for a chapter (clearly labelled as AI practice, never as past-paper questions)
  if (path === "student/ai-practice") {
    if (!aiEnabled()) return NextResponse.json({ detail: "AI_OFF" }, { status: 503 });
    if (rateLimited(`practice:${clientId(req)}`, 6)) {
      return NextResponse.json({ detail: "Please wait a minute before asking for more questions." }, { status: 429 });
    }
    const grade = Number(body.grade) === 9 ? 9 : 10;
    const subject = ["Physics", "Chemistry", "Biology"].includes(body.subject) ? body.subject : "Physics";
    const chapter = String(body.chapter || "").slice(0, 100);
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 8);
    try {
      const out = await geminiJSON<{ questions: any[] }>({
        system:
          "You write accurate multiple-choice questions for Pakistani Matric students (Sindh Textbook Board syllabus, BSEK/AKU-EB). " +
          "Every question must have exactly one correct option, plausible distractors based on real student mistakes, and correct facts, values and SI units. " +
          "Do not claim questions come from past papers. Output JSON only.",
        turns: [
          {
            role: "user",
            text: `Write ${count} different MCQs for Class ${grade} ${subject}, chapter "${chapter}". Mix knowledge, understanding and application (include at least one small numerical if the chapter has formulas). Give an Urdu translation of each question.`,
          },
        ],
        schema: PRACTICE_SCHEMA,
        temperature: 0.7,
        maxTokens: 3000,
      });
      const stamp = Date.now();
      const questions = (out.questions || [])
        .filter((q) => q && q.text_en && q.A && q.B && q.C && q.D && ["A", "B", "C", "D"].includes(q.correct_option))
        .slice(0, count)
        .map((q, i) => ({
          question_id: `AI-${subject.slice(0, 3).toUpperCase()}${grade}-${stamp}-${i}`,
          board: "BSEK_KARACHI",
          grade,
          subject,
          chapter_name: chapter,
          section: "SECTION_A",
          text_en: q.text_en,
          text_ur: q.text_ur || "",
          options_json: JSON.stringify({ A: q.A, B: q.B, C: q.C, D: q.D }),
          correct_option: q.correct_option,
          marks: 1,
          is_numerical: false,
          solution_rubric: q.explanation,
          cognitive_level: q.cognitive_level || "Understanding",
          trap_note: q.trap,
          is_ai: true,
        }));
      return NextResponse.json(questions);
    } catch (e: any) {
      const msg = String(e?.message || "");
      return NextResponse.json({ detail: msg.startsWith("AI_") ? msg : "AI_ERROR" }, { status: 502 });
    }
  }

  // 3. Step Evaluator
  if (path === "student/step-evaluator") {
    const hasData = (body.given_data_text || "").trim().length > 3;
    const hasFormula = (body.formula_text || "").trim().length > 2;
    const hasCalc = (body.calculation_steps_text || "").trim().length > 3;
    const hasUnit = (body.unit_text || "").trim().length > 0;

    let score = 0;
    if (hasData) score += 1.0;
    if (hasFormula) score += 1.0;
    if (hasCalc) score += 1.5;
    if (hasUnit) score += 0.5;

    return NextResponse.json({
      awarded_marks: score,
      maximum_marks: 4.0,
      breakdown: {
        given_data: hasData ? 1.0 : 0.0,
        formula: hasFormula ? 1.0 : 0.0,
        calculation: hasCalc ? 1.5 : 0.5,
        unit: hasUnit ? 0.5 : 0.0
      },
      feedback: score === 4.0
        ? "✓ 100% Board Standard! Excellent presentation matching Topper Sheet rubric."
        : "⚠️ Check your missing steps. Ensure Given Data, Formula, and SI Units are fully stated."
    });
  }

  // 4. MCQ Blitz Submission
  if (path === "student/blitz/submit") {
    const answers = body.answers || [];
    let score = 0;
    const results = answers.map((ans: any) => {
      const q = FALLBACK_QUESTIONS.find((item) => item.question_id === ans.question_id);
      const isCorrect = q ? ans.selected_option.toUpperCase() === q.correct_option.toUpperCase() : true;
      if (isCorrect) {
        score += 1;
      } else if (q) {
        const alreadyInVault = liveMistakeVault.some((m) => m.question_id === q.question_id);
        if (!alreadyInVault) {
          liveMistakeVault.push({
            id: `MSTK-${Date.now().toString().slice(-4)}`,
            question_id: q.question_id,
            subject: q.subject,
            grade: q.grade,
            chapter_name: q.chapter_name,
            text_en: q.text_en,
            user_answer: ans.selected_option,
            correct_option: q.correct_option,
            examiner_trap: q.trap_note || "Remember to review fundamental definitions and formula units.",
            missed_at: new Date().toISOString(),
            retry_available_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            hours_left: 48
          });
        }
      }

      return {
        question_id: ans.question_id,
        text_en: q?.text_en || "Board Question",
        selected_option: ans.selected_option,
        correct_option: q?.correct_option || ans.selected_option,
        is_correct: isCorrect,
        solution_rubric: q?.solution_rubric || "Standard Board Solution",
        examiner_feedback: isCorrect
          ? "✓ Correct!"
          : `⚠️ Examiner Trap: ${q?.trap_note || "Remember to verify sign rules and fundamental SI units."}`,
        examiner_trap: isCorrect ? null : (q?.trap_note || "Examiner Trap: Remember to verify sign rules and fundamental SI units.")
      };
    });

    const total = answers.length || 5;
    const pct = Math.round((score / total) * 100);

    return NextResponse.json({
      score,
      total,
      percentage: pct,
      total_questions: total,
      correct_answers: score,
      score_percentage: pct,
      results,
      vault_saved_count: liveMistakeVault.length
    });
  }

  // 4b. Clear Mistake Vault Item
  if (path === "student/vault/clear") {
    const qid = body.question_id;
    if (qid) {
      liveMistakeVault = liveMistakeVault.filter((m) => m.question_id !== qid);
    } else {
      liveMistakeVault = [];
    }
    return NextResponse.json({ status: "success", remaining_count: liveMistakeVault.length });
  }

  // 4c. Add to Mistake Vault Directly
  if (path === "student/vault") {
    if (body.question_id) {
      liveMistakeVault.push({
        id: `MSTK-${Date.now().toString().slice(-4)}`,
        question_id: body.question_id,
        subject: body.subject || "Physics",
        grade: body.grade || 10,
        chapter_name: body.chapter_name || "General",
        text_en: body.text_en || "Practice Question",
        user_answer: body.user_answer || "A",
        correct_option: body.correct_option || "B",
        examiner_trap: body.examiner_trap || "Examiner Trap Alert",
        missed_at: new Date().toISOString(),
        retry_available_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        hours_left: 48
      });
    }
    return NextResponse.json({ status: "success", vault_count: liveMistakeVault.length });
  }

  // 5. Escalate Doubt
  if (path === "student/doubt/escalate") {
    const newDoubt = {
      id: `DBT-2026-${Date.now().toString().slice(-3)}`,
      student_name: "Areeba Tariq",
      class_grade: 10,
      section: "A",
      subject: body.subject || "Physics",
      topic: body.topic || "Exam Inquiry",
      student_query: body.student_attempt_summary || "Student requested clarification",
      campus: "Saddar",
      student_attempt_summary: body.student_attempt_summary || "Student requested clarification",
      misconception: body.misconception || "",
      status: "pending",
      teacher_reply: null,
      created_at: new Date().toISOString()
    };
    const role = roleFromRequest(req);
    const student = role === "student_09" ? USER_PROFILES.student_09 : USER_PROFILES.student_10;
    Object.assign(newDoubt, { student_name: student.full_name, class_grade: student.class_grade, section: student.section });
    liveDoubts.unshift(newDoubt);
    return NextResponse.json({
      status: "success",
      message: "Your doubt has been sent to Sir Farhan Ahmed (Saddar Campus, Physics)."
    });
  }

  // 6. Teacher replies to a doubt
  const replyMatch = path.match(/^teacher\/doubts\/([^/]+)\/reply$/);
  if (replyMatch) {
    const denied = requireStaff(req);
    if (denied) return denied;
    const doubt = liveDoubts.find((d) => String(d.id) === replyMatch[1]);
    if (!doubt) return NextResponse.json({ detail: "Doubt not found" }, { status: 404 });
    const reply = String(body.teacher_reply || "").trim();
    if (!reply) return NextResponse.json({ detail: "Reply text is required" }, { status: 400 });
    doubt.teacher_reply = reply;
    doubt.status = "answered";
    return NextResponse.json({ status: "success", doubt });
  }

  // 7. Teacher pins a gold note
  if (path === "teacher/gold-notes") {
    const denied = requireStaff(req);
    if (denied) return denied;
    const topic = String(body.topic || "").trim();
    const tip = String(body.gold_tip_text || "").trim();
    if (!topic || !tip) return NextResponse.json({ detail: "Topic and tip are both required" }, { status: 400 });
    const note = {
      id: Date.now(),
      teacher_name: body.teacher_name || "Sir Farhan Ahmed",
      campus: body.campus || "Saddar",
      class_grade: Number(body.class_grade) || 10,
      subject: body.subject || "Physics",
      topic,
      gold_tip_text: tip,
      created_at: new Date().toISOString(),
    };
    liveGoldNotes.unshift(note);
    return NextResponse.json(note);
  }

  // 8. Teacher awards a badge
  if (path === "teacher/award-badge") {
    const denied = requireStaff(req);
    if (denied) return denied;
    const url = new URL(req.url);
    const studentId = Number(url.searchParams.get("student_id") || body.student_id);
    if (!studentId) return NextResponse.json({ detail: "student_id is required" }, { status: 400 });
    awardedBadges.push({
      student_id: studentId,
      badge_slug: url.searchParams.get("badge_slug") || body.badge_slug || "teachers_pride",
      endorsement_note: url.searchParams.get("endorsement_note") || body.endorsement_note || "",
      awarded_at: new Date().toISOString(),
    });
    return NextResponse.json({ status: "success" });
  }

  return NextResponse.json({ detail: `Unknown endpoint: ${path}` }, { status: 404 });
}
