import { ThinkingLevel } from "@google/genai";
import {
  metrics,
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  voice,
} from "@livekit/agents";
import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import * as google from "@livekit/agents-plugin-google";
import * as silero from "@livekit/agents-plugin-silero";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: ".env" });

export default defineAgent({
  // Load the VAD model once per worker process, not once per call.
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load({ minSilenceDuration: 300 });
  },
  entry: async (ctx: JobContext) => {
    const session = new voice.AgentSession({
      vad: ctx.proc.userData.vad as silero.VAD,
      stt: new elevenlabs.STT({
        model: "scribe_v2_realtime",
        languageCode: "de",
        // Let Scribe close the sentence itself after a short silence.
        serverVad: { vadSilenceThresholdSecs: 0.5 },
      }),
      llm: new google.LLM({
        model: "gemini-3.5-flash-lite",
        maxOutputTokens: 80,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      }),
      turnHandling: { endpointing: { minDelay: 200, maxDelay: 1000 } },
      tts: new elevenlabs.TTS({ voiceId: "ZYxkHelwVfZIJ3DA24gN", model: "eleven_flash_v2_5" }),
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
