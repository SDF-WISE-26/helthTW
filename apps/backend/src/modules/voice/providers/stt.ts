import type { stt } from "@livekit/agents";
import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import type { VoiceEnv } from "../voice.env";

// Speech to text. Add a provider: one entry here plus its name in VOICE_STT_PROVIDER (lib/env.ts).
const sttProviders = {
  elevenlabs: (env: VoiceEnv) =>
    new elevenlabs.STT({
      apiKey: env.ELEVENLABS_API_KEY,
      model: "scribe_v2_realtime",
      languageCode: env.VOICE_STT_LANGUAGE,
      // Without it ElevenLabs only finalizes a transcript on its own timeout (~25 s), because
      // LiveKit does not commit on VAD end. 0.5 s of silence: fast, but short pauses stay possible.
      serverVad: { vadSilenceThresholdSecs: 0.5 },
    }),
} satisfies Record<VoiceEnv["VOICE_STT_PROVIDER"], (env: VoiceEnv) => stt.STT>;

export const createStt = (env: VoiceEnv): stt.STT => sttProviders[env.VOICE_STT_PROVIDER](env);
