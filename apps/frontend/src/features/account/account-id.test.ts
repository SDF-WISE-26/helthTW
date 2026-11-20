import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { ACCOUNT_ID_KEY } from "./account-id";

let getAccountId: typeof import("./account-id").getAccountId;

describe("getAccountId", () => {
  beforeEach(async () => {
    vi.resetModules();
    ({ getAccountId } = await import("./account-id"));
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      clear: () => store.clear(),
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

  it("keeps one session ID when reading browser storage throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("Storage blocked");
      },
    });

    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(getAccountId()).toBe(id);
  });

  it("keeps one session ID when accessing localStorage itself throws", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get: () => {
        throw new Error("Storage blocked");
      },
    });

    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(getAccountId()).toBe(id);
  });

  it("keeps an existing account ID when storage later becomes unreadable", () => {
    const id = getAccountId();
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("Storage blocked");
      },
    });

    expect(getAccountId()).toBe(id);
  });

  it("persists the session ID when reading storage becomes available again", () => {
    const workingStorage = localStorage;
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("Storage blocked");
      },
    });
    const id = getAccountId();

    vi.stubGlobal("localStorage", workingStorage);

    expect(getAccountId()).toBe(id);
    expect(localStorage.getItem(ACCOUNT_ID_KEY)).toBe(id);
  });

  it("keeps the same ID through write failures and persists it when writes recover", async () => {
    const store = new Map<string, string>();
    let writesBlocked = true;
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        if (writesBlocked) throw new Error("Storage full");
        store.set(k, v);
      },
    });

    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(getAccountId()).toBe(id);
    expect(store.has(ACCOUNT_ID_KEY)).toBe(false);

    writesBlocked = false;
    expect(getAccountId()).toBe(id);
    expect(store.get(ACCOUNT_ID_KEY)).toBe(id);

    vi.resetModules();
    const freshSession = await import("./account-id");
    expect(freshSession.getAccountId()).toBe(id);
  });

  it("creates a new ID after browser data is cleared and the page reloads", async () => {
    const previousId = getAccountId();
    localStorage.clear();

    vi.resetModules();
    const reloadedPage = await import("./account-id");
    const id = reloadedPage.getAccountId();
    expect(id).not.toBe(previousId);
    expect(localStorage.getItem(ACCOUNT_ID_KEY)).toBe(id);
  });

  it("creates and retains a v4 UUID when randomUUID is unavailable over HTTP", () => {
    const getRandomValues = crypto.getRandomValues.bind(crypto);
    vi.stubGlobal("crypto", { getRandomValues });

    const id = getAccountId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(getAccountId()).toBe(id);
  });
});
