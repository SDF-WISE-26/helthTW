import { topicTransition } from "./topic-look";

export const groupSurface = "bg-secondary pr-5 text-secondary-foreground";

// Same parts as a topic card, prefixed so a group and a topic never share a name.
export const groupTransition = (id: string, part: Parameters<typeof topicTransition>[1]) =>
  topicTransition(`contacts-${id}`, part);
