export const UNIT = {
  name: "BertyBot's LogoLab",
  shortName: "LogoLab",
  subtitle: "A TechWorks mark factory",
  grades: "Grades 6–8",
  length: "8–10 class periods",
  drivingQuestion: "How do designers make a mark that people remember — and trust?",
  drivingQuestionEs:
    "¿Cómo hacen los diseñadores una marca que la gente recuerda y en la que confía?",
  notAMaker:
    "BertyBot runs this TechWorks shop floor. Look, sort, and critique first. The mark bench stamps your own words and shapes on this Chromebook and saves SVG or PNG here — it does not invent a logo and it does not copy real trademarks. Famous logos stay in memory.",
  fairUse:
    "Lab brands and joke cousins are original study marks made for this class. Real company logos are not copied here — they are owned, and a weak tracing is worse than none. Cousins tease an idea so you can name the real brand from memory.",
};

export type LessonMeta = {
  id: string;
  number: number;
  title: string;
  titleEs: string;
  duration: string;
  iCan: string;
  iCanEs: string;
  languageGoal: string;
  languageGoalEs: string;
  vocab: string[];
  studio?: string;
  printable?: string;
  summary: string;
};

export const LESSONS: LessonMeta[] = [
  {
    id: "promise",
    number: 1,
    title: "A logo is a promise",
    titleEs: "Un logo es una promesa",
    duration: "1 period",
    iCan: "I can name what a logo is for and sort marks into six types.",
    iCanEs:
      "Puedo decir para qué sirve un logo y clasificar marcas en seis tipos.",
    languageGoal: "Use type names (wordmark, pictorial, emblem) in a complete sentence.",
    languageGoalEs: "Usar los nombres de tipos en una oración completa.",
    vocab: ["logo", "brand", "mark", "wordmark", "lettermark", "pictorial", "abstract", "combination", "emblem"],
    studio: "sort",
    printable: "logo-types",
    summary: "What a logo does — and the six families almost every mark belongs to.",
  },
  {
    id: "simple",
    number: 2,
    title: "Simple lasts",
    titleEs: "Lo simple dura",
    duration: "1 period",
    iCan: "I can explain why a simple mark still works when it is tiny or far away.",
    iCanEs:
      "Puedo explicar por qué una marca simple funciona cuando es diminuta o está lejos.",
    languageGoal: "Compare two marks using because and so.",
    languageGoalEs: "Comparar dos marcas usando because y so.",
    vocab: ["simplicity", "scale", "silhouette", "recognition", "clear-space"],
    studio: "silhouette",
    printable: "simplify",
    summary: "Why simple marks still work when they get tiny — using original lab brands, not traced trademarks.",
  },
  {
    id: "space",
    number: 3,
    title: "Shape, space, and secrets",
    titleEs: "Forma, espacio y secretos",
    duration: "1–2 periods",
    iCan: "I can find negative space and say how it helps a logo mean two things at once.",
    iCanEs:
      "Puedo encontrar el espacio negativo y decir cómo ayuda a que un logo signifique dos cosas.",
    languageGoal: "Describe a hidden shape with There is / I notice.",
    languageGoalEs: "Describir una forma escondida con There is / I notice.",
    vocab: ["negative-space", "positive-space", "figure-ground", "gestalt", "balance", "symmetry"],
    studio: "hidden",
    printable: "hidden-hunt",
    summary: "Empty space is not empty. It can hide an arrow, a smile, or a second story.",
  },
  {
    id: "color",
    number: 4,
    title: "Color talks",
    titleEs: "El color habla",
    duration: "1 period",
    iCan: "I can choose a small palette and explain what the colors are asking people to feel.",
    iCanEs:
      "Puedo elegir una paleta pequeña y explicar qué quieren que sienta la gente.",
    languageGoal: "Name a feeling and link it to a color with makes me think of.",
    languageGoalEs: "Nombrar un sentimiento y unirlo a un color.",
    vocab: ["palette", "contrast", "identity"],
    studio: "color",
    printable: "color-chart",
    summary: "One or two colors, used on purpose, beat a rainbow every time.",
  },
  {
    id: "type",
    number: 5,
    title: "Letters can be pictures",
    titleEs: "Las letras pueden ser imágenes",
    duration: "1 period",
    iCan: "I can tell a wordmark from a lettermark and judge whether type fits a brand.",
    iCanEs:
      "Puedo distinguir un wordmark de un lettermark y juzgar si el tipo encaja con la marca.",
    languageGoal: "Use the words typeface, heavy, light, script, and blocky.",
    languageGoalEs: "Usar typeface, heavy, light, script y blocky.",
    vocab: ["typography", "typeface", "wordmark", "lettermark", "hierarchy"],
    studio: "type",
    printable: "letter-as-logo",
    summary: "When the name is the picture: scripts, stripes, and letters that act like icons.",
  },
  {
    id: "critique",
    number: 6,
    title: "The critique lab",
    titleEs: "El laboratorio de crítica",
    duration: "1–2 periods",
    iCan: "I can critique a mark using design words — and stay kind to the designer.",
    iCanEs:
      "Puedo criticar una marca con palabras de diseño — y ser amable con la persona.",
    languageGoal: "Use sentence frames: I notice, This works because, This would be stronger if.",
    languageGoalEs: "Usar marcos: I notice, This works because, This would be stronger if.",
    vocab: ["critique", "hierarchy", "contrast", "simplicity", "copycat"],
    studio: "clinic",
    printable: "critique-sheet",
    summary:
      "Fake logos go under the lights. Joke cousins tease famous marks. Students diagnose, then get a paper design brief.",
  },
];

