/**
 * REAL past papers: Board of Secondary Education Karachi (BSEK), typed from scans of the annual papers.
 * Source scans: ilmkidunya.com (kept on the BoardBrain server, ~/ustad_ai/ustad_past_papers/scans).
 *
 * MCQ answers were worked out by BoardBrain and checked one by one, NOT copied from the scans:
 * several scans tick the wrong option (e.g. 2023 neutrons in U-235: 143, not 145; 2024 DC motor: commutator,
 * not slip rings; 2021 weight of 5 kg: 49 N, not 4.9 N). Questions that were unreadable or ambiguous on the scan
 * were left out rather than guessed.
 *
 * paperGrade = the class whose board paper it is. topicGrade = the class whose syllabus the topic belongs to
 * (older Karachi Matric papers also tested Class 9 topics in the Class 10 paper).
 */

export type PaperSection = "A" | "B" | "C";

export interface PastQuestion {
  id: string;
  board: "BSEK";
  paperGrade: number;
  topicGrade: number;
  subject: string;
  year: number;
  section: PaperSection;
  qno: string;
  chapter: string;
  text: string;
  options?: string[]; // A-D for MCQs
  answer?: "A" | "B" | "C" | "D";
  marks?: number;
}

const L = ["A", "B", "C", "D"] as const;
const qs: PastQuestion[] = [];

/** MCQ */
function M(paperGrade: number, subject: string, year: number, qno: string, topicGrade: number, chapter: string, text: string, options: string[], answer: "A" | "B" | "C" | "D", marks = 1) {
  qs.push({ id: `BSEK-${paperGrade}-${subject.slice(0, 3).toUpperCase()}-${year}-A-${qno}`, board: "BSEK", paperGrade, topicGrade, subject, year, section: "A", qno, chapter, text, options, answer, marks });
}
/** Short (B) or long (C) question */
function Q(paperGrade: number, subject: string, year: number, section: "B" | "C", qno: string, topicGrade: number, chapter: string, text: string, marks?: number) {
  qs.push({ id: `BSEK-${paperGrade}-${subject.slice(0, 3).toUpperCase()}-${year}-${section}-${qno}`, board: "BSEK", paperGrade, topicGrade, subject, year, section, qno, chapter, text, marks });
}

// Chapter names (match the app's chapter lists where possible)
const SHM = "Simple Harmonic Motion & Waves", SOUND = "Sound", OPT = "Geometrical Optics", EST = "Electrostatics", CUR = "Current Electricity",
  EM = "Electromagnetism", ELN = "Introductory Electronics", ICT = "Information & Communication Technology", NUC = "Atomic & Nuclear Physics",
  EMW = "Electromagnetic Spectrum",
  PQ = "Physical Quantities & Measurement", KIN = "Kinematics", DYN = "Dynamics", TEF = "Turning Effect of Forces", GRAV = "Gravitation",
  WE = "Work & Energy", POM = "Properties of Matter", THERM = "Thermal Properties of Matter", VEC = "Vectors", MACH = "Simple Machines";

const P10 = (year: number, qno: string, tg: number, ch: string, t: string, o: string[], a: "A" | "B" | "C" | "D", marks = 1) => M(10, "Physics", year, qno, tg, ch, t, o, a, marks);
const S10 = (year: number, sec: "B" | "C", qno: string, tg: number, ch: string, t: string, marks?: number) => Q(10, "Physics", year, sec, qno, tg, ch, t, marks);

// ======================= CLASS 10 PHYSICS 2025 =======================
P10(2025, "i", 10, SHM, "The oscillatory motion is damped due to the presence of:", ["Linear motion", "Restoring force", "Frictional force", "Mechanical force"], "C");
P10(2025, "ii", 10, SOUND, "The two factors affecting the speed of sound in air are:", ["Air's humidity and volume", "Air's temperature and mass", "Air's volume and mass", "Air's temperature and humidity"], "D");
P10(2025, "iii", 10, EMW, "The type of electromagnetic wave used in security scanners at night is:", ["Infrared", "Microwave", "Radio wave", "X-rays"], "A");
P10(2025, "iv", 10, OPT, "The power of a lens of focal length 1 cm will be:", ["0.01 D", "1 D", "10 D", "100 D"], "D");
P10(2025, "v", 10, EST, "If two capacitors, each of 4 µF capacitance, are connected in series, their equivalent capacitance will be:", ["1/4 µF", "1/2 µF", "2 µF", "4 µF"], "C");
P10(2025, "vi", 10, CUR, "A wire has a resistance of 5 Ω and 2 A current passes through it. The voltage across the wire ends will be:", ["10 V", "20 V", "30 V", "40 V"], "A");
P10(2025, "vii", 10, EM, "A device which converts mechanical energy into electrical energy is called:", ["Motor", "Transformer", "AC generator", "Battery"], "C");
P10(2025, "viii", 10, ELN, "An example of a digital electronic device is:", ["Speedometer", "Barometer", "Laptop", "Ordinary air thermometer"], "C");
P10(2025, "ix", 10, ICT, "This is not a component of CBIS:", ["Data", "Furniture", "People", "Software"], "B");
P10(2025, "x", 10, NUC, "The number of neutron(s) in deuterium is/are:", ["0", "1", "2", "3"], "B");
P10(2025, "xi", 10, NUC, "The nuclear radiation which has the highest penetrating ability is:", ["Alpha", "Beta", "Gamma", "X-ray"], "C");
S10(2025, "B", "2", 10, SHM, "Define frequency of a wave. Derive the relationship between wave speed, wavelength and frequency.", 3);
S10(2025, "B", "3", 10, SOUND, "Write down any three differences between musical sound and noise.", 3);
S10(2025, "B", "4", 10, EST, "State briefly three methods for forming charges on a body.", 3);
S10(2025, "B", "5", 10, CUR, "Define electromotive force. Write its formula, SI unit and CGS unit.", 3);
S10(2025, "B", "6", 10, ELN, "Draw diagrams of the AND gate and the NOR gate showing the output for two inputs.", 3);
S10(2025, "B", "7", 10, NUC, "Define atom. Describe its two parts.", 3);
S10(2025, "B", "8", 10, SOUND, "The speed of sound in air at 0 °C is 331 m/s. Find the speed of sound in air at 54 °C.", 3);
S10(2025, "B", "9", 10, EMW, "Calculate the frequency of ultraviolet light of wavelength 193 nm, commonly used in laser eye surgery.", 3);
S10(2025, "B", "10", 10, OPT, "A concave lens has a focal length of 10 cm. An object is placed 15 cm away from it. Determine the position of the image.", 3);
S10(2025, "B", "11", 10, CUR, "Calculate the potential difference if 150 J of work is done on a 75 C charge.", 3);
S10(2025, "B", "12", 10, CUR, "If a current of 0.25 A passes through a bulb for 20 minutes, how much electric charge passes through the circuit during this time?", 3);
S10(2025, "B", "13", 10, EM, "A 1.5 m long wire carrying a current of 5 A is placed at right angles in a magnetic field of strength 0.04 T. Calculate the force exerted on the wire.", 3);
S10(2025, "C", "14", 10, SHM, "Define simple harmonic motion (SHM). Illustrate simple harmonic motion in a ball and bowl system with a diagram.", 6);
S10(2025, "C", "15", 10, OPT, "Short sightedness (myopia) and long sightedness (hypermetropia) are two common vision defects. Explain their causes and how they can be corrected. Also draw diagrams.", 6);
S10(2025, "C", "16", 10, EM, "What is a transformer? On what principle does it operate? Describe its four practical applications in everyday life.", 6);
S10(2025, "C", "17", 10, EM, "If an electron enters a uniform magnetic field perpendicularly, explain with a diagram the effect on the path of the electron.", 6);
S10(2025, "C", "18", 10, ICT, "What is meant by flow of information? Explain how light signals are transmitted through an optical fibre.", 6);
S10(2025, "C", "19", 10, NUC, "Define nuclear fission and nuclear fusion reactions. Explain the fission chain reaction in U-235.", 6);

// ======================= CLASS 10 PHYSICS 2024 =======================
P10(2024, "1", 10, OPT, "The reason for the blue colour of the sky is:", ["Scattering of light", "Dispersion of light", "Reflection of light", "Refraction of light"], "A");
P10(2024, "2", 10, SHM, "A wave on a slinky spring with frequency 4 Hz and wavelength 0.4 m has a speed of:", ["16 m/s", "1.9 m/s", "1.6 m/s", "0.1 m/s"], "C");
P10(2024, "3", 10, CUR, "Three resistances of 3 Ω are connected in parallel. Their equivalent resistance will be:", ["1/2 Ω", "1 Ω", "3 Ω", "9 Ω"], "B");
P10(2024, "4", 10, ELN, "When a metal is heated to a high temperature, it emits:", ["Holes", "Neutrons", "Protons", "Electrons"], "D");
P10(2024, "5", 10, SOUND, "Infrasound can be heard by:", ["Cat", "Bat", "Elephant", "Human"], "C");
P10(2024, "6", 10, NUC, "The number of protons in ₉₂U²³⁷ is:", ["92", "237", "145", "329"], "A");
P10(2024, "7", 10, OPT, "To illuminate the inaccessible places in the teeth, dentists use a:", ["Concave mirror", "Convex mirror", "Convex lens", "Concave lens"], "A");
P10(2024, "8", 10, CUR, "The SI unit of e.m.f. is:", ["ampere", "coulomb", "volt", "watt"], "C");
P10(2024, "9", 10, NUC, "The safest way to dispose of a large quantity of radioactive waste is:", ["Washing it in the drain", "Burning it on a fire", "Burying it in dry rock deep underground", "Draining it into the sea"], "C");
P10(2024, "10", 10, EM, "The part of a D.C. motor which reverses the direction of current through the coil every half cycle is called:", ["brushes", "armature", "slip rings", "commutator"], "D");
P10(2024, "11", 10, ICT, "Which of these is software?", ["Hard disk", "Monitor", "Program", "CPU"], "C");
P10(2024, "12", 10, NUC, "The half-life of the radioactive isotope cobalt-60 is:", ["5.27 seconds", "5.27 minutes", "5.27 days", "5.27 years"], "D");
S10(2024, "B", "2", 10, SOUND, "Write down two factors on which the speed of sound in air depends.", 3);
S10(2024, "B", "3", 10, EMW, "Write three uses of electromagnetic waves.", 3);
S10(2024, "B", "4", 10, EST, "Derive the equation 1/Cₑ = 1/C₁ + 1/C₂ + 1/C₃ (capacitors in series).", 3);
S10(2024, "B", "5", 10, NUC, "What are the main features of Rutherford's atomic model?", 3);
S10(2024, "B", "6", 10, EM, "What is a transformer and on which principle does it work?", 3);
S10(2024, "B", "7", 10, ELN, "Write down any three differences between analogue and digital electronics.", 3);
S10(2024, "B", "8", 10, SOUND, "A boy clapped his hands near a wall and heard the echo after 0.6 s. What is the distance of the wall from the boy? (speed of sound = 340 m/s)", 3);
S10(2024, "B", "9", 10, EMW, "Calculate the frequency of radio waves of 3 m wavelength used in an MRI unit.", 3);
S10(2024, "B", "10", 10, OPT, "A pin is placed 15 cm from a convex mirror whose focal length is 10 cm. Determine the position and nature of the image.", 3);
S10(2024, "B", "12", 10, CUR, "9 J of heat is produced each second in a 4 Ω resistance. Find the potential difference across the resistor.", 3);
S10(2024, "B", "13", 10, EM, "A wire carrying a current of 2 A and of length 150 cm is placed between the poles of a magnet at an angle of 30° to a uniform field of 0.8 T. Find the force acting on the wire.", 3);
S10(2024, "C", "14", 10, SHM, "What is simple harmonic motion? Prove that the motion of a simple pendulum is simple harmonic motion.", 6);
S10(2024, "C", "15", 10, OPT, "Draw ray diagrams for a convex lens when the object is placed (i) at 2F (ii) beyond 2F.", 6);
S10(2024, "C", "16", 10, ELN, "What do you mean by C.R.O.? Describe its working with the help of a diagram.", 6);
S10(2024, "C", "17", 10, ICT, "What is an information storage device? Name six information storage devices and describe the use of any three.", 6);
S10(2024, "C", "18", 10, CUR, "State and explain Ohm's law. Also write any three limitations of this law.", 6);
S10(2024, "C", "19", 10, NUC, "What is radioactivity? Write down any two common radiation hazards and six safety measures against radiation.", 6);

// ======================= CLASS 10 PHYSICS 2023 =======================
P10(2023, "1", 10, SOUND, "Which of these waves cannot travel through a vacuum?", ["Sound waves", "Infrared waves", "Microwaves", "X-rays"], "A");
P10(2023, "2", 10, NUC, "The main source of energy in the stars is:", ["Chemical reaction", "Nuclear fission", "Nuclear fusion", "Mechanical energy"], "C");
P10(2023, "4", 10, ELN, "The Boolean expression of an AND gate is:", ["A·B", "A + B", "A × B", "None of these"], "A");
P10(2023, "5", 10, EST, "The branch of physics which deals with charges at rest is called:", ["Electricity", "Electrostatics", "Quantum physics", "Magnetism"], "B");
P10(2023, "6", 10, ICT, "ICT stands for:", ["Interfacing Computer Theories", "Integrated Circular Technology", "Intensive Computer Techniques", "Information and Communication Technology"], "D");
P10(2023, "7", 10, CUR, "V²/R is the formula to find:", ["Current", "Power", "Energy", "Charge"], "B");
P10(2023, "8", 10, EST, "The presence of a dielectric between the plates of a capacitor ______ the capacitance:", ["keeps constant", "decreases", "increases", "does not affect"], "C");
P10(2023, "9", 10, OPT, "The focal length of a convex lens is 20 cm. The power of the lens is:", ["4 dioptre", "5 dioptre", "10 dioptre", "None of these"], "B");
P10(2023, "10", 10, OPT, "The colour that is least deviated by a prism is:", ["Yellow", "Green", "Red", "Violet"], "C");
P10(2023, "11", 10, SHM, "Oscillations are damped due to the presence of:", ["Linear motion", "Restoring force", "Frictional force", "Mechanical force"], "C");
P10(2023, "12", 10, NUC, "In the isotope ₉₂U²³⁵ of uranium, the number of neutrons is:", ["92", "143", "145", "235"], "B");
S10(2023, "B", "2", 10, EMW, "Write down three characteristics of electromagnetic waves.");
S10(2023, "B", "3", 10, EMW, "Write one use of each of the following devices: (i) RADAR (ii) SONAR (iii) LIDAR.");
S10(2023, "B", "4", 10, SHM, "Define wavelength and derive the formula λ = v × T.");
S10(2023, "B", "5", 10, EM, "Explain with a diagram how changing the magnetic field causes an induced e.m.f. in a circuit.");
S10(2023, "B", "6", 10, ELN, "Define thermionic emission. How does emission take place in a tungsten filament?");
S10(2023, "B", "7", 10, CUR, "State the heat dissipation (Joule's) law and derive the equation H = I²Rt.");
S10(2023, "B", "8", 10, SHM, "Waves moving in a pond have a wavelength of 1.6 m and a frequency of 0.80 Hz. Calculate the speed of these water waves.");
S10(2023, "B", "9", 10, SOUND, "Calculate the speed of sound in air at 30 °C, given that the speed of sound at 0 °C is 331 m/s.");
S10(2023, "B", "10", 10, OPT, "A convex mirror used for rear view on an automobile has a radius of curvature of 4.00 m. If a bus is located 5.00 m from the mirror, find the image position and nature.");
S10(2023, "B", "11", 10, EST, "Two point charges q₁ = 5 µC and q₂ = 3 µC are placed 5 cm apart. What is the Coulomb force between them?");
S10(2023, "B", "12", 10, EMW, "A ruby laser emits red light of wavelength 694.3 nm. Calculate its frequency.");
S10(2023, "B", "13", 10, EM, "A transformer is needed to convert a 220 V mains supply into a 12 V supply. If there are 2200 turns on the primary coil, find the number of turns on the secondary coil.");
S10(2023, "C", "14", 10, OPT, "What are short sightedness and long sightedness? How can these defects be corrected? Explain with the help of ray diagrams.", 6);
S10(2023, "C", "15", 10, NUC, "Describe Geiger and Marsden's alpha-particle scattering experiment and its results in detail.", 6);
S10(2023, "C", "16", 10, ICT, "What is information technology? Describe five components of a computer-based information system.", 6);
S10(2023, "C", "17", 10, EST, "State Coulomb's law and derive the equation F = (1/4πε₀)·q₁q₂/r².", 6);
S10(2023, "C", "18", 10, NUC, "Define fission and fusion reactions with their equations. Explain the fission chain reaction with the help of a diagram.", 6);
S10(2023, "C", "19", 10, CUR, "With the help of a circuit diagram, derive the formula for the equivalent resistance of a parallel combination. Also write three advantages of series combination.", 6);

