import { initializeLogger, llm } from "@livekit/agents";
import { describe, expect, it } from "vite-plus/test";
import { AiSdkLlm, toModelInput, type ModelInput } from "./ai-sdk-llm";

// The worker CLI does this in production; LLMStream logs through it.
initializeLogger({ pretty: false, level: "warn" });

const chatCtx = () => {
  const ctx = llm.ChatContext.empty();
  ctx.addMessage({ role: "system", content: "Sei nett." });
  ctx.addMessage({ role: "user", content: "Hallo" });
  ctx.addMessage({ role: "assistant", content: "Hi!" });
  ctx.addMessage({ role: "user", content: "Wie geht's?" });
  return ctx;
};

describe("toModelInput", () => {
  it("turns system messages into instructions and keeps the turns", () => {
    expect(toModelInput(chatCtx())).toEqual({
      instructions: "Sei nett.",
      messages: [
        { role: "user", content: "Hallo" },
        { role: "assistant", content: "Hi!" },
        { role: "user", content: "Wie geht's?" },
      ],
    });
  });
});

describe("AiSdkLlm", () => {
  it("streams the generated text as chat chunks", async () => {
    let received: ModelInput | undefined;
    const model = new AiSdkLlm(async function* (input) {
      received = input;
      yield "Gut. ";
      yield "Danke.";
    });

    const response = await model.chat({ chatCtx: chatCtx() }).collect();

    expect(response.text).toBe("Gut. Danke.");
    expect(received?.messages).toHaveLength(3);
  });
});
