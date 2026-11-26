import type { ChatUIMessage } from "./chat-thread";

// Free text, or else the reply the model wrote into show_material (shown while it streams in).
export function textOf(message: ChatUIMessage) {
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  if (text) return text;
  const material = message.parts.find((p) => p.type === "tool-show_material");
  return material?.input?.reply ?? "";
}
