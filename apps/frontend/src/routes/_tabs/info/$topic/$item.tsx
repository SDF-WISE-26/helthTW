import { createFileRoute } from "@tanstack/react-router";
import { content } from "@/features/info/content";
import { ItemSheet } from "@/features/info/item-sheet";

export const Route = createFileRoute("/_tabs/info/$topic/$item")({
  component: Item,
});

function Item() {
  const { topic, item } = Route.useParams();
  // An unknown topic already shows not found behind, no sheet on top of it.
  if (!content.topics.some((t) => t.id === topic)) return null;
  return <ItemSheet key={item} topicId={topic} itemId={item} />;
}
