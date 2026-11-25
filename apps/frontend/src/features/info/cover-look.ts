// The coloured cards on /info and the header they turn into, shared by topics and contact groups.
// Art sits on the right, so the text keeps clear of it.
// Balanced lines, so a long title wraps evenly instead of leaving a stray word or breaking at a hyphen.
export const coverCard =
  "relative flex min-h-28 flex-col justify-center gap-1 overflow-hidden rounded-2xl py-4 pr-32 pl-5 text-balance text-white transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]";

export const coverHeader =
  "relative flex min-h-36 shrink-0 flex-col justify-end gap-1 overflow-hidden rounded-2xl py-5 pr-32 pl-5 text-balance text-white";

const topicSurfaces = ["bg-topic-1", "bg-topic-2", "bg-topic-3", "bg-topic-4"];

export const topicSurface = (index: number) => topicSurfaces[index % topicSurfaces.length];

export const groupSurface = "bg-secondary text-secondary-foreground";

type CoverPart = "card" | "title" | "meta" | "art";

export const topicTransition = (id: string, part: CoverPart) => ({
  viewTransitionName: `topic-${part}-${id}`,
  ...(part === "card" && { viewTransitionClass: "topic-card" }),
});

// Same parts as a topic card, prefixed so a group and a topic never share a name.
export const groupTransition = (id: string, part: CoverPart) =>
  topicTransition(`contacts-${id}`, part);
