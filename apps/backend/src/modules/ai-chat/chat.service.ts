import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  type UIMessage,
  smoothStream,
} from "ai";
import { desc, eq } from "drizzle-orm";
import type { ChatCatalog } from "@helthtw/shared/chat";
import { db } from "../../db";
import { chatMessagesTable } from "../../db/schema";
import { chatModel } from "../../lib/llm";
import { buildSystemPrompt } from "./prompt/chat.prompt-utils";
import { createChatTools } from "./chat.tools";

export async function streamChatReply(messages: UIMessage[], catalog: ChatCatalog) {
  const result = streamText({
    model: chatModel,
    instructions: buildSystemPrompt(catalog),
    messages: await convertToModelMessages(messages),
    tools: createChatTools(catalog),
    maxOutputTokens: 600,
    experimental_transform: smoothStream(),
  });

  return toUIMessageStream({ stream: result.stream });
}

const DISPLAY_LIMIT = 100;

// The newest `limit` messages of the account's chat, oldest first.
export async function loadMessages(accountId: string, limit = DISPLAY_LIMIT): Promise<UIMessage[]> {
  const rows = await db
    .select({
      id: chatMessagesTable.id,
      role: chatMessagesTable.role,
      parts: chatMessagesTable.parts,
    })
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.accountId, accountId))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(limit);
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

export async function clearMessages(accountId: string) {
  await db.delete(chatMessagesTable).where(eq(chatMessagesTable.accountId, accountId));
}
