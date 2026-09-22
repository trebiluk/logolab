import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, RotateCcw, Trophy } from "lucide-react";
import { MarkBoard } from "@/components/mark-board";
import { SentenceFrames } from "@/components/sentence-frames";
import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AeroLinkMark,
  ArcadyMark,
  BeaconMark,
  BurgerBlastMark,
  COUSIN_MARKS,
  FAKE_LOGOS,
  FoxfireMark,
  IronGymMark,
  LAB_BRANDS,
  MesaMark,
  NiteOwlMark,
  NorthParkMark,
  OakInkMark,
  PactMark,
  PineSoapMark,
  QuillMark,
  RedRailMark,
  SpeedyBoxMark,
  StrideMark,
  SummitMark,
} from "@/content/marks";
import { STUDIO } from "@/content/unit";
import { GLOSSARY } from "@/content/glossary";
import { useProgress } from "@/lib/store";
import { studioMaxXp } from "@/lib/xp";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const TYPE_LABELS = [
  "wordmark",
  "lettermark",
  "pictorial",
  "abstract",
  "combination",
  "emblem",
] as const;

type FrameKind = "notice" | "compare" | "critique" | "color";

const SORT_PICKS = ["foxfire", "quill", "redrail", "stride", "summit", "mesa", "beacon", "aero"] as const;
const SORT_ROUNDS = SORT_PICKS.map((id) => {
  const m = LAB_BRANDS.find((b) => b.id === id)!;
  return { id: m.id, answer: m.kind, name: m.name, Mark: m.Mark, why: m.principle };
});

const SILHOUETTE_ROUNDS = [
  { id: "foxfire", name: "Foxfire Camp", Mark: FoxfireMark, decoys: ["Beacon", "Summit", "Mesa Museum"] },
  { id: "stride", name: "Stride", Mark: StrideMark, decoys: ["Pact", "Red Rail", "Quill"] },
  { id: "redrail", name: "Red Rail", Mark: RedRailMark, decoys: ["Pact", "Beacon", "Mesa Museum"] },
  { id: "beacon", name: "Beacon", Mark: BeaconMark, decoys: ["Foxfire Camp", "Lumen", "Pine Soap"] },
  { id: "summit", name: "Summit", Mark: SummitMark, decoys: ["Stride", "Mesa Museum", "Beacon"] },
  { id: "north", name: "North Park Library", Mark: NorthParkMark, decoys: ["Oak & Ink", "Pine Soap", "Harbor Roast"] },
  { id: "mesa", name: "Mesa Museum", Mark: MesaMark, decoys: ["Red Rail", "Pact", "Beacon"] },
  { id: "quill", name: "Quill", Mark: QuillMark, decoys: ["Harbor Roast", "AeroLink", "Arcady"] },
];

const HIDDEN_ROUNDS = [
  {
    id: "aero",
    prompt: "What is hiding in the empty space of this wordmark?",
    Mark: AeroLinkMark,
    options: ["An arrow", "A bird", "A box", "A smile"],
    answer: "An arrow",
    why: "The gap between E and R is cut like an arrow pointing forward.",
  },
  {
    id: "arcady",
    prompt: "The gold curve is a path. What else is it?",
    Mark: ArcadyMark,
    options: ["A to Y", "A river", "A road", "A banana"],
    answer: "A to Y",
    why: "The arrow starts under A and ends under Y: this studio takes you the whole way.",
  },
  {
    id: "north",
    prompt: "This library mark hides a second object. What is it?",
    Mark: NorthParkMark,
    options: ["A book", "A bird", "A bell", "A boat"],
    answer: "A book",
    why: "The cut-out in the leaf is a book. Nature + reading in one shape.",
  },
  {
    id: "oak",
    prompt: "The letter O is also…",
    Mark: OakInkMark,
    options: ["A leaf", "A moon", "A ring", "A stamp"],
    answer: "A leaf",
    why: "Type becomes picture. The counter of the O is a leaf vein.",
  },
  {
    id: "foxfire",
    prompt: "What is different about one ear of this fox?",
    Mark: FoxfireMark,
    options: ["It is a flame", "It is a tree", "It is a letter A", "It is a wing"],
    answer: "It is a flame",
    why: "Foxfire: the animal and the camp fire share one silhouette. One ear is fire.",
  },
  {
    id: "pact",
    prompt: "What do the two links do?",
    Mark: PactMark,
    options: ["They lock", "They bounce", "They make a third color", "They make a word"],
    answer: "They lock",
    why: "A horizontal link and a vertical link weave. Two things hold — a pact.",
  },
];

