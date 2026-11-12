import { describe, expect, it } from "vite-plus/test";
import { content, problems } from "./content";

describe("content/", () => {
  it("has no problems", () => {
    expect(problems).toEqual([]);
  });

  it("is bundled", () => {
    expect(content.items.length).toBeGreaterThan(0);
    expect(content.contacts.length).toBeGreaterThan(0);
  });
});
