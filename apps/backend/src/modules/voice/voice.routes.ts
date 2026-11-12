import { Hono } from "hono";
import { validate } from "../../lib/validate";
import { createSessionSchema } from "./voice.schemas";
import { createVoiceSession } from "./voice.service";

export const voiceRoutes = new Hono().post(
  "/sessions",
  validate("json", createSessionSchema),
  async (c) => {
    const { history } = c.req.valid("json");
    return c.json(await createVoiceSession(history), 201);
  },
);
