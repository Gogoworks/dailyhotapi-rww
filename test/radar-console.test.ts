import assert from "node:assert/strict";
import test from "node:test";
import app from "../src/app.js";

test("GET /radar returns the console shell for browsing radar data", async () => {
  const response = await app.fetch(new Request("http://localhost/radar"));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/html; charset=UTF-8");

  const html = await response.text();
  assert.match(html, /热榜雷达控制台/);
  assert.match(html, /源列表/);
  assert.match(html, /\/api\/radar\/sources/);
  assert.match(html, /scan-detail/);
  assert.match(html, /只看失败源/);
  assert.match(html, /批量刷新/);
  assert.match(html, /source-mark/);
  assert.match(html, /copy-raw-button/);
  assert.match(html, /navigator\.clipboard/);
});
