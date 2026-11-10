import {
  metrics,
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  voice,
} from "@livekit/agents";
import * as silero from "@livekit/agents-plugin-silero";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { createLlm } from "./providers/llm.ts";
import { createStt } from "./providers/stt.ts";
import { createTts } from "./providers/tts.ts";

dotenv.config({ path: ".env" });

export default defineAgent({
  // Load the VAD model once per worker process, not once per call.
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load({ minSilenceDuration: 300 });
  },
  entry: async (ctx: JobContext) => {
    const session = new voice.AgentSession({
      vad: ctx.proc.userData.vad as silero.VAD,
      stt: createStt(),
      llm: createLlm(),
      turnHandling: { endpointing: { minDelay: 200, maxDelay: 1000 } },
      tts: createTts(),
    });

    // Log per-stage latency (STT, LLM, TTS, end of utterance) to the terminal.
    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) =>
      metrics.logMetrics(ev.metrics),
    );

    await session.start({
      agent: new voice.Agent({
        instructions: "Antworte auf Deutsch in höchstens einem kurzen Satz.",
      }),
      room: ctx.room,
    });
    await ctx.connect();
    // Fixed greeting: tests TTS without an LLM call.
    session.say("Hallo.");
  },
});

cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url) }));
