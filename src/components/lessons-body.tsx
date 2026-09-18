import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { DoNow, ExitTicket, LessonLayout } from "@/components/lesson-layout";
import { MarkBoard, MonoToggle } from "@/components/mark-board";
import { SentenceFrames } from "@/components/sentence-frames";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AeroLinkMark,
  ArcadyMark,
  BeaconMark,
  FAKE_LOGOS,
  FoxfireMark,
  HarborRoastMark,
  LAB_BRANDS,
  LumenMark,
  MesaMark,
  NorthParkMark,
  OakInkMark,
  PactMark,
  PineSoapMark,
  QuillMark,
  RedRailMark,
  SpeedyBoxMark,
  StarTutorsMark,
  StrideMark,
  SummitMark,
  TriadMark,
} from "@/content/marks";
import { LESSONS } from "@/content/unit";
import { cn } from "@/lib/utils";

export function LessonBody({ id }: { id: string }) {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) return null;
  const view = VIEWS[id];
  if (!view) return null;
  return (
    <LessonLayout lesson={lesson} intro={view.intro}>
      {view.body}
    </LessonLayout>
  );
}

const VIEWS: Record<string, { intro: string; body: ReactNode }> = {
  promise: {
    intro:
      "A logo is a small picture or word that stands for a company, team, or idea. It is not the whole brand — it is the handshake.",
    body: <LessonPromise />,
  },
  simple: {
    intro:
      "If a mark only works as a giant poster, it is not finished. The logos you still know after fifty years are almost always simple.",
    body: <LessonSimple />,
  },
  space: {
    intro:
      "Empty space is not wasted space. Designers use the air around a shape to hide a second meaning.",
    body: <LessonSpace />,
  },
  color: {
    intro:
      "Color is a feeling with a job. One or two colors, used on purpose, beat a rainbow every time.",
    body: <LessonColor />,
  },
  type: {
    intro:
      "Letters can be the picture. A word drawn in a special way can be as famous as a fox crest or a roundel of initials.",
    body: <LessonType />,
  },
  critique: {
    intro:
      "A critique talks about the work, not the person. We use design words so we can be honest and kind at the same time.",
    body: <LessonCritique />,
  },
};

function LessonPromise() {
  const types = [
    { id: "wordmark", name: "Wordmark", ex: "The name is the picture.", Mark: QuillMark },
    { id: "lettermark", name: "Lettermark", ex: "Initials become the mark.", Mark: RedRailMark },
    { id: "pictorial", name: "Pictorial", ex: "A real thing, simplified.", Mark: FoxfireMark },
    { id: "abstract", name: "Abstract", ex: "A shape you learn to know.", Mark: StrideMark },
    { id: "combination", name: "Combination", ex: "Symbol plus name.", Mark: SummitMark },
    { id: "emblem", name: "Emblem", ex: "Name locked in a badge.", Mark: MesaMark },
  ];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <DoNow>
        <p>
          Without looking at a phone, sketch three logos you can remember. Then
          star the one that was easiest. What made it easy?
        </p>
      </DoNow>

      <section>
        <h2 className="font-display text-2xl font-medium">What a logo is — and is not</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-good-soft p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-good">A logo is</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>A sign of who made something</li>
              <li>Built to be recognized in a glance</li>
              <li>One piece of a brand</li>
            </ul>
          </div>
          <div className="rounded-lg bg-bad-soft p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-bad">A logo is not</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              <li>The whole company personality</li>
              <li>A poster with a slogan, stars, and clip art</li>
              <li>Something that only works in ten colors</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Six families</h2>
        <p className="mt-2 text-ink-soft">
          Almost every logo you know sits in one of these six types. Tap a card.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {types.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setOpen(open === t.id ? null : t.id)}
              className="rounded-xl border border-line bg-surface p-3 text-left"
            >
              <div className="flex h-32 items-center justify-center sm:h-40">
                <div className="flex h-[90%] w-[90%] items-center justify-center [&_svg]:h-full [&_svg]:w-full">
                  <t.Mark />
                </div>
              </div>
              <p className="mt-2 font-medium">{t.name}</p>
              {open === t.id ? (
                <p className="mt-1 text-sm text-muted">{t.ex}</p>
              ) : (
                <p className="mt-1 text-sm text-faint">Tap to reveal</p>
              )}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium">Study wall</h2>
        <p className="mt-2 text-ink-soft">
          These are original marks invented for this class — some strong, some
          (later) broken on purpose. We do not paste real trademarks here.
          You already know those. Sketch them from memory in the Do Now.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {LAB_BRANDS.slice(0, 6).map((m) => (
            <MarkBoard key={m.id} caption={m.name} kind={m.kind}>
              <m.Mark />
            </MarkBoard>
          ))}
        </div>
      </section>

      <SentenceFrames kind="notice" />
      <p className="text-sm text-ink-soft">
        Ready to sort? The{" "}
        <Link to="/studio/$id" params={{ id: "sort" }} className="text-teal">
          type sorter
        </Link>{" "}
        checks this lesson. A paper copy is on the{" "}
        <Link to="/printables/$id" params={{ id: "logo-types" }} className="text-teal">
          six types sheet
        </Link>
        .
      </p>
      <ExitTicket prompt="Name one logo and say which of the six types it is. Use: This mark is a ______ because ______." />
    </>
  );
}

