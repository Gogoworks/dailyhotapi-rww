import { config } from "../config.js";
import type { ListItem, RouterData } from "../types.js";
import type { RadarItem, RadarSourceMetadata } from "./radar-types.js";

const sourceCacheTtlOverrides: Record<string, number | null> = {
  github: 60 * 60 * 24,
  huxiu: null,
  weibo: 60,
};

const toTrimmedString = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const toIsoString = (value: string | number | undefined): string | null => {
  if (value === undefined || value === null || value === "" || value === 0) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const normalizeRadarItem = (item: ListItem, index: number, sourceId: string): RadarItem => ({
  id: item.id,
  title: item.title,
  summary: toTrimmedString(item.desc),
  url: item.url,
  mobile_url: toTrimmedString(item.mobileUrl) ?? item.url,
  rank: index + 1,
  hot: typeof item.hot === "number" ? item.hot : null,
  published_at: toIsoString(item.timestamp),
  raw_source: sourceId,
  topic_hint: null,
  tempo_hint: null,
  signal_hints: [],
  raw: { ...item },
});

type BuildRadarSourceMetadataOptions = {
  sourceId: string;
  routeData: RouterData;
  fetchedAt: Date;
  latencyMs: number;
  normalizedCount: number;
};

export const buildRadarSourceMetadata = ({
  sourceId,
  routeData,
  fetchedAt,
  latencyMs,
  normalizedCount,
}: BuildRadarSourceMetadataOptions): RadarSourceMetadata => ({
  source_id: sourceId,
  source_name: routeData.title,
  platform: routeData.title,
  category: routeData.type,
  fetched_at: fetchedAt.toISOString(),
  updated_at: toIsoString(routeData.updateTime),
  from_cache: routeData.fromCache,
  cache_ttl: sourceCacheTtlOverrides[sourceId] ?? config.CACHE_TTL,
  status: "ok",
  latency_ms: latencyMs,
  error_message: null,
  raw_count: routeData.data.length,
  normalized_count: normalizedCount,
  route_path: `/${sourceId}`,
  radar_path: `/api/radar/scan/${sourceId}`,
  link: toTrimmedString(routeData.link),
  description: toTrimmedString(routeData.description),
  params: routeData.params ?? null,
});
