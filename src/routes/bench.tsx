import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { APP_CHIP } from "@/lib/version";

export const Route = createFileRoute("/bench")({
  component: BenchPage,
});

function BenchPage() {
  const spanish = useProgress((s) => s.spanish);
  const [Bench, setBench] = useState<ComponentType | null>(null);

  useEffect(() => {
    let live = true;
    void import("@/components/mark-bench-client").then((mod) => {
      if (live) setBench(() => mod.MarkBench);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-teal">
        {APP_CHIP} · {UNIT.shortName}
      </p>
      <h1 className="mt-1 font-display text-4xl font-medium">Mark bench</h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Stamp your own words and shapes. Save SVG or PNG on this Chromebook.
        Nothing is uploaded. This is not a logo machine, and real trademarks
        stay off the press.
      </p>
      {spanish ? (
        <p className="mt-2 max-w-xl text-sm text-muted">
          Palabras y formas propias. El archivo se guarda en este Chromebook.
          No se sube. No copies una marca real.
        </p>
      ) : null}
      <p className="mt-3 max-w-xl text-sm text-muted">
        What’s new: the plate is white, with Duplicate, Rotate, Bigger, Smaller, and Outline.
      </p>
      {Bench ? <Bench /> : <p className="mt-6 text-sm text-muted">Opening the press…</p>}
    </div>
  );
}
