import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hubBaseFromRouter, restoreHubBasePath, restoreHubBaseUrl } from "./hub-base.ts";

describe("hubBaseFromRouter", () => {
  it("ignores an empty or root basepath", () => {
    assert.equal(hubBaseFromRouter(undefined), "");
    assert.equal(hubBaseFromRouter(""), "");
    assert.equal(hubBaseFromRouter("/"), "");
  });

  it("normalizes the logolab mount", () => {
    assert.equal(hubBaseFromRouter("/logolab"), "/logolab");
    assert.equal(hubBaseFromRouter("logolab"), "/logolab");
    assert.equal(hubBaseFromRouter("/logolab/"), "/logolab");
  });
});

describe("restoreHubBasePath", () => {
  it("prefixes document paths the hub stripped", () => {
    assert.equal(restoreHubBasePath("/", "/logolab"), "/logolab/");
    assert.equal(restoreHubBasePath("/lessons", "/logolab"), "/logolab/lessons");
    assert.equal(restoreHubBasePath("/studio/match", "/logolab"), "/logolab/studio/match");
  });

  it("does not double-prefix or rewrite origin static files", () => {
    assert.equal(restoreHubBasePath("/logolab/lessons", "/logolab"), "/logolab/lessons");
    assert.equal(restoreHubBasePath("/assets/styles-abc.css", "/logolab"), "/assets/styles-abc.css");
    assert.equal(restoreHubBasePath("/fonts/lab.css", "/logolab"), "/fonts/lab.css");
    assert.equal(restoreHubBasePath("/favicon.svg", "/logolab"), "/favicon.svg");
  });

  it("is a no-op without a hub base", () => {
    assert.equal(restoreHubBasePath("/lessons", ""), "/lessons");
  });
});

describe("restoreHubBaseUrl", () => {
  it("rewrites the request URL and leaves static requests untouched", () => {
    const lessons = restoreHubBaseUrl(new Request("https://apps.kulibert.net/lessons"), "/logolab");
    assert.equal(lessons.url, "https://apps.kulibert.net/logolab/lessons");

    const asset = restoreHubBaseUrl(
      new Request("https://apps.kulibert.net/assets/app.js"),
      "logolab",
    );
    assert.equal(asset.url, "https://apps.kulibert.net/assets/app.js");
  });
});
