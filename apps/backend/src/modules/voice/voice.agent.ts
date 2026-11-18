import { llm, voice } from "@livekit/agents";
import type { ConversationMessage } from "@helthtw/shared/chat";
import { VOICE_INSTRUCTIONS } from "./voice.prompts";
import { voiceJobMetadataSchema } from "./voice.schemas";

/**
 * The voice agent. Pipeline stages come from the session (providers/), this class is where
 * per-agent behaviour goes. Planned hook for the avatar: override ttsNode / transcriptionNode
 * to derive visemes or blendshapes from TTS timings and send them to the client.
 */
export class HelthAgent extends voice.Agent {
  constructor(history: ConversationMessage[]) {
    const chatCtx = llm.ChatContext.empty();
    for (const { role, text } of history) chatCtx.addMessage({ role, content: text });
    super({ instructions: VOICE_INSTRUCTIONS, chatCtx });
  }
}

// History handed over in the dispatch metadata. Anything malformed means no history.
export function parseJobMetadata(metadata: string | undefined): ConversationMessage[] {
  if (!metadata) return [];
  try {
    return voiceJobMetadataSchema.parse(JSON.parse(metadata)).messages;
  } catch {
    return [];
  }
}
