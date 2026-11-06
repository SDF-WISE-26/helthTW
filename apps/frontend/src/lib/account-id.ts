export const ACCOUNT_ID_KEY = "accountId";

// PoC (#92): random ID per device, sent with every request. Hardening in #145.
export function getAccountId() {
  let id = localStorage.getItem(ACCOUNT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ACCOUNT_ID_KEY, id);
  }
  return id;
}
