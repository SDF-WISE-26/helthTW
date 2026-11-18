import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  LLM_BASE_URL: z.url(),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().min(1),
  // Optional faster model for voice; falls back to LLM_MODEL.
  VOICE_LLM_MODEL: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),

  // Which guard checks input and output in the gateway (modules/gateway/guards).
  GUARD_PROVIDER: z.enum(["passthrough"]).default("passthrough"),

  // Voice: optional, POST /api/v1/voice/sessions answers 503 without them, the voice worker refuses to start.
  // LiveKit Cloud or a self-hosted livekit-server, only the URL and keys differ.
  LIVEKIT_URL: z.url().optional(),
  LIVEKIT_API_KEY: z.string().min(1).optional(),
  LIVEKIT_API_SECRET: z.string().min(1).optional(),
  ELEVENLABS_API_KEY: z.string().min(1).optional(),
  VOICE_STT_PROVIDER: z.enum(["elevenlabs"]).default("elevenlabs"),
  VOICE_STT_LANGUAGE: z.string().min(2).default("de"),
  VOICE_TTS_PROVIDER: z.enum(["elevenlabs"]).default("elevenlabs"),
  // A German-capable ElevenLabs voice; any voice ID from the ElevenLabs library works.
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
