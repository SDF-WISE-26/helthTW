import { randomUUID } from "node:crypto";
import type { ConversationMessage } from "@helthtw/shared/chat";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { env } from "../../lib/env";
import { ApiError } from "../../lib/errors";
import { VOICE_AGENT_NAME, VOICE_TOKEN_TTL } from "./voice.constants";

// Field names match LiveKit's client TokenSource, so the frontend can pass the result on as-is.
export async function createVoiceSession({ messages }: { messages: ConversationMessage[] }) {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new ApiError(503, "voice_unavailable", "Voice is not configured");
  }

  const roomName = `voice-${randomUUID()}`;
  // Random identity: nothing about the caller reaches LiveKit.
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `user-${randomUUID()}`,
    ttl: VOICE_TOKEN_TTL,
  });
  token.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });

  token.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: VOICE_AGENT_NAME,
        metadata: JSON.stringify({ messages }),
      }),
    ],
  });

  return { serverUrl: LIVEKIT_URL, participantToken: await token.toJwt(), roomName };
}
