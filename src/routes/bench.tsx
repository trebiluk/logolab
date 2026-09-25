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
      <h1 className="mt-1 font-display text-3xl font-medium">Mark bench</h1>
      <p className="mt-1 max-w-xl text-sm text-ink-soft">
        Stamp words and shapes on the white plate. Nothing is uploaded. Real
        trademarks stay off the press.
      </p>
      {spanish ? (
        <p className="mt-1 max-w-xl text-sm text-muted">
          Palabras y formas en la placa blanca. No se sube. No copies una marca real.
        </p>
      ) : null}
      <p className="mt-2 max-w-xl text-sm text-muted">
        What’s new: the empty plate says start with Big word, and Save says the file landed.
      </p>
      {Bench ? <Bench /> : <p className="mt-6 text-sm text-muted">Opening the press…</p>}
    </div>
  );
}
