/** Live design checks for the mark bench. Pure — no canvas, no DOM. */

export type MarkPiece = {
  kind: "text" | "shape";
  /** Rendered type size in plate pixels (fontSize × scale). 0 for shapes. */
  fontSize: number;
  fill: string;
  /** Center of the object, in plate pixels. */
  left: number;
  top: number;
  width: number;
  height: number;
};

export type DesignCheck = {
  id: "reads" | "contrast" | "balance" | "shape";
  pass: boolean;
  line: string;
};

export type DesignReport = {
  stars: number;
  checks: DesignCheck[];
};

const PLATE = "#ffffff";
const MIN_RATIO = 4.5;

function say(spanish: boolean, en: string, es: string): string {
  return spanish ? es : en;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG contrast of ink against the plate (default white). */
export function contrastRatio(ink: string, backing = PLATE): number {
  const a = relativeLuminance(ink);
  const b = relativeLuminance(backing);
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

function readsCheck(pieces: MarkPiece[], plateH: number, spanish: boolean): DesignCheck {
  const words = pieces.filter((p) => p.kind === "text" && p.fontSize > 0);
  if (words.length === 0) {
    return {
      id: "reads",
      pass: false,
      line: say(spanish, "Add a word — try Big word.", "Agrega una palabra — prueba Grande."),
    };
  }
  const biggest = Math.max(...words.map((w) => w.fontSize));
  const need = plateH / 6;
  if (biggest < need) {
    return {
      id: "reads",
      pass: false,
      line: say(spanish, "Too thin at 16px — try Bigger.", "Muy fino a 16px — prueba Grande."),
    };
  }
  return {
    id: "reads",
    pass: true,
    line: say(spanish, "Reads at 16px.", "Se lee a 16px."),
  };
}

function contrastCheck(pieces: MarkPiece[], spanish: boolean): DesignCheck {
  if (pieces.length === 0) {
    return {
      id: "contrast",
      pass: false,
      line: say(spanish, "Add ink — try Ink or Teal.", "Agrega tinta — prueba Tinta o Verde."),
    };
  }
  let worst = Infinity;
  let worstFill = "";
  for (const piece of pieces) {
    const ratio = contrastRatio(piece.fill);
    if (ratio < worst) {
      worst = ratio;
      worstFill = piece.fill.toLowerCase();
    }
  }
  if (worst < MIN_RATIO) {
    const line =
      worstFill === "#ffffff"
        ? say(spanish, "White-on-white — try Ink or Teal.", "Blanco sobre blanco — prueba Tinta o Verde.")
        : say(spanish, "Too light on white — try Ink or Teal.", "Muy claro sobre blanco — prueba Tinta o Verde.");
    return { id: "contrast", pass: false, line };
  }
  return {
    id: "contrast",
    pass: true,
    line: say(spanish, "Ink clears the white plate.", "La tinta se lee sobre el blanco."),
  };
}

function balanceCheck(
  pieces: MarkPiece[],
  plateW: number,
  plateH: number,
  spanish: boolean,
): DesignCheck {
  if (pieces.length === 0 || plateW <= 0 || plateH <= 0) {
    return {
      id: "balance",
      pass: false,
      line: say(spanish, "Center the mark.", "Centra la marca."),
    };
  }
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (const piece of pieces) {
    const a = Math.max(1, piece.width * piece.height);
    area += a;
    cx += piece.left * a;
    cy += piece.top * a;
  }
  cx /= area;
  cy /= area;
  const dx = Math.abs(cx - plateW / 2) / plateW;
  const dy = Math.abs(cy - plateH / 2) / plateH;
  if (dx <= 0.1 && dy <= 0.1) {
    return {
      id: "balance",
      pass: true,
      line: say(spanish, "Balanced on the plate.", "Equilibrado en la placa."),
    };
  }
  const xs = pieces.map((p) => p.left);
  const ys = pieces.map((p) => p.top);
  const spreadX = (Math.max(...xs) - Math.min(...xs)) / plateW;
  const spreadY = (Math.max(...ys) - Math.min(...ys)) / plateH;
  const meanX = xs.reduce((sum, n) => sum + n, 0) / xs.length;
  const meanY = ys.reduce((sum, n) => sum + n, 0) / ys.length;
  const near = (value: number, size: number) => Math.abs(value - size / 2) / size <= 0.1;
  const parked = (value: number, size: number) => value / size <= 0.2 || value / size >= 0.8;
  const aligned =
    (spreadX <= 0.08 && (near(meanX, plateW) || parked(meanX, plateW))) ||
    (spreadY <= 0.08 && (near(meanY, plateH) || parked(meanY, plateH)));
  if (aligned) {
    return {
      id: "balance",
      pass: true,
      line: say(spanish, "Deliberately aligned.", "Alineado a propósito."),
    };
  }
  return {
    id: "balance",
    pass: false,
    line: say(spanish, "Off center — try Center.", "Fuera de centro — prueba Centro."),
  };
}

function shapeCheck(pieces: MarkPiece[], spanish: boolean): DesignCheck {
  if (pieces.length === 0) {
    return {
      id: "shape",
      pass: false,
      line: say(spanish, "Add a simple mark.", "Agrega una marca simple."),
    };
  }
  const colors = new Set(pieces.map((p) => p.fill.trim().toLowerCase()));
  const tooMany = pieces.length > 3;
  const tooColor = colors.size > 2;
  if (tooMany && tooColor) {
    return {
      id: "shape",
      pass: false,
      line: say(
        spanish,
        "More than 3 objects and 2 colors — simple wins.",
        "Más de 3 objetos y 2 colores — lo simple gana.",
      ),
    };
  }
  if (tooMany) {
    return {
      id: "shape",
      pass: false,
      line: say(spanish, "More than 3 objects — simple wins.", "Más de 3 objetos — lo simple gana."),
    };
  }
  if (tooColor) {
    return {
      id: "shape",
      pass: false,
      line: say(spanish, "More than 2 colors — simple wins.", "Más de 2 colores — lo simple gana."),
    };
  }
  return {
    id: "shape",
    pass: true,
    line: say(spanish, "Simple: 3 objects and 2 colors max.", "Simple: 3 objetos y 2 colores máximo."),
  };
}

export function checkDesign(
  pieces: MarkPiece[],
  plateW: number,
  plateH: number,
  spanish = false,
): DesignReport {
  const checks = [
    readsCheck(pieces, plateH, spanish),
    contrastCheck(pieces, spanish),
    balanceCheck(pieces, plateW, plateH, spanish),
    shapeCheck(pieces, spanish),
  ];
  return { stars: checks.filter((c) => c.pass).length, checks };
}
