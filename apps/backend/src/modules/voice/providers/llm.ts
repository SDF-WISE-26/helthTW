import {
  DEFAULT_API_CONNECT_OPTIONS,
  llm,
  shortuuid,
  type APIConnectOptions,
} from "@livekit/agents";
import { streamText, type ModelMessage } from "ai";
import { chatModel } from "../../../lib/llm";
import { VOICE_LLM_TIMEOUT_MS } from "../voice.constants";

type ModelInput = { instructions?: string; messages: ModelMessage[] };

export const createLlm = () => new VoiceLlm();

class VoiceLlm extends llm.LLM {
  label(): string {
    return "helthtw.VoiceLlm";
  }

  override get model(): string {
    return chatModel.modelId;
  }

  override get provider(): string {
    return "ai-sdk";
  }

  chat({
    chatCtx,
    toolCtx,
    connOptions = DEFAULT_API_CONNECT_OPTIONS,
  }: Parameters<llm.LLM["chat"]>[0]): llm.LLMStream {
    return new VoiceLlmStream(this, { chatCtx, toolCtx, connOptions });
  }
}

class VoiceLlmStream extends llm.LLMStream {
  constructor(
    owner: VoiceLlm,
    options: {
      chatCtx: llm.ChatContext;
      toolCtx?: llm.ToolContextLike;
      connOptions: APIConnectOptions;
    },
  ) {
    super(owner, options);
  }

  protected async run(): Promise<void> {
    const id = shortuuid("voice_");
    const signal = this.abortController.signal;
    try {
      for await (const content of streamReply(toModelInput(this.chatCtx), signal)) {
        if (signal.aborted) return;
        this.queue.put({ id, delta: { role: "assistant", content } });
      }
    } catch (error) {
      // Interrupted by the user, not an error.
      if (signal.aborted) return;
      throw error;
    }
  }
}

async function* streamReply(input: ModelInput, abortSignal: AbortSignal) {
  // A hanging LLM would leave the caller in silence, the timeout makes it a logged error.
  const timeout = AbortSignal.timeout(VOICE_LLM_TIMEOUT_MS);
  const result = streamText({
    model: chatModel,
    ...input,
    maxOutputTokens: 300,
    abortSignal: AbortSignal.any([abortSignal, timeout]),
    // The default handler logs the request body, i.e. the conversation.
    onError: () => {},
  });
  for await (const part of result.stream) {
    // Generic error only: LiveKit logs it, and the original contains the conversation.
    if (part.type === "error") throw new Error("LLM call failed");
    if (part.type === "text-delta") yield part.text;
  }
  if (timeout.aborted) throw new Error("LLM call timed out");
}

function toModelInput(chatCtx: llm.ChatContext): ModelInput {
  const instructions: string[] = [];
  const messages: ModelMessage[] = [];
  for (const item of chatCtx.items) {
    if (item.type !== "message") continue;
    const text = item.textContent;
    if (!text) continue;
    if (item.role === "system" || item.role === "developer") instructions.push(text);
    else messages.push({ role: item.role, content: text });
  }
  return { instructions: instructions.join("\n\n") || undefined, messages };
}