const COLOR_ROUNDS = [
  {
    id: "sleep",
    prompt: "A company that sells baby sleep sacks. Which palette fits?",
    options: [
      { id: "a", swatches: ["#d4ff00", "#ff00aa", "#00f"], ok: false, note: "Neon shouts. Sleep should not shout." },
      { id: "b", swatches: ["#d7e4e1", "#1f4f4a", "#f3efe6"], ok: true, note: "Soft, dim, few colors — like a night light." },
      { id: "c", swatches: ["#cc0000", "#ff6600", "#ffd100"], ok: false, note: "Hot colors feel like hunger or alert, not rest." },
    ],
  },
  {
    id: "bank",
    prompt: "A neighborhood credit union wants to feel steady. Pick a palette.",
    options: [
      { id: "a", swatches: ["#1c3a7a", "#f3efe6", "#6b6458"], ok: true, note: "Blue often reads as trust in U.S. banking." },
      { id: "b", swatches: ["#ff00aa", "#111", "#ffd100"], ok: false, note: "This feels like a nightclub flyer." },
      { id: "c", swatches: ["#d4ff00", "#fff", "#f5d76e"], ok: false, note: "Weak contrast. A sign would vanish." },
    ],
  },
  {
    id: "burger",
    prompt: "A burger stand wants people to feel hungry as they drive by.",
    options: [
      { id: "a", swatches: ["#1c3a7a", "#93c5fd"], ok: false, note: "Cool blue is the opposite of appetite for many people." },
      { id: "b", swatches: ["#cc0000", "#d4a017"], ok: true, note: "Red and gold are used by many food marks for a reason." },
      { id: "c", swatches: ["#d7e4e1", "#9a9286"], ok: false, note: "Calm and dusty — more spa than grill." },
    ],
  },
  {
    id: "one",
    prompt: "Which rule is true for almost every strong logo?",
    options: [
      { id: "a", swatches: ["#1c1a16"], ok: true, note: "It should still work in one color." },
      { id: "b", swatches: ["#ef4444", "#f59e0b", "#84cc16", "#06b6d4", "#8b5cf6"], ok: false, note: "A rainbow is a poster, not a mark." },
      { id: "c", swatches: ["#ffe566", "#ffffff"], ok: false, note: "Pale on pale fails contrast." },
    ],
  },
  {
    id: "lib",
    prompt: "North Park Library. Which feels like reading under a tree?",
    options: [
      { id: "a", swatches: ["#1f4f4a", "#1c1a16", "#f3efe6"], ok: true, note: "Ink + leaf green + paper." },
      { id: "b", swatches: ["#ff6600", "#ff0"], ok: false, note: "That is a sale sticker." },
      { id: "c", swatches: ["#00f", "#f0f", "#0ff"], ok: false, note: "Electric, not leafy." },
    ],
  },
  {
    id: "mono",
    prompt: "You may print the school T-shirt in black only. What matters most?",
    options: [
      { id: "a", swatches: ["#1c1a16"], ok: true, note: "The silhouette has to carry the idea." },
      { id: "b", swatches: ["#cc0000", "#0085c7", "#f4c300"], ok: false, note: "Those colors will not be on the shirt." },
      { id: "c", swatches: ["#9a9286", "#d4ccbe"], ok: false, note: "Low contrast even in grayscale." },
    ],
  },
];

