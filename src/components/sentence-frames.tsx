import { MessageSquareText } from "lucide-react";
import { FRAMES } from "@/content/unit";
import { useProgress } from "@/lib/store";

export function SentenceFrames({
  kind,
}: {
  kind: keyof typeof FRAMES;
}) {
  const spanish = useProgress((s) => s.spanish);
  const list = FRAMES[kind];
  return (
    <aside className="rounded-lg bg-teal-soft/60 p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-teal">
        <MessageSquareText className="size-3.5" />
        {spanish ? "Marcos de oración · Sentence frames" : "Sentence frames"}
      </p>
      <ul className="space-y-1.5 text-sm text-ink-soft">
        {list.map((f) => (
          <li key={f} className="font-medium">
            {f}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function ICan({
  en,
  es,
}: {
  en: string;
  es: string;
}) {
  const spanish = useProgress((s) => s.spanish);
  return (
    <p className="rounded-md border border-line bg-surface px-3 py-2 text-sm">
      <span className="mr-2 font-medium text-teal">I can</span>
      {en}
      {spanish ? (
        <span className="mt-1 block text-muted">
          <span className="mr-2 font-medium text-teal">Puedo</span>
          {es.replace(/^Puedo\s+/i, "")}
        </span>
      ) : null}
    </p>
  );
}
