import type { Context } from "hono";

type JsonErrorOptions = {
  status: 400 | 404 | 500 | 502;
  message: string;
  type: string;
  details?: Record<string, unknown> | null;
};

const getRequestMeta = (c: Context) => ({
  path: new URL(c.req.url).pathname,
  timestamp: new Date().toISOString(),
});

export const jsonSuccess = <T>(c: Context, data: T, status: 200 | 201 = 200) => {
  return c.json(
    {
      code: status,
      data,
      meta: getRequestMeta(c),
    },
    status,
  );
};

export const jsonError = (c: Context, options: JsonErrorOptions) => {
  const { status, message, type, details = null } = options;

  return c.json(
    {
      code: status,
      message,
      data: null,
      error: {
        type,
        details,
      },
      meta: getRequestMeta(c),
    },
    status,
  );
};
