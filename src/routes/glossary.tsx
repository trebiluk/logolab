import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GLOSSARY } from "@/content/glossary";
import { useProgress } from "@/lib/store";
import { XP_STAR } from "@/lib/xp";
import { cn } from "@/lib/utils";

type Search = { q?: string };

export const Route = createFileRoute("/glossary")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const { q } = Route.useSearch();
  const [filter, setFilter] = useState("");
  const spanish = useProgress((s) => s.spanish);
  const starred = useProgress((s) => s.starredTerms);
  const toggleStar = useProgress((s) => s.toggleStar);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!q) return;
    const el = refs.current[q];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [q]);

  const list = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return GLOSSARY;
    return GLOSSARY.filter(
      (t) =>
        t.term.toLowerCase().includes(f) ||
        t.termEs.toLowerCase().includes(f) ||
        t.simple.toLowerCase().includes(f),
    );
  }, [filter]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-medium">Word bank</h1>
      <p className="mt-2 text-ink-soft">
        Simple English, Spanish, and a sound-it-out. Star a word for {XP_STAR} XP
        the first time. Cognates (words that look like Spanish) wear a badge.
      </p>
      <Button asChild className="mt-4">
        <Link to="/studio/$id" params={{ id: "drill" }}>
          Word drill
        </Link>
      </Button>
      <label className="mt-6 block text-sm">
        <span className="sr-only">Search words</span>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search a word…"
          className="h-11 w-full rounded-md border border-line bg-surface px-3"
        />
      </label>
      <ul className="mt-6 space-y-3">
        {list.map((t) => (
          <li
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            className={cn(
              "rounded-xl border bg-surface p-4",
              q === t.id ? "border-teal" : "border-line",
            )}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="font-display text-2xl font-medium">{t.term}</h2>
                  <span className="text-sm text-muted">{t.ipa}</span>
                  {t.cognate ? <Badge>Cognate</Badge> : null}
                </div>
                {spanish ? (
                  <p className="text-sm text-teal">{t.termEs}</p>
                ) : (
                  <p className="text-sm text-muted">{t.termEs}</p>
                )}
              </div>
              <SpeakButton text={`${t.term}. ${t.simple}`} />
              <button
                type="button"
                onClick={() => toggleStar(t.id)}
                className="size-11 shrink-0 text-teal hover:bg-surface-2 focus-visible:bg-surface-2"
                aria-pressed={starred.includes(t.id)}
                aria-label={starred.includes(t.id) ? "Unstar" : "Star this word"}
              >
                <Star
                  className="size-5"
                  fill={starred.includes(t.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <p className="mt-2 text-ink-soft">{t.simple}</p>
            {spanish ? <p className="mt-1 text-sm text-muted">{t.simpleEs}</p> : null}
            <p className="mt-2 text-sm italic text-ink-soft">“{t.example}”</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
