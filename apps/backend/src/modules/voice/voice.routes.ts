import { Hono } from "hono";
import { validate } from "../../lib/validate";
import { voiceSessionRequestSchema } from "./voice.schemas";
import { createVoiceSession } from "./voice.service";

export const voiceRoutes = new Hono().post(
  "/sessions",
  validate("json", voiceSessionRequestSchema),
  async (c) => {
    const session = await createVoiceSession(c.req.valid("json"));
    return c.json(session, 201);
  },
);