function LessonSimple() {
  const [size, setSize] = useState(100);
  return (
    <>
      <DoNow>
        <p>
          Look at a classmate from across the room. Which logos on their clothes
          can you still name? Those marks passed the distance test.
        </p>
      </DoNow>
      <section>
        <h2 className="font-display text-2xl font-medium">Three reasons simple wins</h2>
        <ol className="mt-4 space-y-3">
          {[
            ["Scale", "It must work on a billboard and on a phone icon."],
            ["Speed", "People see a mark for a second in traffic or a feed."],
            ["Memory", "Fewer parts are easier to draw from memory — and to trust."],
          ].map(([t, b], i) => (
            <li key={t} className="flex gap-3">
              <span className="font-display text-2xl text-teal tabular-nums">
                {i + 1}
              </span>
              <span>
                <span className="font-medium">{t}. </span>
                <span className="text-ink-soft">{b}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="font-display text-2xl font-medium">Shrink test</h2>
        <p className="mt-2 text-ink-soft">
          Drag the slider. Watch a cluttered fake logo fall apart while a simple
          invented one holds.
        </p>
        <label className="mt-4 block text-sm">
          Size{" "}
          <span className="tabular-nums text-muted">{size}%</span>
          <input
            type="range"
            min={12}
            max={100}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2 w-full accent-teal"
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-bad">Busy</p>
            <div className="flex h-40 items-center justify-center rounded-lg bg-surface-2">
              <div style={{ width: `${size}%` }}>
                <SpeedyBoxMark />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-good">Simple</p>
            <div className="flex h-40 items-center justify-center rounded-lg bg-surface-2">
              <div style={{ width: `${size}%` }}>
                <PineSoapMark />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-medium">Silhouette test</h2>
        <p className="mt-2 text-ink-soft">
          Fill a mark with one color. If you still know it, the shape is doing
          the work — not the decoration.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { Mark: FoxfireMark, n: "Foxfire" },
            { Mark: StrideMark, n: "Stride" },
            { Mark: BeaconMark, n: "Beacon" },
            { Mark: RedRailMark, n: "Red Rail" },
          ].map((m) => (
            <MarkBoard key={m.n} caption={m.n} ink>
              <m.Mark mono />
            </MarkBoard>
          ))}
        </div>
      </section>
      <ClearSpaceDiagram />
      <SentenceFrames kind="compare" />
      <p className="text-sm text-ink-soft">
        Practice:{" "}
        <Link to="/studio/$id" params={{ id: "silhouette" }} className="text-teal">
          silhouette quiz
        </Link>
        . Paper:{" "}
        <Link to="/printables/$id" params={{ id: "simplify" }} className="text-teal">
          simplify this mark
        </Link>
        .
      </p>
      <ExitTicket prompt="Why did the busy van fail when it got small? Use because and so." />
    </>
  );
}

function ClearSpaceDiagram() {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium">Clear space</h2>
      <p className="mt-2 text-ink-soft">
        Logos need a quiet margin so type, photos, and buttons do not crowd them.
        Designers call this clear space.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="relative mx-auto max-w-[240px]">
          <div className="border border-dashed border-teal p-7">
            <PineSoapMark />
          </div>
          <span className="pointer-events-none absolute -left-px -top-px size-2 border-l-2 border-t-2 border-teal" />
          <span className="pointer-events-none absolute -right-px -top-px size-2 border-r-2 border-t-2 border-teal" />
          <span className="pointer-events-none absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-teal" />
          <span className="pointer-events-none absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-teal" />
          <p className="mt-2 text-center text-xs font-medium uppercase tracking-wider text-teal">
            Keep this margin empty
          </p>
        </div>
      </div>
    </section>
  );
}

