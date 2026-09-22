import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/store";
import { levelFor, levelProgress, nextRank, rankFor } from "@/lib/xp";
import { cn } from "@/lib/utils";

export function XpChip() {
  const xp = useProgress((s) => s.xp);
  const highScore = useProgress((s) => s.highScore);
  const rank = rankFor(xp);
  const { into, of } = levelProgress(xp);
  const pct = Math.round((into / of) * 100);

  return (
    <Link
      to="/score"
      className="flex h-11 min-w-0 items-center gap-2 rounded-md px-2 no-underline hover:bg-surface-2 focus-visible:bg-surface-2"
      title={`High score ${highScore} XP`}
    >
      <Trophy className="size-4 shrink-0 text-teal" />
      <span className="min-w-0">
        <span className="block text-sm font-medium tabular-nums leading-none text-ink">
          {xp}
          <span className="ml-1 text-xs font-normal text-muted">XP</span>
        </span>
        <span className="mt-0.5 hidden text-xs leading-none text-muted sm:block">
          {rank.name}
        </span>
      </span>
      <span
        className="hidden h-1 w-10 overflow-hidden rounded-full bg-paper-2 sm:block"
        aria-hidden
      >
        <span className="block h-full bg-teal" style={{ width: `${pct}%` }} />
      </span>
    </Link>
  );
}

export function XpToasts() {
  const lastGain = useProgress((s) => s.lastGain);
  const clearGain = useProgress((s) => s.clearGain);
  const xp = useProgress((s) => s.xp);

  useEffect(() => {
    if (!lastGain) return;
    const t = window.setTimeout(clearGain, 2800);
    return () => window.clearTimeout(t);
  }, [lastGain, clearGain]);

  if (!lastGain) return null;

  return (
    <div
      className="no-print pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 md:bottom-6"
      role="status"
      aria-live="polite"
    >
      {lastGain.levelUp ? (
        <div className="pointer-events-auto rounded-xl bg-ink px-4 py-3 text-paper shadow-[var(--shadow-border)]">
          <p className="text-xs uppercase tracking-wider text-teal-soft">New rank</p>
          <p className="font-display text-xl font-medium">{lastGain.rank}</p>
        </div>
      ) : null}
      <div className="pointer-events-auto rounded-md bg-teal px-3 py-2 text-sm font-medium text-paper">
        +{lastGain.amount} XP
        <span className="ml-2 font-normal text-teal-soft">{lastGain.reason}</span>
        <span className="ml-2 tabular-nums opacity-80">{xp}</span>
      </div>
    </div>
  );
}

export function LevelLine({ className }: { className?: string }) {
  const xp = useProgress((s) => s.xp);
  const level = levelFor(xp);
  const { into, of } = levelProgress(xp);
  return (
    <div className={cn("text-sm", className)}>
      <div className="mb-1 flex justify-between text-muted">
        <span>Level {level}</span>
        <span className="tabular-nums">
          {into} / {of}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-2">
        <div
          className="h-full bg-teal transition-[width] duration-300"
          style={{ width: `${(into / of) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function RankStrip() {
  const xp = useProgress((s) => s.xp);
  const highScore = useProgress((s) => s.highScore);
  const spanish = useProgress((s) => s.spanish);
  const rank = rankFor(xp);
  const next = nextRank(xp);
  const need = next ? next.min - xp : 0;

  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Rank · this device
          </p>
          <p className="mt-1 font-display text-3xl font-medium">
            {spanish ? rank.nameEs : rank.name}
          </p>
          <p className="mt-1 text-sm tabular-nums text-teal">
            {xp} XP
            {highScore > xp ? <span className="text-muted"> · high {highScore}</span> : null}
          </p>
          <p className="mt-1 text-sm text-muted">
            {next
              ? `${need} XP to ${spanish ? next.nameEs : next.name}`
              : "Top rank. Keep a clean die on the floor."}
          </p>
        </div>
        <Button asChild>
          <Link to="/score">
            <Trophy className="size-4" />
            Brag board
          </Link>
        </Button>
      </div>
      <LevelLine className="mt-4" />
    </section>
  );
}
