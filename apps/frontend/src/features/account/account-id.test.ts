import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { ACCOUNT_ID_KEY, getAccountId } from "./account-id";

describe("getAccountId", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("creates a random UUID on first call and stores it", () => {
    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(localStorage.getItem(ACCOUNT_ID_KEY)).toBe(id);
  });

  it("returns the same ID on later calls", () => {
    expect(getAccountId()).toBe(getAccountId());
  });

  it("creates and retains a v4 UUID when randomUUID is unavailable over HTTP", () => {
    const getRandomValues = crypto.getRandomValues.bind(crypto);
    vi.stubGlobal("crypto", { getRandomValues });

    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(getAccountId()).toBe(id);
  });
});
