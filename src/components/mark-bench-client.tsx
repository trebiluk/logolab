import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Canvas, FabricObject, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { checkDesign, type MarkPiece } from "@/lib/design-check";
import {
  MARK_PNG_NAME,
  MARK_SVG_NAME,
  shopPngName,
  stampSvg,
  triggerDownload,
} from "@/lib/mark-export";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";
import { APP_CHIP } from "@/lib/version";
import { recordScore } from "@/lib/who";
import { XP_BENCH, XP_SAVE } from "@/lib/xp";

const PAPER = "#ffffff";

const PLATE_NOTE =
  "pointer-events-none absolute left-0 right-0 top-2 z-10 mx-auto w-max max-w-[92%] rounded-md border border-line bg-white px-3 py-1 text-center text-sm font-medium text-ink";

const INKS = [
  { name: "Ink", hex: "#1c1a16" },
  { name: "Teal", hex: "#1f4f4a" },
  { name: "Brass", hex: "#c9a24a" },
  { name: "White", hex: "#ffffff" },
  { name: "Rust", hex: "#8f3a32" },
  { name: "Pine", hex: "#2c6a4a" },
] as const;

const HAND = {
  cornerSize: 16,
  touchCornerSize: 32,
  transparentCorners: false,
  cornerColor: "#faf8f3",
  cornerStrokeColor: "#1f4f4a",
  borderColor: "#1f4f4a",
  padding: 8,
  lockScalingFlip: true,
} as const;

function dropAt(c: Canvas, halfW: number, halfH: number): { left: number; top: number } {
  const w = c.getWidth();
  const h = c.getHeight();
  const n = c.getObjects().length;
  const col = n % 2;
  const row = Math.floor(n / 2) % 3;
  const rawLeft = col === 0 ? w * 0.34 : w * 0.66;
  const rawTop = h * (0.3 + row * 0.26);
  const minX = Math.min(w / 2, halfW + 8);
  const maxX = Math.max(w / 2, w - halfW - 8);
  const minY = Math.min(h / 2, halfH + 8);
  const maxY = Math.max(h / 2, h - halfH - 8);
  return {
    left: Math.min(maxX, Math.max(minX, rawLeft)),
    top: Math.min(maxY, Math.max(minY, rawTop)),
  };
}

function finishEditing(c: Canvas) {
  for (const obj of c.getObjects()) {
    if (isEditing(obj)) (obj as IText).exitEditing();
  }
  c.discardActiveObject();
  c.requestRenderAll();
}

function countPlate(objs: FabricObject[]) {
  let words = 0;
  for (const obj of objs) {
    if ("enterEditing" in obj) words += 1;
  }
  return { stamps: objs.length, words, shapes: Math.max(0, objs.length - words) };
}

function isEditing(obj: FabricObject): boolean {
  return "isEditing" in obj && Boolean((obj as IText).isEditing);
}

const HIT =
  "bench-hit h-11 min-h-11 min-w-11 whitespace-normal px-1 py-1 text-center text-[11px] leading-tight";

function pieceFrom(obj: FabricObject): MarkPiece {
  const text = "fontSize" in obj && "text" in obj;
  const fill = typeof obj.fill === "string" ? obj.fill : "#1c1a16";
  return {
    kind: text ? "text" : "shape",
    fontSize: text ? Number((obj as IText).fontSize || 0) * (obj.scaleY || 1) : 0,
    fill,
    left: obj.left ?? 0,
    top: obj.top ?? 0,
    width: obj.getScaledWidth?.() ?? 24,
    height: obj.getScaledHeight?.() ?? 24,
  };
}