// ======================= CLASS 10 PHYSICS 2021 (old pattern, includes Class 9 topics) =======================
P10(2021, "i", 9, TEF, "The centre of gravity of a uniform rod is at its:", ["End", "Centre", "Edge", "None of these"], "B", 2);
P10(2021, "ii", 9, VEC, "If Fx = 3 N and Fy = 4 N, the magnitude of the resultant force F will be:", ["1 N", "5 N", "3 N", "7 N"], "B", 2);
P10(2021, "iii", 10, SHM, "Time period is the reciprocal of:", ["Frequency", "Amplitude", "Vibration", "None of these"], "A", 2);
P10(2021, "iv", 9, POM, "An object appears lighter in water because of this property of water:", ["Elasticity", "Surface tension", "Viscosity", "Buoyancy (upthrust)"], "D", 2);
P10(2021, "vi", 10, NUC, "Which of the following is the most penetrating?", ["α-rays", "β-rays", "γ-rays", "None of these"], "C", 2);
P10(2021, "vii", 9, PQ, "One radian is equal to:", ["5.73°", "57.3°", "53.7°", "573°"], "B", 2);
P10(2021, "viii", 10, OPT, "The radius of curvature of a concave mirror is 20 cm. Its focal length will be:", ["20 cm", "15 cm", "10 cm", "5 cm"], "C", 2);
P10(2021, "ix", 9, WE, "The only scalar quantity among these is:", ["Displacement", "Work", "Force", "Velocity"], "B", 2);
P10(2021, "x", 9, WE, "If the speed of a body is doubled, its kinetic energy becomes:", ["Half", "Twice", "Three times", "Four times"], "D", 2);
P10(2021, "xi", 10, EMW, "The radiation that produces the sensation of heat is called:", ["Invisible light", "Ultraviolet rays", "Infrared rays", "Visible light"], "C", 2);
P10(2021, "xii", 10, NUC, "According to the quantum theory of light, photons are:", ["Waves", "Electromagnetic waves", "Packets of energy", "Particles"], "C", 2);
P10(2021, "xiii", 10, EM, "The relation between electric current and the magnetic field was discovered by:", ["Newton", "Fleming", "Faraday", "Oersted"], "D", 2);
P10(2021, "xiv", 9, DYN, "If the mass of a body is 5 kg, its weight will be (g = 9.8 m/s²):", ["4.9 N", "49 N", "9.8 N", "0.49 N"], "B", 2);
P10(2021, "xv", 9, POM, "Archimedes' principle is applied to determine:", ["Specific heat", "Specific gravity", "Mass", "None of these"], "B", 2);
P10(2021, "xvi", 9, PQ, "The formula for the volume of a sphere is:", ["πr²l", "πr³l", "(4/3)πr³", "(3/4)πr³"], "C", 2);
P10(2021, "xvii", 10, EM, "Magnetic lines of force can most easily pass through:", ["Iron", "Air", "Water", "Wood"], "A", 2);
P10(2021, "xviii", 10, OPT, "If q = 6 cm and p = 3 cm, the magnification of the lens is:", ["0.5", "2", "4", "8"], "B", 2);
P10(2021, "xix", 10, EST, "The unit of capacitance of a capacitor is:", ["Coulomb", "Volt", "Farad", "Ohm"], "C", 2);
P10(2021, "xx", 9, PQ, "The branch of science that deals with the interaction of matter and energy is:", ["Astronomy", "Chemistry", "Physics", "Biology"], "C", 2);
P10(2021, "xxi", 9, THERM, "The specific heat of water is:", ["4200 J kg⁻¹ K⁻¹", "2100 J kg⁻¹ K⁻¹", "500 J kg⁻¹ K⁻¹", "1000 J kg⁻¹ K⁻¹"], "A", 2);
P10(2021, "xxii", 10, ELN, "To produce N-type crystals, germanium is doped with a substance that is:", ["Divalent", "Trivalent", "Tetravalent", "Pentavalent"], "D", 2);
S10(2021, "B", "2", 9, TEF, "Define equilibrium and state the two conditions of equilibrium.");
S10(2021, "B", "3", 9, WE, "Define power. Prove that power is the product of force (F) and velocity (v).");
S10(2021, "B", "4", 9, PQ, "Write any four importances of physics in daily life.");
S10(2021, "B", "5", 9, POM, "State the following laws: (i) Pascal's law (ii) Hooke's law (iii) Newton's second law of motion (iv) Laws of reflection.");
S10(2021, "B", "6", 10, ELN, "Write two differences between each of the following: (i) P-type and N-type substances (ii) Fission and fusion reactions.");
S10(2021, "B", "7", 9, DYN, "A force of 45 N acts on a stationary body for 4 seconds and the body acquires a velocity of 36 m/s. Calculate the mass of the body.");
S10(2021, "B", "8", 10, OPT, "The focal length of a concave mirror is 15 cm. Where should an object be placed so as to get its real image with a magnification of 3?");
S10(2021, "B", "9", 9, PQ, "The time taken by an electron to complete one rotation about its nucleus is 0.5 × 10⁻¹⁸ s. Convert it into minutes and hours.");
S10(2021, "B", "10", 10, SHM, "Find the time period of a simple pendulum whose length is 144 cm. (g = 9.8 m/s²)");
S10(2021, "B", "11", 10, CUR, "Calculate the current passing through an electric heater if 1800 C of charge flows through it while heating a room for 3 minutes.");
S10(2021, "C", "12", 9, GRAV, "State Newton's law of universal gravitation and derive the equation for the mass of the Earth. Also calculate its value.");
S10(2021, "C", "13", 9, THERM, "Define the coefficient of volumetric expansion and prove that β = 3α.");
S10(2021, "C", "14", 9, KIN, "Define acceleration. Derive the equation of motion 2aS = vf² − vi².");
S10(2021, "C", "15", 9, VEC, "What is meant by resolution of a vector? Define resultant vector and describe the procedure to resolve a vector into its horizontal and vertical components.");

// ======================= CLASS 10 PHYSICS 2019 =======================
P10(2019, "1", 9, PQ, "The unit of luminous (light) intensity is:", ["Pascal", "Volt", "Candela", "Joule"], "C");
P10(2019, "2", 9, PQ, "The circumference of the Earth was determined by:", ["Muhammad bin Musa Al-Khwarizmi", "Al-Biruni", "Yaqub Al-Kindi", "Abu Ali Hassan Ibn-al-Haitham"], "B");
P10(2019, "3", 9, WE, "In the British Engineering system, 1 horsepower (hp) =", ["560 ft·lb/s", "505 ft·lb/s", "550 ft·lb/s", "546 ft·lb/s"], "C");
P10(2019, "4", 9, VEC, "Which is a vector quantity?", ["Distance", "Displacement", "Speed", "Mass"], "B");
P10(2019, "5", 9, POM, "Archimedes' principle is used to determine:", ["Specific gravity", "Specific heat", "Specific resistance", "Specific radiation"], "A");
P10(2019, "6", 10, OPT, "A concave lens is used:", ["For the correction of short sightedness", "For aberration", "For the correction of long sightedness", "For a clear picture"], "A");
P10(2019, "7", 9, GRAV, "For artificial satellites, the necessary (centripetal) acceleration is provided by:", ["Gravitational force", "Frictional force", "Coulomb's force", "Centrifugal force"], "A");
P10(2019, "8", 10, SHM, "A disturbance which travels through a medium due to the periodic motion of the particles of the medium about their mean position is called:", ["Time period", "Resonance", "Frequency", "Wave motion"], "D");
P10(2019, "9", 10, CUR, "If I = 1.5 A and R = 10 Ω, the voltage V is:", ["10 V", "1.5 V", "150 V", "15 V"], "D");
P10(2019, "10", 9, KIN, "The rate of change of velocity is called:", ["Torque", "Acceleration", "Momentum", "Speed"], "B");
P10(2019, "11", 10, EM, "A shunt converts a galvanometer into:", ["A voltmeter", "An ammeter", "A wattmeter", "A calorimeter"], "B");
P10(2019, "12", 9, DYN, "The unit of the coefficient of friction is:", ["Newton", "Kilogram", "Metre", "None (it has no unit)"], "D");
P10(2019, "13", 9, MACH, "An inclined plane 5 m long has one end raised by 1 m. Its mechanical advantage will be:", ["15", "5", "1/5", "1/15"], "B");
P10(2019, "14", 9, TEF, "If two parallel forces act in the same direction, they are called:", ["Unlike parallel forces", "Couple", "Rectangular forces", "Like parallel forces"], "D");
P10(2019, "15", 9, THERM, "The temperature of a substance changes from −20 °C to 20 °C. The temperature change on the Kelvin scale is:", ["0 K", "20 K", "40 K", "293 K"], "C");
P10(2019, "16", 10, OPT, "Small drops of rain water splitting sunlight into different colours is called:", ["Dispersion", "Interference", "Rainbow", "Spectrum"], "A");
P10(2019, "17", 10, ELN, "Amplification can be obtained by a:", ["Radar", "Transistor", "P-N junction", "Capacitor"], "B");
P10(2019, "18", 10, OPT, "The image formed in a plane mirror is:", ["Real", "Inverted", "Virtual and erect", "Real and inverted"], "C");
P10(2019, "19", 10, NUC, "Which of the following is the most penetrating?", ["α-rays", "β-rays", "γ-rays", "X-rays"], "C");
S10(2019, "B", "2", 9, PQ, "Write down two contributions of each scientist: (i) Yaqoob Al-Kindi (ii) Abu Ali Ibn-al-Haitham.");
S10(2019, "B", "3", 10, ELN, "What are transistors? Write their two types with the help of circuit diagrams.");
S10(2019, "B", "4", 9, POM, "Define: (i) Viscosity (ii) Surface tension (iii) Centre of gravity (iv) Couple.");
S10(2019, "B", "5", 9, DYN, "State Newton's second law of motion and derive F = ma.");
S10(2019, "B", "6", 10, EMW, "Describe briefly any four electromagnetic waves with their ranges.");
S10(2019, "B", "7", 10, CUR, "State Joule's law and derive the equation W = I²Rt.");
S10(2019, "B", "8", 10, ELN, "Write down two differences between: (i) N-type and P-type substances (ii) Fundamental and derived quantities.");
S10(2019, "B", "9", 9, DYN, "Give scientific reasons: (i) Why is sliding friction greater than rolling friction? (ii) Why is a low resistance connected in parallel with the coil of a galvanometer to make an ammeter?");
S10(2019, "B", "10", 10, NUC, "How much energy will be released when 50 g of mass is completely transformed into energy?");
S10(2019, "B", "11", 10, SHM, "When a sound wave of frequency 200 Hz and wavelength 300 cm passes through a medium, calculate the velocity of the wave in the medium.");
S10(2019, "B", "12", 9, GRAV, "Calculate the orbital velocity of an artificial satellite moving around the Earth if the radius of the Earth is 6 × 10⁶ m and g is 10 m/s².");
S10(2019, "B", "13", 9, VEC, "A force acts at an angle of 60° with the x-axis. If the x-component of the force is 50 N, find the resultant force and the y-component of the force. (sin 60° = 0.866, cos 60° = 0.5)");
S10(2019, "B", "14", 9, THERM, "Find the amount of heat required to raise the temperature of 100 g of water from 10 °C to 60 °C. (specific heat of water = 4200 J kg⁻¹ °C⁻¹)");
S10(2019, "B", "15", 9, KIN, "A ball is dropped from a tower and reaches the ground in 10 seconds. Calculate the height of the tower and the velocity with which it hits the ground.");
S10(2019, "B", "16", 10, OPT, "The focal length of a concave mirror is 15 cm. Where should an object be placed so as to get its real image magnified three times?");
S10(2019, "B", "17", 10, CUR, "An electric heater has a resistance of 20 Ω and works at a potential difference of 220 V. Find the current passing through the heater and its power.");
S10(2019, "C", "18", 9, THERM, "(a) State Boyle's and Charles's laws and derive the general gas equation PV = nRT. (b) Name two main defects of the human eye. Describe with ray diagrams the defects and their correction.");
S10(2019, "C", "19", 10, EM, "(a) What is a simple electric motor? Describe its construction and working with a diagram. (b) What is a wheel and axle? With a labelled diagram, calculate its mechanical advantage.");
S10(2019, "C", "20", 9, WE, "(a) Define potential and kinetic energy and derive P.E. = mgh and K.E. = ½mv². (b) Define simple harmonic motion and prove that the motion of a body attached to the end of a spring is simple harmonic.");

// ======================= CLASS 10 PHYSICS 2018 =======================
P10(2018, "1", 10, NUC, "The laser belongs to:", ["Nuclear physics", "Atomic physics", "Solid-state physics", "Astrophysics"], "B");
P10(2018, "2", 10, NUC, "In the uranium isotope ₉₂U²³⁸, the number of neutrons is:", ["92", "146", "238", "330"], "B");
P10(2018, "3", 9, DYN, "kg·m/s is the same as:", ["N·s", "N/s", "N·m", "N/m"], "A");
P10(2018, "4", 9, DYN, "The product of mass and acceleration is called:", ["Momentum", "Force", "Work", "Torque"], "B");
P10(2018, "5", 9, VEC, "A 25 N force acts along the x-axis. Its y-component is:", ["25 N", "−25 N", "0 N", "5 N"], "C");
P10(2018, "6", 9, TEF, "If a body is moving with uniform velocity, it is said to be in:", ["Neutral equilibrium", "Dynamic equilibrium", "Static equilibrium", "Unstable equilibrium"], "B");
P10(2018, "7", 9, WE, "One horsepower = ______ watt:", ["746", "550", "674", "505"], "A");
P10(2018, "8", 9, WE, "The rate of doing work is called:", ["Velocity", "Acceleration", "Power", "Momentum"], "C");
P10(2018, "9", 9, MACH, "The mechanical advantage of a movable pulley is:", ["1", "2", "3", "4"], "B");
P10(2018, "10", 9, PQ, "The formula for the volume of a sphere is:", ["πr³l", "πr²l", "(4/3)πr³", "(3/4)πr³"], "C");
P10(2018, "11", 9, THERM, "When water is changed into ice, it:", ["Expands", "Contracts", "Becomes lighter", "Becomes heavier"], "A");
P10(2018, "12", 10, SHM, "In an elastic spring, simple harmonic motion is produced due to:", ["Restoring force", "K.E. of the spring", "Weight of the spring", "Mass of the spring"], "A");
P10(2018, "13", 10, OPT, "The image formed in a plane mirror will be:", ["Real", "Inverted", "Virtual and erect", "Real and inverted"], "C");
P10(2018, "14", 10, OPT, "The optical fibre is a practical application of:", ["Polarization", "Refraction", "Interference", "Total internal reflection"], "D");
P10(2018, "15", 10, EMW, "Electromagnetic waves carry:", ["Wavelength", "Frequency", "Charge", "Energy"], "D");
P10(2018, "16", 10, EST, "Coulomb per volt is called:", ["Ampere", "Ohm", "Farad", "Watt"], "C");
P10(2018, "17", 10, EM, "The relation between electric current and the magnetic field was discovered by:", ["Newton", "Faraday", "Oersted", "Fleming"], "C");
P10(2018, "18", 10, NUC, "The emission of rays from the nucleus is called:", ["A chemical process", "An atomic process", "Radioactivity", "Atomic dispersion"], "C");
P10(2018, "19", 10, EST, "1 microcoulomb = ______ coulomb:", ["10⁻⁶", "10⁻³", "10⁻⁹", "10⁻¹²"], "A");
S10(2018, "B", "2", 9, PQ, "Define: (i) Doping (ii) Mechanics (iii) Friction (iv) Personal error.");
S10(2018, "B", "3", 9, DYN, "Give scientific reasons: (i) It is dangerous to jump from a fast-moving vehicle. (ii) Aquatic animals survive in frozen seas.");
S10(2018, "B", "4", 9, DYN, "State Newton's second law of motion and derive F = ma.");
S10(2018, "B", "5", 10, EM, "How is a galvanometer converted into an ammeter and a voltmeter? Also draw the relevant diagrams.");
S10(2018, "B", "6", 10, EST, "State Coulomb's law. Write down its equation and mention the value of k in SI units.");
S10(2018, "B", "7", 9, DYN, "State two differences between: (i) mass and weight (ii) fission and fusion reactions.");
S10(2018, "B", "8", 9, POM, "Name the law which states: \"When pressure is applied to a liquid, it is transmitted equally in all directions.\" Describe any one application of this law.");
S10(2018, "B", "9", 10, EMW, "What is RADAR? Write down its three uses.");
S10(2018, "B", "10", 9, PQ, "The radius of a hydrogen atom is 0.53 × 10⁻¹⁰ m. Convert it into kilometres, millimetres, micrometres and nanometres.");
S10(2018, "B", "11", 9, KIN, "A ball is dropped from a height of 122.5 m. How much time will it take to reach the ground?");
S10(2018, "B", "12", 9, THERM, "What is the pressure of 200 moles of a gas in a 50 m³ cylinder at 27 °C?");
S10(2018, "B", "13", 10, CUR, "Two resistances of 4 Ω and 6 Ω are connected in parallel and then joined to a source of e.m.f. 12 V. Find the equivalent resistance of the circuit and the total current flowing in it.");
S10(2018, "B", "14", 9, MACH, "An object of weight 50 N is raised 2 m above the ground using an inclined plane of length 10 m. Calculate the effort applied parallel to the inclined plane and the mechanical advantage of the inclined plane.");
S10(2018, "B", "15", 9, DYN, "Two bodies of masses 5 kg and 4 kg are attached to the ends of a string that passes over a pulley so that both hang vertically. Find the acceleration of the bodies and the tension in the string.");
S10(2018, "B", "17", 10, SHM, "A piece of paper completes 600 vibrations in 60 seconds when waves pass through the surface of water. Find the time period and frequency of the piece of paper, and the wavelength if the velocity of the waves is 2.5 m/s.");
S10(2018, "C", "18", 9, WE, "(a) Define K.E. and P.E. and derive K.E. = ½mv². (b) Define resolution of a vector and explain the method to resolve a vector into its rectangular components.");
S10(2018, "C", "19", 9, THERM, "(a) Define the coefficient of linear expansion and derive L₂ = L₁(1 + αΔT). (b) Define simple harmonic motion and prove that the motion of a simple pendulum is simple harmonic.");
S10(2018, "C", "20", 10, OPT, "(a) With the help of a ray diagram derive the mirror equation 1/f = 1/p + 1/q. (b) State the law of universal gravitation and prove that Mₑ = gRₑ²/G.");

