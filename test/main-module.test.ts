import assert from "node:assert/strict";
import test from "node:test";
import { isMainModule } from "../src/utils/isMainModule.js";

test("isMainModule returns true when the current file is executed directly", () => {
  assert.equal(isMainModule("file:///app/dist/index.js", "/app/dist/index.js"), true);
});

test("isMainModule returns false for non-entry imports", () => {
  assert.equal(isMainModule("file:///app/dist/index.js", "/app/dist/worker.js"), false);
});

test("isMainModule does not depend on NODE_ENV", () => {
  process.env.NODE_ENV = "production";
  assert.equal(isMainModule("file:///app/dist/index.js", "/app/dist/index.js"), true);
});
