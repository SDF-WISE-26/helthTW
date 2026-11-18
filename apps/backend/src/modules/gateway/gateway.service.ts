import { streamText, type LanguageModel, type ModelMessage } from "ai";
import type { Channel, Guard, Verdict } from "./gateway.types";
import { activeGuard } from "./guards";

// Said instead of a blocked turn. Placeholder wording, needs review like the crisis screen texts.
export const BLOCKED_REPLY =
  "Darauf kann ich leider nicht eingehen. Wenn du in akuter Gefahr bist, ruf bitte die 112 an.";

export type GuardedReplyOptions = {
  channel: Channel;
  model: LanguageModel;
  instructions?: string;
  messages: ModelMessage[];
  maxOutputTokens?: number;
  abortSignal?: AbortSignal;
};

/**
 * One reply through the gateway: input guard, LLM, output guard per sentence.
 *
 * Yields only text the guard has passed, one sentence at a time, so whatever follows
 * (chat UI, TTS, later an avatar) never sees unchecked text. On a non-allow verdict the
 * LLM call is aborted and the replacement is the last thing yielded.
 */
export async function* streamGuardedReply(
  options: GuardedReplyOptions,
  guard: Guard = activeGuard,
): AsyncGenerator<string> {
  const { channel, messages } = options;

  const input = await guard.checkInput({ channel, messages });
  if (input.action !== "allow") {
    log(guard, channel, "input", input);
    yield replacementFor(input);
    return;
  }

  // Own controller, so an output verdict can stop the LLM without aborting the caller.
  const llmAbort = new AbortController();
  const onCallerAbort = () => llmAbort.abort(options.abortSignal?.reason);
  if (options.abortSignal?.aborted) return;
  options.abortSignal?.addEventListener("abort", onCallerAbort, { once: true });

  try {
    const result = streamText({
      model: options.model,
      instructions: options.instructions,
      messages,
      maxOutputTokens: options.maxOutputTokens,
      abortSignal: llmAbort.signal,
      // The default handler prints the whole error, request body (the conversation) included.
      // Errors arrive as stream parts below and leave the gateway as LlmError.
      onError: () => {},
    });

    let replySoFar = "";
    const sentences = new SentenceBuffer();

    // Checks one sentence; returns the verdict that ends the turn, or undefined if it passed.
    const stopsAt = async (sentence: string): Promise<Stop | undefined> => {
      const verdict = await guard.checkOutput({ channel, messages, sentence, replySoFar });
      if (verdict.action === "allow") {
        replySoFar += sentence;
        return undefined;
      }
      log(guard, channel, "output", verdict);
      llmAbort.abort();
      return verdict;
    };

    for await (const part of result.stream) {
      if (part.type === "error") throw new LlmError(part.error);
      if (part.type !== "text-delta") continue;
      for (const sentence of sentences.push(part.text)) {
        const stop = await stopsAt(sentence);
        if (stop) {
          yield replacementFor(stop);
          return;
        }
        yield sentence;
      }
    }

    // Aborted by the caller: the stream just ends, and the rest is a cut-off fragment nobody reads.
    if (llmAbort.signal.aborted) return;

    const rest = sentences.flush();
    if (rest) {
      const stop = await stopsAt(rest);
      yield stop ? replacementFor(stop) : rest;
    }
  } finally {
    options.abortSignal?.removeEventListener("abort", onCallerAbort);
    // Also stops the LLM when the consumer stops reading early (break, return, a throw).
    // No-op if the stream already finished.
    llmAbort.abort();
  }
}

// LLM errors carry the request, i.e. the conversation. Callers and their loggers
// (Hono, LiveKit) only get the error's name and status, never the original object.
export class LlmError extends Error {
  constructor(original: unknown) {
    const name = original instanceof Error ? original.name : "UnknownError";
    const status = (original as { statusCode?: number } | undefined)?.statusCode;
    super(`LLM call failed: ${name}${status ? ` (${status})` : ""}`);
    this.name = "LlmError";
  }
}

// Splits streamed text into sentences. The last segment stays buffered until more text
// shows it is complete, or until flush() at the end of the stream.
export class SentenceBuffer {
  private static segmenter = new Intl.Segmenter("de", { granularity: "sentence" });
  private buffer = "";

  push(text: string): string[] {
    this.buffer += text;
    const segments = Array.from(SentenceBuffer.segmenter.segment(this.buffer), (s) => s.segment);
    if (segments.length < 2) return [];
    this.buffer = segments.pop() ?? "";
    return segments;
  }

  flush(): string {
    const rest = this.buffer;
    this.buffer = "";
    return rest.trim() ? rest : "";
  }
}

// A verdict that ends the turn.
type Stop = Exclude<Verdict, { action: "allow" }>;

function replacementFor(verdict: Stop): string {
  return verdict.action === "replace" ? verdict.text : BLOCKED_REPLY;
}

// Only codes, never content: see docs/specs/backend.md.
function log(guard: Guard, channel: Channel, stage: "input" | "output", verdict: Stop) {
  console.info(
    `gateway: ${guard.name} ${stage} ${verdict.action} (${verdict.reason}) on ${channel}`,
  );
}
