import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import type { VoiceEnv } from "../voice.env";

export const createStt = (env: VoiceEnv) =>
  new elevenlabs.STT({
    apiKey: env.ELEVENLABS_API_KEY,
    model: "scribe_v2_realtime",
    languageCode: env.VOICE_STT_LANGUAGE,
    // Otherwise ElevenLabs finalizes a transcript only after ~25 s, LiveKit does not commit on VAD end.
    serverVad: { vadSilenceThresholdSecs: 0.5 },
  });
