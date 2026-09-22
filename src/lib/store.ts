import { create } from "zustand";
import { persist } from "zustand/middleware";
import { aliasForBoard } from "@/lib/version";
import {
  XP_PER_LESSON,
  XP_STAR,
  XP_TICKET,
  XP_TIMER,
  XP_WARMUP,
  rankFor,
  studioXp,
} from "@/lib/xp";

export type Role = "student" | "teacher";

export type HallEntry = {
  name: string;
  xp: number;
  rank: string;
  at: number;
};

export type XpGain = {
  amount: number;
  reason: string;
  levelUp: boolean;
  rank: string;
};

type ProgressState = {
  hydrated: boolean;
  role: Role;
  studentName: string;
  spanish: boolean;
  largeType: boolean;
  completedLessons: string[];
  activityBest: Record<string, number>;
  activityCorrect: Record<string, number>;
  activityDone: string[];
  starredTerms: string[];
  starAwarded: string[];
  tickets: Record<string, string>;
  ticketAwarded: string[];
  timerAwarded: string[];
  warmupDay: string;
  xp: number;
  highScore: number;
  hall: HallEntry[];
  lastGain: XpGain | null;
  setHydrated: (v: boolean) => void;
  setRole: (role: Role) => void;
  setStudentName: (name: string) => void;
  setSpanish: (v: boolean) => void;
  setLargeType: (v: boolean) => void;
  completeLesson: (id: string) => void;
  recordActivity: (id: string, score: number, total: number) => void;
  toggleStar: (id: string) => void;
  saveTicket: (lessonId: string, text: string) => void;
  awardTimer: (lessonId: string) => void;
  awardWarmup: (day: string) => void;
  clearGain: () => void;
  postHall: () => void;
  clearHall: () => void;
  reset: () => void;
};

const empty = {
  role: "student" as Role,
  studentName: "",
  spanish: false,
  largeType: false,
  completedLessons: [] as string[],
  activityBest: {} as Record<string, number>,
  activityCorrect: {} as Record<string, number>,
  activityDone: [] as string[],
  starredTerms: [] as string[],
  starAwarded: [] as string[],
  tickets: {} as Record<string, string>,
  ticketAwarded: [] as string[],
  timerAwarded: [] as string[],
  warmupDay: "",
  xp: 0,
  highScore: 0,
  hall: [] as HallEntry[],
  lastGain: null as XpGain | null,
};

