import { Hono } from "hono";
import { createUIMessageStreamResponse } from "ai";
import { chatRequestSchema } from "./chat.schemas";
import { loadMessages, streamChatReply } from "./chat.service";
import { validate } from "../../lib/validate";
import { requireAccount } from "../../middleware/require-account";

const DISPLAY_MESSAGES = 50;

export const chatRoutes = new Hono()
  .get("/", requireAccount, async (c) =>
    c.json({ messages: await loadMessages(c.get("accountId"), DISPLAY_MESSAGES) }, 200),
  )
  .post("/", requireAccount, validate("json", chatRequestSchema), async (c) => {
    const { message, catalog } = c.req.valid("json");

    const stream = await streamChatReply(c.get("accountId"), message, catalog);
    return createUIMessageStreamResponse({ stream });
  });
