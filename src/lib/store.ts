import { create } from "zustand";
import { persist } from "zustand/middleware";
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

function applyXp(
  get: () => ProgressState,
  set: (p: Partial<ProgressState>) => void,
  amount: number,
  reason: string,
) {
  if (amount <= 0) {
    set({ lastGain: null });
    return;
  }
  const prev = get().xp;
  const xp = prev + amount;
  const prevRank = rankFor(prev).name;
  const rank = rankFor(xp).name;
  set({
    xp,
    highScore: Math.max(get().highScore, xp),
    lastGain: {
      amount,
      reason,
      levelUp: rank !== prevRank && xp > prev,
      rank,
    },
  });
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ...empty,
      setHydrated: (v) => set({ hydrated: v }),
      setRole: (role) => set({ role }),
      setStudentName: (studentName) => set({ studentName }),
      setSpanish: (spanish) => set({ spanish }),
      setLargeType: (largeType) => set({ largeType }),
      completeLesson: (id) => {
        if (get().completedLessons.includes(id)) return;
        set({ completedLessons: [...get().completedLessons, id] });
        applyXp(get, set, XP_PER_LESSON, "Lesson complete");
      },
      recordActivity: (id, score, total) => {
        const pct = total === 0 ? 0 : Math.round((score / total) * 100);
        const prevCorrect = get().activityCorrect[id] ?? 0;
        const prevPct = get().activityBest[id] ?? 0;
        const delta = Math.max(0, score - prevCorrect);
        const newlyPerfect = score >= total && prevCorrect < total;
        const amount = studioXp(delta, newlyPerfect);
        set({
          activityBest: { ...get().activityBest, [id]: Math.max(prevPct, pct) },
          activityCorrect: {
            ...get().activityCorrect,
            [id]: Math.max(prevCorrect, score),
          },
          activityDone: get().activityDone.includes(id)
            ? get().activityDone
            : [...get().activityDone, id],
        });
        applyXp(
          get,
          set,
          amount,
          newlyPerfect ? "Perfect studio" : "Studio best",
        );
      },
      toggleStar: (id) => {
        const starred = get().starredTerms.includes(id);
        if (starred) {
          set({ starredTerms: get().starredTerms.filter((t) => t !== id) });
          return;
        }
        set({ starredTerms: [...get().starredTerms, id] });
        if (!get().starAwarded.includes(id)) {
          set({ starAwarded: [...get().starAwarded, id] });
          applyXp(get, set, XP_STAR, "Word bank");
        }
      },
      saveTicket: (lessonId, text) => {
        const trimmed = text.trim();
        set({ tickets: { ...get().tickets, [lessonId]: trimmed } });
        if (trimmed.length >= 8 && !get().ticketAwarded.includes(lessonId)) {
          set({ ticketAwarded: [...get().ticketAwarded, lessonId] });
          applyXp(get, set, XP_TICKET, "Exit ticket");
        }
      },
      awardTimer: (lessonId) => {
        if (get().timerAwarded.includes(lessonId)) return;
        set({ timerAwarded: [...get().timerAwarded, lessonId] });
        applyXp(get, set, XP_TIMER, "Do now");
      },
      awardWarmup: (day) => {
        if (get().warmupDay === day) return;
        set({ warmupDay: day });
        applyXp(get, set, XP_WARMUP, "Daily sketch");
      },
      clearGain: () => set({ lastGain: null }),
      postHall: () => {
        const name = get().studentName.trim() || "Player";
        const xp = get().xp;
        if (xp <= 0) return;
        const rank = rankFor(xp).name;
        const rest = get().hall.filter(
          (h) => h.name.toLowerCase() !== name.toLowerCase(),
        );
        const hall = [...rest, { name, xp, rank, at: Date.now() }]
          .sort((a, b) => b.xp - a.xp || b.at - a.at)
          .slice(0, 12);
        set({ hall });
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
          warmupDay: p.warmupDay ?? "",
        };
      },
    },
  ),
);