export const STUDIO = [
  {
    id: "sort",
    title: "Type sorter",
    titleEs: "Clasifica el tipo",
    blurb: "Tap the family each lab mark belongs to.",
    lesson: "promise",
    rounds: 8,
  },
  {
    id: "silhouette",
    title: "Silhouette quiz",
    titleEs: "Prueba de silueta",
    blurb: "Name the lab brand from the solid outline alone.",
    lesson: "simple",
    rounds: 8,
  },
  {
    id: "scale",
    title: "Optical QC",
    titleEs: "Control óptico",
    blurb: "Stamp-size inspection. Which mark still reads when it is tiny?",
    lesson: "simple",
    rounds: 6,
  },
  {
    id: "hidden",
    title: "Hidden-space hunt",
    titleEs: "Cacería de espacio",
    blurb: "Find the second picture hiding in the empty parts.",
    lesson: "space",
    rounds: 6,
  },
  {
    id: "color",
    title: "Color lab",
    titleEs: "Laboratorio de color",
    blurb: "Match palettes to jobs, feelings, and industries.",
    lesson: "color",
    rounds: 6,
  },
  {
    id: "type",
    title: "Type fit",
    titleEs: "¿Qué tipo encaja?",
    blurb: "Pick the lettering that tells the right story.",
    lesson: "type",
    rounds: 6,
  },
  {
    id: "clinic",
    title: "Fake-logo clinic",
    titleEs: "Clínica de logos falsos",
    blurb: "Tap every problem on a broken mark, then read the diagnosis.",
    lesson: "critique",
    rounds: 6,
  },
  {
    id: "cousins",
    title: "Guess the cousin",
    titleEs: "Adivina el primo",
    blurb: "Joke knockoffs of famous marks. Name the real brand — we never draw it.",
    lesson: "critique",
    rounds: 8,
  },
  {
    id: "drill",
    title: "Word drill",
    titleEs: "Práctica de palabras",
    blurb: "Read the idea. Pick the design word. Built for English learners.",
    lesson: "promise",
    rounds: 8,
  },
] as const;

