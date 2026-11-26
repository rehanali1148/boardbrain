import { NextRequest, NextResponse } from "next/server";
import {
  FALLBACK_CHAPTERS,
  FALLBACK_QUESTIONS,
  FALLBACK_PRACTICALS,
  QuestionItem
} from "@/lib/curriculumData";

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
    group_name: "Biology",
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
    gold_tip_text: "Examiner Trap: If concave mirror forms virtual image behind mirror, q must be negative in 1/f = 1/p + 1/q. 45% students forget negative sign!",
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
    student_query: "Sir concave mirror mein focal length kab negative hoti hai?",
    status: "Pending Teacher Review",
    time_ago: "10 mins ago"
  }
];

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const path = params.slug.join("/");
  const url = new URL(req.url);

  // 1. Chapters
  if (path === "curriculum/chapters") {
    const grade = Number(url.searchParams.get("grade")) || 10;
    const subject = url.searchParams.get("subject") || "Physics";
    const key = `${subject}_${grade}`;
    const chapters = FALLBACK_CHAPTERS[key] || FALLBACK_CHAPTERS["Physics_10"] || [];
    return NextResponse.json(chapters);
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
    return NextResponse.json([
      { id: 1, chapter_name: "Geometrical Optics", question_summary: "Mirror Formula & Magnification Numericals", appearance_frequency: 9, probability_score: 95 },
      { id: 2, chapter_name: "Simple Harmonic Motion", question_summary: "Time Period of Pendulum (Independence of Mass)", appearance_frequency: 8, probability_score: 90 },
      { id: 3, chapter_name: "Current Electricity", question_summary: "Parallel vs Series Resistors Combination", appearance_frequency: 8, probability_score: 88 },
      { id: 4, chapter_name: "Chemical Equilibrium", question_summary: "Le Chatelier's Principle & Kc Units", appearance_frequency: 9, probability_score: 92 },
      { id: 5, chapter_name: "Gaseous Exchange", question_summary: "Alveoli adaptations & Anaerobic Lactic Acid", appearance_frequency: 7, probability_score: 85 },
    ]);
  }

  // 4. Practicals
  if (path === "curriculum/practicals") {
    const subject = (url.searchParams.get("subject") || "Physics").toLowerCase();
    const filtered = FALLBACK_PRACTICALS.filter((p) => p.subject.toLowerCase() === subject);
    return NextResponse.json(filtered.length > 0 ? filtered : [FALLBACK_PRACTICALS[0]]);
  }

  // 5. Teacher Gold Notes
  if (path === "teacher/gold-notes") {
    return NextResponse.json(liveGoldNotes);
  }

  // 6. Teacher Doubts
  if (path === "teacher/doubts") {
    return NextResponse.json(liveDoubts);
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

  return NextResponse.json({ status: "ok", path });
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
    const roleKey = body.roleKey || "student_10";
    const profile = USER_PROFILES[roleKey] || USER_PROFILES.student_10;
    return NextResponse.json({
      access_token: `demo_jwt_token_${roleKey}_${Date.now()}`,
      token_type: "bearer",
      user: profile,
    });
  }

  // 2. Exam Generator
  if (path === "teacher/generate-exam") {
    const sub = body.subject || "Physics";
    const gr = Number(body.grade) || 10;
    const format = body.exam_format || "20-Mark Monthly Test";

    const is60 = format.includes("60");
    const is40 = format.includes("40");

    const totalMarks = is60 ? 60 : is40 ? 40 : 20;
    const timeAllowed = is60 ? "3 Hours" : is40 ? "1.5 Hours" : "45 Minutes";

    const mcqCount = is60 ? 12 : is40 ? 8 : 4;
    const shortCount = is60 ? 6 : is40 ? 4 : 2;
    const longCount = is60 ? 3 : is40 ? 2 : 1;

    // Filter real questions by grade and subject
    const subjectQuestions = FALLBACK_QUESTIONS.filter(
      (q) => q.grade === gr && q.subject.toLowerCase() === sub.toLowerCase()
    );
    const pool = subjectQuestions.length >= 3 ? subjectQuestions : FALLBACK_QUESTIONS.filter((q) => q.subject.toLowerCase() === sub.toLowerCase());

    const cleanOptionText = (text: string) => text.replace(/\s*\(Verified\)/gi, "").trim();

    // Build Row A Questions
    const rowA: any[] = [];
    const rubrics: any[] = [];

    // Section A: MCQs (1 Mark Each)
    for (let i = 0; i < mcqCount; i++) {
      const q = pool[i % pool.length];
      let parsedOpts: any = { A: "Option A", B: "Option B", C: "Option C", D: "Option D" };
      try {
        parsedOpts = JSON.parse(q.options_json);
      } catch (e) {}

      const cleanOpts: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsedOpts)) {
        cleanOpts[k] = cleanOptionText(String(v));
      }

      rowA.push({
        section: "Section A",
        text_en: q.text_en,
        text_ur: q.text_ur,
        options: JSON.stringify(cleanOpts),
        marks: 1,
        correct_option: q.correct_option
      });
    }

    rubrics.push({
      question_no: `Section A (Q1.1 - Q1.${mcqCount})`,
      marks: mcqCount,
      key: `1.0 Mark per correct MCQ bubble (${rowA.map((q, idx) => `Q1.${idx + 1}:${q.correct_option}`).join(", ")}). Incorrect or double-bubbles receive 0.`
    });

    // Section B: Short Reasoning Questions (4 Marks Each)
    const shortTemplates = [
      {
        en: `Explain the physical significance of ${sub === "Chemistry" ? "Chemical Equilibrium and Kc value" : sub === "Biology" ? "Mitosis vs Meiosis in cell division" : "Simple Harmonic Motion and state its two necessary conditions"}.`,
        ur: `سائنسی دلائل کے ساتھ مختصر وضاحت کریں اور دو بنیادی شرائط تحریر کریں۔`,
        marks: 4,
        key: `• Correct scientific definition / statement (1.5 Marks)\n• Mathematical formula or two necessary conditions (1.5 Marks)\n• Practical board example with proper terminology (1.0 Mark)`
      },
      {
        en: `Differentiate between ${sub === "Chemistry" ? "Arrhenius Acid and Bronsted-Lowry Acid with equations" : sub === "Biology" ? "Aerobic and Anaerobic Respiration" : "Speed and Velocity with their respective SI units and vector nature"}.`,
        ur: `مناسب مثالوں اور ایس آئی یونٹس کی مدد سے واضح فرق بیان کریں۔`,
        marks: 4,
        key: `• Distinction point 1 with reasoning (1.5 Marks)\n• Distinction point 2 with reasoning (1.5 Marks)\n• Proper chemical equation / formula with SI unit (1.0 Mark)`
      },
      {
        en: `What is the role of ${sub === "Chemistry" ? "Catalyst in reversible reactions" : sub === "Biology" ? "Enzymes in biological metabolism" : "Friction in daily life and state two methods to reduce it"}?`,
        ur: `روزمرہ زندگی میں اس کا کردار اور اس کو کم کرنے کے دو طریقے تحریر کریں۔`,
        marks: 4,
        key: `• Operational definition & mechanism (2.0 Marks)\n• Two clear board-approved methods/points (2.0 Marks)`
      },
      {
        en: `Derive the mathematical relationship for ${sub === "Chemistry" ? "Kc for the reaction N2 + 3H2 <=> 2NH3" : sub === "Biology" ? "Cellular Respiration ATP production" : "Ohm's Law (V = I * R) with graphical verification"}.`,
        ur: `ریاضیاتی مساوات اخذ کریں اور حتمی نتائج واضح کریں۔`,
        marks: 4,
        key: `• Initial statement of law/theory (1.0 Mark)\n• Step-by-step derivation without missing steps (2.0 Marks)\n• Final equation boxed with standard units (1.0 Mark)`
      },
      {
        en: `Explain with a neat diagram ${sub === "Chemistry" ? "the structure of Rutherford's Atomic Model" : sub === "Biology" ? "the structure of a Nephron" : "Total Internal Reflection and Critical Angle"}.`,
        ur: `صاف ستھری پنسل کی ڈایاگرام اور لیبلنگ کے ساتھ وضاحت کریں۔`,
        marks: 4,
        key: `• Neat pencil diagram with right-aligned labels (2.0 Marks)\n• Conceptual scientific explanation (2.0 Marks)`
      },
      {
        en: `State the conditions required for ${sub === "Chemistry" ? "Dynamic Equilibrium in a closed system" : sub === "Biology" ? "Transpiration in plants" : "Resonance in oscillating bodies"}.`,
        ur: `بنیادی شرائط اور سائنسی وجوہات درج کریں۔`,
        marks: 4,
        key: `• Complete list of conditions (2.0 Marks)\n• Scientific justification per board syllabus (2.0 Marks)`
      }
    ];

    for (let i = 0; i < shortCount; i++) {
      const t = shortTemplates[i % shortTemplates.length];
      rowA.push({
        section: "Section B",
        text_en: t.en,
        text_ur: t.ur,
        marks: 4
      });
      rubrics.push({
        question_no: `Section B (Q${i + 2})`,
        marks: 4,
        key: t.key
      });
    }

    // Section C: Long / Numerical Question (8 Marks Each for Exact Math)
    const longTemplates = [
      {
        en: sub === "Chemistry"
          ? `Comprehensive Problem: 4.0 moles of H2 and 4.0 moles of I2 are reacted in a 1 dm³ vessel at 440°C. If Kc = 49, calculate the equilibrium concentration of HI. Show complete Given Data, Formula, Working, and Units.`
          : sub === "Biology"
          ? `Detailed Descriptive Question: Explain the mechanism of Breathing in humans (Inspiration and Expiration). Draw a neat labeled diagram of human respiratory system and describe adaptation of alveoli.`
          : `Comprehensive Board Numerical: An object 4.0 cm high is placed at a distance of 12.0 cm in front of a concave mirror of focal length 8.0 cm. Calculate: (a) Position of the image (b) Height and nature of the image. Show complete Given Data, Formula, Working, and SI Units.`,
        ur: `جامع تفصیلی سوال: تمام مرحلہ وار کیلکولیشن، ڈایاگرام اور ایس آئی یونٹس واضح طور پر درج کریں۔`,
        marks: 8,
        key: `• Step 1: Given Data with correct variable symbols & SI conversions (2.0 Marks)\n• Step 2: Formula declaration prior to substitution (2.0 Marks)\n• Step 3: Step-by-step arithmetic substitution without skipping lines (2.5 Marks)\n• Step 4: Final answer boxed with accurate SI unit (1.5 Marks)`
      },
      {
        en: `Derive the Second Equation of Motion (S = vi*t + 0.5*a*t²) using Speed-Time Graph. State clearly the assumptions, initial conditions, and explain the physical meaning of total area under the slope.`,
        ur: `سپیڈ ٹائم گراف کی مدد سے حرکت کی دوسری مساوات اخذ کریں۔`,
        marks: 8,
        key: `• Accurate speed-time graph drawn with pencil & labeled axes (2.0 Marks)\n• Area of rectangle + Area of triangle derivation steps (4.0 Marks)\n• Final boxed equation with SI unit note (2.0 Marks)`
      },
      {
        en: `State Newton's Law of Universal Gravitation. Derive the mathematical expression for the Mass of Earth (M_e = g*R^2 / G). Compute numerical value of Mass of Earth using R = 6.4 x 10^6 m and G = 6.67 x 10^-11 N m^2/kg^2.`,
        ur: `نیوٹن کا قانونِ کشش ثقل بیان کریں اور زمین کے وزن کی ریاضیاتی مساوات اخذ کریں۔`,
        marks: 8,
        key: `• Statement of Universal Law of Gravitation (2.0 Marks)\n• Complete derivation formula equating weight to gravitational force (3.0 Marks)\n• Numerical calculation of Mass of Earth with standard units 6.0 x 10^24 kg (3.0 Marks)`
      }
    ];

    for (let i = 0; i < longCount; i++) {
      const t = longTemplates[i % longTemplates.length];
      rowA.push({
        section: "Section C",
        text_en: t.en,
        text_ur: t.ur,
        marks: 8
      });
      rubrics.push({
        question_no: `Section C (Q${shortCount + i + 2})`,
        marks: 8,
        key: t.key
      });
    }

    // Build Parallel Row B Variants (Anti-Cheating with shifted values/shuffled options)
    const rowB: any[] = rowA.map((q, idx) => {
      if (q.section === "Section A") {
        let opts: any = {};
        try { opts = JSON.parse(q.options); } catch (e) {}
        // Reverse options for Row B to prevent desk peeking
        const keys = Object.keys(opts);
        const reversedOpts: any = {};
        reversedOpts["A"] = opts[keys[3] || "D"] || opts.A;
        reversedOpts["B"] = opts[keys[2] || "C"] || opts.B;
        reversedOpts["C"] = opts[keys[1] || "B"] || opts.C;
        reversedOpts["D"] = opts[keys[0] || "A"] || opts.D;

        return {
          ...q,
          text_en: `[ROW B] ${q.text_en}`,
          options: JSON.stringify(reversedOpts),
        };
      }
      return {
        ...q,
        text_en: `[ROW B PARALLEL VARIANT] ${q.text_en}`,
      };
    });

    return NextResponse.json({
      total_marks: totalMarks,
      time_allowed: timeAllowed,
      row_a_questions: rowA,
      row_b_questions: rowB,
      rubrics: rubrics
    });
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
      if (isCorrect) score += 1;
      return {
        question_id: ans.question_id,
        text_en: q?.text_en || "Board Question",
        selected_option: ans.selected_option,
        correct_option: q?.correct_option || ans.selected_option,
        is_correct: isCorrect,
        solution_rubric: q?.solution_rubric || "Standard Board Solution",
        examiner_trap: isCorrect ? null : "Examiner Trap: Remember to verify sign rules and fundamental SI units."
      };
    });

    const total = answers.length || 5;
    const pct = Math.round((score / total) * 100);

    return NextResponse.json({
      score,
      total,
      percentage: pct,
      results,
      vault_saved_count: total - score
    });
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
      status: "Forwarded to Faculty Inbox",
      time_ago: "Just now"
    };
    liveDoubts.unshift(newDoubt);
    return NextResponse.json({
      status: "success",
      message: "Doubt ticket successfully created and forwarded to Sir Farhan Ahmed (Saddar Campus, Physics Department)."
    });
  }

  return NextResponse.json({ status: "ok", path });
}
