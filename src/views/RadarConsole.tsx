import type { FC } from "hono/jsx";
import { html } from "hono/html";

const RadarConsole: FC = () => {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>热榜雷达控制台</title>
        <meta
          name="description"
          content="浏览热榜源列表、扫描结果、错误状态和源级元数据的前端控制台。"
        />
        <style>{`
          :root {
            --paper: #f5f0e8;
            --paper-strong: #fffaf2;
            --ink: #151515;
            --ink-soft: rgba(21, 21, 21, 0.64);
            --ink-faint: rgba(21, 21, 21, 0.12);
            --accent: #ca3d28;
            --accent-soft: rgba(202, 61, 40, 0.14);
            --signal: #0f7a6b;
            --signal-soft: rgba(15, 122, 107, 0.12);
            --warning: #b26a12;
            --danger: #a62828;
            --card-shadow: 0 24px 80px rgba(48, 33, 15, 0.12);
          }

          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            min-height: 100%;
            color: var(--ink);
            background:
              radial-gradient(circle at top left, rgba(202, 61, 40, 0.14), transparent 32%),
              radial-gradient(circle at top right, rgba(15, 122, 107, 0.12), transparent 30%),
              linear-gradient(180deg, #f9f3eb 0%, #efe7dd 100%);
            font-family: "Avenir Next", "PingFang SC", "Segoe UI", sans-serif;
          }

          body::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(21, 21, 21, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(21, 21, 21, 0.03) 1px, transparent 1px);
            background-size: 32px 32px;
            mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.4), transparent 75%);
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          button, input {
            font: inherit;
          }

          .console-shell {
            position: relative;
            padding: 28px;
          }

          .console-frame {
            max-width: 1500px;
            margin: 0 auto;
            border: 1px solid var(--ink-faint);
            border-radius: 28px;
            background: rgba(255, 250, 242, 0.74);
            backdrop-filter: blur(20px);
            box-shadow: var(--card-shadow);
            overflow: hidden;
          }

          .console-topbar {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            align-items: flex-start;
            padding: 30px 32px 22px;
            border-bottom: 1px solid var(--ink-faint);
            background:
              linear-gradient(135deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.22)),
              linear-gradient(90deg, rgba(202, 61, 40, 0.08), rgba(15, 122, 107, 0.08));
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 10px;
            border-radius: 999px;
            background: rgba(21, 21, 21, 0.06);
            color: var(--ink-soft);
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .console-title {
            margin: 14px 0 6px;
            font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
            font-size: clamp(38px, 4vw, 68px);
            line-height: 0.92;
            letter-spacing: -0.04em;
          }

          .console-subtitle {
            max-width: 760px;
            margin: 0;
            color: var(--ink-soft);
            font-size: 16px;
            line-height: 1.7;
          }

          .topbar-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 270px;
          }

          .status-card {
            padding: 14px 16px;
            border-radius: 18px;
            border: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.52);
          }

          .status-label {
            display: block;
            margin-bottom: 8px;
            color: var(--ink-soft);
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .status-value {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            font-weight: 600;
          }

          .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--signal);
            box-shadow: 0 0 0 8px var(--signal-soft);
          }

          .topbar-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .topbar-button,
          .scan-button {
            border: 1px solid var(--ink);
            border-radius: 999px;
            background: transparent;
            color: var(--ink);
            padding: 11px 16px;
            cursor: pointer;
            transition: transform 0.18s ease, background-color 0.18s ease, color 0.18s ease;
          }

          .topbar-button:hover,
          .scan-button:hover {
            transform: translateY(-1px);
            background: var(--ink);
            color: #fff8ef;
          }

          .console-body {
            display: grid;
            grid-template-columns: 320px minmax(0, 1fr);
            gap: 0;
            min-height: 72vh;
          }

          .sources-panel {
            border-right: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.34);
          }

          .panel-header {
            padding: 22px 22px 16px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .panel-title {
            margin: 0 0 4px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: 28px;
          }

          .panel-copy {
            margin: 0;
            color: var(--ink-soft);
            font-size: 14px;
            line-height: 1.6;
          }

          .search-wrap {
            padding: 18px 22px 16px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .search-input {
            width: 100%;
            border: 1px solid var(--ink-faint);
            border-radius: 16px;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.76);
            outline: none;
          }

          .sources-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 0 22px 14px;
            color: var(--ink-soft);
            font-size: 13px;
          }

          .source-list {
            height: calc(72vh - 210px);
            overflow: auto;
            padding: 0 14px 18px;
          }

          .source-list::-webkit-scrollbar,
          .items-scroll::-webkit-scrollbar,
          .raw-block::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }

          .source-list::-webkit-scrollbar-thumb,
          .items-scroll::-webkit-scrollbar-thumb,
          .raw-block::-webkit-scrollbar-thumb {
            border-radius: 999px;
            background: rgba(21, 21, 21, 0.16);
          }

          .source-button {
            width: 100%;
            display: grid;
            gap: 8px;
            margin-bottom: 10px;
            padding: 15px 16px;
            border: 1px solid transparent;
            border-radius: 18px;
            background: transparent;
            text-align: left;
            cursor: pointer;
            transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
          }

          .source-button:hover {
            transform: translateX(3px);
            border-color: rgba(21, 21, 21, 0.1);
            background: rgba(255, 255, 255, 0.62);
          }

          .source-button.active {
            border-color: rgba(202, 61, 40, 0.32);
            background: linear-gradient(135deg, rgba(202, 61, 40, 0.12), rgba(255, 255, 255, 0.65));
          }

          .source-topline {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }

          .source-name {
            font-size: 15px;
            font-weight: 700;
          }

          .source-id {
            color: var(--ink-soft);
            font-size: 12px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .source-chip {
            display: inline-flex;
            align-items: center;
            padding: 6px 9px;
            border-radius: 999px;
            background: rgba(15, 122, 107, 0.12);
            color: var(--signal);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .empty-state {
            padding: 22px;
            color: var(--ink-soft);
            font-size: 14px;
            line-height: 1.7;
          }

          .scan-panel {
            display: grid;
            grid-template-rows: auto auto auto minmax(0, 1fr);
            min-width: 0;
          }

          .scan-hero {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            padding: 22px 24px 18px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .scan-kicker {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            color: var(--ink-soft);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .scan-title {
            margin: 12px 0 6px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: clamp(28px, 3vw, 48px);
            line-height: 0.96;
          }

          .scan-subtitle {
            margin: 0;
            color: var(--ink-soft);
            line-height: 1.6;
            max-width: 700px;
          }

          .scan-controls {
            display: grid;
            gap: 12px;
            min-width: 210px;
            justify-items: end;
          }

          .toggle-wrap {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--ink-soft);
            font-size: 13px;
          }

          .toggle-wrap input {
            accent-color: var(--accent);
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
            padding: 20px 24px 18px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .summary-card {
            padding: 16px 18px;
            border-radius: 20px;
            border: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.6);
          }

          .summary-card dt {
            margin-bottom: 10px;
            color: var(--ink-soft);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .summary-card dd {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
          }

          .status-banner {
            display: none;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            margin: 18px 24px 0;
            padding: 16px 18px;
            border-radius: 18px;
            border: 1px solid rgba(166, 40, 40, 0.16);
            background: rgba(166, 40, 40, 0.08);
            color: var(--danger);
          }

          .status-banner.visible {
            display: flex;
          }

          .status-banner strong {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
          }

          .status-banner p {
            margin: 0;
            line-height: 1.6;
            font-size: 14px;
          }

          .content-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.95fr);
            gap: 18px;
            padding: 18px 24px 24px;
            min-height: 0;
          }

          .card {
            min-width: 0;
            border: 1px solid var(--ink-faint);
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.62);
            overflow: hidden;
          }

          .card-header {
            padding: 18px 20px 14px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .card-title {
            margin: 0 0 6px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: 26px;
          }

          .card-copy {
            margin: 0;
            color: var(--ink-soft);
            font-size: 14px;
            line-height: 1.6;
          }

          .items-scroll {
            max-height: 58vh;
            overflow: auto;
            padding: 12px 14px 16px;
          }

          .item-card {
            margin-bottom: 12px;
            border: 1px solid var(--ink-faint);
            border-radius: 18px;
            padding: 14px 14px 12px;
            background: rgba(255, 255, 255, 0.7);
          }

          .item-meta {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 10px;
            color: var(--ink-soft);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }

          .item-rank {
            color: var(--accent);
            font-weight: 700;
          }

          .item-title {
            margin: 0 0 10px;
            font-size: 18px;
            line-height: 1.45;
          }

          .item-summary {
            margin: 0 0 14px;
            color: var(--ink-soft);
            line-height: 1.7;
            font-size: 14px;
          }

          .item-links {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .item-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border-radius: 999px;
            border: 1px solid var(--ink-faint);
            padding: 8px 12px;
            font-size: 13px;
            background: rgba(255, 255, 255, 0.68);
          }

          .item-link:hover {
            border-color: rgba(202, 61, 40, 0.32);
            color: var(--accent);
          }

          .meta-grid {
            display: grid;
            gap: 10px;
            padding: 14px;
          }

          .meta-row {
            display: grid;
            gap: 6px;
            padding: 12px 14px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.66);
            border: 1px solid var(--ink-faint);
          }

          .meta-label {
            color: var(--ink-soft);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }

          .meta-value {
            font-size: 14px;
            line-height: 1.6;
            word-break: break-word;
          }

          .meta-value code {
            font-family: "SFMono-Regular", "Menlo", monospace;
            font-size: 12px;
          }

          .raw-block {
            max-height: 220px;
            overflow: auto;
            padding: 14px;
            margin: 0;
            border-radius: 16px;
            background: #191817;
            color: #f6eadb;
            font-family: "SFMono-Regular", "Menlo", monospace;
            font-size: 12px;
            line-height: 1.6;
          }

          .footer-note {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 24px 22px;
            color: var(--ink-soft);
            border-top: 1px solid var(--ink-faint);
            font-size: 13px;
          }

          @media (max-width: 1120px) {
            .console-body {
              grid-template-columns: 1fr;
            }

            .sources-panel {
              border-right: none;
              border-bottom: 1px solid var(--ink-faint);
            }

            .source-list {
              height: auto;
              max-height: 300px;
            }

            .summary-grid,
            .content-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 780px) {
            .console-shell {
              padding: 14px;
            }

            .console-topbar,
            .scan-hero {
              padding: 20px 18px 16px;
            }

            .summary-grid,
            .content-grid {
              grid-template-columns: 1fr;
              padding-left: 18px;
              padding-right: 18px;
            }

            .topbar-actions,
            .scan-controls {
              min-width: 0;
              width: 100%;
            }

            .console-topbar,
            .scan-hero,
            .footer-note {
              flex-direction: column;
            }

            .topbar-buttons {
              width: 100%;
            }

            .topbar-button,
            .scan-button {
              flex: 1;
              justify-content: center;
            }
          }
        `}</style>
      </head>
      <body>
        <div class="console-shell">
          <div class="console-frame">
            <header class="console-topbar">
              <div>
                <span class="eyebrow">Radar Console</span>
                <h1 class="console-title">热榜雷达控制台</h1>
                <p class="console-subtitle">
                  面向机器消费接口的人工浏览层。你可以在这里筛选热榜源、触发扫描、查看错误状态、核对源级元数据，并直接跳回原始 API。
                </p>
              </div>
              <div class="topbar-actions">
                <div class="status-card">
                  <span class="status-label">服务状态</span>
                  <div id="health-status" class="status-value">
                    <span class="status-dot"></span>
                    正在检查 /api/radar/health
                  </div>
                </div>
                <div class="topbar-buttons">
                  <button id="refresh-sources" class="topbar-button" type="button">刷新源列表</button>
                  <a class="topbar-button" href="/api/radar/sources" target="_blank">查看原始接口</a>
                </div>
              </div>
            </header>

            <div class="console-body">
              <aside class="sources-panel">
                <div class="panel-header">
                  <h2 class="panel-title">源列表</h2>
                  <p class="panel-copy">搜索源 id，切换左侧目录，控制台会调用 `/api/radar/scan/:sourceId` 拉取最新数据。</p>
                </div>
                <div class="search-wrap">
                  <input
                    id="source-search"
                    class="search-input"
                    type="search"
                    placeholder="搜索 source_id，例如 bilibili / weibo"
                    autocomplete="off"
                  />
                </div>
                <div class="sources-meta">
                  <span id="sources-count">加载中…</span>
                  <span id="sources-hint">/api/radar/sources</span>
                </div>
                <div id="source-list" class="source-list">
                  <div class="empty-state">正在载入可用源列表…</div>
                </div>
              </aside>

              <main class="scan-panel">
                <section class="scan-hero">
                  <div>
                    <span class="scan-kicker">Scan View</span>
                    <h2 id="scan-title" class="scan-title">选择一个源开始浏览</h2>
                    <p id="scan-subtitle" class="scan-subtitle">
                      左侧点击任意源后，这里会展示该源的扫描结果、错误状态、延迟、缓存命中与条目原始数据。
                    </p>
                  </div>
                  <div class="scan-controls">
                    <label class="toggle-wrap">
                      <input id="force-refresh" type="checkbox" />
                      <span>跳过缓存重新抓取</span>
                    </label>
                    <button id="run-scan" class="scan-button" type="button">扫描当前源</button>
                  </div>
                </section>

                <dl class="summary-grid">
                  <div class="summary-card">
                    <dt>状态</dt>
                    <dd id="stat-status">待命</dd>
                  </div>
                  <div class="summary-card">
                    <dt>命中缓存</dt>
                    <dd id="stat-cache">-</dd>
                  </div>
                  <div class="summary-card">
                    <dt>延迟</dt>
                    <dd id="stat-latency">-</dd>
                  </div>
                  <div class="summary-card">
                    <dt>条目数</dt>
                    <dd id="stat-count">-</dd>
                  </div>
                </dl>

                <section id="error-banner" class="status-banner" aria-live="polite">
                  <div>
                    <strong>扫描失败</strong>
                    <p id="error-text">暂无错误。</p>
                  </div>
                  <a class="item-link" href="/api/radar/health" target="_blank">打开健康检查</a>
                </section>

                <div class="content-grid">
                  <section class="card">
                    <div class="card-header">
                      <h3 class="card-title">条目浏览</h3>
                      <p class="card-copy">查看归一后的标题、热度、发布时间和目标链接。条目右侧保留原始数据，方便下游复核。</p>
                    </div>
                    <div id="items-scroll" class="items-scroll">
                      <div class="empty-state">还没有扫描结果。先从左侧选一个源，再点击“扫描当前源”。</div>
                    </div>
                  </section>

                  <section id="scan-detail" class="card">
                    <div class="card-header">
                      <h3 class="card-title">源级元数据</h3>
                      <p class="card-copy">这里显示源状态、缓存 TTL、更新时间、参数、原始响应条目数等机器消费字段。</p>
                    </div>
                    <div id="meta-grid" class="meta-grid">
                      <div class="empty-state">等待选择热榜源。</div>
                    </div>
                  </section>
                </div>

                <footer class="footer-note">
                  <span>控制台页面：<code>/radar</code></span>
                  <span>
                    接口：<a href="/api/radar/sources" target="_blank">/api/radar/sources</a> ·{" "}
                    <a href="/api/radar/health" target="_blank">/api/radar/health</a>
                  </span>
                </footer>
              </main>
            </div>
          </div>
        </div>

        {html`
          <script>
            (() => {
              const endpoints = {
                health: "/api/radar/health",
                sources: "/api/radar/sources",
                scan: (sourceId, forceRefresh) =>
                  "/api/radar/scan/" +
                  encodeURIComponent(sourceId) +
                  (forceRefresh ? "?cache=false" : ""),
              };

              const state = {
                sources: [],
                filteredSources: [],
                selectedSource: "",
                health: null,
                scan: null,
                error: "",
              };

              const $ = (id) => document.getElementById(id);
              const healthStatus = $("health-status");
              const sourceSearch = $("source-search");
              const sourceList = $("source-list");
              const sourcesCount = $("sources-count");
              const scanTitle = $("scan-title");
              const scanSubtitle = $("scan-subtitle");
              const forceRefresh = $("force-refresh");
              const itemsScroll = $("items-scroll");
              const metaGrid = $("meta-grid");
              const errorBanner = $("error-banner");
              const errorText = $("error-text");
              const statStatus = $("stat-status");
              const statCache = $("stat-cache");
              const statLatency = $("stat-latency");
              const statCount = $("stat-count");

              const toSafe = (value) => {
                if (value === null || value === undefined || value === "") return "—";
                return String(value);
              };

              const formatDate = (value) => {
                if (!value) return "—";
                const date = new Date(value);
                if (Number.isNaN(date.getTime())) return String(value);
                return date.toLocaleString("zh-CN", { hour12: false });
              };

              const escapeHtml = (value) =>
                String(value)
                  .replaceAll("&", "&amp;")
                  .replaceAll("<", "&lt;")
                  .replaceAll(">", "&gt;")
                  .replaceAll('"', "&quot;")
                  .replaceAll("'", "&#39;");

              const setError = (message) => {
                state.error = message || "";
                errorText.textContent = state.error || "暂无错误。";
                errorBanner.classList.toggle("visible", Boolean(state.error));
              };

              const renderHealth = () => {
                if (!state.health) {
                  healthStatus.innerHTML = '<span class="status-dot"></span>健康检查未返回';
                  return;
                }
                healthStatus.innerHTML =
                  '<span class="status-dot"></span>' +
                  escapeHtml("服务 " + state.health.service_status + " / 数据 " + state.health.data_status);
              };

              const renderSources = () => {
                sourcesCount.textContent = "共 " + state.filteredSources.length + " 个源";
                if (!state.filteredSources.length) {
                  sourceList.innerHTML = '<div class="empty-state">没有匹配的源。换个关键字再试一次。</div>';
                  return;
                }

                sourceList.innerHTML = state.filteredSources
                  .map((source) => {
                    const activeClass = source.source_id === state.selectedSource ? "source-button active" : "source-button";
                    return (
                      '<button class="' +
                      activeClass +
                      '" type="button" data-source-id="' +
                      escapeHtml(source.source_id) +
                      '">' +
                      '<div class="source-topline">' +
                      '<div>' +
                      '<div class="source-name">' +
                      escapeHtml(source.source_id) +
                      "</div>" +
                      '<div class="source-id">' +
                      escapeHtml(source.route_path) +
                      "</div>" +
                      "</div>" +
                      '<span class="source-chip">可扫描</span>' +
                      "</div>" +
                      '<div class="source-id">' +
                      escapeHtml(source.radar_path) +
                      "</div>" +
                      "</button>"
                    );
                  })
                  .join("");

                sourceList.querySelectorAll("[data-source-id]").forEach((element) => {
                  element.addEventListener("click", () => {
                    state.selectedSource = element.getAttribute("data-source-id") || "";
                    window.location.hash = state.selectedSource;
                    renderSources();
                    runScan();
                  });
                });
              };

              const renderSummary = (source, items) => {
                statStatus.textContent = toSafe(source ? source.status : "待命");
                statCache.textContent = source ? (source.from_cache ? "是" : "否") : "—";
                statLatency.textContent = source ? toSafe(source.latency_ms) + " ms" : "—";
                statCount.textContent = Array.isArray(items) ? String(items.length) : "—";
              };

              const renderMeta = (source) => {
                if (!source) {
                  metaGrid.innerHTML = '<div class="empty-state">等待选择热榜源。</div>';
                  return;
                }

                const rows = [
                  ["source_id", source.source_id],
                  ["source_name", source.source_name],
                  ["category", source.category],
                  ["updated_at", formatDate(source.updated_at)],
                  ["fetched_at", formatDate(source.fetched_at)],
                  ["cache_ttl", toSafe(source.cache_ttl)],
                  ["raw_count", toSafe(source.raw_count)],
                  ["normalized_count", toSafe(source.normalized_count)],
                  ["route_path", source.route_path],
                  ["radar_path", source.radar_path],
                  ["params", JSON.stringify(source.params || {}, null, 2)],
                ];

                metaGrid.innerHTML = rows
                  .map(([label, value]) => {
                    const content =
                      label === "params"
                        ? '<pre class="raw-block">' + escapeHtml(value) + "</pre>"
                        : '<div class="meta-value">' + escapeHtml(value) + "</div>";
                    return (
                      '<div class="meta-row">' +
                      '<div class="meta-label">' +
                      escapeHtml(label) +
                      "</div>" +
                      content +
                      "</div>"
                    );
                  })
                  .join("");
              };

              const renderItems = (items) => {
                if (!Array.isArray(items) || !items.length) {
                  itemsScroll.innerHTML = '<div class="empty-state">这个源当前没有可展示的条目。</div>';
                  return;
                }

                itemsScroll.innerHTML = items
                  .map((item) => {
                    return (
                      '<article class="item-card">' +
                      '<div class="item-meta">' +
                      '<span class="item-rank">#' + escapeHtml(item.rank) + "</span>" +
                      "<span>hot " + escapeHtml(toSafe(item.hot)) + "</span>" +
                      "<span>" + escapeHtml(formatDate(item.published_at)) + "</span>" +
                      "</div>" +
                      '<h4 class="item-title">' + escapeHtml(item.title) + "</h4>" +
                      '<p class="item-summary">' + escapeHtml(toSafe(item.summary)) + "</p>" +
                      '<div class="item-links">' +
                      '<a class="item-link" href="' + escapeHtml(item.url) + '" target="_blank">打开链接</a>' +
                      '<a class="item-link" href="' + escapeHtml(item.mobile_url || item.url) + '" target="_blank">移动端</a>' +
                      "</div>" +
                      '<details style="margin-top: 14px;">' +
                      "<summary>查看原始数据</summary>" +
                      '<pre class="raw-block" style="margin-top: 12px;">' +
                      escapeHtml(JSON.stringify(item.raw, null, 2)) +
                      "</pre>" +
                      "</details>" +
                      "</article>"
                    );
                  })
                  .join("");
              };

              const renderScan = () => {
                const source = state.scan && state.scan.source ? state.scan.source : null;
                const items = state.scan && state.scan.items ? state.scan.items : [];

                scanTitle.textContent = source ? source.source_name : "选择一个源开始浏览";
                scanSubtitle.textContent = source
                  ? "当前源：" + source.source_id + " · " + toSafe(source.description || source.link)
                  : "左侧点击任意源后，这里会展示该源的扫描结果、错误状态、延迟、缓存命中与条目原始数据。";
                renderSummary(source, items);
                renderMeta(source);
                renderItems(items);
              };

              const fetchJson = async (url) => {
                const response = await fetch(url, { headers: { Accept: "application/json" } });
                const payload = await response.json();
                if (!response.ok || payload.code >= 400) {
                  const details = payload && payload.error && payload.error.details
                    ? JSON.stringify(payload.error.details)
                    : "";
                  throw new Error((payload.message || "请求失败") + (details ? " · " + details : ""));
                }
                return payload.data;
              };

              const loadHealth = async () => {
                try {
                  state.health = await fetchJson(endpoints.health);
                  renderHealth();
                } catch (error) {
                  healthStatus.innerHTML = '<span class="status-dot" style="background: var(--danger); box-shadow: 0 0 0 8px rgba(166, 40, 40, 0.12);"></span>健康检查失败';
                  setError(error instanceof Error ? error.message : "健康检查失败");
                }
              };

              const loadSources = async () => {
                sourceList.innerHTML = '<div class="empty-state">正在刷新源列表…</div>';
                try {
                  const data = await fetchJson(endpoints.sources);
                  state.sources = data.sources || [];
                  const hashSource = window.location.hash.replace(/^#/, "");
                  if (!state.selectedSource) {
                    state.selectedSource = hashSource || (state.sources[0] ? state.sources[0].source_id : "");
                  }
                  filterSources();
                  if (state.selectedSource) {
                    runScan();
                  } else {
                    renderScan();
                  }
                } catch (error) {
                  sourceList.innerHTML = '<div class="empty-state">源列表加载失败。请稍后重试。</div>';
                  setError(error instanceof Error ? error.message : "源列表加载失败");
                }
              };

              const filterSources = () => {
                const keyword = sourceSearch.value.trim().toLowerCase();
                state.filteredSources = state.sources.filter((source) => {
                  if (!keyword) return true;
                  return (
                    source.source_id.toLowerCase().includes(keyword) ||
                    source.route_path.toLowerCase().includes(keyword)
                  );
                });

                if (state.selectedSource && !state.filteredSources.some((source) => source.source_id === state.selectedSource)) {
                  state.selectedSource = state.filteredSources[0] ? state.filteredSources[0].source_id : "";
                }
                renderSources();
              };

              const runScan = async () => {
                if (!state.selectedSource) {
                  renderScan();
                  return;
                }
                setError("");
                scanTitle.textContent = "正在扫描 " + state.selectedSource;
                scanSubtitle.textContent = "请求 " + endpoints.scan(state.selectedSource, forceRefresh.checked);
                itemsScroll.innerHTML = '<div class="empty-state">正在获取条目与元数据…</div>';
                metaGrid.innerHTML = '<div class="empty-state">正在获取源级元数据…</div>';
                renderSummary(null, null);

                try {
                  state.scan = await fetchJson(endpoints.scan(state.selectedSource, forceRefresh.checked));
                  renderScan();
                } catch (error) {
                  state.scan = null;
                  renderScan();
                  setError(error instanceof Error ? error.message : "扫描失败");
                }
              };

              sourceSearch.addEventListener("input", filterSources);
              $("refresh-sources").addEventListener("click", loadSources);
              $("run-scan").addEventListener("click", runScan);

              loadHealth();
              loadSources();
            })();
          </script>
        `}
      </body>
    </html>
  );
};

export default RadarConsole;
