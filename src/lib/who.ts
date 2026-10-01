import { useEffect, useState } from "react";

export type WhoCard = {
  alias?: string;
  code?: string;
  verified?: boolean;
  at?: number;
};

export type KulibertWhoApi = {
  read?: () => WhoCard | null;
  active?: () => boolean;
  mark?: (app: string, line: string) => void;
  record?: (rec: {
    app?: string;
    event?: string;
    level?: string;
    score?: number;
    stars?: number;
    version?: string;
  }) => unknown;
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
 * Leave a teacher mark only for a verified, active TechWorks code.
 * Uses record() when a future kw-who.js adds it; otherwise mark().
 * Returns false when signed out — the bench still plays.
 */
export function recordMark(job: string, stars: number): boolean {
  try {
    const whoApi = window.KulibertWho;
    if (!whoApi) return false;
    const who = whoApi.read ? whoApi.read() : null;
    const codeOk =
      !!who && who.verified === true && /^[A-Z2-9]{5}$/.test(String(who.code || ""));
    if (!(codeOk && typeof whoApi.active === "function" && whoApi.active())) return false;
    const cleanJob = (job.trim() || "Foxfire Camp").replace(/\s+/g, " ").slice(0, 18);
    const n = Math.max(0, Math.min(4, Math.round(stars)));
    const line = `Mark: ${cleanJob} ★${n}`;
    if (typeof whoApi.record === "function") {
      const row = whoApi.record({
        app: "logolab",
        event: "mark",
        level: line,
        score: n,
        stars: n,
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
