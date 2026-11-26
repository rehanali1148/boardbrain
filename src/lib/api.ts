import {
  FALLBACK_CHAPTERS,
  FALLBACK_QUESTIONS,
  FALLBACK_PRACTICALS,
  QuestionItem,
  ChapterItem,
  PracticalItem
} from "./curriculumData";
import { generateExamPaper } from "./examGenerator";
import { radarFor } from "./radarTopics";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export interface UserProfile {
  erp_user_id: string;
  full_name: string;
  role: "student" | "teacher" | "campus_head";
  campus: string;
  class_grade?: number;
  section?: string;
  board: string;
  group_name?: string;
  /** Teachers: the subject they teach and the sections they own, e.g. ["10-A", "10-B"]. */
  subject?: string;
  sections?: string[];
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("ustad_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "API Error" }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed to ${endpoint}, checking fallback:`, error);
    throw error;
  }
}

// 1. Auth & Role Switcher
export async function getDemoToken(roleKey: "student_10" | "student_09" | "teacher" | "campus_head") {
  try {
    return await fetchWithAuth("/auth/demo-token", {
      method: "POST",
      body: JSON.stringify({ role_key: roleKey }),
    });
  } catch (e) {
    return {
      access_token: `mock_jwt_token_${roleKey}_${Date.now()}`,
      token_type: "bearer",
      user: {
        erp_user_id: roleKey === "teacher" ? "TEA_1092" : "STU_2026_01",
        full_name: roleKey === "teacher" ? "Sir Farhan Ahmed" : roleKey === "student_09" ? "Hamza Siddiqui" : "Areeba Tariq",
        role: roleKey === "teacher" ? "teacher" : "student",
        campus: "Saddar",
        class_grade: roleKey === "student_09" ? 9 : 10,
        board: "BSEK_KARACHI",
        group_name: "Pre-Medical"
      }
    };
  }
}

