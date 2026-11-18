import {
  DEFAULT_API_CONNECT_OPTIONS,
  llm,
  shortuuid,
  type APIConnectOptions,
} from "@livekit/agents";
import type { ModelMessage } from "ai";

export type ModelInput = { instructions?: string; messages: ModelMessage[] };

// Produces the reply text for one turn. In the worker this is the gateway around an AI SDK model.
export type GenerateReply = (input: ModelInput, abortSignal: AbortSignal) => AsyncIterable<string>;

/**
 * Lets LiveKit's voice pipeline use any text source as its LLM stage.
 * LiveKit keeps turn-taking, interruptions and the chat history; generating the reply,
 * including the guard checks, stays in our code, the same path text chat takes.
 * Tool calls are not passed through yet.
 */
export class AiSdkLlm extends llm.LLM {
  constructor(
    private readonly generate: GenerateReply,
    private readonly modelName = "ai-sdk",
  ) {
    super();
  }

  label(): string {
    return "helthtw.AiSdkLlm";
  }

  override get model(): string {
    return this.modelName;
  }

  override get provider(): string {
    return "ai-sdk";
  }

  chat({
    chatCtx,
    toolCtx,
    connOptions = DEFAULT_API_CONNECT_OPTIONS,
  }: Parameters<llm.LLM["chat"]>[0]): llm.LLMStream {
    return new AiSdkLlmStream(this, this.generate, { chatCtx, toolCtx, connOptions });
  }
}

class AiSdkLlmStream extends llm.LLMStream {
  constructor(
    owner: AiSdkLlm,
    private readonly generate: GenerateReply,
    options: {
      chatCtx: llm.ChatContext;
      toolCtx?: llm.ToolContextLike;
      connOptions: APIConnectOptions;
    },
  ) {
    super(owner, options);
  }

  protected async run(): Promise<void> {
    const id = shortuuid("aisdk_");
    const signal = this.abortController.signal;
    try {
      for await (const content of this.generate(toModelInput(this.chatCtx), signal)) {
        if (signal.aborted) return;
        this.queue.put({ id, delta: { role: "assistant", content } });
      }
    } catch (error) {
      // Interrupted by the user: LiveKit aborted us on purpose, nothing went wrong.
      if (signal.aborted) return;
      throw error;
    }
  }
}

/**
 * LiveKit's chat context as AI SDK input. System and developer messages (the agent's
 * instructions) become `instructions`, user and assistant turns stay messages.
 * Function calls and other item types are skipped, there are no tools yet.
 */
export function toModelInput(chatCtx: llm.ChatContext): ModelInput {
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
