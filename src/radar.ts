import { Hono } from "hono";
import { config } from "./config.js";
import { jsonError, jsonSuccess } from "./lib/json-response.js";
import { buildRadarSourceMetadata, normalizeRadarItem } from "./lib/radar-normalizer.js";
import { getSourceIds, hasSource, loadSourceHandler, type SourceHandler } from "./lib/source-registry.js";

type RadarDependencies = {
  getSourceIds?: () => string[];
  hasSource?: (sourceId: string) => boolean;
  loadSourceHandler?: (sourceId: string) => Promise<SourceHandler>;
  now?: () => Date;
};

export const createRadarApp = (dependencies: RadarDependencies = {}) => {
  const app = new Hono();
  const listSourceIds = dependencies.getSourceIds ?? getSourceIds;
  const sourceExists = dependencies.hasSource ?? hasSource;
  const sourceLoader = dependencies.loadSourceHandler ?? loadSourceHandler;
  const now = dependencies.now ?? (() => new Date());

  app.get("/health", (c) =>
    jsonSuccess(c, {
      service_status: "ok",
      data_status: "available",
      sources_count: listSourceIds().length,
      cache_ttl_default: config.CACHE_TTL,
    }),
  );

  app.get("/sources", (c) => {
    const sources = listSourceIds().map((sourceId) => ({
      source_id: sourceId,
      route_path: `/${sourceId}`,
      radar_path: `/api/radar/scan/${sourceId}`,
    }));

    return jsonSuccess(c, {
      count: sources.length,
      sources,
    });
  });

  app.get("/scan/:sourceId", async (c) => {
    const sourceId = c.req.param("sourceId");
    if (!sourceExists(sourceId)) {
      return jsonError(c, {
        status: 404,
        message: "Source not found",
        type: "not_found",
        details: { source_id: sourceId },
      });
    }

    const noCache = c.req.query("cache") === "false";
    const limit = Number.parseInt(c.req.query("limit") || "", 10);
    const startedAt = now();

    try {
      const handleRoute = await sourceLoader(sourceId);
      const routeData = await handleRoute(c as never, noCache);
      const normalizedItems = routeData.data.map((item, index) => normalizeRadarItem(item, index, sourceId));
      const items = Number.isFinite(limit) && limit >= 0 ? normalizedItems.slice(0, limit) : normalizedItems;
      const fetchedAt = now();
      const source = buildRadarSourceMetadata({
        sourceId,
        routeData,
        fetchedAt,
        latencyMs: fetchedAt.getTime() - startedAt.getTime(),
        normalizedCount: items.length,
      });

      return jsonSuccess(c, {
        source,
        items,
      });
    } catch (error) {
      return jsonError(c, {
        status: 502,
        message: "Source fetch failed",
        type: "source_error",
        details: {
          source_id: sourceId,
          error_message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  });

  app.notFound((c) =>
    jsonError(c, {
      status: 404,
      message: "Radar endpoint not found",
      type: "not_found",
    }),
  );

  app.onError((error, c) =>
    jsonError(c, {
      status: 500,
      message: "Radar request failed",
      type: "internal_error",
      details: {
        error_message: error instanceof Error ? error.message : "Unknown error",
      },
    }),
  );

  return app;
};

const radarApp = createRadarApp();

export default radarApp;
