import { api } from "@/api";

export const professionValues = [
  "first_responder",
  "emergency_medical_services",
  "fire_service",
  "police",
  "civil_protection",
  "armed_forces",
  "other",
] as const;

export type Profession = (typeof professionValues)[number];

// TODO (#95): Clarify additional profile fields, allowed values and required/optional status.
// TODO (#95): Move profession values to a shared Zod schema
// and persist the selected profession through the account API.
export type AccountProfile = {
  profession: Profession | null;
};

export async function ensureAccount() {
  const res = await api.api.v1.accounts.me.$get();
  if (!res.ok) throw new Error(`Account initialization failed: ${res.status}`);
  return res.json();
}

// Server first, so a failed request keeps the device ID and the user can retry.
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
