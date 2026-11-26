import { conversationMessageSchema, VOICE_HISTORY_MAX_MESSAGES } from "@helthtw/shared/chat";
import { z } from "zod";

// The worker parses the dispatch metadata with this schema again, it trusts no input.
export const voiceSessionRequestSchema = z.object({
  messages: z.array(conversationMessageSchema).max(VOICE_HISTORY_MAX_MESSAGES).default([]),
});
