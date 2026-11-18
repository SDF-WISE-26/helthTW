// Second entrypoint of the backend: the LiveKit voice agent worker, its own process.
// Dev: `vp run backend#dev:voice`, prod: `node dist/voice-worker.mjs start`.
// Pipeline: VAD + STT -> gateway (input guard -> LLM -> output guard) -> TTS.
import { fileURLToPath } from "node:url";
import {
  cli,
  defineAgent,
  inference,
  metrics,
  ServerOptions,
  voice,
  type JobContext,
  type JobProcess,
  type VAD,
} from "@livekit/agents";
import { voiceModel } from "../../lib/llm";
import { streamGuardedReply } from "../gateway/gateway.service";
import { AiSdkLlm } from "./providers/ai-sdk-llm";
import { createStt } from "./providers/stt";
import { createTts } from "./providers/tts";
import { loadVad } from "./providers/vad";
import { HelthAgent, parseJobMetadata } from "./voice.agent";
import { VOICE_AGENT_NAME } from "./voice.constants";
import { requireVoiceEnv } from "./voice.env";
import { GREETING } from "./voice.prompts";

const env = requireVoiceEnv();

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await loadVad();
  },

  entry: async (ctx: JobContext) => {
    const history = parseJobMetadata(ctx.job.metadata);

    const session = new voice.AgentSession({
      vad: ctx.proc.userData.vad as VAD,
      stt: createStt(env),
      // The same gateway as text chat, so every spoken sentence passed the guard first.
      llm: new AiSdkLlm(
        (input, abortSignal) =>
          streamGuardedReply({
            channel: "voice",
            model: voiceModel,
            ...input,
            maxOutputTokens: 300,
            abortSignal,
          }),
        voiceModel.modelId,
      ),
      tts: createTts(env),
      // Both run locally. LiveKit's defaults send audio to LiveKit Inference in dev mode
      // (turn detector v1, adaptive interruption).
      turnHandling: {
        turnDetection: new inference.TurnDetector({ version: "v1-mini" }),
        interruption: { mode: "vad" },
      },
    });

    // Timings and token counts only, no transcripts.
    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) =>
      metrics.logMetrics(ev.metrics),
    );

    // No recording: otherwise the LiveKit Cloud project setting decides, and it uploads
    // audio and transcripts.
    await session.start({ agent: new HelthAgent(history), room: ctx.room, record: false });
    await ctx.connect();

    // Fixed, reviewed text: skips the LLM and the guard on purpose.
    if (history.length === 0) session.say(GREETING);
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: VOICE_AGENT_NAME,
    wsURL: env.LIVEKIT_URL,
    apiKey: env.LIVEKIT_API_KEY,
    apiSecret: env.LIVEKIT_API_SECRET,
  }),
);
