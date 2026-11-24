import { topicTransition } from "./topic-look";

// Light moss instead of a topic colour, so contacts read as their own family. No art on the right,
// so the title takes the full width (overrides the cover's pr-32 and white text).
export const groupSurface = "bg-secondary pr-5 text-secondary-foreground";

// Same parts as a topic card, prefixed so a group and a topic never share a name.
export const groupTransition = (id: string, part: Parameters<typeof topicTransition>[1]) =>
  topicTransition(`contacts-${id}`, part);
