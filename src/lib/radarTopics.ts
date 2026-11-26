/**
 * High-yield topics per class and subject, chosen from the Sindh Textbook Board syllabus.
 * Deliberately has NO past-paper years or probabilities: those must come from real BSEK / AKU-EB papers,
 * which are not in the system yet. When real papers are added, fill `years_appeared` from them.
 */
export interface RadarTopic {
  id: string;
  grade: number;
  subject: "Physics" | "Chemistry" | "Biology";
  chapter_name: string;
  question_summary: string;
  why: string;
  question_types: string;
  years_appeared: number[];
}

const T = (grade: number, subject: RadarTopic["subject"], chapter_name: string, question_summary: string, why: string, question_types: string): RadarTopic => ({
  id: `${subject}-${grade}-${chapter_name}-${question_summary}`.replace(/\W+/g, "-").toLowerCase(),
  grade,
  subject,
  chapter_name,
  question_summary,
  why,
  question_types,
  years_appeared: [],
});

export const RADAR_TOPICS: RadarTopic[] = [
  // Physics 10
  T(10, "Physics", "Geometrical Optics", "Mirror and lens formula numericals (1/f = 1/p + 1/q, magnification)", "Numericals carry step marks, and sign mistakes are the most common way students lose them.", "MCQ • Short numerical • Long numerical"),
  T(10, "Physics", "Current Electricity", "Ohm's law and series/parallel resistance", "Builds every electricity question that follows; easy marks if the condition (constant temperature) is stated.", "MCQ • Short • Numerical"),
  T(10, "Physics", "Simple Harmonic Motion & Waves", "SHM conditions and the simple pendulum (T = 2π√(L/g))", "Definition-plus-formula questions that reward exact wording.", "MCQ • Short • Numerical"),
  T(10, "Physics", "Electrostatics", "Coulomb's law and electric field", "Core law with a formula and constant (k) that examiners check for units.", "MCQ • Short • Numerical"),
  T(10, "Physics", "Sound", "Echo, characteristics of sound and audible range", "Short definition questions with fixed values (0.1 s, 17 m, 20 Hz–20 kHz).", "MCQ • Short"),
  // Physics 9
  T(9, "Physics", "Kinematics", "Equations of motion and speed-time graphs", "The base for most Class 9 numericals; derivations are common long questions.", "MCQ • Numerical • Derivation"),
  T(9, "Physics", "Dynamics", "Newton's laws, momentum and friction", "Definitions plus numericals on F = ma and momentum.", "MCQ • Short • Numerical"),
  T(9, "Physics", "Turning Effect of Forces", "Torque and the two conditions of equilibrium", "Short questions that need both conditions stated exactly.", "MCQ • Short"),
  T(9, "Physics", "Gravitation", "Newton's law of gravitation and mass of the Earth", "Classic derivation with a numerical answer (≈ 6 × 10²⁴ kg).", "Short • Long"),
  T(9, "Physics", "Work & Energy", "Work, power and efficiency", "Formula questions with units (J, W) that are quick marks.", "MCQ • Numerical"),
  // Chemistry 10
  T(10, "Chemistry", "Chemical Equilibrium", "Law of mass action, Kc expressions and Le Chatelier's principle", "Writing Kc correctly and predicting shifts are frequent short questions.", "MCQ • Short • Numerical"),
  T(10, "Chemistry", "Acids, Bases and Salts", "Arrhenius, Brønsted-Lowry and Lewis concepts; pH", "Definitions with examples plus simple pH calculations.", "MCQ • Short • Numerical"),
  T(10, "Chemistry", "Hydrocarbons", "Alkanes, alkenes, alkynes: preparation and reactions", "Equation-writing questions; balanced equations earn the marks.", "MCQ • Short • Long"),
  T(10, "Chemistry", "Biochemistry", "Carbohydrates, proteins, lipids and their uses", "Classification questions that reward organised answers.", "MCQ • Short"),
  T(10, "Chemistry", "Environmental Chemistry", "Air pollutants, acid rain and ozone depletion", "Cause-and-effect questions with real-life examples.", "MCQ • Short"),
  // Chemistry 9
  T(9, "Chemistry", "Fundamentals of Chemistry", "Mole concept, Avogadro's number and formula calculations", "Mole calculations appear across the whole course.", "MCQ • Numerical"),
  T(9, "Chemistry", "Structure of Atoms", "Rutherford and Bohr models; electronic configuration", "Postulates and defects are standard long questions.", "MCQ • Short • Long"),
  T(9, "Chemistry", "Periodic Table & Periodicity", "Trends in atomic size, ionization energy and electronegativity", "Trend questions need the reason, not just the direction.", "MCQ • Short"),
  T(9, "Chemistry", "Structure of Molecules", "Ionic, covalent and coordinate bonds", "Difference questions with examples and dot-and-cross diagrams.", "MCQ • Short"),
  T(9, "Chemistry", "Solutions", "Molarity and solution preparation", "Numericals with units (mol dm⁻³) and lab method.", "MCQ • Numerical"),
  // Biology 10
  T(10, "Biology", "Gaseous Exchange", "Breathing mechanism, alveoli and respiration types", "Diagram plus explanation questions; labelling earns marks.", "MCQ • Short • Long"),
  T(10, "Biology", "Homeostasis", "Kidney, nephron and urine formation", "Labelled nephron diagram is a common long question.", "MCQ • Short • Long"),
  T(10, "Biology", "Coordination and Control", "Nervous system, reflex arc, eye and ear", "Diagrams and difference questions (voluntary vs reflex).", "MCQ • Short • Long"),
  T(10, "Biology", "Inheritance", "Mendel's laws and monohybrid crosses", "Punnett squares with correct ratios (3:1, 1:2:1).", "MCQ • Short • Long"),
  T(10, "Biology", "Reproduction", "Asexual and sexual reproduction in plants", "Definitions with named examples.", "MCQ • Short"),
  // Biology 9
  T(9, "Biology", "Cell Cycle", "Mitosis and meiosis", "Phases with diagrams and difference tables.", "MCQ • Short • Long"),
  T(9, "Biology", "Enzymes", "Enzyme properties, lock-and-key model and factors", "Graphs of temperature and pH effects are often asked.", "MCQ • Short • Long"),
  T(9, "Biology", "Cells and Tissues", "Cell organelles; prokaryotic vs eukaryotic cells", "Labelled cell diagrams and difference tables.", "MCQ • Short • Long"),
  T(9, "Biology", "Biodiversity", "Classification and binomial nomenclature", "Rules for scientific names are quick short-question marks.", "MCQ • Short"),
  T(9, "Biology", "Solving a Biological Problem", "Steps of the scientific method", "Ordered steps with the malaria example.", "MCQ • Short"),
];

export function radarFor(grade: number, subject: string): RadarTopic[] {
  return RADAR_TOPICS.filter((t) => t.grade === grade && t.subject.toLowerCase() === subject.toLowerCase());
}
