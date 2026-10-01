import { createFileRoute } from "@tanstack/react-router";
import { MarkBench } from "@/components/mark-bench-client";
import { UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { useClassicTheme } from "@/lib/theme";
import { APP_CHIP, WHATS_NEW } from "@/lib/version";

export const Route = createFileRoute("/bench")({
  component: BenchRoute,
});

export function BenchScreen({ classic }: { classic: boolean }) {
  const spanish = useProgress((s) => s.spanish);

  return (
    <div className={classic ? "mx-auto max-w-5xl" : "bench-screen"}>
      {classic ? (
        <>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-teal">
            {APP_CHIP} · {UNIT.shortName}
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium">Mark bench</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            White plate. Nothing is uploaded. Real trademarks stay off.
          </p>
          {spanish ? (
            <p className="mt-1 max-w-xl text-sm text-muted">
              Palabras y formas en la placa blanca. No se sube. No copies una marca real.
            </p>
          ) : null}
          <p className="mt-2 max-w-xl text-sm text-muted">{WHATS_NEW}</p>
        </>
      ) : null}
      <MarkBench classic={classic} />
    </div>
  );
}

function BenchRoute() {
  const classic = useClassicTheme();
  return <BenchScreen classic={classic} />;
}
