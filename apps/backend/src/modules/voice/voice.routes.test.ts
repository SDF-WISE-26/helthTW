import { TokenVerifier } from "livekit-server-sdk";
import { afterEach, describe, expect, it } from "vite-plus/test";
import {
  VOICE_AGENT_NAME,
  VOICE_HISTORY_MAX_BYTES,
  VOICE_HISTORY_MAX_CHARS,
  VOICE_HISTORY_MAX_MESSAGES,
} from "./voice.constants";

process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { default: app } = await import("../../app");
const { env } = await import("../../lib/env");
const { createVoiceSession, serializeHistory } = await import("./voice.service");
const { parseJobMetadata } = await import("./voice.agent");

describe("POST /api/v1/voice/sessions", () => {
  it("creates a session", async () => {
    const res = await app.request("/api/v1/voice/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({
      serverUrl: env.LIVEKIT_URL,
      roomName: expect.any(String),
    });
  });

  it("rejects an invalid history", async () => {
    const res = await app.request("/api/v1/voice/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "system", text: "x" }] }),
    });
    expect(res.status).toBe(400);
  });

  it.each([
    ["too many turns", Array.from({ length: VOICE_HISTORY_MAX_MESSAGES + 1 }, () => "Hallo")],
    ["a turn that is too long", ["x".repeat(VOICE_HISTORY_MAX_CHARS + 1)]],
  ])("rejects a history with %s", async (_, texts) => {
    const res = await app.request("/api/v1/voice/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: texts.map((text) => ({ role: "user", text })) }),
    });
    expect(res.status).toBe(400);
  });
});

describe("serializeHistory", () => {
  it("drops the oldest turns until the history fits the token budget", () => {
    // Quotes double when JSON-escaped, so 4 valid turns can exceed the byte budget.
    const messages = ["a", "b", "c", "d"].map((tag) => ({
      role: "user" as const,
      text: tag + '"'.repeat(VOICE_HISTORY_MAX_CHARS - 1),
    }));
    const json = serializeHistory(messages);

    expect(Buffer.byteLength(json)).toBeLessThanOrEqual(VOICE_HISTORY_MAX_BYTES);
    const kept = parseJobMetadata(json);
    expect(kept.length).toBeGreaterThan(0);
    expect(kept).toEqual(messages.slice(-kept.length));
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

    expect(session.serverUrl).toBe(env.LIVEKIT_URL);
    expect(session.roomName).toMatch(/^voice-/);

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

describe("parseJobMetadata", () => {
  it("falls back to no history for anything malformed", () => {
    expect(parseJobMetadata(undefined)).toEqual([]);
    expect(parseJobMetadata("not json")).toEqual([]);
    expect(parseJobMetadata(JSON.stringify({ messages: [{ role: "system", text: "x" }] }))).toEqual(
      [],
    );
  });
});
