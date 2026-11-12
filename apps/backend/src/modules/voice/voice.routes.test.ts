import { describe, expect, it, vi } from "vite-plus/test";

vi.mock("../../db", () => ({ db: {} }));

// env.ts needs a DATABASE_URL at import time, the voice route never uses the database.
process.env.DATABASE_URL ??= "postgres://unused@localhost/unused";
const { default: app } = await import("../../app");

const post = (body: unknown) =>
  app.request("/api/v1/voice/sessions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const payloadOf = (jwt: string) =>
  JSON.parse(Buffer.from(jwt.split(".")[1]!, "base64url").toString());

describe("POST /api/v1/voice/sessions", () => {
  it("returns the LiveKit url and a token, without any secret", async () => {
    const res = await post({});
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.transport).toBe("livekit");
    expect(body.url).toBe("wss://livekit.test");
    expect(JSON.stringify(body)).not.toContain("test-livekit-secret");
  });

  it("limits the token to one random room and sends the history to the agent", async () => {
    const history = [{ role: "user", content: "Mir geht es nicht gut." }];
    const payload = payloadOf((await (await post({ history })).json()).token);

    expect(payload.video.roomJoin).toBe(true);
    expect(payload.video.room).toMatch(/^voice-/);
    expect(payload.sub).toMatch(/^user-/);
    const dispatch = payload.roomConfig.agents[0];
    expect(dispatch.agentName).toBe("helthtw-voice");
    expect(JSON.parse(dispatch.metadata).history).toEqual(history);
  });

  it("uses a different room every time", async () => {
    const [a, b] = await Promise.all([post({}), post({})]);
    const room = async (res: Response) => payloadOf((await res.json()).token).video.room;

    expect(await room(a)).not.toBe(await room(b));
  });

  it("rejects a history that is too long or has an unknown role", async () => {
    const message = { role: "user", content: "x" };

    expect((await post({ history: Array(11).fill(message) })).status).toBe(400);
    expect((await post({ history: [{ role: "system", content: "x" }] })).status).toBe(400);
  });
});
