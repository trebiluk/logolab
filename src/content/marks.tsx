import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarkProps = {
  className?: string;
  mono?: boolean;
  title?: string;
  showSecret?: boolean;
};

function Frame({
  className,
  children,
  viewBox = "0 0 160 110",
  title,
}: {
  className?: string;
  children: ReactNode;
  viewBox?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function ink(mono: boolean | undefined, color: string) {
  return mono ? "currentColor" : color;
}

const SERIF = "Georgia, 'Palatino Linotype', 'Times New Roman', serif";
const SANS = "ui-sans-serif, system-ui, sans-serif";
const PAPER = "#faf8f3";

/** Foxfire Camp — fox-head shield; the right ear is fire. */
export function FoxfireMark({ className, mono, title = "Foxfire Camp pictorial" }: MarkProps) {
  const fill = ink(mono, "#6b2a12");
  return (
    <Frame className={className} viewBox="0 0 168 168" title={title}>
      <path
        fill={fill}
        d="M84 160
           Q16 108 18 72
           L46 6
           L68 60
           L84 48
           L100 60
           L112 22
           L126 4
           L136 28
           L154 6
           L152 72
           Q150 108 84 160Z"
      />
      {!mono ? (
        <path fill={PAPER} d="M84 66 L72 112 L84 154 L96 112Z" />
      ) : null}
    </Frame>
  );
}

/** Stride — plant, path, launch. Square terminals. Not a ribbon S. */
export function StrideMark({ className, mono, title = "Stride abstract mark" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  return (
    <Frame className={className} viewBox="0 0 200 120" title={title}>
      <path
        fill="none"
        stroke={fill}
        strokeWidth="20"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        d="M56 76v24h48L180 24"
      />
    </Frame>
  );
}

/** Red Rail — two open R's in a token. They stand on a rail; nothing strikes through. */
export function RedRailMark({ className, mono, title = "Red Rail lettermark" }: MarkProps) {
  const fill = ink(mono, "#b42318");
  return (
    <Frame className={className} viewBox="0 0 140 140" title={title}>
      <circle cx="70" cy="70" r="62" fill="none" stroke={fill} strokeWidth="6" />
      <g fill="none" stroke={fill} strokeWidth="11" strokeLinejoin="miter" strokeLinecap="butt">
        <path d="M28 36v68" />
        <path d="M28 36h24c16 0 24 8 24 20s-8 20-24 20H28" />
        <path d="M54 76l30 28" />
        <path d="M74 36v68" />
        <path d="M74 36h24c16 0 24 8 24 20s-8 20-24 20H74" />
        <path d="M100 76l30 28" />
      </g>
      <path d="M30 112h80" fill="none" stroke={fill} strokeWidth="5.5" strokeLinecap="butt" />
    </Frame>
  );
}

/** Beacon — a lighthouse that is also an exclamation. */
export function BeaconMark({ className, mono, title = "Beacon pictorial mark" }: MarkProps) {
  const fill = ink(mono, "#1f4f4a");
  return (
    <Frame className={className} viewBox="0 0 96 168" title={title}>
      <rect x="36" y="6" width="24" height="22" fill="none" stroke={fill} strokeWidth="6" />
      <rect x="30" y="30" width="36" height="7" fill={fill} />
      <path fill={fill} d="M38 37h20l8 86H30z" />
      <circle cx="48" cy="148" r="16" fill={fill} />
    </Frame>
  );
}

/** Pact — two links lock. Horizontal and vertical, woven — not stacked discs. */
export function PactMark({ className, mono, title = "Pact interlocking rings" }: MarkProps) {
  const a = ink(mono, "#1f4f4a");
  const b = ink(mono, "#c4920a");
  return (
    <Frame className={className} viewBox="0 0 160 160" title={title}>
      <rect
        x="10"
        y="58"
        width="100"
        height="44"
        rx="22"
        fill="none"
        stroke={a}
        strokeWidth="12"
      />
      <rect
        x="58"
        y="10"
        width="44"
        height="100"
        rx="22"
        fill="none"
        stroke={b}
        strokeWidth="12"
      />
      {/* weave: teal link sits on top at the upper crossing */}
      <path
        d="M58 80a22 22 0 0 1 22-22"
        fill="none"
        stroke={a}
        strokeWidth="12"
        strokeLinecap="butt"
      />
      {/* gold link sits on top at the lower crossing */}
      <path
        d="M80 102a22 22 0 0 1 22-22"
        fill="none"
        stroke={b}
        strokeWidth="12"
        strokeLinecap="butt"
      />
    </Frame>
  );
}

/** AeroLink — stroke letters, arrow hiding in the E–R gap. */
export function AeroLinkMark({
  className,
  mono,
  title = "AeroLink hidden-arrow wordmark",
  showSecret,
}: MarkProps) {
  const fill = ink(mono, "#1f4f4a");
  const secret = "#c4920a";
  return (
    <Frame className={className} viewBox="0 0 280 90" title={title}>
      <g fill="none" stroke={fill} strokeWidth="11" strokeLinejoin="miter" strokeLinecap="butt">
        <path d="M10 74L44 14l34 60" />
        <path d="M26 50h36" />
        <path d="M92 14v60" />
        <path d="M92 14h42" />
        <path d="M92 38h38" />
        <path d="M92 74h42" />
        <path d="M158 74V14h24c18 0 28 9 28 24 0 13-8 21-24 21" />
        <path d="M182 59l30 15" />
      </g>
      <circle cx="250" cy="44" r="24" fill="none" stroke={fill} strokeWidth="11" />
      {showSecret ? <polygon points="136,38 156,26 156,50" fill={secret} /> : null}
    </Frame>
  );
}

/** Arcady — a Roman arch that is also an A, plus the name and a path from A to Y. */
export function ArcadyMark({
  className,
  mono,
  title = "Arcady combination mark",
  showSecret,
}: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  const arc = ink(mono, "#c4920a");
  return (
    <Frame className={className} viewBox="0 0 200 156" title={title}>
      <path
        fill="none"
        stroke={fill}
        strokeWidth="13"
        strokeLinecap="butt"
        d="M46 78a54 54 0 0 1 108 0"
      />
      <rect x="39" y="78" width="14" height="40" fill={fill} />
      <rect x="147" y="78" width="14" height="40" fill={fill} />
      <rect x="72" y="86" width="56" height="9" fill={fill} />
      <text
        x="100"
        y="138"
        textAnchor="middle"
        fill={fill}
        fontFamily={SANS}
        fontSize="15"
        fontWeight="700"
        letterSpacing="5"
      >
        ARCADY
      </text>
      <path
        d="M24 148c32 10 120 10 152 0"
        fill="none"
        stroke={arc}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M168 142l16 6-12 8z" fill={arc} />
      {showSecret ? (
        <g fill={arc} fontFamily={SANS} fontSize="10" fontWeight="700">
          <text x="18" y="144">A</text>
          <text x="176" y="144">Y</text>
        </g>
      ) : null}
    </Frame>
  );
}

/** Summit — one peak, a shoulder, a flag. */
export function SummitMark({ className, mono, title = "Summit combination mark" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  return (
    <Frame className={className} viewBox="0 0 170 140" title={title}>
      <path fill={fill} d="M8 102L70 18l26 42 22-24 44 66H8z" />
      <path fill={fill} d="M70 18v36l32-14z" />
      <text
        x="85"
        y="128"
        textAnchor="middle"
        fill={fill}
        fontFamily={SANS}
        fontSize="15"
        fontWeight="700"
        letterSpacing="5"
      >
        SUMMIT
      </text>
    </Frame>
  );
}

/** Mesa Museum — stepped landform locked in a badge with the name. */
export function MesaMark({ className, mono, title = "Mesa Museum emblem" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  return (
    <Frame className={className} viewBox="0 0 168 128" title={title}>
      <rect
        x="6"
        y="6"
        width="156"
        height="116"
        rx="10"
        fill="none"
        stroke={fill}
        strokeWidth="5.5"
      />
      <path fill={fill} d="M62 22h44v22H62z" />
      <path fill={fill} d="M40 44h88v22H40z" />
      <path fill={fill} d="M22 66h124v18H22z" />
      <text
        x="84"
        y="110"
        textAnchor="middle"
        fill={fill}
        fontFamily={SANS}
        fontSize="20"
        fontWeight="800"
        letterSpacing="6"
      >
        MESA
      </text>
    </Frame>
  );
}

/** Lumen — railroad lantern. The diamond is the light. */
export function LumenMark({ className, mono, title = "Lumen lantern pictorial" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  const light = mono ? fill : "#c4920a";
  return (
    <Frame className={className} viewBox="0 0 100 154" title={title}>
      <path
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
        d="M32 40c0-20 36-20 36 0"
      />
      <path fill={fill} d="M22 40h56l-8 10H30z" />
      {mono ? (
        <path
          fill={fill}
          fillRule="evenodd"
          d="M28 50h44l-6 70H34zM50 68l16 20-16 20-16-20z"
        />
      ) : (
        <>
          <path fill={fill} d="M28 50h44l-6 70H34z" />
          <path fill={light} d="M50 68l16 20-16 20-16-20z" />
        </>
      )}
      <rect x="32" y="122" width="36" height="10" fill={fill} />
    </Frame>
  );
}

/** Quill — a feather that writes the name. */
export function QuillMark({ className, mono, title = "Quill script wordmark" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  return (
    <Frame className={className} viewBox="0 0 280 100" title={title}>
      <path fill={fill} d="M18 78l14-8 6 12-12 8z" />
      <path
        fill="none"
        stroke={fill}
        strokeWidth="4.5"
        strokeLinecap="round"
        d="M30 72C52 28 88 10 124 16"
      />
      <g fill="none" stroke={fill} strokeWidth="2.2" strokeLinecap="round">
        <path d="M44 64l22-10" />
        <path d="M54 52l22-12" />
        <path d="M66 40l20-12" />
        <path d="M80 30l16-10" />
      </g>
      <text
        x="196"
        y="64"
        textAnchor="middle"
        fill={fill}
        fontFamily="Fraunces, Georgia, serif"
        fontSize="46"
        fontStyle="italic"
        fontWeight="600"
      >
        Quill
      </text>
    </Frame>
  );
}

/** Triad — three rings woven, not stacked. */
export function TriadMark({ className, mono, title = "Triad interlocking rings" }: MarkProps) {
  const teal = ink(mono, "#1f4f4a");
  const dark = ink(mono, "#1c1a16");
  const gold = ink(mono, "#c4920a");
  return (
    <Frame className={className} viewBox="0 0 140 128" title={title}>
      <circle cx="48" cy="50" r="30" fill="none" stroke={teal} strokeWidth="9" />
      <circle cx="92" cy="50" r="30" fill="none" stroke={dark} strokeWidth="9" />
      <circle cx="70" cy="84" r="30" fill="none" stroke={gold} strokeWidth="9" />
      <path d="M70 54a30 30 0 0 1 22 30" fill="none" stroke={dark} strokeWidth="9" />
      <path d="M48 50a30 30 0 0 0 22 34" fill="none" stroke={teal} strokeWidth="9" />
      <path d="M92 50a30 30 0 0 1-14-28" fill="none" stroke={dark} strokeWidth="9" />
    </Frame>
  );
}

/* ---------------- invented marks: good and broken ---------------- */

export function BurgerBlastMark({ className, title = "Burger Blast — fake logo" }: MarkProps) {
  return (
    <Frame className={className} viewBox="0 0 220 140" title={title}>
      <rect x="8" y="8" width="204" height="124" rx="8" fill="#1a1a2e" />
      <text x="110" y="40" textAnchor="middle" fill="#ff0" fontFamily="Impact, sans-serif" fontSize="22">
        BURGER
      </text>
      <text
        x="110"
        y="68"
        textAnchor="middle"
        fill="#f00"
        fontFamily="Comic Sans MS, cursive"
        fontSize="28"
        fontStyle="italic"
      >
        Blast!!!
      </text>
      <text x="110" y="92" textAnchor="middle" fill="#0ff" fontFamily="Times New Roman, serif" fontSize="10">
        World's #1 Flame Grilled Experience
      </text>
      <text x="40" y="118" fill="#ffa500" fontSize="16">
        ★★★
      </text>
      <text x="150" y="118" fill="#ffa500" fontFamily={SERIF} fontSize="11">
        est. 1998
      </text>
    </Frame>
  );
}

export function NiteOwlMark({ className, title = "NiteOwl Sleep — fake logo" }: MarkProps) {
  return (
    <Frame className={className} viewBox="0 0 200 120" title={title}>
      <rect width="200" height="120" fill="#d4ff00" />
      <text
        x="100"
        y="54"
        textAnchor="middle"
        fill="#39ff14"
        fontFamily="Impact, sans-serif"
        fontSize="28"
        stroke="#00f"
        strokeWidth="1"
      >
        NITEOWL
      </text>
      <text x="100" y="78" textAnchor="middle" fill="#ff00aa" fontFamily="cursive" fontSize="16">
        sleep co.
      </text>
      <circle cx="24" cy="24" r="10" fill="#ff0" />
      <circle cx="176" cy="96" r="14" fill="#f0f" />
    </Frame>
  );
}

export function SpeedyBoxMark({ className, title = "SpeedyBox Mail — fake logo" }: MarkProps) {
  return (
    <Frame className={className} viewBox="0 0 220 130" title={title}>
      <rect x="18" y="44" width="100" height="48" rx="6" fill="#6b7280" />
      <rect x="118" y="54" width="36" height="28" fill="#9ca3af" />
      <rect x="30" y="54" width="16" height="12" fill="#93c5fd" />
      <rect x="52" y="54" width="16" height="12" fill="#93c5fd" />
      <rect x="74" y="54" width="16" height="12" fill="#93c5fd" />
      <rect x="96" y="54" width="16" height="12" fill="#93c5fd" />
      <circle cx="42" cy="96" r="11" fill="#1c1a16" />
      <circle cx="42" cy="96" r="5" fill="#9a9286" />
      <circle cx="104" cy="96" r="11" fill="#1c1a16" />
      <circle cx="104" cy="96" r="5" fill="#9a9286" />
      <path d="M18 58H6l10-18h24" fill="#f59e0b" />
      <path d="M164 28l22 12-22 12z" fill="#ef4444" />
      <path d="M158 70h28M158 78h20" stroke="#ef4444" strokeWidth="2" />
      <text x="110" y="24" textAnchor="middle" fontFamily={SERIF} fontSize="11" fill="#1c1a16">
        SpeedyBox Overnight Mail & Logistics
      </text>
      <text x="148" y="114" fontFamily="cursive" fontSize="11" fill="#1c1a16">
        we go FAST 2 U
      </text>
    </Frame>
  );
}

export function PineSoapMark({ className, mono, title = "Pine Soap — good invented logo" }: MarkProps) {
  const fill = ink(mono, "#1f4f4a");
  return (
    <Frame className={className} viewBox="0 0 160 148" title={title}>
      <path
        fill={fill}
        d="M80 4l40 40H98l38 38H104l40 40H16l40-40H24l38-38H40z"
      />
      <rect x="72" y="122" width="16" height="8" fill={fill} />
      <text
        x="80"
        y="144"
        textAnchor="middle"
        fill={fill}
        fontFamily={SERIF}
        fontSize="12"
        letterSpacing="3.5"
      >
        PINE SOAP
      </text>
    </Frame>
  );
}

export function IronGymMark({ className, title = "IRON GYM — fake logo" }: MarkProps) {
  const gid = `chrome-${useId().replace(/:/g, "")}`;
  return (
    <Frame className={className} viewBox="0 0 220 120" title={title}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.4" stopColor="#9aa" />
          <stop offset="1" stopColor="#445" />
        </linearGradient>
      </defs>
      <rect width="220" height="120" fill="#111" />
      <text
        x="110"
        y="58"
        textAnchor="middle"
        fill={`url(#${gid})`}
        fontFamily="Impact, sans-serif"
        fontSize="36"
        stroke="#ffd700"
        strokeWidth="0.6"
      >
        IRON GYM
      </text>
      <text x="110" y="82" textAnchor="middle" fill="#ffd700" fontFamily="cursive" fontSize="12">
        Unleash Your Destiny
      </text>
      <text x="20" y="108" fill="#f00" fontSize="10">
        ★ POWER ★
      </text>
      <text x="150" y="108" fill="#0ff" fontSize="10">
        3D • BEVEL
      </text>
    </Frame>
  );
}

export function NorthParkMark({ className, mono, title = "North Park Library — good invented logo" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  return (
    <Frame className={className} viewBox="0 0 160 148" title={title}>
      <path
        fill={fill}
        d="M80 8
           C112 28 128 52 124 82
           C120 112 96 130 80 140
           C64 130 40 112 36 82
           C32 52 48 28 80 8Z"
      />
      {!mono ? (
        <>
          <path fill={PAPER} d="M50 58L80 48l30 10v44L80 92 50 102Z" />
          <path d="M80 48v44" fill="none" stroke={fill} strokeWidth="2.6" />
        </>
      ) : null}
    </Frame>
  );
}

export function ZippyCarsMark({ className, title = "Zippy Cars — fake logo" }: MarkProps) {
  return (
    <Frame className={className} viewBox="0 0 200 110" title={title}>
      <rect width="200" height="110" fill="#fff" />
      <text
        x="100"
        y="58"
        textAnchor="middle"
        fill="#ffe566"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="700"
      >
        ZIPPY
      </text>
      <text x="100" y="82" textAnchor="middle" fill="#f5d76e" fontFamily="cursive" fontSize="14">
        cars & more
      </text>
    </Frame>
  );
}

export function HarborRoastMark({ className, mono, title = "Harbor Roast — good invented logo" }: MarkProps) {
  const fill = ink(mono, "#3a2a22");
  return (
    <Frame className={className} viewBox="0 0 220 110" title={title}>
      <text
        x="110"
        y="42"
        textAnchor="middle"
        fill={fill}
        fontFamily={SERIF}
        fontSize="24"
        letterSpacing="4"
      >
        HARBOR
      </text>
      <path
        d="M24 56c28-18 40 18 72 0s44-18 76 10"
        fill="none"
        stroke={fill}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M36 68c24-12 36 12 64 0s40-12 68 8"
        fill="none"
        stroke={fill}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <text
        x="110"
        y="96"
        textAnchor="middle"
        fill={fill}
        fontFamily={SERIF}
        fontSize="13"
        letterSpacing="10"
      >
        ROAST
      </text>
    </Frame>
  );
}

export function StarTutorsMark({ className, title = "Star Tutors — fake logo" }: MarkProps) {
  return (
    <Frame className={className} viewBox="0 0 200 130" title={title}>
      <polygon
        points="40,20 48,40 70,40 52,54 60,76 40,62 20,76 28,54 10,40 32,40"
        fill="#ffd700"
        stroke="#f00"
        strokeWidth="2"
      />
      <text x="110" y="48" fill="#00f" fontFamily="Comic Sans MS, cursive" fontSize="20">
        Star
      </text>
      <text x="96" y="78" fill="#f0f" fontFamily="Impact, sans-serif" fontSize="22">
        TUTORS
      </text>
      <text x="40" y="110" fill="#0a0" fontFamily="Times New Roman, serif" fontSize="11">
        Learn • Dream • Sparkle • Excel!!!
      </text>
    </Frame>
  );
}

export function OakInkMark({ className, mono, title = "Oak & Ink — good invented logo" }: MarkProps) {
  const fill = ink(mono, "#1c1a16");
  return (
    <Frame className={className} viewBox="0 0 160 148" title={title}>
      <circle cx="80" cy="50" r="36" fill="none" stroke={fill} strokeWidth="7" />
      <path
        fill={fill}
        d="M80 22
           C92 28 104 30 108 42
           C116 40 124 48 120 58
           C130 64 128 76 116 80
           C120 90 108 98 98 94
           C94 104 86 108 80 114
           C74 108 66 104 62 94
           C52 98 40 90 44 80
           C32 76 30 64 40 58
           C36 48 44 40 52 42
           C56 30 68 28 80 22Z"
      />
      {!mono ? <path d="M80 36v68" fill="none" stroke={PAPER} strokeWidth="2.2" /> : null}
      <text
        x="80"
        y="140"
        textAnchor="middle"
        fill={fill}
        fontFamily={SERIF}
        fontSize="12"
        letterSpacing="3"
      >
        OAK & INK
      </text>
    </Frame>
  );
}

export function StudyCaption({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-center text-xs text-muted">{children}</p>;
}

export const LAB_BRANDS = [
  {
    id: "foxfire",
    name: "Foxfire Camp",
    kind: "pictorial" as const,
    principle: "A fox-head shield. One ear is fire. Camp, in one silhouette.",
    Mark: FoxfireMark,
    hidden: "The right ear is a flame.",
  },
  {
    id: "stride",
    name: "Stride",
    kind: "abstract" as const,
    principle: "Plant, path, launch. Motion with no runner drawn.",
    Mark: StrideMark,
    hidden: "The long diagonal is the stride. You learn it, then never need the word.",
  },
  {
    id: "redrail",
    name: "Red Rail",
    kind: "lettermark" as const,
    principle: "Two R's standing on a rail, locked in a roundel.",
    Mark: RedRailMark,
    hidden: "The bar is a track under the letters — not a strike through them.",
  },
  {
    id: "aero",
    name: "AeroLink",
    kind: "wordmark" as const,
    principle: "The name is the picture. An arrow hides between E and R.",
    Mark: AeroLinkMark,
    hidden: "The short middle bar of the E and the stem of the R form a forward arrow.",
  },
  {
    id: "beacon",
    name: "Beacon",
    kind: "pictorial" as const,
    principle: "A lighthouse that is also an exclamation. Attention, then a point.",
    Mark: BeaconMark,
    hidden: "Lamp, tower, base: a warning you can read as a !",
  },
  {
    id: "arcady",
    name: "Arcady",
    kind: "combination" as const,
    principle: "A Roman arch that is also an A, and a path from A to Y.",
    Mark: ArcadyMark,
    hidden: "The gold curve starts under A and ends under Y.",
  },
  {
    id: "summit",
    name: "Summit",
    kind: "combination" as const,
    principle: "One peak, a shoulder, a flag, plus the name.",
    Mark: SummitMark,
    hidden: "The triangle on the peak is a flag. Mountains, effort, a word that matches.",
  },
  {
    id: "pact",
    name: "Pact",
    kind: "abstract" as const,
    principle: "Two links lock. A pact you can see with no word.",
    Mark: PactMark,
    hidden: "A horizontal link and a vertical link weave. Two things hold.",
  },
  {
    id: "north",
    name: "North Park Library",
    kind: "pictorial" as const,
    principle: "A leaf that hides a book. You fill in the rest.",
    Mark: NorthParkMark,
    hidden: "Figure-ground: the notch is an open book, the ink is a leaf.",
  },
  {
    id: "harbor",
    name: "Harbor Roast",
    kind: "wordmark" as const,
    principle: "Calm letters and one wave. Coffee, harbor, quiet.",
    Mark: HarborRoastMark,
    hidden: "The wave is the only picture. Type does the rest.",
  },
  {
    id: "quill",
    name: "Quill",
    kind: "wordmark" as const,
    principle: "A script so specific it is recognized without being sounded out.",
    Mark: QuillMark,
    hidden: "The feather is the voice. The letters ride beside it.",
  },
  {
    id: "mesa",
    name: "Mesa Museum",
    kind: "emblem" as const,
    principle: "The name is locked in a badge under a stepped mesa.",
    Mark: MesaMark,
    hidden: "A frame says official. The plateau says place.",
  },
];

/** @deprecated use LAB_BRANDS — kept so older imports keep compiling during the swap. */
export const FAMOUS = LAB_BRANDS;

export const FAKE_LOGOS = [
  {
    id: "burger",
    name: "Burger Blast",
    good: false,
    Mark: BurgerBlastMark,
    problems: ["too-many-fonts", "too-much-detail", "no-hierarchy", "hard-at-small"],
    diagnosis:
      "Four typefaces, a long tagline, stars, and a date. At the size of a app icon, nothing survives.",
  },
  {
    id: "niteowl",
    name: "NiteOwl Sleep Co.",
    good: false,
    Mark: NiteOwlMark,
    problems: ["wrong-color", "low-contrast", "off-brand"],
    diagnosis:
      "Sleep should feel calm. Neon lime on yellow shouts. Contrast is so low some letters vanish.",
  },
  {
    id: "speedy",
    name: "SpeedyBox Mail",
    good: false,
    Mark: SpeedyBoxMark,
    problems: ["too-much-detail", "hard-at-small", "no-hierarchy"],
    diagnosis:
      "A tiny van with windows will turn to mud on a shipping label. The name is a paragraph.",
  },
  {
    id: "pine",
    name: "Pine Soap",
    good: true,
    Mark: PineSoapMark,
    problems: [],
    diagnosis: "One tree, one typeface, one color. It still reads at a fingernail size.",
  },
  {
    id: "iron",
    name: "IRON GYM",
    good: false,
    Mark: IronGymMark,
    problems: ["effects", "too-many-fonts", "hard-at-small"],
    diagnosis:
      "Chrome, gold outlines, and slogans are decoration. They disappear in one-color print.",
  },
  {
    id: "north",
    name: "North Park Library",
    good: true,
    Mark: NorthParkMark,
    problems: [],
    diagnosis: "A leaf that hides a book. Two ideas, one shape. That is negative space doing work.",
  },
  {
    id: "zippy",
    name: "Zippy Cars",
    good: false,
    Mark: ZippyCarsMark,
    problems: ["low-contrast", "wrong-color"],
    diagnosis: "Pale yellow on white fails contrast. Drivers cannot read it on a sign.",
  },
  {
    id: "harbor",
    name: "Harbor Roast",
    good: true,
    Mark: HarborRoastMark,
    problems: [],
    diagnosis: "A wave under a calm word. Coffee, harbor, quiet. No extra clip art.",
  },
  {
    id: "star",
    name: "Star Tutors",
    good: false,
    Mark: StarTutorsMark,
    problems: ["too-many-fonts", "clipart", "no-hierarchy"],
    diagnosis: "A clip-art star plus three fonts plus a four-word slogan. Nothing is in charge.",
  },
  {
    id: "oak",
    name: "Oak & Ink",
    good: true,
    Mark: OakInkMark,
    problems: [],
    diagnosis: "The letter O is also a leaf. Type is the picture.",
  },
];
