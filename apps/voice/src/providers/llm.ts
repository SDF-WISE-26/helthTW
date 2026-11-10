import { ThinkingLevel } from "@google/genai";
import type { llm } from "@livekit/agents";
import * as google from "@livekit/agents-plugin-google";
import { pick } from "./registry.ts";

// To add a provider (e.g. a self-hosted model behind an OpenAI-compatible API): add an entry here.
const registry: Record<string, () => llm.LLM> = {
  gemini: () =>
    new google.LLM({
      model: "gemini-3.5-flash-lite",
      maxOutputTokens: 80,
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
    }),
};

export const createLlm = () => pick("LLM", process.env.LLM_PROVIDER ?? "gemini", registry);
