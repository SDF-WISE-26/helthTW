// Tokens dispatch the agent by name, so the worker only joins rooms created by the backend.
export const VOICE_AGENT_NAME = "helthtw-voice";

export const VOICE_TOKEN_TTL = "10m";

// Covers the whole reply. Gemini sometimes needs 7 s before the first word.
export const VOICE_LLM_TIMEOUT_MS = 20_000;
