import { api } from "@/api";

// shortcut: mock, only calls the endpoint. Local cleanup follows with the settings entry.
export async function deleteAllData() {
  await api.api.me.$delete();
}
