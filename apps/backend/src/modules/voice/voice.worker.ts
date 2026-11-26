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
import { createLlm } from "./providers/llm";
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
      llm: createLlm(),
      tts: createTts(env),
      // Local, LiveKit's defaults send audio to LiveKit Inference.
      turnHandling: {
        turnDetection: new inference.TurnDetector({ version: "v1-mini" }),
        interruption: { mode: "vad" },
      },
    });

    // Timings and token counts only, no transcripts.
    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) =>
      metrics.logMetrics(ev.metrics),
    );

    // Otherwise the LiveKit Cloud project setting decides, and it uploads audio and transcripts.
    await session.start({ agent: new HelthAgent(history), room: ctx.room, record: false });
    await ctx.connect();

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
