import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { LESSONS } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { XP_PER_LESSON } from "@/lib/xp";

export const Route = createFileRoute("/lessons/")({ component: LessonsIndex });

function LessonsIndex() {
  const completed = useProgress((s) => s.completedLessons);
  const spanish = useProgress((s) => s.spanish);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-medium">Lessons</h1>
      <p className="mt-2 text-ink-soft">
        Six looking lessons. Studio games and paper copies sit beside each one.
        First finish: {XP_PER_LESSON} XP.
      </p>
      <ul className="mt-8 space-y-4">
        {LESSONS.map((l) => (
          <li key={l.id}>
            <Link
              to="/lessons/$id"
              params={{ id: l.id }}
              className="block rounded-xl border border-line bg-surface p-5 no-underline shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] focus-visible:shadow-[var(--shadow-border-hover)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-teal">
                  Lesson {l.number}
                </span>
                <Badge variant="outline">{l.duration}</Badge>
                {completed.includes(l.id) ? (
                  <Badge variant="good">Done</Badge>
                ) : (
                  <Badge variant="outline">+{XP_PER_LESSON} XP</Badge>
                )}
              </div>
              <h2 className="mt-2 font-display text-2xl font-medium">{l.title}</h2>
              {spanish ? <p className="text-sm text-muted">{l.titleEs}</p> : null}
              <p className="mt-2 text-ink-soft">{l.summary}</p>
              <p className="mt-3 text-sm">
                <span className="font-medium text-teal">I can </span>
                {l.iCan.replace(/^I can /i, "")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
