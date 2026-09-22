import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LESSONS, STANDARDS, UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { APP_CHIP, CHANGELOG, floorDump } from "@/lib/version";

export const Route = createFileRoute("/teacher")({ component: Teacher });

function Teacher() {
  const setRole = useProgress((s) => s.setRole);
  const reset = useProgress((s) => s.reset);
  const clearHall = useProgress((s) => s.clearHall);
  const xp = useProgress((s) => s.xp);
  const highScore = useProgress((s) => s.highScore);
  const hall = useProgress((s) => s.hall);
  const completedLessons = useProgress((s) => s.completedLessons);
  const activityDone = useProgress((s) => s.activityDone);
  const warmupDay = useProgress((s) => s.warmupDay);
  const [copiedDump, setCopiedDump] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal">
          TechWorks · Teacher guide · {APP_CHIP}
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium">{UNIT.name}</h1>
        <p className="mt-2 text-ink-soft">
          {UNIT.grades} · {UNIT.length}. BertyBot’s mark factory: looking on
          screen, making on paper. Not a logo generator.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setRole("teacher")} variant="secondary">
            Mark this device as teacher
          </Button>
          <Button asChild>
            <Link to="/printables/$id" params={{ id: "teacher-pacing" }}>
              Print pacing + keys
            </Link>
          </Button>
        </div>
      </header>

      <section>
        <h2 className="font-display text-2xl font-medium">How to run it</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink-soft">
          <li>Project a lesson. Students talk with sentence frames, then write.</li>
          <li>
            Send them into the matching Studio game (phones, laptops, or a
            shared machine).
          </li>
          <li>
            Hand the paper copy the same day. The performance task is the design
            brief — drawn, not generated.
          </li>
          <li>
            Famous real logos (the apple, the swoosh) stay in talk and in
            memory sketches. On-screen marks are original lab brands, invented
            logos that are broken on purpose, and joke cousins that tease a
            famous idea. Students name the real brand — they do not trace it.
          </li>
          <li>
            Turn on <span className="font-medium text-teal">ES</span> and larger
            type whenever the room needs it. Read-aloud lives on lesson titles
            and glossary cards.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Chromebook and Windows 11</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
          <li>
            Use Chrome or Edge. No extra app, no Flash, no download. Full-screen
            the tab if you are projecting.
          </li>
          <li>
            Touch, click, or press number keys <span className="font-medium text-ink">1–9</span>{" "}
            to pick answers. Enter submits the fake-logo clinic.
          </li>
          <li>
            Shared Chromebooks keep one scoreboard per browser profile. Ask
            students to type a first name before they post to the hall.
          </li>
          <li>
            XP and the hall live in this browser only. They do not follow a
            student to another computer, and they are not an account login.
          </li>
          <li>
            Start class with the home warmup: 45 seconds to sketch today’s lab
            brand from memory, then peek. Do now timers sit on every lesson.
          </li>
          <li>
            Exit tickets can stay on paper or be typed on the device (notebook
            on the brag board). Word drill practices glossary terms with keys
            1–4.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">XP on this device</h2>
        <p className="mt-2 text-ink-soft">
          Grade is not Bank. XP is brag on this Chromebook — it does not post to
          TechWorks desk, TechCash, or a 3/2/1. Current {xp} · high {highScore} ·{" "}
          {hall.length} hall posts (aliases only). Resetting clears lessons,
          floor bests, stars, and XP. Teacher mode, ES, and large type stay.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (
                window.confirm(
                  "Erase XP, lessons, studio scores, and starred words on this device?",
                )
              ) {
                reset();
                setRole("teacher");
              }
            }}
          >
            Reset this device
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm("Clear the hall of fame on this device?")) {
                clearHall();
              }
            }}
          >
            Clear hall of fame
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const text = floorDump({
                xp,
                highScore,
                completedLessons,
                activityDone,
                warmupDay,
                hall,
              });
              try {
                await navigator.clipboard.writeText(text);
              } catch {
                window.prompt("Floor dump", text);
              }
              setCopiedDump(true);
              window.setTimeout(() => setCopiedDump(false), 1800);
            }}
          >
            {copiedDump ? "Dump copied" : "Copy floor dump"}
          </Button>
          <Button asChild variant="secondary">
            <Link to="/score">Open brag board</Link>
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted">
          Floor dump is counts only — no aliases. Hall names stay on this pad.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Changelog</h2>
        <ol className="mt-3 space-y-4">
          {CHANGELOG.map((entry) => (
            <li key={entry.chip} className="rounded-xl border border-line bg-surface p-4">
              <p className="font-mono text-sm text-teal">
                {entry.chip}
                <span className="ml-2 text-muted">{entry.when}</span>
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {entry.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Pacing</h2>
        <ol className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {LESSONS.map((l) => (
            <li key={l.id} className="px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-teal">
                Day {l.number} · {l.duration}
              </p>
              <p className="font-medium">{l.title}</p>
              <p className="text-sm text-muted">{l.iCan}</p>
            </li>
          ))}
          <li className="px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-teal">Days 7–10</p>
            <p className="font-medium">Paper brief, critique, gallery</p>
            <p className="text-sm text-muted">
              Constraints on the wall. Peer frames. Rubric. Optional one-color
              print of finals.
            </p>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">English learners</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
          <li>Content objective and language objective posted together.</li>
          <li>
            Pre-teach 5–7 words with the glossary. Star them. Cognates
            (contrast, palette, symmetry) are labeled.
          </li>
          <li>Oral rehearsal with frames before any written exit ticket.</li>
          <li>Allow a home-language note in the margin; publish in English.</li>
          <li>
            Visuals first: every idea has a mark, a diagram, or a fake logo.
          </li>
          <li>
            Heterogeneous pairs for studio games; the talk is the assessment as
            much as the score.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Materials</h2>
        <p className="mt-2 text-ink-soft">
          Pencils, black markers, two colored markers, tracing paper, 8.5×11
          copies of the brief and critique sheet. Optional: a one-color copier
          for the “does it survive in black?” test.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Standards</h2>
        <ul className="mt-3 space-y-3">
          {STANDARDS.map((s) => (
            <li key={s.id} className="text-sm">
              <span className="font-medium text-teal">{s.id}</span>
              <span className="mt-0.5 block text-ink-soft">{s.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Fair use note</h2>
        <p className="mt-2 text-ink-soft">{UNIT.fairUse}</p>
      </section>
    </div>
  );
}
