import { z } from "zod";

// Longest conversation the backend accepts per request, for text chat and voice alike.
export const MAX_MESSAGES = 10;

// One plain-text turn, e.g. when a text chat continues as a voice session.
export const conversationMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().trim().min(1).max(2000),
});

export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
