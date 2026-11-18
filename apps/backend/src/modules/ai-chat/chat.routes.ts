import { Hono } from "hono";
import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { MAX_MESSAGES } from "@helthtw/shared/chat";
import { ApiError } from "../../lib/errors";
import { chatRequestSchema } from "./chat.schemas";
import { streamChatReply } from "./chat.service";
import { validate } from "../../lib/validate";

export const chatRoutes = new Hono().post("/", validate("json", chatRequestSchema), async (c) => {
  const messages = c.req.valid("json").messages as UIMessage[];

  if (messages.length > MAX_MESSAGES) {
    throw new ApiError(413, "conversation_too_long", "Conversation is too long");
  }

  const stream = await streamChatReply(messages, c.req.raw.signal);
  return createUIMessageStreamResponse({ stream });
});
