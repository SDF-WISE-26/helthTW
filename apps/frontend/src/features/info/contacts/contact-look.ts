import { topicTransition } from "../topics/topic-look";
import type { CoverPart } from "../topics/topic-look";

export const groupSurface = "bg-secondary text-secondary-foreground";

export const groupTransition = (id: string, part: CoverPart) =>
  topicTransition(`contacts-${id}`, part);
