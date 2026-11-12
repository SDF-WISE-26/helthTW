import { z } from "zod";
import { MAX_MESSAGES } from "../ai-chat/chat.schemas";

// Recent chat so the voice conversation continues where the text chat stopped.
const historyMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const createSessionSchema = z.object({
  history: z.array(historyMessageSchema).max(MAX_MESSAGES).default([]),
});

export type HistoryMessage = z.infer<typeof historyMessageSchema>;
