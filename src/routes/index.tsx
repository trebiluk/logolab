import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PenLine, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoLockup, LogoMark, BertyBot } from "@/components/logo-mark";
import { MarkBoard } from "@/components/mark-board";
import { RankStrip } from "@/components/xp-hud";
import { DailyWarmup } from "@/components/warmup";
import {
  BeaconMark,
  FoxfireMark,
  NorthParkMark,
  PactMark,
  RedRailMark,
  StrideMark,
} from "@/content/marks";
import { LESSONS, UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { XP_PER_LESSON } from "@/lib/xp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const spanish = useProgress((s) => s.spanish);
  const completed = useProgress((s) => s.completedLessons);
  const studentName = useProgress((s) => s.studentName);
  const setStudentName = useProgress((s) => s.setStudentName);
  const setRole = useProgress((s) => s.setRole);
  const nextLesson = LESSONS.find((l) => !completed.includes(l.id));
  const resume = nextLesson ?? LESSONS[0];
  const started = completed.length > 0;

  return (
    <div className="mx-auto max-w-4xl">
      <section className="rise-in shop-hero rounded-xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <LogoLockup size="lg" className="mb-0" />
          <BertyBot className="h-20 w-auto sm:h-24" />
        </div>
        <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-teal">
          TechWorks floor · {UNIT.grades} · {UNIT.length}
        </p>
        <h1 className="mt-2 font-display text-5xl font-medium leading-[1.05] sm:text-6xl">
          Punch a mark.
          <span className="block italic text-teal">Inspect it. Ship it.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          {UNIT.notAMaker}
        </p>
        {spanish ? (
          <p className="mt-2 max-w-xl text-muted">
            No inventa logos y no copia marcas reales. El banco estampa tus
            palabras y formas, y guarda SVG o PNG en este Chromebook.
          </p>
        ) : null}
        <p className="mt-3 max-w-xl text-sm text-muted">
          Chromebook and Windows 11 ready — Chrome or Edge, touch or keys 1–9.
          Earn XP, climb ranks, and brag on this device.
        </p>
        <p className="mt-4 flex max-w-xl items-start gap-3 text-sm text-ink-soft">
          <LogoMark variant="bare" className="mt-0.5 size-9" title="" />
          <span>
            House die: a stencil B. Square nut on top, wider seat below, brass
            hex on the spine — a letter you can punch in steel, not two stacked
            circles.
          </span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            {nextLesson || !started ? (
              <Link to="/lessons/$id" params={{ id: resume.id }}>
                {started
                  ? `Continue · Lesson ${resume.number}`
                  : "Start Lesson 1"}
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link to="/score">
                Unit complete · brag
                <ArrowRight className="size-4" />
              </Link>
            )}
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/bench">Mark bench</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/teacher">Teacher guide</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          What’s new: Layer up and Layer down move the selected stamp.
        </p>
      </section>

      <div className="rise-in rise-in-1 mt-10">
        <RankStrip />
      </div>

      <div className="rise-in rise-in-2 mt-8">
        <DailyWarmup />
      </div>

      <section className="rise-in rise-in-3 mt-12 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { Mark: FoxfireMark, label: "Pictorial" },
          { Mark: StrideMark, label: "Abstract" },
          { Mark: RedRailMark, label: "Lettermark" },
          { Mark: BeaconMark, label: "Simple" },
          { Mark: PactMark, label: "Overlap" },
          { Mark: NorthParkMark, label: "Figure-ground" },
        ].map(({ Mark, label }) => (
          <MarkBoard key={label} caption={label} className="min-w-0">
            <Mark />
          </MarkBoard>
        ))}
      </section>
      <p className="mt-3 text-xs text-muted">{UNIT.fairUse}</p>

      <section className="mt-14">
        <h2 className="font-display text-3xl font-medium">Driving question</h2>
        <p className="mt-3 font-display text-2xl italic text-teal">
          {UNIT.drivingQuestion}
        </p>
        {spanish ? (
          <p className="mt-2 text-muted">{UNIT.drivingQuestionEs}</p>
        ) : null}
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-medium">Six stations</h2>
          <Link to="/lessons" className="text-sm text-teal no-underline">
            All lessons
          </Link>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {LESSONS.map((l) => {
            const done = completed.includes(l.id);
            return (
              <li key={l.id}>
                <Link
                  to="/lessons/$id"
                  params={{ id: l.id }}
                  className="flex gap-3 rounded-xl border border-line bg-surface p-4 no-underline hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="font-mono text-2xl font-medium text-teal tabular-nums">
                    {String(l.number).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink">{l.title}</span>
                      {done ? (
                        <Badge>+{XP_PER_LESSON} XP</Badge>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{l.summary}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-14 grid gap-3 sm:grid-cols-2">
        {[
          { to: "/bench" as const, icon: PenLine, t: "Mark bench", d: "Text and shapes. Save SVG or PNG on this Chromebook." },
          { to: "/studio" as const, icon: Sparkles, t: "Shop floor", d: "Sort, silhouette, optical QC, hidden space, color, type, clinic, cousins, words." },
          { to: "/glossary" as const, icon: BookOpen, t: "Words", d: "English, Spanish, and a sentence you can steal." },
          { to: "/printables" as const, icon: Printer, t: "Paper", d: "The making still happens on paper too." },
        ].map((c) => (
          <Link
            key={c.t}
            to={c.to}
            className="rounded-xl border border-line bg-surface p-4 no-underline hover:shadow-[var(--shadow-border-hover)]"
          >
            <c.icon className="size-5 text-teal" />
            <p className="mt-3 font-display text-xl">{c.t}</p>
            <p className="mt-1 text-sm text-muted">{c.d}</p>
          </Link>
        ))}
      </section>

      <section className="mt-14 rounded-xl border border-line bg-surface p-5">
        <h2 className="font-display text-2xl font-medium">Alias this device</h2>
        <p className="mt-1 text-sm text-muted">
          XP stays in this browser. Alias or first name only — never a last name.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="First name or alias"
            autoComplete="nickname"
            maxLength={18}
            suppressHydrationWarning
            className="h-11 min-w-[10rem] flex-1 rounded-md border border-line bg-paper px-3"
          />
          <Button type="button" variant="secondary" onClick={() => setRole("student")}>
            I’m a student
          </Button>
        </div>
      </section>
    </div>
  );
}
