import { topicTransition } from "./topic-look";

// First letter of the first two words, e.g. "Berliner Krisendienst" → "BK".
export const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export const contactCount = (count: number) => `${count} ${count === 1 ? "Kontakt" : "Kontakte"}`;

// All groups share the one topic colour no topic uses, so contacts read as their own family.
export const groupSurface = "bg-topic-4";

// Same parts as a topic card, prefixed so a group and a topic never share a name.
export const groupTransition = (id: string, part: Parameters<typeof topicTransition>[1]) =>
  topicTransition(`contacts-${id}`, part);