export function MarkBench({ classic = false }: { classic?: boolean }) {
  const spanish = useProgress((s) => s.spanish);
  const say = (en: string, es: string) => (spanish ? es : en);
  const awardBench = useProgress((s) => s.awardBench);
  const awardDesign = useProgress((s) => s.awardDesign);
  const hostRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const hist = useRef<string[]>([]);
  const restoring = useRef(false);
  const inkRef = useRef<string>(INKS[0].hex);
  const [ink, setInk] = useState<string>(INKS[0].hex);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");
  const [savedName, setSavedName] = useState("");
  const [shipXp, setShipXp] = useState(0);
  const [stamps, setStamps] = useState(0);
  const [words, setWords] = useState(0);
  const [shapes, setShapes] = useState(0);
  const [pieces, setPieces] = useState<MarkPiece[]>([]);
  const [platePx, setPlatePx] = useState(0);
  const [preview32, setPreview32] = useState("");
  const [preview16, setPreview16] = useState("");
  const [shopName, setShopName] = useState(() => {
    try {
      return (sessionStorage.getItem("logolab-shop") ?? "").slice(0, 24);
    } catch {
      return "";
    }
  });
  const [dragging, setDragging] = useState(false);
  const [err, setErr] = useState("");
  const jobNameRef = useRef<HTMLInputElement>(null);
  const previewTimer = useRef(0);
  const scored = useRef(false);
  const openedAt = useRef(Date.now());

  inkRef.current = ink;

  function queuePreview() {
    window.clearTimeout(previewTimer.current);
    previewTimer.current = window.setTimeout(() => {
      const c = canvasRef.current;
      if (!c) return;
      const w = Math.max(1, c.getWidth());
      try {
        setPreview32(
          c.toDataURL({ format: "png", multiplier: 32 / w, enableRetinaScaling: false }),
        );
        setPreview16(
          c.toDataURL({ format: "png", multiplier: 16 / w, enableRetinaScaling: false }),
        );
      } catch {
        /* the plate may not be ready */
      }
    }, 40);
  }

  function syncPlate(objs: FabricObject[]) {
    const next = countPlate(objs);
    setStamps(next.stamps);
    setWords(next.words);
    setShapes(next.shapes);
    const c = canvasRef.current;
    if (c) setPlatePx(c.getWidth());
    setPieces(objs.map(pieceFrom));
    queuePreview();
  }

  function dropSaved() {
    setSavedName("");
    setShipXp(0);
    setNote((n) => (n.startsWith("Saved.") || n.startsWith("Guardado.") ? "" : n));
  }

  function pushHist() {
    const c = canvasRef.current;
    if (!c || restoring.current) return;
    dropSaved();
    const snap = JSON.stringify(c.toObject());
    const stack = hist.current;
    if (stack[stack.length - 1] === snap) return;
    stack.push(snap);
    if (stack.length > 12) stack.shift();
  }

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let dead = false;
    let canvas: Canvas | null = null;
    let onKey: ((e: KeyboardEvent) => void) | null = null;
    let ro: ResizeObserver | null = null;
    const blockMenu = (e: Event) => e.preventDefault();
    host.addEventListener("contextmenu", blockMenu);

    void (async () => {
      try {
        const { Canvas: FabricCanvas, InteractiveFabricObject } = await import("fabric");
        if (dead || !host.isConnected) return;
        if (document.fonts?.ready) await document.fonts.ready;
        if (dead || !host.isConnected) return;

        InteractiveFabricObject.ownDefaults.cornerSize = HAND.cornerSize;
        InteractiveFabricObject.ownDefaults.touchCornerSize = HAND.touchCornerSize;
        InteractiveFabricObject.ownDefaults.transparentCorners = false;
        InteractiveFabricObject.ownDefaults.cornerColor = HAND.cornerColor;
        InteractiveFabricObject.ownDefaults.cornerStrokeColor = HAND.cornerStrokeColor;
        InteractiveFabricObject.ownDefaults.borderColor = HAND.borderColor;

        const measure = () => {
          if (classic) {
            return Math.max(280, Math.min(448, Math.floor(host.clientWidth || 448)));
          }
          const slot = slotRef.current;
          const w = Math.max(0, (slot?.clientWidth || host.clientWidth || 320) - 52);
          const h = slot?.clientHeight || host.clientHeight || w;
          if (w < 80 || h < 80) return 0;
          return Math.max(112, Math.floor(Math.min(w, h)));
        };

        const size = measure() || 240;
        const el = document.createElement("canvas");
        host.replaceChildren(el);
        canvas = new FabricCanvas(el, {
          width: size,
          height: size,
          backgroundColor: PAPER,
          enableRetinaScaling: false,
          selection: true,
          preserveObjectStacking: true,
          allowTouchScrolling: false,
          targetFindTolerance: 8,
        });
        if (dead) {
          void canvas.dispose();
          canvas = null;
          return;
        }
        canvasRef.current = canvas;
        const snap = JSON.stringify(canvas.toObject());
        hist.current = [snap];
        canvas.on("before:transform", () => {
          const c = canvasRef.current;
          if (!c || restoring.current) return;
          setDragging(true);
          setSavedName("");
          setShipXp(0);
          setNote((n) => (n.startsWith("Saved.") || n.startsWith("Guardado.") ? "" : n));
          const next = JSON.stringify(c.toObject());
          const stack = hist.current;
          if (stack[stack.length - 1] === next) return;
          stack.push(next);
          if (stack.length > 12) stack.shift();
        });
        canvas.on("mouse:up", () => {
          if (dead) return;
          setDragging(false);
          syncPlate(canvasRef.current?.getObjects() ?? []);
        });
        canvas.on("object:added", () => {
          if (!dead) syncPlate(canvasRef.current?.getObjects() ?? []);
        });
        canvas.on("object:removed", () => {
          if (!dead) syncPlate(canvasRef.current?.getObjects() ?? []);
        });
        canvas.on("text:changed", () => {
          if (dead || restoring.current) return;
          setSavedName("");
          setShipXp(0);
          setNote((n) => (n.startsWith("Saved.") || n.startsWith("Guardado.") ? "" : n));
          syncPlate(canvasRef.current?.getObjects() ?? []);
        });
        canvas.on("text:editing:entered", (opt) => {
          const c = canvasRef.current;
          if (!c || restoring.current) return;
          const next = JSON.stringify(c.toObject());
          const stack = hist.current;
          if (stack[stack.length - 1] === next) return;
          stack.push(next);
          if (stack.length > 12) stack.shift();
          const ta = (opt.target as IText | undefined)?.hiddenTextarea;
          if (ta) {
            ta.style.fontSize = "16px";
            ta.focus({ preventScroll: true });
          }
        });

        onKey = (e: KeyboardEvent) => {
          const c = canvasRef.current;
          if (!c) return;
          const target = e.target as HTMLElement | null;
          if (
            target &&
            target.tagName !== "BODY" &&
            (target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.isContentEditable)
          ) {
            return;
          }
          if (e.key !== "Delete" && e.key !== "Backspace") return;
          const objs = c.getActiveObjects();
          if (objs.length === 0 || objs.some(isEditing)) return;
          e.preventDefault();
          const next = JSON.stringify(c.toObject());
          const stack = hist.current;
          if (stack[stack.length - 1] !== next) {
            stack.push(next);
            if (stack.length > 12) stack.shift();
          }
          c.remove(...objs);
          c.discardActiveObject();
          c.requestRenderAll();
        };
        window.addEventListener("keydown", onKey);
        if (dead) {
          window.removeEventListener("keydown", onKey);
          void canvas.dispose();
          canvas = null;
          return;
        }
        if (!classic) {
          let last = canvas.getWidth();
          const apply = () => {
            const c = canvasRef.current;
            if (dead || !c) return;
            const next = measure();
            if (!next || next === last) return;
            const factor = last > 0 ? next / last : 1;
            last = next;
            c.setDimensions({ width: next, height: next });
            if (c.getObjects().length && Math.abs(factor - 1) > 0.02) {
              for (const obj of c.getObjects()) {
                obj.set({
                  left: (obj.left || 0) * factor,
                  top: (obj.top || 0) * factor,
                  scaleX: (obj.scaleX || 1) * factor,
                  scaleY: (obj.scaleY || 1) * factor,
                });
                obj.setCoords();
              }
            }
            c.requestRenderAll();
            setPlatePx(next);
            setPieces(c.getObjects().map(pieceFrom));
            queuePreview();
          };
          ro = new ResizeObserver(() => apply());
          if (slotRef.current) ro.observe(slotRef.current);
          apply();
        }
        setReady(true);
        setPlatePx(canvas.getWidth());
        queuePreview();
      } catch (e) {
        if (!dead) {
          setErr(e instanceof Error ? e.message : "The press did not open.");
        }
      }
    })();

    return () => {
      dead = true;
      setReady(false);
      if (onKey) window.removeEventListener("keydown", onKey);
      host.removeEventListener("contextmenu", blockMenu);
      ro?.disconnect();
      canvasRef.current = null;
      if (canvas) void canvas.dispose();
      host.replaceChildren();
    };
  }, [classic]);

  async function addShape(kind: "square" | "circle" | "triangle" | "bar") {
    const c = canvasRef.current;
    if (!c) return;
    pushHist();
    const { Circle, Rect, Triangle } = await import("fabric");
    const w = c.getWidth();
    const half =
      kind === "circle"
        ? Math.round(w * 0.16)
        : kind === "bar"
          ? { x: Math.round(w * 0.28), y: Math.round(w * 0.06) }
          : kind === "triangle"
            ? { x: Math.round(w * 0.18), y: Math.round(w * 0.16) }
            : Math.round(w * 0.17);
    const halfW = typeof half === "number" ? half : half.x;
    const halfH = typeof half === "number" ? half : half.y;
    const { left, top } = dropAt(c, halfW, halfH);
    const fill = inkRef.current;
    const common = { left, top, originX: "center" as const, originY: "center" as const, fill, ...HAND };
    const obj =
      kind === "circle"
        ? new Circle({ ...common, radius: Math.round(w * 0.16) })
        : kind === "triangle"
          ? new Triangle({
              ...common,
              width: Math.round(w * 0.36),
              height: Math.round(w * 0.32),
            })
          : kind === "bar"
            ? new Rect({
                ...common,
                width: Math.round(w * 0.56),
                height: Math.round(w * 0.12),
                rx: 8,
                ry: 8,
              })
            : new Rect({
                ...common,
                width: Math.round(w * 0.34),
                height: Math.round(w * 0.34),
                rx: 8,
                ry: 8,
              });
    c.add(obj);
    c.setActiveObject(obj);
    c.requestRenderAll();
    setNote("");
  }

  async function addWord(display: boolean, preset?: string) {
    const c = canvasRef.current;
    if (!c) return;
    const label = (preset ?? (display ? "MARK" : "name")).trim().slice(0, 24);
    if (!label) return;
    pushHist();
    const { IText: FabricText } = await import("fabric");
    const w = c.getWidth();
    const big = display && label.length <= 10;
    const { left, top } = dropAt(
      c,
      big ? Math.round(w * 0.28) : Math.round(w * 0.16),
      big ? Math.round(w * 0.1) : Math.round(w * 0.07),
    );
    const text = new FabricText(label, {
      left,
      top,
      originX: "center",
      originY: "center",
      fill: inkRef.current,
      fontFamily: big
        ? "Fraunces, Georgia, serif"
        : '"Source Sans 3", sans-serif',
      fontSize: big ? Math.round(w * 0.18) : Math.round(w * 0.1),
      fontWeight: 650,
      textAlign: "center",
      selectionColor: "rgba(31, 79, 74, 0.28)",
      ...HAND,
    });
    c.add(text);
    c.setActiveObject(text);
    c.requestRenderAll();
    if (!preset) {
      requestAnimationFrame(() => {
        if (canvasRef.current !== c) return;
        text.enterEditing();
        text.selectAll();
      });
    }
    setNote("");
  }

  function typeWord() {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    const text =
      active && "enterEditing" in active
        ? (active as IText)
        : ([...c.getObjects()].reverse().find((obj) => "enterEditing" in obj) as IText | undefined);
    if (!text) {
      setNote(spanish ? "Agrega una palabra primero." : "Add a word first.");
      return;
    }
    c.setActiveObject(text);
    if (!text.isEditing) text.enterEditing();
    text.selectAll();
    text.hiddenTextarea?.focus({ preventScroll: true });
    c.requestRenderAll();
    setNote("");
  }

  function paint(hex: string) {
    setInk(hex);
    const c = canvasRef.current;
    if (!c) return;
    const objs = c.getActiveObjects();
    if (objs.length === 0) return;
    pushHist();
    for (const obj of objs) obj.set("fill", hex);
    c.requestRenderAll();
    commitPlate();
    setNote(
      hex === "#ffffff"
        ? say("White ink shows on top of a color.", "La tinta blanca se ve sobre un color.")
        : "",
    );
  }

  function layer(dir: "up" | "down") {
    const c = canvasRef.current;
    if (!c) return;
    const selected = c.getActiveObjects();
    if (selected.length === 0) {
      setNote(spanish ? "Selecciona una forma primero." : "Select a shape first.");
      return;
    }
    for (const obj of selected) {
      if (isEditing(obj)) (obj as IText).exitEditing();
    }
    const objs = c.getActiveObjects();
    if (objs.length === 0) return;
    pushHist();
    const ordered = [...objs].sort(
      (a, b) => c.getObjects().indexOf(a) - c.getObjects().indexOf(b),
    );
    const list = dir === "up" ? [...ordered].reverse() : ordered;
    for (const obj of list) {
      if (dir === "up") c.bringObjectForward(obj);
      else c.sendObjectBackwards(obj);
    }
    c.requestRenderAll();
    commitPlate();
    setNote("");
  }

  function selectedObjects(): FabricObject[] {
    const c = canvasRef.current;
    if (!c) return [];
    const objs = c.getActiveObjects();
    for (const obj of objs) {
      if (isEditing(obj)) (obj as IText).exitEditing();
    }
    return c.getActiveObjects();
  }

  function needSelection(): FabricObject[] | null {
    const objs = selectedObjects();
    if (objs.length === 0) {
      setNote(spanish ? "Selecciona una forma primero." : "Select a shape first.");
      return null;
    }
    return objs;
  }

  async function duplicate() {
    const c = canvasRef.current;
    const objs = needSelection();
    if (!c || !objs) return;
    pushHist();
    let last: FabricObject | null = null;
    for (const obj of objs) {
      const clone = await obj.clone();
      clone.set({
        left: (clone.left ?? 0) + 28,
        top: (clone.top ?? 0) + 28,
      });
      c.add(clone);
      last = clone;
    }
    if (last) c.setActiveObject(last);
    c.requestRenderAll();
    commitPlate();
    setNote("");
  }

  function rotateSelected() {
    const c = canvasRef.current;
    const objs = needSelection();
    if (!c || !objs) return;
    pushHist();
    for (const obj of objs) {
      obj.rotate(((obj.angle || 0) + 15) % 360);
      obj.setCoords();
    }
    c.requestRenderAll();
    commitPlate();
    setNote("");
  }

  function commitPlate() {
    const c = canvasRef.current;
    if (!c) return;
    syncPlate(c.getObjects());
  }

  function centerSelected() {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (!active) {
      setNote(spanish ? "Selecciona una forma primero." : "Select a shape first.");
      return;
    }
    if (isEditing(active)) (active as IText).exitEditing();
    pushHist();
    const target = c.getActiveObject() || active;
    target.set({ left: c.getWidth() / 2, top: c.getHeight() / 2 });
    target.setCoords();
    c.setActiveObject(target);
    c.requestRenderAll();
    setNote("");
    commitPlate();
  }

  function scaleSelected(factor: number) {
    const c = canvasRef.current;
    const objs = needSelection();
    if (!c || !objs) return;
    pushHist();
    for (const obj of objs) {
      const next = Math.min(6, Math.max(0.25, (obj.scaleX || 1) * factor));
      obj.set({ scaleX: next, scaleY: next });
      obj.setCoords();
    }
    c.requestRenderAll();
    commitPlate();
    setNote("");
  }

  function toggleOutline() {
    const c = canvasRef.current;
    const objs = needSelection();
    if (!c || !objs) return;
    pushHist();
    for (const obj of objs) {
      const on = (obj.strokeWidth ?? 0) > 0 && Boolean(obj.stroke);
      obj.set(
        on
          ? { stroke: "", strokeWidth: 0 }
          : { stroke: inkRef.current, strokeWidth: 8, strokeUniform: true },
      );
      obj.setCoords();
    }
    c.requestRenderAll();
    commitPlate();
    setNote("");
  }

  function removeSelected() {
    const c = canvasRef.current;
    if (!c) return;
    const objs = c.getActiveObjects();
    if (objs.length === 0 || objs.some(isEditing)) return;
    pushHist();
    c.remove(...objs);
    c.discardActiveObject();
    c.requestRenderAll();
  }

  async function undo() {
    const c = canvasRef.current;
    const prev = hist.current.pop();
    if (!c || !prev) return;
    restoring.current = true;
    try {
      await c.loadFromJSON(prev);
      c.backgroundColor = PAPER;
      c.requestRenderAll();
    } finally {
      restoring.current = false;
    }
    setNote("");
    syncPlate(c.getObjects());
  }

  function clearBoard() {
    const c = canvasRef.current;
    if (!c) return;
    if (
      !window.confirm(
        say(
          "Clear this mark? It only exists on this screen.",
          "¿Borrar este sello? Solo está en esta pantalla.",
        ),
      )
    ) {
      return;
    }
    scored.current = false;
    pushHist();
    c.remove(...c.getObjects());
    c.discardActiveObject();
    c.backgroundColor = PAPER;
    c.requestRenderAll();
    setNote("");
    setStamps(0);
    setWords(0);
    setShapes(0);
  }

  async function ship(kind: "svg" | "png") {
    const c = canvasRef.current;
    if (!c) return;
    if (c.getObjects().length === 0) {
      setNote(
        spanish
          ? "Primero agrega una palabra o una forma."
          : "Add a word or a shape first.",
      );
      return;
    }
    finishEditing(c);
    if (kind === "svg") {
      const blob = new Blob([stampSvg(c.toSVG())], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      triggerDownload(MARK_SVG_NAME, url);
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      markShipped(MARK_SVG_NAME);
    } else {
      const blob = await c.toBlob({
        format: "png",
        multiplier: 2,
        enableRetinaScaling: false,
      });
      if (!blob) {
        setNote(spanish ? "No se pudo guardar el PNG." : "Could not save the PNG.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const extra = shopPngName(shopName);
      triggerDownload(MARK_PNG_NAME, url);
      if (extra) triggerDownload(extra, url);
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      markShipped(extra ? `${MARK_PNG_NAME} and ${extra}` : MARK_PNG_NAME);
    }
  }

  function liveReport() {
    const c = canvasRef.current;
    if (!c) return checkDesign(pieces, platePx || 1, platePx || 1, spanish);
    return checkDesign(c.getObjects().map(pieceFrom), c.getWidth(), c.getHeight(), spanish);
  }

  function markShipped(name: string) {
    const fresh = !useProgress.getState().benchAwarded;
    const xp = fresh ? XP_SAVE : 0;
    setShipXp(xp);
    setSavedName(name);
    const bonus = xp ? ` +${xp} XP.` : "";
    const both = name.includes(" and ");
    const named = both ? name.replace(" and ", " y ") : name;
    setNote(
      spanish
        ? `Guardado. ${named} ${both ? "quedaron" : "quedó"} en este Chromebook.${bonus}`
        : `Saved. ${name} ${both ? "are" : "is"} on this Chromebook.${bonus}`,
    );
    awardBench();
    postFinish(liveReport().stars);
  }

  function postFinish(passes: number) {
    if (scored.current) return;
    const ok = recordScore(passes, Date.now() - openedAt.current);
    if (ok) scored.current = true;
  }

  function runCheck() {
    const result = liveReport();
    if (result.stars >= 3) {
      const fresh = !useProgress.getState().designAwarded;
      awardDesign();
      postFinish(result.stars);
      if (fresh) {
        setNote(
          say(
            `3-star mark. +${XP_BENCH} XP.`,
            `Marca de 3 estrellas. +${XP_BENCH} XP.`,
          ),
        );
      }
      return;
    }
    setNote(
      say(
        `${result.stars}/4 stars. Fix a red line.`,
        `${result.stars}/4 estrellas. Arregla una línea roja.`,
      ),
    );
  }

  useEffect(() => {
    try {
      sessionStorage.setItem("logolab-shop", shopName);
    } catch {
      /* this tab may block storage */
    }
  }, [shopName]);

  useEffect(() => {
    const c = canvasRef.current;
    const el = c?.getSelectionElement?.() ?? c?.upperCanvasEl;
    if (!el) return;
    const empty = words + shapes === 0;
    el.setAttribute("role", "img");
    el.setAttribute(
      "aria-label",
      spanish
        ? empty
          ? "Placa blanca. Vacía."
          : `Placa blanca. ${words} ${words === 1 ? "palabra" : "palabras"}, ${shapes} ${shapes === 1 ? "forma" : "formas"}.`
        : empty
          ? "White plate. Empty."
          : `White plate. ${words} ${words === 1 ? "word" : "words"}, ${shapes} ${shapes === 1 ? "shape" : "shapes"}.`,
    );
  }, [words, shapes, spanish, ready]);

  useEffect(() => {
    if (!ready) return;
    const job = new URLSearchParams(window.location.search).get("job");
    if (job === "1") jobNameRef.current?.focus();
  }, [ready]);

  const report = useMemo(
    () => checkDesign(pieces, platePx || 1, platePx || 1, spanish),
    [pieces, platePx, spanish],
  );

  const plateStyle =
    !classic && platePx > 0 ? { width: platePx, height: platePx } : undefined;

  return (
    <div
      className={classic ? "mt-4 flex flex-col gap-4 lg:flex-row lg:items-start" : "bench-fit"}
      data-layout={classic ? "classic" : "bench"}
    >
      <div
        ref={slotRef}
        className={classic ? "min-w-0 flex-1 lg:sticky lg:top-16" : "bench-plate"}
      >
        {classic ? null : (
          <div className="bench-previews">
            <img
              alt={say("32px preview", "Vista a 32px")}
              width={32}
              height={32}
              src={preview32 || undefined}
              className="size-8 border border-line bg-white"
            />
            <img
              alt={say("16px preview", "Vista a 16px")}
              width={16}
              height={16}
              src={preview16 || undefined}
              className="size-4 border border-line bg-white"
            />
          </div>
        )}
        <div className={classic ? "relative mx-auto w-full max-w-md" : "relative shrink-0"} style={plateStyle}>
          <div
            ref={hostRef}
            aria-describedby="plate-status"
            className="mark-press w-full overflow-hidden rounded-xl border border-line bg-white"
            style={plateStyle}
          />
          <span className="plate-chip" data-plate-chip="">
            {APP_CHIP}
          </span>
          {ready && !dragging && stamps === 0 && !err ? (
            <p className={PLATE_NOTE} aria-hidden="true">
              {say(
                "Foxfire Camp: 1 word + 1 shape, 2 colors",
                "Foxfire Camp: 1 palabra + 1 forma, 2 colores",
              )}
            </p>
          ) : null}
          {ready && !dragging && savedName && report.stars >= 3 && !err ? (
            <p className={PLATE_NOTE} aria-hidden="true">
              {say(
                `3-star mark.${shipXp ? ` +${shipXp} XP` : ""}`,
                `Marca de 3 estrellas.${shipXp ? ` +${shipXp} XP` : ""}`,
              )}
            </p>
          ) : null}
          {ready && !dragging && savedName && report.stars < 3 && !err ? (
            <p className={PLATE_NOTE} aria-hidden="true">
              {say(
                `Saved.${shipXp ? ` +${shipXp} XP` : ""}`,
                `Guardado.${shipXp ? ` +${shipXp} XP` : ""}`,
              )}
            </p>
          ) : null}
          {ready && !dragging && stamps === 1 && !savedName && !err ? (
            <p className={PLATE_NOTE} aria-hidden="true">
              {say("It’s on the plate.", "Ya está en la placa.")}
            </p>
          ) : null}
        </div>
        {classic && !ready && !err ? (
          <p className="mt-3 text-center text-sm text-muted">Opening the press…</p>
        ) : null}
        {err ? (
          <p className={classic ? "mt-3 text-center text-sm text-bad" : "sr-only"} role="alert">
            {err}
          </p>
        ) : null}
      </div>

      <div className={classic ? "relative flex w-full shrink-0 flex-col gap-2 lg:w-80" : "bench-dock"}>
        <div className={classic ? "flex flex-col gap-2" : "bench-tools"}>
          <div className={classic ? "grid grid-cols-2 gap-2" : "contents"}>
            <Button
              type="button"
              disabled={!ready}
              title={stamps === 0 ? say("Do this first", "Haz esto primero") : undefined}
              className={cn(HIT, stamps === 0 && "ring-2 ring-ink ring-offset-2 ring-offset-paper")}
              onClick={() => void addWord(true)}
            >
              {say("Big word", "Grande")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={() => void addWord(false)}>
              {say("Plain word", "Normal")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={() => void addShape("square")}>
              {say("Square", "Cuadrado")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={() => void addShape("circle")}>
              {say("Circle", "Círculo")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={() => void addShape("triangle")}>
              {say("Triangle", "Triángulo")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={() => void addShape("bar")}>
              {say("Bar", "Barra")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={typeWord}>
              {say("Type word", "Escribir")}
            </Button>
          </div>

          <div className={classic ? "flex flex-wrap gap-2" : "contents"} role="group" aria-label={say("Ink", "Tinta")}>
            {INKS.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                disabled={!ready}
                aria-label={swatch.name}
                aria-pressed={ink === swatch.hex}
                onClick={() => paint(swatch.hex)}
                className={cn(
                  "ink-swatch size-11 min-h-11 min-w-11 rounded-md border disabled:opacity-50",
                  swatch.hex === "#ffffff" ? "border-2 border-ink/35" : "border-line",
                  ink === swatch.hex && "ring-2 ring-teal ring-offset-2 ring-offset-paper",
                )}
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>

          <div className="bench-shop">
            <label className="min-w-0 flex-1">
              <span className="sr-only">{say("Shop name", "Nombre de la tienda")}</span>
              <input
                ref={jobNameRef}
                value={shopName}
                maxLength={24}
                onChange={(e) => setShopName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  void addWord(true, shopName);
                }}
                placeholder={say("Shop name", "Nombre de la tienda")}
                aria-label={say("Shop name", "Nombre de la tienda")}
              />
            </label>
            <Button
              type="button"
              className={cn(HIT, "shrink-0")}
              disabled={!ready || shopName.trim().length < 2}
              onClick={() => void addWord(true, shopName)}
            >
              {say("Stamp", "Estampar")}
            </Button>
          </div>

          <div className={classic ? "grid grid-cols-3 gap-2" : "contents"}>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={() => void duplicate()}>
              {say("Duplicate", "Duplicar")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={rotateSelected}>
              {say("Rotate", "Girar")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={toggleOutline}>
              {say("Outline", "Contorno")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={() => scaleSelected(1.15)}>
              {say("Bigger", "Más")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={() => scaleSelected(1 / 1.15)}>
              {say("Smaller", "Menos")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={centerSelected}>
              {say("Center", "Centro")}
            </Button>
          </div>

          <div className={classic ? "grid grid-cols-2 gap-2" : "contents"}>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={() => layer("up")}>
              {say("Layer up", "Capa arriba")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={() => layer("down")}>
              {say("Layer down", "Capa abajo")}
            </Button>
          </div>

          <div className={classic ? "grid grid-cols-3 gap-2" : "contents"}>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={removeSelected}>
              {say("Delete", "Borrar")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={() => void undo()}>
              {say("Undo", "Deshacer")}
            </Button>
            <Button type="button" variant="outline" className={HIT} disabled={!ready} onClick={clearBoard}>
              {say("Clear", "Limpiar")}
            </Button>
          </div>

          <div className={classic ? "grid grid-cols-3 gap-2" : "contents"}>
            <Button type="button" className={HIT} disabled={!ready} onClick={runCheck} data-action="check">
              {say("Check", "Revisar")} {report.stars}/4
            </Button>
            <Button type="button" className={HIT} disabled={!ready} onClick={() => ship("png")} data-action="save-png">
              {say("Save PNG", "Guardar PNG")}
            </Button>
            <Button type="button" variant="secondary" className={HIT} disabled={!ready} onClick={() => ship("svg")}>
              {say("Save SVG", "Guardar SVG")}
            </Button>
          </div>
        </div>

        <ul className="design-checks" id="plate-status" role="status" aria-live="polite" aria-atomic="true">
          {report.checks.map((check) => (
            <li key={check.id} data-pass={check.pass ? "true" : "false"} data-check={check.id}>
              {check.line}
            </li>
          ))}
        </ul>
        {note ? <p className="sr-only">{note}</p> : null}
        {classic ? (
          <p className="text-sm text-ink-soft">
            {say("I chose this because ______.", "Elegí esto porque ______.")}{" "}
            <Link
              to="/printables/$id"
              params={{ id: "design-brief" }}
              className="inline-flex min-h-11 items-center font-medium text-teal underline-offset-4 hover:underline"
            >
              {say("Paper brief", "Hoja de papel")}
            </Link>
          </p>
        ) : null}
        {classic ? (
          <p className="truncate text-xs text-muted">
            {say("On this Chromebook. Fabric.js is MIT.", "En este Chromebook. Fabric.js es MIT.")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
