import { describe, expect, it, vi } from "vite-plus/test";
import app from "../../app";

// No database here: a request that reaches a query fails its test with a 500.
vi.mock("../../db", () => ({ db: {} }));

describe("error format", () => {
  it("rejects an invalid id before it reaches the database", async () => {
    const res = await app.request("/api/v1/users/abc");

    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("invalid_request");
  });

  it("rejects an id above the integer limit", async () => {
    const res = await app.request("/api/v1/users/2147483648");

    expect(res.status).toBe(400);
  });

  it("answers unknown routes in the same format", async () => {
    const res = await app.request("/api/v1/nope");

    expect(res.status).toBe(404);
    expect((await res.json()).error.code).toBe("not_found");
  });
});
