import { streamText, convertToModelMessages, toUIMessageStream, type UIMessage } from "ai";
import { chatModel } from "../../lib/llm";
import { SYSTEM_PROMPT } from "./chat.prompts";

export async function streamChatReply(messages: UIMessage[]) {
  const result = streamText({
    model: chatModel,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
  });

  return toUIMessageStream({ stream: result.stream });
}
