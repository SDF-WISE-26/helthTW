import { z } from "zod";

// Placeholder: only shows how shared code works, with one use in the backend
// (modules/example) and one in the frontend (features/example).
// Delete all three once the first real schemas exist, e.g. from #54 or #136.
export const exampleSharedEnum = z.enum(["active", "closed"]);

export type ExampleSharedEnum = z.infer<typeof exampleSharedEnum>;
