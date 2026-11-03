import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import { ApiError } from "./errors";

// zValidator with failures in our error format instead of its own.
export const validate = <Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema,
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new ApiError(400, "invalid_request", "Invalid request", result.error.issues);
    }
  });