function LessonSpace() {
  return (
    <>
      <DoNow>
        <p>
          Look at the AeroLink wordmark below. Do not read the word. Look at
          the empty gap between the E and the R. What do you see?
        </p>
      </DoNow>
      <RevealPair
        title="The arrow you were not told to see"
        hint="An arrow in the gap between E and R. It points forward — like a flight."
      >
        <AeroLinkMark />
        <AeroLinkMark showSecret />
      </RevealPair>
      <RevealPair
        title="A path that is also A to Y"
        hint="The gold curve is a path. It starts at A and ends at Y: this studio takes you the whole way."
      >
        <ArcadyMark />
        <ArcadyMark showSecret />
      </RevealPair>
      <section>
        <h2 className="font-display text-2xl font-medium">Figure and ground</h2>
        <p className="mt-2 text-ink-soft">
          Positive space is the ink. Negative space is the paper. A leaf with a
          book cut out of it lets the paper become a second picture. Your brain
          finishes the idea — that is gestalt.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <MarkBoard caption="Book inside a leaf" kind="figure-ground">
            <NorthParkMark />
          </MarkBoard>
          <MarkBoard caption="Three rings lock" kind="gestalt">
            <TriadMark />
          </MarkBoard>
          <MarkBoard caption="Lantern, one object" kind="pictorial">
            <LumenMark />
          </MarkBoard>
        </div>
      </section>
      <PosNegDiagram />
      <SentenceFrames kind="notice" />
      <p className="text-sm text-ink-soft">
        Hunt more secrets in the{" "}
        <Link to="/studio/$id" params={{ id: "hidden" }} className="text-teal">
          hidden-space studio
        </Link>
        .
      </p>
      <ExitTicket prompt="Name the hidden shape in one mark. Start with: I notice ______." />
    </>
  );
}

function RevealPair({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: [ReactNode, ReactNode] | ReactNode;
}) {
  const [on, setOn] = useState(false);
  const arr = Array.isArray(children) ? children : [children, children];
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl font-medium">{title}</h2>
        <Button variant="outline" size="sm" onClick={() => setOn(!on)}>
          {on ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {on ? "Hide" : "Show the secret"}
        </Button>
      </div>
      <MarkBoard>
        <div className="h-full">{on ? arr[1] : arr[0]}</div>
      </MarkBoard>
      {on ? <p className="mt-2 text-sm text-teal">{hint}</p> : null}
    </section>
  );
}

function PosNegDiagram() {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium">A diagram of space</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-ink p-6 text-paper">
          <svg viewBox="0 0 120 120" className="mx-auto h-24 w-24" aria-hidden>
            <circle cx="60" cy="60" r="40" fill="currentColor" />
          </svg>
          <p className="mt-3 text-sm">Positive space — the ink, the thing you drew.</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <svg viewBox="0 0 120 120" className="mx-auto h-24 w-24 text-ink" aria-hidden>
            <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="16" />
            <path fill="currentColor" d="M40 60l24-14v10h18v8H64v10z" />
          </svg>
          <p className="mt-3 text-sm text-ink-soft">
            Negative space — the hole that can become a second picture.
          </p>
        </div>
      </div>
    </section>
  );
}

