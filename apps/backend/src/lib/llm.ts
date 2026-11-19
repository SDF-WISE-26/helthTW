import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { env } from "./env";

const provider = createOpenAICompatible({
  name: "llm",
  baseURL: env.LLM_BASE_URL,
  apiKey: env.LLM_API_KEY,
});

export const chatModel = provider.chatModel(env.LLM_MODEL);
