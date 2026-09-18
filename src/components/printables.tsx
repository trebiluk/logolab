import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GLOSSARY } from "@/content/glossary";
import {
  AeroLinkMark,
  ArcadyMark,
  BurgerBlastMark,
  LAB_BRANDS,
  NorthParkMark,
  SpeedyBoxMark,
} from "@/content/marks";
import { PRINTABLES, LESSONS, STUDIO, UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { PINS, pinIdsEarned, rankFor } from "@/lib/xp";

export function PrintableIndex() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-medium">Paper copies</h1>
      <p className="mt-2 text-ink-soft">
        The looking happens here. The making happens on paper. Print, or save as
        PDF from the browser print dialog.
      </p>
      <ul className="mt-8 space-y-3">
        {PRINTABLES.map((p) => (
          <li key={p.id}>
            <Link
              to="/printables/$id"
              params={{ id: p.id }}
              className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4 no-underline hover:shadow-[var(--shadow-border-hover)] focus-visible:shadow-[var(--shadow-border-hover)]"
            >
              <span>
                <span className="text-xs uppercase tracking-wider text-muted">
                  {p.audience} · {p.pages} page
                </span>
                <span className="mt-1 block font-display text-xl font-medium">
                  {p.title}
                </span>
                <span className="mt-1 block text-sm text-ink-soft">{p.blurb}</span>
              </span>
              <Printer className="mt-1 size-4 shrink-0 text-teal" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrintablePage({ id }: { id: string }) {
  const meta = PRINTABLES.find((p) => p.id === id);
  if (!meta) {
    return (
      <div className="py-16 text-center">
        <p>No sheet with that name.</p>
        <Button asChild className="mt-4">
          <Link to="/printables">All sheets</Link>
        </Button>
      </div>
    );
  }
  const Body = BODIES[id];
  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap gap-2">
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          Print / Save PDF
        </Button>
        <Button asChild variant="secondary">
          <Link to="/printables">All sheets</Link>
        </Button>
      </div>
      <article className="mx-auto max-w-[8.5in] rounded-xl bg-surface p-6 shadow-[var(--shadow-border)] print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        <header className="mb-5 border-b border-ink pb-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
            BertyBot's LogoLab · Grades 6–8 · {meta.audience}
          </p>
          <h1 className="font-display text-3xl font-medium">{meta.title}</h1>
          {id === "certificate" ? null : (
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <p>Name ______________________________</p>
              <p>Date ______________</p>
            </div>
          )}
        </header>
        {Body ? <Body /> : <p>Sheet coming in this unit pack.</p>}
        <footer className="mt-8 border-t border-line pt-3 text-[11px] text-muted">
          Study marks are invented for class. They are not official logos.
        </footer>
      </article>
    </div>
  );
}

const BODIES: Record<string, () => ReactNode> = {
  "vocab-cards": VocabCards,
  "logo-types": LogoTypes,
  analyze: Analyze,
  simplify: Simplify,
  "hidden-hunt": HiddenHunt,
  "color-chart": ColorChart,
  "letter-as-logo": LetterAsLogo,
  "design-brief": DesignBrief,
  "critique-sheet": CritiqueSheet,
  "teacher-pacing": TeacherPacing,
  certificate: Certificate,
};

function Line({ n = 1 }: { n?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="border-b border-line-strong pt-4" />
      ))}
    </div>
  );
}

