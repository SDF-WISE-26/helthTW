import { z } from "zod";
import { chatCatalogSchema } from "@helthtw/shared/chat";

// The client sends only the new message from the user
const userMessageSchema = z.object({
  id: z.string().min(1).max(64),
  role: z.literal("user"),
  parts: z.array(z.object({ type: z.literal("text"), text: z.string().min(1) })).min(1),
});

export const chatRequestSchema = z.object({
  message: userMessageSchema,
  catalog: chatCatalogSchema,
});
