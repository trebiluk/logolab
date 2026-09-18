import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkBoard } from "@/components/mark-board";
import { LAB_BRANDS } from "@/content/marks";
import { useProgress } from "@/lib/store";
import { XP_WARMUP } from "@/lib/xp";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function brandForDay(day: string) {
  let h = 0;
  for (let i = 0; i < day.length; i++) h = (h * 33 + day.charCodeAt(i)) >>> 0;
  return LAB_BRANDS[h % LAB_BRANDS.length];
}

export function DailyWarmup() {
  const day = useMemo(() => todayKey(), []);
  const brand = useMemo(() => brandForDay(day), [day]);
  const hydrated = useProgress((s) => s.hydrated);
  const warmupDay = useProgress((s) => s.warmupDay);
  const awardWarmup = useProgress((s) => s.awardWarmup);
  const spanish = useProgress((s) => s.spanish);
  const doneToday = warmupDay === day;
  const [left, setLeft] = useState(45);
  const [running, setRunning] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (hydrated && doneToday) setReveal(true);
  }, [hydrated, doneToday]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      setReveal(true);
      awardWarmup(day);
      return;
    }
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, left, awardWarmup, day]);

  if (!hydrated) {
    return (
      <section className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium uppercase tracking-wider text-teal">
          Today’s mark · 45 seconds
        </p>
        <div className="mt-4 h-40 rounded-lg bg-surface-2" />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-teal">
            Today’s mark · 45 seconds
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium">
            Sketch {brand.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {spanish
              ? "Dibuja de memoria. Luego mira. No copies una marca famosa."
              : "From memory, on paper. Then peek. Do not copy a famous trademark."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-xl tabular-nums text-teal">
            0:{String(Math.max(0, left)).padStart(2, "0")}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={running}
            onClick={() => {
              setLeft(45);
              setReveal(false);
              setRunning(true);
            }}
          >
            {doneToday ? "Again" : running ? "Sketching…" : `Start · +${XP_WARMUP} XP`}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setReveal((v) => !v);
              if (!doneToday) awardWarmup(day);
            }}
          >
            {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {reveal ? "Hide" : "Peek"}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {reveal ? (
          <MarkBoard caption={`${brand.name} · ${brand.kind}`} className="mx-auto max-w-sm">
            <brand.Mark />
          </MarkBoard>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg bg-surface-2 text-sm text-muted">
            Mark hidden — sketch first.
          </div>
        )}
      </div>
    </section>
  );
}
