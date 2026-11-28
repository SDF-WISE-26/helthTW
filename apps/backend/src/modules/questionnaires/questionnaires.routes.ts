import { questionnaires } from "@helthtw/shared/questionnaires";
import { Hono } from "hono";
import { ApiError } from "../../lib/errors";

export const questionnairesRoutes = new Hono()
  .get("/", (c) => c.json(questionnaires, 200))
  .get("/:id", (c) => {
    const questionnaire = questionnaires.find((q) => q.id === c.req.param("id"));
    if (!questionnaire) throw new ApiError(404, "not_found", "Questionnaire not found");
    return c.json(questionnaire, 200);
  });
