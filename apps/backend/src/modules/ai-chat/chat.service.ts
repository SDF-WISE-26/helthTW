import { streamText, convertToModelMessages, toUIMessageStream, type UIMessage } from "ai";
import type { ChatCatalog } from "@helthtw/shared/chat";
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
  });

  return toUIMessageStream({ stream: result.stream });
}
