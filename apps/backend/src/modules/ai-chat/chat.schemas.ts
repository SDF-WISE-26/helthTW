import { z } from "zod";

// schema is mirroring the useChat hook from AI SDK
const uiMessageSchema = z
  .object({
    id: z.string(),
    role: z.enum(["user", "assistant"]),
    parts: z.array(z.object({ type: z.string() }).loose()),
  })
  .loose();

export const chatRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1),
});

export const MAX_MESSAGES = 10;
