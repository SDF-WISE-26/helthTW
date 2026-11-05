import { exampleSharedEnum } from "@helthtw/shared/example";
import { api } from "@/api";

// Placeholder, see packages/shared/src/example. Checks the value with the same enum
// as the backend before sending it, so an invalid value never leaves the browser.
export async function getExample(value: string) {
  const status = exampleSharedEnum.parse(value);
  const res = await api.api.v1.example.$get({ query: { status } });
  if (!res.ok) throw new Error(`example failed: ${res.status}`);
  return res.json();
}
