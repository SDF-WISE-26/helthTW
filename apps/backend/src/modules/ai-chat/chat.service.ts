import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  type UIMessage,
  smoothStream,
  createIdGenerator,
} from "ai";
import { desc, eq } from "drizzle-orm";
import type { ChatCatalog } from "@helthtw/shared/chat";
import { db } from "../../db";
import { chatMessagesTable } from "../../db/schema";
import { chatModel } from "../../lib/llm";
import { buildSystemPrompt } from "./prompt/chat.prompt-utils";
import { createChatTools } from "./chat.tools";

const CONTEXT_MESSAGES = 20;

const generateMessageId = createIdGenerator({ prefix: "msg" });

export async function streamChatReply(accountId: string, message: UIMessage, catalog: ChatCatalog) {
  // load history before saving the newest message, the filter covers retries
  const history = (await loadMessages(accountId, CONTEXT_MESSAGES)).filter(
    (m) => m.id !== message.id,
  );
  await saveMessage(accountId, message);

  const messages = [...history, message];

  const result = streamText({
    model: chatModel,
    instructions: buildSystemPrompt(catalog),
    messages: await convertToModelMessages(messages),
    tools: createChatTools(catalog),
    maxOutputTokens: 600,
    experimental_transform: smoothStream(),
  });

  return toUIMessageStream({
    stream: result.stream,
    originalMessages: messages,
    generateMessageId,
    onEnd: async ({ responseMessage, outcome }) => {
      if (outcome.status !== "completed") return;
      try {
        await saveMessage(accountId, responseMessage);
      } catch (error) {
        console.error("Saving the chat reply failed:", error);
      }
    },
  });
}

// The newest `amount` messages of the account's chat, oldest first.
export async function loadMessages(accountId: string, amount: number): Promise<UIMessage[]> {
  const rows = await db
    .select({
      id: chatMessagesTable.id,
      role: chatMessagesTable.role,
      parts: chatMessagesTable.parts,
    })
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.accountId, accountId))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(amount);
  return rows.reverse();
}

// Called twice per turn: for the user message when the request arrives, for the reply when it ends.
export async function saveMessage(accountId: string, message: UIMessage) {
  await db
    .insert(chatMessagesTable)
    .values({
      id: message.id,
      accountId,
      role: message.role as "user" | "assistant",
      parts: message.parts,
    })
    .onConflictDoNothing();
}
