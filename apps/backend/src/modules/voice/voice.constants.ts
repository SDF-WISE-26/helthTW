// The worker registers under this name and session tokens dispatch exactly this agent,
// so the worker never joins rooms it was not asked into.
export const VOICE_AGENT_NAME = "helthtw-voice";

// How long a session token can be used to join its room.
export const VOICE_TOKEN_TTL = "10m";

// The history travels inside the participant token, which LiveKit's client sends as a URL query
// parameter. Proxies often cap URLs around 8 KB, so voice takes a shorter history than text chat.
export const VOICE_HISTORY_MAX_MESSAGES = 4;
export const VOICE_HISTORY_MAX_CHARS = 500;
// Safety net for the serialized history (JSON escapes, multi-byte characters): oldest turns are dropped.
export const VOICE_HISTORY_MAX_BYTES = 3000;
