import { accountProfileSchema } from "@helthtw/shared/accounts";
import { z } from "zod";

export const usageSelectionSchema = accountProfileSchema
  .extend({ usageMode: z.enum(["explore", "professional"]) })
  .refine(({ usageMode, profession }) => usageMode === "explore" || profession !== null, {
    path: ["profession"],
  });

export type UsageSelection = z.infer<typeof usageSelectionSchema>;
