import { queryOptions } from "@tanstack/react-query";
import { api } from "@/api";
import type { ChatUIMessage } from "./chat-thread";

export const chatHistoryQuery = queryOptions({
  queryKey: ["chat", "history"],
  queryFn: async () => {
    const res = await api.api.v1.chat.$get();
    if (!res.ok) throw new Error(`Loading the chat failed: ${res.status}`);
    const { messages } = await res.json();
    return messages as unknown as ChatUIMessage[];
  },
});
