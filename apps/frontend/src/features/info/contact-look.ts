import { topicTransition } from "./topic-look";

// No art, but the header keeps the cover's right padding so the title wraps like a topic header's.
export const groupSurface = "bg-secondary text-secondary-foreground";

// Same parts as a topic card, prefixed so a group and a topic never share a name.
export const groupTransition = (id: string, part: Parameters<typeof topicTransition>[1]) =>
  topicTransition(`contacts-${id}`, part);
