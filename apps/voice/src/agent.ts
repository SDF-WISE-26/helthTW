import {
  metrics,
  type JobContext,
  type JobProcess,
  ServerOptions,
  cli,
  defineAgent,
  llm,
  voice,
} from "@livekit/agents";
import * as silero from "@livekit/agents-plugin-silero";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { parseHistory } from "./history.ts";
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

    // The backend sends the recent chat with the session, so voice continues the same conversation.
    const history = parseHistory(ctx.job.metadata);
    const chatCtx = llm.ChatContext.empty();
    for (const message of history) chatCtx.addMessage(message);

    await session.start({
      agent: new voice.Agent({
        instructions: "Antworte auf Deutsch in höchstens einem kurzen Satz.",
        chatCtx,
      }),
      room: ctx.room,
    });
    await ctx.connect();
    // Fixed greeting (no LLM call), only at the start of a conversation.
    if (history.length === 0) session.say("Hallo.");
  },
});

// Without AGENT_NAME the agent joins every room (handy for testing in the LiveKit Agents Playground,
// but then it gets no chat history). With AGENT_NAME=helthtw-voice it is only started for rooms whose
// token asks for it, which is what the backend's voice module does. Use that in production.
cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: process.env.AGENT_NAME ?? "",
  }),
);
