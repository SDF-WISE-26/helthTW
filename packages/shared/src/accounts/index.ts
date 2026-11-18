import { z } from "zod";

export const professionSchema = z.enum([
  "first_responder",
  "emergency_medical_services",
  "fire_service",
  "police",
  "civil_protection",
  "armed_forces",
  "other",
]);

export const professionValues = professionSchema.options;
export type Profession = z.infer<typeof professionSchema>;

export const accountProfileSchema = z.object({
  profession: professionSchema.nullable(),
});

export type AccountProfile = z.infer<typeof accountProfileSchema>;