// ======================= CLASS 10 PHYSICS 2017 =======================
P10(2017, "1", 9, PQ, "One micrometre is equal to:", ["10⁻⁶ m", "10⁻⁹ m", "10¹⁰ m", "10¹² m"], "A");
P10(2017, "2", 9, KIN, "For freely falling bodies, the value of g is:", ["4.9 m/s²", "9.8 m/s²", "19.6 m/s²", "39.2 m/s²"], "B");
P10(2017, "3", 10, OPT, "The refractive index of glass is:", ["1.52", "1.33", "2.42", "1.64"], "A");
P10(2017, "4", 9, DYN, "kg·m/s² is the unit of:", ["Power", "Weight (force)", "Pressure", "Momentum"], "B");
P10(2017, "5", 9, THERM, "The boiling point of pure water is:", ["0 K", "273 K", "373 K", "227 K"], "C");
P10(2017, "6", 9, WE, "One horsepower is equal to:", ["450 W", "746 W", "550 W", "476 W"], "B");
P10(2017, "7", 10, OPT, "The radius of curvature of a concave mirror is 20 cm. Its focal length will be:", ["40 cm", "−40 cm", "10 cm", "−10 cm"], "C");
P10(2017, "8", 10, NUC, "In a nuclear reactor, the control rods are made of:", ["Carbon", "Boron", "Aluminium", "Sodium"], "B");
P10(2017, "9", 9, GRAV, "The value of G was determined experimentally by:", ["Newton", "Cavendish", "Galileo", "Pascal"], "B");
P10(2017, "10", 10, ELN, "N-type material is formed when a semiconductor is doped with an element that is:", ["Divalent", "Trivalent", "Tetravalent", "Pentavalent"], "D");
P10(2017, "11", 9, POM, "Raindrops are spherical because of this property of water:", ["Density", "Viscosity", "Pressure", "Surface tension"], "D");
P10(2017, "12", 10, SOUND, "The loudness of sound depends upon:", ["Amplitude", "Frequency", "Wavelength", "Velocity"], "A");
P10(2017, "13", 10, OPT, "Kitab-ul-Manazir was written by:", ["Al-Biruni", "Yaqoob Al-Kindi", "Ibn-al-Haitham", "Musa Al-Khwarizmi"], "C");
P10(2017, "14", 9, VEC, "Which of these is not a vector quantity?", ["Momentum", "Weight", "Pressure", "Torque"], "C");
P10(2017, "15", 9, MACH, "The mechanical advantage of a movable pulley is:", ["2", "3", "4", "5"], "A");
P10(2017, "16", 10, CUR, "The kilowatt-hour is the commercial unit of:", ["Power", "Electrical energy", "Time", "Velocity"], "B");
P10(2017, "17", 10, NUC, "The lightest particle in an atom is the:", ["Neutron", "Electron", "Deuteron", "Proton"], "B");
S10(2017, "B", "2", 9, PQ, "Define physics and write the names of any four of its branches.");
S10(2017, "B", "3", 9, PQ, "Write down the SI units of: (i) time (ii) weight (iii) power (iv) stress (v) length (vi) frequency.");
S10(2017, "B", "4", 9, DYN, "State Newton's laws of motion.");
S10(2017, "B", "5", 9, KIN, "A car starting from rest attains a velocity of 20 m/s in 5 seconds. Find the distance covered by the car.");
S10(2017, "B", "6", 10, SHM, "Define wavelength, time period and frequency.");
S10(2017, "B", "7", 9, TEF, "Write the three states of equilibrium.");
S10(2017, "B", "8", 10, NUC, "Define: (i) Nuclear fission (ii) Rectifier (iii) Half-life of an element.");
S10(2017, "B", "9", 9, THERM, "A steel rod has a length of 10 m at 25 °C. Calculate the increase in length if it is heated to 35 °C. (α for steel = 1.1 × 10⁻⁵ K⁻¹)");
S10(2017, "B", "10", 10, OPT, "Write Newton's corpuscular theory of light.");
S10(2017, "B", "11", 9, DYN, "A car is moving on a circular track of radius 30 m at a constant speed of 20 m/s. Find the centripetal acceleration of the car.");
S10(2017, "B", "12", 10, CUR, "Define a primary cell and write four examples.");
S10(2017, "B", "14", 9, POM, "Define pressure. Write its formula and SI unit.");
S10(2017, "B", "15", 9, THERM, "What is a bimetallic strip? Write the names of two of its applications.");
S10(2017, "B", "16", 9, WE, "What is the kinetic energy of a 2000 kg car travelling at 90 km/h?");
S10(2017, "B", "17", 10, CUR, "State the laws: (i) Charles's law (ii) Coulomb's law (iii) Ohm's law.");
S10(2017, "B", "18", 9, VEC, "With the help of diagrams define the negative of a vector and the resultant vector.");
S10(2017, "B", "19", 10, ELN, "Write down three differences between forward bias and reverse bias.");
S10(2017, "B", "20", 10, OPT, "Calculate the distance of an object from a convex lens of focal length 15 cm if the magnification is 3 and the image is real.");
S10(2017, "B", "21", 10, SHM, "Calculate the length of a second's pendulum, taking g = 10 m/s². (A second's pendulum has a time period of 2 s.)");
S10(2017, "B", "22", 10, NUC, "In a nuclear reaction 9.0 × 10¹⁰ J of energy is released due to the conversion of mass into energy. How much mass has been converted?");
S10(2017, "C", "23", 9, KIN, "(a) Derive the equation S = vi·t + ½at². (b) What is an inclined plane? Calculate its mechanical advantage. (c) Write four properties of alpha rays.");
S10(2017, "C", "24", 10, EM, "(a) Describe the construction and working of an electric bell with a diagram. (b) What is RADAR? Write its three uses. (c) Write four uses of spherical mirrors.");
S10(2017, "C", "25", 9, DYN, "(a) Two bodies of different masses are attached to a string which passes over a frictionless pulley so that the bodies move vertically. Derive a = ((m₁ − m₂)/(m₁ + m₂))·g. (b) Draw a ray diagram of an astronomical telescope and describe its working. (c) Define musical sound and write its three characteristics.");

// ======================= CLASS 10 PHYSICS 2016 =======================
P10(2016, "i", 9, PQ, "1 microgram =", ["10⁻³ kg", "10⁻⁶ kg", "10⁻⁹ kg", "10⁻¹² kg"], "C");
P10(2016, "ii", 9, DYN, "If the speed of a body moving in a circle is doubled, its centripetal acceleration becomes:", ["Twice", "Four times", "Eight times", "Three times"], "B");
P10(2016, "iii", 9, DYN, "The best approximation of the weight of an object of mass 800 g is:", ["88 N", "80 N", "8 N", "0.8 N"], "C");
P10(2016, "iv", 9, THERM, "The specific heat of ice is:", ["4200 J kg⁻¹ K⁻¹", "2100 J kg⁻¹ K⁻¹", "4300 J kg⁻¹ K⁻¹", "4100 J kg⁻¹ K⁻¹"], "B");
P10(2016, "v", 9, WE, "The work done will be negative if the angle between force and displacement is:", ["90°", "180°", "0°", "45°"], "B");
P10(2016, "vi", 10, OPT, "If q = 6 cm and p = 3 cm, the magnification of the mirror is:", ["4", "2", "3", "12"], "B");
P10(2016, "vii", 10, ELN, "In a P-type substance the charge carriers are:", ["Electrons", "Protons", "Holes", "Neutrons"], "C");
P10(2016, "viii", 10, CUR, "To measure the current in a circuit, an ammeter is always connected:", ["In series", "In parallel", "In any way", "None of these"], "A");
P10(2016, "ix", 9, VEC, "Which is a scalar quantity?", ["Torque", "Frequency", "Electric intensity", "Momentum"], "B");
P10(2016, "xi", 10, NUC, "The nucleus of this atom is called an α-particle:", ["Helium", "Uranium", "Polonium", "Radium"], "A");
P10(2016, "xii", 9, TEF, "A cone standing on its base is an example of this type of equilibrium:", ["Stable", "Neutral", "Unstable", "Kinetic"], "A");
P10(2016, "xv", 10, SOUND, "The minimum distance between the source of sound and the barrier for a distinct echo is:", ["17 m", "20 m", "23 m", "27 m"], "A");
P10(2016, "xvi", 10, OPT, "Which one has the maximum refractive index?", ["Water", "Glass", "Diamond", "Air"], "C");
P10(2016, "xvii", 10, EM, "A device which converts electrical energy into mechanical energy is:", ["Electric generator", "Electric coil", "Solenoid", "Electric motor"], "D");
S10(2016, "B", "2", 9, THERM, "Write down three differences between heat and temperature.");
S10(2016, "B", "3", 9, KIN, "A ball is dropped from a tower and reaches the ground in 10 seconds. Calculate the height of the tower. (Take g = 10 m/s²)");
S10(2016, "B", "4", 9, GRAV, "Compute the gravitational force of attraction between two boys of masses 50 kg and 40 kg standing 2 m apart. (G = 6.67 × 10⁻¹¹ N m²/kg²)");
S10(2016, "B", "5", 10, OPT, "Define irregular reflection of light and write two points of its importance.");
S10(2016, "B", "6", 9, VEC, "With the help of the rectangular components of a vector, derive the equation for the resultant vector F = √(Fx² + Fy²).");
S10(2016, "B", "7", 10, OPT, "The focal length of a concave mirror is 10 cm. Where should an object be placed to get its real image magnified 4 times?");
S10(2016, "B", "8", 9, POM, "State the following laws: (i) Hooke's law (ii) Snell's law (iii) Boyle's law.");
S10(2016, "B", "9", 9, WE, "Define power and derive the equation P = Fv.");
S10(2016, "B", "10", 10, NUC, "Describe the quantum theory of light and explain the dual nature of light.");
S10(2016, "B", "11", 10, NUC, "Write two uses of radioisotopes in medicine and one use in industry.");
S10(2016, "B", "12", 10, CUR, "Calculate the current in an electric heater if 1800 C of charge passes through it in 3 minutes.");
S10(2016, "B", "13", 9, WE, "With what constant velocity can a 1960 W motor raise a mass of 100 kg?");
S10(2016, "B", "14", 10, SOUND, "Define: (i) Interference (ii) Stationary waves (iii) Beats.");
S10(2016, "B", "15", 9, MACH, "State the principle of the lever and derive the formula for its mechanical advantage.");
S10(2016, "B", "16", 10, NUC, "Write down three precautions to minimise radiation hazards.");
S10(2016, "B", "17", 10, NUC, "The half-life of ¹³¹I is 8 days. Find the amount of iodine left after 16 days from a 100 g sample.");
S10(2016, "B", "18", 10, SHM, "Find the time period of a simple pendulum whose length is 288 cm.");
S10(2016, "B", "19", 9, THERM, "Define the anomalous expansion of water and give two of its effects.");
S10(2016, "B", "20", 9, TEF, "Define equilibrium and state the two conditions of equilibrium.");
S10(2016, "B", "21", 9, THERM, "Calculate the volume occupied by 2 moles of a gas at 27 °C and a pressure of 1 atm = 1.01 × 10⁵ N/m². (R = 8.314 J mol⁻¹ K⁻¹)");
S10(2016, "B", "22", 9, GRAV, "Define orbital velocity and derive the formula v = √(GMₑ/r).");
S10(2016, "C", "23", 9, THERM, "(a) Derive the equation β = 3α. (b) State Newton's law of gravitation and derive the formula for the mass of the Earth. (c) Define: (i) power of a lens (ii) nuclear reactor (iii) half-life of an element (iv) dispersion of light.");
S10(2016, "C", "24", 9, KIN, "(a) Derive the equation 2aS = vf² − vi². (b) Define Pascal's law and explain any one of its applications with a diagram. (c) Write two differences between: (i) longitudinal and transverse waves (ii) fission and fusion reactions.");
S10(2016, "C", "25", 10, OPT, "(a) Draw the ray diagram of a compound microscope and describe its working. (b) Write four similarities between static electricity and magnetism. (c) Write two advantages and two disadvantages of friction.");

// ======================= CLASS 10 PHYSICS 2015 =======================
P10(2015, "i", 9, PQ, "The only Nobel Prize-winning scientist from Pakistan is:", ["Dr. Abdus Salam", "Dr. Abdul Qadeer Khan", "Dr. Atta-ur-Rahman", "Dr. Saleem-uz-Zaman"], "A");
P10(2015, "ii", 9, PQ, "The least count of a screw gauge is:", ["0.001 cm", "0.1 cm", "0.01 cm", "0.0001 cm"], "A");
P10(2015, "iii", 9, DYN, "The SI unit of force is:", ["Metre", "m s⁻¹", "kg", "Newton"], "D");
P10(2015, "iv", 9, VEC, "Which is a vector quantity?", ["Density", "Velocity", "Temperature", "Distance"], "B");
P10(2015, "v", 9, TEF, "The turning effect of a force about an axis is:", ["Force", "Rotation", "Torque", "Momentum"], "C");
P10(2015, "vi", 9, GRAV, "For satellites, the necessary (centripetal) acceleration is provided by the:", ["Frictional force", "Gravitational force", "Coulomb's force", "Magnetic force"], "B");
P10(2015, "vii", 9, WE, "1 hp =", ["467 W", "647 W", "746 W", "764 W"], "C");
P10(2015, "viii", 9, MACH, "For an ideal machine, the efficiency is:", ["1 (100%)", "2", "3", "4"], "A");
P10(2015, "ix", 9, POM, "The elasticity of a substance depends on its:", ["Temperature", "Size", "Mass", "Nature"], "D");
P10(2015, "x", 9, THERM, "The temperature of a substance changes from −20 °C to 20 °C. The change on the Kelvin scale is:", ["0 K", "20 K", "40 K", "293 K"], "C");
P10(2015, "xi", 10, SOUND, "The waves produced by a vibrating body in air are:", ["Longitudinal", "Transverse", "Electromagnetic", "Magnetic"], "A");
P10(2015, "xii", 10, OPT, "If the inner surface of a spherical mirror is reflecting, it is called a:", ["Plane mirror", "Convex mirror", "Concave mirror", "Ordinary mirror"], "C");
P10(2015, "xiv", 10, OPT, "When a ray of light enters obliquely from a rarer into a denser medium, the angle of refraction becomes ______ the angle of incidence:", ["Greater than", "Smaller than", "Equal to", "Unrelated to"], "B");
P10(2015, "xv", 10, OPT, "To disperse white light into different colours we use a:", ["Convex lens", "Prism", "Concave mirror", "Convex mirror"], "B");
P10(2015, "xvi", 10, CUR, "One megaohm of resistance is equal to:", ["10⁸ Ω", "10⁶ Ω", "10⁻⁶ Ω", "10⁻⁹ Ω"], "B");
P10(2015, "xvii", 10, NUC, "The half-life of radon-222 is about:", ["3.83 days", "38.3 days", "3.38 days", "8.33 days"], "A");
S10(2015, "B", "2", 9, PQ, "Name and define the branches of physics that deal with solid materials, the nucleus of atoms and astronomical bodies.");
S10(2015, "B", "3", 9, PQ, "Write the approximate value of the mass of our galaxy, the Earth and the Moon.");
S10(2015, "B", "4", 9, KIN, "A car moving with uniform acceleration from rest attains a velocity of 108 km/h in 5 minutes. Find the acceleration of the car.");
S10(2015, "B", "5", 9, DYN, "Write three points of comparison between weight and mass.");
S10(2015, "B", "6", 9, VEC, "With the help of the graphical method, add two vectors A and B.");
S10(2015, "B", "7", 9, TEF, "Prove that the moment of a couple is equal to the product of one of the forces and the arm of the couple.");
S10(2015, "B", "8", 9, GRAV, "With the help of two bodies, express the law of universal gravitation mathematically in three steps.");
S10(2015, "B", "9", 9, DYN, "A string 2 m long is used to whirl a 100 g stone in a horizontal circle at a speed of 2 m/s. Find the tension in the string.");
S10(2015, "B", "10", 9, WE, "Describe the interconversion of kinetic and potential energy.");
S10(2015, "B", "11", 9, MACH, "Draw a figure of a wheel and axle and calculate its mechanical advantage.");
S10(2015, "B", "12", 9, POM, "Explain Hooke's law applied to a helical spring.");
S10(2015, "B", "13", 9, THERM, "A steel rod has a length of 10 m at 25 °C. Calculate the increase in length if it is heated to 35 °C. (α for steel = 1.1 × 10⁻⁵ K⁻¹)");
S10(2015, "B", "14", 10, OPT, "Who invented the pin-hole camera? Show the image formed by it with a diagram.");
S10(2015, "B", "15", 10, SHM, "Find the time period of a simple pendulum whose length is 100 cm.");
S10(2015, "B", "16", 10, OPT, "With the help of Snell's law, prove that there is no change in the direction of a refracted ray if the incident ray is perpendicular to the surface separating the two media.");
S10(2015, "B", "17", 10, OPT, "An object is placed 10 cm from a convex lens of focal length 15 cm. Find the position and magnification of the image.");
S10(2015, "B", "18", 10, OPT, "Compare Newton's corpuscular theory and Huygens' wave theory of light.");
S10(2015, "B", "19", 10, CUR, "A parallel circuit contains an 80 Ω heater and a 20 Ω element. What current passes through the circuit if it is driven by an 80 V source? Also find the equivalent resistance.");
S10(2015, "B", "20", 10, EM, "Write the names of three elements of whose alloys magnets are made artificially, and write three modern uses of magnets.");
S10(2015, "B", "21", 10, ELN, "What is a transistor? Draw the symbols of its two types.");
S10(2015, "B", "22", 10, NUC, "With the help of Einstein's equation, find the mass transformed into energy if 9 × 10¹⁶ J is released during a nuclear reaction. (c = 3 × 10⁸ m/s)");
S10(2015, "C", "23", 10, NUC, "(a) What is natural radioactivity? Name three elements which emit powerful radiation and write the range of velocity of the negative rays emitted during radioactivity. (b) Draw the diagram of an electric bell and describe its working. (c) Describe and derive the general gas equation.");
S10(2015, "C", "24", 10, SHM, "(a) Define simple harmonic motion and describe five of its important features. (b) Describe electrostatic induction in four steps using two metal spheres. (c) Describe four examples showing surface tension.");
S10(2015, "C", "25", 9, KIN, "(a) Derive the second equation of motion in five steps. (b) With the help of diagrams, explain short sightedness and long sightedness and their correction. (c) Describe the sign convention for real and virtual images.");

