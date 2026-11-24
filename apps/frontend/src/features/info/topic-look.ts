const surfaces = ["bg-topic-1", "bg-topic-2", "bg-topic-3", "bg-topic-4"];

export const topicSurface = (index: number) => surfaces[index % surfaces.length];

// The coloured cards on /info and the header they turn into. Art sits on the right, so the text keeps clear of it.
// Balanced lines, so a long title wraps evenly instead of leaving a stray word or breaking at a hyphen.
export const coverCard =
  "relative flex min-h-28 flex-col justify-center gap-1 overflow-hidden rounded-2xl py-4 pr-32 pl-5 text-balance text-white transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]";

export const coverHeader =
  "relative flex min-h-36 shrink-0 flex-col justify-end gap-1 overflow-hidden rounded-2xl py-5 pr-32 pl-5 text-balance text-white";

export const topicTransition = (id: string, part: "card" | "title" | "meta" | "art") => ({
  viewTransitionName: `topic-${part}-${id}`,
  ...(part === "card" && { viewTransitionClass: "topic-card" }),
});
