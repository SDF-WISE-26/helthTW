import { api } from "@/api";

// shortcut: mock with a fixed ID, replaced by a per-device ID in localStorage.
export function getAccountId() {
  return "00000000-0000-4000-8000-000000000000";
}

export async function deleteAllData() {
  await api.api.me.$delete({}, { headers: { "X-Account-Id": getAccountId() } });
}
