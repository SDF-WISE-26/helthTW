import { randomUUID } from "node:crypto";
import type { ConversationMessage } from "@helthtw/shared/chat";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { env } from "../../lib/env";
import { ApiError } from "../../lib/errors";
import { VOICE_AGENT_NAME, VOICE_HISTORY_MAX_BYTES, VOICE_TOKEN_TTL } from "./voice.constants";
import type { VoiceJobMetadata } from "./voice.schemas";

/**
 * A new voice session: a fresh LiveKit room, a token for the caller, and the voice agent
 * dispatched into that room as soon as the caller joins.
 * The field names match LiveKit's client TokenSource, so the frontend can pass the result on as-is.
 */
export async function createVoiceSession({ messages }: { messages: ConversationMessage[] }) {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new ApiError(503, "voice_unavailable", "Voice is not configured");
  }

  const roomName = `voice-${randomUUID()}`;
  // Random identity: nothing about the caller reaches LiveKit (possibly a cloud service).
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `user-${randomUUID()}`,
    ttl: VOICE_TOKEN_TTL,
  });
  token.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });

  token.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({ agentName: VOICE_AGENT_NAME, metadata: serializeHistory(messages) }),
    ],
  });

  return { serverUrl: LIVEKIT_URL, participantToken: await token.toJwt(), roomName };
}

// The history as job metadata, dropping the oldest turns until it fits the token budget.
export function serializeHistory(messages: ConversationMessage[]): string {
  let kept = messages;
  for (;;) {
    const metadata: VoiceJobMetadata = { messages: kept };
    const json = JSON.stringify(metadata);
    if (kept.length === 0 || Buffer.byteLength(json) <= VOICE_HISTORY_MAX_BYTES) return json;
    kept = kept.slice(1);
  }
}
