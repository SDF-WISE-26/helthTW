import { llm, voice } from "@livekit/agents";
import type { ConversationMessage } from "@helthtw/shared/chat";
import { VOICE_INSTRUCTIONS } from "./voice.prompts";
import { voiceSessionRequestSchema } from "./voice.schemas";

export class HelthAgent extends voice.Agent {
  constructor(history: ConversationMessage[]) {
    const chatCtx = llm.ChatContext.empty();
    for (const { role, text } of history) chatCtx.addMessage({ role, content: text });
    super({ instructions: VOICE_INSTRUCTIONS, chatCtx });
  }
}

export function parseJobMetadata(metadata: string | undefined): ConversationMessage[] {
  try {
    return voiceSessionRequestSchema.parse(JSON.parse(metadata ?? "{}")).messages;
  } catch {
    return [];
  }
}
