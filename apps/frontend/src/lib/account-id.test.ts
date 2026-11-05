import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { ACCOUNT_ID_KEY, getAccountId } from "./account-id";

describe("getAccountId", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    });
  });

  it("creates a random UUID on first call and stores it", () => {
    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(localStorage.getItem(ACCOUNT_ID_KEY)).toBe(id);
  });

  it("returns the same ID on later calls", () => {
    expect(getAccountId()).toBe(getAccountId());
  });
});
