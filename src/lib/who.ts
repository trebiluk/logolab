import { useEffect, useState } from "react";
import { APP_CHIP } from "@/lib/version";
import { XP_BENCH, XP_SAVE } from "@/lib/xp";

export type WhoCard = {
  alias?: string;
  code?: string;
  verified?: boolean;
  at?: number;
};

export type ScoreWire = {
  app?: string;
  version?: string;
  event?: string;
  level?: string;
  score?: number;
  max?: number;
  stars?: number;
  xp?: number;
  skill?: string;
  ms?: number;
};

export type KulibertWhoApi = {
  read?: () => WhoCard | null;
  active?: () => boolean;
  mark?: (app: string, line: string) => void;
  record?: (rec: ScoreWire) => unknown;
};

declare global {
  interface Window {
    KulibertWho?: KulibertWhoApi;
  }
}

/** Read-only alias when the Tech Room pill is verified. Empty when signed out. */
export function useAlias(): string {
  const [alias, setAlias] = useState("");
  useEffect(() => {
    let stop = false;
    const read = () => {
      if (stop) return;
      try {
        const who = window.KulibertWho?.read?.();
        const next = who && who.verified === true && who.alias ? String(who.alias) : "";
        setAlias((prev) => (prev === next ? prev : next));
      } catch {
        setAlias("");
      }
    };
    read();
    const id = window.setInterval(read, 700);
    window.addEventListener("focus", read);
    return () => {
      stop = true;
      window.clearInterval(id);
      window.removeEventListener("focus", read);
    };
  }, []);
  return alias;
}

/**
 * One TechWorks score for a finished mark.
 * record() is the v2 row. mark() is only the fallback.
 * Signed-out kids still play; this returns false and nothing is posted.
 */
export function recordScore(passes: number, ms: number): boolean {
  try {
    const whoApi = window.KulibertWho;
    if (!whoApi) return false;
    const who = whoApi.read ? whoApi.read() : null;
    const codeOk =
      !!who && who.verified === true && /^[A-Z2-9]{5}$/.test(String(who.code || ""));
    if (!(codeOk && typeof whoApi.active === "function" && whoApi.active())) return false;
    const score = Math.max(0, Math.min(4, Math.round(passes)));
    const stars = Math.min(3, score);
    const xp = score >= 3 ? XP_BENCH : XP_SAVE;
    const line = `Foxfire ${score}/4`;
    if (typeof whoApi.record === "function") {
      const row = whoApi.record({
        app: "logolab",
        version: APP_CHIP,
        event: "score",
        level: "foxfire",
        score,
        max: 4,
        stars,
        xp,
        skill: "branding",
        ms: Math.max(0, Math.round(ms)),
      });
      if (row) return true;
    }
    if (typeof whoApi.mark === "function") {
      whoApi.mark("logolab", line);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
