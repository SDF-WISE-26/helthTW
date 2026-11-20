import { describe, expect, it } from "vite-plus/test";
import { usageSelectionSchema } from "./usage-selection-form";

describe("usageSelectionSchema", () => {
  it("allows exploring without a profession", () => {
    expect(usageSelectionSchema.safeParse({ usageMode: "explore", profession: null }).success).toBe(
      true,
    );
  });

  it("requires a profession for professional usage and marks the profession field", () => {
    const result = usageSelectionSchema.safeParse({ usageMode: "professional", profession: null });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["profession"] })]),
      );
    }
  });

  it("allows professional usage with a valid profession", () => {
    expect(
      usageSelectionSchema.safeParse({ usageMode: "professional", profession: "fire_service" })
        .success,
    ).toBe(true);
  });

  it("rejects an unknown profession", () => {
    expect(
      usageSelectionSchema.safeParse({ usageMode: "professional", profession: "unknown" }).success,
    ).toBe(false);
  });

  it("requires a usage mode before continuing", () => {
    expect(usageSelectionSchema.safeParse({ profession: null }).success).toBe(false);
  });
});
