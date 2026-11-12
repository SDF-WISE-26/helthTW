import { randomUUID } from "node:crypto";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { env } from "../../lib/env";
import { ApiError } from "../../lib/errors";
import type { HistoryMessage } from "./voice.schemas";

// Must match the agentName of the worker in apps/voice.
export const VOICE_AGENT_NAME = "helthtw-voice";

export async function createVoiceSession(history: HistoryMessage[]) {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new ApiError(503, "voice_unavailable", "Voice chat is not configured");
  }

  // Random identity and room: nothing here identifies the person, and the room cannot be guessed.
  const room = `voice-${randomUUID()}`;
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `user-${randomUUID()}`,
    ttl: "10m",
  });
  token.addGrant({ roomJoin: true, room });
  // Only sessions created here start an agent, rooms joined any other way get none.
  token.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: VOICE_AGENT_NAME,
        metadata: JSON.stringify({ history }),
      }),
    ],
  });

  return { transport: "livekit" as const, url: LIVEKIT_URL, token: await token.toJwt() };
}
