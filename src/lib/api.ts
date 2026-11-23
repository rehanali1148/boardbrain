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
  return fetchWithAuth("/auth/demo-token", {
    method: "POST",
    body: JSON.stringify({ role_key: roleKey }),
  });
}

// 2. Curriculum
export async function getChapters(board: string = "BSEK_KARACHI", grade: number = 10, subject: string = "Physics") {
  return fetchWithAuth(`/curriculum/chapters?board=${board}&grade=${grade}&subject=${subject}`);
}

export async function getQuestions(board: string = "BSEK_KARACHI", grade: number = 10, subject: string = "Physics", section?: string, chapter?: string) {
  let url = `/curriculum/questions?board=${board}&grade=${grade}&subject=${subject}`;
  if (section) url += `&section=${section}`;
  if (chapter) url += `&chapter_name=${encodeURIComponent(chapter)}`;
  return fetchWithAuth(url);
}

export async function getBoardRadar(board: string = "BSEK_KARACHI", grade: number = 10, subject: string = "Physics") {
  return fetchWithAuth(`/curriculum/radar?board=${board}&grade=${grade}&subject=${subject}`);
}

export async function getLabPracticals(subject?: string, classLevel: number = 10) {
  let url = `/curriculum/practicals?class_level=${classLevel}`;
  if (subject) url += `&subject=${subject}`;
  return fetchWithAuth(url);
}

// 3. Student Suite
export async function submitBlitz(subject: string, chapter: string, answers: { question_id: string; selected_option: string }[]) {
  return fetchWithAuth("/student/blitz/submit", {
    method: "POST",
    body: JSON.stringify({
      subject,
      chapter_name: chapter,
      answers,
    }),
  });
}

export async function getMistakeVault() {
  return fetchWithAuth("/student/vault");
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
  return fetchWithAuth("/student/step-evaluator", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function escalateDoubt(subject: string, topic: string, attempt: string, misconception: string) {
  return fetchWithAuth("/student/doubt/escalate", {
    method: "POST",
    body: JSON.stringify({
      subject,
      topic,
      student_attempt_summary: attempt,
      misconception,
    }),
  });
}

export async function getStudentProgress() {
  return fetchWithAuth("/student/progress");
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
  return fetchWithAuth("/teacher/generate-exam", {
    method: "POST",
    body: JSON.stringify(payload),
  });
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
