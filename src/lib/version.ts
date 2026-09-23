/** One string. Chip = changelog header = About. Live looks like LL 1.2.2. */
export const APP_CHIP = "LL 1.2.2";

export const CHANGELOG: { chip: string; when: string; notes: string[] }[] = [
  {
    chip: "LL 1.2.2",
    when: "2026-09-23",
    notes: [
      "What’s new: polish — stamps stay on the plate, and the XP slip sits under the header so it doesn’t cover Save.",
    ],
  },
  {
    chip: "LL 1.2.1",
    when: "2026-09-22",
    notes: [
      "What’s new: polish — new stamps land beside the last one, and Save finishes the word first.",
    ],
  },
  {
    chip: "LL 1.2.0",
    when: "2026-09-22",
    notes: [
      "Mark bench. Text and shapes with Fabric.js (MIT). See LICENSE and NOTICE.",
      "Save SVG or PNG on this Chromebook. Nothing is uploaded.",
    ],
  },
  {
    chip: "LL 1.1.1",
    when: "2026-09-22",
    notes: [
      "Chromebook pass. Fonts live on this door — no Google Fonts fetch.",
      "Header taps are 44px. Blur is off so mid and low Chromebooks do not hitch.",
    ],
  },
  {
    chip: "LL 1.1.0",
    when: "2026-09-20",
    notes: [
      "Chip on the floor. English changelog on the teacher pad.",
      "XP writes are atomic — a closed tab cannot save a lesson without its XP.",
      "Hall names are alias or first name only. Never a last name.",
      "Warmup uses the Solvay school day (America/New_York), not the Chromebook’s clock zone.",
      "New floor station: Optical QC — which mark still reads at stamp size.",
      "Press ? for keys. Enter replays a finished studio. Voices wait for Chromebook speech.",
      "Factory ranks and punch-card brag board. Grade is not Bank: XP is brag, not a 3/2/1.",
    ],
  },
  {
    chip: "LL 1.0.0",
    when: "2026-09-18",
    notes: [
      "BertyBot’s LogoLab: six stations, shop-floor games, joke cousins, paper copies, XP on this device.",
      "House die is a stencil B. Real trademarks stay in memory, not on screen.",
    ],
  },
];

export function schoolDay(at = new Date()): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const p = Object.fromEntries(fmt.formatToParts(at).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

/** Projector / hall: first token only, 18 chars. No roster ids. */
export function aliasForBoard(raw: string): string {
  const t = raw.trim().replace(/[\u0000-\u001f]/g, "").replace(/\s+/g, " ");
  if (!t) return "";
  return (t.split(" ")[0] ?? "").slice(0, 18);
}

export function floorDump(p: {
  xp: number;
  highScore: number;
  completedLessons: string[];
  activityDone: string[];
  warmupDay: string;
  hall: { name: string }[];
}): string {
  return [
    APP_CHIP,
    `xp=${p.xp}`,
    `high=${p.highScore}`,
    `stations=${p.completedLessons.length}`,
    `floor=${p.activityDone.join(",") || "—"}`,
    `warmup=${p.warmupDay || "—"}`,
    `hallPosts=${p.hall.length}`,
  ].join("\n");
}