const TYPE_ROUNDS = [
  {
    id: "gym",
    prompt: "A serious weightlifting gym. Which wordmark fits?",
    options: [
      { id: "a", label: "IRON", className: "font-display text-4xl italic font-medium", ok: false, note: "Soft and literary. Not a barbell." },
      { id: "b", label: "IRON", className: "font-sans text-4xl font-black tracking-tight", ok: true, note: "Heavy, tight, no extra flourish." },
      { id: "c", label: "Iron", className: "font-sans text-4xl italic text-faint", ok: false, note: "Light italic feels like a perfume." },
    ],
  },
  {
    id: "bakery",
    prompt: "A Saturday bakery. Warm, local, handwritten notes.",
    options: [
      { id: "a", label: "CRUMB", className: "font-sans text-4xl font-black", ok: false, note: "This is a warehouse label." },
      { id: "b", label: "Crumb", className: "font-display text-4xl italic", ok: true, note: "A human, paper-like script-adjacent serif." },
      { id: "c", label: "CRUMB!!!", className: "font-sans text-3xl italic text-bad", ok: false, note: "The extra marks are noise." },
    ],
  },
  {
    id: "tech",
    prompt: "A student coding club. Clear, modern, no gimmicks.",
    options: [
      { id: "a", label: "BYTE", className: "font-sans text-4xl font-semibold tracking-[0.4em]", ok: true, note: "Even, open, a little technical." },
      { id: "b", label: "Byte", className: "font-display text-4xl italic", ok: false, note: "Pretty, but it belongs on a poetry book." },
      { id: "c", label: "bYtE", className: "font-sans text-3xl", ok: false, note: "Random caps look like a password, not a brand." },
    ],
  },
  {
    id: "oneface",
    prompt: "How many typefaces should a simple logo usually use?",
    options: [
      { id: "a", label: "One (maybe two)", className: "font-sans text-2xl font-medium", ok: true, note: "One family. Two only if they clearly split jobs." },
      { id: "b", label: "Four or more", className: "font-sans text-2xl", ok: false, note: "That is a poster collage, not a mark." },
      { id: "c", label: "Whatever looks fun", className: "font-display text-2xl italic", ok: false, note: "Fun is not a criterion. Fit is." },
    ],
  },
  {
    id: "script",
    prompt: "When is a flowing script a good idea?",
    options: [
      { id: "a", label: "Tiny app icons", className: "font-display text-2xl italic", ok: false, note: "Thin scripts fall apart when small." },
      { id: "b", label: "A soda or signature brand", className: "font-display text-2xl italic", ok: true, note: "Coca-Cola works because the script is the personality — and it is tested huge and small." },
      { id: "c", label: "Highway wayfinding", className: "font-display text-2xl italic", ok: false, note: "Drivers need blocky, high-contrast letters." },
    ],
  },
  {
    id: "oak",
    prompt: "Oak & Ink turns a letter into a picture. What is that move called?",
    options: [
      { id: "a", label: "A lettermark doing pictorial work", className: "font-sans text-xl font-medium", ok: true, note: "The O is also a leaf. Type is the icon." },
      { id: "b", label: "Clip art", className: "font-sans text-xl", ok: false, note: "Clip art is a sticker added on. This is one shape." },
      { id: "c", label: "An emblem badge", className: "font-sans text-xl", ok: false, note: "No seal. Just a letter." },
    ],
  },
];

const CLINIC = FAKE_LOGOS.filter((f) => !f.good).slice(0, 6);

const PROBLEM_LABELS: Record<string, string> = {
  "too-many-fonts": "Too many typefaces",
  "too-much-detail": "Too much detail",
  "no-hierarchy": "Nothing is in charge",
  "hard-at-small": "Fails when small",
  "wrong-color": "Color fights the job",
  "low-contrast": "Low contrast",
  "off-brand": "Off-brand feeling",
  effects: "Cheap effects (chrome, bevel)",
  clipart: "Clip art stuck on",
};

function useChoiceKeys(count: number, enabled: boolean, onPick: (index: number) => void) {
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.repeat) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      ) {
        return;
      }
      let n = -1;
      if (e.key >= "1" && e.key <= "9") n = Number(e.key);
      else if (/^Digit[1-9]$/.test(e.code)) n = Number(e.code.slice(5));
      else if (/^Numpad[1-9]$/.test(e.code)) n = Number(e.code.slice(6));
      if (n >= 1 && n <= count) {
        e.preventDefault();
        pickRef.current(n - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, enabled]);
}

function KeyHint({ n }: { n: number }) {
  return (
    <span className="mr-1.5 inline-flex size-5 shrink-0 items-center justify-center rounded-sm border border-line text-xs tabular-nums text-muted">
      {n}
    </span>
  );
}

