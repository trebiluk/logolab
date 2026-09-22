import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MARK_SVG_NOTE, stampSvg } from "./mark-export.ts";

describe("stampSvg", () => {
  it("keeps the local-only note in front of the svg tag", () => {
    const out = stampSvg('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    assert.ok(out.includes(MARK_SVG_NOTE));
    assert.ok(out.indexOf(MARK_SVG_NOTE) < out.indexOf("<svg"));
    assert.ok(out.includes("Not uploaded"));
  });

  it("still stamps a fragment that has no svg tag", () => {
    const out = stampSvg("<g/>");
    assert.ok(out.startsWith(MARK_SVG_NOTE));
  });
});
