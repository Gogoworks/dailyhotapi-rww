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
            --paper: #f6efe4;
            --paper-strong: #fffaf4;
            --ink: #121212;
            --ink-soft: rgba(18, 18, 18, 0.64);
            --ink-faint: rgba(18, 18, 18, 0.11);
            --accent: #ca3d28;
            --accent-soft: rgba(202, 61, 40, 0.14);
            --signal: #0f7a6b;
            --signal-soft: rgba(15, 122, 107, 0.12);
            --warning: #ad6c14;
            --danger: #a62828;
            --danger-soft: rgba(166, 40, 40, 0.1);
            --shadow: 0 24px 90px rgba(54, 36, 18, 0.12);
            --radius-sm: 12px;
            --radius-md: 16px;
            --radius-lg: 20px;
            --radius-xl: 24px;
            --radius-pill: 999px;
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
            -webkit-font-smoothing: antialiased;
          }

          body::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(18, 18, 18, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(18, 18, 18, 0.03) 1px, transparent 1px);
            background-size: 32px 32px;
            mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.42), transparent 75%);
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          button, input {
            font: inherit;
          }

          /* ── Shell & Frame ── */
          .console-shell {
            padding: 16px;
          }

          .console-frame {
            max-width: 1540px;
            margin: 0 auto;
            border-radius: var(--radius-xl);
            border: 1px solid var(--ink-faint);
            background: rgba(255, 250, 244, 0.76);
            backdrop-filter: blur(24px);
            box-shadow: var(--shadow);
            overflow: hidden;
          }

          /* ── Topbar ── */
          .console-topbar {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px 20px 18px;
            border-bottom: 1px solid var(--ink-faint);
            background:
              linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.2)),
              linear-gradient(90deg, rgba(202, 61, 40, 0.08), rgba(15, 122, 107, 0.08));
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 5px 10px;
            border-radius: var(--radius-pill);
            background: rgba(18, 18, 18, 0.06);
            color: var(--ink-soft);
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .console-title {
            margin: 10px 0 6px;
            font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
            font-size: clamp(28px, 5vw, 56px);
            line-height: 1;
            letter-spacing: -0.03em;
          }

          .console-subtitle {
            max-width: 760px;
            margin: 0;
            color: var(--ink-soft);
            font-size: 14px;
            line-height: 1.7;
          }

          .topbar-actions {
            display: grid;
            gap: 12px;
            width: 100%;
          }

          .status-card {
            padding: 12px 14px;
            border-radius: var(--radius-md);
            border: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.54);
          }

          .status-label {
            display: block;
            margin-bottom: 6px;
            color: var(--ink-soft);
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .status-value {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 700;
          }

          .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--signal);
            box-shadow: 0 0 0 6px var(--signal-soft);
            flex-shrink: 0;
          }

          .topbar-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          /* ── Shared button styles ── */
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 44px;
            border: 1px solid var(--ink);
            border-radius: var(--radius-pill);
            background: transparent;
            color: var(--ink);
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition:
              transform 0.18s ease,
              background-color 0.18s ease,
              color 0.18s ease,
              border-color 0.18s ease;
            white-space: nowrap;
          }

          .btn:hover {
            transform: translateY(-1px);
            background: var(--ink);
            color: #fff7ef;
          }

          .btn:active {
            transform: translateY(0);
          }

          .btn:disabled {
            cursor: wait;
            opacity: 0.5;
            transform: none;
          }

          .btn--batch {
            border-color: rgba(202, 61, 40, 0.3);
            background: var(--accent-soft);
          }

          .btn--batch:hover {
            background: var(--accent);
            border-color: var(--accent);
            color: #fff;
          }

          .btn--scan {
            border-color: var(--signal);
            color: var(--signal);
          }

          .btn--scan:hover {
            background: var(--signal);
            border-color: var(--signal);
            color: #fff;
          }

          .btn--copy {
            border-color: rgba(202, 61, 40, 0.26);
            background: rgba(202, 61, 40, 0.08);
            min-height: 38px;
            padding: 8px 12px;
            font-size: 12px;
          }

          .btn--copy.copied {
            background: rgba(15, 122, 107, 0.12);
            border-color: rgba(15, 122, 107, 0.24);
            color: var(--signal);
          }

          /* ── Console Body: Mobile stack, Desktop side-by-side ── */
          .console-body {
            display: flex;
            flex-direction: column;
            min-height: 0;
          }

          /* ── Sources Panel ── */
          .sources-panel {
            border-bottom: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.34);
          }

          .panel-header {
            padding: 18px 18px 14px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .panel-title {
            margin: 0 0 4px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: 22px;
          }

          .panel-copy {
            margin: 0;
            color: var(--ink-soft);
            font-size: 13px;
            line-height: 1.6;
          }

          .search-wrap {
            display: grid;
            gap: 10px;
            padding: 14px 18px 12px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .search-input {
            width: 100%;
            border: 1px solid var(--ink-faint);
            border-radius: var(--radius-md);
            padding: 12px 14px;
            background: rgba(255, 255, 255, 0.76);
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s ease;
          }

          .search-input:focus {
            border-color: var(--accent);
          }

          .filter-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }

          .toggle-wrap {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--ink-soft);
            font-size: 13px;
            cursor: pointer;
            min-height: 36px;
          }

          .toggle-wrap input {
            accent-color: var(--accent);
            width: 16px;
            height: 16px;
            cursor: pointer;
          }

          .batch-status {
            color: var(--ink-soft);
            font-size: 11px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          .sources-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 10px 18px;
            color: var(--ink-soft);
            font-size: 12px;
          }

          .source-list {
            max-height: 320px;
            overflow: auto;
            padding: 0 10px 14px;
            -webkit-overflow-scrolling: touch;
          }

          .source-list::-webkit-scrollbar,
          .items-scroll::-webkit-scrollbar,
          .raw-block::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .source-list::-webkit-scrollbar-thumb,
          .items-scroll::-webkit-scrollbar-thumb,
          .raw-block::-webkit-scrollbar-thumb {
            border-radius: var(--radius-pill);
            background: rgba(18, 18, 18, 0.14);
          }

          .source-button {
            width: 100%;
            display: grid;
            gap: 6px;
            margin-bottom: 8px;
            padding: 12px 14px;
            border: 1px solid transparent;
            border-radius: var(--radius-md);
            background: transparent;
            text-align: left;
            cursor: pointer;
            transition:
              border-color 0.18s ease,
              background-color 0.18s ease,
              box-shadow 0.18s ease;
          }

          .source-button:hover {
            border-color: rgba(18, 18, 18, 0.1);
            background: rgba(255, 255, 255, 0.62);
          }

          .source-button.active {
            border-color: rgba(202, 61, 40, 0.32);
            background: linear-gradient(135deg, rgba(202, 61, 40, 0.12), rgba(255, 255, 255, 0.66));
            box-shadow: 0 8px 24px rgba(202, 61, 40, 0.08);
          }

          .source-button.error {
            border-color: rgba(166, 40, 40, 0.18);
            background: linear-gradient(135deg, rgba(166, 40, 40, 0.08), rgba(255, 255, 255, 0.58));
          }

          .source-button.loading {
            border-color: rgba(173, 108, 20, 0.2);
            background: linear-gradient(135deg, rgba(173, 108, 20, 0.08), rgba(255, 255, 255, 0.6));
          }

          .source-topline {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
          }

          .source-name {
            font-size: 14px;
            font-weight: 700;
            word-break: break-word;
          }

          .source-id {
            color: var(--ink-soft);
            font-size: 11px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            word-break: break-all;
          }

          .source-note {
            color: var(--ink-soft);
            font-size: 12px;
            line-height: 1.5;
            word-break: break-word;
          }

          .source-chip {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: var(--radius-pill);
            background: rgba(18, 18, 18, 0.06);
            color: var(--ink-soft);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            flex-shrink: 0;
            white-space: nowrap;
          }

          .source-chip.ok {
            background: rgba(15, 122, 107, 0.12);
            color: var(--signal);
          }

          .source-chip.error {
            background: var(--danger-soft);
            color: var(--danger);
          }

          .source-chip.loading {
            background: rgba(173, 108, 20, 0.12);
            color: var(--warning);
          }

          .source-chip.idle {
            background: rgba(18, 18, 18, 0.06);
            color: var(--ink-soft);
          }

          .source-mark {
            padding: 0 3px;
            border-radius: 4px;
            background: rgba(202, 61, 40, 0.16);
            color: var(--accent);
          }

          .empty-state {
            padding: 20px 18px;
            color: var(--ink-soft);
            font-size: 14px;
            line-height: 1.7;
          }

          /* ── Scan Panel ── */
          .scan-panel {
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
          }

          .scan-hero {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 18px 18px 16px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .scan-kicker {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            color: var(--ink-soft);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .scan-title {
            margin: 6px 0 4px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: clamp(22px, 3.5vw, 40px);
            line-height: 1.05;
            word-break: break-word;
          }

          .scan-subtitle {
            margin: 0;
            color: var(--ink-soft);
            line-height: 1.6;
            font-size: 14px;
            word-break: break-word;
          }

          .scan-controls {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
          }

          .scan-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          /* ── Summary Grid ── */
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 14px 18px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .summary-card {
            padding: 12px 14px;
            border-radius: var(--radius-md);
            border: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.62);
          }

          .summary-card:last-child {
            grid-column: span 2;
          }

          .summary-card dt {
            margin-bottom: 6px;
            color: var(--ink-soft);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .summary-card dd {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
          }

          /* ── Status Banner ── */
          .status-banner {
            display: none;
            flex-direction: column;
            gap: 10px;
            margin: 14px 18px 0;
            padding: 14px 16px;
            border-radius: var(--radius-md);
            border: 1px solid rgba(166, 40, 40, 0.18);
            background: rgba(166, 40, 40, 0.08);
            color: var(--danger);
          }

          .status-banner.visible {
            display: flex;
          }

          .status-banner strong {
            display: block;
            margin-bottom: 4px;
            font-size: 14px;
          }

          .status-banner p {
            margin: 0;
            line-height: 1.6;
            font-size: 13px;
            word-break: break-word;
          }

          .banner-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          /* ── Content Grid ── */
          .content-grid {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 14px 18px 18px;
            min-height: 0;
          }

          .card {
            min-width: 0;
            border: 1px solid var(--ink-faint);
            border-radius: var(--radius-xl);
            background: rgba(255, 255, 255, 0.66);
            overflow: hidden;
          }

          .card-header {
            padding: 16px 18px 12px;
            border-bottom: 1px solid var(--ink-faint);
          }

          .card-title {
            margin: 0 0 4px;
            font-family: "Iowan Old Style", "Palatino Linotype", serif;
            font-size: 20px;
          }

          .card-copy {
            margin: 0;
            color: var(--ink-soft);
            font-size: 13px;
            line-height: 1.6;
          }

          .items-scroll {
            max-height: 56vh;
            overflow: auto;
            padding: 10px 12px 14px;
            -webkit-overflow-scrolling: touch;
          }

          .item-card {
            margin-bottom: 10px;
            border: 1px solid var(--ink-faint);
            border-radius: var(--radius-md);
            padding: 12px;
            background: rgba(255, 255, 255, 0.76);
          }

          .item-meta {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 8px;
            color: var(--ink-soft);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .item-rank {
            color: var(--accent);
            font-weight: 700;
          }

          .item-title {
            margin: 0 0 8px;
            font-size: 16px;
            line-height: 1.45;
            word-break: break-word;
          }

          .item-summary {
            margin: 0 0 12px;
            color: var(--ink-soft);
            line-height: 1.65;
            font-size: 13px;
            word-break: break-word;
          }

          .item-links {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .item-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border-radius: var(--radius-pill);
            border: 1px solid var(--ink-faint);
            padding: 8px 12px;
            font-size: 12px;
            background: rgba(255, 255, 255, 0.72);
            min-height: 38px;
            transition: border-color 0.18s ease, color 0.18s ease;
          }

          .item-link:hover {
            border-color: rgba(202, 61, 40, 0.32);
            color: var(--accent);
          }

          /* ── Meta Grid ── */
          .meta-grid {
            display: grid;
            gap: 8px;
            padding: 12px;
          }

          .meta-row {
            display: grid;
            gap: 4px;
            padding: 10px 12px;
            border-radius: var(--radius-sm);
            background: rgba(255, 255, 255, 0.68);
            border: 1px solid var(--ink-faint);
          }

          .meta-label {
            color: var(--ink-soft);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }

          .meta-value {
            font-size: 13px;
            line-height: 1.6;
            word-break: break-word;
          }

          .raw-block {
            max-height: 200px;
            overflow: auto;
            padding: 12px;
            margin: 0;
            border-radius: var(--radius-sm);
            background: #191817;
            color: #f6eadb;
            font-family: "SFMono-Regular", "Menlo", monospace;
            font-size: 11px;
            line-height: 1.6;
            word-break: break-all;
            -webkit-overflow-scrolling: touch;
          }

          /* ── Footer ── */
          .footer-note {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 14px 18px 18px;
            color: var(--ink-soft);
            border-top: 1px solid var(--ink-faint);
            font-size: 12px;
          }

          .footer-note a {
            color: var(--ink-soft);
            transition: color 0.2s ease;
          }

          .footer-note a:hover {
            color: var(--accent);
          }

          /* ── Details/Summary ── */
          details {
            margin-top: 10px;
          }

          details summary {
            cursor: pointer;
            font-size: 12px;
            color: var(--ink-soft);
            padding: 6px 0;
            user-select: none;
          }

          details summary:hover {
            color: var(--accent);
          }

          /* ── Mobile Drawer ── */
          .mobile-drawer-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px 18px;
            border: none;
            border-bottom: 1px solid var(--ink-faint);
            background: rgba(255, 255, 255, 0.34);
            color: var(--ink-soft);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.18s ease;
          }

          .mobile-drawer-toggle:hover {
            background: rgba(255, 255, 255, 0.54);
          }

          .mobile-drawer-toggle svg {
            width: 16px;
            height: 16px;
            transition: transform 0.2s ease;
          }

          .sources-panel.collapsed .source-list,
          .sources-panel.collapsed .search-wrap,
          .sources-panel.collapsed .sources-meta,
          .sources-panel.collapsed .panel-header {
            display: none;
          }

          .sources-panel.collapsed .mobile-drawer-toggle svg {
            transform: rotate(180deg);
          }

          /* ── Desktop: >= 1024px ── */
          @media (min-width: 1024px) {
            .console-shell {
              padding: 28px;
            }

            .console-frame {
              border-radius: 30px;
            }

            .console-topbar {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
              padding: 28px 30px 22px;
            }

            .topbar-actions {
              max-width: 360px;
            }

            .console-body {
              flex-direction: row;
              min-height: 72vh;
            }

            .sources-panel {
              width: 340px;
              flex-shrink: 0;
              border-bottom: none;
              border-right: 1px solid var(--ink-faint);
            }

            .mobile-drawer-toggle {
              display: none;
            }

            .sources-panel.collapsed .source-list,
            .sources-panel.collapsed .search-wrap,
            .sources-panel.collapsed .sources-meta,
            .sources-panel.collapsed .panel-header {
              display: revert;
            }

            .source-list {
              max-height: none;
              height: calc(72vh - 220px);
            }

            .scan-panel {
              flex: 1;
            }

            .scan-hero {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
              gap: 20px;
              padding: 22px 24px 18px;
            }

            .scan-controls {
              flex-direction: column;
              align-items: flex-end;
            }

            .summary-grid {
              grid-template-columns: repeat(5, 1fr);
              gap: 14px;
              padding: 18px 24px;
            }

            .summary-card:last-child {
              grid-column: auto;
            }

            .summary-card dd {
              font-size: 24px;
            }

            .content-grid {
              display: grid;
              grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.95fr);
              gap: 18px;
              padding: 18px 24px 24px;
            }

            .footer-note {
              flex-direction: row;
              justify-content: space-between;
              padding: 16px 24px 20px;
              font-size: 13px;
            }

            .panel-header {
              padding: 20px 22px 14px;
            }

            .panel-title {
              font-size: 26px;
            }

            .search-wrap {
              padding: 16px 22px 14px;
            }

            .sources-meta {
              padding: 0 22px 12px;
            }

            .source-list {
              padding: 0 12px 16px;
            }

            .card-header {
              padding: 18px 20px 14px;
            }

            .card-title {
              font-size: 24px;
            }

            .status-banner {
              flex-direction: row;
              align-items: flex-start;
              justify-content: space-between;
              margin: 18px 24px 0;
            }

            .content-grid {
              padding: 18px 24px 24px;
            }

            .scan-title {
              font-size: clamp(28px, 3vw, 48px);
              line-height: 0.96;
            }

            .console-subtitle {
              font-size: 15px;
            }
          }

          /* ── Tablet: 768-1023px ── */
          @media (min-width: 768px) and (max-width: 1023px) {
            .console-shell {
              padding: 20px;
            }

            .summary-grid {
              grid-template-columns: repeat(3, 1fr);
            }

            .summary-card:last-child {
              grid-column: auto;
            }

            .content-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
            }

            .source-list {
              max-height: 280px;
            }
          }

          /* ── Small mobile: <= 390px ── */
          @media (max-width: 390px) {
            .console-shell {
              padding: 8px;
            }

            .console-frame {
              border-radius: var(--radius-md);
            }

            .topbar-buttons {
              flex-direction: column;
            }

            .topbar-buttons .btn {
              width: 100%;
            }

            .scan-actions {
              width: 100%;
            }

            .scan-actions .btn {
              flex: 1;
            }

            .item-links {
              flex-direction: column;
            }

            .item-link,
            .btn--copy {
              width: 100%;
              justify-content: center;
            }
          }

          /* ── Reduced motion ── */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              transition-duration: 0.01ms !important;
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
                  面向机器消费接口的人工浏览层。筛选失败源、批量刷新可见源、搜索高亮源 id，
                  并把单条条目的原始 JSON 直接复制给运营或下游工程。
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
                  <button id="refresh-sources" class="btn" type="button">刷新源列表</button>
                  <button id="batch-refresh" class="btn btn--batch" type="button">批量刷新可见源</button>
                  <a class="btn" href="/api/radar/sources" target="_blank">查看原始接口</a>
                </div>
              </div>
            </header>

            <div class="console-body">
              <aside id="sources-panel" class="sources-panel collapsed">
                <button id="drawer-toggle" class="mobile-drawer-toggle" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                  </svg>
                  源列表
                </button>

                <div class="panel-header">
                  <h2 class="panel-title">源列表</h2>
                  <p class="panel-copy">
                    搜索会高亮匹配片段。切换只看失败源，再对当前可见源做批量刷新。
                  </p>
                </div>

                <div class="search-wrap">
                  <input
                    id="source-search"
                    class="search-input"
                    type="search"
                    placeholder="搜索 source_id、route_path 或错误文案"
                    autocomplete="off"
                  />
                  <div class="filter-row">
                    <label class="toggle-wrap">
                      <input id="only-failed-toggle" type="checkbox" />
                      <span>只看失败源</span>
                    </label>
                    <span id="batch-status" class="batch-status">批量状态：空闲</span>
                  </div>
                </div>

                <div class="sources-meta">
                  <span id="sources-count">加载中...</span>
                  <span id="failed-count">失败 0</span>
                </div>

                <div id="source-list" class="source-list">
                  <div class="empty-state">正在载入可用源列表...</div>
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
                    <div class="scan-actions">
                      <button id="run-scan" class="btn btn--scan" type="button">扫描当前源</button>
                    </div>
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
                  <div class="summary-card">
                    <dt>失败源</dt>
                    <dd id="stat-failed">0</dd>
                  </div>
                </dl>

                <section id="error-banner" class="status-banner" aria-live="polite">
                  <div>
                    <strong>扫描失败</strong>
                    <p id="error-text">暂无错误。</p>
                  </div>
                  <div class="banner-actions">
                    <a class="btn" href="/api/radar/health" target="_blank" style="min-height: 38px; padding: 8px 12px; font-size: 12px;">打开健康检查</a>
                  </div>
                </section>

                <div class="content-grid">
                  <section class="card">
                    <div class="card-header">
                      <h3 class="card-title">条目浏览</h3>
                      <p class="card-copy">
                        查看归一后的标题、热度、发布时间和目标链接。每条条目都可以直接复制 raw JSON 给下游复核。
                      </p>
                    </div>
                    <div id="items-scroll" class="items-scroll">
                      <div class="empty-state">还没有扫描结果。先从左侧选一个源，再点击"扫描当前源"。</div>
                    </div>
                  </section>

                  <section id="scan-detail" class="card">
                    <div class="card-header">
                      <h3 class="card-title">源级元数据</h3>
                      <p class="card-copy">源状态、缓存 TTL、更新时间、参数、原始响应条目数等机器消费字段。</p>
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
                  "/api/radar/scan/" + encodeURIComponent(sourceId) + (forceRefresh ? "?cache=false" : ""),
              };

              const state = {
                sources: [],
                filteredSources: [],
                sourceStatuses: {},
                selectedSource: "",
                health: null,
                scan: null,
                currentItems: [],
                error: "",
                showFailedOnly: false,
                batchRunning: false,
                batchProgress: { done: 0, total: 0 },
              };

              const $ = (id) => document.getElementById(id);
              const healthStatus = $("health-status");
              const sourceSearch = $("source-search");
              const onlyFailedToggle = $("only-failed-toggle");
              const sourceList = $("source-list");
              const sourcesCount = $("sources-count");
              const failedCount = $("failed-count");
              const batchStatus = $("batch-status");
              const batchRefreshButton = $("batch-refresh");
              const scanTitle = $("scan-title");
              const scanSubtitle = $("scan-subtitle");
              const forceRefresh = $("force-refresh");
              const runScanButton = $("run-scan");
              const itemsScroll = $("items-scroll");
              const metaGrid = $("meta-grid");
              const errorBanner = $("error-banner");
              const errorText = $("error-text");
              const statStatus = $("stat-status");
              const statCache = $("stat-cache");
              const statLatency = $("stat-latency");
              const statCount = $("stat-count");
              const statFailed = $("stat-failed");
              const sourcesPanel = $("sources-panel");
              const drawerToggle = $("drawer-toggle");

              /* ── Drawer toggle for mobile ── */
              drawerToggle.addEventListener("click", () => {
                sourcesPanel.classList.toggle("collapsed");
              });

              /* ── Auto-expand on desktop ── */
              const checkDesktop = () => {
                if (window.innerWidth >= 1024) {
                  sourcesPanel.classList.remove("collapsed");
                }
              };
              checkDesktop();
              window.addEventListener("resize", checkDesktop);

              const toSafe = (value) => {
                if (value === null || value === undefined || value === "") return "\u2014";
                return String(value);
              };

              const truncate = (value, max = 80) => {
                const text = toSafe(value);
                return text.length > max ? text.slice(0, max) + "\u2026" : text;
              };

              const formatDate = (value) => {
                if (!value) return "\u2014";
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

              const highlightHtml = (value, keyword) => {
                const text = String(value || "");
                if (!keyword) return escapeHtml(text);
                const lower = text.toLowerCase();
                const target = keyword.toLowerCase();
                const index = lower.indexOf(target);
                if (index < 0) return escapeHtml(text);
                const start = escapeHtml(text.slice(0, index));
                const match = escapeHtml(text.slice(index, index + keyword.length));
                const end = escapeHtml(text.slice(index + keyword.length));
                return start + '<mark class="source-mark">' + match + "</mark>" + end;
              };

              const getSourceStatus = (sourceId) =>
                state.sourceStatuses[sourceId] || {
                  status: "idle",
                  lastFetchedAt: "",
                  errorMessage: "",
                  itemCount: null,
                };

              const getFailedCount = () =>
                Object.values(state.sourceStatuses).filter((entry) => entry.status === "error").length;

              const renderBatchStatus = () => {
                if (state.batchRunning) {
                  batchStatus.textContent =
                    "\u6279\u91cf\u72b6\u6001\uff1a\u8fdb\u884c\u4e2d " +
                    state.batchProgress.done +
                    "/" +
                    state.batchProgress.total;
                  batchRefreshButton.textContent =
                    "\u6279\u91cf\u5237\u65b0\u4e2d " +
                    state.batchProgress.done +
                    "/" +
                    state.batchProgress.total;
                  batchRefreshButton.disabled = true;
                } else {
                  batchStatus.textContent = "\u6279\u91cf\u72b6\u6001\uff1a\u7a7a\u95f2";
                  batchRefreshButton.textContent = "\u6279\u91cf\u5237\u65b0\u53ef\u89c1\u6e90";
                  batchRefreshButton.disabled = false;
                }
              };

              const setError = (message) => {
                state.error = message || "";
                errorText.textContent = state.error || "\u6682\u65e0\u9519\u8bef\u3002";
                errorBanner.classList.toggle("visible", Boolean(state.error));
              };

              const setSourceStatus = (sourceId, patch) => {
                state.sourceStatuses[sourceId] = {
                  ...getSourceStatus(sourceId),
                  ...patch,
                };
              };

              const renderHealth = () => {
                if (!state.health) {
                  healthStatus.innerHTML = '<span class="status-dot"></span>\u5065\u5eb7\u68c0\u67e5\u672a\u8fd4\u56de';
                  return;
                }
                healthStatus.innerHTML =
                  '<span class="status-dot"></span>' +
                  escapeHtml("\u670d\u52a1 " + state.health.service_status + " / \u6570\u636e " + state.health.data_status);
              };

              const renderSourcesMeta = () => {
                sourcesCount.textContent = "\u5171 " + state.filteredSources.length + " \u4e2a\u53ef\u89c1\u6e90";
                failedCount.textContent = "\u5931\u8d25 " + getFailedCount();
                statFailed.textContent = String(getFailedCount());
                renderBatchStatus();
              };

              const getSourceChip = (statusInfo) => {
                if (statusInfo.status === "error") return { className: "error", text: "\u5931\u8d25" };
                if (statusInfo.status === "loading") return { className: "loading", text: "\u626b\u63cf\u4e2d" };
                if (statusInfo.status === "ok") return { className: "ok", text: "\u6b63\u5e38" };
                return { className: "idle", text: "\u672a\u626b\u63cf" };
              };

              const getSourceNote = (sourceId, statusInfo) => {
                if (statusInfo.status === "error") {
                  return "\u6700\u8fd1\u5931\u8d25\uff1a" + truncate(statusInfo.errorMessage || "\u672a\u77e5\u9519\u8bef", 46);
                }
                if (statusInfo.status === "ok") {
                  return (
                    "\u6700\u8fd1\u6210\u529f\uff1a" +
                    formatDate(statusInfo.lastFetchedAt) +
                    " \u00b7 " +
                    toSafe(statusInfo.itemCount) +
                    " \u6761"
                  );
                }
                if (statusInfo.status === "loading") {
                  return "\u6b63\u5728\u62c9\u53d6 /api/radar/scan/" + sourceId;
                }
                return "\u5c1a\u672a\u6267\u884c\u626b\u63cf";
              };

              const renderSources = () => {
                renderSourcesMeta();
                if (!state.filteredSources.length) {
                  sourceList.innerHTML = state.showFailedOnly
                    ? '<div class="empty-state">\u5f53\u524d\u8fd8\u6ca1\u6709\u5931\u8d25\u6e90\u3002\u5148\u8fdb\u884c\u626b\u63cf\u6216\u6279\u91cf\u5237\u65b0\uff0c\u518d\u5207\u56de\u8fd9\u4e2a\u7b5b\u9009\u3002</div>'
                    : '<div class="empty-state">\u6ca1\u6709\u5339\u914d\u7684\u6e90\u3002\u6362\u4e2a\u5173\u952e\u5b57\u518d\u8bd5\u4e00\u6b21\u3002</div>';
                  return;
                }

                const keyword = sourceSearch.value.trim();
                sourceList.innerHTML = state.filteredSources
                  .map((source) => {
                    const statusInfo = getSourceStatus(source.source_id);
                    const chip = getSourceChip(statusInfo);
                    const classes = [
                      "source-button",
                      source.source_id === state.selectedSource ? "active" : "",
                      statusInfo.status === "error" ? "error" : "",
                      statusInfo.status === "loading" ? "loading" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      '<button class="' +
                      classes +
                      '" type="button" data-source-id="' +
                      escapeHtml(source.source_id) +
                      '">' +
                      '<div class="source-topline">' +
                      '<div>' +
                      '<div class="source-name">' +
                      highlightHtml(source.source_id, keyword) +
                      "</div>" +
                      '<div class="source-id">' +
                      highlightHtml(source.route_path, keyword) +
                      "</div>" +
                      "</div>" +
                      '<span class="source-chip ' +
                      chip.className +
                      '">' +
                      chip.text +
                      "</span>" +
                      "</div>" +
                      '<div class="source-note">' +
                      highlightHtml(getSourceNote(source.source_id, statusInfo), keyword) +
                      "</div>" +
                      "</button>"
                    );
                  })
                  .join("");

                sourceList.querySelectorAll("[data-source-id]").forEach((element) => {
                  element.addEventListener("click", () => {
                    state.selectedSource = element.getAttribute("data-source-id") || "";
                    window.location.hash = state.selectedSource;
                    /* On mobile, collapse the source list after selection */
                    if (window.innerWidth < 1024) {
                      sourcesPanel.classList.add("collapsed");
                    }
                    renderSources();
                    runSelectedScan();
                  });
                });
              };

              const renderSummary = (source, items) => {
                const selectedStatus = state.selectedSource ? getSourceStatus(state.selectedSource) : null;
                statStatus.textContent = source
                  ? toSafe(source.status)
                  : selectedStatus
                    ? toSafe(selectedStatus.status)
                    : "\u5f85\u547d";
                statCache.textContent = source ? (source.from_cache ? "\u662f" : "\u5426") : "\u2014";
                statLatency.textContent = source ? toSafe(source.latency_ms) + " ms" : "\u2014";
                statCount.textContent = Array.isArray(items) ? String(items.length) : "\u2014";
                statFailed.textContent = String(getFailedCount());
              };

              const renderMeta = (source) => {
                if (!source) {
                  metaGrid.innerHTML = '<div class="empty-state">\u7b49\u5f85\u9009\u62e9\u70ed\u699c\u6e90\u3002</div>';
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

              const copyText = async (text) => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  await navigator.clipboard.writeText(text);
                  return;
                }

                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
              };

              const bindCopyButtons = () => {
                itemsScroll.querySelectorAll("[data-copy-raw-index]").forEach((button) => {
                  button.addEventListener("click", async () => {
                    const index = Number.parseInt(button.getAttribute("data-copy-raw-index") || "-1", 10);
                    const item = state.currentItems[index];
                    if (!item) return;

                    try {
                      await copyText(JSON.stringify(item.raw, null, 2));
                      button.classList.add("copied");
                      const originalText = button.textContent || "\u590d\u5236 raw JSON";
                      button.textContent = "\u2713 \u5df2\u590d\u5236";
                      window.setTimeout(() => {
                        button.classList.remove("copied");
                        button.textContent = originalText;
                      }, 1400);
                    } catch (error) {
                      setError(error instanceof Error ? error.message : "\u590d\u5236\u5931\u8d25");
                    }
                  });
                });
              };

              const renderItems = (items) => {
                state.currentItems = Array.isArray(items) ? items : [];
                if (!state.currentItems.length) {
                  itemsScroll.innerHTML = '<div class="empty-state">\u8fd9\u4e2a\u6e90\u5f53\u524d\u6ca1\u6709\u53ef\u5c55\u793a\u7684\u6761\u76ee\u3002</div>';
                  return;
                }

                itemsScroll.innerHTML = state.currentItems
                  .map((item, index) => {
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
                      '<a class="item-link" href="' + escapeHtml(item.url) + '" target="_blank">\u6253\u5f00\u94fe\u63a5</a>' +
                      '<a class="item-link" href="' + escapeHtml(item.mobile_url || item.url) + '" target="_blank">\u79fb\u52a8\u7aef</a>' +
                      '<button class="btn btn--copy copy-raw-button" type="button" data-copy-raw-index="' +
                      index +
                      '">\u590d\u5236 raw JSON</button>' +
                      "</div>" +
                      '<details>' +
                      "<summary>\u67e5\u770b\u539f\u59cb\u6570\u636e</summary>" +
                      '<pre class="raw-block" style="margin-top: 8px;">' +
                      escapeHtml(JSON.stringify(item.raw, null, 2)) +
                      "</pre>" +
                      "</details>" +
                      "</article>"
                    );
                  })
                  .join("");

                bindCopyButtons();
              };

              const renderScan = () => {
                const source = state.scan && state.scan.source ? state.scan.source : null;
                const items = state.scan && state.scan.items ? state.scan.items : [];
                const selectedStatus = state.selectedSource ? getSourceStatus(state.selectedSource) : null;

                if (source) {
                  scanTitle.textContent = source.source_name;
                  scanSubtitle.textContent =
                    "\u5f53\u524d\u6e90\uff1a" + source.source_id + " \u00b7 " + toSafe(source.description || source.link);
                } else if (state.selectedSource) {
                  scanTitle.textContent = state.selectedSource;
                  scanSubtitle.textContent =
                    selectedStatus && selectedStatus.status === "error"
                      ? "\u6700\u8fd1\u5931\u8d25\uff1a" + truncate(selectedStatus.errorMessage || "\u672a\u77e5\u9519\u8bef", 100)
                      : "\u8fd9\u4e2a\u6e90\u8fd8\u6ca1\u6709\u6210\u529f\u626b\u63cf\u7ed3\u679c\u3002\u4f60\u53ef\u4ee5\u7ee7\u7eed\u91cd\u8bd5\u6216\u5207\u6362\u5230\u6279\u91cf\u5237\u65b0\u3002";
                } else {
                  scanTitle.textContent = "\u9009\u62e9\u4e00\u4e2a\u6e90\u5f00\u59cb\u6d4f\u89c8";
                  scanSubtitle.textContent =
                    "\u5de6\u4fa7\u70b9\u51fb\u4efb\u610f\u6e90\u540e\uff0c\u8fd9\u91cc\u4f1a\u5c55\u793a\u8be5\u6e90\u7684\u626b\u63cf\u7ed3\u679c\u3001\u9519\u8bef\u72b6\u6001\u3001\u5ef6\u8fdf\u3001\u7f13\u5b58\u547d\u4e2d\u4e0e\u6761\u76ee\u539f\u59cb\u6570\u636e\u3002";
                }

                renderSummary(source, items);
                renderMeta(source);
                renderItems(items);
              };

              const fetchJson = async (url) => {
                const response = await fetch(url, { headers: { Accept: "application/json" } });
                const payload = await response.json();
                if (!response.ok || payload.code >= 400) {
                  const details =
                    payload && payload.error && payload.error.details
                      ? JSON.stringify(payload.error.details)
                      : "";
                  throw new Error((payload.message || "\u8bf7\u6c42\u5931\u8d25") + (details ? " \u00b7 " + details : ""));
                }
                return payload.data;
              };

              const loadHealth = async () => {
                try {
                  state.health = await fetchJson(endpoints.health);
                  renderHealth();
                } catch (error) {
                  healthStatus.innerHTML =
                    '<span class="status-dot" style="background: var(--danger); box-shadow: 0 0 0 6px rgba(166, 40, 40, 0.12);"></span>\u5065\u5eb7\u68c0\u67e5\u5931\u8d25';
                  setError(error instanceof Error ? error.message : "\u5065\u5eb7\u68c0\u67e5\u5931\u8d25");
                }
              };

              const filterSources = () => {
                const keyword = sourceSearch.value.trim().toLowerCase();
                state.showFailedOnly = onlyFailedToggle.checked;

                state.filteredSources = state.sources.filter((source) => {
                  const statusInfo = getSourceStatus(source.source_id);
                  if (state.showFailedOnly && statusInfo.status !== "error") {
                    return false;
                  }

                  if (!keyword) return true;
                  return (
                    source.source_id.toLowerCase().includes(keyword) ||
                    source.route_path.toLowerCase().includes(keyword) ||
                    (statusInfo.errorMessage || "").toLowerCase().includes(keyword)
                  );
                });

                if (
                  state.selectedSource &&
                  !state.filteredSources.some((source) => source.source_id === state.selectedSource)
                ) {
                  state.selectedSource = state.filteredSources[0] ? state.filteredSources[0].source_id : "";
                }

                renderSources();
              };

              const scanSource = async (sourceId, paintPanel = false) => {
                const startedAt = new Date().toISOString();
                setSourceStatus(sourceId, {
                  status: "loading",
                  errorMessage: "",
                  lastFetchedAt: startedAt,
                });
                renderSources();

                if (paintPanel) {
                  setError("");
                  scanTitle.textContent = "\u6b63\u5728\u626b\u63cf " + sourceId;
                  scanSubtitle.textContent = "\u8bf7\u6c42 " + endpoints.scan(sourceId, forceRefresh.checked);
                  itemsScroll.innerHTML = '<div class="empty-state">\u6b63\u5728\u83b7\u53d6\u6761\u76ee\u4e0e\u5143\u6570\u636e\u2026</div>';
                  metaGrid.innerHTML = '<div class="empty-state">\u6b63\u5728\u83b7\u53d6\u6e90\u7ea7\u5143\u6570\u636e\u2026</div>';
                  renderSummary(null, null);
                }

                try {
                  const data = await fetchJson(endpoints.scan(sourceId, forceRefresh.checked));
                  setSourceStatus(sourceId, {
                    status: "ok",
                    errorMessage: "",
                    lastFetchedAt: data.source && data.source.fetched_at ? data.source.fetched_at : startedAt,
                    itemCount:
                      data.source && data.source.normalized_count !== undefined
                        ? data.source.normalized_count
                        : Array.isArray(data.items)
                          ? data.items.length
                          : null,
                  });
                  renderSources();

                  if (paintPanel) {
                    state.scan = data;
                    setError("");
                    renderScan();
                  }

                  return data;
                } catch (error) {
                  const message = error instanceof Error ? error.message : "\u626b\u63cf\u5931\u8d25";
                  setSourceStatus(sourceId, {
                    status: "error",
                    errorMessage: message,
                    lastFetchedAt: startedAt,
                    itemCount: null,
                  });
                  renderSources();

                  if (paintPanel) {
                    state.scan = null;
                    renderScan();
                    setError(message);
                  }

                  return null;
                }
              };

              const runSelectedScan = async () => {
                if (!state.selectedSource) {
                  renderScan();
                  return;
                }
                await scanSource(state.selectedSource, true);
              };

              const runBatchRefresh = async () => {
                if (!state.filteredSources.length || state.batchRunning) {
                  return;
                }

                state.batchRunning = true;
                state.batchProgress = { done: 0, total: state.filteredSources.length };
                renderBatchStatus();

                if (!state.selectedSource) {
                  state.selectedSource = state.filteredSources[0].source_id;
                }

                for (const source of state.filteredSources) {
                  await scanSource(source.source_id, source.source_id === state.selectedSource);
                  state.batchProgress.done += 1;
                  renderBatchStatus();
                }

                state.batchRunning = false;
                renderBatchStatus();
              };

              const loadSources = async () => {
                sourceList.innerHTML = '<div class="empty-state">\u6b63\u5728\u5237\u65b0\u6e90\u5217\u8868\u2026</div>';
                try {
                  const data = await fetchJson(endpoints.sources);
                  state.sources = data.sources || [];
                  const hashSource = window.location.hash.replace(/^#/, "");
                  if (!state.selectedSource) {
                    state.selectedSource = hashSource || (state.sources[0] ? state.sources[0].source_id : "");
                  }
                  filterSources();
                  if (state.selectedSource) {
                    await runSelectedScan();
                  } else {
                    renderScan();
                  }
                } catch (error) {
                  sourceList.innerHTML = '<div class="empty-state">\u6e90\u5217\u8868\u52a0\u8f7d\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002</div>';
                  setError(error instanceof Error ? error.message : "\u6e90\u5217\u8868\u52a0\u8f7d\u5931\u8d25");
                }
              };

              sourceSearch.addEventListener("input", filterSources);
              onlyFailedToggle.addEventListener("change", filterSources);
              $("refresh-sources").addEventListener("click", loadSources);
              batchRefreshButton.addEventListener("click", runBatchRefresh);
              runScanButton.addEventListener("click", runSelectedScan);

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