// ======================= CLASS 10 PHYSICS 2014 =======================
P10(2014, "1", 10, OPT, "Which of the following has the maximum refractive index?", ["Ruby", "Crown glass", "Quartz", "Diamond"], "D");
P10(2014, "2", 10, SOUND, "The production of beats is due to ______ of sound waves:", ["Interference", "Reflection", "Diffraction", "Refraction"], "A");
P10(2014, "3", 9, PQ, "The branch of physics concerned with highly ionised atoms is called ______ physics:", ["Atomic", "Nuclear", "Plasma", "Solid-state"], "C");
P10(2014, "4", 9, DYN, "The unit of the coefficient of friction (µ) is:", ["Newton", "Joule", "Newton metre", "None of these"], "D");
P10(2014, "5", 10, SOUND, "The waves produced by a vibrating body in air are:", ["Longitudinal waves", "Transverse waves", "Electromagnetic waves", "Magnetic waves"], "A");
P10(2014, "6", 10, OPT, "Which always gives a virtual image?", ["Concave lens", "Convex mirror", "Plane mirror", "All of them"], "D");
P10(2014, "8", 10, SHM, "If the frequency of a pendulum is 10 Hz, its time period will be:", ["1 s", "10 s", "0.1 s", "0.01 s"], "C");
P10(2014, "9", 9, THERM, "Water has its maximum density at:", ["0 °C", "−4 °C", "4 °C", "100 °C"], "C");
P10(2014, "10", 9, PQ, "1 megametre = ______ metres:", ["10¹²", "10⁹", "10⁶", "10¹⁵"], "C");
P10(2014, "11", 10, OPT, "If p = 15 cm and q = 30 cm, the magnification is:", ["2", "1/2", "45", "15"], "A");
P10(2014, "12", 9, THERM, "The latent heat of vaporisation of water is:", ["3.36 × 10⁵ J/kg", "2.26 × 10⁵ J/kg", "2.26 × 10⁶ J/kg", "2.26 × 10⁻⁶ J/kg"], "C");
P10(2014, "14", 10, OPT, "A rainbow appears due to:", ["Absorption of light", "Dispersion of light", "Refraction of light", "Reflection of light"], "B");
P10(2014, "17", 10, CUR, "A rechargeable cell is called a ______ cell:", ["Daniell", "Secondary", "Primary", "Voltaic"], "B");
S10(2014, "B", "3", 10, NUC, "How much energy will be released when 20 g of mass is completely transformed into energy, using Einstein's equation?");
S10(2014, "B", "5", 10, SHM, "Write down three differences between transverse and longitudinal waves.");
S10(2014, "B", "6", 9, DYN, "A gun of mass 10 kg fires a bullet of mass 0.05 kg with a speed of 200 m/s. Calculate the recoil velocity of the gun.");
S10(2014, "B", "7", 9, MACH, "Derive the formula for the mechanical advantage of an inclined plane.");
S10(2014, "B", "8", 9, TEF, "A 5 m long beam is pivoted into a wall and a force of 100 N is applied vertically at its far end. Find the torque produced.");
S10(2014, "B", "9", 9, PQ, "Define: (i) Power (ii) Spectrum (iii) Newton.");
S10(2014, "B", "10", 10, EM, "How can a galvanometer be converted into an ammeter and a voltmeter? (Show only with labelled diagrams.)");
S10(2014, "B", "11", 9, THERM, "Find the amount of heat required to convert 10 kg of ice at 0 °C into water without changing the temperature. (latent heat of fusion of ice = 336000 J/kg)");
S10(2014, "B", "12", 10, NUC, "Write down any three differences between alpha and beta rays.");
S10(2014, "B", "13", 10, OPT, "Show the image formation and its characteristics by a convex mirror with the help of a ray diagram.");
S10(2014, "B", "14", 10, OPT, "The focal length of a convex lens is 20 cm. If the image formed by the lens is twice the size of the object, find the position of the object.");
S10(2014, "B", "15", 10, ELN, "Write three differences between forward and reverse bias.");
S10(2014, "B", "16", 10, EST, "Calculate the work done in carrying a charge of +25 µC from A to B, if A is at a potential of −60 V and B is at 10 V.");
S10(2014, "B", "17", 9, THERM, "Define: (i) Resonance (ii) Inertia (iii) Specific heat.");
S10(2014, "B", "19", 10, EM, "Define an electric motor and write down two factors on which its speed depends.");
S10(2014, "B", "20", 9, DYN, "Two bodies of masses 5 kg and 4 kg are attached to the ends of a string which passes over a frictionless pulley so that the two bodies hang vertically. Find the acceleration of the bodies.");
S10(2014, "B", "21", 10, NUC, "Write down three uses of laser technology.");
S10(2014, "B", "22", 10, SHM, "20 waves per second pass through a point on the surface of a pond. Calculate the wavelength if the velocity of the waves is 3.5 m/s.");
S10(2014, "C", "23", 9, KIN, "(a) With the help of vf, vi and S, derive the third equation of motion. (b) What is a bimetallic strip? Describe its three applications. (c) With the help of a prism, draw the solar spectrum (dispersion of light).");
S10(2014, "C", "24", 10, NUC, "(a) Define a nuclear fission reaction. Write its equation and explain the chain reaction. (b) Define resolution of a vector and resolve a vector into its components. (c) Draw diagrams of the defects of the eye and describe short sightedness and long sightedness.");
S10(2014, "C", "25", 9, WE, "(a) Define kinetic energy and derive the equation K.E. = ½mv². (b) Draw the diagram of a nuclear reactor and describe the importance of boron rods. (c) With the help of figures, write the four rules for the reflection of rays of light by a concave mirror.");

// ======================= CLASS 10 PHYSICS 2012 =======================
P10(2012, "ii", 10, OPT, "The least distance of distinct vision for a normal eye is:", ["20 cm", "25 cm", "30 cm", "35 cm"], "B");
P10(2012, "iv", 9, PQ, "One nanometre is equal to:", ["10⁻³ m", "10⁻⁵ m", "10⁻⁹ m", "10⁻¹² m"], "C");
P10(2012, "v", 9, THERM, "Evaporation takes place at:", ["0 °C", "100 °C", "−100 °C", "All temperatures"], "D");
P10(2012, "vi", 10, OPT, "The focal length of a +2 dioptre convex lens is:", ["10 cm", "25 cm", "50 cm", "75 cm"], "C");
P10(2012, "vii", 10, CUR, "The rate of flow of charge in a conductor is called:", ["Current", "Volt", "Farad", "Coulomb"], "A");
P10(2012, "viii", 10, EM, "The relation between magnetic field and electric current was discovered by:", ["Newton", "Oersted", "Faraday", "Fleming"], "B");
P10(2012, "x", 10, SHM, "The time period of a second's pendulum is:", ["1 second", "2 seconds", "3 seconds", "4 seconds"], "B");
P10(2012, "xi", 9, DYN, "If the mass of a body is 10 kg, its weight will be:", ["9.8 g", "98 N", "0.98 N", "0.98 kg"], "B");
P10(2012, "xii", 10, NUC, "The lightest particle in an atom is the:", ["Neutron", "Proton", "Alpha particle", "Electron"], "D");
P10(2012, "xiii", 10, CUR, "Joule per coulomb is called:", ["Ampere", "Ohm", "Volt", "Watt"], "C");
P10(2012, "xiv", 10, SOUND, "The wave produced by a vibrating body in air is a:", ["Transverse wave", "Longitudinal wave", "Electromagnetic wave", "Stationary wave"], "B");
P10(2012, "xv", 10, OPT, "If q = 6 cm and p = 2 cm, the magnification of the lens is:", ["2 times", "3 times", "4 times", "5 times"], "B");
P10(2012, "xvii", 9, MACH, "Which of these is not a simple machine?", ["Pair of scissors", "Pair of forceps", "Door", "Bicycle"], "D");
S10(2012, "B", "2", 9, VEC, "Define scalar and vector quantities with two examples of each.");
S10(2012, "B", "3", 9, TEF, "Define equilibrium. Write the names of the three states of equilibrium and give one example of each.");
S10(2012, "B", "4", 9, VEC, "With the help of trigonometric ratios, find the magnitude of the horizontal and vertical components of a vector.");
S10(2012, "B", "5", 9, KIN, "A car is moving on a straight road at a speed of 5 m/s. It is accelerated at 3 m/s². Calculate its velocity after 4 seconds.");
S10(2012, "B", "6", 9, PQ, "Write down three contributions of Al-Biruni in the field of science.");
S10(2012, "B", "7", 9, POM, "State Pascal's principle and write its three uses in daily life.");
S10(2012, "B", "8", 9, DYN, "Define the following laws: (i) Boyle's law (ii) Law of conservation of momentum (iii) Newton's third law of motion.");
S10(2012, "B", "9", 9, THERM, "How much heat is required to raise the temperature of 100 g of water from 20 °C to 80 °C? (specific heat of water = 4200 J kg⁻¹ °C⁻¹)");
S10(2012, "B", "10", 10, OPT, "What is Newton's corpuscular theory of light? Write down two phenomena which support this theory.");
S10(2012, "B", "11", 9, WE, "A force of 588 N acts on a box to move it a distance of 4 m in 40 seconds. Calculate the power.");
S10(2012, "B", "12", 10, EST, "Define: (i) Alternating current (A.C.) (ii) Electric field (iii) Electrostatic induction.");
S10(2012, "B", "13", 10, OPT, "Write three uses of a concave mirror.");
S10(2012, "B", "14", 10, NUC, "Write three differences between α-rays and β-rays.");
S10(2012, "B", "15", 10, CUR, "Derive the relation W = I²Rt.");
S10(2012, "B", "16", 10, ELN, "What is a transistor? Describe the two types of transistor with the help of diagrams.");
S10(2012, "B", "17", 10, CUR, "Find the resistance of a bulb if a current of 0.6 A passes through it and the potential difference across it is 90 V.");
S10(2012, "B", "18", 9, THERM, "Define the coefficient of linear expansion and the coefficient of volumetric expansion. Write the relation between them.");
S10(2012, "B", "19", 10, OPT, "The radius of curvature of a concave mirror is 20 cm. Where should an object be placed to get its real image magnified twice?");
S10(2012, "B", "20", 10, OPT, "Write down three characteristics of the image formed by a plane mirror.");
S10(2012, "B", "21", 9, VEC, "A force of 100 N acts at an angle of 60° with the horizontal. Find its horizontal and vertical components. (cos 60° = 0.5, sin 60° = 0.866)");
S10(2012, "B", "22", 10, CUR, "Write down any three characteristics of resistances connected in parallel.");
S10(2012, "C", "23", 9, WE, "(a) Define potential energy and kinetic energy and derive K.E. = ½mv². (b) Define the capacitance of a capacitor and write three factors on which it depends. (c) Define: (i) Proton (ii) Echo (iii) Nuclear reactor (iv) Doping.");
S10(2012, "C", "24", 10, EST, "(a) Define Coulomb's law and derive F = k·q₁q₂/r². (b) Define radioisotopes and write the uses of Co-60, I-131 and P-32. (c) Define the loudness of sound and write three factors on which it depends.");
S10(2012, "C", "25", 9, KIN, "(a) Derive the equation 2aS = vf² − vi². (b) Draw a neat labelled ray diagram of a simple microscope, write the characteristics of its image and the formula for its magnifying power. (c) Define: (i) Simple harmonic motion (ii) Frequency (iii) Time period (iv) Pitch.");

// ======================= CLASS 10 PHYSICS 2011 =======================
P10(2011, "i", 10, ELN, "Amplification can be obtained by a:", ["Radar", "Transistor", "P-N junction", "Capacitor"], "B");
P10(2011, "ii", 9, KIN, "If v = 10 m/s and t = 5 s, the distance S will be:", ["15 m", "5 m", "2 m", "50 m"], "D");
P10(2011, "iii", 10, NUC, "Elements with atomic number greater than 82 are called:", ["Semiconductors", "Conductors", "Insulators", "Radioactive elements"], "D");
P10(2011, "iv", 10, EST, "The substance placed between the plates of a capacitor is called a:", ["Dielectric", "Capacitor", "Insulator", "Resistance"], "A");
P10(2011, "v", 9, GRAV, "In SI units the value of G is:", ["6.67 × 10¹¹ N m²/kg²", "6.67 × 10⁻¹¹ N m²/kg²", "6.76 × 10¹¹ N m²/kg²", "6.76 × 10⁻¹¹ N m²/kg²"], "B");
P10(2011, "vii", 9, PQ, "The unit of luminous intensity is:", ["N/m²", "Volt", "Candela", "Joule"], "C");
P10(2011, "viii", 9, DYN, "Which of the following is the same as kg·m/s²?", ["Joule", "Newton", "Pascal", "Watt"], "B");
P10(2011, "x", 9, KIN, "The rate of motion in a specific direction is called:", ["Speed", "Velocity", "Acceleration", "Power"], "B");
P10(2011, "xi", 9, DYN, "The weight of a 10 kg mass is about:", ["98 N", "980 N", "100 N (g = 10)", "196 N"], "A");
P10(2011, "xiii", 9, PQ, "One micrometre is equivalent to:", ["10⁻³ m", "10⁻⁶ m", "10⁻⁹ m", "10⁻¹² m"], "B");
P10(2011, "xiv", 10, OPT, "The refractive index of water is:", ["1.5", "1", "2.4", "1.33"], "D");
P10(2011, "xv", 10, OPT, "The human eye is similar to a:", ["Microscope", "Telescope", "Camera", "Periscope"], "C");
P10(2011, "xvi", 10, OPT, "Kitab-al-Manazir was written by:", ["Ibn-al-Haitham", "Yaqoob al-Kindi", "Al-Biruni", "Musa Al-Khwarizmi"], "A");
P10(2011, "xvii", 9, KIN, "The acceleration of a 1 kg ball falling freely downward is:", ["9.8 m/s²", "−9.8 m/s² upward", "1 m/s²", "98 m/s²"], "A");
S10(2011, "B", "2", 9, PQ, "Define physics and write down only the names of four of its branches.");
S10(2011, "B", "3", 9, DYN, "A body weighing 25 N is placed on a wooden plank. How much force is required to set it in motion if the coefficient of friction between the plank and the body is 0.4?");
S10(2011, "B", "4", 9, WE, "Define work and write down its two formulae.");
S10(2011, "B", "5", 9, DYN, "Define: (i) Limiting friction (ii) Inertia (iii) Power.");
S10(2011, "B", "6", 9, MACH, "Define a machine and write down the names of four simple machines.");
S10(2011, "B", "7", 10, ELN, "What is a transistor? Write its two advantages.");
S10(2011, "B", "8", 10, EM, "Draw a labelled diagram of an electric bell.");
S10(2011, "B", "9", 9, DYN, "Write down three differences between mass and weight.");
S10(2011, "B", "10", 9, DYN, "A body of mass 20 kg is moving with a speed of 15 m/s. Find its momentum.");
S10(2011, "B", "11", 9, THERM, "How much heat is required to raise the temperature of 100 kg of iron through 10 °C? (specific heat of iron = 499.8 J kg⁻¹ °C⁻¹)");
S10(2011, "B", "12", 10, OPT, "Define: (i) Dispersion of light (ii) Magnification (iii) Focal length of a concave mirror.");
S10(2011, "B", "13", 10, OPT, "Draw the ray diagram for the formation of an image in a plane mirror.");
S10(2011, "B", "14", 10, CUR, "Calculate the current passing through an electric heater if 1800 C of charge flows through it in 3 minutes.");
S10(2011, "B", "15", 10, SHM, "Prove that v = fλ.");
S10(2011, "B", "17", 9, KIN, "A stone is dropped from a tower and reaches the ground in 5 seconds. Calculate the height of the tower.");
S10(2011, "B", "18", 9, VEC, "Define resolution of a vector and write down the two formulae of rectangular components.");
S10(2011, "B", "19", 10, NUC, "Describe the quantum theory of light.");
S10(2011, "B", "20", 10, SHM, "A sitar string vibrates at 400 Hz. What is the time period of this vibration?");
S10(2011, "B", "21", 10, NUC, "Define: (i) Half-life of radioactive elements (ii) Doping (iii) Magnetic field.");
S10(2011, "B", "22", 10, NUC, "In a nuclear reaction 9 × 10¹⁰ J of energy is released due to the conversion of mass into energy. How much mass has been converted? (speed of light = 3 × 10⁸ m/s)");
S10(2011, "C", "23", 9, KIN, "(a) Derive the equation S = vi·t + ½at². (b) Draw the ray diagram of a compound microscope and write its working. (c) Define radioisotopes and state one use in agriculture and two uses in medicine.");
S10(2011, "C", "24", 9, THERM, "(a) State Boyle's law, Charles's law and the pressure law, and derive PV = nRT. (b) Draw ray diagrams for the images formed by a concave mirror and write their characteristics. (c) What is RADAR? Write its three uses.");
S10(2011, "C", "25", 10, NUC, "(a) Define a fission reaction, write its equation and draw the diagram of a chain reaction. (b) Define: (i) Ampere (ii) Volt (iii) Farad (iv) Ohm. (c) State the following laws/principles: (i) Hooke's law (ii) Pascal's principle (iii) Newton's second law of motion (iv) Snell's law.");

