import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  LLM_BASE_URL: z.url(),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),

  // Voice, optional: without them the session route answers 503 and the worker does not start.
  LIVEKIT_URL: z.url().optional(),
  LIVEKIT_API_KEY: z.string().min(1).optional(),
  LIVEKIT_API_SECRET: z.string().min(1).optional(),
  ELEVENLABS_API_KEY: z.string().min(1).optional(),
  VOICE_STT_LANGUAGE: z.string().min(2).default("de"),
  VOICE_TTS_VOICE_ID: z.string().min(1).default("ZYxkHelwVfZIJ3DA24gN"),
  VOICE_TTS_MODEL: z.string().min(1).default("eleven_flash_v2_5"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
