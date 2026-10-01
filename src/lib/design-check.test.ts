import assert from "node:assert/strict";
import test from "node:test";
import { checkDesign, contrastRatio, type MarkPiece } from "./design-check.ts";

test("white and brass fail on a white plate; ink and teal pass", () => {
  assert.ok(contrastRatio("#ffffff") < 4.5);
  assert.ok(contrastRatio("#c9a24a") < 4.5);
  assert.ok(contrastRatio("#1c1a16") >= 4.5);
  assert.ok(contrastRatio("#1f4f4a") >= 4.5);
});

test("a big word passes reads-small; a plain word fails", () => {
  const plate = 360;
  const big: MarkPiece = {
    kind: "text",
    fontSize: Math.round(plate * 0.18),
    fill: "#1c1a16",
    left: plate / 2,
    top: plate / 2,
    width: 120,
    height: 40,
  };
  const tiny: MarkPiece = { ...big, fontSize: Math.round(plate * 0.1) };
  assert.equal(checkDesign([big], plate, plate).checks[0].pass, true);
  const fail = checkDesign([tiny], plate, plate).checks[0];
  assert.equal(fail.pass, false);
  assert.match(fail.line, /Too thin at 16px/);
});

test("off-center drop fails balance; center and a left stack pass", () => {
  const plate = 400;
  const off: MarkPiece = {
    kind: "text",
    fontSize: 72,
    fill: "#1c1a16",
    left: plate * 0.34,
    top: plate * 0.3,
    width: 100,
    height: 40,
  };
  assert.equal(checkDesign([off], plate, plate).checks[2].pass, false);
  const mid = { ...off, left: plate / 2, top: plate / 2 };
  assert.equal(checkDesign([mid], plate, plate).checks[2].pass, true);
  const stack = [0, 1].map((i) => ({
    ...off,
    kind: "shape" as const,
    left: plate * 0.16,
    top: plate * (0.3 + i * 0.2),
  }));
  assert.equal(checkDesign(stack, plate, plate).checks[2].pass, true);
});

test("shape fails over 3 objects or over 2 colors", () => {
  const piece = (fill: string, i: number): MarkPiece => ({
    kind: "shape",
    fontSize: 0,
    fill,
    left: 200,
    top: 200,
    width: 40,
    height: 40 + i,
  });
  const many = [0, 1, 2, 3].map((i) => piece("#1c1a16", i));
  assert.equal(checkDesign(many, 400, 400).checks[3].pass, false);
  const colors = ["#1c1a16", "#1f4f4a", "#8f3a32"].map((fill, i) => piece(fill, i));
  assert.equal(checkDesign(colors, 400, 400).checks[3].pass, false);
  const ok = [piece("#1c1a16", 0), piece("#1f4f4a", 1)];
  assert.equal(checkDesign(ok, 400, 400).checks[3].pass, true);
});

test("three passing checks can star; white-on-white cannot clear contrast", () => {
  const plate = 400;
  const word: MarkPiece = {
    kind: "text",
    fontSize: 80,
    fill: "#ffffff",
    left: plate / 2,
    top: plate / 2,
    width: 100,
    height: 40,
  };
  const report = checkDesign([word], plate, plate);
  assert.equal(report.checks.find((c) => c.id === "contrast")?.pass, false);
  assert.ok(report.stars < 4);
});
