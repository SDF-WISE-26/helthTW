import type { tts } from "@livekit/agents";
import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import type { VoiceEnv } from "../voice.env";

// Text to speech. Add a provider: one entry here plus its name in VOICE_TTS_PROVIDER (lib/env.ts).
// For an avatar later, prefer providers with word or phoneme timings (ElevenLabs: syncAlignment).
const ttsProviders = {
  elevenlabs: (env: VoiceEnv) =>
    new elevenlabs.TTS({
      apiKey: env.ELEVENLABS_API_KEY,
      voiceId: env.VOICE_TTS_VOICE_ID,
      model: env.VOICE_TTS_MODEL,
      language: env.VOICE_STT_LANGUAGE,
    }),
} satisfies Record<VoiceEnv["VOICE_TTS_PROVIDER"], (env: VoiceEnv) => tts.TTS>;

export const createTts = (env: VoiceEnv): tts.TTS => ttsProviders[env.VOICE_TTS_PROVIDER](env);
