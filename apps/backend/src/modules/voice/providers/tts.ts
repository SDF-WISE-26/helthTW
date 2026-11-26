import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import type { VoiceEnv } from "../voice.env";

export const createTts = (env: VoiceEnv) =>
  new elevenlabs.TTS({
    apiKey: env.ELEVENLABS_API_KEY,
    voiceId: env.VOICE_TTS_VOICE_ID,
    model: env.VOICE_TTS_MODEL,
    language: env.VOICE_STT_LANGUAGE,
  });
