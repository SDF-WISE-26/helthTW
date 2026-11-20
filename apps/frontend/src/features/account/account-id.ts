export const ACCOUNT_ID_KEY = "accountId";
let sessionAccountId: string | undefined;

function createAccountId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  // Temporary fallback for local phone tests over HTTP (--host).
  // TODO (#95): Remove once local phone tests are not used
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

// PoC: random ID per device, sent with every request. Not secure, test data only.
export function getAccountId() {
  try {
    const storedId = localStorage.getItem(ACCOUNT_ID_KEY);
    if (storedId) {
      sessionAccountId = storedId;
      return storedId;
    }

    if (!sessionAccountId) sessionAccountId = createAccountId();
    localStorage.setItem(ACCOUNT_ID_KEY, sessionAccountId);
  } catch {
    if (!sessionAccountId) sessionAccountId = createAccountId();
  }
  return sessionAccountId;
}