export function StudioGame({ id }: { id: string }) {
  const meta = STUDIO.find((s) => s.id === id);
  if (!meta) {
    return (
      <div className="py-16 text-center">
        <p>That studio is not open.</p>
        <Button asChild className="mt-4">
          <Link to="/studio">All studios</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-teal">Shop floor</p>
      <h1 className="mt-1 font-display text-4xl font-medium">{meta.title}</h1>
      <p className="mt-2 text-ink-soft">{meta.blurb}</p>
      <p className="mt-1 text-sm text-muted">
        Max {studioMaxXp(meta.rounds)} XP · tap or press 1–9
      </p>
      <div className="mt-8">
        {id === "sort" && <SortGame />}
        {id === "silhouette" && <SilhouetteGame />}
        {id === "scale" && <ScaleGame />}
        {id === "hidden" && <HiddenGame />}
        {id === "color" && <ColorGame />}
        {id === "type" && <TypeGame />}
        {id === "clinic" && <ClinicGame />}
        {id === "cousins" && <CousinGame />}
        {id === "drill" && <DrillGame />}
      </div>
    </div>
  );
}

function useRound<T>(items: T[]) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const recordActivity = useProgress((s) => s.recordActivity);
  const item = items[Math.min(i, items.length - 1)];
  function next(correct: boolean, activityId: string) {
    const s = score + (correct ? 1 : 0);
    setStreak(correct ? streak + 1 : 0);
    if (i + 1 >= items.length) {
      setScore(s);
      setDone(true);
      recordActivity(activityId, s, items.length);
    } else {
      setScore(s);
      setI(i + 1);
      setLocked(false);
    }
  }
  function restart() {
    setI(0);
    setScore(0);
    setStreak(0);
    setLocked(false);
    setDone(false);
  }
  return { i, score, streak, locked, setLocked, done, item, next, restart, total: items.length };
}

function Result({
  score,
  total,
  onRestart,
  frames,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  frames?: FrameKind;
}) {
  const lastGain = useProgress((s) => s.lastGain);
  const highScore = useProgress((s) => s.highScore);
  const gained = lastGain && lastGain.amount > 0;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRestart();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRestart]);
  return (
    <div className="rounded-xl border border-line bg-surface p-6 text-center">
      <p className="text-sm text-muted">You got</p>
      <p className="font-display text-5xl font-medium tabular-nums text-teal">
        {score}
        <span className="text-2xl text-muted">/{total}</span>
      </p>
      {gained ? (
        <p className="mt-3 text-lg font-medium text-teal">+{lastGain.amount} XP</p>
      ) : (
        <p className="mt-3 text-sm text-muted">No new XP — beat your best to earn more.</p>
      )}
      <p className="mt-1 text-sm tabular-nums text-muted">High score {highScore} XP</p>
      <p className="mt-1 text-xs text-muted">Enter or Space to run it again</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={onRestart}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link to="/score">
            <Trophy className="size-4" />
            Brag board
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/studio">Floor</Link>
        </Button>
      </div>
      {frames ? (
        <div className="mt-6 text-left">
          <SentenceFrames kind={frames} />
        </div>
      ) : null}
    </div>
  );
}