function LessonColor() {
  const rows = [
    { color: "#cc0000", name: "Red", feel: "energy, hunger, alert", note: "Also luck in some East Asian cultures; danger in others." },
    { color: "#1f4f4a", name: "Teal / green", feel: "growth, calm, nature", note: "Money in the U.S.; paradise or Islam in other places." },
    { color: "#1c3a7a", name: "Blue", feel: "trust, sky, cool", note: "Common for banks and tech because it feels steady." },
    { color: "#1c1a16", name: "Black", feel: "power, night, elegance", note: "Luxury when paired with a lot of empty space." },
    { color: "#d4a017", name: "Gold / yellow", feel: "sun, joy, value", note: "Hard to read on white. Use as a big field, not tiny type." },
  ];
  return (
    <>
      <DoNow>
        <p>
          If a sleep company used neon lime, how would you feel? Write one
          feeling word. We will check it against a fake logo later.
        </p>
      </DoNow>
      <section>
        <h2 className="font-display text-2xl font-medium">Colors are not universal</h2>
        <p className="mt-2 text-ink-soft">
          Designers pick colors for a job, then test them. Meanings shift by
          culture — that is why we say “often feels like,” never “always means.”
        </p>
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {rows.map((r) => (
            <li key={r.name} className="flex items-start gap-3 px-4 py-3">
              <span
                className="mt-0.5 size-8 shrink-0 rounded-md border border-line"
                style={{ background: r.color }}
                aria-hidden
              />
              <span>
                <span className="font-medium">{r.name}</span>
                <span className="text-ink-soft"> — {r.feel}</span>
                <span className="mt-0.5 block text-sm text-muted">{r.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-2xl font-medium">Palettes, reduced</h2>
        <MonoToggle>
          {(mono) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MarkBoard caption="Beacon · one teal" ink={mono}>
                <BeaconMark mono={mono} />
              </MarkBoard>
              <MarkBoard caption="Red Rail · one red" ink={mono}>
                <RedRailMark mono={mono} />
              </MarkBoard>
              <MarkBoard caption="Pact · two links lock" ink={mono}>
                <PactMark mono={mono} />
              </MarkBoard>
              <MarkBoard caption="Foxfire · rust" ink={mono}>
                <FoxfireMark mono={mono} />
              </MarkBoard>
            </div>
          )}
        </MonoToggle>
        <p className="mt-3 text-sm text-ink-soft">
          Toggle <span className="font-medium">One color</span>. If the mark
          dies, it was leaning on decoration instead of shape.
        </p>
      </section>
      <SentenceFrames kind="color" />
      <p className="text-sm text-ink-soft">
        Try the{" "}
        <Link to="/studio/$id" params={{ id: "color" }} className="text-teal">
          color lab
        </Link>{" "}
        and the{" "}
        <Link to="/printables/$id" params={{ id: "color-chart" }} className="text-teal">
          paper chart
        </Link>
        .
      </p>
      <ExitTicket prompt="Pick two colors for a library. Say: This palette fits a library because ______." />
    </>
  );
}

function LessonType() {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <>
      <DoNow>
        <p>
          Write your first name three ways: all caps blocky, flowing script, and
          light wide letters. Which one feels most like you?
        </p>
      </DoNow>
      <section>
        <h2 className="font-display text-2xl font-medium">Wordmark vs lettermark</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MarkBoard caption="Quill · wordmark" kind="wordmark">
            <QuillMark />
          </MarkBoard>
          <MarkBoard caption="Red Rail · lettermark" kind="lettermark">
            <RedRailMark />
          </MarkBoard>
        </div>
        <p className="mt-3 text-ink-soft">
          A <span className="font-medium">wordmark</span> is the whole name,
          drawn as a picture. A <span className="font-medium">lettermark</span>{" "}
          uses initials. Both live or die on the typeface.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl font-medium">Which type fits?</h2>
        <p className="mt-2 text-ink-soft">
          A harbor coffee roaster wants to feel quiet and early-morning. Tap the
          type that fits.
        </p>
        <div className="mt-4 grid gap-3">
          {[
            { id: "a", ok: false, label: "ZIPPY", className: "font-sans text-3xl font-black italic text-bad" },
            { id: "b", ok: true, label: "HARBOR", className: "font-display text-3xl tracking-[0.35em]" },
            { id: "c", ok: false, label: "harbor", className: "font-sans text-3xl italic text-faint" },
          ].map((o) => {
            const shown = pick === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setPick(o.id)}
                className={cn(
                  "rounded-xl border bg-surface px-4 py-5 text-center",
                  shown && o.ok && "border-good",
                  shown && !o.ok && "border-bad",
                  !shown && "border-line",
                )}
              >
                <span className={o.className}>{o.label}</span>
                {shown ? (
                  <span className="mt-2 block text-sm text-muted">
                    {o.ok
                      ? "Yes. Wide, calm letters leave room to breathe — like a harbor at dawn."
                      : "This type shouts. Coffee at dawn does not shout."}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-medium">When type fights itself</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MarkBoard caption="Star Tutors — three fonts, no captain" kind="broken">
            <StarTutorsMark />
          </MarkBoard>
          <MarkBoard caption="Oak & Ink — the letter is the picture" kind="held">
            <OakInkMark />
          </MarkBoard>
        </div>
      </section>
      <SentenceFrames kind="compare" />
      <p className="text-sm text-ink-soft">
        More rounds in{" "}
        <Link to="/studio/$id" params={{ id: "type" }} className="text-teal">
          Type fit
        </Link>
        .
      </p>
      <ExitTicket prompt="Would a heavy all-caps face fit a baby sleep brand? Why or why not?" />
    </>
  );
}

function LessonCritique() {
  const [picked, setPicked] = useState<string[]>([]);
  const fake = FAKE_LOGOS[0];
  const options = [
    { id: "too-many-fonts", label: "Too many typefaces" },
    { id: "too-much-detail", label: "Too much stuff" },
    { id: "wrong-color", label: "Color fights the job" },
    { id: "no-hierarchy", label: "Nothing is in charge" },
  ];
  const good = new Set(fake.problems);
  const submitted = picked.length > 0 && picked.every((p) => options.some((o) => o.id === p));
  const show = picked.length >= 1;

  return (
    <>
      <DoNow>
        <p>
          Finish this sentence about a logo you like: “This works because
          ______.” Stay with the design, not “it’s cool.”
        </p>
      </DoNow>
      <section>
        <h2 className="font-display text-2xl font-medium">Rules of the room</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-soft">
          <li>Talk about the mark, never the person who made it.</li>
          <li>Start with what is working.</li>
          <li>Use design words: type, contrast, scale, space, color, hierarchy.</li>
          <li>Offer a next step, not just a complaint.</li>
        </ol>
      </section>
      <SentenceFrames kind="critique" />
      <section>
        <h2 className="font-display text-2xl font-medium">Warm-up clinic</h2>
        <p className="mt-2 text-ink-soft">
          This invented mark is broken on purpose. Tap every problem you see.
        </p>
        <div className="mx-auto mt-4 max-w-md">
          <MarkBoard caption={fake.name}>
            <fake.Mark />
          </MarkBoard>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {options.map((o) => {
            const on = picked.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() =>
                  setPicked((p) =>
                    p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id],
                  )
                }
                className={cn(
                  "h-12 rounded-md border px-3 text-left text-sm",
                  on ? "border-teal bg-teal-soft" : "border-line bg-surface",
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {show ? (
          <p className="mt-4 rounded-lg bg-surface-2 p-4 text-sm text-ink-soft">
            {fake.diagnosis}{" "}
            {submitted && picked.filter((id) => good.has(id)).length >= 2 ? (
              <Badge variant="good" className="ml-2">
                Strong eye
              </Badge>
            ) : null}
          </p>
        ) : null}
      </section>
      <section>
        <h2 className="font-display text-2xl font-medium">Good invented marks</h2>
        <p className="mt-2 text-ink-soft">
          These were made for class, not copied. They follow the rules you just
          used.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MarkBoard caption="Pine Soap">
            <PineSoapMark />
          </MarkBoard>
          <MarkBoard caption="Harbor Roast">
            <HarborRoastMark />
          </MarkBoard>
          <MarkBoard caption="Oak & Ink">
            <OakInkMark />
          </MarkBoard>
        </div>
      </section>
      <section className="rounded-xl bg-teal px-5 py-6 text-paper">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-soft">
          Performance task — on paper
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium">
          You will not make a logo in this website.
        </h2>
        <p className="mt-2 text-paper/80">
          Print the design brief. Invent a small local business. Draw a mark with
          two colors, one typeface, and a shape that still works in black. Then
          use the critique sheet with a partner.
        </p>
        <Button asChild variant="secondary" className="mt-4">
          <Link to="/printables/$id" params={{ id: "design-brief" }}>
            Open the paper brief
          </Link>
        </Button>
      </section>
      <p className="text-sm text-ink-soft">
        More broken marks:{" "}
        <Link to="/studio/$id" params={{ id: "clinic" }} className="text-teal">
          fake-logo clinic
        </Link>
        .
      </p>
      <ExitTicket prompt="Write one kind, specific critique of Burger Blast using a sentence frame." />
    </>
  );
}

export function LessonNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-3xl">That lesson is not in this unit.</h1>
      <Button asChild className="mt-6">
        <Link to="/lessons">Back to lessons</Link>
      </Button>
    </div>
  );
}
