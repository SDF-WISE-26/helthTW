import type { tts } from "@livekit/agents";
import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import { pick } from "./registry.ts";

// To add a provider (e.g. Piper): add an entry here, set TTS_PROVIDER.
const registry: Record<string, () => tts.TTS> = {
  elevenlabs: () =>
    new elevenlabs.TTS({ voiceId: "ZYxkHelwVfZIJ3DA24gN", model: "eleven_flash_v2_5" }),
};

export const createTts = () => pick("TTS", process.env.TTS_PROVIDER ?? "elevenlabs", registry);
