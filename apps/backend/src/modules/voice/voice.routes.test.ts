import { TokenVerifier } from "livekit-server-sdk";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { VOICE_HISTORY_MAX_MESSAGES } from "@helthtw/shared/chat";
import { VOICE_AGENT_NAME } from "./voice.constants";

process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { default: app } = await import("../../app");
const { env } = await import("../../lib/env");
const { createVoiceSession } = await import("./voice.service");
const { parseJobMetadata } = await import("./voice.agent");

const post = (body: unknown) =>
  app.request("/api/v1/voice/sessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/v1/voice/sessions", () => {
  it("creates a session", async () => {
    const res = await post({});
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({
      serverUrl: env.LIVEKIT_URL,
      roomName: expect.any(String),
    });
  });

  it("rejects a history with too many turns", async () => {
    const messages = Array.from({ length: VOICE_HISTORY_MAX_MESSAGES + 1 }, () => ({
      role: "user",
      text: "Hallo",
    }));
    expect((await post({ messages })).status).toBe(400);
  });
});

describe("createVoiceSession", () => {
  const livekitUrl = env.LIVEKIT_URL;
  afterEach(() => {
    env.LIVEKIT_URL = livekitUrl;
  });

  it("answers 503 when LiveKit is not configured", async () => {
    env.LIVEKIT_URL = undefined;
    await expect(createVoiceSession({ messages: [] })).rejects.toMatchObject({
      status: 503,
      code: "voice_unavailable",
    });
  });

  it("issues a token for one fresh room that dispatches the voice agent with the history", async () => {
    const messages = [{ role: "user" as const, text: "Hallo" }];
    const session = await createVoiceSession({ messages });

    const claims = await new TokenVerifier(env.LIVEKIT_API_KEY!, env.LIVEKIT_API_SECRET!).verify(
      session.participantToken,
    );
    expect(claims.video).toMatchObject({ room: session.roomName, roomJoin: true });
    expect(claims.video?.roomAdmin).toBeFalsy();

    const dispatch = claims.roomConfig?.agents?.[0];
    expect(dispatch?.agentName).toBe(VOICE_AGENT_NAME);
    expect(parseJobMetadata(dispatch?.metadata)).toEqual(messages);
  });
});
