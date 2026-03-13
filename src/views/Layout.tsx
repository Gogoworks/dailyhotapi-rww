import type { FC } from "hono/jsx";
import { css, Style } from "hono/css";

const Layout: FC = (props) => {
  const globalClass = css`
    :-hono-global {
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        -webkit-user-drag: none;
      }
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
      }
      html, body {
        min-height: 100vh;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(202, 61, 40, 0.08), transparent 32%),
          radial-gradient(circle at bottom right, rgba(15, 122, 107, 0.06), transparent 30%),
          linear-gradient(180deg, #f9f3eb 0%, #efe7dd 100%);
        font-family: "Avenir Next", "PingFang SC", "Segoe UI", sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      body {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background-image:
          linear-gradient(rgba(18, 18, 18, 0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(18, 18, 18, 0.025) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.3), transparent 60%);
      }
      a {
        text-decoration: none;
        color: inherit;
      }
      button, input {
        font: inherit;
      }

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        width: 100%;
        max-width: 680px;
        margin: 0 auto;
      }

      .page-icon {
        width: 88px;
        height: 88px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24px;
        border: 1px solid var(--ink-faint);
        background: rgba(255, 255, 255, 0.54);
        box-shadow: 0 8px 32px rgba(54, 36, 18, 0.06);
      }
      .page-icon img,
      .page-icon svg {
        width: 48px;
        height: 48px;
        color: var(--ink-soft);
      }

      .page-header {
        text-align: center;
        margin-bottom: 32px;
      }
      .page-title {
        font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
        font-size: clamp(28px, 5vw, 42px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin-bottom: 10px;
      }
      .page-subtitle {
        font-size: 16px;
        color: var(--ink-soft);
        line-height: 1.7;
      }

      .page-content {
        width: 100%;
        margin-bottom: 28px;
        padding: 18px 20px;
        border-radius: 16px;
        border: 1px solid var(--ink-faint);
        background: rgba(255, 255, 255, 0.54);
        user-select: text;
        word-break: break-word;
        font-size: 14px;
        line-height: 1.7;
        color: var(--ink-soft);
      }

      .page-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }
      .page-actions .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 46px;
        padding: 12px 20px;
        border: 1px solid var(--ink);
        border-radius: 999px;
        background: transparent;
        color: var(--ink);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          background-color 0.18s ease,
          color 0.18s ease;
      }
      .page-actions .action-button:hover {
        transform: translateY(-1px);
        background: var(--ink);
        color: var(--paper-strong);
      }
      .page-actions .action-button:active {
        transform: translateY(0);
      }
      .page-actions .action-button svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }
      .page-actions .action-button.primary {
        border-color: var(--accent);
        background: var(--accent-soft);
        color: var(--accent);
      }
      .page-actions .action-button.primary:hover {
        background: var(--accent);
        color: #fff;
      }

      footer {
        padding: 20px 24px 24px;
        text-align: center;
        color: var(--ink-soft);
        font-size: 13px;
        line-height: 1.8;
        border-top: 1px solid var(--ink-faint);
      }
      .footer-links {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        margin-bottom: 8px;
      }
      .footer-links a {
        display: flex;
        align-items: center;
        color: var(--ink-soft);
        transition: color 0.2s ease;
      }
      .footer-links a:hover {
        color: var(--ink);
      }
      .footer-links a svg {
        width: 20px;
        height: 20px;
      }
      .footer-text a {
        color: var(--ink-soft);
        transition: color 0.2s ease;
      }
      .footer-text a:hover {
        color: var(--accent);
      }
      .footer-divider {
        color: var(--ink-faint);
      }

      @media (max-width: 480px) {
        main {
          padding: 32px 16px;
        }
        .page-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
        }
        .page-icon img,
        .page-icon svg {
          width: 40px;
          height: 40px;
        }
        .page-actions {
          width: 100%;
        }
        .page-actions .action-button {
          flex: 1;
          min-width: 0;
        }
      }
    }
  `;
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charset="utf-8" />
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="DailyHot API - 聚合热门数据的 API 接口" />
        <Style>{globalClass}</Style>
      </head>
      <body>
        {props.children}
        <footer>
          <div class="footer-links">
            <a href="https://github.com/Gogoworks/dailyhotapi-rww" target="_blank" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                />
              </svg>
            </a>
            <a href="https://ricktung.com" target="_blank" aria-label="Homepage">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                />
              </svg>
            </a>
            <a href="mailto:hi@ricktung.com" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
                />
              </svg>
            </a>
          </div>
          <div class="footer-text">
            Copyright &copy;{" "}
            <a href="https://ricktung.com" target="_blank">
              睿客
            </a>
            <span class="footer-divider"> | </span>
            Powered by{" "}
            <a href="https://ricktung.com" target="_blank">
              ricktung
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
