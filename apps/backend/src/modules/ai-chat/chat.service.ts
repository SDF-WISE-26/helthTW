import { convertToModelMessages, createUIMessageStream, generateId, type UIMessage } from "ai";
import { chatModel } from "../../lib/llm";
import { streamGuardedReply } from "../gateway/gateway.service";
import { SYSTEM_PROMPT } from "./chat.prompts";

// The reply goes through the gateway, so it arrives sentence by sentence, not token by token.
export async function streamChatReply(messages: UIMessage[], abortSignal?: AbortSignal) {
  const modelMessages = await convertToModelMessages(messages);

  return createUIMessageStream({
    execute: async ({ writer }) => {
      const id = generateId();
      writer.write({ type: "start" });
      writer.write({ type: "text-start", id });
      for await (const delta of streamGuardedReply({
        channel: "text",
        model: chatModel,
        instructions: SYSTEM_PROMPT,
        messages: modelMessages,
        maxOutputTokens: 600,
        abortSignal,
      })) {
        writer.write({ type: "text-delta", id, delta });
      }
      writer.write({ type: "text-end", id });
      writer.write({ type: "finish" });
    },
    // Generic text only: the real error may contain conversation content.
    onError: () => "The reply could not be generated.",
  });
}
