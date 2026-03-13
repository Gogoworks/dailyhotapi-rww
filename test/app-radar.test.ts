import assert from "node:assert/strict";
import test from "node:test";
import app from "../src/app.js";
import { createRadarApp } from "../src/radar.js";
import type { RouterData } from "../src/types.js";

const request = (path: string) => app.fetch(new Request(`http://localhost${path}`));

test("GET /api/radar/sources returns radar source list as JSON", async () => {
  const response = await request("/api/radar/sources");

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.code, 200);
  assert.ok(Array.isArray(body.data.sources));
  assert.ok(body.data.sources.some((source: { source_id: string }) => source.source_id === "bilibili"));
});

test("GET /api/radar/scan/unknown-source returns a JSON 404 envelope", async () => {
  const response = await request("/api/radar/scan/unknown-source");

  assert.equal(response.status, 404);

  const body = await response.json();
  assert.equal(body.code, 404);
  assert.equal(body.error.type, "not_found");
  assert.equal(body.error.details.source_id, "unknown-source");
});

test("GET /all keeps the existing public route behavior", async () => {
  const response = await request("/all");

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.code, 200);
  assert.equal(body.count, 56);
  assert.ok(Array.isArray(body.routes));
  assert.ok(body.routes.some((route: { name: string; path: string }) => route.name === "bilibili"));
});

test("GET /scan/:sourceId returns source metadata and normalized items", async () => {
  const nowValues = ["2026-03-13T08:00:00.000Z", "2026-03-13T08:00:01.250Z"];
  const radarApp = createRadarApp({
    getSourceIds: () => ["demo"],
    hasSource: (sourceId) => sourceId === "demo",
    loadSourceHandler: async () => {
      const routeData: RouterData = {
        name: "demo",
        title: "演示源",
        type: "热榜",
        description: "用于测试的演示数据",
        link: "https://example.com/demo",
        params: {
          region: "cn",
        },
        total: 2,
        fromCache: true,
        updateTime: "2026-03-13T07:59:00.000Z",
        data: [
          {
            id: "a1",
            title: "第一条",
            desc: " 摘要一 ",
            hot: 88,
            timestamp: Date.parse("2025-03-13T02:00:00.000Z"),
            url: "https://example.com/a1",
            mobileUrl: "https://m.example.com/a1",
          },
          {
            id: "a2",
            title: "第二条",
            desc: "",
            hot: undefined,
            timestamp: undefined,
            url: "https://example.com/a2",
            mobileUrl: "https://m.example.com/a2",
          },
        ],
      };

      return async () => routeData;
    },
    now: () => new Date(nowValues.shift() || "2026-03-13T08:00:01.250Z"),
  });

  const response = await radarApp.fetch(new Request("http://localhost/scan/demo?limit=1"));

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.code, 200);
  assert.equal(body.data.source.source_id, "demo");
  assert.equal(body.data.source.source_name, "演示源");
  assert.equal(body.data.source.platform, "演示源");
  assert.equal(body.data.source.category, "热榜");
  assert.equal(body.data.source.fetched_at, "2026-03-13T08:00:01.250Z");
  assert.equal(body.data.source.updated_at, "2026-03-13T07:59:00.000Z");
  assert.equal(body.data.source.from_cache, true);
  assert.equal(body.data.source.cache_ttl, 3600);
  assert.equal(body.data.source.status, "ok");
  assert.equal(body.data.source.latency_ms, 1250);
  assert.equal(body.data.source.error_message, null);
  assert.equal(body.data.source.raw_count, 2);
  assert.equal(body.data.source.normalized_count, 1);
  assert.equal(body.data.source.route_path, "/demo");
  assert.equal(body.data.source.radar_path, "/api/radar/scan/demo");
  assert.equal(body.data.source.link, "https://example.com/demo");
  assert.equal(body.data.source.description, "用于测试的演示数据");
  assert.deepEqual(body.data.source.params, { region: "cn" });

  assert.equal(body.data.items.length, 1);
  assert.equal(body.data.items[0].id, "a1");
  assert.equal(body.data.items[0].summary, "摘要一");
  assert.equal(body.data.items[0].rank, 1);
  assert.equal(body.data.items[0].hot, 88);
  assert.equal(body.data.items[0].published_at, "2025-03-13T02:00:00.000Z");
  assert.equal(body.data.items[0].raw_source, "demo");
  assert.equal(body.data.items[0].topic_hint, null);
  assert.equal(body.data.items[0].tempo_hint, null);
  assert.deepEqual(body.data.items[0].signal_hints, []);
  assert.equal(body.data.items[0].raw.title, "第一条");
});

test("GET /scan/:sourceId returns JSON source_error when source loading fails", async () => {
  const radarApp = createRadarApp({
    getSourceIds: () => ["broken"],
    hasSource: (sourceId) => sourceId === "broken",
    loadSourceHandler: async () => {
      throw new Error("upstream exploded");
    },
  });

  const response = await radarApp.fetch(new Request("http://localhost/scan/broken"));

  assert.equal(response.status, 502);

  const body = await response.json();
  assert.equal(body.code, 502);
  assert.equal(body.message, "Source fetch failed");
  assert.equal(body.error.type, "source_error");
  assert.equal(body.error.details.source_id, "broken");
  assert.equal(body.error.details.error_message, "upstream exploded");
});
