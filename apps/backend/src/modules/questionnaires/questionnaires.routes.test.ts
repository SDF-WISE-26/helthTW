import { describe, expect, it } from "vite-plus/test";

process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { default: app } = await import("../../app");

describe("questionnaires routes", () => {
  it("lists the questionnaires", async () => {
    const res = await app.request("/api/v1/questionnaires");
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(list.map((q: { id: string }) => q.id)).toContain("isi");
  });

  it("returns one questionnaire by its id", async () => {
    const res = await app.request("/api/v1/questionnaires/isi");
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: "isi" });
  });

  it("answers an unknown id in the error format", async () => {
    const res = await app.request("/api/v1/questionnaires/nope");
    expect(res.status).toBe(404);
    expect((await res.json()).error.code).toBe("not_found");
  });
});
