import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Printer, Share2, Trophy } from "lucide-react";
import { useState } from "react";
import { LevelLine } from "@/components/xp-hud";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LESSONS, STUDIO } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { RANKS, bragText, pinIdsEarned, PINS, rankFor, studioMaxXp } from "@/lib/xp";

export const Route = createFileRoute("/score")({ component: ScorePage });

function ScorePage() {
  const xp = useProgress((s) => s.xp);
  const highScore = useProgress((s) => s.highScore);
  const name = useProgress((s) => s.studentName);
  const setStudentName = useProgress((s) => s.setStudentName);
  const completed = useProgress((s) => s.completedLessons);
  const best = useProgress((s) => s.activityBest);
  const done = useProgress((s) => s.activityDone);
  const starred = useProgress((s) => s.starredTerms);
  const tickets = useProgress((s) => s.tickets);
  const warmupDay = useProgress((s) => s.warmupDay);
  const spanish = useProgress((s) => s.spanish);
  const hall = useProgress((s) => s.hall);
  const postHall = useProgress((s) => s.postHall);
  const rank = rankFor(xp);
  const [copied, setCopied] = useState(false);
  const [posted, setPosted] = useState(false);
  const text = bragText(name, highScore, rankFor(highScore).name);
  const perfects = STUDIO.filter((s) => (best[s.id] ?? 0) === 100).length;
  const pins = pinIdsEarned({
    completedLessons: completed,
    activityDone: done,
    activityBest: best,
    starredTerms: starred,
    tickets,
    warmupDay,
    xp,
    studioCount: STUDIO.length,
  });
  const notes = LESSONS.filter((l) => (tickets[l.id] ?? "").trim().length > 0);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this score", text);
    }
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "BertyBot's LogoLab", text });
        return;
      } catch {
        /* cancelled or blocked — fall through */
      }
    }
    void copy();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Score · this device
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium">Brag board</h1>
      <p className="mt-2 text-ink-soft">
        XP stays in this browser — Chromebook, Windows 11, Chrome or Edge. Beat
        your high score, then post it to the hall on this machine.
      </p>

      <article
        id="brag-card"
        className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-border)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">BertyBot's LogoLab</p>
            <h2 className="font-display text-3xl font-medium">
              {name.trim() || "Unnamed designer"}
            </h2>
            <p className="mt-1 text-teal">{rank.name}</p>
          </div>
          <Trophy className="size-8 text-teal" />
        </div>
        <p className="mt-6 font-display text-6xl font-medium tabular-nums leading-none text-ink">
          {xp}
          <span className="ml-2 text-xl text-muted">XP</span>
        </p>
        <p className="mt-2 text-sm text-muted tabular-nums">
          High score {highScore}
        </p>
        <LevelLine className="mt-5" />
        <ul className="mt-5 flex flex-wrap gap-2">
          <Badge>
            {completed.length}/{LESSONS.length} lessons
          </Badge>
          <Badge variant="outline">
            {done.length}/{STUDIO.length} studios
          </Badge>
          <Badge variant={perfects ? "good" : "outline"}>
            {perfects} perfect
          </Badge>
          <Badge variant="outline">{starred.length} words</Badge>
          <Badge variant={pins.length ? "good" : "outline"}>{pins.length}/{PINS.length} pins</Badge>
        </ul>
      </article>

      <div className="no-print mt-4 flex flex-wrap gap-2">
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          Print card
        </Button>
        <Button variant="secondary" onClick={() => void share()}>
          <Share2 className="size-4" />
          Share
        </Button>
        <Button variant="outline" onClick={() => void copy()}>
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy text"}
        </Button>
        <Button asChild variant="outline">
          <Link to="/printables/$id" params={{ id: "certificate" }}>
            Certificate
          </Link>
        </Button>
      </div>

      <section className="no-print mt-10">
        <h2 className="font-display text-2xl font-medium">Pins</h2>
        <p className="mt-1 text-sm text-muted">
          Unlock by looking, not by buying. They stay on this device.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PINS.map((p) => {
            const on = pins.includes(p.id);
            return (
              <li
                key={p.id}
                className={`rounded-xl border px-4 py-3 ${on ? "border-teal bg-teal-soft/50" : "border-line bg-surface"}`}
              >
                <p className="font-medium">{spanish ? p.nameEs : p.name}</p>
                <p className="text-sm text-muted">{on ? "Earned" : p.hint}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {notes.length > 0 ? (
        <section className="no-print mt-10">
          <h2 className="font-display text-2xl font-medium">Notebook</h2>
          <p className="mt-1 text-sm text-muted">Exit tickets saved on this device.</p>
          <ul className="mt-4 space-y-3">
            {notes.map((l) => (
              <li key={l.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs uppercase tracking-wider text-teal">Lesson {l.number}</p>
                <p className="mt-1 font-medium">{l.title}</p>
                <p className="mt-2 text-sm text-ink-soft">{tickets[l.id]}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="no-print mt-10">
        <h2 className="font-display text-2xl font-medium">Ranks</h2>
        <ol className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {RANKS.map((r) => {
            const current = r.name === rank.name;
            return (
              <li
                key={r.name}
                className={`flex items-center gap-4 px-4 py-3 ${current ? "bg-teal-soft/60" : ""}`}
              >
                <span className="min-w-0 flex-1 font-medium">{r.name}</span>
                <span className="text-sm tabular-nums text-muted">{r.min}+ XP</span>
                {current ? <Badge variant="good">You</Badge> : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="no-print mt-10">
        <h2 className="font-display text-2xl font-medium">Post to this device</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Shared Chromebook? Add your name, post, and leave the hall up. Scores
          do not travel to other computers.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1 text-sm">
            <span className="mb-1 block font-medium">Name on the board</span>
            <input
              value={name}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="First name"
              autoComplete="nickname"
              className="h-11 w-full rounded-md border border-line bg-surface px-3 text-ink"
            />
          </label>
          <Button
            onClick={() => {
              postHall();
              setPosted(true);
            }}
            disabled={xp <= 0}
          >
            Post my high score
          </Button>
        </div>
        {posted ? (
          <p className="mt-2 text-sm text-good">Posted. Scroll the hall below.</p>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">Hall of marks</h2>
        {hall.length === 0 ? (
          <p className="mt-3 text-ink-soft">
            No scores posted on this device yet. Play, then post.
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {hall.map((h, i) => (
              <li
                key={`${h.name}-${h.at}`}
                className="flex items-center gap-4 px-4 py-3"
              >
                <span className="w-6 font-display text-lg tabular-nums text-teal">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{h.name}</span>
                  <span className="text-sm text-muted">{h.rank}</span>
                </span>
                <span className="font-medium tabular-nums">{h.xp} XP</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="no-print mt-10">
        <h2 className="font-display text-2xl font-medium">How to earn</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-soft">
          <li>Finish a lesson: 100 XP (once).</li>
          <li>Beat your studio best: 15 XP per extra correct. Perfect run: +40.</li>
          <li>Star a glossary word: 8 XP (once per word).</li>
          <li>Start a Do now timer: 6 XP (once per lesson).</li>
          <li>Save an exit ticket: 10 XP (once per lesson).</li>
          <li>Today’s sketch warmup: 8 XP (once a day).</li>
          <li>Replays only pay if you score higher than last time.</li>
        </ul>
        <ul className="mt-4 space-y-2">
          {STUDIO.map((s) => (
            <li key={s.id} className="flex justify-between text-sm">
              <Link to="/studio/$id" params={{ id: s.id }} className="text-teal">
                {s.title}
              </Link>
              <span className="tabular-nums text-muted">
                {best[s.id] != null ? `${best[s.id]}%` : "—"} · max{" "}
                {studioMaxXp(s.rounds)} XP
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
