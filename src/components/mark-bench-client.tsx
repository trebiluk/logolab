import { useEffect, useRef, useState } from "react";
import type { Canvas, FabricObject, IText } from "fabric";
import { Button } from "@/components/ui/button";
import {
  MARK_PNG_NAME,
  MARK_SVG_NAME,
  stampSvg,
  triggerDownload,
} from "@/lib/mark-export";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

const PAPER = "#ffffff";

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

function isEditing(obj: FabricObject): boolean {
  return "isEditing" in obj && Boolean((obj as IText).isEditing);
}

export function MarkBench() {
  const spanish = useProgress((s) => s.spanish);
  const say = (en: string, es: string) => (spanish ? es : en);
  const awardBench = useProgress((s) => s.awardBench);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const hist = useRef<string[]>([]);
  const restoring = useRef(false);
  const inkRef = useRef<string>(INKS[0].hex);
  const [ink, setInk] = useState<string>(INKS[0].hex);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");
  const [savedName, setSavedName] = useState("");
  const [stamps, setStamps] = useState(0);
  const [err, setErr] = useState("");

  inkRef.current = ink;

  function pushHist() {
    const c = canvasRef.current;
    if (!c || restoring.current) return;
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

        const size = Math.max(280, Math.min(448, Math.floor(host.clientWidth || 448)));
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
          const next = JSON.stringify(c.toObject());
          const stack = hist.current;
          if (stack[stack.length - 1] === next) return;
          stack.push(next);
          if (stack.length > 12) stack.shift();
        });
        canvas.on("object:added", () => {
          if (!dead) setStamps(canvasRef.current?.getObjects().length ?? 0);
        });
        canvas.on("object:removed", () => {
          if (!dead) setStamps(canvasRef.current?.getObjects().length ?? 0);
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
        setReady(true);
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
      canvasRef.current = null;
      if (canvas) void canvas.dispose();
      host.replaceChildren();
    };
  }, []);

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

  async function addWord(display: boolean) {
    const c = canvasRef.current;
    if (!c) return;
    pushHist();
    const { IText: FabricText } = await import("fabric");
    const w = c.getWidth();
    const { left, top } = dropAt(
      c,
      display ? Math.round(w * 0.28) : Math.round(w * 0.16),
      display ? Math.round(w * 0.1) : Math.round(w * 0.07),
    );
    const text = new FabricText(display ? "MARK" : "name", {
      left,
      top,
      originX: "center",
      originY: "center",
      fill: inkRef.current,
      fontFamily: display
        ? "Fraunces, Georgia, serif"
        : '"Source Sans 3", sans-serif',
      fontSize: display ? Math.round(w * 0.16) : Math.round(w * 0.1),
      fontWeight: 650,
      textAlign: "center",
      selectionColor: "rgba(31, 79, 74, 0.28)",
      ...HAND,
    });
    c.add(text);
    c.setActiveObject(text);
    c.requestRenderAll();
    requestAnimationFrame(() => {
      if (canvasRef.current !== c) return;
      text.enterEditing();
      text.selectAll();
    });
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
    setNote("");
  }

  function centerSelected() {
    const c = canvasRef.current;
    if (!c || !needSelection()) return;
    const active = c.getActiveObject();
    if (!active) return;
    pushHist();
    active.set({ left: c.getWidth() / 2, top: c.getHeight() / 2 });
    active.setCoords();
    c.requestRenderAll();
    setNote("");
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
    setStamps(c.getObjects().length);
  }

  function clearBoard() {
    const c = canvasRef.current;
    if (!c) return;
    if (!window.confirm("Clear this mark? It only exists on this screen.")) return;
    pushHist();
    c.remove(...c.getObjects());
    c.discardActiveObject();
    c.backgroundColor = PAPER;
    c.requestRenderAll();
    setNote("");
    setStamps(0);
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
      setNote(
        spanish
          ? `Listo. ${MARK_SVG_NAME} quedó en este Chromebook.`
          : `You saved it. ${MARK_SVG_NAME} is on this Chromebook.`,
      );
      setSavedName(MARK_SVG_NAME);
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
      triggerDownload(MARK_PNG_NAME, url);
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setNote(
        spanish
          ? `Listo. ${MARK_PNG_NAME} quedó en este Chromebook.`
          : `You saved it. ${MARK_PNG_NAME} is on this Chromebook.`,
      );
      setSavedName(MARK_PNG_NAME);
    }
    awardBench();
  }

  return (
    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 lg:sticky lg:top-16">
        <div className="relative mx-auto w-full max-w-md">
          <div
            ref={hostRef}
            className="mark-press w-full overflow-hidden rounded-xl border border-line bg-white"
          />
          {ready && stamps === 0 && !err ? (
            <p className="pointer-events-none absolute inset-x-3 bottom-3 text-center text-sm font-medium text-teal">
              {say(
                "1. Big word.  2. Drag it.  3. Save PNG.",
                "1. Grande.  2. Arrástrala.  3. Guardar PNG.",
              )}
            </p>
          ) : null}
        </div>
        {!ready && !err ? (
          <p className="mt-3 text-center text-sm text-muted">Opening the press…</p>
        ) : null}
        {err ? (
          <p className="mt-3 text-center text-sm text-bad" role="alert">
            {err}
          </p>
        ) : null}
        <p
          className={cn(
            "mt-3 text-center text-sm",
            savedName && note.startsWith(spanish ? "Listo." : "You saved it.")
              ? "font-medium text-ink"
              : "text-muted",
          )}
          role="status"
          aria-live="polite"
        >
          {note ||
            (stamps === 0
              ? say(
                  "Start with Big word. Then drag it. Then Save PNG.",
                  "Empieza con Grande. Luego arrástrala. Luego Guardar PNG.",
                )
              : say(
                  "Drag to move. Save PNG when it looks right.",
                  "Arrastra. Guardar PNG cuando se vea bien.",
                ))}
        </p>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2 lg:w-80">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            disabled={!ready}
            title={stamps === 0 ? say("Do this first", "Haz esto primero") : undefined}
            className={stamps === 0 ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : undefined}
            onClick={() => void addWord(true)}
          >
            {say("Big word", "Grande")}
          </Button>
          <Button type="button" variant="secondary" disabled={!ready} onClick={() => void addWord(false)}>
            {say("Plain word", "Normal")}
          </Button>
          <Button type="button" variant="secondary" disabled={!ready} onClick={() => void addShape("square")}>
            {say("Square", "Cuadrado")}
          </Button>
          <Button type="button" variant="secondary" disabled={!ready} onClick={() => void addShape("circle")}>
            {say("Circle", "Círculo")}
          </Button>
          <Button type="button" variant="secondary" disabled={!ready} onClick={() => void addShape("triangle")}>
            {say("Triangle", "Triángulo")}
          </Button>
          <Button type="button" variant="secondary" disabled={!ready} onClick={() => void addShape("bar")}>
            {say("Bar", "Barra")}
          </Button>
        </div>
        <Button type="button" variant="secondary" disabled={!ready} onClick={typeWord}>
          {say("Type word", "Escribir")}
        </Button>

        <div className="flex flex-wrap gap-2" role="group" aria-label={say("Ink", "Tinta")}>
          {INKS.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              disabled={!ready}
              aria-label={swatch.name}
              aria-pressed={ink === swatch.hex}
              onClick={() => paint(swatch.hex)}
              className={cn(
                "size-11 rounded-md border disabled:opacity-50",
                swatch.hex === "#ffffff" ? "border-2 border-ink/35" : "border-line",
                ink === swatch.hex && "ring-2 ring-teal ring-offset-2 ring-offset-paper",
              )}
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={() => void duplicate()}>
            {say("Duplicate", "Duplicar")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={rotateSelected}>
            {say("Rotate", "Girar")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={toggleOutline}>
            {say("Outline", "Contorno")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={() => scaleSelected(1.15)}>
            {say("Bigger", "Grande")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={() => scaleSelected(1 / 1.15)}>
            {say("Smaller", "Chico")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={centerSelected}>
            {say("Center", "Centro")}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" disabled={!ready} onClick={() => layer("up")}>
            {say("Layer up", "Capa arriba")}
          </Button>
          <Button type="button" variant="outline" disabled={!ready} onClick={() => layer("down")}>
            {say("Layer down", "Capa abajo")}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={removeSelected}>
            {say("Delete", "Borrar")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={() => void undo()}>
            {say("Undo", "Deshacer")}
          </Button>
          <Button type="button" variant="outline" className="px-2" disabled={!ready} onClick={clearBoard}>
            {say("Clear", "Limpiar")}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" disabled={!ready} onClick={() => ship("png")}>
            {say("Save PNG", "Guardar PNG")}
          </Button>
          <Button type="button" variant="secondary" disabled={!ready} onClick={() => ship("svg")}>
            {say("Save SVG", "Guardar SVG")}
          </Button>
        </div>
        <p className="text-xs text-muted">
          {say(
            "PNG is the picture. SVG keeps the shapes. Both stay on this Chromebook. Fabric.js is MIT.",
            "PNG es la imagen. SVG guarda las formas. Los dos quedan en este Chromebook. Fabric.js es MIT.",
          )}
        </p>
      </div>
    </div>
  );
}