function SortGame() {
  const r = useRound(SORT_ROUNDS);
  const item = r.item;
  useChoiceKeys(TYPE_LABELS.length, !r.done && !r.locked, (index) => {
    const lab = TYPE_LABELS[index];
    if (!lab) return;
    r.setLocked(true);
    window.setTimeout(() => r.next(lab === item.answer, "sort"), 700);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="notice" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={TYPE_LABELS.length}>
      <MarkBoard caption={item.name}>
        <item.Mark />
      </MarkBoard>
      <p className="mt-4 text-sm text-muted">Which family does this mark belong to?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {TYPE_LABELS.map((lab, index) => {
          const correct = lab === item.answer;
          const show = r.locked;
          return (
            <button
              key={lab}
              type="button"
              disabled={r.locked}
              onClick={() => {
                r.setLocked(true);
                window.setTimeout(() => r.next(correct, "sort"), 700);
              }}
              className={cn(
                "flex h-12 items-center justify-center rounded-md border capitalize",
                show && correct && "border-good bg-good-soft",
                show && !correct && "opacity-40",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <KeyHint n={index + 1} />
              {lab}
            </button>
          );
        })}
      </div>
      {r.locked ? <p className="mt-3 text-sm text-ink-soft">{item.why}</p> : null}
    </RoundShell>
  );
}

function SilhouetteGame() {
  const r = useRound(SILHOUETTE_ROUNDS);
  const [picked, setPicked] = useState<string | null>(null);
  const item = r.item;
  const choices = useMemo(() => shuffle([item.name, ...item.decoys]), [item]);
  useChoiceKeys(choices.length, !r.done && picked === null, (index) => {
    const c = choices[index];
    if (!c) return;
    setPicked(c);
    window.setTimeout(() => {
      r.next(c === item.name, "silhouette");
      setPicked(null);
    }, 700);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="compare" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={choices.length}>
      <MarkBoard caption="Name the company" ink>
        <item.Mark mono />
      </MarkBoard>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {choices.map((c, index) => {
          const show = picked !== null;
          const correct = c === item.name;
          return (
            <button
              key={c}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(c);
                window.setTimeout(() => {
                  r.next(c === item.name, "silhouette");
                  setPicked(null);
                }, 700);
              }}
              className={cn(
                "flex h-12 items-center justify-center rounded-md border px-2 text-sm",
                show && correct && "border-good bg-good-soft",
                show && picked === c && !correct && "border-bad bg-bad-soft",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <KeyHint n={index + 1} />
              {c}
            </button>
          );
        })}
      </div>
    </RoundShell>
  );
}

const SCALE_ROUNDS = [
  {
    id: "stamp",
    prompt: "Stamp size. Which still looks like a thing?",
    options: [
      { id: "a", Mark: PineSoapMark, ok: true, note: "Two shapes. The tree holds." },
      { id: "b", Mark: SpeedyBoxMark, ok: false, note: "The van and slogan turn to mud." },
    ],
  },
  {
    id: "fox",
    prompt: "Which silhouette would still work as a 16-pixel favicon?",
    options: [
      { id: "a", Mark: BurgerBlastMark, ok: false, note: "Four typefaces and stars become noise." },
      { id: "b", Mark: FoxfireMark, ok: true, note: "A fox-head shield still reads as a fox." },
    ],
  },
  {
    id: "rail",
    prompt: "One-color print on a pencil. Which mark survives?",
    options: [
      { id: "a", Mark: RedRailMark, ok: true, note: "Two letters. Heavy. It is still RR." },
      { id: "b", Mark: IronGymMark, ok: false, note: "Chrome and outlines vanish in one ink." },
    ],
  },
  {
    id: "sleep",
    prompt: "A tiny hang-tag. Which one still has contrast?",
    options: [
      { id: "a", Mark: NiteOwlMark, ok: false, note: "Neon on neon. The letters disappear." },
      { id: "b", Mark: BeaconMark, ok: true, note: "Dark field, light spark. Contrast does the job." },
    ],
  },
  {
    id: "stride",
    prompt: "Far across the gym. Which shape do you still know?",
    options: [
      { id: "a", Mark: StrideMark, ok: true, note: "Three square terminals. Abstract, but bold." },
      { id: "b", Mark: SpeedyBoxMark, ok: false, note: "Detail is a luxury you do not have at distance." },
    ],
  },
  {
    id: "rule",
    prompt: "The QC rule for almost every strong mark:",
    options: [
      { id: "a", Mark: PineSoapMark, ok: true, note: "If it fails at stamp size, it is not finished." },
      { id: "b", Mark: BurgerBlastMark, ok: false, note: "More parts is not more brand." },
    ],
  },
] as const;

function ScaleGame() {
  const r = useRound([...SCALE_ROUNDS]);
  const [picked, setPicked] = useState<string | null>(null);
  const item = r.item;
  useChoiceKeys(item.options.length, !r.done && picked === null, (index) => {
    const o = item.options[index];
    if (!o) return;
    setPicked(o.id);
    window.setTimeout(() => {
      r.next(o.ok, "scale");
      setPicked(null);
    }, 900);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="compare" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={item.options.length}>
      <p className="font-medium">{item.prompt}</p>
      <p className="mt-1 text-sm text-muted">Shown at favicon size. Trust the silhouette.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {item.options.map((o, index) => {
          const show = picked !== null;
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(o.id);
                window.setTimeout(() => {
                  r.next(o.ok, "scale");
                  setPicked(null);
                }, 900);
              }}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border p-4",
                show && o.ok && "border-good bg-good-soft",
                show && picked === o.id && !o.ok && "border-bad bg-bad-soft",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <span className="self-start">
                <KeyHint n={index + 1} />
              </span>
              <span className="flex size-16 items-center justify-center rounded-md bg-paper-2">
                <span className="block size-7 [&_svg]:h-full [&_svg]:w-full">
                  <o.Mark />
                </span>
              </span>
              {show ? <span className="text-sm text-ink-soft">{o.note}</span> : null}
            </button>
          );
        })}
      </div>
    </RoundShell>
  );
}

function HiddenGame() {
  const r = useRound(HIDDEN_ROUNDS);
  const item = r.item;
  useChoiceKeys(item.options.length, !r.done && !r.locked, (index) => {
    const o = item.options[index];
    if (!o) return;
    r.setLocked(true);
    window.setTimeout(() => r.next(o === item.answer, "hidden"), 850);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="notice" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={item.options.length}>
      <MarkBoard>
        <item.Mark />
      </MarkBoard>
      <p className="mt-4 font-medium">{item.prompt}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {item.options.map((o, index) => {
          const correct = o === item.answer;
          const show = r.locked;
          return (
            <button
              key={o}
              type="button"
              disabled={r.locked}
              onClick={() => {
                r.setLocked(true);
                window.setTimeout(() => r.next(correct, "hidden"), 850);
              }}
              className={cn(
                "flex h-12 items-center justify-center rounded-md border px-2 text-sm",
                show && correct && "border-good bg-good-soft",
                show && !correct && "opacity-40",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <KeyHint n={index + 1} />
              {o}
            </button>
          );
        })}
      </div>
      {r.locked ? <p className="mt-3 text-sm text-ink-soft">{item.why}</p> : null}
    </RoundShell>
  );
}

function ColorGame() {
  const r = useRound(COLOR_ROUNDS);
  const [picked, setPicked] = useState<string | null>(null);
  const item = r.item;
  useChoiceKeys(item.options.length, !r.done && picked === null, (index) => {
    const o = item.options[index];
    if (!o) return;
    setPicked(o.id);
    window.setTimeout(() => {
      r.next(o.ok, "color");
      setPicked(null);
    }, 900);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="color" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={item.options.length}>
      <p className="font-medium">{item.prompt}</p>
      <div className="mt-4 space-y-3">
        {item.options.map((o, index) => {
          const show = picked !== null;
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(o.id);
                window.setTimeout(() => {
                  r.next(o.ok, "color");
                  setPicked(null);
                }, 900);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left",
                show && o.ok && "border-good bg-good-soft",
                show && picked === o.id && !o.ok && "border-bad bg-bad-soft",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <KeyHint n={index + 1} />
              <span className="flex gap-1">
                {o.swatches.map((c) => (
                  <span
                    key={c}
                    className="size-8 rounded-md border border-line"
                    style={{ background: c }}
                  />
                ))}
              </span>
              {show ? <span className="text-sm text-ink-soft">{o.note}</span> : null}
            </button>
          );
        })}
      </div>
    </RoundShell>
  );
}

function TypeGame() {
  const r = useRound(TYPE_ROUNDS);
  const [picked, setPicked] = useState<string | null>(null);
  const item = r.item;
  useChoiceKeys(item.options.length, !r.done && picked === null, (index) => {
    const o = item.options[index];
    if (!o) return;
    setPicked(o.id);
    window.setTimeout(() => {
      r.next(o.ok, "type");
      setPicked(null);
    }, 850);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="compare" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={item.options.length}>
      <p className="font-medium">{item.prompt}</p>
      <div className="mt-4 space-y-3">
        {item.options.map((o, index) => {
          const show = picked !== null;
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(o.id);
                window.setTimeout(() => {
                  r.next(o.ok, "type");
                  setPicked(null);
                }, 850);
              }}
              className={cn(
                "w-full rounded-xl border px-4 py-5 text-center",
                show && o.ok && "border-good bg-good-soft",
                show && picked === o.id && !o.ok && "border-bad bg-bad-soft",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <span className="mb-2 flex justify-center">
                <KeyHint n={index + 1} />
              </span>
              <span className={o.className}>{o.label}</span>
              {show ? <span className="mt-2 block text-sm text-ink-soft">{o.note}</span> : null}
            </button>
          );
        })}
      </div>
    </RoundShell>
  );
}

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function DrillGame() {
  const [rounds, setRounds] = useState<
    { id: string; prompt: string; answer: string; options: string[]; example: string }[] | null
  >(null);
  useEffect(() => {
    const terms = shuffle(GLOSSARY).slice(0, 8);
    setRounds(
      terms.map((t) => {
        const decoys = shuffle(GLOSSARY.filter((x) => x.id !== t.id))
          .slice(0, 3)
          .map((x) => x.term);
        return {
          id: t.id,
          prompt: t.simple,
          answer: t.term,
          options: shuffle([t.term, ...decoys]),
          example: t.example,
        };
      }),
    );
  }, []);
  if (!rounds) {
    return <div className="h-48 animate-pulse rounded-xl bg-surface-2" />;
  }
  return <DrillPlay rounds={rounds} />;
}

function DrillPlay({
  rounds,
}: {
  rounds: { id: string; prompt: string; answer: string; options: string[]; example: string }[];
}) {
  const r = useRound(rounds);
  const item = r.item;
  useChoiceKeys(item.options.length, !r.done && !r.locked, (index) => {
    const o = item.options[index];
    if (!o) return;
    r.setLocked(true);
    window.setTimeout(() => r.next(o === item.answer, "drill"), 750);
  });
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="notice" />;
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={item.options.length}>
      <div className="flex items-start gap-2">
        <p className="font-medium">{item.prompt}</p>
        <SpeakButton text={item.prompt} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {item.options.map((o, index) => {
          const correct = o === item.answer;
          const show = r.locked;
          return (
            <button
              key={o}
              type="button"
              disabled={r.locked}
              onClick={() => {
                r.setLocked(true);
                window.setTimeout(() => r.next(correct, "drill"), 750);
              }}
              className={cn(
                "flex min-h-12 items-center justify-center rounded-md border px-2 text-sm capitalize",
                show && correct && "border-good bg-good-soft",
                show && !correct && "opacity-40",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <KeyHint n={index + 1} />
              {o}
            </button>
          );
        })}
      </div>
      {r.locked ? <p className="mt-3 text-sm text-ink-soft">{item.example}</p> : null}
    </RoundShell>
  );
}

function ClinicGame() {
  const r = useRound(CLINIC);
  const [picked, setPicked] = useState<string[]>([]);
  const item = r.item;
  function submit() {
    if (r.locked || picked.length === 0) return;
    const need = new Set(item.problems);
    const hits = picked.filter((p) => need.has(p)).length;
    const extras = picked.filter((p) => !need.has(p)).length;
    const correct = hits >= Math.max(1, need.size - 1) && extras <= 1;
    r.setLocked(true);
    window.setTimeout(() => {
      r.next(correct, "clinic");
      setPicked([]);
    }, 1100);
  }
  useEffect(() => {
    if (r.done) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r.done, r.locked, picked, item]);
  if (r.done) return <Result score={r.score} total={r.total} onRestart={r.restart} frames="critique" />;
  const allProblems = Object.keys(PROBLEM_LABELS);
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak}>
      <MarkBoard caption={item.name}>
        <item.Mark />
      </MarkBoard>
      <p className="mt-4 text-sm text-muted">Tap every problem. Then submit (or press Enter).</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {allProblems.map((p) => {
          const on = picked.includes(p);
          const reveal = r.locked;
          const should = item.problems.includes(p);
          return (
            <button
              key={p}
              type="button"
              disabled={r.locked}
              onClick={() =>
                setPicked((prev) =>
                  prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
                )
              }
              className={cn(
                "min-h-12 rounded-md border px-2 py-2 text-left text-sm",
                reveal && should && "border-good bg-good-soft",
                reveal && on && !should && "border-bad bg-bad-soft",
                !reveal && on && "border-teal bg-teal-soft",
                !reveal && !on && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              {PROBLEM_LABELS[p]}
            </button>
          );
        })}
      </div>
      <Button className="mt-4 w-full" onClick={submit} disabled={r.locked || picked.length === 0}>
        Submit diagnosis
      </Button>
      {r.locked ? (
        <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">
          {item.diagnosis}
        </p>
      ) : null}
    </RoundShell>
  );
}

function CousinGame() {
  const r = useRound(COUSIN_MARKS);
  const [picked, setPicked] = useState<string | null>(null);
  const spanish = useProgress((s) => s.spanish);
  const item = r.item;
  useChoiceKeys(item.options.length, !r.done && picked === null, (index) => {
    const c = item.options[index];
    if (!c) return;
    setPicked(c);
    window.setTimeout(() => {
      r.next(c === item.answer, "cousins");
      setPicked(null);
    }, 1100);
  });
  if (r.done) {
    return <Result score={r.score} total={r.total} onRestart={r.restart} frames="critique" />;
  }
  return (
    <RoundShell i={r.i} total={r.total} score={r.score} streak={r.streak} keys={item.options.length}>
      <p className="mb-3 text-sm text-muted">
        {spanish
          ? "Marca de broma. Nombra la marca famosa de memoria. No la dibujamos."
          : "Joke mark. Name the famous brand from memory. We never draw it."}
      </p>
      <MarkBoard caption={item.name}>
        <item.Mark />
      </MarkBoard>
      <p className="mt-4 font-medium">Which famous mark is this teasing?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {item.options.map((c, index) => {
          const show = picked !== null;
          const correct = c === item.answer;
          return (
            <button
              key={c}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(c);
                window.setTimeout(() => {
                  r.next(c === item.answer, "cousins");
                  setPicked(null);
                }, 1100);
              }}
              className={cn(
                "flex min-h-12 items-center justify-center rounded-md border px-2 text-sm",
                show && correct && "border-good bg-good-soft",
                show && picked === c && !correct && "border-bad bg-bad-soft",
                !show && "border-line bg-surface hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <KeyHint n={index + 1} />
              {c}
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">
          <p className="font-medium text-ink">{item.tease}</p>
          <p className="mt-1">{item.why}</p>
        </div>
      ) : null}
    </RoundShell>
  );
}

function RoundShell({
  i,
  total,
  score,
  streak,
  keys,
  children,
}: {
  i: number;
  total: number;
  score: number;
  streak: number;
  keys?: number;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span className="tabular-nums">
          {i + 1} / {total}
        </span>
        <span className="inline-flex items-center gap-3">
          {streak >= 2 ? (
            <span className="font-medium tabular-nums text-teal">Streak {streak}</span>
          ) : null}
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Check className="size-3.5 text-good" />
            {score}
          </span>
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-paper-2">
        <div
          className="h-full bg-teal transition-[width] duration-300"
          style={{ width: `${((i + 1) / total) * 100}%` }}
        />
      </div>
      {keys ? (
        <p className="mt-3 text-xs text-muted">Keyboard: 1–{keys}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function StudioIndex() {
  const done = useProgress((s) => s.activityDone);
  const best = useProgress((s) => s.activityBest);
  const spanish = useProgress((s) => s.spanish);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-medium">Shop floor</h1>
      <p className="mt-2 text-ink-soft">
        Short looking games. Touch, click, or keys 1–9. Press ? for the key card.
        Scores and XP stay on this device — brag, not a grade.
      </p>
      <Link
        to="/bench"
        className="mt-4 flex h-11 items-center rounded-md border border-line bg-surface px-3 text-sm text-ink no-underline"
      >
        Mark bench — stamp text and shapes, save SVG or PNG here
      </Link>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {STUDIO.map((s) => (
          <li key={s.id}>
            <Link
              to="/studio/$id"
              params={{ id: s.id }}
              className="block h-full rounded-xl border border-line bg-surface p-5 no-underline shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] focus-visible:shadow-[var(--shadow-border-hover)]"
            >
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-medium">{s.title}</h2>
                {done.includes(s.id) ? <Badge variant="good">Played</Badge> : null}
              </div>
              {spanish ? <p className="text-sm text-muted">{s.titleEs}</p> : null}
              <p className="mt-2 text-sm text-ink-soft">{s.blurb}</p>
              <p className="mt-3 text-xs tabular-nums text-teal">
                {best[s.id] != null ? `Best ${best[s.id]}% · ` : null}
                max {studioMaxXp(s.rounds)} XP
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