// ======================= CLASS 10 CHEMISTRY =======================
const EQ = "Chemical Equilibrium", ABS = "Acids, Bases and Salts", ORG = "Organic Chemistry", HYD = "Hydrocarbons", BIOC = "Biochemistry",
  ENVC = "Environmental Chemistry", WATER = "Water", IND = "Chemical Industries", ANAL = "Analytical Chemistry";
const C10 = (year: number, qno: string, ch: string, t: string, o: string[], a: "A" | "B" | "C" | "D") => M(10, "Chemistry", year, qno, 10, ch, t, o, a);
const CQ = (year: number, sec: "B" | "C", qno: string, ch: string, t: string) => Q(10, "Chemistry", year, sec, qno, 10, ch, t, sec === "B" ? 3 : 6);

C10(2025, "ii", ABS, "The pH value of black coffee is about:", ["10.2", "12.0", "3.8", "5.0"], "D");
C10(2025, "iii", IND, "Which is used for surfacing roads?", ["Naphtha", "Paraffin", "Coal", "Bitumen"], "D");
C10(2025, "iv", BIOC, "The word protein is derived from the Greek word 'proteios', which means:", ["Second", "First (of first importance)", "Third", "Zero"], "B");
C10(2025, "vi", ORG, "The functional group –COOH is found in:", ["Alkynes", "Alcohols", "Phenols", "Carboxylic acids"], "D");
C10(2025, "vii", ORG, "Benzene is a/an:", ["Inorganic compound", "Heterocyclic compound", "Cyclic (aromatic) compound", "Alicyclic compound"], "C");
C10(2025, "viii", BIOC, "Glucose is a/an:", ["Saccharide only", "Ketose", "Pentose", "Aldose"], "D");
C10(2025, "ix", BIOC, "This vitamin helps in the clotting of blood:", ["A", "D", "E", "K"], "D");
C10(2025, "x", ENVC, "Which causes the production of (photochemical) smog?", ["Sulphur dioxide", "Carbon monoxide", "Nitrogen oxides", "Ozone"], "C");
C10(2025, "xi", WATER, "Water which does not form lather with soap is called:", ["Soft water", "Polluted water", "Hard water", "Distilled water"], "C");
CQ(2025, "B", "2", ORG, "Define organic chemistry and write two general characteristics of organic compounds.");
CQ(2025, "B", "3", WATER, "Write down three physical properties of water.");
CQ(2025, "B", "4", BIOC, "What are carbohydrates? Differentiate between aldoses and ketoses.");
CQ(2025, "B", "5", HYD, "Write the structural formulae of: (i) 2,3-dimethylpentane (ii) 3-ethyl-1-hexene (iii) pentyne.");
CQ(2025, "B", "6", ANAL, "Define: (i) Error (ii) Precision (iii) Accuracy.");
CQ(2025, "B", "8", ENVC, "What is meant by acid rain and how does it damage monuments?");
CQ(2025, "B", "9", IND, "What materials are required for the preparation of soft drinks? Name them.");
CQ(2025, "B", "10", IND, "Draw a flow sheet of soap preparation.");
CQ(2025, "B", "11", ABS, "Find the pH, pOH, [OH⁻] and [H⁺] of a 2.46 × 10⁻⁹ M KOH solution.");
CQ(2025, "B", "12", ABS, "Write one use of each of the following salts: (i) hydrated calcium sulphate (ii) iron(II) sulphate heptahydrate (iii) potassium permanganate.");
CQ(2025, "B", "13", ORG, "Give reasons: (i) Why are carbon compounds more numerous than silicon compounds? (ii) Why does temperature increase with altitude in the stratosphere?");
CQ(2025, "C", "14", ABS, "State three different theories of acids and bases with examples and one limitation of each. Also complete the conjugate acid and conjugate base for: H₂SO₄ + H₂O ⇌ ; HCl + NH₃ ⇌ ; CH₃COOH + H₂O ⇌");
CQ(2025, "C", "15", ENVC, "Elaborate the greenhouse effect (global warming).");
CQ(2025, "C", "16", WATER, "Describe six water-borne diseases.");
CQ(2025, "C", "17", ABS, "What are salts? Write their preparation by the action of an acid on (i) a metal hydroxide (ii) a metal carbonate (iii) a metal oxide, with a balanced equation for each.");
CQ(2025, "C", "18", IND, "Define petroleum. Describe its fractional distillation. Name any five fractions with their hydrocarbons and show them with a labelled diagram.");
CQ(2025, "C", "19", IND, "Explain the pharmaceutical industry and describe any five of its beneficial impacts on our society.");

