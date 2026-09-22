import { useEffect, useState } from "react";
import { APP_CHIP } from "@/lib/version";

export function FloorKeys() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      ) {
        return;
      }
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      role="dialog"
      aria-label="Floor keys"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-paper p-5 shadow-[var(--shadow-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-teal">
          {APP_CHIP} · floor keys
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium">Punch with the keys</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-mono text-teal">1–9</dt>
          <dd>Pick an answer</dd>
          <dt className="font-mono text-teal">Enter</dt>
          <dd>Submit a clinic · replay a finished game</dd>
          <dt className="font-mono text-teal">?</dt>
          <dd>This card</dd>
          <dt className="font-mono text-teal">Esc</dt>
          <dd>Close</dd>
        </dl>
        <p className="mt-4 text-xs text-muted">
          XP is brag on this device. It is not a grade.
        </p>
        <button
          type="button"
          className="mt-4 h-11 w-full rounded-md bg-teal text-paper"
          onClick={() => setOpen(false)}
        >
          Back to the floor
        </button>
      </div>
    </div>
  );
}
