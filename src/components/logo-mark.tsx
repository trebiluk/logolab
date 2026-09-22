import { cn } from "@/lib/utils";

const TEAL = "#1f4f4a";
const CREAM = "#f3efe6";
const GOLD = "#c9a24a";
const INK = "#1c1a16";

/**
 * Factory stencil B — a punch-die letter, not two stacked circles.
 * Upper counter = square nut. Lower = wider seat. Brass hex lives on the spine.
 */
const B_BODY = `
  M13 11
  H37
  L48 11
  L52 16
  L52 26
  L41 32
  L53 38
  L55 44
  L55 50
  L46 54
  H13
  Z
`;

const NUT = `
  M26.5 16
  H41
  L44 19
  L44 25
  L41 28
  H26.5
  Z
`;

const SEAT = `
  M26.5 37
  H44.5
  L48.5 40.5
  L48.5 48
  L44.5 51.2
  H26.5
  Z
`;

const RIVET = `
  M19 14.2
  L22.4 16.2
  L22.4 20.2
  L19 22.2
  L15.6 20.2
  L15.6 16.2
  Z
`;

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
  const rivet = mono ? undefined : GOLD;
  const tick = tiled ? CREAM : body;

  const labelled = Boolean(title);
  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      className={cn("shrink-0", className)}
      role={labelled ? "img" : "presentation"}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
    >
      {labelled ? <title>{title}</title> : null}
      {tiled ? <rect width="64" height="64" rx="8" fill={TEAL} /> : null}
      {tiled ? (
        <g fill={tick} opacity="0.85">
          <path d="M4 4h9v2.4H6.4V13H4z" />
          <path d="M51 4h9v9h-2.4V6.4H51z" />
          <path d="M4 51h2.4V57.6H13V60H4z" />
          <path d="M57.6 51H60v9h-9v-2.4h6.6z" />
        </g>
      ) : null}
      <path fill={body} fillRule="evenodd" d={`${B_BODY} ${NUT} ${SEAT}`} />
      {rivet ? <path fill={rivet} d={RIVET} /> : null}
    </svg>
  );
}

export function BertyBot({
  className,
  title = "BertyBot of TechWorks",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 100"
      width={80}
      height={100}
      className={cn("shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M40 4v12" fill="none" stroke={TEAL} strokeWidth="3.2" />
      <circle cx="40" cy="4.5" r="3.6" fill={GOLD} />
      <rect x="22" y="16" width="36" height="28" rx="5" fill={TEAL} />
      <rect x="28" y="26" width="24" height="8" rx="2" fill={CREAM} />
      <rect x="18" y="46" width="44" height="34" rx="5" fill={TEAL} />
      <rect x="31" y="54" width="18" height="18" rx="2.5" fill={CREAM} />
      <path
        fill={GOLD}
        d="M40 57.2 L43.2 59 L43.2 62.6 L40 64.4 L36.8 62.6 L36.8 59 Z"
      />
      <rect x="25" y="80" width="11" height="14" rx="2" fill={TEAL} />
      <rect x="44" y="80" width="11" height="14" rx="2" fill={TEAL} />
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
      ? "text-[11px] tracking-[0.22em]"
      : "text-[10px] tracking-[0.18em]";

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
            "font-mono font-medium uppercase text-teal",
            kicker,
            stacked && "mt-1",
          )}
        >
          TechWorks · BertyBot
        </p>
        <p
          className={cn(
            "font-display font-semibold tracking-tight text-ink",
            word,
            size === "lg" && "mt-1.5",
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
