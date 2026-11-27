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
