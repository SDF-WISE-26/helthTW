import { z } from "zod";
import { env } from "../../lib/env";

const voiceEnvSchema = z.object({
  LIVEKIT_URL: z.url(),
  LIVEKIT_API_KEY: z.string().min(1),
  LIVEKIT_API_SECRET: z.string().min(1),
  ELEVENLABS_API_KEY: z.string().min(1),
});

export function requireVoiceEnv() {
  const parsed = voiceEnvSchema.safeParse(env);
  if (!parsed.success) {
    console.error("Voice worker: missing environment variables:");
    console.error(z.prettifyError(parsed.error));
    process.exit(1);
  }
  return { ...env, ...parsed.data };
}

export type VoiceEnv = ReturnType<typeof requireVoiceEnv>;