C10(2024, "2", EQ, "A reversible chemical reaction is at equilibrium when:", ["Qc = Kc", "Qc > Kc", "Qc < Kc", "None of these"], "A");
C10(2024, "3", BIOC, "Insulin, which enables our body to use glucose obtained from food or glycogen, is basically a:", ["Hormone", "Enzyme", "Mineral", "Starch"], "A");
C10(2024, "4", ORG, "The vital force theory was introduced by:", ["Berzelius", "Wöhler", "Lewis", "Robert Boyle"], "A");
C10(2024, "6", HYD, "The general formula of an alkyl group is:", ["CₙH₂ₙ", "CₙH₂ₙ₊₁", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂"], "B");
C10(2024, "7", ANAL, "Spectroscopy is the study of the interaction of light with:", ["Liquids", "Solids", "Gases", "Matter"], "D");
C10(2024, "8", WATER, "The density of water is maximum at:", ["−4 °C", "0 °C", "4 °C", "100 °C"], "C");
C10(2024, "9", ANAL, "In the flame (Beilstein) test, a bluish-green colour with a copper halide shows the presence of:", ["Halogen", "Hydrogen", "Copper", "Nickel"], "A");
C10(2024, "10", IND, "Which is used for surfacing roads?", ["Naphtha", "Paraffin", "Coal", "Bitumen"], "D");
C10(2024, "11", ENVC, "Infrared radiation from the Earth's surface is absorbed in the air mainly by higher concentrations of:", ["CH₄", "O₃", "CO₂", "N₂O"], "C");
C10(2024, "12", WATER, "Which is not a water-borne disease?", ["Hepatitis", "Typhoid", "Dysentery", "Anaemia"], "D");
CQ(2024, "B", "2", ORG, "Define: (i) Organic chemistry (ii) Biochemistry (iii) Environmental chemistry.");
CQ(2024, "B", "3", ABS, "Describe briefly two types of buffer solutions with examples.");
CQ(2024, "B", "4", ABS, "Explain the Arrhenius concept of acids and bases with suitable examples.");
CQ(2024, "B", "5", HYD, "Write the structural formulae of: (i) 2,3-dimethylpentane (ii) 3-ethyl-1-hexene (iii) 2-butyne.");
CQ(2024, "B", "6", ENVC, "What is the atmosphere? List its five major layers.");
CQ(2024, "B", "7", ORG, "State the vital force theory. How was it discarded by Friedrich Wöhler?");
CQ(2024, "B", "8", ANAL, "Define: (i) Titration (ii) Titrant (iii) Analyte.");
CQ(2024, "B", "9", BIOC, "Write one use of each of the following: (i) yeast (ii) cellulase (iii) amylase.");
CQ(2024, "B", "10", IND, "How is vegetable oil converted into vegetable ghee (hydrogenated fat)?");
CQ(2024, "B", "11", ENVC, "Write down any three adverse impacts of global warming.");
CQ(2024, "B", "12", ABS, "A solution of HCl has a pH of 2.3. Calculate its pOH and [H⁺].");
CQ(2024, "B", "13", WATER, "Justify: (i) Why is it cooler on top of a mountain than at sea level? (ii) Why is water called a universal solvent?");
CQ(2024, "C", "14", EQ, "State the law of mass action. Apply it to the reversible reaction aA + bB ⇌ cC + dD and derive the expression for the equilibrium constant.");
CQ(2024, "C", "15", ANAL, "What is meant by quantitative analysis? Also define: (i) error (ii) systematic error (iii) random error (iv) accuracy (v) precision.");
CQ(2024, "C", "16", ABS, "What are salts? Write their preparation by the action of an acid on (i) a metal hydroxide (ii) a metal carbonate (iii) a metal oxide, with an equation for each.");
CQ(2024, "C", "17", BIOC, "What are amino acids? Describe the formation of a dipeptide through a peptide linkage between two amino acid units, with a structural equation.");
CQ(2024, "C", "18", BIOC, "What are carbohydrates? Classify them on the basis of hydrolysis into three types with an example of each, and mention their sources.");
CQ(2024, "C", "19", ENVC, "Describe how ozone depletion occurs in the stratosphere by chlorofluorocarbons (CFCs). Also give three harmful impacts of ozone depletion.");

C10(2023, "1", EQ, "A system is at equilibrium when:", ["Kc = Qc", "Kc < Qc", "Kc > Qc", "None of these"], "A");
C10(2023, "3", ABS, "If the pH value is greater than 7, the solution is:", ["Acidic", "Basic", "Neutral", "Amphoteric"], "B");
C10(2023, "4", ORG, "The functional group –COOH is found in:", ["Alkynes", "Alcohols", "Phenols", "Carboxylic acids"], "D");
C10(2023, "5", ORG, "The branch of chemistry which deals with hydrocarbons and their derivatives is:", ["Organic chemistry", "Inorganic chemistry", "Biochemistry", "Physical chemistry"], "A");
C10(2023, "6", BIOC, "Glucose is a:", ["Vitamin", "Protein", "Lipid", "Carbohydrate"], "D");
C10(2023, "7", BIOC, "Amino acids are the building blocks of:", ["Nucleic acids", "Proteins", "Vitamins", "Lipids"], "B");
C10(2023, "10", ENVC, "Ozone is a gas found in the layer called the:", ["Troposphere", "Mesosphere", "Stratosphere", "Exosphere"], "C");
C10(2023, "11", WATER, "The fresh water present on the surface of the Earth is about:", ["0.3%", "3%", "0.2%", "2%"], "B");
C10(2023, "12", IND, "Citric acid is used in the preparation of cold drinks for:", ["Sweet taste", "Bitter taste", "Sour taste", "Salty taste"], "C");
CQ(2023, "B", "2", ORG, "Write a few points about society, technology and science.");
CQ(2023, "B", "3", EQ, "The value of Kc for 2HI(g) ⇌ H₂(g) + I₂(g) is 1 × 10⁻⁴. At a given temperature the concentrations are [HI] = 2 × 10⁻⁵, [H₂] = 1 × 10⁻⁵ and [I₂] = 1 × 10⁻⁵ mol dm⁻³. Predict the direction of the reaction.");
CQ(2023, "B", "4", ABS, "What are the limitations of Arrhenius's theory?");
CQ(2023, "B", "5", ABS, "Write three uses of salts.");
CQ(2023, "B", "7", ORG, "What do you mean by the vital force theory?");
CQ(2023, "B", "8", HYD, "Write down the molecular, structural and condensed formulae of methane, ethane and propane.");
CQ(2023, "B", "9", BIOC, "Define: (i) Aldose (ii) Ketose (iii) Saccharides.");
CQ(2023, "B", "10", BIOC, "Explain amino acids as the monomers (building blocks) of proteins.");
CQ(2023, "B", "11", WATER, "How can temporary hardness of water be removed by Clark's method?");
CQ(2023, "B", "12", EQ, "Write three characteristics of the equilibrium constant Kc.");
CQ(2023, "B", "13", HYD, "Give reasons: (i) Petroleum is called 'black gold'. (ii) Alkanes are called saturated hydrocarbons.");
CQ(2023, "C", "14", IND, "Explain the process of sugar preparation from sugarcane.");
CQ(2023, "C", "15", ANAL, "What is high-performance liquid chromatography (HPLC)? Explain it.");
CQ(2023, "C", "16", BIOC, "Distinguish between fat-soluble and water-soluble vitamins.");
CQ(2023, "C", "17", HYD, "Differentiate between saturated and unsaturated hydrocarbons.");
CQ(2023, "C", "18", ABS, "Define buffers. What is their composition? How are they used?");
CQ(2023, "C", "19", ENVC, "Describe global warming.");

// ======================= CLASS 10 BIOLOGY =======================
const GAS = "Gaseous Exchange", HOMEO = "Homeostasis", COORD = "Coordination and Control", SUP = "Support and Movement", REPRO = "Reproduction",
  INHER = "Inheritance", ENVB = "Man and His Environment", BIOTEC = "Biotechnology", PHARM = "Pharmacology", CELL9 = "Cells and Tissues";
const B10 = (year: number, qno: string, ch: string, t: string, o: string[], a: "A" | "B" | "C" | "D", tg = 10) => M(10, "Biology", year, qno, tg, ch, t, o, a);
const BQ = (year: number, sec: "B" | "C", qno: string, ch: string, t: string, tg = 10) => Q(10, "Biology", year, sec, qno, tg, ch, t, sec === "B" ? 3 : 6);

B10(2025, "i", HOMEO, "The process of maintaining body temperature within suitable limits is called:", ["Homeotherm", "Heterotherm", "Osmoregulation", "Thermoregulation"], "D");
B10(2025, "ii", REPRO, "The type of asexual reproduction in yeast is:", ["Fission", "Budding", "Fragmentation", "Spore formation"], "B");
B10(2025, "iii", GAS, "A respiratory surface should be:", ["Thin and moist", "Permeable", "Very large", "All of these"], "D");
B10(2025, "iv", HOMEO, "The kidney is covered by a membrane called the:", ["Pericardium", "Peritoneum", "Pleural membrane", "Plumule"], "B");
B10(2025, "v", COORD, "In this type of movement, organisms move towards or away from a stimulus by growth of an organ:", ["Locomotory movement", "Tropic movement", "Nastic movement", "Paratonic movement"], "B");
B10(2025, "vi", BIOTEC, "Dough rises during alcoholic fermentation due to:", ["Methyl alcohol", "Carbon dioxide", "Ethyl alcohol", "Water"], "B");
B10(2025, "vii", REPRO, "The inner thin layer of the seed coat is called:", ["Testa", "Chalaza", "Cotyledon", "Tegmen"], "D");
B10(2025, "viii", SUP, "A pair of muscles that work in opposite directions is called:", ["Antagonistic", "Cardiac", "Smooth", "Abductor"], "A");
B10(2025, "ix", PHARM, "'Kitab-ul-Manazir' was written by:", ["Jabir bin Hayyan", "Ibn-ul-Haitham", "Ali Ibn-e-Isa", "Bu Ali Sina"], "B");
B10(2025, "x", SUP, "The knee joint is an example of a:", ["Ball and socket joint", "Sliding joint", "Hinge joint", "Immovable joint"], "C");
B10(2025, "xi", COORD, "The cells of the nervous system are called:", ["Nerves", "Stem cells", "Effectors", "Neurons"], "D");
B10(2025, "xii", ENVB, "Which is always at the beginning of a food chain?", ["Herbivores", "Carnivores", "Decomposers", "Producers"], "D");
BQ(2025, "B", "2", COORD, "What is the role of the islets of Langerhans?");
BQ(2025, "B", "3", GAS, "What is lung cancer?");
BQ(2025, "B", "4", BIOTEC, "Describe the tools used in genetic engineering.");
BQ(2025, "B", "5", HOMEO, "What are the three important aspects of homeostasis? Define any two of them.");
BQ(2025, "B", "6", ENVB, "Write three characteristics of hydrophytes.");
BQ(2025, "B", "7", ENVB, "Write the names of three mammals and three birds that are extinct or endangered in Pakistan.");
BQ(2025, "B", "8", REPRO, "Draw a neat and labelled diagram of the L.S. of an angiospermic flower OR the structure of a bean seed.");
BQ(2025, "B", "9", REPRO, "Differentiate between sexual and asexual reproduction.");
BQ(2025, "B", "10", HOMEO, "Draw a neat and labelled diagram of the L.S. of human skin.");
BQ(2025, "B", "11", COORD, "Define: (i) Myopia (ii) Suckers (iii) Consumers.");
BQ(2025, "B", "12", BIOTEC, "What is a fermenter? Write any two of its advantages.");
BQ(2025, "B", "13", SUP, "What are the three main types of skeleton? Describe any one of them with an example.");
BQ(2025, "C", "14", COORD, "Describe in detail the structure of the human brain.");
BQ(2025, "C", "15", GAS, "Draw a neat and labelled diagram of the human respiratory system OR the reproductive system of a male rabbit.");
BQ(2025, "C", "16", ENVB, "Define ecosystem and describe its biotic factors in detail.");
BQ(2025, "C", "17", REPRO, "Explain the difference between epigeal and hypogeal germination with the help of diagrams.");
BQ(2025, "C", "18", REPRO, "What is fertilization? Describe any five differences between external and internal fertilization.");
BQ(2025, "C", "19", ENVB, "What is water pollution? How can it be controlled?");

B10(2024, "1", GAS, "The respiratory surface of humans is the:", ["Nostril", "Bronchiole", "Alveoli", "Trachea"], "C");
B10(2024, "2", HOMEO, "The network of blood capillaries is present in this layer of the skin:", ["Epidermis", "Dermis", "Hypodermis", "Endodermis"], "B");
B10(2024, "3", COORD, "A stimulus is detected by a:", ["Receptor", "Effector", "Nerve", "All of these"], "A");
B10(2024, "4", SUP, "Softening and weakening of bones in children due to deficiency of vitamin D is called:", ["Osteoporosis", "Osteoarthritis", "Rickets", "Rheumatic fever"], "C");
B10(2024, "5", REPRO, "The 3N (triploid) nucleus in angiosperms develops into the:", ["Seed coat", "Cotyledon", "Embryo", "Endosperm"], "D");
B10(2024, "6", INHER, "The chemical material of a chromosome is called:", ["Chromatids", "Chromomeres", "Chromonema", "Chromatin"], "D");
B10(2024, "7", ENVB, "A group of organisms of the same species living in a particular area is called a:", ["Community", "Species", "Gene pool", "Population"], "D");
B10(2024, "8", BIOTEC, "The study that mapped the complete human genome is called:", ["PCR", "HGP (Human Genome Project)", "Medicine", "Somaclonal variation"], "B");
B10(2024, "10", GAS, "The rate of breathing increases due to:", ["Increase of CO₂ in the blood", "Increase of O₂ in the blood", "Decrease of CO₂ in the blood", "Decrease of O₂ in the blood"], "A");
B10(2024, "11", REPRO, "Seed production without fusion of male and female gametes is called:", ["Parthenocarpy", "Apomixis", "Grafting", "Scion"], "B");
B10(2024, "12", PHARM, "The book 'Kitab-ul-Manazir' was written by:", ["Jabir bin Hayyan", "Ibn-ul-Haitham", "Ali bin Isa", "Bu Ali Sina"], "B");
BQ(2024, "B", "2", GAS, "Why is smoking dangerous for health, and how is it related to respiratory disorders?");
BQ(2024, "B", "3", COORD, "What is epilepsy?");
BQ(2024, "B", "4", SUP, "Write three differences between bone and cartilage.");
BQ(2024, "B", "5", SUP, "Describe any three functions of joints.");
BQ(2024, "B", "6", INHER, "Describe variation and explain any two of its causes.");
BQ(2024, "B", "7", ENVB, "What is pollution? How can water pollution be controlled?");
BQ(2024, "B", "8", INHER, "Describe any three of: (i) allele (ii) dominant allele (iii) homologous chromosomes (iv) recessive allele.");
BQ(2024, "B", "9", ENVB, "Write a note on acid rain.");
BQ(2024, "B", "10", INHER, "Describe briefly the structure of DNA.");
BQ(2024, "B", "11", REPRO, "Draw a neat and labelled diagram of an ovule.");
BQ(2024, "B", "12", ENVB, "What are xerophytes?");
BQ(2024, "B", "13", PHARM, "How does a vaccine work against a pathogen?");
BQ(2024, "C", "14", PHARM, "What are addictive drugs? Explain any two of them.");
BQ(2024, "C", "15", HOMEO, "Draw a neat and labelled diagram of the human kidney or nephron.");
BQ(2024, "C", "16", COORD, "Describe the structure and functions of the human ear or eye.");
BQ(2024, "C", "17", BIOTEC, "Define biotechnology. Explain its role in medicine and agriculture.");
BQ(2024, "C", "18", COORD, "Define an endocrine gland. Describe the hormones secreted by the pituitary and thyroid glands.");
BQ(2024, "C", "19", REPRO, "What is meant by sexual and asexual reproduction? Describe any five differences.");

B10(2022, "i", GAS, "The biological process which carries out gaseous exchange is:", ["Photosynthesis", "Respiration", "Growth", "Alveoli"], "B");
B10(2022, "ii", HOMEO, "The network of blood capillaries is present in this layer of the skin:", ["Epidermis", "Dermis", "Hypodermis", "Endodermis"], "B");
B10(2022, "iii", COORD, "The hormone ADH is released from the:", ["Pituitary gland", "Kidneys", "Liver", "Lungs"], "A");
B10(2022, "iv", COORD, "The automatic adjustment of the eye's focus to get a sharp image of a near object is called:", ["Vision", "Accommodation", "Focus", "All of these"], "B");
B10(2022, "v", PHARM, "'Kitab-ul-Manazir' was written by:", ["Jabir bin Hayyan", "Ibn-al-Haitham", "Ali Ibn Isa", "Bu Ali Sina"], "B");
B10(2022, "vi", SUP, "The framework which gives shape to the body is the:", ["Bone", "Skeleton", "Cartilage", "Architecture"], "B");
B10(2022, "viii", SUP, "A pair of muscles that work in opposite directions is called:", ["Antagonistic", "Cardiac", "Smooth", "Abductor"], "A");
B10(2022, "ix", REPRO, "Seed production without fusion of male and female gametes is:", ["Parthenocarpy", "Apomixis", "Grafting", "Scion"], "B");
B10(2022, "xi", ENVB, "A large biological region recognised by its climate and vegetation is a:", ["Ecosystem", "Biome", "Biosphere", "Biomass"], "B");
B10(2022, "xii", BIOTEC, "The study that mapped the complete human genome is called:", ["PCR", "HGP (Human Genome Project)", "Medicine", "Somaclonal variation"], "B");
B10(2022, "xiii", BIOTEC, "Bread dough rises during alcoholic fermentation due to:", ["Methyl alcohol", "CO₂", "Ethyl alcohol", "H₂O"], "B");
B10(2022, "xiv", PHARM, "The father of antiseptics is:", ["Alexander Fleming", "Edward Jenner", "Joseph Lister", "Oswald Schmiedeberg"], "C");
B10(2022, "xv", PHARM, "Drugs that slow down normal brain function are called:", ["Narcotics", "Hallucinogens", "Marijuana", "Sedatives"], "D");
B10(2022, "xvi", GAS, "The disorder associated with degeneration of the alveoli is:", ["Bronchitis", "Lung cancer", "Asthma", "Emphysema"], "D");
B10(2022, "xvii", INHER, "The outer parts of the DNA helix, made of sugar and phosphate, are called:", ["Nucleoproteins", "Uprights (backbone)", "Rungs", "Phosphodiester"], "B");
B10(2022, "xviii", COORD, "The vitamin necessary for proper vision is:", ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], "A");
B10(2022, "xxi", ENVB, "Plants that grow near coastal (salty) areas are called:", ["Xerophytes", "Halophytes", "Epiphytes", "Hygrophytes"], "B");
B10(2022, "xxii", GAS, "Each stoma is formed by:", ["One guard cell", "Two guard cells", "Three guard cells", "Four guard cells"], "B");
B10(2022, "xxiii", ENVB, "The struggle between organisms of a community occupying the same habitat is called:", ["Predation", "Competition", "Mutualism", "Commensalism"], "B");
B10(2022, "xxiv", COORD, "The part of the brain involved in balance and precision of movement is the:", ["Cerebrum", "Cerebellum", "Thalamus", "Medulla oblongata"], "B");
BQ(2022, "B", "2", CELL9, "Write three differences between a plant cell and an animal cell.", 9);
BQ(2022, "B", "3", REPRO, "Draw a neat and labelled diagram of an ovule.");
BQ(2022, "B", "4", ENVB, "How does light affect an ecosystem?");
BQ(2022, "B", "5", SUP, "What is rickets? Write its causes.");
BQ(2022, "B", "6", GAS, "How is an asthma patient characterised?");
BQ(2022, "B", "7", HOMEO, "Why is the skin considered an excretory organ?");
BQ(2022, "B", "8", INHER, "Define: (a) Homologous chromosomes (b) Allele (c) Recessive allele.");
BQ(2022, "B", "9", ENVB, "What is an algal bloom and how does it destroy the life of an aquatic ecosystem?");
BQ(2022, "B", "10", SUP, "Draw a neat and labelled diagram of a hinge OR a ball-and-socket joint.");
BQ(2022, "B", "11", PHARM, "Why do antibiotics not work against viral infections?");
BQ(2022, "B", "12", REPRO, "Distinguish between sexual and asexual reproduction.");
BQ(2022, "B", "13", INHER, "State Mendel's law of independent assortment. (No need to draw the checkerboard.)");
BQ(2022, "C", "14", COORD, "Draw a neat and labelled diagram of the human ear.");
BQ(2022, "C", "15", HOMEO, "Describe the urinary system of man with the help of a diagram.");
BQ(2022, "C", "16", REPRO, "What is germination? Write its necessary conditions and describe epigeal and hypogeal germination.");

// ======================= CLASS 9 PHYSICS =======================
const P9 = (year: number, qno: string, ch: string, t: string, o: string[], a: "A" | "B" | "C" | "D") => M(9, "Physics", year, qno, 9, ch, t, o, a);
const S9 = (year: number, sec: "B" | "C", qno: string, ch: string, t: string) => Q(9, "Physics", year, sec, qno, 9, ch, t, sec === "B" ? 3 : 6);

P9(2025, "i", PQ, "The number of significant figures in 0.00109 is:", ["5", "3", "2", "4"], "B");
P9(2025, "ii", KIN, "The shortest distance between two points (in a particular direction) is called:", ["Diameter", "Displacement", "Speed", "Velocity"], "B");
P9(2025, "iv", POM, "1 atm =", ["1.013 × 10² Pa", "1.013 × 10³ Pa", "1.013 × 10⁵ Pa", "1.013 × 10⁻⁵ Pa"], "C");
P9(2025, "v", PQ, "πr²h is the formula of:", ["Weight", "Momentum", "Power", "Volume"], "D");
P9(2025, "vi", WE, "If a machine performs 300 J of work in 15 seconds, its power will be:", ["20 W", "300 W", "1500 W", "4500 W"], "A");
P9(2025, "vii", THERM, "The SI unit of specific heat capacity is:", ["J kg⁻¹ K⁻¹", "J kg⁻¹ K", "J kg⁻¹ K²", "J kg⁻² K²"], "A");
P9(2025, "viii", POM, "Blowing up a balloon is an example of:", ["Pressure", "Force", "Power", "Weight"], "A");
P9(2025, "ix", VEC, "If the horizontal and vertical components of a force are 3 N and 4 N, the magnitude of the force will be:", ["0.5 N", "2.5 N", "5 N", "5.5 N"], "C");
P9(2025, "x", GRAV, "If the masses of two bodies and the distance between them are all tripled, the gravitational force will:", ["Be quadrupled", "Be doubled", "Remain the same", "Be halved"], "C");
P9(2025, "xi", DYN, "The quantity that measures the inertia of a body is its:", ["Mass", "Force", "Weight", "Friction"], "A");
P9(2025, "xii", POM, "To reduce the pressure on students' shoulders, the shoulder straps of school bags should be:", ["Thin", "Soft", "Narrow", "Wide"], "D");
S9(2025, "B", "2", VEC, "What do you mean by resolution of a vector? Also split a vector into its perpendicular components.");
S9(2025, "B", "3", POM, "Define pressure. Write down two factors affecting pressure.");
S9(2025, "B", "4", POM, "State and explain Hooke's law.");
S9(2025, "B", "5", POM, "Define density. Also write its formula and SI unit.");
S9(2025, "B", "6", WE, "What is wind energy? Write down two of its applications.");
S9(2025, "B", "7", VEC, "Write any three differences between scalar and vector quantities.");
S9(2025, "B", "8", DYN, "A gun of mass 6 kg fires a bullet of mass 40 g with a velocity of 100 m/s. Calculate the recoil velocity of the gun.");
S9(2025, "B", "9", POM, "A cylinder contains 120 cm³ of air at a pressure of 140 kPa. What will its volume be if the pressure is increased to 840 kPa?");
S9(2025, "B", "10", WE, "Calculate the power of a machine that performs 1800 J of work in 30 minutes.");
S9(2025, "B", "11", KIN, "A ball falls from the top of a height of 90 m. How much time will it take to reach the ground?");
S9(2025, "B", "12", THERM, "How much heat energy is required to raise the temperature of 50 g of water from 40 °C to 70 °C? (specific heat of water = 4200 J kg⁻¹ K⁻¹)");
S9(2025, "B", "13", GRAV, "Fatima's weight is 900 N on the Earth's surface. What will be her weight on the surface of the Moon?");
S9(2025, "C", "14", GRAV, "State Newton's law of gravitation. How can this law be used to derive the formula for the mass of the Earth?");
S9(2025, "C", "15", DYN, "Define momentum and write its SI unit. State and prove the law of conservation of momentum.");
S9(2025, "C", "16", KIN, "What do you mean by relative motion? Derive the second equation of motion.");
S9(2025, "C", "17", POM, "Which variables completely describe the behaviour of a gas on the basis of the kinetic molecular theory (KMT)? Explain any one of them.");
S9(2025, "C", "18", TEF, "Explain the two types of equilibrium with examples on the basis of the state of a body. Also write the two conditions of equilibrium in detail.");
S9(2025, "C", "19", THERM, "Define: (i) Specific heat capacity (ii) Latent heat of vaporisation (iii) Latent heat of fusion. Also write three benefits of the high specific heat capacity of water.");

P9(2024, "i", POM, "A spring balance is used to measure:", ["Mass", "Weight", "Elasticity", "Density"], "B");
P9(2024, "ii", POM, "A burning candle is an example of this state of matter:", ["Gas", "Liquid", "Solid", "All of these"], "D");
P9(2024, "iii", THERM, "Evaporation occurs at:", ["Freezing point", "Melting point", "Boiling point", "All temperatures"], "D");
P9(2024, "iv", POM, "Which is not a unit of pressure?", ["Pascal", "Bar", "Atmosphere", "Newton"], "D");
P9(2024, "v", DYN, "Centrifugal force is always directed:", ["Towards the centre", "Away from the centre", "Along the circular path", "In all directions"], "B");
P9(2024, "vi", KIN, "The least distance covered in a particular direction is called:", ["Distance", "Speed", "Displacement", "Acceleration"], "C");
P9(2024, "vii", PQ, "The number of significant figures in 91.60 is:", ["2", "3", "4", "5"], "C");
P9(2024, "viii", VEC, "Which is not a vector quantity?", ["Time", "Weight", "Displacement", "Acceleration"], "A");
P9(2024, "ix", GRAV, "The natural satellite of the Earth is:", ["Neptune", "Jupiter", "Moon", "Mars"], "C");
P9(2024, "x", WE, "If a machine performs 20 J of work in 10 seconds, its power will be:", ["200 W", "20 W", "2 W", "0.2 W"], "C");
P9(2024, "xi", POM, "1.013 × 10⁵ Pa is equal to:", ["1 atmosphere", "2 atmospheres", "3 atmospheres", "4 atmospheres"], "A");
P9(2024, "xii", DYN, "A body of mass 50 kg has an acceleration of 5 m/s². The force acting on it is:", ["200 N", "250 N", "260 N", "270 N"], "B");
S9(2024, "B", "2", PQ, "Define fundamental and derived quantities. Also write three examples of each.");
S9(2024, "B", "3", DYN, "State Newton's second law of motion and derive its equation.");
S9(2024, "B", "4", THERM, "Write down three differences between boiling and evaporation.");
S9(2024, "B", "5", WE, "What is potential energy? Derive P.E. = mgh.");
S9(2024, "B", "6", POM, "What is elasticity? State Hooke's law and write its mathematical expression.");
S9(2024, "B", "7", TEF, "Define torque. Write down its formula and unit.");
S9(2024, "B", "8", KIN, "A bus starts from rest and travels along a straight path. Its velocity becomes 15 m/s in 5 seconds. Calculate the acceleration of the bus.");
S9(2024, "B", "9", DYN, "A car of mass 600 kg is moving on a circular path of radius 100 m with a velocity of 72 km/h. Find the centripetal force on the car.");
S9(2024, "B", "10", POM, "Calculate the spring constant of a spring which extends by 3.5 cm when a load of 14 N is hung from its end.");
S9(2024, "B", "11", GRAV, "A planet has four times the mass of the Earth and twice its radius. If g on Earth is 10 m/s², what will be the acceleration due to gravity on the planet?");
S9(2024, "B", "12", WE, "What will be the kinetic energy of a boy of mass 50 kg riding a bike with a velocity of 2 m/s?");
S9(2024, "B", "13", VEC, "A man pushes a trolley on horizontal ground with a force of 100 N at an angle of 60° with the ground. Find the horizontal and vertical components of the force.");
S9(2024, "C", "14", KIN, "What is kinematics? Derive the equation 2aS = vf² − vi².");
S9(2024, "C", "15", TEF, "Define equilibrium. Explain its types and two conditions.");
S9(2024, "C", "16", POM, "State and explain Boyle's law. Write one of its applications.");
S9(2024, "C", "17", GRAV, "Calculate the mass of the Earth by using Newton's law of gravitation.");
S9(2024, "C", "18", THERM, "Define thermal expansion. Derive ΔL = αLΔT.");
S9(2024, "C", "19", DYN, "Write any two advantages and two disadvantages of friction. Also write two methods of reducing friction.");

P9(2022, "i", PQ, "250 g is equal to:", ["25 kg", "50 kg", "0.25 kg", "0.50 kg"], "C");
P9(2022, "ii", PQ, "The number of significant figures in 91.60 is:", ["2", "3", "4", "5"], "C");
P9(2022, "iii", VEC, "Which one of the following is a vector quantity?", ["Time", "Force", "Mass", "Distance"], "B");
P9(2022, "iv", KIN, "The shortest distance between two points is called:", ["Diameter", "Speed", "Displacement", "Velocity"], "C");
P9(2022, "v", POM, "If a gas is heated in a sealed cylinder, then:", ["Only the pressure inside increases", "Only the average kinetic energy of the particles increases", "Only the temperature increases", "All of these increase"], "D");
P9(2022, "vi", PQ, "The quantity of matter contained in a body is called its:", ["Volume", "Mass", "Area", "Weight"], "B");
P9(2022, "viii", DYN, "The centripetal force is always directed:", ["Towards the centre", "Away from the centre", "Along the circular path", "In all directions"], "A");
P9(2022, "ix", POM, "Which of the following is more elastic?", ["Rubber", "Glass", "Steel", "Wood"], "C");
P9(2022, "x", POM, "The pressure in a fluid depends upon:", ["Depth", "Density", "Gravitational acceleration", "All of these"], "D");
P9(2022, "xi", GRAV, "The critical (orbital) velocity of a satellite near the Earth's surface is:", ["gR", "g/R", "√(gR)", "√(g/R)"], "C");
P9(2022, "xii", POM, "A spring balance is used to measure:", ["Mass", "Weight", "Elasticity", "Density"], "B");
P9(2022, "xiii", THERM, "During which process does a gas become a liquid?", ["Melting", "Freezing", "Condensation", "Boiling"], "C");
P9(2022, "xiv", POM, "An object whose particles are close together and vibrate about fixed positions is a:", ["Gas", "Liquid", "Solid", "Plasma"], "C");
P9(2022, "xv", KIN, "If the velocity of an object decreases, its acceleration is called:", ["Retardation (deceleration)", "Average acceleration", "Positive acceleration", "Uniform acceleration"], "A");
P9(2022, "xvi", GRAV, "Which of the following is a natural satellite?", ["Earth", "Jupiter", "Moon", "Mars"], "C");
P9(2022, "xvii", WE, "Which is a non-renewable energy source?", ["Tidal energy", "Natural gas", "Solar energy", "Wind energy"], "B");
P9(2022, "xviii", WE, "If a body of mass 1 kg moves with a velocity of 1 m/s, its kinetic energy will be:", ["0.5 J", "1 J", "0.8 J", "2 J"], "A");
P9(2022, "xix", THERM, "Evaporation occurs at:", ["Freezing point", "Melting point", "Boiling point", "All temperatures"], "D");
P9(2022, "xx", DYN, "Friction opposes motion between two bodies in contact because of the:", ["Charge on the bodies", "Weight of the bodies", "Roughness of the surfaces", "Mass of the bodies"], "C");
P9(2022, "xxi", THERM, "The amount of heat needed to convert a substance from liquid to gas (at constant temperature) is called:", ["Specific heat", "Latent heat of vaporisation", "Latent heat of fusion", "Heat of the Sun"], "B");
P9(2022, "xxii", TEF, "A pair of unlike parallel forces having different lines of action produces:", ["Equilibrium", "Torque only", "A couple", "Unstable equilibrium"], "C");
P9(2022, "xxiii", TEF, "The centre of gravity of a uniform rod is:", ["At the end of the rod", "At the centre of the rod", "Away from the rod", "None of these"], "B");
P9(2022, "xxiv", WE, "If a force of 6 N displaces an object 3 m in the direction of the force, the work done will be:", ["6 J", "12 J", "18 J", "0 J"], "C");

// ======================= CLASS 9 CHEMISTRY =======================
const FUND = "Fundamentals of Chemistry", ATOM = "Structure of Atoms", PERIOD = "Periodic Table & Periodicity", MOLEC = "Structure of Molecules",
  STATES = "Physical States of Matter", SOLN = "Solutions", ELECTRO = "Electrochemistry", REACT = "Chemical Reactivity";
const CH9 = (year: number, qno: string, ch: string, t: string, o: string[], a: "A" | "B" | "C" | "D") => M(9, "Chemistry", year, qno, 9, ch, t, o, a);
const CQ9 = (year: number, sec: "B" | "C", qno: string, ch: string, t: string) => Q(9, "Chemistry", year, sec, qno, 9, ch, t, sec === "B" ? 3 : 6);

CH9(2025, "i", FUND, "The number of moles in 8 g of CO₂ is about:", ["0.15", "0.18", "0.21", "0.24"], "B");
CH9(2025, "ii", FUND, "The molecular mass of nitric acid (HNO₃) is:", ["60 a.m.u.", "50 a.m.u.", "63 a.m.u.", "62 a.m.u."], "C");
CH9(2025, "iv", ATOM, "This isotope is used to power heart pacemakers:", ["Plutonium-238", "Carbon-14", "Cobalt-60", "Phosphorus-32"], "A");
CH9(2025, "v", PERIOD, "All transition elements are:", ["Gases", "Metals", "Non-metals", "Metalloids"], "B");
CH9(2025, "vi", MOLEC, "When an electronegative element combines with an electropositive element, the bond formed is:", ["Covalent bond", "Ionic bond", "Polar bond", "Coordinate covalent bond"], "B");
CH9(2025, "vii", SOLN, "Which compound is not soluble in water?", ["NaCl", "C₆H₆", "KBr", "MgCl₂"], "B");
CH9(2025, "viii", STATES, "One atmospheric pressure is equal to:", ["10325 Pa", "106075 Pa", "10523 Pa", "101325 Pa"], "D");
CH9(2025, "ix", ELECTRO, "Photosynthesis is a/an:", ["Oxidation reaction only", "Redox reaction", "Reduction reaction only", "Neutralisation reaction"], "B");
CH9(2025, "x", REACT, "The hardness of a metal is measured on the:", ["pH scale", "Likert scale", "Richter scale", "Mohs scale"], "D");
CH9(2025, "xi", PERIOD, "Fluorine exists (at room temperature) as a:", ["Solid", "Liquid", "Gas", "All of these"], "C");
CH9(2025, "xii", SOLN, "On heating, a saturated solution of KCl becomes:", ["Unsaturated solution", "Supersaturated solution", "Dilute solution", "Suspension"], "A");
CQ9(2025, "B", "2", FUND, "Write down the applications of chemistry in daily life.");
CQ9(2025, "B", "3", FUND, "Differentiate between molecular and empirical formulae.");
CQ9(2025, "B", "4", FUND, "Complete and balance the following equations (on heating where needed): (i) KNO₃ → (ii) Ca + H₂O → (iii) NaHCO₃ →");
CQ9(2025, "B", "5", ATOM, "Write down the electronic configuration of Na, Mg and Al (atomic numbers 11, 12 and 13).");
CQ9(2025, "B", "6", STATES, "The pressure of a gas sample is 8 atm and its volume is 15 L. If the pressure is reduced to 6 atm, what will be its new volume?");
CQ9(2025, "B", "7", PERIOD, "What is meant by electronegativity? Describe its trend in a group and a period with examples.");
CQ9(2025, "B", "8", MOLEC, "What is meant by lone pairs and unpaired electrons? How many lone pairs and unpaired electrons are there in a nitrogen atom?");
CQ9(2025, "B", "9", FUND, "Define: (i) Free radical (ii) Solubility (iii) Alloy.");
CQ9(2025, "B", "10", SOLN, "Calculate the percentage concentration (m/m) of a solution made by dissolving 15 g of salt in 110 g of water.");
CQ9(2025, "B", "11", REACT, "Write down the chemical formula and one use of each of: (i) soda ash (ii) baking soda (iii) washing soda.");
CQ9(2025, "B", "12", ELECTRO, "What is a redox reaction? Give an example with an equation and identify the oxidising and reducing agents.");
CQ9(2025, "B", "13", STATES, "Give reasons: (i) How does an electron differ from a neutron? (ii) Why is the rate of diffusion of gases faster than that of liquids?");
CQ9(2025, "C", "14", ATOM, "How did Rutherford present the atomic model? Describe his experiment in detail and explain the atomic model he presented.");
CQ9(2025, "C", "15", MOLEC, "Why do some molecules form covalent bonds? Write its three types with examples.");
CQ9(2025, "C", "16", ELECTRO, "Describe the construction of a dry cell with a diagram. Explain its working with the help of chemical equations.");
CQ9(2025, "C", "17", SOLN, "Compare the properties of solutions, suspensions and colloids. (Write eight points of each.)");
CQ9(2025, "C", "18", PERIOD, "How are elements arranged in the periodic table? Describe groups and periods in the periodic table.");
CQ9(2025, "C", "19", REACT, "What is allotropy? Describe the different allotropic forms of carbon.");
CQ9(2024, "B", "2", PERIOD, "Define: (i) Periodicity (ii) Electronegativity (iii) Electrolysis.");
CQ9(2024, "B", "3", REACT, "Write down three differences between alkali metals and alkaline earth metals.");
CQ9(2024, "B", "4", FUND, "To which branch of chemistry does each belong? (i) Chlorofluoro compounds are responsible for depletion of the ozone layer. (ii) Investigating the properties of ammonia gas. (iii) Finding the quantity and quality of paracetamol in a Panadol tablet.");
CQ9(2024, "B", "5", SOLN, "How would you prepare 100 mL of 0.4 M MgSO₄ from a stock solution of 2.0 M MgSO₄?");
CQ9(2024, "B", "6", PERIOD, "What is atomic radius? Discuss its trend across a period and down a group in the periodic table.");
CQ9(2024, "B", "7", ATOM, "What are isotopes? Describe briefly three isotopes of uranium.");
CQ9(2024, "B", "8", FUND, "Balance by inspection: (i) CaCO₃ + HCl → CaCl₂ + H₂O + CO₂ (ii) KClO₃ → KCl + O₂ (iii) NH₃ + O₂ → NO + H₂O");
CQ9(2024, "B", "9", FUND, "Calculate the number of atoms present in 9.2 g of calcium. (Atomic mass of Ca = 40)");
CQ9(2024, "B", "10", MOLEC, "Draw electron dot and cross structures of H₂, N₂ and O₂. (Atomic numbers H = 1, N = 7, O = 8)");
CQ9(2024, "B", "11", FUND, "Write the chemical formulae of: (i) caustic soda (ii) sand (iii) sugar (iv) limestone (v) gypsum (vi) baking soda.");
CQ9(2024, "B", "12", SOLN, "What is the Tyndall effect? How is it used to distinguish a true solution from a colloid?");
CQ9(2024, "B", "13", MOLEC, "Justify: (i) Why is a fluoride ion not considered a neon atom? (ii) Why do noble gases not react with other elements under ordinary conditions?");
CQ9(2024, "C", "14", STATES, "State Charles's law. A 600 mL sample of gas is heated from 27 °C to 77 °C at constant pressure. What will be its final volume?");
CQ9(2024, "C", "15", ELECTRO, "Define electroplating. Describe the tin plating of an iron spoon with ionic equations and a labelled diagram.");
CQ9(2024, "C", "16", PERIOD, "Identify the most electronegative group of the periodic table. List its elements and give three common characteristics of these elements.");
CQ9(2024, "C", "17", ATOM, "Write down six postulates of Bohr's atomic model.");
CQ9(2024, "C", "18", MOLEC, "What is an ionic bond? Explain the formation of the ionic bond between sodium and chlorine in sodium chloride.");
CQ9(2024, "C", "19", MOLEC, "What are molecules? Discuss their five types with examples.");

// ======================= CLASS 9 BIOLOGY =======================
const INTRO = "Introduction to Biology", PROB = "Solving a Biological Problem", DIV = "Biodiversity", CELLS = "Cells and Tissues", CYCLE = "Cell Cycle",
  ENZ = "Enzymes", BIOEN = "Bioenergetics", NUTR = "Nutrition", TRANS = "Transport";
const BI9 = (year: number, qno: string, ch: string, t: string, o: string[], a: "A" | "B" | "C" | "D") => M(9, "Biology", year, qno, 9, ch, t, o, a);
const BQ9 = (year: number, sec: "B" | "C", qno: string, ch: string, t: string) => Q(9, "Biology", year, sec, qno, 9, ch, t, sec === "B" ? 3 : 6);

BI9(2025, "2", DIV, "Humans belong to the phylum:", ["Chordata", "Echinodermata", "Annelida", "Arthropoda"], "A");
BI9(2025, "4", CELLS, "The cell membrane consists of a:", ["Single layer of lipids", "Double layer of lipids", "Triple layer of lipids", "None of these"], "B");
BI9(2025, "5", CYCLE, "The stage of mitosis in which the chromatids reach the poles and their movement stops is:", ["Prophase", "Metaphase", "Anaphase", "Telophase"], "D");
BI9(2025, "6", NUTR, "All of these are sources of calcium except:", ["Red meat", "Green leafy vegetables", "Broccoli", "Nuts"], "A");
BI9(2025, "7", NUTR, "In the human digestive system, the trachea and oesophagus are both connected to the:", ["Large intestine", "Stomach", "Pharynx", "Rectum"], "C");
BI9(2025, "8", NUTR, "One gram of fat supplies the body with about:", ["5 kcal", "7 kcal", "9 kcal", "11 kcal"], "C");
BI9(2025, "9", TRANS, "The life span of red blood cells (erythrocytes) is about:", ["105 days", "110 days", "115 days", "120 days"], "D");
BI9(2025, "10", TRANS, "In the human heart, blood returning from the lungs first drains into the:", ["Left atrium", "Left ventricle", "Right atrium", "Right ventricle"], "A");
BI9(2025, "11", TRANS, "Organic material (food) is transported through the:", ["Xylem", "Vessels", "Tracheids", "Phloem"], "D");
BI9(2025, "12", DIV, "Rana tigrina is the scientific name of the:", ["Tiger", "Crocodile", "Frog", "Parrot"], "C");
BQ9(2025, "B", "2", INTRO, "Name and define the basic divisions of biology.");
BQ9(2025, "B", "3", DIV, "What is meant by homologous and analogous organs? Explain with examples.");
BQ9(2025, "B", "4", DIV, "Write the biological (scientific) names of: (i) onion (ii) mango (iii) neem (iv) frog (v) cat (vi) house fly.");
BQ9(2025, "B", "5", PROB, "Explain the term hypothesis with the help of an example.");
BQ9(2025, "B", "6", DIV, "Define conservation of biodiversity.");
BQ9(2025, "B", "7", CELLS, "Draw a neat and labelled diagram of an animal or plant cell, OR of cardiac muscle.");
BQ9(2025, "B", "8", CELLS, "Define: (i) Diffusion (ii) Osmosis (iii) Facilitated diffusion.");
BQ9(2025, "B", "9", CYCLE, "Define the two basic ways of cell death in multicellular organisms.");
BQ9(2025, "B", "10", TRANS, "Define the pulmonary circuit and the systemic circuit.");
BQ9(2025, "B", "11", TRANS, "What is the role of the root in the transport of water and minerals?");
BQ9(2025, "B", "12", NUTR, "Which diseases are caused by deficiency of the following vitamins? (i) Vitamin K (ii) Vitamin D (iii) Vitamin A");
BQ9(2025, "B", "13", PROB, "Write a note on the light microscope, OR write three differences between a theory and a law.");
BQ9(2025, "C", "14", CELLS, "What are plant tissues? Write their types and define any two.");
BQ9(2025, "C", "15", CELLS, "Draw a neat and labelled diagram of a mitochondrion.");
BQ9(2025, "C", "16", CYCLE, "Define mitosis, write its stages and explain any two of them. OR Define meiosis, explain prophase and draw a labelled diagram of it.");
BQ9(2025, "C", "17", NUTR, "Write down two functions of each of: (i) the oral cavity (ii) the stomach (iii) the liver.");
BQ9(2025, "C", "18", BIOEN, "Write any six differences between respiration and photosynthesis in plants.");
BQ9(2025, "C", "19", TRANS, "Explain arteries, veins and capillaries.");

BI9(2024, "1", DIV, "The scientific name of the frog is:", ["Palaemon", "Rana tigrina", "Periplaneta", "Pheretima"], "B");
BI9(2024, "2", CELLS, "The organelle found in animal cells that helps in intracellular digestion is the:", ["Ribosome", "Lysosome", "Mitochondrion", "Golgi body"], "B");
BI9(2024, "3", CYCLE, "The stage of mitosis in which the chromatids reach the poles and their movement stops is:", ["Prophase", "Metaphase", "Anaphase", "Telophase"], "D");
BI9(2024, "4", PROB, "The biological method involves all of the following except:", ["Data collection", "Observation", "Experiment", "Proportion"], "D");
BI9(2024, "5", BIOEN, "The fundamental molecule produced during photosynthesis is:", ["Glucose", "Fatty acid", "Amino acid", "Nucleotide"], "A");
BI9(2024, "6", NUTR, "In the human digestive system, the trachea and oesophagus are both connected to the:", ["Stomach", "Large intestine", "Pharynx", "Larynx"], "C");
BI9(2024, "7", BIOEN, "The splitting of water in the presence of sunlight is called:", ["Hydrolysis", "Glycolysis", "Photolysis", "None of these"], "C");
BI9(2024, "8", TRANS, "Which is involved in the clotting of blood?", ["Red blood cells", "White blood cells", "Platelets", "Haemoglobin"], "C");
BI9(2024, "9", TRANS, "The part of a root between the epidermis and the endodermis is called the:", ["Xylem", "Phloem", "Cambium", "Cortex"], "D");
BI9(2024, "10", DIV, "Volvox is a genus of:", ["Green algae", "Red algae", "Brown algae", "None of these"], "A");
BI9(2024, "12", BIOEN, "The stage of aerobic respiration that takes place on the cristae of mitochondria is the:", ["Electron transport chain", "Glycolysis", "Krebs cycle", "C₃ cycle"], "A");
BQ9(2024, "B", "2", INTRO, "Define: (i) Parasitology (ii) Environmental biology (iii) Biotechnology.");
BQ9(2024, "B", "3", PROB, "Explain the biological method with the help of a flowchart.");
BQ9(2024, "B", "4", DIV, "Describe any three principles of classification.");
BQ9(2024, "B", "5", CELLS, "Write any three differences between the light microscope and the electron microscope.");
BQ9(2024, "B", "6", CYCLE, "Write the different types of chromosomes with their diagrams.");
BQ9(2024, "B", "7", CYCLE, "Define mitosis.");
BQ9(2024, "B", "8", NUTR, "Write any three effects of malnutrition on humans.");
BQ9(2024, "B", "9", DIV, "Draw a neat and labelled diagram of Amoeba.");
BQ9(2024, "B", "10", DIV, "Describe any three causes of deforestation.");
BQ9(2024, "B", "11", CELLS, "Write one function of each: (i) mitochondria (ii) Golgi bodies (iii) plastids.");
BQ9(2024, "B", "12", DIV, "Write any three characteristics of kingdom Fungi.");
BQ9(2024, "B", "13", INTRO, "'Careers in biology': describe any three fields.");
BQ9(2024, "C", "14", NUTR, "Draw a neat and labelled diagram of the human alimentary canal OR the internal structure of the human heart.");
BQ9(2024, "C", "15", TRANS, "Write the names of two blood diseases. Describe their symptoms and causes.");
BQ9(2024, "C", "16", CELLS, "Define: (i) Vitamins (ii) Goitre (iii) Stomata (iv) Cisternae (v) Nucleoplasm (vi) Activator.");
BQ9(2024, "C", "17", NUTR, "What are the major components of human food? Describe any two.");
BQ9(2024, "C", "18", ENZ, "Define enzyme. Write any four of its characteristics.");
BQ9(2024, "C", "19", BIOEN, "Write any six differences between respiration and photosynthesis in plants.");

BI9(2022, "i", DIV, "The science of identification and classification of organisms is:", ["Histology", "Cytology", "Taxonomy", "Anatomy"], "C");
BI9(2022, "ii", DIV, "The scientific name of the frog is:", ["Palaemon", "Rana tigrina", "Periplaneta", "Pheretima"], "B");
BI9(2022, "iii", DIV, "Volvox is a genus belonging to:", ["Green algae", "Red algae", "Brown algae", "None of these"], "A");
BI9(2022, "iv", PROB, "The biological method involves all of the following except:", ["Data collection", "Observation", "Experiment", "Proportion"], "D");
BI9(2022, "v", INTRO, "The field of research that examines the mathematical representation of biological systems is:", ["Ratio", "Proportion", "Mathematical biology", "Law"], "C");
BI9(2022, "vii", CELLS, "The organelle in animal cells that helps in intracellular digestion is the:", ["Lysosome", "Ribosome", "Mitochondrion", "Golgi apparatus"], "A");
BI9(2022, "viii", PROB, "The comparison of two values is called a:", ["Ratio", "Proportion", "Graph", "Table"], "A");
BI9(2022, "ix", DIV, "Members of this kingdom have a cell wall and are all heterotrophic:", ["Monera", "Protista", "Plantae", "Fungi"], "D");
BI9(2022, "x", CYCLE, "The sequence of physiological changes by which a cell commits suicide is called:", ["Apoptosis", "Necrosis", "Apomixis", "None of these"], "A");
BI9(2022, "xi", ENZ, "The pH at which an enzyme is most active is its:", ["Neutral pH", "Acidic pH", "Basic pH", "Optimum pH"], "D");
BI9(2022, "xii", BIOEN, "The stage of aerobic respiration that takes place on the cristae of mitochondria is the:", ["Electron transport chain", "Glycolysis", "Krebs cycle", "C₃ cycle"], "A");
BI9(2022, "xiii", CYCLE, "The failure of a pair of homologous chromosomes to separate is called:", ["Non-disjunction", "Terminalisation", "Synapsis", "Linkage"], "A");
BI9(2022, "xiv", BIOEN, "Each mole of ATP stores about:", ["7.3 kcal", "7.3 kJ", "17.3 kcal", "17.3 kJ"], "A");
BI9(2022, "xvii", TRANS, "The movement of water molecules from higher to lower water potential through a semi-permeable membrane is called:", ["Diffusion", "Osmosis", "Active transport", "Water potential"], "B");
BI9(2022, "xviii", CELLS, "The secondary cell wall is made up of:", ["Pectin and cellulose", "Cellulose and protein", "Cellulose and lignin", "Lignin and pectin"], "C");
BI9(2022, "xix", ENZ, "All of these affect an enzyme's activity except:", ["Substrate concentration", "Organic solvent", "Temperature", "pH"], "B");
BI9(2022, "xx", TRANS, "Which is involved in the clotting of blood?", ["Platelets", "Haemoglobin", "Albumin", "Globulin"], "A");
BI9(2022, "xxi", TRANS, "Organic material (food) moves through the:", ["Xylem", "Vessels", "Tracheids", "Phloem"], "D");
BI9(2022, "xxii", NUTR, "In the human digestive system, the trachea and oesophagus are both connected to the:", ["Large intestine", "Stomach", "Pharynx", "Rectum"], "C");
BI9(2022, "xxiii", BIOEN, "The splitting of water in the presence of light is called:", ["Hydrolysis", "Glycolysis", "Photolysis", "None of these"], "C");

BI9(2021, "1", DIV, "Members of this kingdom have a cell wall and are all heterotrophic:", ["Monera", "Plantae", "Protista", "Fungi"], "D");
BI9(2021, "2", INTRO, "The study of remote past life with the help of fossils is called:", ["Entomology", "Palaeontology", "Histology", "Taxonomy"], "B");
BI9(2021, "3", CELLS, "The function of the rough endoplasmic reticulum is:", ["Aerobic respiration", "Intracellular digestion", "Synthesis of steroids", "Synthesis of proteins"], "D");
BI9(2021, "4", PROB, "Scientific methodology starts with:", ["Data collection", "Observation", "Experiment", "Hypothesis"], "B");
BI9(2021, "5", CELLS, "Select the mismatched pair:", ["Plastids → storage of chemicals", "Centriole → help in cell division", "Ribosomes → synthesis of steroids", "Mitochondria → synthesis of ATP"], "C");
BI9(2021, "7", DIV, "A localised group of organisms belonging to the same species is called a:", ["Species", "Population", "Community", "Genus"], "B");
BI9(2021, "8", CELLS, "Blood is a type of:", ["Cell", "Organ", "Tissue", "System"], "C");
BI9(2021, "10", CYCLE, "The type of cell division in which a spore mother cell produces spores is:", ["Amitosis", "Meiosis", "Mitosis", "All of these"], "B");
BI9(2021, "11", BIOEN, "The fundamental molecule produced during photosynthesis is:", ["Glucose", "Fatty acid", "Amino acid", "Nucleotide"], "A");
BI9(2021, "12", NUTR, "Select the mismatched pair:", ["Carbohydrate → glucose", "Protein → amino acid", "Nucleic acid → nucleotide", "Fats → starch"], "D");
BI9(2021, "13", CYCLE, "The stage of mitosis in which the chromatids reach the poles and their movement stops is:", ["Prophase", "Metaphase", "Anaphase", "Telophase"], "D");
BI9(2021, "14", NUTR, "In the human digestive system, the trachea and oesophagus are both connected to the:", ["Stomach", "Large intestine", "Pharynx", "Larynx"], "C");
BI9(2021, "15", TRANS, "In the human heart, blood returning from the lungs first drains into the:", ["Left auricle", "Left ventricle", "Right auricle", "Right ventricle"], "A");
BI9(2021, "16", DIV, "The basic unit of classification is the:", ["Genus", "Class", "Species", "Kingdom"], "C");
BI9(2021, "17", CELLS, "Prokaryotic cells contain:", ["A membrane-bound nucleus", "Golgi bodies", "Mitochondria", "Ribosomes"], "D");
BI9(2021, "18", TRANS, "The uptake of water and minerals from the soil takes place through the:", ["Xylem", "Phloem", "Vessels only", "Tracheids only"], "A");
BI9(2021, "19", TRANS, "The evaporation of water from the stomata of leaves is called:", ["Respiration", "Guttation", "Excretion", "Transpiration"], "D");
BI9(2021, "20", BIOEN, "The light-dependent reactions take place in the:", ["Stomata", "Thylakoids", "Cristae", "None of these"], "B");
BI9(2021, "21", DIV, "Which is not a multicellular organism?", ["Cat", "Toad", "Frog", "Amoeba"], "D");
BI9(2021, "22", CYCLE, "Apoptosis is cell death that occurs due to:", ["Internal factors", "External factors", "Physical injury", "None of these"], "A");
BI9(2021, "23", TRANS, "The normal body temperature of humans is about:", ["35 °C", "37 °C", "36 °C", "38 °C"], "B");
BI9(2021, "24", TRANS, "The part of a root between the epidermis and the endodermis is called the:", ["Xylem", "Phloem", "Cambium", "Cortex"], "D");
BI9(2021, "25", TRANS, "Which is involved in the clotting of blood?", ["Red blood cells", "White blood cells", "Platelets", "Haemoglobin"], "C");
BI9(2021, "26", DIV, "The biological name of the cat is:", ["Felis catus", "Canis lupus", "Allium cepa", "Azadirachta indica"], "A");
BI9(2021, "27", INTRO, "The book 'Al-Ibil' was written by:", ["Jabir bin Hayyan", "Bu Ali Sina", "Abdul Malik Asmai", "Ali bin Isa"], "C");
BI9(2021, "29", INTRO, "The branch in which the laws and techniques of physics are applied to explain life processes is:", ["Biometry", "Biophysics", "Biostatistics", "Bio-economics"], "B");
BI9(2021, "30", CELLS, "The length of the stem and root increases due to the:", ["Apical meristem", "Lateral meristem", "Cambium", "None of these"], "A");

BI9(2019, "1", DIV, "The butterfly belongs to the phylum:", ["Mollusca", "Echinodermata", "Annelida", "Arthropoda"], "D");
BI9(2019, "2", DIV, "Which bird cannot fly?", ["Pigeon", "Kiwi", "Parrot", "Sparrow"], "B");
BI9(2019, "3", DIV, "The respiratory organs of insects are the:", ["Lungs", "Tracheae", "Flame cells", "Malpighian tubules"], "B");
BI9(2019, "4", CELLS, "The cell, the basic unit of living organisms, was discovered by:", ["William Harvey", "Robert Hooke", "Galileo", "Charles Darwin"], "B");
BI9(2019, "5", DIV, "Agaricus is commonly known as:", ["Bread mould", "Yeast", "Mushroom", "All of these"], "C");
BI9(2019, "6", DIV, "Which of the following is not a consequence of deforestation?", ["Greenhouse effect", "Depletion of the ozone layer", "Soil erosion", "Disturbed water cycle"], "B");
BI9(2019, "7", DIV, "Marchantia belongs to the group:", ["Hepaticae", "Musci", "Mosses", "Anthocerotae"], "A");
BI9(2019, "8", NUTR, "Glycogen is a molecule that belongs to:", ["Carbohydrates", "Fats", "Proteins", "Vitamins"], "A");
BI9(2019, "9", BIOEN, "The end products of respiration in plants are:", ["CO₂, H₂O and energy", "Starch and O₂", "Sugar and O₂", "H₂O and energy only"], "A");
BI9(2019, "10", DIV, "Horsetail is the common name of:", ["Psilopsida", "Lycopsida", "Sphenopsida", "Pteropsida"], "C");
BI9(2019, "11", NUTR, "Which secretion lacks enzymes?", ["Saliva", "Gastric juice", "Bile", "Pancreatic juice"], "C");
BI9(2019, "12", TRANS, "The deficiency of haemoglobin in a person is called:", ["Heart attack", "Angina", "Haemophilia", "Anaemia"], "D");
BI9(2019, "13", NUTR, "Urea is mainly synthesised in the:", ["Liver", "Lungs", "Kidney", "Nephron"], "A");
BI9(2019, "14", CELLS, "The muscles involved in locomotion in humans are:", ["Smooth", "Cardiac", "Skeletal", "Involuntary"], "C");
BI9(2019, "15", DIV, "A fruit is a ripened:", ["Ovule", "Ovary", "Flower", "Carpel"], "B");
BI9(2019, "16", DIV, "The innermost whorl of a flower is the:", ["Calyx", "Corolla", "Androecium", "Gynoecium"], "D");
BI9(2019, "17", CYCLE, "The number of chromosomes in each cell of a frog is:", ["46", "26", "16", "14"], "B");
BI9(2019, "18", DIV, "Green plants in an ecosystem are:", ["Producers", "Consumers", "Decomposers", "None of these"], "A");

export const PAST_QUESTIONS: PastQuestion[] = qs;

/** Which papers are in the bank: [{paperGrade, subject, years:[…]}] */
export function pastPaperIndex() {
  const map = new Map<string, Set<number>>();
  qs.forEach((q) => {
    const k = `${q.paperGrade}|${q.subject}`;
    if (!map.has(k)) map.set(k, new Set());
    map.get(k)!.add(q.year);
  });
  return Array.from(map.entries()).map(([k, s]) => {
    const [g, subject] = k.split("|");
    return { paperGrade: Number(g), subject, years: Array.from(s).sort((a, b) => b - a) };
  });
}

/** Years in which a chapter was examined (for the Topic Radar). */
export function yearsForChapter(subject: string, chapter: string): number[] {
  const ys = new Set<number>();
  qs.forEach((q) => {
    if (q.subject.toLowerCase() === subject.toLowerCase() && q.chapter.toLowerCase() === chapter.toLowerCase()) ys.add(q.year);
  });
  return Array.from(ys).sort((a, b) => a - b);
}

/** Past MCQs in the same shape as the practice bank, tagged with their board year. */
export function pastMcqsAsPractice(topicGrade: number, subject: string) {
  return qs
    .filter((q) => q.section === "A" && q.options && q.answer && q.topicGrade === topicGrade && q.subject.toLowerCase() === subject.toLowerCase())
    .map((q) => ({
      question_id: q.id,
      board: "BSEK_KARACHI",
      grade: q.topicGrade,
      subject: q.subject,
      chapter_name: q.chapter,
      section: "SECTION_A",
      text_en: q.text,
      text_ur: "",
      options_json: JSON.stringify(Object.fromEntries(q.options!.map((o, i) => [L[i], o]))),
      correct_option: q.answer!,
      marks: 1,
      is_numerical: false,
      solution_rubric: `From the BSEK ${q.year} Class ${q.paperGrade} ${q.subject} paper. Correct answer: (${q.answer}) ${q.options![L.indexOf(q.answer!)]}.`,
      cognitive_level: "Knowledge" as const,
      board_year: q.year,
    }));
}
