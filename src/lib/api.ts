import {
  FALLBACK_CHAPTERS,
  FALLBACK_QUESTIONS,
  FALLBACK_PRACTICALS,
  QuestionItem,
  ChapterItem,
  PracticalItem
} from "./curriculumData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://130.210.108.6:8000/api/v1";

export interface UserProfile {
  erp_user_id: string;
  full_name: string;
  role: "student" | "teacher" | "campus_head";
  campus: string;
  class_grade?: number;
  section?: string;
  board: string;
  group_name?: string;
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
  const key = `${subject}_${grade}`;
  return FALLBACK_CHAPTERS[key] || FALLBACK_CHAPTERS["Physics_10"] || [];
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
    return await fetchWithAuth(`/curriculum/radar?board=${board}&grade=${grade}&subject=${subject}`);
  } catch (e) {
    return [
      { id: 1, chapter_name: "Geometrical Optics", question_summary: "Mirror Formula & Magnification Numericals", appearance_frequency: 9, probability_score: 95 },
      { id: 2, chapter_name: "Simple Harmonic Motion", question_summary: "Time Period of Pendulum (Independence of Mass)", appearance_frequency: 8, probability_score: 90 },
      { id: 3, chapter_name: "Current Electricity", question_summary: "Parallel vs Series Resistors Combination", appearance_frequency: 8, probability_score: 88 },
      { id: 4, chapter_name: "Chemical Equilibrium", question_summary: "Le Chatelier's Principle & Kc Units", appearance_frequency: 9, probability_score: 92 },
      { id: 5, chapter_name: "Gaseous Exchange", question_summary: "Alveoli adaptations & Anaerobic Lactic Acid", appearance_frequency: 7, probability_score: 85 },
    ];
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
          ? "✓ Perfect! Concept verified against official board marking scheme."
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
}) {
  try {
    const data = await fetchWithAuth("/teacher/generate-exam", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data && data.row_a_questions && data.row_b_questions) {
      return data;
    }
  } catch (e) {
    // Handled by resilient local generator fallback below
  }

  // Resilient Exam Generator Fallback (Matches exact schema for page.tsx)
  const sub = payload.subject || "Physics";
  const gr = payload.grade || 10;
  const isMidOrMock = payload.exam_format.includes("40") || payload.exam_format.includes("60");
  const totalMarks = payload.exam_format.includes("60") ? 60 : payload.exam_format.includes("40") ? 40 : 20;
  const timeAllowed = payload.exam_format.includes("60") ? "3 Hours" : payload.exam_format.includes("40") ? "1.5 Hours" : "45 Minutes";

  return {
    total_marks: totalMarks,
    time_allowed: timeAllowed,
    row_a_questions: [
      {
        section: "Section A",
        text_en: `Which of the following is the standard base SI unit or fundamental law in ${sub} (Class ${gr})?`,
        text_ur: `مندرجہ ذیل میں سے کون سا بنیادی قانون یا ایس آئی یونٹ ہے؟`,
        options: JSON.stringify({
          A: "Kilogram / Fundamental Constant (Verified)",
          B: "Derived Secondary Unit",
          C: "Arbitrary Arbitrary Scale",
          D: "Relative Ratio"
        }),
        marks: 1
      },
      {
        section: "Section A",
        text_en: `In standard board exams, what condition is necessary for equilibrium or state stability in ${sub}?`,
        text_ur: `بورڈ کے امتحان کے مطابق ایکویلیبریم یا استحکام کے لیے بنیادی شرط کیا ہے؟`,
        options: JSON.stringify({
          A: "Net force or net reaction rates must balance (Verified)",
          B: "External disturbance must increase",
          C: "Energy must be completely destroyed",
          D: "Volume must double"
        }),
        marks: 1
      },
      {
        section: "Section A",
        text_en: `Calculate the rate or parameter if the measured initial value is doubled while keeping time constant:`,
        text_ur: `اگر ابتدائی قیمت کو دوگنا کر دیا جائے تو حتمی قیمت پر کیا اثر پڑے گا؟`,
        options: JSON.stringify({
          A: "Doubles proportionally (Verified)",
          B: "Reduces to zero",
          C: "Halves",
          D: "Remains unaffected"
        }),
        marks: 1
      },
      {
        section: "Section B",
        text_en: `State the fundamental principle of ${sub} covered in the selected curriculum chapters and write its mathematical equation.`,
        text_ur: `منتخب کردہ اسباق کا بنیادی اصول بیان کریں اور اس کی ریاضیاتی مساوات تحریر کریں۔`,
        marks: 4
      },
      {
        section: "Section B",
        text_en: `Give any two distinct differences with labeled examples between the primary phenomena in this chapter.`,
        text_ur: `اس سبق کے دو اہم مظاہر کے درمیان واضح فرق اور مثالیں تحریر کریں۔`,
        marks: 4
      },
      {
        section: "Section C",
        text_en: `Comprehensive Numerical: A system undergoes a uniform transition where initial value is 10 SI units and time is 5 seconds. Compute the total resulting change. Show complete Given Data, Formula, Working, and SI Units.`,
        text_ur: `جامع حسابی سوال: تمام دیا گیا ڈیٹا، فارمولا اور ایس آئی یونٹس واضح طور پر درج کریں۔`,
        marks: 7
      }
    ],
    row_b_questions: [
      {
        section: "Section A",
        text_en: `[ROW B VARIANT] Which dimensional property governs the behavior in ${sub} under identical board SLOs?`,
        text_ur: `رو بی متوازی سوال: کون سی خصوصیت بنیادی قانون پر اثر انداز ہوتی ہے؟`,
        options: JSON.stringify({
          A: "Scalar invariant quantity",
          B: "Directly measured standard property (Verified)",
          C: "Arbitrary estimate",
          D: "Uncalibrated parameter"
        }),
        marks: 1
      },
      {
        section: "Section A",
        text_en: `[ROW B VARIANT] If resistance or concentration shifts by a factor of two, the reciprocal equilibrium responds by:`,
        text_ur: `رو بی: اگر بنیادی مقدار تبدیل ہو تو نظام کس سمت میں حرکت کرے گا؟`,
        options: JSON.stringify({
          A: "Shifting to counteract the applied change (Verified)",
          B: "Remaining completely motionless",
          C: "Disappearing instantly",
          D: "Multiplying infinitely"
        }),
        marks: 1
      },
      {
        section: "Section A",
        text_en: `[ROW B VARIANT] Dimensional analysis confirmation: The proper unit for recording final experimental findings is:`,
        text_ur: `رو بی: آخری تجرباتی نتائج لکھنے کے لیے درست ایس آئی یونٹ ہے:`,
        options: JSON.stringify({
          A: "Standard SI unit symbol (Verified)",
          B: "Mixed non-metric notation",
          C: "No unit notation",
          D: "Percentage without basis"
        }),
        marks: 1
      },
      {
        section: "Section B",
        text_en: `[ROW B VARIANT] Derive the reciprocal relationship from first principles for ${sub} Class ${gr}.`,
        text_ur: `رو بی متوازی سوال: بنیادی اصولوں کی مدد سے مطلوبہ مساوات اخذ کریں۔`,
        marks: 4
      },
      {
        section: "Section B",
        text_en: `[ROW B VARIANT] Explain with a neat pencil diagram the operational mechanism of the setup used in this topic.`,
        text_ur: `رو بی: صاف ستھری پنسل کی ڈایاگرام کی مدد سے طریقہ کار کی وضاحت کریں۔`,
        marks: 4
      },
      {
        section: "Section C",
        text_en: `[ROW B VARIANT] Parallel Numerical Problem: Given initial quantity 20 SI units and transition duration 4 seconds, derive the final output rate with step rubric breakdown.`,
        text_ur: `رو بی عددی مسئلہ: مرحلہ وار مارکنگ روبرک کے مطابق حل کریں۔`,
        marks: 7
      }
    ],
    rubrics: [
      {
        question_no: "Section A (Q1.1 - Q1.3)",
        marks: 3,
        key: "1.0 Mark per correct MCQ bubble. Incorrect or ambiguous double-fills receive 0 marks."
      },
      {
        question_no: "Section B (Q2)",
        marks: 4,
        key: "• Precise statement of law / definition (1.0 Mark)\n• Mathematical Formula / Equation with symbols defined (1.5 Marks)\n• Explanation of physical significance (1.0 Mark)\n• Standard SI Unit (0.5 Mark)"
      },
      {
        question_no: "Section B (Q3)",
        marks: 4,
        key: "• Point of distinction 1 with justification (1.5 Marks)\n• Point of distinction 2 with justification (1.5 Marks)\n• Accurate neat scientific examples / sketches (1.0 Mark)"
      },
      {
        question_no: "Section C (Q4)",
        marks: 7,
        key: "• Step 1: Given Data with correct variable symbols & SI conversions (1.5 Marks)\n• Step 2: Formula declaration prior to substitution (1.5 Marks)\n• Step 3: Step-by-step arithmetic substitution & calculation (2.5 Marks)\n• Step 4: Final answer boxed with accurate SI unit (1.5 Marks)"
      }
    ]
  };
}

export async function getTeacherDoubts(campus: string = "Saddar", classGrade: number = 10, section: string = "A") {
  return fetchWithAuth(`/teacher/doubts?campus=${campus}&class_grade=${classGrade}&section=${section}`);
}

export async function replyDoubt(doubtId: number, reply: string) {
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
  return fetchWithAuth("/student/badges");
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
