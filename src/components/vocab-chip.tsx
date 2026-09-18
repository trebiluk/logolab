import { Link } from "@tanstack/react-router";
import { getTerm } from "@/content/glossary";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

export function VocabChip({ id, className }: { id: string; className?: string }) {
  const term = getTerm(id);
  const spanish = useProgress((s) => s.spanish);
  if (!term) return null;
  return (
    <Link
      to="/glossary"
      search={{ q: id }}
      className={cn(
        "inline-flex items-baseline gap-1 rounded-full border border-line bg-surface px-2.5 py-0.5 text-sm text-ink no-underline hover:border-line-strong focus-visible:border-line-strong",
        className,
      )}
    >
      <span className="font-medium">{term.term}</span>
      {spanish ? <span className="text-muted">· {term.termEs}</span> : null}
    </Link>
  );
}

export function VocabRow({ ids }: { ids: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ids.map((id) => (
        <VocabChip key={id} id={id} />
      ))}
    </div>
  );
}
