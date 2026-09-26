import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Printer, Sparkles } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { ICan } from "@/components/sentence-frames";
import { VocabRow } from "@/components/vocab-chip";
import { Button } from "@/components/ui/button";
import { LESSONS, type LessonMeta } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { XP_PER_LESSON, XP_TICKET, XP_TIMER } from "@/lib/xp";
import { cn } from "@/lib/utils";

const LessonIdContext = createContext("");

export function useLessonId() {
  return useContext(LessonIdContext);
}

export function LessonLayout({
  lesson,
  intro,
  children,
}: {
  lesson: LessonMeta;
  intro: string;
  children: ReactNode;
}) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const done = useProgress((s) => s.completedLessons.includes(lesson.id));
  const spanish = useProgress((s) => s.spanish);
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  return (
    <LessonIdContext.Provider value={lesson.id}>
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-teal">
          Station {String(lesson.number).padStart(2, "0")} · {lesson.duration}
        </p>
        <div className="mt-2 flex items-start gap-2">
          <h1 className="font-display text-4xl font-medium leading-tight">
            {lesson.title}
          </h1>
          <SpeakButton text={`${lesson.title}. ${intro}`} />
        </div>
        {spanish ? (
          <p className="mt-1 text-muted">{lesson.titleEs}</p>
        ) : null}
        <p className="mt-4 text-lg text-ink-soft">{intro}</p>
        <div className="mt-6 space-y-3">
          <ICan en={lesson.iCan} es={lesson.iCanEs} />
          <p className="text-sm text-muted">
            <span className="font-medium text-teal">Language · </span>
            {lesson.languageGoal}
            {spanish ? <span className="mt-1 block">{lesson.languageGoalEs}</span> : null}
          </p>
          <VocabRow ids={lesson.vocab} />
        </div>
        <div className="mt-10 space-y-12">{children}</div>
        <footer className="mt-14 space-y-4 border-t border-line pt-6">
          <div className="flex flex-wrap gap-2">
            {lesson.studio ? (
              <Button asChild>
                <Link to="/studio/$id" params={{ id: lesson.studio }}>
                  <Sparkles className="size-4" />
                  Floor practice
                </Link>
              </Button>
            ) : null}
            {lesson.printable ? (
              <Button asChild variant="secondary">
                <Link to="/printables/$id" params={{ id: lesson.printable }}>
                  <Printer className="size-4" />
                  Paper copy
                </Link>
              </Button>
            ) : null}
            <Button
              variant={done ? "outline" : "secondary"}
              onClick={() => completeLesson(lesson.id)}
              disabled={done}
            >
              <Check className="size-4" />
              {done
                ? `Lesson marked done · +${XP_PER_LESSON} XP`
                : `Mark lesson done · +${XP_PER_LESSON} XP`}
            </Button>
          </div>
          <p className="text-sm text-muted">
            First finish only. Replays of the studio still pay if you beat your best.
          </p>
          <div className="flex justify-between gap-3">
            {prev ? (
              <Button asChild variant="ghost">
                <Link to="/lessons/$id" params={{ id: prev.id }}>
                  <ArrowLeft className="size-4" />
                  {prev.title}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button asChild variant="ghost">
                <Link to="/lessons/$id" params={{ id: next.id }}>
                  {next.title}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link to="/printables/$id" params={{ id: "design-brief" }}>
                  Paper brief
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </footer>
      </article>
    </LessonIdContext.Provider>
  );
}

export function DoNow({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-teal">
          Clock in · 3 minutes
        </p>
        <SketchTimer seconds={180} award="timer" />
      </div>
      <div className="text-ink-soft">{children}</div>
    </section>
  );
}

export function ExitTicket({ prompt }: { prompt: string }) {
  const lessonId = useLessonId();
  const saved = useProgress((s) => s.tickets[lessonId] ?? "");
  const saveTicket = useProgress((s) => s.saveTicket);
  const awarded = useProgress((s) => s.ticketAwarded.includes(lessonId));
  const spanish = useProgress((s) => s.spanish);
  const [text, setText] = useState(saved);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setText(saved);
  }, [saved]);

  const ready = text.trim().length >= 8;

  return (
    <section className="rounded-xl bg-ink px-5 py-6 text-paper">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-teal-soft">
        Exit ticket
      </p>
      <p className="font-display text-xl font-medium">{prompt}</p>
      <p className="mt-3 text-sm text-paper/70">
        Write on paper, say it to a partner, or keep a copy on this device. Use a
        sentence frame if you want.
      </p>
      <label className="mt-4 block text-sm">
        <span className="sr-only">Your exit ticket</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          rows={3}
          placeholder="I notice ______ because ______."
          className="w-full resize-y rounded-md border border-white/20 bg-ink-soft/40 px-3 py-2 text-paper placeholder:text-paper/40"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={!ready}
          onClick={() => {
            saveTicket(lessonId, text);
            setJustSaved(true);
            window.setTimeout(() => setJustSaved(false), 1800);
          }}
        >
          {justSaved ? "Saved" : awarded ? "Update on this device" : `Save · +${XP_TICKET} XP`}
        </Button>
        <span className="text-xs text-paper/60">
          {text.trim().length}/280 · first save of 8+ letters earns XP
        </span>
      </div>
      <a
        href={`${import.meta.env.BASE_URL}bench?job=1`}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-teal-soft underline-offset-4 hover:underline"
      >
        {spanish ? "Prueba este trabajo en el banco" : "Try this job on the bench"}
      </a>
    </section>
  );
}

export function SketchTimer({
  seconds,
  award,
}: {
  seconds: number;
  award?: "timer" | "warmup";
}) {
  const lessonId = useLessonId();
  const awardTimer = useProgress((s) => s.awardTimer);
  const already = useProgress((s) =>
    lessonId ? s.timerAwarded.includes(lessonId) : true,
  );
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      setEnded(true);
      return;
    }
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, left]);

  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");
  const label = `${mm}:${ss}`;

  function start() {
    if (award === "timer" && lessonId) awardTimer(lessonId);
    if (ended) {
      setLeft(seconds);
      setEnded(false);
    }
    setRunning(true);
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "min-w-[3.25rem] text-right font-display text-lg tabular-nums",
          ended ? "text-bad" : left <= 10 && running ? "text-warn" : "text-teal",
        )}
        aria-live="polite"
      >
        {ended ? "Time" : label}
      </span>
      <Button
        type="button"
        size="sm"
        variant={running ? "outline" : "secondary"}
        onClick={() => (running ? setRunning(false) : start())}
      >
        {running ? "Pause" : ended ? "Again" : already ? "Start" : `Start · +${XP_TIMER} XP`}
      </Button>
    </div>
  );
}
