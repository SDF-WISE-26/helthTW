import { api } from "@/api";

// #93: server first, so a failed request keeps the device ID and the user can retry.
export async function deleteAllData() {
  const res = await api.api.v1.accounts.me.$delete();
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

  localStorage.clear();
  await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
  const workers = await navigator.serviceWorker?.getRegistrations();
  await Promise.all((workers ?? []).map((w) => w.unregister()));
  // The reload also empties the query cache.
  location.assign("/");
}
