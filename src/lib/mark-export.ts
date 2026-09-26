/** Local file names. Nothing here is uploaded. */
export const MARK_SVG_NAME = "logolab-mark.svg";
export const MARK_PNG_NAME = "logolab-mark.png";

/** A second local PNG name. Never replaces logolab-mark.png. */
export function shopPngName(shop: string): string | null {
  const stem = shop
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  if (stem.length < 2 || stem === "logolab-mark") return null;
  return `${stem}.png`;
}

export const MARK_SVG_NOTE =
  "<!-- LogoLab mark. Saved on this Chromebook. Not uploaded. Fabric.js is MIT — see NOTICE. -->";

/** Keep the Fabric attribution inside the file the student downloads. */
export function stampSvg(svg: string): string {
  const at = svg.indexOf("<svg");
  if (at === -1) return `${MARK_SVG_NOTE}\n${svg}`;
  return `${svg.slice(0, at)}${MARK_SVG_NOTE}\n${svg.slice(at)}`;
}

export function triggerDownload(filename: string, href: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
