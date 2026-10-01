import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const THEME_KEY = "logolab-theme";

export function searchHas(searchStr: string, key: string, value: string): boolean {
  const raw = searchStr.startsWith("?") ? searchStr.slice(1) : searchStr;
  return new URLSearchParams(raw).get(key) === value;
}

function heldClassic(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(THEME_KEY) === "classic";
  } catch {
    return false;
  }
}

/** `?theme=classic` restores the 1.2.15 shell. The flag sticks for this tab. */
export function useClassicTheme(): boolean {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const queryOn = searchHas(searchStr, "theme", "classic");
  const queryOther = searchStr.includes("theme=") && !queryOn;
  const [held, setHeld] = useState(() => queryOn || (!queryOther && heldClassic()));

  useEffect(() => {
    if (queryOn) {
      try {
        sessionStorage.setItem(THEME_KEY, "classic");
      } catch {
        /* private mode */
      }
      setHeld(true);
      return;
    }
    if (queryOther) {
      try {
        sessionStorage.removeItem(THEME_KEY);
      } catch {
        /* private mode */
      }
      setHeld(false);
      return;
    }
    setHeld(heldClassic());
  }, [queryOn, queryOther]);

  if (queryOn) return true;
  if (queryOther) return false;
  return held;
}

/** Reading page, moved off `/` so the bench can open first. */
export function useFloorHome(): boolean {
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  return searchHas(searchStr, "view", "home");
}
