import { cn } from "@/lib/utils";

const TEAL = "#1f4f4a";
const CREAM = "#f3efe6";
const GOLD = "#c9a24a";
const INK = "#1c1a16";

const B_BODY = `
  M12.6 11
  H34
  C48.4 11 54.6 17.6 54.6 25.6
  C54.6 32.2 48.8 35.4 36.2 36.2
  C50.8 37.2 58 42.4 58 49
  C58 56.2 49.4 53.6 33.6 53
  H12.6
  Z
`;

const LENS = `
  M36.8 16.2
  C41 16.2 44.4 19.6 44.4 23.8
  C44.4 28 41 31.4 36.8 31.4
  C32.6 31.4 29.2 28 29.2 23.8
  C29.2 19.6 32.6 16.2 36.8 16.2
  Z
`;

const DISH = `
  M39 38.4
  C44 38.4 47.8 41.6 47.8 45.6
  C47.8 49.6 44 52.8 39 52.8
  C34 52.8 30.2 49.6 30.2 45.6
  C30.2 41.6 34 38.4 39 38.4
  Z
`;

const SPARK = "M47.4 33.2 L50.6 36.2 L47.4 39.2 L44.2 36.2 Z";

type Variant = "tile" | "bare" | "mono";

export function LogoMark({
  className,
  variant = "tile",
  title = "BertyBot's LogoLab",
}: {
  className?: string;
  variant?: Variant;
  title?: string;
}) {
  const tiled = variant === "tile";
  const mono = variant === "mono";
  const body = mono ? "currentColor" : tiled ? CREAM : TEAL;
  const spark = mono ? undefined : GOLD;

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {tiled ? <rect width="64" height="64" rx="14" fill={TEAL} /> : null}
      <path fill={body} fillRule="evenodd" d={`${B_BODY} ${LENS} ${DISH}`} />
      {spark ? <path fill={spark} d={SPARK} /> : null}
    </svg>
  );
}

export function LogoLockup({
  className,
  size = "md",
  stacked = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  stacked?: boolean;
}) {
  const mark =
    size === "lg" ? "size-20" : size === "sm" ? "size-8" : "size-11";
  const word =
    size === "lg" ? "text-4xl sm:text-5xl" : size === "sm" ? "text-lg" : "text-2xl";
  const kicker =
    size === "lg"
      ? "text-xs tracking-[0.22em]"
      : "text-[11px] tracking-[0.18em]";

  return (
    <div
      className={cn(
        "flex items-center",
        stacked ? "flex-col gap-3 text-center" : "gap-3",
        className,
      )}
    >
      <LogoMark className={mark} />
      <div className={cn("min-w-0 leading-none", stacked && "mt-1")}>
        <p
          className={cn(
            "font-medium uppercase text-muted",
            kicker,
            stacked && "mt-1",
          )}
        >
          BertyBot's
        </p>
        <p
          className={cn(
            "font-display font-semibold tracking-tight text-ink",
            word,
            size === "lg" && "mt-1",
          )}
        >
          LogoLab
        </p>
      </div>
    </div>
  );
}

export const LOGO_INK = INK;
export const LOGO_TEAL = TEAL;
export const LOGO_GOLD = GOLD;
