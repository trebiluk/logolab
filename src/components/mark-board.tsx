import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MarkBoard({
  children,
  caption,
  kind,
  ink = false,
  className,
  padded = true,
}: {
  children: ReactNode;
  caption?: string;
  kind?: string;
  ink?: boolean;
  className?: string;
  padded?: boolean;
}) {
  return (
    <figure className={cn("min-w-0", className)}>
      <div
        className={cn(
          "flex aspect-[5/3] items-center justify-center overflow-hidden rounded-lg",
          padded ? "p-4 sm:p-6" : "p-0",
          ink ? "bg-ink text-paper" : "bg-surface-2 text-ink",
        )}
      >
        <div className="flex h-[86%] w-[86%] items-center justify-center [&_svg]:h-full [&_svg]:w-full">
          {children}
        </div>
      </div>
      {(caption || kind) && (
        <figcaption className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          {kind ? (
            <Badge variant="outline" className="capitalize">
              {kind}
            </Badge>
          ) : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}

export function MonoToggle({
  children,
}: {
  children: (mono: boolean) => ReactNode;
}) {
  const [mono, setMono] = useState(false);
  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2 text-sm">
        <span className="text-muted">Color test</span>
        <button
          type="button"
          onClick={() => setMono(false)}
          className={cn(
            "h-9 rounded-full px-3",
            !mono ? "bg-teal text-paper" : "bg-surface-2 text-ink",
          )}
        >
          Color
        </button>
        <button
          type="button"
          onClick={() => setMono(true)}
          className={cn(
            "h-9 rounded-full px-3",
            mono ? "bg-ink text-paper" : "bg-surface-2 text-ink",
          )}
        >
          One color
        </button>
      </div>
      {children(mono)}
    </div>
  );
}