export const PRINTABLES = [
  {
    id: "vocab-cards",
    title: "Vocabulary cards",
    audience: "student" as const,
    pages: "1–2",
    blurb: "Cut-apart cards: English, Spanish, and a simple definition.",
  },
  {
    id: "logo-types",
    title: "Six types of logos",
    audience: "student" as const,
    pages: "1",
    blurb: "Sort lab brands into six types. Write one sentence for each type.",
  },
  {
    id: "analyze",
    title: "Analyze a mark",
    audience: "student" as const,
    pages: "1",
    blurb: "Look, label, and explain: type, color, space, and feeling. Sketch from memory.",
  },
  {
    id: "simplify",
    title: "Simplify this mark",
    audience: "student" as const,
    pages: "1",
    blurb: "A cluttered fake logo. Redraw it with fewer parts.",
  },
  {
    id: "hidden-hunt",
    title: "Hidden-space worksheet",
    audience: "student" as const,
    pages: "1",
    blurb: "Circle the secret shape. Sketch one of your own.",
  },
  {
    id: "color-chart",
    title: "Color meaning chart",
    audience: "student" as const,
    pages: "1",
    blurb: "Map colors to feelings — then pick a two-color palette.",
  },
  {
    id: "letter-as-logo",
    title: "Letter as logo",
    audience: "student" as const,
    pages: "1",
    blurb: "Turn an initial into a mark. Stay in one or two colors.",
  },
  {
    id: "design-brief",
    title: "Paper design brief",
    audience: "student" as const,
    pages: "2",
    blurb: "The unit performance task. Draw on paper — no generator.",
  },
  {
    id: "critique-sheet",
    title: "Peer critique + rubric",
    audience: "student" as const,
    pages: "1",
    blurb: "Sentence frames and a 4-point rubric for the paper mark.",
  },
  {
    id: "cousin-hunt",
    title: "Guess the cousin",
    audience: "student" as const,
    pages: "1",
    blurb: "Look at the joke knockoffs. Name the famous mark each one is teasing — from memory.",
  },
  {
    id: "teacher-pacing",
    title: "Pacing, keys, and ELL notes",
    audience: "teacher" as const,
    pages: "2",
    blurb: "8–10 day map, answer keys, and language supports.",
  },
  {
    id: "certificate",
    title: "Rank certificate",
    audience: "student" as const,
    pages: "1",
    blurb: "Print a brag sheet with your name, rank, XP, and pins from this device.",
  },
];

export const FRAMES = {
  notice: [
    "I notice ______.",
    "The first thing I see is ______.",
    "This mark is a ______ because ______.",
  ],
  compare: [
    "______ is simpler than ______ because ______.",
    "Both marks use ______, but only ______ uses ______.",
    "This would work at a small size because ______.",
  ],
  critique: [
    "This works because ______.",
    "This would be stronger if ______.",
    "The designer might have wanted us to feel ______.",
    "I would keep ______ and change ______.",
    "This copycat is teasing ______, but it fails because ______.",
  ],
  color: [
    "The color ______ makes me think of ______.",
    "This palette fits a ______ company because ______.",
    "If we used only black, the mark would still ______.",
  ],
};

export const STANDARDS = [
  {
    id: "VA:Re7.1.7",
    text: "Explain how the method of display, the location, and the experience of an artwork influence how it is perceived and valued.",
  },
  {
    id: "VA:Re8.1.7",
    text: "Interpret art by analyzing art-making approaches, the characteristics of form and structure, relevant contextual information, subject matter, and use of media to identify ideas and mood.",
  },
  {
    id: "VA:Re9.1.7",
    text: "Compare and explain the difference between an evaluation of an artwork based on personal criteria and an evaluation of an artwork based on a set of established criteria.",
  },
  {
    id: "VA:Cr1.2.7",
    text: "Develop criteria to guide making a work of art or design to meet an identified goal.",
  },
  {
    id: "VA:Cr2.3.7",
    text: "Apply visual organizational strategies to design and produce a work of art, design, or media that clearly communicates information or ideas.",
  },
  {
    id: "VA:Cn11.1.7",
    text: "Analyze how response to art is influenced by understanding the time and place in which it was made, the available resources, and cultural uses.",
  },
  {
    id: "CCSS.ELA-LITERACY.SL.7.1",
    text: "Engage effectively in a range of collaborative discussions, building on others' ideas and expressing their own clearly.",
  },
  {
    id: "CCSS.ELA-LITERACY.L.7.6",
    text: "Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases.",
  },
  {
    id: "WIDA.ELD-SI.4-12.Explain",
    text: "English learners can explain how things work using visual supports, sentence frames, and home-language resources.",
  },
];
