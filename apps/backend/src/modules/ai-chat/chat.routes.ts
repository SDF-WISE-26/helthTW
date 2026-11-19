import { Hono } from "hono";
import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { chatRequestSchema } from "./chat.schemas";
import { streamChatReply } from "./chat.service";
import { validate } from "../../lib/validate";

export const chatRoutes = new Hono().post("/", validate("json", chatRequestSchema), async (c) => {
  const { messages, catalog } = c.req.valid("json");

  const stream = await streamChatReply(messages as UIMessage[], catalog);
  return createUIMessageStreamResponse({ stream });
});
