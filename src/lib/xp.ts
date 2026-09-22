export const XP_PER_LESSON = 100;
export const XP_PER_CORRECT = 15;
export const XP_PERFECT = 40;
export const XP_STAR = 8;
export const XP_TIMER = 6;
export const XP_TICKET = 10;
export const XP_WARMUP = 8;
export const XP_PER_LEVEL = 120;

export const RANKS = [
  { min: 0, name: "Intern", nameEs: "Interno" },
  { min: 120, name: "Apprentice", nameEs: "Aprendiz" },
  { min: 280, name: "Die Setter", nameEs: "Troquelador" },
  { min: 480, name: "Inspector", nameEs: "Inspector" },
  { min: 720, name: "Floor Lead", nameEs: "Líder de piso" },
  { min: 1000, name: "Shop Captain", nameEs: "Capitán" },
  { min: 1400, name: "Master Stamp", nameEs: "Maestro" },
] as const;

export type Rank = (typeof RANKS)[number];

export function rankFor(xp: number): Rank {
  let current: Rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.min) current = r;
  }
  return current;
}

export function nextRank(xp: number): Rank | null {
  const i = RANKS.findIndex((r) => r.min > xp);
  return i === -1 ? null : RANKS[i];
}

export function levelFor(xp: number): number {
  return 1 + Math.floor(xp / XP_PER_LEVEL);
}

export function levelProgress(xp: number): { into: number; of: number } {
  return { into: xp % XP_PER_LEVEL, of: XP_PER_LEVEL };
}

export function studioXp(correctDelta: number, newlyPerfect: boolean): number {
  return Math.max(0, correctDelta) * XP_PER_CORRECT + (newlyPerfect ? XP_PERFECT : 0);
}

export function studioMaxXp(total: number): number {
  return total * XP_PER_CORRECT + XP_PERFECT;
}

export function bragText(name: string, xp: number, rank: string): string {
  const who = name.trim() || "I";
  const verb = name.trim() ? `${who} scored` : "I scored";
  return `${verb} ${xp} XP in BertyBot's LogoLab — rank ${rank}. Beat that.`;
}

export const PINS = [
  { id: "first", name: "First punch", nameEs: "Primer golpe", hint: "Finish one station." },
  { id: "lessons", name: "Six stations", nameEs: "Seis estaciones", hint: "Mark all six stations done." },
  { id: "studio", name: "Floor kid", nameEs: "De piso", hint: "Play every floor game." },
  { id: "perfect", name: "Clean die", nameEs: "Troquel limpio", hint: "Score 100% on any floor game." },
  { id: "sweep", name: "Floor sweep", nameEs: "Barrido", hint: "100% on every floor game." },
  { id: "words", name: "Word collector", nameEs: "Coleccionista", hint: "Star eight glossary words." },
  { id: "notes", name: "Job tickets", nameEs: "Fichas", hint: "Save three exit tickets." },
  { id: "warmup", name: "Daily eye", nameEs: "Ojo diario", hint: "Finish today's sketch warmup." },
  { id: "lead", name: "Shop Captain", nameEs: "Capitán", hint: "Reach Shop Captain." },
  { id: "master", name: "Master Stamp", nameEs: "Maestro", hint: "Hit the top rank." },
] as const;

export function pinIdsEarned(p: {
  completedLessons: string[];
  activityDone: string[];
  activityBest: Record<string, number>;
  starredTerms: string[];
  tickets: Record<string, string>;
  warmupDay: string;
  xp: number;
  studioCount: number;
}): string[] {
  const ticketCount = Object.values(p.tickets).filter((t) => t.trim().length >= 8).length;
  const perfects = Object.values(p.activityBest).filter((n) => n >= 100).length;
  const ids: string[] = [];
  if (p.completedLessons.length >= 1) ids.push("first");
  if (p.completedLessons.length >= 6) ids.push("lessons");
  if (p.activityDone.length >= p.studioCount) ids.push("studio");
  if (perfects >= 1) ids.push("perfect");
  if (p.studioCount > 0 && perfects >= p.studioCount) ids.push("sweep");
  if (p.starredTerms.length >= 8) ids.push("words");
  if (ticketCount >= 3) ids.push("notes");
  if (p.warmupDay) ids.push("warmup");
  if (p.xp >= 1000) ids.push("lead");
  if (p.xp >= 1400) ids.push("master");
  return ids;
}