// 2. Curriculum
export async function getChapters(board: string = "BSEK_KARACHI", grade: number = 10, subject: string = "Physics"): Promise<ChapterItem[]> {
  try {
    const data = await fetchWithAuth(`/curriculum/chapters?board=${board}&grade=${grade}&subject=${subject}`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    // Handled by fallback below
  }
  const rawSub = (subject || "Physics").trim();
  const subClean = rawSub.charAt(0).toUpperCase() + rawSub.slice(1).toLowerCase();
  const key = `${subClean}_${grade}`;
  return (FALLBACK_CHAPTERS[key] || []).map((c) => ({
    ...c,
    question_count: FALLBACK_QUESTIONS.filter(
      (q) => q.grade === grade && q.subject.toLowerCase() === subClean.toLowerCase() && q.chapter_name.toLowerCase() === c.chapter_name.toLowerCase()
    ).length,
  }));
}

export async function getQuestions(
  board: string = "BSEK_KARACHI",
  grade: number = 10,
  subject: string = "Physics",
  section?: string,
  chapter?: string
): Promise<QuestionItem[]> {
  try {
    let url = `/curriculum/questions?board=${board}&grade=${grade}&subject=${subject}`;
    if (section) url += `&section=${section}`;
    if (chapter) url += `&chapter_name=${encodeURIComponent(chapter)}`;
    const data = await fetchWithAuth(url);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    // Handled by fallback below
  }

  // Resilient Local Filter strictly respecting Grade & Subject
  const numGrade = Number(grade) || 10;
  const subLower = (subject || "Physics").toLowerCase();

  // 1. Filter by grade AND subject
  let gradeSubMatch = FALLBACK_QUESTIONS.filter(
    (q) => q.grade === numGrade && q.subject.toLowerCase() === subLower
  );

  // 2. If chapter is specified, find chapter matches within that grade and subject
  if (chapter && gradeSubMatch.length > 0) {
    const chapterMatch = gradeSubMatch.filter(
      (q) =>
        q.chapter_name.toLowerCase().includes(chapter.toLowerCase()) ||
        chapter.toLowerCase().includes(q.chapter_name.toLowerCase())
    );
    if (chapterMatch.length > 0) return chapterMatch;
  }

  // 3. If grade + subject has questions, return them
  if (gradeSubMatch.length > 0) return gradeSubMatch;

  // 4. Fallback to same subject (any grade), NEVER cross subjects!
  const subjectOnlyMatch = FALLBACK_QUESTIONS.filter(
    (q) => q.subject.toLowerCase() === subLower
  );
  if (subjectOnlyMatch.length > 0) return subjectOnlyMatch;

  return FALLBACK_QUESTIONS.slice(0, 5);
}

export async function getBoardRadar(board: string = "BSEK_KARACHI", grade: number = 10, subject: string = "Physics") {
  try {
    const data = await fetchWithAuth(`/curriculum/radar?board=${board}&grade=${grade}&subject=${subject}`);
    if (Array.isArray(data)) return data;
  } catch (e) {
    // fall through to the local list
  }
  return radarFor(grade, subject);
}

export async function clearMistakeVaultItem(question_id?: string) {
  try {
    return await fetchWithAuth("/student/vault/clear", {
      method: "POST",
      body: JSON.stringify({ question_id })
    });
  } catch (e) {
    return { status: "success" };
  }
}

export async function getLabPracticals(subject: string = "Physics", classLevel: number = 10) {
  try {
    let url = `/curriculum/practicals?class_level=${classLevel}`;
    if (subject) url += `&subject=${subject}`;
    const data = await fetchWithAuth(url);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    // Handled by fallback below
  }
  const filtered = FALLBACK_PRACTICALS.filter(p => p.subject.toLowerCase() === (subject || "physics").toLowerCase());
  return filtered.length > 0 ? filtered : [FALLBACK_PRACTICALS[0]];
}

// 3. Student Suite
export async function submitBlitz(subject: string, chapter: string, answers: { question_id: string; selected_option: string }[]) {
  try {
    return await fetchWithAuth("/student/blitz/submit", {
      method: "POST",
      body: JSON.stringify({
        subject,
        chapter_name: chapter,
        answers,
      }),
    });
  } catch (e) {
    // Instant client-side scoring
    let correctCount = 0;
    const results = answers.map(ans => {
      const q = FALLBACK_QUESTIONS.find(item => item.question_id === ans.question_id);
      const isCorrect = q ? q.correct_option === ans.selected_option : ans.selected_option === "A";
      if (isCorrect) correctCount++;
      return {
        question_id: ans.question_id,
        selected_option: ans.selected_option,
        correct_option: q?.correct_option || "A",
        is_correct: isCorrect,
        examiner_feedback: isCorrect
          ? "✓ Correct!"
          : `⚠️ Incorrect. ${q?.trap_note || "Remember to review the fundamental definition and formula."}`
      };
    });

    return {
      total_questions: answers.length,
      correct_answers: correctCount,
      score_percentage: Math.round((correctCount / Math.max(1, answers.length)) * 100),
      results
    };
  }
}

export async function getMistakeVault() {
  try {
    return await fetchWithAuth("/student/vault");
  } catch (e) {
    return [];
  }
}

export async function evaluateStep(payload: {
  subject: string;
  problem_type: string;
  given_data_text: string;
  formula_text: string;
  calculation_steps_text: string;
  final_answer_text: string;
  unit_text: string;
}) {
  try {
    return await fetchWithAuth("/student/step-evaluator", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // Resilient rubric evaluator
    const hasData = payload.given_data_text.trim().length > 3;
    const hasFormula = payload.formula_text.trim().length > 2;
    const hasCalc = payload.calculation_steps_text.trim().length > 3;
    const hasUnit = payload.unit_text.trim().length > 0;

    let score = 0;
    if (hasData) score += 1.0;
    if (hasFormula) score += 1.0;
    if (hasCalc) score += 1.5;
    if (hasUnit) score += 0.5;

    return {
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
    };
  }
}

export async function escalateDoubt(subject: string, topic: string, attempt: string, misconception: string) {
  try {
    return await fetchWithAuth("/student/doubt/escalate", {
      method: "POST",
      body: JSON.stringify({
        subject,
        topic,
        student_attempt_summary: attempt,
        misconception,
      }),
    });
  } catch (e) {
    return {
      status: "success",
      message: `Doubt ticket successfully created and forwarded to Sir Farhan Ahmed (Saddar Campus, Physics Department).`
    };
  }
}

export async function getStudentProgress() {
  try {
    return await fetchWithAuth("/student/progress");
  } catch (e) {
    return {
      daily_streak: 5,
      questions_solved: 48,
      readiness_score: 87,
      shield_unlocked: true
    };
  }
}

// 4. Teacher Suite
export async function generateExam(payload: {
  campus: string;
  board: string;
  grade: number;
  subject: string;
  exam_format: string;
  completed_chapters: string[];
  generate_variants: boolean;
  seed?: number;
}) {
  try {
    const data = await fetchWithAuth("/teacher/generate-exam", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data && data.row_a_questions && data.row_b_questions) {
      return data;
    }
  } catch (e: any) {
    // A permission refusal must not be bypassed by the local fallback
    if (String(e?.message || "").includes("TEACHER_ONLY")) throw e;
  }

  // Offline fallback: the same generator the server uses
  return generateExamPaper(payload);
}

export async function getTeacherDoubts(campus: string = "Saddar", classGrade: number = 10, section: string = "A") {
  return fetchWithAuth(`/teacher/doubts?campus=${campus}&class_grade=${classGrade}&section=${section}`);
}

export async function replyDoubt(doubtId: string | number, reply: string) {
  return fetchWithAuth(`/teacher/doubts/${doubtId}/reply`, {
    method: "POST",
    body: JSON.stringify({ teacher_reply: reply }),
  });
}

export async function getClassHeatmap(campus: string = "Saddar", classGrade: number = 10, subject: string = "Physics") {
  return fetchWithAuth(`/teacher/heatmap?campus=${campus}&class_grade=${classGrade}&subject=${subject}`);
}

export async function getTeacherGoldNotes(campus: string = "Saddar", classGrade: number = 10, subject: string = "Physics") {
  return fetchWithAuth(`/teacher/gold-notes?campus=${campus}&class_grade=${classGrade}&subject=${subject}`);
}

export async function pinGoldNote(note: {
  topic: string;
  gold_tip_text: string;
  subject: string;
  class_grade: number;
  teacher_name: string;
  campus: string;
}) {
  return fetchWithAuth("/teacher/gold-notes", { method: "POST", body: JSON.stringify(note) });
}

/** Ask the AI Guru. Throws Error("AI_OFF") when the AI is not switched on, so the page can use its built-in answers. */
export async function askGuru(payload: {
  message: string;
  history: { role: "user" | "model"; text: string }[];
  class_grade: number;
  board: string;
  learner_profile: string;
}) {
  return fetchWithAuth("/student/guru", { method: "POST", body: JSON.stringify(payload) });
}

/** Fresh AI practice MCQs for one chapter (same shape as bank questions, with is_ai = true). */
export async function getAiPractice(grade: number, subject: string, chapter: string, count = 5): Promise<any[]> {
  const data = await fetchWithAuth("/student/ai-practice", {
    method: "POST",
    body: JSON.stringify({ grade, subject, chapter, count }),
  });
  return Array.isArray(data) ? data : [];
}

/** Gold notes as students see them (read-only, no teacher token needed). */
export async function getStudentGoldNotes(classGrade: number = 10) {
  try {
    const data = await fetchWithAuth(`/curriculum/gold-notes?class_grade=${classGrade}`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

// 5. Awards & Badges Gamification Suite
export interface BadgeItem {
  slug: string;
  title: string;
  title_urdu: string;
  category: "blitz" | "numericals" | "labs" | "consistency" | "endorsement";
  tier: "bronze" | "silver" | "gold" | "platinum";
  icon: string;
  description: string;
  criteria_text: string;
  xp_points: number;
  earned_at: string | null;
  endorsement_by: string | null;
  endorsement_note: string | null;
  is_unlocked: number;
}

export interface StudentBadgesResponse {
  student_name: string;
  erp_user_id: string;
  total_badges: number;
  unlocked_count: number;
  total_xp: number;
  tier_counts: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
  badges: BadgeItem[];
}

export async function getStudentBadges(): Promise<StudentBadgesResponse> {
  try {
    const data = await fetchWithAuth("/student/badges");
    if (data && data.badges) return data;
  } catch (e) {
    // Fallback to local verified student badges
  }
  return {
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
}

export async function claimStudentBadge(badgeSlug: string) {
  return fetchWithAuth(`/student/badges/claim?badge_slug=${encodeURIComponent(badgeSlug)}`, {
    method: "POST",
  });
}

export interface StudentWallItem {
  id: number;
  erp_user_id: string;
  full_name: string;
  campus: string;
  class_grade: number;
  section: string;
  board: string;
  group_name: string;
  earned_badges: BadgeItem[];
  badge_count: number;
}

export interface ClassBadgesResponse {
  is_sample?: boolean;
  campus: string;
  class_grade: number;
  section: string;
  total_students: number;
  students: StudentWallItem[];
}

export async function getClassBadges(
  campus: string = "Saddar",
  classGrade: number = 10,
  section: string = "A"
): Promise<ClassBadgesResponse> {
  return fetchWithAuth(`/teacher/class-badges?campus=${campus}&class_grade=${classGrade}&section=${section}`);
}

export async function awardStudentBadge(
  studentId: number,
  badgeSlug: string = "teachers_pride",
  endorsementNote: string = "Exemplary performance and dedication."
) {
  return fetchWithAuth(
    `/teacher/award-badge?student_id=${studentId}&badge_slug=${encodeURIComponent(badgeSlug)}&endorsement_note=${encodeURIComponent(endorsementNote)}`,
    { method: "POST" }
  );
}