function VocabCards() {
  return (
    <div>
      <p className="mb-4 text-sm">
        Cut on the lines. English on the front. Fold or flip for Spanish + the
        simple meaning.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {GLOSSARY.map((t) => (
          <div key={t.id} className="break-inside-avoid rounded-md border border-ink p-2">
            <p className="font-display text-lg font-medium">{t.term}</p>
            <p className="text-xs text-muted">{t.ipa}</p>
            <p className="mt-1 text-sm">{t.simple}</p>
            <p className="mt-2 border-t border-dashed border-line pt-1 text-sm">
              <span className="font-medium">{t.termEs}.</span> {t.simpleEs}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoTypes() {
  const types = [
    "wordmark",
    "lettermark",
    "pictorial mark",
    "abstract mark",
    "combination mark",
    "emblem",
  ];
  return (
    <div className="space-y-4 text-sm">
      <p>
        Sort each study mark into a type. Then write one sentence:{" "}
        <em>This mark is a ______ because ______.</em>
      </p>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink">
            <th className="py-1">Mark</th>
            <th className="py-1">Type</th>
            <th className="py-1">Because…</th>
          </tr>
        </thead>
        <tbody>
          {LAB_BRANDS.slice(0, 8).map((m) => (
            <tr key={m.id} className="border-b border-line">
              <td className="w-28 py-2">
                <div className="h-10 w-24">
                  <m.Mark />
                </div>
                <span className="text-xs">{m.name}</span>
              </td>
              <td className="w-36">______________</td>
              <td>________________________________</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-medium">Word bank</p>
      <p>{types.join(" · ")}</p>
    </div>
  );
}

function Analyze() {
  return (
    <div className="space-y-4 text-sm">
      <p>
        Pick one logo you can see in the room (a laptop, a shoe, a snack) — or
        one lab brand from the unit. Sketch from memory. Do not copy a real
        trademark for a business.
      </p>
      <p>Company / team ________________________________</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Sketch the mark</p>
          <div className="mt-1 h-40 rounded-md border border-ink" />
        </div>
        <div className="space-y-2">
          <p>Type of logo ________________________</p>
          <p>Main color(s) _______________________</p>
          <p>Simple or busy? _____________________</p>
          <p>Hidden shape? _______________________</p>
        </div>
      </div>
      <p className="font-medium">What is the mark promising?</p>
      <Line n={3} />
      <p className="font-medium">Would it still work in one color? Why?</p>
      <Line n={3} />
    </div>
  );
}

function Simplify() {
  return (
    <div className="space-y-4 text-sm">
      <p>
        This invented logo is too busy. On the right, redraw it with fewer
        parts. Keep the idea (fast mail). Lose the extra words, windows, and
        clip art.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 font-medium">Before</p>
          <div className="rounded-md border border-line p-2">
            <SpeedyBoxMark />
          </div>
        </div>
        <div>
          <p className="mb-1 font-medium">After — your drawing</p>
          <div className="h-36 rounded-md border border-ink" />
        </div>
      </div>
      <p className="font-medium">Three things I took out</p>
      <p>1. _______________________________________________</p>
      <p>2. _______________________________________________</p>
      <p>3. _______________________________________________</p>
      <p className="font-medium">Would it work as an app icon? Yes / No because</p>
      <Line n={2} />
    </div>
  );
}

function HiddenHunt() {
  return (
    <div className="space-y-4 text-sm">
      <p>Circle the hidden shape. Then invent one of your own in the box.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-24 rounded-md border border-line p-2">
            <AeroLinkMark />
          </div>
          <p className="mt-1">Hidden: _____________________</p>
        </div>
        <div>
          <div className="h-24 rounded-md border border-line p-2">
            <ArcadyMark />
          </div>
          <p className="mt-1">Hidden: _____________________</p>
        </div>
        <div>
          <div className="h-24 rounded-md border border-line p-2">
            <NorthParkMark />
          </div>
          <p className="mt-1">Hidden: _____________________</p>
        </div>
        <div>
          <p className="mb-1 font-medium">Invent a hidden shape</p>
          <div className="h-24 rounded-md border border-ink" />
        </div>
      </div>
      <p className="font-medium">I notice _________________________________</p>
      <Line n={2} />
    </div>
  );
}

function ColorChart() {
  const rows = ["Red", "Blue", "Green / teal", "Black", "Yellow / gold", "White / paper"];
  return (
    <div className="space-y-4 text-sm">
      <p>
        Colors do not mean the same thing in every culture. Write “often feels
        like,” not “always means.”
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-ink text-left">
            <th className="py-1">Color</th>
            <th>Often feels like</th>
            <th>A job it might fit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c} className="border-b border-line">
              <td className="py-3 font-medium">{c}</td>
              <td>____________________</td>
              <td>____________________</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-medium">My two-color palette for a school garden club</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 rounded-md border border-ink" />
        <div className="h-16 rounded-md border border-ink" />
      </div>
      <p>This palette fits because</p>
      <Line n={2} />
    </div>
  );
}

function LetterAsLogo() {
  return (
    <div className="space-y-4 text-sm">
      <p>
        Turn the first letter of a local place (library, diner, park) into a
        mark. One or two colors. The letter should still be readable.
      </p>
      <p>Place ________________________________  Letter _____</p>
      <div className="grid grid-cols-3 gap-3">
        {["Sketch 1", "Sketch 2", "Final (larger)"].map((l, i) => (
          <div key={l} className={i === 2 ? "col-span-3" : ""}>
            <p className="mb-1 font-medium">{l}</p>
            <div className={i === 2 ? "h-40 rounded-md border border-ink" : "h-28 rounded-md border border-ink"} />
          </div>
        ))}
      </div>
      <p>I kept it simple by _________________________________</p>
      <Line n={2} />
    </div>
  );
}

function DesignBrief() {
  return (
    <div className="space-y-4 text-sm">
      <p className="rounded-md bg-paper-2 p-3">
        You are not using a logo generator. Pencil, marker, and tracing paper
        only. Two colors plus paper. One typeface. Must work in black.
      </p>
      <p className="font-medium">1. The client (invented)</p>
      <p>Business name ________________________________</p>
      <p>What they make or do ________________________________</p>
      <p>Who it is for ________________________________</p>
      <p>Three feeling words: ________ · ________ · ________</p>
      <p className="font-medium">2. Constraints</p>
      <p>☐ Two colors  ☐ One typeface  ☐ Works at thumbnail size  ☐ Works in black</p>
      <p className="font-medium">3. Type of mark I will try</p>
      <p>☐ wordmark  ☐ lettermark  ☐ pictorial  ☐ abstract  ☐ combination  ☐ emblem</p>
      <p className="font-medium">4. Thumbnails — at least six tiny ideas</p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-24 rounded-md border border-ink" />
        ))}
      </div>
      <p className="font-medium">5. Final mark (clean drawing)</p>
      <div className="h-48 rounded-md border border-ink" />
      <p className="font-medium">6. One-color test</p>
      <div className="h-24 rounded-md border border-ink bg-paper-2" />
      <p className="font-medium">7. Artist statement (4–6 sentences)</p>
      <p>Use: <em>I chose · because · so that · I notice · This works because</em></p>
      <Line n={6} />
    </div>
  );
}

function CritiqueSheet() {
  return (
    <div className="space-y-4 text-sm">
      <p>Designer __________________  Reviewer __________________</p>
      <p className="font-medium">Start with what is working</p>
      <p>This works because _________________________________</p>
      <Line n={2} />
      <p className="font-medium">Then one next step</p>
      <p>This would be stronger if _________________________________</p>
      <Line n={2} />
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-ink text-left">
            <th className="py-1">Criteria</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Simple enough at thumbnail size",
            "Limited color (≤2) and one typeface",
            "Fits the invented client",
            "Works in one color",
            "Artist statement uses design words",
          ].map((c) => (
            <tr key={c} className="border-b border-line">
              <td className="py-2">{c}</td>
              <td>☐</td>
              <td>☐</td>
              <td>☐</td>
              <td>☐</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted">4 = strong  ·  1 = not yet</p>
    </div>
  );
}

function TeacherPacing() {
  return (
    <div className="space-y-3 text-sm">
      <p className="font-medium">8–10 day map</p>
      <ol className="list-decimal space-y-1 pl-5">
        <li>Lesson 1 + type sorter. Print vocab cards and six types.</li>
        <li>Lesson 2 + silhouette quiz. Print simplify sheet.</li>
        <li>Lesson 3 (day A): AeroLink arrow, Arcady A→Y, diagrams.</li>
        <li>Lesson 3 (day B): hidden-space hunt + worksheet.</li>
        <li>Lesson 4 + color lab + color chart.</li>
        <li>Lesson 5 + type fit + letter-as-logo.</li>
        <li>Lesson 6 clinic. Assign paper brief.</li>
        <li>Studio / drawing day. Constraints on the wall.</li>
        <li>Peer critique with frames + rubric.</li>
        <li>Gallery walk + reflection. Optional: one-color print of finals.</li>
      </ol>
      <p className="font-medium">Keys (short)</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>AeroLink hidden: arrow. Arcady: A→Y path. North Park: book in leaf. Foxfire: one ear is a flame.</li>
        <li>Foxfire, Beacon, North Park: pictorial. Stride, Pact: abstract. Quill, Harbor, AeroLink: wordmark. Red Rail: lettermark. Summit, Arcady: combination. Mesa: emblem.</li>
        <li>Burger Blast / Star Tutors / IRON GYM: too many fonts + effects. Zippy: contrast. NiteOwl: off-brand neon.</li>
      </ul>
      <p className="font-medium">ELL moves (always on)</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>ES toggle, read-aloud, cognates, sentence frames, word bank on every task.</li>
        <li>Pair oral rehearsal before writing. Allow sketches before sentences.</li>
        <li>Language objective posted beside the I can.</li>
        <li>Word drill in Studio: definition in, term out. Keys 1–4.</li>
      </ul>
      <div className="h-24">
        <BurgerBlastMark />
      </div>
      <p className="text-xs">Clinic sample: Burger Blast — four typefaces, no hierarchy.</p>
    </div>
  );
}

function Certificate() {
  const name = useProgress((s) => s.studentName);
  const xp = useProgress((s) => s.xp);
  const high = useProgress((s) => s.highScore);
  const completed = useProgress((s) => s.completedLessons);
  const done = useProgress((s) => s.activityDone);
  const best = useProgress((s) => s.activityBest);
  const starred = useProgress((s) => s.starredTerms);
  const tickets = useProgress((s) => s.tickets);
  const warmupDay = useProgress((s) => s.warmupDay);
  const rank = rankFor(xp);
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
  const earned = PINS.filter((p) => pins.includes(p.id));
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-2 border-ink px-8 py-10 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-teal">{UNIT.name}</p>
      <p className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-muted">
        Certifies that
      </p>
      <p className="mt-3 font-display text-4xl font-medium">
        {name.trim() || "________________"}
      </p>
      <p className="mt-6 text-ink-soft">
        looked closely, named what they saw, and earned the rank of
      </p>
      <p className="mt-3 font-display text-3xl italic text-teal">{rank.name}</p>
      <p className="mt-4 font-display text-5xl tabular-nums">{xp}</p>
      <p className="text-sm text-muted">XP · high score {high}</p>
      <p className="mt-6 text-sm text-ink-soft">
        {completed.length}/{LESSONS.length} lessons · {done.length}/{STUDIO.length}{" "}
        studios · {earned.length} pins
      </p>
      {earned.length ? (
        <p className="mt-3 text-sm text-teal">{earned.map((p) => p.name).join(" · ")}</p>
      ) : (
        <p className="mt-3 text-sm text-muted">Pins still to unlock — keep looking.</p>
      )}
      <p className="mt-10 text-xs uppercase tracking-[0.2em] text-muted">{date}</p>
    </div>
  );
}



