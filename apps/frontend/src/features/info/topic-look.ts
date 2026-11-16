const surfaces = ["bg-topic-1", "bg-topic-2", "bg-topic-3", "bg-topic-4"];

export const topicSurface = (index: number) => surfaces[index % surfaces.length];

export const topicTransition = (id: string, part: "card" | "title" | "meta" | "art") => ({
  viewTransitionName: `topic-${part}-${id}`,
  ...(part === "card" && { viewTransitionClass: "topic-card" }),
});
