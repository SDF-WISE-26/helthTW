import { simulateReadableStream, type ModelMessage } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vite-plus/test";
import type { Guard, Verdict } from "./gateway.types";

// lib/env.ts needs it, the gateway itself never touches the database.
process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { BLOCKED_REPLY, SentenceBuffer, streamGuardedReply } = await import("./gateway.service");

// A model that streams the given deltas and records whether it was called and aborted.
function mockModel(deltas: string[]) {
  const calls = { count: 0, aborted: false };
  const model = new MockLanguageModelV4({
    doStream: async ({ abortSignal }) => {
      calls.count++;
      abortSignal?.addEventListener("abort", () => (calls.aborted = true));
      return {
        stream: simulateReadableStream({
          chunks: [
            { type: "stream-start", warnings: [] },
            { type: "text-start", id: "t" },
            ...deltas.map((delta) => ({ type: "text-delta" as const, id: "t", delta })),
            { type: "text-end", id: "t" },
            {
              type: "finish",
              finishReason: { unified: "stop", raw: "stop" },
              usage: {
                inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
                outputTokens: { total: 1, text: 1, reasoning: 0 },
              },
            },
          ],
        }),
      };
    },
  });
  return { model, calls };
}

const guard = (
  input: Verdict = { action: "allow" },
  output: (sentence: string) => Verdict = () => ({ action: "allow" }),
): Guard => ({
  name: "test",
  checkInput: async () => input,
  checkOutput: async ({ sentence }) => output(sentence),
});

const messages: ModelMessage[] = [{ role: "user", content: "Hallo" }];

async function collect(stream: AsyncIterable<string>) {
  const out: string[] = [];
  for await (const chunk of stream) out.push(chunk);
  return out;
}

describe("SentenceBuffer", () => {
  it("holds back the last segment until it is complete", () => {
    const buffer = new SentenceBuffer();
    expect(buffer.push("Hallo. Wie ge")).toEqual(["Hallo. "]);
    expect(buffer.push("ht es dir? Gu")).toEqual(["Wie geht es dir? "]);
    expect(buffer.flush()).toBe("Gu");
    expect(buffer.flush()).toBe("");
  });
});

describe("streamGuardedReply", () => {
  it("passes the reply through sentence by sentence", async () => {
    const { model } = mockModel(["Das ist ", "ok. Wirk", "lich."]);
    const out = await collect(streamGuardedReply({ channel: "text", model, messages }, guard()));
    expect(out).toEqual(["Das ist ok. ", "Wirklich."]);
  });

  it("answers a blocked input without calling the LLM", async () => {
    const { model, calls } = mockModel(["egal."]);
    const blocked = guard({ action: "block", reason: "test" });
    const out = await collect(streamGuardedReply({ channel: "voice", model, messages }, blocked));
    expect(out).toEqual([BLOCKED_REPLY]);
    expect(calls.count).toBe(0);
  });

  it("answers a replaced input with the replacement", async () => {
    const { model } = mockModel(["egal."]);
    const replaced = guard({ action: "replace", text: "Anders.", reason: "test" });
    expect(
      await collect(streamGuardedReply({ channel: "text", model, messages }, replaced)),
    ).toEqual(["Anders."]);
  });

  it("stops at the first rejected sentence and aborts the LLM", async () => {
    const { model, calls } = mockModel(["Gut. ", "Schlecht. ", "Nie gesehen."]);
    const rejectsBad = guard(undefined, (sentence) =>
      sentence.startsWith("Schlecht")
        ? { action: "replace", text: "Ersatz.", reason: "test" }
        : { action: "allow" },
    );
    const out = await collect(
      streamGuardedReply({ channel: "voice", model, messages }, rejectsBad),
    );
    expect(out).toEqual(["Gut. ", "Ersatz."]);
    expect(calls.aborted).toBe(true);
  });

  it("aborts the LLM when the consumer stops reading early", async () => {
    const { model, calls } = mockModel(["Eins. ", "Zwei. ", "Drei. ", "Vier."]);
    for await (const _ of streamGuardedReply({ channel: "text", model, messages }, guard())) break;
    expect(calls.aborted).toBe(true);
  });

  it("does not yield or check the cut-off rest after the caller aborts", async () => {
    const { model } = mockModel(["Ganz. ", "Halb"]);
    const caller = new AbortController();
    const checked: string[] = [];
    const recording = guard(undefined, (sentence) => {
      checked.push(sentence);
      return { action: "allow" };
    });
    const out: string[] = [];
    for await (const sentence of streamGuardedReply(
      { channel: "voice", model, messages, abortSignal: caller.signal },
      recording,
    )) {
      out.push(sentence);
      caller.abort();
    }
    expect(out).toEqual(["Ganz. "]);
    expect(checked).toEqual(["Ganz. "]);
  });

  it("checks the last sentence even without a final punctuation mark", async () => {
    const { model } = mockModel(["Ohne Punkt"]);
    const blocksAll = guard(undefined, () => ({ action: "block", reason: "test" }));
    const out = await collect(streamGuardedReply({ channel: "text", model, messages }, blocksAll));
    expect(out).toEqual([BLOCKED_REPLY]);
  });
});

describe("LLM errors", () => {
  it("leave the gateway without the conversation", async () => {
    const failing = new MockLanguageModelV4({
      doStream: async () => {
        throw Object.assign(new Error("request failed for: Hallo geheim"), { statusCode: 500 });
      },
    });
    const run = collect(streamGuardedReply({ channel: "text", model: failing, messages }, guard()));
    await expect(run).rejects.toThrow(/^LLM call failed/);
    await expect(run).rejects.not.toThrow(/geheim/);
  });
});
