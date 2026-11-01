import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
  status: ContentfulStatusCode;
  code: string;
  details?: unknown;

  constructor(status: ContentfulStatusCode, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof ApiError) {
    const { code, message, details } = err;
    return c.json({ error: { code, message, details } }, err.status);
  }
  // Hono's own errors, e.g. a request body that is not valid JSON.
  if (err instanceof HTTPException) {
    return c.json({ error: { code: "bad_request", message: err.message } }, err.status);
  }
  // Only the name: Drizzle puts query parameters into the message, and those can be health data.
  console.error(`${c.req.method} ${c.req.path} failed:`, err.name);
  return c.json({ error: { code: "internal_error", message: "Internal server error" } }, 500);
};

export const notFoundHandler: NotFoundHandler = (c) =>
  c.json({ error: { code: "not_found", message: "Route not found" } }, 404);
