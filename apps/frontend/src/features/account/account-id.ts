export const ACCOUNT_ID_KEY = "accountId";
let sessionAccountId: string | undefined;

// PoC: random ID per device, sent with every request. Not secure, test data only.
export function getAccountId() {
  try {
    const storedId = localStorage.getItem(ACCOUNT_ID_KEY);
    if (storedId) {
      sessionAccountId = storedId;
      return storedId;
    }

    if (!sessionAccountId) sessionAccountId = crypto.randomUUID();
    localStorage.setItem(ACCOUNT_ID_KEY, sessionAccountId);
  } catch {
    if (!sessionAccountId) sessionAccountId = crypto.randomUUID();
  }
  return sessionAccountId;
}
