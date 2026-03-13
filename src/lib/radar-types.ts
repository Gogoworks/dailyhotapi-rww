import type { RouterData } from "../types.js";

export type RadarSourceStatus = "ok" | "error";

export interface RadarSourceMetadata {
  source_id: string;
  source_name: string;
  platform: string;
  category: string;
  fetched_at: string;
  updated_at: string | null;
  from_cache: boolean;
  cache_ttl: number | null;
  status: RadarSourceStatus;
  latency_ms: number;
  error_message: string | null;
  raw_count: number;
  normalized_count: number;
  route_path: string;
  radar_path: string;
  link: string | null;
  description: string | null;
  params: RouterData["params"] | null;
}

export interface RadarItem {
  id: number | string;
  title: string;
  summary: string | null;
  url: string;
  mobile_url: string | null;
  rank: number;
  hot: number | null;
  published_at: string | null;
  raw_source: string;
  topic_hint: string | null;
  tempo_hint: string | null;
  signal_hints: string[];
  raw: Record<string, unknown>;
}