function xpPatch(
  state: { xp: number; highScore: number },
  amount: number,
  reason: string,
): { xp: number; highScore: number; lastGain: XpGain | null } {
  if (amount <= 0) return { xp: state.xp, highScore: state.highScore, lastGain: null };
  const prev = state.xp;
  const xp = prev + amount;
  const prevRank = rankFor(prev).name;
  const rank = rankFor(xp).name;
  return {
    xp,
    highScore: Math.max(state.highScore, xp),
    lastGain: {
      amount,
      reason,
      levelUp: rank !== prevRank && xp > prev,
      rank,
    },
  };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ...empty,
      setHydrated: (v) => set({ hydrated: v }),
      setRole: (role) => set({ role }),
      setStudentName: (studentName) => set({ studentName: aliasForBoard(studentName) }),
      setSpanish: (spanish) => set({ spanish }),
      setLargeType: (largeType) => set({ largeType }),
      completeLesson: (id) => {
        const s = get();
        if (s.completedLessons.includes(id)) return;
        set({
          completedLessons: [...s.completedLessons, id],
          ...xpPatch(s, XP_PER_LESSON, "Station complete"),
        });
      },
      recordActivity: (id, score, total) => {
        const s = get();
        const pct = total === 0 ? 0 : Math.round((score / total) * 100);
        const prevCorrect = s.activityCorrect[id] ?? 0;
        const prevPct = s.activityBest[id] ?? 0;
        const delta = Math.max(0, score - prevCorrect);
        const newlyPerfect = score >= total && prevCorrect < total;
        const amount = studioXp(delta, newlyPerfect);
        set({
          activityBest: { ...s.activityBest, [id]: Math.max(prevPct, pct) },
          activityCorrect: {
            ...s.activityCorrect,
            [id]: Math.max(prevCorrect, score),
          },
          activityDone: s.activityDone.includes(id)
            ? s.activityDone
            : [...s.activityDone, id],
          ...xpPatch(
            s,
            amount,
            newlyPerfect ? "Clean die" : "Floor best",
          ),
        });
      },
      toggleStar: (id) => {
        const s = get();
        const starred = s.starredTerms.includes(id);
        if (starred) {
          set({ starredTerms: s.starredTerms.filter((t) => t !== id) });
          return;
        }
        const awarded = s.starAwarded.includes(id);
        set({
          starredTerms: [...s.starredTerms, id],
          starAwarded: awarded ? s.starAwarded : [...s.starAwarded, id],
          ...(awarded ? {} : xpPatch(s, XP_STAR, "Word bank")),
        });
      },
      saveTicket: (lessonId, text) => {
        const s = get();
        const trimmed = text.trim();
        const award = trimmed.length >= 8 && !s.ticketAwarded.includes(lessonId);
        set({
          tickets: { ...s.tickets, [lessonId]: trimmed },
          ticketAwarded: award
            ? [...s.ticketAwarded, lessonId]
            : s.ticketAwarded,
          ...(award ? xpPatch(s, XP_TICKET, "Job ticket") : {}),
        });
      },
      awardTimer: (lessonId) => {
        const s = get();
        if (s.timerAwarded.includes(lessonId)) return;
        set({
          timerAwarded: [...s.timerAwarded, lessonId],
          ...xpPatch(s, XP_TIMER, "Clock in"),
        });
      },
      awardWarmup: (day) => {
        const s = get();
        if (s.warmupDay === day) return;
        set({
          warmupDay: day,
          ...xpPatch(s, XP_WARMUP, "Daily sketch"),
        });
      },
      clearGain: () => set({ lastGain: null }),
      postHall: () => {
        const s = get();
        const name = aliasForBoard(s.studentName) || "Player";
        if (s.xp <= 0) return;
        const rank = rankFor(s.xp).name;
        const rest = s.hall.filter(
          (h) => h.name.toLowerCase() !== name.toLowerCase(),
        );
        const hall = [...rest, { name, xp: s.xp, rank, at: Date.now() }]
          .sort((a, b) => b.xp - a.xp || b.at - a.at)
          .slice(0, 12);
        set({ hall, studentName: name });
      },
      clearHall: () => set({ hall: [] }),
      reset: () =>
        set({
          ...empty,
          role: get().role,
          spanish: get().spanish,
          largeType: get().largeType,
        }),
    }),
    {
      name: "logo-lab-progress",
      version: 2,
      partialize: (s) => ({
        role: s.role,
        studentName: s.studentName,
        spanish: s.spanish,
        largeType: s.largeType,
        completedLessons: s.completedLessons,
        activityBest: s.activityBest,
        activityCorrect: s.activityCorrect,
        activityDone: s.activityDone,
        starredTerms: s.starredTerms,
        starAwarded: s.starAwarded,
        tickets: s.tickets,
        ticketAwarded: s.ticketAwarded,
        timerAwarded: s.timerAwarded,
        warmupDay: s.warmupDay,
        xp: s.xp,
        highScore: s.highScore,
        hall: s.hall,
      }),
      migrate: (persisted) => {
        const p = { ...empty, ...((persisted ?? {}) as Partial<ProgressState>) };
        return {
          role: p.role,
          studentName: aliasForBoard(p.studentName ?? ""),
          spanish: p.spanish,
          largeType: p.largeType,
          completedLessons: p.completedLessons ?? [],
          activityBest: p.activityBest ?? {},
          activityCorrect: p.activityCorrect ?? {},
          activityDone: p.activityDone ?? [],
          starredTerms: p.starredTerms ?? [],
          starAwarded: p.starAwarded ?? [],
          tickets: p.tickets ?? {},
          ticketAwarded: p.ticketAwarded ?? [],
          timerAwarded: p.timerAwarded ?? [],
          warmupDay: p.warmupDay ?? "",
          xp: p.xp ?? 0,
          highScore: p.highScore ?? 0,
          hall: (p.hall ?? []).map((h) => ({
            ...h,
            name: aliasForBoard(h.name) || "Player",
          })),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return {
          ...current,
          ...p,
          tickets: p.tickets ?? {},
          ticketAwarded: p.ticketAwarded ?? [],
          timerAwarded: p.timerAwarded ?? [],
          activityBest: p.activityBest ?? {},
          activityCorrect: p.activityCorrect ?? {},
          activityDone: p.activityDone ?? [],
          completedLessons: p.completedLessons ?? [],
          starredTerms: p.starredTerms ?? [],
          starAwarded: p.starAwarded ?? [],
          hall: p.hall ?? [],
          warmupDay: p.warmupDay ?? "",
          studentName: aliasForBoard(p.studentName ?? ""),
        };
      },
    },
  ),
);
